/** Kiểu dữ liệu của store (tách từ useGameStore.ts — S2). */
import type {
  ChatMessage,
  FarmTileEntity,
  GenderType,
  HiredWorkerState,
  MarketListingItem,
  RegionType,
} from '../data/types';
import type { GuestbookEntry } from '../services/realtimeService';
import type { StoryQuest } from '../data/quests';
import type { FarmMode } from '../services/farmGateway';
import type { MachineState } from '../domain/cooking';

export type ActiveModalType =
  | null
  | 'AUTH_GATE'
  | 'REGISTER'
  | 'COOP_QUESTS'
  | 'WAREHOUSE'
  | 'WORKERS'
  | 'COOKING'
  | 'BENCHMARK'
  | 'MARKET_STEAL'
  | 'FASHION'
  | 'LIVEOPS'
  | 'ENCYCLOPEDIA'
  | 'SUPABASE_CONFIG'
  | 'QC_REPORT'
  | 'EXPAND_LAND';

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


export interface GameState {
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

  /** Bộ đếm hành động cho mục tiêu nhiệm vụ Gia Phả (WATER, HARVEST:<id>, DREDGE, APPLY_MUD…). */
  progressCounters: Record<string, number>;
  /** Xưởng Bếp Quê đã xây (MAC_02/03/04) và món đang nấu — S4, `src/domain/cooking.ts`. */
  machines: Record<string, MachineState>;
  /** Món đã khám phá ở Nồi Đất (Cơm Trắng mở sẵn, không nằm trong danh sách). */
  discoveredRecipes: string[];
  /** Mốc thời gian (ms) để tính hồi năng lượng +1⚡/3 phút. */
  staminaUpdatedAt: number;
  /** Ngày nhận Quà Tân Thủ gần nhất (YYYY-MM-DD, giờ Việt Nam). */
  rookieLastClaimOn: string | null;
  /** 'cloud' = mọi thao tác kinh tế đi qua RPC server; 'local' = chơi offline lưu localStorage. */
  farmMode: FarmMode;
  /** Đang chờ RPC trả về (chặn bấm liên tục). */
  farmBusy: boolean;
  /** Chênh lệch đồng hồ server − client (ms). */
  clockOffsetMs: number;

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
  buildKitchenMachine: (machineId: string) => void;
  startKitchenCraft: (machineId: string, productId: string) => void;
  collectKitchenCraft: (machineId: string) => void;
  eatDish: (productId: string) => void;
  tryCookingPot: (ingredientIds: string[]) => void;
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
  sellToHtx: (itemId: string, qty: number) => void;
  syncFarmFromServer: () => Promise<void>;
}

/** Phần dữ liệu (không gồm action) của state. */
export type GameData = {
  [K in keyof GameState as GameState[K] extends (...args: never[]) => unknown ? never : K]: GameState[K];
};
