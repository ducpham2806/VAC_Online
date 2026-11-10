/**
 * P1-3 — tìm đường A* trên lưới ô (UI-20: chạm đất trống → nhân vật tự đi tới;
 * chạm vật cản/đối tượng → đi tới ô kề gần nhất). Hàm thuần, không phụ thuộc Phaser.
 */
import type { TilePos } from './estateMap';

export type Walkable = (x: number, y: number) => boolean;

const DIRS: readonly TilePos[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const key = (t: TilePos) => `${t.x},${t.y}`;
const manhattan = (a: TilePos, b: TilePos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/**
 * Đường đi 4 hướng từ `from` tới `to` (gồm cả 2 đầu). `null` nếu không tới được.
 * `maxNodes` chặn trường hợp bản đồ lớn bất thường.
 */
export function findPath(from: TilePos, to: TilePos, walkable: Walkable, maxNodes = 4000): TilePos[] | null {
  if (!walkable(to.x, to.y)) return null;
  if (from.x === to.x && from.y === to.y) return [from];
  const open: TilePos[] = [from];
  const g = new Map<string, number>([[key(from), 0]]);
  const f = new Map<string, number>([[key(from), manhattan(from, to)]]);
  const came = new Map<string, TilePos>();
  const closed = new Set<string>();
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) {
      if ((f.get(key(open[i])) ?? Infinity) < (f.get(key(open[bi])) ?? Infinity)) bi = i;
    }
    const cur = open.splice(bi, 1)[0];
    const ck = key(cur);
    if (cur.x === to.x && cur.y === to.y) {
      const path = [cur];
      let k = ck;
      while (came.has(k)) {
        const prev = came.get(k) as TilePos;
        path.unshift(prev);
        k = key(prev);
      }
      return path;
    }
    closed.add(ck);
    if (closed.size > maxNodes) return null;
    for (const d of DIRS) {
      const n = { x: cur.x + d.x, y: cur.y + d.y };
      const nk = key(n);
      if (closed.has(nk) || !walkable(n.x, n.y)) continue;
      const ng = (g.get(ck) ?? 0) + 1;
      if (ng < (g.get(nk) ?? Infinity)) {
        came.set(nk, cur);
        g.set(nk, ng);
        f.set(nk, ng + manhattan(n, to));
        if (!open.some((o) => o.x === n.x && o.y === n.y)) open.push(n);
      }
    }
  }
  return null;
}

/**
 * Đích bị chặn (nhà, giếng, ao, cây…) → đi tới ô kề đi được có đường ngắn nhất.
 * Trả cả ô đích gốc để scene biết người chơi đang nhắm vào đối tượng nào.
 */
export function pathToward(
  from: TilePos,
  target: TilePos,
  walkable: Walkable,
  maxRing = 4,
): { path: TilePos[]; reachedTarget: boolean } | null {
  const direct = findPath(from, target, walkable);
  if (direct) return { path: direct, reachedTarget: true };
  // Đích nằm giữa một khối (nhà 4×3, ao…) thì ô kề cũng bị chặn: mở rộng dần từng vòng,
  // dừng ở vòng đầu tiên có ô đi tới được, chọn đường ngắn nhất trong vòng đó.
  let best: TilePos[] | null = null;
  for (let r = 1; r <= maxRing && !best; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const p = findPath(from, { x: target.x + dx, y: target.y + dy }, walkable);
        if (p && (!best || p.length < best.length)) best = p;
      }
    }
  }
  return best ? { path: best, reachedTarget: false } : null;
}
