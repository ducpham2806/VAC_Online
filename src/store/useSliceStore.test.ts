import { beforeEach, describe, expect, it, vi } from 'vitest';
import { plotId } from '../game/slice/sliceSave';
import { tilesOf } from '../game/slice/estateMap';
import { selectActionTool, useSliceStore } from './useSliceStore';

const plots = tilesOf('F');
const p0 = plots[0];
const id0 = plotId(p0.x, p0.y);

describe('P1-4 store bản thử: chạm ô → engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T08:00:00+07:00')); // mùa Xuân (KT-17)
    useSliceStore.getState().reset(Date.now());
  });

  it('người chơi mới: mỗi ô F trên bản đồ là 1 ô ruộng trống, có sẵn giống gieo được', () => {
    const s = useSliceStore.getState();
    expect(s.save.tiles).toHaveLength(plots.length);
    expect(s.save.tiles.every((t) => t.itemId === null)).toBe(true);
    expect(s.seedId).toBe('CROP_01');
  });

  it('nút hành động: đứng cạnh ô trống → gieo; gieo xong → tưới; chín → gặt vào Kho', () => {
    const st = useSliceStore.getState();
    st.setPlayerTile(p0);
    expect(selectActionTool(useSliceStore.getState())).toBe('SEED');
    const gold0 = st.save.gold;
    st.actNear();
    let s = useSliceStore.getState();
    expect(s.save.tiles.find((t) => t.id === id0)?.itemId).toBe('CROP_01');
    expect(s.save.gold).toBeLessThan(gold0);
    expect(s.fx.at(-1)).toMatchObject({ x: p0.x, y: p0.y, tool: 'SEED' });
    // các ô khác trong tầm vẫn trống nên nút vẫn là gieo; tưới ô vừa gieo bằng thao tác trực tiếp
    s.act([{ type: 'WATER', tileId: id0 }]);
    expect(useSliceStore.getState().save.tiles.find((t) => t.id === id0)?.watered).toBe(true);
    vi.advanceTimersByTime(60 * 60_000);
    s = useSliceStore.getState();
    s.act([{ type: 'HARVEST', tileId: id0 }]);
    expect((useSliceStore.getState().save.inventory.CROP_01 ?? 0)).toBeGreaterThan(0);
  });

  it('kéo cả loạt: 1 thông báo gộp "Đã gieo n/n ô"', () => {
    const acts = plots.map((p) => ({ type: 'PLANT' as const, tileId: plotId(p.x, p.y), itemId: 'CROP_01' }));
    useSliceStore.getState().act(acts);
    const s = useSliceStore.getState();
    expect(s.toasts.at(-1)?.text).toBe(`Đã gieo ${plots.length}/${plots.length} ô`);
  });

  it('thao tác lỗi không đổi trạng thái và báo lỗi', () => {
    const before = useSliceStore.getState().save;
    useSliceStore.getState().act([{ type: 'HARVEST', tileId: id0 }]);
    const s = useSliceStore.getState();
    expect(s.save.tiles).toEqual(before.tiles);
    expect(s.toasts.at(-1)?.ok).toBe(false);
  });

  it('bán ở HTX: Kho giảm, vàng tăng', () => {
    const st = useSliceStore.getState();
    st.act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
    vi.advanceTimersByTime(60 * 60_000);
    useSliceStore.getState().act([{ type: 'HARVEST', tileId: id0 }]);
    const s = useSliceStore.getState();
    const n = s.save.inventory.CROP_01 ?? 0;
    const g = s.save.gold;
    s.sell('CROP_01', n);
    expect(useSliceStore.getState().save.inventory.CROP_01).toBe(0);
    expect(useSliceStore.getState().save.gold).toBeGreaterThan(g);
  });

  it('không có ô ruộng trong tầm: nút hành động báo đối tượng kề chưa mở', () => {
    useSliceStore.getState().setPlayerTile({ x: 18, y: 12 }); // mép sân chuồng gà
    expect(selectActionTool(useSliceStore.getState())).toBe('FEED');
    useSliceStore.getState().actNear();
    expect(useSliceStore.getState().toasts.at(-1)?.text).toContain('Cho gà ăn');
  });
});
