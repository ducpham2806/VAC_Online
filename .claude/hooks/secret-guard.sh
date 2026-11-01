#!/bin/bash
# PreToolUse(Bash) — chặn commit lộ bí mật (ý tưởng từ CCGS validate-commit.sh, MIT).
# Nếu lệnh là `git commit` và phần đã stage chứa token Supabase / service_role / file .env → chặn (exit 2).
INPUT=$(cat)
CMD=$(python3 -c 'import json,sys
try: print((json.load(sys.stdin).get("tool_input") or {}).get("command",""))
except Exception: print("")' <<<"$INPUT")
case "$CMD" in
  *"git commit"*|*"git -c "*" commit"*) ;;
  *) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-$PWD}" 2>/dev/null || exit 0
# Khi lệnh có `git add` ngay trước commit, xét cả file chưa stage để không lọt.
FILES=$( { git diff --cached --name-only; case "$CMD" in *"git add"*) git ls-files -m -o --exclude-standard;; esac; } 2>/dev/null | sort -u)
BAD_FILES=$(printf '%s\n' "$FILES" | grep -E '(^|/)\.env($|\.)' | grep -vE '\.env\.example$')
PATTERN='sbp_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{10,}|SUPABASE_ACCESS_TOKEN=[A-Za-z0-9_]{16,}|SUPABASE_SERVICE_ROLE_KEY=[A-Za-z0-9._-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]*c2VydmljZV9yb2xl'
HITS=$( {
  git diff --cached -U0 | grep -E '^\+'
  case "$CMD" in
    *"git add"*)
      git diff -U0 | grep -E '^\+'
      # file mới chưa track (git diff không hiện) — quét nội dung, bỏ qua file lớn/nhị phân
      git ls-files -o --exclude-standard -z -- . ':!.claude/hooks/secret-guard.sh' | xargs -0 -r grep -IsE --max-count=1 -h "$PATTERN" -- ;;
  esac
} 2>/dev/null | grep -oE "$PATTERN" | head -3)
if [ -n "$BAD_FILES" ] || [ -n "$HITS" ]; then
  {
    echo "secret-guard: CHẶN commit — có vẻ lộ bí mật."
    [ -n "$BAD_FILES" ] && echo "  File .env: $BAD_FILES"
    [ -n "$HITS" ] && echo "  Chuỗi nghi là token/khóa: $(echo "$HITS" | cut -c1-12 | sed 's/$/…/' | tr '\n' ' ')"
    echo "  Bỏ khỏi stage (git restore --staged <file>), chuyển sang biến môi trường của session, rồi commit lại."
  } >&2
  exit 2
fi
exit 0
