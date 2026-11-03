import { describe, expect, it } from 'vitest';
import { FarmTileEntity } from '../data/types';
import {
  DAY_MS,
  HARVEST_GRACE_MS,
  PANTRY_CAP,
  WorkersSave,
  claimPantry,
  contractCost,
  hireWorker,
  serveLodgeMeal,
  tickWorkers,
} from './workers';
import { findItem, growMs } from './farm';

const NOW = 1_000_000_000_000;
const HOUR = 3_600_000;

function tile(id: string, patch: Partial<FarmTileEntity> = {}): FarmTileEntity {
  return {
    id, tileX: 0, tileY: 0, zoneType: 'LAND', itemId: null, plantedAt: null, matureAt: null,
    watered: false, mudApplied: false, isGolden: false, totalYield: 0, remainingYield: 0, ...patch,
  };
}

function save(patch: Partial<WorkersSave> = {}): WorkersSave {
  return {
    region: 'CENTRAL', level: 15, gold: 2000, pondMudCounter: 0, inventory: {},
    tiles: [tile('T1'), tile('T2')], workers: {}, tableMeals: 0, pantry: {}, ...patch,
  };
}

function ok<T extends { ok: boolean }>(r: T): Extract<T, { ok: true }> {
  if (!r.ok) throw new Error(`expected ok: ${JSON.stringify(r)}`);
  return r as Extract<T, { ok: true }>;
}

const item = (id: string) => {
  const it = findItem(id);
  if (!it) throw new Error(id);
  return it;
};

describe('hireWorker (M05.1)', () => {
  it('giá hợp đồng 3 ngày = lương × 3 × 0,88 (lương 25% theo PO)', () => {
    expect(contractCost(item('WORK_01'))).toBe(528);
    expect(contractCost(item('WORK_02'))).toBe(726);
  });

  it('thuê mới: trừ vàng, hợp đồng 3 ngày, no 100%; gia hạn cộng nối', () => {
    const h = ok(hireWorker(save(), 'WORK_01', 2, NOW));
    expect(h.save.gold).toBe(2000 - 528);
    expect(h.save.workers.WORK_01).toEqual({ contractUntil: NOW + 3 * DAY_MS, belly: 100, tickAt: NOW });
    const h2 = ok(hireWorker(h.save, 'WORK_01', 2, NOW + HOUR));
    expect(h2.save.workers.WORK_01.contractUntil).toBe(NOW + 6 * DAY_MS);
    expect(h2.save.gold).toBe(2000 - 2 * 528);
  });

  it('từ chối: thợ không có, chưa tới GĐ, thiếu cấp, thiếu vàng', () => {
    expect(hireWorker(save(), 'CROP_01', 2, NOW).message).toContain('Không có thợ');
    expect(hireWorker(save(), 'WORK_01', 1, NOW).message).toContain('Giai đoạn 2');
    expect(hireWorker(save(), 'WORK_03', 2, NOW).message).toContain('Giai đoạn 3');
    expect(hireWorker(save({ level: 12 }), 'WORK_01', 2, NOW).message).toContain('Cấp 13');
    expect(hireWorker(save({ level: 14 }), 'WORK_02', 2, NOW).message).toContain('Cấp 15');
    expect(hireWorker(save({ gold: 500 }), 'WORK_01', 2, NOW).message).toContain('528');
  });
});

describe('serveLodgeMeal / claimPantry', () => {
  it('dọn món: −1 món, + (⚡ ÷ 5) suất; Cơm Trắng 1 suất', () => {
    const s = ok(serveLodgeMeal(save({ inventory: { PROD_01: 1, PROD_03: 1 } }), 'PROD_01', 2)).save;
    expect(s.tableMeals).toBe(1);
    expect(s.inventory.PROD_01).toBe(0);
    expect(ok(serveLodgeMeal(s, 'PROD_03', 2)).save.tableMeals).toBe(1 + 3); // 16⚡ → 3 suất
  });

  it('dọn món từ chối: GĐ1, không phải món, hết món', () => {
    expect(serveLodgeMeal(save({ inventory: { PROD_01: 1 } }), 'PROD_01', 1).ok).toBe(false);
    expect(serveLodgeMeal(save({ inventory: { CROP_01: 3 } }), 'CROP_01', 2).ok).toBe(false);
    expect(serveLodgeMeal(save(), 'PROD_01', 2).ok).toBe(false);
  });

  it('thu Giỏ Thợ về Kho, không ra vàng; giỏ trống thì báo', () => {
    const c = ok(claimPantry(save({ pantry: { CROP_01: 4 }, inventory: { CROP_01: 1 } })));
    expect(c.save.inventory.CROP_01).toBe(5);
    expect(c.save.pantry).toEqual({});
    expect(c.save.gold).toBe(2000);
    expect(claimPantry(save()).ok).toBe(false);
  });
});

