# 🌾 AGENTS.MD — BỘ QUY TẮC TỐI THƯỢNG (`RULE D0` & `RULE D1`) & VÒNG LẶP 6 BƯỚC KÈM TỰ NHẬN DIỆN 17 SKILLS ("HƯƠNG ĐỒNG GIÓ NỘI - VAC ONLINE")

Tài liệu này được nạp tự động cho các AI Coding Agents (**Antigravity, Claude, ChatGPT, Cursor, Windsurf**) và đội ngũ phát triển khi làm việc trong kho mã nguồn dự án.

---

## 🚨 0. HAI QUY TẮC TỐI THƯỢNG BẤT DI BẤT DỊCH CHO MỌI TASK (`RULE D0` & `RULE D1`)

### 🔹 `RULE D0`: ĐỐI CHIẾU CHÉO & TRIỆT TIÊU TRÙNG LẶP 100% (`Cross-Document Reconciliation & Zero Redundancy`)
Ở **TẤT CẢ CÁC TASK** (dù là thêm tính năng, chỉnh sửa thiết kế, cân bằng kinh tế hay viết code), AI **BẮT BUỘC** thực hiện quy trình kiểm toán 3 bước sau:
1. **Đối chiếu chéo toàn bộ tài liệu hiện có (`Cross-Document Reconciliation`):** Rà soát toàn bộ các file chuẩn (`00` ➔ `16` và `AGENTS.md`) để đảm bảo mọi con số (**6 Giai đoạn, 11 Epics, 52 Modules `M01.0 ➔ M11.6`, 155 Thực thể gốc với 81 loài V-A-C mở khóa theo 5 Đợt `23 ➔ 45 ➔ 63 ➔ 76 ➔ 81`, 17 AI Skills, 37 Test Cases**) và tên thực thể khớp nhau 100%, không để sót bất kỳ tham chiếu cũ nào.
2. **Loại bỏ triệt để phần trùng lặp, dư thừa hoặc không cần thiết (`Zero Redundancy & Pruning`):**
   * Khi thêm tính năng/sự kiện mới có giao thoa với phần cũ, bắt buộc **hợp nhất (Merge) vào cùng một hệ thống duy nhất** và xóa bỏ phần rời rạc cũ (VD: hợp nhất mảnh cổ vật cũ vào `FEAT_03: 12 Kỷ Vật Tuổi Thơ 8x–9x`; phân tách rõ `EVENT_03: Đua Trâu Vàng chỉ số nông trại` với `M11.2..M11.4: Võ Đài PK & Loạn Chiến điều khiển thời gian thực`).
   * Tuân thủ nguyên tắc **Single Source of Truth (Một Nguồn Chân Lý Duy Nhất)**:
     * Gameplay, Cốt truyện, Lộ trình mở khóa 5 Đợt V-A-C & Luật chơi chi tiết $\rightarrow$ Chỉ viết đầy đủ tại `01_MASTER_GDD`.
     * Công thức toán học, Giá, Thuế, Trần thưởng & Bảng `Sources vs. Sinks` $\rightarrow$ Chỉ viết đầy đủ tại `02_MASTER_ECONOMY` & `04_MASTER_DATA.csv`.
     * Kiến trúc Database, RPC, Netcode `10Hz LERP`, `IHyperCasualCartridge` & 14 Quy tắc Code (`RULE C1 ➔ C14`) $\rightarrow$ Chỉ viết đầy đủ tại `03_MASTER_TECH`.
     * Quy chuẩn Màu sắc, Kích thước Sprite, Animation & Cozy Acoustic WebAudio v2.0 $\rightarrow$ Chỉ viết đầy đủ tại `05_MASTER_ART`.
     * Sơ đồ luồng & Wireframe màn hình $\rightarrow$ Chỉ viết đầy đủ tại `06_MASTER_UI_UX` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`.
     * Bản đồ lộ trình tổng thể 6 Giai đoạn, 4 Cổng kiểm soát & Lịch LiveOps $\rightarrow$ Chỉ viết tại `08_MASTER_PLAN` & `10_MASTER_AI_PLAYBOOK`.
     * Hồ sơ triển khai chi tiết từng Giai đoạn (What/How từng Module, Phân công 6 Bộ phận, Prompt giao việc 100% cho AI kèm Skills & Checklist QC) $\rightarrow$ Chỉ viết tại bộ 6 file **`11_PLAN_GIAI_DOAN_1` ➔ `16_PLAN_GIAI_DOAN_6`**.
3. **Lưu trữ sạch sẽ (`Clean Root Directory`):** Mọi file tài liệu rời rạc đã được gộp phải chuyển vào `docs_archive_merged/`, giữ thư mục gốc gọn nhẹ đúng bộ file `00 ➔ 16`.

---

### 🛡️ `RULE D1`: BẢO TOÀN ĐỊNH HƯỚNG CORE GAMEPLAY, NHẤT QUÁN ART/CODE, BẢO TOÀN DATABASE & CẢNH BÁO TÁC ĐỘNG CHÉO NGAY TỪ BƯỚC THIẾT KẾ (`Architectural Integrity, Consistency & Early Impact Alert Gate`)
Để việc phát triển lâu dài qua 6 Giai đoạn và các bản mở rộng tương lai **không bao giờ làm game bị lệch hướng hoặc hỏng tính năng cũ**, mọi thành viên và AI Agent **BẮT BUỘC** tuân thủ 5 trụ cột bất khả xâm phạm sau:
1. **Bảo Toàn Core Gameplay & Chống Lệch Hướng (`Core Gameplay Guardrail`):**
   * Trái tim của *Hương Đồng Gió Nội (VAC Online)* luôn là vòng lặp **Vườn – Ao – Chuồng (VAC) 3 Miền Bắc – Trung – Nam (`70% Chung – 30% Độc quyền`)** mở khóa tiệm tiến theo **5 Đợt (`23 ➔ 45 ➔ 63 ➔ 76 ➔ 81 loài`)** gắn với **10 Chương Gia Phả**, cùng cơ chế **Năng lượng Bát Cơm `⚡` Hybrid (`0⚡` cho thao tác trồng trọt/thu hoạch/tưới nước tại nhà và giải trí Sảnh Chung)**.
   * Mọi tính năng phụ trợ (Võ Đài PK, Loạn Chiến, Máy Thùng Hyper-Casual, Sự kiện Lễ hội) chỉ đóng vai trò **bổ trợ cảm xúc & tiêu vàng chống lạm phát**, tuyệt đối **không được lấn át hoặc phá vỡ kinh tế nông trại cốt lõi** (luôn khóa trần thưởng Hyper-Casual `<= 1,500 🪙/ngày` và thu thuế Sới Đình `10% Zero-Sum`).
2. **Nhất Quán Tuyệt Đối Về Art Style & UI/UX (`Art & UI Consistency Lock`):**
   * Mọi Sprite, Bản đồ, Icon và VFX mới bắt buộc tuân thủ **Bảng 64 màu 3 miền**, góc chiếu **`3/4 Top-Down Oblique`**, lưới **`32x32 px`** (`168x80 px` ô đất tương tác), **viền ấm `#3D2314` (cấm tuyệt đối viền đen `#000000`)**, và diễn hoạt **`8–12 frames`** (`planted feet`) theo đúng `05_MASTER_ART`.
   * Mọi màn hình/Modal mới phải giữ đúng chất liệu **Gỗ Lim / Tre Trúc / Giấy Dó**, chuẩn công thái học **`2-Thumb Landscape HUD`** (`.touch-btn >= 38–44px`, bảo vệ vùng `safe-area-inset-*`) theo `06_MASTER_UI_UX`.
