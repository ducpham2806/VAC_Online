-- =============================================================================
-- 0009 — BẾP QUÊ & XƯỞNG (S4: M04.1–M04.3) — Additive-Only, chạy lại an toàn
-- -----------------------------------------------------------------------------
-- Đặc tả + quyết định PO: 17_PROJECT_AUDIT mục C2. Luật PHẢI khớp src/domain/cooking.ts
-- (buildMachine, startCraft, collectCraft, eatDish, discoverRecipe) — sửa một nơi thì sửa cả hai.
-- Test: supabase/tests/kitchen.test.sql (npm run test:sql).
-- KHÔNG đổi app_game_stage(): production vẫn GĐ1, mọi RPC Bếp từ chối tới khi mở GĐ2.
-- Chạy SAU 0008. Sau đó chạy supabase/seed/recipe_seed.sql (sinh từ GAME_CATALOG).
-- =============================================================================

-- 1. Dữ liệu công thức (đọc công khai như master_catalog)
ALTER TABLE public.master_catalog ADD COLUMN IF NOT EXISTS machine_id TEXT DEFAULT NULL;

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  product_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  item_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  qty INT NOT NULL CHECK (qty > 0),
  PRIMARY KEY (product_id, item_id)
);
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public recipes readable" ON public.recipe_ingredients;
CREATE POLICY "Public recipes readable" ON public.recipe_ingredients FOR SELECT USING (true);

-- 2. Xưởng đã xây & công thức đã khám phá của người chơi (chỉ hàm SECURITY DEFINER ghi được)
CREATE TABLE IF NOT EXISTS public.player_machines (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  built_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  craft_item_id TEXT DEFAULT NULL REFERENCES public.master_catalog(id),
  craft_ready_at TIMESTAMPTZ DEFAULT NULL,
  PRIMARY KEY (user_id, machine_id)
);
ALTER TABLE public.player_machines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own machines readable" ON public.player_machines;
CREATE POLICY "Own machines readable" ON public.player_machines FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.player_recipes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.master_catalog(id),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);
ALTER TABLE public.player_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own recipes readable" ON public.player_recipes;
CREATE POLICY "Own recipes readable" ON public.player_recipes FOR SELECT USING (auth.uid() = user_id);

-- 3. Hàm nội bộ
-- 3 xưởng ăn uống mở ở S4 (KITCHEN_MACHINE_IDS). MAC_01/07/08 mở cùng Lán Thợ (S5).
CREATE OR REPLACE FUNCTION public._kitchen_machines()
RETURNS TEXT[] LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$ SELECT ARRAY['MAC_02', 'MAC_03', 'MAC_04'] $$;

-- CRAFT_MIN_STAGE = 2
CREATE OR REPLACE FUNCTION public._require_kitchen_stage()
RETURNS VOID LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
BEGIN
  IF public.app_game_stage() < 2 THEN
    RAISE EXCEPTION 'Bếp Quê & Xưởng mở ở Giai đoạn 2!';
  END IF;
END;
$$;

-- recipeLock(): NULL = nấu được ở Giai đoạn / cấp hiện tại; ngược lại là lời nhắn từ chối.
CREATE OR REPLACE FUNCTION public._recipe_lock_error(p_item public.master_catalog, p_level INT)
RETURNS TEXT LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
DECLARE
  v_stage INT := public.app_game_stage();
  v_need INT := GREATEST(2, COALESCE(p_item.unlock_wave, 2));
  v_ing RECORD;
BEGIN
  IF p_item.category <> 'RECIPE' OR p_item.machine_id IS NULL THEN
    RETURN 'Món này không nấu được!';
  END IF;
  IF v_stage < v_need THEN
    RETURN format('Món này mở ở Giai đoạn %s!', v_need);
  END IF;
  IF p_item.unlock_level > p_level THEN
    RETURN format('Cần đạt Cấp %s để nấu [%s]!', p_item.unlock_level, p_item.name_vn);
  END IF;
  SELECT m.name_vn, COALESCE(m.unlock_wave, 99) AS wave INTO v_ing
  FROM public.recipe_ingredients ri JOIN public.master_catalog m ON m.id = ri.item_id
  WHERE ri.product_id = p_item.id AND COALESCE(m.unlock_wave, 99) > LEAST(5, GREATEST(1, v_stage))
  ORDER BY ri.item_id
  LIMIT 1;
  IF FOUND THEN
    RETURN format('Cần [%s] — mở ở Đợt %s!', v_ing.name_vn, v_ing.wave);
  END IF;
  RETURN NULL;
