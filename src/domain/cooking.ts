import { GAME_CATALOG } from '../data/masterData';
import { CatalogItem, RecipeIngredient, RegionType } from '../data/types';
import { CRAFT_MIN_STAGE, applyXp, canCraftOrBuy, maxUnlockedWave } from './progression';
import { regenStamina } from './stamina';
import { COUNTER, Counters, bumpCounter } from './quests';

/**
 * Bếp Quê & Xưởng (S4 — M04.1..M04.3), dạng hàm thuần. Đặc tả + quyết định PO: `17` mục C2.
 * Bản sao trên server: supabase/migrations/0009_kitchen.sql (rpc_build_machine, rpc_start_craft,
 * rpc_collect_craft, rpc_eat_dish, rpc_cook_pot). Sửa luật ở đây thì sửa cả SQL + test 2 phía.
 */

/** 3 xưởng ăn uống mở ở S4. */
export const KITCHEN_MACHINE_IDS: readonly string[] = ['MAC_02', 'MAC_03', 'MAC_04'];
/** 2 xưởng nghề làm đồ thợ (S5d): Đan Lát `MAC_07`, Khung Cửi `MAC_08`. Công thức biết sẵn, không cần Nồi Đất. */
export const CRAFT_MACHINE_IDS: readonly string[] = ['MAC_07', 'MAC_08'];
/** Mọi xưởng xây được. `MAC_01` Cối Xay Cám hoãn tới khi có luật cho vật nuôi ăn cám (`17` C3). */
export const WORKSHOP_MACHINE_IDS: readonly string[] = [...KITCHEN_MACHINE_IDS, ...CRAFT_MACHINE_IDS];
/** Nồi Đất nằm trong Bếp Củi. */
export const POT_MACHINE_ID = 'MAC_02';
/** Món mở sẵn để người chơi biết cách nấu (PO chốt). */
export const STARTER_RECIPE_ID = 'PROD_01';
/** Tổng số nguyên liệu tối đa bỏ vào Nồi Đất (tính cả số lượng). */
export const POT_MAX_INGREDIENTS = 4;
/** Thưởng lần đầu khám phá mỗi món (`docs_archive_merged/v1-2026-11-10/12_PLAN` M04.2). */
export const DISCOVER_GEMS = 10;
export const DISCOVER_XP = 50;
/** Buff "Nắng Gió Cao Nguyên" (miền Trung): −10% thời gian chế biến (`01` mục 2.1). */
export const CENTRAL_CRAFT_TIME_FACTOR = 0.9;

export interface MachineState {
  /** Món đang nấu; null = xưởng rảnh. */
  craftItemId: string | null;
  /** Mốc xong (ms). */
  readyAt: number | null;
}

/** Phần trạng thái game mà luật Bếp đọc/ghi. */
export interface KitchenSave {
  region: RegionType;
  level: number;
  xp: number;
  gold: number;
  gems: number;
  stamina: number;
  maxStamina: number;
  staminaUpdatedAt: number;
  inventory: Record<string, number>;
  /** Xưởng đã xây, theo mã MAC_. */
  machines: Record<string, MachineState>;
  /** Món đã khám phá ở Nồi Đất (không gồm món mở sẵn). */
  discoveredRecipes: string[];
  /** Bộ đếm nhiệm vụ (Ch.3: BUILD:MAC_02, COOK). Thiếu = rỗng. */
  counters?: Counters;
}

export type KitchenResult = { ok: true; save: KitchenSave; message: string } | { ok: false; message: string };

const BY_ID = new Map(GAME_CATALOG.map((c) => [c.id, c]));
const fail = (message: string): KitchenResult => ({ ok: false, message });

export function kitchenItem(id: string): CatalogItem | undefined {
  return BY_ID.get(id);
}

/** Các món nấu được ở 3 xưởng S4, theo thứ tự catalog. */
export const KITCHEN_RECIPES: readonly CatalogItem[] = GAME_CATALOG.filter(
  (c) => c.category === 'RECIPE' && !!c.recipe && !!c.machineId && KITCHEN_MACHINE_IDS.includes(c.machineId)
);

/** Đồ thợ ở xưởng nghề (S5d), theo thứ tự catalog. */
export const CRAFT_RECIPES: readonly CatalogItem[] = GAME_CATALOG.filter(
  (c) => c.category === 'CRAFT_GEAR' && !!c.recipe && !!c.machineId && CRAFT_MACHINE_IDS.includes(c.machineId)
);

