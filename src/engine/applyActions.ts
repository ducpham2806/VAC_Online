/**
 * Động cơ luật dùng chung client/server (ADR-001).
 * Hàm thuần: nhận trạng thái + lô thao tác + (now, rng) → trạng thái mới + sổ cái + kết quả từng thao tác.
 * Luật lấy nguyên từ src/domain (không viết lại), thêm luật mùa vụ mới (GP-20).
 */
import { CROP_SEASONS } from '../data/seasons';
import type { FarmTileEntity, RegionType, Season } from '../data/types';
import { type FarmResult, type FarmSave, findItem, harvest, plant, sellToHtx, water, withRegen } from '../domain/farm';
import { canSowInSeason, seasonAt } from '../domain/season';
import { type StructureId, clearObstacle, isRepaired, reclaimRegion, repairStructure } from '../domain/estate';
import { giftItem, talk } from '../domain/npc';
import { choosePath, claimChapter } from '../domain/story';
import { type KitchenRules, type KitchenSave, collectCraft, discoverRecipe, eatDish, startCraft } from '../domain/cooking';
import { deliverOrder, refreshOrders, skipOrder } from '../domain/orders';
import { SLICE_KITCHEN_ID, SLICE_RECIPES, SLICE_SPECIES, SLOT_SPECIES, slotAt, sliceUnlockLevel } from '../data/sliceContent';

export const MAX_ACTIONS_PER_BATCH = 50;
export const STATE_SCHEMA_VERSION = 1;

export type Action =
  | { type: 'PLANT'; tileId: string; itemId: string }
  | { type: 'WATER'; tileId: string }
  | { type: 'HARVEST'; tileId: string }
  | { type: 'SELL'; itemId: string; qty: number }
  | { type: 'CLEAR'; obstacleId: string }
  | { type: 'REPAIR'; structureId: StructureId }
  | { type: 'RECLAIM'; regionIndex: number }
  | { type: 'TALK'; npcId: string }
  | { type: 'GIFT'; npcId: string; itemId: string }
  | { type: 'CHOOSE_PATH'; path: string }
  | { type: 'CLAIM_CHAPTER'; chapterNo: number }
  | { type: 'COOK'; productId: string }
  | { type: 'COLLECT_DISH' }
  | { type: 'EAT'; productId: string }
  | { type: 'DISCOVER'; ingredientIds: string[] }
  | { type: 'REFRESH_ORDERS' }
  | { type: 'DELIVER_ORDER'; slot: number }
  | { type: 'SKIP_ORDER'; slot: number };

export interface LedgerRow {
  currency: 'GOLD' | 'GEM' | 'STAMINA';
  delta: number;
  balance_after: number;
  reason: Action['type'];
  ref: string;
}

export interface ActionResult {
  index: number;
  ok: boolean;
  message: string;
}

export interface EngineContext {
  now: number;
  rng: () => number;
  gameStage: number;
  /**
   * Công tắc đổi mùa của bản thử (LT-03, P1-6): thay mùa theo lịch thật khi kiểm tra mùa gieo.
   * Chỉ client bản thử truyền; Edge Function không bao giờ đọc giá trị này từ người chơi.
   */
  season?: Season;
  /**
   * Luật nội dung bản thử P1 (QD-86, QD-87): chỉ 8 loài, mỗi chỗ nuôi đúng loài, cấp mở riêng (KT-21),
   * Bếp Củi mở ở Giai đoạn 1 với 2 món. Server đặt theo chế độ chơi, không đọc từ người chơi.
   */
  slice?: boolean;
}

export interface ApplyOutput {
  save: FarmSave;
  ledger: LedgerRow[];
  results: ActionResult[];
}

