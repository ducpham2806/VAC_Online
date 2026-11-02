import { GAME_CATALOG } from '../data/masterData';
import { CatalogItem, FarmTileEntity, RegionType } from '../data/types';
import { applyXp, canPlant } from './progression';
import { regenStamina } from './stamina';
import { normalizePlotTiles } from './farmGrid';
import { COUNTER, Counters, bumpCounter } from './quests';

/**
 * Luật vòng chơi Vườn – Ao – Chuồng (GĐ1) dạng hàm thuần.
 * - Chế độ offline (Khách không có máy chủ): store gọi trực tiếp các hàm này.
 * - Chế độ online: migration 0004 (rpc_plant / rpc_water / …) cài đặt cùng luật trên server.
 * Sửa luật ở đây thì phải sửa cả SQL và test (src/domain/farm.test.ts, supabase/tests/farm_core.test.sql).
 */

export const MUD_ITEM_ID = 'ITEM_BUN_PHU_SA';
export const MAX_WILD_PLOTS = 25;
export const MAX_POND_MUD = 10;
export const WATER_TIME_CUT = 0.15;
export const NORTH_CROP_TIME_FACTOR = 0.9;
export const GOLDEN_CHANCE = 0.45;
export const GOLDEN_YIELD_MULTIPLIER = 3;
export const DEFAULT_YIELD = 2;
/** Buff Mùa Nước Nổi (miền Nam): +1 sản lượng khi thu hoạch thủy sản. */
export const SOUTH_AQUA_BONUS = 1;
export const DREDGE_STAMINA = 3;
export const DREDGE_MUD_GAIN = 3;
export const DREDGE_XP = 20;
export const EXPAND_STAMINA = 5;
export const EXPAND_GOLD = 500;
export const EXPAND_XP = 45;
export const EXPAND_FENG_SHUI = 25;

/** Phần trạng thái game mà luật nông trại đọc/ghi. */
export interface FarmSave {
  region: RegionType;
  level: number;
  xp: number;
  gold: number;
  gems: number;
  stamina: number;
  maxStamina: number;
  staminaUpdatedAt: number;
  fengShuiScore: number;
  wildPlotsUnlocked: number;
  pondMudCounter: number;
  inventory: Record<string, number>;
  tiles: FarmTileEntity[];
  /** Bộ đếm hành động cho mục tiêu nhiệm vụ (src/domain/quests.ts). Save cũ có thể thiếu. */
  counters?: Counters;
}

export type FarmResult = { ok: true; save: FarmSave; message: string } | { ok: false; message: string };

const CATALOG_BY_ID = new Map(GAME_CATALOG.map((c) => [c.id, c]));

export function findItem(itemId: string): CatalogItem | undefined {
  return CATALOG_BY_ID.get(itemId);
}

function fail(message: string): FarmResult {
  return { ok: false, message };
}

function withTile(save: FarmSave, tileId: string, patch: Partial<FarmTileEntity>): FarmTileEntity[] {
  return save.tiles.map((t) => (t.id === tileId ? { ...t, ...patch } : t));
}

function addXp(save: FarmSave, gain: number): Pick<FarmSave, 'level' | 'xp'> & { levelsGained: number } {
  return applyXp(save.level, save.xp, gain);
}

function emptyTilePatch(): Partial<FarmTileEntity> {
  return {
    itemId: null,
    plantedAt: null,
    matureAt: null,
    watered: false,
    mudApplied: false,
    isGolden: false,
  };
}

/** Thời gian chín (ms) có tính buff vùng miền. */
export function growMs(item: CatalogItem, region: RegionType): number {
  const factor = region === 'NORTH' && item.category === 'CROP' ? NORTH_CROP_TIME_FACTOR : 1;
  return Math.round(Math.max(1, item.growOrCraftMinutes) * 60_000 * factor);
}

export function plant(save: FarmSave, tileId: string, itemId: string, gameStage: number, now: number): FarmResult {
  const tile = save.tiles.find((t) => t.id === tileId);
  if (!tile) return fail('⚠️ Không tìm thấy ô đất này!');
  if (tile.itemId) return fail('⚠️ Ô này đang có cây/vật nuôi rồi!');
  const item = findItem(itemId);
  if (!item) return fail('⚠️ Giống không có trong danh mục!');
  const lock = canPlant(item, save.level, gameStage, save.region);
  if (!lock.ok) {
    if (lock.reason === 'LEVEL_LOCKED') return fail(`🔒 [${item.name}] mở ở Lv.${item.unlockLevel}!`);
    if (lock.reason === 'WAVE_LOCKED') return fail(`🔒 [${item.name}] thuộc Đợt ${item.unlockWave ?? '?'} — chưa mở!`);
    if (lock.reason === 'REGION_LOCKED') return fail(`🔒 [${item.name}] là đặc sản độc quyền miền khác!`);
    return fail(`⚠️ [${item.name}] không gieo/thả được!`);
  }
  if (save.gold < item.buyCostGold) return fail('⚠️ Không đủ Xu Vàng để mua giống/vật nuôi này!');
  const total = item.yieldCount ?? DEFAULT_YIELD;
  return {
    ok: true,
    save: {
      ...save,
      gold: save.gold - item.buyCostGold,
      tiles: withTile(save, tileId, {
        itemId: item.id,
        plantedAt: now,
        matureAt: now + growMs(item, save.region),
        watered: false,
        mudApplied: false,
        isGolden: false,
        totalYield: total,
        remainingYield: total,
      }),
    },
    message: `🌱 Đã thả/gieo [${item.emoji} ${item.name}] (-${item.buyCostGold} 🪙, 0 ⚡) - Chạm lần nữa để Chăm sóc / Tưới nước!`,
  };
}

