/** Slice Farm của useGameStore (tách S2 — thân hàm giữ nguyên). */
import { QUEST_BRANCH_REWARDS, QUEST_XP_REWARD, STORY_QUESTS } from '../../data/quests';
import { firstMissingObjective } from '../../domain/quests';
import {
  MAX_WILD_PLOTS,
  MUD_ITEM_ID,
  applyMud,
  dredgePond,
  expandLand,
  findItem,
  harvest,
  nextTileAction,
  plant,
  sellToHtx as sellToHtxRule,
  water,
} from '../../domain/farm';
import { applyXp } from '../../domain/progression';
import { GAME_STAGE, isStageOpen } from '../../config/features';
import { callFarmRpc, hasCloudSession } from '../../services/farmGateway';
import type { GameState, WeatherType } from '../gameTypes';
import type { StoreGet, StoreHelpers, StoreSet } from '../storeHelpers';
import { toFarmSave, hasLocalProgress, todayInVietnam, snapshotToState } from '../initialState';

export type FarmActions = Pick<
  GameState,
  | 'interactTile'
  | 'sellToHtx'
  | 'syncFarmFromServer'
  | 'dredgePondMud'
  | 'expandWildLand'
  | 'claimStoryQuest'
  | 'claimRookieDayReward'
  | 'setSelectedSeed'
  | 'cycleWeather'
  | 'fastForwardTime'
>;

