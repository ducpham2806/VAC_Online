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
import { tileAt, tilesOf } from './estateMap';

/** Bản thử P1 chưa có công tắc giai đoạn: chỉ Đợt 1 (LT-03). */
export const SLICE_GAME_STAGE = 1;

export const plotId = (x: number, y: number) => `P${x}_${y}`;

/** Người chơi mới của bản thử: số ô ruộng = số ô `F` trên bản đồ, còn lại theo `newFarmSave` (KT-01). */
export function newSliceSave(now: number): FarmSave {
  const base = newFarmSave('NORTH', now);
  const template = base.tiles[0];
  return {
    ...base,
    tiles: tilesOf('F').map((t) => ({ ...template, id: plotId(t.x, t.y), tileX: t.x, tileY: t.y })),
  };
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

export function targetAt(x: number, y: number): TargetKind {
  return KIND[tileAt(x, y)] ?? 'GROUND';
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

/** P1-7 — phiên bản dữ liệu lưu cục bộ của bản thử. Tăng khi đổi cấu trúc, kèm nhánh `migrate`. */
export const SLICE_SAVE_VERSION = 1;
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
  const fresh = newSliceSave(save.staminaUpdatedAt ?? 0);
  const byId = new Map(save.tiles.filter(isObj).map((t) => [t.id, t]));
  return {
    ...save,
    tiles: fresh.tiles.map((t) => {
      const old = byId.get(t.id);
      return old ? { ...t, ...old, tileX: t.tileX, tileY: t.tileY } : t;
    }),
  };
}
