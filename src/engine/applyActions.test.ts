import { describe, expect, it } from 'vitest';
import { SEASON_EPOCH_MS } from '../domain/season';
import { applyActions, MAX_ACTIONS_PER_BATCH, newFarmSave } from './applyActions';

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
