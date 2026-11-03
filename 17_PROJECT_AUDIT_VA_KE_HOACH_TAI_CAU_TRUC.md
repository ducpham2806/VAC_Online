# 17 — Kiểm toán dự án & Kế hoạch tái cấu trúc (Project Audit & Re-plan)

**Dự án:** VAC Online — Hương Đồng Gió Nội
**Phiên bản:** 1.3 — kiểm toán 2026-10-31 (commit `05a3a6a`); cập nhật sau Sprint S0 (mục C0), S1 (mục C1), áp dụng CCGS (D5) và sửa lệch số liệu tài liệu (E), PO chốt thuế 5% / bảo hiểm 80% / PK tốn ⚡ (E)
**Phạm vi:** Toàn bộ tài liệu `00 → 16`, `AGENTS.md`, `src/`, `supabase/migrations/`, `public/`, cấu hình build.
**Vai trò của file này (RULE D0):** Đây là nguồn chân lý duy nhất về **hiện trạng thực tế** của code so với tài liệu thiết kế, và về **kế hoạch tái cấu trúc + cách dùng agent/skill thật**. Các file `00 → 16` vẫn là nguồn chân lý về *thiết kế đích*; chỗ nào lệch thì file này ghi rõ.
**Bối cảnh team:** 1 người (PO kiêm dev) + AI agents.

---

## PHẦN A — HIỆN TRẠNG (đã kiểm chứng trực tiếp trên repo)

### A1. Số liệu: tài liệu nói vs thực tế

| Hạng mục | Tài liệu nói | Thực tế trong repo |
|---|---|---|
| Thực thể gốc | 155 | CSV `04` có **146** dòng dữ liệu; `GAME_CATALOG` (`src/data/masterData.ts`) có **166** mục = 146 của CSV + 8 `MAC_` + 12 `FASH_`. 43 giá trị lệch CSV (chủ yếu `baseSellGold` gấp đôi, ví dụ `CROP_01` = 4 trong code, 2 trong CSV) |
| Prefix ID | `CROP_, TREE_, ANI_, AQUA_, DISH_, WORK_, MAC_, PET_, FASH_, DEC_, ITEM_, CRAFT_` | Thực tế: `CROP_48, PROD_27, AQUA_19, ANI_14, BM_12, FASH_12, MAC_8, WORK_6, NEW_5, PET_4, CRAFT_4, IAP_4, DEF_2, TRAP_1` (+ `MKT_` cho listing mẫu). **Không có** `TREE_`, `DISH_`, `DEC_`, `ITEM_` |
| Test cases | 37 | **25** `runCase` trong `src/services/qcTestRunner.ts`, chạy bằng nút trong HUD (`App.tsx:629, 1947`). Ít nhất 4 TC sẽ fail theo code hiện tại: `TC-01.3a` (đợi 155), `TC-03.4a`, `TC-02.4a` (không có trần 25 ô), `TC-06.2a` (không `await`) |
| Bảng / RPC Supabase | 11 bảng / 7 RPC | **8 bảng / 5 RPC**. Thiếu `steal_logs`, `arena_matches`, `minigame_leaderboards`, `rpc_settle_arena_wager`, `rpc_submit_minigame_score`. Migration `0003` được nhắc trong `03` nhưng chưa tồn tại |
| Phaser scenes | `FarmScene`, `SocialPlazaScene`, `MinigameHostScene` + `IHyperCasualCartridge` | Chỉ có `BootScene` và `FarmScene` |
| Mở khóa 5 Đợt (`23 → 45 → 63 → 76 → 81`) | Trụ cột Core Gameplay | **Chưa hiện thực**: `CatalogItem` (`src/data/types.ts`) không có trường đợt/giai đoạn; Khay giống hiển thị toàn bộ loài (`App.tsx:189`) |
| 17 AI Skills | Tự động nhận diện & kích hoạt | Không có file skill/agent nào trong repo. Xem Phần D |
| Build | `tsc --noEmit` 0 lỗi | **Gần như chắc chắn fail**: `src/services/authService.ts:1` import `getSupabaseClient` nhưng `supabaseClient.ts` không export hàm này |

### A2. Điểm mạnh
1. **Concept có bản sắc rõ:** VAC 3 miền, Gia Phả 10 chương, Kỷ vật 8x–9x, PK dân gian không bạo lực. Key art (`image.png`, `fb_cover.png`) đẹp, đúng chất.
2. **Thiết kế kinh tế có tư duy:** Van chống lạm phát, bảng Sources/Sinks, trần arcade, thuế zero-sum, cấm đổi vàng → ngọc.
3. **Lộ trình mở khóa theo Đợt** hợp lý cho cả retention lẫn khối lượng sản xuất art. Khung 6 giai đoạn / 11 Epic / 52 Module nhất quán trong `00 → 11`.
4. **Stack phù hợp:** Phaser 3 + React 19 + Zustand + Supabase + PWA/Capacitor. TypeScript strict, 0 `any` / `as any` / `@ts-ignore`.
5. **Phần code đã tốt:** Hệ Gia nhân + lazy-tick offline tương đối hoàn chỉnh; âm thanh WebAudio tổng hợp (`soundEffects.ts`) đầy đủ; Realtime chat/presence chạy thật.
6. **Có tư duy quản trị AI** (RULE D0/D1, impact report, approval gate).

### A3. Blocker — phải sửa trước mọi tính năng mới
| # | Vấn đề | Bằng chứng |
|---|---|---|
| B1 | Build hỏng do import không tồn tại | `authService.ts:1, 135, 207, 312, 371` |
| B2 | **Không lưu tiến trình**: store không `persist`, không ghi DB. F5 = quay về save demo Lv.20 / 28.500 vàng. `level` không bao giờ tăng | `useGameStore.ts:223-300` |
| B3 | **Kinh tế 100% ở client**: thời gian chín dùng `Date.now()` của máy, xác suất dùng `Math.random()`, nút "⏩ x60" ở HUD, thu hoạch cộng tiền 2 lần (vàng + vật phẩm) | `useGameStore.ts:947-1061, 1010-1016, 1675`; `App.tsx:394` |
| B4 | **Lỗ hổng Supabase**: `rpc_sync_master_catalog` cho phép bất kỳ ai ghi đè toàn bộ giá/XP, và client tự gọi mỗi lần khởi động; RPC nhận `p_thief_id`, `p_seller_id`, `p_dog_catch_chance` từ client; `rpc_sell_to_friend_trader` không trừ kho (in vàng); không RPC nào dùng `auth.uid()`, không `SET search_path`, không `REVOKE` quyền `anon` | `0002…sql:43`; `realtimeService.ts:125`; `0001…sql:149-275` |
| B5 | **Auth giả**: mật khẩu thô lưu localStorage trong trường tên `passwordHash`; tài khoản demo `123456`; OTP sinh ở client và hiển thị ra màn hình; ID `USR_${Date.now()}` | `authService.ts:33, 152, 155, 197, 380-395` |
| B6 | Seed `0002` dùng `DELETE … WHERE seller_id IS NULL` → xóa cả listing/lưu bút thật (trái chính RULE C13 Additive-Only) | `0002…sql:175, 188` |
| B7 | Không có trigger tạo `profiles` từ `auth.users`; vàng/ngọc của mọi người chơi public-read | `0001…sql:135` |
| B8 | Logic tính năng chưa đúng: đăng bán chợ nhận ngay 90% tiền dù chưa ai mua; một listing mua lại vô hạn; trộm là xúc xắc +250 vàng, không trừ của nạn nhân; Bếp luôn ra `PROD_22` | `useGameStore.ts:648-651, 1452-1497, 1271-1288` |
| B9 | QC runner có tác dụng phụ ra ngoài: ghi đè mật khẩu demo, đăng listing thật lên Supabase, broadcast thông báo cưới giả tới mọi người chơi | `qcTestRunner.ts` (TC-01.0d, TC-06.2a, TC-10.1a) |

**Code smell khác:** `App.tsx` 2.023 dòng chứa 12 modal inline, đọc cả store không selector (re-render toàn cây mỗi tick 10s); `useGameStore.ts` 1.687 dòng là god object; `FarmScene` không gỡ `subscribe`/`EventBus.on` khi destroy; chat và listing tăng vô hạn; cờ "hôm nay" không bao giờ reset; `capacitor.config.ts` có nhưng `package.json` thiếu `@capacitor/*`; service worker cache mọi GET kể cả Supabase REST; manifest chỉ có icon SVG (iOS không nhận).

