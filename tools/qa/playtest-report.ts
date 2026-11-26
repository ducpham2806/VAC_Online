/**
 * P1-12 — báo cáo chơi thử (LT-13) từ nhật ký nhiều người chơi.
 *   npm run playtest:report -- <file.json> [thời điểm ISO]
 * Có thể thêm --d1-closed-starters N --d1-matched-starters M sau khi đối chiếu riêng.
 * <file.json>: mảng `PlaytestLog` (mỗi máy một nhật ký `vac_slice_playtest_v1`), hoặc `{ "logs": [...] }`.
 * Sau P1-8: xuất từ bảng sự kiện trên server về đúng dạng này.
 */
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { PLAYTEST_EVENT_TYPES, type PlaytestLog, parseLog } from '../../src/game/slice/playtest';
import { D1_TARGET, playtestReport } from '../../src/game/slice/playtestMetrics';

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}
const args = (() => {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        'd1-closed-starters': { type: 'string', multiple: true },
        'd1-matched-starters': { type: 'string', multiple: true },
      },
    });
  } catch {
    return fail('Tham số báo cáo không hợp lệ.');
  }
})();
const [file, at] = args.positionals;
if (!file || args.positionals.length > 2) {
  fail('Cách dùng: npm run playtest:report -- <file.json> [thời điểm ISO] [--d1-closed-starters N --d1-matched-starters M]');
}
const parseCount = (values: string[] | undefined): number | null => {
  if (!values) return null;
  const [x] = values;
  const n = Number(x);
  if (values.length !== 1 || !/^\d+$/.test(x) || !Number.isSafeInteger(n)) {
    fail('Mỗi số người D1 phải được khai báo một lần bằng số nguyên không âm.');
  }
  return n;
};
const closed = parseCount(args.values['d1-closed-starters']);
const matched = parseCount(args.values['d1-matched-starters']);
if ((closed === null) !== (matched === null)) fail('Cần khai báo cả hai số người sau khi đối chiếu D1.');
if (closed !== null && matched !== null && matched > closed) {
  fail('Số người ghép không thể lớn hơn số người đã hết cửa sổ D1.');
}
if (closed !== null) {
  const day = at?.match(/^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/)?.[1];
  const midnight = day ? new Date(`${day}T00:00:00Z`) : null;
  if (!midnight || !Number.isFinite(midnight.getTime()) || midnight.toISOString().slice(0, 10) !== day) {
    fail('Đối chiếu D1 cần thời điểm ISO có múi giờ (ví dụ 2026-11-24T00:00:00+07:00).');
  }
}
const now = at ? Date.parse(at) : Date.now();
if (!Number.isFinite(now)) fail('Thời điểm báo cáo không hợp lệ.');

const raw: unknown = (() => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fail('Không đọc được tệp JSON nhật ký.');
  }
})();
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const list: unknown[] = Array.isArray(raw) ? raw
  : isObject(raw) && Array.isArray(raw.logs) ? raw.logs
  : fail('Tệp cần chứa mảng nhật ký hoặc đối tượng có mảng logs.');
const logs = list.map(parseLog).filter((l): l is PlaytestLog => l !== null);
if (closed !== null && (logs.length !== list.length || logs.some((log, index) => {
  const item = list[index];
  return !isObject(item) || !Array.isArray(item.events) || item.events.length !== log.events.length
    || log.events.length === 0 || !log.player.trim()
    || log.events.some(({ t }) => !Number.isFinite(t) || t > now);
}))) {
  fail('Chỉ dùng nhật ký ghép hợp lệ, có sự kiện không muộn hơn thời điểm báo cáo.');
}
if (closed !== null && new Set(logs.map(({ player }) => player)).size !== logs.length) {
  fail('Có nhật ký trùng. Đối chiếu riêng và chỉ dùng một nhật ký cho mỗi người.');
}
if (closed !== null) {
  const supported = new Set<string>(PLAYTEST_EVENT_TYPES);
  let unsupported = 0;
  for (const log of logs) {
    for (const { type } of log.events) {
      if (!supported.has(type)) unsupported++;
    }
  }
  if (unsupported > 0) {
    fail(`Có ${unsupported} sự kiện có loại ngoài quy ước v1. Đối chiếu lại nhật ký, không kết luận LT-02.`);
  }
}
const r = playtestReport(logs, now);
if (matched !== null && (matched !== r.d1Eligible || matched !== logs.length)) {
  fail('Số người ghép không khớp với nhật ký đã hết cửa sổ D1. Đối chiếu lại, không kết luận LT-02.');
}
const pct = (x: number | null) => (x === null ? 'chưa tính được' : `${Math.round(x * 100)}%`);
const d1Pct = (x: number) => `${(x * 100).toFixed(1)}%`;

console.log(`# Báo cáo chơi thử P1 — ${new Date(now).toISOString()}`);
console.log(`Người chơi: ${r.players} (đọc được ${logs.length}/${list.length} nhật ký)`);
console.log(
  `Quay lại ngày hôm sau (D1 quan sát, chỉ nhật ký): ${r.d1Returned}/${r.d1Eligible} = ${r.d1Rate === null ? 'chưa tính được' : d1Pct(r.d1Rate)}`,
);
if (closed === null || matched === null) {
  console.log('Cổng LT-02: CHƯA ĐỐI CHIẾU NHÓM (không kết luận).');
} else if (closed === 0) {
  console.log('Cổng LT-02: CHƯA ĐỦ DỮ LIỆU (0 người đã hết cửa sổ D1).');
} else {
  const unresolved = closed - matched;
  const highReturns = r.d1Returned + unresolved;
  const lower = r.d1Returned / closed;
  const upper = highReturns / closed;
  const verdict = lower >= D1_TARGET ? 'ĐẠT' : upper < D1_TARGET ? 'CHƯA ĐẠT' : 'TẠM CHỜ';
  console.log(`Nhóm đã hết cửa sổ D1: ${closed} người bắt đầu · ${matched} ghép · ${unresolved} chưa rõ.`);
  console.log(
    `D1 nhóm: ${r.d1Returned}/${closed}–${highReturns}/${closed} (${d1Pct(lower)}–${d1Pct(upper)}) — cổng LT-02 ≥ ${pct(D1_TARGET)}: ${verdict}`,
  );
}
console.log(`Xong hướng dẫn: ${pct(r.tutorialDoneRate)} · phiên đầu (trung vị): ${r.medianFirstSessionMin.toFixed(1)} phút · số phiên (trung vị): ${r.medianSessions} · cấp cao nhất (trung vị): ${r.medianMaxLevel}`);
console.log('\nPhễu hướng dẫn:');
for (const f of r.funnel) console.log(`  ${f.step.padEnd(8)} ${String(f.reached).padStart(3)}  ${pct(f.rate)}`);
console.log('\nThao tác thành công:');
for (const [k, v] of Object.entries(r.actions).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(16)} ${v}`);
