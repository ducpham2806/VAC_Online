-- Test Lán Thợ (migration 0011). Chạy bằng: npm run test:sql. Luật đối chiếu: src/domain/workers.ts.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('f0000000-0000-0000-0000-00000000000f', '{"player_name":"Test F","region":"CENTRAL"}', FALSE),
  ('f1000000-0000-0000-0000-0000000000f1', '{"player_name":"Test G","region":"NORTH"}', TRUE)
ON CONFLICT DO NOTHING;

-- 1. anon bị chặn; GĐ1 không thuê được
SELECT set_config('request.jwt.claim.sub', '', false);
SET ROLE anon;
SELECT t.expect_error('SELECT public.rpc_hire_worker(''WORK_01'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_serve_lodge_meal(''PROD_01'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_claim_worker_pantry()', '%permission denied%');
RESET ROLE;

SELECT set_config('request.jwt.claim.sub', 'f0000000-0000-0000-0000-00000000000f', false);
SET ROLE authenticated;
SELECT public.rpc_get_my_farm();
RESET ROLE;
UPDATE public.profiles SET level = 15, gold = 2000 WHERE id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_hire_worker(''WORK_01'')', '🔒 [%] về làng ở Giai đoạn 2!');
SELECT t.expect_error('SELECT public.rpc_serve_lodge_meal(''PROD_01'')', '🔒 Lán Thợ mở ở Giai đoạn 2!');
SELECT t.expect_error('SELECT public._tick_workers(''f0000000-0000-0000-0000-00000000000f'')', '%permission denied%');
RESET ROLE;

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 2 $$;

-- 2. Thuê
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_hire_worker(''CROP_01'')', '⚠️ Không có thợ này!');
SELECT t.expect_error('SELECT public.rpc_hire_worker(''WORK_03'')', '🔒 [%] về làng ở Giai đoạn 3!');
SELECT t.eq((public.rpc_hire_worker('WORK_01')->'profile'->>'gold')::INT, 2000 - 528, 'thuê Chú Tư 528 vàng');
SELECT t.eq((public.rpc_get_my_farm()->'workers'->'WORK_01'->>'belly')::NUMERIC >= 99.99, TRUE, 'thợ mới no 100');
SELECT t.eq(public.rpc_get_my_farm()->'worker_pantry', '{}'::JSONB, 'Giỏ Thợ rỗng');
SELECT public.rpc_hire_worker('WORK_01');
SELECT t.eq((SELECT contract_expires_at - NOW() BETWEEN INTERVAL '5 days 23 hours' AND INTERVAL '6 days'
  FROM public.hired_workers WHERE worker_code = 'WORK_01'), TRUE, 'gia hạn cộng nối 3 + 3 ngày');
RESET ROLE;
UPDATE public.profiles SET gold = 700 WHERE id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_hire_worker(''WORK_02'')', '⚠️ Cần 726 🪙%');
SELECT t.expect_error($$INSERT INTO public.hired_workers (user_id, worker_code, contract_expires_at) VALUES ('f0000000-0000-0000-0000-00000000000f', 'WORK_02', NOW() + INTERVAL '9 days')$$, '%row-level security%');
RESET ROLE;
UPDATE public.profiles SET level = 14, gold = 5000 WHERE id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_hire_worker(''WORK_02'')', '🔒 Cần đạt Cấp 15%');
RESET ROLE;

-- 3. Thu ô chín ≥ 5 phút vào Giỏ Thợ, không gieo lại, không XP; Chú Tư không đụng vật nuôi
UPDATE public.profiles SET level = 15, xp = 0 WHERE id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT public.rpc_plant(0, 0, 'CROP_01');
SELECT public.rpc_plant(1, 0, 'CROP_01');
SELECT public.rpc_plant(2, 0, 'ANI_01');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '6 minutes', watered = TRUE
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f' AND tile_x IN (0, 2);
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '2 minutes', watered = TRUE
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f' AND tile_x = 1;
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'worker_pantry'->>'CROP_01')::INT, 2, 'thợ thu Lúa chín 6 phút vào Giỏ');
SELECT t.eq(jsonb_array_length(public.rpc_get_my_farm()->'tiles'), 2, 'không gieo lại; còn Lúa mới chín 2 phút + Gà');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 0, 'thợ thu không cộng XP');
SELECT t.eq((public.rpc_get_my_farm()->'worker_pantry' ? 'ANI_01'), FALSE, 'Chú Tư không thu vật nuôi');
SELECT t.eq((public.rpc_claim_worker_pantry()->'inventory'->>'CROP_01')::INT, 2, 'thu Giỏ về Kho');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'gold')::INT, 5000 - 2 - 2 - 40, 'thu Giỏ không ra vàng');
SELECT t.expect_error('SELECT public.rpc_claim_worker_pantry()', '🧺 Giỏ Thợ đang trống!');

