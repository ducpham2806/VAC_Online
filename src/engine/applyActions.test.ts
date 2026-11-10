import { describe, expect, it } from 'vitest';
import { SEASON_EPOCH_MS } from '../domain/season';
import { applyActions, MAX_ACTIONS_PER_BATCH, newFarmSave } from './applyActions';
import type { FarmSave } from '../domain/farm';
import { newSliceSave } from '../game/slice/sliceSave';

const DAY = 86_400_000;
const SPRING = SEASON_EPOCH_MS + 2 * DAY; // mùa Xuân
const WINTER = SEASON_EPOCH_MS + 22 * DAY; // mùa Đông
const ctx = (now: number) => ({ now, rng: () => 0.5, gameStage: 1 });

describe('P0-4 engine — gieo → thu → bán dùng luật src/domain', () => {
  it('cả vòng trong 2 lô, sổ cái khớp số dư', () => {
    const s0 = newFarmSave('NORTH', SPRING);
    const a = applyActions(s0, [{ type: 'PLANT', tileId: 'T0', itemId: 'CROP_01' }, { type: 'WATER', tileId: 'T0' }], ctx(SPRING));
    expect(a.results.every((r) => r.ok)).toBe(true);
    expect(a.ledger).toEqual([{ currency: 'GOLD', delta: -2, balance_after: 2498, reason: 'PLANT', ref: 'CROP_01' }]);

    const later = SPRING + 60 * 60_000;
    const b = applyActions(a.save, [{ type: 'HARVEST', tileId: 'T0' }, { type: 'SELL', itemId: 'CROP_01', qty: 2 }], ctx(later));
    expect(b.results.map((r) => r.ok)).toEqual([true, true]);
    expect(b.save.gold).toBe(2498 + 8);
    expect(b.ledger.at(-1)).toMatchObject({ currency: 'GOLD', delta: 8, balance_after: 2506, reason: 'SELL' });
  });

  it('từ chối gieo trái mùa (GP-20) nhưng vẫn làm các thao tác khác trong lô', () => {
    const s0 = { ...newFarmSave('NORTH', WINTER), level: 10 }; // đủ cấp để chỉ còn luật mùa quyết định
    const r = applyActions(
      s0,
      [{ type: 'PLANT', tileId: 'T0', itemId: 'CROP_01' }, { type: 'PLANT', tileId: 'T1', itemId: 'CROP_05' }],
      ctx(WINTER),
    );
    expect(r.results.map((x) => x.ok)).toEqual([false, true]); // Lúa không gieo mùa Đông; Cải thì được
    expect(r.save.tiles.find((t) => t.id === 'T1')?.itemId).toBe('CROP_05');
  });

  it('công tắc mùa của bản thử (P1-6) thay mùa lịch thật khi kiểm mùa gieo', () => {
    const s0 = newFarmSave('NORTH', SPRING);
    const plant = [{ type: 'PLANT' as const, tileId: 'T0', itemId: 'CROP_01' }];
    expect(applyActions(s0, plant, { ...ctx(SPRING), season: 'DONG' }).results[0].ok).toBe(false);
    expect(applyActions(s0, plant, { ...ctx(WINTER), season: 'XUAN' }).results[0].ok).toBe(true);
  });

  it('không tin dữ liệu client: bán quá số trong Kho bị từ chối, không có dòng sổ cái', () => {
    const r = applyActions(newFarmSave('NORTH', SPRING), [{ type: 'SELL', itemId: 'CROP_01', qty: 99 }], ctx(SPRING));
    expect(r.results[0].ok).toBe(false);
    expect(r.ledger).toEqual([]);
  });

  it('giới hạn kích thước lô', () => {
    const many = Array.from({ length: MAX_ACTIONS_PER_BATCH + 1 }, () => ({ type: 'WATER' as const, tileId: 'T0' }));
    expect(applyActions(newFarmSave('NORTH', SPRING), many, ctx(SPRING)).results[0].ok).toBe(false);
  });
});

