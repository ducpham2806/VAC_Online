-- =============================================================================
-- HƯƠNG ĐỒNG GIÓ NỘI (VAC ONLINE - GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)
-- 0002_seed_full_master_data.sql
-- Bảng Đại Từ Điển Thực Thể (master_catalog) + RPC Đồng Bộ 155 Thực Thể, Chợ & Lưu Bút
-- Chạy an toàn nhiều lần (Idempotent 100%) trong Supabase SQL Editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.master_catalog (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  sub_group TEXT DEFAULT NULL,
  name_vn TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'ALL',
  unlock_level INT NOT NULL DEFAULT 1,
  time_minutes INT NOT NULL DEFAULT 0,
  buy_cost_gold INT NOT NULL DEFAULT 0,
  input_ingredients TEXT DEFAULT NULL,
  yield_count INT NOT NULL DEFAULT 1,
  base_sell_gold INT NOT NULL DEFAULT 0,
  max_market_gold INT NOT NULL DEFAULT 0,
  xp_reward INT NOT NULL DEFAULT 0,
  stamina_delta INT NOT NULL DEFAULT 0,
  emoji TEXT NOT NULL DEFAULT '🌾',
  description TEXT DEFAULT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.master_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public master catalog readable" ON public.master_catalog;
CREATE POLICY "Public master catalog readable" ON public.master_catalog FOR SELECT USING (true);

-- Đảm bảo bảng market_listings & farm_guestbook cho phép khách chơi nhanh (nullable UUID)
ALTER TABLE public.market_listings ALTER COLUMN seller_id DROP NOT NULL;
ALTER TABLE public.market_listings ADD COLUMN IF NOT EXISTS seller_name TEXT NOT NULL DEFAULT 'Hợp Tác Xã Ba Miền';

ALTER TABLE public.farm_guestbook ALTER COLUMN host_user_id DROP NOT NULL;
ALTER TABLE public.farm_guestbook ALTER COLUMN visitor_user_id DROP NOT NULL;
ALTER TABLE public.farm_guestbook ADD COLUMN IF NOT EXISTS host_name TEXT NOT NULL DEFAULT 'Tư Hậu Lập Nghiệp';

-- =============================================================================
-- RPC 1: ĐỒNG BỘ TRỌN BỘ 155 THỰC THỂ TỪ CLIENT LÊN SUPABASE CLOUD (SECURITY DEFINER)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.rpc_sync_master_catalog(
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_count INT := 0;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.master_catalog (
      id, category, sub_group, name_vn, region, unlock_level,
      time_minutes, buy_cost_gold, input_ingredients, yield_count,
      base_sell_gold, max_market_gold, xp_reward, stamina_delta, emoji, description, updated_at
    )
    VALUES (
      v_item->>'id',
      v_item->>'category',
      v_item->>'subGroup',
      v_item->>'name',
      COALESCE(v_item->>'region', 'ALL'),
      COALESCE((v_item->>'unlockLevel')::INT, 1),
      COALESCE((v_item->>'growOrCraftMinutes')::INT, 0),
      COALESCE((v_item->>'buyCostGold')::INT, 0),
      v_item->>'inputIngredients',
      COALESCE((v_item->>'yieldCount')::INT, 1),
      COALESCE((v_item->>'baseSellGold')::INT, 0),
      COALESCE((v_item->>'maxMarketGold')::INT, COALESCE((v_item->>'baseSellGold')::INT, 0) * 2),
      COALESCE((v_item->>'xpReward')::INT, 0),
      COALESCE((v_item->>'staminaDelta')::INT, 0),
      COALESCE(v_item->>'emoji', '🌾'),
      v_item->>'description',
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      category = EXCLUDED.category,
      sub_group = EXCLUDED.sub_group,
      name_vn = EXCLUDED.name_vn,
      region = EXCLUDED.region,
      unlock_level = EXCLUDED.unlock_level,
      time_minutes = EXCLUDED.time_minutes,
      buy_cost_gold = EXCLUDED.buy_cost_gold,
      input_ingredients = EXCLUDED.input_ingredients,
      yield_count = EXCLUDED.yield_count,
      base_sell_gold = EXCLUDED.base_sell_gold,
      max_market_gold = EXCLUDED.max_market_gold,
      xp_reward = EXCLUDED.xp_reward,
      stamina_delta = EXCLUDED.stamina_delta,
      emoji = EXCLUDED.emoji,
      description = EXCLUDED.description,
      updated_at = NOW();

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'synced_count', v_count
  );
END;
$$;

-- =============================================================================
-- RPC 2: ĐĂNG BÁN NÔNG SẢN LÊN BÁO CHỢ PHIÊN 3 MIỀN TRÊN SUPABASE CLOUD
-- =============================================================================
CREATE OR REPLACE FUNCTION public.rpc_post_market_listing(
  p_seller_name TEXT,
  p_seller_region TEXT,
  p_item_id TEXT,
  p_quantity INT,
  p_unit_price INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_id UUID;
BEGIN
  IF p_quantity <= 0 OR p_quantity > 50 THEN
    RAISE EXCEPTION 'Số lượng mỗi sạp phải từ 1 đến 50 đơn vị!';
  END IF;

  INSERT INTO public.market_listings (
    seller_name, seller_region, item_id, quantity, unit_price, status
  )
  VALUES (
    p_seller_name, p_seller_region, p_item_id, p_quantity, p_unit_price, 'ACTIVE'
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'listing_id', v_new_id
  );
END;
$$;

-- =============================================================================
-- RPC 3: KÝ SỔ LƯU BÚT CỔNG LÀNG & CHECK-IN NHẬN ĐIỂM MỸ QUAN (NEW_GUEST_01)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.rpc_sign_guestbook(
  p_host_name TEXT,
  p_visitor_name TEXT,
  p_message TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_id UUID;
BEGIN
  INSERT INTO public.farm_guestbook (
    host_name, visitor_name, message
  )
  VALUES (
    p_host_name, p_visitor_name, p_message
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'entry_id', v_new_id
  );
END;
$$;

-- NẠP ĐẦY ĐỦ 8 SẠP HÀNG CHỢ PHIÊN 3 MIỀN LÊN SUPABASE CLOUD
DELETE FROM public.market_listings WHERE seller_id IS NULL;
INSERT INTO public.market_listings (seller_name, seller_region, item_id, quantity, unit_price, status)
VALUES
  ('Út Nhỏ Miền Tây', 'SOUTH', 'CROP_S05', 5, 95, 'ACTIVE'),
  ('A Páo Tây Nguyên', 'CENTRAL', 'CROP_C05', 8, 88, 'ACTIVE'),
  ('Lý Trưởng Kinh Bắc', 'NORTH', 'CROP_N03', 6, 72, 'ACTIVE'),
  ('Cô Ba Lái Thiêu', 'SOUTH', 'CROP_S03', 6, 68, 'ACTIVE'),
  ('Ông Giáo làng Vũ Đại', 'NORTH', 'AQUA_N01', 4, 115, 'ACTIVE'),
  ('O Nhung Phố Hội', 'CENTRAL', 'CROP_C01', 10, 32, 'ACTIVE'),
  ('Chú Sáu Cà Mau', 'SOUTH', 'AQUA_S03', 3, 195, 'ACTIVE'),
  ('Thím Tư Hưng Yên', 'NORTH', 'ANI_N01', 4, 65, 'ACTIVE');

-- NẠP SẴN DỮ LIỆU MẪU SỔ LƯU BÚT CỔNG LÀNG
DELETE FROM public.farm_guestbook WHERE visitor_user_id IS NULL;
INSERT INTO public.farm_guestbook (host_name, visitor_name, message)
VALUES
  ('Tư Hậu Lập Nghiệp', 'Út Nhỏ Miền Tây', 'Vườn vải thiều và đầm sen nhà bạn đẹp quá, mình ghé chụp ảnh check-in tặng +10 Mỹ Quan nè!'),
  ('Tư Hậu Lập Nghiệp', 'Lý Trưởng Kinh Bắc', 'Đã sang dựng giúp giàn bầu sau cơn mưa rào, chúc điền chủ vụ mùa bội thu!');
