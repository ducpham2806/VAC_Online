/**
 * TG-30 / TG-40 / GP-63 (QD-84) — Chương 1 Gia Phả của bản thử: chọn hướng ở cảnh mở đầu,
 * nhận thưởng khi đủ mục tiêu (tưới, gặt lúa — `src/data/quests.ts`) và đã sửa Nhà (mở Sổ Gia Phả, KT-18).
 * Thưởng lấy từ dữ liệu nhiệm vụ (`rewardGold`, `rewardGems`, `QUEST_XP_REWARD`, `QUEST_BRANCH_REWARDS`).
 */
import { QUEST_BRANCH_REWARDS, QUEST_XP_REWARD, STORY_QUESTS, type StoryQuest } from '../data/quests';
import { isRepaired } from './estate';
import type { FarmResult, FarmSave } from './farm';
import { applyXp } from './progression';
import { questProgress } from './quests';

export type StoryPath = 'EMP' | 'PRAG';

export interface StoryState {
  /** Lựa chọn ở cảnh mở đầu (TG-40); `null` = chưa xem cảnh. */
  path: StoryPath | null;
  /** Số chương đã nhận thưởng. */
  claimed: number[];
  /** Điểm Nghĩa Xóm. */
  neighbor: number;
}

export const emptyStory = (): StoryState => ({ path: null, claimed: [], neighbor: 0 });

export function storyOf(save: Pick<FarmSave, 'story'>): StoryState {
  const s = save.story;
  if (!s || typeof s !== 'object') return emptyStory();
  return {
    path: s.path === 'EMP' || s.path === 'PRAG' ? s.path : null,
    claimed: Array.isArray(s.claimed) ? s.claimed.filter((n): n is number => typeof n === 'number') : [],
    neighbor: typeof s.neighbor === 'number' ? s.neighbor : 0,
  };
}

/** Chương bản thử mở được (P1: chỉ Chương 1). */
export const SLICE_CHAPTERS: readonly number[] = [1];

export const chapterQuest = (no: number): StoryQuest | undefined => STORY_QUESTS.find((q) => q.chapterNo === no);

export interface ChapterGoal {
  label: string;
  done: boolean;
}

/** Mục tiêu Chương 1 của bản thử: chọn hướng + mục tiêu dữ liệu + sửa Nhà. */
export function chapterGoals(save: FarmSave, no: number): ChapterGoal[] {
  const q = chapterQuest(no);
  if (!q) return [];
  const story = storyOf(save);
  return [
    { label: '📜 Nghe chuyện Bác Bảy và trả lời Bá Kiến', done: story.path !== null },
    ...questProgress(q.objectives ?? [], save.counters).map((p) => ({ label: p.label, done: p.done })),
    { label: '🏠 Sửa Nhà chính để mở Sổ Gia Phả', done: isRepaired(save, 'HOUSE') },
  ];
}

const fail = (message: string): FarmResult => ({ ok: false, message });

/** Chọn hướng ở cảnh mở đầu: chỉ một lần, chưa có thưởng (thưởng trả khi xong chương). */
export function choosePath(save: FarmSave, path: string): FarmResult {
  if (path !== 'EMP' && path !== 'PRAG') return fail('⚠️ Lựa chọn không hợp lệ!');
  const story = storyOf(save);
  if (story.path) return fail('⚠️ Đã trả lời Bá Kiến rồi!');
  return {
    ok: true,
    save: { ...save, story: { ...story, path } },
    message: path === 'EMP' ? '🤝 Cháu giữ đất tổ tiên, tự cày trả nợ.' : '🪙 Cháu hẹn Bá Kiến mua lúa Hoàng Kim sau mười mùa vụ.',
  };
}

/** Nhận thưởng chương: đủ mục tiêu, chưa nhận. Thưởng = vàng/ngọc chương + XP + phần thưởng theo hướng đã chọn. */
export function claimChapter(save: FarmSave, no: number): FarmResult {
  const q = chapterQuest(no);
  if (!q || !SLICE_CHAPTERS.includes(no)) return fail('⚠️ Chương này chưa mở ở bản thử!');
  const story = storyOf(save);
  if (story.claimed.includes(no)) return fail('⚠️ Đã nhận thưởng chương này rồi!');
  const missing = chapterGoals(save, no).find((g) => !g.done);
  if (missing || !story.path) return fail(`📜 Chưa xong: ${missing?.label ?? 'chọn hướng'}`);
  const branch = QUEST_BRANCH_REWARDS[story.path];
  const progress = applyXp(save.level, save.xp, QUEST_XP_REWARD);
  const gold = q.rewardGold + branch.gold;
  return {
    ok: true,
    save: {
      ...save,
      gold: save.gold + gold,
      gems: save.gems + q.rewardGems,
      level: progress.level,
      xp: progress.xp,
      fengShuiScore: save.fengShuiScore + branch.fengShui,
      story: { ...story, claimed: [...story.claimed, no], neighbor: story.neighbor + branch.neighbor },
    },
    message: `📜 Xong Chương ${no}: +${gold} 🪙, +${q.rewardGems} 💎, +${QUEST_XP_REWARD} XP, +${branch.fengShui} Phong Thủy`,
  };
}
