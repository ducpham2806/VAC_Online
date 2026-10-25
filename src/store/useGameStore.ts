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
import { GuestbookEntry, vacRealtime } from '../services/realtimeService';

export type ActiveModalType =
  | null
  | 'AUTH_GATE'
  | 'REGISTER'
  | 'COOP_QUESTS'
  | 'WORKERS'
  | 'COOKING'
  | 'BENCHMARK'
  | 'MARKET_STEAL'
  | 'FASHION'
  | 'LIVEOPS'
  | 'ENCYCLOPEDIA'
  | 'SUPABASE_CONFIG'
  | 'QC_REPORT';

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

export interface TrainCrate {
  id: string;
  carriageName: string;
  itemId: string;
  itemName: string;
  emoji: string;
  requiredQty: number;
  rewardGold: number;
  rewardVoucher: number;
  filled: boolean;
}

export interface StoryQuest {
  id: string;
  chapter: string;
  title: string;
  npcSpeaker: string;
  npcQuote: string;
  desc: string;
  choiceEmpLabel: string;
  choicePragLabel: string;
  selectedChoice?: 'EMP' | 'PRAG';
  rewardGold: number;
  rewardGems: number;
  completed: boolean;
}

interface GameState {
  playerName: string;
  accountType: 'GUEST' | 'REGISTERED';
  userEmail: string;
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
  trainVouchers: number;
  dragonBoatMeters: number;
  npcHearts: number;
  isMarried: boolean;
  homestayLevel: number;
  lodgeDiningTableMeals: number;
  workerAutoTickEnabled: boolean;
  workerPantryCount: number;
  pondMudCounter: number;
  wildPlotsUnlocked: number;
  weather: WeatherType;
  dinhLangStage: number;
  mutantPityCount: number;
  activeTotemBuff: string | null;
  loaPhuongText: string;
  luckyPacketsLeft: number;
  onlineFarmersCount: number;
  dbTablesStatus: string;
  blocCalendarCheckedToday: boolean;
  rookieDaysClaimed: number;
  lotteryTickets: string[];
  transmogItemId: string | null;
  fashionContestEntered: boolean;
  toastMessage: string | null;
  activeModal: ActiveModalType;
  visitingFriendName: string | null;
  selectedSeedId: string;

  inventory: Record<string, number>;
  tiles: FarmTileEntity[];
  workers: HiredWorkerState[];
  marketListings: MarketListingItem[];
  guestbookEntries: GuestbookEntry[];
  coopOrders: CoopOrder[];
  trainCrates: TrainCrate[];
  storyQuests: StoryQuest[];
  chatMessages: ChatMessage[];

  // Actions
  initSupabaseRealtimeSync: () => void;
  syncCatalogToSupabaseCloud: () => Promise<void>;
  postItemToMarket: (itemId: string, qty: number, unitPrice: number) => Promise<void>;
  signFriendGuestbook: (message: string) => Promise<void>;
  tickWorkerAutomation: () => void;
  toggleWorkerAutoTick: () => void;
  addMealsToLodgeTable: (portions: number, costGold: number) => void;
  fillTrainCrate: (crateId: string) => void;
  rowDragonBoatDerby: () => void;
  giftNpcForMarriage: () => void;
  serveHomestayGuests: () => void;
  setToast: (msg: string) => void;
  setActiveModal: (modal: ActiveModalType) => void;
  setProfile: (name: string, gender: GenderType, region: RegionType) => void;
  applyAuthAccount: (
    account: {
      playerName: string;
      email: string;
      accountType: 'GUEST' | 'REGISTERED';
      gender: GenderType;
      region: RegionType;
    },
    isNewSignupOrGuest: boolean,
    isGuestUpgrade: boolean
  ) => void;
  setSelectedSeed: (seedId: string) => void;
  cycleWeather: () => void;
  interactTile: (tileId: string) => void;
  dredgePondMud: () => void;
  expandWildLand: () => void;
  deliverCoopOrder: (orderId: string) => void;
  claimStoryQuest: (questId: string, branchChoice?: 'EMP' | 'PRAG') => void;
  claimRookieDayReward: () => void;
  claimWorkerPantry: () => void;
  feedWorker: (workerCode: HiredWorkerState['code'], mealName: string, bellyGain: number) => void;
  equipWorkerGear: (workerCode: HiredWorkerState['code'], gearId: string) => void;
  payWorkerSalary: (workerCode: HiredWorkerState['code']) => void;
  giveWorkerBonus: (workerCode: HiredWorkerState['code']) => void;
  cookRandomDish: (ingredients: string[]) => void;
  craftOrBuyCatalogItem: (itemId: string) => void;
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
  fuseDuplicateFashion: (itemId: string) => void;
  setTransmogSlot: (itemId: string) => void;
  enterFashionContest: () => void;
  simulateOfflineWorkerProgress: (hoursOffline: number) => void;
  sendChatMessage: (content: string) => void;
  fastForwardTime: () => void;
}

