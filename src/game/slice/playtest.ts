/**
 * P1-12 — nhật ký chơi thử của bản thử `?p1` (LT-13): ghi sự kiện ẩn danh để đo quay lại ngày hôm sau (cổng LT-02),
 * phễu hướng dẫn, thời lượng phiên. Không ghi tên, email hay thông tin máy.
 * Lưu tạm `localStorage` (`PLAYTEST_KEY`); P1-8 nối server thì gửi `pendingEvents` rồi `markSent`.
 * Phần thuần (newLog, addEvent, parseLog…) có test; phần ghi (startPlaytest, recordActions) chạm localStorage.
 */
import type { Action, ActionResult } from '../../engine/applyActions';
import type { FarmSave } from '../../domain/farm';
import { currentTutorialStep } from './sliceTutorial';

export const PLAYTEST_KEY = 'vac_slice_playtest_v1';
/** Giữ tối đa ngần này sự kiện trên máy (bỏ cũ nhất); đủ cho ~1 tuần chơi thử. */
export const MAX_EVENTS = 3000;
/** Ghi xuống máy sau ngần này ms kể từ sự kiện cuối (gom nhiều thao tác một lần ghi). */
export const SAVE_DEBOUNCE_MS = 2000;

export type PlaytestEventType = 'SESSION' | 'ACTION' | 'LEVEL' | 'TUTORIAL';

export interface PlaytestEvent {
  /** Thời điểm (ms). */
  t: number;
  /** Số phiên (mỗi lần mở trang là một phiên). */
  s: number;
  type: PlaytestEventType;
  /** ACTION: loại thao tác; TUTORIAL: id bước đang làm hoặc `DONE`. */
  name?: string;
  /** ACTION: số thao tác thành công trong lượt; LEVEL: cấp mới. */
  value?: number;
}

export interface PlaytestLog {
  v: 1;
  /** Mã ngẫu nhiên của máy chơi thử, không gắn danh tính. */
  player: string;
  session: number;
  events: PlaytestEvent[];
  /** Số sự kiện đầu danh sách đã gửi server (P1-8). */
  sent: number;
}

export const newLog = (player: string): PlaytestLog => ({ v: 1, player, session: 0, events: [], sent: 0 });

/** Thêm sự kiện; quá MAX_EVENTS thì bỏ sự kiện cũ nhất (và lùi mốc đã gửi tương ứng). */
export function addEvent(log: PlaytestLog, e: Omit<PlaytestEvent, 's'>): PlaytestLog {
  const events = [...log.events, { ...e, s: log.session }];
  const drop = Math.max(0, events.length - MAX_EVENTS);
  return { ...log, events: drop ? events.slice(drop) : events, sent: Math.max(0, log.sent - drop) };
}

/** Hai lần mở phiên cách nhau dưới ngần này ms tính là một (React StrictMode chạy hiệu ứng 2 lần ở dev). */
export const SESSION_MERGE_MS = 10_000;

/** Mở phiên mới (mỗi lần vào game); vừa mở phiên trong SESSION_MERGE_MS thì giữ phiên đó. */
export function startSession(log: PlaytestLog, now: number): PlaytestLog {
  const last = log.events.at(-1);
  if (last?.type === 'SESSION' && last.s === log.session && now - last.t < SESSION_MERGE_MS) return log;
  return addEvent({ ...log, session: log.session + 1 }, { t: now, type: 'SESSION' });
}

export const pendingEvents = (log: PlaytestLog): PlaytestEvent[] => log.events.slice(log.sent);
export const markSent = (log: PlaytestLog, n: number): PlaytestLog => ({ ...log, sent: Math.min(log.events.length, log.sent + Math.max(0, n)) });

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Đọc nhật ký từ máy; hỏng → null (ghi lại từ đầu, giữ mã người chơi nếu đọc được). */
export function parseLog(raw: unknown): PlaytestLog | null {
  if (!isObj(raw) || raw.v !== 1 || typeof raw.player !== 'string' || !Array.isArray(raw.events)) return null;
  const events = raw.events.filter(
    (e): e is PlaytestEvent => isObj(e) && typeof e.t === 'number' && typeof e.s === 'number' && typeof e.type === 'string',
  );
  const session = typeof raw.session === 'number' ? raw.session : 0;
  const sent = typeof raw.sent === 'number' ? Math.min(events.length, Math.max(0, raw.sent)) : 0;
  return { v: 1, player: raw.player, session, events, sent };
}

