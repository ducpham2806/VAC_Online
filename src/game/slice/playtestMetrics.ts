/**
 * P1-12 — tính số liệu chơi thử từ nhật ký của nhiều người (LT-13). Thuần, dùng cho `tools/qa/playtest-report.ts`.
 * Ngày tính theo giờ Việt Nam (`vnDay`), cùng ranh giới ngày với tim NPC.
 */
import { vnDay } from '../../domain/npc';
import type { PlaytestLog } from './playtest';
import { SLICE_TUTORIAL } from './sliceTutorial';

/** Cổng LT-02: ≥ 50% người chơi quay lại ngày hôm sau. */
export const D1_TARGET = 0.5;

export interface FunnelRow {
  step: string;
  reached: number;
  rate: number;
}

export interface PlaytestReport {
  players: number;
  /** Người đã qua hết ngày hôm sau (đủ điều kiện tính D1). */
  d1Eligible: number;
  d1Returned: number;
  /** null khi chưa ai đủ điều kiện. */
  d1Rate: number | null;
  d1Pass: boolean | null;
  /** Tỉ lệ người chơi đi tới từng bước hướng dẫn (bước đã làm xong = đã tới bước sau). */
  funnel: FunnelRow[];
  tutorialDoneRate: number;
  /** Trung vị thời lượng phiên đầu (phút): sự kiện cuối − sự kiện đầu của phiên. */
  medianFirstSessionMin: number;
  medianSessions: number;
  medianMaxLevel: number;
  /** Tổng số thao tác thành công theo loại. */
  actions: Record<string, number>;
}

export function median(xs: readonly number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** `now`: lúc tính; người chơi chỉ đủ điều kiện D1 khi ngày hôm sau của họ đã kết thúc. */
export function playtestReport(logs: readonly PlaytestLog[], now: number): PlaytestReport {
  const players = logs.filter((l) => l.events.length > 0);
  const today = vnDay(now);
  let eligible = 0;
  let returned = 0;
  const firstSession: number[] = [];
  const sessions: number[] = [];
  const levels: number[] = [];
  const actions: Record<string, number> = {};
  const stepIds = [...SLICE_TUTORIAL.map((s) => s.id), 'DONE'];
  const reachedIdx: number[] = [];

  for (const l of players) {
    const days = l.events.map((e) => vnDay(e.t));
    const d0 = Math.min(...days);
    if (d0 + 1 < today) {
      eligible++;
      if (days.includes(d0 + 1)) returned++;
    }
    const s1 = Math.min(...l.events.map((e) => e.s));
    const ts = l.events.filter((e) => e.s === s1).map((e) => e.t);
    firstSession.push((Math.max(...ts) - Math.min(...ts)) / 60_000);
    sessions.push(new Set(l.events.map((e) => e.s)).size);
    levels.push(Math.max(1, ...l.events.filter((e) => e.type === 'LEVEL').map((e) => e.value ?? 1)));
    for (const e of l.events) if (e.type === 'ACTION' && e.name) actions[e.name] = (actions[e.name] ?? 0) + (e.value ?? 1);
    const idx = l.events.filter((e) => e.type === 'TUTORIAL').map((e) => stepIds.indexOf(e.name ?? ''));
    reachedIdx.push(idx.length ? Math.max(...idx) : -1);
  }

  const n = players.length;
  const rate = (k: number) => (n ? k / n : 0);
  const funnel = stepIds.map((step, i) => {
    const reached = reachedIdx.filter((r) => r >= i).length;
    return { step, reached, rate: rate(reached) };
  });
  const d1Rate = eligible ? returned / eligible : null;
  return {
    players: n,
    d1Eligible: eligible,
    d1Returned: returned,
    d1Rate,
    d1Pass: d1Rate === null ? null : d1Rate >= D1_TARGET,
    funnel,
    tutorialDoneRate: funnel[funnel.length - 1].rate,
    medianFirstSessionMin: median(firstSession),
    medianSessions: median(sessions),
    medianMaxLevel: median(levels),
    actions,
  };
}
