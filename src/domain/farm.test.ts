import { describe, expect, it } from 'vitest';
import { FarmTileEntity } from '../data/types';
import {
  FarmSave,
  MUD_ITEM_ID,
  applyMud,
  dredgePond,
  expandLand,
  growMs,
  harvest,
  harvestCycles,
  nextTileAction,
  plant,
  sellToHtx,
  water,
} from './farm';
import { findItem } from './farm';
import { STAMINA_REGEN_MS } from './stamina';

const NOW = 1_000_000_000;

function tile(id: string, patch: Partial<FarmTileEntity> = {}): FarmTileEntity {
  return {
    id,
    tileX: 0,
    tileY: 0,
    zoneType: 'LAND',
    itemId: null,
    plantedAt: null,
    matureAt: null,
    watered: false,
    mudApplied: false,
    isGolden: false,
    totalYield: 0,
    remainingYield: 0,
    ...patch,
  };
}

function save(patch: Partial<FarmSave> = {}): FarmSave {
  return {
    region: 'CENTRAL',
    level: 1,
    xp: 0,
    gold: 2500,
    gems: 50,
    stamina: 50,
    maxStamina: 50,
    staminaUpdatedAt: NOW,
    fengShuiScore: 0,
    wildPlotsUnlocked: 12,
    pondMudCounter: 0,
    inventory: {},
    tiles: [tile('T1'), tile('T2', { tileY: 2, zoneType: 'POND' })],
    ...patch,
  };
}

function ok<T extends { ok: boolean }>(r: T): Extract<T, { ok: true }> {
  if (!r.ok) throw new Error(`expected ok: ${JSON.stringify(r)}`);
  return r as Extract<T, { ok: true }>;
}

describe('plant', () => {
  it('trừ tiền giống, đặt giờ chín theo dữ liệu', () => {
    const r = ok(plant(save(), 'T1', 'CROP_01', 1, NOW));
    expect(r.save.gold).toBe(2500 - 2);
    const t = r.save.tiles[0];
    expect(t.itemId).toBe('CROP_01');
    expect(t.matureAt).toBe(NOW + 2 * 60_000);
  });
  it('miền Bắc: cây CROP chín nhanh hơn 10%', () => {
    expect(growMs(findItem('CROP_01')!, 'NORTH')).toBe(108_000);
    expect(growMs(findItem('AQUA_01')!, 'NORTH')).toBe(20 * 60_000);
  });
  it('chặn: ô có cây, không đủ vàng, sai cấp/Đợt/miền, không phải giống', () => {
    const planted = ok(plant(save(), 'T1', 'CROP_01', 1, NOW)).save;
    expect(plant(planted, 'T1', 'CROP_01', 1, NOW).ok).toBe(false);
    expect(plant(save({ gold: 1 }), 'T1', 'CROP_01', 1, NOW).ok).toBe(false);
    expect(plant(save(), 'T1', 'CROP_02', 1, NOW).ok).toBe(false);
    expect(plant(save({ level: 30 }), 'T1', 'CROP_13', 1, NOW).ok).toBe(false);
    expect(plant(save({ level: 30, region: 'SOUTH' }), 'T1', 'CROP_N01', 1, NOW).ok).toBe(false);
    expect(plant(save({ level: 30 }), 'T1', 'PROD_01', 6, NOW).ok).toBe(false);
    expect(plant(save(), 'NOPE', 'CROP_01', 1, NOW).ok).toBe(false);
  });
});

