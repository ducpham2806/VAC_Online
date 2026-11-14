#!/bin/bash
# P1-8: Postgres tạm → stub auth + migration 0016 (chạy 2 lần) → `apply-actions` trên Deno → kiểm + đo + sổ cái khớp số dư.
# Cần Deno: DENO=<đường dẫn> (vd `npm i --prefix /tmp/deno deno` rồi DENO=/tmp/deno/node_modules/.bin/deno).
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd ../../.. && pwd)
DENO="${DENO:-deno}"
PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)}"
PORT_PG=54397; PORT_FN=8787
RUN=(bash -c); WORK=$(mktemp -d)
if [ "$(id -u)" = 0 ]; then WORK=$(su postgres -c "mktemp -d"); RUN=(su postgres -c); fi
"${RUN[@]}" "$PG_BIN/initdb -D $WORK/data -A trust -U postgres >/dev/null && $PG_BIN/pg_ctl -D $WORK/data -o '-p $PORT_PG -k $WORK -c listen_addresses=127.0.0.1' -l $WORK/log -w start >/dev/null"
FN_PID=""
cleanup() { [ -n "$FN_PID" ] && kill "$FN_PID" 2>/dev/null || true; "${RUN[@]}" "$PG_BIN/pg_ctl -D $WORK/data -m fast stop >/dev/null" || true; rm -rf "$WORK"; }
trap cleanup EXIT
P=("$PG_BIN/psql" -v ON_ERROR_STOP=1 -q -X -h 127.0.0.1 -p $PORT_PG -U postgres -d postgres)
"${P[@]}" -f "$ROOT/supabase/tests/stub_auth.sql" >/dev/null
"${P[@]}" -f "$ROOT/supabase/migrations/0016_p1_state_ledger.sql" >/dev/null
"${P[@]}" -f "$ROOT/supabase/migrations/0016_p1_state_ledger.sql" >/dev/null
"${P[@]}" -c "INSERT INTO auth.users (id) VALUES ('00000000-0000-0000-0000-0000000000c1') ON CONFLICT DO NOTHING" >/dev/null
(cd "$ROOT" && bash scripts/build-edge.sh >/dev/null)
(cd "$ROOT/supabase/functions/apply-actions" && "$DENO" check index.ts)
# Cảnh thử cần mùa Xuân để hành động gieo cho kết quả lặp lại được.
if [ "${1:-}" = "--serve" ]; then
  export VAC_QA_NOW_MS="${VAC_QA_NOW_MS:-1767661200000}"
fi
SUPABASE_DB_URL="postgres://postgres@127.0.0.1:$PORT_PG/postgres" PORT=$PORT_FN \
  "$DENO" run --quiet --allow-net --allow-env --allow-read local.ts & FN_PID=$!
for _ in $(seq 1 60); do curl -s -o /dev/null "http://127.0.0.1:$PORT_FN" && break; sleep 0.5; done
if [ "${1:-}" = "--serve" ]; then
  wait "$FN_PID"
  exit
fi
URL="http://127.0.0.1:$PORT_FN" "$DENO" run --quiet --allow-net --allow-env bench.ts
"${P[@]}" -t -c "SELECT CASE WHEN bool_and((s.state->>'gold')::bigint = 2500 + coalesce(l.sum,0)) THEN 'sổ cái khớp số dư: PASS' ELSE 'sổ cái LỆCH: FAIL' END
  FROM public.farm_states s LEFT JOIN (SELECT user_id, sum(delta) sum FROM public.ledger WHERE currency='GOLD' GROUP BY user_id) l USING (user_id)"
