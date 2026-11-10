/**
 * P1-4/P1-5 — trạng thái bản thử `?p1`. Một nguồn cho cả scene Phaser và HUD React.
 * Mọi thay đổi trạng thái nông trại đi qua `applyActions` (ADR-001); store chỉ giữ kết quả.
 * P1-6: công tắc đổi mùa của bản thử (`seasonOverride`). P1-7: lưu cục bộ `vac_slice_save_v1`
 * (`version` + `migrate`), chỉ cho bản thử, không đẩy lên server. Chưa gửi server (P1-8).
 * P1-10: dọn đá/gốc cây, sửa hạng mục, khai hoang (GP-14); việc tốn vàng hỏi lại qua `pending`.
 * P1-11: NPC có tim (hộp thoại `dialog`), cảnh mở đầu chọn hướng, Gia Phả Chương 1, cờ hướng dẫn `tut`.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Season } from '../data/types';
import { SEASON_ORDER, seasonAt } from '../domain/season';
import { findItem, type FarmSave, withRegen } from '../domain/farm';
import { type Tool, nearestActionablePlot, plotAction } from '../domain/tools';
import { MATERIALS, isMaterial } from '../domain/estate';
import { NPC_IDS, type NpcId, npcAt } from '../data/npcs';
import { spawnTile } from '../game/slice/estateMap';
import { type Action, type ActionResult, applyActions } from '../engine/applyActions';
import type { TilePos } from '../game/slice/estateMap';
import {
  SLICE_GAME_STAGE,
  SLICE_SAVE_KEY,
  SLICE_SAVE_VERSION,
  newSliceSave,
  reconcileSliceSave,
  sowableSeeds,
} from '../game/slice/sliceSave';
import { type EstateConfirm, type EstateTarget, estateTargetAt } from '../game/slice/estateTarget';

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
const VERB: Partial<Record<Action['type'], string>> = {
  PLANT: 'gieo',
  WATER: 'tưới',
  HARVEST: 'gặt',
};
const ACTION_TOOL: Partial<Record<Action['type'], Tool>> = {
  PLANT: 'SEED',
  WATER: 'WATER',
  HARVEST: 'SICKLE',
  CLEAR: 'AXE',
  REPAIR: 'HAMMER',
  RECLAIM: 'HOE',
};

/** Cờ hướng dẫn bản thử (GP-62): những việc không có trong `save`. */
export interface TutorialFlags {
  moved: boolean;
  sold: boolean;
  hidden: boolean;
}

/** Hộp thoại NPC đang mở; `line` = câu vừa nói (chào, phản ứng quà, cảnh tim). */
export interface NpcDialog {
  npcId: NpcId;
  line: string;
}

/** Việc tốn vàng đang chờ người chơi xác nhận (sửa hạng mục, khai hoang). */
export interface PendingEstate extends EstateConfirm {
  action: Action;
  at: TilePos;
}

interface SliceState {
  save: FarmSave;
  now: number;
  seedId: string | null;
  /** `null` = theo lịch thật (KT-17). */
  seasonOverride: Season | null;
  playerTile: TilePos;
  toasts: Toast[];
  fx: TileFx[];
  pending: PendingEstate | null;
  tut: TutorialFlags;
  dialog: NpcDialog | null;
  tick: (now: number) => void;
  setPlayerTile: (t: TilePos) => void;
  setSeed: (id: string) => void;
  setSeasonOverride: (s: Season | null) => void;
  toast: (text: string, ok?: boolean) => void;
  /** `at`: ô hiển thị hiệu ứng cho thao tác không gắn ô ruộng (dọn, sửa, khai hoang). */
  act: (actions: Action[], at?: TilePos, silent?: boolean) => ActionResult[];
  actNear: () => void;
  /** Chạm đối tượng điền trang ở ô `t` (đã trong tầm). */
  interactEstate: (t: TilePos) => void;
  confirmPending: () => void;
  cancelPending: () => void;
  openNpc: (id: NpcId) => void;
  closeNpc: () => void;
  talkTo: (id: NpcId) => void;
  giftTo: (id: NpcId, itemId: string) => void;
  choosePath: (path: 'EMP' | 'PRAG') => void;
  claimChapter: (no: number) => void;
  setTutorialHidden: (hidden: boolean) => void;
  sell: (itemId: string, qty: number) => void;
  reset: (now: number) => void;
}

let seq = 0;

/** Mùa đang áp dụng cho bản thử: công tắc nếu có, không thì lịch thật. */
export function effectiveSeason(s: Pick<SliceState, 'now' | 'seasonOverride'>): Season {
  return s.seasonOverride ?? seasonAt(s.now).season;
}

/** Giữ giống đang chọn nếu còn gieo được; không thì lấy giống đầu tiên hợp lệ. */
function validSeed(save: FarmSave, season: Season, seedId: string | null): string | null {
  const seeds = sowableSeeds(save, season);
  return seeds.some((c) => c.id === seedId) ? seedId : (seeds[0]?.id ?? null);
}

