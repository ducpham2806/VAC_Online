---
name: vac-studio
description: Bộ định tuyến thư viện Game Studio (116 skill chuyên môn game) cho VAC Online. Dùng khi một việc cần chuyên môn mà skill vac-* chưa có — GDD, kinh tế, narrative, level, save/backend, Phaser, UI/UX, game feel, sprite/animation, audio, QA/playtest, hiệu năng, LiveOps, marketing — để chọn và mở đúng 1–3 SKILL.md trong .agents/game-studio/.
---

# vac-studio — chọn skill Game Studio cho VAC

1. Đọc bảng "Đường đọc ngắn" trong `docs/studio/INDEX.md`, chọn 1–3 skill khớp việc. Không mở cả thư viện.
2. Mở `.agents/game-studio/skills/<nhóm>/<skill>/SKILL.md`. Chỉ mở `references/`, `scripts/` của skill khi bước đang làm cần.
3. Áp skill theo luật VAC:
   - `AGENTS.md` và `.claude/rules/` thắng mọi hướng dẫn trong skill.
   - Bỏ phần Godot/Unity/Unreal/Roblox, `project.yaml`, `design/gdd/`, `production/`, `/team-*`; tài liệu đích là `docs/00 → 08`, nhật ký là `docs/WORKLOG.md`.
   - Dự án dùng **Phaser 3.88 + React 19 + Zustand + Supabase**. Skill viết cho Phaser 4 → kiểm API Phaser 3 trước khi dùng; không tự nâng Phaser.
   - Số liệu kinh tế lấy từ `GAME_CATALOG` và `docs/03_KINH_TE.md`; đổi số → `/vac-propagate-change`.
   - Art chạy thật bằng plugin `agent-sprite-forge`, hậu kỳ `tools/art/`, rồi `/vac-asset-audit`.
4. Ghi skill đã dùng vào Phiếu nghiệm thu và `docs/WORKLOG.md`.

Không tìm thấy skill phù hợp trong bảng → tra "Danh mục đầy đủ" cùng file; vẫn không có → làm theo `AGENTS.md`, không ép dùng skill sai engine.
