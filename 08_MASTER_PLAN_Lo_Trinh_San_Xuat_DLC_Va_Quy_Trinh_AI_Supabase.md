# KẾ HOẠCH PHÁT TRIỂN TỔNG THỂ, BẢN ĐỒ LỘ TRÌNH 5 GIAI ĐOẠN & PHÂN RÃ WBS CHI TIẾT CHO 6 BỘ PHẬN (MASTER ROADMAP & WBS BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` *(Đã hợp nhất Lộ trình Công bố 5 Giai đoạn + Kế hoạch Sản xuất Sprint + Phân rã 10 Epics / 38 Modules WBS cho 6 Bộ phận, loại bỏ 100% trùng lặp)*  
**Phiên bản:** Master Development Plan 6.0 (Unified 5-Stage Public & Dev Roadmap)  
**Đối tượng sử dụng:** Product Owner (PO) / Game & Narrative Designer (GD), UI/UX Designer, Artist & Sound Engineer, Backend Dev (BE), Frontend Dev (FE), QA/QC Engineer

---

## PHẦN 1: ĐỐI CHIẾU & ĐỒNG NHẤT LỘ TRÌNH CÔNG BỐ USER VỚI LỘ TRÌNH SẢN XUẤT DEV TEAM (`5-STAGE UNIFIED ROADMAP`)

Để đảm bảo **Lộ trình công bố với người chơi (Marketing/Community Roadmap)** và **Lộ trình phát triển của đội ngũ kỹ thuật (Engineering Sprints & WBS)** khớp nhau **100% (1-đối-1)**, không xảy ra tình trạng lệch pha hay trùng lặp tính năng giữa các bản cập nhật, toàn bộ dự án được quy hoạch chuẩn hóa thành **5 Giai Đoạn Phát Triển Chính (`Giai Đoạn 1` ➔ `Giai Đoạn 5`)**:

| Giai Đoạn (Public & Dev) | Tên Giai Đoạn Công Bố Với Người Chơi | Mã Phiên Bản & Thời Lượng Dev | Các Hệ Thống & Epics Kỹ Thuật Được Triển Khai (`10 Epics / 38 Modules`) | Cốt Truyện Chính Mở Khóa |
| :--- | :--- | :---: | :--- | :---: |
| **GIAI ĐOẠN 1** | **🌱 Về Quê Lập Nghiệp**<br>*(Khởi Tạo 3 Miền & Sinh Thái V-A-C)* | **`v1.0 Core MVP`**<br>*(14 Ngày: 4 ngày Hạ tầng + 10 ngày Core VAC)* | • **EPIC 01 (`M01.0–M01.4`):** Engine Phaser 3 + React 19, Splash 4 bước, Cổng Xác thực 4 Tabs (Login/Register/Guest/OTP), Viewport 2-Thumb Landscape, Đồng bộ 155 Thực thể lên Supabase.<br>• **EPIC 02 (`M02.1–M02.4`):** Chọn Điền chủ & 3 Miền (`Bắc/Trung/Nam`), Năng lượng `⚡` Hybrid, Thời tiết động (`Nắng/Mưa/Đom đóm`), Khai hoang 25 phân khu.<br>• **EPIC 03 (`M03.1–M03.5`):** Vòng lặp canh tác **Vườn – Ao – Chuồng (81 loài)**, Tưới nước Giếng (`-15%` t/g), Vét Bùn Ao lấy Phù Sa kích nổ **Nông Sản Hoàng Kim `⭐` (`x3`)**. | **Chương 1 – 2**<br>*(Chiếc Tráp Gỗ Lim & Bí Mật Đáy Ao)* |
| **GIAI ĐOẠN 2** | **🍲 Bếp Quê & Lán Thợ**<br>*(Ẩm Thực 3 Miền & Thuê Gia Nhân)* | **`v1.2 Update 1`**<br>*(10 Ngày)* | • **EPIC 04 (`M04.1–M04.4`):** Xây dựng **8 Xưởng Làng Nghề** (`MAC_01..08`), **Nồi Đất Phối Món Ngẫu Nhiên** (`>=3` nguyên liệu thưởng `+10💎`) & Sổ tay **27 Món Ăn 3 Miền**.<br>• **EPIC 05 (`M05.1–M05.5`):** Xây **Lán Thợ Đồng Quê**, tuyển dụng **6 Gia Nhân (`WORK_01..06`)**, Bàn Ăn Chung Lán Thợ, Cấp phát 4 Đồ bảo hộ 72h (`CRAFT_01..04`), Giỏ Kho Thợ `120 ô` & **Lazy-Tick Offline**. | **Chương 3, 6 & 7**<br>*(Khói Bếp, Lán Thợ Chú Tư & Khung Cửi Lụa)* |
| **GIAI ĐOẠN 3** | **🚂 Chợ Phiên & Hàng Xóm**<br>*(Giao Thương Liên Vùng & Đi Trộm Vui Nhộn)* | **`v1.5 Update 2`**<br>*(10 Ngày)* | • **EPIC 06 (`M06.1–M06.4`):** Đơn hàng **Hợp Tác Xã**, **Báo Chợ Phiên P2P 3 Miền** (khung giá `0.8x–2.0x`, thuế `10%`), **Ga Tàu Thống Nhất Bắc – Nam** & **Thương Lái Giá Sốt `1.5x–3.0x`**.<br>• **EPIC 07 (`M07.1–M07.4`):** Thăm nhà bạn bè, **Hái Trộm Vườn / Câu Trộm Cá** (cửa sổ vàng 2 phút, bảo hiểm `80%`), **4 Lớp Phòng Thủ** (*Chó Phú Quốc, Ngỗng, Bẫy* phạt Zero-Sum `50🪙` + rớt *Dép Tổ Ong*), **Cứu Trợ Sau Bão (`0⚡`)** & **Sổ Lưu Bút Cổng Làng**. | **Chương 4 & 5**<br>*(Chó Phú Quốc Canh Sân & Tiếng Còi Tàu)* |
| **GIAI ĐOẠN 4** | **🏮 Hội Làng & Thời Trang**<br>*(Đình Làng, Đột Biến & Lụa Là Gấm Vóc)* | **`v1.8 Update 3`**<br>*(10 Ngày)* | • **EPIC 08 (`M08.1–M08.4`):** **Trùng Tu Đình Làng 3 Cấp**, **Miếu Thần Nông** rút quẻ, **Vườn Ươm Chiết Cành Đột Biến** (Bảo hiểm Pity 100%), **Thám Hiểm Rừng Trúc (`-6⚡`)**, **Đua Thuyền Rồng HTX** & **Chợ Đêm Ẩm Thực (`x1.8`)**.<br>• **EPIC 09 (`M09.1–M09.2`):** **Gương Soi 12 Ô Thời Trang** (`FASH_01..12`), **Khâu Ghép `3➔1`**, **Transmog**, **Thi Duyên Dáng Tuần**, **Lịch Bloc Điểm Danh**, **Đập Niêu Gacha**, **Xổ Số 18:00** & **Gói IAP**. | **Chương 8 & 9**<br>*(Hạt Giống Ngũ Sắc & Đại Tiệc Cảm Hóa Bá Kiến)* |
| **GIAI ĐOẠN 5** | **💍 Lễ Cưới & Homestay**<br>*(Hạnh Phúc Trăm Năm & Điền Trang Nghỉ Dưỡng)* | **`v2.0 Complete`**<br>*(10 Ngày)* | • **EPIC 10 (`M10.1–M10.3`):** **Hẹn Hò 10 Tim ❤️**, **Lễ Cưới Làng Quê & Bé Tiểu Đồng Gia Bảo** (`+30⚡` cơm sáng + `+10` nông sản/ngày), **Khu Du Lịch Sinh Thái Homestay 2 Cấp** (`BM_HOME_01..02`), **Xuất Ảnh Bằng Khen Điền Chủ (`.PNG` `960x540`)** & Đóng gói Native App (`iOS / Android CapacitorJS`). | **Chương 10 (Kết)**<br>*(Trầu Cau Nên Duyên & Gia Bảo Truyền Đời)* |

