#!/usr/bin/env bash
# LT-14 bước 0. Dùng sprite gốc của VAC và xuất preset Web/PWA.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ "$#" -gt 1 ] || { [ "$#" -eq 1 ] && [ "$1" != "--prepare-only" ]; }; then
  printf 'Cách dùng: %s [--prepare-only]\n' "$0" >&2
  exit 1
fi
GODOT_BIN="${GODOT_BIN:-godot}"
GODOT_VERSION="$("$GODOT_BIN" --version)"
case "$GODOT_VERSION" in
  4.7.2.stable*) ;;
  *) printf 'Cần Godot 4.7.2 stable, đang dùng %s\n' "$GODOT_VERSION" >&2; exit 1 ;;
esac

if [ -f godot/generated/godot_online.json ]; then
  python3 - godot/generated/godot_online.json <<'PY'
import json
import re
import sys
from pathlib import Path

try:
    config = json.loads(Path(sys.argv[1]).read_text())
    if not isinstance(config, dict) or set(config) - {"url", "publishable_key", "region", "playtest"}:
        raise ValueError
    if not re.fullmatch(r"sb_publishable_[A-Za-z0-9_-]+", config.get("publishable_key", "")):
        raise ValueError
    if not re.fullmatch(r"https://[A-Za-z0-9.-]+(?::[0-9]+)?/?|http://(?:localhost|127\.0\.0\.1):[0-9]+/?", config.get("url", "")):
        raise ValueError
    if not re.fullmatch(r"[A-Za-z0-9_-]*", config.get("region", "")) or not isinstance(config.get("playtest", False), bool):
        raise ValueError
except (OSError, TypeError, ValueError):
    raise SystemExit("godot_online.json cần URL project và khóa publishable hợp lệ.")
PY
fi

mkdir -p godot/generated godot/dist
: > godot/dist/.gdignore
for sprite in tile_grass_{xuan,ha,thu,dong} tile_tilled_dry tile_tilled_wet; do
  cp "art/source/p0_ai/$sprite.png" godot/generated/
done
cp art/source/p0_ai/CROP_{01,02,03,04,05}_{0,1,2,3}.png godot/generated/
cp art/source/p0_ai/farmer_walk_{up,down,left}_{0,1,2,3}.png godot/generated/
# Khung right_0 trong bộ gốc quay trái.
cp art/source/p0_ai/farmer_walk_right_{1,2,3}.png godot/generated/
for sprite in {house,well,coop,kitchen}_{0,1} tree_0 xoan_0 rock_{0,1,2} fence_0 weed_2; do
  cp "art/source/p1_ai/$sprite.png" godot/generated/
done
cp public/icon-512.svg godot/generated/icon.svg
npx --no-install tsx scripts/export-godot-seasons.ts > godot/generated/season_calendar.gd
npx --no-install tsx scripts/export-godot-estate.ts > godot/generated/estate.json

"$GODOT_BIN" --headless --path godot --import
if [ "${1:-}" = "--prepare-only" ]; then
  exit 0
fi
"$GODOT_BIN" --headless --path godot --export-release Web dist/index.html
if [ -f godot/generated/godot_online.json ]; then
  bridge_file="$(mktemp)"
  trap 'rm -f "$bridge_file"' EXIT
  npx --no-install esbuild src/services/godotWebAuth.ts --bundle --minify --platform=browser \
    --format=iife --outfile="$bridge_file"
  python3 - godot/dist/index.html "$bridge_file" <<'PY'
import sys
from pathlib import Path

page = Path(sys.argv[1])
script = Path(sys.argv[2]).read_text()
html = page.read_text()
tag = "<script src=\"index.js\"></script>"
if html.count(tag) != 1 or "</script" in script.lower():
    raise SystemExit("Không thể gắn cầu nối Auth vào bản xuất Godot.")
page.write_text(html.replace(tag, "<script>" + script + "</script>\n" + tag))
PY
fi
gzip -n -c godot/dist/index.wasm > godot/dist/index.wasm.gz
