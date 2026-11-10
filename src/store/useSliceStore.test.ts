import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SLICE_SAVE_KEY, SLICE_SAVE_VERSION, newSliceSave, plotId, reconcileSliceSave } from '../game/slice/sliceSave';
import { tilesOf } from '../game/slice/estateMap';
import { effectiveSeason, itemLabel, selectActionTool, useSliceStore } from './useSliceStore';

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
    // ô ruộng `F` + 5 chỗ nuôi ở ao (2 vịt, 3 cá); chỗ gà mở khi sửa Chuồng (P1-9)
    expect(s.save.tiles.filter((t) => t.zoneType === 'LAND')).toHaveLength(plots.length);
    expect(s.save.tiles.filter((t) => t.zoneType === 'POND')).toHaveLength(5);
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

  it('không có ô ruộng trong tầm, cạnh chuồng gà đổ nát (P1-10): nút hành động = sửa, hỏi lại trước khi tiêu vàng', () => {
    useSliceStore.getState().setPlayerTile({ x: 18, y: 12 }); // mép sân chuồng gà
    expect(selectActionTool(useSliceStore.getState())).toBe('HAMMER');
    const gold = useSliceStore.getState().save.gold;
    useSliceStore.getState().actNear();
    const s = useSliceStore.getState();
    expect(s.pending).toMatchObject({ title: 'Sửa Chuồng gà', action: { type: 'REPAIR', structureId: 'COOP' } });
    expect(s.save.gold).toBe(gold); // chưa xác nhận thì chưa trừ
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
    expect(Object.keys(raw.state).sort()).toEqual(['save', 'seasonOverride', 'seedId', 'tut']); // P1-11: thêm cờ hướng dẫn
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

describe('P1-10 điền trang trong store bản thử', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T08:00:00+07:00'));
    useSliceStore.getState().reset(Date.now());
  });

  it('chạm tảng đá: dọn ngay (không hỏi lại), +3 Đá, hiệu ứng rìu ở ô đá', () => {
    useSliceStore.getState().interactEstate({ x: 19, y: 10 });
    const s = useSliceStore.getState();
    expect(s.pending).toBeNull();
    expect(s.save.inventory.MAT_DA).toBe(3);
    expect(s.fx.at(-1)).toMatchObject({ x: 19, y: 10, tool: 'AXE' });
  });

  it('xác nhận sửa khi thiếu vật liệu: báo lỗi, không trừ vàng; đủ vật liệu thì sửa được', () => {
    const st = useSliceStore.getState();
    st.interactEstate({ x: 18, y: 4 }); // giếng
    useSliceStore.getState().confirmPending();
    let s = useSliceStore.getState();
    expect(s.pending).toBeNull();
    expect(s.toasts.at(-1)?.ok).toBe(false);
    expect(s.save.gold).toBe(2500);
    for (const at of [{ x: 19, y: 10 }, { x: 3, y: 12 }]) useSliceStore.getState().interactEstate(at); // 6 Đá
    useSliceStore.getState().interactEstate({ x: 18, y: 4 });
    useSliceStore.getState().confirmPending();
    s = useSliceStore.getState();
    expect(s.save.estate?.repaired).toEqual(['WELL']);
    expect(s.save.gold).toBe(2200);
    expect(s.save.inventory.MAT_DA).toBe(2);
    expect(s.fx.at(-1)).toMatchObject({ tool: 'HAMMER' });
  });

  it('thôi (hủy) thì không làm gì', () => {
    useSliceStore.getState().interactEstate({ x: 9, y: 7 }); // đất hoang vùng 1
    expect(useSliceStore.getState().pending?.title).toBe('Khai hoang vùng 1');
    useSliceStore.getState().cancelPending();
    const s = useSliceStore.getState();
    expect(s.pending).toBeNull();
    expect(s.save.estate?.reclaimed).toBe(0);
  });

  it('khai hoang vùng 1: thêm 8 ô ruộng trống vào bản thử', () => {
    useSliceStore.getState().interactEstate({ x: 9, y: 7 });
    useSliceStore.getState().confirmPending();
    const s = useSliceStore.getState();
    expect(s.save.tiles.filter((t) => t.zoneType === 'LAND')).toHaveLength(plots.length + 8);
    expect(s.save.gold).toBe(2000);
  });

  it('Kho hiện vật liệu bằng tên tiếng Việt', () => {
    expect(itemLabel('MAT_GO')).toBe('🪵 Gỗ');
    expect(itemLabel('MAT_DA')).toBe('🪨 Đá');
  });

  it('bản lưu v1 (chưa có điền trang) vẫn đọc được qua migrate', async () => {
    const v1 = { state: { save: newSliceSave(Date.now()), seedId: 'CROP_01', seasonOverride: null }, version: 1 };
    delete (v1.state.save as { estate?: unknown }).estate;
    v1.state.save.gold = 1234;
    localStorage.setItem(SLICE_SAVE_KEY, JSON.stringify(v1));
    await useSliceStore.persist.rehydrate();
    const s = useSliceStore.getState();
    expect(s.save.gold).toBe(1234);
    expect(s.save.estate).toEqual({ cleared: [], repaired: [], reclaimed: 0 });
  });
});

