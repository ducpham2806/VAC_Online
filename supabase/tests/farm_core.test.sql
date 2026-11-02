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
-- 0007: chưa tưới / chưa thu hoạch thì chưa nhận được Chương 1
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH1'', ''EMP'')', 'Chưa hoàn thành: 💧 Tưới nước Giếng Làng (0/1)');
SELECT t.eq(public.rpc_get_my_farm()->'counters', '{}'::JSONB, 'bộ đếm ban đầu rỗng');
SELECT t.expect_error('SELECT public.rpc_plant(0, 0, ''CROP_01'')', '%đang có cây%');
-- 0006: (4,0) là phân khu ① — nằm trong lưới 5×5 nhưng chưa khai hoang; (5,0) ngoài lưới
SELECT t.expect_error('SELECT public.rpc_plant(5, 0, ''CROP_01'')', 'Ô đất không hợp lệ');
SELECT t.expect_error('SELECT public.rpc_plant(0, 5, ''CROP_01'')', 'Ô đất không hợp lệ');
SELECT t.expect_error('SELECT public.rpc_plant(4, 0, ''CROP_01'')', 'Ô đất chưa khai hoang%');
SELECT t.expect_error('SELECT public.rpc_harvest(0, 3)', 'Ô đất chưa khai hoang%');
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
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'WATER')::INT, 1, 'tưới nước +1 bộ đếm WATER');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH1'', ''EMP'')', 'Chưa hoàn thành: 🌾 Thu hoạch Lúa Nước (0/1)');
SELECT t.expect_error('SELECT public.rpc_water(0, 0)', '%đã được tưới%');
SELECT t.expect_error('SELECT public.rpc_apply_mud(0, 0)', '%hết Bùn%');
RESET ROLE;

UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'a0000000-0000-0000-0000-00000000000a';

SET ROLE authenticated;
SELECT t.eq((public.rpc_harvest(0, 0)->'inventory'->>'CROP_01')::INT, 2, 'thu hoạch vào kho 2 Lúa');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'gold')::INT, 2498, 'thu hoạch KHÔNG cộng vàng');
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'HARVEST:CROP_01')::INT, 1, 'thu hoạch +1 bộ đếm HARVEST:CROP_01');
SELECT t.expect_error('SELECT public.rpc_water(0, 0)', '%chưa gieo%');
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'WATER')::INT, 1, 'tưới thất bại không tăng bộ đếm');
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
-- 0006: khai hoang xong thì phân khu ① (4,0) gieo được, ② (4,1) vẫn khóa
SELECT t.eq(jsonb_array_length(public.rpc_plant(4, 0, 'CROP_01')->'tiles') > 0, TRUE, 'gieo được ở phân khu mới (4,0)');
SELECT t.expect_error('SELECT public.rpc_plant(4, 1, ''CROP_01'')', 'Ô đất chưa khai hoang%');
-- Mở tới phân khu ⑨ = ô thứ 21 (0,4) hàng Ao mới: gieo được, thu hoạch tăng bùn
RESET ROLE;
UPDATE public.profiles SET wild_plots_unlocked = 21, pond_mud_counter = 0 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
SELECT public.rpc_plant(0, 4, 'CROP_01');
SELECT t.expect_error('SELECT public.rpc_plant(1, 4, ''CROP_01'')', 'Ô đất chưa khai hoang%');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second'
WHERE user_id = 'a0000000-0000-0000-0000-00000000000a' AND tile_x = 0 AND tile_y = 4;
SET ROLE authenticated;
SELECT t.eq((public.rpc_harvest(0, 4)->'profile'->>'pond_mud_counter')::INT, 1, 'thu hoạch ở ô Ao hàng 5 tăng bùn');
SELECT t.eq((SELECT count(*) FROM public.farm_entities WHERE tile_x = 4 AND tile_y = 0)::INT, 1, 'ô (4,0) vẫn còn cây của A');
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
-- Chương 2 (Lv.3): A đã vét ao + bón bùn ở trên → đủ mục tiêu
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'DREDGE')::INT >= 1 AND (public.rpc_get_my_farm()->'counters'->>'APPLY_MUD')::INT >= 1,
  TRUE, 'vét ao / bón bùn có bộ đếm');
