import { describe, expect, it } from 'vitest';
import { ESTATE_COLS, ESTATE_ROWS, boundsOf, isWalkable, spawnTile, tilesOf } from './estateMap';
import { facing, inJoystickZone, isDrag, joystickVector, JOYSTICK_RADIUS_PX } from './gesture';
import { findPath, pathToward } from './pathfinding';
import { newSliceSave, plotId, reconcileSliceSave, sowableSeeds, targetAt } from './sliceSave';
import { SLICE_CROPS, SLICE_RECIPES, SLICE_SPECIES } from '../../data/sliceContent';
import { GAME_CATALOG } from '../../data/masterData';
import { estateTargetAt } from './estateTarget';
import { SLICE_TUTORIAL, currentTutorialStep, tutorialTarget } from './sliceTutorial';
import { NPCS, NPC_IDS, npcAt } from '../../data/npcs';

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

describe('P1-10 bản đồ có tính điền trang', () => {
  it('đá đã dọn: đi qua được và không còn là đối tượng; vùng đã khai: thành ô ruộng', () => {
    const e = { cleared: ['R_19_10'], repaired: [], reclaimed: 1 };
    expect(isWalkable(19, 10)).toBe(false);
    expect(isWalkable(19, 10, e)).toBe(true);
    expect(targetAt(19, 10, e)).toBe('GROUND');
    expect(targetAt(9, 7)).toBe('WILD');
    expect(targetAt(9, 7, e)).toBe('PLOT');
    expect(targetAt(9, 9, e)).toBe('WILD');
  });

  it('bản lưu đã khai vùng 1: khớp lại giữ cây đã gieo trên ô mới', () => {
    const s = newSliceSave(0);
    const raw = {
      ...s,
      estate: { cleared: [], repaired: [], reclaimed: 1 },
      tiles: [...s.tiles, { ...s.tiles[0], id: plotId(9, 7), tileX: 9, tileY: 7, itemId: 'CROP_01' }],
    };
    const r = reconcileSliceSave(raw);
    expect(r?.tiles).toHaveLength(s.tiles.length + 8);
    expect(r?.tiles.find((t) => t.id === plotId(9, 7))?.itemId).toBe('CROP_01');
  });

  it('chạm đối tượng: đá → dọn ngay; giếng → hỏi lại; vùng 2 trước vùng 1 → nhắc; ao → chỉ chỗ thả cá, vịt', () => {
    const s = newSliceSave(0);
    expect(estateTargetAt(s, 19, 10)).toMatchObject({ tool: 'AXE', action: { type: 'CLEAR', obstacleId: 'R_19_10' } });
    expect(estateTargetAt(s, 6, 2)).toMatchObject({ action: { type: 'CLEAR', obstacleId: 'T_5_1' } });
    expect(estateTargetAt(s, 18, 4)?.confirm).toMatchObject({ title: 'Sửa Giếng', cost: '300 🪙 + 4 🪨 Đá' });
    expect(estateTargetAt(s, 6, 10)).toMatchObject({ action: null, hint: '⛏️ Khai hoang vùng 1 trước.' });
    expect(estateTargetAt(s, 9, 7)?.confirm).toMatchObject({ title: 'Khai hoang vùng 1', cost: '500 🪙 + 5 ⚡' });
    expect(estateTargetAt(s, 26, 7)?.hint).toContain('Thả cá'); // giữa ao: chỉ dẫn tới chỗ nuôi (P1-9)
    expect(estateTargetAt(s, 15, 11)).toBeNull();
    const repaired = { ...s, estate: { cleared: [], repaired: ['WELL' as const], reclaimed: 0 } };
    expect(estateTargetAt(repaired, 18, 4)).toMatchObject({ tool: 'NONE', action: null });
  });
});

