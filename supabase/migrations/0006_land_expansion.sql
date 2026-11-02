-- =============================================================================
-- 0006 — KHAI HOANG THẬT (M02.4): lưới 5×5, 25 phân khu (Additive-Only, chạy lại an toàn)
-- -----------------------------------------------------------------------------
-- Trước đây rpc_expand_land chỉ tăng profiles.wild_plots_unlocked; _lock_tile vẫn chỉ nhận lưới 4×3.
-- Từ migration này, ô thứ N (theo thứ tự mở) dùng được khi N <= wild_plots_unlocked.
--
-- Bố cục là bản sao của src/domain/farmGrid.ts (PLOT_LAYOUT) — sửa một nơi thì sửa cả hai:
--   Hàng y0 Ruộng: 1  2  3  4 | 13
--   Hàng y1 Vườn : 5  6  7  8 | 14
--   Hàng y2 Ao   : 9 10 11 12 | 15
--   Hàng y3 Ruộng: 16 17 18 19 20
--   Hàng y4 Ao   : 21 22 23 24 25
-- 12 ô gốc giữ nguyên tọa độ nên dữ liệu farm_entities hiện có không cần chuyển.
-- =============================================================================

-- Thứ tự mở 1..25 của một tọa độ; NULL nếu nằm ngoài lưới.
CREATE OR REPLACE FUNCTION public._plot_order(p_x INT, p_y INT)
RETURNS INT LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN p_x IS NULL OR p_y IS NULL OR p_x NOT BETWEEN 0 AND 4 OR p_y NOT BETWEEN 0 AND 4 THEN NULL
    WHEN p_y <= 2 AND p_x <= 3 THEN p_y * 4 + p_x + 1
    WHEN p_y <= 2 THEN 13 + p_y
    ELSE 16 + (p_y - 3) * 5 + p_x
  END;
$$;

-- Ô Ao (hàng 3 và hàng 5): thu hoạch ở đây tăng độ bùn đáy ao.
CREATE OR REPLACE FUNCTION public._is_pond_plot(p_x INT, p_y INT)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE SET search_path = public, pg_temp
AS $$
  SELECT p_y IN (2, 4);
$$;

-- Ô đất của người chơi: phải nằm trong lưới VÀ đã khai hoang. Khóa dòng nếu có.
-- Người gọi (RPC) đã khóa profile trước (_lock_profile) nên đọc wild_plots_unlocked là nhất quán.
CREATE OR REPLACE FUNCTION public._lock_tile(p_uid UUID, p_x INT, p_y INT)
RETURNS public.farm_entities LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
DECLARE
  v_e public.farm_entities%ROWTYPE;
  v_order INT := public._plot_order(p_x, p_y);
  v_unlocked INT;
BEGIN
  IF v_order IS NULL THEN
    RAISE EXCEPTION 'Ô đất không hợp lệ';
  END IF;
  SELECT wild_plots_unlocked INTO v_unlocked FROM public.profiles WHERE id = p_uid;
  IF v_order > COALESCE(v_unlocked, 12) THEN
    RAISE EXCEPTION 'Ô đất chưa khai hoang! Bấm 🪓 Khai Hoang để mở rộng.';
  END IF;
  SELECT * INTO v_e FROM public.farm_entities
  WHERE user_id = p_uid AND tile_x = p_x AND tile_y = p_y FOR UPDATE;
  RETURN v_e;
END;
$$;

-- Thu hoạch: giống 0004, chỉ đổi điều kiện tăng bùn từ "p_y = 2" sang mọi ô Ao (hàng 3 và 5).
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
  RETURN public._farm_snapshot(v_uid);
END;
$$;

REVOKE ALL ON FUNCTION public._plot_order(INT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._is_pond_plot(INT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._lock_tile(UUID, INT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rpc_harvest(INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_harvest(INT, INT) TO authenticated;
