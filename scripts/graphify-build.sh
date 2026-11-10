#!/bin/bash
# Dựng / cập nhật đồ thị tri thức graphify cho VAC Online (chỉ AST, không tốn API).
# Phiên bản ghim: đổi GRAPHIFY_VERSION khi muốn nâng cấp và ghi vào docs/WORKLOG.md.
set -euo pipefail
GRAPHIFY_VERSION="0.9.105"
cd "$(dirname "$0")/.."

if ! command -v graphify >/dev/null 2>&1 || ! python3 -c "import tree_sitter_sql" >/dev/null 2>&1; then
  python3 -m pip install --quiet "graphifyy[sql]==${GRAPHIFY_VERSION}" 2>/dev/null \
    || python3 -m pip install --quiet --break-system-packages "graphifyy[sql]==${GRAPHIFY_VERSION}"
fi

# Lần đầu (hoặc --force) dựng toàn bộ; sau đó chỉ cập nhật file đổi.
if [ "${1:-}" = "--force" ] || [ ! -f graphify-out/graph.json ]; then
  graphify update . --force
else
  graphify update .
fi
