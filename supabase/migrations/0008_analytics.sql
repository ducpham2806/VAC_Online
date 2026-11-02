-- =============================================================================
-- 0008 — ANALYTICS PHÍA SERVER (retention D1/D7, phễu tân thủ, Sources/Sinks thực tế)
-- Additive-Only, chạy lại an toàn. Chạy SAU 0007.
-- -----------------------------------------------------------------------------
-- Không có code theo dõi ở client: server tự ghi ngày hoạt động (rpc_get_my_farm) và biến động
-- 🪙/💎 (trigger trên profiles). Client KHÔNG đọc/ghi được các bảng & view dưới đây — chỉ
-- service_role (Dashboard, `npm run supabase -- report`).
-- Giới hạn: Khách chơi offline (không có phiên Supabase) không được đo.
-- =============================================================================

-- 1. Ngày hoạt động của người chơi (giờ Việt Nam) → retention
CREATE TABLE IF NOT EXISTS public.player_active_days (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  PRIMARY KEY (user_id, day)
);
ALTER TABLE public.player_active_days ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.player_active_days FROM PUBLIC, anon, authenticated;

-- 2. Dòng tiền theo người / ngày → Sources (in) vs Sinks (out)
CREATE TABLE IF NOT EXISTS public.economy_daily (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  gold_in BIGINT NOT NULL DEFAULT 0,
  gold_out BIGINT NOT NULL DEFAULT 0,
  gems_in BIGINT NOT NULL DEFAULT 0,
  gems_out BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
ALTER TABLE public.economy_daily ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.economy_daily FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public._vn_today()
RETURNS DATE LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$ SELECT (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE; $$;

-- Trigger: chỉ GHI CHÉP biến động số dư, không chặn hay sửa giao dịch.
CREATE OR REPLACE FUNCTION public._log_economy_delta()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_dg BIGINT := NEW.gold::BIGINT - OLD.gold::BIGINT;
  v_dm BIGINT := NEW.gems::BIGINT - OLD.gems::BIGINT;
BEGIN
  INSERT INTO public.economy_daily (user_id, day, gold_in, gold_out, gems_in, gems_out)
  VALUES (NEW.id, public._vn_today(), GREATEST(v_dg, 0), GREATEST(-v_dg, 0), GREATEST(v_dm, 0), GREATEST(-v_dm, 0))
  ON CONFLICT (user_id, day) DO UPDATE SET
    gold_in = public.economy_daily.gold_in + EXCLUDED.gold_in,
    gold_out = public.economy_daily.gold_out + EXCLUDED.gold_out,
    gems_in = public.economy_daily.gems_in + EXCLUDED.gems_in,
    gems_out = public.economy_daily.gems_out + EXCLUDED.gems_out;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER trg_profiles_economy_log
AFTER UPDATE OF gold, gems ON public.profiles
FOR EACH ROW
WHEN (OLD.gold IS DISTINCT FROM NEW.gold OR OLD.gems IS DISTINCT FROM NEW.gems)
EXECUTE FUNCTION public._log_economy_delta();

-- 3. Vào game / quay lại tab → ghi ngày hoạt động (thân chép từ 0004, thêm 1 dòng INSERT)
CREATE OR REPLACE FUNCTION public.rpc_get_my_farm()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE v_uid UUID := public._require_uid();
BEGIN
  PERFORM public._lock_profile(v_uid);
  PERFORM public._regen_stamina(v_uid);
  INSERT INTO public.player_active_days (user_id, day) VALUES (v_uid, public._vn_today())
  ON CONFLICT DO NOTHING;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- 4. View báo cáo (chỉ service_role)
-- Retention theo ngày tạo hồ sơ (cohort, giờ VN): % quay lại đúng ngày D1 / D7.
CREATE OR REPLACE VIEW public.analytics_retention WITH (security_invoker = true) AS
WITH cohort AS (
  SELECT id, (created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE AS cohort_day FROM public.profiles
)
SELECT
  c.cohort_day,
  COUNT(*)::INT AS new_players,
  COUNT(*) FILTER (WHERE EXISTS (
    SELECT 1 FROM public.player_active_days a WHERE a.user_id = c.id AND a.day = c.cohort_day + 1))::INT AS d1_players,
  COUNT(*) FILTER (WHERE EXISTS (
    SELECT 1 FROM public.player_active_days a WHERE a.user_id = c.id AND a.day = c.cohort_day + 7))::INT AS d7_players,
  ROUND(100.0 * COUNT(*) FILTER (WHERE EXISTS (
    SELECT 1 FROM public.player_active_days a WHERE a.user_id = c.id AND a.day = c.cohort_day + 1)) / COUNT(*), 1) AS d1_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE EXISTS (
    SELECT 1 FROM public.player_active_days a WHERE a.user_id = c.id AND a.day = c.cohort_day + 7)) / COUNT(*), 1) AS d7_pct
FROM cohort c
GROUP BY c.cohort_day;

-- Phễu tân thủ (toàn bộ người chơi có hồ sơ server), theo thứ tự vòng chơi GĐ1.
CREATE OR REPLACE VIEW public.analytics_funnel WITH (security_invoker = true) AS
SELECT step_no, step, players FROM (
  SELECT 1 AS step_no, 'Tạo hồ sơ' AS step, (SELECT COUNT(*) FROM public.profiles) AS players
  UNION ALL SELECT 2, 'Tưới nước', (SELECT COUNT(DISTINCT user_id) FROM public.player_counters WHERE counter = 'WATER' AND value > 0)
  UNION ALL SELECT 3, 'Thu hoạch', (SELECT COUNT(DISTINCT user_id) FROM public.player_counters WHERE counter LIKE 'HARVEST:%' AND value > 0)
  UNION ALL SELECT 4, 'Nhận Chương 1', (SELECT COUNT(*) FROM public.quest_claims WHERE quest_id = 'Q_CH1')
  UNION ALL SELECT 5, 'Có thu nhập 🪙 (bán HTX / thưởng)', (SELECT COUNT(DISTINCT user_id) FROM public.economy_daily WHERE gold_in > 0)
  UNION ALL SELECT 6, 'Vét bùn ao', (SELECT COUNT(DISTINCT user_id) FROM public.player_counters WHERE counter = 'DREDGE' AND value > 0)
  UNION ALL SELECT 7, 'Khai hoang ≥ 1 lần', (SELECT COUNT(*) FROM public.profiles WHERE wild_plots_unlocked > 12)
  UNION ALL SELECT 8, 'Nhận Chương 2', (SELECT COUNT(*) FROM public.quest_claims WHERE quest_id = 'Q_CH2')
) s;

-- Dòng tiền theo ngày: tỉ lệ Sink/Source (mục tiêu 94–112% theo 02_MASTER_ECONOMY).
CREATE OR REPLACE VIEW public.analytics_economy WITH (security_invoker = true) AS
SELECT
  day,
  COUNT(*)::INT AS active_payers,
  SUM(gold_in)::BIGINT AS gold_sources,
  SUM(gold_out)::BIGINT AS gold_sinks,
  CASE WHEN SUM(gold_in) > 0 THEN ROUND(100.0 * SUM(gold_out) / SUM(gold_in), 1) END AS sink_source_pct,
  SUM(gems_in)::BIGINT AS gems_sources,
  SUM(gems_out)::BIGINT AS gems_sinks
FROM public.economy_daily
GROUP BY day;

REVOKE ALL ON public.analytics_retention FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.analytics_funnel FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.analytics_economy FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.analytics_retention, public.analytics_funnel, public.analytics_economy TO service_role;
GRANT SELECT ON public.player_active_days, public.economy_daily TO service_role;

REVOKE ALL ON FUNCTION public._log_economy_delta() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._vn_today() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._vn_today() TO service_role;
REVOKE ALL ON FUNCTION public.rpc_get_my_farm() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_get_my_farm() TO authenticated;
