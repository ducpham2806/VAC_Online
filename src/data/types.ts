export type RegionType = 'NORTH' | 'CENTRAL' | 'SOUTH';
export type GenderType = 'MALE' | 'FEMALE';
export type UnlockWave = 1 | 2 | 3 | 4 | 5;

export type EntityCategory =
  | 'CROP'
  | 'TREE'
  | 'MUTANT_CROP'
  | 'ANIMAL'
  | 'PET'
  | 'AQUA'
  | 'MACHINE'
  | 'RECIPE'
  | 'CRAFT_GEAR'
  | 'FASHION'
  | 'WORKER'
  | 'BENCHMARK_FEATURE'
  | 'DEFENSE'
  | 'IAP';

/** 1 dòng nguyên liệu trong công thức Bếp Quê (S4, `17` mục C2). */
export interface RecipeIngredient {
  itemId: string;
  qty: number;
}

export interface CatalogItem {
  id: string;
  category: EntityCategory;
  subGroup?: string;
  name: string;
  region: 'ALL' | RegionType;
  unlockLevel: number;
  /** Đợt mở khóa V-A-C (GDD 01 mục 3.2): 1..5. Không có = không gắn với Đợt (tính năng, IAP, thời trang...). */
  unlockWave?: UnlockWave;
  buyCostGold: number;
  baseSellGold: number;
  maxMarketGold?: number;
  growOrCraftMinutes: number;
  yieldCount?: number;
  inputIngredients?: string;
  /** Xưởng nấu món này (S4). */
  machineId?: string;
  /** Công thức theo ID thực thể (S4). `inputIngredients` giữ làm chữ hiển thị. */
  recipe?: RecipeIngredient[];
  xpReward: number;
  staminaDelta: number;
  emoji: string;
  tags: string[];
  description: string;
}

export interface FarmTileEntity {
  id: string;
  tileX: number;
  tileY: number;
  zoneType: 'LAND' | 'WETLAND' | 'ORCHARD' | 'POND';
  itemId: string | null;
  plantedAt: number | null;
  matureAt: number | null;
  watered: boolean;
  mudApplied: boolean;
  isGolden: boolean;
  isTiltedByStorm?: boolean;
  totalYield: number;
  remainingYield: number;
}

export interface HiredWorkerState {
  code: 'WORK_01' | 'WORK_02' | 'WORK_03' | 'WORK_04' | 'WORK_05' | 'WORK_06';
  name: string;
  role: string;
  unlockLevel: number;
  dailySalaryGold: number;
  favoriteMeal: string;
  emoji: string;
  isHired: boolean;
  contractDaysLeft: number;
  belly: number; // 0 - 100
  morale: number; // 0 - 100
  equippedGearId: string | null;
  gearHoursLeft: number; // max 72h
  assignedItemId: string;
  statusText: string;
}

export interface MarketListingItem {
  id: string;
  sellerName: string;
  sellerRegion: RegionType;
  sellerLevel: number;
  itemId: string;
  itemName: string;
  emoji: string;
  quantity: number;
  unitPrice: number;
  basePrice: number;
  hasRipeStealableCrop: boolean;
  stealTargetName: string;
}

export interface ChatMessage {
  id: string;
  channel: 'WORLD' | 'REGION' | 'COOP' | 'TRADE' | 'SYSTEM';
  sender: string;
  region: RegionType;
  content: string;
  timestamp: string;
}
