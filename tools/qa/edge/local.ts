// Chạy `apply-actions` cục bộ (Deno + Postgres tạm) để kiểm và đo — danh tính giả qua header `x-test-user`.
// CHỈ dùng trong tools/qa/edge/run-local.sh, không triển khai.
import postgres from 'npm:postgres@3.4.5';
import { handle } from '../../../supabase/functions/apply-actions/index.ts';

const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 5, prepare: false });
let rngSeed = 1;
const rng = () => ((rngSeed = (rngSeed * 16807) % 2147483647) / 2147483647);
Deno.serve({ port: Number(Deno.env.get('PORT') ?? 8787) }, (req) =>
  handle(req, { sql, userId: async (r) => r.headers.get('x-test-user'), now: Date.now, rng }),
);
