-- =============================================================================
-- HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN - VAC ONLINE)
-- SUPABASE POSTGRESQL SCHEMA, RLS & ATOMIC ANTI-CHEAT RPCs (MASTER TECH 4.1)
-- Chạy an toàn nhiều lần (Idempotent 100%) trong Supabase SQL Editor
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG PROFILES (HỒ SƠ ĐIỀN CHỦ & TÀI SẢN)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL DEFAULT 'FEMALE' CHECK (gender IN ('MALE', 'FEMALE')),
  region TEXT NOT NULL DEFAULT 'NORTH' CHECK (region IN ('NORTH', 'CENTRAL', 'SOUTH')),
  level INT NOT NULL DEFAULT 1,
  xp BIGINT NOT NULL DEFAULT 0,
  gold BIGINT NOT NULL DEFAULT 2500 CHECK (gold >= 0),
  gems INT NOT NULL DEFAULT 50 CHECK (gems >= 0),
  stamina INT NOT NULL DEFAULT 50 CHECK (stamina >= 0),
  max_stamina INT NOT NULL DEFAULT 50,
  style_score INT NOT NULL DEFAULT 100,
  feng_shui_score INT NOT NULL DEFAULT 100,
  neighbor_points INT NOT NULL DEFAULT 0,
  dinh_lang_stage INT NOT NULL DEFAULT 0 CHECK (dinh_lang_stage BETWEEN 0 AND 3),
  active_totem_buff TEXT DEFAULT NULL,
  totem_expires_at TIMESTAMPTZ DEFAULT NULL,
  mutant_pity_count INT NOT NULL DEFAULT 0,
  equipped_fashion JSONB NOT NULL DEFAULT '{}'::jsonb,
  worker_pantry_items JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BẢNG INVENTORIES (KHO NÔNG SẢN, MÓN ĂN, ĐỒ BẢO HỘ, THỜI TRANG)
CREATE TABLE IF NOT EXISTS public.inventories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  UNIQUE (user_id, item_id)
);

-- 3. BẢNG FARM_ENTITIES (Ô ĐẤT, CÂY TRỒNG, VẬT NUÔI, AO CÁ TRÊN LƯỚI 32x32)
CREATE TABLE IF NOT EXISTS public.farm_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tile_x INT NOT NULL,
  tile_y INT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('CROP', 'TREE', 'ANIMAL', 'AQUA', 'MACHINE')),
  entity_id TEXT NOT NULL,
  planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mature_at TIMESTAMPTZ NOT NULL,
  watered BOOLEAN NOT NULL DEFAULT FALSE,
  alluvial_mud_applied BOOLEAN NOT NULL DEFAULT FALSE,
  is_golden BOOLEAN NOT NULL DEFAULT FALSE,
  total_yield INT NOT NULL DEFAULT 5,
  remaining_yield INT NOT NULL DEFAULT 5,
  stolen_by UUID[] NOT NULL DEFAULT '{}',
  pond_harvest_counter INT NOT NULL DEFAULT 0,
  UNIQUE (user_id, tile_x, tile_y)
);

-- 4. BẢNG HIRED_WORKERS (6 NHÂN CÔNG LÁN THỢ ĐỒNG QUÊ - MỞ TỪ LV 14+)
CREATE TABLE IF NOT EXISTS public.hired_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_code TEXT NOT NULL CHECK (worker_code IN ('WORK_01', 'WORK_02', 'WORK_03', 'WORK_04', 'WORK_05', 'WORK_06')),
  contract_expires_at TIMESTAMPTZ NOT NULL,
  belly_points INT NOT NULL DEFAULT 100 CHECK (belly_points BETWEEN 0 AND 100),
  morale_points INT NOT NULL DEFAULT 80 CHECK (morale_points BETWEEN 0 AND 100),
  gear_code TEXT DEFAULT NULL,
  gear_expires_at TIMESTAMPTZ DEFAULT NULL,
  assigned_target TEXT DEFAULT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, worker_code)
);

