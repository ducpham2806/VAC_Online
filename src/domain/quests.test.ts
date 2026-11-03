import { describe, expect, it } from 'vitest';
import { STORY_QUESTS } from '../data/quests';
import { FarmSave, MUD_ITEM_ID, applyMud, dredgePond, harvest, plant, water } from './farm';
import { createPlotTiles } from './farmGrid';
import { COUNTER, bumpCounter, firstMissingObjective, isQuestComplete, questProgress } from './quests';

const NOW = 1_000_000_000;
const ch = (id: string) => STORY_QUESTS.find((q) => q.id === id)!.objectives ?? [];

function save(patch: Partial<FarmSave> = {}): FarmSave {
  return {
    region: 'CENTRAL', level: 5, xp: 0, gold: 10_000, gems: 0, stamina: 50, maxStamina: 50,
    staminaUpdatedAt: NOW, fengShuiScore: 0, wildPlotsUnlocked: 12, pondMudCounter: 10,
    inventory: { [MUD_ITEM_ID]: 3 }, tiles: createPlotTiles(12), ...patch,
  };
}

function ok(r: ReturnType<typeof water>): FarmSave {
  if (!r.ok) throw new Error(r.message);
  return r.save;
}

describe('Mục tiêu nhiệm vụ Gia Phả (M03.5)', () => {
  it('Chương 1: tưới nước + thu Lúa Nước; Chương 2: vét bùn + bón bùn', () => {
    expect(ch('Q_CH1').map((o) => o.counter)).toEqual([COUNTER.WATER, COUNTER.harvest('CROP_01')]);
    expect(ch('Q_CH2').map((o) => o.counter)).toEqual([COUNTER.DREDGE, COUNTER.APPLY_MUD]);
  });

  it('GĐ2: Ch.3 = xây Bếp Củi + nấu 1 món; Ch.6 = thuê Chú Tư + dọn 1 món; Ch.7 = cấp 1 đồ thợ (S5, 17 C3)', () => {
    expect(ch('Q_CH3').map((o) => o.counter)).toEqual(['BUILD:MAC_02', 'COOK']);
    expect(ch('Q_CH6').map((o) => o.counter)).toEqual(['HIRE:WORK_01', 'SERVE_MEAL']);
    expect(ch('Q_CH7').map((o) => o.counter)).toEqual(['EQUIP_GEAR']);
  });

  it('chương thuộc GĐ3+ chưa có mục tiêu (chỉ kiểm cấp) cho tới khi mở GĐ đó', () => {
    expect(STORY_QUESTS.filter((q) => q.unlockStage > 2).every((q) => (q.objectives ?? []).length === 0)).toBe(true);
  });

  it('questProgress / isQuestComplete / firstMissingObjective', () => {
    const objs = ch('Q_CH1');
    expect(isQuestComplete(objs, {})).toBe(false);
    expect(firstMissingObjective(objs, { WATER: 3 })?.label).toContain('Lúa Nước');
    expect(questProgress(objs, { WATER: 3 })[0]).toMatchObject({ have: 1, target: 1, done: true });
    expect(isQuestComplete(objs, { WATER: 1, 'HARVEST:CROP_01': 1 })).toBe(true);
    expect(isQuestComplete([], undefined)).toBe(true);
  });

  it('bumpCounter cộng dồn, không sửa object cũ', () => {
    const a = { WATER: 1 };
    expect(bumpCounter(a, 'WATER')).toEqual({ WATER: 2 });
    expect(a).toEqual({ WATER: 1 });
    expect(bumpCounter(undefined, 'DREDGE', 2)).toEqual({ DREDGE: 2 });
  });
});

describe('Hành động nông trại tăng bộ đếm', () => {
  it('tưới → WATER, bón bùn → APPLY_MUD, thu hoạch → HARVEST:<id>, vét bùn → DREDGE', () => {
    let s = ok(plant(save(), 'TILE_1', 'CROP_01', 1, NOW));
    s = ok(water(s, 'TILE_1', NOW));
    expect(s.counters).toEqual({ WATER: 1 });
    s = ok(applyMud(s, 'TILE_1', NOW, () => 0.99));
    expect(s.counters?.APPLY_MUD).toBe(1);
    s = ok(harvest(s, 'TILE_1', NOW + 10 * 60_000));
    expect(s.counters?.['HARVEST:CROP_01']).toBe(1);
    s = ok(dredgePond(s, NOW));
    expect(s.counters?.DREDGE).toBe(1);
  });

  it('hành động thất bại không tăng bộ đếm', () => {
    const s = save();
    expect(water(s, 'TILE_1', NOW).ok).toBe(false); // ô trống
    expect(dredgePond(save({ stamina: 0 }), NOW).ok).toBe(false);
    expect(s.counters).toBeUndefined();
  });
});
