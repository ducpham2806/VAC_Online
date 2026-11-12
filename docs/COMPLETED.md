# Tóm tắt việc đã hoàn tất

Bộ nhớ kết quả theo module, không phải nhật ký thứ hai. Chỉ đọc mục liên quan. Chi tiết từng ngày: [archive nhật ký cũ](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md); hiện trạng đầy đủ: `17` Phần C. "Đã code" ≠ "đã áp DB thật" ≠ "đã có người chơi".

## Scene nông trại Godot · 12/11/2026 · codex/godot-staging-pwa
- Bản đồ chỉnh trong Godot 4.7.2 bằng TileMapLayer và node 2D.
- Cảnh chỉnh được camera, joystick, hình lúa và VFX. Cách chạy ở LT-14.
- Đi bốn hướng, sắp lớp theo chân và VFX gieo sau xác nhận.
- Camera bám, kéo hai ngón và dừng ở mép. Chạm gieo sau khi kéo.
- Chrome hai cỡ chơi hết vòng gieo, tưới, gặt, bán. Tải lại giữ kho.
- Typecheck, 303 test, build Web và check:docs qua.
- Staging HTTPS giữ phiên Phaser ↔ Godot. Còn kiểm điện thoại thật.

## Kế hoạch chuyển P1 sang Godot · 11/11/2026 · codex/ke-hoach-chuyen-godot
- Quyết định chọn engine ở QD-90, lộ trình và nghiệm thu ở LT-14.
- Mốc đầu thử Web/PWA trên Chrome Android và Safari iPhone trước khi chuyển toàn P1.
- Đã đối chiếu hợp đồng lưu hiện có và chạy check:docs.
- Chờ PO duyệt kế hoạch và bước kiểm chứng đầu tiên.

## Đối chiếu engine cho web/PWA · 11/11/2026 · codex/doi-chieu-engine-web-pwa
- Rà đường phát hành web/PWA và khả năng đóng gói Android/iOS.
- Đề xuất giữ Phaser 3. Kết quả và căn cứ ở WORKLOG.
- Ghi nhận cần kiểm điểm vào PWA khi phát hành P1 theo LT-13.
- Chờ PO chọn bước triển khai. Đây là tư vấn kỹ thuật cho lộ trình hiện tại.

## Hoạt ảnh nông trại P1 · 11/11/2026 · codex/p1-hoat-anh-nong-trai
- Gieo, tưới, gặt có tư thế công cụ và hiệu ứng theo AR-30, AR-31.
- Dùng lại sprite P1. Gà, vịt, cá lệch nhịp và mặt ao có gợn.
- Kiểm build, 303 test, Chrome 2 cỡ, P1-9 và hướng dẫn tới Chương 1.
- Chờ PO duyệt nhánh. P1-12 tiếp tục theo LT-13.

## Mẫu VFX tưới P1 · 11/11/2026 · codex/p1-vfx-tuoi
- Giọt nước theo AR-31 chạy từ sự kiện đã tưới thành công trên `?p1`.
- Đã kiểm đúng ô, kết thúc tự dọn, không phát lại khi chạm ô đã tưới.
- Typecheck, 303 test, build, check:docs và Chrome 2 cỡ PASS.
- Chờ PO xem mẫu trên nhánh riêng. Bước tiếp của playtest vẫn ở LT-13.

## Rà soát dự án và bộ công cụ agent · 11/11/2026 · c58623e
- Rà thiết kế, hai luồng MVP và P1, dữ liệu, migration, pipeline ảnh, kiểm thử và cấu hình agent.
- Đọc các định nghĩa VAC; lập bản đồ 10 nhóm skill và 3 tầng vai trò của Game Studio theo chỉ mục ghim.
- Đối chiếu kiến trúc bằng Graphify và mã nguồn. Build và check:docs qua tại checkout cục bộ.
- Kiểm thử đầy đủ còn vướng thành phần môi trường, chi tiết trong WORKLOG. P1-12 tiếp tục theo LT-13.

## P1-8 · Lưu online bản thử · 11/11/2026 — DONE (đã áp DB thật, đã triển khai; chưa có người chơi thử)
- DB VAC: `farm_states` + `ledger` + `_commit_farm_state` (ADR-002) và `playtest_events` (migration `0016`, chỉ thêm).
- Edge Function `apply-actions` chạy đúng luật `src/engine` (ADR-001); giờ, số ngẫu nhiên, kết quả do server quyết.
- Người chơi đăng nhập ẩn danh; thao tác hiện ngay, gửi lô, server thắng khi lệch; mất mạng giữ hàng chờ.
- Đo: xử lý trên server p95 11 ms (function chạy cùng vùng DB `ap-southeast-1`).
- Kiểm: test SQL, chạy cục bộ Postgres + Deno, kịch bản online thật `tools/qa/p1-8-online-smoke.cjs`.