describe('P1-11 hướng dẫn 8 bước (GP-62)', () => {
  it('bước đang làm theo trạng thái thật; xong cả 8 → null', () => {
    const s = newSliceSave(0);
    const v = { save: s, moved: false, sold: false };
    expect(currentTutorialStep(v)?.step.id).toBe('MOVE');
    expect(currentTutorialStep({ ...v, moved: true })?.step.id).toBe('PLANT');
    const watered = { ...s, counters: { WATER: 1 } };
    expect(currentTutorialStep({ ...v, moved: true, save: watered })?.step.id).toBe('HARVEST');
    const all = {
      ...s,
      counters: { WATER: 1, 'HARVEST:CROP_01': 1 },
      estate: { cleared: ['R_19_10'], repaired: ['WELL' as const, 'HOUSE' as const], reclaimed: 0 },
    };
    expect(currentTutorialStep({ save: all, moved: true, sold: false })?.step.id).toBe('SELL');
    expect(currentTutorialStep({ save: all, moved: true, sold: true })).toBeNull();
    expect(SLICE_TUTORIAL.length).toBeLessThanOrEqual(8);
  });

  it('NPC đứng trên ô đi được, không trùng ô ruộng/đối tượng', () => {
    for (const id of NPC_IDS) {
      const { x, y } = NPCS[id].tile;
      expect(isWalkable(x, y)).toBe(true);
      expect(targetAt(x, y)).toBe('GROUND');
      expect(npcAt(x, y)).toBe(id);
    }
  });
});

describe('P1-11 mũi tên hướng dẫn chỉ chỗ lấy vật liệu khi thiếu', () => {
  it('bước sửa giếng: thiếu Đá → chỉ tảng đá chưa dọn; đủ → chỉ giếng', () => {
    const s = newSliceSave(0);
    const well = SLICE_TUTORIAL.find((x) => x.id === 'WELL')!;
    const v = (inv: Record<string, number>, cleared: string[] = []) => ({
      save: { ...s, inventory: inv, estate: { cleared, repaired: [], reclaimed: 0 } },
      moved: true,
      sold: true,
    });
    expect(tutorialTarget(well, v({ MAT_DA: 3 }, ['R_19_10']))).toEqual({ x: 3, y: 12 });
    expect(tutorialTarget(well, v({ MAT_DA: 4 }))).toEqual({ x: 18, y: 4 });
    const house = SLICE_TUTORIAL.find((x) => x.id === 'HOUSE')!;
    expect(tutorialTarget(house, v({ MAT_DA: 2, MAT_GO: 5 }, ['T_5_1']))).toEqual({ x: 22, y: 1 });
  });
});

describe('Cây đa đầu làng (D) — không chặt', () => {
  it('chắn lối, không phải chướng ngại dọn được, chạm thì nhắc', () => {
    expect(isWalkable(27, 2)).toBe(false);
    expect(estateTargetAt(newSliceSave(0), 27, 2)).toMatchObject({ action: null, tool: 'NONE' });
    expect(estateTargetAt(newSliceSave(0), 27, 2)?.hint).toContain('không chặt');
  });
});

describe('P1-9 bộ 8 loài bản thử (QD-86)', () => {
  it('chỉ gieo được 5 cây của bản thử, đủ cấp và đúng mùa', () => {
    const save = { ...newSliceSave(0), level: 10 };
    expect(sowableSeeds(save, 'XUAN').map((c) => c.id)).toEqual([...SLICE_CROPS]);
    expect(sowableSeeds(save, 'THU').map((c) => c.id)).toEqual([...SLICE_CROPS]);
    expect(sowableSeeds(save, 'HA').map((c) => c.id)).toEqual(['CROP_01', 'CROP_02']);
    expect(sowableSeeds(save, 'DONG').map((c) => c.id)).toEqual(['CROP_03', 'CROP_04', 'CROP_05']);
    expect(sowableSeeds(newSliceSave(0), 'XUAN').map((c) => c.id)).toEqual(['CROP_01']);
  });

  it('mọi mã của bản thử có trong GAME_CATALOG, thuộc Đợt 1', () => {
    for (const id of [...SLICE_SPECIES, ...SLICE_RECIPES]) expect(GAME_CATALOG.find((c) => c.id === id)?.unlockWave).toBe(1);
  });
});
