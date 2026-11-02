-- =============================================================================
-- HƯƠNG ĐỒNG GIÓ NỘI (VAC ONLINE)
-- 0004_farm_core.sql — Sprint S1: vòng chơi Vườn – Ao – Chuồng GĐ1 tính trên server.
--
-- Mọi thao tác dính tới vàng / XP / kho được tính ở đây bằng auth.uid() và NOW().
-- Luật PHẢI khớp src/domain/farm.ts + progression.ts + stamina.ts (cùng số liệu, cùng thứ tự).
-- Test: supabase/tests/farm_core.test.sql (npm run test:sql).
--
-- Additive-Only (RULE D1 / C13): chỉ ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS,
-- CREATE OR REPLACE FUNCTION, GRANT/REVOKE, policy. Chạy lại nhiều lần an toàn.
-- Chạy SAU 0003. Sau đó chạy supabase/seed/master_catalog_seed.sql và quest_catalog_seed.sql.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CỘT MỚI CHO HỒ SƠ NGƯỜI CHƠI
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wild_plots_unlocked INT NOT NULL DEFAULT 12;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pond_mud_counter INT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stamina_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rookie_days_claimed INT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rookie_last_claim_on DATE DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_bonus_claimed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_as_guest BOOLEAN NOT NULL DEFAULT FALSE;

-- -----------------------------------------------------------------------------
-- 2. NHIỆM VỤ CỐT TRUYỆN (10 Chương Gia Phả)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quest_catalog (
  id TEXT PRIMARY KEY,
  chapter_no INT NOT NULL,
  unlock_stage INT NOT NULL,
  min_level INT NOT NULL DEFAULT 1,
  reward_gold INT NOT NULL DEFAULT 0,
  reward_gems INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.quest_claims (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL REFERENCES public.quest_catalog(id),
  choice TEXT NOT NULL CHECK (choice IN ('EMP', 'PRAG')),
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, quest_id)
);

ALTER TABLE public.quest_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Quest catalog readable" ON public.quest_catalog;
CREATE POLICY "Quest catalog readable" ON public.quest_catalog FOR SELECT USING (true);
DROP POLICY IF EXISTS "Own quest claims readable" ON public.quest_claims;
CREATE POLICY "Own quest claims readable" ON public.quest_claims FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. HỒ SƠ MỚI GHI NHẬN NGƯỜI CHƠI KHÁCH (ẩn danh) — thay bản ở 0003
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_meta JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_base TEXT;
  v_gender TEXT := CASE WHEN v_meta->>'gender' = 'MALE' THEN 'MALE' ELSE 'FEMALE' END;
  v_region TEXT := CASE WHEN v_meta->>'region' IN ('NORTH', 'CENTRAL', 'SOUTH') THEN v_meta->>'region' ELSE 'NORTH' END;
  v_guest BOOLEAN := COALESCE(NEW.is_anonymous, FALSE);
BEGIN
  v_base := LEFT(regexp_replace(COALESCE(NULLIF(TRIM(v_meta->>'player_name'), ''), 'Điền Chủ'), '[<>]', '', 'g'), 32);
  IF v_base = '' THEN
    v_base := 'Điền Chủ';
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, username, gender, region, created_as_guest)
    VALUES (NEW.id, v_base, v_gender, v_region, v_guest)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN unique_violation THEN
    INSERT INTO public.profiles (id, username, gender, region, created_as_guest)
    VALUES (NEW.id, v_base || ' #' || LEFT(REPLACE(NEW.id::TEXT, '-', ''), 6), v_gender, v_region, v_guest)
    ON CONFLICT (id) DO NOTHING;
  END;
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. HÀM NỘI BỘ (không cấp quyền gọi trực tiếp cho client)
-- -----------------------------------------------------------------------------

-- Giai đoạn phát hành đang mở (khớp VITE_GAME_STAGE của bản client đang chạy).
CREATE OR REPLACE FUNCTION public.app_game_stage()
RETURNS INT LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$ SELECT 1 $$;

-- XP từ cấp L lên L+1 = round(60 × L^1.5)  (src/domain/progression.ts xpToNext)
CREATE OR REPLACE FUNCTION public._xp_to_next(p_level INT)
RETURNS INT LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$ SELECT ROUND(60 * POWER(GREATEST(1, p_level)::NUMERIC, 1.5))::INT $$;

CREATE OR REPLACE FUNCTION public._require_uid()
RETURNS UUID LANGUAGE plpgsql STABLE SET search_path = public, pg_temp
AS $$
DECLARE v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Cần đăng nhập (kể cả Khách ẩn danh)' USING ERRCODE = '42501';
  END IF;
  RETURN v_uid;
END;
$$;

