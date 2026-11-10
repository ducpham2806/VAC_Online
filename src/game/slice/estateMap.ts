/**
 * P1-3 — bản đồ điền trang bản thử (LT-03): lưới 32×32 (AR-20), Bắc Bộ.
 * Dữ liệu thuần, không import Phaser — scene đọc để vẽ, tìm đường đọc để biết ô nào đi được.
 *
 * Ký hiệu:
 *  .  cỏ             ,  sân đất (chuồng gà)     F  ô ruộng đã cuốc (đi được)
 *  w  đất hoang (đi được; khai hoang theo vùng — `src/domain/estate.ts`, KT-15)
 *  #  bờ rào/bụi     H  nhà (đổ nát)            W  giếng
 *  P  ao             T  gốc cây to              R  đá
 *  S  chỗ xuất hiện  (đi được)
 */
import { ESTATE_ROWS } from '../../data/estateLayout';
import { type EstateState, effectiveCharAt, emptyEstate } from '../../domain/estate';

export const TILE = 32;

export { ESTATE_ROWS };

export const ESTATE_COLS = ESTATE_ROWS[0].length;
export const ESTATE_HEIGHT = ESTATE_ROWS.length;

const BLOCKED = new Set(['#', 'H', 'W', 'P', 'T', 'R', 'D']);

export interface TilePos {
  x: number;
  y: number;
}

export function tileAt(x: number, y: number): string {
  if (y < 0 || y >= ESTATE_HEIGHT || x < 0 || x >= ESTATE_COLS) return '#';
  return ESTATE_ROWS[y][x];
}

const NO_ESTATE: EstateState = emptyEstate();

/** Đi được không, có tính điền trang (đá/gốc cây đã dọn thì đi qua được — P1-10). */
export function isWalkable(x: number, y: number, estate: EstateState = NO_ESTATE): boolean {
  return !BLOCKED.has(effectiveCharAt(x, y, estate));
}

/** Mọi ô có ký hiệu `ch`, theo thứ tự đọc (trái → phải, trên → dưới). */
export function tilesOf(ch: string): TilePos[] {
  const out: TilePos[] = [];
  ESTATE_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === ch) out.push({ x, y });
  });
  return out;
}

/** Khung bao (ô) của một nhóm ký hiệu, ví dụ nhà `H` → để đặt 1 sprite phủ cả khối. */
export function boundsOf(ch: string): { x: number; y: number; w: number; h: number } | null {
  const ts = tilesOf(ch);
  if (!ts.length) return null;
  const xs = ts.map((t) => t.x);
  const ys = ts.map((t) => t.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x + 1, h: Math.max(...ys) - y + 1 };
}

export function spawnTile(): TilePos {
  return tilesOf('S')[0];
}

export const worldToTile = (px: number, py: number): TilePos => ({ x: Math.floor(px / TILE), y: Math.floor(py / TILE) });
export const tileCenter = (t: TilePos): { x: number; y: number } => ({ x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 });
