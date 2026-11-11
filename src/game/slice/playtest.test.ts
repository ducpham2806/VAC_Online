import { describe, expect, it } from 'vitest';
import {
  MAX_EVENTS,
  type PlaytestLog,
  actionEvents,
  addEvent,
  markSent,
  newLog,
  parseLog,
  pendingEvents,
  startSession,
  tutorialMark,
} from './playtest';
import { D1_TARGET, median, playtestReport } from './playtestMetrics';
import { newSliceSave } from './sliceSave';

const DAY = 86_400_000;
/** 09:00 giờ VN ngày gốc (02:00 UTC). */
const T0 = Date.UTC(2026, 10, 12, 2, 0);

describe('P1-12 nhật ký chơi thử (LT-13)', () => {
  it('phiên mới tăng số phiên, sự kiện mang số phiên; quá trần thì bỏ cũ nhất, lùi mốc đã gửi', () => {
    let log = startSession(newLog('abc'), T0);
    expect(log.session).toBe(1);
    expect(log.events).toEqual([{ t: T0, s: 1, type: 'SESSION' }]);
    expect(startSession(log, T0 + 1000)).toBe(log); // mở lại ngay (StrictMode) → cùng phiên
    expect(startSession(log, T0 + 60_000).session).toBe(2);
    log = markSent(log, 1);
    expect(pendingEvents(log)).toEqual([]);
    for (let i = 0; i < MAX_EVENTS; i++) log = addEvent(log, { t: T0 + i, type: 'ACTION', name: 'PLANT', value: 1 });
    expect(log.events).toHaveLength(MAX_EVENTS);
    expect(log.sent).toBe(0);
    expect(pendingEvents(log)).toHaveLength(MAX_EVENTS);
  });

  it('đọc nhật ký: hỏng → null; bỏ sự kiện sai dạng; mốc đã gửi không vượt số sự kiện', () => {
    expect(parseLog(null)).toBeNull();
    expect(parseLog({ v: 2, player: 'x', events: [] })).toBeNull();
    const ok = parseLog({ v: 1, player: 'x', session: 2, sent: 9, events: [{ t: 1, s: 1, type: 'SESSION' }, { t: 'x' }] });
    expect(ok).toEqual({ v: 1, player: 'x', session: 2, sent: 1, events: [{ t: 1, s: 1, type: 'SESSION' }] });
  });

  it('gom thao tác thành công theo loại; thao tác lỗi không tính', () => {
    const evs = actionEvents(
      [
        { type: 'PLANT', tileId: 'a', itemId: 'CROP_01' },
        { type: 'PLANT', tileId: 'b', itemId: 'CROP_01' },
        { type: 'WATER', tileId: 'a' },
      ],
      [
        { index: 0, ok: true, message: '' },
        { index: 1, ok: true, message: '' },
        { index: 2, ok: false, message: '' },
      ],
      T0,
    );
    expect(evs).toEqual([{ t: T0, type: 'ACTION', name: 'PLANT', value: 2 }]);
  });

  it('bước hướng dẫn: chưa qua cảnh mở đầu → null; người mới → bước đầu', () => {
    const s = newSliceSave(T0);
    expect(tutorialMark(s, false, false)).toBeNull();
    expect(tutorialMark({ ...s, story: { path: 'EMP', claimed: [], neighbor: 0 } }, false, false)).toBe('MOVE');
  });
});

const player = (id: string, evs: [number, number, PlaytestLog['events'][number]['type'], string?, number?][]): PlaytestLog => ({
  v: 1,
  player: id,
  session: Math.max(...evs.map((e) => e[1])),
  sent: 0,
  events: evs.map(([t, s, type, name, value]) => ({ t, s, type, ...(name ? { name } : {}), ...(value !== undefined ? { value } : {}) })),
});

describe('P1-12 số liệu chơi thử', () => {
  const a = player('a', [
    [T0, 1, 'SESSION'],
    [T0 + 60_000, 1, 'TUTORIAL', 'MOVE'],
    [T0 + 10 * 60_000, 1, 'TUTORIAL', 'DONE'],
    [T0 + 12 * 60_000, 1, 'LEVEL', undefined, 3],
    [T0 + 12 * 60_000, 1, 'ACTION', 'PLANT', 6],
    [T0 + DAY, 2, 'SESSION'],
  ]);
  const b = player('b', [
    [T0, 1, 'SESSION'],
    [T0 + 4 * 60_000, 1, 'TUTORIAL', 'PLANT'],
    [T0 + 4 * 60_000, 1, 'ACTION', 'PLANT', 1],
  ]);
  const late = player('c', [[T0 + 2 * DAY, 1, 'SESSION']]); // mới vào, chưa đủ điều kiện D1

  it('D1 = người có sự kiện ở ngày hôm sau ÷ người đã qua hết ngày hôm sau', () => {
    const r = playtestReport([a, b, late], T0 + 3 * DAY);
    expect([r.players, r.d1Eligible, r.d1Returned, r.d1Rate, r.d1Pass]).toEqual([3, 2, 1, 0.5, true]);
    expect(D1_TARGET).toBe(0.5);
    expect(playtestReport([a], T0 + DAY).d1Rate).toBeNull(); // ngày hôm sau chưa hết
  });

  it('phễu hướng dẫn, thời lượng phiên đầu, cấp, thao tác', () => {
    const r = playtestReport([a, b], T0 + 3 * DAY);
    expect(r.funnel[0]).toEqual({ step: 'MOVE', reached: 2, rate: 1 });
    expect(r.funnel.find((f) => f.step === 'WATER')?.reached).toBe(1);
    expect(r.tutorialDoneRate).toBe(0.5);
    expect(r.medianFirstSessionMin).toBe(8); // 12 phút và 4 phút
    expect(r.medianSessions).toBe(1.5);
    expect(r.medianMaxLevel).toBe(2); // 3 và 1
    expect(r.actions).toEqual({ PLANT: 7 });
    expect(median([])).toBe(0);
  });
});