## P1-9 · Bộ 8 loài, chỗ nuôi, Bếp Củi, đơn HTX · 11/11/2026 — DONE (chưa có người chơi thử)
- 8 loài Đợt 1 hai mùa Xuân + Thu (QD-86): 5 cây, gà, vịt, cá rô; cấp mở riêng bản thử (KT-21).
- 9 chỗ nuôi trên bản đồ: 4 gà (mở khi sửa Chuồng), 2 vịt mép ao, 3 cá; thả/thu bằng chạm, chưa có cho ăn.
- Bếp Củi là hạng mục thứ 4: nấu Cơm Trắng, tìm Canh Cải Cá Rô ở Nồi Đất, ăn món hồi ⚡ (QD-87).
- Bảng đơn HTX 3 đơn, thưởng vàng + XP ×1,2–1,5, bỏ đơn chờ 10 phút (KT-14).
- Ảnh thật của PO cho 4 cây, vịt, Bếp, 2 món. Kiểm: `tools/qa/p1-9-smoke.cjs` 2 cỡ. Ảnh: `docs/screenshots/p1-9-*`.

## P1-11 · NPC có tim, Chương 1, hướng dẫn · 10/11/2026 — DONE (chưa có người chơi thử)
- Cảnh mở đầu (TG-40): Bác Bảy trao tráp, Bá Kiến ép bán đất, người chơi chọn tình nghĩa / thực dụng.
- 2 NPC có tim (Bác Bảy, Cô Giáo Hương): nói chuyện, tặng quà mỗi ngày, mốc 2 tim có cảnh ngắn (KT-19).
- Sổ Gia Phả Chương 1: tưới + gặt lúa + sửa Nhà → nhận 600🪙 + 15💎 + 100 XP + thưởng nhánh.
- Hướng dẫn 8 bước của Bác Bảy có mũi tên trên bản đồ; kiểm tự động: người mới đi hết không kẹt ở 2 cỡ màn.
- Chưa: art NPC thật (Cô Hương mượn hình nông dân nữ), cảnh tim 4–10, server. Ảnh: `docs/screenshots/p1-11-*`.

## P1-10 · Điền trang: dọn, sửa, khai hoang · 10/11/2026 — DONE (chưa có người chơi thử)
- Dọn đá / gốc cây (tốn ⚡) lấy Gỗ, Đá; sửa Giếng, Chuồng gà, Nhà (vàng + vật liệu, hỏi lại trước khi trừ) theo QD-83, KT-18.
- Giếng chưa sửa thì mỗi lượt kéo chỉ tưới 1 ô; sửa xong tưới cả loạt. Khai hoang theo vùng `500 × 1,25^k` (KT-15), vùng 1 +8 ô, vùng 2 +14 ô.
- Bản đồ đổi hình theo trạng thái; hình đổ nát vẫn là hình tạm. Ảnh: `docs/screenshots/p1-10-*`.
- Chưa: SQL/server (P1-8), mốc thưởng Phong Thủy, art thật.

## P1-6…7 · Mùa trên bản đồ, lưu cục bộ · 10/11/2026 — DONE (chưa có người chơi thử)
- 4 mùa trên bản đồ (cỏ, ao, tán cây) theo AR-11, công tắc đổi mùa trong ⚙️ cho người chơi thử.
- Tiến trình bản thử lưu trên máy, có phiên bản và kiểm bản hỏng; tải lại trang không mất.
- Ảnh: `docs/screenshots/p1-6-*`.

## P1-4…5 · Chạm ô, làm cả loạt, HUD lai · 10/11/2026 — DONE (chưa có người chơi thử)
- Vòng gieo → tưới → gặt → bán HTX chạy được trong `?p1`, mọi thay đổi qua engine dùng chung.
- Chạm ô xa: nhân vật đi tới rồi làm; kéo trên ruộng: làm cả loạt ≤ 12 ô (KT-16); nút hành động dùng công cụ tự chọn (GP-02).
- HUD theo wireframe P0-5, mọi nút ≥ 44 px ở 1280×720 và 844×390. Ảnh: `docs/screenshots/p1-4-*`, `p1-5-*`.
- Chưa: lưu, server, chuồng/ao/khai hoang (thẻ sau).

