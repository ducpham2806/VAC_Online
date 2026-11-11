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

## 10/11/2026 · P1-10 DONE (QD-83 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-83 theo đề xuất (giếng khóa tưới cả loạt, vật liệu hữu hạn, khai hoang theo vùng). Ghi vào `03` KT-15 (viết lại theo vùng), KT-18 (mới), KT-20; `01` GP-02, GP-14; tiền tố `MAT_` vào TQ-06 + AGENTS D1.4.
- Code: `src/domain/estate.ts` (dọn / sửa / khai hoang, hàm thuần), bố cục chuyển sang `src/data/estateLayout.ts`; engine thêm `CLEAR`/`REPAIR`/`RECLAIM` + khóa tưới 1 ô/lô khi giếng chưa sửa; `estateTarget.ts` (chạm đối tượng ra việc gì); store hỏi lại trước khi tiêu vàng (`pending`); scene: đá/cây biến mất khi dọn, hạng mục đổ nát xỉn tối + biển "cần sửa", chuồng chưa sửa không có gà, vùng kế tiếp có khung mờ; Kho hiện vật liệu + Phong Thủy. Bản lưu lên version 2 (đọc được v1).
- Kiểm: typecheck, 250 test (+25), build, check:docs PASS. Smoke 2 cỡ: tưới khi giếng hỏng 1/6 ô; dọn 2 đá + 3 gốc cây, sửa đủ 3 hạng mục (Phong Thủy 90), khai hoang vùng 1 (+8 ô); sau khi sửa giếng kéo tưới cả loạt; tải lại giữ tiến trình; 0 nút < 44 px.
- Chưa: không có SQL vì 3 thao tác mới chỉ chạy trong engine dùng chung (Edge Function, P1-8). Hình đổ nát/đã sửa vẫn là hình tạm.
- **Dừng ở:** P1-9 chờ PO duyệt 8 loài; P1-8 chờ quyền Supabase; P1-11 làm được (cần P1-10 ✓).

## 10/11/2026 · P1-11 DONE (QD-84 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-84 theo đề xuất. Ghi `03` KT-19 (mới), `01` GP-50, GP-62, `02` TG-40, `04` KY-90.
- Code: `src/domain/npc.ts` (tim, nói chuyện, tặng quà theo ngày giờ VN), `src/domain/story.ts` (chọn hướng, Chương 1, thưởng từ `src/data/quests.ts`), `src/data/npcs.ts`; engine thêm `TALK`/`GIFT`/`CHOOSE_PATH`/`CLAIM_CHAPTER`; `sliceTutorial.ts` 8 bước, mũi tên chỉ chỗ lấy vật liệu khi thiếu; HUD `SliceStoryHud.tsx` (cảnh mở đầu, thanh hướng dẫn chạm xuyên, hộp thoại NPC, Sổ Gia Phả); NPC trên bản đồ có 💬. Bản lưu version 3 (đọc được v1, v2).
- Kiểm: typecheck, 270 test (+20), build, test:art, check:docs PASS. `tools/qa/p1-tutorial-smoke.cjs` (mới) 2 cỡ: người mới theo đúng thanh hướng dẫn đi hết 8 bước rồi nhận Chương 1, không kẹt, 0 lỗi JS (cho lúa chín ngay). `p1-slice-smoke.cjs` 2 cỡ: thêm cảnh mở đầu, Gia Phả, tặng quà, nhận Chương 1; 0 nút < 44 px.
- Sửa trong lúc kiểm: thanh hướng dẫn che ruộng ở 844×390 → cho chạm xuyên. Lưu ý: chạy kiểm khói thì đừng sửa file khi Vite đang chạy (Vite tải lại trang).
- **Dừng ở:** P1-9 chờ PO duyệt 8 loài; P1-8 chờ quyền Supabase; sau đó P1-12 chơi thử.