/** Trạng thái người chơi mới (bản thử): 6 ô đất trống, 2.500🪙 (KT-01). */
export function newFarmSave(region: RegionType, now: number): FarmSave {
  const tiles: FarmTileEntity[] = Array.from({ length: 6 }, (_, i) => ({
    id: `T${i}`,
    tileX: i % 3,
    tileY: Math.floor(i / 3),
    zoneType: 'LAND',
    itemId: null,
    plantedAt: null,
    matureAt: null,
    watered: false,
    mudApplied: false,
    isGolden: false,
    totalYield: 0,
    remainingYield: 0,
  }));
  return {
    region,
    level: 1,
    xp: 0,
    gold: 2500,
    gems: 50,
    stamina: 50,
    maxStamina: 50,
    staminaUpdatedAt: now,
    fengShuiScore: 0,
    wildPlotsUnlocked: 0,
    pondMudCounter: 0,
    inventory: {},
    tiles,
  };
}

function ref(action: Action): string {
  switch (action.type) {
    case 'SELL':
    case 'PLANT':
      return action.itemId;
    case 'TALK':
      return action.npcId;
    case 'GIFT':
      return `${action.npcId}:${action.itemId}`;
    case 'CHOOSE_PATH':
      return action.path;
    case 'CLAIM_CHAPTER':
      return `CH${action.chapterNo}`;
    case 'CLEAR':
      return action.obstacleId;
    case 'REPAIR':
      return action.structureId;
    case 'RECLAIM':
      return `REGION_${action.regionIndex}`;
    case 'COOK':
    case 'EAT':
      return action.productId;
    case 'DISCOVER':
      return action.ingredientIds.join('+');
    case 'COLLECT_DISH':
      return SLICE_KITCHEN_ID;
    case 'REFRESH_ORDERS':
      return 'ORDERS';
    case 'DELIVER_ORDER':
    case 'SKIP_ORDER':
      return `ORDER_${action.slot}`;
    default:
      return action.tileId;
  }
}

/** Chưa sửa Giếng: mỗi lô chỉ tưới 1 ô; sửa xong mới tưới cả loạt khi kéo (KT-18, QD-83). */
export const WELL_LOCKED_WATER_PER_BATCH = 1;

/** Luật Bếp của bản thử (QD-87): 2 món, mở ở Giai đoạn 1, cấp mở theo KT-21. */
const SLICE_KITCHEN_RULES: KitchenRules = { recipeIds: SLICE_RECIPES, minStage: 1, unlockLevel: sliceUnlockLevel };

/** Chạy một luật Bếp trên phần trạng thái Bếp của `save`, ghép kết quả lại. */
function kitchen(save: FarmSave, run: (k: KitchenSave) => { ok: true; save: KitchenSave; message: string } | { ok: false; message: string }): FarmResult {
  const r = run({ ...save, machines: save.machines ?? {}, discoveredRecipes: save.discoveredRecipes ?? [] });
  return r.ok ? { ok: true, save: { ...save, ...r.save }, message: r.message } : r;
}

/** Bản thử: chỉ 8 loài; ô ruộng chỉ gieo cây, chỗ nuôi chỉ thả đúng loài của chỗ đó. */
function slicePlantCheck(save: FarmSave, tileId: string, itemId: string): string | null {
  if (!SLICE_SPECIES.includes(itemId)) return '🔒 Giống này chưa có trong bản thử.';
  const tile = save.tiles.find((t) => t.id === tileId);
  if (!tile) return null; // để `plant` báo lỗi chung
  const slot = tile.zoneType === 'LAND' ? undefined : slotAt(tile.tileX, tile.tileY);
  if (!slot) return itemId.startsWith('CROP_') ? null : '⚠️ Vật nuôi phải thả ở chuồng hoặc ao.';
  return SLOT_SPECIES[slot.kind] === itemId ? null : '⚠️ Chỗ này không nuôi loài đó.';
}

