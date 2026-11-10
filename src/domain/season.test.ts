import { describe, expect, it } from 'vitest';
import { canSowInSeason, SEASON_EPOCH_MS, seasonAt } from './season';

const DAY = 86_400_000;

describe('seasonAt — lịch 4 mùa theo tuần thật (GP-20)', () => {
  it('mốc là ngày 1 mùa Xuân năm 1, đổi mùa lúc 00:00 thứ Hai giờ VN', () => {
    expect(seasonAt(SEASON_EPOCH_MS)).toMatchObject({ season: 'XUAN', year: 1, day: 1 });
    expect(seasonAt(SEASON_EPOCH_MS + 7 * DAY - 1)).toMatchObject({ season: 'XUAN', day: 7 });
    expect(seasonAt(SEASON_EPOCH_MS + 7 * DAY)).toMatchObject({ season: 'HA', day: 1 });
    // 2026-01-12 00:00 +07:00 là thứ Hai
    expect(new Date(SEASON_EPOCH_MS + 7 * DAY).toISOString()).toBe('2026-01-11T17:00:00.000Z');
  });

  it('xoay vòng 28 ngày, năm tăng dần', () => {
    expect(seasonAt(SEASON_EPOCH_MS + 21 * DAY)).toMatchObject({ season: 'DONG', year: 1 });
    expect(seasonAt(SEASON_EPOCH_MS + 28 * DAY)).toMatchObject({ season: 'XUAN', year: 2, day: 1 });
  });

  it('trước mốc vẫn tính đúng (không âm ngày)', () => {
    const info = seasonAt(SEASON_EPOCH_MS - 1);
    expect(info).toMatchObject({ season: 'DONG', year: 0, day: 7 });
    expect(info.nextSeasonAt).toBe(SEASON_EPOCH_MS);
  });

  it('nextSeasonAt là đầu mùa kế', () => {
    expect(seasonAt(SEASON_EPOCH_MS + 3 * DAY).nextSeasonAt).toBe(SEASON_EPOCH_MS + 7 * DAY);
  });
});

describe('canSowInSeason', () => {
  it('chỉ gieo khi đúng mùa; không có danh sách = quanh năm', () => {
    expect(canSowInSeason(['XUAN', 'HA'], 'HA')).toBe(true);
    expect(canSowInSeason(['XUAN', 'HA'], 'DONG')).toBe(false);
    expect(canSowInSeason(undefined, 'DONG')).toBe(true);
  });
});
