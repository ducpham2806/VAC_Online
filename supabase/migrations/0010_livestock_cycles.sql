-- =============================================================================
-- 0010 — VẬT NUÔI / THỦY SẢN NUÔI NHIỀU LỨA (S5a) — Additive-Only, chạy lại an toàn. Chạy SAU 0009.
-- -----------------------------------------------------------------------------
-- PO duyệt 2026-11-03 (17 mục C3): trước đây mọi ANIMAL / AQUA lỗ mỗi lứa (vd Gà mua 40🪙, bán 14🪙 × 1).
-- Từ đây mua con giống 1 lần, thu N lứa: N = ⌈1,5 × giá giống ÷ (giá bán × sản lượng)⌉, tối thiểu 2.
-- Cây trồng giữ 1 lứa. Ô đang có từ trước nhận harvests_left = 1 (giữ đúng luật cũ).
-- Bản sao của src/domain/farm.ts (harvestCycles, harvest, growMs) — sửa một nơi thì sửa cả hai.
-- Thân rpc_plant chép từ 0004, rpc_harvest từ 0007, _farm_snapshot từ 0009; chỉ thêm phần nhiều lứa.
-- =============================================================================

ALTER TABLE public.farm_entities ADD COLUMN IF NOT EXISTS harvests_left INT NOT NULL DEFAULT 1;

-- Số lứa của 1 lần gieo/thả (farm.ts harvestCycles; LIVESTOCK_RETURN = 1,5, MIN = 2).
CREATE OR REPLACE FUNCTION public._harvest_cycles(p_item_id TEXT)
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN m.category NOT IN ('ANIMAL', 'AQUA') OR m.base_sell_gold * m.yield_count <= 0 THEN 1
    ELSE GREATEST(2, CEIL(1.5 * m.buy_cost_gold / (m.base_sell_gold * m.yield_count)::NUMERIC)::INT)
  END
  FROM public.master_catalog m WHERE m.id = p_item_id;
$$;

-- Thời gian 1 lứa (ms), miền Bắc: cây CROP −10% (farm.ts growMs).
CREATE OR REPLACE FUNCTION public._grow_ms(p_item_id TEXT, p_region TEXT)
RETURNS BIGINT LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$
  SELECT ROUND(GREATEST(1, m.time_minutes) * 60000
               * CASE WHEN p_region = 'NORTH' AND m.category = 'CROP' THEN 0.9 ELSE 1 END)::BIGINT
  FROM public.master_catalog m WHERE m.id = p_item_id;
$$;

-- Ảnh chụp nông trại: như 0009, ô đất thêm 'harvests_left'.
CREATE OR REPLACE FUNCTION public._farm_snapshot(p_uid UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
DECLARE
  v_p public.profiles%ROWTYPE;
  v_ms CONSTANT NUMERIC := 1000;
BEGIN
  SELECT * INTO v_p FROM public.profiles WHERE id = p_uid;
  RETURN jsonb_build_object(
    'server_now', FLOOR(EXTRACT(EPOCH FROM NOW()) * v_ms),
    'game_stage', public.app_game_stage(),
    'profile', jsonb_build_object(
      'username', v_p.username,
      'gender', v_p.gender,
      'region', v_p.region,
      'level', v_p.level,
      'xp', v_p.xp,
      'gold', v_p.gold,
      'gems', v_p.gems,
      'stamina', v_p.stamina,
      'max_stamina', v_p.max_stamina,
      'stamina_updated_at', FLOOR(EXTRACT(EPOCH FROM v_p.stamina_updated_at) * v_ms),
      'feng_shui_score', v_p.feng_shui_score,
      'neighbor_points', v_p.neighbor_points,
      'wild_plots_unlocked', v_p.wild_plots_unlocked,
      'pond_mud_counter', v_p.pond_mud_counter,
      'rookie_days_claimed', v_p.rookie_days_claimed,
      'rookie_claimed_today', COALESCE(v_p.rookie_last_claim_on = (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE, FALSE),
      'account_bonus_claimed', v_p.account_bonus_claimed,
      'created_as_guest', v_p.created_as_guest
    ),
    'inventory', COALESCE((
      SELECT jsonb_object_agg(item_id, quantity) FROM public.inventories
      WHERE user_id = p_uid AND quantity > 0
    ), '{}'::jsonb),
    'tiles', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'x', tile_x,
        'y', tile_y,
        'item_id', entity_id,
        'planted_at', FLOOR(EXTRACT(EPOCH FROM planted_at) * v_ms),
        'mature_at', FLOOR(EXTRACT(EPOCH FROM mature_at) * v_ms),
        'watered', watered,
        'mud_applied', alluvial_mud_applied,
        'is_golden', is_golden,
        'total_yield', total_yield,
        'remaining_yield', remaining_yield,
        'harvests_left', harvests_left
      ) ORDER BY tile_y, tile_x)
      FROM public.farm_entities WHERE user_id = p_uid
    ), '[]'::jsonb),
    'quests', COALESCE((
      SELECT jsonb_object_agg(quest_id, choice) FROM public.quest_claims WHERE user_id = p_uid
    ), '{}'::jsonb),
    'counters', COALESCE((
      SELECT jsonb_object_agg(counter, value) FROM public.player_counters WHERE user_id = p_uid
    ), '{}'::jsonb),
    'machines', COALESCE((
      SELECT jsonb_object_agg(machine_id, jsonb_build_object(
        'craft_item_id', craft_item_id,
        'ready_at', FLOOR(EXTRACT(EPOCH FROM ready_at) * v_ms)
      )) FROM public.player_machines WHERE user_id = p_uid
    ), '{}'::jsonb),
    'recipes', COALESCE((
      SELECT jsonb_agg(product_id ORDER BY discovered_at, product_id) FROM public.player_recipes WHERE user_id = p_uid
    ), '[]'::jsonb)
  );
