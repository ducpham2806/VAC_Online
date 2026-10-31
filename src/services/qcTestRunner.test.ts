import { describe, expect, it } from 'vitest';
import { runFullQCTestSuite } from './qcTestRunner';

// Chạy bộ QC in-game dưới jsdom. Khi test, Supabase không được cấu hình
// (supabase === null) nên không có tác dụng phụ ra mạng.
const results = runFullQCTestSuite();

describe('QC Test Suite (qcTestRunner.ts)', () => {
  it('có ít nhất 25 test case', () => {
    expect(results.length).toBeGreaterThanOrEqual(25);
  });

  for (const r of results) {
    it(`${r.id} — ${r.title}`, () => {
      expect(r.passed, `expected: ${r.expected}\nactual:   ${r.actual}`).toBe(true);
    });
  }
});
