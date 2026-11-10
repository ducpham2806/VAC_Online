# Nhật ký — tháng 11/2026 (mục cũ chuyển nguyên văn từ docs/WORKLOG.md)

## 03/11/2026 · Chuẩn bị mở GĐ2 WAITING PO · ccr-0f19bfc4-fkqi1b (đã merge PR #2)
- Sprite tạm Lán Thợ + Chú Tư + Cô Năm (atlas `world` 62 khung, 0 pixel đen); `0015_app_config_stage` + `stage_switch.test.sql`; bản chạy thử GĐ2 (Artifact riêng tư), Playwright chạy Bếp → Cơm → thuê thợ, 0 lỗi.
- Áp `0014` lên DB thật (27 RPC, `anon` bị chặn). `0015` chưa áp (Supabase hỏi xác nhận, hết 60 giây).
- Kiểm: typecheck, 178 test, build, test:sql (7 file), test:art PASS.
- **Dừng ở:** chờ PO xác nhận áp `0015`, rồi merge + deploy + bật GĐ2.

## 10/11/2026 · TOOLING-01 DONE (chờ PO duyệt kế hoạch) · claude/gifted-faraday-2q851c
- Cài Game_Studio_Agent `c5dac46` đầy đủ ở `.agents/game-studio/` (297 file, 116 skill, 21 vai trò), manifest băm từng file, `/vac-studio` + `docs/studio/INDEX.md` (đường đọc ngắn cho VAC, đánh dấu skill Phaser 4 cần đối chiếu Phaser 3).
- Graphify `0.9.105`+SQL: skill `/graphify`, hook `graphify-guard.sh`, `scripts/graphify-build.sh` chạy ở SessionStart; đồ thị 1.347 nút / 3.117 cạnh, `graphify-out/` không commit.
- Rút `AGENTS.md` 19.740 → 5.900 ký tự, thêm `CLAUDE.md`; nhật ký chuyển từ `VIEC_CAN_LAM.md` F sang WORKLOG/COMPLETED/HANDOFF; `npm run check:docs` + bước CI.
- Viết `docs/REVIEW-2026-11-10.md` + kế hoạch đề xuất (sau gộp vào `docs/07_LO_TRINH.md`). Không đổi code game/DB/kinh tế.
- Kiểm tra: typecheck, 178 test, build, check:docs PASS. Chưa chạy test:sql/test:art (không đụng `supabase/`, `tools/art/`).

## 10/11/2026 · DOCS-01 DONE (chờ PO duyệt nội dung) · claude/gifted-faraday-2q851c
- PO chọn 4 phương án: điều khiển lai đi + chạm, thời gian lai (giờ thật + 4 mùa theo tuần + ⚡ việc nặng), lưu trữ bộ cũ, bản thử 1 miền (QD-13…16).
- 4 agent trích nội dung bộ cũ; viết mới `docs/00 → 08` với mã mục và sổ quyết định; bộ cũ vào `docs_archive_merged/v1-2026-11-10/`, CSV → `data/catalog.csv`.
- `check:docs` thêm kiểm mã mục (thử: dẫn `GP-99` thì báo lỗi). Sửa agent/skill/rule, AGENTS, README, `VIEC_CAN_LAM.md` (rút gọn), chú thích code.
- Kiểm: typecheck, 178 test, build, check:docs PASS.
- **Dừng ở:** chờ PO duyệt tài liệu + trả lời các câu chờ (nay là QD-19…33).
