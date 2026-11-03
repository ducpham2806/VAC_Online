import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MAX_WILD_PLOTS } from '../domain/farm';
import { normalizePlotTiles } from '../domain/farmGrid';
import type { StoryQuest } from '../data/quests';
import type { GameState } from './gameTypes';
import {
  PERSISTED_KEYS,
  PersistedSave,
  SAVE_STORAGE_KEY,
  USE_DEMO_SAVE,
  createDemoState,
  createFreshState,
} from './initialState';
import { createStoreHelpers } from './storeHelpers';
import { INITIAL_WORKERS } from '../data/masterData';
import { pantryTotal } from '../domain/workers';
import { workersView } from './initialState';
import { createEconomySlice } from './slices/economySlice';
import { createFarmSlice } from './slices/farmSlice';
import { createKitchenSlice } from './slices/kitchenSlice';
import { createLiveOpsSlice } from './slices/liveOpsSlice';
import { createMetaSlice } from './slices/metaSlice';
import { createSocialSlice } from './slices/socialSlice';
import { createWorkersSlice } from './slices/workersSlice';

/**
 * Store duy nhất của game. Từ S2 được ghép từ các slice trong `./slices/` — API công khai giữ nguyên
 * (RULE D1): mọi action, kiểu và hằng số dưới đây vẫn import được từ file này.
 */
export type { StoryQuest };
export { MAX_WILD_PLOTS, SAVE_STORAGE_KEY, createFreshState };
export { todayInVietnam } from './initialState';
export type { ActiveModalType, CoopOrder, GameState, TrainCrate, WeatherType } from './gameTypes';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const helpers = createStoreHelpers(set, get);
      return {
        ...(USE_DEMO_SAVE ? createDemoState() : createFreshState()),
        ...createMetaSlice(set, get, helpers),
        ...createFarmSlice(set, get, helpers),
        ...createWorkersSlice(set, get, helpers),
        ...createEconomySlice(set, get, helpers),
        ...createKitchenSlice(set, get, helpers),
        ...createSocialSlice(set, get, helpers),
        ...createLiveOpsSlice(set, get, helpers),
      };
    },
    {
      name: SAVE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Chế độ online: server là nguồn chân lý → chỉ nhớ chế độ, không lưu tiến trình cục bộ.
      partialize: (state): PersistedSave =>
        state.farmMode === 'cloud'
          ? { farmMode: 'cloud' }
          : (Object.fromEntries(PERSISTED_KEYS.map((k) => [k, state[k]])) as PersistedSave),
      migrate: (persisted) => persisted as PersistedSave,
      // Save cũ: bổ sung ô đất đã khai hoang nhưng trước đây chưa có trên lưới (M02.4, lưới 5×5).
      merge: (persisted, current) => {
        const save = (persisted ?? {}) as PersistedSave;
        const merged: GameState = { ...current, ...save };
        const workerRecords = merged.workerRecords ?? {};
        const workerPantry = merged.workerPantry ?? {};
        return {
          ...merged,
          tiles: normalizePlotTiles(merged.tiles, merged.wildPlotsUnlocked),
          progressCounters: merged.progressCounters ?? {},
          // Save trước S4 chưa có Bếp Quê.
          machines: merged.machines ?? {},
          discoveredRecipes: merged.discoveredRecipes ?? [],
          // S5c: thợ tính từ hợp đồng thật; Giỏ Thợ là hàng thật (save cũ chỉ có con số → bỏ).
          workerRecords,
          workerPantry,
          workerPantryCount: pantryTotal(workerPantry),
          workers: workersView(INITIAL_WORKERS, workerRecords, Date.now()),
        };
      },
    }
  )
);

