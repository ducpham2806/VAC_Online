-- =============================================================================
-- HƯƠNG ĐỒNG GIÓ NỘI (VAC ONLINE)
-- 0003_security_hardening.sql — Sprint S0 (xem 17_PROJECT_AUDIT mục A3, B4/B6/B7)
--
-- Mục tiêu: chặn các lỗ hổng ghi dữ liệu bằng khóa public (anon), chốt danh tính bằng
-- auth.uid() trên server, tự tạo hồ sơ người chơi và ẩn tài sản người chơi khỏi người khác.
--
-- Tuân thủ RULE D1 / RULE C13 (Additive-Only): không DROP TABLE / DROP COLUMN, không đổi
-- ID thực thể. Chỉ CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS, CREATE OR REPLACE,
-- GRANT / REVOKE và thay thế policy. Chạy lại nhiều lần an toàn.
-- Chạy SAU 0001 và 0002 trong Supabase SQL Editor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CỘT MỚI (ADDITIVE)
-- -----------------------------------------------------------------------------
ALTER TABLE public.master_catalog ADD COLUMN IF NOT EXISTS unlock_wave INT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS market_listings_status_created_idx
  ON public.market_listings (status, created_at DESC);
CREATE INDEX IF NOT EXISTS farm_guestbook_created_idx
  ON public.farm_guestbook (created_at DESC);
CREATE INDEX IF NOT EXISTS farm_guestbook_visitor_created_idx
  ON public.farm_guestbook (visitor_user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 2. TỰ TẠO HỒ SƠ (profiles) KHI CÓ USER MỚI TRONG auth.users (kể cả user ẩn danh)
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
BEGIN
  v_base := LEFT(regexp_replace(COALESCE(NULLIF(TRIM(v_meta->>'player_name'), ''), 'Điền Chủ'), '[<>]', '', 'g'), 32);
  IF v_base = '' THEN
    v_base := 'Điền Chủ';
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, username, gender, region)
    VALUES (NEW.id, v_base, v_gender, v_region)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN unique_violation THEN
    -- Trùng tên hiển thị: thêm hậu tố từ id để luôn duy nhất
    INSERT INTO public.profiles (id, username, gender, region)
    VALUES (NEW.id, v_base || ' #' || LEFT(REPLACE(NEW.id::TEXT, '-', ''), 6), v_gender, v_region)
    ON CONFLICT (id) DO NOTHING;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bổ sung hồ sơ cho các user đã tồn tại trước khi có trigger
INSERT INTO public.profiles (id, username)
SELECT u.id, 'Điền Chủ #' || LEFT(REPLACE(u.id::TEXT, '-', ''), 6)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. HỒ SƠ: CHỈ CHỦ TÀI KHOẢN ĐỌC ĐƯỢC VÀNG/NGỌC; THÔNG TIN CÔNG KHAI QUA VIEW
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
DROP POLICY IF EXISTS "Own profile readable" ON public.profiles;
CREATE POLICY "Own profile readable" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- View chạy với quyền chủ view (postgres) nên đọc được mọi hồ sơ, nhưng chỉ lộ cột an toàn.
CREATE OR REPLACE VIEW public.public_profile_cards AS
SELECT id, username, gender, region, level, style_score, feng_shui_score, neighbor_points, dinh_lang_stage
FROM public.profiles;
GRANT SELECT ON public.public_profile_cards TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. CỐ ĐỊNH search_path CHO MỌI HÀM SECURITY DEFINER
-- -----------------------------------------------------------------------------
ALTER FUNCTION public.rpc_attempt_steal(UUID, UUID, NUMERIC) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_sell_to_friend_trader(UUID, UUID, INT) SET search_path = public, pg_temp;
ALTER FUNCTION public.rpc_sync_master_catalog(JSONB) SET search_path = public, pg_temp;