## P1-1…3 · Nền bản thử đi bộ · 10/11/2026 — DONE (chưa có người chơi thử)
- Atlas `slice` từ ảnh PO tạo (QD-80, QD-82), audit đạt.
- Engine luật dùng chung ở `src/engine/applyActions.ts` (ADR-001).
- `?p1`: scene điền trang Bắc Bộ, nhân vật đi 4 hướng bằng joystick nổi hoặc chạm-đi-tới (A*), kéo xem bản đồ (UI-20). Ảnh `docs/screenshots/p1-3-*.png`.
- Chưa: thao tác ô, HUD, lưu, server (P1-4…8).

## P0 · Chốt nền · 10/11/2026 — DONE (trừ P0-6)
- **Quyết định:** PO duyệt toàn bộ đề xuất (QD-18…32); không cấp API key ảnh (QD-33).
- **P0-3 ADR + dữ liệu:** ADR-001 một bản luật TS trên Edge Function; ADR-002 `farm_states` + `ledger` + khóa lạc quan; ADR-003 một nguồn dữ liệu `data/`. Thêm cột `Seasons` (48 cây) và lịch mùa `src/domain/season.ts`, có test.
- **P0-4 thử nghiệm kỹ thuật** (`prototypes/p0-4-edge/`): chạy được ở máy cục bộ, p95 3,1 ms chưa tính mạng, khóa lạc quan + sổ cái đúng. Còn P0-6: đo trên Supabase thật (QD-81: dùng project cũ; chờ kết nối Supabase tới project VAC).
- **P0-5:** wireframe HUD điều khiển lai (`docs/wireframes/`). Rút ra: thanh công cụ thu gọn mặc định.
- **P0-2:** mẫu hình vẽ code 28 khung theo chuẩn mới; ảnh thật PO tạo (QD-80) nhập bằng `tools/art/import_sheet.py` → `art/source/p0_ai/` (28 khung, 0 pixel lạc bảng, cảnh ghép `scene_x3.png`).
- **Bằng chứng:** typecheck, 190 test, build, check:docs, test:art PASS; `run-local.sh` PASS.

## DOCS-01 · Bộ tài liệu mới `docs/00 → 08` · 10/11/2026 — DONE, chờ PO duyệt nội dung
- PO chốt hướng: Green Farm 3 + Harvest Moon, điều khiển lai, 4 mùa theo tuần thật, ⚡ cho việc nặng, 1 miền trước, lưu trữ bộ cũ (QD-12…17).
- Bộ cũ `00 → 17` (17 file, ~494 KB) chuyển nguyên văn sang `docs_archive_merged/v1-2026-11-10/`. Thay bằng 9 file ~68 KB: tổng quan, gameplay, thế giới, kinh tế, kỹ thuật, art, UI, lộ trình, sổ quyết định.
- Chống chồng chéo: mỗi luật một mã mục (`GP-`, `KT-`…); số chỉ ở `03` + dữ liệu; quyết định chỉ ở `08`; `check:docs` kiểm mã dẫn sai/trùng.
- CSV `04` → `data/catalog.csv`; key art → `art/key_art/`. `VIEC_CAN_LAM.md` rút gọn (bản cũ ở `docs/archive/`). Cập nhật agent/skill/rule `vac-*`, AGENTS, README, chú thích code.
- Bằng chứng: typecheck, 178 test, build, check:docs PASS. Không đổi luật code, DB hay số kinh tế.
- Giới hạn: các mục "(đề xuất)" và các câu chờ PO (PO duyệt hết ngày 10/11, nay là QD-18…33); code vẫn theo thiết kế cũ (KY-90).

## TOOLING-01 · Game Studio + Graphify + hệ nhật ký · 10/11/2026
- Nhánh `claude/gifted-faraday-2q851c`. Cài thư viện Game_Studio_Agent `c5dac46` (297 file, 116 skill, 21 vai trò) ở `.agents/game-studio/`, manifest băm từng file, skill định tuyến `/vac-studio`, chỉ mục riêng cho VAC.
- Graphify `0.9.105` (+SQL): skill `/graphify`, hook nhắc tra đồ thị, SessionStart tự cài và dựng `graphify-out/` (~1.350 nút, không commit).
- Rút `AGENTS.md` 19,7 KB → ~6 KB, giữ đủ RULE D0/D1 (bản cũ nguyên văn ở archive). Nhật ký chuyển từ `VIEC_CAN_LAM.md` mục F sang `docs/WORKLOG.md` + COMPLETED + HANDOFF, có `npm run check:docs`.
- Bản đánh giá plan: `docs/REVIEW-2026-11-10.md`; kế hoạch đề xuất sau đó gộp vào `docs/07_LO_TRINH.md`.
- Không đổi code game, DB hay kinh tế.

Mục cũ hơn (S0–S5, hạ tầng AI, MVP cũ): [archive/COMPLETED-MVP-2026-11.md](archive/COMPLETED-MVP-2026-11.md).
