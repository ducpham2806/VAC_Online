# 04 · Kỹ thuật

**Sở hữu:** kiến trúc, đường đi của dữ liệu, DB, bảo mật, quy tắc code, kiểm thử, hiện trạng code.
**Không chứa:** luật chơi (`01`), con số (`03`), chuẩn hình ảnh (`05`).
Rule theo đường dẫn trong `.claude/rules/` là bản thi hành của file này. Hai nơi lệch nhau thì file này thắng, và phải sửa rule cho khớp.

### KY-01 · Stack
- **Client:** Phaser 3.88 (`pixelArt`, `roundPixels`, full màn hình ngang), React 19 + TypeScript strict + Tailwind 4, store Zustand. Phaser và React nói chuyện qua `EventBus`.
- **Server:** Supabase (Postgres, Auth, RLS, Realtime).
- **Phát hành:** PWA trên Vercel; Capacitor (iOS/Android) sau P3.
- **Kiểm tra:** vitest, `npm run test:sql` (Postgres tạm), CI chạy typecheck → test → build → check:docs → test:sql.

### KY-10 · Kiến trúc đích (QD-20)
Lý do và phương án: [ADR-001](adr/ADR-001-mot-ban-luat.md) (một bản luật), [ADR-002](adr/ADR-002-trang-thai-va-so-cai.md) (trạng thái + sổ cái), [ADR-003](adr/ADR-003-mot-nguon-du-lieu.md) (một nguồn dữ liệu).

1. **Một bản luật:** luật chơi là hàm thuần TypeScript trong `src/domain/`, nhận `now` và `rng` làm tham số.
   - Client dùng để hiển thị trước kết quả.
   - Server chạy đúng code đó trong Supabase Edge Function để quyết định thật.
   - Không viết lại luật bằng PL/pgSQL.
2. **Lưu trạng thái:** mỗi người chơi có một bản ghi trạng thái nông trại kèm cột `version`.
   - Edge Function đọc trạng thái, áp thao tác (có thể gộp nhiều thao tác một lần), rồi ghi lại với điều kiện `version` chưa đổi; xung đột thì thử lại.
   - Mọi thay đổi tiền tệ ghi vào **sổ cái** (`ledger`), dùng cho analytics và chống gian lận.
3. **Thời gian và ngẫu nhiên chỉ server quyết** (giờ server, RNG server). Client chỉ dự đoán.
4. **Trade-off:** Edge Function có độ trễ khởi động; mất `FOR UPDATE`. Chấp nhận vì game nông trại bất đồng bộ (100–300 ms/thao tác).
   - *Phương án dự phòng:* giữ RPC PL/pgSQL hiện tại và sinh test chéo TS ↔ SQL.
5. **Hiện trạng:** luật đang viết hai lần, TS + SQL (`0004 → 0015`), xem KY-90.
6. **Thử nghiệm P0-4** (`prototypes/p0-4-edge/README.md`) chạy được ở máy cục bộ; **P1-8 (11/11)** đã chạy thật trên project VAC: Edge Function `apply-actions` (`supabase/functions/apply-actions/`, luật đóng gói từ `src/engine/sliceServer.ts`). Function phải chạy cùng vùng DB (`ap-southeast-1`, client gửi `x-region`): xử lý p95 11 ms; để vùng mặc định (gần người gọi) thì ~900 ms vì mỗi truy vấn DB đi xa.

### KY-20 · Một nguồn dữ liệu
- **Đích:** `data/catalog.csv` (và các bảng dữ liệu sau này) → script sinh `src/data/*.generated.ts` + `supabase/seed/*.sql` + bảng tóm tắt cho tài liệu. Không ai sửa tay file sinh ra.
- **Hiện trạng:** `GAME_CATALOG` (`src/data/masterData.ts`, 166 mục) là nguồn chuẩn. `data/catalog.csv` (146 dòng, thiếu `MAC_`, `FASH_`) phải khớp ID và Đợt (`catalog.test.ts`). Có 43 giá trị đang lệch, phải gộp ở ADR-003 (LT-10).
- **Cột cho hướng mới:** `Seasons` đã thêm 10/11 (mùa gieo được, GP-20; khớp `src/data/seasons.ts`, test khóa). Sẽ thêm ở P1: `toolAction` (công cụ dùng cho ô), `fruitSeasons` (mùa ra quả của cây lâu năm, QD-29).

