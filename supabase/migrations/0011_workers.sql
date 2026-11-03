-- =============================================================================
-- 0011 — LÁN THỢ (S5c — M05.1, M05.2, M05.4, M05.5) — Additive-Only, chạy lại an toàn. Chạy SAU 0010.
-- -----------------------------------------------------------------------------
-- Đặc tả + quyết định PO: 17 mục C3. Bản sao của src/domain/workers.ts (hireWorker, serveLodgeMeal,
-- claimPantry, tickWorkers) — sửa một nơi thì sửa cả hai. Test: supabase/tests/workers.test.sql.
-- Dùng lại bảng có từ 0001: hired_workers (thêm cột belly số lẻ) và profiles.worker_pantry_items (Giỏ Thợ).
-- Thợ chỉ thu + tưới (không gieo), thu ô chín ≥ 5 phút vào Giỏ Thợ tối đa 120, không cộng XP / bộ đếm.
-- Tính lười: _tick_workers chạy trong rpc_get_my_farm và các RPC Lán Thợ.
-- =============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lodge_meals INT NOT NULL DEFAULT 0;
ALTER TABLE public.hired_workers ADD COLUMN IF NOT EXISTS belly NUMERIC NOT NULL DEFAULT 100;

-- Việc + Độ No hao / ngày của từng thợ (workers.ts WORKER_SPECS). NULL = chưa có luật.
CREATE OR REPLACE FUNCTION public._worker_categories(p_code TEXT)
RETURNS TEXT[] LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$
  SELECT CASE p_code
    WHEN 'WORK_01' THEN ARRAY['CROP', 'TREE', 'MUTANT_CROP']
    WHEN 'WORK_02' THEN ARRAY['ANIMAL']
    WHEN 'WORK_03' THEN ARRAY['AQUA']
  END;
$$;

CREATE OR REPLACE FUNCTION public._worker_belly_per_day(p_code TEXT)
RETURNS NUMERIC LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$ SELECT CASE p_code WHEN 'WORK_01' THEN 60 WHEN 'WORK_02' THEN 75 WHEN 'WORK_03' THEN 90 END::NUMERIC $$;

