# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 10/11/2026 · P0-2 ảnh thật (QD-80) + QD-81 · claude/gifted-faraday-2q851c (PR #3 đã merge; nhánh làm lại từ main)
- PO đẩy 5 tấm ảnh AI vào `art/source/inbox/` (commit `b2448fc` trên main). Viết `tools/art/import_sheet.py`: cắt nhiều khung/tấm, chung tỉ lệ thu, thu bằng màu đa số; lật gương hàng "trái" (ảnh AI vẽ cả 2 hàng quay phải); cắt mép ô nền để lát liền.
- Kết quả `art/source/p0_ai/`: 28 khung, 0 pixel lạc bảng / gần đen; `preview_x4.png`, cảnh ghép `scene_x3.png`. Thêm 3 test vào `test_pipeline.py`.
- QD-81: PO cho dùng project Supabase cũ, dữ liệu MVP bỏ được, viết lại schema một lần (thay QD-20; KY-31, AGENTS D1.4).
- P0-6 **BLOCKED**: kết nối Supabase của phiên chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`. Không đụng project CRM.
- Kiểm: test:art (6 test), check:docs, typecheck, test, build — xem commit.
- **Dừng ở:** PO nối Supabase tới project VAC → P0-6; PO trả lời QD-82 (cỡ gà, lúa không ụ bùn); lập thẻ P1.

## 10/11/2026 · P0 chốt nền DONE (trừ P0-6) · claude/gifted-faraday-2q851c
- PO duyệt mọi đề xuất (QD-18…32). PO không cấp API key ảnh (QD-33); em đã tạo môi trường cloud riêng `VAC_Online` (chỉ mở `api.openai.com`), không lưu khóa nào.
- P0-3: 3 ADR (`docs/adr/`); cột `Seasons` trong `data/catalog.csv` + `src/data/seasons.ts`; `src/domain/season.ts` (lịch 4 mùa, KT-17); test: mỗi miền Đợt 1 có ≥ 6 cây/mùa.
- P0-4: `prototypes/p0-4-edge/` — luật TS đóng gói chạy trên Deno, `farm_states` + `ledger` + khóa lạc quan. Kết quả: p95 3,1 ms ở máy cục bộ; song song có thử lại; sổ cái khớp. Chưa đo trên Supabase thật (QD-81).
- P0-5: wireframe HUD lai + ảnh 2 cỡ. Phát hiện: thanh công cụ phải thu gọn (UI-20).
- P0-2: 28 khung mẫu vẽ bằng code (`tools/art/codeart_p0_samples.py`, 0 pixel lạc bảng); prompt cho PO: `art/prompts/p0_samples.md`.
- Kiểm: typecheck, 190 test, build, check:docs, test:art, `run-local.sh` PASS.
- **Dừng ở:** chờ PO trả lời QD-80 (ảnh thật) và QD-81 (project Supabase mới) → P0-6, rồi lập thẻ P1.

## 10/11/2026 · DOCS-01 DONE (chờ PO duyệt nội dung) · claude/gifted-faraday-2q851c
- PO chọn 4 phương án: điều khiển lai đi + chạm, thời gian lai (giờ thật + 4 mùa theo tuần + ⚡ việc nặng), lưu trữ bộ cũ, bản thử 1 miền (QD-13…16).
- 4 agent trích nội dung bộ cũ; viết mới `docs/00 → 08` với mã mục và sổ quyết định; bộ cũ vào `docs_archive_merged/v1-2026-11-10/`, CSV → `data/catalog.csv`.
- `check:docs` thêm kiểm mã mục (thử: dẫn `GP-99` thì báo lỗi). Sửa agent/skill/rule, AGENTS, README, `VIEC_CAN_LAM.md` (rút gọn), chú thích code.
- Kiểm: typecheck, 178 test, build, check:docs PASS.
- **Dừng ở:** chờ PO duyệt tài liệu + trả lời các câu chờ (nay là QD-19…33).
