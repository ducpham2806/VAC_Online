/**
 * P1-8 (QD-89) — đồng bộ bản thử `?p1` với server (Edge Function `apply-actions`, ADR-001/002).
 *  - Đăng nhập ẩn danh: mỗi máy một người chơi, không cần tài khoản.
 *  - Thao tác hiện ngay trên máy (dự đoán), xếp hàng, gửi lô mỗi FLUSH_MS; ảnh chụp server + các thao tác còn chờ
 *    (dựng lại bằng cùng luật) thay trạng thái trên máy. Server quyết giờ, số ngẫu nhiên, kết quả (không tin client).
 *  - Mất mạng: giữ hàng chờ (lưu máy), thử lại giãn dần. Server chưa có hàm → về chơi trên máy.
 *  - Gửi nhật ký chơi thử (P1-12) vào `playtest_events` mỗi EVENTS_FLUSH_MS và khi rời trang.
 * Thêm `?offline` vào URL để chơi trên máy (kiểm thử khói).
 */
import { FunctionRegion, FunctionsHttpError } from '@supabase/supabase-js';
import { type Action, type ActionResult, MAX_ACTIONS_PER_BATCH, applyActions } from '../engine/applyActions';
import type { FarmSave } from '../domain/farm';
import { getSupabaseClient } from './supabaseClient';
import { setActionSink, sliceCtx, useSliceStore } from '../store/useSliceStore';
import { confirmSent, takePending } from '../game/slice/playtest';

export const FLUSH_MS = 800;
export const RETRY_MIN_MS = 2000;
export const RETRY_MAX_MS = 30_000;
export const EVENTS_FLUSH_MS = 30_000;
export const EVENTS_BATCH = 500;
const QUEUE_KEY = 'vac_slice_queue_v1';
const FUNCTION = 'apply-actions';
/** Chạy function cùng vùng với DB (Singapore): đo 11/11 xử lý p95 11 ms; để mặc định (gần người gọi) thì ~900 ms do mỗi truy vấn DB đi xa. */
export const FUNCTION_REGION = FunctionRegion.ApSoutheast1;

/** Một thao tác chờ gửi, kèm kết quả dự đoán trên máy (để báo khi server từ chối việc máy đã cho làm). */
export interface Queued {
  action: Action;
  okLocal: boolean;
}

export interface ServerReply {
  version: number;
  state: FarmSave;
  results: ActionResult[];
  serverNow: number;
}

/** Dựng lại trạng thái: ảnh chụp server + các thao tác còn chờ (thuần, có test). */
export function rebase(server: FarmSave, rest: readonly Queued[], now: number): FarmSave {
  return rest.length ? applyActions(server, rest.map((q) => q.action), sliceCtx(now, null)).save : server;
}

/** Lời nhắn khi server từ chối thao tác mà máy đã dự đoán là được (thuần, có test). */
export function rejectedByServer(sent: readonly Queued[], results: readonly ActionResult[]): string | null {
  const r = results.find((x) => !x.ok && sent[x.index]?.okLocal);
  return r ? `Máy chủ: ${r.message}` : null;
}

export const onlineWanted = (search: string) => !!getSupabaseClient() && !new URLSearchParams(search).has('offline');

function loadQueue(): Queued[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
    return Array.isArray(raw) ? (raw as Queued[]).filter((q) => q && typeof q === 'object' && q.action) : [];
  } catch {
    return [];
  }
}
function saveQueue(q: Queued[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    // bộ nhớ đầy: hàng chờ vẫn còn trong RAM
  }
}

let signing: Promise<boolean> | null = null;
/** Có phiên đăng nhập (ẩn danh nếu chưa có). Gộp các lần gọi trùng (StrictMode) để không tạo 2 người chơi. */
function sessionOnce(sb: NonNullable<ReturnType<typeof getSupabaseClient>>): Promise<boolean> {
  signing ??= (async () => {
    const { data } = await sb.auth.getSession();
    if (data.session) return true;
    const r = await sb.auth.signInAnonymously();
    return !r.error;
  })().finally(() => {
    signing = null;
  });
  return signing;
}

