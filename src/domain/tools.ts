/**
 * GP-02 — công cụ tự chọn theo đối tượng được chạm + làm cả loạt khi kéo (KT-16).
 * Hàm thuần: không biết bản đồ hay Phaser; nhận loại đối tượng, ô đất, thời điểm.
 */
import type { FarmTileEntity } from '../data/types';
import type { Action } from '../engine/applyActions';
import { isMature } from './farm';

/** KT-16: tối đa số ô mỗi lượt kéo. */
export const BATCH_DRAG_MAX = 12;
/** Tầm làm việc: ô đang đứng hoặc 8 ô xung quanh (GP-02 "ở gần thì làm ngay"). */
export const REACH_TILES = 1;

export type Tool = 'HOE' | 'SEED' | 'WATER' | 'SICKLE' | 'FEED' | 'ROD' | 'AXE' | 'HAMMER' | 'HAND' | 'NONE';
export type TargetKind = 'PLOT' | 'WILD' | 'COOP' | 'POND' | 'ROCK' | 'TREE' | 'HOUSE' | 'WELL' | 'GROUND';

/** Ô ruộng: trống → túi hạt; chín → liềm; chưa tưới → bình tưới; còn lại không có việc. */
export function toolForPlot(tile: FarmTileEntity, now: number): Tool {
  if (!tile.itemId) return 'SEED';
  if (isMature(tile, now)) return 'SICKLE';
  if (!tile.watered) return 'WATER';
  return 'NONE';
}

export function toolForTarget(kind: TargetKind, tile: FarmTileEntity | undefined, now: number): Tool {
  switch (kind) {
    case 'PLOT':
      return tile ? toolForPlot(tile, now) : 'NONE';
    case 'WILD':
      return 'HOE';
    case 'COOP':
      return 'FEED';
    case 'POND':
      return 'ROD';
    case 'ROCK':
    case 'TREE':
      return 'AXE';
    case 'HOUSE':
    case 'WELL':
      return 'HAND';
    case 'GROUND':
      return 'NONE';
  }
}

/** Thao tác engine tương ứng công cụ trên ô ruộng; `null` nếu công cụ chưa có luật ở bản thử. */
export function plotAction(tool: Tool, tileId: string, seedId: string | null): Action | null {
  if (tool === 'SEED') return seedId ? { type: 'PLANT', tileId, itemId: seedId } : null;
  if (tool === 'WATER') return { type: 'WATER', tileId };
  if (tool === 'SICKLE') return { type: 'HARVEST', tileId };
  return null;
}

/**
 * Kéo qua nhiều ô (GP-02, KT-16): công cụ chốt theo ô đầu tiên, chỉ lấy các ô cùng cần công cụ đó,
 * bỏ ô trùng, tối đa BATCH_DRAG_MAX. Mỗi ô vẫn đi qua luật riêng trong engine (đủ tiền, đủ điều kiện).
 */
export function batchFromDrag(
  tileIds: readonly string[],
  tiles: readonly FarmTileEntity[],
  now: number,
  seedId: string | null,
): { tool: Tool; actions: Action[] } {
  const byId = new Map(tiles.map((t) => [t.id, t]));
  const seen = new Set<string>();
  let tool: Tool | null = null;
  const actions: Action[] = [];
  for (const id of tileIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const tile = byId.get(id);
    if (!tile) continue;
    const t = toolForPlot(tile, now);
    if (tool === null) tool = t; // chốt theo ô đầu tiên, kể cả khi ô đó không có việc
    if (t !== tool || tool === 'NONE') continue;
    const a = plotAction(tool, id, seedId);
    if (a) actions.push(a);
    if (actions.length >= BATCH_DRAG_MAX) break;
  }
  return { tool: tool ?? 'NONE', actions };
}

const cheb = (ax: number, ay: number, bx: number, by: number) => Math.max(Math.abs(ax - bx), Math.abs(ay - by));

export function inReach(px: number, py: number, tx: number, ty: number): boolean {
  return cheb(px, py, tx, ty) <= REACH_TILES;
}

/**
 * Nút hành động (UI-20): ô ruộng trong tầm có việc để làm — ưu tiên ô đang đứng, rồi ô gần nhất,
 * cùng khoảng cách thì theo thứ tự đọc (trên → dưới, trái → phải) để kết quả ổn định.
 */
export function nearestActionablePlot(
  tiles: readonly FarmTileEntity[],
  px: number,
  py: number,
  now: number,
): { tile: FarmTileEntity; tool: Tool } | null {
  let best: { tile: FarmTileEntity; tool: Tool; d: number } | null = null;
  for (const tile of tiles) {
    const d = cheb(px, py, tile.tileX, tile.tileY);
    if (d > REACH_TILES) continue;
    const tool = toolForPlot(tile, now);
    if (tool === 'NONE') continue;
    const better =
      !best ||
      d < best.d ||
      (d === best.d && (tile.tileY < best.tile.tileY || (tile.tileY === best.tile.tileY && tile.tileX < best.tile.tileX)));
    if (better) best = { tile, tool, d };
  }
  return best ? { tile: best.tile, tool: best.tool } : null;
}

/** Giai đoạn hình của cây (0 mầm, 1 non, 2 lớn, 3 chín) theo tiến độ thời gian. */
export function growthStage(tile: FarmTileEntity, now: number): 0 | 1 | 2 | 3 {
  if (!tile.itemId || tile.plantedAt === null || tile.matureAt === null) return 0;
  if (now >= tile.matureAt) return 3;
  const p = (now - tile.plantedAt) / Math.max(1, tile.matureAt - tile.plantedAt);
  return p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
}
