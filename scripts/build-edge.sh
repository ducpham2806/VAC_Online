#!/bin/bash
# P1-8: đóng gói luật dùng chung (src/engine/sliceServer.ts + src/domain + src/data) cho Edge Function `apply-actions`.
# File sinh — không sửa tay, không commit (ADR-001: luật chỉ viết một lần).
set -euo pipefail
cd "$(dirname "$0")/.."
npx --no-install esbuild src/engine/sliceServer.ts --bundle --format=esm --platform=neutral --target=es2022 \
  --banner:js='// SINH TỰ ĐỘNG bởi scripts/build-edge.sh từ src/engine/sliceServer.ts — KHÔNG SỬA TAY.' \
  --outfile=supabase/functions/apply-actions/engine.js --log-level=warning
wc -c supabase/functions/apply-actions/engine.js
