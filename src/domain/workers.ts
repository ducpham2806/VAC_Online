import { GAME_CATALOG } from '../data/masterData';
import { CatalogItem, FarmTileEntity, RegionType } from '../data/types';
import { CRAFT_MIN_STAGE } from './progression';
import { WATER_TIME_CUT, harvestQty, pondMudAfterHarvest, tileAfterHarvest } from './farm';
import { COUNTER, Counters, bumpCounter } from './quests';

/**
 * Lán Thợ (S5c — M05.1, M05.2, M05.4, M05.5), dạng hàm thuần. Đặc tả + quyết định PO: `17` mục C3.
 * Bản sao trên server: migration 0011_workers.sql (rpc_hire_worker, rpc_serve_lodge_meal,
 * rpc_claim_worker_pantry, _tick_workers). Sửa luật ở đây thì sửa cả SQL + test 2 phía.
 *
 * - Thợ chỉ THU + TƯỚI, không tự gieo (PO 2026-11-03). Thu ô đã chín ≥ 5 phút (chừa thời gian cho chủ),
 *   hàng thật vào Giỏ Thợ (tối đa 120), không cộng XP / bộ đếm nhiệm vụ.
 * - Hợp đồng 3 ngày trả trước = lương × 3 × 0,88. Lương = `buyCostGold` của thợ trong catalog.
 * - Độ No hao theo giờ; dưới 35 thì nghỉ làm. Đói thì tự ăn ở Bàn Ăn (1 suất = 25 Độ No) tới khi ≥ 85.
 * - Tính lười (lazy-tick): khi gọi `tickWorkers(save, now)`. Thợ chỉ làm trong khoảng còn hợp đồng
 *   và còn no; bữa ăn tính tại thời điểm tick (đơn giản hóa có chủ đích).
 */

export const CONTRACT_DAYS = 3;
export const CONTRACT_DISCOUNT = 0.88;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const HUNGRY_BELLY = 35;
export const EAT_UNTIL_BELLY = 85;
export const MAX_BELLY = 100;
/** 1 suất cơm trên Bàn Ăn = 25 Độ No (Cơm Trắng: "+5 ⚡ hoặc +25 Độ No"). */
export const BELLY_PER_MEAL = 25;
/** Món Bếp Quê dọn lên Bàn Ăn: số suất = ⚡ của món ÷ 5 (tối thiểu 1). */
export const STAMINA_PER_MEAL = 5;
export const HARVEST_GRACE_MS = 5 * 60_000;
export const PANTRY_CAP = 120;
/** Đồ thợ (S5d, PO 2026-11-03): mặc 72 giờ, Độ No hao chậm 25%. */
export const GEAR_MS = 72 * 60 * 60 * 1000;
export const GEAR_BELLY_FACTOR = 0.75;
/**
 * Phụ Cấp Ngày Mùa (PO giữ 300🪙, 2026-11-03): 24 giờ "Hăng Say" — thợ tưới cắt 25% thời gian còn lại
 * (thường 15%). Quy đổi "+25% tốc độ" của `02` mục 3.2 thành con số đo được; không đổi mốc chờ 5 phút.
 */
export const BONUS_GOLD = 300;
export const BONUS_MS = 24 * 60 * 60 * 1000;
export const BONUS_WATER_CUT = 0.25;

type Category = CatalogItem['category'];

/** Việc + Độ No hao mỗi ngày của từng thợ (`02` mục 3.2). Thợ GĐ3+ có mặt nhưng bị khóa theo Đợt. */
export const WORKER_SPECS: Readonly<Record<string, { categories: readonly Category[]; bellyPerDay: number }>> = {
  WORK_01: { categories: ['CROP', 'TREE', 'MUTANT_CROP'], bellyPerDay: 60 },
  WORK_02: { categories: ['ANIMAL'], bellyPerDay: 75 },
  WORK_03: { categories: ['AQUA'], bellyPerDay: 90 },
};
/** Thứ tự xử lý khi tick (cố định để server và client ra cùng kết quả). */
export const WORKER_ORDER: readonly string[] = Object.keys(WORKER_SPECS).sort();

export interface WorkerRecord {
  /** Hết hợp đồng lúc (ms). */
  contractUntil: number;
  /** Độ No tại `tickAt` (0..100, có phần lẻ). */
  belly: number;
  tickAt: number;
  /** Đồ thợ đang mặc (CRAFT_…) và hạn dùng (ms). Thiếu = không mặc. */
  gearId?: string | null;
  gearUntil?: number | null;
  /** Hết "Hăng Say" (Phụ Cấp Ngày Mùa) lúc (ms). Thiếu = không. */
  bonusUntil?: number | null;
}