describe('P1-11 NPC, Gia Phả, hướng dẫn trong store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T08:00:00+07:00'));
    useSliceStore.getState().reset(Date.now());
  });

  it('đứng cạnh Bác Bảy: nút hành động = nói; bấm → mở hộp thoại, +20 tim, không bật thông báo nổi', () => {
    useSliceStore.getState().setPlayerTile({ x: 16, y: 7 });
    expect(selectActionTool(useSliceStore.getState())).toBe('HAND');
    const toasts = useSliceStore.getState().toasts.length;
    useSliceStore.getState().actNear();
    const s = useSliceStore.getState();
    expect(s.dialog?.npcId).toBe('BAC_BAY');
    expect(s.dialog?.line).toContain('+20 ❤️');
    expect(s.save.npcs?.BAC_BAY?.points).toBe(20);
    expect(s.toasts.length).toBe(toasts);
  });

  it('tặng quà trong hộp thoại: câu phản ứng hiện trong hộp thoại', () => {
    useSliceStore.setState((s) => ({ save: { ...s.save, inventory: { CROP_01: 1 } } }));
    useSliceStore.getState().giftTo('BAC_BAY', 'CROP_01');
    expect(useSliceStore.getState().dialog?.line).toContain('thích lắm');
  });

  it('cờ hướng dẫn: đi khỏi chỗ xuất hiện → moved; bán HTX thành công → sold', () => {
    const st = useSliceStore.getState();
    st.setPlayerTile({ x: 17, y: 8 }); // chỗ xuất hiện
    expect(useSliceStore.getState().tut.moved).toBe(false);
    useSliceStore.getState().setPlayerTile({ x: 16, y: 8 });
    expect(useSliceStore.getState().tut.moved).toBe(true);
    useSliceStore.getState().sell('CROP_01', 1); // Kho trống → lỗi
    expect(useSliceStore.getState().tut.sold).toBe(false);
    useSliceStore.setState((s) => ({ save: { ...s.save, inventory: { CROP_01: 1 } } }));
    useSliceStore.getState().sell('CROP_01', 1);
    expect(useSliceStore.getState().tut.sold).toBe(true);
  });

  it('chọn hướng ở cảnh mở đầu, rồi nhận Chương 1 khi đủ mục tiêu', () => {
    useSliceStore.getState().choosePath('EMP');
    useSliceStore.setState((s) => ({
      save: { ...s.save, counters: { WATER: 1, 'HARVEST:CROP_01': 1 }, estate: { cleared: [], repaired: ['HOUSE'], reclaimed: 0 } },
    }));
    useSliceStore.getState().claimChapter(1);
    const s = useSliceStore.getState();
    expect(s.save.story?.claimed).toEqual([1]);
    expect(s.save.gold).toBe(3100);
  });

  it('bản lưu v2 (chưa có NPC, Gia Phả, cờ hướng dẫn) vẫn đọc được', async () => {
    const v2 = { state: { save: newSliceSave(Date.now()), seedId: 'CROP_01', seasonOverride: null }, version: 2 };
    v2.state.save.gold = 777;
    localStorage.setItem(SLICE_SAVE_KEY, JSON.stringify(v2));
    await useSliceStore.persist.rehydrate();
    const s = useSliceStore.getState();
    expect(s.save.gold).toBe(777);
    expect(s.tut).toEqual({ moved: false, sold: false, hidden: false });
  });
});
