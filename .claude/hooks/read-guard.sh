#!/bin/bash
# PreToolUse(Read) — chuyển thể từ CCGS validate-read.sh (MIT, Donchitos/Claude-Code-Game-Studios).
# Chặn việc đọc NGUYÊN FILE tài liệu lớn (> 30 KB, .md/.html/.csv ở thư mục gốc dự án) và trả về
# mục lục heading kèm số dòng, để lần sau đọc đúng đoạn cần (offset/limit). Đọc theo đoạn luôn được.
# exit 2 = chặn (stderr gửi cho Claude); exit 0 = cho qua (kể cả khi chính hook gặp lỗi).
command -v python3 >/dev/null 2>&1 || exit 0
python3 "$(dirname "$0")/read_guard.py"
code=$?
[ "$code" = 2 ] && exit 2
exit 0
