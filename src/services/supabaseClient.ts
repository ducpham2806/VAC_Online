import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL + publishable key là thông tin công khai (được nhúng vào bundle web) — bảo mật nằm ở
// RLS và quyền RPC trên server (migration 0003), không nằm ở việc giấu key này.
const DEFAULT_SUPABASE_URL = 'https://znabynzbcimpesrxxxsz.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_EMp5ir8IUmc3LecYwe75BA_gbEpmOCW';

const STORAGE_URL_KEY = 'hdgn_supabase_url';
const STORAGE_ANON_KEY = 'hdgn_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
  // Ghi đè bằng localStorage chỉ dùng khi phát triển (modal cấu hình chỉ hiện ở DEV).
  const allowLocalOverride = import.meta.env.DEV && typeof window !== 'undefined';
  const localUrl = allowLocalOverride ? window.localStorage.getItem(STORAGE_URL_KEY) ?? '' : '';
  const localKey = allowLocalOverride ? window.localStorage.getItem(STORAGE_ANON_KEY) ?? '' : '';

  return {
    url: localUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: localKey || envKey || DEFAULT_SUPABASE_KEY,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_URL_KEY, url.trim());
  window.localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
}

const creds = getSupabaseCredentials();
// Khi chạy test (vitest đặt MODE = 'test') luôn ở chế độ offline để test không chạm mạng/DB thật.
const isTestRun = import.meta.env.MODE === 'test';
export const isSupabaseConfigured = Boolean(
  !isTestRun && creds.url && creds.anonKey && !creds.url.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(creds.url, creds.anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/** Trả về Supabase client dùng chung, hoặc null khi chưa cấu hình (chế độ Khách offline). */
export function getSupabaseClient(): SupabaseClient | null {
  return supabase;
}
