import { create } from 'zustand';
import {
  ChatMessage,
  FarmTileEntity,
  GenderType,
  HiredWorkerState,
  MarketListingItem,
  RegionType,
} from '../data/types';
import {
  GAME_CATALOG,
  INITIAL_MARKET_LISTINGS,
  INITIAL_WORKERS,
} from '../data/masterData';

export type ActiveModalType =
  | null
  | 'REGISTER'
  | 'COOP_QUESTS'
  | 'WORKERS'
  | 'COOKING'
  | 'BENCHMARK'
  | 'MARKET_STEAL'
  | 'FASHION'
  | 'LIVEOPS'
  | 'SUPABASE_CONFIG';

export type WeatherType = 'SUNNY' | 'RAINY' | 'FIREFLY_NIGHT';

export interface CoopOrder {
  id: string;
  title: string;
  requester: string;
  itemId: string;
  itemName: string;
  emoji: string;
  requiredQty: number;
  rewardGold: number;
  rewardXp: number;
  completed: boolean;
}

export interface StoryQuest {
  id: string;
  chapter: string;
  title: string;
  desc: string;
  rewardGold: number;
  rewardGems: number;
  completed: boolean;
}

interface GameState {
  playerName: string;
  gender: GenderType;
  region: RegionType;
  level: number;
  xp: number;
  gold: number;
  gems: number;
  stamina: number;
  maxStamina: number;
  styleScore: number;
  fengShuiScore: number;
  neighborPoints: number;
  workerPantryCount: number;
  pondMudCounter: number; // 0..10 mẻ lưới -> Vét bùn ao (-3 ⚡)
  wildPlotsUnlocked: number;
  weather: WeatherType;
  dinhLangStage: number;
  mutantPityCount: number;
  activeTotemBuff: string | null;
  luckyPacketsLeft: number;
  blocCalendarCheckedToday: boolean;
  rookieDaysClaimed: number; // 1..7 Ngày Tân Thủ
  lotteryTickets: string[];
  toastMessage: string | null;
  activeModal: ActiveModalType;
  visitingFriendName: string | null;
  selectedSeedId: string;

  inventory: Record<string, number>;
  tiles: FarmTileEntity[];
  workers: HiredWorkerState[];
  marketListings: MarketListingItem[];
  coopOrders: CoopOrder[];
  storyQuests: StoryQuest[];
  chatMessages: ChatMessage[];

  // Actions
  setToast: (msg: string) => void;
  setActiveModal: (modal: ActiveModalType) => void;
  setProfile: (name: string, gender: GenderType, region: RegionType) => void;
  setSelectedSeed: (seedId: string) => void;
  cycleWeather: () => void;
  interactTile: (tileId: string) => void;
  dredgePondMud: () => void;
  expandWildLand: () => void;
  deliverCoopOrder: (orderId: string) => void;
  claimStoryQuest: (questId: string) => void;
  claimRookieDayReward: () => void;
  claimWorkerPantry: () => void;
  feedWorker: (workerCode: HiredWorkerState['code'], mealName: string, bellyGain: number) => void;
  equipWorkerGear: (workerCode: HiredWorkerState['code'], gearId: string) => void;
  payWorkerSalary: (workerCode: HiredWorkerState['code']) => void;
  giveWorkerBonus: (workerCode: HiredWorkerState['code']) => void;
  cookRandomDish: (ingredients: string[]) => void;
  prayAtTotem: () => void;
  contributeDinhLang: () => void;
  breedMutantCrop: (targetMutantId: string, costGold: number, baseChance: number, pityLimit: number) => void;
  sellToTraderBoom: () => void;
  runBambooExpedition: () => void;
  playNightMarketMinigame: () => void;
  buyMarketAndVisit: (listing: MarketListingItem) => void;
  attemptStealFromFriend: (targetName: string) => void;
  helpFriendAfterStorm: () => void;
  returnHomeFarm: () => void;
  claimLoaPhuongLucky: () => void;
  tearBlocCalendar: () => void;
  smashClayPotGacha: () => void;
  buyLotteryTicket: (forFriend: boolean) => void;
  sendChatMessage: (content: string) => void;
  fastForwardTime: () => void;
}

