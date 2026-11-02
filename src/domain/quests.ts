/**
 * Mục tiêu nhiệm vụ Gia Phả đo bằng bộ đếm hành động (M03.5) — hàm thuần.
 * Server cài cùng luật trong `supabase/migrations/0007_quest_objectives.sql`
 * (bảng player_counters, _bump_counter, rpc_claim_story_quest): sửa ở đây thì sửa cả SQL và test.
 */

/** Khóa bộ đếm dùng chung client ↔ server. */
export const COUNTER = {
  WATER: 'WATER',
  DREDGE: 'DREDGE',
  APPLY_MUD: 'APPLY_MUD',
  harvest: (itemId: string) => `HARVEST:${itemId}`,
} as const;

export type Counters = Record<string, number>;

export interface QuestObjective {
  counter: string;
  target: number;
  label: string;
}

export interface ObjectiveProgress {
  label: string;
  have: number;
  target: number;
  done: boolean;
}

export function bumpCounter(counters: Counters | undefined, key: string, n = 1): Counters {
  const base = counters ?? {};
  return { ...base, [key]: (base[key] ?? 0) + n };
}

export function questProgress(objectives: readonly QuestObjective[], counters: Counters | undefined): ObjectiveProgress[] {
  return objectives.map((o) => {
    const have = Math.min(o.target, counters?.[o.counter] ?? 0);
    return { label: o.label, have, target: o.target, done: have >= o.target };
  });
}

export function isQuestComplete(objectives: readonly QuestObjective[], counters: Counters | undefined): boolean {
  return questProgress(objectives, counters).every((p) => p.done);
}

/** Mục tiêu đầu tiên chưa xong (để báo cho người chơi), null nếu đã đủ. */
export function firstMissingObjective(
  objectives: readonly QuestObjective[],
  counters: Counters | undefined
): ObjectiveProgress | null {
  return questProgress(objectives, counters).find((p) => !p.done) ?? null;
}