## 11/11/2026 · Nhập 6 ảnh P1 của PO (nhà, giếng, chuồng gà, NPC, chân dung) · claude/gifted-faraday-2q851c
- PO đẩy 6 ảnh lên `main` (`9450a80`); gộp `main` vào nhánh. `import_sheet.py --p1` → `art/source/p1_ai/` 17 khung (0 lạc bảng, 0 pixel đen, alpha 0/255, đúng cỡ AR-20) → atlas `public/assets/atlas/estate.*`; chân dung → `public/assets/portraits/`.
- `?p1`: nhà/giếng/chuồng gà đổi khung đổ nát → đã sửa (bỏ tô tối), chuồng gà tre đặt ở góc sân; Bác Bảy, Cô Hương dùng ảnh mới (2 khung đứng, 2 khung nói khi mở hộp thoại); chân dung trong hộp thoại NPC và cảnh mở đầu (Bá Kiến).
- Kiểm: typecheck, 270 test, build, test:art, check:docs PASS; smoke 2 cỡ + người mới theo hướng dẫn (844×390) PASS, 0 lỗi JS, 0 nút < 44 px. Ảnh: `docs/screenshots/p1-art-estate-{broken,repaired}-1280x720.png`.
- 11/11 (tiếp): nhập thêm 5 ảnh thiên nhiên (`580bca3`): cây đa, 2 bụi tre, 3 đá, 3 cỏ dại, 2 đoạn rào → atlas `estate` 28 khung (0 lạc bảng, 0 pixel đen). Rào AI vẽ xéo → `import_sheet.py` thêm `shear` nắn rail thành ngang; scene ghép rào chồng mép 6 px, dàn đều khớp mép. `?p1` bỏ hẳn atlas `world`. Smoke 2 cỡ + người mới PASS, 0 lỗi JS, 0 nút < 44 px.
- 11/11 (tiếp 2): PO yêu cầu NPC +15% → QD-85, NPC nhập lại ở khung 56×74 (không phóng trong game, giữ nét pixel). PO tạo lại rào (vẽ thẳng, bỏ `shear`) và gửi cây xoan (`48edc92`, `7b73099`): gốc cây chặt lấy Gỗ đổi sang xoan già; cây đa thành 1 cây cổ thụ đầu làng `D` (góc trên phải, chắn lối, chạm thì nhắc không chặt). Atlas `estate` 29 khung, 0 lạc bảng, 0 pixel đen. 271 test; smoke 2 cỡ + người mới PASS. Ảnh: `docs/screenshots/p1-art-trees-1280x720.png`.
- **Dừng ở:** P1-9 (chờ duyệt 8 loài), P1-8 (chờ quyền Supabase).

## 11/11/2026 · P1-9 bắt đầu (QD-86 PO duyệt 8 loài) · claude/gifted-faraday-2q851c
- PO duyệt bộ 8 loài Xuân + Thu → QD-86. Code: `src/data/sliceContent.ts` (8 loài, 2 món, 2 mùa); `sowableSeeds` chỉ còn 5 cây bản thử (Hạ: Lúa, Rau Muống; Đông: Ngô, Hành, Cải).
- Prompt 7 ảnh mới: `art/prompts/p1_species.md` (4 cây, vịt, Bếp Củi đổ nát/đã sửa, 2 món).
- Kiểm: typecheck, 273 test (+2) PASS.
- Phát hiện: dữ liệu chưa có luật cho vật nuôi ăn cám (Cối Xay Cám hoãn); Bếp Củi khóa ở Giai đoạn 2 (`CRAFT_MIN_STAGE`); cấp mở của Cải/Bếp (Lv4), Vịt (Lv6) xa so với XP bản thử.
- **Dừng ở:** chờ PO duyệt đề xuất số liệu Bếp Củi, chỗ nuôi, bảng đơn HTX (đã gửi trong chat); chờ 7 ảnh.

