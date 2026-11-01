/** Slice LiveOps của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { GAME_CATALOG } from '../../data/masterData';
import { vacRealtime } from '../../services/realtimeService';
import type { GameState } from '../gameTypes';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type LiveOpsActions = Pick<
  GameState,
  | 'claimLoaPhuongLucky'
  | 'tearBlocCalendar'
  | 'smashClayPotGacha'
  | 'buyLotteryTicket'
  | 'fuseDuplicateFashion'
  | 'setTransmogSlot'
  | 'enterFashionContest'
  | 'giftNpcForMarriage'
  | 'serveHomestayGuests'
>;

export const createLiveOpsSlice = (set: StoreSet, get: StoreGet, _helpers: StoreHelpers): LiveOpsActions => ({
  claimLoaPhuongLucky: () => {
    const state = get();
    if (state.luckyPacketsLeft <= 0) return;
    set({
      luckyPacketsLeft: state.luckyPacketsLeft - 1,
      gold: state.gold + 120,
      stamina: Math.min(state.maxStamina, state.stamina + 5),
      toastMessage: '🧧 Xin vía Loa Phường thành công! Nhận +120 Xu Vàng (trích từ Quỹ Thuế Chợ 5%) & +5 ⚡ Năng lượng!',
    });
  },

  tearBlocCalendar: () => {
    const state = get();
    if (state.blocCalendarCheckedToday) {
      set({ toastMessage: '📅 Hôm nay bạn đã xé tờ Lịch Bloc nhận lộc rồi!' });
      return;
    }
    set({
      blocCalendarCheckedToday: true,
      stamina: Math.min(state.maxStamina, state.stamina + 30),
      gold: state.gold + 350,
      lotteryTickets: [...state.lotteryTickets, '888'],
      toastMessage: '👋 Xoẹt! Đã xé tờ Lịch Bloc hôm nay: Nhận +30 ⚡ Năng lượng, +350 🪙 & 1 Tờ Vé Số [888]!',
    });
  },

  smashClayPotGacha: () => {
    const state = get();
    if (state.gold < 400) {
      set({ toastMessage: '⚠️ Cần 400 Xu Vàng để đập niêu đất Đình Làng!' });
      return;
    }
    set({
      gold: state.gold - 400,
      styleScore: state.styleScore + 65,
      toastMessage:
        '💥 BỐP! Đập vỡ niêu đất Đình Làng nhận được [Áo Dài Ngũ Thân Lụa Hà Đông - Bậc Tím SR] (+65 Điểm Phong Cách)!',
    });
  },

  buyLotteryTicket: (forFriend) => {
    const state = get();
    const cost = forFriend ? 300 : 500;
    if (state.gold < cost) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để mua Vé Số Kiến Thiết!' });
      return;
    }
    const randomCode = String(Math.floor(100 + Math.random() * 900));
    set({
      gold: state.gold - cost,
      neighborPoints: forFriend ? state.neighborPoints + 3 : state.neighborPoints,
      lotteryTickets: [...state.lotteryTickets, randomCode],
      toastMessage: forFriend
        ? `🎁 Đã mua tặng bạn bè tờ vé số [${randomCode}] (-300 🪙)! Nếu 18:00 trúng giải, cả 2 bạn cùng nổ hũ!`
        : `🎟️ Đã mua tờ Vé Số Kiến Thiết [${randomCode}] (-500 🪙) chờ quay thưởng 18:00!`,
    });
  },

  fuseDuplicateFashion: (itemId) => {
    const state = get();
    const count = state.inventory[itemId] ?? 0;
    if (count < 3) {
      set({
        toastMessage: `🧵 Cần đủ 3 món trùng nhau trong Tủ Đồ để khâu ghép nâng bậc (Hiện có: ${count}/3)!`,
      });
      return;
    }
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    set({
      inventory: {
        ...state.inventory,
        [itemId]: count - 2,
      },
      styleScore: state.styleScore + 150,
      xp: state.xp + 45,
      toastMessage: `✨ KHÂU GHÉP 3➔1 THÀNH CÔNG: Đã thêu kim tuyến nâng bậc [${spec?.name ?? itemId}] lên Phẩm chất Cao Cấp (+150 ✨ Phong Cách & +45 XP)!`,
    });
  },

  setTransmogSlot: (itemId) => {
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    set({
      transmogItemId: itemId,
      toastMessage: `🎭 Đã khóa ngoại hình Transmog: Giữ diện mạo [${spec?.emoji ?? '👘'} ${spec?.name ?? itemId}] mà vẫn hưởng 100% chỉ số bộ trang bị mạnh nhất!`,
    });
  },

  enterFashionContest: () => {
    const state = get();
    if (state.fashionContestEntered) {
      set({
        toastMessage: '📸 Bạn đã gửi ảnh dự thi Hội Thi Duyên Dáng Làng Quê tuần này rồi!',
      });
      return;
    }
    const prizeGold = Math.round(state.styleScore * 0.6 + state.fengShuiScore * 0.4);
    const loaText = `vừa đạt giải Áo Dài & Trang Phục Truyền Thống Đẹp Nhất Tuần (${state.styleScore} ✨)!`;
    vacRealtime.broadcastLoaPhuong(state.playerName, loaText);
    set({
      fashionContestEntered: true,
      gold: state.gold + prizeGold,
      gems: state.gems + 15,
      neighborPoints: state.neighborPoints + 5,
      loaPhuongText: `[${state.playerName}] ${loaText}`,
      toastMessage: `📸 Đăng ký Hội Thi Duyên Dáng Làng Quê thành công! Nhận thưởng nóng +${prizeGold.toLocaleString()} 🪙, +15 💎 Ngọc & +5 Điểm Nghĩa Xóm!`,
    });
  },

  giftNpcForMarriage: () => {
    const state = get();
    if (state.isMarried) {
      set({
        stamina: Math.min(state.maxStamina, state.stamina + 30),
        workerPantryCount: Math.min(120, state.workerPantryCount + 10),
        toastMessage: '💒 Bạn đời vừa nấu Mâm Cơm Sáng (+30 ⚡) & Bé Tiểu Đồng phụ thu hoạch +10 Nông sản vào Giỏ!',
      });
      return;
    }
    const nextHearts = Math.min(10, state.npcHearts + 1);
    const marriedNow = nextHearts >= 10;
    if (marriedNow) {
      const loaText = 'vừa tổ chức Lễ Cưới Làng Quê (Đạt 10/10 Tim ❤️ với Tri Kỷ)!';
      vacRealtime.broadcastLoaPhuong(state.playerName, loaText);
      set({
        npcHearts: 10,
        isMarried: true,
        styleScore: state.styleScore + 250,
        fengShuiScore: state.fengShuiScore + 200,
        loaPhuongText: `[${state.playerName}] ${loaText}`,
        toastMessage:
          '💒 CHÚC MỪNG TRĂM NĂM HẠNH PHÚC! Đạt 10/10 Tim ❤️, mở khóa Gia Bảo Truyền Đời (+30 ⚡ mỗi sáng & Tiểu Đồng phụ việc miễn phí)!',
      });
    } else {
      set({
        npcHearts: nextHearts,
        xp: state.xp + 25,
        toastMessage: `💝 Đã biếu Cốm Làng Vòng & Cau Trầu cho Tri Kỷ! Độ thân mật đạt ${nextHearts}/10 Tim ❤️!`,
      });
    }
  },

  serveHomestayGuests: () => {
    const state = get();
    const rewardGold = state.homestayLevel === 1 ? 650 : 1600;
    set({
      gold: state.gold + rewardGold,
      gems: state.gems + 10,
      fengShuiScore: state.fengShuiScore + 20,
      xp: state.xp + 90,
      toastMessage: `🏡 Đón đoàn Khách Du Lịch Homestay Cấp ${state.homestayLevel} thưởng thức Đặc Sản 3 Miền: Nhận +${rewardGold.toLocaleString()} 🪙, +10 💎 Ngọc & +20 Phong Thủy!`,
    });
  },
});
