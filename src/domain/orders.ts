/**
 * GP-40 / KT-14 (QD-87) — bảng đơn HTX của bản thử: luôn có ORDER_SLOTS đơn, mỗi đơn 1–3 loại hàng
 * đã mở và đúng mùa; thưởng vàng + XP nhân hệ số theo số loại; bỏ đơn thì chờ một khoảng mới có đơn mới.
 * Hàm thuần: `now`, `rng` truyền vào; engine (ADR-001) gọi, client và Edge Function dùng chung.
 */
import { GAME_CATALOG } from '../data/masterData';
import type { CatalogItem, Season } from '../data/types';
import { CROP_SEASONS } from '../data/seasons';
import { SLICE_CROPS, SLICE_KITCHEN_ID, SLICE_LIVESTOCK, SLICE_AQUA, SLICE_RECIPES, sliceUnlockLevel } from '../data/sliceContent';
import type { FarmResult, FarmSave } from './farm';
import { applyXp } from './progression';
import { canSowInSeason } from './season';

/** Số đơn trên bảng. */
export const ORDER_SLOTS = 3;
/** Hệ số thưởng theo số loại hàng trong đơn: 1 / 2 / 3 loại (KT-14). */
export const ORDER_FACTOR: readonly number[] = [1.2, 1.35, 1.5];
/** Số lượng mỗi dòng [ít nhất, nhiều nhất] theo nhóm hàng. */
export const ORDER_QTY = { CROP: [3, 6], ANIMAL: [1, 3], DISH: [1, 1] } as const;
/** Bỏ đơn: chỗ đó trống ngần này rồi mới có đơn mới. */
export const ORDER_SKIP_COOLDOWN_MS = 10 * 60_000;

export interface OrderLine {
  itemId: string;
  qty: number;
}

export interface Order {
  /** Số thứ tự đơn trong bản lưu (tăng dần). */
  id: number;
  lines: OrderLine[];
  gold: number;
  xp: number;
}

export interface OrderBoard {
  slots: (Order | null)[];
  /** Mốc (ms) chỗ trống được nhận đơn mới; 0 = nhận ngay. */
  readyAt: number[];
  /** Số đơn đã tạo. */
  seq: number;
}

const BY_ID = new Map(GAME_CATALOG.map((c) => [c.id, c]));
const fail = (message: string): FarmResult => ({ ok: false, message });

export const emptyBoard = (): OrderBoard => ({ slots: Array(ORDER_SLOTS).fill(null), readyAt: Array(ORDER_SLOTS).fill(0), seq: 0 });

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Đọc bảng đơn; bản lưu cũ hoặc hỏng → bảng trống. */
export function boardOf(save: Pick<FarmSave, 'orders'>): OrderBoard {
  const b = save.orders;
  if (!isObj(b) || !Array.isArray(b.slots) || !Array.isArray(b.readyAt) || typeof b.seq !== 'number') return emptyBoard();
  const base = emptyBoard();
  return {
    seq: b.seq,
    readyAt: base.readyAt.map((_, i) => (typeof b.readyAt[i] === 'number' ? b.readyAt[i] : 0)),
    slots: base.slots.map((_, i) => {
      const o = b.slots[i];
      return isObj(o) && Array.isArray(o.lines) && typeof o.gold === 'number' && typeof o.xp === 'number' ? (o as Order) : null;
    }),
  };
}

type Group = keyof typeof ORDER_QTY;
const groupOf = (item: CatalogItem): Group =>
  item.category === 'CROP' ? 'CROP' : item.category === 'RECIPE' ? 'DISH' : 'ANIMAL';

/**
 * Hàng đơn có thể đòi (GP-40): cây đủ cấp và gieo được trong mùa; vật nuôi, cá đủ cấp;
 * món ăn khi đã có Bếp Củi, đủ cấp và đã biết công thức.
 */
export function orderPool(save: FarmSave, season: Season): string[] {
  const lvl = (id: string) => {
    const it = BY_ID.get(id);
    return it ? sliceUnlockLevel(it) <= save.level : false;
  };
  const crops = SLICE_CROPS.filter((id) => lvl(id) && canSowInSeason(CROP_SEASONS[id], season));
  const animals = [...SLICE_LIVESTOCK, ...SLICE_AQUA].filter(lvl);
  const kitchen = !!save.machines?.[SLICE_KITCHEN_ID];
  const known = save.discoveredRecipes ?? [];
  const dishes = kitchen ? SLICE_RECIPES.filter((id) => lvl(id) && (id === SLICE_RECIPES[0] || known.includes(id))) : [];
  return [...crops, ...animals, ...dishes];
}

const between = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