3. **Nhất Quán Kiến Trúc Code & Cô Lập Không Gây Lỗi Chéo (`Code Consistency & Non-Regression Isolation`):**
   * Tuân thủ 100% **TypeScript Strict Mode (`0 any`)**, **100% Data-Driven từ `GAME_CATALOG`** (`src/data/masterData.ts`), tách biệt rõ ràng giữa `FarmScene.ts`, `SocialPlazaScene.ts`, `MinigameHostScene.ts` (`IHyperCasualCartridge`) và `useGameStore.ts`.
   * Triển khai tính năng mới **tuyệt đối không được sửa đổi phá vỡ chữ ký hàm (function signatures), state hoặc luồng hoạt động của các tính năng đã chạy ổn định**; bắt buộc vượt qua `npx tsc --noEmit` (`0 errors`) và toàn bộ **37 Test Cases tự động** trong `qcTestRunner.ts`.
4. **Đồng Nhất & Bảo Toàn Tuyệt Đối Cơ Sở Dữ Liệu (`Database Preservation & Additive-Only Schema`):**
   * Mọi cập nhật lên **11 Bảng PostgreSQL + 7 Hàm Atomic RPC** trên Supabase (`supabase/migrations/*.sql`) cũng như cấu trúc lưu trữ `localStorage` bắt buộc tuân theo nguyên tắc **Mở Rộng Không Phá Hủy (`Additive-Only & Backward-Compatible Migrations`)**: chỉ dùng `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS ... DEFAULT ...`, `CREATE OR REPLACE FUNCTION`.
   * **CẤM TUYỆT ĐỐI** các lệnh làm mất dữ liệu hoặc gãy tương thích ngược như `DROP TABLE`, `DROP COLUMN`, đổi tên cột đang dùng, hoặc thay đổi `ID` của **155 thực thể gốc** (`CROP_`, `TREE_`, `ANI_`, `AQUA_`, `DISH_`, `WORK_`, `MAC_`, `PET_`, `FASH_`, `DEC_`, `ITEM_`, `CRAFT_`).
