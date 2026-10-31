import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG_SEED_PATH, buildCatalogSeedSql } from './catalogSeed';
import { QUEST_SEED_PATH, buildQuestSeedSql } from './questSeed';

const read = (p: string) => readFileSync(resolve(__dirname, '..', p), 'utf-8');

describe('seed SQL sinh tự động (nếu lệch: chạy npm run seed:catalog)', () => {
  it('master_catalog_seed.sql khớp GAME_CATALOG', () => {
    expect(read(CATALOG_SEED_PATH)).toBe(buildCatalogSeedSql());
  });
  it('quest_catalog_seed.sql khớp STORY_QUESTS', () => {
    expect(read(QUEST_SEED_PATH)).toBe(buildQuestSeedSql());
  });
});
