-- =============================================================================
-- 0007 — MỤC TIÊU NHIỆM VỤ GIA PHẢ ĐO ĐƯỢC (M03.5) — Additive-Only, chạy lại an toàn
-- -----------------------------------------------------------------------------
-- Trước đây rpc_claim_story_quest chỉ kiểm cấp/giai đoạn → nhận thưởng Chương 1 ngay khi vào game.
-- Từ đây server đếm hành động thật (player_counters) và chỉ phát thưởng khi đủ mục tiêu
-- (quest_catalog.objectives, sinh từ src/data/quests.ts bằng npm run seed:catalog).
-- Luật chung phía client: src/domain/quests.ts — sửa một nơi thì sửa cả hai.
-- Khóa bộ đếm: WATER, APPLY_MUD, DREDGE, HARVEST:<item_id>.
-- Chạy SAU 0006. Sau đó chạy lại supabase/seed/quest_catalog_seed.sql (có cột objectives).
-- Thân các hàm dưới đây chép từ 0004 / 0006, chỉ thêm dòng PERFORM _bump_counter / phần kiểm mục tiêu.
-- =============================================================================

-- 1. Bộ đếm hành động của người chơi (chỉ hàm SECURITY DEFINER ghi được)
CREATE TABLE IF NOT EXISTS public.player_counters (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  counter TEXT NOT NULL,
  value INT NOT NULL DEFAULT 0 CHECK (value >= 0),
  PRIMARY KEY (user_id, counter)
);
ALTER TABLE public.player_counters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own counters readable" ON public.player_counters;
CREATE POLICY "Own counters readable" ON public.player_counters FOR SELECT USING (auth.uid() = user_id);

-- 2. Mục tiêu của từng chương: [{"counter": "WATER", "target": 1, "label": "..."}]
ALTER TABLE public.quest_catalog ADD COLUMN IF NOT EXISTS objectives JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 3. Tăng bộ đếm
CREATE OR REPLACE FUNCTION public._bump_counter(p_uid UUID, p_counter TEXT, p_n INT)
RETURNS VOID LANGUAGE sql SET search_path = public, pg_temp
AS $$
  INSERT INTO public.player_counters (user_id, counter, value) VALUES (p_uid, p_counter, GREATEST(0, p_n))
  ON CONFLICT (user_id, counter) DO UPDATE SET value = public.player_counters.value + GREATEST(0, p_n);
$$;

-- 4. Ảnh chụp nông trại: thêm 'counters' để client hiện tiến độ
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
    ), '{}'::jsonb)
  );
END;
$$;

-- 5. Các hành động tăng bộ đếm
CREATE OR REPLACE FUNCTION public.rpc_water(p_x INT, p_y INT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_e public.farm_entities%ROWTYPE := public._lock_tile(v_uid, p_x, p_y);
  v_remaining_ms BIGINT;
BEGIN
  IF v_e.id IS NULL THEN RAISE EXCEPTION 'Ô này chưa gieo gì để tưới!'; END IF;
  IF NOW() >= v_e.mature_at THEN RAISE EXCEPTION 'Đã chín rồi, hãy thu hoạch!'; END IF;
  IF v_e.watered THEN RAISE EXCEPTION 'Ô này đã được tưới trong vụ này rồi!'; END IF;
  -- Giảm 15% thời gian còn lại (src/domain/farm.ts water)
  v_remaining_ms := FLOOR(EXTRACT(EPOCH FROM (v_e.mature_at - NOW())) * 1000);
  UPDATE public.farm_entities
  SET watered = TRUE, mature_at = mature_at - FLOOR(v_remaining_ms * 0.15) * INTERVAL '1 millisecond'
  WHERE id = v_e.id;
  PERFORM public._bump_counter(v_uid, 'WATER', 1);
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

CREATE OR REPLACE FUNCTION public.rpc_dredge_pond()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
BEGIN
  PERFORM public._spend_stamina(v_uid, 3, 'Cần 3 Năng lượng để Vét Bùn Đáy Ao!');
  PERFORM public._add_inventory(v_uid, 'ITEM_BUN_PHU_SA', 3);
  UPDATE public.profiles SET pond_mud_counter = 0 WHERE id = v_uid;
  PERFORM public._apply_xp(v_uid, 20);
  PERFORM public._bump_counter(v_uid, 'DREDGE', 1);
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
  DELETE FROM public.farm_entities WHERE id = v_e.id;
  PERFORM public._bump_counter(v_uid, 'HARVEST:' || v_item.id, 1);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- 6. Nhận thưởng chương: kiểm thêm mục tiêu
CREATE OR REPLACE FUNCTION public.rpc_claim_story_quest(p_quest_id TEXT, p_choice TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_q public.quest_catalog%ROWTYPE;
  v_obj JSONB;
  v_have INT;
BEGIN
  IF p_choice NOT IN ('EMP', 'PRAG') THEN RAISE EXCEPTION 'Lựa chọn không hợp lệ'; END IF;
  SELECT * INTO v_q FROM public.quest_catalog WHERE id = p_quest_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không có chương này'; END IF;
  IF v_q.unlock_stage > public.app_game_stage() THEN RAISE EXCEPTION 'Chương này chưa mở'; END IF;
  IF v_p.level < v_q.min_level THEN RAISE EXCEPTION 'Cần đạt Lv.% để nhận chương này', v_q.min_level; END IF;
  -- 0007: mọi mục tiêu (bộ đếm hành động) phải đủ trước khi phát thưởng
  FOR v_obj IN SELECT * FROM jsonb_array_elements(COALESCE(v_q.objectives, '[]'::jsonb)) LOOP
    SELECT COALESCE(MAX(value), 0) INTO v_have FROM public.player_counters
    WHERE user_id = v_uid AND counter = v_obj->>'counter';
    IF v_have < (v_obj->>'target')::INT THEN
      RAISE EXCEPTION 'Chưa hoàn thành: % (%/%)', v_obj->>'label', v_have, (v_obj->>'target')::INT;
    END IF;
  END LOOP;
  BEGIN
    INSERT INTO public.quest_claims (user_id, quest_id, choice) VALUES (v_uid, v_q.id, p_choice);
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Đã nhận thưởng chương này rồi!';
  END;
  UPDATE public.profiles
  SET gold = gold + v_q.reward_gold + CASE WHEN p_choice = 'PRAG' THEN 350 ELSE 0 END,
      gems = gems + v_q.reward_gems,
      feng_shui_score = feng_shui_score + CASE WHEN p_choice = 'EMP' THEN 30 ELSE 10 END,
      neighbor_points = neighbor_points + CASE WHEN p_choice = 'EMP' THEN 3 ELSE 1 END,
      updated_at = NOW()
  WHERE id = v_uid;
  PERFORM public._apply_xp(v_uid, 100);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

REVOKE ALL ON FUNCTION public._bump_counter(UUID, TEXT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
DO $$
DECLARE v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_water(INT, INT)',
    'public.rpc_apply_mud(INT, INT)',
    'public.rpc_dredge_pond()',
    'public.rpc_harvest(INT, INT)',
    'public.rpc_claim_story_quest(TEXT, TEXT)'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