-- Khóa & trả về hồ sơ (bắt buộc gọi đầu mỗi RPC để tuần tự hóa thao tác của 1 người chơi).
CREATE OR REPLACE FUNCTION public._lock_profile(p_uid UUID)
RETURNS public.profiles LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE v_p public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_p FROM public.profiles WHERE id = p_uid FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Chưa có hồ sơ người chơi';
  END IF;
  RETURN v_p;
END;
$$;

-- Hồi năng lượng +1 / 180 giây (src/domain/stamina.ts regenStamina). Hồ sơ phải đang bị khóa.
CREATE OR REPLACE FUNCTION public._regen_stamina(p_uid UUID)
RETURNS VOID LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE
  v_p public.profiles%ROWTYPE;
  v_ticks BIGINT;
  v_next INT;
BEGIN
  SELECT * INTO v_p FROM public.profiles WHERE id = p_uid;
  IF v_p.stamina >= v_p.max_stamina THEN
    UPDATE public.profiles SET stamina_updated_at = NOW() WHERE id = p_uid;
    RETURN;
  END IF;
  v_ticks := FLOOR(GREATEST(0, EXTRACT(EPOCH FROM (NOW() - v_p.stamina_updated_at))) / 180);
  IF v_ticks <= 0 THEN
    RETURN;
  END IF;
  v_next := LEAST(v_p.max_stamina, v_p.stamina + v_ticks);
  UPDATE public.profiles
  SET stamina = v_next,
      stamina_updated_at = CASE WHEN v_next >= v_p.max_stamina THEN NOW()
                                ELSE v_p.stamina_updated_at + v_ticks * INTERVAL '180 seconds' END
  WHERE id = p_uid;
END;
$$;

-- Tiêu năng lượng sau khi đã hồi (src/domain/farm.ts spendStamina).
CREATE OR REPLACE FUNCTION public._spend_stamina(p_uid UUID, p_amount INT, p_message TEXT)
RETURNS VOID LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE v_p public.profiles%ROWTYPE;
BEGIN
  PERFORM public._regen_stamina(p_uid);
  SELECT * INTO v_p FROM public.profiles WHERE id = p_uid;
  IF v_p.stamina < p_amount THEN
    RAISE EXCEPTION '%', p_message;
  END IF;
  UPDATE public.profiles
  SET stamina = stamina - p_amount,
      stamina_updated_at = CASE WHEN v_p.stamina >= v_p.max_stamina THEN NOW() ELSE stamina_updated_at END
  WHERE id = p_uid;
END;
$$;

-- Cộng XP, lên nhiều cấp một lúc, tối đa Lv.60 (src/domain/progression.ts applyXp).
CREATE OR REPLACE FUNCTION public._apply_xp(p_uid UUID, p_gain INT)
RETURNS VOID LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE
  v_level INT;
  v_xp BIGINT;
BEGIN
  SELECT level, xp INTO v_level, v_xp FROM public.profiles WHERE id = p_uid;
  v_level := GREATEST(1, v_level);
  v_xp := GREATEST(0, v_xp) + GREATEST(0, p_gain);
  WHILE v_level < 60 AND v_xp >= public._xp_to_next(v_level) LOOP
    v_xp := v_xp - public._xp_to_next(v_level);
    v_level := v_level + 1;
  END LOOP;
  UPDATE public.profiles SET level = v_level, xp = v_xp, updated_at = NOW() WHERE id = p_uid;
END;
$$;

CREATE OR REPLACE FUNCTION public._add_inventory(p_uid UUID, p_item TEXT, p_delta INT)
RETURNS VOID LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE v_have INT;
BEGIN
  SELECT quantity INTO v_have FROM public.inventories WHERE user_id = p_uid AND item_id = p_item FOR UPDATE;
  IF COALESCE(v_have, 0) + p_delta < 0 THEN
    RAISE EXCEPTION 'Kho không đủ %', p_item;
  END IF;
  IF v_have IS NOT NULL THEN
    UPDATE public.inventories SET quantity = quantity + p_delta WHERE user_id = p_uid AND item_id = p_item;
  ELSIF p_delta > 0 THEN
    INSERT INTO public.inventories (user_id, item_id, quantity)
    VALUES (p_uid, p_item, p_delta)
    ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = public.inventories.quantity + p_delta;
  END IF;
END;
$$;

-- Ảnh chụp toàn bộ nông trại của 1 người chơi — mọi RPC trả về cái này.
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
    ), '{}'::jsonb)
  );
END;
$$;