-- -----------------------------------------------------------------------------
-- 5. KHÓA CÁC RPC NGUY HIỂM
-- -----------------------------------------------------------------------------
-- 5a. Đồng bộ catalog: chỉ service_role (server / SQL Editor). Trước đây ai có khóa public
--     cũng ghi đè được toàn bộ giá/XP và client tự gọi mỗi lần khởi động.
REVOKE EXECUTE ON FUNCTION public.rpc_sync_master_catalog(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_sync_master_catalog(JSONB) TO service_role;

-- 5b. Trộm & Thương lái: nhận ID người chơi từ client (mạo danh được) và bán không trừ kho.
--     Client chưa dùng 2 hàm này; khóa lại cho tới khi có bản an toàn (Sprint S6).
REVOKE EXECUTE ON FUNCTION public.rpc_attempt_steal(UUID, UUID, NUMERIC) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rpc_sell_to_friend_trader(UUID, UUID, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_attempt_steal(UUID, UUID, NUMERIC) TO service_role;
GRANT EXECUTE ON FUNCTION public.rpc_sell_to_friend_trader(UUID, UUID, INT) TO service_role;

-- -----------------------------------------------------------------------------
-- 6. ĐĂNG BÁN CHỢ PHIÊN: XÁC THỰC auth.uid(), KIỂM ITEM & KẸP GIÁ TRÊN SERVER
--    (giữ nguyên chữ ký hàm cũ để client hiện tại không phải đổi)
-- -----------------------------------------------------------------------------
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
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_base INT;
  v_min INT;
  v_max INT;
  v_price INT;
  v_name TEXT;
  v_new_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Cần đăng nhập (kể cả Khách ẩn danh) để đăng bán';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 50 THEN
    RAISE EXCEPTION 'Số lượng mỗi sạp phải từ 1 đến 50 đơn vị!';
  END IF;

  IF p_seller_region NOT IN ('NORTH', 'CENTRAL', 'SOUTH') THEN
    RAISE EXCEPTION 'Vùng miền không hợp lệ';
  END IF;

  SELECT base_sell_gold INTO v_base FROM public.master_catalog WHERE id = p_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vật phẩm % không có trong danh mục', p_item_id;
  END IF;

  -- Khung giá [0.8x, 2.0x] giống src/domain/market.ts
  v_min := GREATEST(1, FLOOR(v_base * 0.8)::INT);
  v_max := GREATEST(v_min + 2, v_base * 2);
  v_price := LEAST(v_max, GREATEST(v_min, COALESCE(p_unit_price, v_min)));

  v_name := LEFT(regexp_replace(COALESCE(NULLIF(TRIM(p_seller_name), ''), 'Điền Chủ'), '[<>]', '', 'g'), 40);

  INSERT INTO public.market_listings (
    seller_id, seller_name, seller_region, item_id, quantity, unit_price, status
  )
  VALUES (
    v_uid, v_name, p_seller_region, p_item_id, p_quantity, v_price, 'ACTIVE'
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'listing_id', v_new_id,
    'unit_price', v_price
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.rpc_post_market_listing(TEXT, TEXT, TEXT, INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_post_market_listing(TEXT, TEXT, TEXT, INT, INT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. KÝ SỔ LƯU BÚT: XÁC THỰC auth.uid(), GIỚI HẠN ĐỘ DÀI & TẦN SUẤT (5 LỜI / PHÚT)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rpc_sign_guestbook(
  p_host_name TEXT,
  p_visitor_name TEXT,
  p_message TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_recent INT;
  v_message TEXT;
  v_new_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Cần đăng nhập (kể cả Khách ẩn danh) để ký lưu bút';
  END IF;

  v_message := LEFT(regexp_replace(COALESCE(TRIM(p_message), ''), '[<>]', '', 'g'), 200);
  IF v_message = '' THEN
    RAISE EXCEPTION 'Lời lưu bút không được để trống';
  END IF;

  SELECT COUNT(*) INTO v_recent
  FROM public.farm_guestbook
  WHERE visitor_user_id = v_uid AND created_at > NOW() - INTERVAL '1 minute';
  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'Bạn ký lưu bút nhanh quá, nghỉ tay một chút nhé!';
  END IF;

  INSERT INTO public.farm_guestbook (
    visitor_user_id, host_name, visitor_name, message
  )
  VALUES (
    v_uid,
    LEFT(regexp_replace(COALESCE(NULLIF(TRIM(p_host_name), ''), 'Điền Chủ'), '[<>]', '', 'g'), 40),
    LEFT(regexp_replace(COALESCE(NULLIF(TRIM(p_visitor_name), ''), 'Khách Thăm Quê'), '[<>]', '', 'g'), 40),
    v_message
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'entry_id', v_new_id
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.rpc_sign_guestbook(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_sign_guestbook(TEXT, TEXT, TEXT) TO authenticated;
