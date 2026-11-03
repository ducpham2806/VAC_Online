-- Test công tắc giai đoạn (migration 0015). Chạy cuối cùng: các test khác tự đặt GĐ bằng CREATE OR REPLACE.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

-- Các test trước đã ghi đè hàm; nạp lại định nghĩa thật của 0015.
\i supabase/migrations/0015_app_config_stage.sql
\o /dev/null
SELECT t.eq(public.app_game_stage(), 1, 'mặc định GĐ1');
UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';
SELECT t.eq(public.app_game_stage(), 2, 'mở GĐ2 bằng 1 lệnh UPDATE');
SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-00000000000a', false);
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->>'game_stage')::INT, 2, 'snapshot báo GĐ2');
SELECT t.expect_error($$UPDATE public.app_config SET value = '6' WHERE key = 'game_stage'$$, '%permission denied%');
SELECT t.expect_error($$INSERT INTO public.app_config (key, value) VALUES ('x', 'y')$$, '%permission denied%');
RESET ROLE;
UPDATE public.app_config SET value = 'abc' WHERE key = 'game_stage';
SELECT t.eq(public.app_game_stage(), 1, 'giá trị lạ → GĐ1');
-- Chạy lại migration không ghi đè giá trị đang đặt
UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';
\i supabase/migrations/0015_app_config_stage.sql
\o /dev/null
SELECT t.eq(public.app_game_stage(), 2, 'chạy lại 0015 giữ nguyên GĐ đang mở');
UPDATE public.app_config SET value = '1' WHERE key = 'game_stage';

\o
\echo 'stage_switch.test.sql: TẤT CẢ PASS'