### KY-30 · Quy tắc code
1. TypeScript strict, `tsc --noEmit` 0 lỗi, không `any`.
2. 100% data-driven: giá, thời gian, XP, Đợt, mùa chỉ đọc từ dữ liệu (KY-20).
3. Luật ở `src/domain/`: hàm thuần, không import store/React/Phaser/Supabase; trả `{ ok, save, message }`, không throw; mỗi nhánh từ chối có test.
4. Không bao giờ để số dư âm: kiểm `≥ cost` trước khi trừ; luôn kẹp trần (⚡, Giỏ, trần thưởng).
5. Lọc XSS mọi chuỗi người dùng nhập (tên, chat, lưu bút).
6. UI không giữ state game, chỉ đọc store qua selector. Component mới đặt ở `src/ui/hud|modals`. Không dùng `alert/confirm`, dùng toast/modal.
7. Phaser: gỡ `subscribe`, `EventBus.on`, timer khi scene shutdown; đồng hồ là `Date.now() + clockOffsetMs`.
8. Tính năng của pha/Đợt sau bọc `isStageOpen(n)`. Công cụ debug chỉ chạy sau `import.meta.env.DEV`.
9. Âm thanh tổng hợp WebAudio, không tải file (`05` AR-40).
10. Không phá chữ ký hàm, state hay luồng đang chạy. Save local có `version` + `migrate`.

### KY-31 · Quy tắc DB (additive-only)
- Mỗi thay đổi là một file mới `supabase/migrations/NNNN_ten.sql`; không sửa migration đã chạy.
- Chỉ dùng `CREATE … IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS … DEFAULT`, `CREATE OR REPLACE`.
- **Cấm** `DROP TABLE/COLUMN`, đổi tên cột đang dùng, đổi ID thực thể (TQ-06).
- Hàm `SECURITY DEFINER`:
  - `SET search_path = public, pg_temp`;
  - danh tính chỉ lấy từ `auth.uid()`, không nhận user id làm tham số;
  - `REVOKE … FROM PUBLIC, anon`.
- RLS mặc định từ chối; người chơi chỉ đọc dữ liệu của mình.
- Seed chỉ upsert, không `DELETE`. File seed sinh tự động (`npm run seed:catalog`).
- Mỗi migration có test trong `supabase/tests/`.
- Bản làm lại dùng lại project Supabase cũ (QD-81). Dữ liệu MVP bỏ được; được viết lại schema **một lần** khi chuyển sang ADR-002 (migration riêng, PO duyệt trước khi áp). Sau mốc đó quay lại additive-only.

### KY-40 · Bảo mật — lỗi đã gặp, không lặp lại
| Đã xảy ra | Luật |
|---|---|
| Kinh tế tính ở client (giờ máy, `Math.random`, nút tua ×60) | Giờ và RNG chỉ server quyết; bản phát hành không có nút cheat |
| RPC nhận `p_thief_id` / xác suất từ client; ai cũng ghi được catalog | Không tin tham số client; catalog chỉ `service_role` ghi |
| Mật khẩu thô và OTP ở localStorage, tài khoản demo | Chỉ Supabase Auth; không lưu bí mật ở client hay trong repo (hook `secret-guard`) |
| Seed `DELETE` xóa dữ liệu thật | Seed chỉ upsert |
| Bán chợ nhận tiền trước khi có người mua; trộm không trừ nạn nhân | Giao dịch hai phía atomic, có escrow, zero-sum |
| Bộ QC ghi lên production | Test không bao giờ chạm mạng hay DB thật |
| Service worker cache cả request Supabase; chat tăng vô hạn | SW loại trừ Supabase; chat/listing có giới hạn hoặc TTL; mốc "hôm nay" theo giờ server |

### KY-50 · Kiểm thử và bàn giao
- Trước khi báo xong: `npm run typecheck && npm test && npm run build && npm run check:docs`. Thêm `npm run test:sql` khi đụng `supabase/`, `npm run test:art` khi đụng `tools/art/`.
- Không skip hay nới test để CI xanh. "Chưa kiểm được" khác "đạt".
- Thay đổi người chơi nhìn thấy được: chạy bản thật và chụp 1280×720 + 844×390 (`06` UI-10).

### KY-60 · Realtime (sau 1.0, GP-80)
- **Phòng:** tối đa 25–30 người/phòng (QD-23). Gửi vị trí 10 Hz khi có di chuyển; client nội suy `lerp` 0,18 ở 60 FPS.
- **Minigame:** chuẩn `IHyperCasualCartridge` (`init / onActionInput / update / dispose`, seed RNG chung) chỉ làm khi có trọng tài server.

### KY-70 · PWA và app
- **PWA:** manifest khóa màn ngang + `viewport-fit=cover`.
- **Cần sửa trước P3:** thêm icon PNG 192/512; service worker không cache Supabase.
- **App:** Capacitor 7 đã có cấu hình nhưng chưa cài gói `@capacitor/*` (làm sau P3).

