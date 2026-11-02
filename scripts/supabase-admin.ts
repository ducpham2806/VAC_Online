/**
 * Quản trị Supabase qua Management API (https://api.supabase.com) — không cần kết nối Postgres trực tiếp.
 *
 *   SUPABASE_ACCESS_TOKEN=...  (Personal Access Token — đặt trong biến môi trường, KHÔNG commit)
 *   SUPABASE_PROJECT_REF=...   (mặc định: ref của project trong src/services/supabaseClient.ts)
 *
 *   npx tsx scripts/supabase-admin.ts status
 *   npx tsx scripts/supabase-admin.ts apply <file.sql> [...]      # chạy SQL theo thứ tự
 *   npx tsx scripts/supabase-admin.ts auth-config [--apply]        # xem / bật Anonymous + OTP email
 *   npx tsx scripts/supabase-admin.ts smoke                        # chơi thử bằng publishable key
 *   npx tsx scripts/supabase-admin.ts report                       # analytics (0008): retention, phễu, Sources/Sinks
 *   Thêm --dry-run để chỉ in ra việc sẽ làm.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_REF = 'znabynzbcimpesrxxxsz';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_EMp5ir8IUmc3LecYwe75BA_gbEpmOCW';
const API = 'https://api.supabase.com/v1';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const dryRun = args.includes('--dry-run');
const ref = process.env.SUPABASE_PROJECT_REF || DEFAULT_REF;
const token = process.env.SUPABASE_ACCESS_TOKEN ?? '';

function requireToken(): string {
  if (!token) {
    console.error('Thiếu SUPABASE_ACCESS_TOKEN (thêm vào biến môi trường của session, không dán vào chat).');
    process.exit(2);
  }
  return token;
}

async function api(path: string, init: RequestInit = {}): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireToken()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → HTTP ${res.status}: ${body.slice(0, 500)}`);
  return body ? JSON.parse(body) : null;
}

async function sql<T = Record<string, unknown>>(query: string): Promise<T[]> {
  return (await api(`/projects/${ref}/database/query`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })) as T[];
}

async function status(): Promise<void> {
  const tables = await sql<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1"
  );
  const fns = await sql<{ proname: string }>(
    "SELECT DISTINCT proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND proname LIKE 'rpc\\_%' ORDER BY 1"
  );
  console.log(`Project: ${ref}`);
  console.log(`Bảng public (${tables.length}):`);
  for (const { table_name } of tables) {
    const [{ n }] = await sql<{ n: number }>(`SELECT count(*)::int AS n FROM public."${table_name.replace(/"/g, '')}"`);
    console.log(`  - ${table_name.padEnd(22)} ${n} dòng`);
  }
  console.log(`RPC (${fns.length}): ${fns.map((f) => f.proname).join(', ') || '(chưa có)'}`);
  const cols = await sql<{ column_name: string }>(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' ORDER BY ordinal_position"
  );
  const has = (c: string) => cols.some((x) => x.column_name === c);
  console.log(`Đã chạy 0003 (master_catalog.unlock_wave): ${(await sql(
    "SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='master_catalog' AND column_name='unlock_wave'"
  )).length > 0}`);
  console.log(`Đã chạy 0004 (profiles.stamina_updated_at): ${has('stamina_updated_at')}`);
  console.log(`Đã chạy 0006 (hàm _plot_order, khai hoang 5×5): ${(await sql(
    "SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = '_plot_order'"
  )).length > 0}`);
  console.log(`Đã chạy 0007 (bảng player_counters, mục tiêu nhiệm vụ): ${(await sql(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'player_counters'"
  )).length > 0}`);
  console.log(`Đã chạy 0008 (analytics: economy_daily, player_active_days): ${(await sql(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'economy_daily'"
  )).length > 0}`);
}

async function apply(files: string[]): Promise<void> {
  if (files.length === 0) throw new Error('Cần ít nhất 1 file .sql');
  for (const f of files) {
    const query = readFileSync(f, 'utf-8');
    if (dryRun) {
      console.log(`[dry-run] sẽ chạy ${f} (${query.length} ký tự) trên project ${ref}`);
      continue;
    }
    process.stdout.write(`→ ${f} ... `);
    await sql(query);
    console.log('OK');
  }
}

const AUTH_PATCH = {
  external_anonymous_users_enabled: true,
  mailer_subjects_recovery: 'Mã khôi phục mật khẩu VAC Online',
  mailer_templates_recovery_content:
    '<h2>Khôi phục mật khẩu VAC Online</h2><p>Mã OTP 6 số của bạn là:</p><h1 style="letter-spacing:4px">{{ .Token }}</h1><p>Nhập mã này trong tab <b>Quên Mật Khẩu</b> của game. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>',
};

async function authConfig(): Promise<void> {
  const cfg = (await api(`/projects/${ref}/config/auth`)) as Record<string, unknown>;
  const keys = Object.keys(AUTH_PATCH);
  const missing = keys.filter((k) => !(k in cfg));
  console.log('Cấu hình hiện tại:');
  for (const k of keys) console.log(`  ${k}: ${JSON.stringify(cfg[k])?.slice(0, 120)}`);
  if (missing.length) {
    throw new Error(`API không có trường ${missing.join(', ')} — dừng lại, không PATCH mù.`);
  }
  if (!args.includes('--apply') || dryRun) {
    console.log('(Chỉ xem. Thêm --apply để bật Anonymous Sign-ins và đổi email Reset Password sang mã OTP.)');
    return;
  }
  await api(`/projects/${ref}/config/auth`, { method: 'PATCH', body: JSON.stringify(AUTH_PATCH) });
  console.log('Đã cập nhật cấu hình Auth.');
}

/** Chơi thử như một người chơi thật: Khách ẩn danh → nông trại → gieo; anon bị chặn ghi catalog. */
async function smoke(): Promise<void> {
  const url = process.env.VITE_SUPABASE_URL || `https://${ref}.supabase.co`;
  const key = process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_PUBLISHABLE_KEY;
  if (dryRun) {
    console.log(`[dry-run] sẽ đăng nhập ẩn danh vào ${url} rồi gọi rpc_get_my_farm / rpc_plant.`);
    return;
  }
  const anonClient = createClient(url, key, { auth: { persistSession: false } });
  const denied = await anonClient.rpc('rpc_sync_master_catalog', { p_items: [] });
  console.log(`anon gọi rpc_sync_master_catalog: ${denied.error ? `bị chặn ✅ (${denied.error.message})` : 'KHÔNG bị chặn ❌'}`);

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const signIn = await sb.auth.signInAnonymously({ options: { data: { player_name: 'Smoke Test' } } });
  if (signIn.error) throw new Error(`Đăng nhập ẩn danh lỗi: ${signIn.error.message}`);
  const farm = await sb.rpc('rpc_get_my_farm');
  if (farm.error) throw new Error(`rpc_get_my_farm lỗi: ${farm.error.message}`);
  const p = (farm.data as { profile: { level: number; gold: number } }).profile;
  console.log(`Hồ sơ khách mới: Lv.${p.level}, ${p.gold} vàng ✅`);
  const planted = await sb.rpc('rpc_plant', { p_x: 0, p_y: 0, p_item_id: 'CROP_01' });
  if (planted.error) throw new Error(`rpc_plant lỗi: ${planted.error.message}`);
  const gold = (planted.data as { profile: { gold: number } }).profile.gold;
  console.log(`Gieo Lúa: còn ${gold} vàng ✅`);
  const early = await sb.rpc('rpc_harvest', { p_x: 0, p_y: 0 });
  console.log(`Thu hoạch sớm: ${early.error ? `bị chặn ✅ (${early.error.message})` : 'KHÔNG bị chặn ❌'}`);
}

