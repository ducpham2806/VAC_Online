-- Test Bếp Quê & Xưởng (migration 0009, 17 mục C2). Chạy bằng: npm run test:sql
-- Mỗi bước sai sẽ RAISE và psql dừng (ON_ERROR_STOP).
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

-- ---------------------------------------------------------------------------
-- Tiện ích test
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS t;
GRANT USAGE ON SCHEMA t TO PUBLIC;

CREATE OR REPLACE FUNCTION t.expect_error(p_sql TEXT, p_like TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE v_failed BOOLEAN := FALSE; v_msg TEXT;
BEGIN
  BEGIN
    EXECUTE p_sql;
  EXCEPTION WHEN OTHERS THEN
    v_failed := TRUE; v_msg := SQLERRM;
  END;
  IF NOT v_failed THEN RAISE EXCEPTION 'Mong đợi lỗi "%" nhưng chạy thành công: %', p_like, p_sql; END IF;
  IF v_msg NOT LIKE p_like THEN RAISE EXCEPTION 'Sai thông báo lỗi. Mong đợi "%", nhận "%"', p_like, v_msg; END IF;
END $$;

CREATE OR REPLACE FUNCTION t.eq(p_actual ANYELEMENT, p_expected ANYELEMENT, p_label TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF p_actual IS DISTINCT FROM p_expected THEN
    RAISE EXCEPTION 'FAIL %: mong đợi %, nhận %', p_label, p_expected, p_actual;
  END IF;
END $$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA t TO PUBLIC;

-- 2 người chơi: A (Bắc), B (Nam, khách ẩn danh)

-- 2 người chơi: C (miền Trung) và D
INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('c0000000-0000-0000-0000-00000000000c', '{"player_name":"Bep C","region":"CENTRAL"}', FALSE),
  ('d0000000-0000-0000-0000-00000000000d', '{"player_name":"Bep D","region":"NORTH"}', TRUE)
ON CONFLICT DO NOTHING;
UPDATE public.profiles SET level = 20, xp = 0, gold = 5000 WHERE id = 'c0000000-0000-0000-0000-00000000000c';

-- 1. anon bị chặn; GĐ1 bị chặn
SET ROLE anon;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''[]''::jsonb)', '%permission denied%');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', 'c0000000-0000-0000-0000-00000000000c', false);
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', 'Bếp Quê & Xưởng mở ở Giai đoạn 2%');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', 'Bếp Quê & Xưởng mở ở Giai đoạn 2%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_01"]''::jsonb)', 'Bếp Quê & Xưởng mở ở Giai đoạn 2%');
RESET ROLE;

-- Mở GĐ2 tạm thời cho test (cuối file trả về 1)
CREATE OR REPLACE FUNCTION public.app_game_stage() RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 2 $$;

-- 2. Xây xưởng
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_01'')', '%mở cùng Lán Thợ%');
SELECT t.expect_error('SELECT public.rpc_build_machine(''PROD_01'')', 'Không có xưởng này%');
RESET ROLE;
UPDATE public.profiles SET level = 3 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', 'Cần đạt Cấp 4%');
RESET ROLE;
UPDATE public.profiles SET level = 20, gold = 100 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', 'Cần 350 Xu Vàng%');
RESET ROLE;
UPDATE public.profiles SET gold = 5000 WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.eq((public.rpc_build_machine('MAC_02')->'profile'->>'gold')::INT, 4650, 'xây Bếp Củi −350');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 25, 'xây Bếp Củi +25 XP');
SELECT t.eq(public.rpc_get_my_farm()->'machines'->'MAC_02'->>'craft_item_id', NULL, 'Bếp Củi rảnh');
SELECT t.expect_error('SELECT public.rpc_build_machine(''MAC_02'')', 'Đã có%');

-- 3. Nấu
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_03'', ''PROD_05'')', 'Hãy xây xưởng này trước%');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_05'')', 'Món này không nấu ở xưởng này%');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_01'')', 'Còn thiếu: 3 Lúa%');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_02'')', 'Chưa biết công thức%');
RESET ROLE;
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_01', 5),
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_06', 1),
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_03', 1),
  ('c0000000-0000-0000-0000-00000000000c', 'CROP_04', 2)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = EXCLUDED.quantity;
SET ROLE authenticated;
CREATE TEMP TABLE snap AS SELECT public.rpc_start_craft('MAC_02', 'PROD_01') AS s;
SELECT t.eq((SELECT (s->'inventory'->>'CROP_01')::INT FROM snap), 2, 'nấu Cơm trừ 3 Lúa');
SELECT t.eq((SELECT (s->'machines'->'MAC_02'->>'ready_at')::BIGINT - (s->>'server_now')::BIGINT FROM snap), 270000::BIGINT,
  'miền Trung: 5 phút × 0,9 = 270 giây');
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_02'', ''PROD_01'')', 'Xưởng đang nấu%');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', 'Còn 5 phút%');
RESET ROLE;
UPDATE public.player_machines SET craft_ready_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'c0000000-0000-0000-0000-00000000000c' AND machine_id = 'MAC_02';
SET ROLE authenticated;
SELECT t.eq((public.rpc_collect_craft('MAC_02')->'inventory'->>'PROD_01')::INT, 1, 'lấy món +1 Cơm');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 28, 'lấy Cơm +3 XP');
SELECT t.expect_error('SELECT public.rpc_collect_craft(''MAC_02'')', 'Xưởng chưa nấu món nào%');