export const createFarmSlice = (set: StoreSet, get: StoreGet, { runCloud, applyLocal }: StoreHelpers): FarmActions => ({
  interactTile: (tileId) => {
    const state = get();
    const now = Date.now();
    const tile = state.tiles.find((t) => t.id === tileId);
    if (!tile || state.farmBusy) return;

    // Sự kiện "Lá Lành Đùm Lá Rách" (GĐ3+): dựng giàn sau bão — chỉ có ở chế độ offline/demo.
    if (tile.isTiltedByStorm && state.farmMode === 'local') {
      set({
        tiles: state.tiles.map((t) =>
          t.id === tileId ? { ...t, isTiltedByStorm: false, isGolden: true } : t
        ),
        xp: state.xp + 12,
        toastMessage: '🌈 Đã dựng lại giàn cây sau mưa! Nhận hiệu ứng "Đất Phù Sa Sau Mưa" (+20% sản lượng)!',
      });
      return;
    }

    const action = nextTileAction(tile, now + state.clockOffsetMs);
    if (action === 'NONE') {
      set({ toastMessage: '⏳ Đã tưới & bón bùn rồi, chờ cây chín nhé!' });
      return;
    }

    if (state.farmMode === 'cloud') {
      const xy = { p_x: tile.tileX, p_y: tile.tileY };
      if (action === 'PLANT') {
        const seed = findItem(state.selectedSeedId);
        void runCloud('rpc_plant', { ...xy, p_item_id: state.selectedSeedId }, () =>
          `🌱 Đã thả/gieo [${seed?.emoji ?? ''} ${seed?.name ?? state.selectedSeedId}] (-${seed?.buyCostGold ?? 0} 🪙, 0 ⚡)`
        );
      } else if (action === 'HARVEST') {
        const itemId = tile.itemId ?? '';
        const before = state.inventory[itemId] ?? 0;
        void runCloud('rpc_harvest', xy, (snap, prev) => {
          const item = findItem(itemId);
          const gained = (snap.inventory[itemId] ?? 0) - before;
          const levelUp = snap.profile.level > prev.level ? ` — 🎉 LÊN CẤP ${snap.profile.level}!` : '';
          return `🧺 Thu hoạch [${item?.emoji ?? ''} ${item?.name ?? itemId}${tile.isGolden ? ' HOÀNG KIM ⭐ ×3' : ''}]: +${gained} vào Kho${levelUp}`;
        });
      } else if (action === 'WATER') {
        void runCloud('rpc_water', xy, () => '💧 Đã tưới Nước Giếng Làng (-15% thời gian chờ)!');
      } else {
        void runCloud('rpc_apply_mud', xy, (snap) => {
          const golden = snap.tiles.find((t) => t.x === tile.tileX && t.y === tile.tileY)?.is_golden;
          return `🪣 Đã bón Bùn Phù Sa! Chín ngay lập tức${golden ? ' và NỔ ĐỘT BIẾN HOÀNG KIM ⭐!' : '!'}`;
        });
      }
      return;
    }

    const save = toFarmSave(state);
    const result =
      action === 'PLANT'
        ? plant(save, tileId, state.selectedSeedId, GAME_STAGE, now)
        : action === 'HARVEST'
        ? harvest(save, tileId, now)
        : action === 'WATER'
        ? water(save, tileId, now)
        : applyMud(save, tileId, now, Math.random);
    applyLocal(result);
  },

  sellToHtx: (itemId, qty) => {
    const state = get();
    if (state.farmMode === 'cloud') {
      const item = findItem(itemId);
      void runCloud('rpc_sell_to_htx', { p_item_id: itemId, p_qty: qty }, (snap, prev) =>
        `🏪 Đã bán ${qty} ${item?.emoji ?? ''} ${item?.name ?? itemId} cho HTX: +${snap.profile.gold - prev.gold} 🪙`
      );
      return;
    }
    applyLocal(sellToHtxRule(toFarmSave(state), itemId, qty));
  },

  syncFarmFromServer: async () => {
    const state = get();
    // Khách đã chơi offline có tiến trình thì giữ chế độ offline (không đẩy save cục bộ lên server).
    if (state.accountType === 'GUEST' && state.farmMode === 'local' && hasLocalProgress(state)) return;
    if (!(await hasCloudSession())) {
      set({ farmMode: 'local' });
      return;
    }
    const r = await callFarmRpc('rpc_get_my_farm');
    if (!r.ok) {
      set({ farmMode: 'local', toastMessage: r.missing ? null : r.message });
      return;
    }
    set({ ...snapshotToState(r.snapshot, get()), farmMode: 'cloud' });
  },

  dredgePondMud: () => {
    const state = get();
    if (state.farmMode === 'cloud') {
      void runCloud('rpc_dredge_pond', {}, (snap) =>
        `🪣 Đã Vét Bùn Đáy Ao (-3 ⚡): +3 Xô Bùn Phù Sa (Đang có: ${snap.inventory[MUD_ITEM_ID] ?? 0} xô) & +20 XP!`
      );
      return;
    }
    applyLocal(dredgePond(toFarmSave(state), Date.now()));
  },

  expandWildLand: () => {
    const state = get();
    if (state.farmMode === 'cloud') {
      void runCloud('rpc_expand_land', {}, (snap) =>
        `🪓 Khai hoang thành công (-5 ⚡, -500 🪙)! Đã mở rộng lên ${snap.profile.wild_plots_unlocked}/${MAX_WILD_PLOTS} Phân khu VAC!`
      );
      return;
    }
    applyLocal(expandLand(toFarmSave(state), Date.now()));
  },

  claimStoryQuest: (questId, branchChoice = 'EMP') => {
    const state = get();
    const q = state.storyQuests.find((item) => item.id === questId);
    if (!q || q.completed) return;
    if (!isStageOpen(q.unlockStage)) {
      set({ toastMessage: '🔒 Chương này sẽ mở ở bản cập nhật sau!' });
      return;
    }
    if (state.level < q.minLevel) {
      set({ toastMessage: `🔒 Cần đạt Lv.${q.minLevel} để nhận [${q.chapter}]!` });
      return;
    }
    // Mục tiêu lấy từ dữ liệu chuẩn (bản trong save cũ có thể thiếu objectives).
    const objectives = STORY_QUESTS.find((item) => item.id === questId)?.objectives ?? [];
    const missing = firstMissingObjective(objectives, state.progressCounters);
    if (missing && state.farmMode !== 'cloud') {
      set({ toastMessage: `📜 Chưa hoàn thành: ${missing.label} (${missing.have}/${missing.target})` });
      return;
    }
    const branch = QUEST_BRANCH_REWARDS[branchChoice];
    const doneMessage =
      branchChoice === 'EMP'
        ? `📜 Hoàn thành [${q.chapter}] theo Nhánh Nghĩa Tình: Nhận +${q.rewardGold} 🪙, +${q.rewardGems} 💎, +${branch.fengShui} Phong Thủy & +${branch.neighbor} Nghĩa Xóm!`
        : `📜 Hoàn thành [${q.chapter}] theo Nhánh Thực Dụng: Nhận +${q.rewardGold + branch.gold} 🪙 (+${branch.gold} 🪙 thưởng nhánh), +${q.rewardGems} 💎 & +${QUEST_XP_REWARD} XP!`;

    if (state.farmMode === 'cloud') {
      void runCloud('rpc_claim_story_quest', { p_quest_id: questId, p_choice: branchChoice }, () => doneMessage);
      return;
    }
    const progress = applyXp(state.level, state.xp, QUEST_XP_REWARD);
    set({
      gold: state.gold + q.rewardGold + branch.gold,
      gems: state.gems + q.rewardGems,
      level: progress.level,
      xp: progress.xp,
      fengShuiScore: state.fengShuiScore + branch.fengShui,
      neighborPoints: state.neighborPoints + branch.neighbor,
      storyQuests: state.storyQuests.map((item) =>
        item.id === questId ? { ...item, completed: true, selectedChoice: branchChoice } : item
      ),
      toastMessage: doneMessage,
    });
  },

  claimRookieDayReward: () => {
    const state = get();
    if (state.rookieDaysClaimed >= 7) {
      set({ toastMessage: '🎁 Bạn đã nhận trọn bộ Quà 7 Ngày Tân Thủ!' });
      return;
    }
    if (state.rookieLastClaimOn === todayInVietnam()) {
      set({ toastMessage: '🎁 Hôm nay đã nhận quà rồi, mai quay lại nhé!' });
      return;
    }
    const nextDay = state.rookieDaysClaimed + 1;
    const message = `🎁 Nhận quà Ngày ${nextDay}/7 Tân Thủ: +1,000 🪙 & +20 💎 Ngọc!`;
    if (state.farmMode === 'cloud') {
      void runCloud('rpc_claim_rookie_day', {}, () => message);
      return;
    }
    set({
      rookieDaysClaimed: nextDay,
      rookieLastClaimOn: todayInVietnam(),
      gold: state.gold + 1000,
      gems: state.gems + 20,
      toastMessage: message,
    });
  },

  setSelectedSeed: (seedId) => set({ selectedSeedId: seedId }),

  cycleWeather: () => {
    const state = get();
    const order: WeatherType[] = ['SUNNY', 'RAINY', 'FIREFLY_NIGHT'];
    const next = order[(order.indexOf(state.weather) + 1) % order.length];
    if (next === 'RAINY' && state.farmMode === 'cloud') {
      // Online: thời tiết chỉ để ngắm, việc tưới vẫn tính trên server.
      set({ weather: next, toastMessage: '🌧️ Mưa Rào Quê Hương đổ xuống cánh đồng!' });
    } else if (next === 'RAINY') {
      set({
        weather: next,
        tiles: state.tiles.map((t) => ({ ...t, watered: true })),
        toastMessage: '🌧️ Mưa Rào Quê Hương đổ xuống! Toàn bộ 100% ô ruộng đã được tưới nước tự động (-15% thời gian chín)!',
      });
    } else if (next === 'FIREFLY_NIGHT') {
      set({
        weather: next,
        toastMessage: '🌙 Đêm Trăng Đom Đóm: Hoa sen và Lúa Tím Đột Biến tỏa sáng lấp lánh trên cánh đồng!',
      });
    } else {
      set({
        weather: next,
        toastMessage: '☀️ Nắng Vàng Mật Ong: Thời tiết lý tưởng để phơi nông sản và thu hoạch!',
      });
    }
  },

  fastForwardTime: () => {
    const state = get();
    if (state.farmMode === 'cloud') {
      set({ toastMessage: '⏩ Tua nhanh chỉ dùng ở chế độ offline (server tính giờ thật).' });
      return;
    }
    const now = Date.now();
    set({
      tiles: state.tiles.map((t) => (t.itemId ? { ...t, matureAt: now - 1000 } : t)),
      workerPantryCount: Math.min(120, state.workerPantryCount + 18),
      pondMudCounter: 10,
      stamina: state.maxStamina,
      toastMessage:
        '⏩ [DEV CHEAT x60]: Toàn bộ cây/cá đã chín rộ, Độ bùn ao đạt 10/10, hồi đầy 50 ⚡ & 6 Nhân công thu +18 Nông sản vào Giỏ Lán Thợ!',
    });
  },
});