const REPORT_QUERIES: Array<[string, string]> = [
  [
    'Retention theo ngày tạo hồ sơ (14 ngày gần nhất)',
    'SELECT cohort_day, new_players, d1_players, d1_pct, d7_players, d7_pct FROM public.analytics_retention ORDER BY cohort_day DESC LIMIT 14',
  ],
  ['Phễu tân thủ', 'SELECT step_no, step, players FROM public.analytics_funnel ORDER BY step_no'],
  [
    'Dòng tiền theo ngày — mục tiêu Sink/Source 94–112% (02_MASTER_ECONOMY)',
    'SELECT day, active_payers, gold_sources, gold_sinks, sink_source_pct, gems_sources, gems_sinks FROM public.analytics_economy ORDER BY day DESC LIMIT 14',
  ],
];

/** Báo cáo analytics (migration 0008). Chỉ đo người chơi có phiên Supabase; Khách offline không được tính. */
async function report(): Promise<void> {
  for (const [title, query] of REPORT_QUERIES) {
    console.log(`\n== ${title}`);
    if (dryRun) {
      console.log(`[dry-run] ${query}`);
      continue;
    }
    const rows = await sql(query);
    if (rows.length === 0) console.log('(chưa có dữ liệu)');
    else console.table(rows);
  }
}

async function main(): Promise<void> {
  if (command === 'status') return status();
  if (command === 'apply') return apply(args.slice(1).filter((a) => !a.startsWith('--')));
  if (command === 'auth-config') return authConfig();
  if (command === 'smoke') return smoke();
  if (command === 'report') return report();
  console.log(readFileSync(new URL(import.meta.url), 'utf-8').split('\n').slice(1, 14).join('\n'));
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
