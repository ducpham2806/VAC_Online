import { FarmTileEntity } from '../data/types';

/**
 * Bố cục lưới nông trại 25 phân khu (M02.4 Khai Hoang) — nguồn chuẩn duy nhất.
 * Server cài cùng bố cục trong `supabase/migrations/0006_land_expansion.sql` (`_plot_order`):
 * sửa ở đây thì phải sửa cả SQL và test.
 *
 *   Hàng 1 Ruộng: ■ ■ ■ ■ ①   (y 0)
 *   Hàng 2 Vườn : ■ ■ ■ ■ ②   (y 1)
 *   Hàng 3 Ao   : ■ ■ ■ ■ ③   (y 2)
 *   Hàng 4 Ruộng: ④ ⑤ ⑥ ⑦ ⑧   (y 3)
 *   Hàng 5 Ao   : ⑨ ⑩ ⑪ ⑫ ⑬   (y 4)
 *
 * 12 ô đầu (■) là lưới gốc 4×3, giữ nguyên ID `TILE_1..12` và tọa độ để save cũ dùng tiếp.
 * Ô ①..⑬ mở lần lượt theo `wildPlotsUnlocked` (12 → 25).
 */

export type PlotZone = FarmTileEntity['zoneType'];

export interface PlotSlot {
  id: string;
  tileX: number;
  tileY: number;
  zoneType: PlotZone;
}

export const BASE_PLOTS = 12;
export const GRID_SIZE = 5;

const ROW_ZONES: PlotZone[] = ['LAND', 'ORCHARD', 'POND', 'LAND', 'POND'];

function buildLayout(): PlotSlot[] {
  const coords: Array<[number, number]> = [];
  for (let i = 0; i < BASE_PLOTS; i++) coords.push([i % 4, Math.floor(i / 4)]);
  coords.push([4, 0], [4, 1], [4, 2]);
  for (const y of [3, 4]) for (let x = 0; x < GRID_SIZE; x++) coords.push([x, y]);
  return coords.map(([tileX, tileY], i) => ({ id: `TILE_${i + 1}`, tileX, tileY, zoneType: ROW_ZONES[tileY] }));
}

/** 25 phân khu theo đúng thứ tự mở. */
export const PLOT_LAYOUT: readonly PlotSlot[] = buildLayout();

function emptyTile(slot: PlotSlot): FarmTileEntity {
  return {
    ...slot,
    itemId: null,
    plantedAt: null,
    matureAt: null,
    watered: false,
    mudApplied: false,
    isGolden: false,
    totalYield: 0,
    remainingYield: 0,
  };
}

function clampUnlocked(unlocked: number): number {
  return Math.max(BASE_PLOTS, Math.min(PLOT_LAYOUT.length, Math.floor(unlocked)));
}

/** Ô trống cho `unlocked` phân khu đầu tiên. */
export function createPlotTiles(unlocked: number = BASE_PLOTS): FarmTileEntity[] {
  return PLOT_LAYOUT.slice(0, clampUnlocked(unlocked)).map(emptyTile);
}

/**
 * Giữ nguyên các ô đang có (theo ID), bổ sung ô trống còn thiếu tới `unlocked`, sắp theo thứ tự mở.
 * Dùng cho save cũ: người đã khai hoang trước khi có lưới 5×5 nhận đất ngay.
 */
export function normalizePlotTiles(tiles: FarmTileEntity[], unlocked: number): FarmTileEntity[] {
  const byId = new Map(tiles.map((t) => [t.id, t]));
  return PLOT_LAYOUT.slice(0, clampUnlocked(unlocked)).map((slot) => {
    const t = byId.get(slot.id);
    return t ? { ...t, tileX: slot.tileX, tileY: slot.tileY } : emptyTile(slot);
  });
}

/** Ô sẽ mở ở lần khai hoang tiếp theo (null khi đã đủ 25). */
export function nextLockedPlot(unlocked: number): PlotSlot | null {
  return PLOT_LAYOUT[clampUnlocked(unlocked)] ?? null;
}

/** Thứ tự mở 1..25 của tọa độ, null nếu nằm ngoài lưới (khớp `_plot_order` trong SQL). */
export function plotOrder(tileX: number, tileY: number): number | null {
  const i = PLOT_LAYOUT.findIndex((p) => p.tileX === tileX && p.tileY === tileY);
  return i < 0 ? null : i + 1;
}