---

## PHẦN 2: QUY TRÌNH PHỐI HỢP 4 CỔNG KIỂM SOÁT CHẤT LƯỢNG & ĐỊNH TUYẾN AI SKILLS (`4 QUALITY GATES & SKILL ROUTING`)

Mọi Module tính năng (`M01.0` ➔ `M10.3`) trong từng Giai đoạn bắt buộc đi qua **4 Cổng Kiểm Soát** (kết hợp giữa 6 Bộ phận nhân sự và 16 AI Skills chuyên môn trong `10_MASTER_AI_PLAYBOOK`):

| Cổng (Gate) | Bộ Phận & AI Skills Phụ Trách | Đầu Vào (Input) | Đầu Ra Bắt Buộc (Deliverable) | Tiêu Chí Qua Cổng (Exit Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **Gate 1: Idea, Narrative & Economy** | **PO / GD** (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`) | Master GDD (`01`), Economy (`02`), CSV (`04`) | Đặc tả luồng UX, công thức toán học, giới hạn chống lạm phát & thoại phân nhánh (`EMP`/`PRAG`) | Không còn chỉ số mơ hồ; 100% thực thể khớp `ID` trong `04_MASTER_DATA.csv` (155 dòng). |
| **Gate 2: UI/UX, Art & Audio** | **UI/UX & Artist/Sound** (`@ui-designer`, `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`) | Danh sách `ID` từ Gate 1, Art (`05`), UI (`06`) | Wireframe `2-Thumb Landscape`, Sprite Sheet `32x32` / `48x64`, Particle VFX & WebAudio SFX | Viền ấm `#3D2314` (không viền đen), loop `8–12 frames` mượt, vùng chạm nút `>= 38–44px`. |
| **Gate 3: Dev Implementation** | **Backend & Frontend** (`@backend-architect`, `@frontend-developer`) | Spec Gate 1 + Asset Gate 2 + Tech (`03`) | Bảng SQL + RLS + Atomic RPC (`FOR UPDATE`), Zustand Store, Phaser Scene & React Modal | Biên dịch `tsc --noEmit` đạt `0 errors`; chống âm tiền/năng lượng & chống tràn trần chỉ số. |
| **Gate 4: QC & Sign-off** | **QA / QC** (`@code-reviewer`, `@growth-hacker`) | Bản build Staging + Bộ 25 Test Cases tự động | Báo cáo Pass/Fail (Functional, Anti-cheat, Mobile Safe-Area, Multi-tab Realtime) | Pass `100%` bộ Test Cases trong `qcTestRunner.ts`; đạt 60 FPS trên trình duyệt di động xoay ngang. |

---

## PHẦN 3: PHÂN RÃ CHI TIẾT TỪNG GIAI ĐOẠN THEO 6 VỊ TRÍ & 38 MODULES WBS (`GIAI ĐOẠN 1` ➔ `GIAI ĐOẠN 5`)

---

### 🌱 GIAI ĐOẠN 1 (`v1.0 CORE MVP` — 14 NGÀY): VỀ QUÊ LẬP NGHIỆP (HẠ TẦNG, KHỞI TẠO 3 MIỀN & SINH THÁI V-A-C)

#### 3.1.A. Bảng Phân Giao Nhiệm Vụ Cụ Thể Cho 6 Vị Trí Trong Giai Đoạn 1

| Vị Trí (Role) | Danh Sách Công Việc Phải Làm Trong Giai Đoạn 1 | Đầu Ra Nghiệm Thu (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / Game & Narrative Designer** | • Chốt bảng thông số **155 Thực thể** trong `04_MASTER_DATA.csv` (trọng tâm 81 loài Vườn – Ao – Chuồng).<br>• Quy định phần thưởng Đăng ký mới (`+500 🪙`), Liên kết tài khoản Khách (`+50 💎` + `+1,000 🪙`) và bảng **Quà 7 Ngày Tân Thủ** (Ngày 7 tặng Chó Phú Quốc SSR).<br>• Thiết kế công thức **Buff Nội tại 3 Miền**: Bắc (`-10%` thời gian chín `CROP`), Trung (`-10%` thời gian chế biến `MACHINE`), Nam (`+1` sản lượng phụ `AQUA`).<br>• Viết kịch bản và lựa chọn phân nhánh (`EMP` Nghĩa Tình vs `PRAG` Thực Dụng) cho **Chương 1 (*Chiếc Tráp Gỗ Lim*)** & **Chương 2 (*Bí Mật Đáy Ao*)**. | • `04_MASTER_DATA.csv` (155 thực thể).<br>• Spec Buff 3 Miền, Quà 7 Ngày & Kịch bản Chương 1–2 trong file `01` & `02`. |
| **2. UI / UX Designer** | • Thiết kế **Màn hình 0A (Splash & Thanh tải 4 bước `0% ➔ 100%`)** có câu Ca dao nhà nông & nút `⚡ Bỏ qua chờ`.<br>• Thiết kế **Màn hình 0B (Cổng Làng Xác Thực 4 Tabs)**: `🔑 Đăng Nhập`, `📝 Đăng Ký Mới`, `⚡ Chơi Khách / Liên Kết`, `🔓 Quên Mật Khẩu OTP`.<br>• Thiết kế **Màn hình 1 (`REGISTER` - Giấy Đăng Ký Về Quê)**: Chọn Nam/Nữ, đặt tên Điền chủ, chọn 3 thẻ Quê hương Bắc – Trung – Nam.<br>• Quy hoạch khung **Main HUD 2-Thumb Landscape** (`safe-area-inset-*`, giữ trống 82–85% màn hình giữa), **Khay Chọn Giống 6 Nhóm (`Collapsible Seed Drawer`)** và màn hình nhắc xoay ngang điện thoại. | • Wireframe `0A`, `0B`, `Màn hình 1` & `Main HUD` trong file `06` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`. |
| **3. Artist, Animator & Sound** | • Thiết kế Icon App (`icon-192.svg`, `icon-512.svg`), Avatar & Cover (`fb_ava.png`, `fb_cover.png`).<br>• Tạo bộ Texture ô đất/ao (`tile_land_dry`, `tile_land_wet`, `tile_pond`, `tile_orchard` kích thước `168x80 px`), Nhà Chính 3 gian (`bldg_house`) và 4 nhóm cây trồng có hiệu ứng gió đung đưa (`Wind Sway` lệch pha theo ô).<br>• Tạo 4 Particle VFX: `fx_water_drop` (tưới nước), `fx_gold_star` (nổ Hoàng Kim ⭐), `fx_raindrop` (Mưa rào), `fx_firefly` (Đêm đom đóm).<br>• Lập trình WebAudio Synthesizer trong `soundEffects.ts`: Nhạc nền Ngũ Cung (`toggleFolkBgm`), tiếng tưới nước (`playWaterSplash`), tiếng thu hoạch vàng (`playHarvestCoin`), tiếng chiêng (`playCelebrationGong`). | • `src/game/assets/PixelAssetGenerator.ts`.<br>• `src/services/soundEffects.ts`.<br>• `public/icon-*.svg`. |
| **4. Backend Engineer (BE)** | • Khởi tạo Supabase Project, viết migration `0001` (Bảng `profiles`, `inventories`, `farm_entities` bật RLS + `CHECK (region IN ('NORTH','CENTRAL','SOUTH'))`).<br>• Viết migration `0002` (Bảng `public.master_catalog` + hàm Atomic RPC `public.rpc_sync_master_catalog(p_items JSONB)`).<br>• Cấu hình Supabase Auth cho Email Sign-up / Sign-in / Password Reset OTP. | • `supabase/migrations/0001_init_huong_dong_gio_noi.sql`.<br>• `supabase/migrations/0002_seed_full_master_data.sql`. |
| **5. Frontend Engineer (FE)** | • Xây dựng `src/data/masterData.ts` (155 thực thể), `src/services/supabaseClient.ts` và `src/services/authService.ts` (Hỗ trợ kép Supabase Auth + Local Vault Offline).<br>• Xây dựng `src/components/SplashAndAuthGate.tsx`, điều khiển bản đồ `Touch Drag-to-Pan & Zoom` (phân biệt `dist > 12px` giữa kéo bản đồ và chạm thu hoạch) trong `FarmScene.ts`.<br>• Lập trình các hàm cốt lõi trong `useGameStore.ts`: `setProfile` (lọc XSS `/[<>]/g`), `interactTile` (Gieo hạt, Tưới nước `-15%` t/g tốn `0⚡`, Bón Bùn Phù Sa nổ `45%` Hoàng Kim `⭐ x3`, Thu hoạch cộng độ bùn ao), `dredgePondMud` (`-3⚡` lấy `+3 Bùn Phù Sa`), `expandWildLand` (`-5⚡`, trần `25/25`), `cycleWeather` (`RAINY` tự tưới 100% ô đất). | • `SplashAndAuthGate.tsx`, `authService.ts`, `FarmScene.ts`, `useGameStore.ts`. |
| **6. QA / QC Engineer** | • Thực thi kiểm thử tự động & thủ công toàn bộ 13 kịch bản nền tảng và canh tác VAC:<br>  - Nhóm Auth & Data: `TC-01.0a`, `TC-01.0b`, `TC-01.0c`, `TC-01.0d`, `TC-01.3a`.<br>  - Nhóm 3 Miền, Năng lượng & Thời tiết: `TC-02.1a`, `TC-02.1b`, `TC-02.2b`, `TC-02.3a`, `TC-02.4a`.<br>  - Nhóm Vườn – Ao – Chuồng: `TC-03.1a`, `TC-03.2a`, `TC-03.3a`, `TC-03.4a`. | • Pass 100% các Test Cases Giai đoạn 1 trong `src/services/qcTestRunner.ts`. |

#### 3.1.B. Phân Rã Chi Tiết Các Module WBS Thuộc Giai Đoạn 1 (`EPIC 01`, `EPIC 02`, `EPIC 03`)
* **`M01.0` – Splash 4 Bước & Cổng Xác Thực 4 Chế Độ (`SplashAndAuthGate.tsx` & `authService.ts`):**
  * *GD Spec:* Tải 4 bước (`0-25-50-75-100%`), hỗ trợ Đăng nhập, Đăng ký (`+500 🪙`), Chơi Khách 1 chạm (`GUEST`) và Liên kết tài khoản Khách lên Chính thức (`+50 💎` + `+1,000 🪙`, giữ nguyên 100% tài sản đang chơi), Quên mật khẩu OTP 6 số.
  * *QC Check (`TC-01.0a..0d`):* Chặn mật khẩu `< 6` ký tự; xác nhận liên kết tài khoản Khách bảo toàn nguyên vẹn số Vàng và cộng đúng `+50 💎`.
* **`M01.1` & `M01.2` – Viewport Màn Hình Ngang `2-Thumb HUD` & Điều Khiển Cảm Ứng (`PhaserGame.tsx` & `FarmScene.ts`):**
  * *GD & Dev Spec:* Khung cảnh Phaser 3 phủ kín màn hình ngang; nếu kéo ngón tay `dist > 12px` thì bật cờ `isDragging = true` để dịch chuyển camera mà không thu hoạch nhầm ô đất bên dưới; khóa Zoom trong ngưỡng `[0.75x, 1.45x]`.
  * *QC Check (`TC-01.1a..c`, `TC-01.2a..b`):* Xoay dọc hiện thông báo nhắc xoay ngang; kéo bản đồ qua ô lúa chín không làm thu hoạch nhầm.
* **`M01.3` & `M01.4` – Đại Từ Điển 155 Thực Thể (`masterData.ts`) & Kênh Kết Nối Đám Mây (`realtimeService.ts`):**
  * *GD & Dev Spec:* Toàn bộ 155 thực thể định danh duy nhất, đồng bộ lên `public.master_catalog` qua RPC `rpc_sync_master_catalog`.
  * *QC Check (`TC-01.3a`):* Đếm đủ `155/155` thực thể, không trùng `id`, không có giá trị `NaN` hoặc âm.
* **`M02.1` ➔ `M02.4` – Khởi Tạo 3 Miền, Năng Lượng Hybrid `⚡`, Thời Tiết Động & Khai Hoang 25 Phân Khu:**
  * *GD & Dev Spec:* Gieo/Tưới/Thu hoạch tốn `0 ⚡`; Vét Ao tốn `3 ⚡`, Khai Hoang tốn `5 ⚡` + `500 🪙` (trần `25/25` phân khu). Khi chuyển sang `🌧️ Mưa Rào` (`RAINY`), tự động tưới ướt 100% ô đất; khi dựng lại giàn cây nghiêng sau mưa (`isTiltedByStorm`), cộng `+12 XP` và gắn sao Hoàng Kim `⭐`.
  * *QC Check (`TC-02.1a..2.4a`):* Lọc sạch thẻ `<script>` trong tên nhân vật; kiểm tra trần `25/25` phân khu và chặn âm `⚡`.
* **`M03.1` ➔ `M03.5` – Chuỗi Tuần Hoàn Vườn – Ao – Chuồng (81 Loài), Vét Bùn Ao & Nổ Hoàng Kim `⭐` (`x3`):**
  * *GD & Dev Spec:* Tưới nước giảm `15%` thời gian chờ (tối đa 1 lần/vụ). Thu hoạch cá dưới Ao tăng `pondMudCounter`; khi bấm `🪣 Vét Bùn Ao (-3⚡)` nhận `+3 Xô Bùn Phù Sa` (`ITEM_BUN_PHU_SA`). Bón Bùn Phù Sa thúc chín ngay và có `45%` xác suất nổ Hoàng Kim `⭐` (bán gấp `3 lần` giá gốc).
  * *QC Check (`TC-03.1a..3.4a`):* Chống cộng dồn tưới nước 2 lần; kiểm tra nhân 3 giá bán cho ô có cờ `isGolden = true`.

---

### 🍲 GIAI ĐOẠN 2 (`v1.2 UPDATE 1` — 10 NGÀY): BẾP QUÊ & LÁN THỢ (ẨM THỰC 3 MIỀN & THUÊ GIA NHÂN TỰ ĐỘNG HÓA)

#### 3.2.A. Bảng Phân Giao Nhiệm Vụ Cụ Thể Cho 6 Vị Trí Trong Giai Đoạn 2

| Vị Trí (Role) | Danh Sách Công Việc Phải Làm Trong Giai Đoạn 2 | Đầu Ra Nghiệm Thu (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / Game & Narrative Designer** | • Thiết kế thông số xây dựng và vận hành cho **8 Xưởng Làng Nghề (`MAC_01..08`)** và **27 Công thức Món Ăn 3 Miền (`PROD_01..24`, `PROD_N01/C01/S01`)**.<br>• Thiết kế cơ chế **Nồi Đất Phối Món Ngẫu Nhiên ("Thử Tài Bếp Quê")**: Phối từ `>= 3` nguyên liệu theo gợi ý Ca dao để mở khóa món mới, thưởng nóng `+10 💎`, `+50 XP`, `+25 ⚡`.<br>• Thiết kế toán học **4 Vòng lặp Tiêu tiền nuôi 6 Nhân công Lán Thợ (`WORK_01..06`)**: Lương hợp đồng 3 ngày chiết khấu `12%` (`Round(Salary * 3 * 0.88)`), Bàn Ăn Chung Lán Thợ (`Độ No < 35%` tự về ăn), 4 Đồ bảo hộ lao động 72h (`CRAFT_01..04`) và Phụ cấp Ngày mùa (`-300 🪙`).<br>• Viết kịch bản phân nhánh cho **Chương 3**, **Chương 6 (*Lán Thợ Chú Tư Cày*)** và **Chương 7 (*Bí Truyền Khung Cửi Lụa*)**. | • Đặc tả 8 Xưởng, 27 Món ăn & Toán học 6 Gia nhân trong file `01` & `02`. |
| **2. UI / UX Designer** | • Thiết kế Modal **`COOKING` (Bếp Củi Quê Mẹ & 8 Xưởng Chế Biến)**: Khung trái chọn nguyên liệu bỏ vào Nồi Đất + câu Ca dao gợi ý; khung phải danh sách 8 Xưởng & 27 Món ăn kèm chỉ số hồi `⚡`.<br>• Thiết kế Modal **`WORKERS` (Lán Thợ Đồng Quê & Quản Lý 6 Gia Nhân)**: Nút bật/tắt `Auto-Tick`, nút **`🌙 Giả Lập Offline 4h (Lazy-Tick)`**, thanh trạng thái **Bàn Ăn Chung Lán Thợ**, **Giỏ Kho Thợ (`120 ô`)** và thẻ chi tiết từng nhân công (Thanh Độ No, Tinh thần, Áo bảo hộ đang mặc). | • Giao diện Modal `COOKING` & `WORKERS` trong `06` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`. |
| **3. Artist, Animator & Sound** | • Tạo Sprite công trình **Lán Thợ Mái Tranh (`bldg_lodge`, `198x74 px`)** có khói bếp bay lên.<br>• Tạo đầy đủ bộ Sprite cho **6 Gia Nhân (`WORK_01..06`)**: *Chú Tư Cày, Cô Năm Thảo, Anh Sáu Kình, Dì Bảy Bếp, Chú Tám Mộc, Ông Quản Gia Cửu* (`48x48 px`).<br>• Lập trình chuyển động đi tuần trên bản đồ `FarmScene.ts`: khi nhân công có `belly < 35%`, tự động đổi nhãn sang màu đỏ **`[Đói ➔ Về Lán]`** và di chuyển về tọa độ Lán Thợ. | • Sprite `bldg_lodge` & 6 Nhân công đi tuần trong `FarmScene.ts`. |
| **4. Backend Engineer (BE)** | • Triển khai bảng `public.hired_workers` lưu trữ `worker_code`, `is_hired`, `contract_expires_at`, `belly_meter`, `morale_meter`, `equipped_gear_id`, `gear_durability`. | • Bảng `public.hired_workers` trong `0001_init_huong_dong_gio_noi.sql`. |
| **5. Frontend Engineer (FE)** | • Lập trình `cookRandomDish`, `craftOrBuyCatalogItem` (mua xưởng, nấu 27 món ăn hồi `⚡` khóa trần `Math.min(maxStamina, stamina + gain)`).<br>• Lập trình hệ thống **Worker State Machine** trong `useGameStore.ts`: `payWorkerSalary` (chiết khấu 12% cho 3 ngày), `addMealsToLodgeTable`, `feedWorker`, `equipWorkerGear` (đặt `gearHoursLeft = 72`), `giveWorkerBonus`, `tickWorkerAutomation` (tự động ăn cơm trên bàn khi `belly < 35%`, tự vét bùn ao miễn phí `⚡` khi thuê Anh Sáu Kình, khóa trần Giỏ Kho Thợ `120/120`), `claimWorkerPantry` và `simulateOfflineWorkerProgress(hours)`. | • Toàn bộ logic Bếp Quê & Lán Thợ trong `useGameStore.ts` & `App.tsx`. |
| **6. QA / QC Engineer** | • Kiểm thử tự động các kịch bản Bếp Quê & Lán Thợ:<br>  - `TC-04.2a`: Chặn nấu ngẫu nhiên khi `< 3` nguyên liệu; đủ 3 nguyên liệu cộng đúng `+10 💎` & `+1 PROD_22`.<br>  - `TC-05.1a`: Tính đúng chiết khấu lương 3 ngày (`Round(2600 * 3 * 0.88) = 6,864 🪙` cho Chú Tám Mộc).<br>  - `TC-05.2a`: Khi `belly < 35%` và bàn ăn còn cơm, nhân công tự trừ 1 suất cơm và hồi `100% Độ No`.<br>  - `TC-05.4a`: Giỏ Kho Thợ dừng đúng ở trần `120/120`, không làm tràn kho chính.<br>  - `TC-05.5a`: Giả lập Offline 4 giờ (`Lazy-Tick`) cộng đúng sản lượng vào Giỏ Kho Thợ và trừ suất cơm trên bàn. | • Pass 100% nhóm Test Cases `TC-04.*` & `TC-05.*` trong `qcTestRunner.ts`. |

#### 3.2.B. Phân Rã Chi Tiết Các Module WBS Thuộc Giai Đoạn 2 (`EPIC 04` & `EPIC 05`)
* **`M04.1` ➔ `M04.4` – 8 Xưởng Làng Nghề, Nồi Đất Phối Món Ngẫu Nhiên & 27 Công Thức 3 Miền:**
  * *GD & Dev Spec:* Gồm 12 món dân dã (dùng làm Mâm Cơm Thợ), 6 món đặc sản cấp trung và 9 món Đại Tiệc Giao Thoa 3 Miền. Nấu món ăn vừa bán lấy Vàng vừa dùng để hồi Năng lượng `⚡` hoặc dọn lên Bàn Ăn Lán Thợ.
* **`M05.1` ➔ `M05.5` – Tuyển Dụng 6 Gia Nhân, Bàn Ăn Chung, Đồ Bảo Hộ 72h, Giỏ Kho 120 Ô & Lazy-Tick Offline:**
  * *GD & Dev Spec:* Khép kín 4 tầng tiêu tiền chống lạm phát ở Mid/Late-game (`13,900 – 16,700 🪙/ngày` khi thuê đủ 6 thợ). Đảm bảo nhân công chờ **5 phút sau khi cây/cá chín** mới thu gom để chừa cửa sổ vàng 2 phút cho tính năng đi trộm ở Giai đoạn 3.

---

### 🚂 GIAI ĐOẠN 3 (`v1.5 UPDATE 2` — 10 NGÀY): CHỢ PHIÊN & HÀNG XÓM (GIAO THƯƠNG LIÊN VÙNG & ĐI TRỘM VUI NHỘN)

#### 3.3.A. Bảng Phân Giao Nhiệm Vụ Cụ Thể Cho 6 Vị Trí Trong Giai Đoạn 3

| Vị Trí (Role) | Danh Sách Công Việc Phải Làm Trong Giai Đoạn 3 | Đầu Ra Nghiệm Thu (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / Game & Narrative Designer** | • Thiết kế 4 tầng giao thương: **Bảng Đơn Hợp Tác Xã**, **Nhật Báo Chợ Phiên P2P 3 Miền** (khóa khung giá `[0.8x, 2.0x Base_Sell_Gold]`, khấu trừ **10% Thuế Chợ** đốt tiền), **Ga Tàu Thống Nhất Bắc – Nam** (đóng 3 toa hàng nhận Voucher đổi Trâu Đen `-10%` t/g cây ruộng) và **Thương Lái Đột Xuất (`1.5x–3.0x`)**.<br>• Chốt **5 Quy tắc Bảo hiểm Đi Trộm**: (1) Bảo hiểm 80% sản lượng tối thiểu cho chủ nhà; (2) Mỗi khách chỉ trộm 1 lần/vụ; (3) 3 phút Ân huệ đầu; (4) Tốn `1~2 ⚡`; (5) Phạt **Zero-Sum `50 🪙`** chuyển cho chủ nhà + rớt **`1 Chiếc Dép Tổ Ong`** khi bị **Chó Phú Quốc (`70%`) / Ngỗng (`40%`) / Bẫy (`100%`)** bắt.<br>• Thiết kế sự kiện **Cứu Trợ Sau Mưa Bão (`0 ⚡`)** và **Sổ Lưu Bút Cổng Làng**.<br>• Viết kịch bản **Chương 4 (*Bóng Đêm & Chó Phú Quốc*)** & **Chương 5 (*Tiếng Còi Tàu Thống Nhất*)**. | • Đặc tả Giao thương 4 tầng & 5 Quy tắc Đi trộm trong file `01` & `02`. |
| **2. UI / UX Designer** | • Thiết kế Modal **`COOP_QUESTS`**: Tab Đơn Hàng Hợp Tác Xã, Tab 3 Toa Tàu Thống Nhất Bắc – Nam, Tab Biên Niên Sử 10 Chương Gia Phả.<br>• Thiết kế Modal **`MARKET_STEAL`**: Khu vực đăng bán nông sản từ kho (tự động kẹp khung giá `0.8x–2.0x`), Danh sách sạp hàng Báo Chợ 3 Miền có nút **`🏃 Mua & Ghé Nhà`**, Khu vực tương tác sân nhà bạn bè (**Hái Trộm `-1⚡`**, **Dựng Giúp Giàn Cây `0⚡`**, **Bán Ké Thương Lái**, **Ký Sổ Lưu Bút**). | • Giao diện Modal `COOP_QUESTS` & `MARKET_STEAL`. |
| **3. Artist, Animator & Sound** | • Tạo Sprite **Sạp Báo Chợ 3 Miền (`bldg_market`, `175x74 px`)**, **Đầu Máy Tàu Thống Nhất (`bldg_train`, `120x32 px`)** chạy ngang đường ray phía Bắc và **Chó Xoáy Phú Quốc (`char_dog_phuquoc`, `48x48 px`)** chạy tuần tra quanh cổng làng.<br>• Cài đặt âm thanh tiếng còi tàu (`playTrainWhistle`) và tiếng chó sủa bắt trộm (`playDogBark`). | • Sprite Tàu Hỏa, Sạp Chợ, Chó Phú Quốc & SFX trong `FarmScene.ts`. |
| **4. Backend Engineer (BE)** | • Triển khai bảng `public.market_listings`, `public.trader_booms`, `public.steal_logs`, `public.farm_guestbook`.<br>• Viết 4 hàm Atomic RPC (`SECURITY DEFINER`): `rpc_post_market_listing`, `rpc_attempt_steal` (khóa dòng `FOR UPDATE`, kiểm tra 3 phút Ân huệ & ngưỡng bảo hiểm 80%, phạt Zero-Sum), `rpc_sell_to_friend_trader` (giới hạn bán ké `<= 20` đơn vị, hoa hồng `+5%`), `rpc_sign_guestbook`.<br>• Cấu hình kênh Realtime `vac_online_global_hub` đồng bộ tức thì sạp chợ mới và lời chúc lưu bút. | • 4 hàm RPC trong `0001` & `0002` SQL + `realtimeService.ts`. |
| **5. Frontend Engineer (FE)** | • Lập trình `deliverCoopOrder`, `fillTrainCrate`, `postItemToMarket`, `buyMarketAndVisit` (mua hàng xong đưa nhân vật bay thẳng sang sân nhà người bán `visitingFriendName`), `sellToTraderBoom`, `attemptStealFromFriend`, `helpFriendAfterStorm`, `signFriendGuestbook`. | • Các action Giao thương & Đi trộm trong `useGameStore.ts`. |
| **6. QA / QC Engineer** | • Kiểm thử tự động & kiểm thử bảo mật Server RPC:<br>  - `TC-06.1a`: Giao đơn Hợp Tác Xã trừ đúng số lượng kho và khóa nút sau khi giao.<br>  - `TC-06.2a`: Kẹp giá Chợ `[0.8x, 2.0x]` và khấu trừ đúng 10% Thuế Chợ.<br>  - `TC-06.3a`: Đóng toa Tàu Thống Nhất cộng đúng Voucher Tàu Hỏa.<br>  - `TC-07.1a`: Bị Chó Phú Quốc bắt khi đi trộm trừ tối đa `50 🪙` (không âm vàng) và cộng `+1 ITEM_DEP_TO_ONG`.<br>  - `TC-07.2a` & `TC-07.3a`: Dựng giúp giàn cây tốn `0 ⚡`; ký Lưu Bút lọc sạch XSS và cộng `+10 Phong Thủy`. | • Pass 100% nhóm Test Cases `TC-06.*` & `TC-07.*` trong `qcTestRunner.ts`. |

#### 3.3.B. Phân Rã Chi Tiết Các Module WBS Thuộc Giai Đoạn 3 (`EPIC 06` & `EPIC 07`)
* **`M06.1` ➔ `M06.4` – Đơn Hợp Tác Xã, Báo Chợ P2P 3 Miền, Tàu Hỏa Bắc – Nam & Thương Lái Đột Xuất:**
  * *GD & Dev Spec:* Kết nối nhu cầu trao đổi 30% đặc sản độc quyền giữa người chơi Bắc – Trung – Nam. Mọi giao dịch trên Chợ P2P đều đốt 10% thuế để nuôi Quỹ Xin Vía Loa Phường và Độc Đắc Xổ Số.
* **`M07.1` ➔ `M07.4` – Hái Trộm Vườn/Cá, 4 Lớp Phòng Thủ, Cứu Trợ Mưa Bão & Sổ Lưu Bút Cổng Làng:**
  * *GD & Dev Spec:* Tái hiện niềm vui rình trộm kịch tính nhưng bảo vệ tuyệt đối 80% sản lượng của chủ nhà ngay ở tầng PostgreSQL RPC (`FOR UPDATE`).

---

### 🏮 GIAI ĐOẠN 4 (`v1.8 UPDATE 3` — 10 NGÀY): HỘI LÀNG & THỜI TRANG (ĐÌNH LÀNG, ĐỘT BIẾN, TỦ ĐỒ 12 Ô & LIVEOPS)

#### 3.4.A. Bảng Phân Giao Nhiệm Vụ Cụ Thể Cho 6 Vị Trí Trong Giai Đoạn 4

| Vị Trí (Role) | Danh Sách Công Việc Phải Làm Trong Giai Đoạn 4 | Đầu Ra Nghiệm Thu (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / Game & Narrative Designer** | • Thiết kế **Trùng Tu Đình Làng 3 Cấp (`BM_DINH_01..03`: `5K ➔ 15K ➔ 50K 🪙`)**, **Miếu Thần Nông (`BM_TOTEM_01..04`)**, **Hội Đua Thuyền Rồng (`BM_DERBY_01`)**, **Thám Hiểm Rừng Trúc (`NEW_EXP_01`)** và **Chợ Đêm Ẩm Thực (`NEW_NIGHT_01`, giá `x1.8` miễn thuế)**.<br>• Thiết kế **Vườn Ươm Chiết Cành Đột Biến (`CROP_MUT_01..03`)** có **Bảo hiểm Pity 100%** (*Lúa Tím* Pity 3, *Dưa Hấu Vuông* Pity 4, *Bưởi Hồ Lô & Sen Nghìn Cánh* Pity 6; xịt vẫn nhận bù `1 Xô Bùn Phù Sa`).<br>• Thiết kế **Gương Soi 12 Slots Thời Trang (`FASH_01..12`)**, công thức **Khâu Ghép `3➔1`** (`+150 ✨ Phong Cách`), **Transmog Giữ Ngoại Hình**, **Hội Thi Duyên Dáng Tuần**, **Lịch Bloc Điểm Danh**, **Đập Niêu Gacha**, **Xổ Số 18:00** (vé tặng bạn bè `300 🪙` cùng nổ hũ) & **Gói IAP**.<br>• Viết kịch bản **Chương 8 (*Hạt Giống Ngũ Sắc*)** & **Chương 9 (*Đại Tiệc Cảm Hóa Bá Kiến*)**. | • Đặc tả Đình Làng, Đột biến Pity, Thời trang 12 Slots, LiveOps & IAP trong file `01` & `02`. |
| **2. UI / UX Designer** | • Thiết kế Modal **`BENCHMARK`**: Khu vực Miếu Thần Nông, Trùng Tu Đình Làng 3 Cấp, Vườn Ươm Đột Biến (hiển thị thanh tiến trình Bảo hiểm Pity), Đua Thuyền Rồng, Thám Hiểm Rừng Trúc & Chợ Đêm.<br>• Thiết kế Modal **`FASHION` (Gương Soi 12 Slots)**: Hiển thị 12 ô trang bị, số lượng sở hữu, nút **`✨ Ghép 3➔1`**, nút **`🎭 Transmog`** và nút **`📸 Đăng Ký Thi Duyên Dáng Tuần`**.<br>• Thiết kế Modal **`LIVEOPS`**: Lịch Bloc Quê Nội, Đập Niêu Đất, Xổ Số Kiến Thiết 18:00 & Cửa Hàng IAP. | • Giao diện Modal `BENCHMARK`, `FASHION` & `LIVEOPS`. |
| **3. Artist, Animator & Sound** | • Tạo Sprite **Đình Làng Cổ Kính (`bldg_dinh`, `210x74 px`)** và cây đột biến phát sáng **`crop_mutant_purple`**.<br>• Tạo biểu tượng trực quan cho 12 món Thời trang truyền thống (`FASH_01..12`, nổi bật là *Áo Bà Ba Lụa Tân Châu, Áo Dài Ngũ Thân, Dép Tổ Ong Vàng SSR, Hào Quang Đom Đóm*).<br>• Cài đặt âm thanh đập vỡ niêu đất (`playClayPotSmash`). | • Sprite Đình Làng, Cây Đột Biến & SFX `playClayPotSmash`. |
| **4. Backend Engineer (BE)** | • Đồng bộ các trường `dinh_lang_stage`, `mutant_pity_count`, `style_score`, `feng_shui_score` trên bảng `public.profiles`.<br>• Phát sóng sự kiện `loa_phuong` toàn Server khi có người chơi nâng cấp Đình Làng, lai tạo trúng giống Đột Biến hoặc trúng Độc Đắc Xổ Số (kèm 50 suất bấm **`🧧 Xin Vía`**). | • Sự kiện Broadcast `loa_phuong` trong `realtimeService.ts`. |
| **5. Frontend Engineer (FE)** | • Lập trình `contributeDinhLang`, `prayAtShrine`, `breedMutantCrop` (cam kết nổ 100% khi `nextPity >= pityLimit`), `rowDragonBoatDerby`, `exploreBambooForest`, `sellNightMarketCombo`.<br>• Lập trình `fuseDuplicateFashion` (kiểm tra `ownedQty >= 3`), `setTransmogSlot`, `enterFashionContest`, `tearBlocCalendar` (chặn xé lần 2 trong ngày), `smashClayPotGacha`, `buyLotteryTicket`, `claimLoaPhuongLucky`. | • Toàn bộ action Đình Làng, Đột biến, Thời trang & LiveOps trong `useGameStore.ts`. |
| **6. QA / QC Engineer** | • Kiểm thử tự động các kịch bản Đình Làng, Đột Biến, Thời Trang & LiveOps:<br>  - `TC-08.1a`: Công đức Đình Làng trừ đúng vàng, tăng `dinhLangStage` và phát thanh Loa Phường.<br>  - `TC-08.2a`: Vườn Ươm Đột Biến chắc chắn trúng 100% ở lần chạm mốc Pity và reset `mutantPityCount = 0`.<br>  - `TC-08.3a`: Đua Thuyền Rồng trừ `4 ⚡`, tăng `+120m` và cộng đúng thưởng.<br>  - `TC-09.1b`: Khâu ghép 3 món Thời trang trùng (`3➔1`) trừ 2 món và cộng `+150 ✨ Phong Cách`.<br>  - `TC-09.2a`: Chặn xé Lịch Bloc nhận quà lần thứ 2 trong cùng một ngày. | • Pass 100% nhóm Test Cases `TC-08.*` & `TC-09.*` trong `qcTestRunner.ts`. |

#### 3.4.B. Phân Rã Chi Tiết Các Module WBS Thuộc Giai Đoạn 4 (`EPIC 08` & `EPIC 09`)
* **`M08.1` ➔ `M08.4` – Đình Làng 3 Cấp, Miếu Thần Nông, Vườn Ươm Đột Biến (Pity), Rừng Trúc, Đua Thuyền & Chợ Đêm:**
  * *GD & Dev Spec:* Cung cấp mục tiêu phấn đấu trung và dài hạn cho cộng đồng làng xóm, kết hợp cơ chế Pity minh bạch giúp người chơi không bao giờ bị cảm giác "xịt vô vọng" khi lai tạo giống quý.
* **`M09.1` & `M09.2` – Tủ Đồ 12 Slots Thời Trang (`3➔1`, `Transmog`), Lịch Bloc, Đập Niêu Gacha, Xổ Số 18h & Gói IAP:**
  * *GD & Dev Spec:* Tối ưu hóa doanh thu nạp thẻ nhân văn (Thẻ Tháng `79.000đ` miễn phí lương Quản Gia Cửu) và giữ chân người chơi đăng nhập mỗi ngày lúc 18:00 để dò vé số cùng bạn bè.

---

### 💍 GIAI ĐOẠN 5 (`v2.0 COMPLETE EDITION` — 10 NGÀY): LỄ CƯỚI & HOMESTAY (KẾT HÔN, GIA BẢO, XUẤT BẰNG KHEN & PHÁT HÀNH MOBILE APP)

#### 3.5.A. Bảng Phân Giao Nhiệm Vụ Cụ Thể Cho 6 Vị Trí Trong Giai Đoạn 5

| Vị Trí (Role) | Danh Sách Công Việc Phải Làm Trong Giai Đoạn 5 | Đầu Ra Nghiệm Thu (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / Game & Narrative Designer** | • Thiết kế lộ trình **Hẹn Hò 10 Tim ❤️ (`1 ➔ 10 Tim`)**, **Lễ Cưới Làng Quê** và quyền lợi **Gia Bảo Truyền Đời (`NEW_HEIR_01`)**: Sau khi cưới, mỗi ngày nhận miễn phí **Mâm Cơm Sáng Vợ/Chồng Nấu (`+30 ⚡`)** và **Bé Tiểu Đồng phụ thu hoạch (`+10` nông sản vào Giỏ Thợ)**.<br>• Thiết kế **Khu Du Lịch Sinh Thái Homestay 2 Cấp (`BM_HOME_01..02`)**: Đón đoàn khách phố thị về nghỉ dưỡng tại *Nhà Sàn Tre / Biệt Thự Đầm Sen*, thu `+650 ➔ +1,600 🪙`, `+10 💎` và `+20 Điểm Phong Thủy`/lượt.<br>• Viết kịch bản đại kết cục **Chương 10 (*Trầu Cau Nên Duyên & Gia Bảo Truyền Đời*)**. | • Đặc tả Lễ Cưới, Gia Bảo, Homestay & Chương 10 trong file `01` & `02`. |
| **2. UI / UX Designer** | • Thiết kế khu vực **💍 Hẹn Hò 10 Tim & Lễ Cưới Làng Quê** và **🏡 Khu Du Lịch Sinh Thái Homestay**.<br>• Thiết kế bố cục tấm **Bằng Khen Điền Chủ Mẫu Mực Ba Miền (`960x540 px`)** có khung gỗ lim mạ vàng và con dấu đỏ Hợp Tác Xã để người chơi tải file `.PNG` khoe lên Facebook/Zalo.<br>• Thiết kế **Poster Bản Đồ Lộ Trình 5 Giai Đoạn (`1920x1080 px`)** trong `09_FACEBOOK_ROADMAP_POSTER.html`. | • Giao diện Lễ Cưới, Homestay, Bằng Khen `.PNG` & `09_FACEBOOK_ROADMAP_POSTER.html`. |
| **3. Artist, Animator & Sound** | • Lập trình hàm vẽ Canvas độ phân giải cao trong `src/services/certificateExporter.ts` (vẽ nền giấy dó, viền gỗ mạ vàng, huy hiệu Quê hương, 6 ô chỉ số thành tựu và con dấu đỏ `💮 HỢP TÁC XÃ ĐÃ ĐÓNG DẤU`).<br>• Kích hoạt hiệu ứng tiếng chiêng trống mừng đám cưới & nhận bằng khen (`playCelebrationGong`). | • `src/services/certificateExporter.ts`. |
| **4. Backend Engineer (BE)** | • Hoàn thiện cấu hình `vercel.json` và `public/sw.js` đảm bảo caching Offline-First PWA hoạt động ổn định 100%. | • `vercel.json` & `public/sw.js`. |
| **5. Frontend Engineer (FE)** | • Lập trình `giftNpcForMarriage`, `serveHomestayGuests` và tích hợp nút **`🏆 Xuất Ảnh Bằng Khen (.PNG)`**.<br>• Hoàn thiện `capacitor.config.ts` và `src/services/nativePlatform.ts` để đóng gói ứng dụng Native lên **Apple App Store (iOS/iPadOS)** và **Google Play Store (Android)**. | • `capacitor.config.ts`, `nativePlatform.ts`, `certificateExporter.ts`. |
| **6. QA / QC Engineer** | • Chạy nghiệm thu tổng thể toàn bộ **25 Automated Test Cases (`TC-01.0a` ➔ `TC-10.2a` + `TC-02.5a`)** trên cửa sổ **`🧪 QC Test (25 TC)`**:<br>  - `TC-10.1a`: Tặng quà đạt `10/10 Tim` kích hoạt Lễ Cưới (`isMarried = true`), phát Loa Phường và nhận phúc lợi Gia Bảo.<br>  - `TC-10.2a`: Đón đoàn khách Homestay cộng đúng `+650 🪙`, `+10 💎` & `+20 Phong Thủy`.<br>  - `TC-02.5a`: Hoàn thành 10 Chương Gia Phả Ba Miền và kiểm tra thưởng đối thoại phân nhánh (`EMP` vs `PRAG`). | • Báo cáo Sign-off **`25 / 25 PASSED (100%)`** trước khi phát hành chính thức. |

---

## PHẦN 4: BẢNG TỔNG HỢP 25 KỊCH BẢN KIỂM THỬ TỰ ĐỘNG & NGHIỆM THU CUỐI CÙNG (`MASTER 25-TC QA MATRIX`)

Đội ngũ Dev và QC có thể bấm trực tiếp nút **`🧪 QC Test (25 TC)`** ở góc phải dưới màn hình game để thực thi tự động toàn bộ 25 kịch bản kiểm thử dưới đây (hệ thống tự động chụp `Snapshot` trước khi test và khôi phục nguyên trạng 100% sau khi chạy xong):

| Giai Đoạn | Mã Test Case | Tên Kịch Bản Kiểm Thử Tự Động (`qcTestRunner.ts`) | Kỳ Vọng Nghiệm Thu (`Pass Criteria`) |
| :---: | :---: | :--- | :--- |
| **Giai Đoạn 1** | `TC-01.0a` | Splash 4 bước & Chơi Khách 1 chạm (`Guest Mode`) | Tạo phiên `GUEST`, mở vào nông trại dưới 1 giây. |
| **Giai Đoạn 1** | `TC-01.0b` | Đăng ký tài khoản mới & Lộc Tân Thủ (`+500 🪙`) | Chặn mật khẩu `< 6` ký tự; hợp lệ cộng đúng `+500 🪙`. |
| **Giai Đoạn 1** | `TC-01.0c` | Liên kết tài khoản Khách lên Chính thức (`+50 💎`) | Giữ nguyên 100% Vàng đang chơi, cộng thêm `+50 💎` & `+1,000 🪙`. |
| **Giai Đoạn 1** | `TC-01.0d` | Quên mật khẩu & Xác thực OTP 6 số | Chặn mã OTP sai; mã OTP đúng cho phép đặt lại mật khẩu mới. |
| **Giai Đoạn 1** | `TC-01.3a` | Toàn vẹn Đại Từ Điển `155 Thực Thể` (`masterData.ts`) | Đủ `155/155` thực thể, không trùng `id`, không có giá trị `NaN`. |
| **Giai Đoạn 1** | `TC-02.1a` | Buff Nội tại Quê hương Miền Bắc (`-10%` thời gian chín) | Cây ngắn ngày giảm đúng 10% thời gian chờ so với thông số gốc. |
| **Giai Đoạn 1** | `TC-02.1b` | Chống XSS trong tên Điền chủ & Sổ Lưu Bút | Cắt bỏ hoàn toàn ký tự `<` và `>` khỏi chuỗi nhập liệu. |
| **Giai Đoạn 1** | `TC-02.2b` | Chặn âm Năng lượng `⚡` khi Vét Ao / Khai Hoang | Khi `⚡ < 3`, từ chối Vét Ao và giữ nguyên số dư `⚡ >= 0`. |
| **Giai Đoạn 1** | `TC-02.3a` | Thời tiết `🌧️ Mưa Rào` tự động tưới 100% ô đất | Toàn bộ ô đang trồng chuyển sang `watered = true` và giảm 15% t/g. |
| **Giai Đoạn 1** | `TC-02.4a` | Khai hoang Đất Hoang & Khóa trần `25/25` phân khu | Đạt `25/25` phân khu thì chặn mở tiếp và không trừ tài nguyên. |
| **Giai Đoạn 1** | `TC-03.2a` | Tưới nước Giếng Làng (`-15%` t/g) & Chống tưới đúp | Giảm 15% thời gian ở lần chạm 1; chạm lần 2 không giảm trùng. |
| **Giai Đoạn 1** | `TC-03.4a` | Bón Bùn Phù Sa & Thu hoạch Nông Sản Hoàng Kim `⭐` (`x3`) | Ô có cờ `isGolden = true` cộng đúng gấp 3 lần giá bán cơ sở. |
| **Giai Đoạn 2** | `TC-04.2a` | Nồi Đất Phối Món Ngẫu Nhiên (`>= 3` nguyên liệu) | Chặn khi `< 3` món; đủ 3 món thưởng `+10 💎` & `+1 PROD_22`. |
| **Giai Đoạn 2** | `TC-05.1a` | Thuê Nhân công Lán Thợ 3 ngày (Chiết khấu `12%`) | Trừ đúng `Round(Salary * 3 * 0.88)` và cộng `+3` ngày hợp đồng. |
| **Giai Đoạn 2** | `TC-05.2a` | Nhân công tự ăn cơm trên Bàn Chung khi `Độ No < 35%` | Tự động trừ `1 suất cơm` trên bàn và hồi `100% Độ No`. |
| **Giai Đoạn 2** | `TC-05.5a` | Giả lập Offline 4 giờ (`Lazy-Tick Worker Simulation`) | Tự động cộng sản lượng vào Giỏ Kho Thợ (trần `120`) & trừ cơm. |
| **Giai Đoạn 3** | `TC-06.1a` | Giao đơn hàng Hợp Tác Xã & Trừ kho chính xác | Trừ đúng số lượng yêu cầu, cộng Vàng/XP và khóa nút đã giao. |
| **Giai Đoạn 3** | `TC-06.2a` | Kẹp khung giá Chợ `[0.8x, 2.0x]` & Thuế Chợ `10%` | Giá vượt trần tự kẹp về `2.0x`; người bán nhận đúng `90%` sau thuế. |
| **Giai Đoạn 3** | `TC-06.3a` | Đóng thùng Ga Tàu Thống Nhất Bắc – Nam | Trừ nông sản đặc sản, cộng Vàng và `+Voucher Tàu Hỏa`. |
| **Giai Đoạn 3** | `TC-07.2a` | Cứu trợ "Lá Lành Đùm Lá Rách" (`0 ⚡` Năng lượng) | Thực hiện thành công cả khi `⚡ = 0`, cộng `+30 🪙` & `+2 Nghĩa Xóm`. |
| **Giai Đoạn 4** | `TC-08.2a` | Bảo hiểm Pity Vườn Ươm Đột Biến (`100%` trúng ở mốc Pity) | Chạm mốc `pityLimit` chắc chắn nổ giống Đột Biến & reset Pity về `0`. |
| **Giai Đoạn 4** | `TC-09.1b` | Khâu ghép 3 món Thời trang trùng (`3➔1`) | Trừ 2 món trùng, giữ 1 món nâng bậc và cộng `+150 ✨ Phong Cách`. |
| **Giai Đoạn 4** | `TC-09.2a` | Chống xé Lịch Bloc nhận quà 2 lần trong ngày | Lần 1 cộng `+30 ⚡` & `+350 🪙`; lần 2 trong ngày bị chặn an toàn. |
| **Giai Đoạn 5** | `TC-10.1a` | Hẹn hò `10/10 Tim ❤️`, Lễ Cưới & Gia Bảo Truyền Đời | Chuyển `isMarried = true`; bấm tiếp nhận `+30 ⚡` & `+10` nông sản. |
| **Giai Đoạn 5** | `TC-10.2a` | Đón đoàn khách Homestay & Cốt truyện 10 Chương (`TC-02.5a`) | Cộng đúng doanh thu Homestay; hoàn thành 10 chương phân nhánh. |
