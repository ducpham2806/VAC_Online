# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 10/11/2026 · TOOLING-01 DONE (chờ PO duyệt kế hoạch) · claude/gifted-faraday-2q851c
- Cài Game_Studio_Agent `c5dac46` đầy đủ ở `.agents/game-studio/` (297 file, 116 skill, 21 vai trò), manifest băm từng file, `/vac-studio` + `docs/studio/INDEX.md` (đường đọc ngắn cho VAC, đánh dấu skill Phaser 4 cần đối chiếu Phaser 3).
- Graphify `0.9.105`+SQL: skill `/graphify`, hook `graphify-guard.sh`, `scripts/graphify-build.sh` chạy ở SessionStart; đồ thị 1.347 nút / 3.117 cạnh, `graphify-out/` không commit.
- Rút `AGENTS.md` 19.740 → 5.900 ký tự, thêm `CLAUDE.md`; nhật ký chuyển từ `VIEC_CAN_LAM.md` F sang WORKLOG/COMPLETED/HANDOFF; `npm run check:docs` + bước CI.
- Viết `docs/REVIEW-2026-11-10.md` + `docs/PROJECT-PLAN.md` (đề xuất build lại phần nền). Không đổi code game/DB/kinh tế.
- Kiểm tra: typecheck, 178 test, build, check:docs PASS. Chưa chạy test:sql/test:art (không đụng `supabase/`, `tools/art/`).
- **Dừng ở:** chờ PO trả lời `VIEC_CAN_LAM.md` mục A0.

## 03/11/2026 · Chuẩn bị mở GĐ2 WAITING PO · ccr-0f19bfc4-fkqi1b (đã merge PR #2)
- Sprite tạm Lán Thợ + Chú Tư + Cô Năm (atlas `world` 62 khung, 0 pixel đen); `0015_app_config_stage` + `stage_switch.test.sql`; bản chạy thử GĐ2 (Artifact riêng tư), Playwright chạy Bếp → Cơm → thuê thợ, 0 lỗi.
- Áp `0014` lên DB thật (27 RPC, `anon` bị chặn). `0015` chưa áp (Supabase hỏi xác nhận, hết 60 giây).
- Kiểm: typecheck, 178 test, build, test:sql (7 file), test:art PASS.
- **Dừng ở:** chờ PO xác nhận áp `0015`, rồi merge + deploy + bật GĐ2.
