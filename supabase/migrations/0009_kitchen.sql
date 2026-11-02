-- =============================================================================
-- 0009 — BẾP QUÊ & XƯỞNG (S4 — M04.1..M04.3) — Additive-Only, chạy lại an toàn
-- -----------------------------------------------------------------------------
-- Đặc tả + quyết định PO: 17_PROJECT_AUDIT mục C2. Luật là bản sao của src/domain/cooking.ts
-- (buildMachine, startCraft, collectCraft, eatDish, discoverRecipe) — sửa một nơi thì sửa cả hai,
-- cùng thông báo lỗi. Test: supabase/tests/kitchen.test.sql (npm run test:sql).
--
-- Mọi RPC kiểm app_game_stage() >= 2: hiện server vẫn ở GĐ1 nên chưa ai dùng được cho tới khi
-- mở GĐ2 (đổi app_game_stage() ở một migration sau, cùng lúc với VITE_GAME_STAGE=2).
--
-- Chạy SAU 0008. Sau đó chạy supabase/seed/master_catalog_seed.sql rồi supabase/seed/recipe_seed.sql.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. DỮ LIỆU CÔNG THỨC (đọc công khai, chỉ seed ghi)
-- -----------------------------------------------------------------------------
ALTER TABLE public.master_catalog ADD COLUMN IF NOT EXISTS machine_id TEXT DEFAULT NULL;

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  product_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  item_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY (product_id, item_id)
);
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recipe ingredients readable" ON public.recipe_ingredients;
CREATE POLICY "Recipe ingredients readable" ON public.recipe_ingredients FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 2. XƯỞNG & CÔNG THỨC CỦA NGƯỜI CHƠI (client chỉ đọc của mình; chỉ RPC ghi)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_machines (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  craft_item_id TEXT DEFAULT NULL REFERENCES public.master_catalog(id),
  ready_at TIMESTAMPTZ DEFAULT NULL,
  built_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, machine_id)
);
ALTER TABLE public.player_machines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own machines readable" ON public.player_machines;
CREATE POLICY "Own machines readable" ON public.player_machines FOR SELECT USING (auth.uid() = user_id);

-- Món đã khám phá ở Nồi Đất (không gồm Cơm Trắng PROD_01 mở sẵn).
CREATE TABLE IF NOT EXISTS public.player_recipes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);
ALTER TABLE public.player_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own recipes readable" ON public.player_recipes;
CREATE POLICY "Own recipes readable" ON public.player_recipes FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. HÀM NỘI BỘ
-- -----------------------------------------------------------------------------

-- 3 xưởng ăn uống mở ở S4 (cooking.ts KITCHEN_MACHINE_IDS). MAC_01/07/08 mở cùng Lán Thợ (S5).
CREATE OR REPLACE FUNCTION public._is_kitchen_machine(p_id TEXT)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$ SELECT COALESCE(p_id IN ('MAC_02', 'MAC_03', 'MAC_04'), FALSE) $$;

CREATE OR REPLACE FUNCTION public._require_kitchen_stage()
RETURNS VOID LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
BEGIN
  IF public.app_game_stage() < 2 THEN
    RAISE EXCEPTION '🔒 Bếp Quê mở ở Giai đoạn 2!';
  END IF;
END;
$$;

-- "emoji Tên" để ghép thông báo (cooking.ts nameOf).
CREATE OR REPLACE FUNCTION public._item_label(p_id TEXT)
RETURNS TEXT LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$ SELECT COALESCE((SELECT emoji || ' ' || name_vn FROM public.master_catalog WHERE id = p_id), p_id) $$;

-- Món có nấu được ở Giai đoạn / cấp hiện tại không (cooking.ts recipeLock + progression.ts canCraftOrBuy).
-- NULL = được; ngược lại là thông báo lỗi giống startCraft.
CREATE OR REPLACE FUNCTION public._recipe_lock(p_product_id TEXT, p_level INT)
RETURNS TEXT LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
DECLARE
  v_item public.master_catalog%ROWTYPE;
  v_stage INT := public.app_game_stage();
  v_need_stage INT;
  v_ing RECORD;
