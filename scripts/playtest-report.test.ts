// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cli = fileURLToPath(new URL('../tools/qa/playtest-report.ts', import.meta.url));
const cutoff = '2026-11-24T00:00:00+07:00';
const privateMarker = 'synthetic-id-must-not-leak-';
const d0 = Date.parse('2026-11-22T01:00:00+07:00');
const d1 = Date.parse('2026-11-23T08:00:00+07:00');
const fixture = (matched: number, returns: number) => Array.from({ length: matched }, (_, i) => ({
  v: 1,
  player: `${privateMarker}${i}`,
  events: [{ t: d0, s: 1, type: 'SESSION' }, ...(i < returns ? [{ t: d1, s: 2, type: 'SESSION' }] : [])],
}));
const counts = (total: number, matches: number) => [
  '--d1-closed-starters', String(total), '--d1-matched-starters', String(matches),
];
const run = (data: unknown, args: string[] = [], now = cutoff) => {
  const dir = mkdtempSync(join(tmpdir(), 'vac-d1-synthetic-'));
  try {
    const file = join(dir, 'logs.json');
    writeFileSync(file, JSON.stringify(data), 'utf8');
    const result = spawnSync(process.execPath, ['--import', 'tsx', cli, file, now, ...args], {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      encoding: 'utf8',
      timeout: 10_000,
    });
    if (result.error) throw result.error;
    return result;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

describe('P1-12 D1 cohort report (synthetic log input)', () => {
  it('shows only the observed fraction without reconciliation; never prints participant IDs', () => {
    const r = run({ logs: fixture(7, 4) });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('4/7 = 57.1%');
    expect(r.stdout).toContain('CHƯA ĐỐI CHIẾU NHÓM');
    expect(r.stdout + r.stderr).not.toContain(privateMarker);
    expect(r.stdout).not.toContain('D1 nhóm:');
    expect(r.stdout).not.toMatch(/: (CHƯA )?ĐẠT/u);
  });

  it.each([
    [10, 7, 4, '4/10–7/10 (40.0%–70.0%)', 'TẠM CHỜ'],
    [10, 9, 5, '5/10–6/10 (50.0%–60.0%)', 'ĐẠT'],
    [10, 9, 3, '3/10–4/10 (30.0%–40.0%)', 'CHƯA ĐẠT'],
    [10, 9, 4, '4/10–5/10 (40.0%–50.0%)', 'TẠM CHỜ'],
    [10, 10, 5, '5/10–5/10 (50.0%–50.0%)', 'ĐẠT'],
    [10, 0, 0, '0/10–10/10 (0.0%–100.0%)', 'TẠM CHỜ'],
  ])('bounds a reconciled %i-starter cohort with %i matches, %i returns', (total, matched, returned, range, verdict) => {
    const r = run(fixture(matched, returned), counts(total, matched));
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(`${total} người bắt đầu · ${matched} ghép · ${total - matched} chưa rõ`);
    expect(r.stdout).toContain(`D1 nhóm: ${range} — cổng LT-02 ≥ 50%: ${verdict}`);
    expect(r.stdout + r.stderr).not.toContain(privateMarker);
  });

  it.each(['', 'NOT_A_GAME_EVENT-' + privateMarker])(
    'rejects an unsupported v1 event before calculating a reconciled D1 verdict (%j)',
    (type) => {
      const logs = fixture(2, 0);
      logs[0].events.push({ t: d1, s: 2, type });
      const r = run(logs, counts(2, 2));
      expect(r.status).toBe(2);
      expect(r.stdout).toBe('');
      expect(r.stderr).toContain('1 sự kiện có loại ngoài quy ước v1');
      expect(r.stderr).not.toContain(privateMarker);
      // Diagnostic-only mode remains available and cannot issue a cohort verdict.
      const observed = run(logs);
      expect(observed.status).toBe(0);
      expect(observed.stdout).toContain('CHƯA ĐỐI CHIẾU NHÓM');
      expect(observed.stdout).not.toContain('D1 nhóm:');
      expect(observed.stdout + observed.stderr).not.toContain(privateMarker);
    },
  );

  it.each([
    { type: 'SESSION' },
    { type: 'ACTION', name: 'PLANT', value: 1 },
    { type: 'LEVEL', value: 2 },
    { type: 'TUTORIAL', name: 'MOVE' },
  ])('keeps D1 evidence from the declared $type event', (ev) => {
    const logs = fixture(2, 0);
    const before = run(logs, counts(2, 2));
    expect(before.status).toBe(0);
    expect(before.stdout).toContain('D1 nhóm: 0/2–0/2 (0.0%–0.0%) — cổng LT-02 ≥ 50%: CHƯA ĐẠT');
    logs[0].events.push({ t: d1, s: 2, ...ev });
    const r = run(logs, counts(2, 2));
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('D1 nhóm: 1/2–1/2 (50.0%–50.0%) — cổng LT-02 ≥ 50%: ĐẠT');
    expect(r.stdout + r.stderr).not.toContain(privateMarker);
  });

  it('does not turn zero closed windows into a verdict', () => {
    const r = run([], counts(0, 0));
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('CHƯA ĐỦ DỮ LIỆU');
    expect(r.stdout).not.toContain('D1 nhóm:');
  });

  it('keeps still-open local D1 days out of the denominator, even after a same-day return', () => {
    const before = run(fixture(7, 4), counts(10, 7), '2026-11-23T16:59:59Z');
    expect(before.status).toBe(2);
    expect(before.stdout).not.toContain('D1 nhóm:');
    const after = run(fixture(7, 4), counts(10, 7), '2026-11-23T17:00:00Z');
    expect(after.status).toBe(0);
    expect(after.stdout).toContain('4/10–7/10 (40.0%–70.0%)');
  });

  it.each([
    ['only one count supplied', fixture(7, 4), ['--d1-closed-starters', '10'], cutoff],
    ['matched exceeds starters', fixture(7, 4), counts(6, 7), cutoff],
    ['matched disagrees with logs', fixture(7, 4), counts(10, 6), cutoff],
    ['fractional or redundant count', fixture(7, 4), counts(10, 7).concat('--d1-closed-starters', '10.5'), cutoff],
    ['negative count', fixture(7, 4), counts(-10, 7), cutoff],
    ['unspecified timezone', fixture(7, 4), counts(10, 7), '2026-11-24T00:00:00'],
    ['invalid calendar date', fixture(7, 4), counts(10, 7), '2026-11-31T00:00:00Z'],
    ['unknown flag', fixture(7, 4), counts(10, 7).concat('--typo'), cutoff],
    ['duplicated log', [fixture(1, 1)[0], fixture(1, 1)[0]], counts(10, 2), cutoff],
    ['silently dropped event', [{ ...fixture(1, 1)[0], events: [{ t: d0, s: 1, type: 'SESSION' }, { t: 'oops' }] }], counts(10, 1), cutoff],
    ['unreadable log', [null], counts(10, 0), cutoff],
    ['empty event list', [{ ...fixture(1, 0)[0], events: [] }], counts(10, 0), cutoff],
    ['future event', [{ ...fixture(1, 0)[0], events: [{ t: Date.parse(cutoff) + 1, s: 1, type: 'SESSION' }] }], counts(10, 1), cutoff],
  ])('fails closed with %s', (_scenario, logs, args, at) => {
    const r = run(logs, args, at);
    expect(r.status).toBe(2);
    expect(r.stdout).toBe('');
    expect(r.stderr).toBeTruthy();
    expect(r.stderr).not.toContain(privateMarker);
  });
});
