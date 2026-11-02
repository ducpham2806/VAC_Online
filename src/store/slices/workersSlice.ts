/** Slice Workers của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { GAME_CATALOG } from '../../data/masterData';
import type { GameState } from '../gameTypes';
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
>;

export const createWorkersSlice = (set: StoreSet, get: StoreGet, _helpers: StoreHelpers): WorkersActions => ({
  tickWorkerAutomation: () => {
    const state = get();
    if (!state.workerAutoTickEnabled) return;

    const now = Date.now();
    let nextPantry = state.workerPantryCount;
    let nextMudCounter = state.pondMudCounter;
    let nextMealsOnTable = state.lodgeDiningTableMeals;
    const nextInv = { ...state.inventory };
    const actionsLog: string[] = [];

    // 1. Dì Bảy Bếp (WORK_04) tự động nấu thêm cơm nếu bàn ăn còn < 3 suất
    const diBay = state.workers.find((w) => w.code === 'WORK_04' && w.isHired && w.belly >= 25);
    if (diBay && nextMealsOnTable < 3) {
      nextMealsOnTable += 2;
      actionsLog.push('Dì Bảy Bếp dọn +2 suất cơm nóng lên Bàn Ăn Lán Thợ');
    }

    // 2. Nhân công đói bụng (< 35%) tự động về Bàn Ăn Lán Thợ ăn cơm
    const updatedWorkers = state.workers.map((w) => {
      if (!w.isHired || w.contractDaysLeft <= 0) return w;
      let belly = Math.max(10, w.belly - 2);
      let statusText = w.statusText;
      if (belly < 35 && nextMealsOnTable > 0) {
        nextMealsOnTable -= 1;
        belly = 100;
        statusText = `Vừa ăn cơm tại Bàn Lán Thợ (No 100% 🤩) - Đang làm việc hăng say!`;
        actionsLog.push(`${w.name} đã ăn 1 suất cơm tại Bàn Ăn Lán Thợ (Hồi 100% Độ No)`);
      }
      return { ...w, belly, statusText };
    });

    // 3. Chú Tư Cày (WORK_01), Anh Sáu Kình (WORK_03), Chú Tám Mộc (WORK_05) chăm sóc ô đất/ao
    const chuTu = updatedWorkers.find((w) => w.code === 'WORK_01' && w.isHired && w.belly >= 25);
    const anhSau = updatedWorkers.find((w) => w.code === 'WORK_03' && w.isHired && w.belly >= 25);
    const chuTam = updatedWorkers.find((w) => w.code === 'WORK_05' && w.isHired && w.belly >= 25);

    const updatedTiles = state.tiles.map((t) => {
      // Tự động thu hoạch ô đã chín (vào Giỏ Kho Lán Thợ, tối đa 120)
      if (t.itemId && t.matureAt && now >= t.matureAt && nextPantry < 120) {
        const canHarvestLand = (t.zoneType === 'LAND' || t.zoneType === 'ORCHARD') && (chuTu || chuTam);
        const canHarvestPond = t.zoneType === 'POND' && anhSau;
        if (canHarvestLand || canHarvestPond) {
          nextPantry = Math.min(120, nextPantry + 2);
          if (t.zoneType === 'POND') {
            nextMudCounter = Math.min(10, nextMudCounter + 1);
          }
          const replantId = t.itemId;
          const spec = GAME_CATALOG.find((c) => c.id === replantId);
          actionsLog.push(`Thu tự động [${spec?.name ?? replantId}] vào Giỏ Thợ & gieo vụ mới`);
          return {
            ...t,
            plantedAt: now,
            matureAt: now + Math.max(2, spec?.growOrCraftMinutes ?? 5) * 60_000,
            watered: Boolean(chuTu) || state.weather === 'RAINY',
            mudApplied: false,
            isGolden: false,
          };
        }
      }

      // Tự động tưới nước Giếng Làng bởi Chú Tư Cày
      if (t.itemId && !t.watered && t.matureAt && chuTu) {
        return {
          ...t,
          watered: true,
          matureAt: t.matureAt - Math.floor((t.matureAt - now) * 0.15),
        };
      }

      // Tự động bón Bùn Phù Sa cho Cây ăn quả bởi Chú Tám Mộc
      if (t.itemId && t.zoneType === 'ORCHARD' && !t.mudApplied && chuTam && (nextInv.ITEM_BUN_PHU_SA ?? 0) > 0) {
        nextInv.ITEM_BUN_PHU_SA = (nextInv.ITEM_BUN_PHU_SA ?? 1) - 1;
        actionsLog.push('Chú Tám Mộc bón Bùn Phù Sa kích nổ Trái Cây Hoàng Kim ⭐');
        return {
          ...t,
          mudApplied: true,
          isGolden: true,
        };
      }

      return t;
    });

    // 4. Anh Sáu Kình (WORK_03) tự động Vét Bùn Ao khi đầy 10/10 (Miễn phí ⚡ cho chủ nhà!)
    if (anhSau && nextMudCounter >= 10) {
      nextMudCounter = 0;
      nextInv.ITEM_BUN_PHU_SA = (nextInv.ITEM_BUN_PHU_SA ?? 0) + 3;
      actionsLog.push('Anh Sáu Kình tự động Vét Bùn Đáy Ao (0 ⚡) nhận +3 Xô Bùn Phù Sa!');
    }

    set({
      tiles: updatedTiles,
      workers: updatedWorkers,
      workerPantryCount: nextPantry,
      pondMudCounter: nextMudCounter,
      lodgeDiningTableMeals: nextMealsOnTable,
      inventory: nextInv,
      ...(actionsLog.length > 0
        ? { toastMessage: `🛖 [Lán Thợ Tự Động]: ${actionsLog[0]}!` }
        : {}),
    });
  },

  toggleWorkerAutoTick: () => {
    const next = !get().workerAutoTickEnabled;
    set({
      workerAutoTickEnabled: next,
      toastMessage: next
        ? '🟢 Đã BẬT chế độ Tự Động Hóa 6 Nhân Công Lán Thợ (Tự tưới, tự thu vào Giỏ Thợ & tự ăn cơm)!'
        : '⏸️ Đã TẠM DỪNG Nhân công tự động để bạn tự tay thu hoạch!',
    });
  },

  claimWorkerPantry: () => {
    const state = get();
    if (state.workerPantryCount <= 0) {
      set({ toastMessage: '🧺 Giỏ Kho Lán Thợ hiện đang trống!' });
      return;
    }
    const bonusGold = state.workerPantryCount * 18;
    set({
      workerPantryCount: 0,
      gold: state.gold + bonusGold,
      xp: state.xp + 35,
      inventory: {
        ...state.inventory,
        CROP_01: (state.inventory.CROP_01 ?? 0) + 15,
        ANI_01: (state.inventory.ANI_01 ?? 0) + 8,
        AQUA_01: (state.inventory.AQUA_01 ?? 0) + 6,
        ITEM_BUN_PHU_SA: (state.inventory.ITEM_BUN_PHU_SA ?? 0) + 3,
      },
      toastMessage: `📥 Đã thu toàn bộ ${state.workerPantryCount} Nông sản/Trứng/Cá + 3 Xô Bùn Phù Sa từ Giỏ Kho Lán Thợ (Trị giá +${bonusGold} 🪙)!`,
    });
  },

  feedWorker: (workerCode, mealName, bellyGain) => {
    const state = get();
    set({
      workers: state.workers.map((w) =>
        w.code === workerCode
          ? {
              ...w,
              belly: Math.min(100, w.belly + bellyGain),
              morale: Math.min(100, w.morale + 15),
              statusText: `Vừa ăn no [${mealName}] - Đang làm việc hăng say 100%!`,
            }
          : w
      ),
      toastMessage: `🍚 Đã dọn [${mealName}] lên Bàn Ăn Lán Thợ! Nhân công hồi +${bellyGain} Độ No & +15 Tinh thần!`,
    });
  },

  equipWorkerGear: (workerCode, gearId) => {
    const state = get();
    const gear = GAME_CATALOG.find((g) => g.id === gearId);
    const cost = gear?.buyCostGold ?? 120;
    if (state.gold < cost) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để may trang bị bảo hộ!' });
      return;
    }
    set({
      gold: state.gold - cost,
      workers: state.workers.map((w) =>
        w.code === workerCode
          ? {
              ...w,
              equippedGearId: gearId,
              gearHoursLeft: 72,
              statusText: `Đã mặc [${gear?.name ?? 'Đồ Bảo Hộ Mới'}] (Độ bền 72/72 giờ - Tăng tốc +15~25%)`,
            }
          : w
      ),
      toastMessage: `👕 Đã cấp phát [${gear?.name}] (Độ bền 72 giờ) cho nhân công (-${cost} 🪙)!`,
    });
  },

  payWorkerSalary: (workerCode) => {
    const state = get();
    const target = state.workers.find((w) => w.code === workerCode);
    if (!target) return;
    const threeDayCost = Math.round(target.dailySalaryGold * 3 * 0.88);
    if (state.gold < threeDayCost) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để trả lương hợp đồng 3 ngày!' });
      return;
    }
    set({
      gold: state.gold - threeDayCost,
      workers: state.workers.map((w) =>
        w.code === workerCode
          ? {
              ...w,
              isHired: true,
              contractDaysLeft: w.contractDaysLeft + 3,
              statusText: 'Đã nhận lương Hợp đồng 3 ngày - Sẵn sàng tự động hóa!',
            }
          : w
      ),
      toastMessage: `🪙 Đã trả lương Hợp đồng 3 ngày (-${threeDayCost} 🪙, tiết kiệm 12%) cho ${target.name}!`,
    });
  },

  giveWorkerBonus: (workerCode) => {
    const state = get();
    if (state.gold < 300) {
      set({ toastMessage: '⚠️ Cần 300 Xu Vàng để thưởng Phụ Cấp Ngày Mùa!' });
      return;
    }
    set({
      gold: state.gold - 300,
      workers: state.workers.map((w) =>
        w.code === workerCode
          ? {
              ...w,
              morale: 100,
              statusText: '🔥 HĂNG SAY 100% (Tốc độ x1.25 & +15% rơi sản lượng phụ/Vật tư Kho!)',
            }
          : w
      ),
      toastMessage: '🧧 Đã thưởng Phụ Cấp Ngày Mùa (-300 🪙)! Tinh thần nhân công đạt 100% Hăng Say!',
    });
  },

  simulateOfflineWorkerProgress: (hoursOffline) => {
    const state = get();
    const cleanHours = Math.max(1, Math.min(24, Math.floor(hoursOffline)));
    const activeWorkers = state.workers.filter((w) => w.isHired && w.contractDaysLeft > 0);
    if (activeWorkers.length === 0) {
      set({
        toastMessage: '🛖 Chưa có nhân công nào đang trong hợp đồng làm việc khi Offline!',
      });
      return;
    }
    const mealsNeeded = Math.min(state.lodgeDiningTableMeals, Math.ceil((activeWorkers.length * cleanHours) / 3));
    const rawHarvestGain = activeWorkers.length * cleanHours * 4;
    const nextPantry = Math.min(120, state.workerPantryCount + rawHarvestGain);
    const actualAdded = nextPantry - state.workerPantryCount;

    const updatedWorkers = state.workers.map((w) => {
      if (!w.isHired) return w;
      const nextGear = Math.max(0, w.gearHoursLeft - cleanHours);
      const nextBelly = mealsNeeded > 0 ? Math.max(45, w.belly - cleanHours * 4 + 30) : Math.max(10, w.belly - cleanHours * 8);
      return {
        ...w,
        belly: Math.min(100, nextBelly),
        gearHoursLeft: nextGear,
        statusText: `Vừa hoàn thành ${cleanHours}h làm việc Offline (+${Math.floor(rawHarvestGain / activeWorkers.length)} sản phẩm vào Giỏ Thợ)`,
      };
    });

    set({
      lodgeDiningTableMeals: Math.max(0, state.lodgeDiningTableMeals - mealsNeeded),
      workerPantryCount: nextPantry,
      stamina: Math.min(state.maxStamina, state.stamina + cleanHours * 10),
      workers: updatedWorkers,
      toastMessage: `🌙 [LAZY-TICK OFFLINE ${cleanHours} GIỜ]: ${activeWorkers.length} Nhân công đã ăn ${mealsNeeded} suất cơm, tự thu hoạch +${actualAdded} Nông sản vào Giỏ Thợ (${nextPantry}/120) & hồi đầy ⚡!`,
    });
  },

  addMealsToLodgeTable: (portions, costGold) => {
    const state = get();
    if (state.gold < costGold) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để dọn thêm mâm cơm lên Bàn Ăn Lán Thợ!' });
      return;
    }
    set({
      gold: state.gold - costGold,
      lodgeDiningTableMeals: state.lodgeDiningTableMeals + portions,
      toastMessage: `🍚 Đã dọn thêm +${portions} suất cơm nóng lên Bàn Ăn Chung Lán Thợ (Tổng: ${state.lodgeDiningTableMeals + portions} suất)!`,
    });
  },
});
