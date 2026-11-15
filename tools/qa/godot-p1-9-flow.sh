#!/usr/bin/env bash
# LT-14 bước 3. Chạy cảnh Godot không cửa sổ qua vật nuôi, Bếp Củi, Kho và đơn HTX.
# Cần: scripts/build-godot-web.sh đã chạy, Godot 4.7.2 (GODOT_BIN), Deno (DENO).
set -euo pipefail
cd "$(dirname "$0")/../.."
setsid bash tools/qa/run-godot-farm-fixture.sh "${1:-XUAN}" p1-9 >/dev/null 2>&1 &
fixture=$!
setsid python3 tools/qa/serve-godot-probe.py --farm-loop >/dev/null 2>&1 &
proxy=$!
trap 'kill -- "-$fixture" "-$proxy" 2>/dev/null || true' EXIT
for _ in $(seq 40); do
  curl -fs -X POST -H 'Content-Type: application/json' -d '{"actions":[]}' http://127.0.0.1:4173/api/actions >/dev/null && break
  sleep 0.5
done
rm -f "${XDG_DATA_HOME:-$HOME/.local/share}/godot/app_userdata/VAC Online · Godot/vac_probe_snapshot.json"
"${GODOT_BIN:-godot}" --headless --path godot --script res://qa/p1_9_flow.gd
