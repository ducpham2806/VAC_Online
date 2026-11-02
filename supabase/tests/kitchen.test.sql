-- Test Bếp Quê & Xưởng (migration 0009). Chạy bằng: npm run test:sql (sau farm_core.test.sql).
-- Luật đối chiếu: src/domain/cooking.ts + cooking.test.ts.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

-- 2 người chơi mới: C (miền Trung), D (miền Bắc)
INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('c0000000-0000-0000-0000-00000000000c', '{"player_name":"Test C","region":"CENTRAL"}', FALSE),
  ('d0000000-0000-0000-0000-00000000000d', '{"player_name":"Test D","region":"NORTH"}', TRUE)
ON CONFLICT DO NOTHING;

-- Dữ liệu seed đã có
SELECT t.eq((SELECT count(DISTINCT product_id) FROM public.recipe_ingredients)::INT, 14, 'seed 14 món có công thức');
SELECT t.eq((SELECT machine_id FROM public.master_catalog WHERE id = 'PROD_09'), 'MAC_04', 'seed machine_id');

-- ---------------------------------------------------------------------------
-- 1. anon bị chặn; GĐ1 thì mọi RPC Bếp đều khóa
-- ---------------------------------------------------------------------------
SELECT set_config('request.jwt.claim.sub', '', false);
SET ROLE anon;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_01'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01''])', '%permission denied%');
RESET ROLE;

SELECT set_config('request.jwt.claim.sub', 'c0000000-0000-0000-0000-00000000000c', false);
SET ROLE authenticated;
SELECT t.eq(public.rpc_get_my_farm()->'machines', '{}'::JSONB, 'snapshot có machines rỗng');
SELECT t.eq(public.rpc_get_my_farm()->'recipes', '[]'::JSONB, 'snapshot có recipes rỗng');
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', '🔒 Bếp Quê mở ở Giai đoạn 2!');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01''])', '🔒 Bếp Quê mở ở Giai đoạn 2!');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', '🔒 Bếp Quê mở ở Giai đoạn 2!');
SELECT t.expect_error('SELECT public._recipe_lock(''PROD_01'', 60)', '%permission denied%');
RESET ROLE;

-- Giả lập server đã mở GĐ2 (khôi phục ở cuối file)
CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 2 $$;

-- ---------------------------------------------------------------------------
-- 2. Xây xưởng
-- ---------------------------------------------------------------------------
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''CROP_01'')', '⚠️ Không có xưởng này!');
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_01'')', '🛖 [%] mở cùng Lán Thợ ở bản sau!');
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', '🔒 Cần đạt Cấp 4 để xây [%]!');
RESET ROLE;
UPDATE public.profiles SET level = 15, xp = 0, gold = 400 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_03'')', '⚠️ Cần 850 🪙 để xây [%]!');
SELECT t.eq((public.rpc_build_machine('MAC_02')->'profile'->>'gold')::INT, 50, 'xây Bếp Củi -350 vàng');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 25, 'xây Bếp Củi +25 XP');
SELECT t.eq(public.rpc_get_my_farm()->'machines'->'MAC_02'->'craft_item_id', 'null'::JSONB, 'xưởng mới rảnh');
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', '🏭 Đã có [%] rồi!');
-- client không tự chèn xưởng / công thức
SELECT t.expect_error($$INSERT INTO public.player_machines (user_id, machine_id) VALUES ('c0000000-0000-0000-0000-00000000000c', 'MAC_04')$$, '%row-level security%');
SELECT t.expect_error($$INSERT INTO public.player_recipes (user_id, product_id) VALUES ('c0000000-0000-0000-0000-00000000000c', 'PROD_09')$$, '%row-level security%');
SELECT t.expect_error($$INSERT INTO public.recipe_ingredients (product_id, item_id, qty) VALUES ('PROD_01', 'CROP_02', 1)$$, '%row-level security%');
RESET ROLE;

-- ---------------------------------------------------------------------------
-- 3. Nấu Cơm Trắng (mở sẵn) — miền Trung ×0,9; 0⚡; trừ nguyên liệu
-- ---------------------------------------------------------------------------
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_03'', ''PROD_05'')', '🏭 Hãy xây xưởng này trước!');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_05'')', '⚠️ Món này không nấu ở xưởng này!');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''CROP_01'')', '⚠️ Món này không nấu ở xưởng này!');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_01'')', '🧺 Còn thiếu: 3 🌾 Lúa Nước%');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_02'')', '📖 Chưa biết công thức!%');
RESET ROLE;
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_01', 4),
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_09', 2),
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_10', 1),
  ('c0000000-0000-0000-0000-00000000000c', 'ITEM_BUN_PHU_SA', 1)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = EXCLUDED.quantity;
