-- =============================================================================
-- 0014 — PHỤ CẤP NGÀY MÙA (S5d) — Additive-Only, chạy lại an toàn. Chạy SAU 0013.
-- -----------------------------------------------------------------------------
-- PO giữ 300🪙 (2026-11-03). Tác dụng "+25% tốc độ" (02 mục 3.2) quy thành: 24 giờ Hăng Say, thợ tưới cắt 25%
-- thời gian còn lại thay vì 15%. Không đổi mốc chờ 5 phút. Bản sao của src/domain/workers.ts giveBonus / tickWorkers.
-- _tick_workers và _farm_snapshot chép từ 0013, chỉ thêm phần bonus_until.
-- =============================================================================

ALTER TABLE public.hired_workers ADD COLUMN IF NOT EXISTS bonus_until TIMESTAMPTZ DEFAULT NULL;

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
  v_gear_end TIMESTAMPTZ;
  v_with_gear NUMERIC;
  v_hungry TIMESTAMPTZ;
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
    -- 0013: đồ thợ còn hạn thì Độ No hao ×0,75 (workers.ts hungryTime / bellyDrain).
    v_gear_end := GREATEST(v_start, COALESCE(v_w.gear_expires_at, v_start));
    v_with_gear := v_drain * 0.75 * EXTRACT(EPOCH FROM (v_gear_end - v_start));
    IF v_w.belly - 35 <= 0 THEN
      v_hungry := v_start;
    ELSIF v_w.belly - 35 <= v_with_gear THEN
      v_hungry := v_start + ((v_w.belly - 35) / (v_drain * 0.75)) * INTERVAL '1 second';
    ELSE
      v_hungry := v_gear_end + ((v_w.belly - 35 - v_with_gear) / v_drain) * INTERVAL '1 second';
    END IF;
    v_active := LEAST(v_w.contract_expires_at, v_hungry, NOW());

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

    v_gear_end := LEAST(NOW(), GREATEST(v_start, COALESCE(v_w.gear_expires_at, v_start)));
    v_belly := GREATEST(0, v_w.belly
      - v_drain * 0.75 * EXTRACT(EPOCH FROM (v_gear_end - v_start))
      - v_drain * EXTRACT(EPOCH FROM (NOW() - v_gear_end)));
    IF v_belly < 35 THEN
      WHILE v_belly < 85 AND v_meals > 0 LOOP
        v_belly := LEAST(100, v_belly + 25);
        v_meals := v_meals - 1;
      END LOOP;
    END IF;
    UPDATE public.hired_workers
    SET belly = v_belly, belly_points = LEAST(100, GREATEST(0, ROUND(v_belly)))::INT, last_synced_at = NOW()
    WHERE id = v_w.id;

    -- Còn làm lúc này: tưới ô chưa tưới, chưa chín (−15%; 0014: Hăng Say −25%).
    IF v_w.contract_expires_at > NOW() AND v_belly >= 35 THEN
      UPDATE public.farm_entities fe
      SET watered = TRUE,
          mature_at = fe.mature_at - FLOOR(FLOOR(EXTRACT(EPOCH FROM (fe.mature_at - NOW())) * 1000)
                      * CASE WHEN COALESCE(v_w.bonus_until, '-infinity'::timestamptz) > NOW() THEN 0.25 ELSE 0.15 END) * INTERVAL '1 millisecond'
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
        'tick_at', FLOOR(EXTRACT(EPOCH FROM last_synced_at) * v_ms),
        'gear_id', gear_code,
        'gear_until', FLOOR(EXTRACT(EPOCH FROM gear_expires_at) * v_ms),
        'bonus_until', FLOOR(EXTRACT(EPOCH FROM bonus_until) * v_ms)
      )) FROM public.hired_workers WHERE user_id = p_uid
    ), '{}'::jsonb),
    'recipes', COALESCE((
      SELECT jsonb_agg(product_id ORDER BY discovered_at, product_id) FROM public.player_recipes WHERE user_id = p_uid
    ), '[]'::jsonb)
  );
END;
$$;



-- M05.3 — Phụ Cấp Ngày Mùa (workers.ts giveBonus): −300🪙, thợ đang làm Hăng Say 24 giờ.
CREATE OR REPLACE FUNCTION public.rpc_give_worker_bonus(p_worker_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_w public.hired_workers%ROWTYPE;
BEGIN
  IF public.app_game_stage() < 2 THEN RAISE EXCEPTION '🔒 Lán Thợ mở ở Giai đoạn 2!'; END IF;
  IF v_p.gold < 300 THEN RAISE EXCEPTION '⚠️ Cần 300 🪙 để thưởng Phụ Cấp Ngày Mùa!'; END IF;
  PERFORM public._tick_workers(v_uid);
  SELECT * INTO v_w FROM public.hired_workers WHERE user_id = v_uid AND worker_code = p_worker_id FOR UPDATE;
  IF NOT FOUND OR v_w.contract_expires_at <= NOW() THEN
    RAISE EXCEPTION '👷 Hãy thuê / gia hạn thợ này trước khi thưởng!';
  END IF;
  UPDATE public.hired_workers SET bonus_until = NOW() + INTERVAL '24 hours', morale_points = 100 WHERE id = v_w.id;
  UPDATE public.profiles SET gold = gold - 300, updated_at = NOW() WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

REVOKE ALL ON FUNCTION public._tick_workers(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rpc_give_worker_bonus(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_give_worker_bonus(TEXT) TO authenticated;
