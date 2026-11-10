// P0-4 Edge Function (Deno) — ADR-001 + ADR-002.
// Nhận lô thao tác, chạy luật TS dùng chung (bản đóng gói `../_shared/engine.js`, sinh bằng build-engine.sh — không sửa tay),
// ghi trạng thái + sổ cái bằng _commit_farm_state với khóa lạc quan, thử lại tối đa 3 lần khi xung đột.
import postgres from 'npm:postgres@3.4.5';
import { applyActions, newFarmSave, STATE_SCHEMA_VERSION } from '../_shared/engine.js';

const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 5, prepare: false });
const MAX_RETRY = 3;

/** Danh tính lấy từ JWT đã được gateway Supabase kiểm (verify_jwt = true); không nhận user id trong body. */
function userIdFrom(req: Request): string | null {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

function rng(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] / 2 ** 32;
}

export async function handle(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const userId = userIdFrom(req);
  if (!userId) return Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.actions)) return Response.json({ error: 'BAD_REQUEST' }, { status: 400 });

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    const now = Date.now();
    const rows = await sql`select version, state from public.farm_states where user_id = ${userId}`;
    const version: number = rows.length ? Number(rows[0].version) : 0;
    const current = rows.length ? rows[0].state : newFarmSave('NORTH', now);
    const out = applyActions(current, body.actions, { now, rng, gameStage: 1 });
    const [{ v }] = await sql`
      select public._commit_farm_state(${userId}, ${version}, ${sql.json(out.save)}, ${STATE_SCHEMA_VERSION}, ${sql.json(out.ledger)}) as v`;
    if (v !== null) {
      return Response.json({ version: Number(v), state: out.save, results: out.results, serverNow: now, attempts: attempt });
    }
  }
  return Response.json({ error: 'CONFLICT_RETRY_EXHAUSTED' }, { status: 409 });
}

if (import.meta.main) Deno.serve({ port: Number(Deno.env.get('PORT') ?? 8000) }, handle);