function initial(now: number) {
  const save = newSliceSave(now);
  return {
    save,
    now,
    seasonOverride: null,
    seedId: validSeed(save, seasonAt(now).season, null),
    toasts: [] as Toast[],
    fx: [] as TileFx[],
    pending: null,
    tut: { moved: false, sold: false, hidden: false } as TutorialFlags,
    dialog: null,
  };
}

export const useSliceStore = create<SliceState>()(
  persist(
    (set, get) => ({
      ...initial(Date.now()),
      playerTile: { x: 0, y: 0 },

      tick: (now) => set((s) => ({ now, save: withRegen(s.save, now) })),

      setPlayerTile: (t) => {
        const s = get();
        const p = s.playerTile;
        if (p.x === t.x && p.y === t.y) return;
        const sp = spawnTile();
        // "đã đi" = rời chỗ xuất hiện sau lần đặt vị trí đầu tiên (0,0 là giá trị khởi tạo)
        const moved = s.tut.moved || ((p.x !== 0 || p.y !== 0) && (t.x !== sp.x || t.y !== sp.y));
        set({ playerTile: t, ...(moved !== s.tut.moved ? { tut: { ...s.tut, moved } } : {}) });
      },

      setSeed: (id) => set({ seedId: id }),

      setSeasonOverride: (season) => {
        const s = get();
        const next = { now: Date.now(), seasonOverride: season };
        set({
          ...next,
          seedId: validSeed(s.save, effectiveSeason(next), s.seedId),
        });
      },

      toast: (text, ok = true) => {
        const id = ++seq;
        set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, ok }] }));
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), TOAST_MS);
      },

      act: (actions, at, silent) => {
        if (!actions.length) return [];
        const now = Date.now();
        const s = get();
        const season = effectiveSeason({
          now,
          seasonOverride: s.seasonOverride,
        });
        const out = applyActions(s.save, actions, {
          now,
          rng: Math.random,
          gameStage: SLICE_GAME_STAGE,
          season: s.seasonOverride ?? undefined,
        });
        const okIdx = out.results.filter((r) => r.ok).map((r) => r.index);
        const fx: TileFx[] = okIdx.flatMap((i) => {
          const a = actions[i];
          const tile = 'tileId' in a ? out.save.tiles.find((t) => t.id === a.tileId) : undefined;
          const pos = tile ? { x: tile.tileX, y: tile.tileY } : at;
          const tool = ACTION_TOOL[a.type];
          if (!pos || !tool) return [];
          return [{ seq: ++seq, x: pos.x, y: pos.y, tool }];
        });
        // Lên cấp có thể mở giống mới; giữ giống đang chọn nếu vẫn gieo được.
        const seedId = validSeed(out.save, season, s.seedId);
        set({ save: out.save, now, seedId, fx: [...s.fx.slice(-20), ...fx] });

        const firstFail = out.results.find((r) => !r.ok);
        if (silent) return out.results;
        if (actions.length === 1) {
          get().toast(out.results[0].message, out.results[0].ok);
        } else {
          const verb = VERB[actions[0].type] ?? 'làm';
          get().toast(
            `Đã ${verb} ${okIdx.length}/${actions.length} ô${firstFail ? ` — ${firstFail.message}` : ''}`,
            okIdx.length > 0,
          );
        }
        return out.results;
      },

      actNear: () => {
        const s = get();
        const near = nearestActionablePlot(s.save.tiles, s.playerTile.x, s.playerTile.y, Date.now());
        if (near) {
          const a = plotAction(near.tool, near.tile.id, s.seedId);
          if (a) s.act([a]);
          else get().toast(noSeedMessage(get()), false);
          return;
        }
        // NPC kề bên → mở hộp thoại (GP-50).
        const npc = npcNear(s.playerTile);
        if (npc) return get().openNpc(npc);
        // Không có ô ruộng nào trong tầm: việc điền trang kề bên (dọn, sửa, khai hoang) hoặc lời nhắn.
        const e = estateNear(s);
        if (e) return get().interactEstate(e.at);
        get().toast('Không có việc ở đây — đi tới ruộng, chuồng hoặc ao.', false);
      },

      interactEstate: (at) => {
        const s = get();
        const target = estateTargetAt(s.save, at.x, at.y);
        if (!target) return;
        if (target.action && target.confirm) return set({ pending: { ...target.confirm, action: target.action, at } });
        if (target.action) {
          s.act([target.action], at);
          return;
        }
        if (target.hint) s.toast(target.hint, false);
      },

      confirmPending: () => {
        const p = get().pending;
        set({ pending: null });
        if (p) get().act([p.action], p.at);
      },

      cancelPending: () => set({ pending: null }),

      sell: (itemId, qty) => {
        const [r] = get().act([{ type: 'SELL', itemId, qty }]);
        const s = get();
        if (r?.ok && !s.tut.sold) set({ tut: { ...s.tut, sold: true } });
      },

      // Mở hộp thoại = chào hỏi: lần đầu trong ngày mới cộng tim (GP-50).
      openNpc: (npcId) => get().talkTo(npcId),

      closeNpc: () => set({ dialog: null }),

      talkTo: (npcId) => {
        const [r] = get().act([{ type: 'TALK', npcId }], undefined, true);
        if (r) set({ dialog: { npcId, line: r.message } });
      },

      giftTo: (npcId, itemId) => {
        const [r] = get().act([{ type: 'GIFT', npcId, itemId }], undefined, true);
        if (r) set({ dialog: { npcId, line: r.message } });
      },

      choosePath: (path) => {
        get().act([{ type: 'CHOOSE_PATH', path }]);
      },

      claimChapter: (no) => {
        get().act([{ type: 'CLAIM_CHAPTER', chapterNo: no }]);
      },

      setTutorialHidden: (hidden) => set((s) => ({ tut: { ...s.tut, hidden } })),

      reset: (now) => set({ ...initial(now) }),
    }),
    {
      name: SLICE_SAVE_KEY,
      version: SLICE_SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        save: s.save,
        seedId: s.seedId,
        seasonOverride: s.seasonOverride,
        tut: s.tut,
      }),
      // v1 → v2 → v3 chỉ thêm trường (`save.estate`, `save.npcs`, `save.story`, `tut`); thiếu = ban đầu.
      // Phiên bản lạ (mới hơn, hoặc không phải số) → chơi lại từ đầu thay vì đọc sai.
      migrate: (persisted, version) => (version >= 1 && version <= SLICE_SAVE_VERSION ? persisted : {}),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Pick<SliceState, 'save' | 'seedId' | 'seasonOverride' | 'tut'>>;
        const save = reconcileSliceSave(p.save);
        if (!save) return current;
        const seasonOverride = SEASON_ORDER.includes(p.seasonOverride as Season) ? (p.seasonOverride as Season) : null;
        const now = Date.now();
        return {
          ...current,
          save: withRegen(save, now),
          now,
          seasonOverride,
          seedId: validSeed(save, effectiveSeason({ now, seasonOverride }), p.seedId ?? null),
          tut: { moved: p.tut?.moved === true, sold: p.tut?.sold === true, hidden: p.tut?.hidden === true },
        };
      },
    },
  ),
);