5. **Cơ Chế Cảnh Báo Tác Động Chéo Ngay Từ Bước 1 (`Mandatory Early Impact Alert at Design/Planning Stage`):**
   * Ngay tại **Bước 1 (Lên Thiết Kế & Kế Hoạch)** của bất kỳ tính năng hay chỉnh sửa nào, trước khi viết code hay vẽ asset, AI / Dev **BẮT BUỘC** phải chạy bước kiểm tra và xuất bảng **`[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]`** trên 5 khía cạnh: *(1) Core Gameplay VAC, (2) Cân bằng Kinh tế, (3) Art Style & UI, (4) Code Modules cũ, (5) Database Schema*.
   * **Nếu phát hiện tính năng mới có bất kỳ ảnh hưởng hay thay đổi nào chạm tới tính năng khác, Core Gameplay hoặc Database, AI BẮT BUỘC PHẢI THÔNG BÁO RÕ RÀNG NGAY TỪ BƯỚC LÊN THIẾT KẾ / KẾ HOẠCH (nêu rõ mức độ ảnh hưởng + phương án cô lập an toàn) và CHỜ CHỦ DỰ ÁN (PO) PHÊ DUYỆT** trước khi được phép chuyển sang Bước 2–3–4!

---

## 1. Bản Đồ Bộ Tài Liệu Chuẩn Duy Nhất (`00` ➔ `16` — Đã Đồng Bộ v9.3)
* **11 File Master Cốt Lõi (`00` ➔ `10`):**
  * `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` *(v9.3)*: Sổ tay tổng chỉ huy, điều hướng tài liệu `00 ➔ 16`, bộ đôi quy tắc tối thượng `RULE D0` + `RULE D1` & ánh xạ 6 Bộ phận với **17 AI Skills**.
  * `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` *(v8.0)*: Gameplay Vườn – Ao – Chuồng (**155 thực thể**, mở khóa **81 loài V-A-C qua 5 Đợt `23 ➔ 45 ➔ 63 ➔ 76 ➔ 81`**), 3 Miền, 6 Gia nhân, 6 Sự kiện Lễ hội & **Chương 6: Sảnh Chung, Võ Đài PK 1v1 / 3v3 / Loạn Chiến 8–12P & Máy Thùng Hyper-Casual**.
  * `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md` *(v8.0)*: Toán học kinh tế 5 Đợt, **7 Van chống lạm phát**, đồng **`🏮 Xu Hội Làng`** & Bảng `Sources vs. Sinks` 6 Giai đoạn.
  * `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` *(v7.0)*: Kiến trúc Phaser 3 + React 19 + 11 Bảng Supabase SQL + 7 Hàm Atomic RPC, **Phân kênh Sảnh Chung `30 CCU/Shard` + `10Hz LERP`**, chuẩn **`IHyperCasualCartridge`** & **14 Quy tắc Kỹ thuật (`RULE C1 ➔ C14`)**.
  * `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv`: Dữ liệu thông số kinh tế gốc (155 thực thể).
  * `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` *(v6.2)*: Quy chuẩn Pixel Art 64 màu, viền ấm `#3D2314`, animation 8–12 frames, **Quy trình 5 Bước AI Asset Pipeline & Ma Trận Phân Bổ Sản Xuất Asset/Animation/VFX qua 6 Giai Đoạn** & **Cozy Acoustic WebAudio Engine v2.0**.
  * `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` *(v7.1)* & `07_INTERACTIVE_WIREFRAME_VIEWER.html`: Wireframe toàn bộ màn hình từ Splash đến Sảnh Chung & Võ Đài PK.
  * `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` *(v9.2)* & `09_FACEBOOK_ROADMAP_POSTER.html`: Bản đồ tổng quan 6 Giai đoạn (tích hợp định mức Asset/Animation/VFX từng giai đoạn), 4 Cổng kiểm soát, Lịch LiveOps & Ma trận 37 Test Cases.
  * `10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md` *(v9.2)*: Quy trình 6 bước khép kín kèm Tự Nhận Diện **17 Skills Chuyên Môn** cho từng Module `M01.0` ➔ `M11.6`.
