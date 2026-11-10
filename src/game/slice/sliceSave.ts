/**
 * P1-4 — nối bản đồ điền trang với trạng thái engine: ô ruộng `F` ↔ `FarmTileEntity`,
 * ký hiệu bản đồ ↔ loại đối tượng (GP-02). Thuần, không Phaser.
 */
import { GAME_CATALOG } from '../../data/masterData';
import { CROP_SEASONS } from '../../data/seasons';
import type { CatalogItem, Season } from '../../data/types';
import { newFarmSave } from '../../engine/applyActions';
import type { FarmSave } from '../../domain/farm';
import { canPlant } from '../../domain/progression';
import { canSowInSeason } from '../../domain/season';
import type { TargetKind } from '../../domain/tools';
import { type EstateState, effectiveCharAt, emptyEstate, emptyPlot, estateOf, plotId, plotPositions } from '../../domain/estate';

/** Bản thử P1 chưa có công tắc giai đoạn: chỉ Đợt 1 (LT-03). */
export const SLICE_GAME_STAGE = 1;

export { plotId };

/** Người chơi mới của bản thử: số ô ruộng = số ô `F` trên bản đồ, còn lại theo `newFarmSave` (KT-01). */
export function newSliceSave(now: number): FarmSave {
  const base = newFarmSave('NORTH', now);
  const estate = emptyEstate();
  return { ...base, estate, tiles: plotPositions(estate).map((t) => emptyPlot(t.x, t.y)) };
}

const KIND: Record<string, TargetKind> = {
  F: 'PLOT',
  w: 'WILD',
  ',': 'COOP',
  P: 'POND',
  R: 'ROCK',
  T: 'TREE',
  H: 'HOUSE',
  W: 'WELL',
};

const NO_ESTATE: EstateState = emptyEstate();

/** Loại đối tượng ở ô (x, y), có tính điền trang: đá/gốc đã dọn → đất trống, vùng đã khai → ô ruộng. */
export function targetAt(x: number, y: number, estate: EstateState = NO_ESTATE): TargetKind {
  return KIND[effectiveCharAt(x, y, estate)] ?? 'GROUND';
}

/** Giống gieo được ngay: cây (`CROP_`) đủ cấp, Đợt, miền và đúng mùa `season` (GP-20). */
export function sowableSeeds(save: FarmSave, season: Season): CatalogItem[] {
  return GAME_CATALOG.filter(
    (c) =>
      c.id.startsWith('CROP_') &&
      canPlant(c, save.level, SLICE_GAME_STAGE, save.region).ok &&
      canSowInSeason(CROP_SEASONS[c.id], season),
  );
}

/**
 * P1-7 — phiên bản dữ liệu lưu cục bộ của bản thử. Tăng khi đổi cấu trúc, kèm nhánh `migrate`.
 * v2 (P1-10): thêm `save.estate`; bản v1 đọc được nguyên (thiếu `estate` = điền trang ban đầu).
 */
export const SLICE_SAVE_VERSION = 2;
export const SLICE_SAVE_KEY = 'vac_slice_save_v1';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/**
 * Bản lưu đọc từ máy: kiểm hình dạng tối thiểu, rồi khớp ô ruộng với bản đồ hiện tại
 * (bản đồ thêm ô `F` → thêm ô trống; bớt ô → bỏ ô đó). Hỏng → `null` để chơi lại từ đầu.
 */
export function reconcileSliceSave(raw: unknown): FarmSave | null {
  if (!isObj(raw) || !Array.isArray(raw.tiles) || typeof raw.gold !== 'number' || typeof raw.level !== 'number' || !isObj(raw.inventory)) {
    return null;
  }
  const save = raw as unknown as FarmSave;
  const estate = estateOf(save);
  const byId = new Map(save.tiles.filter(isObj).map((t) => [t.id, t]));
  return {
    ...save,
    estate,
    tiles: plotPositions(estate).map(({ x, y }) => {
      const t = emptyPlot(x, y);
      const old = byId.get(t.id);
      return old ? { ...t, ...old, tileX: x, tileY: y } : t;
    }),
  };
}
