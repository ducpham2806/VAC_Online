-- P0-4 (ADR-002): trạng thái nông trại 1 dòng/người + sổ cái tiền tệ. DB MỚI — không áp lên DB MVP.
CREATE TABLE IF NOT EXISTS public.farm_states (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  version bigint NOT NULL DEFAULT 0,
  schema_version int NOT NULL DEFAULT 1,
  state jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ledger (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  at timestamptz NOT NULL DEFAULT now(),
  currency text NOT NULL CHECK (currency IN ('GOLD', 'GEM', 'XU', 'STAMINA')),
  delta bigint NOT NULL,
  balance_after bigint NOT NULL CHECK (balance_after >= 0),
  reason text NOT NULL,
  ref text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS ledger_user_at ON public.ledger (user_id, at);

ALTER TABLE public.farm_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY farm_states_read_own ON public.farm_states FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY ledger_read_own ON public.ledger FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
REVOKE INSERT, UPDATE, DELETE ON public.farm_states, public.ledger FROM PUBLIC, anon, authenticated;

-- Ghi trạng thái + sổ cái trong 1 transaction, khóa lạc quan theo version. Chỉ service_role (Edge Function) gọi.
CREATE OR REPLACE FUNCTION public._commit_farm_state(
  p_user uuid, p_expected_version bigint, p_state jsonb, p_schema_version int, p_ledger jsonb
) RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_new bigint;
BEGIN
  IF p_expected_version = 0 THEN
    INSERT INTO farm_states (user_id, version, schema_version, state)
    VALUES (p_user, 1, p_schema_version, p_state)
    ON CONFLICT (user_id) DO NOTHING;
    IF NOT FOUND THEN RETURN NULL; END IF;
    v_new := 1;
  ELSE
    UPDATE farm_states SET version = version + 1, state = p_state, schema_version = p_schema_version, updated_at = now()
    WHERE user_id = p_user AND version = p_expected_version
    RETURNING version INTO v_new;
    IF v_new IS NULL THEN RETURN NULL; END IF; -- xung đột: người gọi đọc lại và thử lại
  END IF;
  INSERT INTO ledger (user_id, currency, delta, balance_after, reason, ref)
  SELECT p_user, r->>'currency', (r->>'delta')::bigint, (r->>'balance_after')::bigint, r->>'reason', coalesce(r->>'ref', '')
  FROM jsonb_array_elements(coalesce(p_ledger, '[]'::jsonb)) AS r;
  RETURN v_new;
END $$;
REVOKE EXECUTE ON FUNCTION public._commit_farm_state(uuid, bigint, jsonb, int, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._commit_farm_state(uuid, bigint, jsonb, int, jsonb) TO service_role;
