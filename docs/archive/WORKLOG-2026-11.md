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

## 10/11/2026 · P0 chốt nền DONE (trừ P0-6) · claude/gifted-faraday-2q851c
- PO duyệt mọi đề xuất (QD-18…32). PO không cấp API key ảnh (QD-33); em đã tạo môi trường cloud riêng `VAC_Online` (chỉ mở `api.openai.com`), không lưu khóa nào.
- P0-3: 3 ADR (`docs/adr/`); cột `Seasons` trong `data/catalog.csv` + `src/data/seasons.ts`; `src/domain/season.ts` (lịch 4 mùa, KT-17); test: mỗi miền Đợt 1 có ≥ 6 cây/mùa.
- P0-4: `prototypes/p0-4-edge/` — luật TS đóng gói chạy trên Deno, `farm_states` + `ledger` + khóa lạc quan. Kết quả: p95 3,1 ms ở máy cục bộ; song song có thử lại; sổ cái khớp. Chưa đo trên Supabase thật (QD-81).
- P0-5: wireframe HUD lai + ảnh 2 cỡ. Phát hiện: thanh công cụ phải thu gọn (UI-20).
- P0-2: 28 khung mẫu vẽ bằng code (`tools/art/codeart_p0_samples.py`, 0 pixel lạc bảng); prompt cho PO: `art/prompts/p0_samples.md`.
- Kiểm: typecheck, 190 test, build, check:docs, test:art, `run-local.sh` PASS.
- **Dừng ở:** chờ PO trả lời QD-80 (ảnh thật) và QD-81 (project Supabase mới) → P0-6, rồi lập thẻ P1.