## 11/11/2026 · P1-9 code xong (QD-87 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-87. Ghi `03` KT-14 (đơn HTX), KT-18 (Bếp Củi), KT-21 (mới: cấp mở riêng bản thử, chỗ nuôi, chưa cho ăn); `01` GP-13, GP-30, GP-40; `04` KY-90.
- Code: `src/domain/orders.ts` (bảng 3 đơn, hệ số 1,2/1,35/1,5, bỏ đơn chờ 10 phút); `estate.ts` thêm hạng mục `KITCHEN` (`K` cạnh nhà) + 9 chỗ nuôi (`COOP`/`POND`, chỗ gà mở khi sửa Chuồng); `cooking.ts` thêm `KitchenRules` tùy chọn; `plant` thêm cấp mở thay thế tùy chọn; engine `ctx.slice` + 7 thao tác (`COOK`, `COLLECT_DISH`, `EAT`, `DISCOVER`, `REFRESH_ORDERS`, `DELIVER_ORDER`, `SKIP_ORDER`); HUD `SliceKitchenHud.tsx` (bảng nấu + Nồi Đất, bảng đơn), Kho có nút Ăn; scene vẽ chỗ nuôi (khung mờ khi trống, biểu tượng khi tới lứa), bỏ gà/cá trang trí. Bản lưu v4.
- Kiểm: typecheck, 289 test (+16), build, check:docs PASS. Smoke cũ 2 cỡ + người mới (844×390) PASS. `tools/qa/p1-9-smoke.cjs` (mới) 2 cỡ: sửa chuồng → thả gà/vịt/cá → thu; sửa Bếp → nấu Cơm → lấy → Nồi Đất tìm Canh → ăn hồi ⚡; bảng 3 đơn → giao đúng thưởng → bỏ đơn; tải lại giữ; 0 nút < 44 px; 0 lỗi JS. Ảnh `docs/screenshots/p1-9-*`.
- `/vac-balance-check`: Lúa lãi/phút và XP/phút cao nhất (3,33🪙, 0,56 XP mỗi ô) — cây cấp cao kém cây cấp 1 (cần chạm nhiều hơn, chưa đo); Cơm bán lỗ 1🪙 so với bán Lúa, Canh lời 1🪙 (món dùng để hồi ⚡ và giao đơn); Sources/Sinks NOT ASSESSED — chưa có người chơi.
- **Dừng ở:** chờ 7 ảnh PO (`art/prompts/p1_species.md`); đang dùng hình tạm (atlas `wave1`, Bếp vẽ bằng code). Sau đó P1-8 (Supabase), P1-12.

## 11/11/2026 · P1-9 DONE: nhập 7 ảnh loài mới của PO · claude/gifted-faraday-2q851c
- Gộp `main` (`9730ada`): Rau Muống, Ngô, Hành & Mùi, Cải (4 giai đoạn), vịt, Bếp Củi (đổ nát/đã sửa), 2 món.
- `import_sheet.py`: cây/vịt vào `art/source/p0_ai/` → atlas `slice` (48 khung, khung cũ giữ nguyên); Bếp + món vào `art/source/p1_ai/` → atlas `estate` (33 khung); icon món chép sang `src/assets/icons/PROD_01|03.png`. Thêm tách 2 hình chạm nhau trong cùng dải (Hành giai đoạn 3–4 chạm lá) + test (9 test art).
- HUD: icon món ở bảng nấu và Kho. 0 pixel đen, 0 lạc bảng.
- Kiểm: typecheck, 289 test, test:art, build, check:docs PASS; `p1-9-smoke.cjs` 2 cỡ PASS (thêm ảnh ruộng 5 cây), 0 lỗi JS, 0 nút < 44 px. Ảnh `docs/screenshots/p1-9-*`.
- **Dừng ở:** P1-8 (chờ quyền Supabase), rồi P1-12 chơi thử.

## 11/11/2026 · P1-12 chuẩn bị chơi thử (QD-88) · claude/gifted-faraday-2q851c
- PO chọn: thu số liệu qua server sau P1-8; PO tự triển khai link (không có project Vercel cho VAC, tài khoản Vercel nối chỉ có nama-crm-hrm) → QD-88, kế hoạch `07` LT-13.
- Code: `src/game/slice/playtest.ts` (nhật ký ẩn danh `vac_slice_playtest_v1`: phiên, thao tác thành công theo loại, cấp, bước hướng dẫn; tối đa 3.000 sự kiện; mốc `sent` cho P1-8; gộp phiên mở 2 lần do StrictMode); `playtestMetrics.ts` (D1 theo giờ VN, phễu 8 bước, phiên đầu, cấp); `npm run playtest:report`; mã chơi thử ở ⚙️ Cài đặt.
- Kiểm: typecheck, 295 test (+6), build, check:docs PASS; smoke người mới 844×390: nhật ký đủ MOVE→DONE, 1 phiên; smoke p1-9 + slice 2 cỡ PASS, 0 lỗi JS, 0 nút < 44 px; bản build production (`vite preview`) chạy `?p1`, ghi sự kiện, không lộ công cụ dev.
- **Dừng ở:** chờ P1-8 (quyền Supabase VAC) để gửi sự kiện lên server; PO triển khai link + mời người chơi. Chưa có người chơi thử nào.