UPDATE public.profiles SET stamina = 30, stamina_updated_at = NOW() WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.eq((public.rpc_start_craft('MAC_02', 'PROD_01')->'inventory'->>'CROP_01')::INT, 1, 'nấu Cơm trừ 3 Lúa');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'stamina')::INT, 30, 'nấu 0 năng lượng');
SELECT t.eq(public.rpc_get_my_farm()->'machines'->'MAC_02'->>'craft_item_id', 'PROD_01', 'xưởng đang nấu Cơm');
-- Cơm Trắng 5 phút × 0,9 = 270 giây
SELECT t.eq(
  ((public.rpc_get_my_farm()->'machines'->'MAC_02'->>'ready_at')::BIGINT - (public.rpc_get_my_farm()->>'server_now')::BIGINT) BETWEEN 269000 AND 270000,
  TRUE, 'miền Trung -10% thời gian nấu');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_01'')', '⏳ Xưởng đang nấu [%]!');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', '⏳ Còn 5 phút nữa mới xong!');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_03'')', '🍲 Xưởng chưa nấu món nào!');
RESET ROLE;
UPDATE public.player_machines SET ready_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'c0000000-0000-0000-0000-00000000000c' AND machine_id = 'MAC_02';
SET ROLE authenticated;
SELECT t.eq((public.rpc_collect_craft('MAC_02')->'inventory'->>'PROD_01')::INT, 1, 'lấy món +1 Cơm vào Kho');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 28, 'lấy Cơm +3 XP');
SELECT t.eq(public.rpc_get_my_farm()->'machines'->'MAC_02'->'craft_item_id', 'null'::JSONB, 'xưởng rảnh lại');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', '🍲 Xưởng chưa nấu món nào!');

-- ---------------------------------------------------------------------------
-- 4. Ăn món hồi ⚡ (không vượt trần, đầy thì từ chối)
-- ---------------------------------------------------------------------------
SELECT t.expect_error('SELECT public.rpc_eat_dish(''CROP_01'')', '⚠️ Món này không ăn được!');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_02'')', '⚠️ Kho không còn [%]!');
SELECT t.eq((public.rpc_eat_dish('PROD_01')->'profile'->>'stamina')::INT, 35, 'ăn Cơm +5 năng lượng');
SELECT t.eq(public.rpc_get_my_farm()->'inventory' ? 'PROD_01', FALSE, 'ăn xong trừ món');
RESET ROLE;
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES ('c0000000-0000-0000-0000-00000000000c', 'PROD_01', 2)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = 2;
UPDATE public.profiles SET stamina = max_stamina - 2, stamina_updated_at = NOW() WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.eq((public.rpc_eat_dish('PROD_01')->'profile'->>'stamina')::INT,
  (SELECT max_stamina FROM public.profiles WHERE id = 'c0000000-0000-0000-0000-00000000000c'), 'ăn không vượt trần');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', '⚡ Năng lượng đang đầy%');
SELECT t.eq((public.rpc_get_my_farm()->'inventory'->>'PROD_01')::INT, 1, 'đầy thì không mất món');

