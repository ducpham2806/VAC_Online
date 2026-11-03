-- =============================================================================
-- 0015 — CÔNG TẮC GIAI ĐOẠN PHÁT HÀNH Ở DB (chuẩn bị mở GĐ2) — Additive-Only, chạy lại an toàn. Chạy SAU 0014.
-- -----------------------------------------------------------------------------
-- Trước đây app_game_stage() viết cứng `SELECT 1` (0004) → muốn mở GĐ mới phải viết lại hàm.
-- Từ đây đọc từ bảng app_config (mặc định 1, migration KHÔNG tự mở GĐ2). Mở GĐ2 cùng lúc deploy client
-- VITE_GAME_STAGE=2:
--   UPDATE public.app_config SET value = '2', updated_at = NOW() WHERE key = 'game_stage';
-- Quay lại GĐ1 nếu có sự cố: đặt lại value = '1'. Client không ghi được bảng này (chỉ đọc).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "App config readable" ON public.app_config;
CREATE POLICY "App config readable" ON public.app_config FOR SELECT USING (true);
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.app_config FROM PUBLIC, anon, authenticated;

INSERT INTO public.app_config (key, value) VALUES ('game_stage', '1') ON CONFLICT (key) DO NOTHING;

-- Giai đoạn đang mở (1..6). Giá trị lạ / thiếu → 1.
CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$
  SELECT COALESCE((
    SELECT CASE WHEN value ~ '^[1-6]$' THEN value::INT END FROM public.app_config WHERE key = 'game_stage'
  ), 1);
$$;
GRANT EXECUTE ON FUNCTION public.app_game_stage() TO anon, authenticated;