END;
$$;

-- STARTER_RECIPE_ID = PROD_01 (Cơm Trắng mở sẵn)
CREATE OR REPLACE FUNCTION public._recipe_known(p_uid UUID, p_product TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$
  SELECT p_product = 'PROD_01'
      OR EXISTS (SELECT 1 FROM public.player_recipes WHERE user_id = p_uid AND product_id = p_product)
$$;

-- 4. Ảnh chụp nông trại: thêm 'machines' và 'recipes' (thân hàm chép từ 0007)
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
        'ready_at', FLOOR(EXTRACT(EPOCH FROM craft_ready_at) * v_ms)
      )) FROM public.player_machines WHERE user_id = p_uid
    ), '{}'::jsonb),
    'recipes', COALESCE((
      SELECT jsonb_agg(product_id ORDER BY product_id) FROM public.player_recipes WHERE user_id = p_uid
    ), '[]'::jsonb)
  );
END;
$$;


-- 5. RPC
-- M04.1 — Xây 1 xưởng ăn uống (mỗi xưởng 1 lần): −buy_cost_gold, +xp_reward.
CREATE OR REPLACE FUNCTION public.rpc_build_machine(p_machine_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
  v_need INT;
BEGIN
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_machine_id AND category = 'MACHINE';
  IF NOT FOUND THEN RAISE EXCEPTION 'Không có xưởng này!'; END IF;
  IF NOT (p_machine_id = ANY(public._kitchen_machines())) THEN
    RAISE EXCEPTION '[%] mở cùng Lán Thợ ở bản sau!', v_item.name_vn;
  END IF;
  v_need := GREATEST(2, COALESCE(v_item.unlock_wave, 2));
  IF public.app_game_stage() < v_need THEN
    RAISE EXCEPTION 'Bếp Quê & Xưởng mở ở Giai đoạn %!', v_need;
  END IF;
  IF v_item.unlock_level > v_p.level THEN
    RAISE EXCEPTION 'Cần đạt Cấp % để xây [%]!', v_item.unlock_level, v_item.name_vn;
  END IF;
  IF EXISTS (SELECT 1 FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id) THEN
    RAISE EXCEPTION 'Đã có [%] rồi!', v_item.name_vn;
  END IF;
  IF v_p.gold < v_item.buy_cost_gold THEN
    RAISE EXCEPTION 'Cần % Xu Vàng để xây [%]!', v_item.buy_cost_gold, v_item.name_vn;
  END IF;
  UPDATE public.profiles SET gold = gold - v_item.buy_cost_gold, updated_at = NOW() WHERE id = v_uid;
  INSERT INTO public.player_machines (user_id, machine_id) VALUES (v_uid, p_machine_id);
  PERFORM public._apply_xp(v_uid, v_item.xp_reward);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M04.3 — Bắt đầu nấu: trừ nguyên liệu, 0⚡, xong sau time_minutes (miền Trung ×0,9).
CREATE OR REPLACE FUNCTION public.rpc_start_craft(p_machine_id TEXT, p_product_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_m public.player_machines%ROWTYPE;
  v_item public.master_catalog%ROWTYPE;
  v_err TEXT;
  v_missing TEXT;
  v_ing RECORD;
  v_factor NUMERIC := CASE WHEN v_p.region = 'CENTRAL' THEN 0.9 ELSE 1 END;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_m FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Hãy xây xưởng này trước!'; END IF;
  IF v_m.craft_item_id IS NOT NULL THEN RAISE EXCEPTION 'Xưởng đang nấu món khác!'; END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_product_id;
  IF NOT FOUND OR v_item.machine_id IS DISTINCT FROM p_machine_id THEN
    RAISE EXCEPTION 'Món này không nấu ở xưởng này!';
  END IF;
  v_err := public._recipe_lock_error(v_item, v_p.level);
  IF v_err IS NOT NULL THEN RAISE EXCEPTION '%', v_err; END IF;
  IF NOT public._recipe_known(v_uid, p_product_id) THEN
    RAISE EXCEPTION 'Chưa biết công thức! Hãy thử phối món ở Nồi Đất trước.';
  END IF;
  SELECT string_agg((ri.qty - COALESCE(inv.quantity, 0)) || ' ' || m.name_vn, ', ' ORDER BY ri.item_id) INTO v_missing
  FROM public.recipe_ingredients ri
  JOIN public.master_catalog m ON m.id = ri.item_id
  LEFT JOIN public.inventories inv ON inv.user_id = v_uid AND inv.item_id = ri.item_id
  WHERE ri.product_id = p_product_id AND COALESCE(inv.quantity, 0) < ri.qty;
  IF v_missing IS NOT NULL THEN RAISE EXCEPTION 'Còn thiếu: %', v_missing; END IF;
  FOR v_ing IN SELECT item_id, qty FROM public.recipe_ingredients WHERE product_id = p_product_id ORDER BY item_id LOOP
    PERFORM public._add_inventory(v_uid, v_ing.item_id, -v_ing.qty);
  END LOOP;
  UPDATE public.player_machines
  SET craft_item_id = p_product_id,
      craft_ready_at = NOW() + make_interval(secs => ROUND(v_item.time_minutes * 60000 * v_factor) / 1000.0)
  WHERE user_id = v_uid AND machine_id = p_machine_id;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Lấy món đã nấu xong: +1 vào Kho, +xp_reward của món.
CREATE OR REPLACE FUNCTION public.rpc_collect_craft(p_machine_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_m public.player_machines%ROWTYPE;
  v_xp INT;
BEGIN
  PERFORM public._require_kitchen_stage();
  SELECT * INTO v_m FROM public.player_machines WHERE user_id = v_uid AND machine_id = p_machine_id FOR UPDATE;
  IF NOT FOUND OR v_m.craft_item_id IS NULL THEN RAISE EXCEPTION 'Xưởng chưa nấu món nào!'; END IF;
  IF NOW() < v_m.craft_ready_at THEN
    RAISE EXCEPTION 'Còn % phút nữa mới xong!', CEIL(EXTRACT(EPOCH FROM (v_m.craft_ready_at - NOW())) / 60);
  END IF;
  SELECT xp_reward INTO v_xp FROM public.master_catalog WHERE id = v_m.craft_item_id;
  UPDATE public.player_machines SET craft_item_id = NULL, craft_ready_at = NULL
  WHERE user_id = v_uid AND machine_id = p_machine_id;
  PERFORM public._add_inventory(v_uid, v_m.craft_item_id, 1);
  PERFORM public._apply_xp(v_uid, COALESCE(v_xp, 0));
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Ăn 1 món: ⚡ = min(trần, ⚡ đã hồi + stamina_delta). ⚡ đầy thì từ chối (không phí món).
CREATE OR REPLACE FUNCTION public.rpc_eat_dish(p_item_id TEXT)
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
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_item_id;
  IF NOT FOUND OR v_item.category <> 'RECIPE' OR v_item.stamina_delta <= 0 THEN
    RAISE EXCEPTION 'Món này không ăn được!';
  END IF;
  SELECT quantity INTO v_have FROM public.inventories WHERE user_id = v_uid AND item_id = p_item_id;
  IF COALESCE(v_have, 0) < 1 THEN RAISE EXCEPTION 'Kho không còn [%]!', v_item.name_vn; END IF;
  PERFORM public._regen_stamina(v_uid);
  SELECT * INTO v_p FROM public.profiles WHERE id = v_uid;
  IF v_p.stamina >= v_p.max_stamina THEN
    RAISE EXCEPTION 'Năng lượng đang đầy, để dành món ăn sau nhé!';
  END IF;
  v_next := LEAST(v_p.max_stamina, v_p.stamina + v_item.stamina_delta);
  UPDATE public.profiles
  SET stamina = v_next,
      stamina_updated_at = CASE WHEN v_next >= v_p.max_stamina THEN NOW() ELSE stamina_updated_at END,
      updated_at = NOW()
  WHERE id = v_uid;
  PERFORM public._add_inventory(v_uid, p_item_id, -1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- M04.2 — Nồi Đất: thử 1–4 nguyên liệu (mảng ID, có thể lặp) đang có trong Kho.
-- Khớp đúng 1 công thức chưa biết → mở công thức, +10💎 +50XP. Nguyên liệu KHÔNG bị tiêu.
CREATE OR REPLACE FUNCTION public.rpc_cook_pot(p_items JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_picked JSONB;
  v_total INT;
  v_short RECORD;
  v_match public.master_catalog%ROWTYPE;
  v_kinds INT;
BEGIN
  PERFORM public._require_kitchen_stage();
  IF NOT EXISTS (SELECT 1 FROM public.player_machines WHERE user_id = v_uid AND machine_id = 'MAC_02') THEN
    RAISE EXCEPTION 'Hãy xây Bếp Củi (có Nồi Đất) trước!';
  END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Bỏ từ 1 đến 4 nguyên liệu vào Nồi Đất!';
  END IF;
  SELECT COALESCE(jsonb_object_agg(item_id, n), '{}'::jsonb), COALESCE(SUM(n), 0) INTO v_picked, v_total
  FROM (
    SELECT value AS item_id, COUNT(*)::INT AS n
    FROM jsonb_array_elements_text(p_items) AS e(value)
    WHERE value <> ''
    GROUP BY value
  ) s;
  IF v_total < 1 OR v_total > 4 THEN RAISE EXCEPTION 'Bỏ từ 1 đến 4 nguyên liệu vào Nồi Đất!'; END IF;
  SELECT COALESCE(m.name_vn, p.key) AS item_id, p.value::INT AS n INTO v_short
  FROM jsonb_each_text(v_picked) p
  LEFT JOIN public.master_catalog m ON m.id = p.key
  LEFT JOIN public.inventories inv ON inv.user_id = v_uid AND inv.item_id = p.key
  WHERE COALESCE(inv.quantity, 0) < p.value::INT
  ORDER BY p.key
  LIMIT 1;
  IF FOUND THEN RAISE EXCEPTION 'Kho không đủ % %!', v_short.n, v_short.item_id; END IF;

  SELECT COUNT(*) INTO v_kinds FROM jsonb_object_keys(v_picked);
  SELECT m.* INTO v_match
  FROM public.master_catalog m
  WHERE m.category = 'RECIPE'
    AND m.machine_id = ANY(public._kitchen_machines())
    AND public._recipe_lock_error(m, v_p.level) IS NULL
    AND (SELECT COUNT(*) FROM public.recipe_ingredients ri WHERE ri.product_id = m.id) = v_kinds
    AND NOT EXISTS (
      SELECT 1 FROM public.recipe_ingredients ri
      WHERE ri.product_id = m.id AND ri.qty IS DISTINCT FROM (v_picked->>ri.item_id)::INT
    )
  ORDER BY m.id
  LIMIT 1;

  IF FOUND THEN
    IF public._recipe_known(v_uid, v_match.id) THEN
      RAISE EXCEPTION 'Đã biết món [%] rồi — nấu ở Sổ Tay nhé!', v_match.name_vn;
    END IF;
    INSERT INTO public.player_recipes (user_id, product_id) VALUES (v_uid, v_match.id);
    UPDATE public.profiles SET gems = gems + 10, updated_at = NOW() WHERE id = v_uid;
    PERFORM public._apply_xp(v_uid, 50);
    RETURN public._farm_snapshot(v_uid);
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.master_catalog m
    WHERE m.category = 'RECIPE'
      AND m.machine_id = ANY(public._kitchen_machines())
      AND public._recipe_lock_error(m, v_p.level) IS NULL
      AND NOT public._recipe_known(v_uid, m.id)
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_each_text(v_picked) p
        WHERE p.value::INT > COALESCE(
          (SELECT ri.qty FROM public.recipe_ingredients ri WHERE ri.product_id = m.id AND ri.item_id = p.key), 0)
      )
  ) THEN
    RAISE EXCEPTION 'Có mùi rồi! Thêm nguyên liệu nữa thử xem.';
  END IF;
  RAISE EXCEPTION 'Chưa thành món. Xem gợi ý trong Sổ Tay nhé!';
END;
$$;

-- 6. Quyền: hàm nội bộ đóng hẳn; RPC chỉ cho authenticated (kể cả Khách ẩn danh)
REVOKE ALL ON FUNCTION public._kitchen_machines() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._require_kitchen_stage() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._recipe_lock_error(public.master_catalog, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._recipe_known(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.player_machines, public.player_recipes FROM anon;
DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_build_machine(TEXT)',
    'public.rpc_start_craft(TEXT, TEXT)',
    'public.rpc_collect_craft(TEXT)',
    'public.rpc_eat_dish(TEXT)',
    'public.rpc_cook_pot(JSONB)'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
