# Tóm tắt việc đã hoàn tất

Bộ nhớ kết quả theo module, không phải nhật ký thứ hai. Chỉ đọc mục liên quan. Chi tiết từng ngày: [archive nhật ký cũ](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md); hiện trạng đầy đủ: `17` Phần C. "Đã code" ≠ "đã áp DB thật" ≠ "đã có người chơi".

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

## S0 · Ổn định nền móng · 31/10/2026 — DONE
- Build chạy lại; vitest + CI (typecheck → test → test:sql → build); chỉ dùng Supabase Auth, bỏ kho mật khẩu ở localStorage; công cụ debug chỉ hiện ở DEV.
- `0003_security_hardening`: RPC khóa bằng `auth.uid()`, catalog chỉ `service_role` ghi; seed catalog phía server. Dữ liệu `unlockWave` 5 Đợt (23/45/63/76/81) có test khóa.
- Quy ước: `GAME_CATALOG` (166 mục) là nguồn chuẩn; CSV (nay là `data/catalog.csv`, 146 dòng) phải là tập con.

## S1 · Vòng chơi GĐ1 trên server · 01/11/2026 — DONE, đã áp DB thật
- `0004_farm_core`: gieo, tưới, thu vào Kho, bán HTX, năng lượng +1⚡/3 phút đều tính ở server. `0005` sửa Security Advisor; smoke test thật đạt.
- Lưu tiến trình online/offline (`persist` có `version`); khóa Khay giống theo Đợt/cấp/miền.
- PO chốt: thuế Chợ 5%, bảo hiểm trộm 80%, PK `-5⚡`.

## S2 · Tách kiến trúc + khai hoang + nhiệm vụ · 01–02/11/2026 — DONE, đã áp DB thật
- Store tách 6 slice; `App.tsx` 2.084 → ~700 dòng, 11 modal ra file riêng.
- Khai hoang lưới 5×5 (`farmGrid.ts`, `0006`); mục tiêu nhiệm vụ đo trên server Ch.1–2 (`0007`); analytics D1/D7, phễu, Sources/Sinks (`0008`, `npm run supabase -- report`).
- HUD màn ngang thấp 844×390; atlas tạm 23 loài × 4 giai đoạn; bản chạy thử GĐ1 (Artifact). Vá lỗ hổng "mua món rồi bán lại" ở Bách Khoa.
- Còn mở: art thật Đợt 1 (chờ PO chọn nguồn ảnh); mục tiêu Ch.4–5, 8–10.

## S3 · Hướng dẫn tân thủ · 02/11/2026 — DONE (closed beta chưa chạy)
- Bác Bảy hướng dẫn 8 bước Chương 1–2 (`src/domain/tutorial.ts`, `TutorialCoach`).
- **Chưa có người chơi thử thật** — closed beta 50–100 người vẫn là việc mở.

## S4 · Bếp Quê & Xưởng · 02/11/2026 — DONE code, đã áp DB thật, chưa mở cho người chơi
- Luật nấu theo nguyên liệu (`cooking.ts`), `0009_kitchen` (3 bảng, 5 RPC), `recipe_seed.sql`, `CookingModal` 3 tab, nút Ăn trong Kho.
- PO chốt: Nồi Đất là khám phá công thức, giữ dữ liệu gốc và giá.

## S5 · Lán Thợ & Xưởng nghề · 03/11/2026 — DONE code, đã áp DB thật (`0010`–`0014`)
- Vật nuôi/thủy sản nhiều lứa (`0010`) — sửa lỗi lỗ mỗi lứa có từ GĐ1, có hiệu lực ngay với người chơi online.
- Thợ chỉ thu + tưới, lương 25% (Chú Tư Lv.13/200🪙, Cô Năm Lv.15/275🪙), lazy-tick server (`0011`); mục tiêu Ch.3/6/7 (`0012`); xưởng Đan Lát/Khung Cửi + đồ thợ 72h (`0013`); Phụ Cấp Ngày Mùa 300🪙 (`0014`).
- Bằng chứng cuối: typecheck, 178 test, build, test:sql (7 file), test:art PASS; Security Advisor 0 ERROR.

## Chuẩn bị mở GĐ2 · 03/11/2026 — WAITING PO
- Sprite tạm Lán Thợ + 2 thợ; `0015_app_config_stage` (công tắc giai đoạn ở DB) + test; bản chạy thử GĐ2 (Artifact riêng tư).
- **Chờ:** PO xác nhận áp `0015`, merge, deploy `VITE_GAME_STAGE=2`, bật `game_stage = 2`. Nếu PO duyệt kế hoạch làm lại thì việc này có thể không cần nữa.

## Hạ tầng AI dự án · 31/10–01/11/2026 — DONE
- 6 agent `vac-*`, 6 skill `vac-*`, 7 rule theo đường dẫn, hook `read-guard`/`secret-guard`/SessionStart, plugin `agent-sprite-forge` — chuyển thể chọn lọc từ Claude-Code-Game-Studios (`.claude/THIRD_PARTY.md`).