/** Món đã biết công thức: Cơm Trắng mở sẵn, đồ thợ biết sẵn, còn lại phải khám phá ở Nồi Đất. */
export function isRecipeDiscovered(save: Pick<KitchenSave, 'discoveredRecipes'>, productId: string): boolean {
  return (
    productId === STARTER_RECIPE_ID ||
    BY_ID.get(productId)?.category === 'CRAFT_GEAR' ||
    save.discoveredRecipes.includes(productId)
  );
}

export type RecipeLock =
  | { ok: true }
  | { ok: false; reason: 'NOT_RECIPE' | 'LEVEL_LOCKED' }
  | { ok: false; reason: 'STAGE_LOCKED'; stage: number }
  /** Có nguyên liệu thuộc Đợt chưa mở (vd Cà Phê Muối cần Cà Phê Đợt 4). */
  | { ok: false; reason: 'INGREDIENT_LOCKED'; itemId: string; wave: number };

/** Món có nấu được ở Giai đoạn / cấp hiện tại không (chưa xét kho và khám phá). */
export function recipeLock(item: CatalogItem, level: number, gameStage: number): RecipeLock {
  if ((item.category !== 'RECIPE' && item.category !== 'CRAFT_GEAR') || !item.recipe || !item.machineId) {
    return { ok: false, reason: 'NOT_RECIPE' };
  }
  const lock = canCraftOrBuy(item, level, gameStage);
  if (!lock.ok) {
    if (lock.reason === 'STAGE_LOCKED') return { ok: false, reason: 'STAGE_LOCKED', stage: lock.stage };
    return { ok: false, reason: 'LEVEL_LOCKED' };
  }
  const openWave = maxUnlockedWave(gameStage);
  for (const ing of item.recipe) {
    const wave = BY_ID.get(ing.itemId)?.unlockWave ?? 99;
    if (wave > openWave) return { ok: false, reason: 'INGREDIENT_LOCKED', itemId: ing.itemId, wave };
  }
  return { ok: true };
}

/** Nguyên liệu còn thiếu trong Kho (rỗng = đủ). */
export function missingIngredients(inventory: Record<string, number>, recipe: readonly RecipeIngredient[]): RecipeIngredient[] {
  return recipe
    .map((r) => ({ itemId: r.itemId, qty: r.qty - (inventory[r.itemId] ?? 0) }))
    .filter((r) => r.qty > 0);
}

/** Thời gian nấu (ms), miền Trung nhanh hơn 10%. */
export function craftDurationMs(item: CatalogItem, region: RegionType): number {
  const factor = region === 'CENTRAL' ? CENTRAL_CRAFT_TIME_FACTOR : 1;
  return Math.round(item.growOrCraftMinutes * 60_000 * factor);
}

function nameOf(id: string): string {
  const it = BY_ID.get(id);
  return it ? `${it.emoji} ${it.name}` : id;
}

function withXp(save: KitchenSave, gain: number): { save: KitchenSave; levelUp: string } {
  const p = applyXp(save.level, save.xp, gain);
  return {
    save: { ...save, level: p.level, xp: p.xp },
    levelUp: p.levelsGained > 0 ? ` — 🎉 LÊN CẤP ${p.level}!` : '',
  };
}

/** M04.1 — Xây 1 xưởng ăn uống (mỗi xưởng 1 lần). */
export function buildMachine(save: KitchenSave, machineId: string, gameStage: number): KitchenResult {
  const item = BY_ID.get(machineId);
  if (!item || item.category !== 'MACHINE') return fail('⚠️ Không có xưởng này!');
  if (!WORKSHOP_MACHINE_IDS.includes(machineId)) return fail(`🛖 [${item.name}] mở ở bản sau!`);
  const lock = canCraftOrBuy(item, save.level, gameStage);
  if (!lock.ok) {
    return fail(
      lock.reason === 'STAGE_LOCKED'
        ? `🔒 Bếp Quê & Xưởng mở ở Giai đoạn ${lock.stage}!`
        : `🔒 Cần đạt Cấp ${item.unlockLevel} để xây [${item.name}]!`
    );
  }
  if (save.machines[machineId]) return fail(`🏭 Đã có [${item.name}] rồi!`);
  if (save.gold < item.buyCostGold) return fail(`⚠️ Cần ${item.buyCostGold.toLocaleString()} 🪙 để xây [${item.name}]!`);
  const paid: KitchenSave = {
    ...save,
    gold: save.gold - item.buyCostGold,
    machines: { ...save.machines, [machineId]: { craftItemId: null, readyAt: null } },
    counters: bumpCounter(save.counters, COUNTER.build(machineId)),
  };
  const { save: next, levelUp } = withXp(paid, item.xpReward);
  return {
    ok: true,
    save: next,
    message: `🏭 Đã xây [${item.emoji} ${item.name}] (-${item.buyCostGold.toLocaleString()} 🪙, +${item.xpReward} XP)${levelUp}`,
  };
}

