/**
 * Slice Lán Thợ (S5c — `17` mục C3). Chỉ điều phối:
 *  - offline: áp luật thuần ở `src/domain/workers.ts`;
 *  - online: gọi RPC của migration 0011 (server tự tick thợ trong rpc_get_my_farm).
 * Giữ tên mọi action cũ (RULE D1). Đã bỏ 3 nguồn in tiền của bản stub: Giỏ Thợ quy ra 18🪙/món + quà cố định,
 * offline hồi +10⚡/giờ, thợ tự gieo lại không tốn giống.
 */
import { GAME_STAGE } from '../../config/features';
import { claimPantry, equipGear, hireWorker, pantryTotal, serveLodgeMeal as serveLodgeMealRule, tickWorkers } from '../../domain/workers';
import { findItem } from '../../domain/farm';
import { STARTER_RECIPE_ID } from '../../domain/cooking';
import type { GameState } from '../gameTypes';
import { fromWorkersSave, toWorkersSave } from '../initialState';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type WorkersActions = Pick<
  GameState,
  | 'tickWorkerAutomation'
  | 'toggleWorkerAutoTick'
  | 'claimWorkerPantry'
  | 'feedWorker'
  | 'equipWorkerGear'
  | 'payWorkerSalary'
  | 'giveWorkerBonus'
  | 'simulateOfflineWorkerProgress'
  | 'addMealsToLodgeTable'
  | 'serveLodgeMeal'
>;

/** Online: mỗi lần tick tự động chỉ đồng bộ server tối đa 1 lần / phút. */
const CLOUD_TICK_MIN_MS = 60_000;
let lastCloudTick = 0;

