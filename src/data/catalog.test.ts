import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GAME_CATALOG } from './masterData';

const VAC_PREFIX = /^(CROP|ANI|AQUA)_/;
const CSV_PATH = resolve(__dirname, '../../04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv');

/** Tách 1 dòng CSV đơn giản (hỗ trợ trường có dấu ngoặc kép). */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function loadCsvRows(): Record<string, string>[] {
  const lines = readFileSync(CSV_PATH, 'utf-8').split(/\r?\n/).filter((l) => l.trim() !== '');
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']));
  });
}

describe('GAME_CATALOG — toàn vẹn dữ liệu gốc', () => {
  it('mọi ID là duy nhất', () => {
    const ids = GAME_CATALOG.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('không có giá hoặc thời gian NaN / âm', () => {
    for (const item of GAME_CATALOG) {
      expect(Number.isFinite(item.buyCostGold), item.id).toBe(true);
      expect(Number.isFinite(item.baseSellGold), item.id).toBe(true);
      expect(item.buyCostGold, item.id).toBeGreaterThanOrEqual(0);
      expect(item.growOrCraftMinutes, item.id).toBeGreaterThanOrEqual(0);
    }
  });

  it('có đúng 81 loài V-A-C và mỗi loài đều gắn Đợt mở khóa', () => {
    const vac = GAME_CATALOG.filter((c) => VAC_PREFIX.test(c.id));
    expect(vac).toHaveLength(81);
    expect(vac.filter((c) => c.unlockWave === undefined).map((c) => c.id)).toEqual([]);
  });

  it('lũy kế loài V-A-C theo 5 Đợt là 23 → 45 → 63 → 76 → 81 (GDD 01 mục 3.2)', () => {
    const vac = GAME_CATALOG.filter((c) => VAC_PREFIX.test(c.id));
    const cumulative = [1, 2, 3, 4, 5].map(
      (wave) => vac.filter((c) => (c.unlockWave ?? 99) <= wave).length
    );
    expect(cumulative).toEqual([23, 45, 63, 76, 81]);
  });
});

describe('CSV 04_MASTER_DATA ↔ GAME_CATALOG', () => {
  const rows = loadCsvRows();
  const byId = new Map(GAME_CATALOG.map((c) => [c.id, c]));

  it('mọi ID trong CSV đều có trong GAME_CATALOG', () => {
    const missing = rows.map((r) => r.ID).filter((id) => !byId.has(id));
    expect(missing).toEqual([]);
  });

  it('cột Unlock_Wave trong CSV khớp với unlockWave trong code', () => {
    const mismatched = rows
      .filter((r) => byId.has(r.ID))
      .filter((r) => (r.Unlock_Wave || undefined) !== byId.get(r.ID)?.unlockWave?.toString())
      .map((r) => r.ID);
    expect(mismatched).toEqual([]);
  });
});
