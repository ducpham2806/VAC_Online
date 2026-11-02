/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** '1' = bản chạy thử offline (npm run build:preview). */
  readonly VITE_OFFLINE_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