describe('P1-10 engine — điền trang (GP-14, KT-15, KT-18)', () => {
  const planted = () => {
    const s0 = newFarmSave('NORTH', SPRING);
    return applyActions(s0, ['T0', 'T1', 'T2'].map((t) => ({ type: 'PLANT' as const, tileId: t, itemId: 'CROP_01' })), ctx(SPRING)).save;
  };
  const waterAll = ['T0', 'T1', 'T2'].map((t) => ({ type: 'WATER' as const, tileId: t }));

  it('chưa sửa Giếng: lô tưới 3 ô chỉ tưới được ô đầu, các ô sau báo cần sửa giếng', () => {
    const r = applyActions(planted(), waterAll, ctx(SPRING));
    expect(r.results.map((x) => x.ok)).toEqual([true, false, false]);
    expect(r.results[1].message).toContain('Sửa Giếng');
  });

  it('đã sửa Giếng: tưới cả loạt', () => {
    const s = { ...planted(), estate: { cleared: [], repaired: ['WELL' as const], reclaimed: 0 } };
    expect(applyActions(s, waterAll, ctx(SPRING)).results.every((x) => x.ok)).toBe(true);
  });

  it('dọn, sửa, khai hoang qua engine: sổ cái ghi ⚡ và vàng, ref là id đối tượng', () => {
    const s0 = { ...newFarmSave('NORTH', SPRING), inventory: { MAT_DA: 1 } };
    const r = applyActions(
      s0,
      [
        { type: 'CLEAR', obstacleId: 'R_19_10' },
        { type: 'REPAIR', structureId: 'WELL' },
        { type: 'RECLAIM', regionIndex: 0 },
      ],
      ctx(SPRING),
    );
    expect(r.results.map((x) => x.ok)).toEqual([true, true, true]);
    expect(r.ledger.map((l) => [l.currency, l.delta, l.reason, l.ref])).toEqual([
      ['STAMINA', -2, 'CLEAR', 'R_19_10'],
      ['GOLD', -300, 'REPAIR', 'WELL'],
      ['GOLD', -500, 'RECLAIM', 'REGION_0'],
      ['STAMINA', -5, 'RECLAIM', 'REGION_0'],
    ]);
    expect(r.save.tiles).toHaveLength(6 + 8);
  });
});

describe('P1-11 engine — NPC và Gia Phả (GP-50, TG-30)', () => {
  it('chọn hướng → nói chuyện → tặng quà → nhận Chương 1: sổ cái ghi vàng và ngọc của chương', () => {
    const s0 = {
      ...newFarmSave('NORTH', SPRING),
      inventory: { CROP_01: 1 },
      counters: { WATER: 1, 'HARVEST:CROP_01': 1 },
      estate: { cleared: [], repaired: ['HOUSE' as const], reclaimed: 0 },
    };
    const r = applyActions(
      s0,
      [
        { type: 'CHOOSE_PATH', path: 'PRAG' },
        { type: 'TALK', npcId: 'BAC_BAY' },
        { type: 'GIFT', npcId: 'BAC_BAY', itemId: 'CROP_01' },
        { type: 'CLAIM_CHAPTER', chapterNo: 1 },
      ],
      ctx(SPRING),
    );
    expect(r.results.map((x) => x.ok)).toEqual([true, true, true, true]);
    expect(r.save.npcs?.BAC_BAY?.points).toBe(100);
    expect(r.ledger.map((l) => [l.currency, l.delta, l.reason, l.ref])).toEqual([
      ['GOLD', 950, 'CLAIM_CHAPTER', 'CH1'],
      ['GEM', 15, 'CLAIM_CHAPTER', 'CH1'],
    ]);
  });
});

