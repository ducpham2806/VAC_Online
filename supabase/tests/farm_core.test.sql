-- Test vòng chơi GĐ1 trên server (migration 0004). Chạy bằng: npm run test:sql
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
INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('a0000000-0000-0000-0000-00000000000a', '{"player_name":"Test A","region":"NORTH"}', FALSE),
  ('b0000000-0000-0000-0000-00000000000b', '{"player_name":"Test B","region":"SOUTH"}', TRUE)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 1. anon bị chặn
-- ---------------------------------------------------------------------------
SET ROLE anon;
SELECT t.expect_error('SELECT public.rpc_get_my_farm()', '%permission denied%');
SELECT t.expect_error('SELECT public.rpc_plant(0, 0, ''CROP_01'')', '%permission denied%');
RESET ROLE;

-- authenticated nhưng không có uid
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '', false);
SELECT t.expect_error('SELECT public.rpc_get_my_farm()', 'Cần đăng nhập%');
RESET ROLE;

-- ---------------------------------------------------------------------------
-- 2. Người chơi A: hồ sơ mới, gieo → tưới → chưa chín → chín → thu hoạch → bán
-- ---------------------------------------------------------------------------
SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-00000000000a', false);
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'level')::INT, 1, 'hồ sơ mới Lv.1');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'gold')::INT, 2500, 'hồ sơ mới 2500 vàng');
SELECT t.eq((public.rpc_get_my_farm()->>'game_stage')::INT, 1, 'GĐ1');

SELECT t.eq((public.rpc_plant(0, 0, 'CROP_01')->'profile'->>'gold')::INT, 2498, 'gieo CROP_01 trừ 2 vàng');
SELECT t.expect_error('SELECT public.rpc_plant(0, 0, ''CROP_01'')', '%đang có cây%');
SELECT t.expect_error('SELECT public.rpc_plant(4, 0, ''CROP_01'')', 'Ô đất không hợp lệ');
SELECT t.expect_error('SELECT public.rpc_plant(1, 0, ''CROP_02'')', '%mở ở Lv.2');
SELECT t.expect_error('SELECT public.rpc_plant(1, 0, ''CROP_13'')', '%Đợt 2%');
SELECT t.expect_error('SELECT public.rpc_plant(1, 0, ''CROP_S01'')', '%độc quyền miền khác%');
SELECT t.expect_error('SELECT public.rpc_plant(1, 0, ''PROD_01'')', 'Giống không hợp lệ');
SELECT t.expect_error('SELECT public.rpc_harvest(0, 0)', 'Chưa chín%');

-- Miền Bắc: CROP_01 (2 phút) chín sau 108 giây
SELECT t.eq(
  ((public.rpc_get_my_farm()->'tiles'->0->>'mature_at')::BIGINT - (public.rpc_get_my_farm()->'tiles'->0->>'planted_at')::BIGINT) BETWEEN 107000 AND 108000,
  TRUE, 'buff miền Bắc -10% thời gian');

SELECT t.eq((public.rpc_water(0, 0)->'tiles'->0->>'watered')::BOOLEAN, TRUE, 'tưới nước');
SELECT t.expect_error('SELECT public.rpc_water(0, 0)', '%đã được tưới%');
SELECT t.expect_error('SELECT public.rpc_apply_mud(0, 0)', '%hết Bùn%');
RESET ROLE;

UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'a0000000-0000-0000-0000-00000000000a';

SET ROLE authenticated;
SELECT t.eq((public.rpc_harvest(0, 0)->'inventory'->>'CROP_01')::INT, 2, 'thu hoạch vào kho 2 Lúa');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'gold')::INT, 2498, 'thu hoạch KHÔNG cộng vàng');
SELECT t.eq(jsonb_array_length(public.rpc_get_my_farm()->'tiles'), 0, 'ô đã dọn sau thu hoạch');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 1, 'thu hoạch +1 XP');

SELECT t.eq((public.rpc_sell_to_htx('CROP_01', 2)->'profile'->>'gold')::INT, 2498 + 8, 'bán HTX 2×4 vàng');
SELECT t.expect_error('SELECT public.rpc_sell_to_htx(''CROP_01'', 1)', 'Kho không đủ%');
SELECT t.expect_error('SELECT public.rpc_sell_to_htx(''CROP_01'', 0)', '%không hợp lệ%');

-- Vét ao → bùn → Hoàng Kim / chín ngay
SELECT t.eq((public.rpc_dredge_pond()->'inventory'->>'ITEM_BUN_PHU_SA')::INT, 3, 'vét ao +3 bùn');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'stamina')::INT, 47, 'vét ao -3 năng lượng');
SELECT public.rpc_plant(1, 0, 'CROP_01');
SELECT t.eq((public.rpc_apply_mud(1, 0)->'inventory'->>'ITEM_BUN_PHU_SA')::INT, 2, 'bón bùn trừ 1 xô');
SELECT t.eq(
  (public.rpc_harvest(1, 0)->'inventory'->>'CROP_01')::INT IN (2, 6), TRUE,
  'bón bùn chín ngay; Hoàng Kim ×3');

-- Khai hoang
SELECT t.eq((public.rpc_expand_land()->'profile'->>'wild_plots_unlocked')::INT, 13, 'khai hoang 13/25');
RESET ROLE;
UPDATE public.profiles SET wild_plots_unlocked = 25 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_expand_land()', '%tối đa 25/25%');
RESET ROLE;
UPDATE public.profiles SET wild_plots_unlocked = 12, stamina = 2, stamina_updated_at = NOW()
WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
SELECT t.expect_error('SELECT public.rpc_dredge_pond()', 'Cần 3 Năng lượng%');
RESET ROLE;