### KY-90 · Hiện trạng code (MVP cũ, đến 10/11/2026)
Code đang chạy theo **thiết kế cũ**: chạm thẳng, không có mùa, nhân vật chỉ là hình.
- **Scene:** game mặc định chỉ có `BootScene` và `FarmScene`. Bản thử P1 (`?p1`): `src/game/slice/EstateScene.ts` + store `useSliceStore` + HUD `src/ui/hud/SliceHud.tsx`. Có: đi bộ, chạm ô (đi tới rồi làm), kéo cả loạt, nút hành động, túi hạt theo mùa, Kho bán HTX. 6 ô ruộng (bằng người chơi mới, KT-01). Điền trang (P1-10, `src/domain/estate.ts`, bố cục `src/data/estateLayout.ts`): dọn 3 đá + 3 gốc cây lấy vật liệu, sửa giếng/chuồng/nhà (hỏi lại trước khi trừ vàng), giếng mở tưới cả loạt, khai hoang 2 vùng (+22 ô); hình nhà/giếng/chuồng gà (đổ nát → đã sửa), NPC, cây đa, tre, đá, cỏ dại, rào từ ảnh thật của PO, atlas `estate` (bản thử không còn dùng atlas `world`). P1-11: cảnh mở đầu chọn hướng, 2 NPC có tim (`src/domain/npc.ts`, dữ liệu `src/data/npcs.ts`), Sổ Gia Phả Chương 1 (`src/domain/story.ts`), hướng dẫn 8 bước có mũi tên (`sliceTutorial.ts`), HUD `src/ui/hud/SliceStoryHud.tsx`. Mùa trên bản đồ theo AR-11 + công tắc đổi mùa trong ⚙️ (engine nhận `ctx.season` tùy chọn, chỉ client bản thử truyền). Lưu cục bộ `vac_slice_save_v1` (version 4: thêm `save.estate`, `save.npcs`, `save.story`, cờ hướng dẫn, chỗ nuôi, bếp, đơn; đọc được v1–v3; `migrate`, khớp ô ruộng với bản đồ khi đọc), có nút chơi lại từ đầu. Nội dung P1-9 (QD-86, QD-87): hạt giống chỉ 5 cây; 9 chỗ nuôi gà/vịt/cá trong `save.tiles` (vùng `COOP`/`POND`); Bếp Củi là hạng mục `KITCHEN` (xưởng `MAC_02`, bảng nấu + Nồi Đất, ăn món trong Kho); bảng đơn HTX `save.orders` (`src/domain/orders.ts`); engine `ctx.slice` bật luật bản thử. Ảnh thật PO (11/11): 5 cây + gà/vịt/cá trong atlas `slice`, Bếp Củi trong atlas `estate`, icon Cơm/Canh ở `src/assets/icons/`. Nhật ký chơi thử ẩn danh `vac_slice_playtest_v1` (P1-12, `src/game/slice/playtest.ts`, báo cáo `npm run playtest:report`). **Online (P1-8, QD-89):** `src/services/sliceSync.ts` đăng nhập ẩn danh, gửi lô thao tác tới `apply-actions`, ảnh chụp server + hàng chờ (`vac_slice_queue_v1`) dựng lại trạng thái; gửi nhật ký vào `playtest_events`; `?offline` hoặc thiếu cấu hình Supabase thì chơi trên máy. DB thật đã áp `0016` (11/11); function đã triển khai (`npm run build:edge`, rồi `npx supabase functions deploy apply-actions --project-ref znabynzbcimpesrxxxsz --use-api --no-verify-jwt`, cần access token). Kiểm thử khói: `tools/qa/p1-slice-smoke.cjs`, người mới theo hướng dẫn: `tools/qa/p1-tutorial-smoke.cjs`.
- Trong nhánh hoạt ảnh P1, `SliceFarmFx` nhận `TileFx` từ `EstateScene`. Nhịp vật nuôi và gợn ao nằm trong `EstateScene` (AR-30, AR-31).
- Cảnh kiểm chứng Godot ghép bản đồ `estate_map.tscn` với HUD và API thử trong `estate_probe.tscn`. Bản đồ ghép `farmer.tscn` và `rice_plot.tscn`, sắp lớp theo tọa độ chân. `EstateCamera` giới hạn góc nhìn theo lớp `Ground`. HUD và `touch_joystick.tscn` neo theo màn hình. Fixture gọi engine qua `tools/qa/godot-farm-fixture.ts`. Chế độ online dùng `godot/supabase_farm.gd` để gọi Supabase Auth và `apply-actions`. Cách chạy ở LT-14.
- **Engine dùng chung:** `src/engine/applyActions.ts` (ADR-001), Edge Function thử nghiệm đóng gói từ đây. Thao tác: `PLANT`, `WATER`, `HARVEST`, `SELL`, `CLEAR`, `REPAIR`, `RECLAIM`, `TALK`, `GIFT`, `CHOOSE_PATH`, `CLAIM_CHAPTER`; 7 thao tác mới chỉ có trong engine mới, không có RPC SQL cũ.
- **Store:** 6 slice.
- **Test:** 303 test TS, 8 file test SQL, 9 test asset.
- **DB thật:** đã chạy `0001 → 0014` + seed; `0015` chưa áp; `app_game_stage() = 1`.
- **Phần nên giữ khi làm lại:**
  - hàm luật `src/domain/*` + test;
  - pipeline art `tools/art/`;
  - `soundEffects.ts`;
  - analytics `0008`;
  - luồng Supabase Auth.
- Tóm tắt từng sprint: `docs/COMPLETED.md`. Bản kiểm toán cũ: `docs_archive_merged/v1-2026-11-10/17_PROJECT_AUDIT…md`.