export interface WorkersSave {
  region: RegionType;
  level: number;
  gold: number;
  pondMudCounter: number;
  inventory: Record<string, number>;
  tiles: FarmTileEntity[];
  workers: Record<string, WorkerRecord>;
  /** Số suất cơm trên Bàn Ăn Chung. */
  tableMeals: number;
  /** Giỏ Thợ: hàng thợ thu, chưa vào Kho. */
  pantry: Record<string, number>;
  /** Bộ đếm nhiệm vụ (Ch.6: HIRE:WORK_01, SERVE_MEAL). Thiếu = rỗng. */
  counters?: Counters;
}

export type WorkersResult = { ok: true; save: WorkersSave; message: string } | { ok: false; message: string };

const BY_ID = new Map(GAME_CATALOG.map((c) => [c.id, c]));
const fail = (message: string): WorkersResult => ({ ok: false, message });

export function contractCost(worker: CatalogItem): number {
  return Math.round(worker.buyCostGold * CONTRACT_DAYS * CONTRACT_DISCOUNT);
}

export function pantryTotal(pantry: Record<string, number>): number {
  return Object.values(pantry).reduce((a, b) => a + Math.max(0, b), 0);
}

export function mealPortions(dish: CatalogItem): number {
  return Math.max(1, Math.round(dish.staminaDelta / STAMINA_PER_MEAL));
}

/** Giai đoạn mở thợ = max(2, Đợt của thợ). */
export function workerStage(worker: CatalogItem): number {
  return Math.max(CRAFT_MIN_STAGE, worker.unlockWave ?? CRAFT_MIN_STAGE);
}

export function isWorking(rec: WorkerRecord | undefined, now: number): boolean {
  return !!rec && rec.contractUntil > now && rec.belly >= HUNGRY_BELLY;
}

/** Độ No hao trong [a, b] (đồ thợ còn hạn thì ×0,75). */
export function bellyDrain(rec: WorkerRecord, bellyPerDay: number, a: number, b: number): number {
  if (b <= a) return 0;
  const rate = bellyPerDay / DAY_MS;
  const gearEnd = Math.min(b, Math.max(a, rec.gearUntil ?? a));
  return rate * GEAR_BELLY_FACTOR * (gearEnd - a) + rate * (b - gearEnd);
}

/** Lúc Độ No chạm mức đói (35) nếu không ăn thêm. */
export function hungryTime(rec: WorkerRecord, bellyPerDay: number, start: number): number {
  const amount = rec.belly - HUNGRY_BELLY;
  if (amount <= 0) return start;
  const rate = bellyPerDay / DAY_MS;
  const gearEnd = Math.max(start, rec.gearUntil ?? start);
  const withGear = rate * GEAR_BELLY_FACTOR * (gearEnd - start);
  if (amount <= withGear) return start + amount / (rate * GEAR_BELLY_FACTOR);
  return gearEnd + (amount - withGear) / rate;
}

/** M05.1 — Thuê / gia hạn hợp đồng 3 ngày (trả trước). Gia hạn cộng nối vào hợp đồng đang chạy. */
export function hireWorker(save: WorkersSave, workerId: string, gameStage: number, now: number): WorkersResult {
  const worker = BY_ID.get(workerId);
  if (!worker || worker.category !== 'WORKER' || !WORKER_SPECS[workerId]) return fail('⚠️ Không có thợ này!');
  const stage = workerStage(worker);
  if (gameStage < stage) return fail(`🔒 [${worker.name}] về làng ở Giai đoạn ${stage}!`);
  if (save.level < worker.unlockLevel) return fail(`🔒 Cần đạt Cấp ${worker.unlockLevel} để thuê [${worker.name}]!`);
  const cost = contractCost(worker);
  if (save.gold < cost) return fail(`⚠️ Cần ${cost.toLocaleString()} 🪙 để trả lương 3 ngày cho [${worker.name}]!`);
  const ticked = tickWorkers(save, now);
  const old = ticked.workers[workerId];
  const rec: WorkerRecord = old
    ? { ...old, contractUntil: Math.max(now, old.contractUntil) + CONTRACT_DAYS * DAY_MS }
    : { contractUntil: now + CONTRACT_DAYS * DAY_MS, belly: MAX_BELLY, tickAt: now };
  return {
    ok: true,
    save: {
      ...ticked,
      gold: ticked.gold - cost,
      workers: { ...ticked.workers, [workerId]: rec },
      counters: bumpCounter(ticked.counters, COUNTER.hire(workerId)),
    },
    message: `🪙 Đã trả lương 3 ngày (-${cost.toLocaleString()} 🪙, rẻ hơn 12%) cho [${worker.emoji} ${worker.name}]!`,
  };
}

