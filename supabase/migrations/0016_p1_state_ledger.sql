-- 0016 · P1-8 (QD-89, ADR-002): lưu online bản thử `?p1`.
--  - farm_states: trạng thái nông trại 1 dòng/người (jsonb + version, khóa lạc quan).
--  - ledger: sổ cái vàng / ngọc / ⚡ chỉ thêm, chặn số dư âm.
--  - _commit_farm_state: ghi trạng thái + sổ cái trong 1 transaction; chỉ service_role (Edge Function `apply-actions`).
--  - playtest_events: nhật ký chơi thử ẩn danh P1-12 (LT-13); người chơi chỉ thêm dòng của mình, không đọc được.
--  - playtest_logs: gom sự kiện theo người chơi đúng dạng `PlaytestLog` cho `npm run playtest:report`; chỉ service_role.
-- Chỉ tạo mới, không đụng bảng MVP (KY-31). Chạy lại an toàn.

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
  CREATE POLICY farm_states_read_own ON public.farm_states FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY ledger_read_own ON public.ledger FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
REVOKE ALL ON public.farm_states, public.ledger FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.farm_states, public.ledger TO authenticated;

-- Ghi trạng thái + sổ cái, khóa lạc quan theo version: trả version mới, hoặc NULL khi version đã đổi (người gọi đọc lại, thử lại).
-- Hàm nội bộ nhận user id vì chỉ Edge Function (service_role) gọi, danh tính lấy từ JWT đã kiểm ở đó.
CREATE OR REPLACE FUNCTION public._commit_farm_state(
  p_user uuid, p_expected_version bigint, p_state jsonb, p_schema_version int, p_ledger jsonb
) RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_new bigint;
BEGIN
  IF p_user IS NULL OR p_state IS NULL OR jsonb_typeof(p_state) <> 'object' THEN
    RAISE EXCEPTION 'commit: tham số không hợp lệ';
  END IF;
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
    IF v_new IS NULL THEN RETURN NULL; END IF;
  END IF;
  INSERT INTO ledger (user_id, currency, delta, balance_after, reason, ref)
  SELECT p_user, r->>'currency', (r->>'delta')::bigint, (r->>'balance_after')::bigint, r->>'reason', coalesce(r->>'ref', '')
  FROM jsonb_array_elements(coalesce(p_ledger, '[]'::jsonb)) AS r;
  RETURN v_new;
END $$;
REVOKE ALL ON FUNCTION public._commit_farm_state(uuid, bigint, jsonb, int, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._commit_farm_state(uuid, bigint, jsonb, int, jsonb) TO service_role;

CREATE TABLE IF NOT EXISTS public.playtest_events (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
  player text NOT NULL CHECK (char_length(player) BETWEEN 1 AND 64),
  session int NOT NULL CHECK (session BETWEEN 0 AND 100000),
  t timestamptz NOT NULL,
  type text NOT NULL CHECK (type IN ('SESSION', 'ACTION', 'LEVEL', 'TUTORIAL')),
  name text CHECK (name IS NULL OR char_length(name) <= 40),
  value int,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS playtest_events_player_t ON public.playtest_events (player, t);
CREATE INDEX IF NOT EXISTS playtest_events_user ON public.playtest_events (user_id);
ALTER TABLE public.playtest_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY playtest_events_insert_own ON public.playtest_events FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
REVOKE ALL ON public.playtest_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.playtest_events TO authenticated;
GRANT USAGE ON SEQUENCE public.playtest_events_id_seq TO authenticated;

-- Mỗi người chơi một dòng `log` dạng PlaytestLog (src/game/slice/playtest.ts): t tính bằng ms.
CREATE OR REPLACE VIEW public.playtest_logs WITH (security_invoker = true) AS
SELECT player,
       jsonb_build_object(
         'v', 1, 'player', player, 'session', max(session), 'sent', 0,
         'events', jsonb_agg(
           jsonb_strip_nulls(jsonb_build_object(
             't', (extract(epoch FROM t) * 1000)::bigint, 's', session, 'type', type, 'name', name, 'value', value))
           ORDER BY t, id)
       ) AS log
FROM public.playtest_events
GROUP BY player;
REVOKE ALL ON public.playtest_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.playtest_logs TO service_role;
