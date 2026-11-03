-- Test vật nuôi / thủy sản nuôi nhiều lứa (migration 0010). Chạy bằng: npm run test:sql.
-- Luật đối chiếu: src/domain/farm.ts harvestCycles / harvest + farm.test.ts.
\set ON_ERROR_STOP 1
\set QUIET 1
\o /dev/null

INSERT INTO auth.users (id, raw_user_meta_data, is_anonymous) VALUES
  ('e0000000-0000-0000-0000-00000000000e', '{"player_name":"Test E","region":"CENTRAL"}', FALSE)
ON CONFLICT DO NOTHING;

-- Số lứa khớp domain
SELECT t.eq(public._harvest_cycles('CROP_01'), 1, 'cây trồng 1 lứa');
SELECT t.eq(public._harvest_cycles('ANI_01'), 5, 'Gà 5 lứa');
SELECT t.eq(public._harvest_cycles('AQUA_01'), 3, 'Cá Rô 3 lứa');
SELECT t.eq(public._harvest_cycles('ANI_07'), 15, 'Bò Sữa 15 lứa');
SELECT t.eq((SELECT count(*) FROM public.master_catalog m WHERE m.category IN ('ANIMAL', 'AQUA')
  AND m.base_sell_gold * m.yield_count * public._harvest_cycles(m.id) < 1.5 * m.buy_cost_gold)::INT, 0,
  'mọi vật nuôi / thủy sản lãi ≥ 50% vốn khi nuôi hết lứa');

SELECT set_config('request.jwt.claim.sub', 'e0000000-0000-0000-0000-00000000000e', false);
SET ROLE authenticated;
SELECT t.expect_error('SELECT public._harvest_cycles(''ANI_01'')', '%permission denied%');
RESET ROLE;
UPDATE public.profiles SET level = 3 WHERE id = 'e0000000-0000-0000-0000-00000000000e';
SET ROLE authenticated;
SELECT t.eq((public.rpc_plant(0, 2, 'AQUA_01')->'tiles'->0->>'harvests_left')::INT, 3, 'thả Cá Rô: 3 lứa');
SELECT t.eq((public.rpc_get_my_farm()->'profile'->>'gold')::INT, 2470, 'trả tiền giống 1 lần');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second', watered = TRUE
WHERE user_id = 'e0000000-0000-0000-0000-00000000000e';
SET ROLE authenticated;
SELECT t.eq((public.rpc_harvest(0, 2)->'tiles'->0->>'harvests_left')::INT, 2, 'thu lứa 1: còn 2 lứa, con giống ở lại');
SELECT t.eq((public.rpc_get_my_farm()->'tiles'->0->>'watered')::BOOLEAN, FALSE, 'lứa mới chưa tưới');
-- Cá Rô 20 phút / lứa (miền Trung không có buff cho thủy sản)
SELECT t.eq(
  ((public.rpc_get_my_farm()->'tiles'->0->>'mature_at')::BIGINT - (public.rpc_get_my_farm()->>'server_now')::BIGINT) BETWEEN 1199000 AND 1200000,
  TRUE, 'lứa mới chín sau 20 phút');
SELECT t.expect_error('SELECT public.rpc_harvest(0, 2)', 'Chưa chín%');
SELECT t.expect_error('SELECT public.rpc_plant(0, 2, ''AQUA_01'')', '%đang có cây%');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second' WHERE user_id = 'e0000000-0000-0000-0000-00000000000e';
SET ROLE authenticated;
SELECT public.rpc_harvest(0, 2);
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second' WHERE user_id = 'e0000000-0000-0000-0000-00000000000e';
SET ROLE authenticated;
SELECT t.eq(jsonb_array_length(public.rpc_harvest(0, 2)->'tiles'), 0, 'lứa cuối: dọn ô');
SELECT t.eq((public.rpc_get_my_farm()->'inventory'->>'AQUA_01')::INT, 3, '3 lứa × 1 Cá Rô');
SELECT t.eq((public.rpc_get_my_farm()->'counters'->>'HARVEST:AQUA_01')::INT, 3, 'mỗi lứa +1 bộ đếm thu hoạch');
-- Cây trồng vẫn 1 lứa
SELECT t.eq((public.rpc_plant(0, 0, 'CROP_01')->'tiles'->0->>'harvests_left')::INT, 1, 'gieo Lúa: 1 lứa');
RESET ROLE;
UPDATE public.farm_entities SET mature_at = NOW() - INTERVAL '1 second' WHERE user_id = 'e0000000-0000-0000-0000-00000000000e';
SET ROLE authenticated;
SELECT t.eq(jsonb_array_length(public.rpc_harvest(0, 0)->'tiles'), 0, 'thu Lúa: dọn ô như cũ');
RESET ROLE;

\o
\echo 'livestock.test.sql: TẤT CẢ PASS'