-- Năng lượng hồi +1 / 3 phút
UPDATE public.profiles SET stamina = 2, stamina_updated_at = NOW() - INTERVAL '6 minutes 30 seconds'
WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'stamina')::INT, 4, 'hồi 2 năng lượng sau 6.5 phút');

-- ---------------------------------------------------------------------------
-- 3. Lên cấp, nhiệm vụ, quà ngày, thưởng tài khoản
-- ---------------------------------------------------------------------------
RESET ROLE;
UPDATE public.profiles SET level = 1, xp = 0 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
-- Nhiệm vụ chương 1 (Lv.1): +600 vàng +15 ngọc +100 XP → Lv.2 (60) dư 40
SELECT t.eq((public.rpc_claim_story_quest('Q_CH1', 'PRAG')->'profile'->>'level')::INT, 2, 'nhiệm vụ +100 XP lên Lv.2');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'xp')::INT, 40, 'XP dư 40');
SELECT t.eq(public.rpc_get_my_farm()->'quests'->>'Q_CH1', 'PRAG', 'ghi nhận nhánh PRAG');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH1'', ''EMP'')', 'Đã nhận thưởng%');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH2'', ''EMP'')', 'Cần đạt Lv.3%');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH3'', ''EMP'')', 'Chương này chưa mở');

SELECT t.eq((public.rpc_claim_rookie_day()->'profile'->>'rookie_days_claimed')::INT, 1, 'quà ngày 1');
SELECT t.expect_error('SELECT public.rpc_claim_rookie_day()', 'Hôm nay đã nhận%');

SELECT t.eq((public.rpc_claim_account_bonus()->'profile'->>'account_bonus_claimed')::BOOLEAN, TRUE, 'thưởng tài khoản');
SELECT t.expect_error('SELECT public.rpc_claim_account_bonus()', 'Đã nhận thưởng tài khoản%');
SELECT t.expect_error('SELECT public.rpc_set_profile_basics(''X'', ''MALE'', ''SOUTH'')', 'Chỉ đổi được quê hương%');
RESET ROLE;

-- ---------------------------------------------------------------------------
-- 4. Người chơi B (khách ẩn danh, miền Nam): cô lập dữ liệu & luật miền
-- ---------------------------------------------------------------------------
SELECT set_config('request.jwt.claim.sub', 'b0000000-0000-0000-0000-00000000000b', false);
SET ROLE authenticated;
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'created_as_guest')::BOOLEAN, TRUE, 'B là khách');
SELECT t.expect_error('SELECT public.rpc_claim_account_bonus()', 'Hãy liên kết email%');
SELECT t.eq((public.rpc_get_my_farm()->'inventory'), '{}'::JSONB, 'B không thấy kho của A');
SELECT t.eq(jsonb_array_length(public.rpc_get_my_farm()->'tiles'), 0, 'B không thấy ô của A');
SELECT t.eq((public.rpc_set_profile_basics('Út Nam', 'MALE', 'SOUTH')->'profile'->>'region'), 'SOUTH', 'B đặt quê');
SELECT t.eq((SELECT count(*) FROM public.profiles)::INT, 1, 'RLS: chỉ đọc được hồ sơ của mình');
SELECT t.eq((SELECT count(*) FROM public.quest_claims)::INT, 0, 'RLS: không thấy nhiệm vụ của A');
-- RLS không có policy UPDATE: lệnh chạy nhưng không sửa được dòng nào (kiểm ngay bên dưới)
UPDATE public.profiles SET gold = 999999;
SELECT t.expect_error($$INSERT INTO public.inventories (user_id, item_id, quantity) VALUES ('b0000000-0000-0000-0000-00000000000b', 'CROP_01', 999)$$, '%row-level security%');
SELECT t.expect_error($$INSERT INTO public.farm_entities (user_id, tile_x, tile_y, zone_type, entity_id, mature_at) VALUES ('b0000000-0000-0000-0000-00000000000b', 3, 0, 'CROP', 'CROP_01', NOW())$$, '%row-level security%');
RESET ROLE;
SELECT t.eq((SELECT gold FROM public.profiles WHERE id = 'b0000000-0000-0000-0000-00000000000b')::INT, 2500,
  'client không tự sửa được vàng');

-- Miền Nam: thủy sản +1 (AQUA_01 cần Lv.3)
UPDATE public.profiles SET level = 3 WHERE id = 'b0000000-0000-0000-0000-00000000000b';
SET ROLE authenticated;
SELECT public.rpc_plant(0, 2, 'AQUA_01');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'b0000000-0000-0000-0000-00000000000b';
SET ROLE authenticated;
SELECT t.eq((public.rpc_harvest(0, 2)->'inventory'->>'AQUA_01')::INT, 2, 'miền Nam thủy sản 1+1');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'pond_mud_counter')::INT, 1, 'thu thủy sản +1 bùn ao');
RESET ROLE;

-- ---------------------------------------------------------------------------
-- 5. Migration 0005: view hồ sơ công khai tôn trọng RLS; hàm trigger không gọi được qua API
-- ---------------------------------------------------------------------------
SET ROLE authenticated;
SELECT t.eq((SELECT count(*) FROM public.public_profile_cards)::INT, 1, 'view public_profile_cards chỉ thấy hồ sơ của mình');
SELECT t.expect_error('SELECT public.handle_new_user()', '%permission denied%');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', '', false); -- request anon thật không có user id
SET ROLE anon;
SELECT t.eq((SELECT count(*) FROM public.public_profile_cards)::INT, 0, 'anon không đọc được hồ sơ qua view');
RESET ROLE;

\o
\echo 'farm_core.test.sql: TẤT CẢ PASS'
