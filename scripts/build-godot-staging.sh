#!/usr/bin/env bash
# LT-14: package Phaser and Godot from the same Git commit for one HTTPS origin.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  printf 'Cách dùng: VAC_STAGING_API_URL=https://... VAC_STAGING_PUBLISHABLE_KEY=sb_publishable_... %s <thư mục mới>\n' "$0" >&2
  exit 2
fi

repo="$(cd "$(dirname "$0")/.." && pwd -P)"
: "${VAC_STAGING_API_URL:?Cần URL HTTPS của API thử nghiệm}"
: "${VAC_STAGING_PUBLISHABLE_KEY:?Cần khóa publishable của môi trường thử nghiệm}"
if [ ! -d "$repo/node_modules" ]; then
  printf 'Chạy npm ci trong repo trước khi đóng gói staging.\n' >&2
  exit 1
fi
commit="$(git -C "$repo" rev-parse --verify "${VAC_STAGING_REF:-HEAD}^{commit}")"
target="$(python3 -c 'from pathlib import Path; import sys; print(Path(sys.argv[1]).absolute())' "$1")"
if [ -e "$target" ] || [ -L "$target" ]; then
  printf 'Thư mục đích đã tồn tại: %s\n' "$target" >&2
  exit 1
fi

mkdir -p "$(dirname "$target")"
tmp="$(mktemp -d "$(dirname "$target")/.vac-stage.XXXXXXXX")"
trap 'rm -rf -- "$tmp"' EXIT
mkdir "$tmp/source"
git -C "$repo" archive "$commit" | tar -x -C "$tmp/source"
ln -s "$repo/node_modules" "$tmp/source/node_modules"
cd "$tmp/source"
mkdir -p godot/generated
python3 - <<'PY'
import json
import os
import re
from pathlib import Path

url = os.environ["VAC_STAGING_API_URL"]
key = os.environ["VAC_STAGING_PUBLISHABLE_KEY"]
if not re.fullmatch(r"https://[A-Za-z0-9.-]+(?::[0-9]+)?", url):
    raise SystemExit("URL staging phải là origin HTTPS, không có đường dẫn hoặc dấu / cuối.")
if not re.fullmatch(r"sb_publishable_[A-Za-z0-9_-]+", key):
    raise SystemExit("Chỉ nhận khóa sb_publishable_ cho bản dựng trình duyệt.")
Path("godot/generated/godot_online.json").write_text(
    json.dumps({"url": url, "publishable_key": key, "playtest": False}), encoding="utf-8",
)
PY

VITE_SUPABASE_URL="$VAC_STAGING_API_URL" VITE_SUPABASE_ANON_KEY="$VAC_STAGING_PUBLISHABLE_KEY" npm run build
bash scripts/build-godot-web.sh
mkdir -p dist/godot
cp godot/dist/* dist/godot/

python3 - "$commit" <<'PY'
import hashlib
import json
import sys
from pathlib import Path

root = Path("dist")
godot = root / "godot"
files = ["index.html", "index.pck", "index.wasm.gz", "index.manifest.json", "index.service.worker.js"]
if not (root / "index.html").is_file():
    raise SystemExit("Thiếu trang gốc của Phaser.")
hashes = {}
for name in files:
    path = godot / name
    if not path.is_file() or path.stat().st_size == 0:
        raise SystemExit(f"Thiếu tệp Web/PWA Godot: {name}")
    hashes[name] = hashlib.sha256(path.read_bytes()).hexdigest()
(godot / "build-info.json").write_text(
    json.dumps({"commit": sys.argv[1], "sha256": hashes}, indent=2) + "\n", encoding="utf-8",
)
PY

# Move only a complete build into place. A failed build leaves the previous releases intact.
if [ -e "$target" ] || [ -L "$target" ]; then
  printf 'Thư mục đích đã xuất hiện trong lúc build: %s\n' "$target" >&2
  exit 1
fi
mv dist "$target"
printf 'Staging %s: %s\n' "$commit" "$target"