-- 5. BẢNG MARKET_LISTINGS (BÁO CHỢ PHIÊN P2P BA MIỀN - THUẾ 10%)
CREATE TABLE IF NOT EXISTS public.market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL DEFAULT 'Hợp Tác Xã Ba Miền',
  seller_region TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price INT NOT NULL CHECK (unit_price > 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Đảm bảo tương thích nếu bảng market_listings đã được tạo ở lần chạy trước
ALTER TABLE public.market_listings ALTER COLUMN seller_id DROP NOT NULL;
ALTER TABLE public.market_listings ADD COLUMN IF NOT EXISTS seller_name TEXT NOT NULL DEFAULT 'Hợp Tác Xã Ba Miền';

-- 6. BẢNG TRADER_BOOMS (THƯƠNG LÁI ĐỘT XUẤT 09:00 & 20:00 - GIÁ 1.5x -> 3.0x)
CREATE TABLE IF NOT EXISTS public.trader_booms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  multiplier NUMERIC(3,2) NOT NULL CHECK (multiplier BETWEEN 1.50 AND 3.00),
  base_price INT NOT NULL,
  total_quota INT NOT NULL DEFAULT 200,
  remaining_quota INT NOT NULL DEFAULT 200 CHECK (remaining_quota >= 0),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 7. BẢNG FARM_GUESTBOOK (CỘT MỐC CHECK-IN & SỔ LƯU BÚT CỔNG LÀNG)
CREATE TABLE IF NOT EXISTS public.farm_guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS) CHO CẢ 7 BẢNG
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hired_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trader_booms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_guestbook ENABLE ROW LEVEL SECURITY;

-- XÓA POLICY CŨ NẾU ĐÃ TỒN TẠI TRƯỚC KHI TẠO MỚI (IDEMPOTENT)
DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
DROP POLICY IF EXISTS "Own inventory readable" ON public.inventories;
DROP POLICY IF EXISTS "Public farm entities readable for visiting" ON public.farm_entities;
DROP POLICY IF EXISTS "Own workers readable" ON public.hired_workers;
DROP POLICY IF EXISTS "Market listings readable" ON public.market_listings;
DROP POLICY IF EXISTS "Trader booms readable" ON public.trader_booms;
DROP POLICY IF EXISTS "Guestbook readable" ON public.farm_guestbook;

CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Own inventory readable" ON public.inventories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public farm entities readable for visiting" ON public.farm_entities FOR SELECT USING (true);
CREATE POLICY "Own workers readable" ON public.hired_workers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Market listings readable" ON public.market_listings FOR SELECT USING (true);
CREATE POLICY "Trader booms readable" ON public.trader_booms FOR SELECT USING (true);
CREATE POLICY "Guestbook readable" ON public.farm_guestbook FOR SELECT USING (true);

-- =============================================================================
-- CÁC HÀM ATOMIC POSTGRESQL RPC (CHỐNG GIAN LẬN 100% SERVER-AUTHORITATIVE)
-- Lưu ý PL/pgSQL: Ký tự phần trăm trong RAISE EXCEPTION phải viết là %%
-- =============================================================================

