/**
 * P1-3 — bản đồ điền trang bản thử (LT-03): lưới 32×32 (AR-20), Bắc Bộ.
 * Dữ liệu thuần, không import Phaser — scene đọc để vẽ, tìm đường đọc để biết ô nào đi được.
 *
 * Ký hiệu:
 *  .  cỏ             ,  sân đất (chuồng gà)     F  ô ruộng đã cuốc (đi được)
 *  w  đất hoang (đi được; cuốc mở ở P1-10, giá khai hoang KT-15)
 *  #  bờ rào/bụi     H  nhà (đổ nát)            W  giếng
 *  P  ao             T  gốc cây to              R  đá
 *  S  chỗ xuất hiện  (đi được)
 */
export const TILE = 32;

export const ESTATE_ROWS: readonly string[] = [
  '##############################',
  '#....TTT..............TTT....#',
  '#....TTT...HHHH.......TTT....#',
  '#....TTT...HHHH..............#',
  '#..........HHHH...WW.........#',
  '#.................WW.....PPPP#',
  '#.......................PPPPP#',
  '#....FFFwwww............PPPPP#',
  '#....FFFwwww.....S.......PPPP#',
  '#....wwwwwww.................#',
  '#....wwwwwww.......R.........#',
  '#............................#',
  '#..R..............,,,,,,.....#',
  '#.................,,,,,,.....#',
  '#.................,,,,,,..R..#',
  '#..TTT............,,,,,,.....#',
  '#..TTT.......................#',
  '##############################',
];

export const ESTATE_COLS = ESTATE_ROWS[0].length;
export const ESTATE_HEIGHT = ESTATE_ROWS.length;

const BLOCKED = new Set(['#', 'H', 'W', 'P', 'T', 'R']);

export interface TilePos {
  x: number;
  y: number;
}

export function tileAt(x: number, y: number): string {
  if (y < 0 || y >= ESTATE_HEIGHT || x < 0 || x >= ESTATE_COLS) return '#';
  return ESTATE_ROWS[y][x];
}

export function isWalkable(x: number, y: number): boolean {
  return !BLOCKED.has(tileAt(x, y));
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
