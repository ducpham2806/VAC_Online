#!/bin/bash
# Chạy P0-4 cục bộ: Postgres tạm → migration + test SQL → Edge Function trên Deno → bench.
# Cần: Postgres (initdb/pg_ctl), Deno (đặt DENO=đường dẫn; ví dụ cài bằng `npm i --prefix /tmp/deno deno`).
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd ../.. && pwd)
DENO="${DENO:-deno}"
PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)}"
PORT_PG=54398; PORT_FN=8787
RUN=(bash -c); WORK=$(mktemp -d)
if [ "$(id -u)" = 0 ]; then WORK=$(su postgres -c "mktemp -d"); RUN=(su postgres -c); fi
"${RUN[@]}" "$PG_BIN/initdb -D $WORK/data -A trust -U postgres >/dev/null && $PG_BIN/pg_ctl -D $WORK/data -o '-p $PORT_PG -k $WORK -c listen_addresses=127.0.0.1' -l $WORK/log -w start >/dev/null"
FN_PID=""
cleanup() { [ -n "$FN_PID" ] && kill "$FN_PID" 2>/dev/null || true; "${RUN[@]}" "$PG_BIN/pg_ctl -D $WORK/data -m fast stop >/dev/null" || true; rm -rf "$WORK"; }
trap cleanup EXIT
P=(psql -v ON_ERROR_STOP=1 -q -X -h 127.0.0.1 -p $PORT_PG -U postgres -d postgres)
"${P[@]}" -f "$ROOT/supabase/tests/stub_auth.sql" >/dev/null
"${P[@]}" -f supabase/migrations/0001_state_ledger.sql >/dev/null
"${P[@]}" -f supabase/migrations/0001_state_ledger.sql >/dev/null   # chạy lại phải an toàn
"${P[@]}" -t -f supabase/tests/commit.test.sql | grep PASS
"${P[@]}" -c "TRUNCATE public.ledger, public.farm_states" -c "INSERT INTO auth.users (id) VALUES ('00000000-0000-0000-0000-0000000000b1'), ('00000000-0000-0000-0000-0000000000b2') ON CONFLICT DO NOTHING" >/dev/null

./build-engine.sh
SUPABASE_DB_URL="postgres://postgres@127.0.0.1:$PORT_PG/postgres" PORT=$PORT_FN \
  "$DENO" run --quiet --allow-net --allow-env --allow-read supabase/functions/apply-actions/index.ts & FN_PID=$!
for _ in $(seq 1 60); do curl -s -o /dev/null "http://127.0.0.1:$PORT_FN" && break; sleep 0.5; done
URL="http://127.0.0.1:$PORT_FN" N="${N:-100}" "$DENO" run --quiet --allow-net --allow-env bench.ts
# Sổ cái phải khớp số dư cuối của từng người chơi
"${P[@]}" -t -c "SELECT CASE WHEN bool_and((s.state->>'gold')::bigint = 2500 + coalesce(l.sum,0)) THEN 'sổ cái khớp số dư: PASS' ELSE 'sổ cái LỆCH: FAIL' END
  FROM public.farm_states s LEFT JOIN (SELECT user_id, sum(delta) sum FROM public.ledger WHERE currency='GOLD' GROUP BY user_id) l USING (user_id)"