-- RPC 1: HÁI TRỘM / CÂU TRỘM NHÀ BẠN BÈ (ZERO-SUM PENALTY & BẢO HIỂM 80%)
CREATE OR REPLACE FUNCTION public.rpc_attempt_steal(
  p_thief_id UUID,
  p_entity_id UUID,
  p_dog_catch_chance NUMERIC DEFAULT 0.45
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_entity public.farm_entities%ROWTYPE;
  v_thief public.profiles%ROWTYPE;
  v_roll NUMERIC;
  v_penalty INT;
  v_host_gain INT;
BEGIN
  SELECT * INTO v_entity FROM public.farm_entities WHERE id = p_entity_id FOR UPDATE;
  SELECT * INTO v_thief FROM public.profiles WHERE id = p_thief_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy ô nông sản hoặc người chơi';
  END IF;

  IF v_thief.stamina < 1 THEN
    RAISE EXCEPTION 'Không đủ Năng lượng (Stamina) để đi trộm';
  END IF;

  IF NOW() < v_entity.mature_at + INTERVAL '3 minutes' THEN
    RAISE EXCEPTION 'Nông sản đang trong 3 phút Ân huệ của chủ nhà!';
  END IF;

  IF p_thief_id = ANY(v_entity.stolen_by) THEN
    RAISE EXCEPTION 'Bạn đã hái trộm ô này trong vụ mùa hiện tại rồi!';
  END IF;

  -- Dùng 80%% trong RAISE EXCEPTION để không bị PL/pgSQL hiểu nhầm là biến format %
  IF v_entity.remaining_yield <= CEIL(v_entity.total_yield * 0.80) THEN
    RAISE EXCEPTION 'Ô đất đã chạm ngưỡng Bảo hiểm 80%% sản lượng tối thiểu cho chủ nhà!';
  END IF;

  -- Trừ 1 Stamina
  UPDATE public.profiles SET stamina = stamina - 1 WHERE id = p_thief_id;

  -- Quay xúc xắc xem Chó Phú Quốc / Ngỗng có bắt được không
  v_roll := random();
  IF v_roll < p_dog_catch_chance THEN
    v_penalty := LEAST(v_thief.gold::INT, 50);
    v_host_gain := FLOOR(v_penalty * 0.90); -- 10% thuế hệ thống đốt tiền

    UPDATE public.profiles SET gold = gold - v_penalty WHERE id = p_thief_id;
    UPDATE public.profiles SET gold = gold + v_host_gain WHERE id = v_entity.user_id;

    -- Thưởng 1 Chiếc Dép Tổ Ong (ITEM_DEP_TO_ONG)
    INSERT INTO public.inventories (user_id, item_id, quantity)
    VALUES (p_thief_id, 'ITEM_DEP_TO_ONG', 1)
    ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = public.inventories.quantity + 1;

    RETURN jsonb_build_object(
      'success', false,
      'caught', true,
      'penalty_gold', v_penalty,
      'message', '🐕 GÂU GÂU! Chó Phú Quốc lao ra cắn mông! Bạn bị rơi mất ' || v_penalty || ' Xu Vàng và rớt lại 1 Chiếc Dép Tổ Ong!'
    );
  ELSE
    UPDATE public.farm_entities
    SET remaining_yield = remaining_yield - 1,
        stolen_by = array_append(stolen_by, p_thief_id)
    WHERE id = p_entity_id;

    INSERT INTO public.inventories (user_id, item_id, quantity)
    VALUES (p_thief_id, v_entity.entity_id, 1)
    ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = public.inventories.quantity + 1;

    RETURN jsonb_build_object(
      'success', true,
      'caught', false,
      'stolen_item', v_entity.entity_id,
      'message', '🥷 Hái trộm thành công +1 ' || v_entity.entity_id || ' ngay trước mũi Nhân công nhà hàng xóm!'
    );
  END IF;
END;
$$;

-- RPC 2: BÁN HÀNG CHO THƯƠNG LÁI ĐỘT XUẤT NHÀ BẠN BÈ (+5% HOA HỒNG CHỦ NHÀ)
CREATE OR REPLACE FUNCTION public.rpc_sell_to_friend_trader(
  p_seller_id UUID,
  p_boom_id UUID,
  p_qty INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_boom public.trader_booms%ROWTYPE;
  v_payout INT;
  v_commission INT;
BEGIN
  IF p_qty <= 0 OR p_qty > 20 THEN
    RAISE EXCEPTION 'Mỗi lượt khách chỉ được bán tối đa 20 đơn vị!';
  END IF;

  SELECT * INTO v_boom FROM public.trader_booms WHERE id = p_boom_id FOR UPDATE;
  IF NOT FOUND OR NOW() > v_boom.expires_at OR v_boom.remaining_quota < p_qty THEN
    RAISE EXCEPTION 'Chuyến xe Thương Lái đã hết hạn hoặc đủ 200 đơn vị!';
  END IF;

  v_payout := ROUND(v_boom.base_price * v_boom.multiplier * p_qty);
  v_commission := ROUND(v_payout * 0.05);

  UPDATE public.trader_booms SET remaining_quota = remaining_quota - p_qty WHERE id = p_boom_id;
  UPDATE public.profiles SET gold = gold + v_payout WHERE id = p_seller_id;

  IF p_seller_id <> v_boom.host_user_id THEN
    UPDATE public.profiles
    SET gold = gold + v_commission,
        neighbor_points = neighbor_points + 1
    WHERE id = v_boom.host_user_id;
  END IF;

  RETURN jsonb_build_object(
    'payout_gold', v_payout,
    'host_commission', v_commission,
    'remaining_quota', v_boom.remaining_quota - p_qty
  );
END;
$$;

-- KHỞI TẠO DỮ LIỆU MẪU SẠP CHỢ PHIÊN 3 MIỀN (NẾU BẢNG ĐANG TRỐNG)
INSERT INTO public.market_listings (seller_name, seller_region, item_id, quantity, unit_price, status)
SELECT * FROM (VALUES
  ('HTX Kinh Bắc', 'NORTH', 'CROP_N01', 5, 195, 'ACTIVE'),
  ('Nông Trang Phố Núi', 'CENTRAL', 'CROP_C01', 4, 240, 'ACTIVE'),
  ('Miệt Vườn Cái Mơn', 'SOUTH', 'CROP_S01', 3, 290, 'ACTIVE')
) AS seed(seller_name, seller_region, item_id, quantity, unit_price, status)
WHERE NOT EXISTS (SELECT 1 FROM public.market_listings LIMIT 1);
