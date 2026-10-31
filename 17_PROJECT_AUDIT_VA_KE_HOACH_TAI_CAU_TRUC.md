# 17 — Kiểm toán dự án & Kế hoạch tái cấu trúc (Project Audit & Re-plan)

**Dự án:** VAC Online — Hương Đồng Gió Nội
**Phiên bản:** 1.0 — ngày kiểm toán 2026-10-31 (trên commit `05a3a6a`)
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
  | Chợ P2P | 0.5–1.5x, thuế 5% (`13`) | 0.8–2.0x, thuế 10% |
  | Trộm | Trần 15%/ô (`13`) | Bảo hiểm giữ 80% |
  | Chó giữ nhà | Chó Cỏ 50% (`13`) | Chó Phú Quốc 70% |
  | PK / Sảnh Chung | Tiêu Stamina; trần 1.500 tính bằng Xu Hội (`16`) | `0⚡`; trần 1.500 tính bằng 🪙 vàng, Xu Hội 100–250/ngày |
  | Phòng Sảnh Chung | 25 CCU (`16`) | 30 CCU |
  | Đình Làng | Guild 20–30 người (`14`) | Solo 5k/15k/50k |
  | Lễ cưới | 1.000 điểm thân mật (`15`) | 10 tim |
  | Nồi Bánh Chưng | 12h, cả làng (`15`) | 6h, tối đa 5 bạn |
  | Số món ăn | 22 (`13`, `14`, `15`) | 27 |
  | Cửa sổ trộm | 2 phút (`01`, RULE C9) | 3 phút (`03` RPC) |

- **Tham chiếu sai:** `13 → 16` dẫn `04_MASTER_NARRATIVE` (file `04` là CSV; narrative nằm ở `docs_archive_merged/12_MASTER_NARRATIVE…`); `16` dẫn "GDD Mục 9" (GDD chỉ có 7 chương).
- **Số tổng không khớp:** 7 hay 8 van chống lạm phát (`00` vs `02`); 12 hay 14 quy tắc code (`00:62` vs `03`); Bible v9.2 vs AGENTS v9.3; UI v7.0 vs v7.1; nhãn build trong bảng `00` (dòng 44–49) ghi "v1.1 …" cho cả 6 giai đoạn.
- **Cấp độ mở khóa lệch:** `WORK_02` Lv.16 vs Chương 6 thuê ở Lv.13; `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (Lv.21+).
- **Soạn thảo:** còn ký tự Trung (`定` ở `01`, `枯` ở `13`), lỗi gõ ("PHạm", "TRẩy", "VõBếp"); checklist nghiệm thu GĐ1–2 đã tick `[x]` dù code chưa đạt; 2 placeholder rỗng "Giữ nguyên…" (`02:62`, `08:70`).
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
10. **Đo lường từ closed beta:** retention D1/D7, funnel tutorial, dòng tiền Sources/Sinks thực tế → cân bằng kinh tế bằng dữ liệu.

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

---

## PHẦN E — BACKLOG SỬA TÀI LIỆU (chưa làm ở bản 1.0 này)
- [ ] Gộp `13 → 16` về hệ ID của CSV `04`; thống nhất tên dự án.
- [ ] Thống nhất các thông số mâu thuẫn ở A4 theo `01` / `02`.
- [ ] Sửa tham chiếu `04_MASTER_NARRATIVE`, "GDD Mục 9".
- [ ] Xóa ký tự lạ, sửa lỗi gõ.
- [ ] Bỏ tick `[x]` ở checklist nghiệm thu GĐ1–2 cho tới khi code đạt.
- [ ] Điền 2 placeholder rỗng (`02:62`, `08:70`).
- [ ] Đồng bộ 7/8 van chống lạm phát; số TC thực tế (25 hiện có → mục tiêu mới sau khi port sang vitest).

**Đã sửa trong bản 1.0 này:** `00` (bản đồ `00 → 17`, nhãn build 6 giai đoạn, 14 quy tắc C1–C14, version v9.3), `AGENTS.md` (file 17, prefix ID thực tế, mục trạng thái & skill thật), `05` (công cụ thực thi `agent-sprite-forge`), `08` (liên kết kế hoạch tái cấu trúc), `10` (ánh xạ skill thật).

---

## Phụ lục 1 — Trạng thái thực thi 52 Module (tại commit `05a3a6a`)
Chú thích: **Done** = chạy đúng spec; **Partial** = có, nhưng thiếu/sai phần quan trọng; **Stub** = 1 nút thưởng cố định, chưa có cơ chế; **Missing** = chưa có.

| Epic | Module | Trạng thái | Ghi chú |
|---|---|---|---|
| 01 | M01.0 Splash + Auth 4 tab | Partial | UI có; auth giả (B5) |
| 01 | M01.1 Viewport 2-Thumb Landscape | Partial | Có cảnh báo dọc, fullscreen |
| 01 | M01.2 Pan/Zoom, Tap vs Drag | Partial | Có drag; leak subscription |
| 01 | M01.3 Catalog + Supabase sync | Partial | 166 mục; sync từ client là lỗ hổng (B4) |
| 01 | M01.4 Realtime hub | Partial | Chat/presence chạy; payload không xác thực |
| 02 | M02.1 Đăng ký + chọn miền | Partial | Chỉ buff miền Bắc |
| 02 | M02.2 Năng lượng Hybrid | Partial | Không tự hồi theo thời gian |
| 02 | M02.3 Thời tiết động | Partial | Chu kỳ thủ công |
| 02 | M02.4 Khai hoang 25 khu | Partial | Không có trần 25 |
| 03 | M03.1 Khay giống + khóa 5 Đợt | Partial | Không khóa Đợt |
| 03 | M03.2 Tưới giếng −15% | Partial | Client-side |
| 03 | M03.3 Ao + vét bùn | Partial | Client-side |
| 03 | M03.4 Phù sa + Hoàng Kim x3 | Partial | Thu hoạch cộng tiền 2 lần |
| 03 | M03.5 Chương 1–2 + quà 7 ngày | Partial | Không lưu tiến trình |
| 04 | M04.1–M04.4 Xưởng / Bếp / Sách món / Khung cửi | Stub | Bếp luôn ra `PROD_22` |
| 04 | M04.5 Đố Ca Dao (FEAT_02) | Missing | |
| 05 | M05.1–M05.5 Lán Thợ, Bàn ăn, Đồ bảo hộ, Giỏ 120, Lazy-tick | Partial | Phần tốt nhất của code; vẫn client-side |
| 06 | M06.1 Đơn HTX | Partial | |
| 06 | M06.2 Báo Chợ P2P | Partial | Sai logic tiền (B8) |
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