describe('water / mud / harvest', () => {
  const planted = () => ok(plant(save(), 'T1', 'CROP_01', 1, NOW)).save;

  it('tưới giảm 15% thời gian còn lại, chỉ 1 lần mỗi vụ', () => {
    const w = ok(water(planted(), 'T1', NOW));
    expect(w.save.tiles[0].matureAt).toBe(NOW + 120_000 - 18_000);
    expect(water(w.save, 'T1', NOW).ok).toBe(false);
  });

  it('chưa chín thì không thu hoạch được', () => {
    expect(harvest(planted(), 'T1', NOW + 1000).ok).toBe(false);
  });

  it('thu hoạch: vào kho, KHÔNG cộng vàng, cộng XP, dọn ô', () => {
    const p = planted();
    const h = ok(harvest(p, 'T1', NOW + 120_000));
    expect(h.save.gold).toBe(p.gold);
    expect(h.save.inventory.CROP_01).toBe(2);
    expect(h.save.xp).toBe(1);
    expect(h.save.tiles[0].itemId).toBeNull();
    expect(nextTileAction(h.save.tiles[0], NOW)).toBe('PLANT');
  });

  it('bón bùn: chín ngay, Hoàng Kim ⭐ ×3 sản lượng khi rng < 45%', () => {
    const p = { ...planted(), inventory: { [MUD_ITEM_ID]: 1 } };
    const golden = ok(applyMud(p, 'T1', NOW, () => 0.1));
    expect(golden.save.inventory[MUD_ITEM_ID]).toBe(0);
    expect(golden.save.tiles[0].isGolden).toBe(true);
    expect(ok(harvest(golden.save, 'T1', NOW)).save.inventory.CROP_01).toBe(6);
    const plain = ok(applyMud(p, 'T1', NOW, () => 0.9));
    expect(plain.save.tiles[0].isGolden).toBe(false);
    expect(applyMud(planted(), 'T1', NOW, () => 0).ok).toBe(false); // hết bùn
  });

  it('thủy sản: tăng bùn ao (tối đa 10); miền Nam +1 sản lượng', () => {
    const s = save({ level: 3, pondMudCounter: 10 });
    const p = ok(plant(s, 'T2', 'AQUA_01', 1, NOW)).save;
    const h = ok(harvest(p, 'T2', NOW + 20 * 60_000));
    expect(h.save.pondMudCounter).toBe(10);
    expect(h.save.inventory.AQUA_01).toBe(1);
    const south = ok(plant(save({ level: 3, region: 'SOUTH' }), 'T2', 'AQUA_01', 1, NOW)).save;
    expect(ok(harvest(south, 'T2', NOW + 20 * 60_000)).save.inventory.AQUA_01).toBe(2);
  });

  it('thứ tự thao tác khi chạm ô', () => {
    const p = planted();
    expect(nextTileAction(p.tiles[0], NOW)).toBe('WATER');
    const w = ok(water(p, 'T1', NOW)).save;
    expect(nextTileAction(w.tiles[0], NOW)).toBe('MUD');
    expect(nextTileAction(w.tiles[0], NOW + 10 * 60_000)).toBe('HARVEST');
  });
});

describe('sellToHtx', () => {
  it('bán theo giá gốc', () => {
    const r = ok(sellToHtx(save({ inventory: { CROP_01: 5 } }), 'CROP_01', 3));
    expect(r.save.gold).toBe(2500 + 3 * 4);
    expect(r.save.inventory.CROP_01).toBe(2);
  });
  it('chặn: thiếu hàng, số lượng sai, vật phẩm lạ', () => {
    const s = save({ inventory: { CROP_01: 1 } });
    expect(sellToHtx(s, 'CROP_01', 2).ok).toBe(false);
    expect(sellToHtx(s, 'CROP_01', 0).ok).toBe(false);
    expect(sellToHtx(s, 'CROP_01', 1.5).ok).toBe(false);
    expect(sellToHtx(s, 'NOPE', 1).ok).toBe(false);
  });
});

