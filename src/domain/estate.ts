/**
 * GP-14 / KT-15 / KT-18 (QD-83) — điền trang: dọn chướng ngại lấy vật liệu, sửa hạng mục, khai hoang theo vùng.
 * Hàm thuần trên `FarmSave` + bố cục `src/data/estateLayout.ts`; engine (ADR-001) gọi, client và Edge Function dùng chung.
 * Luật này chỉ có trong engine mới (không có RPC SQL cũ tương ứng): server chạy cùng file qua Edge Function (P1-8).
 */
import type { FarmTileEntity } from '../data/types';
import { ESTATE_ROWS, layoutCharAt } from '../data/estateLayout';
import { EXPAND_FENG_SHUI, EXPAND_GOLD, EXPAND_STAMINA, EXPAND_XP, type FarmResult, type FarmSave, withRegen } from './farm';
import { applyXp } from './progression';

// ---------------------------------------------------------------- vật liệu (KT-18)
export const MAT_GO = 'MAT_GO';
export const MAT_DA = 'MAT_DA';
export type MaterialId = typeof MAT_GO | typeof MAT_DA;
export const MATERIALS: Record<MaterialId, { name: string; emoji: string }> = {
  MAT_GO: { name: 'Gỗ', emoji: '🪵' },
  MAT_DA: { name: 'Đá', emoji: '🪨' },
};
export const isMaterial = (id: string): id is MaterialId => id === MAT_GO || id === MAT_DA;

// ---------------------------------------------------------------- dọn chướng ngại (KT-18, KT-20)
export type ObstacleKind = 'ROCK' | 'TREE';
export const CLEAR_RULES: Record<ObstacleKind, { stamina: number; item: MaterialId; qty: number; name: string }> = {
  ROCK: { stamina: 2, item: MAT_DA, qty: 3, name: 'tảng đá' },
  TREE: { stamina: 4, item: MAT_GO, qty: 5, name: 'gốc cây' },
};

// ---------------------------------------------------------------- hạng mục (KT-18)
export type StructureId = 'WELL' | 'COOP' | 'HOUSE';
export interface RepairRule {
  name: string;
  gold: number;
  mats: Partial<Record<MaterialId, number>>;
  fengShui: number;
  /** Chức năng mở khi sửa xong (GP-14). */
  unlocks: string;
}
export const REPAIRS: Record<StructureId, RepairRule> = {
  WELL: { name: 'Giếng', gold: 300, mats: { MAT_DA: 4 }, fengShui: 20, unlocks: 'tưới cả loạt khi kéo' },
  COOP: { name: 'Chuồng gà', gold: 400, mats: { MAT_GO: 6 }, fengShui: 30, unlocks: 'nuôi gà (P1-9)' },
  HOUSE: { name: 'Nhà chính', gold: 500, mats: { MAT_GO: 6, MAT_DA: 2 }, fengShui: 40, unlocks: 'Gia Phả Chương 1 (P1-11)' },
};
export const STRUCTURE_CHAR: Record<StructureId, string> = { WELL: 'W', COOP: ',', HOUSE: 'H' };
export const STRUCTURE_IDS: readonly StructureId[] = ['WELL', 'COOP', 'HOUSE'];

// ---------------------------------------------------------------- khai hoang (KT-15)
/** Giá vùng thứ k (k = số vùng đã khai, bắt đầu 0): `EXPAND_GOLD × 1,25^k` (QD-18). */
export const RECLAIM_GROWTH = 1.25;
export const reclaimCost = (k: number) => Math.round(EXPAND_GOLD * RECLAIM_GROWTH ** k);

export interface TilePos {
  x: number;
  y: number;
}

/** Vùng đất hoang mở theo thứ tự cố định (GP-14). */
const REGION_RECTS: readonly { x: number; y: number; w: number; h: number }[] = [
  { x: 8, y: 7, w: 4, h: 2 },
  { x: 5, y: 9, w: 7, h: 2 },
];

function rectTiles(r: { x: number; y: number; w: number; h: number }): TilePos[] {
  const out: TilePos[] = [];
  for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.push({ x, y });
  return out;
}

export const RECLAIM_REGIONS: readonly TilePos[][] = REGION_RECTS.map(rectTiles);

// ---------------------------------------------------------------- trạng thái
export interface EstateState {
  /** Id chướng ngại đã dọn (`R_x_y`, `T_x_y`). */
  cleared: string[];
  repaired: StructureId[];
  /** Số vùng đã khai hoang (theo thứ tự RECLAIM_REGIONS). */
  reclaimed: number;
}

export const emptyEstate = (): EstateState => ({ cleared: [], repaired: [], reclaimed: 0 });