export const createWorkersSlice = (set: StoreSet, get: StoreGet, { runCloud }: StoreHelpers): WorkersActions => {
  const now = (): number => Date.now() + get().clockOffsetMs;

  /** Offline: tick thợ rồi trả về save đã tick. */
  const tickedLocal = () => tickWorkers(toWorkersSave(get()), now());

  return {
    tickWorkerAutomation: () => {
      const state = get();
      if (state.farmMode === 'cloud') {
        if (Date.now() - lastCloudTick < CLOUD_TICK_MIN_MS || state.farmBusy) return;
        lastCloudTick = Date.now();
        void state.syncFarmFromServer();
        return;
      }
      if (!state.workerAutoTickEnabled) return;
      const before = pantryTotal(state.workerPantry ?? {});
      const next = tickedLocal();
      const gained = pantryTotal(next.pantry) - before;
      set({
        ...fromWorkersSave(next, now()),
        ...(gained > 0 ? { toastMessage: `🛖 Thợ vừa thu +${gained} vào Giỏ Thợ (${pantryTotal(next.pantry)}/120)!` } : {}),
      });
    },

    toggleWorkerAutoTick: () => {
      const next = !get().workerAutoTickEnabled;
      set({
        workerAutoTickEnabled: next,
        toastMessage: next
          ? '🟢 Đã BẬT Lán Thợ: thợ tự tưới và thu ô chín ≥ 5 phút vào Giỏ Thợ (bạn vẫn tự gieo).'
          : '⏸️ Đã TẠM DỪNG Lán Thợ (chỉ ở chế độ offline).',
      });
    },

    claimWorkerPantry: () => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const before = state.workerPantryCount;
        void runCloud('rpc_claim_worker_pantry', {}, (snap, prev) => {
          const got = Object.entries(snap.inventory).reduce((a, [id, n]) => a + Math.max(0, n - (prev.inventory[id] ?? 0)), 0);
          return `📥 Đã thu ${got || before} món từ Giỏ Thợ về Kho!`;
        });
        return;
      }
      const r = claimPantry(tickedLocal());
      if (r.ok) set({ ...fromWorkersSave(r.save, now()), toastMessage: r.message });
      else set({ toastMessage: r.message });
    },

    // Giữ chữ ký cũ. Từ S5c thợ tự ăn ở Bàn Ăn — không còn "cho ăn miễn phí" (+Độ No không tốn gì).
    feedWorker: () => {
      set({ toastMessage: '🍚 Dọn món Bếp Quê lên Bàn Ăn Chung — thợ đói (< 35) sẽ tự về ăn!' });
    },

    /** M05.3 — Cấp 1 đồ thợ trong Kho (làm ở Xưởng Đan Lát / Khung Cửi): 72 giờ Độ No hao chậm 25%. */
    equipWorkerGear: (workerCode, gearId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const gear = findItem(gearId);
        void runCloud('rpc_equip_worker_gear', { p_worker_id: workerCode, p_gear_id: gearId }, () =>
          `👕 Đã cấp [${gear?.emoji ?? ''} ${gear?.name ?? gearId}]: 72 giờ Độ No hao chậm 25%!`
        );
        return;
      }
      const r = equipGear(toWorkersSave(state), workerCode, gearId, GAME_STAGE, now());
      if (r.ok) set({ ...fromWorkersSave(r.save, now()), toastMessage: r.message });
      else set({ toastMessage: r.message });
    },
    // Phụ Cấp Ngày Mùa: PO chưa chốt tác dụng / giá (lương đã hạ 25%) → chưa mở, không trừ vàng.
    giveWorkerBonus: () => {
      set({ toastMessage: '🧧 Phụ Cấp Ngày Mùa sẽ mở ở bản sau!' });
    },

    /** Thuê / gia hạn hợp đồng 3 ngày (M05.1). */
    payWorkerSalary: (workerCode) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const w = findItem(workerCode);
        void runCloud('rpc_hire_worker', { p_worker_id: workerCode }, (snap, prev) =>
          `🪙 Đã trả lương 3 ngày (-${(prev.gold - snap.profile.gold).toLocaleString()} 🪙, rẻ hơn 12%) cho [${w?.emoji ?? ''} ${w?.name ?? workerCode}]!`
        );
        return;
      }
      const r = hireWorker(toWorkersSave(state), workerCode, GAME_STAGE, now());
      if (r.ok) set({ ...fromWorkersSave(r.save, now()), toastMessage: r.message });
      else set({ toastMessage: r.message });
    },

    /** Chỉ dùng thử ở chế độ offline: lùi đồng hồ ô đất + thợ `hoursOffline` giờ rồi tick (M05.5). */
    simulateOfflineWorkerProgress: (hoursOffline) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        set({ toastMessage: '🌙 Giả lập offline chỉ dùng ở chế độ offline (server tính giờ thật).' });
        return;
      }
      const shift = Math.max(1, Math.min(24, Math.floor(hoursOffline))) * 3_600_000;
      const base = toWorkersSave(state);
      const rewound = {
        ...base,
        tiles: base.tiles.map((t) =>
          t.itemId ? { ...t, plantedAt: (t.plantedAt ?? 0) - shift, matureAt: (t.matureAt ?? 0) - shift } : t
        ),
        workers: Object.fromEntries(Object.entries(base.workers).map(([id, w]) => [id, { ...w, tickAt: w.tickAt - shift }])),
      };
      const next = tickWorkers(rewound, now());
      set({
        ...fromWorkersSave(next, now()),
        toastMessage: `🌙 [Offline ${shift / 3_600_000} giờ]: Giỏ Thợ ${pantryTotal(next.pantry)}/120, Bàn Ăn còn ${next.tableMeals} suất.`,
      });
    },

    // Giữ chữ ký cũ: dọn `portions` món Cơm Trắng từ Kho lên Bàn Ăn (không còn mua cơm bằng vàng; costGold bỏ qua).
    addMealsToLodgeTable: (portions) => {
      for (let i = 0; i < Math.max(1, portions); i += 1) {
        const before = get().lodgeDiningTableMeals;
        get().serveLodgeMeal(STARTER_RECIPE_ID);
        if (get().farmMode === 'cloud' || get().lodgeDiningTableMeals === before) break;
      }
    },

    /** Dọn 1 món Bếp Quê từ Kho lên Bàn Ăn (M05.2). */
    serveLodgeMeal: (dishId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const dish = findItem(dishId);
        void runCloud('rpc_serve_lodge_meal', { p_dish_id: dishId }, (snap, prev) =>
          `🍚 Đã dọn [${dish?.emoji ?? ''} ${dish?.name ?? dishId}] lên Bàn Ăn: +${(snap.lodge_meals ?? 0) - prev.lodgeDiningTableMeals} suất`
        );
        return;
      }
      const r = serveLodgeMealRule(toWorkersSave(state), dishId, GAME_STAGE);
      if (r.ok) set({ ...fromWorkersSave(r.save, now()), toastMessage: r.message });
      else set({ toastMessage: r.message });
    },
  };
};
