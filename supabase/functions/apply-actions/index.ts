// P1-8 (QD-89, ADR-001/002) — Edge Function `apply-actions` cho bản thử `?p1`.
// Nhận lô thao tác → kiểm dạng → chạy luật dùng chung (`engine.js`, đóng gói từ src/engine/sliceServer.ts bằng
// `npm run build:edge`, file sinh — không sửa tay) → ghi trạng thái + sổ cái bằng `_commit_farm_state` (khóa lạc quan,
// thử lại ≤ 3 lần). Giờ và số ngẫu nhiên của server. Danh tính chỉ từ JWT (kiểm bằng Supabase Auth), không nhận user id.
import postgres from 'npm:postgres@3.4.5';
import { createClient } from 'npm:@supabase/supabase-js@2.109.0';
import { SERVER_SCHEMA_VERSION, parseActions, serverApply } from './engine.js';

export const MAX_RETRY = 3;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-region',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: CORS });

type Sql = ReturnType<typeof postgres>;
export interface Deps {
  sql: Sql;
  /** Danh tính người gọi từ header Authorization; null = chưa đăng nhập / token sai. */
  userId: (req: Request) => Promise<string | null>;
  now: () => number;
  rng: () => number;
}

function cryptoRng(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] / 2 ** 32;
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  const t0 = performance.now();
  const userId = await deps.userId(req);
  const tAuth = performance.now();
  if (!userId) return json({ error: 'UNAUTHENTICATED' }, 401);
  const body = await req.json().catch(() => null);
  const actions = parseActions(body?.actions);
  if (!actions) return json({ error: 'BAD_REQUEST' }, 400);

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    const now = deps.now();
    const rows = await deps.sql`select version, state from public.farm_states where user_id = ${userId}`;
    const version = rows.length ? Number(rows[0].version) : 0;
    const out = serverApply(rows.length ? rows[0].state : null, actions, now, deps.rng);
    const [{ v }] = await deps.sql`
      select public._commit_farm_state(${userId}, ${version}, ${deps.sql.json(out.save)}, ${SERVER_SCHEMA_VERSION}, ${deps.sql.json(out.ledger)}) as v`;
    if (v !== null) {
      // thời gian xử lý phía server (ms) để đo độ trễ tách khỏi mạng của người gọi (P0-6)
      const ms = { auth: Math.round(tAuth - t0), total: Math.round(performance.now() - t0) };
      return json({ version: Number(v), state: out.save, results: out.results, serverNow: now, attempts: attempt, ms });
    }
  }
  return json({ error: 'CONFLICT_RETRY_EXHAUSTED' }, 409);
}

if (import.meta.main) {
  const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 5, prepare: false });
  const auth = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const userId = async (req: Request) => {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return null;
    const { data, error } = await auth.auth.getClaims(token);
    const sub = data?.claims?.sub;
    return !error && typeof sub === 'string' ? sub : null;
  };
  Deno.serve((req) => handle(req, { sql, userId, now: Date.now, rng: cryptoRng }));
}
