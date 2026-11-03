-- Test mục tiêu Chương 3 & 6 (migration 0012 + quest_catalog_seed). Chạy bằng: npm run test:sql.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('a1000000-0000-0000-0000-0000000000a1', '{"player_name":"Test Q","region":"NORTH"}', FALSE)
ON CONFLICT DO NOTHING;
SELECT t.eq((SELECT min_level FROM public.quest_catalog WHERE id = 'Q_CH6'), 13, 'Ch.6 Lv.13 (khớp 01)');
SELECT t.eq((SELECT min_level FROM public.quest_catalog WHERE id = 'Q_CH7'), 15, 'Ch.7 Lv.15 (khớp 01)');

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 2 $$;
SELECT set_config('request.jwt.claim.sub', 'a1000000-0000-0000-0000-0000000000a1', false);
SET ROLE authenticated;
SELECT public.rpc_get_my_farm();
RESET ROLE;
UPDATE public.profiles SET level = 13, gold = 5000 WHERE id = 'a1000000-0000-0000-0000-0000000000a1';
INSERT INTO public.inventories (user_id, item_id, quantity) VALUES ('a1000000-0000-0000-0000-0000000000a1', 'CROP_01', 3)
ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = 3;
SET ROLE authenticated;
-- Chương 3
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH3'', ''EMP'')', 'Chưa hoàn thành: 🍲 Xây Bếp Củi Quê Mẹ (0/1)');
SELECT public.rpc_build_machine('MAC_02');
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'BUILD:MAC_02')::INT, 1, 'xây Bếp Củi +1 BUILD:MAC_02');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH3'', ''EMP'')', 'Chưa hoàn thành: 🍚 Nấu xong 1 món ở Bếp Quê (0/1)');
SELECT public.rpc_start_craft('MAC_02', 'PROD_01');
RESET ROLE;
UPDATE public.player_machines SET ready_at = NOW() - INTERVAL '1 second' WHERE user_id = 'a1000000-0000-0000-0000-0000000000a1';
SET ROLE authenticated;
SELECT public.rpc_collect_craft('MAC_02');
SELECT t.eq(public.rpc_claim_story_quest('Q_CH3', 'EMP')->'quests'->>'Q_CH3', 'EMP', 'Ch.3 nhận được khi đủ xây + nấu');
-- Chương 6
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH6'', ''EMP'')', 'Chưa hoàn thành: 👨‍🌾 Thuê Chú Tư Cày (0/1)');
SELECT public.rpc_hire_worker('WORK_01');
SELECT t.expect_error('SELECT public.rpc_claim_story_quest(''Q_CH6'', ''EMP'')', 'Chưa hoàn thành: 🍚 Dọn 1 món lên Bàn Ăn Chung (0/1)');
SELECT public.rpc_serve_lodge_meal('PROD_01');
SELECT t.eq(public.rpc_claim_story_quest('Q_CH6', 'PRAG')->'quests'->>'Q_CH6', 'PRAG', 'Ch.6 nhận được khi đủ thuê + dọn món');
RESET ROLE;

CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp AS $$ SELECT 1 $$;

\o
\echo 'quests_s5.test.sql: TẤT CẢ PASS'
