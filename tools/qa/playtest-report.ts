/**
 * P1-12 — báo cáo chơi thử (LT-13) từ nhật ký nhiều người chơi.
 *   npm run playtest:report -- <file.json> [thời điểm ISO]
 * <file.json>: mảng `PlaytestLog` (mỗi máy một nhật ký `vac_slice_playtest_v1`), hoặc `{ "logs": [...] }`.
 * Sau P1-8: xuất từ bảng sự kiện trên server về đúng dạng này.
 */
import { readFileSync } from 'node:fs';
import { type PlaytestLog, parseLog } from '../../src/game/slice/playtest';
import { D1_TARGET, playtestReport } from '../../src/game/slice/playtestMetrics';

const [file, at] = process.argv.slice(2);
if (!file) {
  console.error('Cách dùng: npm run playtest:report -- <file.json> [thời điểm ISO]');
  process.exit(2);
}
const raw: unknown = JSON.parse(readFileSync(file, 'utf8'));
const list = Array.isArray(raw) ? raw : (raw as { logs?: unknown[] }).logs ?? [];
const logs = list.map(parseLog).filter((l): l is PlaytestLog => l !== null);
const now = at ? Date.parse(at) : Date.now();
const r = playtestReport(logs, now);
const pct = (x: number | null) => (x === null ? 'chưa tính được' : `${Math.round(x * 100)}%`);

console.log(`# Báo cáo chơi thử P1 — ${new Date(now).toISOString()}`);
console.log(`Người chơi: ${r.players} (đọc được ${logs.length}/${list.length} nhật ký)`);
console.log(
  `Quay lại ngày hôm sau (D1): ${r.d1Returned}/${r.d1Eligible} = ${pct(r.d1Rate)} — cổng LT-02 ≥ ${Math.round(D1_TARGET * 100)}%: ${
    r.d1Pass === null ? 'CHƯA ĐỦ DỮ LIỆU' : r.d1Pass ? 'ĐẠT' : 'CHƯA ĐẠT'
  }`,
);
console.log(`Xong hướng dẫn: ${pct(r.tutorialDoneRate)} · phiên đầu (trung vị): ${r.medianFirstSessionMin.toFixed(1)} phút · số phiên (trung vị): ${r.medianSessions} · cấp cao nhất (trung vị): ${r.medianMaxLevel}`);
console.log('\nPhễu hướng dẫn:');
for (const f of r.funnel) console.log(`  ${f.step.padEnd(8)} ${String(f.reached).padStart(3)}  ${pct(f.rate)}`);
console.log('\nThao tác thành công:');
for (const [k, v] of Object.entries(r.actions).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(16)} ${v}`);
