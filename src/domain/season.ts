import type { Season } from '../data/types';

/**
 * Lịch mùa vụ chung toàn server (docs/01_GAMEPLAY GP-20, hằng số ở docs/03_KINH_TE KT-17).
 * Mốc: thứ Hai 05/01/2026 00:00 giờ Việt Nam (UTC+7) là ngày đầu mùa Xuân năm 1.
 * Mỗi mùa 7 ngày thật, một năm game 28 ngày thật. Hàm thuần: `nowMs` là tham số.
 */
export const SEASON_ORDER: readonly Season[] = ['XUAN', 'HA', 'THU', 'DONG'];
export const SEASON_EPOCH_MS = Date.UTC(2026, 0, 4, 17, 0, 0); // 2026-01-05 00:00 +07:00
export const SEASON_LENGTH_DAYS = 7;
const DAY_MS = 86_400_000;
const SEASON_MS = SEASON_LENGTH_DAYS * DAY_MS;

export interface SeasonInfo {
  season: Season;
  /** Năm game, bắt đầu từ 1. */
  year: number;
  /** Ngày trong mùa, 1..7. */
  day: number;
  /** Mốc bắt đầu mùa kế tiếp (ms). */
  nextSeasonAt: number;
}

export function seasonAt(nowMs: number): SeasonInfo {
  const elapsed = nowMs - SEASON_EPOCH_MS;
  const seasonIndex = Math.floor(elapsed / SEASON_MS);
  const inYear = ((seasonIndex % 4) + 4) % 4;
  const year = Math.floor(seasonIndex / 4) + 1;
  const sinceSeasonStart = elapsed - seasonIndex * SEASON_MS;
  return {
    season: SEASON_ORDER[inYear],
    year,
    day: Math.floor(sinceSeasonStart / DAY_MS) + 1,
    nextSeasonAt: SEASON_EPOCH_MS + (seasonIndex + 1) * SEASON_MS,
  };
}

/**
 * Gieo được loài này trong mùa hiện tại không. Loài không có danh sách mùa (vật nuôi, thủy sản) = quanh năm.
 * Cây đã gieo không bị ảnh hưởng khi đổi mùa (GP-20) — hàm này chỉ dùng lúc gieo.
 */
export function canSowInSeason(seasons: readonly Season[] | undefined, season: Season): boolean {
  return seasons === undefined || seasons.length === 0 || seasons.includes(season);
}
