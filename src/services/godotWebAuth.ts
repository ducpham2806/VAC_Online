import { createClient, type AuthError, type Session } from '@supabase/supabase-js';

const PHASER_QUEUE_KEY = 'vac_slice_queue_v1';
const AUTH_TIMEOUT_MS = 8000;
let client: ReturnType<typeof createClient> | undefined;

function storageKey(url: string): string {
  return `sb-${new URL(url).hostname.split('.')[0]}-auth-token`;
}

function account(url: string): string {
  const key = storageKey(url);
  try {
    const session: Session | null = JSON.parse(localStorage.getItem(key) ?? 'null');
    return session?.user?.id ?? localStorage.getItem(`vac-godot-account:${key}`) ?? '';
  } catch {
    return '';
  }
}

function hasPendingActions(): boolean {
  try {
    const queue: unknown = JSON.parse(localStorage.getItem(PHASER_QUEUE_KEY) ?? '[]');
    return Array.isArray(queue) && queue.length > 0;
  } catch {
    return false;
  }
}

async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function ensure(
  url: string,
  publishableKey: string,
  legacyJson: string,
  forceRefresh: boolean,
) {
  const knownAccount = account(url);
  const legacy: { access_token?: string; refresh_token?: string } = JSON.parse(legacyJson);
  const key = storageKey(url);
  if (hasPendingActions()) {
    return { error: 'Phaser còn thao tác chờ. Mở Phaser để đồng bộ rồi bấm Đọc lại.' };
  }
  client ??= createClient(url, publishableKey, {
    auth: { storageKey: key, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: authFetch },
  });
  let result: { data: { session: Session | null }; error: AuthError | null } = await client.auth.getSession();
  if (!result.error && result.data.session && forceRefresh) {
    result = await client.auth.refreshSession();
  } else if (!result.error && !result.data.session && legacy.access_token && legacy.refresh_token) {
    result = await client.auth.setSession({
      access_token: legacy.access_token,
      refresh_token: legacy.refresh_token,
    });
  } else if (!result.error && !result.data.session && !knownAccount && !forceRefresh) {
    result = await client.auth.signInAnonymously();
  }
  if (result.error || !result.data.session) {
    return { error: 'Chưa kết nối được phiên đã lưu. Bấm Đọc lại để thử.' };
  }
  const { access_token, user } = result.data.session;
  localStorage.setItem(`vac-godot-account:${key}`, user.id);
  return { access_token, user_id: user.id };
}

const bridge = {
  account,
  ensureSession(url: string, key: string, legacy: string, refresh: boolean, done: (json: string) => void) {
    void ensure(url, key, legacy, refresh).then(
      (session) => done(JSON.stringify(session)),
      () => done(JSON.stringify({ error: 'Chưa đọc được phiên trình duyệt. Bấm Đọc lại để thử.' })),
    );
  },
};

Object.assign(window, { vacGodotAuth: bridge });
