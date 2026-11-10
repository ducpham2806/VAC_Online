#!/bin/bash
# Gọi hook-guard của graphify nếu đã cài; nếu chưa cài thì im lặng cho qua (không chặn công cụ).
# Đối số: search | read | compact
if command -v graphify >/dev/null 2>&1 && [ -f "${CLAUDE_PROJECT_DIR:-.}/graphify-out/graph.json" ]; then
  exec graphify hook-guard "$1"
fi
cat >/dev/null
exit 0
