/**
 * P1-4/P1-5 — trạng thái bản thử `?p1`. Một nguồn cho cả scene Phaser và HUD React.
 * Mọi thay đổi trạng thái nông trại đi qua `applyActions` (ADR-001); store chỉ giữ kết quả.
 * Chưa lưu (P1-7), chưa gửi server (P1-8).
 */
import { create } from 'zustand';
import { findItem, type FarmSave, withRegen } from '../domain/farm';
import { type Tool, nearestActionablePlot, plotAction, toolForTarget } from '../domain/tools';
import { type Action, type ActionResult, applyActions } from '../engine/applyActions';
import type { TilePos } from '../game/slice/estateMap';
import { SLICE_GAME_STAGE, newSliceSave, sowableSeeds, targetAt } from '../game/slice/sliceSave';

export interface Toast {
  id: number;
  text: string;
  ok: boolean;
}

/** Hiệu ứng nổi trên ô sau mỗi thao tác thành công (scene đọc và vẽ). */
export interface TileFx {
  seq: number;
  x: number;
  y: number;
  tool: Tool;
}

const TOAST_MS = 2600;
const VERB: Partial<Record<Action['type'], string>> = { PLANT: 'gieo', WATER: 'tưới', HARVEST: 'gặt' };

interface SliceState {
  save: FarmSave;
  now: number;
  seedId: string | null;
  playerTile: TilePos;
  toasts: Toast[];
  fx: TileFx[];
  tick: (now: number) => void;
  setPlayerTile: (t: TilePos) => void;
  setSeed: (id: string) => void;
  toast: (text: string, ok?: boolean) => void;
  act: (actions: Action[]) => ActionResult[];
  actNear: () => void;
  sell: (itemId: string, qty: number) => void;
  reset: (now: number) => void;
}

let seq = 0;

function initial(now: number) {
  const save = newSliceSave(now);
  return { save, now, seedId: sowableSeeds(save, now)[0]?.id ?? null, toasts: [] as Toast[], fx: [] as TileFx[] };
}

export const useSliceStore = create<SliceState>()((set, get) => ({
  ...initial(Date.now()),
  playerTile: { x: 0, y: 0 },

  tick: (now) => set((s) => ({ now, save: withRegen(s.save, now) })),

  setPlayerTile: (t) => {
    const p = get().playerTile;
    if (p.x !== t.x || p.y !== t.y) set({ playerTile: t });
  },

  setSeed: (id) => set({ seedId: id }),

  toast: (text, ok = true) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, ok }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), TOAST_MS);
  },

  act: (actions) => {
    if (!actions.length) return [];
    const now = Date.now();
    const s = get();
    const out = applyActions(s.save, actions, { now, rng: Math.random, gameStage: SLICE_GAME_STAGE });
    const okIdx = out.results.filter((r) => r.ok).map((r) => r.index);
    const fx: TileFx[] = okIdx.flatMap((i) => {
      const a = actions[i];
      const tile = 'tileId' in a ? out.save.tiles.find((t) => t.id === a.tileId) : undefined;
      if (!tile) return [];
      const tool: Tool = a.type === 'PLANT' ? 'SEED' : a.type === 'WATER' ? 'WATER' : 'SICKLE';
      return [{ seq: ++seq, x: tile.tileX, y: tile.tileY, tool }];
    });
    // Hạt giống vừa gieo có thể không còn hợp lệ sau khi lên cấp/đổi mùa — giữ nguyên nếu vẫn gieo được.
    const seeds = sowableSeeds(out.save, now);
    const seedId = seeds.some((c) => c.id === s.seedId) ? s.seedId : (seeds[0]?.id ?? null);
    set({ save: out.save, now, seedId, fx: [...s.fx.slice(-20), ...fx] });

    const firstFail = out.results.find((r) => !r.ok);
    if (actions.length === 1) {
      get().toast(out.results[0].message, out.results[0].ok);
    } else {
      const verb = VERB[actions[0].type] ?? 'làm';
      get().toast(`Đã ${verb} ${okIdx.length}/${actions.length} ô${firstFail ? ` — ${firstFail.message}` : ''}`, okIdx.length > 0);
    }
    return out.results;
  },

  actNear: () => {
    const s = get();
    const near = nearestActionablePlot(s.save.tiles, s.playerTile.x, s.playerTile.y, Date.now());
    if (near) {
      const a = plotAction(near.tool, near.tile.id, s.seedId);
      if (a) s.act([a]);
      else get().toast('Chưa chọn hạt giống — mở túi hạt để chọn.', false);
      return;
    }
    // Không có ô ruộng nào trong tầm: báo đối tượng kề bên (nếu có) sẽ mở ở thẻ nào.
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const kind = targetAt(s.playerTile.x + dx, s.playerTile.y + dy);
        const msg = notYet(kind);
        if (msg) return get().toast(msg, false);
      }
    }
    get().toast('Không có việc ở đây — đi tới ruộng, chuồng hoặc ao.', false);
  },

  sell: (itemId, qty) => {
    get().act([{ type: 'SELL', itemId, qty }]);
  },

  reset: (now) => set({ ...initial(now) }),
}));

/** Đối tượng chưa có luật ở bản thử → lời nhắn mở ở thẻ nào (LT-12). `null` nếu không phải đối tượng. */
export function notYet(kind: ReturnType<typeof targetAt>): string | null {
  switch (kind) {
    case 'WILD':
      return '⛏️ Cuốc đất hoang mở ở bản sau (khai hoang, P1-10).';
    case 'COOP':
      return '🌽 Cho gà ăn mở ở bản sau (P1-9).';
    case 'POND':
      return '🎣 Thả và câu cá mở ở bản sau (P1-9).';
    case 'ROCK':
    case 'TREE':
      return '🪓 Dọn đá, gốc cây mở ở bản sau (P1-10).';
    case 'HOUSE':
      return '🏚️ Sửa nhà mở ở bản sau (P1-10).';
    case 'WELL':
      return '🪣 Sửa giếng mở ở bản sau (P1-10).';
    default:
      return null;
  }
}

/** Công cụ mà nút hành động sẽ dùng nếu bấm bây giờ (HUD hiển thị). */
export function selectActionTool(s: Pick<SliceState, 'save' | 'playerTile' | 'now'>): Tool {
  const near = nearestActionablePlot(s.save.tiles, s.playerTile.x, s.playerTile.y, s.now);
  if (near) return near.tool;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const t = toolForTarget(targetAt(s.playerTile.x + dx, s.playerTile.y + dy), undefined, s.now);
      if (t !== 'NONE') return t;
    }
  }
  return 'NONE';
}

export const itemLabel = (id: string) => {
  const it = findItem(id);
  return it ? `${it.emoji} ${it.name}` : id;
};