describe('P1-9 engine — luật bản thử (QD-86, QD-87)', () => {
  const slice = (now: number) => ({ ...ctx(now), slice: true });
  const base = (patch: Partial<FarmSave> = {}): FarmSave => ({ ...newSliceSave(SPRING), ...patch });
  const fish = 'P25_8';
  const duck = 'P24_6';
  const plot = () => base().tiles.find((t) => t.zoneType === 'LAND')!.id;

  it('chỗ nuôi chỉ thả đúng loài; ô ruộng không thả vật nuôi; loài ngoài bộ 8 bị chặn', () => {
    const s = base({ level: 10 });
    const r = applyActions(
      s,
      [
        { type: 'PLANT', tileId: fish, itemId: 'AQUA_01' },
        { type: 'PLANT', tileId: duck, itemId: 'AQUA_01' },
        { type: 'PLANT', tileId: plot(), itemId: 'ANI_01' },
        { type: 'PLANT', tileId: plot(), itemId: 'CROP_08' },
        { type: 'PLANT', tileId: duck, itemId: 'ANI_03' },
      ],
      slice(SPRING),
    );
    expect(r.results.map((x) => x.ok)).toEqual([true, false, false, false, true]);
    expect(r.results[1].message).toContain('không nuôi loài đó');
    expect(r.results[2].message).toContain('chuồng hoặc ao');
    expect(r.results[3].message).toContain('chưa có trong bản thử');
    expect(r.results[0].message).toContain('tới lứa thì chạm để thu');
  });

  it('cấp mở riêng bản thử (KT-21): Cải ở Lv3 gieo được khi slice, không slice thì vẫn Lv4', () => {
    const s = base({ level: 3 });
    const a = [{ type: 'PLANT' as const, tileId: plot(), itemId: 'CROP_05' }];
    expect(applyActions(s, a, slice(SPRING)).results[0].ok).toBe(true);
    expect(applyActions(s, a, ctx(SPRING)).results[0].message).toContain('Lv.4');
  });

  it('vật nuôi không tưới', () => {
    const s = applyActions(base({ level: 3 }), [{ type: 'PLANT', tileId: fish, itemId: 'AQUA_01' }], slice(SPRING)).save;
    expect(applyActions(s, [{ type: 'WATER', tileId: fish }], slice(SPRING)).results[0].message).toContain('không cần tưới');
  });

  it('Bếp Củi: nấu Cơm → lấy món → ăn hồi ⚡; món chưa biết / ngoài bản thử bị từ chối', () => {
    const s0 = base({ level: 4, stamina: 10, inventory: { MAT_GO: 2, MAT_DA: 2, CROP_01: 3 } });
    const cooked = applyActions(
      s0,
      [
        { type: 'COOK', productId: 'PROD_01' },
        { type: 'REPAIR', structureId: 'KITCHEN' },
        { type: 'COOK', productId: 'PROD_03' },
        { type: 'COOK', productId: 'PROD_02' },
        { type: 'COOK', productId: 'PROD_01' },
      ],
      slice(SPRING),
    );
    expect(cooked.results.map((x) => x.ok)).toEqual([false, true, false, false, true]);
    expect(cooked.results[2].message).toContain('Chưa biết công thức');
    expect(cooked.results[3].message).toContain('chưa nấu được');
    expect(cooked.save.inventory.CROP_01).toBe(0);
    const later = SPRING + 10 * 60_000;
    const done = applyActions(cooked.save, [{ type: 'COLLECT_DISH' }, { type: 'EAT', productId: 'PROD_01' }], slice(later));
    expect(done.results.map((x) => x.ok)).toEqual([true, true]);
    expect(done.save.inventory.PROD_01).toBe(0);
    expect(done.save.stamina).toBeGreaterThan(cooked.save.stamina);
  });

  it('Nồi Đất: tìm ra Canh Cải Cá Rô ở Lv4 (+💎 +XP), Lv3 thì chưa', () => {
    const inv = { MAT_GO: 2, MAT_DA: 2, AQUA_01: 1, CROP_05: 2, CROP_04: 1 };
    const pot = ['AQUA_01', 'CROP_05', 'CROP_05', 'CROP_04'];
    const at = (level: number) =>
      applyActions(base({ level, inventory: inv }), [{ type: 'REPAIR', structureId: 'KITCHEN' }, { type: 'DISCOVER', ingredientIds: pot }], slice(SPRING));
    expect(at(3).results[1].ok).toBe(false);
    const r = at(4);
    expect(r.results[1].ok).toBe(true);
    expect(r.save.discoveredRecipes).toEqual(['PROD_03']);
    expect(r.save.gems).toBe(base().gems + 10);
    expect(r.save.inventory.AQUA_01).toBe(1); // nguyên liệu không mất
  });

  it('không có cờ slice: Bếp vẫn khóa tới Giai đoạn 2 như luật đầy đủ', () => {
    const s = { ...base({ level: 10, inventory: { CROP_01: 3 } }), machines: { MAC_02: { craftItemId: null, readyAt: null } } };
    expect(applyActions(s, [{ type: 'COOK', productId: 'PROD_01' }], ctx(SPRING)).results[0].message).toContain('Giai đoạn 2');
  });

  it('đơn HTX qua engine: lấp bảng, giao đơn ghi sổ cái vàng', () => {
    const s0 = applyActions(base(), [{ type: 'REFRESH_ORDERS' }], slice(SPRING)).save;
    const o = s0.orders!.slots[0]!;
    const rich = { ...s0, inventory: { CROP_01: 20 } };
    const r = applyActions(rich, [{ type: 'DELIVER_ORDER', slot: 0 }, { type: 'SKIP_ORDER', slot: 1 }], slice(SPRING));
    expect(r.results.map((x) => x.ok)).toEqual([true, true]);
    expect(r.ledger).toEqual([{ currency: 'GOLD', delta: o.gold, balance_after: rich.gold + o.gold, reason: 'DELIVER_ORDER', ref: 'ORDER_0' }]);
  });
});
