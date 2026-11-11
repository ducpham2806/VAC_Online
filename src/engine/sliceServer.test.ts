import { describe, expect, it } from 'vitest';
import { parseAction, parseActions, loadServerSave, serverApply } from './sliceServer';
import { MAX_ACTIONS_PER_BATCH } from './applyActions';
import { SEASON_EPOCH_MS } from '../domain/season';

const NOW = SEASON_EPOCH_MS + 2 * 86_400_000; // mùa Xuân

describe('P1-8 server không tin client: kiểm lô thao tác', () => {
  it('nhận đúng dạng, bỏ trường thừa', () => {
    expect(parseAction({ type: 'PLANT', tileId: 'P5_7', itemId: 'CROP_01', gold: 999999 })).toEqual({ type: 'PLANT', tileId: 'P5_7', itemId: 'CROP_01' });
    expect(parseAction({ type: 'REFRESH_ORDERS', x: 1 })).toEqual({ type: 'REFRESH_ORDERS' });
    expect(parseAction({ type: 'DISCOVER', ingredientIds: ['AQUA_01', 'CROP_05'] })).toEqual({ type: 'DISCOVER', ingredientIds: ['AQUA_01', 'CROP_05'] });
  });

  it('từ chối loại lạ, sai kiểu, số lạ, chuỗi quá dài', () => {
    for (const bad of [
      null,
      'PLANT',
      { type: 'SET_GOLD', gold: 1e9 },
      { type: 'PLANT', tileId: 5, itemId: 'CROP_01' },
      { type: 'SELL', itemId: 'CROP_01', qty: -3 },
      { type: 'SELL', itemId: 'CROP_01', qty: 1.5 },
      { type: 'REPAIR', structureId: 'CASTLE' },
      { type: 'WATER', tileId: 'x'.repeat(65) },
      { type: 'DISCOVER', ingredientIds: 'CROP_01' },
      { type: 'DELIVER_ORDER', slot: 99 },
    ]) expect(parseAction(bad)).toBeNull();
  });

  it('cả lô: không phải mảng / quá dài / có 1 thao tác sai → từ chối cả lô', () => {
    expect(parseActions({})).toBeNull();
    expect(parseActions(Array(MAX_ACTIONS_PER_BATCH + 1).fill({ type: 'REFRESH_ORDERS' }))).toBeNull();
    expect(parseActions([{ type: 'WATER', tileId: 'a' }, { type: 'HACK' }])).toBeNull();
    expect(parseActions([])).toEqual([]);
  });
});

describe('P1-8 áp lô trên server', () => {
  it('chưa có trạng thái → người chơi mới bản thử; trạng thái hỏng → cũng người chơi mới', () => {
    expect(loadServerSave(null, NOW).tiles.some((t) => t.zoneType === 'POND')).toBe(true);
    expect(loadServerSave({ gold: 'x' }, NOW).gold).toBe(2500);
  });

  it('chạy luật bản thử (slice): loài ngoài bộ 8 bị chặn; gieo Lúa ghi sổ cái', () => {
    const s0 = loadServerSave(null, NOW);
    const plot = s0.tiles.find((t) => t.zoneType === 'LAND')!.id;
    const r = serverApply(s0, [
      { type: 'PLANT', tileId: plot, itemId: 'CROP_08' },
      { type: 'PLANT', tileId: plot, itemId: 'CROP_01' },
    ], NOW, () => 0.5);
    expect(r.results.map((x) => x.ok)).toEqual([false, true]);
    expect(r.ledger).toEqual([{ currency: 'GOLD', delta: -2, balance_after: 2498, reason: 'PLANT', ref: 'CROP_01' }]);
  });
});
