-- =============================================================================
-- 0012 — BỘ ĐẾM NHIỆM VỤ CHƯƠNG 3 & 6 (S5) — Additive-Only, chạy lại an toàn. Chạy SAU 0011.
-- -----------------------------------------------------------------------------
-- Ch.3 = xây Bếp Củi (BUILD:MAC_02) + nấu xong 1 món (COOK); Ch.6 = thuê Chú Tư (HIRE:WORK_01) + dọn 1 món
-- lên Bàn Ăn (SERVE_MEAL). Khóa bộ đếm: src/domain/quests.ts COUNTER. Mục tiêu: src/data/quests.ts →
-- supabase/seed/quest_catalog_seed.sql (chạy lại seed sau migration này).
-- Thân 4 hàm chép từ 0009 / 0011, chỉ thêm 1 dòng PERFORM _bump_counter trước RETURN.
-- =============================================================================

-- M04.1 — Xây 1 xưởng ăn uống (cooking.ts buildMachine).
CREATE OR REPLACE FUNCTION public.rpc_build_machine(p_machine_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
  v_need_stage INT;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_machine_id;
  IF NOT FOUND OR v_item.category <> 'MACHINE' THEN RAISE EXCEPTION '⚠️ Không có xưởng này!'; END IF;
  IF NOT public._is_kitchen_machine(p_machine_id) THEN
    RAISE EXCEPTION '🛖 [%] mở cùng Lán Thợ ở bản sau!', v_item.name_vn;
  END IF;
  v_need_stage := GREATEST(2, COALESCE(v_item.unlock_wave, 2));
  IF public.app_game_stage() < v_need_stage THEN
    RAISE EXCEPTION '🔒 Bếp Quê & Xưởng mở ở Giai đoạn %!', v_need_stage;
  END IF;
  IF v_item.unlock_level > v_p.level THEN
    RAISE EXCEPTION '🔒 Cần đạt Cấp % để xây [%]!', v_item.unlock_level, v_item.name_vn;
  END IF;
  IF EXISTS (SELECT 1 FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id) THEN
    RAISE EXCEPTION '🏭 Đã có [%] rồi!', v_item.name_vn;
  END IF;
  IF v_p.gold < v_item.buy_cost_gold THEN
    RAISE EXCEPTION '⚠️ Cần % 🪙 để xây [%]!', v_item.buy_cost_gold, v_item.name_vn;
  END IF;
  UPDATE public.profiles SET gold = gold - v_item.buy_cost_gold, updated_at = NOW() WHERE id = v_uid;
  INSERT INTO public.player_machines (user_id, machine_id) VALUES (v_uid, p_machine_id);
  PERFORM public._apply_xp(v_uid, v_item.xp_reward);
  PERFORM public._bump_counter(v_uid, 'BUILD:' || p_machine_id, 1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Lấy món đã nấu xong (cooking.ts collectCraft): +1 vào Kho, +XP của món.
CREATE OR REPLACE FUNCTION public.rpc_collect_craft(p_machine_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_m public.player_machines%ROWTYPE;
  v_item public.master_catalog%ROWTYPE;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_m FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id FOR UPDATE;
  IF NOT FOUND OR v_m.craft_item_id IS NULL OR v_m.ready_at IS NULL THEN
    RAISE EXCEPTION '🍲 Xưởng chưa nấu món nào!';
  END IF;
  IF NOW() < v_m.ready_at THEN
    RAISE EXCEPTION '⏳ Còn % phút nữa mới xong!', CEIL(EXTRACT(EPOCH FROM (v_m.ready_at - NOW())) / 60)::INT;
  END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = v_m.craft_item_id;
  IF NOT FOUND THEN RAISE EXCEPTION '⚠️ Món không có trong danh mục!'; END IF;
  PERFORM public._add_inventory(v_uid, v_item.id, 1);
  UPDATE public.player_machines SET craft_item_id = NULL, ready_at = NULL
  WHERE user_id = v_uid AND machine_id = p_machine_id;
  PERFORM public._apply_xp(v_uid, v_item.xp_reward);
  PERFORM public._bump_counter(v_uid, 'COOK', 1);
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
  PERFORM public._bump_counter(v_uid, 'HIRE:' || p_worker_id, 1);
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
  PERFORM public._bump_counter(v_uid, 'SERVE_MEAL', 1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_build_machine(TEXT)',
    'public.rpc_collect_craft(TEXT)',
    'public.rpc_hire_worker(TEXT)',
    'public.rpc_serve_lodge_meal(TEXT)'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
