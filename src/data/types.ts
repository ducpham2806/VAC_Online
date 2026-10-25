export type RegionType = 'NORTH' | 'CENTRAL' | 'SOUTH';
export type GenderType = 'MALE' | 'FEMALE';
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

export interface CatalogItem {
  id: string;
  category: EntityCategory;
  subGroup?: string;
  name: string;
  region: 'ALL' | RegionType;
  unlockLevel: number;
  buyCostGold: number;
  baseSellGold: number;
  maxMarketGold?: number;
  growOrCraftMinutes: number;
  yieldCount?: number;
  inputIngredients?: string;
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