describe('tickWorkers (M05.2, M05.4, M05.5)', () => {
  const hired = (patch: Partial<WorkersSave> = {}) =>
    save({ workers: { WORK_01: { contractUntil: NOW + 3 * DAY_MS, belly: 100, tickAt: NOW } }, ...patch });

  it('chỉ thu ô đã chín ≥ 5 phút, vào Giỏ Thợ, không gieo lại', () => {
    const s = hired({
      tiles: [
        tile('T1', { itemId: 'CROP_01', plantedAt: NOW, matureAt: NOW + HOUR, watered: true }),
        tile('T2', { itemId: 'CROP_01', plantedAt: NOW, matureAt: NOW + HOUR - 2 * 60_000 + HARVEST_GRACE_MS, watered: true }),
      ],
    });
    const t = tickWorkers(s, NOW + HOUR + HARVEST_GRACE_MS);
    expect(t.pantry.CROP_01).toBe(2);
    expect(t.tiles[0].itemId).toBeNull(); // không tự gieo
    expect(t.tiles[1].itemId).toBe('CROP_01'); // mới chín 2 phút trước mốc → chừa cho chủ
    expect(t.inventory).toEqual({});
  });

  it('Chú Tư không đụng vật nuôi; Cô Năm thu nhiều lứa vật nuôi', () => {
    const grow = growMs(item('ANI_01'), 'CENTRAL');
    const chicken = tile('T1', { itemId: 'ANI_01', plantedAt: NOW, matureAt: NOW + grow, harvestsLeft: 5 });
    const a = tickWorkers(hired({ tiles: [chicken] }), NOW + 10 * HOUR);
    expect(a.pantry).toEqual({});
    const b = tickWorkers(
      save({ tiles: [chicken], workers: { WORK_02: { contractUntil: NOW + DAY_MS, belly: 100, tickAt: NOW } } }),
      NOW + 10 * HOUR
    );
    expect(b.pantry.ANI_01).toBe(5); // đủ 5 lứa trong 10 giờ (15 phút + 5 phút chờ / lứa)
    expect(b.tiles[0].itemId).toBeNull();
  });

  it('hết hợp đồng thì ngừng làm; tưới ô chưa tưới khi còn làm', () => {
    const s = hired({
      workers: { WORK_01: { contractUntil: NOW + HOUR, belly: 100, tickAt: NOW } },
      tiles: [tile('T1', { itemId: 'CROP_24', plantedAt: NOW, matureAt: NOW + 2 * HOUR })],
    });
    const t = tickWorkers(s, NOW + 3 * HOUR);
    expect(t.pantry).toEqual({}); // chín lúc +2h nhưng hợp đồng hết lúc +1h
    const w = tickWorkers(hired({ tiles: [tile('T1', { itemId: 'CROP_24', plantedAt: NOW, matureAt: NOW + 3 * HOUR })] }), NOW + HOUR);
    expect(w.tiles[0].watered).toBe(true);
    expect(w.tiles[0].matureAt).toBe(NOW + 3 * HOUR - Math.floor(2 * HOUR * 0.15));
  });

  it('Độ No hao theo ngày; đói thì ăn ở Bàn Ăn tới ≥ 85; hết cơm thì nghỉ làm', () => {
    const s = hired({ workers: { WORK_01: { contractUntil: NOW + 3 * DAY_MS, belly: 40, tickAt: NOW } }, tableMeals: 5 });
    const t = tickWorkers(s, NOW + 4 * HOUR); // 60/ngày → −10 → 30 < 35 → ăn 3 suất (30→55→80→100? dừng khi ≥85)
    expect(t.workers.WORK_01.belly).toBeCloseTo(100, 5);
    expect(t.tableMeals).toBe(2);
    // Không có cơm: chín sau lúc đói thì không thu
    const hungry = hired({
      workers: { WORK_01: { contractUntil: NOW + 3 * DAY_MS, belly: 36, tickAt: NOW } },
      tiles: [tile('T1', { itemId: 'CROP_01', plantedAt: NOW, matureAt: NOW + HOUR, watered: true })],
    });
    const h = tickWorkers(hungry, NOW + 2 * HOUR); // 36 → 35 sau 24 phút
    expect(h.pantry).toEqual({});
    expect(h.workers.WORK_01.belly).toBeLessThan(35);
  });

  it('Giỏ Thợ không vượt 120: lứa không vừa thì để chủ tự thu', () => {
    const s = hired({
      pantry: { CROP_01: PANTRY_CAP - 1 },
      tiles: [tile('T1', { itemId: 'CROP_01', plantedAt: NOW, matureAt: NOW, watered: true })],
    });
    const t = tickWorkers(s, NOW + HOUR);
    expect(t.pantry.CROP_01).toBe(PANTRY_CAP - 1);
    expect(t.tiles[0].itemId).toBe('CROP_01');
  });

  it('chạy lại cùng mốc không thu thêm (idempotent)', () => {
    const s = hired({ tiles: [tile('T1', { itemId: 'CROP_01', plantedAt: NOW, matureAt: NOW, watered: true })] });
    const once = tickWorkers(s, NOW + HOUR);
    expect(tickWorkers(once, NOW + HOUR)).toEqual(once);
  });
});
