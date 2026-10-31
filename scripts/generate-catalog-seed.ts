import { writeFileSync } from 'node:fs';
import { CATALOG_SEED_PATH, buildCatalogSeedSql } from './catalogSeed';
import { QUEST_SEED_PATH, buildQuestSeedSql } from './questSeed';

writeFileSync(CATALOG_SEED_PATH, buildCatalogSeedSql(), 'utf-8');
writeFileSync(QUEST_SEED_PATH, buildQuestSeedSql(), 'utf-8');
console.log(`Đã ghi ${CATALOG_SEED_PATH} và ${QUEST_SEED_PATH}`);