describe('dredgePond / expandLand', () => {
  it('vét ao: -3⚡, +3 bùn, reset bộ đếm, +20 XP', () => {
    const r = ok(dredgePond(save({ pondMudCounter: 7 }), NOW));
    expect(r.save.stamina).toBe(47);
    expect(r.save.inventory[MUD_ITEM_ID]).toBe(3);
    expect(r.save.pondMudCounter).toBe(0);
    expect(r.save.xp).toBe(20);
  });
  it('năng lượng hồi theo thời gian trước khi tiêu', () => {
    const tired = save({ stamina: 1, staminaUpdatedAt: NOW - 2 * STAMINA_REGEN_MS });
    expect(ok(dredgePond(tired, NOW)).save.stamina).toBe(0);
    expect(dredgePond(save({ stamina: 2 }), NOW).ok).toBe(false);
  });
  it('khai hoang: -5⚡ -500🪙, tối đa 25', () => {
    const r = ok(expandLand(save(), NOW));
    expect(r.save).toMatchObject({ stamina: 45, gold: 2000, wildPlotsUnlocked: 13, fengShuiScore: 25 });
    expect(expandLand(save({ wildPlotsUnlocked: 25 }), NOW).ok).toBe(false);
    expect(expandLand(save({ gold: 499 }), NOW).ok).toBe(false);
    expect(expandLand(save({ stamina: 4 }), NOW).ok).toBe(false);
  });
});

describe('vật nuôi / thủy sản nuôi nhiều lứa (S5a)', () => {
  const item = (id: string) => {
    const it = findItem(id);
    if (!it) throw new Error(id);
    return it;
  };

  it('số lứa = ⌈1,5 × giá giống ÷ tiền 1 lứa⌉, tối thiểu 2; cây trồng 1 lứa', () => {
    expect(harvestCycles(item('CROP_01'))).toBe(1);
    expect(harvestCycles(item('ANI_01'))).toBe(5); // 1,5 × 40 ÷ 14 = 4,3
    expect(harvestCycles(item('AQUA_01'))).toBe(3); // 1,5 × 30 ÷ 17 = 2,6
    expect(harvestCycles(item('ANI_07'))).toBe(15); // 1,5 × 600 ÷ 62 = 14,5
  });

  it('mọi vật nuôi / thủy sản đều lãi khi nuôi hết lứa', () => {
    for (const it of [item('ANI_01'), item('ANI_05'), item('ANI_07'), item('AQUA_01'), item('AQUA_06')]) {
      const revenue = it.baseSellGold * (it.yieldCount ?? 2) * harvestCycles(it);
      expect(revenue).toBeGreaterThanOrEqual(1.5 * it.buyCostGold);
    }
  });

  it('thu lứa giữa: con giống ở lại, lứa mới bắt đầu lại; lứa cuối: dọn ô', () => {
    const s = save({ level: 3 });
    let p = ok(plant(s, 'T2', 'AQUA_01', 1, NOW)).save;
    expect(p.tiles[1].harvestsLeft).toBe(3);
    const grow = growMs(item('AQUA_01'), 'CENTRAL');
    let t = NOW + grow;
    p = ok(water(p, 'T2', NOW)).save;
    const h1 = ok(harvest(p, 'T2', t));
    expect(h1.message).toContain('còn 2 lứa');
    expect(h1.save.tiles[1]).toMatchObject({ itemId: 'AQUA_01', harvestsLeft: 2, plantedAt: t, matureAt: t + grow, watered: false });
    expect(harvest(h1.save, 'T2', t + 1000).ok).toBe(false); // lứa mới chưa chín
    t += grow;
    const h2 = ok(harvest(h1.save, 'T2', t));
    t += grow;
    const h3 = ok(harvest(h2.save, 'T2', t));
    expect(h3.save.tiles[1].itemId).toBeNull();
    expect(h3.save.tiles[1].harvestsLeft).toBeUndefined();
    expect(h3.save.inventory.AQUA_01).toBe(3);
    expect(h3.save.gold).toBe(2500 - 30); // chỉ trả tiền giống 1 lần
  });

  it('save cũ chưa có harvestsLeft: thu 1 lần như trước', () => {
    const s = save({ level: 3, tiles: [tile('T1'), tile('T2', { tileY: 2, zoneType: 'POND', itemId: 'AQUA_01', plantedAt: NOW, matureAt: NOW })] });
    expect(ok(harvest(s, 'T2', NOW)).save.tiles[1].itemId).toBeNull();
  });
});

