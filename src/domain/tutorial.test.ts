import { describe, expect, it } from 'vitest';
import { TUTORIAL_STEPS, TutorialView, currentTutorialStep } from './tutorial';

function view(patch: Partial<TutorialView> = {}): TutorialView {
  return {
    level: 1,
    tiles: [{ itemId: null }, { itemId: null }],
    progressCounters: {},
    completedQuestIds: [],
    soldOnce: false,
    ...patch,
  };
}

const stepId = (v: TutorialView) => currentTutorialStep(v)?.step.id ?? null;

describe('Hướng dẫn tân thủ Chương 1–2 (8 bước)', () => {
  it('có 8 bước theo đúng thứ tự vòng chơi GĐ1', () => {
    expect(TUTORIAL_STEPS.map((s) => s.id)).toEqual([
      'PLANT', 'WATER', 'HARVEST', 'QUEST_1', 'SELL', 'LEVEL_3', 'MUD', 'QUEST_2',
    ]);
  });

  it('người chơi mới bắt đầu ở bước 1/8', () => {
    expect(currentTutorialStep(view())).toMatchObject({ index: 1, step: { id: 'PLANT' } });
  });

  it('đi lần lượt từng bước theo trạng thái game thật', () => {
    let v = view({ tiles: [{ itemId: 'CROP_01' }] });
    expect(stepId(v)).toBe('WATER');
    v = { ...v, progressCounters: { WATER: 1 } };
    expect(stepId(v)).toBe('HARVEST');
    v = { ...v, tiles: [{ itemId: null }], progressCounters: { WATER: 1, 'HARVEST:CROP_01': 1 } };
    expect(stepId(v)).toBe('QUEST_1');
    v = { ...v, completedQuestIds: ['Q_CH1'] };
    expect(stepId(v)).toBe('SELL');
    v = { ...v, soldOnce: true };
    expect(stepId(v)).toBe('LEVEL_3');
    v = { ...v, level: 3 };
    expect(stepId(v)).toBe('MUD');
    v = { ...v, progressCounters: { ...v.progressCounters, DREDGE: 1 } };
    expect(stepId(v)).toBe('MUD'); // còn thiếu bón bùn
    v = { ...v, progressCounters: { ...v.progressCounters, APPLY_MUD: 1 } };
    expect(stepId(v)).toBe('QUEST_2');
    v = { ...v, completedQuestIds: ['Q_CH1', 'Q_CH2'] };
    expect(currentTutorialStep(v)).toBeNull();
  });

  it('bước gieo coi như xong nếu đã từng tưới hoặc thu hoạch (ô đã trống lại)', () => {
    expect(stepId(view({ progressCounters: { WATER: 1 } }))).toBe('HARVEST');
    expect(stepId(view({ progressCounters: { WATER: 1, 'HARVEST:CROP_02': 2 } }))).toBe('QUEST_1');
  });

  it('người chơi cũ đã làm hết thì không hiện hướng dẫn', () => {
    expect(
      currentTutorialStep(
        view({
          level: 5,
          progressCounters: { WATER: 3, 'HARVEST:CROP_01': 4, DREDGE: 1, APPLY_MUD: 2 },
          completedQuestIds: ['Q_CH1', 'Q_CH2'],
          soldOnce: true,
        })
      )
    ).toBeNull();
  });
});