-- Ô đất của người chơi (lưới 4 cột × 3 hàng của FarmScene). Khóa dòng nếu có.
CREATE OR REPLACE FUNCTION public._lock_tile(p_uid UUID, p_x INT, p_y INT)
RETURNS public.farm_entities LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE v_e public.farm_entities%ROWTYPE;
BEGIN
  IF p_x IS NULL OR p_y IS NULL OR p_x NOT BETWEEN 0 AND 3 OR p_y NOT BETWEEN 0 AND 2 THEN
    RAISE EXCEPTION 'Ô đất không hợp lệ';
  END IF;
  SELECT * INTO v_e FROM public.farm_entities
  WHERE user_id = p_uid AND tile_x = p_x AND tile_y = p_y FOR UPDATE;
  RETURN v_e;
END;
$$;

REVOKE ALL ON FUNCTION public._xp_to_next(INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._require_uid() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._lock_profile(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._regen_stamina(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._spend_stamina(UUID, INT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._apply_xp(UUID, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._add_inventory(UUID, TEXT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._farm_snapshot(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._lock_tile(UUID, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_game_stage() TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. RPC CHO CLIENT (SECURITY DEFINER, chỉ authenticated — kể cả Khách ẩn danh)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.rpc_get_my_farm()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE v_uid UUID := public._require_uid();
BEGIN
  PERFORM public._lock_profile(v_uid);
  PERFORM public._regen_stamina(v_uid);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Đặt tên / giới tính / quê hương — chỉ khi vừa bắt đầu (Lv.1, 0 XP).
CREATE OR REPLACE FUNCTION public.rpc_set_profile_basics(p_name TEXT, p_gender TEXT, p_region TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_name TEXT := LEFT(regexp_replace(COALESCE(NULLIF(TRIM(p_name), ''), v_p.username), '[<>]', '', 'g'), 32);
BEGIN
  IF v_p.level > 1 OR v_p.xp > 0 THEN
    RAISE EXCEPTION 'Chỉ đổi được quê hương khi vừa bắt đầu (Lv.1)';
  END IF;
  IF p_gender NOT IN ('MALE', 'FEMALE') OR p_region NOT IN ('NORTH', 'CENTRAL', 'SOUTH') THEN
    RAISE EXCEPTION 'Giới tính / Quê hương không hợp lệ';
  END IF;
  BEGIN
    UPDATE public.profiles SET username = v_name, gender = p_gender, region = p_region, updated_at = NOW() WHERE id = v_uid;
  EXCEPTION WHEN unique_violation THEN
    UPDATE public.profiles
    SET username = v_name || ' #' || LEFT(REPLACE(v_uid::TEXT, '-', ''), 6), gender = p_gender, region = p_region, updated_at = NOW()
    WHERE id = v_uid;
  END;
  RETURN public._farm_snapshot(v_uid);
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
  v_ms := ROUND(GREATEST(1, v_item.time_minutes) * 60000
                * CASE WHEN v_p.region = 'NORTH' AND v_item.category = 'CROP' THEN 0.9 ELSE 1 END);
  v_zone := CASE WHEN v_item.category = 'MUTANT_CROP' THEN 'CROP' ELSE v_item.category END;

  UPDATE public.profiles SET gold = gold - v_item.buy_cost_gold, updated_at = NOW() WHERE id = v_uid;
  INSERT INTO public.farm_entities (
    user_id, tile_x, tile_y, zone_type, entity_id, planted_at, mature_at,
    watered, alluvial_mud_applied, is_golden, total_yield, remaining_yield
  ) VALUES (
    v_uid, p_x, p_y, v_zone, v_item.id, NOW(), NOW() + v_ms * INTERVAL '1 millisecond',
    FALSE, FALSE, FALSE, v_item.yield_count, v_item.yield_count
  );
  RETURN public._farm_snapshot(v_uid);
END;
$$;

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
  IF v_item.category = 'AQUA' OR p_y = 2 THEN
    UPDATE public.profiles SET pond_mud_counter = LEAST(10, pond_mud_counter + 1) WHERE id = v_uid;
  END IF;
  DELETE FROM public.farm_entities WHERE id = v_e.id;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_sell_to_htx(p_item_id TEXT, p_qty INT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_item public.master_catalog%ROWTYPE;
BEGIN
  IF p_qty IS NULL OR p_qty <= 0 OR p_qty > 100000 THEN
    RAISE EXCEPTION 'Số lượng bán không hợp lệ!';
  END IF;
  SELECT * INTO v_item FROM public.master_catalog WHERE id = p_item_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Vật phẩm không có trong danh mục!'; END IF;
  IF v_item.base_sell_gold <= 0 THEN RAISE EXCEPTION 'HTX không thu mua [%]!', v_item.name_vn; END IF;
  PERFORM public._add_inventory(v_uid, p_item_id, -p_qty);
  UPDATE public.profiles SET gold = gold + v_item.base_sell_gold * p_qty, updated_at = NOW() WHERE id = v_uid;
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
  RETURN public._farm_snapshot(v_uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_expand_land()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
BEGIN
  IF v_p.wild_plots_unlocked >= 25 THEN
    RAISE EXCEPTION 'Đã khai hoang tối đa 25/25 Phân khu VAC!';
  END IF;
  IF v_p.gold < 500 THEN
    RAISE EXCEPTION 'Cần 5 Năng lượng và 500 Xu Vàng để khai hoang!';
  END IF;
  PERFORM public._spend_stamina(v_uid, 5, 'Cần 5 Năng lượng và 500 Xu Vàng để khai hoang!');
  UPDATE public.profiles
  SET gold = gold - 500,
      wild_plots_unlocked = wild_plots_unlocked + 1,
      feng_shui_score = feng_shui_score + 25,
      updated_at = NOW()
  WHERE id = v_uid;
  PERFORM public._apply_xp(v_uid, 45);
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Nhận thưởng 1 chương cốt truyện (src/data/quests.ts QUEST_BRANCH_REWARDS, QUEST_XP_REWARD).
CREATE OR REPLACE FUNCTION public.rpc_claim_story_quest(p_quest_id TEXT, p_choice TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_q public.quest_catalog%ROWTYPE;
BEGIN
  IF p_choice NOT IN ('EMP', 'PRAG') THEN RAISE EXCEPTION 'Lựa chọn không hợp lệ'; END IF;
  SELECT * INTO v_q FROM public.quest_catalog WHERE id = p_quest_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Không có chương này'; END IF;
  IF v_q.unlock_stage > public.app_game_stage() THEN RAISE EXCEPTION 'Chương này chưa mở'; END IF;
  IF v_p.level < v_q.min_level THEN RAISE EXCEPTION 'Cần đạt Lv.% để nhận chương này', v_q.min_level; END IF;
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

-- Quà 7 ngày tân thủ: 1 lần / ngày (giờ Việt Nam), tối đa 7 ngày.
CREATE OR REPLACE FUNCTION public.rpc_claim_rookie_day()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
BEGIN
  IF v_p.rookie_days_claimed >= 7 THEN RAISE EXCEPTION 'Bạn đã nhận trọn bộ Quà 7 Ngày Tân Thủ!'; END IF;
  IF v_p.rookie_last_claim_on = v_today THEN RAISE EXCEPTION 'Hôm nay đã nhận quà rồi, mai quay lại nhé!'; END IF;
  UPDATE public.profiles
  SET gold = gold + 1000, gems = gems + 20,
      rookie_days_claimed = rookie_days_claimed + 1, rookie_last_claim_on = v_today, updated_at = NOW()
  WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Thưởng tài khoản chính thức (1 lần): đăng ký mới +500🪙; Khách đã liên kết +1.000🪙 +50💎.
CREATE OR REPLACE FUNCTION public.rpc_claim_account_bonus()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := public._require_uid();
  v_p public.profiles%ROWTYPE := public._lock_profile(v_uid);
  v_anon BOOLEAN;
BEGIN
  SELECT COALESCE(is_anonymous, FALSE) INTO v_anon FROM auth.users WHERE id = v_uid;
  IF v_anon THEN RAISE EXCEPTION 'Hãy liên kết email để nhận thưởng tài khoản'; END IF;
  IF v_p.account_bonus_claimed THEN RAISE EXCEPTION 'Đã nhận thưởng tài khoản rồi!'; END IF;
  UPDATE public.profiles
  SET gold = gold + CASE WHEN v_p.created_as_guest THEN 1000 ELSE 500 END,
      gems = gems + CASE WHEN v_p.created_as_guest THEN 50 ELSE 0 END,
      account_bonus_claimed = TRUE,
      updated_at = NOW()
  WHERE id = v_uid;
  RETURN public._farm_snapshot(v_uid);
END;
$$;

-- Quyền gọi: chỉ người đã đăng nhập (Supabase cấp role authenticated cho cả Khách ẩn danh).
DO $$
DECLARE
  v_sig TEXT;
BEGIN
  FOREACH v_sig IN ARRAY ARRAY[
    'public.rpc_get_my_farm()',
    'public.rpc_set_profile_basics(TEXT, TEXT, TEXT)',
    'public.rpc_plant(INT, INT, TEXT)',
    'public.rpc_water(INT, INT)',
    'public.rpc_apply_mud(INT, INT)',
    'public.rpc_harvest(INT, INT)',
    'public.rpc_sell_to_htx(TEXT, INT)',
    'public.rpc_dredge_pond()',
    'public.rpc_expand_land()',
    'public.rpc_claim_story_quest(TEXT, TEXT)',
    'public.rpc_claim_rookie_day()',
    'public.rpc_claim_account_bonus()'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', v_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', v_sig);
  END LOOP;
END $$;
