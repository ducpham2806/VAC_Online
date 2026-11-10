/**
 * P1-10 — chạm đối tượng điền trang ra việc gì (GP-02, GP-14): dọn đá/gốc cây, sửa hạng mục, khai hoang.
 * Thuần, không Phaser. Việc tốn vàng (sửa, khai hoang) trả `confirm` để HUD hỏi lại trước khi trừ tiền.
 */
import type { FarmSave } from '../../domain/farm';
import type { Tool } from '../../domain/tools';
import type { Action } from '../../engine/applyActions';
import { EXPAND_STAMINA } from '../../domain/farm';
import {
  CLEAR_RULES,
  RECLAIM_REGIONS,
  REPAIRS,
  type StructureId,
  estateOf,
  obstacleAt,
  reclaimCost,
  regionIndexAt,
  repairCostText,
  structureAt,
} from '../../domain/estate';
import { layoutCharAt } from '../../data/estateLayout';

export interface EstateConfirm {
  title: string;
  cost: string;
  unlocks: string;
}

export interface EstateTarget {
  tool: Tool;
  /** Thao tác gửi engine; `null` = chỉ có lời nhắn. */
  action: Action | null;
  confirm?: EstateConfirm;
  hint?: string;
}

const REPAIRED_HINT: Record<StructureId, string> = {
  WELL: '🪣 Giếng đã sửa — kéo trên ruộng để tưới cả loạt.',
  COOP: '🌽 Chuồng đã sửa — gà về ở bản sau (P1-9).',
  HOUSE: '🏠 Nhà đã sửa — mở 📜 Gia Phả ở dưới màn hình để xem Chương 1.',
};

/** Việc điền trang ở ô (x, y); `null` nếu ô đó không phải đối tượng điền trang (ruộng, cỏ). */
export function estateTargetAt(save: FarmSave, x: number, y: number): EstateTarget | null {
  const estate = estateOf(save);
  const o = obstacleAt(x, y);
  if (o && !estate.cleared.includes(o.id)) {
    const r = CLEAR_RULES[o.kind];
    return { tool: 'AXE', action: { type: 'CLEAR', obstacleId: o.id }, hint: `Dọn ${r.name}: -${r.stamina} ⚡` };
  }
  const sid = structureAt(x, y);
  if (sid) {
    if (estate.repaired.includes(sid)) return { tool: 'NONE', action: null, hint: REPAIRED_HINT[sid] };
    const r = REPAIRS[sid];
    return {
      tool: 'HAMMER',
      action: { type: 'REPAIR', structureId: sid },
      confirm: { title: `Sửa ${r.name}`, cost: repairCostText(sid), unlocks: `Mở ${r.unlocks} · +${r.fengShui} Phong Thủy` },
    };
  }
  const ri = regionIndexAt(x, y);
  if (ri >= 0 && ri >= estate.reclaimed) {
    if (ri > estate.reclaimed) return { tool: 'NONE', action: null, hint: `⛏️ Khai hoang vùng ${estate.reclaimed + 1} trước.` };
    return {
      tool: 'HOE',
      action: { type: 'RECLAIM', regionIndex: ri },
      confirm: {
        title: `Khai hoang vùng ${ri + 1}`,
        cost: `${reclaimCost(ri)} 🪙 + ${EXPAND_STAMINA} ⚡`,
        unlocks: `+${RECLAIM_REGIONS[ri].length} ô ruộng`,
      },
    };
  }
  if (layoutCharAt(x, y) === 'D') return { tool: 'NONE', action: null, hint: '🌳 Cây đa đầu làng — ông bà để lại làm bóng mát, không chặt.' };
  if (layoutCharAt(x, y) === 'P') return { tool: 'ROD', action: null, hint: '🎣 Thả và câu cá mở ở bản sau (P1-9).' };
  return null;
}
