-- =============================================================================
-- 0016 — SỬA BÙN PHÙ SA + CÀ PHÊ MUỐI (PO duyệt 2026-11-03, `17` mục C4) — chạy lại an toàn. Chạy SAU 0015.
-- -----------------------------------------------------------------------------
-- 1) Vét ao: số xô = pond_mud_counter (tối đa 10), ao chưa có bùn thì từ chối (trước: luôn +3 xô).
-- 2) Bộ đếm bùn ao chỉ tăng khi thu THỦY SẢN (trước: cả cây trồng ở hàng ô Ao) — rpc_harvest + _tick_workers.
-- 3) Không bón bùn cho cây lâu năm (TREE).
-- 4) PROD_C01 Cà Phê Muối: bỏ nguyên liệu CROP_C05 (Đợt 4); seed recipe_seed.sql thêm CROP_10.
-- Bản sao của src/domain/farm.ts (dredgePond, pondMudAfterHarvest, applyMud). Hàm chép từ 0007/0010/0014, chỉ sửa chỗ ghi "0016".
-- =============================================================================

CREATE OR REPLACE FUNCTION public.rpc_dredge_pond()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_gain INT := LEAST(10, GREATEST(0, v_p.pond_mud_counter));
BEGIN
  PERFORM public._spend_stamina(v_uid, 3, 'Cần 3 Năng lượng để Vét Bùn Đáy Ao!');
  -- 0016: số xô = bộ đếm bùn ao (src/domain/farm.ts dredgeMudGain). Lỗi → cả giao dịch hủy, không mất ⚡.
  IF v_gain <= 0 THEN
    RAISE EXCEPTION 'Ao chưa có bùn! Thả cá / tôm ở Ao, mỗi lần thu thủy sản +1 xô bùn (tối đa 10).';
  END IF;
  PERFORM public._add_inventory(v_uid, 'ITEM_BUN_PHU_SA', v_gain);
  UPDATE public.profiles SET pond_mud_counter = 0 WHERE id = v_uid;
  PERFORM public._apply_xp(v_uid, 20);
  PERFORM public._bump_counter(v_uid, 'DREDGE', 1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_apply_mud(p_x INT, p_y INT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_e public.farm_entities%ROWTYPE := public._lock_tile(v_uid, p_x, p_y);
BEGIN
  IF v_e.id IS NULL THEN RAISE EXCEPTION 'Ô này chưa gieo gì để bón bùn!'; END IF;
  IF v_e.alluvial_mud_applied THEN RAISE EXCEPTION 'Ô này đã bón Bùn Phù Sa rồi!'; END IF;
  IF NOW() >= v_e.mature_at THEN RAISE EXCEPTION 'Đã chín rồi, hãy thu hoạch!'; END IF;
  -- 0016: cây lâu năm không bón bùn (src/domain/farm.ts applyMud)
  IF EXISTS (SELECT 1 FROM public.master_catalog WHERE id = v_e.entity_id AND category = 'TREE') THEN
    RAISE EXCEPTION 'Cây lâu năm không bón Bùn Phù Sa được — hãy bón cho cây ruộng hoặc vật nuôi!';
  END IF;
  BEGIN
    PERFORM public._add_inventory(v_uid, 'ITEM_BUN_PHU_SA', -1);
  EXCEPTION WHEN raise_exception THEN
    RAISE EXCEPTION 'Đã hết Bùn Phù Sa! Hãy Vét Bùn Ao để lấy thêm nhé!';
  END;
  -- Chín ngay, 45% nổ Hoàng Kim (src/domain/farm.ts applyMud)
  UPDATE public.farm_entities
  SET alluvial_mud_applied = TRUE,
      is_golden = random() < 0.45,
      mature_at = NOW() - INTERVAL '1 second'
  WHERE id = v_e.id;
  PERFORM public._bump_counter(v_uid, 'APPLY_MUD', 1);
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
  IF v_item.category = 'AQUA' THEN  -- 0016: chỉ thủy sản làm đầy bùn ao
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
        IF v_it.category = 'AQUA' THEN  -- 0016: chỉ thủy sản làm đầy bùn ao
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

-- 4) Dòng công thức cũ (dữ liệu catalog, không phải dữ liệu người chơi). Seed chỉ upsert nên phải gỡ ở đây.
DELETE FROM public.recipe_ingredients WHERE product_id = 'PROD_C01' AND item_id = 'CROP_C05';
INSERT INTO public.recipe_ingredients (product_id, item_id, qty)
SELECT 'PROD_C01', 'CROP_10', 1
WHERE EXISTS (SELECT 1 FROM public.master_catalog WHERE id = 'PROD_C01')
  AND EXISTS (SELECT 1 FROM public.master_catalog WHERE id = 'CROP_10')
ON CONFLICT (product_id, item_id) DO UPDATE SET qty = EXCLUDED.qty;

REVOKE ALL ON FUNCTION public._tick_workers(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rpc_dredge_pond() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_dredge_pond() TO authenticated;
REVOKE ALL ON FUNCTION public.rpc_apply_mud(INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_apply_mud(INT, INT) TO authenticated;
REVOKE ALL ON FUNCTION public.rpc_harvest(INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_harvest(INT, INT) TO authenticated;
