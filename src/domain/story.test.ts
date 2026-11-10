import { describe, expect, it } from 'vitest';
import { chapterGoals, choosePath, claimChapter, storyOf } from './story';
import type { FarmSave } from './farm';
import { newSliceSave } from '../game/slice/sliceSave';

const fresh = (patch: Partial<FarmSave> = {}): FarmSave => ({ ...newSliceSave(0), ...patch });
const ok = (r: ReturnType<typeof choosePath>) => {
  if (!r.ok) throw new Error(r.message);
  return r.save;
};
const allDone = (path: 'EMP' | 'PRAG'): FarmSave =>
  fresh({
    counters: { WATER: 1, 'HARVEST:CROP_01': 1 },
    estate: { cleared: [], repaired: ['HOUSE'], reclaimed: 0 },
    story: { path, claimed: [], neighbor: 0 },
  });

describe('TG-30 / TG-40 Chương 1 bản thử', () => {
  it('chọn hướng ở cảnh mở đầu: một lần, chưa trả thưởng', () => {
    const s = ok(choosePath(fresh(), 'EMP'));
    expect(storyOf(s).path).toBe('EMP');
    expect(s.gold).toBe(2500);
    expect(choosePath(s, 'PRAG').ok).toBe(false);
    expect(choosePath(fresh(), 'XYZ').ok).toBe(false);
  });

  it('mục tiêu: chọn hướng, tưới, gặt lúa, sửa Nhà', () => {
    expect(chapterGoals(fresh(), 1).map((g) => g.done)).toEqual([false, false, false, false]);
    expect(chapterGoals(allDone('EMP'), 1).every((g) => g.done)).toBe(true);
  });

  it('tình nghĩa: +600🪙 +15💎 +100 XP +30 Phong Thủy +3 Nghĩa Xóm', () => {
    const s = ok(claimChapter(allDone('EMP'), 1));
    expect(s.gold).toBe(3100);
    expect(s.gems).toBe(65);
    expect(s.level).toBe(2); // 100 XP: Lv.1 cần 60
    expect(s.fengShuiScore).toBe(30);
    expect(storyOf(s)).toMatchObject({ claimed: [1], neighbor: 3 });
  });

  it('thực dụng: thêm +350🪙, +10 Phong Thủy, +1 Nghĩa Xóm', () => {
    const s = ok(claimChapter(allDone('PRAG'), 1));
    expect(s.gold).toBe(2500 + 600 + 350);
    expect(s.fengShuiScore).toBe(10);
    expect(storyOf(s).neighbor).toBe(1);
  });

  it('từ chối: chưa đủ mục tiêu (báo mục còn thiếu), đã nhận, chương chưa mở', () => {
    const notHouse = { ...allDone('EMP'), estate: { cleared: [], repaired: [], reclaimed: 0 } };
    expect(claimChapter(notHouse, 1)).toMatchObject({ ok: false, message: '📜 Chưa xong: 🏠 Sửa Nhà chính để mở Sổ Gia Phả' });
    const once = ok(claimChapter(allDone('EMP'), 1));
    expect(claimChapter(once, 1).ok).toBe(false);
    expect(claimChapter(allDone('EMP'), 2).ok).toBe(false);
  });
});