/** M05.3 — Cấp 1 đồ thợ trong Kho cho thợ đang làm: 72 giờ Độ No hao chậm 25% (thay đồ cũ). */
export function equipGear(save: WorkersSave, workerId: string, gearId: string, gameStage: number, now: number): WorkersResult {
  if (gameStage < CRAFT_MIN_STAGE) return fail(`🔒 Lán Thợ mở ở Giai đoạn ${CRAFT_MIN_STAGE}!`);
  const gear = BY_ID.get(gearId);
  if (!gear || gear.category !== 'CRAFT_GEAR') return fail('⚠️ Đây không phải đồ bảo hộ cho thợ!');
  const have = save.inventory[gearId] ?? 0;
  if (have < 1) return fail(`⚠️ Kho chưa có [${gear.name}]! Làm ở Xưởng Đan Lát / Khung Cửi trước nhé.`);
  const ticked = tickWorkers(save, now);
  const rec = ticked.workers[workerId];
  if (!rec || rec.contractUntil <= now) return fail('👷 Hãy thuê / gia hạn thợ này trước khi cấp đồ!');
  return {
    ok: true,
    save: {
      ...ticked,
      inventory: { ...ticked.inventory, [gearId]: have - 1 },
      workers: { ...ticked.workers, [workerId]: { ...rec, gearId, gearUntil: now + GEAR_MS } },
      counters: bumpCounter(ticked.counters, COUNTER.EQUIP_GEAR),
    },
    message: `👕 Đã cấp [${gear.emoji} ${gear.name}]: 72 giờ Độ No hao chậm 25%!`,
  };
}

/** M05.3 — Phụ Cấp Ngày Mùa: −300🪙, thợ đang làm "Hăng Say" 24 giờ (thay mốc cũ, không cộng dồn). */
export function giveBonus(save: WorkersSave, workerId: string, gameStage: number, now: number): WorkersResult {
  if (gameStage < CRAFT_MIN_STAGE) return fail(`🔒 Lán Thợ mở ở Giai đoạn ${CRAFT_MIN_STAGE}!`);
  if (save.gold < BONUS_GOLD) return fail(`⚠️ Cần ${BONUS_GOLD} 🪙 để thưởng Phụ Cấp Ngày Mùa!`);
  const ticked = tickWorkers(save, now);
  const rec = ticked.workers[workerId];
  if (!rec || rec.contractUntil <= now) return fail('👷 Hãy thuê / gia hạn thợ này trước khi thưởng!');
  return {
    ok: true,
    save: {
      ...ticked,
      gold: ticked.gold - BONUS_GOLD,
      workers: { ...ticked.workers, [workerId]: { ...rec, bonusUntil: now + BONUS_MS } },
    },
    message: `🧧 Đã thưởng Phụ Cấp Ngày Mùa (-${BONUS_GOLD} 🪙): 24 giờ Hăng Say — tưới cắt 25% thời gian chờ!`,
  };
}

/** M05.2 — Dọn 1 món Bếp Quê từ Kho lên Bàn Ăn Chung. */
export function serveLodgeMeal(save: WorkersSave, dishId: string, gameStage: number): WorkersResult {
  if (gameStage < CRAFT_MIN_STAGE) return fail(`🔒 Lán Thợ mở ở Giai đoạn ${CRAFT_MIN_STAGE}!`);
  const dish = BY_ID.get(dishId);
  if (!dish || dish.category !== 'RECIPE' || dish.staminaDelta <= 0) return fail('⚠️ Chỉ dọn được món ăn Bếp Quê lên Bàn Ăn!');
  const have = save.inventory[dishId] ?? 0;
  if (have < 1) return fail(`⚠️ Kho không còn [${dish.name}]! Nấu ở Bếp Quê trước nhé.`);
  const portions = mealPortions(dish);
  return {
    ok: true,
    save: {
      ...save,
      inventory: { ...save.inventory, [dishId]: have - 1 },
      tableMeals: save.tableMeals + portions,
      counters: bumpCounter(save.counters, COUNTER.SERVE_MEAL),
    },
    message: `🍚 Đã dọn [${dish.emoji} ${dish.name}] lên Bàn Ăn Lán Thợ: +${portions} suất (đang có ${save.tableMeals + portions})`,
  };
}

