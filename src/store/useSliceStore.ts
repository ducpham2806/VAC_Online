/**
 * P1-4/P1-5 — trạng thái bản thử `?p1`. Một nguồn cho cả scene Phaser và HUD React.
 * Mọi thay đổi trạng thái nông trại đi qua `applyActions` (ADR-001); store chỉ giữ kết quả.
 * P1-6: công tắc đổi mùa của bản thử (`seasonOverride`). P1-7: lưu cục bộ `vac_slice_save_v1`
 * (`version` + `migrate`), chỉ cho bản thử, không đẩy lên server. Chưa gửi server (P1-8).
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Season } from '../data/types';
import { SEASON_ORDER, seasonAt } from '../domain/season';
import { findItem, type FarmSave, withRegen } from '../domain/farm';
import { type Tool, nearestActionablePlot, plotAction, toolForTarget } from '../domain/tools';
import { type Action, type ActionResult, applyActions } from '../engine/applyActions';
import type { TilePos } from '../game/slice/estateMap';
import {
  SLICE_GAME_STAGE,
  SLICE_SAVE_KEY,
  SLICE_SAVE_VERSION,
  newSliceSave,
  reconcileSliceSave,
  sowableSeeds,
  targetAt,
} from '../game/slice/sliceSave';

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

interface SliceState {
  save: FarmSave;
  now: number;
  seedId: string | null;
  /** `null` = theo lịch thật (KT-17). */
  seasonOverride: Season | null;
  playerTile: TilePos;
  toasts: Toast[];
  fx: TileFx[];
  tick: (now: number) => void;
  setPlayerTile: (t: TilePos) => void;
  setSeed: (id: string) => void;
  setSeasonOverride: (s: Season | null) => void;
  toast: (text: string, ok?: boolean) => void;
  act: (actions: Action[]) => ActionResult[];
  actNear: () => void;
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
  };
}

export const useSliceStore = create<SliceState>()(
  persist(
    (set, get) => ({
      ...initial(Date.now()),
      playerTile: { x: 0, y: 0 },

      tick: (now) => set((s) => ({ now, save: withRegen(s.save, now) })),

      setPlayerTile: (t) => {
        const p = get().playerTile;
        if (p.x !== t.x || p.y !== t.y) set({ playerTile: t });
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

      act: (actions) => {
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
          if (!tile) return [];
          const tool: Tool = a.type === 'PLANT' ? 'SEED' : a.type === 'WATER' ? 'WATER' : 'SICKLE';
          return [{ seq: ++seq, x: tile.tileX, y: tile.tileY, tool }];
        });
        // Lên cấp có thể mở giống mới; giữ giống đang chọn nếu vẫn gieo được.
        const seedId = validSeed(out.save, season, s.seedId);
        set({ save: out.save, now, seedId, fx: [...s.fx.slice(-20), ...fx] });

        const firstFail = out.results.find((r) => !r.ok);
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
    }),
    {
      name: SLICE_SAVE_KEY,
      version: SLICE_SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        save: s.save,
        seedId: s.seedId,
        seasonOverride: s.seasonOverride,
      }),
      // Phiên bản lạ (cũ hơn chưa có nhánh chuyển, hoặc mới hơn) → chơi lại từ đầu thay vì đọc sai.
      migrate: (persisted, version) => (version === SLICE_SAVE_VERSION ? persisted : {}),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Pick<SliceState, 'save' | 'seedId' | 'seasonOverride'>>;
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
        };
      },
    },
  ),
);

const SEASONS: readonly Season[] = ['XUAN', 'HA', 'THU', 'DONG'];

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

const SEASON_NAME: Record<Season, string> = { XUAN: 'Xuân', HA: 'Hạ', THU: 'Thu', DONG: 'Đông' };

/** Lời nhắn khi bấm gieo mà chưa có giống: phân biệt "chưa chọn" với "mùa này không có giống nào" (GP-20). */
export function noSeedMessage(s: Pick<SliceState, 'save' | 'now' | 'seasonOverride'>): string {
  const season = effectiveSeason(s);
  return sowableSeeds(s.save, season).length
    ? 'Chưa chọn hạt giống — mở túi hạt để chọn.'
    : `🍂 Mùa ${SEASON_NAME[season]} chưa có giống nào gieo được ở cấp ${s.save.level}.`;
}
