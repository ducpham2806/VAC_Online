-- Test xưởng nghề + đồ thợ (migration 0013). Chạy bằng: npm run test:sql. Luật: cooking.ts + workers.ts.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('a2000000-0000-0000-0000-0000000000a2', '{"player_name":"Test K","region":"NORTH"}', FALSE)
ON CONFLICT DO NOTHING;
SELECT t.eq((SELECT string_agg(item_id || ':' || qty, ',' ORDER BY item_id) FROM public.recipe_ingredients WHERE product_id = 'CRAFT_01'), 'CROP_19:1,CROP_24:1', 'Nón Lá = Sen + Dừa Xiêm');
SELECT t.eq((SELECT machine_id FROM public.master_catalog WHERE id = 'CRAFT_02'), 'MAC_08', 'Áo Cánh Nâu ở Khung Cửi');

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 2 $$;
SELECT set_config('request.jwt.claim.sub', '', false);
SET ROLE anon;
SELECT t.expect_error('SELECT public.rpc_equip_worker_gear(''WORK_01'', ''CRAFT_01'')', '%permission denied%');
RESET ROLE;

SELECT set_config('request.jwt.claim.sub', 'a2000000-0000-0000-0000-0000000000a2', false);
SET ROLE authenticated;
SELECT public.rpc_get_my_farm();
RESET ROLE;
UPDATE public.profiles SET level = 15, gold = 10000 WHERE id = 'a2000000-0000-0000-0000-0000000000a2';
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES
  ('a2000000-0000-0000-0000-0000000000a2', 'CROP_24', 1), ('a2000000-0000-0000-0000-0000000000a2', 'CROP_19', 1)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = EXCLUDED.quantity;
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_01'')', '🛖 [%] mở ở bản sau!');
SELECT t.eq((public.rpc_build_machine('MAC_07')->'profile'->>'gold')::INT, 10000 - 2200, 'xây Đan Lát 2.200 vàng');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_07'', ''PROD_01'')', '⚠️ Món này không nấu ở xưởng này!');
-- Đồ thợ biết sẵn công thức: nấu ngay không cần Nồi Đất
SELECT t.eq(public.rpc_start_craft('MAC_07', 'CRAFT_01')->'machines'->'MAC_07'->>'craft_item_id', 'CRAFT_01', 'làm Nón Lá');
SELECT t.eq((public.rpc_get_my_farm()->'inventory' ? 'CROP_24'), FALSE, 'trừ Dừa Xiêm');
RESET ROLE;
UPDATE public.player_machines SET ready_at = NOW() - INTERVAL '1 second' WHERE user_id = 'a2000000-0000-0000-0000-0000000000a2';
SET ROLE authenticated;
SELECT t.eq((public.rpc_collect_craft('MAC_07')->'inventory'->>'CRAFT_01')::INT, 1, 'lấy Nón Lá vào Kho');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''CRAFT_01'')', '⚠️ Món này không ăn được!');

-- Cấp đồ
SELECT t.expect_error('SELECT public.rpc_equip_worker_gear(''WORK_01'', ''PROD_01'')', '⚠️ Đây không phải đồ bảo hộ%');
SELECT t.expect_error('SELECT public.rpc_equip_worker_gear(''WORK_01'', ''CRAFT_02'')', '⚠️ Kho chưa có [%]%');
SELECT t.expect_error('SELECT public.rpc_equip_worker_gear(''WORK_01'', ''CRAFT_01'')', '👷 Hãy thuê%');
SELECT public.rpc_hire_worker('WORK_01');
SELECT t.eq(public.rpc_equip_worker_gear('WORK_01', 'CRAFT_01')->'workers'->'WORK_01'->>'gear_id', 'CRAFT_01', 'cấp Nón Lá cho Chú Tư');
SELECT t.eq((public.rpc_get_my_farm()->'inventory' ? 'CRAFT_01'), FALSE, 'trừ Nón Lá trong Kho');
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'EQUIP_GEAR')::INT, 1, 'bộ đếm Ch.7');
SELECT t.eq(public.rpc_claim_story_quest('Q_CH7', 'EMP')->'quests'->>'Q_CH7', 'EMP', 'Ch.7 nhận được khi đã cấp đồ');
RESET ROLE;

-- Độ No hao chậm 25% khi mặc đồ; hết hạn đồ thì hao bình thường
UPDATE public.hired_workers SET belly = 100, last_synced_at = NOW() - INTERVAL '1 day', gear_expires_at = NOW() + INTERVAL '2 days'
WHERE user_id = 'a2000000-0000-0000-0000-0000000000a2';
SET ROLE authenticated;
SELECT t.eq(ROUND((public.rpc_get_my_farm()->'workers'->'WORK_01'->>'belly')::NUMERIC), 55::NUMERIC, '1 ngày có đồ: −45');
RESET ROLE;
UPDATE public.hired_workers SET belly = 100, last_synced_at = NOW() - INTERVAL '1 day', gear_expires_at = NOW() - INTERVAL '12 hours'
WHERE user_id = 'a2000000-0000-0000-0000-0000000000a2';
SET ROLE authenticated;
SELECT t.eq(ROUND((public.rpc_get_my_farm()->'workers'->'WORK_01'->>'belly')::NUMERIC, 1), 47.5::NUMERIC, '12 giờ có đồ (−22,5) + 12 giờ không (−30)');
RESET ROLE;

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 1 $$;

\o
\echo 'crafts.test.sql: TẤT CẢ PASS'
