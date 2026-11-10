/**
 * P1-4 — nối bản đồ điền trang với trạng thái engine: ô ruộng `F` ↔ `FarmTileEntity`,
 * ký hiệu bản đồ ↔ loại đối tượng (GP-02). Thuần, không Phaser.
 */
import { GAME_CATALOG } from '../../data/masterData';
import { CROP_SEASONS } from '../../data/seasons';
import type { CatalogItem } from '../../data/types';
import { newFarmSave } from '../../engine/applyActions';
import type { FarmSave } from '../../domain/farm';
import { canPlant } from '../../domain/progression';
import { canSowInSeason, seasonAt } from '../../domain/season';
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

/** Giống gieo được ngay: cây (`CROP_`) đủ cấp, Đợt, miền và đúng mùa hiện tại (GP-20). */
export function sowableSeeds(save: FarmSave, now: number): CatalogItem[] {
  const season = seasonAt(now).season;
  return GAME_CATALOG.filter(
    (c) =>
      c.id.startsWith('CROP_') &&
      canPlant(c, save.level, SLICE_GAME_STAGE, save.region).ok &&
      canSowInSeason(CROP_SEASONS[c.id], season),
  );
}