const createInitialTiles = (): FarmTileEntity[] => {
  const list: FarmTileEntity[] = [];
  const now = Date.now();
  const presetItems = [
    'CROP_01', 'CROP_01', 'CROP_02', 'CROP_03',
    'CROP_N03', 'CROP_C05', 'CROP_S05', 'CROP_MUT_01',
    'AQUA_01', 'AQUA_08', 'CROP_15', null,
  ];

  for (let i = 0; i < 12; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const zoneType = row === 0 ? 'LAND' : row === 1 ? 'ORCHARD' : 'POND';
    const itemId = presetItems[i] ?? null;
    list.push({
      id: `TILE_${i + 1}`,
      tileX: col,
      tileY: row,
      zoneType,
      itemId,
      plantedAt: itemId ? now - 300_000 : null,
      matureAt: itemId ? (i % 2 === 0 ? now - 10_000 : now + 120_000) : null,
      watered: i % 2 === 0,
      mudApplied: row === 1 && i === 4,
      isGolden: i === 4,
      isTiltedByStorm: i === 2,
      totalYield: 5,
      remainingYield: 5,
    });
  }
  return list;
};

export const useGameStore = create<GameState>((set, get) => ({
  playerName: 'Tư Hậu Lập Nghiệp',
  gender: 'FEMALE',
  region: 'NORTH',
  level: 20,
  xp: 1450,
  gold: 28500,
  gems: 310,
  stamina: 42,
  maxStamina: 50,
  styleScore: 1420,
  fengShuiScore: 520,
  neighborPoints: 18,
  workerPantryCount: 68,
  pondMudCounter: 8,
  wildPlotsUnlocked: 12,
  weather: 'SUNNY',
  dinhLangStage: 1,
  mutantPityCount: 2,
  activeTotemBuff: 'Quẻ Đại Cát (+20% Tỷ lệ Nông sản Hoàng Kim ⭐)',
  luckyPacketsLeft: 32,
  blocCalendarCheckedToday: false,
  rookieDaysClaimed: 2,
  lotteryTickets: ['168', '688'],
  toastMessage: '🌾 Chạm vào ô ruộng để Gieo/Tưới/Bón bùn, hoặc bấm [📋 Nhiệm vụ & HTX] để giao đơn hàng!',
  activeModal: null,
  visitingFriendName: null,
  selectedSeedId: 'CROP_01',

  inventory: {
    CROP_01: 24,
    CROP_02: 15,
    CROP_03: 12,
    CROP_15: 8,
    CROP_N03: 6,
    CROP_C05: 5,
    CROP_S05: 4,
    ANI_01: 10,
    ANI_06: 7,
    AQUA_01: 11,
    AQUA_08: 3,
    REC_01: 6,
    REC_12: 2,
    CRAFT_01: 4,
    CRAFT_03: 3,
    ITEM_BUN_PHU_SA: 6,
    ITEM_DEP_TO_ONG: 2,
  },

  tiles: createInitialTiles(),
  workers: INITIAL_WORKERS,
  marketListings: INITIAL_MARKET_LISTINGS,

  coopOrders: [
    {
      id: 'ORD_01',
      title: 'Đơn Bếp Ăn Trường Làng',
      requester: 'Cô Giáo Hương',
      itemId: 'CROP_01',
      itemName: 'Lúa Nước Tẻ Thơm',
      emoji: '🌾',
      requiredQty: 5,
      rewardGold: 220,
      rewardXp: 35,
      completed: false,
    },
    {
      id: 'ORD_02',
      title: 'Đơn Chợ Quê Đầu Tuần',
      requester: 'Bác Trưởng Thôn Bảy',
      itemId: 'CROP_02',
      itemName: 'Rau Muống Nước',
      emoji: '🥬',
      requiredQty: 4,
      rewardGold: 195,
      rewardXp: 30,
      completed: false,
    },
    {
      id: 'ORD_03',
      title: 'Đơn Đặc Sản Tiến Vua',
      requester: 'Thương Nhân Phố Cổ',
      itemId: 'CROP_N03',
      itemName: 'Vải Thiều Thanh Hà',
      emoji: '🍒',
      requiredQty: 2,
      rewardGold: 520,
      rewardXp: 65,
      completed: false,
    },
  ],

  storyQuests: [
    {
      id: 'Q_CH1',
      chapter: 'Chương 1: Bỏ Phố Về Quê',
      title: 'Khơi thông Giếng Đá Ong & Vét Bùn Ao Cũ',
      desc: 'Thu hoạch 2 mẻ cá dưới ao và bấm Vét Bùn Đáy Ao để lấy Phù Sa bón cho vườn cây của Ông Bảy.',
      rewardGold: 600,
      rewardGems: 15,
      completed: false,
    },
    {
      id: 'Q_CH2',
      chapter: 'Chương 2: Khói Bếp Quê Mẹ',
      title: 'Nấu Nồi Cá Kho Vũ Đại & Dọn Cơm Đãi Lán Thợ',
      desc: 'Phối 3 nguyên liệu trong Bếp Quê và dọn 1 bữa cơm nóng hổi cho Chú Tư Cày.',
      rewardGold: 1200,
      rewardGems: 25,
      completed: false,
    },
  ],

  chatMessages: [
    {
      id: 'MSG_1',
      channel: 'WORLD',
      sender: 'Út Nhỏ Miền Tây',
      region: 'SOUTH',
      content: 'Thương lái nhà mình đang thu mua Sầu Riêng giá x2.5 nè bà con ơi, qua bán ké nhận lộc!',
      timestamp: '09:00',
    },
    {
      id: 'MSG_2',
      channel: 'COOP',
      sender: 'Lý Trưởng Bắc Bộ',
      region: 'NORTH',
      content: 'Tối nay 20:00 anh em Hợp Tác Xã nhớ lên gõ trống Đua Thuyền Rồng x2 tốc độ nhé!',
      timestamp: '09:02',
    },
  ],

  setToast: (msg) => set({ toastMessage: msg }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setProfile: (playerName, gender, region) =>
    set({
      playerName,
      gender,
      region,
      activeModal: null,
      toastMessage: `💮 Đã đóng dấu đỏ! Chào mừng Điền chủ ${playerName} về quê hương ${region}!`,
    }),

  setSelectedSeed: (seedId) => set({ selectedSeedId: seedId }),

  cycleWeather: () => {
    const state = get();
    const order: WeatherType[] = ['SUNNY', 'RAINY', 'FIREFLY_NIGHT'];
    const next = order[(order.indexOf(state.weather) + 1) % order.length];
    if (next === 'RAINY') {
      // Mưa rào tự động tưới ướt 100% ô ruộng!
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

  interactTile: (tileId) => {
    const state = get();
    const now = Date.now();
    const tile = state.tiles.find((t) => t.id === tileId);
    if (!tile) return;

    if (tile.isTiltedByStorm) {
      set({
        tiles: state.tiles.map((t) =>
          t.id === tileId ? { ...t, isTiltedByStorm: false, isGolden: true } : t
        ),
        xp: state.xp + 12,
        toastMessage: '🌈 Đã dựng lại giàn cây sau mưa! Nhận hiệu ứng "Đất Phù Sa Sau Mưa" (+20% sản lượng)!',
      });
      return;
    }

    if (!tile.itemId) {
      const seed = GAME_CATALOG.find((c) => c.id === state.selectedSeedId) ?? GAME_CATALOG[0];
      if (state.gold < seed.buyCostGold) {
        set({ toastMessage: '⚠️ Không đủ Xu Vàng để mua giống!' });
        return;
      }
      set({
        gold: state.gold - seed.buyCostGold,
        tiles: state.tiles.map((t) =>
          t.id === tileId
            ? {
                ...t,
                itemId: seed.id,
                plantedAt: now,
                matureAt: now + seed.growOrCraftMinutes * 60_000,
                watered: state.weather === 'RAINY',
                mudApplied: false,
                isGolden: false,
                totalYield: 5,
                remainingYield: 5,
              }
            : t
        ),
        toastMessage: `🌱 Đã gieo [${seed.emoji} ${seed.name}] (0 ⚡) - Chạm lần nữa để Tưới Nước Giếng Làng!`,
      });
      return;
    }

    const itemSpec = GAME_CATALOG.find((c) => c.id === tile.itemId);
    if (!itemSpec) return;

    if (tile.matureAt && now >= tile.matureAt) {
      const goldGain = itemSpec.baseSellGold * (tile.isGolden ? 3 : 1);
      const currentQty = state.inventory[itemSpec.id] ?? 0;
      const nextMud = tile.zoneType === 'POND' ? Math.min(10, state.pondMudCounter + 1) : state.pondMudCounter;
      set({
        gold: state.gold + goldGain,
        xp: state.xp + itemSpec.xpReward,
        pondMudCounter: nextMud,
        inventory: {
          ...state.inventory,
          [itemSpec.id]: currentQty + 2,
        },
        tiles: state.tiles.map((t) =>
          t.id === tileId
            ? {
                ...t,
                itemId: null,
                plantedAt: null,
                matureAt: null,
                watered: false,
                mudApplied: false,
                isGolden: false,
              }
            : t
        ),
        toastMessage: `🧺 Thu hoạch [${itemSpec.emoji} ${itemSpec.name}${tile.isGolden ? ' HOÀNG KIM ⭐ (x3 Giá)' : ''}]: +2 vào Kho, +${goldGain} 🪙 & Độ bùn ao: ${nextMud}/10!`,
      });
      return;
    }

    if (!tile.watered && tile.matureAt) {
      const reducedTime = tile.matureAt - Math.floor((tile.matureAt - now) * 0.15);
      set({
        tiles: state.tiles.map((t) =>
          t.id === tileId ? { ...t, watered: true, matureAt: reducedTime } : t
        ),
        toastMessage: `💧 Đã tưới Nước Giếng Làng cho [${itemSpec.name}] (-15% thời gian chín)!`,
      });
      return;
    }

    if (!tile.mudApplied) {
      const mudQty = state.inventory.ITEM_BUN_PHU_SA ?? 0;
      if (mudQty <= 0) {
        set({ toastMessage: '🪣 Đã hết Bùn Phù Sa! Hãy bấm nút [🪣 Vét Bùn Ao] hoặc bảo Anh Sáu Kình vét ao nhé!' });
        return;
      }
      const isGoldenRoll = Math.random() < 0.45;
      set({
        inventory: { ...state.inventory, ITEM_BUN_PHU_SA: mudQty - 1 },
        tiles: state.tiles.map((t) =>
          t.id === tileId ? { ...t, mudApplied: true, isGolden: isGoldenRoll, matureAt: now - 1000 } : t
        ),
        toastMessage: `🪣 Đã bón Bùn Phù Sa đáy ao! Cây chín ngay lập tức ${isGoldenRoll ? 'và NỔ ĐỘT BIẾN HOÀNG KIM ⭐!' : '!'}`,
      });
    }
  },

  dredgePondMud: () => {
    const state = get();
    if (state.stamina < 3) {
      set({ toastMessage: '⚡ Cần 3 Năng lượng để Vét Bùn Đáy Ao!' });
      return;
    }
    set({
      stamina: state.stamina - 3,
      pondMudCounter: 0,
      xp: state.xp + 20,
      inventory: {
        ...state.inventory,
        ITEM_BUN_PHU_SA: (state.inventory.ITEM_BUN_PHU_SA ?? 0) + 3,
      },
      toastMessage: '🪣 Đã Vét Bùn Đáy Ao (-3 ⚡): Nhận +3 Xô Bùn Phù Sa giàu dinh dưỡng (Đang có: ' + ((state.inventory.ITEM_BUN_PHU_SA ?? 0) + 3) + ' xô) & +20 XP!',
    });
  },

  expandWildLand: () => {
    const state = get();
    if (state.stamina < 5 || state.gold < 500) {
      set({ toastMessage: '⚠️ Cần 5 ⚡ Năng lượng và 500 🪙 Xu Vàng để phát cỏ, đập đá khai hoang vùng đất mới!' });
      return;
    }
    set({
      stamina: state.stamina - 5,
      gold: state.gold - 500,
      xp: state.xp + 45,
      wildPlotsUnlocked: state.wildPlotsUnlocked + 1,
      fengShuiScore: state.fengShuiScore + 25,
      toastMessage: `🪓 Khai hoang thành công (-5 ⚡, -500 🪙)! Đã mở rộng lên ${state.wildPlotsUnlocked + 1}/25 Phân khu VAC, nhận +45 XP & +25 Phong Thủy!`,
    });
  },

  deliverCoopOrder: (orderId) => {
    const state = get();
    const order = state.coopOrders.find((o) => o.id === orderId);
    if (!order || order.completed) return;
    const haveQty = state.inventory[order.itemId] ?? 0;
    if (haveQty < order.requiredQty) {
      set({ toastMessage: `⚠️ Kho chưa đủ ${order.requiredQty} ${order.itemName} (Hiện có: ${haveQty})! Hãy thu hoạch thêm nhé!` });
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

  claimStoryQuest: (questId) => {
    const state = get();
    const q = state.storyQuests.find((item) => item.id === questId);
    if (!q || q.completed) return;
    set({
      gold: state.gold + q.rewardGold,
      gems: state.gems + q.rewardGems,
      xp: state.xp + 80,
      storyQuests: state.storyQuests.map((item) => (item.id === questId ? { ...item, completed: true } : item)),
      toastMessage: `📜 Hoàn thành ${q.chapter}: Nhận +${q.rewardGold} 🪙, +${q.rewardGems} 💎 Ngọc & +80 XP!`,
    });
  },

  claimRookieDayReward: () => {
    const state = get();
    if (state.rookieDaysClaimed >= 7) {
      set({ toastMessage: '🎁 Bạn đã nhận trọn bộ Quà 7 Ngày Tân Thủ (Bao gồm Chó Phú Quốc & Áo Bà Ba Lụa)!' });
      return;
    }
    const nextDay = state.rookieDaysClaimed + 1;
    set({
      rookieDaysClaimed: nextDay,
      gold: state.gold + 1000,
      gems: state.gems + 20,
      toastMessage: `🎁 Nhận quà Ngày ${nextDay}/7 Tân Thủ: +1,000 🪙, +20 💎 Ngọc & Mảnh Ghép Chó Phú Quốc!`,
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
        REC_12: (state.inventory.REC_12 ?? 0) + 1,
      },
      toastMessage:
        '🎉 KHÁM PHÁ CÔNG THỨC MỚI: [Cá Kho Tộ Vũ Đại - Mỹ Vị 3 Miền ⭐⭐⭐]! Thưởng nóng +10 💎 Ngọc, +50 XP & +25 ⚡!',
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
    set({
      gold: state.gold - cost,
      dinhLangStage: nextStage,
      fengShuiScore: state.fengShuiScore + 150,
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
      set({
        gold: state.gold - costGold,
        mutantPityCount: 0,
        fengShuiScore: state.fengShuiScore + 15,
        inventory: {
          ...state.inventory,
          [spec.id]: (state.inventory[spec.id] ?? 0) + 1,
        },
        toastMessage: `🧬 LAI TẠO ĐỘT BIẾN THÀNH CÔNG! Nhận được [${spec.emoji} ${spec.name}] trị giá ${spec.baseSellGold} 🪙 & +15 Phong Thủy!`,
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

  buyMarketAndVisit: (listing) => {
    const state = get();
    const totalCost = listing.unitPrice * listing.quantity;
    if (state.gold < totalCost) {
      set({ toastMessage: '⚠️ Không đủ Xu Vàng để mua lô hàng này!' });
      return;
    }
    set({
      gold: state.gold - totalCost,
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

  claimLoaPhuongLucky: () => {
    const state = get();
    if (state.luckyPacketsLeft <= 0) return;
    set({
      luckyPacketsLeft: state.luckyPacketsLeft - 1,
      gold: state.gold + 120,
      stamina: Math.min(state.maxStamina, state.stamina + 5),
      toastMessage: '🧧 Xin vía Loa Phường thành công! Nhận +120 Xu Vàng (trích từ Quỹ Thuế Chợ 10%) & +5 ⚡ Năng lượng!',
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
  },

  fastForwardTime: () => {
    const state = get();
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
}));