/** NPC trong tầm (ô đang đứng hoặc 8 ô quanh). */
export function npcNear(p: TilePos): NpcId | undefined {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const id = npcAt(p.x + dx, p.y + dy);
      if (id) return id;
    }
  }
  return undefined;
}

export { NPC_IDS };

/** Đối tượng điền trang trong tầm (8 ô quanh người chơi): ưu tiên ô có việc làm được, không thì ô có lời nhắn. */
function estateNear(s: Pick<SliceState, 'save' | 'playerTile'>): { at: TilePos; target: EstateTarget } | null {
  let hint: { at: TilePos; target: EstateTarget } | null = null;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const at = { x: s.playerTile.x + dx, y: s.playerTile.y + dy };
      const target = estateTargetAt(s.save, at.x, at.y);
      if (target?.action) return { at, target };
      if (target && !hint) hint = { at, target };
    }
  }
  return hint;
}

/** Công cụ mà nút hành động sẽ dùng nếu bấm bây giờ (HUD hiển thị). */
export function selectActionTool(s: Pick<SliceState, 'save' | 'playerTile' | 'now'>): Tool {
  const near = nearestActionablePlot(s.save.tiles, s.playerTile.x, s.playerTile.y, s.now);
  if (near) return near.tool;
  if (npcNear(s.playerTile)) return 'HAND';
  return estateNear(s)?.target.tool ?? 'NONE';
}

export const itemLabel = (id: string) => {
  if (isMaterial(id)) return `${MATERIALS[id].emoji} ${MATERIALS[id].name}`;
  const it = findItem(id);
  return it ? `${it.emoji} ${it.name}` : id;
};

const SEASON_NAME: Record<Season, string> = { XUAN: 'Xuân', HA: 'Hạ', THU: 'Thu', DONG: 'Đông' };

/** Lời nhắn khi bấm gieo mà chưa có giống: phân biệt "chưa chọn" với "mùa này không có giống nào" (GP-20). */
export function noSeedMessage(s: Pick<SliceState, 'save' | 'now' | 'seasonOverride'>): string {
  const season = effectiveSeason(s);
  return sowableSeeds(s.save, season).length
    ? 'Chưa chọn hạt giống — mở túi hạt để chọn.'
    : `🍂 Mùa ${SEASON_NAME[season]} chưa có giống nào gieo được ở cấp ${s.save.level}.`;
}
