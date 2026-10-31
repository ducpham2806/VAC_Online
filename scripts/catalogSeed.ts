import { GAME_CATALOG } from '../src/data/masterData';
import { CatalogItem } from '../src/data/types';

/** Chuỗi SQL an toàn (escape dấu nháy đơn) hoặc NULL. */
function sqlText(value: string | undefined | null): string {
  if (value === undefined || value === null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlInt(value: number | undefined | null, fallback: number | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return fallback === null ? 'NULL' : String(fallback);
  }
  return String(Math.round(value));
}

function rowFor(item: CatalogItem): string {
  return `  (${[
    sqlText(item.id),
    sqlText(item.category),
    sqlText(item.subGroup),
    sqlText(item.name),
    sqlText(item.region),
    sqlInt(item.unlockLevel, 1),
    sqlInt(item.growOrCraftMinutes, 0),
    sqlInt(item.buyCostGold, 0),
    sqlText(item.inputIngredients),
    sqlInt(item.yieldCount, 1),
    sqlInt(item.baseSellGold, 0),
    sqlInt(item.maxMarketGold ?? item.baseSellGold * 2, 0),
    sqlInt(item.xpReward, 0),
    sqlInt(item.staminaDelta, 0),
    sqlText(item.emoji),
    sqlText(item.description),
    sqlInt(item.unlockWave, null),
  ].join(', ')})`;
}

/** Sinh SQL seed cho bảng public.master_catalog từ GAME_CATALOG (nguồn chuẩn duy nhất). */
export function buildCatalogSeedSql(items: CatalogItem[] = GAME_CATALOG): string {
  return `-- =============================================================================
-- FILE SINH TỰ ĐỘNG — KHÔNG SỬA TAY. Nguồn: src/data/masterData.ts (GAME_CATALOG)
-- Sinh lại bằng: npm run seed:catalog
-- Chạy trong Supabase SQL Editor SAU migration 0003 (cần cột unlock_wave).
-- Idempotent: INSERT ... ON CONFLICT (id) DO UPDATE — không xóa dòng nào.
-- Tổng số thực thể: ${items.length}
-- =============================================================================

INSERT INTO public.master_catalog (
  id, category, sub_group, name_vn, region, unlock_level, time_minutes, buy_cost_gold,
  input_ingredients, yield_count, base_sell_gold, max_market_gold, xp_reward, stamina_delta,
  emoji, description, unlock_wave
)
VALUES
${items.map(rowFor).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  sub_group = EXCLUDED.sub_group,
  name_vn = EXCLUDED.name_vn,
  region = EXCLUDED.region,
  unlock_level = EXCLUDED.unlock_level,
  time_minutes = EXCLUDED.time_minutes,
  buy_cost_gold = EXCLUDED.buy_cost_gold,
  input_ingredients = EXCLUDED.input_ingredients,
  yield_count = EXCLUDED.yield_count,
  base_sell_gold = EXCLUDED.base_sell_gold,
  max_market_gold = EXCLUDED.max_market_gold,
  xp_reward = EXCLUDED.xp_reward,
  stamina_delta = EXCLUDED.stamina_delta,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  unlock_wave = EXCLUDED.unlock_wave,
  updated_at = NOW();
`;
}

export const CATALOG_SEED_PATH = 'supabase/seed/master_catalog_seed.sql';