/** Đọc trạng thái điền trang; bản lưu cũ hoặc hỏng → trạng thái ban đầu. */
export function estateOf(save: Pick<FarmSave, 'estate'>): EstateState {
  const e = save.estate;
  if (!e || !Array.isArray(e.cleared) || !Array.isArray(e.repaired) || typeof e.reclaimed !== 'number') {
    return emptyEstate();
  }
  return {
    cleared: e.cleared.filter((id) => OBSTACLES_BY_ID.has(id)),
    repaired: STRUCTURE_IDS.filter((s) => e.repaired.includes(s)),
    reclaimed: Math.max(0, Math.min(RECLAIM_REGIONS.length, Math.floor(e.reclaimed))),
  };
}

export const isRepaired = (save: Pick<FarmSave, 'estate'>, id: StructureId) => estateOf(save).repaired.includes(id);

// ---------------------------------------------------------------- chướng ngại trên bố cục
export interface Obstacle {
  id: string;
  kind: ObstacleKind;
  tiles: TilePos[];
}

/** Đá: mỗi ô `R` một tảng. Cây: mỗi cụm `T` liền nhau một gốc, id theo ô trên-trái. */
function scanObstacles(): Obstacle[] {
  const out: Obstacle[] = [];
  const seen = new Set<string>();
  ESTATE_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === 'R') out.push({ id: `R_${x}_${y}`, kind: 'ROCK', tiles: [{ x, y }] });
      if (ch !== 'T' || seen.has(`${x},${y}`)) continue;
      const tiles: TilePos[] = [];
      const stack: TilePos[] = [{ x, y }];
      seen.add(`${x},${y}`);
      while (stack.length) {
        const t = stack.pop() as TilePos;
        tiles.push(t);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const n = { x: t.x + dx, y: t.y + dy };
          const k = `${n.x},${n.y}`;
          if (!seen.has(k) && layoutCharAt(n.x, n.y) === 'T') {
            seen.add(k);
            stack.push(n);
          }
        }
      }
      const minX = Math.min(...tiles.map((t) => t.x));
      const minY = Math.min(...tiles.map((t) => t.y));
      out.push({ id: `T_${minX}_${minY}`, kind: 'TREE', tiles });
    }
  });
  return out;
}

export const OBSTACLES: readonly Obstacle[] = scanObstacles();
const OBSTACLES_BY_ID = new Map(OBSTACLES.map((o) => [o.id, o]));
const OBSTACLE_AT = new Map(OBSTACLES.flatMap((o) => o.tiles.map((t) => [`${t.x},${t.y}`, o] as const)));

export const obstacleAt = (x: number, y: number): Obstacle | undefined => OBSTACLE_AT.get(`${x},${y}`);

export function structureAt(x: number, y: number): StructureId | undefined {
  const ch = layoutCharAt(x, y);
  return STRUCTURE_IDS.find((s) => STRUCTURE_CHAR[s] === ch);
}

/** Chỉ số vùng (0-based) chứa ô (x, y), hoặc -1. */
export function regionIndexAt(x: number, y: number): number {
  return RECLAIM_REGIONS.findIndex((r) => r.some((t) => t.x === x && t.y === y));
}

/**
 * Ký hiệu hiệu lực của ô sau khi tính điền trang: chướng ngại đã dọn → cỏ `.`,
 * đất hoang thuộc vùng đã khai → ô ruộng `F`.
 */
export function effectiveCharAt(x: number, y: number, estate: EstateState): string {
  const ch = layoutCharAt(x, y);
  if (ch === 'R' || ch === 'T') {
    const o = obstacleAt(x, y);
    return o && estate.cleared.includes(o.id) ? '.' : ch;
  }
  if (ch === 'w') {
    const i = regionIndexAt(x, y);
    return i >= 0 && i < estate.reclaimed ? 'F' : ch;
  }
  return ch;
}

export const plotId = (x: number, y: number) => `P${x}_${y}`;

/** Ô ruộng trống ở (x, y). */
export function emptyPlot(x: number, y: number): FarmTileEntity {
  return {
    id: plotId(x, y),
    tileX: x,
    tileY: y,
    zoneType: 'LAND',
    itemId: null,
    plantedAt: null,
    matureAt: null,
    watered: false,
    mudApplied: false,
    isGolden: false,
    totalYield: 0,
    remainingYield: 0,
  };
}

/** Mọi vị trí ô ruộng hiện có: ô `F` gốc + các vùng đã khai hoang. */
export function plotPositions(estate: EstateState): TilePos[] {
  const out: TilePos[] = [];
  ESTATE_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === 'F') out.push({ x, y });
  });
  for (const r of RECLAIM_REGIONS.slice(0, estate.reclaimed)) out.push(...r);
  return out;
}

// ---------------------------------------------------------------- luật
const fail = (message: string): FarmResult => ({ ok: false, message });

function spend(save: FarmSave, stamina: number, now: number): FarmSave | null {
  const s = withRegen(save, now);
  if (s.stamina < stamina) return null;
  const updatedAt = s.stamina >= s.maxStamina ? now : s.staminaUpdatedAt;
  return { ...s, stamina: s.stamina - stamina, staminaUpdatedAt: updatedAt };
}

const matText = (mats: Partial<Record<MaterialId, number>>) =>
  (Object.entries(mats) as [MaterialId, number][]).map(([id, n]) => `${n} ${MATERIALS[id].emoji} ${MATERIALS[id].name}`).join(' + ');

