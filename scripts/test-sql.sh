#!/bin/bash
# Chạy test SQL của migration trên một Postgres TẠM (không đụng Supabase thật).
#  - Cục bộ: tự tìm initdb/pg_ctl (PG_BIN) và dựng cluster tạm.
#  - CI: đặt PGHOST/PGPORT/PGUSER (service container) thì dùng luôn server đó.
set -euo pipefail
cd "$(dirname "$0")/.."

DB=vac_sql_test
STARTED_LOCAL=0

if [ -z "${PGHOST:-}" ]; then
  PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
  if [ -z "$PG_BIN" ] || [ ! -x "$PG_BIN/initdb" ]; then
    echo "Không tìm thấy Postgres (đặt PG_BIN hoặc PGHOST)." >&2
    exit 1
  fi
  WORK=$(mktemp -d)
  RUN_AS=()
  if [ "$(id -u)" = "0" ]; then
    # Postgres không chạy bằng root: dùng user postgres và thư mục của nó.
    WORK=$(su postgres -c "mktemp -d")
    RUN_AS=(su postgres -c)
  fi
  CMD="$PG_BIN/initdb -D $WORK/data -A trust -U postgres >/dev/null && $PG_BIN/pg_ctl -D $WORK/data -o '-p 54399 -k $WORK -c listen_addresses=' -l $WORK/log -w start >/dev/null"
  if [ ${#RUN_AS[@]} -gt 0 ]; then "${RUN_AS[@]}" "$CMD"; else bash -c "$CMD"; fi
  STARTED_LOCAL=1
  export PGHOST="$WORK" PGPORT=54399 PGUSER=postgres
  cleanup() {
    local STOP="$PG_BIN/pg_ctl -D $WORK/data -m fast stop >/dev/null"
    if [ ${#RUN_AS[@]} -gt 0 ]; then "${RUN_AS[@]}" "$STOP" || true; else bash -c "$STOP" || true; fi
    rm -rf "$WORK"
  }
  trap cleanup EXIT
fi

PSQL=(psql -v ON_ERROR_STOP=1 -q -X)
"${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS $DB" -c "CREATE DATABASE $DB" >/dev/null
run() { echo "→ $1"; "${PSQL[@]}" -d "$DB" -f "$1" >/dev/null; }

run supabase/tests/stub_auth.sql
for f in supabase/migrations/0*.sql; do run "$f"; done
echo "→ chạy lại 0002..0004 (kiểm idempotent)"
for f in supabase/migrations/000[2-4]_*.sql; do "${PSQL[@]}" -d "$DB" -f "$f" >/dev/null; done
run supabase/seed/master_catalog_seed.sql
run supabase/seed/quest_catalog_seed.sql
run supabase/seed/master_catalog_seed.sql
echo "→ supabase/tests/farm_core.test.sql"
"${PSQL[@]}" -d "$DB" -f supabase/tests/farm_core.test.sql
[ "$STARTED_LOCAL" = 1 ] && echo "(Postgres tạm đã dừng)"
