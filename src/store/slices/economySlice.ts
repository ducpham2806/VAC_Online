/** Slice Economy của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { GAME_CATALOG } from '../../data/masterData';
import { vacRealtime } from '../../services/realtimeService';
import type { GameState } from '../gameTypes';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type EconomyActions = Pick<
  GameState,
  | 'cookRandomDish'
  | 'craftOrBuyCatalogItem'
  | 'prayAtTotem'
  | 'contributeDinhLang'
  | 'breedMutantCrop'
  | 'sellToTraderBoom'
  | 'runBambooExpedition'
  | 'playNightMarketMinigame'
  | 'deliverCoopOrder'
  | 'fillTrainCrate'
  | 'rowDragonBoatDerby'
>;

export const createEconomySlice = (set: StoreSet, get: StoreGet, _helpers: StoreHelpers): EconomyActions => ({
  cookRandomDish: (ingredients) => {
    const state = get();
    if (ingredients.length < 3) {
      set({ toastMessage: '🍲 Hãy chọn đủ ít nhất 3 nguyên liệu bỏ vào Nồi Đất để thử nghiệm!' });
      return;
    }
    set({
      gems: state.gems + 10,
      xp: state.xp + 50,
      stamina: Math.min(state.maxStamina, state.stamina + 25),
      inventory: {
        ...state.inventory,
        PROD_22: (state.inventory.PROD_22 ?? 0) + 1,
      },
      toastMessage:
        '🎉 KHÁM PHÁ CÔNG THỨC MỚI: [Cá Kho Tộ Vũ Đại - Mỹ Vị 3 Miền ⭐⭐⭐]! Thưởng nóng +10 💎 Ngọc, +50 XP & +25 ⚡!',
    });
  },

  craftOrBuyCatalogItem: (itemId) => {
    const state = get();
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    if (!spec) return;

    if (
      spec.category === 'CROP' ||
      spec.category === 'TREE' ||
      spec.category === 'MUTANT_CROP' ||
      spec.category === 'ANIMAL' ||
      spec.category === 'AQUA'
    ) {
      set({
        selectedSeedId: spec.id,
        activeModal: null,
        toastMessage: `🌱 Đã chọn [${spec.emoji} ${spec.name}]! Chạm vào ô đất/ao trên bản đồ để gieo trồng hoặc chăn nuôi ngay!`,
      });
      return;
    }

    const cost = Math.max(0, spec.buyCostGold);
    if (state.gold < cost) {
      set({ toastMessage: `⚠️ Cần ${cost.toLocaleString()} 🪙 Xu Vàng để chế biến/mua [${spec.name}]!` });
      return;
    }

    const staminaGain = spec.staminaDelta > 0 ? spec.staminaDelta : 0;
    const styleGain = spec.category === 'FASHION' ? 80 : 0;

    set({
      gold: state.gold - cost + (spec.category === 'RECIPE' ? spec.baseSellGold : 0),
      xp: state.xp + spec.xpReward,
      stamina: Math.min(state.maxStamina, state.stamina + staminaGain),
      styleScore: state.styleScore + styleGain,
      inventory: {
        ...state.inventory,
        [spec.id]: (state.inventory[spec.id] ?? 0) + 1,
      },
      toastMessage:
        spec.category === 'RECIPE'
          ? `🍲 Đã chế biến xong [${spec.emoji} ${spec.name}] (+1 vào Kho, +${spec.xpReward} XP${staminaGain > 0 ? `, hồi +${staminaGain} ⚡` : ''})!`
          : `✨ Đã sở hữu/chế tác [${spec.emoji} ${spec.name}] (+1 vào Kho, +${spec.xpReward} XP${styleGain > 0 ? `, +${styleGain} Phong Cách` : ''})!`,
    });
  },

  prayAtTotem: () => {
    const state = get();
    if (state.gold < 80) return;
    const buffs = [
      'Quẻ Đại Cát: +20% tỷ lệ nổ Nông Sản Hoàng Kim ⭐ (x3 giá bán) trong 24h',
      'Quẻ Thuận Buồm: +10% Vàng từ Đơn Hợp Tác Xã & Ga Tàu Thống Nhất trong 24h',
      'Quẻ Bình An: +15% tỷ lệ Chó Phú Quốc bắt sống kẻ trộm trong 24h',
      'Quẻ No Ấm: 6 Nhân công Lán Thợ lâu đói bụng hơn -30% trong 24h',
    ];
    const picked = buffs[Math.floor(Math.random() * buffs.length)];
    set({
      gold: state.gold - 80,
      activeTotemBuff: picked,
      toastMessage: `🙏 Đã dâng hương Miếu Thần Nông! Bạn rút được [${picked}]!`,
    });
  },

  contributeDinhLang: () => {
    const state = get();
    if (state.dinhLangStage >= 3) {
      set({ toastMessage: '⛩️ Đình Làng đã trùng tu Hoàn Mỹ Cấp 3 (Buff vĩnh viễn +5% sản lượng toàn trang trại)!' });
      return;
    }
    const cost = state.dinhLangStage === 0 ? 5000 : state.dinhLangStage === 1 ? 15000 : 50000;
    if (state.gold < cost) {
      set({ toastMessage: `⚠️ Cần ${cost.toLocaleString()} Xu Vàng để công đức trùng tu giai đoạn tiếp theo!` });
      return;
    }
    const nextStage = state.dinhLangStage + 1;
    const loaText = `vừa công đức trùng tu Đình Làng lên Cấp ${nextStage}/3!`;
    vacRealtime.broadcastLoaPhuong(state.playerName, loaText);
    set({
      gold: state.gold - cost,
      dinhLangStage: nextStage,
      fengShuiScore: state.fengShuiScore + 150,
      loaPhuongText: `[${state.playerName}] ${loaText}`,
      toastMessage: `⛩️ Công đức thành công (-${cost.toLocaleString()} 🪙)! Đình Làng đạt Cấp ${nextStage}/3, khắc tên lên Bia Đá Công Đức & tăng +150 Phong Thủy!`,
    });
  },

  breedMutantCrop: (targetMutantId, costGold, baseChance, pityLimit) => {
    const state = get();
    if (state.gold < costGold) {
      set({ toastMessage: `⚠️ Cần ${costGold.toLocaleString()} Xu Vàng để chiết cành đột biến!` });
      return;
    }
    const nextPity = state.mutantPityCount + 1;
    const isSuccess = nextPity >= pityLimit || Math.random() < baseChance;
    const spec = GAME_CATALOG.find((c) => c.id === targetMutantId);

    if (isSuccess && spec) {
      const loaText = `vừa lai tạo thành công giống đột biến [${spec.emoji} ${spec.name}]!`;
      vacRealtime.broadcastLoaPhuong(state.playerName, loaText);
      set({
        gold: state.gold - costGold,
        mutantPityCount: 0,
        fengShuiScore: state.fengShuiScore + 15,
        loaPhuongText: `[${state.playerName}] ${loaText}`,
        inventory: {
          ...state.inventory,
          [spec.id]: (state.inventory[spec.id] ?? 0) + 1,
        },
        toastMessage: `🧬 LAI TẠO ĐỘT BIẾN THÀNH CÔNG! Nhận được [${spec.emoji} ${spec.name}] trị giá ${spec.baseSellGold} 🪙 & phát Loa Phường toàn Server!`,
      });
    } else {
      set({
        gold: state.gold - costGold,
        mutantPityCount: nextPity,
        inventory: {
          ...state.inventory,
          ITEM_BUN_PHU_SA: (state.inventory.ITEM_BUN_PHU_SA ?? 0) + 1,
        },
        toastMessage: `🌱 Chiết cành chưa ra đột biến (Bảo hiểm Pity: ${nextPity}/${pityLimit}). Nhận bù 1 Phù Sa Siêu Tốc (+40% tốc độ)!`,
      });
    }
  },

  sellToTraderBoom: () => {
    const state = get();
    set({
      gold: state.gold + 1450,
      neighborPoints: state.neighborPoints + 2,
      toastMessage:
        '🚚 Đã bán lô hàng cho Xe Thương Lái Đột Xuất với giá x2.5 (+1,450 🪙)! Chủ nhà bạn bè cũng nhận được +5% Hoa hồng & +2 Điểm Nghĩa Xóm!',
    });
  },

  runBambooExpedition: () => {
    const state = get();
    if (state.stamina < 6) {
      set({ toastMessage: '⚡ Cần ít nhất 6 Năng lượng để Thám hiểm Rừng Trúc & Bãi Bồi Ven Sông!' });
      return;
    }
    set({
      stamina: state.stamina - 6,
      gems: state.gems + 5,
      xp: state.xp + 28,
      inventory: {
        ...state.inventory,
        ITEM_BUN_PHU_SA: (state.inventory.ITEM_BUN_PHU_SA ?? 0) + 2,
      },
      toastMessage:
        '🎋 Thám hiểm Rừng Trúc (-6 ⚡): Đào được Măng Rừng, Phấn Hoa Đột Biến, +2 Phù Sa & vớt được Mảnh Cổ Vật (+5 💎)!',
    });
  },

  playNightMarketMinigame: () => {
    const state = get();
    set({
      gold: state.gold + 1040,
      gems: state.gems + 8,
      xp: state.xp + 40,
      toastMessage:
        '🏮 Phiên Chợ Đêm Cuối Tuần: Phục vụ thực khách đạt Combo Tuyệt Đỉnh! Thu về +1,040 🪙 (Giá x1.8, Miễn thuế 0%) & +8 💎 tiền tip!',
    });
  },

  deliverCoopOrder: (orderId) => {
    const state = get();
    const order = state.coopOrders.find((o) => o.id === orderId);
    if (!order || order.completed) return;
    const haveQty = state.inventory[order.itemId] ?? 0;
    if (haveQty < order.requiredQty) {
      set({ toastMessage: `⚠️ Kho chưa đủ ${order.requiredQty} ${order.itemName} (Hiện có: ${haveQty})! Hãy thu hoạch hoặc chế biến thêm nhé!` });
      return;
    }
    set({
      gold: state.gold + order.rewardGold,
      xp: state.xp + order.rewardXp,
      neighborPoints: state.neighborPoints + 2,
      inventory: {
        ...state.inventory,
        [order.itemId]: haveQty - order.requiredQty,
      },
      coopOrders: state.coopOrders.map((o) => (o.id === orderId ? { ...o, completed: true } : o)),
      toastMessage: `🚚 Đã giao đơn [${order.title}] cho ${order.requester}! Nhận +${order.rewardGold} 🪙, +${order.rewardXp} XP & +2 Điểm Nghĩa Xóm!`,
    });
  },

  fillTrainCrate: (crateId) => {
    const state = get();
    const crate = state.trainCrates.find((c) => c.id === crateId);
    if (!crate || crate.filled) return;
    const have = state.inventory[crate.itemId] ?? 0;
    if (have < crate.requiredQty) {
      set({
        toastMessage: `🚂 Cần ${crate.requiredQty} ${crate.itemName} để đóng ${crate.carriageName} (Kho hiện có: ${have})!`,
      });
      return;
    }
    set({
      gold: state.gold + crate.rewardGold,
      xp: state.xp + 55,
      trainVouchers: state.trainVouchers + crate.rewardVoucher,
      inventory: {
        ...state.inventory,
        [crate.itemId]: have - crate.requiredQty,
      },
      trainCrates: state.trainCrates.map((c) => (c.id === crateId ? { ...c, filled: true } : c)),
      toastMessage: `🚂 Đã đóng xong [${crate.carriageName}] trên Ga Tàu Thống Nhất! Nhận +${crate.rewardGold} 🪙 & +${crate.rewardVoucher} 🎟️ Voucher Tàu Hỏa (Đổi Trâu Đen)!`,
    });
  },

  rowDragonBoatDerby: () => {
    const state = get();
    if (state.stamina < 4) {
      set({ toastMessage: '⚡ Cần 4 Năng lượng để tham gia chèo Thuyền Rồng Hợp Tác Xã!' });
      return;
    }
    const nextMeters = state.dragonBoatMeters + 120;
    set({
      stamina: state.stamina - 4,
      dragonBoatMeters: nextMeters,
      gold: state.gold + 380,
      gems: state.gems + 5,
      xp: state.xp + 40,
      toastMessage: `🚣 Tùng! Tùng! Tùng! Bạn chèo thuyền tiến thêm +120m (Tổng: ${nextMeters}/1,000m)! Nhận +380 🪙, +5 💎 & +40 XP!`,
    });
  },
});
