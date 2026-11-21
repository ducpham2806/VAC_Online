# Thành quả lưu trữ tháng 11/2026

## Chương 1 trong Godot · 15/11/2026 · ccr-b91fc534-n2yctl
- Cảnh mở đầu, hướng dẫn 8 bước, NPC có tim, Sổ Gia Phả, âm thanh AR-40. Hết nội dung LT-14 bước 3.
- Kiểm bằng `tools/qa/godot-chapter1-flow.sh` (50 bước) và Chrome hai cỡ. Ảnh `docs/screenshots/godot-ch1-*`.
- PO duyệt, đã merge `main` tại `667445e`. Chưa thử Supabase thật và điện thoại.
- 18/11 kiểm báo cáo LT-13 với nhật ký hướng dẫn Godot trong DB thử.

## Scene nông trại Godot · 14/11/2026 · main
- Bản đồ, công trình, chướng ngại và vùng đất chỉnh trong Godot Editor. Cách chạy ở LT-14.
- Dọn, sửa, khai hoang theo GP-14. Kiểm hủy xác nhận, tưới cả loạt và mở lại ô mới.
- Vòng lúa qua fixture. HUD, cỏ, cây và ao theo mùa GP-20.
- Typecheck, 303 test, build, Web/PWA và check:docs qua. Ảnh hai cỡ.
- PO duyệt merge nhánh điền trang vào main. Còn kiểm PWA trên điện thoại thật.
- 18/11 staging kiểm giữ bản lưu Phaser v1 và gửi hàng chờ trước khi mở Godot. Chờ duyệt nhánh.

## Vùng an toàn Godot Web/PWA · 19/11/2026 · codex/godot-pwa-safe-area
- HUD, bảng và xác nhận dùng chung `safe_area.gd`, giữ lề scene.
- Quy đổi CSS env sang đơn vị UI theo canvas; cập nhật khi đổi kích thước.
- Xuất Web; Chrome hai cỡ UI-10 qua mô phỏng vùng khuyết và đổi cỡ.
- Chương 1 50/50, typecheck, 305 test, build, kiểm scene qua.
- Chưa merge/phát hành; native và điện thoại thật chưa nghiệm thu.
- Tiếp cổng LT-14 trước P1-12. [Chương 1 đã merge](archive/COMPLETED-2026-11.md).

## DOCS-01 · Bộ tài liệu mới `docs/00 → 08` · 10/11/2026 — DONE, chờ PO duyệt nội dung
- PO chốt hướng: Green Farm 3 + Harvest Moon, điều khiển lai, 4 mùa theo tuần thật, ⚡ cho việc nặng, 1 miền trước, lưu trữ bộ cũ (QD-12…17).
- Bộ cũ `00 → 17` (17 file, ~494 KB) chuyển nguyên văn sang `docs_archive_merged/v1-2026-11-10/`. Thay bằng 9 file ~68 KB: tổng quan, gameplay, thế giới, kinh tế, kỹ thuật, art, UI, lộ trình, sổ quyết định.
- Chống chồng chéo: mỗi luật một mã mục (`GP-`, `KT-`…); số chỉ ở `03` + dữ liệu; quyết định chỉ ở `08`; `check:docs` kiểm mã dẫn sai/trùng.
- CSV `04` → `data/catalog.csv`; key art → `art/key_art/`. `VIEC_CAN_LAM.md` rút gọn (bản cũ ở `docs/archive/`). Cập nhật agent/skill/rule `vac-*`, AGENTS, README, chú thích code.
- Bằng chứng: typecheck, 178 test, build, check:docs PASS. Không đổi luật code, DB hay số kinh tế.
- Giới hạn: các mục "(đề xuất)" và các câu chờ PO (PO duyệt hết ngày 10/11, nay là QD-18…33); code vẫn theo thiết kế cũ (KY-90).