const createInitialTiles = (): FarmTileEntity[] => {
  const list: FarmTileEntity[] = [];
  const now = Date.now();
  const presetItems = [
    'CROP_01', 'CROP_02', 'CROP_03', 'CROP_15',
    'CROP_N03', 'CROP_C05', 'CROP_S05', 'CROP_MUT_01',
    'AQUA_01', 'AQUA_08', 'AQUA_N01', null,
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
  accountType: 'REGISTERED',
  userEmail: 'tuhau@vaconline.vn',
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
  trainVouchers: 4,
  dragonBoatMeters: 450,
  npcHearts: 7,
  isMarried: false,
  homestayLevel: 1,
  lodgeDiningTableMeals: 6,
  workerAutoTickEnabled: true,
  workerPantryCount: 68,
  pondMudCounter: 8,
  wildPlotsUnlocked: 12,
  weather: 'SUNNY',
  dinhLangStage: 1,
  mutantPityCount: 2,
  activeTotemBuff: 'Quẻ Đại Cát (+20% Tỷ lệ Nông sản Hoàng Kim ⭐)',
  loaPhuongText: '[Minh Râu] trúng Độc Đắc 18h nhận 50,000 🪙!',
  luckyPacketsLeft: 32,
  onlineFarmersCount: 1,
  dbTablesStatus: 'Đang kiểm tra & đồng bộ 155 thực thể lên Supabase Cloud...',
  blocCalendarCheckedToday: false,
  rookieDaysClaimed: 2,
  lotteryTickets: ['168', '688'],
  transmogItemId: 'FASH_03',
  fashionContestEntered: false,
  toastMessage: `🌾 VAC Online v2.0 Complete: Đã bật Tự Động Hóa 6 Nhân Công, Ga Tàu Thống Nhất, Đua Thuyền Rồng, Homestay & Lễ Cưới Quê!`,
  activeModal: null,
  visitingFriendName: null,
  selectedSeedId: 'CROP_01',

  inventory: {
    CROP_01: 24,
    CROP_02: 15,
    CROP_03: 12,
    CROP_05: 10,
    CROP_07: 9,
    CROP_09: 8,
    CROP_15: 8,
    CROP_19: 6,
    CROP_24: 5,
    CROP_29: 6,
    CROP_30: 10,
    CROP_N01: 8,
    CROP_C01: 8,
    CROP_S01: 8,
    CROP_N03: 6,
    CROP_C05: 5,
    CROP_S05: 4,
    ANI_01: 10,
    ANI_05: 5,
    ANI_06: 7,
    ANI_07: 4,
    ANI_N01: 3,
    AQUA_01: 11,
    AQUA_03: 6,
    AQUA_08: 3,
    AQUA_N01: 4,
    PROD_01: 8,
    PROD_03: 6,
    PROD_13: 3,
    PROD_22: 2,
    CRAFT_01: 4,
    CRAFT_02: 3,
    CRAFT_03: 3,
    CRAFT_04: 1,
    MAC_01: 1,
    MAC_02: 1,
    MAC_03: 1,
    MAC_04: 1,
    MAC_07: 1,
    MAC_08: 1,
    ITEM_BUN_PHU_SA: 6,
    ITEM_DEP_TO_ONG: 2,
  },

  tiles: createInitialTiles(),
  workers: INITIAL_WORKERS,
  marketListings: INITIAL_MARKET_LISTINGS,

  guestbookEntries: [
    {
      id: 'GB_1',
      hostName: 'Tư Hậu Lập Nghiệp',
      visitorName: 'Út Nhỏ Miền Tây',
      message: 'Vườn vải thiều và đầm sen nhà bạn đẹp quá, mình ghé chụp ảnh check-in tặng +10 Mỹ Quan nè!',
      timestamp: '09:15',
    },
    {
      id: 'GB_2',
      hostName: 'Tư Hậu Lập Nghiệp',
      visitorName: 'Lý Trưởng Kinh Bắc',
      message: 'Đã sang dựng giúp giàn bầu sau cơn mưa rào, chúc điền chủ vụ mùa bội thu!',
      timestamp: '09:30',
    },
  ],

  coopOrders: [
    {
      id: 'ORD_01',
      title: 'Đơn Bếp Ăn Trường Làng',
      requester: 'Cô Giáo Hương',
      itemId: 'CROP_01',
      itemName: 'Lúa Nước (Tẻ Thơm)',
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
      itemName: 'Vải Thiều Thanh Hà (Bắc Bậc 3)',
      emoji: '🍒',
      requiredQty: 2,
      rewardGold: 520,
      rewardXp: 65,
      completed: false,
    },
    {
      id: 'ORD_04',
      title: 'Đơn Đại Tiệc Làng Vũ Đại',
      requester: 'Cụ Bá Kiến',
      itemId: 'PROD_22',
      itemName: 'Cá Kho Tộ Vũ Đại (Giao Thoa 3 Miền)',
      emoji: '🥘',
      requiredQty: 1,
      rewardGold: 680,
      rewardXp: 90,
      completed: false,
    },
  ],

  trainCrates: [
    {
      id: 'TR_01',
      carriageName: 'Toa 1 (Hà Nội ➔ Huế)',
      itemId: 'CROP_N01',
      itemName: 'Cải Cúc & Su Hào (Bắc)',
      emoji: '🥬',
      requiredQty: 3,
      rewardGold: 360,
      rewardVoucher: 1,
      filled: false,
    },
    {
      id: 'TR_02',
      carriageName: 'Toa 2 (Huế ➔ Đà Nẵng)',
      itemId: 'CROP_C05',
      itemName: 'Cà Phê Buôn Ma Thuột (Trung)',
      emoji: '☕',
      requiredQty: 2,
      rewardGold: 540,
      rewardVoucher: 2,
      filled: false,
    },
    {
      id: 'TR_03',
      carriageName: 'Toa 3 (Đà Nẵng ➔ Sài Gòn)',
      itemId: 'CROP_S05',
      itemName: 'Sầu Riêng Ri6 & Dừa Sáp (Nam)',
      emoji: '🥭',
      requiredQty: 2,
      rewardGold: 620,
      rewardVoucher: 2,
      filled: false,
    },
  ],

  storyQuests: [
    {
      id: 'Q_CH1',
      chapter: 'Chương 1 (Lv.1): Bức Thư Trong Chiếc Tráp Gỗ Lim',
      title: 'Giữ Đất Tổ Tiên & Gieo Vụ Lúa Đầu Mùa',
      npcSpeaker: '🎩 Thương Nhân Bá Kiến',
      npcQuote: '"Ký giấy nhượng lại mảnh vườn này lấy 2,000 Xu tiêu xài, đỡ phải chân lấm tay bùn trả khoản khế ước 50,000 Xu của ông nội cháu!"',
      desc: 'Từ chối bán đất tổ tiên, tưới nước Giếng Làng (-15% t/g) và thu hoạch mẻ Lúa Nước đầu tiên để mở Trang Gia Phả #1.',
      choiceEmpLabel: '🤝 Giữ đất tổ tiên (+30 Phong Thủy & +3 Nghĩa Xóm)',
      choicePragLabel: '🪙 Đòi Bá Kiến đặt cọc lúa sạch (+350 🪙)',
      rewardGold: 600,
      rewardGems: 15,
      completed: false,
    },
    {
      id: 'Q_CH2',
      chapter: 'Chương 2 (Lv.3): Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao',
      title: 'Vét Bùn Phù Sa & Đỏ Lửa Bếp Củi Quê Mẹ',
      npcSpeaker: '👴 Bác Trưởng Thôn Bảy',
      npcQuote: '"Mùi cá kho riềng sả bốc lên làm bác nhớ bà nội cháu xưa kia quá... Bát đầu tiên mới ra lò, cháu tính đem biếu ai trước?"',
      desc: 'Vét Bùn Đáy Ao lấy 3 Xô Phù Sa và phối 3 nguyên liệu trong Nồi Đất Bếp Quê để tìm lại Trang Gia Phả #2.',
      choiceEmpLabel: '🤝 Biếu Bác Bảy & Lớp học làng (+30 Phong Thủy)',
      choicePragLabel: '🪙 Bán mở hàng Quán Nước đầu làng (+350 🪙)',
      rewardGold: 900,
      rewardGems: 20,
      completed: false,
    },
    {
      id: 'Q_CH3',
      chapter: 'Chương 3 (Lv.6): Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông',
      title: 'Dựng Giàn Sau Bão & Giao Đơn Trường Làng',
      npcSpeaker: '👩‍🏫 Cô Giáo Hương',
      npcQuote: '"Cơn mưa đầu mùa làm tốc mái bếp ăn trường làng rồi... May mà có chuyến xe rau gạo Hợp Tác Xã của bạn kịp chở tới!"',
      desc: 'Dựng lại giàn cây bị nghiêng sau mưa bão (+20% sản lượng) và giao 1 Đơn Hàng Hợp Tác Xã mở Trang Gia Phả #3.',
      choiceEmpLabel: '🤝 Góp tre gỗ sửa mái bếp trường (+30 Phong Thủy)',
      choicePragLabel: '🪙 Ký hợp đồng cung ứng giá sỉ (+350 🪙)',
      rewardGold: 1200,
      rewardGems: 25,
      completed: false,
    },
    {
      id: 'Q_CH4',
      chapter: 'Chương 4 (Lv.9): Bóng Đêm Rình Rập & Chó Phú Quốc',
      title: 'Huấn Luyện Chó Phú Quốc & Mở Sổ Lưu Bút Cổng Làng',
      npcSpeaker: '👴 Bác Trưởng Thôn Bảy',
      npcQuote: '"Đêm qua có kẻ rón rén vào vườn xoài đánh rơi chiếc Dép Tổ Ong! Cháu mau huấn luyện chú Chó Xoáy Phú Quốc canh sân nhé!"',
      desc: 'Ghé thăm trang trại hàng xóm qua Báo Chợ, ký Sổ Lưu Bút và mở khóa 4 Lớp Phòng Thủ (Trang Gia Phả #4).',
      choiceEmpLabel: '🤝 Đóng bảng Lưu Bút kết bạn (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đặt thêm Bẫy Vỏ Chuối phạt 50 Xu (+350 🪙)',
      rewardGold: 1500,
      rewardGems: 30,
      completed: false,
    },
    {
      id: 'Q_CH5',
      chapter: 'Chương 5 (Lv.12): Tiếng Còi Tàu Thống Nhất Bắc – Nam',
      title: 'Đóng Toa Hàng Xuyên Việt & Kết Nối Đặc Sản 3 Miền',
      npcSpeaker: '👧 Út Nhỏ Miền Tây',
      npcQuote: '"Ghe Sầu riêng Ri6 của em vừa cập bến tàu! Mình kết nghĩa giao thương 3 miền Bắc – Trung – Nam nghen!"',
      desc: 'Đóng 1 Toa Hàng trên Ga Tàu Thống Nhất hoặc đăng bán nông sản lên Chợ Phiên 3 Miền để mở Trang Gia Phả #5.',
      choiceEmpLabel: '🤝 Kết nghĩa đồng hương 3 miền (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đón đầu Thương Lái giá sốt x2.5 (+350 🪙)',
      rewardGold: 2000,
      rewardGems: 35,
      completed: false,
    },
    {
      id: 'Q_CH6',
      chapter: 'Chương 6 (Lv.14): Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư',
      title: 'Xây Lán Thợ 6 Gia Nhân & Dọn Mâm Cơm Quê Ấm Áp',
      npcSpeaker: '👨‍🌾 Chú Tư Cày',
      npcQuote: '"Cậu/Cô chủ không chê lão nông này già cả, còn nấu canh cải cá rô đãi cơm trưa... Tôi xin thề chăm từng gốc lúa như ruộng nhà!"',
      desc: 'Thuê nhân công Lán Thợ, dọn cơm lên Bàn Ăn Chung và thu hoạch Giỏ Kho Thợ (120 ô) mở Trang Gia Phả #6.',
      choiceEmpLabel: '🤝 Đãi thêm trà bánh ngày mùa (+30 Phong Thủy)',
      choicePragLabel: '🪙 Phân ca tự động hóa 24/7 (+350 🪙)',
      rewardGold: 2500,
      rewardGems: 40,
      completed: false,
    },
    {
      id: 'Q_CH7',
      chapter: 'Chương 7 (Lv.16): Bí Truyền Khung Cửi Lụa & Áo Mới',
      title: 'Nuôi Tằm Dệt Lụa Tân Châu & Dự Thi Duyên Dáng',
      npcSpeaker: '👗 Cô Ba Tiệm May',
      npcQuote: '"Tơ tằm năm nay óng ả như nắng thu! Điền chủ muốn may áo bảo hộ cho Lán Thợ trước hay may Áo Dài Ngũ Thân dự hội?"',
      desc: 'Cấp phát áo quần bảo hộ 72h cho nhân công và khâu ghép trang phục 12 Slots để mở Trang Gia Phả #7.',
      choiceEmpLabel: '🤝 Ưu tiên áo ấm cho 6 Gia nhân (+30 Phong Thủy)',
      choicePragLabel: '🪙 May Lễ phục dự thi Duyên Dáng (+350 🪙)',
      rewardGold: 3200,
      rewardGems: 45,
      completed: false,
    },
    {
      id: 'Q_CH8',
      chapter: 'Chương 8 (Lv.18): Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ',
      title: 'Thám Hiểm Rừng Trúc & Lai Tạo Lúa Tím Đột Biến',
      npcSpeaker: '🪵 Chú Tám Mộc',
      npcQuote: '"Hũ sành cổ trong Rừng Trúc chứa phấn hoa đột biến của Ông Nội cháu đấy! Chiết cành đủ Pity là chắc chắn nổ 100%!"',
      desc: 'Thám hiểm Rừng Trúc (-6⚡) và chiết cành tại Vườn Ươm Đột Biến Đình Làng để mở Trang Gia Phả #8.',
      choiceEmpLabel: '🤝 Chia sẻ giống quý cho Hợp Tác Xã (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đấu giá giống đột biến ở Chợ Đêm (+350 🪙)',
      rewardGold: 4000,
      rewardGems: 50,
      completed: false,
    },
    {
      id: 'Q_CH9',
      chapter: 'Chương 9 (Lv.22): Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến',
      title: 'Nấu Cá Kho Vũ Đại 3 Miền & Xóa Khế Ước 50,000 Xu',
      npcSpeaker: '🎩 Thương Nhân Bá Kiến',
      npcQuote: '"Miếng cá trắm kho tiêu thấm nước dừa này... 40 năm rồi ta mới được ăn lại vị mẹ nấu. Ta xin đốt tờ khế ước và góp tiền xây Đình Làng!"',
      desc: 'Nấu món Đại Tiệc Giao Thoa 3 Miền và công đức trùng tu Đình Làng để mở Trang Gia Phả #9.',
      choiceEmpLabel: '🤝 Mời Bá Kiến khắc tên Bia Công Đức (+30 Phong Thủy)',
      choicePragLabel: '🪙 Ký hiệp ước bao tiêu Chợ Đêm 0% thuế (+350 🪙)',
      rewardGold: 6000,
      rewardGems: 60,
      completed: false,
    },
    {
      id: 'Q_CH10',
      chapter: 'Chương 10 (Lv.25+): Trầu Cau Nên Duyên & Gia Bảo Truyền Đời',
      title: 'Lễ Cưới 10 Tim ❤️, Homestay Đầm Sen & Bằng Khen Điền Chủ',
      npcSpeaker: '💍 Người Bạn Đời Tri Kỷ',
      npcQuote: '"Từ hai bàn tay trắng ngày mới về quê, giờ cánh đồng lúa chín vàng rực rỡ... Mình viết tiếp cuốn Gia Phả Ba Miền cho đời con cháu nhé!"',
      desc: 'Đạt 10/10 Tim Kết hôn, đón đoàn khách Du lịch Homestay Đầm Sen và xuất ảnh Bằng Khen Điền Chủ Mẫu Mực (.PNG).',
      choiceEmpLabel: '🤝 Khắc chữ Gia Phả Tình Quê (+30 Phong Thủy)',
      choicePragLabel: '🪙 Mở rộng Đại Điền Trang Bốn Biển (+350 🪙)',
      rewardGold: 10000,
      rewardGems: 100,
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

  postItemToMarket: async (itemId, qty, unitPrice) => {
    const state = get();
    const haveQty = state.inventory[itemId] ?? 0;
    const spec = GAME_CATALOG.find((c) => c.id === itemId);
    if (!spec || qty <= 0) return;

    if (haveQty < qty) {
      set({ toastMessage: `⚠️ Kho chỉ còn ${haveQty} ${spec.name}, không đủ ${qty} để đăng bán!` });
      return;
    }

    const minPrice = Math.max(1, Math.floor(spec.baseSellGold * 0.8));
    const maxPrice = Math.max(minPrice + 2, spec.baseSellGold * 2);
    const clampedPrice = Math.min(maxPrice, Math.max(minPrice, unitPrice));

    const createdListing = await vacRealtime.postMarketListingToCloud(
      state.playerName,
      state.region,
      state.level,
      itemId,
      qty,
      clampedPrice
    );

    const netRevenueAfterTax = Math.floor(clampedPrice * qty * 0.9);
    set((st) => ({
      gold: st.gold + netRevenueAfterTax,
      inventory: {
        ...st.inventory,
        [itemId]: haveQty - qty,
      },
      marketListings: [createdListing, ...st.marketListings],
      toastMessage: `📰 Đã đăng bán ${qty} ${spec.emoji} ${spec.name} lên Báo Chợ 3 Miền Cloud! Tạm ứng +${netRevenueAfterTax} 🪙 (Đã trừ 10% Thuế Chợ)!`,
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

  setToast: (msg) => set({ toastMessage: msg }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setProfile: (playerName, gender, region) => {
    const cleanName = playerName.replace(/[<>]/g, '').trim() || 'Điền Chủ';
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
    const bonusGold = isGuestUpgrade ? 1000 : isNewSignupOrGuest && account.accountType === 'REGISTERED' ? 500 : 0;
    const bonusGems = isGuestUpgrade ? 50 : 0;
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
  },

  setSelectedSeed: (seedId) => set({ selectedSeedId: seedId }),

  cycleWeather: () => {
    const state = get();
    const order: WeatherType[] = ['SUNNY', 'RAINY', 'FIREFLY_NIGHT'];
    const next = order[(order.indexOf(state.weather) + 1) % order.length];
    if (next === 'RAINY') {
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
        set({ toastMessage: '⚠️ Không đủ Xu Vàng để mua giống/vật nuôi này!' });
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
                matureAt:
                  now +
                  Math.round(
                    Math.max(1, seed.growOrCraftMinutes) *
                      60_000 *
                      (state.region === 'NORTH' && seed.category === 'CROP' ? 0.9 : 1)
                  ),
                watered: state.weather === 'RAINY',
                mudApplied: false,
                isGolden: false,
                totalYield: seed.yieldCount ?? 5,
                remainingYield: seed.yieldCount ?? 5,
              }
            : t
        ),
        toastMessage: `🌱 Đã thả/gieo [${seed.emoji} ${seed.name}] (-${seed.buyCostGold} 🪙, 0 ⚡) - Chạm lần nữa để Chăm sóc / Tưới nước!`,
      });
      return;
    }

    const itemSpec = GAME_CATALOG.find((c) => c.id === tile.itemId);
    if (!itemSpec) return;

    if (tile.matureAt && now >= tile.matureAt) {
      const yieldQty = itemSpec.yieldCount ?? 2;
      const goldGain = itemSpec.baseSellGold * yieldQty * (tile.isGolden ? 3 : 1);
      const currentQty = state.inventory[itemSpec.id] ?? 0;
      const nextMud =
        tile.zoneType === 'POND' || itemSpec.category === 'AQUA'
          ? Math.min(10, state.pondMudCounter + 1)
          : state.pondMudCounter;
      set({
        gold: state.gold + goldGain,
        xp: state.xp + itemSpec.xpReward,
        pondMudCounter: nextMud,
        inventory: {
          ...state.inventory,
          [itemSpec.id]: currentQty + yieldQty,
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
        toastMessage: `🧺 Thu hoạch [${itemSpec.emoji} ${itemSpec.name}${tile.isGolden ? ' HOÀNG KIM ⭐ (x3 Giá)' : ''}]: +${yieldQty} vào Kho, +${goldGain} 🪙 & Độ bùn ao: ${nextMud}/10!`,
      });
      return;
    }

    if (!tile.watered && tile.matureAt) {
      const reducedTime = tile.matureAt - Math.floor((tile.matureAt - now) * 0.15);
      set({
        tiles: state.tiles.map((t) =>
          t.id === tileId ? { ...t, watered: true, matureAt: reducedTime } : t
        ),
        toastMessage: `💧 Đã tưới Nước Giếng Làng / Chăm sóc [${itemSpec.name}] (-15% thời gian chờ)!`,
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
        toastMessage: `🪣 Đã bón Bùn Phù Sa đáy ao! [${itemSpec.name}] chín ngay lập tức ${isGoldenRoll ? 'và NỔ ĐỘT BIẾN HOÀNG KIM ⭐!' : '!'}`,
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
      toastMessage:
        '🪣 Đã Vét Bùn Đáy Ao (-3 ⚡): Nhận +3 Xô Bùn Phù Sa giàu dinh dưỡng (Đang có: ' +
        ((state.inventory.ITEM_BUN_PHU_SA ?? 0) + 3) +
        ' xô) & +20 XP!',
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

  claimStoryQuest: (questId, branchChoice = 'EMP') => {
    const state = get();
    const q = state.storyQuests.find((item) => item.id === questId);
    if (!q || q.completed) return;
    const extraGold = branchChoice === 'PRAG' ? 350 : 0;
    const extraFengShui = branchChoice === 'EMP' ? 30 : 10;
    const extraNeighbor = branchChoice === 'EMP' ? 3 : 1;
    set({
      gold: state.gold + q.rewardGold + extraGold,
      gems: state.gems + q.rewardGems,
      xp: state.xp + 100,
      fengShuiScore: state.fengShuiScore + extraFengShui,
      neighborPoints: state.neighborPoints + extraNeighbor,
      storyQuests: state.storyQuests.map((item) =>
        item.id === questId
          ? { ...item, completed: true, selectedChoice: branchChoice }
          : item
      ),
      toastMessage:
        branchChoice === 'EMP'
          ? `📜 Hoàn thành [${q.chapter}] theo Nhánh Nghĩa Tình: Nhận +${q.rewardGold} 🪙, +${q.rewardGems} 💎, +30 Phong Thủy & +3 Nghĩa Xóm!`
          : `📜 Hoàn thành [${q.chapter}] theo Nhánh Thực Dụng: Nhận +${q.rewardGold + extraGold} 🪙 (+350 🪙 thưởng nhánh), +${q.rewardGems} 💎 & +100 XP!`,
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
