/** Slice Meta của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { vacRealtime } from '../../services/realtimeService';
import type { GameState } from '../gameTypes';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';

export type MetaActions = Pick<
  GameState,
  | 'setToast'
  | 'setActiveModal'
  | 'setProfile'
  | 'applyAuthAccount'
  | 'syncCatalogToSupabaseCloud'
>;

export const createMetaSlice = (set: StoreSet, get: StoreGet, { runCloud }: StoreHelpers): MetaActions => ({
  setToast: (msg) => set({ toastMessage: msg }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setProfile: (playerName, gender, region) => {
    const cleanName = playerName.replace(/[<>]/g, '').trim() || 'Điền Chủ';
    if (get().farmMode === 'cloud') {
      set({ activeModal: null });
      void runCloud(
        'rpc_set_profile_basics',
        { p_name: cleanName, p_gender: gender, p_region: region },
        () => `💮 Đã đóng dấu đỏ! Chào mừng Điền chủ ${cleanName} về quê hương ${region}!`
      );
      return;
    }
    set({
      playerName: cleanName,
      gender,
      region,
      activeModal: null,
      toastMessage: `💮 Đã đóng dấu đỏ! Chào mừng Điền chủ ${cleanName} về quê hương ${region}!`,
    });
  },
  applyAuthAccount: (account, isNewSignupOrGuest, isGuestUpgrade) => {
    const state = get();
    const cleanName = account.playerName.replace(/[<>]/g, '').trim() || 'Điền Chủ';
    // Chế độ offline mới cộng thưởng tại chỗ; online thì server cấp qua rpc_claim_account_bonus.
    const offline = state.farmMode === 'local';
    const bonusGold = !offline ? 0 : isGuestUpgrade ? 1000 : isNewSignupOrGuest && account.accountType === 'REGISTERED' ? 500 : 0;
    const bonusGems = offline && isGuestUpgrade ? 50 : 0;
    set({
      playerName: cleanName,
      accountType: account.accountType,
      userEmail: account.email,
      gender: account.gender,
      region: account.region,
      gold: state.gold + bonusGold,
      gems: state.gems + bonusGems,
      activeModal: isNewSignupOrGuest ? 'REGISTER' : null,
      toastMessage: isGuestUpgrade
        ? `🛡️ Đã liên kết Tài khoản Khách lên Chính thức (${account.email})! Nhận +50 💎 Ngọc & +1,000 🪙 Xu Vàng!`
        : isNewSignupOrGuest
        ? `🎉 Chào mừng [${cleanName}]! Hãy chọn Giới tính & Quê hương 3 Miền trong Giấy Đăng Ký Về Quê nhé!`
        : `🌾 Chào mừng Điền chủ [${cleanName}] (${account.accountType === 'GUEST' ? 'Chế độ Khách' : account.email}) trở lại nông trại!`,
    });
    // Có máy chủ: lấy nông trại thật từ server; thưởng tài khoản do server cấp (1 lần).
    const wantsBonus = isGuestUpgrade || (isNewSignupOrGuest && account.accountType === 'REGISTERED');
    void get()
      .syncFarmFromServer()
      .then(() => {
        if (wantsBonus && get().farmMode === 'cloud') {
          void runCloud('rpc_claim_account_bonus', {}, (snap, prev) =>
            `🎁 Thưởng tài khoản: +${snap.profile.gold - prev.gold} 🪙${snap.profile.gems > prev.gems ? ` & +${snap.profile.gems - prev.gems} 💎` : ''}!`
          );
        }
      });
  },

  syncCatalogToSupabaseCloud: async () => {
    set({ toastMessage: '☁️ Đang đồng bộ trọn bộ 155 thực thể VAC Online lên Supabase Cloud...' });
    const res = await vacRealtime.syncFullCatalogToSupabase();
    const check = await vacRealtime.checkDatabaseTables();
    set((st) => ({
      dbTablesStatus: check.detail,
      marketListings: check.cloudListings && check.cloudListings.length > 0 ? check.cloudListings : st.marketListings,
      guestbookEntries: check.cloudGuestbook && check.cloudGuestbook.length > 0 ? check.cloudGuestbook : st.guestbookEntries,
      toastMessage: res.message,
    }));
  },
});