/** M05.4 — Thu toàn bộ Giỏ Thợ về Kho (không quy ra vàng). */
export function claimPantry(save: WorkersSave): WorkersResult {
  const total = pantryTotal(save.pantry);
  if (total <= 0) return fail('🧺 Giỏ Thợ đang trống!');
  const inventory = { ...save.inventory };
  for (const [id, n] of Object.entries(save.pantry)) if (n > 0) inventory[id] = (inventory[id] ?? 0) + n;
  return { ok: true, save: { ...save, inventory, pantry: {} }, message: `📥 Đã thu ${total} món từ Giỏ Thợ về Kho!` };
}

/**
 * M05.5 — Tính lười: thợ làm việc từ `tickAt` tới `now`.
 * 1. Độ No hao tuyến tính; thợ làm tới min(hết hợp đồng, lúc Độ No chạm 35, now).
 * 2. Thu mọi lứa đã chín ≥ 5 phút trong khoảng làm việc (vật nuôi nhiều lứa: lứa mới bắt đầu lúc thu).
 *    Giỏ không đủ chỗ cho cả lứa thì bỏ qua (để chủ tự thu).
 * 3. Đói (< 35) thì ăn ở Bàn Ăn tới ≥ 85.
 * 4. Thợ còn làm lúc `now`: tưới ô chưa tưới, chưa chín.
 */
export function tickWorkers(save: WorkersSave, now: number): WorkersSave {
  let tiles = save.tiles;
  let pantry = save.pantry;
  let pantryUsed = pantryTotal(pantry);
  let tableMeals = save.tableMeals;
  let pondMudCounter = save.pondMudCounter;
  const workers: Record<string, WorkerRecord> = { ...save.workers };

  for (const id of WORKER_ORDER) {
    const rec = workers[id];
    const spec = WORKER_SPECS[id];
    if (!rec || !spec) continue;
    const start = Math.min(rec.tickAt, now);
    const activeUntil = Math.min(rec.contractUntil, hungryTime(rec, spec.bellyPerDay, start), now);

    tiles = tiles.map((tile) => {
      let t = tile;
      // Lặp cho vật nuôi nhiều lứa; cây trồng tối đa 1 lần.
      while (t.itemId && t.matureAt !== null && t.matureAt + HARVEST_GRACE_MS <= activeUntil) {
        const item = BY_ID.get(t.itemId);
        if (!item || !spec.categories.includes(item.category)) break;
        const qty = harvestQty(item, t, save.region);
        if (pantryUsed + qty > PANTRY_CAP) break;
        const at = t.matureAt + HARVEST_GRACE_MS;
        pantry = { ...pantry, [item.id]: (pantry[item.id] ?? 0) + qty };
        pantryUsed += qty;
        pondMudCounter = pondMudAfterHarvest(item, t, pondMudCounter);
        t = tileAfterHarvest(t, item, save.region, at);
      }
      return t;
    });

    let belly = Math.max(0, rec.belly - bellyDrain(rec, spec.bellyPerDay, start, now));
    if (belly < HUNGRY_BELLY) {
      while (belly < EAT_UNTIL_BELLY && tableMeals > 0) {
        belly = Math.min(MAX_BELLY, belly + BELLY_PER_MEAL);
        tableMeals -= 1;
      }
    }
    const next: WorkerRecord = { ...rec, belly, tickAt: now };
    workers[id] = next;

    if (isWorking(next, now)) {
      tiles = tiles.map((t) => {
        const item = t.itemId ? BY_ID.get(t.itemId) : undefined;
        if (!item || !spec.categories.includes(item.category) || t.watered || t.matureAt === null || now >= t.matureAt) return t;
        const cut = (next.bonusUntil ?? 0) > now ? BONUS_WATER_CUT : WATER_TIME_CUT;
        return { ...t, watered: true, matureAt: t.matureAt - Math.floor((t.matureAt - now) * cut) };
      });
    }
  }

  return { ...save, tiles, pantry, tableMeals, pondMudCounter, workers };
}
