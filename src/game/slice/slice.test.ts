import { describe, expect, it } from 'vitest';
import { ESTATE_COLS, ESTATE_ROWS, boundsOf, isWalkable, spawnTile, tilesOf } from './estateMap';
import { facing, inJoystickZone, isDrag, joystickVector, JOYSTICK_RADIUS_PX } from './gesture';
import { findPath, pathToward } from './pathfinding';

describe('P1-3 bản đồ điền trang', () => {
  it('mọi hàng cùng độ rộng, viền kín', () => {
    for (const row of ESTATE_ROWS) expect(row.length).toBe(ESTATE_COLS);
    expect(ESTATE_ROWS[0]).toMatch(/^#+$/);
    expect(ESTATE_ROWS[ESTATE_ROWS.length - 1]).toMatch(/^#+$/);
  });

  it('có đủ hạng mục của LT-03: nhà, giếng, ao, ruộng, sân chuồng gà, chỗ xuất hiện', () => {
    for (const ch of ['H', 'W', 'P', 'F', ',', 'S']) expect(tilesOf(ch).length).toBeGreaterThan(0);
    expect(boundsOf('H')).toEqual({ x: 11, y: 2, w: 4, h: 3 });
  });

  it('từ chỗ xuất hiện đi tới được mọi ô ruộng và sân chuồng gà', () => {
    const s = spawnTile();
    for (const t of [...tilesOf('F'), ...tilesOf(',')]) expect(findPath(s, t, isWalkable)).not.toBeNull();
  });
});

describe('P1-3 tìm đường', () => {
  const open = () => true;

  it('đường thẳng có độ dài Manhattan + 1, gồm cả 2 đầu', () => {
    const p = findPath({ x: 0, y: 0 }, { x: 3, y: 2 }, open);
    expect(p).toHaveLength(6);
    expect(p?.[0]).toEqual({ x: 0, y: 0 });
    expect(p?.[5]).toEqual({ x: 3, y: 2 });
  });

  it('vòng qua tường, không đi chéo xuyên góc', () => {
    // tường dọc x=1 từ y=0..2, chừa lối ở y=3
    const wall = (x: number, y: number) => x >= 0 && y >= 0 && x < 4 && y < 4 && !(x === 1 && y < 3);
    const p = findPath({ x: 0, y: 0 }, { x: 2, y: 0 }, wall);
    expect(p).not.toBeNull();
    expect(p?.some((t) => t.x === 1 && t.y < 3)).toBe(false);
    for (let i = 1; i < (p?.length ?? 0); i++) {
      const a = p![i - 1];
      const b = p![i];
      expect(Math.abs(a.x - b.x) + Math.abs(a.y - b.y)).toBe(1);
    }
  });

  it('đích bị chặn hoặc bị cô lập → null', () => {
    expect(findPath({ x: 0, y: 0 }, { x: 5, y: 5 }, (x, y) => !(x === 5 && y === 5))).toBeNull();
    const island = (x: number, y: number) => x >= 0 && y >= 0 && x < 10 && y < 10 && x !== 5;
    expect(findPath({ x: 0, y: 0 }, { x: 8, y: 0 }, island)).toBeNull();
  });

  it('chạm vào giữa nhà → đi tới ô sát nhà gần nhất (reachedTarget = false)', () => {
    const r = pathToward(spawnTile(), { x: 12, y: 3 }, isWalkable);
    expect(r).not.toBeNull();
    expect(r?.reachedTarget).toBe(false);
    const end = r!.path[r!.path.length - 1];
    expect(isWalkable(end.x, end.y)).toBe(true);
    const touchesHouse = tilesOf('H').some((h) => Math.max(Math.abs(h.x - end.x), Math.abs(h.y - end.y)) === 1);
    expect(touchesHouse).toBe(true);
  });
});

describe('P1-3 phân loại chạm (UI-20)', () => {
  it('vùng joystick: góc dưới trái 1/3 rộng × 40% cao', () => {
    expect(inJoystickZone(100, 700, 1280, 720)).toBe(true);
    expect(inJoystickZone(500, 700, 1280, 720)).toBe(false);
    expect(inJoystickZone(100, 300, 1280, 720)).toBe(false);
  });

  it('dịch quá 12 px là kéo', () => {
    expect(isDrag(8, 8)).toBe(false);
    expect(isDrag(10, 10)).toBe(true);
  });

  it('joystick: vùng chết, độ lớn ≤ 1, núm kẹp trong bán kính', () => {
    expect(joystickVector(4, 3)).toMatchObject({ vx: 0, vy: 0 });
    const v = joystickVector(200, 0);
    expect(v.vx).toBeCloseTo(1);
    expect(v.knobX).toBeCloseTo(JOYSTICK_RADIUS_PX);
  });

  it('hướng nhìn theo trục lớn hơn, đứng yên giữ hướng cũ', () => {
    expect(facing(1, 0.2, 'down')).toBe('right');
    expect(facing(-0.1, -1, 'down')).toBe('up');
    expect(facing(0, 0, 'left')).toBe('left');
  });
});