/** Tạo 1 đơn từ `pool` (khác rỗng): 1–3 loại khác nhau, thưởng = Σ(giá bán × sl) × hệ số; XP = Σ(XP × sl) × hệ số. */
export function makeOrder(pool: readonly string[], rng: () => number, id: number): Order {
  const left = [...pool];
  const n = between(rng, 1, Math.min(ORDER_FACTOR.length, left.length));
  const lines: OrderLine[] = [];
  for (let i = 0; i < n; i++) {
    const itemId = left.splice(Math.floor(rng() * left.length), 1)[0];
    const item = BY_ID.get(itemId) as CatalogItem;
    const [lo, hi] = ORDER_QTY[groupOf(item)];
    lines.push({ itemId, qty: between(rng, lo, hi) });
  }
  const k = ORDER_FACTOR[n - 1];
  const sum = (f: (it: CatalogItem) => number) => lines.reduce((a, l) => a + f(BY_ID.get(l.itemId) as CatalogItem) * l.qty, 0);
  return { id, lines, gold: Math.round(sum((it) => it.baseSellGold) * k), xp: Math.round(sum((it) => it.xpReward) * k) };
}

/** Lấp các chỗ trống đã hết thời gian chờ bằng đơn mới. Không có gì để đòi thì để trống. */
export function refreshOrders(save: FarmSave, season: Season, now: number, rng: () => number): FarmResult {
  const board = boardOf(save);
  const pool = orderPool(save, season);
  let { seq } = board;
  let added = 0;
  const slots = board.slots.map((o, i) => {
    if (o || now < board.readyAt[i] || !pool.length) return o;
    added++;
    return makeOrder(pool, rng, ++seq);
  });
  if (!added) return fail(pool.length ? '📋 Chưa có đơn mới.' : '📋 Chưa có hàng nào để HTX đặt — trồng thêm hoặc lên cấp.');
  return { ok: true, save: { ...save, orders: { slots, readyAt: board.readyAt.map((t, i) => (slots[i] && !board.slots[i] ? 0 : t)), seq } }, message: `📋 HTX gửi ${added} đơn mới.` };
}

const nameOf = (id: string) => {
  const it = BY_ID.get(id);
  return it ? `${it.emoji} ${it.name}` : id;
};

/** Giao đơn: đủ hàng thì trừ Kho, cộng vàng + XP, chỗ đó có đơn mới ngay (0⚡, KT-20). */
export function deliverOrder(save: FarmSave, slot: number, season: Season, rng: () => number): FarmResult {
  const board = boardOf(save);
  const order = board.slots[slot];
  if (!order) return fail('📋 Chỗ này chưa có đơn!');
  const missing = order.lines.filter((l) => (save.inventory[l.itemId] ?? 0) < l.qty);
  if (missing.length) {
    return fail(`🧺 Còn thiếu: ${missing.map((l) => `${l.qty - (save.inventory[l.itemId] ?? 0)} ${nameOf(l.itemId)}`).join(', ')}`);
  }
  const inventory = { ...save.inventory };
  for (const l of order.lines) inventory[l.itemId] -= l.qty;
  const p = applyXp(save.level, save.xp, order.xp);
  const paid: FarmSave = { ...save, inventory, gold: save.gold + order.gold, level: p.level, xp: p.xp };
  const pool = orderPool(paid, season);
  let { seq } = board;
  const slots = board.slots.map((o, i) => (i === slot ? (pool.length ? makeOrder(pool, rng, ++seq) : null) : o));
  return {
    ok: true,
    save: { ...paid, orders: { slots, readyAt: board.readyAt.map((t, i) => (i === slot ? 0 : t)), seq } },
    message: `📦 Giao đơn HTX: +${order.gold} 🪙, +${order.xp} XP${p.levelsGained > 0 ? ` — 🎉 LÊN CẤP ${p.level}!` : ''}`,
  };
}

/** Bỏ đơn: chỗ đó trống ORDER_SKIP_COOLDOWN_MS rồi mới có đơn mới. */
export function skipOrder(save: FarmSave, slot: number, now: number): FarmResult {
  const board = boardOf(save);
  if (!board.slots[slot]) return fail('📋 Chỗ này chưa có đơn!');
  return {
    ok: true,
    save: {
      ...save,
      orders: {
        ...board,
        slots: board.slots.map((o, i) => (i === slot ? null : o)),
        readyAt: board.readyAt.map((t, i) => (i === slot ? now + ORDER_SKIP_COOLDOWN_MS : t)),
      },
    },
    message: `📋 Đã bỏ đơn — ${ORDER_SKIP_COOLDOWN_MS / 60_000} phút nữa HTX gửi đơn khác.`,
  };
}
