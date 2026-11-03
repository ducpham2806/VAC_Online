/** Trạng thái khởi tạo, save offline ↔ luật domain, ảnh chụp server (tách từ useGameStore.ts — S2). */
import { FarmTileEntity } from '../data/types';
import { INITIAL_MARKET_LISTINGS, INITIAL_WORKERS } from '../data/masterData';
import { STORY_QUESTS } from '../data/quests';
import { FarmSave } from '../domain/farm';
import type { KitchenSave, MachineState } from '../domain/cooking';
import { DAY_MS, WorkerRecord, WorkersSave, isWorking, pantryTotal } from '../domain/workers';
import type { HiredWorkerState } from '../data/types';
import { FarmSnapshot, createEmptyTiles, tilesFromSnapshot } from '../services/farmGateway';
import type { GameData } from './gameTypes';

export const createDemoTiles = (): FarmTileEntity[] => {
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

/** Save demo Lv.20 (prototype đủ tính năng) — chỉ dùng khi `npm run dev` / test. */
export function createDemoState(): GameData {
  return {
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

    tiles: createDemoTiles(),
    workerRecords: DEMO_WORKER_RECORDS,
    workerPantry: { CROP_01: 40, ANI_01: 16, AQUA_01: 12 },
    workers: workersView(INITIAL_WORKERS, DEMO_WORKER_RECORDS, Date.now()),
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

    storyQuests: STORY_QUESTS.map((q) => ({ ...q })),
    progressCounters: {},
    machines: {
      MAC_02: { craftItemId: null, readyAt: null },
      MAC_03: { craftItemId: null, readyAt: null },
      MAC_04: { craftItemId: null, readyAt: null },
    },
    discoveredRecipes: ['PROD_03', 'PROD_05'],

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

    staminaUpdatedAt: Date.now(),
    rookieLastClaimOn: null,
    farmMode: 'local',
    farmBusy: false,
    clockOffsetMs: 0,
  };
}

/** Người chơi mới thật sự (production): Lv.1, 2.500 🪙, Đợt 1 — khớp mặc định bảng profiles. */
export function createFreshState(): GameData {
  const demo = createDemoState();
  return {
    ...demo,
    playerName: 'Điền Chủ Mới',
    accountType: 'GUEST',
    userEmail: '',
    level: 1,
    xp: 0,
    gold: 2500,
    gems: 50,
    stamina: 50,
    maxStamina: 50,
    styleScore: 0,
    fengShuiScore: 0,
    neighborPoints: 0,
    trainVouchers: 0,
    dragonBoatMeters: 0,
    npcHearts: 0,
    pondMudCounter: 0,
    wildPlotsUnlocked: 12,
    dinhLangStage: 0,
    mutantPityCount: 0,
    activeTotemBuff: null,
    loaPhuongText: 'Chào mừng bà con về quê lập nghiệp! 🌾',
    rookieDaysClaimed: 0,
    lotteryTickets: [],
    transmogItemId: null,
    toastMessage: '🌾 Chào mừng về quê! Chọn giống trên Khay Giống rồi chạm ô đất trống để gieo vụ đầu tiên.',
    inventory: {},
    tiles: createEmptyTiles(),
    storyQuests: STORY_QUESTS.map((q) => ({ ...q })),
    progressCounters: {},
    machines: {},
    discoveredRecipes: [],
    workerRecords: {},
    workerPantry: {},
    workerPantryCount: 0,
    lodgeDiningTableMeals: 0,
    workers: workersView(INITIAL_WORKERS, {}, Date.now()),
  };
}

export const USE_DEMO_SAVE = import.meta.env.DEV;

export function toFarmSave(s: GameData): FarmSave {
  return {
    region: s.region,
    level: s.level,
    xp: s.xp,
    gold: s.gold,
    gems: s.gems,
    stamina: s.stamina,
    maxStamina: s.maxStamina,
    staminaUpdatedAt: s.staminaUpdatedAt,
    fengShuiScore: s.fengShuiScore,
    wildPlotsUnlocked: s.wildPlotsUnlocked,
    pondMudCounter: s.pondMudCounter,
    inventory: s.inventory,
    tiles: s.tiles,
    counters: s.progressCounters,
  };
}

export function fromFarmSave(save: FarmSave): Partial<GameData> {
  return {
    level: save.level,
    xp: save.xp,
    gold: save.gold,
    gems: save.gems,
    stamina: save.stamina,
    maxStamina: save.maxStamina,
    staminaUpdatedAt: save.staminaUpdatedAt,
    fengShuiScore: save.fengShuiScore,
    wildPlotsUnlocked: save.wildPlotsUnlocked,
    pondMudCounter: save.pondMudCounter,
    inventory: save.inventory,
    tiles: save.tiles,
    progressCounters: save.counters ?? {},
  };
}

export function hasLocalProgress(s: GameData): boolean {
  return (
    s.level > 1 ||
    s.xp > 0 ||
    Object.values(s.inventory).some((q) => q > 0) ||
    s.tiles.some((t) => t.itemId !== null)
  );
}

export function todayInVietnam(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

/** Ảnh chụp từ server → state client (server là nguồn chân lý ở chế độ online). */
const DEMO_WORKER_RECORDS: Record<string, WorkerRecord> = {
  WORK_01: { contractUntil: Date.now() + 3 * DAY_MS, belly: 85, tickAt: Date.now() },
  WORK_02: { contractUntil: Date.now() + 2 * DAY_MS, belly: 65, tickAt: Date.now() },
};

/** Bản hiển thị 6 thợ (`HiredWorkerState`) suy ra từ hợp đồng thật (S5c). Tên / lương / cấp lấy từ dữ liệu gốc. */
export function workersView(
  base: readonly HiredWorkerState[],
  records: Record<string, WorkerRecord>,
  now: number
): HiredWorkerState[] {
  return base.map((w) => {
    const rec = records[w.code];
    if (!rec) return { ...w, isHired: false, contractDaysLeft: 0, belly: 100, statusText: 'Chưa thuê' };
    const hired = rec.contractUntil > now;
    const belly = Math.round(rec.belly);
    return {
      ...w,
      isHired: hired,
      contractDaysLeft: hired ? Math.ceil((rec.contractUntil - now) / DAY_MS) : 0,
      belly,
      statusText: !hired
        ? 'Hết hợp đồng — gia hạn để thợ làm tiếp'
        : isWorking(rec, now)
        ? 'Đang làm: tưới ô chưa tưới, thu ô chín ≥ 5 phút vào Giỏ Thợ'
        : 'Đói bụng — dọn món Bếp Quê lên Bàn Ăn!',
    };
  });
}

/** Phần save mà luật Lán Thợ đọc/ghi (src/domain/workers.ts). */
export function toWorkersSave(s: GameData): WorkersSave {
  return {
    region: s.region,
    level: s.level,
    gold: s.gold,
    pondMudCounter: s.pondMudCounter,
    inventory: s.inventory,
    tiles: s.tiles,
    workers: s.workerRecords ?? {},
    tableMeals: s.lodgeDiningTableMeals,
    pantry: s.workerPantry ?? {},
  };
}

export function fromWorkersSave(save: WorkersSave, now: number): Partial<GameData> {
  return {
    gold: save.gold,
    pondMudCounter: save.pondMudCounter,
    inventory: save.inventory,
    tiles: save.tiles,
    workerRecords: save.workers,
    lodgeDiningTableMeals: save.tableMeals,
    workerPantry: save.pantry,
    workerPantryCount: pantryTotal(save.pantry),
    workers: workersView(INITIAL_WORKERS, save.workers, now),
  };
}

function workersFromSnapshot(snap: FarmSnapshot, prev: GameData): Partial<GameData> {
  const records: Record<string, WorkerRecord> = Object.fromEntries(
    Object.entries(snap.workers ?? {}).map(([id, w]) => [id, { contractUntil: w.contract_until, belly: Number(w.belly), tickAt: w.tick_at }])
  );
  const pantry = snap.worker_pantry ?? {};
  return {
    workerRecords: records,
    workerPantry: pantry,
    workerPantryCount: pantryTotal(pantry),
    lodgeDiningTableMeals: snap.lodge_meals ?? prev.lodgeDiningTableMeals,
    workers: workersView(INITIAL_WORKERS, records, snap.server_now),
  };
}

/** Xưởng từ ảnh chụp server (0009) sang dạng domain. */
export function machinesFromSnapshot(snap: FarmSnapshot): Record<string, MachineState> {
  return Object.fromEntries(
    Object.entries(snap.machines ?? {}).map(([id, m]) => [id, { craftItemId: m.craft_item_id ?? null, readyAt: m.ready_at ?? null }])
  );
}

/** Phần save mà luật Bếp Quê đọc/ghi (src/domain/cooking.ts). */
export function toKitchenSave(s: GameData): KitchenSave {
  return {
    region: s.region,
    level: s.level,
    xp: s.xp,
    gold: s.gold,
    gems: s.gems,
    stamina: s.stamina,
    maxStamina: s.maxStamina,
    staminaUpdatedAt: s.staminaUpdatedAt,
    inventory: s.inventory,
    machines: s.machines ?? {},
    discoveredRecipes: s.discoveredRecipes ?? [],
  };
}

export function fromKitchenSave(save: KitchenSave): Partial<GameData> {
  return {
    level: save.level,
    xp: save.xp,
    gold: save.gold,
    gems: save.gems,
    stamina: save.stamina,
    staminaUpdatedAt: save.staminaUpdatedAt,
    inventory: save.inventory,
    machines: save.machines,
    discoveredRecipes: save.discoveredRecipes,
  };
}

export function snapshotToState(snap: FarmSnapshot, prev: GameData): Partial<GameData> {
  const p = snap.profile;
  return {
    playerName: p.username,
    gender: p.gender,
    region: p.region,
    level: p.level,
    xp: p.xp,
    gold: p.gold,
    gems: p.gems,
    stamina: p.stamina,
    maxStamina: p.max_stamina,
    staminaUpdatedAt: p.stamina_updated_at,
    fengShuiScore: p.feng_shui_score,
    neighborPoints: p.neighbor_points,
    wildPlotsUnlocked: p.wild_plots_unlocked,
    pondMudCounter: p.pond_mud_counter,
    rookieDaysClaimed: p.rookie_days_claimed,
    rookieLastClaimOn: p.rookie_claimed_today ? todayInVietnam() : null,
    inventory: snap.inventory,
    tiles: tilesFromSnapshot(snap),
    progressCounters: snap.counters ?? {},
    machines: machinesFromSnapshot(snap),
    discoveredRecipes: snap.recipes ?? [],
    ...workersFromSnapshot(snap, prev),
    storyQuests: prev.storyQuests.map((q) => {
      const choice = snap.quests[q.id];
      return choice ? { ...q, completed: true, selectedChoice: choice } : { ...q, completed: false };
    }),
    clockOffsetMs: snap.server_now - Date.now(),
  };
}

/** Trường được lưu vào localStorage ở chế độ offline (không lưu UI / dữ liệu demo GĐ2+). */
export const PERSISTED_KEYS = [
  'playerName',
  'accountType',
  'userEmail',
  'gender',
  'region',
  'level',
  'xp',
  'gold',
  'gems',
  'stamina',
  'maxStamina',
  'staminaUpdatedAt',
  'fengShuiScore',
  'neighborPoints',
  'wildPlotsUnlocked',
  'pondMudCounter',
  'rookieDaysClaimed',
  'rookieLastClaimOn',
  'inventory',
  'tiles',
  'storyQuests',
  'progressCounters',
  'machines',
  'discoveredRecipes',
  'workerRecords',
  'workerPantry',
  'lodgeDiningTableMeals',
  'selectedSeedId',
  'farmMode',
] as const satisfies ReadonlyArray<keyof GameData>;

export type PersistedSave = Partial<Pick<GameData, (typeof PERSISTED_KEYS)[number]>>;

export const SAVE_STORAGE_KEY = 'vac_online_save_v1';