function step(save: FarmSave, action: Action, ctx: EngineContext): FarmResult {
  const season = ctx.season ?? seasonAt(ctx.now).season;
  const rules = ctx.slice ? SLICE_KITCHEN_RULES : undefined;
  switch (action.type) {
    case 'PLANT': {
      const item = findItem(action.itemId);
      if (item && !canSowInSeason(CROP_SEASONS[item.id], season)) {
        return { ok: false, message: `🍂 [${item.name}] không gieo được trong mùa này.` };
      }
      if (ctx.slice) {
        const bad = slicePlantCheck(save, action.tileId, action.itemId);
        if (bad) return { ok: false, message: bad };
      }
      const r = plant(save, action.tileId, action.itemId, ctx.gameStage, ctx.now, ctx.slice && item ? sliceUnlockLevel(item) : undefined);
      // chỗ nuôi không tưới: lời nhắn riêng thay cho "chạm lần nữa để tưới" của ô ruộng
      const animal = ctx.slice && item && r.ok && save.tiles.find((t) => t.id === action.tileId)?.zoneType !== 'LAND';
      return animal ? { ...r, message: `🐣 Đã thả [${item.emoji} ${item.name}] (-${item.buyCostGold} 🪙) — tới lứa thì chạm để thu.` } : r;
    }
    case 'WATER': {
      const tile = save.tiles.find((t) => t.id === action.tileId);
      if (ctx.slice && tile && tile.zoneType !== 'LAND') return { ok: false, message: '⚠️ Vật nuôi không cần tưới.' };
      return water(save, action.tileId, ctx.now);
    }
    case 'HARVEST':
      return harvest(save, action.tileId, ctx.now);
    case 'SELL':
      return sellToHtx(save, action.itemId, action.qty);
    case 'CLEAR':
      return clearObstacle(save, action.obstacleId, ctx.now);
    case 'REPAIR':
      return repairStructure(save, action.structureId);
    case 'RECLAIM':
      return reclaimRegion(save, action.regionIndex, ctx.now);
    case 'TALK':
      return talk(save, action.npcId, ctx.now);
    case 'GIFT':
      return giftItem(save, action.npcId, action.itemId, ctx.now);
    case 'CHOOSE_PATH':
      return choosePath(save, action.path);
    case 'CLAIM_CHAPTER':
      return claimChapter(save, action.chapterNo);
    case 'COOK':
      return kitchen(save, (k) => startCraft(k, SLICE_KITCHEN_ID, action.productId, ctx.gameStage, ctx.now, rules));
    case 'COLLECT_DISH':
      return kitchen(save, (k) => collectCraft(k, SLICE_KITCHEN_ID, ctx.now));
    case 'EAT':
      return kitchen(save, (k) => eatDish(k, action.productId, ctx.gameStage, ctx.now, rules));
    case 'DISCOVER':
      return kitchen(save, (k) => discoverRecipe(k, action.ingredientIds, ctx.gameStage, rules));
    case 'REFRESH_ORDERS':
      return refreshOrders(save, season, ctx.now, ctx.rng);
    case 'DELIVER_ORDER':
      return deliverOrder(save, action.slot, season, ctx.rng);
    case 'SKIP_ORDER':
      return skipOrder(save, action.slot, ctx.now);
  }
}

export function applyActions(input: FarmSave, actions: readonly Action[], ctx: EngineContext): ApplyOutput {
  if (actions.length > MAX_ACTIONS_PER_BATCH) {
    return { save: input, ledger: [], results: [{ index: 0, ok: false, message: `Tối đa ${MAX_ACTIONS_PER_BATCH} thao tác mỗi lần gửi.` }] };
  }
  let save = withRegen(input, ctx.now);
  const ledger: LedgerRow[] = [];
  const results: ActionResult[] = [];
  let watered = 0;
  actions.forEach((action, index) => {
    if (action.type === 'WATER' && watered >= WELL_LOCKED_WATER_PER_BATCH && !isRepaired(save, 'WELL')) {
      results.push({ index, ok: false, message: '🪣 Sửa Giếng để tưới cả loạt — giờ tưới từng ô.' });
      return;
    }
    const res = step(save, action, ctx);
    if (res.ok && action.type === 'WATER') watered++;
    results.push({ index, ok: res.ok, message: res.message });
    if (!res.ok) return; // thao tác lỗi không làm hỏng các thao tác khác
    const next = res.save;
    for (const [currency, key] of [['GOLD', 'gold'], ['GEM', 'gems'], ['STAMINA', 'stamina']] as const) {
      const delta = next[key] - save[key];
      if (delta !== 0) ledger.push({ currency, delta, balance_after: next[key], reason: action.type, ref: ref(action) });
    }
    save = next;
  });
  return { save, ledger, results };
}
