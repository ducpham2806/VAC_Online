/**
 * Động cơ luật dùng chung client/server (ADR-001).
 * Hàm thuần: nhận trạng thái + lô thao tác + (now, rng) → trạng thái mới + sổ cái + kết quả từng thao tác.
 * Luật lấy nguyên từ src/domain (không viết lại), thêm luật mùa vụ mới (GP-20).
 */
import { CROP_SEASONS } from '../data/seasons';
import type { FarmTileEntity, RegionType, Season } from '../data/types';
import { type FarmResult, type FarmSave, findItem, harvest, plant, sellToHtx, water, withRegen } from '../domain/farm';
import { canSowInSeason, seasonAt } from '../domain/season';

export const MAX_ACTIONS_PER_BATCH = 50;
export const STATE_SCHEMA_VERSION = 1;

export type Action =
  | { type: 'PLANT'; tileId: string; itemId: string }
  | { type: 'WATER'; tileId: string }
  | { type: 'HARVEST'; tileId: string }
  | { type: 'SELL'; itemId: string; qty: number };

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
  return 'itemId' in action ? action.itemId : action.tileId;
}

function step(save: FarmSave, action: Action, ctx: EngineContext): FarmResult {
  switch (action.type) {
    case 'PLANT': {
      const item = findItem(action.itemId);
      const season = ctx.season ?? seasonAt(ctx.now).season;
      if (item && !canSowInSeason(CROP_SEASONS[item.id], season)) {
        return { ok: false, message: `🍂 [${item.name}] không gieo được trong mùa này.` };
      }
      return plant(save, action.tileId, action.itemId, ctx.gameStage, ctx.now);
    }
    case 'WATER':
      return water(save, action.tileId, ctx.now);
    case 'HARVEST':
      return harvest(save, action.tileId, ctx.now);
    case 'SELL':
      return sellToHtx(save, action.itemId, action.qty);
  }
}

export function applyActions(input: FarmSave, actions: readonly Action[], ctx: EngineContext): ApplyOutput {
  if (actions.length > MAX_ACTIONS_PER_BATCH) {
    return { save: input, ledger: [], results: [{ index: 0, ok: false, message: `Tối đa ${MAX_ACTIONS_PER_BATCH} thao tác mỗi lần gửi.` }] };
  }
  let save = withRegen(input, ctx.now);
  const ledger: LedgerRow[] = [];
  const results: ActionResult[] = [];
  actions.forEach((action, index) => {
    const res = step(save, action, ctx);
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