## 10/11/2026 · P0-2 ảnh thật (QD-80) + QD-81 · claude/gifted-faraday-2q851c (PR #3 đã merge; nhánh làm lại từ main)
- PO đẩy 5 tấm ảnh AI vào `art/source/inbox/` (commit `b2448fc` trên main). Viết `tools/art/import_sheet.py`: cắt nhiều khung/tấm, chung tỉ lệ thu, thu bằng màu đa số; lật gương hàng "trái" (ảnh AI vẽ cả 2 hàng quay phải); cắt mép ô nền để lát liền.
- Kết quả `art/source/p0_ai/`: 28 khung, 0 pixel lạc bảng / gần đen; `preview_x4.png`, cảnh ghép `scene_x3.png`. Thêm 3 test vào `test_pipeline.py`.
- QD-81: PO cho dùng project Supabase cũ, dữ liệu MVP bỏ được, viết lại schema một lần (thay QD-20; KY-31, AGENTS D1.4).
- P0-6 **BLOCKED**: kết nối Supabase của phiên chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`. Không đụng project CRM.
- Kiểm: test:art (6 test), check:docs, typecheck, test, build — xem commit.
- **Dừng ở:** PO nối Supabase tới project VAC → P0-6; PO trả lời QD-82 (cỡ gà, lúa không ụ bùn); lập thẻ P1.

## 10/11/2026 · P1-1…3 DONE + QD-82 · claude/gifted-faraday-2q851c
- QD-82 (PO đồng ý): `import_sheet.py` thêm `fit` (gà ~40×40 trong khung 48) và `strip_soil` (lúa bỏ ụ bùn); không cần PO tạo lại ảnh. +1 test asset.
- Thẻ P1 viết ở `07` LT-12 (12 thẻ; P1-8 BLOCKED chờ quyền Supabase project VAC).
- P1-1: atlas `public/assets/atlas/slice.*` (28 khung), audit: 0 pixel đen, 100% bảng 64 màu, đúng cỡ.
- P1-2: engine chuyển `prototypes/p0-4-edge/engine.ts` → `src/engine/applyActions.ts`; prototype chỉ re-export; `build-engine.sh` vẫn đóng gói được.
- P1-3: `src/game/slice/` — bản đồ 30×18 ô, A* tìm đường (chạm vật cản → ô sát nó), joystick nổi góc dưới trái, kéo xem bản đồ; mở bằng `?p1`, game MVP không đổi. 11 test mới. Chạy thật Playwright 1280×720 + 844×390: chạm đi tới ô (11,9), joystick đi phải 4 ô, 0 lỗi JS; ảnh `docs/screenshots/p1-3-*.png`.
- Kiểm: typecheck, 201 test, build, test:art, check:docs PASS.
- **Dừng ở:** P1-4 (chạm ô → công cụ tự chọn, kéo làm cả loạt, gọi engine) và P1-5 (HUD). P0-6/P1-8 chờ quyền Supabase.

## 10/11/2026 · P1-4 + P1-5 DONE · claude/gifted-faraday-2q851c
- P1-4: `src/domain/tools.ts` (GP-02 công cụ tự chọn, tầm 1 ô, kéo cả loạt ≤ 12 ô chốt công cụ theo ô đầu, giai đoạn hình cây); `useSliceStore` gọi `applyActions`; scene: chạm ô xa → đi tới rồi làm, kéo trên ruộng = làm cả loạt, kéo chỗ khác = xem bản đồ. Bản đồ: 6 ô ruộng + đất hoang.
- P1-5: `src/ui/hud/SliceHud.tsx` theo UI-20/30: cấp + XP, mùa + còn N ngày, 🪙💎⚡, nút hành động, thanh công cụ thu gọn 8 ô, túi hạt lọc mùa, dock (Kho bán HTX; Đơn/Gia Phả/Bạn báo thẻ sau), thông báo. Thêm `.touch-btn-44`.
- GP-02 và UI-20 ghi thêm luật tầm làm việc, chốt công cụ khi kéo, nút hành động.
- Kiểm: typecheck, 216 test (+15), build, test:art, check:docs PASS. `tools/qa/p1-slice-smoke.cjs` ở 1280×720 + 844×390: gieo 1 + kéo gieo 5, kéo tưới 6, nút gặt 1 + kéo gặt 5, bán 12 lúa +48 🪙; 0 nút < 44 px; 0 lỗi JS.
- Lưu ý: ảnh chụp toàn màn ở 844×390 có ô trắng sau khung mùa khi đang có thông báo; chụp 1 pixel thì đúng màu — nghi lỗi chụp của Chromium headless trên canvas WebGL, chưa kiểm trên máy thật.
- **Dừng ở:** P1-6 (mùa trên bản đồ, công tắc đổi mùa), P1-7 (lưu cục bộ). P1-8 chờ quyền Supabase.

## 10/11/2026 · P1-6 + P1-7 DONE · claude/gifted-faraday-2q851c
- P1-6: cỏ Hạ/Thu sinh từ cỏ Xuân bằng đổi màu khóa bảng (AR-11), atlas `slice` 30 khung; scene đổi cỏ, tông ao và tán cây theo mùa; đất hoang tô sẫm để luôn thấy ranh giới. Công tắc mùa trong ⚙️ (Lịch thật / 4 mùa); engine nhận `ctx.season` tùy chọn (chỉ client bản thử). Túi hạt lọc theo mùa đang áp dụng; mùa không có giống thì báo rõ.
- P1-7: `useSliceStore` lưu `vac_slice_save_v1` (version 1, chỉ lưu save + giống + công tắc mùa); bản hỏng/khác phiên bản → chơi lại; `reconcileSliceSave` khớp ô ruộng với bản đồ. Nút "Chơi lại từ đầu" có xác nhận.
- Kiểm: typecheck, 225 test (+9), build, test:art, check:docs PASS. `tools/qa/p1-slice-smoke.cjs` 2 cỡ: 4 mùa đổi đúng (bản đồ + HUD), Đông túi hạt trống, tải lại trang giữ ô đã gieo và vàng; 0 nút < 44 px; 0 lỗi JS.
- **Dừng ở:** P1-8 chờ quyền Supabase project VAC; P1-9 chờ PO duyệt 8 loài; P1-10 (sửa nhà/giếng/chuồng, khai hoang) làm được ngay.

## 10/11/2026 · P1-10 Bước 1: đề xuất số liệu, chờ PO (QD-83) · claude/gifted-faraday-2q851c
- Impact report: (1) core VAC: thêm vòng dọn chướng ngại → vật liệu → sửa hạng mục, không đổi gieo/tưới/gặt; (2) kinh tế: CÓ — 2 vật liệu mới `MAT_GO`/`MAT_DA`, giá sửa, ⚡ dọn đá/gốc cây (KT-20 "chốt ở P1"), khai hoang thêm 22 ô ruộng; (3) art/UI: hạng mục đổ nát/đã sửa vẽ tạm từ atlas `world` (tô tối + đống gạch), cần PO tạo ảnh thật sau; (4) module cũ: MVP không đổi, engine thêm 3 action `CLEAR`/`REPAIR`/`RECLAIM`, bản lưu bản thử lên version 2 có `migrate`; (5) DB: chưa (P1-8 BLOCKED), engine dùng chung nên không viết luật SQL riêng.
- Tổng chi để sửa đủ 3 hạng mục: 1.200🪙 + 12 Gỗ + 6 Đá; bản đồ có 3 cụm gốc cây (15 Gỗ) và 3 tảng đá (9 Đá), dư một chút. Người mới có 2.500🪙. Vật liệu hữu hạn trong bản thử (không mọc lại).
- Khai hoang: vùng 1 (8 ô) 500🪙, vùng 2 (14 ô) 625🪙, mỗi vùng 5⚡ +45 XP +25 Phong Thủy. Sửa hạng mục +20/30/40 Phong Thủy (giếng/chuồng/nhà); mốc thưởng Phong Thủy để sau.
- **Dừng ở:** chờ PO duyệt QD-83 (hoặc sửa số), rồi mới code P1-10.

## 10/11/2026 · P1-11 Bước 1: đề xuất, chờ PO (QD-84) · claude/gifted-faraday-2q851c
- Impact report: (1) core VAC: CÓ — thêm NPC có tim (GP-50), Chương 1 (TG-30, TG-40) và hướng dẫn (GP-62) vào bản thử; không đổi vòng gieo/tưới/gặt; (2) kinh tế: CÓ — thưởng Chương 1 (dùng số đang có: 600🪙 + 15💎 + 100 XP + nhánh tình nghĩa +30 Phong Thủy +3 Nghĩa Xóm / thực dụng +350🪙), quà tặng tiêu hàng trong Kho; (3) art/UI: Bác Bảy dùng hình `bacbay_idle` có sẵn, Cô Hương tạm dùng hình nông dân nữ của atlas `world`; hộp thoại + nút Nói chuyện / Tặng quà, thanh hướng dẫn thu gọn được; (4) module cũ: MVP và `src/domain/tutorial.ts` không đổi, bản thử có danh sách bước riêng; engine thêm `TALK`, `GIFT`, `CHOOSE_PATH`, `CLAIM_CHAPTER`; bản lưu bản thử lên version 3 (đọc được v1, v2); (5) DB: chưa (P1-8).
- Kiểm "không kẹt": người mới 2.500🪙; đi hết 8 bước tốn ~800🪙 (giếng 300 + nhà 500 + hạt lúa), ⚡ 12/50 (2 đá + 2 gốc cây). Lúa chín ~2 phút.
- **Dừng ở:** chờ PO duyệt QD-84 (hoặc sửa), rồi mới code P1-11.
