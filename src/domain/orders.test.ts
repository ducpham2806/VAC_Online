import { describe, expect, it } from 'vitest';
import { GAME_CATALOG } from '../data/masterData';
import type { FarmSave } from './farm';
import {
  ORDER_FACTOR,
  ORDER_QTY,
  ORDER_SKIP_COOLDOWN_MS,
  ORDER_SLOTS,
  type OrderBoard,
  boardOf,
  deliverOrder,
  emptyBoard,
  makeOrder,
  orderPool,
  refreshOrders,
  skipOrder,
} from './orders';
import { newSliceSave } from '../game/slice/sliceSave';

const NOW = 1_800_000_000_000;
const fresh = (patch: Partial<FarmSave> = {}): FarmSave => ({ ...newSliceSave(NOW), ...patch });
/** rng lặp lại một dãy cố định để test xác định. */
const seq = (...xs: number[]) => {
  let i = 0;
  return () => xs[i++ % xs.length];
};
const ok = (r: ReturnType<typeof refreshOrders>) => {
  if (!r.ok) throw new Error(r.message);
  return r.save;
};
const item = (id: string) => GAME_CATALOG.find((c) => c.id === id)!;

describe('KT-14 bảng đơn HTX (QD-87)', () => {
  it('bản lưu cũ / hỏng → bảng trống 3 chỗ', () => {
    expect(boardOf({})).toEqual(emptyBoard());
    expect(boardOf({ orders: { slots: 'x' } as unknown as OrderBoard })).toEqual(emptyBoard());
    expect(emptyBoard().slots).toHaveLength(ORDER_SLOTS);
  });

  it('hàng đơn đòi: chỉ loài đã mở cấp (KT-21) và đúng mùa; món khi có Bếp và đã biết công thức', () => {
    expect(orderPool(fresh(), 'XUAN')).toEqual(['CROP_01']);
    expect(orderPool(fresh(), 'DONG')).toEqual([]); // Lv1 mùa Đông: chưa có gì để đòi
    expect(orderPool(fresh({ level: 3 }), 'HA')).toEqual(['CROP_01', 'CROP_02', 'ANI_01', 'AQUA_01']);
    const kitchen = { MAC_02: { craftItemId: null, readyAt: null } };
    expect(orderPool(fresh({ level: 4, machines: kitchen }), 'XUAN')).toContain('PROD_01');
    expect(orderPool(fresh({ level: 4, machines: kitchen }), 'XUAN')).not.toContain('PROD_03');
    expect(orderPool(fresh({ level: 4, machines: kitchen, discoveredRecipes: ['PROD_03'] }), 'XUAN')).toContain('PROD_03');
    expect(orderPool(fresh({ level: 5 }), 'XUAN')).toContain('ANI_03');
  });

  it('một đơn: 1–3 loại khác nhau, số lượng theo nhóm, thưởng = Σ(giá × sl) × hệ số theo số loại', () => {
    const pool = ['CROP_01', 'ANI_01', 'PROD_01'];
    const o = makeOrder(pool, seq(0.99, 0, 0.99, 0, 0.5, 0), 7);
    expect(o.id).toBe(7);
    expect(o.lines.map((l) => l.itemId).sort()).toEqual([...pool].sort());
    for (const l of o.lines) {
      const g = l.itemId.startsWith('CROP_') ? ORDER_QTY.CROP : l.itemId.startsWith('PROD_') ? ORDER_QTY.DISH : ORDER_QTY.ANIMAL;
      expect(l.qty).toBeGreaterThanOrEqual(g[0]);
      expect(l.qty).toBeLessThanOrEqual(g[1]);
    }
    const k = ORDER_FACTOR[2];
    expect(o.gold).toBe(Math.round(o.lines.reduce((a, l) => a + item(l.itemId).baseSellGold * l.qty, 0) * k));
    expect(o.xp).toBe(Math.round(o.lines.reduce((a, l) => a + item(l.itemId).xpReward * l.qty, 0) * k));
    const one = makeOrder(['CROP_01'], seq(0), 1);
    expect(one.lines).toEqual([{ itemId: 'CROP_01', qty: 3 }]);
    expect(one.gold).toBe(Math.round(item('CROP_01').baseSellGold * 3 * ORDER_FACTOR[0]));
  });

  it('lấp chỗ trống: có hàng thì 3 đơn mới; chưa có hàng hoặc đang chờ thì báo lỗi, không đổi', () => {
    const s = ok(refreshOrders(fresh(), 'XUAN', NOW, seq(0.3)));
    expect(boardOf(s).slots.every((o) => o !== null)).toBe(true);
    expect(boardOf(s).seq).toBe(3);
    expect(refreshOrders(s, 'XUAN', NOW, seq(0.3))).toMatchObject({ ok: false, message: expect.stringContaining('Chưa có đơn mới') });
    expect(refreshOrders(fresh(), 'DONG', NOW, seq(0.3))).toMatchObject({ ok: false, message: expect.stringContaining('Chưa có hàng') });
  });

  it('giao đơn: thiếu hàng → báo thiếu; đủ → trừ Kho, +vàng +XP, chỗ đó có đơn mới ngay', () => {
    const s0 = ok(refreshOrders(fresh(), 'XUAN', NOW, seq(0)));
    const o = boardOf(s0).slots[0]!;
    expect(deliverOrder(s0, 0, 'XUAN', seq(0))).toMatchObject({ ok: false, message: expect.stringContaining('Còn thiếu') });
    const rich = { ...s0, inventory: { CROP_01: 10 } };
    const r = deliverOrder(rich, 0, 'XUAN', seq(0));
    if (!r.ok) throw new Error(r.message);
    expect(r.save.inventory.CROP_01).toBe(10 - o.lines[0].qty);
    expect(r.save.gold).toBe(rich.gold + o.gold);
    expect(r.save.xp).toBe(rich.xp + o.xp);
    expect(boardOf(r.save).slots[0]?.id).toBe(4);
    expect(deliverOrder(fresh(), 0, 'XUAN', seq(0))).toMatchObject({ ok: false, message: expect.stringContaining('chưa có đơn') });
  });

  it('bỏ đơn: chỗ trống 10 phút rồi mới có đơn mới', () => {
    const s0 = ok(refreshOrders(fresh(), 'XUAN', NOW, seq(0)));
    const r = skipOrder(s0, 1, NOW);
    if (!r.ok) throw new Error(r.message);
    expect(boardOf(r.save).slots[1]).toBeNull();
    expect(boardOf(r.save).readyAt[1]).toBe(NOW + ORDER_SKIP_COOLDOWN_MS);
    expect(refreshOrders(r.save, 'XUAN', NOW + ORDER_SKIP_COOLDOWN_MS - 1, seq(0)).ok).toBe(false);
    expect(boardOf(ok(refreshOrders(r.save, 'XUAN', NOW + ORDER_SKIP_COOLDOWN_MS, seq(0)))).slots[1]).not.toBeNull();
    expect(skipOrder(r.save, 1, NOW)).toMatchObject({ ok: false });
  });
});