RESET ROLE;
UPDATE public.profiles SET level = 3 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
SELECT t.eq(public.rpc_claim_story_quest('Q_CH2', 'EMP')->'quests'->>'Q_CH2', 'EMP', 'Chương 2 nhận được khi đủ vét bùn + bón bùn');
RESET ROLE;
UPDATE public.profiles SET level = 2 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
SET ROLE authenticated;
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
SELECT t.eq((SELECT count(*) FROM public.player_counters)::INT, 0, 'RLS: không thấy bộ đếm của A');
SELECT t.expect_error('SELECT public._bump_counter(''b0000000-0000-0000-0000-00000000000b'', ''WATER'', 99)', '%permission denied%');
SELECT t.expect_error($$INSERT INTO public.player_counters (user_id, counter, value) VALUES ('b0000000-0000-0000-0000-00000000000b', 'WATER', 99)$$, '%row-level security%');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH1'', ''EMP'')', 'Chưa hoàn thành%');
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


-- ---------------------------------------------------------------------------
-- 6. Migration 0008: analytics phía server (chỉ service_role đọc được)
-- ---------------------------------------------------------------------------
RESET ROLE;
DELETE FROM public.player_active_days;  -- dữ liệu test tạm, không phải migration
DELETE FROM public.economy_daily;
SELECT set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-00000000000a', false);
SET ROLE authenticated;
SELECT public.rpc_get_my_farm();
SELECT public.rpc_get_my_farm();
RESET ROLE;
SELECT t.eq((SELECT count(*) FROM public.player_active_days WHERE user_id = 'a0000000-0000-0000-0000-00000000000a')::INT, 1,
  'vào game 2 lần trong ngày → 1 ngày hoạt động');
UPDATE public.profiles SET gold = 5000, level = 5 WHERE id = 'a0000000-0000-0000-0000-00000000000a';
DELETE FROM public.economy_daily;
SET ROLE authenticated;
SELECT public.rpc_plant(1, 1, 'CROP_01');
RESET ROLE;
SELECT t.eq((SELECT gold_out FROM public.economy_daily WHERE user_id = 'a0000000-0000-0000-0000-00000000000a')::INT, 2,
  'gieo -2 vàng → gold_out 2');
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES ('a0000000-0000-0000-0000-00000000000a', 'CROP_01', 2)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = 2;
SET ROLE authenticated;
SELECT public.rpc_sell_to_htx('CROP_01', 2);
SELECT t.expect_error('SELECT count(*) FROM public.analytics_economy', '%permission denied%');
SELECT t.expect_error('SELECT count(*) FROM public.analytics_retention', '%permission denied%');
SELECT t.expect_error('SELECT count(*) FROM public.analytics_funnel', '%permission denied%');
SELECT t.expect_error('SELECT count(*) FROM public.economy_daily', '%permission denied%');
SELECT t.expect_error('SELECT count(*) FROM public.player_active_days', '%permission denied%');
SELECT t.expect_error('SELECT public._log_economy_delta()', '%permission denied%');
RESET ROLE;
SELECT t.eq((SELECT gold_in FROM public.economy_daily WHERE user_id = 'a0000000-0000-0000-0000-00000000000a')::INT, 8,
  'bán HTX +8 vàng → gold_in 8');
SET ROLE service_role;
SELECT t.eq((SELECT sink_source_pct FROM public.analytics_economy WHERE day = public._vn_today()), 25.0::NUMERIC,
  'Sink/Source = 2/8 = 25%');
SELECT t.eq((SELECT players FROM public.analytics_funnel WHERE step_no = 2)::INT, 1, 'phễu: 1 người đã tưới');
SELECT t.eq((SELECT players FROM public.analytics_funnel WHERE step_no = 4)::INT, 1, 'phễu: 1 người nhận Chương 1');
SELECT t.eq((SELECT sum(new_players) FROM public.analytics_retention)::INT, 2, 'retention: 2 hồ sơ (A, B)');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', '', false);
SET ROLE anon;
SELECT t.expect_error('SELECT count(*) FROM public.analytics_economy', '%permission denied%');
RESET ROLE;

\o
\echo 'farm_core.test.sql: TẤT CẢ PASS'
