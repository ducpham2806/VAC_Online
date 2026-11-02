#!/bin/bash
# SessionStart hook — chuẩn bị môi trường cho Claude Code cloud session:
#  1. Thư viện Node (để chạy npm run typecheck / npm test / npm run build)
#  2. Thư viện Python cho pipeline art (agent-sprite-forge, tools/art/*.py) — không bắt buộc
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# 1. npm — chỉ cài lại khi package.json / package-lock.json / script này thay đổi
hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  npm install --no-audit --no-fund
  sha256sum .claude/hooks/session-start.sh package.json package-lock.json > "$hashes" || rm -f "$hashes"
fi

# 2. Python cho art pipeline: bỏ qua nếu đã có, và không làm hỏng session nếu cài lỗi
if command -v python3 >/dev/null 2>&1; then
  if ! python3 -c "import numpy, PIL, scipy" >/dev/null 2>&1; then
    python3 -m pip install --quiet "numpy>=1.26" "Pillow>=10.1" "scipy>=1.11" \
      || echo "session-start: bỏ qua cài thư viện Python cho art pipeline (lỗi pip)" >&2
  fi
fi