* **6 File Kế Hoạch Thực Thi Chi Tiết Từng Giai Đoạn (`11` ➔ `16` — Stage Execution Runbooks v1.1, tích hợp Mục 2.5 Kế hoạch sản xuất Asset/Animation/VFX & 2 Prompt giao AI):**
  * `11_PLAN_GIAI_DOAN_1_v1.0_Ve_Que_Lap_Nghiep.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 1 (`14 Ngày` • `M01.0 ➔ M03.5` • Đợt 1: `23/81 loài V-A-C` + Gói Asset/Anim/VFX Đợt 1 • Chương 1–2).
  * `12_PLAN_GIAI_DOAN_2_v1.2_Bep_Que_Va_Lan_Tho.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 2 (`10 Ngày` • `M04.1 ➔ M05.5` • Đợt 2: `+22 ➔ 45/81 loài` + Gói Asset/Anim/VFX Đợt 2 • Chương 3, 6, 7).
  * `13_PLAN_GIAI_DOAN_3_v1.5_Cho_Phien_Va_Hang_Xom.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 3 (`10 Ngày` • `M06.1 ➔ M07.4` • Đợt 3: `+18 ➔ 63/81 loài` + Gói Asset/Anim/VFX Đợt 3 • Chương 4–5).
  * `14_PLAN_GIAI_DOAN_4_v1.8_Hoi_Lang_Va_Thoi_Trang.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 4 (`12 Ngày` • `M08.1 ➔ M09.3` • Đợt 4: `+13 ➔ 76/81 loài` + Gói Asset/Paper-Doll/VFX Đợt 4 • Chương 8–9).
  * `15_PLAN_GIAI_DOAN_5_v2.0_Le_Cuoi_Va_Homestay.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 5 (`12 Ngày` • `M10.1 ➔ M10.4` • Đợt 5: `+5 ➔ 81/81 loài` + Gói Asset/Anim/VFX Đợt 5 • Chương 10).
  * `16_PLAN_GIAI_DOAN_6_v3.0_Sanh_Chung_PK_Va_Hyper_Casual.md` *(v1.1)*: Kế hoạch thực thi Giai đoạn 6 (`14 Ngày` • `M11.1 ➔ M11.6` • Tilemap Sảnh Chung `48x32`, PK 1v1/3v3, Loạn Chiến 8–12P & `IHyperCasualCartridge`).

---

## 2. Quy Trình 6 Bước Khép Kín Kèm Tự Nhận Diện Skill & Bảo Toàn Hệ Thống (`RULE D0 + RULE D1 Loop`)
Khi được yêu cầu làm một tính năng (`Module Mxx.y` từ `M01.0` đến `M11.6` hoặc tính năng mới), AI **BẮT BUỘC** tự động nhận diện và kích hoạt các Skill liên quan theo từng bước trong `10_MASTER_AI_PLAYBOOK`:
1. **Bước 1 — Thiết kế, Đối chiếu `RULE D0` & Báo cáo Tác động Chéo `RULE D1` (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`, `@backend-architect`):** Đối chiếu với `01`, `02`, `03`, `04`, `05`, `06` và file kế hoạch giai đoạn tương ứng (`11 ➔ 16`) để chốt thông số; xuất bảng **`[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]`**. **Nếu có bất kỳ ảnh hưởng nào tới tính năng cũ, Core Gameplay hoặc Database, phải thông báo ngay cho PO và dừng chờ duyệt kế hoạch trước khi code.**
2. **Bước 2 — Tạo Asset, Bản đồ, VFX & Âm thanh Nhất quán (`@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`):** Cập nhật Sprite/Texture trong `src/game/assets/PixelAssetGenerator.ts` (giữ chuẩn 64 màu, góc `3/4 Top-Down`, viền ấm `#3D2314`), Particle VFX và SFX trong `src/services/soundEffects.ts`.
3. **Bước 3 — Code Backend Additive-Only, Multiplayer Sync & Store (`@backend-architect`, `@godot-multiplayer-engineer`, `@economy-designer`):** Cập nhật SQL/RPC theo chuẩn **Additive-Only** (`ADD COLUMN IF NOT EXISTS`, không xóa/đổi cấu trúc bảng hay ID cũ), kênh Realtime / Sharded Plaza `10Hz LERP`, Types (`0 any`) và Action cô lập an toàn trong `src/store/useGameStore.ts`.
4. **Bước 4 — Code Giao diện 2-Thumb Landscape & Cartridge SDK (`@ui-designer`, `@frontend-developer`):** Cập nhật `FarmScene.ts`, `SocialPlazaScene.ts`, `MinigameHostScene.ts` (`IHyperCasualCartridge`) và `src/App.tsx` (`.touch-btn >= 38–44px`, `safe-area-inset-*`) không làm xô lệch HUD cũ.
5. **Bước 5 — Tự kiểm thử Hồi quy (Non-Regression), Đối chiếu `RULE D0/D1` & Audit (`@code-reviewer`):** Chạy `npx tsc --noEmit` (`0 errors`), chạy toàn bộ **37 Test Cases** trong `src/services/qcTestRunner.ts` đạt `100% PASS` (đảm bảo mọi tính năng cũ vẫn chạy hoàn hảo) và kiểm tra lại `RULE D0` + `RULE D1`.
6. **Bước 6 — Trình duyệt & Dừng chờ lệnh (`@growth-hacker`, `@content-creator`):** Xuất **Phiếu Nghiệm Thu Tính Năng** (ghi rõ các Skill đã kích hoạt + xác nhận tuân thủ `RULE D0` & `RULE D1`) và **dừng lại chờ Chủ dự án duyệt (`Approval Gate`)**.
