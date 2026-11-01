"""Logic của read-guard.sh (xem mô tả trong file .sh). Đọc payload hook từ stdin."""
import json
import os
import re
import sys

limit = int(os.environ.get("VAC_READ_GUARD_BYTES", "30720"))
root = os.path.realpath(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())
try:
    data = json.loads(sys.stdin.read() or "{}")
except Exception:
    sys.exit(0)
ti = data.get("tool_input") or {}
path = ti.get("file_path") or ""
if not path or ti.get("offset") is not None or ti.get("limit") is not None:
    sys.exit(0)
real = os.path.realpath(path)
if os.path.dirname(real) != root or not re.search(r"\.(md|html|csv)$", real, re.I):
    sys.exit(0)
try:
    size = os.path.getsize(real)
except OSError:
    sys.exit(0)
if size <= limit:
    sys.exit(0)
heads = []
with open(real, encoding="utf-8", errors="replace") as fh:
    for n, line in enumerate(fh, 1):
        if re.match(r"^#{1,4} ", line) or re.match(r"^\s*<h[1-3]", line, re.I):
            heads.append(f"  {n:>5}: {line.strip()[:110]}")
        if len(heads) >= 60:
            break
msg = [
    f"read-guard: {os.path.basename(real)} lớn {size // 1024} KB (> {limit // 1024} KB). "
    "Hãy đọc theo đoạn bằng offset/limit (hoặc Grep). Mục lục (dòng: heading):"
]
msg += heads or ["  (không có heading — dùng Grep để tìm đoạn cần đọc)"]
print("\n".join(msg), file=sys.stderr)
sys.exit(2)