BEGIN
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_product_id;
  IF NOT FOUND OR v_item.category <> 'RECIPE' OR v_item.machine_id IS NULL
     OR NOT EXISTS (SELECT 1 FROM public.recipe_ingredients WHERE product_id = p_product_id) THEN
    RETURN '⚠️ Món này không nấu ở xưởng này!';
  END IF;
  v_need_stage := GREATEST(2, COALESCE(v_item.unlock_wave, 2));
  IF v_stage < v_need_stage THEN
    RETURN format('🔒 Món này mở ở Giai đoạn %s!', v_need_stage);
  END IF;
  IF v_item.unlock_level > p_level THEN
    RETURN format('🔒 Cần đạt Cấp %s để nấu [%s]!', v_item.unlock_level, v_item.name_vn);
  END IF;
  -- Nguyên liệu thuộc Đợt chưa mở (vd Cà Phê Muối cần Cà Phê Đợt 4). Thứ tự theo công thức gốc
  -- không lưu trong bảng, nên lấy nguyên liệu khóa có Đợt cao nhất (chỉ PROD_C01 vướng, 1 nguyên liệu).
  SELECT ri.item_id, COALESCE(m.unlock_wave, 99) AS wave INTO v_ing
  FROM public.recipe_ingredients ri
  LEFT JOIN public.master_catalog m ON m.id = ri.item_id
  WHERE ri.product_id = p_product_id AND COALESCE(m.unlock_wave, 99) > LEAST(5, GREATEST(1, v_stage))
  ORDER BY wave DESC, ri.item_id
  LIMIT 1;
  IF FOUND THEN
    RETURN format('🔒 Cần [%s] — mở ở Đợt %s!', public._item_label(v_ing.item_id), v_ing.wave);
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public._recipe_known(p_uid UUID, p_product_id TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$
  SELECT p_product_id = 'PROD_01'
      OR EXISTS (SELECT 1 FROM public.player_recipes WHERE user_id = p_uid AND product_id = p_product_id);
$$;

-- Thời gian nấu (ms), miền Trung ×0,9 (cooking.ts craftDurationMs).
CREATE OR REPLACE FUNCTION public._craft_ms(p_minutes INT, p_region TEXT)
RETURNS BIGINT LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$ SELECT ROUND(p_minutes * 60000 * CASE WHEN p_region = 'CENTRAL' THEN 0.9 ELSE 1 END)::BIGINT $$;

-- Ảnh chụp nông trại: như 0007 + 'machines' và 'recipes'.
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
        'remaining_yield', remaining_yield
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

REVOKE ALL ON FUNCTION public._is_kitchen_machine(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._require_kitchen_stage() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._item_label(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._recipe_lock(TEXT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._recipe_known(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._craft_ms(INT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. RPC CHO CLIENT
-- -----------------------------------------------------------------------------

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
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M04.3 — Bắt đầu nấu (cooking.ts startCraft): trừ nguyên liệu, 0⚡, 1 suất / xưởng.
CREATE OR REPLACE FUNCTION public.rpc_start_craft(p_machine_id TEXT, p_product_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_m public.player_machines%ROWTYPE;
  v_item public.master_catalog%ROWTYPE;
  v_lock TEXT;
  v_missing TEXT;
  v_ing RECORD;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_m FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION '🏭 Hãy xây xưởng này trước!'; END IF;
  IF v_m.craft_item_id IS NOT NULL THEN
    RAISE EXCEPTION '⏳ Xưởng đang nấu [%]!', public._item_label(v_m.craft_item_id);
  END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_product_id;
  IF NOT FOUND OR v_item.machine_id IS DISTINCT FROM p_machine_id THEN
    RAISE EXCEPTION '⚠️ Món này không nấu ở xưởng này!';
  END IF;
  v_lock := public._recipe_lock(p_product_id, v_p.level);
  IF v_lock IS NOT NULL THEN RAISE EXCEPTION '%', v_lock; END IF;
  IF NOT public._recipe_known(v_uid, p_product_id) THEN
    RAISE EXCEPTION '📖 Chưa biết công thức! Hãy thử phối món ở Nồi Đất trước.';
  END IF;

  -- Khóa các dòng kho của nguyên liệu (thứ tự profile → xưởng → kho), rồi kiểm thiếu.
  PERFORM 1 FROM public.inventories i
  WHERE i.user_id = v_uid AND i.item_id IN (SELECT item_id FROM public.recipe_ingredients WHERE product_id = p_product_id)
  ORDER BY i.item_id FOR UPDATE;
  SELECT string_agg((ri.qty - COALESCE(i.quantity, 0)) || ' ' || public._item_label(ri.item_id), ', ' ORDER BY ri.item_id)
  INTO v_missing
  FROM public.recipe_ingredients ri
  LEFT JOIN public.inventories i ON i.user_id = v_uid AND i.item_id = ri.item_id
  WHERE ri.product_id = p_product_id AND COALESCE(i.quantity, 0) < ri.qty;
  IF v_missing IS NOT NULL THEN RAISE EXCEPTION '🧺 Còn thiếu: %', v_missing; END IF;

  FOR v_ing IN SELECT item_id, qty FROM public.recipe_ingredients WHERE product_id = p_product_id ORDER BY item_id LOOP
    PERFORM public._add_inventory(v_uid, v_ing.item_id, -v_ing.qty);
  END LOOP;
  UPDATE public.player_machines
  SET craft_item_id = p_product_id,
      ready_at = NOW() + public._craft_ms(v_item.time_minutes, v_p.region) * INTERVAL '1 millisecond'
  WHERE user_id = v_uid AND machine_id = p_machine_id;
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
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Ăn 1 món trong Kho để hồi ⚡ (cooking.ts eatDish): không vượt trần; ⚡ đầy thì từ chối.
CREATE OR REPLACE FUNCTION public.rpc_eat_dish(p_product_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
  v_have INT;
  v_next INT;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_product_id;
  IF NOT FOUND OR v_item.category <> 'RECIPE' OR v_item.stamina_delta <= 0 THEN
    RAISE EXCEPTION '⚠️ Món này không ăn được!';
  END IF;
  SELECT quantity INTO v_have FROM public.inventories WHERE user_id = v_uid AND item_id = p_product_id FOR UPDATE;
  IF COALESCE(v_have, 0) < 1 THEN RAISE EXCEPTION '⚠️ Kho không còn [%]!', v_item.name_vn; END IF;
  PERFORM public._regen_stamina(v_uid);
  SELECT * INTO v_p FROM public.profiles WHERE id = v_uid;
  IF v_p.stamina >= v_p.max_stamina THEN
    RAISE EXCEPTION '⚡ Năng lượng đang đầy, để dành món ăn sau nhé!';
  END IF;
  v_next := LEAST(v_p.max_stamina, v_p.stamina + v_item.stamina_delta);
  UPDATE public.profiles
  SET stamina = v_next,
      stamina_updated_at = CASE WHEN v_next >= v_p.max_stamina THEN NOW() ELSE stamina_updated_at END,
      updated_at = NOW()
  WHERE id = v_uid;
  PERFORM public._add_inventory(v_uid, p_product_id, -1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M04.2 — Nồi Đất khám phá công thức (cooking.ts discoverRecipe). Nguyên liệu KHÔNG bị tiêu.
-- p_ingredient_ids: mỗi phần tử là 1 đơn vị nguyên liệu (lặp ID để bỏ nhiều), chuỗi rỗng bị bỏ qua.
CREATE OR REPLACE FUNCTION public.rpc_cook_pot(p_ingredient_ids TEXT[])
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_pick JSONB;
  v_total INT;
  v_short RECORD;
  v_key TEXT;
  v_match public.master_catalog%ROWTYPE;
BEGIN
  PERFORM public._require_kitchen_stage();
  IF NOT EXISTS (SELECT 1 FROM public.player_machines WHERE user_id = v_uid AND machine_id = 'MAC_02') THEN
    RAISE EXCEPTION '🍲 Hãy xây Bếp Củi (có Nồi Đất) trước!';
  END IF;

  -- {"CROP_01": 3, ...}: đếm nguyên liệu theo ID (cooking.ts countIds).
  SELECT COALESCE(jsonb_object_agg(x, c), '{}'::jsonb) INTO v_pick
  FROM (SELECT x, COUNT(*)::INT AS c FROM unnest(COALESCE(p_ingredient_ids, ARRAY[]::TEXT[])) AS u(x)
        WHERE COALESCE(x, '') <> '' GROUP BY x) s;
  SELECT COALESCE(SUM(value::INT), 0) INTO v_total FROM jsonb_each_text(v_pick);
  IF v_total < 1 OR v_total > 4 THEN
    RAISE EXCEPTION '🍲 Bỏ từ 1 đến 4 nguyên liệu vào Nồi Đất!';
  END IF;
  SELECT p.key AS item_id, p.value::INT AS n INTO v_short
  FROM jsonb_each_text(v_pick) p
  LEFT JOIN public.inventories i ON i.user_id = v_uid AND i.item_id = p.key
  WHERE COALESCE(i.quantity, 0) < p.value::INT
  ORDER BY p.key LIMIT 1;
  IF FOUND THEN
    RAISE EXCEPTION '🧺 Kho không đủ % %!', v_short.n, public._item_label(v_short.item_id);
  END IF;

  -- So khớp đúng tập nguyên liệu (kể cả số lượng) với các công thức đang mở.
  SELECT string_agg(key || ':' || value, ',' ORDER BY key) INTO v_key FROM jsonb_each_text(v_pick);
  SELECT m.* INTO v_match
  FROM public.master_catalog m
  WHERE m.category = 'RECIPE' AND public._is_kitchen_machine(m.machine_id)
    AND public._recipe_lock(m.id, v_p.level) IS NULL
    AND (SELECT string_agg(ri.item_id || ':' || ri.qty, ',' ORDER BY ri.item_id)
         FROM public.recipe_ingredients ri WHERE ri.product_id = m.id) = v_key
  ORDER BY m.id
  LIMIT 1;
  IF FOUND THEN
    IF public._recipe_known(v_uid, v_match.id) THEN
      RAISE EXCEPTION '📖 Đã biết món [% %] rồi — nấu ở Sổ Tay nhé!', v_match.emoji, v_match.name_vn;
    END IF;
    INSERT INTO public.player_recipes (user_id, product_id) VALUES (v_uid, v_match.id);
    UPDATE public.profiles SET gems = gems + 10, updated_at = NOW() WHERE id = v_uid;
    PERFORM public._apply_xp(v_uid, 50);
    RETURN public._farm_snapshot(v_uid);
  END IF;

  -- Gợi ý "có mùi": tập đã bỏ nằm trọn trong 1 công thức đang mở chưa khám phá.
  IF EXISTS (
    SELECT 1 FROM public.master_catalog m
    WHERE m.category = 'RECIPE' AND public._is_kitchen_machine(m.machine_id)
      AND public._recipe_lock(m.id, v_p.level) IS NULL
      AND NOT public._recipe_known(v_uid, m.id)
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_each_text(v_pick) p
        WHERE p.value::INT > COALESCE((SELECT ri.qty FROM public.recipe_ingredients ri
                                       WHERE ri.product_id = m.id AND ri.item_id = p.key), 0)
      )
  ) THEN
    RAISE EXCEPTION '🍲 Có mùi rồi! Thêm nguyên liệu nữa thử xem.';
  END IF;
  RAISE EXCEPTION '🍲 Chưa thành món. Xem gợi ý trong Sổ Tay nhé!';
END;
$$;

DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_build_machine(TEXT)',
    'public.rpc_start_craft(TEXT, TEXT)',
    'public.rpc_collect_craft(TEXT)',
    'public.rpc_eat_dish(TEXT)',
    'public.rpc_cook_pot(TEXT[])'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