-- Lazy-tick (workers.ts tickWorkers). Người gọi đã khóa hồ sơ.
CREATE OR REPLACE FUNCTION public._tick_workers(p_uid UUID)
RETURNS VOID LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE
  v_p public.profiles%ROWTYPE;
  v_w public.hired_workers%ROWTYPE;
  v_e public.farm_entities%ROWTYPE;
  v_it public.master_catalog%ROWTYPE;
  v_pantry JSONB;
  v_used INT;
  v_meals INT;
  v_mud INT;
  v_cats TEXT[];
  v_drain NUMERIC;   -- Độ No / giây
  v_start TIMESTAMPTZ;
  v_active TIMESTAMPTZ;
  v_belly NUMERIC;
  v_qty INT;
  v_at TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_p FROM public.profiles WHERE id = p_uid;
  v_pantry := COALESCE(v_p.worker_pantry_items, '{}'::jsonb);
  SELECT COALESCE(SUM(GREATEST(0, value::INT)), 0) INTO v_used FROM jsonb_each_text(v_pantry);
  v_meals := v_p.lodge_meals;
  v_mud := v_p.pond_mud_counter;

  FOR v_w IN SELECT * FROM public.hired_workers
             WHERE user_id = p_uid AND public._worker_categories(worker_code) IS NOT NULL
             ORDER BY worker_code FOR UPDATE LOOP
    v_cats := public._worker_categories(v_w.worker_code);
    v_drain := public._worker_belly_per_day(v_w.worker_code) / 86400;
    v_start := LEAST(v_w.last_synced_at, NOW());
    v_active := LEAST(
      v_w.contract_expires_at,
      CASE WHEN v_w.belly >= 35 THEN v_start + ((v_w.belly - 35) / v_drain) * INTERVAL '1 second' ELSE v_start END,
      NOW());

    FOR v_e IN SELECT fe.* FROM public.farm_entities fe JOIN public.master_catalog m ON m.id = fe.entity_id
               WHERE fe.user_id = p_uid AND m.category = ANY (v_cats)
               ORDER BY public._plot_order(fe.tile_x, fe.tile_y) FOR UPDATE OF fe LOOP
      SELECT * INTO v_it FROM public.master_catalog WHERE id = v_e.entity_id;
      -- Vật nuôi nhiều lứa: thu mọi lứa đã chín ≥ 5 phút trong khoảng làm việc.
      LOOP
        EXIT WHEN v_e.mature_at + INTERVAL '5 minutes' > v_active;
        v_qty := v_it.yield_count * CASE WHEN v_e.is_golden THEN 3 ELSE 1 END
                 + CASE WHEN v_p.region = 'SOUTH' AND v_it.category = 'AQUA' THEN 1 ELSE 0 END;
        EXIT WHEN v_used + v_qty > 120;
        v_at := v_e.mature_at + INTERVAL '5 minutes';
        v_pantry := jsonb_set(v_pantry, ARRAY[v_it.id], to_jsonb(COALESCE((v_pantry->>v_it.id)::INT, 0) + v_qty));
        v_used := v_used + v_qty;
        IF v_it.category = 'AQUA' OR public._is_pond_plot(v_e.tile_x, v_e.tile_y) THEN
          v_mud := LEAST(10, v_mud + 1);
        END IF;
        IF COALESCE(v_e.harvests_left, 1) > 1 THEN
          UPDATE public.farm_entities
          SET planted_at = v_at,
              mature_at = v_at + public._grow_ms(v_it.id, v_p.region) * INTERVAL '1 millisecond',
              watered = FALSE, alluvial_mud_applied = FALSE, is_golden = FALSE,
              harvests_left = harvests_left - 1
          WHERE id = v_e.id
          RETURNING * INTO v_e;
        ELSE
          DELETE FROM public.farm_entities WHERE id = v_e.id;
          EXIT;
        END IF;
      END LOOP;
    END LOOP;

    v_belly := GREATEST(0, v_w.belly - v_drain * EXTRACT(EPOCH FROM (NOW() - v_start)));
    IF v_belly < 35 THEN
      WHILE v_belly < 85 AND v_meals > 0 LOOP
        v_belly := LEAST(100, v_belly + 25);
        v_meals := v_meals - 1;
      END LOOP;
    END IF;
    UPDATE public.hired_workers
    SET belly = v_belly, belly_points = LEAST(100, GREATEST(0, ROUND(v_belly)))::INT, last_synced_at = NOW()
    WHERE id = v_w.id;

    -- Còn làm lúc này: tưới ô chưa tưới, chưa chín (−15% thời gian còn lại).
    IF v_w.contract_expires_at > NOW() AND v_belly >= 35 THEN
      UPDATE public.farm_entities fe
      SET watered = TRUE,
          mature_at = fe.mature_at - FLOOR(FLOOR(EXTRACT(EPOCH FROM (fe.mature_at - NOW())) * 1000) * 0.15) * INTERVAL '1 millisecond'
      FROM public.master_catalog m
      WHERE fe.user_id = p_uid AND m.id = fe.entity_id AND m.category = ANY (v_cats)
        AND NOT fe.watered AND NOW() < fe.mature_at;
    END IF;
  END LOOP;

  UPDATE public.profiles
  SET worker_pantry_items = v_pantry, lodge_meals = v_meals, pond_mud_counter = v_mud
  WHERE id = p_uid;
END;
$$;

-- Ảnh chụp nông trại: như 0010 + 'workers', 'lodge_meals', 'worker_pantry' (Lán Thợ).
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
    'lodge_meals', v_p.lodge_meals,
    'worker_pantry', COALESCE(v_p.worker_pantry_items, '{}'::jsonb),
    'workers', COALESCE((
      SELECT jsonb_object_agg(worker_code, jsonb_build_object(
        'contract_until', FLOOR(EXTRACT(EPOCH FROM contract_expires_at) * v_ms),
        'belly', belly,
        'tick_at', FLOOR(EXTRACT(EPOCH FROM last_synced_at) * v_ms)
      )) FROM public.hired_workers WHERE user_id = p_uid
    ), '{}'::jsonb),
    'recipes', COALESCE((
      SELECT jsonb_agg(product_id ORDER BY discovered_at, product_id) FROM public.player_recipes WHERE user_id = p_uid
    ), '[]'::jsonb)
  );
END;
$$;



-- Vào game: như 0008 + tick Lán Thợ.
CREATE OR REPLACE FUNCTION public.rpc_get_my_farm()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE v_uid UUID := public._require_uid();
BEGIN
  PERFORM public._lock_profile(v_uid);
  PERFORM public._regen_stamina(v_uid);
  PERFORM public._tick_workers(v_uid);
  INSERT INTO public.player_active_days (user_id, day) VALUES (v_uid, public._vn_today())
  ON CONFLICT DO NOTHING;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M05.1 — Thuê / gia hạn 3 ngày (workers.ts hireWorker).