/** M04.3 — Bắt đầu nấu 1 món ở xưởng (trừ nguyên liệu, 0⚡). */
export function startCraft(
  save: KitchenSave,
  machineId: string,
  productId: string,
  gameStage: number,
  now: number
): KitchenResult {
  const machine = save.machines[machineId];
  if (!machine) return fail('🏭 Hãy xây xưởng này trước!');
  if (machine.craftItemId) return fail(`⏳ Xưởng đang nấu [${nameOf(machine.craftItemId)}]!`);
  const item = BY_ID.get(productId);
  if (!item || item.machineId !== machineId) return fail('⚠️ Món này không nấu ở xưởng này!');
  const lock = recipeLock(item, save.level, gameStage);
  if (!lock.ok) {
    if (lock.reason === 'INGREDIENT_LOCKED') return fail(`🔒 Cần [${nameOf(lock.itemId)}] — mở ở Đợt ${lock.wave}!`);
    if (lock.reason === 'STAGE_LOCKED') return fail(`🔒 Món này mở ở Giai đoạn ${lock.stage}!`);
    return fail(`🔒 Cần đạt Cấp ${item.unlockLevel} để nấu [${item.name}]!`);
  }
  if (!isRecipeDiscovered(save, productId)) return fail('📖 Chưa biết công thức! Hãy thử phối món ở Nồi Đất trước.');
  const missing = missingIngredients(save.inventory, item.recipe ?? []);
  if (missing.length) {
    return fail(`🧺 Còn thiếu: ${missing.map((m) => `${m.qty} ${nameOf(m.itemId)}`).join(', ')}`);
  }
  const inventory = { ...save.inventory };
  for (const r of item.recipe ?? []) inventory[r.itemId] = (inventory[r.itemId] ?? 0) - r.qty;
  const readyAt = now + craftDurationMs(item, save.region);
  return {
    ok: true,
    save: { ...save, inventory, machines: { ...save.machines, [machineId]: { craftItemId: productId, readyAt } } },
    message: `🔥 Đang nấu [${item.emoji} ${item.name}] — xong sau ${Math.ceil((readyAt - now) / 60_000)} phút`,
  };
}

/** Lấy món đã nấu xong vào Kho. */
export function collectCraft(save: KitchenSave, machineId: string, now: number): KitchenResult {
  const machine = save.machines[machineId];
  if (!machine?.craftItemId || machine.readyAt === null) return fail('🍲 Xưởng chưa nấu món nào!');
  if (now < machine.readyAt) {
    return fail(`⏳ Còn ${Math.ceil((machine.readyAt - now) / 60_000)} phút nữa mới xong!`);
  }
  const item = BY_ID.get(machine.craftItemId);
  if (!item) return fail('⚠️ Món không có trong danh mục!');
  const collected: KitchenSave = {
    ...save,
    inventory: { ...save.inventory, [item.id]: (save.inventory[item.id] ?? 0) + 1 },
    machines: { ...save.machines, [machineId]: { craftItemId: null, readyAt: null } },
    counters: bumpCounter(save.counters, COUNTER.COOK),
  };
  const { save: next, levelUp } = withXp(collected, item.xpReward);
  return { ok: true, save: next, message: `🍽️ Đã nấu xong [${item.emoji} ${item.name}]: +1 vào Kho, +${item.xpReward} XP${levelUp}` };
}

