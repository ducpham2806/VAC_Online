#!/usr/bin/env bash
# LT-14 bước 3. Người chơi mới: cảnh mở đầu, 8 bước hướng dẫn, NPC có tim, nhận thưởng Chương 1.
exec bash "$(dirname "$0")/godot-flow.sh" fast chapter1_flow "$@"
