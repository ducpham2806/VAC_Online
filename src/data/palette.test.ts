import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Bảng 64 màu chính thức (docs/05_ART_AUDIO AR-10, PO chốt 2026-11-02). Nguồn chuẩn: art/palette/vac_base.gpl */
const GPL = readFileSync(resolve(process.cwd(), 'art/palette/vac_base.gpl'), 'utf-8');
const colors = GPL.split('\n')
  .map((l) => l.trim().split(/\s+/))
  .filter((p) => p.length >= 3 && p.slice(0, 3).every((n) => /^\d+$/.test(n)))
  .map((p) => p.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase());

/** 19 màu gốc của 05 mục 1.1–1.2 phải được giữ nguyên. */
const ORIGINAL_19 = [
  '3D2314', '1B3B2B', '23192D',
  '7FB800', 'C85A32', '5C6B73', 'F4A7B9',
  'F5B700', '5E4B56', '8D3B24', '2EC4B6',
  '8AC926', 'C99E67', 'FFB703', '2E8B8D',
  '9B5DE5', 'FFD166', 'F15BB5', 'D62828',
];

describe('Bảng 64 màu (art/palette/vac_base.gpl)', () => {
  it('đúng 64 màu, không trùng, giá trị RGB hợp lệ', () => {
    expect(colors).toHaveLength(64);
    expect(new Set(colors).size).toBe(64);
    expect(colors.every((c) => /^[0-9A-F]{6}$/.test(c))).toBe(true);
  });

  it('giữ đủ 19 màu gốc của 05, có viền ấm #3D2314', () => {
    for (const c of ORIGINAL_19) expect(colors).toContain(c);
  });

  it('không có đen tuyền #000000 và không có màu nền tách #FF00FF', () => {
    expect(colors).not.toContain('000000');
    expect(colors).not.toContain('FF00FF');
  });

  it('mã hex ghi chú khớp đúng giá trị RGB của từng dòng', () => {
    const lines = GPL.split('\n').filter((l) => /^\s*\d+\s+\d+\s+\d+\s+#/.test(l));
    for (const l of lines) {
      const [r, g, b, hex] = l.trim().split(/\s+/);
      const expected = [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
      expect(hex.replace('#', '').toUpperCase()).toBe(expected);
    }
  });
});
