/**
 * P1-8 (QD-89, ADR-001/002) — phần thuần của Edge Function `apply-actions` cho bản thử `?p1`.
 * Edge Function chỉ lo danh tính, đọc/ghi DB; luật nằm hết ở đây và trong `applyActions` (dùng chung với client).
 * Không tin client: lô thao tác là JSON tùy ý → `parseActions` kiểm từng trường trước khi chạy luật.
 * Đóng gói: `npm run build:edge` → `supabase/functions/apply-actions/engine.js` (file sinh, không commit).
 */
import { type Action, type ApplyOutput, MAX_ACTIONS_PER_BATCH, applyActions } from './applyActions';
import type { FarmSave } from '../domain/farm';
import { SLICE_GAME_STAGE, SLICE_SAVE_VERSION, newSliceSave, reconcileSliceSave } from '../game/slice/sliceSave';

/** schema_version lưu cùng trạng thái trên server = phiên bản bản lưu bản thử. */
export const SERVER_SCHEMA_VERSION = SLICE_SAVE_VERSION;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 64): v is string => typeof v === 'string' && v.length > 0 && v.length <= max;
const int = (v: unknown, lo: number, hi: number): v is number => Number.isInteger(v) && (v as number) >= lo && (v as number) <= hi;

/** Kiểm một thao tác; sai dạng → null. Chỉ giữ đúng các trường của loại đó (bỏ trường thừa). */
export function parseAction(raw: unknown): Action | null {
  if (!isObj(raw) || typeof raw.type !== 'string') return null;
  switch (raw.type) {
    case 'PLANT':
      return str(raw.tileId) && str(raw.itemId) ? { type: 'PLANT', tileId: raw.tileId, itemId: raw.itemId } : null;
    case 'WATER':
    case 'HARVEST':
      return str(raw.tileId) ? { type: raw.type, tileId: raw.tileId } : null;
    case 'SELL':
      return str(raw.itemId) && int(raw.qty, 1, 100_000) ? { type: 'SELL', itemId: raw.itemId, qty: raw.qty } : null;
    case 'CLEAR':
      return str(raw.obstacleId) ? { type: 'CLEAR', obstacleId: raw.obstacleId } : null;
    case 'REPAIR':
      return raw.structureId === 'WELL' || raw.structureId === 'COOP' || raw.structureId === 'HOUSE' || raw.structureId === 'KITCHEN'
        ? { type: 'REPAIR', structureId: raw.structureId }
        : null;
    case 'RECLAIM':
      return int(raw.regionIndex, 0, 100) ? { type: 'RECLAIM', regionIndex: raw.regionIndex } : null;
    case 'TALK':
      return str(raw.npcId) ? { type: 'TALK', npcId: raw.npcId } : null;
    case 'GIFT':
      return str(raw.npcId) && str(raw.itemId) ? { type: 'GIFT', npcId: raw.npcId, itemId: raw.itemId } : null;
    case 'CHOOSE_PATH':
      return str(raw.path, 16) ? { type: 'CHOOSE_PATH', path: raw.path } : null;
    case 'CLAIM_CHAPTER':
      return int(raw.chapterNo, 1, 10) ? { type: 'CLAIM_CHAPTER', chapterNo: raw.chapterNo } : null;
    case 'COOK':
    case 'EAT':
      return str(raw.productId) ? { type: raw.type, productId: raw.productId } : null;
    case 'COLLECT_DISH':
    case 'REFRESH_ORDERS':
      return { type: raw.type };
    case 'DISCOVER':
      return Array.isArray(raw.ingredientIds) && raw.ingredientIds.length <= 8 && raw.ingredientIds.every((x) => str(x))
        ? { type: 'DISCOVER', ingredientIds: raw.ingredientIds as string[] }
        : null;
    case 'DELIVER_ORDER':
    case 'SKIP_ORDER':
      return int(raw.slot, 0, 9) ? { type: raw.type, slot: raw.slot } : null;
    default:
      return null;
  }
}

/** Kiểm cả lô: không phải mảng, quá dài hoặc có thao tác sai dạng → null (từ chối cả lô). */
export function parseActions(raw: unknown): Action[] | null {
  if (!Array.isArray(raw) || raw.length > MAX_ACTIONS_PER_BATCH) return null;
  const out: Action[] = [];
  for (const r of raw) {
    const a = parseAction(r);
    if (!a) return null;
    out.push(a);
  }
  return out;
}

/** Trạng thái đọc từ DB → bản lưu bản thử (khớp bản đồ hiện tại); chưa có / hỏng → người chơi mới. */
export function loadServerSave(stored: unknown, now: number): FarmSave {
  return (stored ? reconcileSliceSave(stored) : null) ?? newSliceSave(now);
}

/** Áp lô thao tác theo luật bản thử: giờ và số ngẫu nhiên của server, lịch mùa thật (không công tắc mùa). */
export function serverApply(stored: unknown, actions: readonly Action[], now: number, rng: () => number): ApplyOutput {
  return applyActions(loadServerSave(stored, now), actions, { now, rng, gameStage: SLICE_GAME_STAGE, slice: true });
}
