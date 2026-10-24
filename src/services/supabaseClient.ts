import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'hdgn_supabase_url';
const STORAGE_ANON_KEY = 'hdgn_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
  const localUrl = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_URL_KEY) ?? '' : '';
  const localKey = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_ANON_KEY) ?? '' : '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_URL_KEY, url.trim());
  window.localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
}

const creds = getSupabaseCredentials();
export const isSupabaseConfigured = Boolean(
  creds.url && creds.anonKey && !creds.url.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(creds.url, creds.anonKey)
  : null;