END;
$$;


CREATE OR REPLACE FUNCTION public.rpc_plant(p_x INT, p_y INT, p_item_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_e public.farm_entities%ROWTYPE;
  v_item public.master_catalog%ROWTYPE;
  v_ms BIGINT;
  v_zone TEXT;
BEGIN
  v_e := public._lock_tile(v_uid, p_x, p_y);
  IF v_e.id IS NOT NULL THEN
    RAISE EXCEPTION 'Ô này đang có cây/vật nuôi rồi!';
  END IF;

  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_item_id;
  IF NOT FOUND OR v_item.category NOT IN ('CROP', 'TREE', 'MUTANT_CROP', 'ANIMAL', 'AQUA') THEN
    RAISE EXCEPTION 'Giống không hợp lệ';
  END IF;
  IF v_item.region <> 'ALL' AND v_item.region <> v_p.region THEN
    RAISE EXCEPTION '[%] là đặc sản độc quyền miền khác!', v_item.name_vn;
  END IF;
  IF COALESCE(v_item.unlock_wave, 99) > LEAST(5, GREATEST(1, public.app_game_stage())) THEN
    RAISE EXCEPTION '[%] thuộc Đợt % — chưa mở!', v_item.name_vn, v_item.unlock_wave;
  END IF;
  IF v_item.unlock_level > v_p.level THEN
    RAISE EXCEPTION '[%] mở ở Lv.%', v_item.name_vn, v_item.unlock_level;
  END IF;
  IF v_p.gold < v_item.buy_cost_gold THEN
    RAISE EXCEPTION 'Không đủ Xu Vàng để mua giống/vật nuôi này!';
  END IF;

  -- Miền Bắc: cây CROP chín nhanh hơn 10% (src/domain/farm.ts growMs)
  v_ms := public._grow_ms(v_item.id, v_p.region);
  v_zone := CASE WHEN v_item.category = 'MUTANT_CROP' THEN 'CROP' ELSE v_item.category END;

  UPDATE public.profiles SET gold = gold - v_item.buy_cost_gold, updated_at = NOW() WHERE id = v_uid;
  INSERT INTO public.farm_entities (
    user_id, tile_x, tile_y, zone_type, entity_id, planted_at, mature_at,
    watered, alluvial_mud_applied, is_golden, total_yield, remaining_yield, harvests_left
  ) VALUES (
    v_uid, p_x, p_y, v_zone, v_item.id, NOW(), NOW() + v_ms * INTERVAL '1 millisecond',
    FALSE, FALSE, FALSE, v_item.yield_count, v_item.yield_count, public._harvest_cycles(v_item.id)
  );
  RETURN public._farm_snapshot(v_uid);
END;
$$;


CREATE OR REPLACE FUNCTION public.rpc_harvest(p_x INT, p_y INT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_e public.farm_entities%ROWTYPE := public._lock_tile(v_uid, p_x, p_y);
  v_item public.master_catalog%ROWTYPE;
  v_qty INT;
BEGIN
  IF v_e.id IS NULL THEN RAISE EXCEPTION 'Ô này đang trống!'; END IF;
  IF NOW() < v_e.mature_at THEN RAISE EXCEPTION 'Chưa chín, hãy chờ thêm hoặc tưới nước!'; END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = v_e.entity_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không xác định được nông sản!'; END IF;

  -- Vào Kho: Hoàng Kim ×3; miền Nam +1 với thủy sản (src/domain/farm.ts harvest)
  v_qty := v_item.yield_count * CASE WHEN v_e.is_golden THEN 3 ELSE 1 END
           + CASE WHEN v_p.region = 'SOUTH' AND v_item.category = 'AQUA' THEN 1 ELSE 0 END;
  PERFORM public._add_inventory(v_uid, v_item.id, v_qty);
  PERFORM public._apply_xp(v_uid, v_item.xp_reward);
  IF v_item.category = 'AQUA' OR public._is_pond_plot(p_x, p_y) THEN
    UPDATE public.profiles SET pond_mud_counter = LEAST(10, pond_mud_counter + 1) WHERE id = v_uid;
  END IF;
  -- 0010: còn lứa thì con giống ở lại, bắt đầu lứa mới; hết lứa mới dọn ô (src/domain/farm.ts harvest).
  IF COALESCE(v_e.harvests_left, 1) > 1 THEN
    UPDATE public.farm_entities
    SET planted_at = NOW(),
        mature_at = NOW() + public._grow_ms(v_item.id, v_p.region) * INTERVAL '1 millisecond',
        watered = FALSE, alluvial_mud_applied = FALSE, is_golden = FALSE,
        harvests_left = harvests_left - 1
    WHERE id = v_e.id;
  ELSE
    DELETE FROM public.farm_entities WHERE id = v_e.id;
  END IF;
  PERFORM public._bump_counter(v_uid, 'HARVEST:' || v_item.id, 1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;


REVOKE ALL ON FUNCTION public._harvest_cycles(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._grow_ms(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY['public.rpc_plant(INT, INT, TEXT)', 'public.rpc_harvest(INT, INT)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