CREATE OR REPLACE FUNCTION public.rpc_hire_worker(p_worker_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
  v_stage INT;
  v_cost INT;
BEGIN
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_worker_id;
  IF NOT FOUND OR v_item.category <> 'WORKER' OR public._worker_categories(p_worker_id) IS NULL THEN
    RAISE EXCEPTION '⚠️ Không có thợ này!';
  END IF;
  v_stage := GREATEST(2, COALESCE(v_item.unlock_wave, 2));
  IF public.app_game_stage() < v_stage THEN
    RAISE EXCEPTION '🔒 [%] về làng ở Giai đoạn %!', v_item.name_vn, v_stage;
  END IF;
  IF v_p.level < v_item.unlock_level THEN
    RAISE EXCEPTION '🔒 Cần đạt Cấp % để thuê [%]!', v_item.unlock_level, v_item.name_vn;
  END IF;
  v_cost := ROUND(v_item.buy_cost_gold * 3 * 0.88);
  IF v_p.gold < v_cost THEN
    RAISE EXCEPTION '⚠️ Cần % 🪙 để trả lương 3 ngày cho [%]!', v_cost, v_item.name_vn;
  END IF;
  PERFORM public._tick_workers(v_uid);
  INSERT INTO public.hired_workers (user_id, worker_code, contract_expires_at, belly, belly_points, last_synced_at)
  VALUES (v_uid, p_worker_id, NOW() + INTERVAL '3 days', 100, 100, NOW())
  ON CONFLICT (user_id, worker_code) DO UPDATE
  SET contract_expires_at = GREATEST(NOW(), public.hired_workers.contract_expires_at) + INTERVAL '3 days';
  UPDATE public.profiles SET gold = gold - v_cost, updated_at = NOW() WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M05.2 — Dọn 1 món Bếp Quê lên Bàn Ăn (workers.ts serveLodgeMeal): + (⚡ ÷ 5) suất, tối thiểu 1.
CREATE OR REPLACE FUNCTION public.rpc_serve_lodge_meal(p_dish_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
BEGIN
  IF public.app_game_stage() < 2 THEN RAISE EXCEPTION '🔒 Lán Thợ mở ở Giai đoạn 2!'; END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_dish_id;
  IF NOT FOUND OR v_item.category <> 'RECIPE' OR v_item.stamina_delta <= 0 THEN
    RAISE EXCEPTION '⚠️ Chỉ dọn được món ăn Bếp Quê lên Bàn Ăn!';
  END IF;
  BEGIN
    PERFORM public._add_inventory(v_uid, p_dish_id, -1);
  EXCEPTION WHEN raise_exception THEN
    RAISE EXCEPTION '⚠️ Kho không còn [%]! Nấu ở Bếp Quê trước nhé.', v_item.name_vn;
  END;
  UPDATE public.profiles
  SET lodge_meals = lodge_meals + GREATEST(1, ROUND(v_item.stamina_delta / 5.0))::INT, updated_at = NOW()
  WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M05.4 — Thu Giỏ Thợ về Kho (tick trước để lấy cả hàng vừa thu). Không quy ra vàng.
CREATE OR REPLACE FUNCTION public.rpc_claim_worker_pantry()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_row RECORD;
  v_total INT := 0;
BEGIN
  PERFORM public._tick_workers(v_uid);
  SELECT * INTO v_p FROM public.profiles WHERE id = v_uid;
  FOR v_row IN SELECT key, value::INT AS n FROM jsonb_each_text(COALESCE(v_p.worker_pantry_items, '{}'::jsonb)) ORDER BY key LOOP
    IF v_row.n > 0 THEN
      PERFORM public._add_inventory(v_uid, v_row.key, v_row.n);
      v_total := v_total + v_row.n;
    END IF;
  END LOOP;
  IF v_total <= 0 THEN RAISE EXCEPTION '🧺 Giỏ Thợ đang trống!'; END IF;
  UPDATE public.profiles SET worker_pantry_items = '{}'::jsonb, updated_at = NOW() WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

REVOKE ALL ON FUNCTION public._worker_categories(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._worker_belly_per_day(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._tick_workers(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_get_my_farm()',
    'public.rpc_hire_worker(TEXT)',
    'public.rpc_serve_lodge_meal(TEXT)',
    'public.rpc_claim_worker_pantry()'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
