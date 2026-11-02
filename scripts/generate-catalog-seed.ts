import { writeFileSync } from 'node:fs';
import { CATALOG_SEED_PATH, RECIPE_SEED_PATH, buildCatalogSeedSql, buildRecipeSeedSql } from './catalogSeed';
import { QUEST_SEED_PATH, buildQuestSeedSql } from './questSeed';

writeFileSync(CATALOG_SEED_PATH, buildCatalogSeedSql(), 'utf-8');
writeFileSync(QUEST_SEED_PATH, buildQuestSeedSql(), 'utf-8');
writeFileSync(RECIPE_SEED_PATH, buildRecipeSeedSql(), 'utf-8');
console.log(`Đã ghi ${CATALOG_SEED_PATH}, ${QUEST_SEED_PATH} và ${RECIPE_SEED_PATH}`);
