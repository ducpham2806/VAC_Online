import { CatalogItem, RegionType } from '../data/types';

/**
 * Tiến trình cấp độ & mở khóa (17_PROJECT_AUDIT C1). SQL: public._xp_to_next / public._apply_xp
 * trong migration 0004 dùng ĐÚNG công thức này — sửa ở đây thì phải sửa cả SQL.
 */
export const MAX_LEVEL = 60;

/** XP cần để đi từ cấp `level` lên `level + 1` = round(60 × level^1.5). */
export function xpToNext(level: number): number {
  return Math.round(60 * Math.pow(Math.max(1, level), 1.5));
}

/** Cộng XP, lên được nhiều cấp một lúc; `xp` là XP còn dư trong cấp hiện tại. */
export function applyXp(level: number, xp: number, gain: number): { level: number; xp: number; levelsGained: number } {
  let lv = Math.max(1, level);
  let cur = Math.max(0, xp) + Math.max(0, gain);
  let gained = 0;
  while (lv < MAX_LEVEL && cur >= xpToNext(lv)) {
    cur -= xpToNext(lv);
    lv += 1;
    gained += 1;
  }
  return { level: lv, xp: cur, levelsGained: gained };
}

/** Đợt V-A-C cao nhất đang mở theo Giai đoạn phát hành (GĐ1→Đợt 1 … GĐ5+→Đợt 5). */
export function maxUnlockedWave(gameStage: number): number {
  return Math.max(1, Math.min(5, gameStage));
}

export const PLANTABLE_CATEGORIES: ReadonlyArray<CatalogItem['category']> = [
  'CROP',
  'TREE',
  'MUTANT_CROP',
  'ANIMAL',
  'AQUA',
];

export function isPlantable(item: CatalogItem): boolean {
  return PLANTABLE_CATEGORIES.includes(item.category);
}

export type PlantLock =
  | { ok: true }
  | { ok: false; reason: 'NOT_PLANTABLE' | 'WAVE_LOCKED' | 'LEVEL_LOCKED' | 'REGION_LOCKED' };

/**
 * Có được gieo/thả loài này không: đúng Đợt đang mở, đủ cấp, và đặc sản vùng chỉ trồng ở
 * đúng miền của mình (01_MASTER_GDD 2.1 — 70% chung / 30% độc quyền).
 */
export function canPlant(item: CatalogItem, level: number, gameStage: number, region: RegionType): PlantLock {
  if (!isPlantable(item)) return { ok: false, reason: 'NOT_PLANTABLE' };
  if (item.region !== 'ALL' && item.region !== region) return { ok: false, reason: 'REGION_LOCKED' };
  if ((item.unlockWave ?? 99) > maxUnlockedWave(gameStage)) return { ok: false, reason: 'WAVE_LOCKED' };
  if (item.unlockLevel > level) return { ok: false, reason: 'LEVEL_LOCKED' };
  return { ok: true };
}
