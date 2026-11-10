import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SLICE_SAVE_KEY, SLICE_SAVE_VERSION, newSliceSave, plotId, reconcileSliceSave } from '../game/slice/sliceSave';
import { tilesOf } from '../game/slice/estateMap';
import { effectiveSeason, selectActionTool, useSliceStore } from './useSliceStore';

const plots = tilesOf('F');
const p0 = plots[0];
const id0 = plotId(p0.x, p0.y);

describe('P1-4 store bản thử: chạm ô → engine', () => {
  beforeEach(() => {
    localStorage.clear();
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

describe('P1-6 công tắc đổi mùa của bản thử', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T08:00:00+07:00')); // lịch thật: Xuân
    useSliceStore.getState().reset(Date.now());
  });

  it('đặt Đông: mùa áp dụng đổi, lúa (Xuân|Hạ|Thu) không còn trong túi hạt, gieo lúa bị từ chối', () => {
    const st = useSliceStore.getState();
    st.setSeasonOverride('DONG');
    const s = useSliceStore.getState();
    expect(effectiveSeason(s)).toBe('DONG');
    expect(s.seedId).toBeNull(); // cấp 1 chỉ có lúa
    s.setPlayerTile(p0);
    useSliceStore.getState().actNear();
    expect(useSliceStore.getState().toasts.at(-1)?.text).toBe('🍂 Mùa Đông chưa có giống nào gieo được ở cấp 1.');
    s.act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
    expect(useSliceStore.getState().save.tiles.find((t) => t.id === id0)?.itemId).toBeNull();
  });

  it('về lịch thật: mùa theo KT-17, chọn lại giống hợp lệ', () => {
    useSliceStore.getState().setSeasonOverride('DONG');
    useSliceStore.getState().setSeasonOverride(null);
    const s = useSliceStore.getState();
    expect(effectiveSeason(s)).toBe('XUAN');
    expect(s.seedId).toBe('CROP_01');
  });

  it('cây đã gieo không bị ảnh hưởng khi đổi mùa (GP-20)', () => {
    useSliceStore.getState().act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
    useSliceStore.getState().setSeasonOverride('DONG');
    vi.advanceTimersByTime(60 * 60_000);
    useSliceStore.getState().act([{ type: 'HARVEST', tileId: id0 }]);
    expect(useSliceStore.getState().save.inventory.CROP_01 ?? 0).toBeGreaterThan(0);
  });
});

describe('P1-7 lưu cục bộ bản thử', () => {
  const stored = () => JSON.parse(localStorage.getItem(SLICE_SAVE_KEY) ?? 'null');

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T08:00:00+07:00'));
    useSliceStore.getState().reset(Date.now());
  });

  it('mỗi thao tác được ghi kèm version; không ghi thông báo, hiệu ứng, vị trí', () => {
    useSliceStore.getState().act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
    const raw = stored();
    expect(raw.version).toBe(SLICE_SAVE_VERSION);
    expect(raw.state.save.tiles.find((t: { id: string }) => t.id === id0).itemId).toBe('CROP_01');
    expect(Object.keys(raw.state).sort()).toEqual(['save', 'seasonOverride', 'seedId']);
  });

  it('tải lại (rehydrate) giữ tiến trình và công tắc mùa', async () => {
    useSliceStore.getState().act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
    useSliceStore.getState().setSeasonOverride('THU');
    const gold = useSliceStore.getState().save.gold;
    const saved = localStorage.getItem(SLICE_SAVE_KEY) as string;
    useSliceStore.getState().reset(Date.now()); // giả lập mở lại trang: bộ nhớ về trạng thái đầu…
    localStorage.setItem(SLICE_SAVE_KEY, saved); // …còn bản lưu trên máy vẫn là bản cũ
    await useSliceStore.persist.rehydrate();
    const s = useSliceStore.getState();
    expect(s.save.gold).toBe(gold);
    expect(s.save.tiles.find((t) => t.id === id0)?.itemId).toBe('CROP_01');
    expect(s.seasonOverride).toBe('THU');
  });

  it('bản lưu hỏng hoặc khác phiên bản → chơi từ đầu, không lỗi', async () => {
    for (const bad of ['{rác', JSON.stringify({ version: SLICE_SAVE_VERSION, state: { save: { gold: 'x' } } }), JSON.stringify({ version: 99, state: { save: { gold: 1 } } })]) {
      useSliceStore.getState().act([{ type: 'PLANT', tileId: id0, itemId: 'CROP_01' }]);
      localStorage.setItem(SLICE_SAVE_KEY, bad);
      useSliceStore.getState().reset(Date.now());
      await useSliceStore.persist.rehydrate();
      const s = useSliceStore.getState();
      expect(s.save.gold).toBe(2500);
      expect(s.save.tiles.every((t) => t.itemId === null)).toBe(true);
    }
  });
});

describe('P1-7 khớp bản lưu với bản đồ', () => {
  it('thêm ô trống cho ô ruộng mới, bỏ ô không còn trên bản đồ, giữ ô cũ', () => {
    const fresh = newSliceSave(0);
    const kept = { ...fresh.tiles[0], itemId: 'CROP_01', plantedAt: 1, matureAt: 2 };
    const raw = { ...fresh, tiles: [kept, { ...fresh.tiles[1], id: 'P99_99' }] };
    const r = reconcileSliceSave(raw);
    expect(r?.tiles).toHaveLength(fresh.tiles.length);
    expect(r?.tiles[0]).toMatchObject({ id: kept.id, itemId: 'CROP_01' });
    expect(r?.tiles.some((t) => t.id === 'P99_99')).toBe(false);
    expect(r?.tiles[1].itemId).toBeNull();
  });

  it('thiếu trường bắt buộc → null', () => {
    expect(reconcileSliceSave(null)).toBeNull();
    expect(reconcileSliceSave({ tiles: [], gold: 1, level: 1 })).toBeNull();
    expect(reconcileSliceSave({ ...newSliceSave(0), tiles: 'x' })).toBeNull();
  });
});