/** Bước hướng dẫn hiện tại (id) hoặc `DONE`; `null` khi chưa qua cảnh mở đầu. */
export function tutorialMark(save: FarmSave, moved: boolean, sold: boolean): string | null {
  if (!save.story?.path) return null;
  return currentTutorialStep({ save, moved, sold })?.step.id ?? 'DONE';
}

/** Gom kết quả một lượt `applyActions` thành sự kiện ACTION (mỗi loại thao tác một sự kiện, `value` = số lần thành công). */
export function actionEvents(actions: readonly Action[], results: readonly ActionResult[], now: number): Omit<PlaytestEvent, 's'>[] {
  const count = new Map<string, number>();
  for (const r of results) if (r.ok) count.set(actions[r.index].type, (count.get(actions[r.index].type) ?? 0) + 1);
  return [...count].map(([name, value]) => ({ t: now, type: 'ACTION' as const, name, value }));
}

// ------------------------------------------------------------------ ghi trên máy (có tác dụng phụ)
let log: PlaytestLog | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function load(): PlaytestLog {
  if (log) return log;
  const st = storage();
  let parsed: PlaytestLog | null = null;
  try {
    parsed = parseLog(JSON.parse(st?.getItem(PLAYTEST_KEY) ?? 'null'));
  } catch {
    parsed = null;
  }
  log = parsed ?? newLog(typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `p${Date.now().toString(36)}`);
  return log;
}

function save(now = false): void {
  if (timer) clearTimeout(timer);
  const write = () => {
    timer = null;
    try {
      storage()?.setItem(PLAYTEST_KEY, JSON.stringify(log));
    } catch {
      // đầy bộ nhớ / chế độ riêng tư: bỏ qua, không làm hỏng game
    }
  };
  if (now) write();
  else timer = setTimeout(write, SAVE_DEBOUNCE_MS);
}

function push(e: Omit<PlaytestEvent, 's'>): void {
  log = addEvent(load(), e);
  save();
}

/** Ghi các thao tác thành công của một lượt (store gọi sau `applyActions`). */
export function recordActions(actions: readonly Action[], results: readonly ActionResult[], now: number): void {
  const evs = actionEvents(actions, results, now);
  if (!evs.length) return;
  for (const e of evs) log = addEvent(load(), e);
  save();
}

/** P1-8: sự kiện chưa gửi server (tối đa `max`). */
export function takePending(max: number): { player: string; events: PlaytestEvent[] } {
  const l = load();
  return { player: l.player, events: pendingEvents(l).slice(0, max) };
}

/** P1-8: server đã nhận `n` sự kiện đầu hàng chờ. */
export function confirmSent(n: number): void {
  log = markSent(load(), n);
  save(true);
}

/** Mã người chơi thử rút gọn (hiện ở Cài đặt để khớp với phiếu khảo sát). */
export const playtestCode = () => load().player.slice(0, 8);

/** Nhật ký hiện tại (kiểm thử, xuất cho P1-8). */
export const currentLog = () => load();

interface WatchState {
  save: FarmSave;
  tut: { moved: boolean; sold: boolean };
}
interface WatchStore {
  getState: () => WatchState;
  subscribe: (fn: (s: WatchState, prev: WatchState) => void) => () => void;
}

/** Mở phiên chơi thử: ghi SESSION, theo dõi cấp và bước hướng dẫn. Trả hàm dừng (gỡ theo dõi, ghi ngay). */
export function startPlaytest(store: WatchStore, now: number): () => void {
  log = startSession(load(), now);
  const s0 = store.getState();
  let level = s0.save.level;
  let mark = tutorialMark(s0.save, s0.tut.moved, s0.tut.sold);
  if (mark) push({ t: now, type: 'TUTORIAL', name: mark });
  save(true);
  const unsub = store.subscribe((s) => {
    const t = Date.now();
    if (s.save.level !== level) {
      level = s.save.level;
      push({ t, type: 'LEVEL', value: level });
    }
    const m = tutorialMark(s.save, s.tut.moved, s.tut.sold);
    if (m && m !== mark) {
      mark = m;
      push({ t, type: 'TUTORIAL', name: m });
    }
  });
  const flush = () => save(true);
  window.addEventListener('pagehide', flush);
  return () => {
    unsub();
    window.removeEventListener('pagehide', flush);
    flush();
  };
}
