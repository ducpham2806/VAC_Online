import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG_SEED_PATH, buildCatalogSeedSql } from './catalogSeed';

describe('supabase/seed/master_catalog_seed.sql', () => {
  it('khớp với GAME_CATALOG hiện tại (nếu lệch: chạy npm run seed:catalog)', () => {
    const onDisk = readFileSync(resolve(__dirname, '..', CATALOG_SEED_PATH), 'utf-8');
    expect(onDisk).toBe(buildCatalogSeedSql());
  });
});