export function isMature(tile: FarmTileEntity, now: number): boolean {
  return Boolean(tile.itemId && tile.matureAt !== null && now >= tile.matureAt);
}

export function water(save: FarmSave, tileId: string, now: number): FarmResult {
  const tile = save.tiles.find((t) => t.id === tileId);
  if (!tile?.itemId || tile.matureAt === null) return fail('⚠️ Ô này chưa gieo gì để tưới!');
  if (isMature(tile, now)) return fail('🌾 Đã chín rồi, hãy thu hoạch!');
  if (tile.watered) return fail('💧 Ô này đã được tưới trong vụ này rồi!');
  const item = findItem(tile.itemId);
  const reduced = tile.matureAt - Math.floor((tile.matureAt - now) * WATER_TIME_CUT);
  return {
    ok: true,
    save: {
      ...save,
      tiles: withTile(save, tileId, { watered: true, matureAt: reduced }),
      counters: bumpCounter(save.counters, COUNTER.WATER),
    },
    message: `💧 Đã tưới Nước Giếng Làng / Chăm sóc [${item?.name ?? tile.itemId}] (-15% thời gian chờ)!`,
  };
}

export function applyMud(save: FarmSave, tileId: string, now: number, rng: () => number): FarmResult {
  const tile = save.tiles.find((t) => t.id === tileId);
  if (!tile?.itemId) return fail('⚠️ Ô này chưa gieo gì để bón bùn!');
  if (tile.mudApplied) return fail('🪣 Ô này đã bón Bùn Phù Sa rồi!');
  if (isMature(tile, now)) return fail('🌾 Đã chín rồi, hãy thu hoạch!');
  const mudQty = save.inventory[MUD_ITEM_ID] ?? 0;
  if (mudQty <= 0) {
    return fail('🪣 Đã hết Bùn Phù Sa! Hãy bấm nút [🪣 Vét Bùn Ao] để lấy thêm nhé!');
  }
  const item = findItem(tile.itemId);
  const golden = rng() < GOLDEN_CHANCE;
  return {
    ok: true,
    save: {
      ...save,
      inventory: { ...save.inventory, [MUD_ITEM_ID]: mudQty - 1 },
      counters: bumpCounter(save.counters, COUNTER.APPLY_MUD),
      tiles: withTile(save, tileId, { mudApplied: true, isGolden: golden, matureAt: now - 1000 }),
    },
    message: `🪣 Đã bón Bùn Phù Sa đáy ao! [${item?.name ?? tile.itemId}] chín ngay lập tức${golden ? ' và NỔ ĐỘT BIẾN HOÀNG KIM ⭐!' : '!'}`,
  };
}

/** Thu hoạch: nông sản vào Kho (Hoàng Kim ⭐ ×3 sản lượng), cộng XP. Không cộng vàng — bán ở HTX. */
export function harvest(save: FarmSave, tileId: string, now: number): FarmResult {
  const tile = save.tiles.find((t) => t.id === tileId);
  if (!tile?.itemId) return fail('⚠️ Ô này đang trống!');
  if (!isMature(tile, now)) return fail('⏳ Chưa chín, hãy chờ thêm hoặc tưới nước!');
  const item = findItem(tile.itemId);
  if (!item) return fail('⚠️ Không xác định được nông sản!');
  const southBonus = save.region === 'SOUTH' && item.category === 'AQUA' ? SOUTH_AQUA_BONUS : 0;
  const qty = (item.yieldCount ?? DEFAULT_YIELD) * (tile.isGolden ? GOLDEN_YIELD_MULTIPLIER : 1) + southBonus;
  const progress = addXp(save, item.xpReward);
  const pondMudCounter =
    item.category === 'AQUA' || tile.zoneType === 'POND'
      ? Math.min(MAX_POND_MUD, save.pondMudCounter + 1)
      : save.pondMudCounter;
  return {
    ok: true,
    save: {
      ...save,
      level: progress.level,
      xp: progress.xp,
      pondMudCounter,
      inventory: { ...save.inventory, [item.id]: (save.inventory[item.id] ?? 0) + qty },
      counters: bumpCounter(save.counters, COUNTER.harvest(item.id)),
      tiles: withTile(save, tileId, emptyTilePatch()),
    },
    message: `🧺 Thu hoạch [${item.emoji} ${item.name}${tile.isGolden ? ' HOÀNG KIM ⭐ ×3' : ''}]: +${qty} vào Kho, +${item.xpReward} XP${
      progress.levelsGained > 0 ? ` — 🎉 LÊN CẤP ${progress.level}!` : ''
    }`,
  };
}

