import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGameStore } from './useGameStore';

/**
 * Trạng thái riêng của Hướng dẫn tân thủ (src/domain/tutorial.ts) — tách khỏi save game nên
 * không đổi cấu trúc `vac_online_save_v1` và vẫn nhớ được ở chế độ online.
 */
interface TutorialState {
  dismissed: boolean;
  soldOnce: boolean;
  dismiss: () => void;
  markSold: () => void;
}

export const TUTORIAL_STORAGE_KEY = 'vac_tutorial_v1';

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      dismissed: false,
      soldOnce: false,
      dismiss: () => set({ dismissed: true }),
      markSold: () => set({ soldOnce: true }),
    }),
    {
      name: TUTORIAL_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ dismissed: s.dismissed, soldOnce: s.soldOnce }),
    }
  )
);

/**
 * Bán cho HTX thành công = đang mở Kho, vàng tăng và hàng trong kho giảm (cả online lẫn offline).
 * Trả về hàm hủy theo dõi.
 */
export function watchFirstSale(): () => void {
  return useGameStore.subscribe((now, prev) => {
    if (useTutorialStore.getState().soldOnce) return;
    if (prev.activeModal !== 'WAREHOUSE' && now.activeModal !== 'WAREHOUSE') return;
    const total = (inv: Record<string, number>) => Object.values(inv).reduce((a, b) => a + b, 0);
    if (now.gold > prev.gold && total(now.inventory) < total(prev.inventory)) {
      useTutorialStore.getState().markSold();
    }
  });
}