-- 4. Ăn
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', 'Năng lượng đang đầy%');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''CROP_01'')', 'Món này không ăn được%');
RESET ROLE;
UPDATE public.profiles SET stamina = 10, stamina_updated_at = NOW() WHERE id = 'c0000000-0000-0000-0000-00000000000c';
SET ROLE authenticated;
SELECT t.eq((public.rpc_eat_dish('PROD_01')->'profile'->>'stamina')::INT, 15, 'ăn Cơm +5 ⚡');
SELECT t.expect_error('SELECT public.rpc_eat_dish(''PROD_01'')', 'Kho không còn%');

-- 5. Nồi Đất
SELECT t.expect_error('SELECT public.rpc_cook_pot(''[]''::jsonb)', 'Bỏ từ 1 đến 4%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''{}''::jsonb)', 'Bỏ từ 1 đến 4%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_01","CROP_01","CROP_04","CROP_04","CROP_06"]''::jsonb)', 'Bỏ từ 1 đến 4%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_07"]''::jsonb)', 'Kho không đủ 1 Đậu Tương%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_06","CROP_03"]''::jsonb)', 'Có mùi rồi%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_04","CROP_04"]''::jsonb)', 'Chưa thành món%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_01","CROP_01"]''::jsonb)', 'Có mùi rồi%');
CREATE TEMP TABLE pot AS SELECT public.rpc_cook_pot('["CROP_04","CROP_06","CROP_03"]'::jsonb) AS s;
SELECT t.eq((SELECT s->'recipes' FROM pot), '["PROD_02"]'::jsonb, 'khám phá Khoai Ngô Nướng');
SELECT t.eq((SELECT (s->'profile'->>'gems')::INT FROM pot), 60, 'khám phá +10 💎');
SELECT t.eq((SELECT (s->'profile'->>'xp')::INT FROM pot), 78, 'khám phá +50 XP');
SELECT t.eq((SELECT (s->'inventory'->>'CROP_06')::INT FROM pot), 1, 'Nồi Đất không tiêu nguyên liệu');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_06","CROP_04","CROP_03"]''::jsonb)', 'Đã biết món%');
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_01","CROP_01"]''::jsonb)', 'Có mùi rồi%');
SELECT t.eq((public.rpc_start_craft('MAC_02', 'PROD_02')->'inventory'->>'CROP_04')::INT, 1, 'nấu món vừa khám phá');

-- 6. Cà Phê Muối khóa tới Đợt 4
SELECT public.rpc_build_machine('MAC_04');
RESET ROLE;
INSERT INTO public.player_recipes (user_id, product_id) VALUES ('c0000000-0000-0000-0000-00000000000c', 'PROD_C01');
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_start_craft(''MAC_04'', ''PROD_C01'')', '%mở ở Đợt 4%');
RESET ROLE;

-- 7. Cách ly: D không thấy / không ghi được dữ liệu của C; D chưa có Bếp Củi
SELECT set_config('request.jwt.claim.sub', 'd0000000-0000-0000-0000-00000000000d', false);
SET ROLE authenticated;
SELECT t.eq((SELECT count(*) FROM public.player_machines)::INT, 0, 'D không thấy xưởng của C');
SELECT t.eq((SELECT count(*) FROM public.player_recipes)::INT, 0, 'D không thấy công thức của C');
SELECT t.eq(public.rpc_get_my_farm()->'machines', '{}'::jsonb, 'snapshot D không có xưởng');
SELECT t.expect_error('INSERT INTO public.player_machines (user_id, machine_id) VALUES (''d0000000-0000-0000-0000-00000000000d'', ''MAC_02'')', '%');
UPDATE public.player_machines SET craft_item_id = NULL; -- RLS: không có policy UPDATE → 0 dòng bị đổi (kiểm bên dưới)
SELECT t.expect_error('SELECT public.rpc_cook_pot(''["CROP_01"]''::jsonb)', 'Hãy xây Bếp Củi%');
SELECT t.expect_error('SELECT public._recipe_known(''d0000000-0000-0000-0000-00000000000d'', ''PROD_01'')', '%permission denied%');
RESET ROLE;
SELECT t.eq((SELECT craft_item_id FROM public.player_machines WHERE user_id = 'c0000000-0000-0000-0000-00000000000c' AND machine_id = 'MAC_02'),
  'PROD_02', 'xưởng của C không bị D đổi');

-- Trả GĐ về 1 như production
CREATE OR REPLACE FUNCTION public.app_game_stage() RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 1 $$;
SELECT set_config('request.jwt.claim.sub', '', false);

\o
\echo 'kitchen.test.sql: TẤT CẢ PASS'
