#!/bin/bash
# Đóng gói engine.ts (+ src/domain, src/data) thành 1 file ESM cho Edge Function (ADR-001). File sinh — không sửa tay.
set -euo pipefail
cd "$(dirname "$0")"
npx --no-install esbuild engine.ts --bundle --format=esm --platform=neutral --target=es2022 \
  --banner:js='// SINH TỰ ĐỘNG bởi build-engine.sh từ engine.ts + src/domain — KHÔNG SỬA TAY.' \
  --outfile=supabase/functions/_shared/engine.js --log-level=warning
