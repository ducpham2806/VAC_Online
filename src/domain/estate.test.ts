import { describe, expect, it } from 'vitest';
import { layoutCharAt } from '../data/estateLayout';
import {
  CLEAR_RULES,
  OBSTACLES,
  RECLAIM_REGIONS,
  REPAIRS,
  type MaterialId,
  clearObstacle,
  effectiveCharAt,
  emptyEstate,
  estateOf,
  reclaimCost,
  reclaimRegion,
  repairStructure,
  structureAt,
} from './estate';
import type { FarmSave } from './farm';
import { newSliceSave } from '../game/slice/sliceSave';

const NOW = 1_800_000_000_000;
const fresh = (patch: Partial<FarmSave> = {}): FarmSave => ({ ...newSliceSave(NOW), ...patch });
const ok = (r: ReturnType<typeof clearObstacle>) => {
  if (!r.ok) throw new Error(r.message);
  return r.save;
};
const rock = OBSTACLES.find((o) => o.kind === 'ROCK')!;
const tree = OBSTACLES.find((o) => o.kind === 'TREE')!;

describe('GP-14 bố cục điền trang bản thử', () => {
  it('có 3 tảng đá, 3 cụm gốc cây; mỗi vùng khai hoang chỉ gồm đất hoang `w`, vùng 1 = 8 ô, vùng 2 = 14 ô', () => {
    expect(OBSTACLES.filter((o) => o.kind === 'ROCK')).toHaveLength(3);
    expect(OBSTACLES.filter((o) => o.kind === 'TREE')).toHaveLength(3);
    expect(RECLAIM_REGIONS.map((r) => r.length)).toEqual([8, 14]);
    for (const r of RECLAIM_REGIONS) for (const t of r) expect(layoutCharAt(t.x, t.y)).toBe('w');
  });

  it('vật liệu trên bản đồ đủ để sửa cả 4 hạng mục (QD-83, QD-87: vật liệu hữu hạn, không mọc lại)', () => {
    const supply: Record<MaterialId, number> = { MAT_GO: 0, MAT_DA: 0 };
    for (const o of OBSTACLES) supply[CLEAR_RULES[o.kind].item] += CLEAR_RULES[o.kind].qty;
    const need: Record<MaterialId, number> = { MAT_GO: 0, MAT_DA: 0 };
    for (const r of Object.values(REPAIRS)) for (const [m, n] of Object.entries(r.mats)) need[m as MaterialId] += n;
    expect(supply).toEqual({ MAT_GO: 15, MAT_DA: 9 });
    expect(need).toEqual({ MAT_GO: 14, MAT_DA: 8 }); // Giếng + Chuồng + Nhà 12/6, Bếp Củi +2/+2 (QD-87)
  });

  it('giá khai hoang tăng dần 500 × 1,25^k (KT-15)', () => {
    expect([0, 1, 2].map(reclaimCost)).toEqual([500, 625, 781]);
  });

  it('estateOf: bản lưu thiếu hoặc hỏng → ban đầu; bỏ id lạ, chặn số vùng ngoài khoảng', () => {
    expect(estateOf({})).toEqual(emptyEstate());
    expect(estateOf({ estate: { cleared: 'x' } as never })).toEqual(emptyEstate());
    expect(estateOf({ estate: { cleared: ['NOPE', rock.id], repaired: ['WELL', 'BAD' as never], reclaimed: 9 } })).toEqual({
      cleared: [rock.id],
      repaired: ['WELL'],
      reclaimed: RECLAIM_REGIONS.length,
    });
  });

  it('ký hiệu hiệu lực: đá đã dọn thành cỏ, vùng đã khai thành ruộng', () => {
    const t = rock.tiles[0];
    const w = RECLAIM_REGIONS[0][0];
    expect(effectiveCharAt(t.x, t.y, emptyEstate())).toBe('R');
    expect(effectiveCharAt(t.x, t.y, { ...emptyEstate(), cleared: [rock.id] })).toBe('.');
    expect(effectiveCharAt(w.x, w.y, { ...emptyEstate(), reclaimed: 1 })).toBe('F');
    expect(structureAt(12, 3)).toBe('HOUSE');
  });
});

describe('KT-18 dọn chướng ngại', () => {
  it('dọn đá: -2⚡, +3 Đá, ghi đã dọn', () => {
    const s = ok(clearObstacle(fresh(), rock.id, NOW));
    expect(s.stamina).toBe(48);
    expect(s.inventory.MAT_DA).toBe(3);
    expect(s.estate?.cleared).toEqual([rock.id]);
  });

  it('chặt gốc cây: -4⚡, +5 Gỗ', () => {
    const s = ok(clearObstacle(fresh(), tree.id, NOW));
    expect(s.stamina).toBe(46);
    expect(s.inventory.MAT_GO).toBe(5);
  });

  it('từ chối: id lạ, đã dọn rồi, thiếu ⚡', () => {
    expect(clearObstacle(fresh(), 'R_0_0', NOW).ok).toBe(false);
    const once = ok(clearObstacle(fresh(), rock.id, NOW));
    expect(clearObstacle(once, rock.id, NOW).ok).toBe(false);
    const tired = clearObstacle(fresh({ stamina: 3, staminaUpdatedAt: NOW }), tree.id, NOW);
    expect(tired).toMatchObject({ ok: false, message: '⚡ Cần 4 Năng lượng để dọn gốc cây!' });
  });
});

