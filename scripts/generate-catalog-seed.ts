import { writeFileSync } from 'node:fs';
import { CATALOG_SEED_PATH, buildCatalogSeedSql } from './catalogSeed';

writeFileSync(CATALOG_SEED_PATH, buildCatalogSeedSql(), 'utf-8');
console.log(`Đã ghi ${CATALOG_SEED_PATH}`);
