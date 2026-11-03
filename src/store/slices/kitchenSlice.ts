/**
 * Slice Bếp Quê & Xưởng (S4 — M04.1..M04.3). Chỉ điều phối:
 *  - offline: áp luật thuần ở `src/domain/cooking.ts`;
 *  - online: gọi RPC của migration 0009 và nhận ảnh chụp server (không tự cộng tiền/⚡).
 * Đặc tả: `17_PROJECT_AUDIT` mục C2.
 */
import { GAME_STAGE } from '../../config/features';
import {
  KitchenResult,
  buildMachine,
  collectCraft,
  discoverRecipe,
  eatDish as eatDishRule,
  kitchenItem,
  startCraft,
} from '../../domain/cooking';
import type { GameState } from '../gameTypes';
import { fromKitchenSave, toKitchenSave } from '../initialState';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type KitchenActions = Pick<
  GameState,
  'buildKitchenMachine' | 'startKitchenCraft' | 'collectKitchenCraft' | 'eatDish' | 'tryCookingPot'
>;

const label = (id: string): string => {
  const it = kitchenItem(id);
  return it ? `${it.emoji} ${it.name}` : id;
};

const levelUp = (level: number, prevLevel: number): string => (level > prevLevel ? ` — 🎉 LÊN CẤP ${level}!` : '');

export const createKitchenSlice = (set: StoreSet, get: StoreGet, { runCloud }: StoreHelpers): KitchenActions => {
  const applyKitchen = (result: KitchenResult): void => {
    if (result.ok) set({ ...fromKitchenSave(result.save), toastMessage: result.message });
    else set({ toastMessage: result.message });
  };
  const now = (): number => Date.now() + get().clockOffsetMs;

  return {
    buildKitchenMachine: (machineId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const it = kitchenItem(machineId);
        void runCloud('rpc_build_machine', { p_machine_id: machineId }, (snap, prev) =>
          `🏭 Đã xây [${label(machineId)}] (-${(it?.buyCostGold ?? 0).toLocaleString()} 🪙, +${it?.xpReward ?? 0} XP)${levelUp(snap.profile.level, prev.level)}`
        );
        return;
      }
      applyKitchen(buildMachine(toKitchenSave(state), machineId, GAME_STAGE));
    },

    startKitchenCraft: (machineId, productId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        void runCloud('rpc_start_craft', { p_machine_id: machineId, p_product_id: productId }, (snap) => {
          const readyAt = snap.machines?.[machineId]?.ready_at ?? snap.server_now;
          return `🔥 Đang nấu [${label(productId)}] — xong sau ${Math.ceil((readyAt - snap.server_now) / 60_000)} phút`;
        });
        return;
      }
      applyKitchen(startCraft(toKitchenSave(state), machineId, productId, GAME_STAGE, now()));
    },

    collectKitchenCraft: (machineId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        const productId = state.machines[machineId]?.craftItemId ?? '';
        void runCloud('rpc_collect_craft', { p_machine_id: machineId }, (snap, prev) =>
          `🍽️ Đã nấu xong [${label(productId)}]: +1 vào Kho, +${kitchenItem(productId)?.xpReward ?? 0} XP${levelUp(snap.profile.level, prev.level)}`
        );
        return;
      }
      applyKitchen(collectCraft(toKitchenSave(state), machineId, now()));
    },

    eatDish: (productId) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        void runCloud('rpc_eat_dish', { p_product_id: productId }, (snap, prev) =>
          `😋 Đã ăn [${label(productId)}]: +${Math.max(0, snap.profile.stamina - prev.stamina)} ⚡`
        );
        return;
      }
      applyKitchen(eatDishRule(toKitchenSave(state), productId, GAME_STAGE, now()));
    },

    tryCookingPot: (ingredientIds) => {
      const state = get();
      if (state.farmMode === 'cloud') {
        void runCloud('rpc_cook_pot', { p_ingredient_ids: ingredientIds }, (snap, prev) => {
          const found = (snap.recipes ?? []).find((id) => !prev.discoveredRecipes.includes(id));
          return found
            ? `🎉 KHÁM PHÁ MÓN MỚI: [${label(found)}]! +${snap.profile.gems - prev.gems} 💎, +50 XP${levelUp(snap.profile.level, prev.level)}`
            : '🍲 Nồi Đất đã nguội.';
        });
        return;
      }
      applyKitchen(discoverRecipe(toKitchenSave(state), ingredientIds, GAME_STAGE));
    },
  };
};
