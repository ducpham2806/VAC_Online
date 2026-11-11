import { describe, expect, it } from 'vitest';
import { onlineWanted, rebase, rejectedByServer } from './sliceSync';
import { newSliceSave } from '../game/slice/sliceSave';
import { SEASON_EPOCH_MS } from '../domain/season';

const NOW = SEASON_EPOCH_MS + 2 * 86_400_000; // mùa Xuân

describe('P1-8 đồng bộ bản thử với server', () => {
  it('dựng lại: ảnh chụp server + thao tác còn chờ, theo đúng luật bản thử', () => {
    const server = newSliceSave(NOW);
    const plot = server.tiles.find((t) => t.zoneType === 'LAND')!.id;
    expect(rebase(server, [], NOW)).toBe(server);
    const s = rebase(server, [{ action: { type: 'PLANT', tileId: plot, itemId: 'CROP_01' }, okLocal: true }], NOW);
    expect(s.tiles.find((t) => t.id === plot)?.itemId).toBe('CROP_01');
    expect(s.gold).toBe(server.gold - 2);
  });

  it('chỉ báo khi server từ chối việc máy đã cho làm', () => {
    const sent = [
      { action: { type: 'WATER' as const, tileId: 'a' }, okLocal: true },
      { action: { type: 'WATER' as const, tileId: 'b' }, okLocal: false },
    ];
    expect(rejectedByServer(sent, [{ index: 0, ok: true, message: '' }, { index: 1, ok: false, message: 'x' }])).toBeNull();
    expect(rejectedByServer(sent, [{ index: 0, ok: false, message: 'Hết vàng' }])).toBe('Máy chủ: Hết vàng');
  });

  it('chạy test (MODE=test) không bao giờ kết nối server', () => {
    expect(onlineWanted('?p1')).toBe(false);
  });
});
