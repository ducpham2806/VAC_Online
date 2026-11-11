#!/usr/bin/env bash
# LT-14 bước 0. Dùng sprite gốc của VAC và xuất preset Web/PWA.
set -euo pipefail
cd "$(dirname "$0")/.."
GODOT_BIN="${GODOT_BIN:-godot}"
GODOT_VERSION="$("$GODOT_BIN" --version)"
case "$GODOT_VERSION" in
  4.7.2.stable*) ;;
  *) printf 'Cần Godot 4.7.2 stable, đang dùng %s\n' "$GODOT_VERSION" >&2; exit 1 ;;
esac

mkdir -p godot/generated godot/dist
: > godot/dist/.gdignore
for sprite in tile_grass_xuan tile_tilled_dry CROP_01_1 farmer_walk_down_0; do
  cp "art/source/p0_ai/$sprite.png" godot/generated/
done
for sprite in house_0 tree_0 rock_0 fence_0; do
  cp "art/source/p1_ai/$sprite.png" godot/generated/
done
cp public/icon-512.svg godot/generated/icon.svg

"$GODOT_BIN" --headless --path godot --import
"$GODOT_BIN" --headless --path godot --export-release Web dist/index.html
gzip -n -c godot/dist/index.wasm > godot/dist/index.wasm.gz
