import { STORY_QUESTS, StoryQuest } from '../src/data/quests';

function sqlText(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function rowFor(q: StoryQuest): string {
  const objectives = `${sqlText(JSON.stringify(q.objectives ?? []))}::jsonb`;
  return `  (${[sqlText(q.id), q.chapterNo, q.unlockStage, q.minLevel, q.rewardGold, q.rewardGems, sqlText(q.chapter), objectives].join(', ')})`;
}

/** Sinh SQL seed cho public.quest_catalog từ STORY_QUESTS (src/data/quests.ts). */
export function buildQuestSeedSql(quests: StoryQuest[] = STORY_QUESTS): string {
  return `-- =============================================================================
-- FILE SINH TỰ ĐỘNG — KHÔNG SỬA TAY. Nguồn: src/data/quests.ts (STORY_QUESTS)
-- Sinh lại bằng: npm run seed:catalog
-- Chạy trong Supabase SQL Editor SAU migration 0007 (cột objectives). Idempotent (ON CONFLICT DO UPDATE).
-- =============================================================================

INSERT INTO public.quest_catalog (id, chapter_no, unlock_stage, min_level, reward_gold, reward_gems, title, objectives)
VALUES
${quests.map(rowFor).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  chapter_no = EXCLUDED.chapter_no,
  unlock_stage = EXCLUDED.unlock_stage,
  min_level = EXCLUDED.min_level,
  reward_gold = EXCLUDED.reward_gold,
  reward_gems = EXCLUDED.reward_gems,
  title = EXCLUDED.title,
  objectives = EXCLUDED.objectives;
`;
}

export const QUEST_SEED_PATH = 'supabase/seed/quest_catalog_seed.sql';