/** Bán nông sản trong Kho cho Hợp Tác Xã theo giá gốc. */
export function sellToHtx(save: FarmSave, itemId: string, qty: number): FarmResult {
  const item = findItem(itemId);
  if (!item) return fail('⚠️ Vật phẩm không có trong danh mục!');
  if (!Number.isInteger(qty) || qty <= 0) return fail('⚠️ Số lượng bán không hợp lệ!');
  const have = save.inventory[itemId] ?? 0;
  if (have < qty) return fail(`⚠️ Kho chỉ còn ${have} ${item.name}!`);
  if (item.baseSellGold <= 0) return fail(`⚠️ HTX không thu mua [${item.name}]!`);
  const earned = item.baseSellGold * qty;
  return {
    ok: true,
    save: { ...save, gold: save.gold + earned, inventory: { ...save.inventory, [itemId]: have - qty } },
    message: `🏪 Đã bán ${qty} ${item.emoji} ${item.name} cho HTX: +${earned} 🪙`,
  };
}

export function withRegen(save: FarmSave, now: number): FarmSave {
  const r = regenStamina(save.stamina, save.maxStamina, save.staminaUpdatedAt, now);
  return { ...save, stamina: r.stamina, staminaUpdatedAt: r.updatedAt };
}

function spendStamina(save: FarmSave, amount: number, now: number): FarmSave | null {
  const s = withRegen(save, now);
  if (s.stamina < amount) return null;
  // Đang đầy thì mốc hồi bắt đầu từ lúc tiêu.
  const updatedAt = s.stamina >= s.maxStamina ? now : s.staminaUpdatedAt;
  return { ...s, stamina: s.stamina - amount, staminaUpdatedAt: updatedAt };
}

export function dredgePond(save: FarmSave, now: number): FarmResult {
  const s = spendStamina(save, DREDGE_STAMINA, now);
  if (!s) return fail(`⚡ Cần ${DREDGE_STAMINA} Năng lượng để Vét Bùn Đáy Ao!`);
  const progress = addXp(s, DREDGE_XP);
  const mud = (s.inventory[MUD_ITEM_ID] ?? 0) + DREDGE_MUD_GAIN;
  return {
    ok: true,
    save: {
      ...s,
      level: progress.level,
      xp: progress.xp,
      pondMudCounter: 0,
      inventory: { ...s.inventory, [MUD_ITEM_ID]: mud },
      counters: bumpCounter(s.counters, COUNTER.DREDGE),
    },
    message: `🪣 Đã Vét Bùn Đáy Ao (-${DREDGE_STAMINA} ⚡): +${DREDGE_MUD_GAIN} Xô Bùn Phù Sa (Đang có: ${mud} xô) & +${DREDGE_XP} XP!`,
  };
}

export function expandLand(save: FarmSave, now: number): FarmResult {
  if (save.wildPlotsUnlocked >= MAX_WILD_PLOTS) {
    return fail(`🌾 Đã khai hoang tối đa ${MAX_WILD_PLOTS}/${MAX_WILD_PLOTS} Phân khu VAC!`);
  }
  if (save.gold < EXPAND_GOLD) {
    return fail(`⚠️ Cần ${EXPAND_STAMINA} ⚡ Năng lượng và ${EXPAND_GOLD} 🪙 Xu Vàng để khai hoang!`);
  }
  const s = spendStamina(save, EXPAND_STAMINA, now);
  if (!s) return fail(`⚠️ Cần ${EXPAND_STAMINA} ⚡ Năng lượng và ${EXPAND_GOLD} 🪙 Xu Vàng để khai hoang!`);
  const progress = addXp(s, EXPAND_XP);
  const plots = s.wildPlotsUnlocked + 1;
  return {
    ok: true,
    save: {
      ...s,
      level: progress.level,
      xp: progress.xp,
      gold: s.gold - EXPAND_GOLD,
      wildPlotsUnlocked: plots,
      tiles: normalizePlotTiles(s.tiles, plots),
      fengShuiScore: s.fengShuiScore + EXPAND_FENG_SHUI,
    },
    message: `🪓 Khai hoang thành công (-${EXPAND_STAMINA} ⚡, -${EXPAND_GOLD} 🪙)! Đã mở rộng lên ${plots}/${MAX_WILD_PLOTS} Phân khu VAC, nhận +${EXPAND_XP} XP & +${EXPAND_FENG_SHUI} Phong Thủy!`,
  };
}

export type TileActionKind = 'PLANT' | 'HARVEST' | 'WATER' | 'MUD' | 'NONE';

/** Chạm vào ô thì làm gì (giữ đúng thứ tự cũ: gieo → thu hoạch → tưới → bón bùn). */
export function nextTileAction(tile: FarmTileEntity, now: number): TileActionKind {
  if (!tile.itemId) return 'PLANT';
  if (isMature(tile, now)) return 'HARVEST';
  if (!tile.watered) return 'WATER';
  if (!tile.mudApplied) return 'MUD';
  return 'NONE';
}