-- ---------------------------------------------------------------------------
-- 5. Nồi Đất: khám phá công thức (không tiêu nguyên liệu), +10💎 +50XP lần đầu
-- ---------------------------------------------------------------------------
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[]::TEXT[])', '🍲 Bỏ từ 1 đến 4 nguyên liệu%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01'',''CROP_01'',''CROP_01'',''CROP_01'',''CROP_01''])', '🍲 Bỏ từ 1 đến 4 nguyên liệu%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_09'',''CROP_09'',''CROP_09''])', '🧺 Kho không đủ 3 %');
-- 1 Lúa nằm trong Bánh Đa / Bánh Cuốn (2 Lúa) → "có mùi"; Bùn Phù Sa không thuộc công thức nào
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01''])', '🍲 Có mùi rồi!%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''ITEM_BUN_PHU_SA''])', '🍲 Chưa thành món.%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_09''])', '🍲 Có mùi rồi!%');
-- Nước Mía (2 Mía) thuộc Quán Nước: khám phá được dù chưa xây MAC_04
SELECT t.eq((public.rpc_cook_pot(ARRAY['CROP_09', 'CROP_09'])->'recipes'), '["PROD_09"]'::JSONB, 'khám phá Nước Mía');
SELECT t.eq((public.rpc_get_my_farm()->'inventory'->>'CROP_09')::INT, 2, 'Nồi Đất không tiêu nguyên liệu');
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_09'', ''CROP_09''])', '📖 Đã biết món [%] rồi%');
-- Cơm Trắng mở sẵn: phối lại không thưởng
RESET ROLE;
UPDATE public.inventories SET quantity = 3 WHERE user_id = 'c0000000-0000-0000-0000-00000000000c' AND item_id = 'CROP_01';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01'', ''CROP_01'', ''CROP_01''])', '📖 Đã biết món [%] rồi%');
-- Cà Phê Muối (Đợt 2 nhưng cần Cà Phê Đợt 4): không khám phá được, nấu thì báo khóa
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_04'', ''PROD_C01'')', '🏭 Hãy xây xưởng này trước!');
RESET ROLE;
UPDATE public.profiles SET gold = 5000 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT public.rpc_build_machine('MAC_04');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_04'', ''PROD_C01'')', '🔒 Cần [%] — mở ở Đợt 4!');
-- Nước Mía mở ở Lv.12: hạ cấp xuống 4 thì báo khóa cấp
RESET ROLE;
UPDATE public.profiles SET level = 4 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_04'', ''PROD_09'')', '🔒 Cần đạt Cấp % để nấu [%]!');
RESET ROLE;
UPDATE public.profiles SET level = 15 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.eq((public.rpc_start_craft('MAC_04', 'PROD_09')->'inventory' ? 'CROP_09'), FALSE, 'nấu Nước Mía (đã khám phá) trừ 2 Mía');
RESET ROLE;

-- Thưởng khám phá: +10 ngọc +50 XP (đo trên D, sạch số liệu)
SELECT set_config('request.jwt.claim.sub', 'd0000000-0000-0000-0000-00000000000d', false);
SET ROLE authenticated;
SELECT public.rpc_get_my_farm();
SELECT t.expect_error('SELECT public.rpc_cook_pot(ARRAY[''CROP_01''])', '🍲 Hãy xây Bếp Củi%');
SELECT t.eq(public.rpc_get_my_farm()->'machines', '{}'::JSONB, 'D không thấy xưởng của C');
SELECT t.eq((SELECT count(*) FROM public.player_machines)::INT, 0, 'RLS: không đọc xưởng của C');
SELECT t.eq((SELECT count(*) FROM public.player_recipes)::INT, 0, 'RLS: không đọc công thức của C');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', '🍲 Xưởng chưa nấu món nào!');
RESET ROLE;
UPDATE public.profiles SET level = 10, xp = 0, gold = 2000, gems = 0 WHERE id = 'd0000000-0000-0000-0000-00000000000d';
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES
  ('d0000000-0000-0000-0000-00000000000d', 'CROP_06', 1),
  ('d0000000-0000-0000-0000-00000000000d', 'CROP_03', 1),
  ('d0000000-0000-0000-0000-00000000000d', 'CROP_04', 1)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = EXCLUDED.quantity;
SET ROLE authenticated;
SELECT public.rpc_build_machine('MAC_02');  -- +25 XP
SELECT t.eq((public.rpc_cook_pot(ARRAY['CROP_04', 'CROP_06', 'CROP_03'])->'profile'->>'gems')::INT, 10, 'khám phá +10 ngọc');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 75, 'khám phá +50 XP (25 xây + 50)');
SELECT t.eq((public.rpc_get_my_farm()->'recipes'), '["PROD_02"]'::JSONB, 'D khám phá Khoai Ngô Nướng (thứ tự bỏ không quan trọng)');
-- Miền Bắc: không có ×0,9 cho chế biến
SELECT public.rpc_start_craft('MAC_02', 'PROD_02');
SELECT t.eq(
  ((public.rpc_get_my_farm()->'machines'->'MAC_02'->>'ready_at')::BIGINT - (public.rpc_get_my_farm()->>'server_now')::BIGINT)
    BETWEEN (SELECT time_minutes * 60000 - 1000 FROM public.master_catalog WHERE id = 'PROD_02')
        AND (SELECT time_minutes * 60000 FROM public.master_catalog WHERE id = 'PROD_02'),
  TRUE, 'miền Bắc nấu đủ thời gian gốc');
RESET ROLE;

-- Khôi phục GĐ1 như migration 0004
CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 1 $$;

\o
\echo 'kitchen.test.sql: TẤT CẢ PASS'