/** Ăn 1 món trong Kho để hồi ⚡ (không vượt trần; ⚡ đầy thì không cho ăn để khỏi phí món). */
export function eatDish(save: KitchenSave, productId: string, gameStage: number, now: number): KitchenResult {
  if (gameStage < CRAFT_MIN_STAGE) return fail(`🔒 Bếp Quê mở ở Giai đoạn ${CRAFT_MIN_STAGE}!`);
  const item = BY_ID.get(productId);
  if (!item || item.category !== 'RECIPE' || item.staminaDelta <= 0) return fail('⚠️ Món này không ăn được!');
  const have = save.inventory[productId] ?? 0;
  if (have < 1) return fail(`⚠️ Kho không còn [${item.name}]!`);
  const r = regenStamina(save.stamina, save.maxStamina, save.staminaUpdatedAt, now);
  if (r.stamina >= save.maxStamina) return fail('⚡ Năng lượng đang đầy, để dành món ăn sau nhé!');
  const stamina = Math.min(save.maxStamina, r.stamina + item.staminaDelta);
  return {
    ok: true,
    save: {
      ...save,
      stamina,
      staminaUpdatedAt: stamina >= save.maxStamina ? now : r.updatedAt,
      inventory: { ...save.inventory, [productId]: have - 1 },
    },
    message: `😋 Đã ăn [${item.emoji} ${item.name}]: +${stamina - r.stamina} ⚡`,
  };
}

/** Đếm nguyên liệu theo ID (bỏ ô trống). */
function countIds(ids: readonly string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const id of ids) if (id) m.set(id, (m.get(id) ?? 0) + 1);
  return m;
}

function sameMultiset(a: Map<string, number>, recipe: readonly RecipeIngredient[]): boolean {
  if (a.size !== recipe.length) return false;
  return recipe.every((r) => a.get(r.itemId) === r.qty);
}

function isSubMultiset(a: Map<string, number>, recipe: readonly RecipeIngredient[]): boolean {
  for (const [id, n] of a) {
    const need = recipe.find((r) => r.itemId === id)?.qty ?? 0;
    if (n > need) return false;
  }
  return true;
}

/**
 * M04.2 — Nồi Đất: thử 1–4 nguyên liệu đang có trong Kho. Khớp đúng 1 công thức chưa khám phá
 * (đã mở Đợt, đủ cấp) thì mở công thức + thưởng lần đầu. Nguyên liệu KHÔNG bị tiêu.
 */
export function discoverRecipe(save: KitchenSave, ingredientIds: readonly string[], gameStage: number): KitchenResult {
  if (gameStage < CRAFT_MIN_STAGE) return fail(`🔒 Bếp Quê mở ở Giai đoạn ${CRAFT_MIN_STAGE}!`);
  if (!save.machines[POT_MACHINE_ID]) return fail('🍲 Hãy xây Bếp Củi (có Nồi Đất) trước!');
  const picked = countIds(ingredientIds);
  const total = [...picked.values()].reduce((a, b) => a + b, 0);
  if (total < 1 || total > POT_MAX_INGREDIENTS) return fail(`🍲 Bỏ từ 1 đến ${POT_MAX_INGREDIENTS} nguyên liệu vào Nồi Đất!`);
  for (const [id, n] of picked) {
    if ((save.inventory[id] ?? 0) < n) return fail(`🧺 Kho không đủ ${n} ${nameOf(id)}!`);
  }
  const open = KITCHEN_RECIPES.filter((r) => recipeLock(r, save.level, gameStage).ok);
  const match = open.find((r) => sameMultiset(picked, r.recipe ?? []));
  if (match) {
    if (isRecipeDiscovered(save, match.id)) return fail(`📖 Đã biết món [${match.emoji} ${match.name}] rồi — nấu ở Sổ Tay nhé!`);
    const found: KitchenSave = {
      ...save,
      gems: save.gems + DISCOVER_GEMS,
      discoveredRecipes: [...save.discoveredRecipes, match.id],
    };
    const { save: next, levelUp } = withXp(found, DISCOVER_XP);
    return {
      ok: true,
      save: next,
      message: `🎉 KHÁM PHÁ MÓN MỚI: [${match.emoji} ${match.name}]! +${DISCOVER_GEMS} 💎, +${DISCOVER_XP} XP${levelUp}`,
    };
  }
  const close = open.some((r) => !isRecipeDiscovered(save, r.id) && isSubMultiset(picked, r.recipe ?? []));
  return fail(close ? '🍲 Có mùi rồi! Thêm nguyên liệu nữa thử xem.' : '🍲 Chưa thành món. Xem gợi ý trong Sổ Tay nhé!');
}

/** Gợi ý cho món chưa khám phá: 1 nguyên liệu đầu + tổng số nguyên liệu. */
export function recipeHint(item: CatalogItem): { firstItemId: string | null; totalQty: number } {
  const recipe = item.recipe ?? [];
  return { firstItemId: recipe[0]?.itemId ?? null, totalQty: recipe.reduce((a, r) => a + r.qty, 0) };
}