/** Chi phí hiển thị của một lần sửa, ví dụ "300 🪙 + 4 🪨 Đá". */
export const repairCostText = (id: StructureId) => {
  const r = REPAIRS[id];
  const m = matText(r.mats);
  return m ? `${r.gold} 🪙 + ${m}` : `${r.gold} 🪙`;
};

/** Dọn đá / gốc cây: tốn ⚡, nhận vật liệu; dọn rồi thì ô thành cỏ (KT-18, KT-20). */
export function clearObstacle(save: FarmSave, obstacleId: string, now: number): FarmResult {
  const o = OBSTACLES_BY_ID.get(obstacleId);
  if (!o) return fail('⚠️ Không có chướng ngại này trên điền trang!');
  const estate = estateOf(save);
  if (estate.cleared.includes(o.id)) return fail(`⚠️ ${CLEAR_RULES[o.kind].name} này đã dọn rồi!`);
  const rule = CLEAR_RULES[o.kind];
  const s = spend(save, rule.stamina, now);
  if (!s) return fail(`⚡ Cần ${rule.stamina} Năng lượng để dọn ${rule.name}!`);
  const m = MATERIALS[rule.item];
  return {
    ok: true,
    save: {
      ...s,
      inventory: { ...s.inventory, [rule.item]: (s.inventory[rule.item] ?? 0) + rule.qty },
      estate: { ...estate, cleared: [...estate.cleared, o.id] },
    },
    message: `${o.kind === 'TREE' ? '🪓' : '⛏️'} Dọn xong ${rule.name}: +${rule.qty} ${m.emoji} ${m.name} (-${rule.stamina} ⚡)`,
  };
}

/** Sửa hạng mục bậc 1: trừ vàng + vật liệu, cộng Phong Thủy, mở chức năng (GP-14, KT-18). */
export function repairStructure(save: FarmSave, id: StructureId): FarmResult {
  const rule = REPAIRS[id];
  if (!rule) return fail('⚠️ Không có hạng mục này!');
  const estate = estateOf(save);
  if (estate.repaired.includes(id)) return fail(`⚠️ ${rule.name} đã sửa rồi!`);
  const missing = (Object.entries(rule.mats) as [MaterialId, number][]).filter(([m, n]) => (save.inventory[m] ?? 0) < n);
  if (save.gold < rule.gold || missing.length) {
    return fail(`🔨 Sửa ${rule.name} cần ${repairCostText(id)}.`);
  }
  const inventory = { ...save.inventory };
  for (const [m, n] of Object.entries(rule.mats) as [MaterialId, number][]) inventory[m] = (inventory[m] ?? 0) - n;
  return {
    ok: true,
    save: {
      ...save,
      gold: save.gold - rule.gold,
      inventory,
      fengShuiScore: save.fengShuiScore + rule.fengShui,
      estate: { ...estate, repaired: [...estate.repaired, id] },
    },
    message: `🔨 Đã sửa ${rule.name}: mở ${rule.unlocks} (+${rule.fengShui} Phong Thủy)`,
  };
}

/** Khai hoang vùng kế tiếp (thứ tự cố định): giá `reclaimCost(k)` + ⚡, thêm ô ruộng trống (KT-15). */
export function reclaimRegion(save: FarmSave, regionIndex: number, now: number): FarmResult {
  const estate = estateOf(save);
  if (estate.reclaimed >= RECLAIM_REGIONS.length) return fail('⚠️ Đã khai hoang hết đất của điền trang!');
  if (regionIndex !== estate.reclaimed) {
    return fail(regionIndex < estate.reclaimed ? '⚠️ Vùng này đã khai hoang rồi!' : `⛏️ Khai hoang vùng ${estate.reclaimed + 1} trước.`);
  }
  const gold = reclaimCost(estate.reclaimed);
  const need = `⛏️ Khai hoang vùng ${regionIndex + 1} cần ${gold} 🪙 + ${EXPAND_STAMINA} ⚡.`;
  if (save.gold < gold) return fail(need);
  const s = spend(save, EXPAND_STAMINA, now);
  if (!s) return fail(need);
  const progress = applyXp(s.level, s.xp, EXPAND_XP);
  const region = RECLAIM_REGIONS[regionIndex];
  const have = new Set(s.tiles.map((t) => t.id));
  return {
    ok: true,
    save: {
      ...s,
      gold: s.gold - gold,
      level: progress.level,
      xp: progress.xp,
      fengShuiScore: s.fengShuiScore + EXPAND_FENG_SHUI,
      tiles: [...s.tiles, ...region.filter((t) => !have.has(plotId(t.x, t.y))).map((t) => emptyPlot(t.x, t.y))],
      estate: { ...estate, reclaimed: estate.reclaimed + 1 },
    },
    message: `⛏️ Khai hoang xong vùng ${regionIndex + 1}: +${region.length} ô ruộng (+${EXPAND_XP} XP)`,
  };
}