## 11/11/2026 · P1-8 DONE: lưu online (QD-89) — ĐÃ ÁP DB THẬT, ĐÃ TRIỂN KHAI FUNCTION · claude/gifted-faraday-2q851c
- PO duyệt QD-89, bật đăng nhập ẩn danh. Kết nối Supabase nay thấy project VAC `znabynzbcimpesrxxxsz` (17 bảng MVP, 0 dòng, chưa có function).
- Migration `0016_p1_state_ledger.sql` (chỉ thêm): `farm_states`, `ledger`, `_commit_farm_state` (chỉ service_role), `playtest_events` (chỉ thêm dòng của mình), view `playtest_logs`. Test `supabase/tests/p1_state.test.sql`. **Đã áp lên DB thật 11/11** (`apply_migration`); advisors: không cảnh báo mới ngoài "anonymous đọc dòng của mình" (chủ ý), cảnh báo cũ của MVP giữ nguyên.
- Edge Function `apply-actions` (luật `src/engine/sliceServer.ts` đóng gói `npm run build:edge`, kiểm dạng lô, token qua `getClaims`, CORS + `x-region`). **Đã triển khai 11/11** bằng Supabase CLI (`--use-api`; access token PO lưu ở môi trường, không vào repo). Môi trường cloud thêm host `znabynzbcimpesrxxxsz.supabase.co`.
- Client `src/services/sliceSync.ts`: đăng nhập ẩn danh (gộp gọi trùng), hàng chờ lưu máy, gửi lô 0,8 s, dựng lại = ảnh chụp server + hàng chờ, mất mạng thử lại 2–30 s, 404 → về chơi trên máy; gửi nhật ký chơi thử; HUD báo mất kết nối; online ẩn công tắc mùa / chơi lại; `?offline` cho kiểm thử khói.
- Kiểm: typecheck, 303 test, test:sql (8 file), build, check:docs PASS. Cục bộ (Postgres + Deno): p95 3,6 ms, sổ cái khớp. Thật: xử lý trên server p95 11 ms; từ máy cloud (xa, qua proxy) tính cả mạng p95 379 ms (vùng mặc định p95 ~3,4 s → ép `ap-southeast-1`); sổ cái khớp số dư. `tools/qa/p1-8-online-smoke.cjs` PASS (ONLINE → gieo lên server → xóa bản lưu máy, tải lại lấy từ server → nhật ký lên server). Smoke offline 3 kịch bản PASS.
- Dữ liệu kiểm thử còn trên DB thật: 7 người chơi ẩn danh, 2 trạng thái, 4 dòng sổ cái, 8 sự kiện (chờ PO cho xóa).
- **Dừng ở:** P1-12 — PO triển khai link, mời người chơi.

## 11/11/2026 · Rà soát dự án và bộ công cụ agent · codex/ra-soat-du-an (nền c58623e)
- Kiểm kê 999 tệp Git; tra Graphify cục bộ (1.984 nút), đối chiếu hai luồng MVP và P1 từ điểm vào tới lưu trạng thái.
- Đọc cấu hình Claude, 7 skill VAC, Graphify và 6 agent VAC; rà danh mục 116 skill và 21 playbook Game Studio (c5dac46). Skill dùng: Graphify, Supabase (đọc mã cục bộ).
- Kiểm thật: build và check:docs PASS. Typecheck thiếu kiểu Node; Vitest chưa cài; SQL thiếu Postgres cục bộ; test art thiếu numpy (6 lỗi import).
- **Dừng ở:** rà soát xong; P1-12 vẫn chờ PO phát hành link và mời người chơi.
