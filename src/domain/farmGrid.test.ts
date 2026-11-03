import { describe, expect, it } from 'vitest';
import { FarmSave, expandLand, harvest, plant } from './farm';
import { BASE_PLOTS, PLOT_LAYOUT, createPlotTiles, nextLockedPlot, normalizePlotTiles, plotOrder } from './farmGrid';

const NOW = 1_000_000_000;

function save(unlocked: number, patch: Partial<FarmSave> = {}): FarmSave {
  return {
    region: 'CENTRAL',
    level: 1,
    xp: 0,
    gold: 100_000,
    gems: 50,
    stamina: 50,
    maxStamina: 50,
    staminaUpdatedAt: NOW,
    fengShuiScore: 0,
    wildPlotsUnlocked: unlocked,
    pondMudCounter: 0,
    inventory: {},
    tiles: createPlotTiles(unlocked),
    ...patch,
  };
}

describe('Bố cục lưới 25 phân khu (M02.4)', () => {
  it('có 25 ô, không trùng ID hay tọa độ, nằm trong lưới 5×5', () => {
    expect(PLOT_LAYOUT).toHaveLength(25);
    expect(new Set(PLOT_LAYOUT.map((p) => p.id)).size).toBe(25);
    expect(new Set(PLOT_LAYOUT.map((p) => `${p.tileX},${p.tileY}`)).size).toBe(25);
    expect(PLOT_LAYOUT.every((p) => p.tileX >= 0 && p.tileX < 5 && p.tileY >= 0 && p.tileY < 5)).toBe(true);
  });

  it('12 ô đầu giữ đúng lưới gốc 4×3 (TILE_1..12, Ruộng / Vườn / Ao)', () => {
    PLOT_LAYOUT.slice(0, BASE_PLOTS).forEach((p, i) => {
      expect(p).toEqual({
        id: `TILE_${i + 1}`,
        tileX: i % 4,
        tileY: Math.floor(i / 4),
        zoneType: ['LAND', 'ORCHARD', 'POND'][Math.floor(i / 4)],
      });
    });
  });

  it('thứ tự mở: cột 5 của 3 hàng cũ → hàng 4 Ruộng → hàng 5 Ao', () => {
    const rest = PLOT_LAYOUT.slice(BASE_PLOTS).map((p) => [p.tileX, p.tileY, p.zoneType]);
    expect(rest).toEqual([
      [4, 0, 'LAND'], [4, 1, 'ORCHARD'], [4, 2, 'POND'],
      [0, 3, 'LAND'], [1, 3, 'LAND'], [2, 3, 'LAND'], [3, 3, 'LAND'], [4, 3, 'LAND'],
      [0, 4, 'POND'], [1, 4, 'POND'], [2, 4, 'POND'], [3, 4, 'POND'], [4, 4, 'POND'],
    ]);
  });

  it('plotOrder khớp thứ tự mở, ngoài lưới trả null', () => {
    expect(plotOrder(0, 0)).toBe(1);
    expect(plotOrder(3, 2)).toBe(12);
    expect(plotOrder(4, 0)).toBe(13);
    expect(plotOrder(0, 4)).toBe(21);
    expect(plotOrder(4, 4)).toBe(25);
    expect(plotOrder(5, 0)).toBeNull();
    expect(plotOrder(0, 5)).toBeNull();
  });

  it('nextLockedPlot: ô kế tiếp, null khi đủ 25', () => {
    expect(nextLockedPlot(12)?.id).toBe('TILE_13');
    expect(nextLockedPlot(24)?.id).toBe('TILE_25');
    expect(nextLockedPlot(25)).toBeNull();
  });

  it('normalizePlotTiles giữ cây đang trồng và bổ sung ô còn thiếu (save cũ đã khai hoang)', () => {
    const old = createPlotTiles(12).map((t) => (t.id === 'TILE_3' ? { ...t, itemId: 'CROP_01' } : t));
    const tiles = normalizePlotTiles(old, 15);
    expect(tiles).toHaveLength(15);
    expect(tiles.find((t) => t.id === 'TILE_3')?.itemId).toBe('CROP_01');
    expect(tiles.slice(12).map((t) => t.id)).toEqual(['TILE_13', 'TILE_14', 'TILE_15']);
    expect(tiles.slice(12).every((t) => t.itemId === null)).toBe(true);
  });

  it('createPlotTiles kẹp trong khoảng 12..25', () => {
    expect(createPlotTiles(3)).toHaveLength(12);
    expect(createPlotTiles(99)).toHaveLength(25);
  });
});

describe('Khai hoang thêm ô thật (offline)', () => {
  it('lần khai hoang đầu mở ô ① ở cột 5 hàng Ruộng và gieo được ngay', () => {
    const r = expandLand(save(12), NOW);
    if (!r.ok) throw new Error(r.message);
    expect(r.save.tiles).toHaveLength(13);
    expect(r.save.tiles[12]).toMatchObject({ id: 'TILE_13', tileX: 4, tileY: 0, itemId: null });
    expect(plant(r.save, 'TILE_13', 'CROP_01', 1, NOW).ok).toBe(true);
  });

  it('lần cuối mở ô ⑬ (4,4); ở 25/25 thì bị chặn, giữ nguyên lưới', () => {
    const r = expandLand(save(24), NOW);
    if (!r.ok) throw new Error(r.message);
    expect(r.save.tiles).toHaveLength(25);
    expect(r.save.tiles[24]).toMatchObject({ id: 'TILE_25', tileX: 4, tileY: 4, zoneType: 'POND' });
    expect(expandLand(r.save, NOW).ok).toBe(false);
  });

  it('ô chưa khai hoang không gieo được', () => {
    expect(plant(save(12), 'TILE_13', 'CROP_01', 1, NOW).ok).toBe(false);
  });

  // 2026-11-03 (`17` C4): chỉ thủy sản làm đầy bùn ao → thử bằng Cá Rô ở ô Ao mới.
  it('thu thủy sản ở ô Ao mới (hàng 5) cũng tăng độ bùn', () => {
    const base = save(21);
    const tiles = base.tiles.map((t) =>
      t.id === 'TILE_21' ? { ...t, itemId: 'AQUA_01', matureAt: NOW - 1, totalYield: 1, remainingYield: 1, harvestsLeft: 1 } : t
    );
    const r = harvest({ ...base, tiles }, 'TILE_21', NOW);
    if (!r.ok) throw new Error(r.message);
    expect(r.save.pondMudCounter).toBe(1);
  });
});
