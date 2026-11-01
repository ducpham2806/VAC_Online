/** Slice Social của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { ChatMessage } from '../../data/types';
import { GAME_CATALOG } from '../../data/masterData';
import { vacRealtime } from '../../services/realtimeService';
import { quoteMarketListing } from '../../domain/market';
import type { GameState } from '../gameTypes';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type SocialActions = Pick<
  GameState,
  | 'initSupabaseRealtimeSync'
  | 'postItemToMarket'
  | 'signFriendGuestbook'
  | 'buyMarketAndVisit'
  | 'attemptStealFromFriend'
  | 'helpFriendAfterStorm'
  | 'returnHomeFarm'
  | 'sendChatMessage'
>;

export const createSocialSlice = (set: StoreSet, get: StoreGet, _helpers: StoreHelpers): SocialActions => ({
  initSupabaseRealtimeSync: () => {
    vacRealtime.initRealtime(
      (incomingMsg) => {
        set((st) => ({
          chatMessages: [...st.chatMessages, incomingMsg],
        }));
      },
      (loaPayload) => {
        set({
          loaPhuongText: `[${loaPayload.sender}] ${loaPayload.achievement}`,
          luckyPacketsLeft: 50,
          toastMessage: `📢 LOA PHƯỜNG REALTIME: [${loaPayload.sender}] ${loaPayload.achievement}`,
        });
      },
      (count) => {
        set({ onlineFarmersCount: count });
      },
      (incomingListing) => {
        set((st) => ({
          marketListings: [incomingListing, ...st.marketListings],
          toastMessage: `📰 SẠP MỚI TRÊN CHỢ 3 MIỀN: [${incomingListing.sellerName}] vừa đăng bán ${incomingListing.quantity} ${incomingListing.itemName}!`,
        }));
      },
      (incomingGuestbook) => {
        set((st) => ({
          guestbookEntries: [incomingGuestbook, ...st.guestbookEntries],
          fengShuiScore: st.fengShuiScore + 10,
          toastMessage: `📖 LƯU BÚT MỚI: [${incomingGuestbook.visitorName}] vừa ký Sổ Lưu Bút Cổng Làng (+10 Điểm Mỹ Quan)!`,
        }));
      }
    );

    vacRealtime.checkDatabaseTables().then((res) => {
      set((st) => ({
        dbTablesStatus: res.detail,
        marketListings: res.cloudListings && res.cloudListings.length > 0 ? res.cloudListings : st.marketListings,
        guestbookEntries: res.cloudGuestbook && res.cloudGuestbook.length > 0 ? res.cloudGuestbook : st.guestbookEntries,
      }));
    });
  },

  postItemToMarket: async (itemId, qty, unitPrice) => {
    const state = get();
    const haveQty = state.inventory[itemId] ?? 0;
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    if (!spec || qty <= 0) return;

    if (haveQty < qty) {
      set({ toastMessage: `⚠️ Kho chỉ còn ${haveQty} ${spec.name}, không đủ ${qty} để đăng bán!` });
      return;
    }

    const { clampedPrice, netRevenueAfterTax } = quoteMarketListing(spec.baseSellGold, qty, unitPrice);

    const createdListing = await vacRealtime.postMarketListingToCloud(
      state.playerName,
      state.region,
      state.level,
      itemId,
      qty,
      clampedPrice
    );

    // Hàng được giữ (trừ khỏi kho) ngay; tiền chỉ về khi có người mua (Sprint S6 — escrow trên server).
    set((st) => ({
      inventory: {
        ...st.inventory,
        [itemId]: Math.max(0, (st.inventory[itemId] ?? 0) - qty),
      },
      marketListings: [createdListing, ...st.marketListings],
      toastMessage: `📰 Đã đăng bán ${qty} ${spec.emoji} ${spec.name} lên Báo Chợ 3 Miền (giá ${clampedPrice} 🪙/đv)! Khi có người mua bạn nhận ${netRevenueAfterTax} 🪙 (đã trừ 5% Thuế Chợ).`,
    }));
  },

  signFriendGuestbook: async (message) => {
    const state = get();
    const targetHost = state.visitingFriendName ?? state.playerName;
    const cleanMsg = message.trim() || 'Chúc trang trại vụ mùa bội thu, lúa đầy bồ cá đầy ao!';
    const entry = await vacRealtime.signGuestbookToCloud(targetHost, state.playerName, cleanMsg);
    set((st) => ({
      gold: st.gold + 20,
      xp: st.xp + 5,
      fengShuiScore: st.fengShuiScore + 10,
      neighborPoints: st.neighborPoints + 1,
      guestbookEntries: [entry, ...st.guestbookEntries],
      toastMessage: `📖 Đã chụp ảnh Check-in & Ký Sổ Lưu Bút Cổng Làng nhà [${targetHost}]! Nhận +20 🪙, +10 Điểm Mỹ Quan & +1 Nghĩa Xóm!`,
    }));
  },

  buyMarketAndVisit: (listing) => {
    const state = get();
    const totalCost = listing.unitPrice * listing.quantity;
    if (state.gold < totalCost) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để mua lô hàng này!' });
      return;
    }
    set({
      gold: state.gold - totalCost,
      marketListings: state.marketListings.filter((l) => l.id !== listing.id),
      visitingFriendName: listing.sellerName,
      inventory: {
        ...state.inventory,
        [listing.itemId]: (state.inventory[listing.itemId] ?? 0) + listing.quantity,
      },
      toastMessage: `✈️ Đã mua ${listing.quantity} ${listing.itemName} (-${totalCost} 🪙) và bay thẳng sang sân nhà [${listing.sellerName}]!`,
    });
  },

  attemptStealFromFriend: (targetName) => {
    const state = get();
    if (state.stamina < 1) {
      set({ toastMessage: '⚡ Không đủ Năng lượng để đi hái trộm!' });
      return;
    }
    const caughtByDog = Math.random() < 0.45;
    if (caughtByDog) {
      const penalty = Math.min(state.gold, 50);
      set({
        stamina: state.stamina - 1,
        gold: state.gold - penalty,
        inventory: {
          ...state.inventory,
          ITEM_DEP_TO_ONG: (state.inventory.ITEM_DEP_TO_ONG ?? 0) + 1,
        },
        toastMessage: `🐕 GÂU GÂU! Chó Phú Quốc nhà [${targetName}] lao ra cắn mông! Bạn bị trừ ${penalty} 🪙 (chuyển cho chủ nhà) và rớt lại 1 Chiếc Dép Tổ Ong!`,
      });
    } else {
      set({
        stamina: state.stamina - 1,
        gold: state.gold + 250,
        xp: state.xp + 15,
        toastMessage: `🥷 Rón rén hái trộm thành công +1 Sầu Riêng Ri6 nhà [${targetName}] ngay trong cửa sổ vàng 2 phút trước khi Chú Tư Cày ra thu!`,
      });
    }
  },

  helpFriendAfterStorm: () => {
    const state = get();
    set({
      gold: state.gold + 30,
      neighborPoints: state.neighborPoints + 2,
      xp: state.xp + 10,
      toastMessage:
        '🤝 "Lá Lành Đùm Lá Rách": Đã dựng giúp giàn trầu & gia cố bờ ao nhà bạn (0 ⚡)! Nhận +30 🪙, +2 Điểm Nghĩa Xóm & giúp bạn nhận Buff +20% sản lượng!',
    });
  },

  returnHomeFarm: () =>
    set({
      visitingFriendName: null,
      activeModal: null,
      toastMessage: '🏡 Đã trở về nông trại quê hương của bạn!',
    }),

  sendChatMessage: (content) => {
    const state = get();
    if (!content.trim()) return;
    const newMsg: ChatMessage = {
      id: `MSG_${Date.now()}`,
      channel: 'WORLD',
      sender: state.playerName,
      region: state.region,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    set({ chatMessages: [...state.chatMessages, newMsg] });
    vacRealtime.broadcastChat(newMsg);
  },
});