describe('KT-18 sửa hạng mục', () => {
  it('sửa giếng: -300🪙, -4 Đá, +20 Phong Thủy', () => {
    const s = ok(repairStructure(fresh({ inventory: { MAT_DA: 5 } }), 'WELL'));
    expect(s.gold).toBe(2200);
    expect(s.inventory.MAT_DA).toBe(1);
    expect(s.fengShuiScore).toBe(20);
    expect(s.estate?.repaired).toEqual(['WELL']);
  });

  it('sửa nhà cần cả Gỗ và Đá', () => {
    const s = ok(repairStructure(fresh({ inventory: { MAT_GO: 6, MAT_DA: 2 } }), 'HOUSE'));
    expect(s.gold).toBe(2000);
    expect(s.inventory).toEqual({ MAT_GO: 0, MAT_DA: 0 });
    expect(s.fengShuiScore).toBe(40);
  });

  it('từ chối: thiếu vật liệu, thiếu vàng, đã sửa rồi — không đổi gì', () => {
    expect(repairStructure(fresh({ inventory: { MAT_GO: 5 } }), 'COOP')).toMatchObject({
      ok: false,
      message: '🔨 Sửa Chuồng gà cần 400 🪙 + 6 🪵 Gỗ.',
    });
    expect(repairStructure(fresh({ gold: 399, inventory: { MAT_GO: 6 } }), 'COOP').ok).toBe(false);
    const done = ok(repairStructure(fresh({ inventory: { MAT_GO: 12 } }), 'COOP'));
    expect(repairStructure(done, 'COOP')).toMatchObject({ ok: false, message: '⚠️ Chuồng gà đã sửa rồi!' });
  });
});

describe('KT-15 khai hoang theo vùng', () => {
  it('vùng 1: -500🪙 -5⚡, +45 XP, +25 Phong Thủy, thêm 8 ô ruộng trống; vùng 2 giá 625', () => {
    const base = fresh();
    const s = ok(reclaimRegion(base, 0, NOW));
    expect(s.gold).toBe(2000);
    expect(s.stamina).toBe(45);
    expect(s.xp).toBe(45);
    expect(s.fengShuiScore).toBe(25);
    expect(s.tiles).toHaveLength(base.tiles.length + 8);
    expect(s.tiles.at(-1)?.itemId).toBeNull();
    const s2 = ok(reclaimRegion(s, 1, NOW));
    expect(s2.gold).toBe(2000 - 625);
    expect(s2.estate?.reclaimed).toBe(2);
  });

  it('từ chối: nhảy cóc vùng, vùng đã khai, hết đất, thiếu vàng, thiếu ⚡', () => {
    expect(reclaimRegion(fresh(), 1, NOW)).toMatchObject({ ok: false, message: '⛏️ Khai hoang vùng 1 trước.' });
    const one = ok(reclaimRegion(fresh(), 0, NOW));
    expect(reclaimRegion(one, 0, NOW)).toMatchObject({ ok: false, message: '⚠️ Vùng này đã khai hoang rồi!' });
    const all = ok(reclaimRegion(one, 1, NOW));
    expect(reclaimRegion(all, 2, NOW)).toMatchObject({ ok: false, message: '⚠️ Đã khai hoang hết đất của điền trang!' });
    expect(reclaimRegion(fresh({ gold: 499 }), 0, NOW).ok).toBe(false);
    expect(reclaimRegion(fresh({ stamina: 4, staminaUpdatedAt: NOW }), 0, NOW).ok).toBe(false);
  });
});

describe('P1-9 Bếp Củi và chỗ nuôi (QD-87, KT-21)', () => {
  const kit = { MAT_GO: 2, MAT_DA: 2 };
  it('Bếp Củi: chưa đủ cấp / thiếu vật liệu → từ chối; đủ → có xưởng MAC_02, giá lấy từ dữ liệu', () => {
    expect(REPAIRS.KITCHEN.gold).toBe(350);
    expect(repairStructure(fresh({ inventory: kit }), 'KITCHEN')).toMatchObject({ ok: false, message: expect.stringContaining('Lv.3') });
    expect(repairStructure(fresh({ level: 3 }), 'KITCHEN')).toMatchObject({ ok: false, message: expect.stringContaining('350') });
    const s = ok(repairStructure(fresh({ level: 3, inventory: kit }), 'KITCHEN'));
    expect(s.machines?.MAC_02).toEqual({ craftItemId: null, readyAt: null });
    expect(s.gold).toBe(fresh().gold - 350);
    expect(s.inventory).toEqual({ MAT_GO: 0, MAT_DA: 0 });
    expect(structureAt(16, 2)).toBe('KITCHEN');
  });

  it('chỗ nuôi: ao có sẵn 2 chỗ vịt + 3 chỗ cá; sửa Chuồng gà thêm đúng 4 chỗ gà', () => {
    const s0 = fresh({ inventory: { MAT_GO: 6 } });
    expect(s0.tiles.filter((t) => t.zoneType === 'POND')).toHaveLength(5);
    expect(s0.tiles.filter((t) => t.zoneType === 'COOP')).toHaveLength(0);
    const s = ok(repairStructure(s0, 'COOP'));
    expect(s.tiles.filter((t) => t.zoneType === 'COOP').map((t) => t.id)).toEqual(['P20_13', 'P21_13', 'P20_14', 'P21_14']);
    expect(s.tiles).toHaveLength(s0.tiles.length + 4);
  });

  it('chỗ nuôi nằm đúng sân chuồng (,) và ao (P) trên bố cục', () => {
    const s = fresh();
    for (const t of s.tiles.filter((x) => x.zoneType === 'POND')) expect(layoutCharAt(t.tileX, t.tileY)).toBe('P');
    for (const [x, y] of [[20, 13], [21, 14]]) expect(layoutCharAt(x, y)).toBe(',');
  });
});