### A4. Tài liệu mâu thuẫn nội bộ (vi phạm RULE D0)
- **File `13 → 16` viết theo template khác:** hệ ID khác (`ANIM_`, `MACH_`, `RELIC_`, `AQUA_11..15`, `CROP_06..09` bị dùng lại cho Đợt 3), tên dự án khác ("Nông Trại Tình Yêu & Gia Đình 3 Miền"), không có phân rã module như `11`, `12`.
- **Thông số trái nhau:**

  | Chủ đề | Một nơi | Nơi khác (`01`/`02`/`03`) |
  |---|---|---|
  | Chợ P2P | ✅ PO chốt 2026-11-01: **0.8–2.0x, thuế 5%** (code + `02`/`03`/`13` đã sửa) | — |
  | Trộm | ✅ PO chốt 2026-11-01: **bảo hiểm 80%** (trộm tối đa 20%/ô; `13` đã sửa, `0001` đã đúng) | — |
  | Chó giữ nhà | ✅ PO chốt 2026-11-02: **Chó Phú Quốc 50%** (Ngỗng 40%, cùng thức 70%; `src/domain/social.ts`) | — |
  | PK / Sảnh Chung | ✅ PO chốt 2026-11-01: **PK `-5⚡`/trận**, Máy Thùng & đi dạo Sảnh `0⚡` (`AGENTS`/`00`/`01`/`02`/`16` đã sửa). **Còn mở:** trần 1.500 tính bằng Xu Hội (`16`) | trần 1.500 tính bằng 🪙 vàng, Xu Hội 100–250/ngày (`02`) |
  | Phòng Sảnh Chung | 25 CCU (`16`) | 30 CCU |
  | Đình Làng | Guild 20–30 người (`14`) | Solo 5k/15k/50k |
  | Lễ cưới | 1.000 điểm thân mật (`15`) | 10 tim |
  | Nồi Bánh Chưng | 12h, cả làng (`15`) | 6h, tối đa 5 bạn |
  | Số món ăn | 22 (`13`, `14`, `15`) | 27 |
  | Cửa sổ trộm | ✅ PO chốt 2026-11-02: **2 phút** (`03` đã sửa; SQL viết lại ở S6) | — |