-- 4. Tưới: ô chưa tưới được thợ tưới khi tick
SELECT t.eq((public.rpc_plant(3, 0, 'CROP_04')->'tiles'->2->>'watered')::BOOLEAN, FALSE, 'vừa gieo: chưa tưới (rpc_plant không tick)');
SELECT public.rpc_get_my_farm();
SELECT t.eq((SELECT watered FROM public.farm_entities WHERE tile_x = 3 AND tile_y = 0), TRUE, 'tick lần sau: thợ tưới');
RESET ROLE;

-- 5. Đói: Độ No dưới 35 thì nghỉ; dọn món lên Bàn Ăn → tự ăn tới ≥ 85
UPDATE public.hired_workers SET belly = 40, last_synced_at = NOW() - INTERVAL '4 hours'
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f';
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES ('f0000000-0000-0000-0000-00000000000f', 'PROD_03', 1)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = 1;
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_serve_lodge_meal(''CROP_01'')', '⚠️ Chỉ dọn được món ăn%');
SELECT t.expect_error('SELECT public.rpc_serve_lodge_meal(''PROD_01'')', '⚠️ Kho không còn [%]%');
SELECT t.eq((public.rpc_serve_lodge_meal('PROD_03')->'profile'->>'gold') IS NOT NULL, TRUE, 'dọn Canh Cá Rô');
SELECT t.eq((SELECT lodge_meals FROM public.profiles WHERE id = 'f0000000-0000-0000-0000-00000000000f'), 3, 'Canh Cá Rô 16⚡ → 3 suất');
-- 40 − 60/24×4 = 30 < 35 → ăn 3 suất: 30 → 55 → 80 → 100
SELECT t.eq(ROUND((public.rpc_get_my_farm()->'workers'->'WORK_01'->>'belly')::NUMERIC), 100::NUMERIC, 'đói ăn tới no');
SELECT t.eq((public.rpc_get_my_farm()->>'lodge_meals')::INT, 0, 'ăn hết 3 suất');
RESET ROLE;

-- 6. Cô Năm thu nhiều lứa vật nuôi; hết hợp đồng thì ngừng
UPDATE public.profiles SET gold = 5000 WHERE id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT public.rpc_hire_worker('WORK_02');
RESET ROLE;
UPDATE public.hired_workers SET last_synced_at = NOW() - INTERVAL '10 hours', belly = 100
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f' AND worker_code = 'WORK_02';
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '10 hours' + INTERVAL '15 minutes', harvests_left = 5
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f' AND entity_id = 'ANI_01';
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'worker_pantry'->>'ANI_01')::INT, 5, 'Cô Năm thu đủ 5 lứa Gà trong 10 giờ');
SELECT t.eq((SELECT count(*) FROM public.farm_entities WHERE entity_id = 'ANI_01')::INT, 0, 'hết lứa: dọn ô');
RESET ROLE;
UPDATE public.hired_workers SET contract_expires_at = NOW() - INTERVAL '1 hour', last_synced_at = NOW() - INTERVAL '2 hours'
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f';
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '10 minutes', watered = TRUE
WHERE user_id = 'f0000000-0000-0000-0000-00000000000f';
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'worker_pantry' ? 'CROP_04'), FALSE, 'hết hợp đồng trước khi chín thì không thu');

-- 7. Cô lập người chơi
SELECT set_config('request.jwt.claim.sub', 'f1000000-0000-0000-0000-0000000000f1', false);
SELECT t.eq(public.rpc_get_my_farm()->'workers', '{}'::JSONB, 'G không thấy thợ của F');
SELECT t.eq((SELECT count(*) FROM public.hired_workers)::INT, 0, 'RLS: không đọc thợ của F');
RESET ROLE;

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 1 $$;

\o
\echo 'workers.test.sql: TẤT CẢ PASS'