/** Bắt đầu chơi online; trả hàm dừng. Không cấu hình / `?offline` → chơi trên máy như cũ. */
export function startSliceSync(): () => void {
  const sb = getSupabaseClient();
  if (!sb || !onlineWanted(window.location.search)) return () => undefined;
  const store = useSliceStore;
  let queue = loadQueue();
  let inflight = false;
  let stopped = false;
  let delay = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const toLocal = (why: string) => {
    setActionSink(null);
    store.getState().setNet('LOCAL');
    store.getState().toast(`${why} — đang chơi và lưu trên máy này.`, false);
  };
  const schedule = (ms: number) => {
    if (stopped || timer) return;
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, ms);
  };

  const ensureSession = () => sessionOnce(sb!);

  async function flush(): Promise<void> {
    if (inflight || stopped) return;
    inflight = true;
    const batch = queue.slice(0, MAX_ACTIONS_PER_BATCH);
    try {
      const { data, error } = await sb!.functions.invoke<ServerReply>(FUNCTION, {
        body: { actions: batch.map((q) => q.action) },
        region: FUNCTION_REGION,
      });
      if (error) {
        const status = error instanceof FunctionsHttpError ? (error.context as Response).status : 0;
        if (status === 404) return toLocal('Máy chủ chưa sẵn sàng');
        if (status === 400) {
          // lô sai dạng: bỏ để không kẹt hàng chờ (không xảy ra với client chuẩn)
          queue = queue.slice(batch.length);
          saveQueue(queue);
        } else if (status === 401) {
          await sb!.auth.signOut({ scope: 'local' }).catch(() => undefined);
          if (!(await ensureSession())) return toLocal('Không đăng nhập được');
        }
        throw error;
      }
      if (!data) throw new Error('empty');
      queue = queue.slice(batch.length);
      saveQueue(queue);
      const s = store.getState();
      s.applyServer(rebase(data.state, queue, Date.now()));
      const msg = rejectedByServer(batch, data.results);
      if (msg) s.toast(msg, false);
      if (s.net !== 'ONLINE') s.setNet('ONLINE');
      delay = 0;
    } catch {
      if (stopped || store.getState().net === 'LOCAL') return;
      store.getState().setNet('RETRY');
      delay = Math.min(RETRY_MAX_MS, Math.max(RETRY_MIN_MS, delay * 2));
      inflight = false;
      schedule(delay);
      return;
    } finally {
      inflight = false;
    }
    if (queue.length) schedule(FLUSH_MS);
  }

  async function sendEvents(): Promise<void> {
    if (store.getState().net === 'LOCAL') return;
    const { player, events } = takePending(EVENTS_BATCH);
    if (!events.length) return;
    const rows = events.map((e) => ({
      player,
      session: e.s,
      t: new Date(e.t).toISOString(),
      type: e.type,
      name: e.name ?? null,
      value: e.value ?? null,
    }));
    const { error } = await sb!.from('playtest_events').insert(rows);
    if (!error) confirmSent(events.length);
  }

  store.getState().setNet('CONNECTING');
  setActionSink((actions, results) => {
    queue.push(...actions.map((action, i) => ({ action, okLocal: results.some((r) => r.index === i && r.ok) })));
    saveQueue(queue);
    schedule(FLUSH_MS);
  });
  void (async () => {
    try {
      if (!(await ensureSession())) return toLocal('Không đăng nhập được');
    } catch {
      return toLocal('Không kết nối được máy chủ');
    }
    await flush(); // lần đầu: gửi hàng chờ còn lại (hoặc lô rỗng) để lấy ảnh chụp server
  })();
  const events = setInterval(() => void sendEvents().catch(() => undefined), EVENTS_FLUSH_MS);
  const onHide = () => void sendEvents().catch(() => undefined);
  window.addEventListener('pagehide', onHide);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    clearInterval(events);
    window.removeEventListener('pagehide', onHide);
    setActionSink(null);
  };
}