- ~~**Tham chiếu sai:** `13 → 16` dẫn `04_MASTER_NARRATIVE`; `16` dẫn "GDD Mục 9".~~ ✅ 2026-11-02: đổi thành `01_MASTER_GDD` Chương 4 (cốt truyện đã gộp vào `01`), `04_MASTER_DATA`, và `16` dẫn đúng `01` Chương 6 / `02` Phần 4 / `03` Phần 3 / `06` Mục 2.5–2.6.
- **Số tổng không khớp:** ~~7 hay 8 van chống lạm phát~~ (✅ 2026-11-02: `00`, `AGENTS.md` theo `02` = 8 van); ~~12 hay 14 quy tắc code; Bible v9.2 vs AGENTS v9.3; UI v7.0 vs v7.1~~ (✅ 2026-11-02: mọi nơi đã ghi `C1 ➔ C14`, Bible `9.3`, đầu file `06` đổi thành `7.1` cho khớp mục lục); nhãn build trong bảng `00` (dòng 44–49) ghi "v1.1 …" cho cả 6 giai đoạn.
- **Cấp độ mở khóa lệch:** ~~`WORK_02` Lv.16 vs Chương 6 thuê ở Lv.13~~ (sửa 2026-11-03: Chú Tư Lv.13, Cô Năm Lv.15); `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (Lv.21+).
- ~~**Soạn thảo:** ký tự Trung, lỗi gõ, checklist GĐ1–2 tick sai, 2 placeholder rỗng.~~ ✅ 2026-11-02:
  - Đã xóa ký tự lạ và sửa lỗi gõ ("VõBếp" → "Vỏ Quýt `PROD_24`").
  - Checklist `11`: còn tick 3/6 mục đạt thật. Checklist `12`: bỏ tick cả 5 mục.
  - Buff Nam trong `11` đổi theo `01` (`+1` sản lượng phụ).
  - Placeholder `02` Phần 4 ghi rõ "chưa lập bảng" và dẫn tới các số đã chốt; `08` Phần 5 đã điền trước đó.
- **Hình thức:** quá nhiều emoji / backtick / ô bảng nối `<br>`; RULE D0/D1 chép gần nguyên văn ở ~6 nơi — chính các bản chép này là nơi số liệu trôi lệch.

### A5. Rủi ro
- **Tiến độ:** 72 ngày cho 52 module + PvP realtime + app native là không khả thi với 1 người. Ước tính thực tế: GĐ1 phát hành được sau ~6–8 tuần; GĐ1–5 ~7–10 tháng.
- **PvP realtime** qua Supabase Broadcast, PRNG phía client, không có trọng tài server, lại cược vàng và có bot fallback → rất dễ gian lận.
- **Chợ P2P** là kênh rửa vàng / mua bán tiền thật nếu không có escrow, thuế và giới hạn.
- **Pháp lý:** Gacha Đập Niêu, Xổ số 18h (jackpot 50k + 200💎), cược PK có thể chạm quy định về cờ bạc / game online tại Việt Nam → cần kiểm tra trước GĐ4.

---

## PHẦN B — LỜI KHUYÊN CHIẾN LƯỢC
1. **Code + test là nguồn chân lý về hiện trạng;** tài liệu `00 → 16` chỉ mô tả đích. Duy trì bảng trạng thái 52 module (Phụ lục 1).
2. **Đóng băng việc viết tài liệu mới.** Chỉ sửa khi sai. Gộp `13 → 16` về đúng hệ ID và số liệu của `01`/`02`/`04`. Viết RULE D0/D1 **một lần** trong `AGENTS.md`, các file khác chỉ link tới.
3. **Thu hẹp MVP:** GĐ1 (Đợt 1 — 23 loài) phải *chơi được, lưu được, không gian lận được*. Ẩn toàn bộ demo GĐ2–6 sau feature flag.
4. **Server-authoritative cho mọi thứ dính tiền:** RPC dùng `auth.uid()`, `NOW()`, giá lấy từ `master_catalog` (chỉ `service_role` được ghi), khóa `FOR UPDATE`.
5. **Tách kiến trúc:** store → slices (`farm`, `economy`, `workers`, `social`, `meta`); luật chơi → pure functions trong `src/domain/` để test được; `App.tsx` → `src/ui/hud/*`, `src/ui/modals/*`, dùng selector Zustand.
6. **Test thật:** vitest cho logic + GitHub Actions (tsc, test, build) mỗi PR. `qcTestRunner` chỉ giữ làm smoke test ở bản dev.
7. **Art thật:** atlas PNG cho thực thể, `PixelAssetGenerator` chỉ còn lo VFX/fallback. Dùng `agent-sprite-forge` (Phần D2). Ưu tiên 23 loài Đợt 1.
8. **Rút gọn quy trình AI cho 1 người:** impact report 5 dòng; chỉ dừng chờ PO khi đụng DB / kinh tế / core loop; Phiếu nghiệm thu = mô tả PR.
9. **Hoãn PvP realtime (GĐ6) đến sau soft launch.** Social bất đồng bộ (thăm nhà, lưu bút, chợ) rẻ và an toàn hơn.
10. **Đo lường từ closed beta:** retention D1/D7, funnel tutorial, dòng tiền Sources/Sinks thực tế → cân bằng kinh tế bằng dữ liệu. *(Đã có từ `0008`: `npm run supabase -- report`.)*

---

## PHẦN C — KẾ HOẠCH SPRINT (1 người + AI, mỗi sprint 2 tuần)

| Sprint | Mục tiêu | Việc chính | Cổng nghiệm thu |
|---|---|---|---|
| **S0** (1–2 tuần) | Ổn định nền móng | (1) Sửa import `getSupabaseClient`; `npm ci` + `tsc` + `build` pass. (2) Chốt quy ước số thực thể (166 trong catalog, 146 trong CSV, hay bổ sung 20 dòng `MAC_`/`FASH_` vào CSV) và sửa `TC-01.3a`. (3) Thêm `unlockWave: 1..5` vào `CatalogItem`, `masterData.ts`, CSV `04` (additive). (4) vitest + `.github/workflows/ci.yml`. (5) Migration `0003_security_hardening.sql` additive-only: `REVOKE EXECUTE … FROM anon, public`, catalog chỉ `service_role`, thay tham số `p_*_id` bằng `auth.uid()` (`CREATE OR REPLACE`), `SET search_path = public`, trigger `handle_new_user`. Không sửa file `0002` đã chạy. (6) Gỡ sync catalog khỏi client; seed catalog bằng script phía server. (7) Chỉ dùng Supabase Auth (anonymous sign-in cho khách), bỏ vault mật khẩu localStorage. (8) Ẩn ⏩x60 / QC / Benchmark / modal cấu hình Supabase sau `import.meta.env.DEV`. (9) Dọn `.env.example` (placeholder), README, `@capacitor/*`. (10) Cài plugin `agent-sprite-forge`, `.claude/agents/`, SessionStart hook, thư mục `art/` (Phần D) | CI xanh; không còn RPC ghi được bằng `anon` |
| **S1–S3** | GĐ1 Core MVP (`M01.0 → M03.5`) | `persist` có `version` + `migrate`; RPC `plant / water / harvest / sell / expand` ở server; tách store & `App.tsx`; khóa Đợt 1 ở Khay giống; level-up; tutorial Chương 1–2; atlas 23 loài × 4 giai đoạn + nhân vật; analytics; closed beta 50–100 người | Đo được D1 retention; 0 lỗi lệch tiền |
| **S4–S5** | GĐ2 Bếp Quê & Lán Thợ (45 loài) | Công thức bếp thật theo nguyên liệu; lazy-tick tính ở server; 2 gia nhân đầu | |
| **S6–S8** | GĐ3 Chợ Phiên & Hàng Xóm (63 loài) | `rpc_buy_listing` có escrow + thuế 10%; trộm tính ở server với `steal_logs` + rate-limit; Realtime private channels | |
| **S9–S10** | GĐ4 Hội Làng & Thời Trang (76 loài) | Kiểm tra pháp lý gacha/xổ số; IAP qua Edge Function + bảng `iap_purchases` (idempotent theo transaction) | |
| **S11–S12** | GĐ5 Lễ Cưới & Homestay (81 loài) | Đóng gói Capacitor iOS/Android; soft launch | |
| **Sau launch** | GĐ6 | Sảnh Chung async/emote trước; cartridge hyper-casual đơn (server kiểm điểm, trần 1.500🪙/ngày); PvP realtime làm cuối | |

Mỗi sprint kết thúc bằng: `tsc` 0 lỗi, vitest + CI xanh, smoke test in-game, PR kèm Phiếu nghiệm thu → PO duyệt merge.

---

### C0. Kết quả Sprint S0 (đã xong)
| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Build | ✅ | Sửa import `getSupabaseClient`, thêm `src/vite-env.d.ts`; `typecheck` + `build` pass |
| Test + CI | ✅ | vitest (41 test): toàn vẹn catalog & 5 Đợt, CSV ↔ code, luật chợ `src/domain/market.ts`, auth, 25 QC case của `qcTestRunner.ts`, seed catalog. `.github/workflows/ci.yml` chạy typecheck → test → build |
| 4 QC case fail | ✅ | TC-01.3a, TC-03.4a, TC-06.2a: kỳ vọng của test sai → sửa test. TC-02.4a: lỗi code (không có trần 25 khu) → thêm `MAX_WILD_PLOTS` |
| Dữ liệu 5 Đợt | ✅ | `unlockWave` cho 131 mục (81 loài V-A-C + pet, xưởng, món, đồ bảo hộ, gia nhân); lũy kế 23/45/63/76/81 được test khóa; CSV thêm cột `Unlock_Wave` |
| Quy ước số thực thể | ✅ | `GAME_CATALOG` là nguồn chuẩn (166 mục). CSV `04` có 146 dòng (thiếu 8 `MAC_` + 12 `FASH_`); test bắt buộc mọi ID trong CSV phải có trong code |
| Auth | ✅ | Chỉ Supabase Auth; xóa kho mật khẩu thô + OTP khỏi localStorage; đăng nhập bằng email; Khách offline + phiên ẩn danh Supabase |
| Bảo mật DB | ✅ | `0003_security_hardening.sql` (additive); `0002` chạy lại không còn xóa dữ liệu; seed catalog phía server `supabase/seed/master_catalog_seed.sql` (`npm run seed:catalog`). Đã chạy thử trên Postgres 16 cục bộ với schema `auth` giả lập |
| Debug UI | ✅ | ⏩ x60, QC, đẩy catalog, form cấu hình Supabase chỉ hiện ở `npm run dev` (đã kiểm bằng Playwright) |
| Agent / skill / art | ✅ | `.claude/agents/vac-*` (6 agent), `.claude/settings.json` (plugin `agent-sprite-forge` + SessionStart hook), `art/palette/vac_base.gpl`, `art/prompts/`, `tools/art/recolor_outline.py` |

**Việc PO cần làm trên Supabase:** chạy `0003` rồi `supabase/seed/master_catalog_seed.sql` trong SQL Editor; bật Anonymous Sign-ins; thêm `{{ .Token }}` vào email template Reset Password; đặt `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` trên Vercel nếu muốn dùng project khác.

**Còn mở, chuyển sang S1:** lưu tiến trình (`persist`), kinh tế lên server, thu hoạch cộng tiền 2 lần, khóa Khay giống theo Đợt, tách store/App, rò listener ở `FarmScene`, đăng chợ nhận tiền ngay.

~~**Phát hiện thêm:** `05_MASTER_ART` chỉ định nghĩa **19 màu** (16 màu 3 miền/đột biến + 3 màu viền), chưa phải bảng 64 màu — cần PO/Art chốt trước khi khóa palette sản xuất.~~ ✅ 2026-11-02: PO chốt bảng **64 màu** (`art/palette/vac_base.gpl`, `05` mục 1.3; giữ 19 màu gốc + 45 màu dải sáng→tối), `recolor_outline.py --palette` khóa/kiểm màu, test `src/data/palette.test.ts`.

---

### C1. Kết quả Sprint S1 — vòng chơi GĐ1 lên server (đã xong phần code)
**Quyết định PO (S1):** thu hoạch đi vào Kho, tiền đến từ việc bán cho HTX theo giá gốc. Hoàng Kim ⭐ cho ×3 sản lượng. Người chơi mới bắt đầu ở Lv.1 với 2.500🪙 và 50💎.

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Luật chơi dạng hàm thuần | ✅ | `src/domain/farm.ts`, `progression.ts`, `stamina.ts`, có test cho mọi nhánh. Gồm thêm 2 luật GDD 2.1 trước đây chưa làm: đặc sản chỉ trồng ở đúng miền, và miền Nam được +1 sản lượng thủy sản |
| Đường cong cấp độ | ✅ | XP lên cấp = `round(60 × L^1.5)` (Lv1→2: 60, Lv5→6: 671, Lv10→11: 1.897), tối đa Lv.60. Docs cũ chưa có công thức này, cần PO duyệt lại khi có số liệu beta |
| Server làm trọng tài | ✅ code / ⏳ chưa chạy trên DB thật | `0004_farm_core.sql`: 12 RPC (gieo, tưới, bón bùn, thu hoạch, bán HTX, vét ao, khai hoang, nhiệm vụ, quà 7 ngày, thưởng tài khoản, đặt quê, lấy nông trại). Đã chạy thử trên Postgres 16 bằng `npm run test:sql` (khoảng 60 assertion); CI có job `sql` |
| 2 chế độ chơi | ✅ | **Online:** có phiên Supabase (kể cả Khách ẩn danh) và có RPC, mọi thao tác kinh tế đi qua server. **Offline:** Khách không có máy chủ, dùng cùng luật domain và lưu localStorage (`vac_online_save_v1`). Không bao giờ đẩy save cục bộ lên server. Khách đã chơi offline có tiến trình thì vẫn ở offline |
| Khoá theo Giai đoạn | ✅ | `src/config/features.ts`: `VITE_GAME_STAGE`, production mặc định là 1. Ẩn tính năng GĐ2–6; khay giống chỉ hiện Đợt 1 của miền mình (21 loài/miền, 23 loài nếu tính cả 3 miền) |
| UI | ✅ | Modal Kho & Bán HTX, thanh XP, năng lượng hồi kèm đếm ngược, header giữ 1 hàng (ở 1280 và 844px) |
| Sửa lỗi | ✅ | Thu hoạch cộng tiền 2 lần. Bấm nút HTML lại kích hoạt ô đất bên dưới (Phaser nghe mouseup trên window). Rò listener trong `FarmScene`. Đăng chợ nhận tiền ngay. Mua 1 sạp được nhiều lần. Quà 7 ngày nhận nhiều lần trong ngày. Nhiệm vụ không kiểm cấp |
| Kiểm thử | ✅ | Vitest 73 test. Playwright trên bản production: khách mới → gieo → tưới → thu hoạch → bán → tải lại trang vẫn giữ tiến trình |

**Trạng thái Supabase thật (cập nhật 2026-11-01, kiểm qua Supabase connector):**
- **Đã chạy `0001` → `0005` và 2 seed.** PO tự chạy 0003, 0004 và seed trong SQL Editor; 0005 chạy qua connector.
- Số liệu: 17 RPC; `master_catalog` 166 dòng (131 có Đợt, đủ 81/81 loài V-A-C); 10 chương nhiệm vụ; `app_game_stage() = 1`; Anonymous Sign-ins đang bật.
- **Smoke test thật** (`npm run supabase -- smoke`):
  - `anon` gọi `rpc_sync_master_catalog` bị chặn ✅.
  - Khách ẩn danh mới: Lv.1, 2.500🪙 ✅; trigger tự tạo hồ sơ với `created_as_guest = true` ✅.
  - Gieo Lúa còn 2.498🪙 ✅; thu hoạch sớm bị chặn ✅.
- **Security Advisor:**
  - Đã hết lỗi ERROR (`0005`: view `public_profile_cards` chuyển sang `security_invoker`; `REVOKE` hàm trigger).
  - Các WARN còn lại đều đúng thiết kế: RPC cho `authenticated` đều kiểm `auth.uid()`; policy cho khách ẩn danh chỉ đọc dữ liệu của chính mình.
  - Riêng `rls_auto_enable()` không phải hàm của dự án; PO quyết định có giữ hay không.
- **Còn lại cho PO:**
  - Xoá user test "Smoke Test" (`f1598bb5-…`) trong Dashboard → Authentication → Users.
  - Thêm `{{ .Token }}` vào email template Reset Password.

**Còn mở, chuyển sang S2:**
- ~~Tách `useGameStore` thành slice và tách `App.tsx`~~ ✅ 2026-11-01:
  - Store: `src/store/{gameTypes,initialState,storeHelpers}.ts` + `src/store/slices/*Slice.ts` (6 slice), `useGameStore.ts` chỉ còn ghép + persist.
  - App: 11 modal sang `src/ui/modals/*Modal.tsx`; App đọc store qua `useShallow`. Thêm một thay đổi nhỏ: trạng thái tạm của modal (ô tìm kiếm Bách khoa, nồi nấu, form chợ) đặt lại khi mở lại modal.
  - Danh sách việc: `VIEC_CAN_LAM.md`.
- ~~Lưới hiển thị vẫn cố định 12 ô; khai hoang mới chỉ tăng bộ đếm~~ ✅ 2026-11-01: lưới 5×5 (cột 5 → hàng 4 Ruộng → hàng 5 Ao), ô kế tiếp hiện mờ và chạm để khai hoang; migration `0006` (`_plot_order`, `_lock_tile`, `rpc_harvest` bùn cho hàng Ao mới).
  - ~~Phát sinh: ở 844×390 khay giống che hàng ruộng đầu (có từ trước) → cần sắp lại HUD màn hình nhỏ~~ ✅ 2026-11-02: variant `short:` (cao ≤ 500px) trong `index.css` — khay giống đóng sẵn và tự đóng sau khi chọn, nhãn nút rút gọn, footer 1 hàng. Kiểm ở 1280×720 (không đổi), 844×390, 667×375 (trước đó chạm ô ruộng ở 667 rơi vào nút Khai Hoang).
- ~~Mục tiêu nhiệm vụ chưa được kiểm (chỉ kiểm cấp)~~ ✅ 2026-11-01: bảng `player_counters` + `quest_catalog.objectives` (`0007`); Ch.1 = tưới + thu Lúa, Ch.2 = vét bùn + bón bùn (PO chốt; Bếp Quê dời sang Ch.3). Ch.3–10 chưa có mục tiêu, thêm khi mở GĐ2–5.
- ~~Atlas sprite thật cho 23 loài Đợt 1~~ ✅ (bản tạm) 2026-11-02: đường ống `import_sprite.py` → `pack_atlas.py` → atlas `wave1` (92 khung, 64 màu) đang chạy trong game với hình vẽ bằng code; VFX theo kết quả thật. **Chưa có ảnh vẽ đẹp**: plugin `agent-sprite-forge` chưa cài trong môi trường cloud và cần API key tạo ảnh → PO chọn ChatGPT/Gemini thủ công (bộ prompt `art/prompts/wave1_species.md`) hoặc cấp `OPENAI_API_KEY` / `GEMINI_API_KEY`.
- ✅ 2026-11-02 **Bản chạy thử GĐ1 (asset tạm đầy đủ):** atlas `world` (ô đất, ao 3 khung, nhà, giếng, lô sắp mở, cảnh trang trí, điền chủ nam/nữ đi + tưới, Bác Bảy, bướm, chim, khói), icon pixel + khung gỗ / giấy dó + tranh splash (`tools/art/codeart_ui.py`), animation (nhân vật đi tới ô, vật nuôi nhún, cá nhảy, ao gợn), hiệu ứng UI (số tiền nhảy, xu bay, modal trồi lên, âm lật trang / kèn lên cấp). `npm run build:preview` (GĐ1, offline, `--base=./`) → Artifact riêng tư https://claude.ai/artifact/8R1sgtQahsaAaGgG3DB36h. Vẽ lại toàn bộ asset tạm: `npm run art:all`.
- ~~Analytics~~ ✅ 2026-11-02: đo ở server, không có code theo dõi ở client (`0008`): `player_active_days` (ghi trong `rpc_get_my_farm`), `economy_daily` (trigger biến động 🪙/💎 trên `profiles`), view `analytics_retention` / `analytics_funnel` / `analytics_economy` chỉ `service_role` đọc. Xem bằng `npm run supabase -- report`. Khách offline không được đo.
- ✅ 2026-11-02 **Vá lỗ hổng Bách Khoa:**
  - Lỗi: ở GĐ1 offline, nút "Chế Biến / Sở Hữu" cho "mua" món với giá thực `mua − bán` rồi bán lại cho HTX, ra 🪙 / XP / ⚡ vô hạn. Nút này cũng không kiểm Giai đoạn hay Cấp.
  - Sửa: `canCraftOrBuy` (`src/domain/progression.ts`) chỉ mở đồ không gieo được khi GĐ ≥ max(2, Đợt) và đủ cấp; nút hiện "🔒 Mở ở GĐ2".
  - Chế độ online không bị ảnh hưởng: server không có RPC mua món, snapshot ghi đè.
  - Bản chạy thử đã đăng lại (Version 2).


### C2. Đặc tả S4 — Bếp Quê & Xưởng (M04.1–M04.3) — PO duyệt 2026-11-02
**Phạm vi:**
- 3 xưởng ăn uống: `MAC_02` Bếp Củi (Lv.4, 350🪙), `MAC_03` Lò Đậu Phụ & Bánh (Lv.8, 850🪙), `MAC_04` Quán Nước (Lv.12, 1.600🪙).
- 14 món Đợt 1–2: `PROD_01..12`, `PROD_N01`, `PROD_C01`.
- Ăn món hồi ⚡.
- Dời sang S5 (cùng Lán Thợ): `MAC_01`, `MAC_07`, `MAC_08`, `CRAFT_01..04`. M04.5 Đố Ca Dao làm sau.

**Quyết định PO:**
1. **Nồi Đất = khám phá công thức.**
   - Bỏ 1–4 nguyên liệu đang có trong Kho. Khớp đúng một công thức chưa khám phá (đã mở Đợt, đủ cấp) thì mở công thức đó, lần đầu **+10💎 +50XP**.
   - Nguyên liệu không bị tiêu. Sai thì chỉ báo gợi ý.
   - Cần đã xây `MAC_02`. Cơm Trắng mở sẵn.
   - Sổ Tay hiện "???" kèm 1 nguyên liệu gợi ý cho món chưa khám phá. Phải khám phá món trước khi nấu ở xưởng.
2. **Giữ dữ liệu gốc:**
   - `PROD_11` cần Chè `CROP_N02` (chỉ miền Bắc trồng; miền khác chờ Chợ GĐ3).
   - `PROD_C01` cần Cà Phê `CROP_C05` (Đợt 4, Lv.22) nên hiện khóa "cần Cà Phê – Đợt 4".
3. **Giữ giá catalog.** 10/13 món có giá bán < giá nguyên liệu: Bếp là nơi đổi nông sản lấy ⚡/XP và là van hút hàng. Xem lại bằng `/vac-balance-check` sau beta.
4. **Mở ở GĐ2** (`01` mục 3.2 đã ghi chú). `CRAFT_MIN_STAGE = 2`.

**Luật** (`src/domain/cooking.ts`, bản sao SQL ở `0009_kitchen.sql`):

| Hành động | Điều kiện | Kết quả |
|---|---|---|
| Xây xưởng | GĐ ≥ 2, đủ cấp, chưa có, đủ 🪙 | −`buyCostGold`, +`xpReward` của xưởng |
| Nấu | Có xưởng, xưởng rảnh (1 suất), món thuộc xưởng và đã khám phá, nguyên liệu đã mở Đợt, đủ cấp, Kho đủ nguyên liệu | Trừ nguyên liệu, **0⚡**; xong sau `growOrCraftMinutes` (miền Trung ×0,9) |
| Lấy món | Đã xong | +1 món vào Kho, +`xpReward` của món |
| Ăn | Có món, ⚡ chưa đầy | −1 món; `⚡ = min(max, ⚡ đã hồi + staminaDelta)` |
| Thử Nồi Đất | Có `MAC_02`, 1–4 nguyên liệu có trong Kho | Khớp đúng món mới: mở công thức, +10💎 +50XP |

- Bỏ đường "mua món bằng vàng" và stub `cookRandomDish`; giữ tên 2 action cũ để không gãy API.

**Bảng công thức** (`recipe` + `machineId` thêm vào `GAME_CATALOG`; `inputIngredients` giữ làm chữ hiển thị):

| Món | Xưởng | Công thức |
|---|---|---|
| PROD_01 Cơm Trắng | MAC_02 | 3 CROP_01 |
| PROD_02 Khoai Ngô Nướng | MAC_02 | CROP_06 + CROP_03 + CROP_04 |
| PROD_03 Canh Cải Cá Rô | MAC_02 | AQUA_01 + 2 CROP_05 + CROP_04 |
| PROD_04 Tép Rang | MAC_02 | AQUA_02 + CROP_11 + CROP_09 |
| PROD_05 Đậu Phụ | MAC_03 | 3 CROP_07 |
| PROD_06 Bánh Đa Vừng | MAC_03 | 2 CROP_01 + CROP_18 + CROP_06 |
| PROD_07 Bánh Cuốn | MAC_03 | 2 CROP_01 + ANI_05 + CROP_04 |
| PROD_08 Canh Bầu Tôm | MAC_02 | CROP_16 + AQUA_02 + CROP_04 |
| PROD_09 Nước Mía | MAC_04 | 2 CROP_09 |
| PROD_10 Sữa Đậu Nành | MAC_04 | 2 CROP_07 + CROP_03 + CROP_09 |
| PROD_11 Trà Đá Kẹo Lạc | MAC_04 | CROP_N02 + CROP_10 + CROP_09 |
| PROD_12 Ốc Hấp Sả | MAC_02 | AQUA_03 + CROP_11 |
| PROD_N01 Cốm Làng Vòng | MAC_03 | 2 CROP_15 + CROP_19 |
| PROD_C01 Cà Phê Muối | MAC_04 | CROP_C05 + ANI_07 + CROP_09 (khóa tới Đợt 4) |

**Server `0009_kitchen.sql`** (additive-only):
- Bảng:
  - `master_catalog.machine_id`.
  - `recipe_ingredients`: seed sinh tự động.
  - `player_machines`, `player_recipes`: RLS chỉ đọc của mình.
- RPC: `rpc_build_machine`, `rpc_start_craft`, `rpc_collect_craft`, `rpc_eat_dish`, `rpc_cook_pot`. Mỗi hàm `SECURITY DEFINER`, dùng `auth.uid()`, kiểm `app_game_stage() >= 2`; chỉ GRANT cho `authenticated`.
- `_farm_snapshot` thêm `machines` và `recipes`.

**Client:**
- `kitchenSlice.ts`: local dùng domain, cloud dùng RPC.
- `CookingModal` 3 tab: Xưởng / Sổ Tay / Nồi Đất.
- Kho có nút "🍚 Ăn".
- Save cũ vẫn tương thích (trường mới mặc định rỗng).

**RULE D1:**
1. Core VAC 🟢: Bếp tiêu nông sản, thao tác tại nhà vẫn 0⚡.
2. Kinh tế 🟡: bỏ 2 nguồn in tiền (mua-bán lại món, stub Nồi Đất không giới hạn); thêm sink xây xưởng và nguyên liệu bị tiêu.
3. Art/UI 🟢: modal sẵn có, icon tạm; chưa có sprite xưởng trên bản đồ (S5).
4. Code cũ 🟢: giữ chữ ký action.
5. DB 🟡: `0009` chỉ thêm; PO dán vào SQL Editor.

**Trạng thái (2026-11-02): code xong, chưa áp lên Supabase thật, chưa mở GĐ2.**
- ✅ Domain `src/domain/cooking.ts` + 22 test; công thức theo ID trong `GAME_CATALOG`; seed `recipe_seed.sql` sinh tự động.
- ✅ `0009_kitchen.sql` + `supabase/tests/kitchen.test.sql` (anon bị chặn, GĐ1 khóa, mọi nhánh từ chối, cô lập 2 người chơi). Server có 22 RPC.
- ✅ Store: `kitchenSlice.ts` (offline dùng domain, online dùng RPC); `machines` + `discoveredRecipes` lưu trong save, save cũ tự thêm mặc định rỗng. `cookRandomDish` / `craftOrBuyCatalogItem` giữ tên, chuyển sang luật mới. QC `TC-04.2a` viết lại theo Nồi Đất khám phá.
- ✅ UI: `CookingModal` 3 tab Xưởng / Sổ Tay / Nồi Đất; Kho có nút "🍚 Ăn". Kiểm ở 1280×720 và 844×390.
- ⏳ PO: dán `0009` rồi `master_catalog_seed.sql`, `recipe_seed.sql` vào SQL Editor.
- ⏳ Mở GĐ2 (việc riêng, cùng Đợt 2 = 45 loài): migration đổi `app_game_stage()` thành 2 + `VITE_GAME_STAGE=2` trên Vercel. Trước đó nên đặt mục tiêu Chương 3 (Bếp Quê) và chạy `/vac-balance-check`.
- Chưa có: sprite xưởng trên bản đồ (S5), icon riêng cho món (đang dùng emoji).


### C3. Đặc tả S5 — Lán Thợ & Xưởng nghề (M05.1–M05.5) — PO duyệt 4 quyết định 2026-11-03
**Hiện trạng code (`workersSlice.ts`) là stub, có 3 nguồn in tiền:**
- `claimWorkerPantry` cộng 18🪙/món + tặng cố định 15 Lúa, 8 Trứng, 6 Cá, 3 Bùn mỗi lần thu Giỏ.
- `simulateOfflineWorkerProgress` hồi +10⚡/giờ offline.
- Thợ tự gieo lại không tốn tiền giống. Không có gì chạy trên server.

**Kiểm cân bằng (`/vac-balance-check`, dữ liệu catalog, chưa có số liệu người chơi thật):**

| Nhóm Đợt 1–2 | Lãi/phút/ô | Ghi chú |
|---|---|---|
| Cây ruộng `CROP_01..19` | 0,75 → 3,00 🪙 | Lúa `CROP_01` (Lv.1) lãi/phút cao nhất; loài cấp cao kém loài cấp thấp |
| Cây lâu năm `CROP_23..26` | 0,89 → 0,95 🪙 | |
| **Vật nuôi `ANI_01..07`** | **−1,73 → −4,48 🪙 (lỗ)** | vd Gà `ANI_01` mua 40, bán 14 × 1 |
| **Thủy sản `AQUA_01..06`** | **−0,65 → −1,73 🪙 (lỗ)** | Chỉ có XP; người chơi bị phạt khi nuôi |

- Thu nhập trần: 12 ô Lúa, thu liên tục 90 phút/ngày ≈ **3.240🪙/ngày** (20 ô ≈ 5.400). Thực tế thấp hơn.
- `02` giả định GĐ2 có Sources **12.000–20.000🪙/ngày** → lệch ~4–6 lần. Lương 2 thợ GĐ2 (800 + 1.100🪙/ngày + cơm) sẽ lớn hơn thu nhập.
- XP: Lv.9 cần 5.044 XP; Lv.14 cần 16.056 XP (tổng từ Lv.1).
- Sources/Sinks thực tế: **NOT ASSESSED — NO DATA** (chưa có beta).

**Đề xuất mặc định (chờ PO chọn ở 4 câu hỏi):**
1. Thợ thu ô đã chín ≥ 5 phút (chừa thời gian cho chủ tự thu) và tưới ô chưa tưới. **Không tự gieo lại.** Hàng thật vào Giỏ Thợ (tối đa 120), bấm "Thu Giỏ" mới về Kho. XP thu hoạch không cộng.
2. Thợ chỉ làm khi còn hợp đồng và Độ No ≥ 35%. Độ No giảm theo giờ; đói thì tự ăn 1 suất ở Bàn Ăn. Mâm cơm lấy từ món Bếp Quê thật hoặc mua bằng 🪙.
3. Tính lười (lazy-tick) ở server khi gọi `rpc_get_my_farm` / thao tác. Bỏ 3 nguồn in tiền ở trên.
4. Xưởng nghề `MAC_07` / `MAC_08` + đồ thợ `CRAFT_01..02`: công thức theo ID như S4 (cần map "Tre Trúc", "Kén Tơ Tằm"… sang ID có thật). Đồ thợ 72h: +15% tốc độ (giảm mốc chờ 5 phút / tăng Độ No).
5. Mục tiêu chương: Ch.3 = xây Bếp Củi + nấu 1 món (PO đã chốt Bếp dời sang Ch.3 ở S2); Ch.6 = thuê Chú Tư + dọn 1 mâm cơm; Ch.7 = cấp 1 đồ thợ.
6. `MAC_01` Cối Xay Cám: chưa có luật cho vật nuôi ăn cám → hoãn tới khi sửa vật nuôi (câu hỏi 3).

**Quyết định PO (2026-11-03) — đều chọn phương án khuyên dùng:**
1. **Thợ chỉ thu + tưới**, không tự gieo lại. Hàng thật vào Giỏ Thợ 120, bấm Thu Giỏ về Kho.
2. **Lương còn 25%:** Chú Tư `WORK_01` 200🪙/ngày, Cô Năm `WORK_02` 275🪙/ngày; hợp đồng 3 ngày −12% giữ nguyên. Thợ GĐ3+ xem lại khi mở GĐ3.
3. **Vật nuôi / thủy sản nuôi nhiều lứa:** mua con giống 1 lần, thu nhiều lứa rồi mới hết (sửa lỗi lỗ có từ GĐ1).
4. **Hạ cấp thợ cho khớp chương:** Chú Tư Lv.13, Cô Năm Lv.15. Ch.6 = thuê Chú Tư; Ch.7 = cấp đồ thợ.

**Quyết định PO lần 2 (2026-11-03):**
5. **Đồ thợ dùng loài Đợt 2 có sẵn:** Nón Lá `CRAFT_01` ở Đan Lát `MAC_07` = 1 Dừa Xiêm `CROP_24` + 1 Sen `CROP_19`. Áo Cánh Nâu `CRAFT_02` ở Khung Cửi `MAC_08` = 1 Kén Tằm `ANI_06` + 1 Khoai Môn & Củ Sắn `CROP_17`. Không thêm thực thể.
6. **Tác dụng đồ thợ 72h:** Độ No hao chậm 25%.
7. **Chương 3 mở Lv.9** (theo `01`).
8. **AI áp `0010` → `0012` + seed lên Supabase thật** qua connector.

**Thứ tự làm:** S5a nuôi nhiều lứa (domain → `0010` → client) → S5b số liệu thợ (catalog, CSV `04`, `02`) → S5c Lán Thợ (domain → `0011` lazy-tick → store → UI) → S5d xưởng nghề + đồ thợ → mục tiêu Ch.3/6/7.

**Tiến độ:**
- ✅ 2026-11-03 **S5a nuôi nhiều lứa:**
  - Code: `harvestCycles` + `harvest` giữ con giống (`src/domain/farm.ts`); cột `farm_entities.harvests_left` (mặc định 1); `_harvest_cycles`, `_grow_ms`, `rpc_plant` / `rpc_harvest` / `_farm_snapshot` viết lại ở `0010_livestock_cycles.sql`; ô hiện "còn N lứa".
  - Kiểm tra: test domain + `supabase/tests/livestock.test.sql`.
  - Sửa luôn `scripts/test-sql.sh`: lần chạy lại kiểm idempotent trước đây dùng mẫu `000[2-9]` nên bỏ sót `0010`+.
  - Công thức ghi ở `02` mục 3.1b, luật ở `01` mục 1.1b.
  - ⏳ PO chạy `0010` trên Supabase (sau `0009`; không chạy lại `0009` sau `0010` vì sẽ đè snapshot).
- ✅ 2026-11-03 **S5b số liệu thợ:** `WORK_01` Lv.13, 200🪙/ngày; `WORK_02` Lv.15, 275🪙/ngày (catalog, `INITIAL_WORKERS`, CSV `04`, `01`, `02` mục 3.2 + bảng GĐ2, seed). Mô tả Chú Tư bỏ "tự gieo hạt". ⏳ PO chạy lại `master_catalog_seed.sql` để DB có số mới.

- ✅ 2026-11-03 **S5c Lán Thợ:** domain `src/domain/workers.ts` (+12 test) → `0011_workers.sql` (+`supabase/tests/workers.test.sql`) → `workersSlice.ts` viết lại (giữ tên action; thêm `serveLodgeMeal`) → `WorkersModal` mới (Bàn Ăn dọn món từ Kho, Giỏ Thợ hàng thật, thuê/gia hạn). Đã bỏ 3 nguồn in tiền của stub. QC `TC-05.1a/2a/5a` viết lại theo luật mới. Kiểm 1280×720 & 844×390.
- ✅ 2026-11-03 **Mục tiêu Ch.3 & Ch.6:** bộ đếm `BUILD:<MAC>`, `COOK`, `HIRE:<WORK>`, `SERVE_MEAL` (domain `cooking.ts` / `workers.ts` + `0012_quest_counters_s5.sql`); Ch.3 = xây Bếp Củi + nấu 1 món; Ch.6 = thuê Chú Tư + dọn 1 món. Cấp chương trong code đưa về đúng `01`: Ch.6 Lv.13, Ch.7 Lv.15. Test `supabase/tests/quests_s5.test.sql`.
  - ⚠️ Còn lệch chờ PO: Ch.3 code Lv.6 vs `01` Lv.9.
  - ⏳ PO chạy `0011` → `0012` → `quest_catalog_seed.sql`. Còn lại: S5d (xưởng nghề `MAC_07/08`, đồ thợ `CRAFT_01..02`, phụ cấp), mục tiêu Ch.3/6/7, sprite Lán Thợ + 2 thợ trên bản đồ.

**RULE D1 (sơ bộ):**
1. Core VAC 🟡: thợ thu hộ, cần giữ vai trò người chơi (không tự gieo).
2. Kinh tế 🔴: lương lệch thu nhập; vật nuôi / thủy sản đang lỗ (lỗi có từ GĐ1).
3. Art 🟡: cần sprite Lán Thợ + 2 thợ.
4. Code 🟢: giữ tên action cũ.
5. DB 🟡: migration `0010` chỉ thêm.

---

## PHẦN D — AGENT & SKILL THẬT (thay cho "17 AI Skills" chỉ có tên)

### D1. Ánh xạ "17 Skills" sang công cụ có thật trong Claude Code
| Skill trong tài liệu | Công cụ thật | Dùng khi |
|---|---|---|
| `@game-designer`, `@narrative-designer`, `@level-designer` | Skill `agency-agents` (persona game / narrative / level designer) + subagent `Plan` | Bước 1: spec + impact report |
| `@economy-designer` | `agency-agents` (economy-designer) + skill `xlsx` / `dataviz` để mô phỏng Sources/Sinks từ CSV `04` | Mọi thay đổi giá, trần, thuế |
| `@backend-architect` | `agency-agents` (backend-architect) + skill `security-review` | Migration, RPC, RLS |
| `@godot-multiplayer-engineer` | Đổi tên thành `@realtime-netcode`; persona multiplayer của `agency-agents` (dự án dùng Phaser + Supabase, không dùng Godot) | GĐ6 |
| `@frontend-developer`, `@ui-designer` | `agency-agents` + skill `run` (Playwright chụp màn hình landscape) | Scene, HUD, modal |
| `@technical-artist`, `@game-audio-engineer` | `agency-agents` + subagent `general-purpose` trên `PixelAssetGenerator.ts` / `soundEffects.ts` | VFX, tween, SFX |
| `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d` | **Plugin `agent-sprite-forge`** (Phần D2) | Asset |
| `@code-reviewer` | Skill `code-review` + `security-review` + `simplify` + CI | Bước 5 của mọi PR |
| `@growth-hacker`, `@content-creator` | `agency-agents` (marketing) + Artifact | Bước 6, truyền thông |

Lưu ý: `agency-agents` là skill cấp người dùng (không nằm trong repo); dự án nên có agent riêng trong repo (D3) để mọi session đều dùng được.

### D2. Bổ sung 4 skill art còn thiếu bằng `agent-sprite-forge`
Nguồn: https://github.com/0x0funky/agent-sprite-forge (giấy phép MIT cho code; ảnh/video sinh ra theo điều khoản của nhà cung cấp model).

| Skill | Làm gì | Đầu ra dùng cho Phaser |
|---|---|---|
| `generate2dsprite` | Master still nhân vật, vật nuôi, cây, icon, đạo cụ, sheet VFX. Chế độ pixel (chỉ khi yêu cầu): palette chung, alpha nhị phân, không dithering, scale `nearest`; `palette_tool.py build / apply / lock`; tách nền chroma `#FF00FF` | Aseprite JSON + PNG → `this.load.aseprite()` |
| `video2dsprite` | Từ 1 master still tạo các bộ chuyển động (idle, walk, run, attack, jump, hurt…) qua image-to-video, rồi cắt, khớp khung, lặp vòng, retime | PNG atlas + `animation.json` |
| `generate2dmap` | Bản đồ top-down / side-scroll, tilemap, bộ đạo cụ; dữ liệu collision + kiểm tra đường đi; preview HTML | Tiled JSON (`export_tiled.py --embedded-variant` cho Phaser) → `this.load.tilemapTiledJSON()` |
| `codeart2d` | Vẽ sprite / VFX / tile bằng code, không cần model | PNG / SVG |
| `generate2dmedia` | Bộ định tuyến: API key → Codex/Grok CLI → `codeart2d` | — |

**Chỗ chưa khớp chuẩn `05_MASTER_ART` và cách xử lý:**
1. **Viền ấm `#3D2314`:** plugin không hỗ trợ. Thêm bước hậu kỳ `tools/art/recolor_outline.py` (đổi pixel viền tối/đen thành `#3D2314`); QC Gate 2 kiểm không còn pixel `#000000`.
2. **Bảng 64 màu 3 miền:** tạo `art/palette/vac64.gpl` từ `05_MASTER_ART`, dùng `palette_tool.py lock / apply` để ép mọi sprite về đúng bảng.
3. **Góc 3/4 Top-Down Oblique:** `generate2dsprite` chỉ có facing trái/phải/trước/sau → đưa góc nhìn vào prompt + 1 ảnh tham chiếu style (ảnh thứ hai) lấy từ key art hoặc sprite đã duyệt. Lưu prompt mẫu tại `art/prompts/`.
4. **Kích thước:** cố định `--logical-pixel` / `--pixel-scale` theo loại: nhân vật `48x64`, ô đất `168x80`, icon `32x32`.
5. **Chi phí & key:** cần 1 API key tạo ảnh/video (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`, `ARK_API_KEY` hoặc `FAL_KEY`) đặt trong secret môi trường / config người dùng — **không commit vào repo**. `video2dsprite` tốn nhất → chỉ dùng cho Điền chủ, Gia nhân, NPC chính; cây trồng 4 giai đoạn chỉ cần sprite tĩnh.
6. **Môi trường:** Python 3.10+ (`numpy>=1.26`, `Pillow>=10.1`, `scipy>=1.11`), ffmpeg 5.1+ (libvpx-vp9, libx264), Node 22. Network policy phải cho phép GitHub và host của nhà cung cấp model.

**Cài đặt (thuộc Sprint 0):**
```bash
claude plugin marketplace add 0x0funky/agent-sprite-forge --sparse .claude-plugin skills
claude plugin install agent-sprite-forge@agent-sprite-forge
python -m pip install "numpy>=1.26" "Pillow>=10.1" "scipy>=1.11"
```
Hoặc khai báo marketplace + bật plugin trong `.claude/settings.json` cấp dự án để mọi session (kể cả cloud) tự có skill; SessionStart hook cài thư viện Python và kiểm tra `ffmpeg`.

**Cấu trúc thư mục art đề xuất:**
- `art/source/<wave>/<entity_id>/` — master, clip, `master.json` (nguồn, không ship).
- `art/palette/vac64.gpl`, `art/prompts/*.md` — palette & prompt chuẩn.
- `public/assets/atlas/` — atlas đã duyệt mà game nạp.

**Quy trình asset Đợt 1 (S1–S3), ví dụ `CROP_01`:**
1. `generate2dsprite` (pixel, palette `vac64`, key `#FF00FF`) → 4 giai đoạn lớn.
2. `recolor_outline.py` → QC: không `#000000`, đúng 64 màu, đúng kích thước.
3. `export_engine.py` → Aseprite JSON → `public/assets/atlas/wave1.*`.
4. `BootScene` nạp atlas; `FarmScene` lấy texture key từ `GAME_CATALOG` (thêm trường `spriteKey`, additive).
5. Điền chủ Nam/Nữ: `video2dsprite` → Idle, Walk 4 hướng, Water, Harvest (8–12 frame, planted feet).
6. Bản đồ 3 miền: `generate2dmap` (`tile_mode`) → Tiled JSON.

### D3. Agent riêng của dự án (tạo ở Sprint 0)
Thư mục `.claude/agents/` gồm 6 file ngắn, mỗi file chứa luật rút gọn RULE D0/D1 + đường dẫn tài liệu chuẩn liên quan:
`vac-designer` (01, 06), `vac-economy` (02, 04), `vac-backend` (03, `supabase/`), `vac-frontend` (03, 06, `src/`), `vac-art-pipeline` (05, `agent-sprite-forge`), `vac-qa` (`code-review`, `security-review`, vitest, CI).
Thêm SessionStart hook chạy `npm ci` để session cloud luôn chạy được `tsc`.

### D4. Vòng lặp cho mỗi module (rút gọn từ 6 bước của `10_MASTER_AI_PLAYBOOK`)
1. `Explore` + `Plan` (+ `vac-designer` / `vac-economy`) → spec + impact report 5 dòng. Dừng chờ PO **chỉ khi** đụng DB / kinh tế / core loop.
2. `vac-art-pipeline` làm asset song song.
3. `vac-backend` → migration additive + RPC + test SQL.
4. `vac-frontend` → slice store + UI; skill `run` chụp màn hình landscape.
5. `code-review` + `security-review` + CI xanh.
6. PR kèm Phiếu nghiệm thu → PO duyệt merge.

### D5. Áp dụng Claude-Code-Game-Studios (CCGS) — 2026-11-01
Repo `Donchitos/Claude-Code-Game-Studios` (MIT) gồm 49 agent, 74 skill, 18 hook, 14 rule và 62 template.
**Kết luận: không cài nguyên bộ, chỉ lấy chọn lọc rồi viết lại.** Nguồn ghi ở `.claude/THIRD_PARTY.md`.

| Phần của CCGS | Quyết định | Lý do |
|---|---|---|
| 49 agent phân tầng (director → lead → specialist) | ❌ Không lấy | Thừa cho 1 người + AI. Giữ 6 agent `vac-*`, chỉ bổ sung vào prompt |
| Agent / rule cho Godot, Unity, Unreal | ❌ | Dự án dùng Phaser + React + Supabase |
| `project.yaml`, `design/` GDD, registry, 62 template | ❌ | Sẽ thành hệ tài liệu thứ 2, trái RULE D0. Bộ `00→17` đã là nguồn chuẩn |
| Chế độ "rigor" + 30 tài liệu trước khi code | ❌ | Chính README của CCGS thừa nhận build tối giản được đánh giá tốt hơn build nhiều tài liệu. Khớp lời khuyên B2 |
| Rule theo đường dẫn | ✅ 7 rule trong `.claude/rules/` | domain, supabase, client-network, ui, data, tests, docs. Tự nạp khi sửa file khớp đường dẫn |
| Skill quy trình | ✅ 6 skill trong `.claude/skills/` | Xem bảng dưới |
| Hook chặn đọc nguyên file tài liệu lớn | ✅ `read-guard` | File > 30 KB thì bắt đọc theo đoạn và trả về mục lục heading. Tiết kiệm context |
| Hook kiểm tra trước khi commit | ✅ chuyển thành `secret-guard` | Chặn commit có token Supabase / service key / `.env` |
| Nguyên tắc "NOT ASSESSED — NO DATA" | ✅ | Có trong mọi skill kiểm tra và agent `vac-qa`. Không bao giờ báo "đạt" khi không có dữ liệu |
| `bug-report`, `playtest-report`, `patch-notes`, `release-checklist` | ⏳ Để S3+ | Cần khi có closed beta / phát hành |

**Skill dùng hằng ngày:**
| Lệnh | Khi nào dùng | Agent |
|---|---|---|
| `/vac-consistency-check` | Sau khi sửa tài liệu; trước khi bàn giao sprint | `vac-qa` |
| `/vac-balance-check` | Trước khi đổi giá/thời gian/XP hoặc mở Đợt mới | `vac-economy` |
| `/vac-propagate-change` | PO duyệt đổi 1 luật hoặc 1 con số: sửa đủ tài liệu, domain, SQL, seed và test | `vac-economy`, `vac-backend` |
| `/vac-story-done` | Trước khi báo "xong": 4 lệnh kiểm tra, ảnh chụp, file 17, Phiếu nghiệm thu | `vac-qa` |
| `/vac-scope-check` | Có yêu cầu mới giữa sprint | `vac-designer` |
| `/vac-asset-audit` | Sau mỗi lô sprite | `vac-art-pipeline` |

---

## PHẦN E — BACKLOG SỬA TÀI LIỆU (chưa làm ở bản 1.0 này)

**✅ Đã sửa (2026-11-01, chạy `/vac-consistency-check` rồi PO duyệt):** 41 chỗ ghi cứng "155 thực thể", "37 Test Cases", "11 bảng / 7 RPC" trong `00`, `01`, `03`, `05`, `06`, `08`, `10`, `11`, `AGENTS.md`. Cách sửa:
- **Luật / quy trình:** đổi con số thành tham chiếu tới nguồn chuẩn: `GAME_CATALOG`, `npm test` + `npm run test:sql`, `supabase/migrations/`.
- **"11 bảng / 7 RPC" trong `03` / `00` / `AGENTS`:** giữ nguyên nhưng ghi rõ là **thiết kế đích**.
- **Mô tả lỗi thời:** sửa cho đúng code: `unlock_stage` → `unlock_wave`; `rpc_sync_master_catalog` chỉ còn `service_role`; catalog nạp bằng seed.
- **Số hiện trạng chỉ ghi ở file này.** Riêng `AGENTS.md` mô tả CSV `04` là "146 dòng".

**✅ Đã sửa (2026-11-01, PO chốt):** thuế Chợ P2P 5% (`MARKET_TAX_RATE = 0.05`, test, QC TC-06.2a, toast; `02`, `03`, `13`), bảo hiểm trộm 80% (`13`), PK tốn `-5⚡`/trận (`AGENTS`, `00`, `01`, `02`, `16`). Tỉ lệ Sink/Source GĐ3+ sau khi giảm thuế: **CHƯA KIỂM ĐƯỢC** (chưa có dữ liệu chợ thật) — chạy `/vac-balance-check` ở S6.

**Còn lại:** chuyển sang `VIEC_CAN_LAM.md` mục D (danh sách việc duy nhất, tránh ghi trùng 2 nơi).

**Đã sửa trong bản 1.0 này:** `00` (bản đồ `00 → 17`, nhãn build 6 giai đoạn, 14 quy tắc C1–C14, version v9.3), `AGENTS.md` (file 17, prefix ID thực tế, mục trạng thái & skill thật), `05` (công cụ thực thi `agent-sprite-forge`), `08` (liên kết kế hoạch tái cấu trúc), `10` (ánh xạ skill thật).

---

## Phụ lục 1 — Trạng thái thực thi 52 Module (cập nhật sau Sprint S1)
Chú thích: **Done** = chạy đúng spec; **Partial** = có, nhưng thiếu/sai phần quan trọng; **Stub** = 1 nút thưởng cố định, chưa có cơ chế; **Missing** = chưa có.

| Epic | Module | Trạng thái | Ghi chú |
|---|---|---|---|
| 01 | M01.0 Splash + Auth 4 tab | Done | Auth Supabase (S0); lưu tiến trình online/offline (S1) |
| 01 | M01.1 Viewport 2-Thumb Landscape | Partial | Có cảnh báo dọc, fullscreen |
| 01 | M01.2 Pan/Zoom, Tap vs Drag | Partial | Có drag; leak subscription |
| 01 | M01.3 Catalog + Supabase sync | Done | 166 mục, có `unlockWave`; seed phía server, client không ghi được (S0) |
| 01 | M01.4 Realtime hub | Partial | Chat/presence chạy; payload không xác thực |
| 02 | M02.1 Đăng ký + chọn miền | Partial | Chỉ buff miền Bắc |
| 02 | M02.2 Năng lượng Hybrid | Done | Hồi +1⚡/3 phút, tính trên server (S1) |
| 02 | M02.3 Thời tiết động | Partial | Chu kỳ thủ công |
| 02 | M02.4 Khai hoang 25 khu | Done | Lưới 5×5 thật (`src/domain/farmGrid.ts` + `0006`, đã chạy trên Supabase thật 2026-11-02) |
| 03 | M03.1 Khay giống + khóa 5 Đợt | Done | Khoá theo Đợt/cấp/miền ở client và server (S1) |
| 03 | M03.2 Tưới giếng −15% | Done | Server (S1) |
| 03 | M03.3 Ao + vét bùn | Done | Server (S1) |
| 03 | M03.4 Phù sa + Hoàng Kim x3 | Done | Thu hoạch vào Kho ×3, bán HTX (S1) |
| 03 | M03.5 Chương 1–2 + quà 7 ngày | Done | Server kiểm cấp + mục tiêu đo được (`player_counters`, `0007`, đã chạy trên Supabase thật 2026-11-02); Hướng dẫn tân thủ 8 bước (`src/domain/tutorial.ts`, `TutorialCoach`) |
| 04 | M04.1–M04.4 Xưởng / Bếp / Sách món / Khung cửi | M04.1–M04.3 có code (S4, chờ mở GĐ2); M04.4 Stub | Xem `17` mục C2 — Khung cửi làm ở S5 |
| 04 | M04.5 Đố Ca Dao (FEAT_02) | Missing | |
| 05 | M05.1–M05.5 Lán Thợ, Bàn ăn, Đồ bảo hộ, Giỏ 120, Lazy-tick | Partial | Phần tốt nhất của code; vẫn client-side |
| 06 | M06.1 Đơn HTX | Partial | |
| 06 | M06.2 Báo Chợ P2P | Partial | Không còn nhận tiền ngay (S1); escrow server ở S6 |
| 06 | M06.3 Tàu Bắc – Nam | Stub | |
| 06 | M06.4 Thương lái | Stub | RPC có nhưng không được gọi, bảng không có dữ liệu |
| 06 | M06.5 Thương Đội (FEAT_01) | Missing | |
| 07 | M07.1–M07.2 Trộm + phòng thủ | Stub | Xúc xắc client (B8) |
| 07 | M07.3 Cứu trợ bão | Stub | |
| 07 | M07.4 Sổ lưu bút | Partial | RPC không xác thực |
| 08 | M08.1–M08.6 Đình, Đột biến, Thuyền rồng, Chợ đêm, Rừng trúc, Đua trâu | Stub | Mỗi tính năng 1 nút |
| 09 | M09.1–M09.3 Thời trang, Bloc/Niêu/Xổ số/IAP, Trung Thu | Stub | Xổ số không bao giờ quay; IAP chưa có |
| 10 | M10.1–M10.4 Cưới, Homestay, Bằng khen PNG, Bánh Chưng | Stub | Có `certificateExporter.ts` |
| 11 | M11.1–M11.6 Sảnh Chung, PK, Loạn chiến, Arcade, Cartridge | Missing | Chỉ có nhạc `playArenaDrumBgm` |
