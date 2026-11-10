import { describe, expect, it } from 'vitest';
import type { FarmTileEntity } from '../data/types';
import { BATCH_DRAG_MAX, batchFromDrag, growthStage, inReach, nearestActionablePlot, plotAction, toolForPlot, toolForTarget } from './tools';

const NOW = 1_000_000;
const tile = (id: string, x: number, y: number, patch: Partial<FarmTileEntity> = {}): FarmTileEntity => ({
  id,
  tileX: x,
  tileY: y,
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
});
const growing = (id: string, x: number, y: number, watered = false) =>
  tile(id, x, y, { itemId: 'CROP_01', plantedAt: NOW - 10, matureAt: NOW + 100, watered });
const ripe = (id: string, x: number, y: number) => tile(id, x, y, { itemId: 'CROP_01', plantedAt: NOW - 100, matureAt: NOW - 1 });

describe('GP-02 công cụ tự chọn', () => {
  it('ô trống → túi hạt, đang lớn chưa tưới → bình tưới, chín → liềm, đã tưới chưa chín → không có việc', () => {
    expect(toolForPlot(tile('a', 0, 0), NOW)).toBe('SEED');
    expect(toolForPlot(growing('a', 0, 0), NOW)).toBe('WATER');
    expect(toolForPlot(ripe('a', 0, 0), NOW)).toBe('SICKLE');
    expect(toolForPlot(growing('a', 0, 0, true), NOW)).toBe('NONE');
  });

  it('đối tượng khác: đất hoang → cuốc, chuồng → thức ăn, ao → cần câu, đá/cây → rìu, đất trống → không', () => {
    expect(toolForTarget('WILD', undefined, NOW)).toBe('HOE');
    expect(toolForTarget('COOP', undefined, NOW)).toBe('FEED');
    expect(toolForTarget('POND', undefined, NOW)).toBe('ROD');
    expect(toolForTarget('ROCK', undefined, NOW)).toBe('AXE');
    expect(toolForTarget('TREE', undefined, NOW)).toBe('AXE');
    expect(toolForTarget('GROUND', undefined, NOW)).toBe('NONE');
    expect(toolForTarget('PLOT', undefined, NOW)).toBe('NONE');
  });

  it('túi hạt mà chưa chọn giống → không tạo thao tác; công cụ chưa có luật → null', () => {
    expect(plotAction('SEED', 'a', null)).toBeNull();
    expect(plotAction('SEED', 'a', 'CROP_01')).toEqual({ type: 'PLANT', tileId: 'a', itemId: 'CROP_01' });
    expect(plotAction('HOE', 'a', 'CROP_01')).toBeNull();
  });
});

describe('KT-16 kéo làm cả loạt', () => {
  it('công cụ chốt theo ô đầu, bỏ ô khác loại và ô trùng', () => {
    const tiles = [ripe('a', 0, 0), growing('b', 1, 0), ripe('c', 2, 0)];
    const r = batchFromDrag(['a', 'b', 'a', 'c'], tiles, NOW, 'CROP_01');
    expect(r.tool).toBe('SICKLE');
    expect(r.actions).toEqual([
      { type: 'HARVEST', tileId: 'a' },
      { type: 'HARVEST', tileId: 'c' },
    ]);
  });

  it(`không quá ${BATCH_DRAG_MAX} ô mỗi lượt kéo`, () => {
    const tiles = Array.from({ length: 20 }, (_, i) => tile(`t${i}`, i, 0));
    const r = batchFromDrag(tiles.map((t) => t.id), tiles, NOW, 'CROP_01');
    expect(r.actions).toHaveLength(BATCH_DRAG_MAX);
  });

  it('ô đầu không có việc → không làm gì cả loạt', () => {
    const tiles = [growing('a', 0, 0, true), ripe('b', 1, 0)];
    expect(batchFromDrag(['a', 'b'], tiles, NOW, null).actions).toEqual([]);
  });
});

describe('tầm làm việc và nút hành động (UI-20)', () => {
  it('tầm 1 ô kể cả chéo', () => {
    expect(inReach(5, 5, 6, 6)).toBe(true);
    expect(inReach(5, 5, 7, 5)).toBe(false);
  });

  it('ưu tiên ô đang đứng, rồi ô gần nhất có việc; ngoài tầm → null', () => {
    const tiles = [growing('done', 5, 5, true), ripe('near', 6, 5), tile('far', 9, 9)];
    expect(nearestActionablePlot(tiles, 5, 5, NOW)).toMatchObject({ tile: { id: 'near' }, tool: 'SICKLE' });
    expect(nearestActionablePlot([tile('here', 5, 5), ...tiles], 5, 5, NOW)).toMatchObject({ tile: { id: 'here' }, tool: 'SEED' });
    expect(nearestActionablePlot(tiles, 0, 0, NOW)).toBeNull();
  });
});

describe('giai đoạn hình của cây', () => {
  it('0 → 1 → 2 theo tiến độ, 3 khi chín; ô trống là 0', () => {
    const t = tile('a', 0, 0, { itemId: 'CROP_01', plantedAt: 0, matureAt: 300 });
    expect(growthStage(t, 50)).toBe(0);
    expect(growthStage(t, 150)).toBe(1);
    expect(growthStage(t, 250)).toBe(2);
    expect(growthStage(t, 300)).toBe(3);
    expect(growthStage(tile('b', 0, 0), 999)).toBe(0);
  });
});
