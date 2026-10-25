# KẾ HOẠCH PHÁT TRIỂN TỔNG THỂ & CHI TIẾT THEO 6 GIAI ĐOẠN CHO 6 BỘ PHẬN (MASTER DEVELOPMENT PLAN & WBS BY ROLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` *(Đã hợp nhất `08_MASTER_PLAN` cũ + `11_MASTER_WBS`, loại bỏ trùng lặp & chi tiết hóa đầu việc cho 6 Bộ phận qua 6 Giai đoạn)*  
**Phiên bản:** Master Development Plan 5.0 (Production WBS & Role Matrix)  
**Đối tượng sử dụng:** Product Owner (PO) / Game Designer (GD), Frontend Dev (FE), Backend Dev (BE), Artist & Sound, UI/UX Designer, QA/QC Engineer

---

## PHẦN 1: BẢNG ĐỐI CHIẾU SO SÁNH VỚI FILE KẾ HOẠCH CŨ (`OLD v3.0` VS. `NEW v5.0`)

Để khắc phục triệt để sự rời rạc giữa các file cũ (`08`, `09`, `10`, `11`, `12`), bản **Master Plan 5.0** này đã rà soát, gộp gọn từ 13 file xuống **Bộ 8 Tài Liệu Chuẩn Duy Nhất (`00` ➔ `08`)** và bổ sung đầy đủ các mắt xích từng bị thiếu trong bản kế hoạch cũ:

| Tiêu Chí Đối Chiếu | File Kế Hoạch Cũ (`08_MASTER_PLAN v3.0`) | File Kế Hoạch Mới Chuẩn Hóa (`08_MASTER_PLAN v5.0` - Bản Này) |
| :--- | :--- | :--- |
| **1. Cấu trúc Hệ thống Tài liệu** | Bị phân mảnh thành 13 file (`00` ➔ `12`), trùng lặp quy chuẩn Pixel Art giữa file `05` & `09`, trùng quy tắc Code/PWA giữa file `03` & `10`. | **Hợp nhất gọn thành 8 file chuẩn (`00` ➔ `08`)**:<br>• Gộp `01 + 12` $\rightarrow$ File `01` (GDD + Cốt truyện 10 chương)<br>• Gộp `03 + 10` $\rightarrow$ File `03` (Tech + Engineering Rules)<br>• Gộp `05 + 09` $\rightarrow$ File `05` (Art + Animation + Audio)<br>• Gộp `08 + 11` $\rightarrow$ File `08` (Master Plan + WBS 6 Bộ phận). |
| **2. Luồng Khởi động & Định danh (Splash & Auth)** | **Chưa có** màn hình Splash 4 bước loading, chưa có Chơi Khách (`Guest Mode`), Liên kết tài khoản Khách (`+50 💎`) và Quên mật khẩu OTP. | Đưa vào ngay **Giai đoạn 0 (`PHASE 0`)** với đặc tả đầy đủ cho cả 6 bộ phận (`SplashAndAuthGate.tsx` + `authService.ts` + `TC-01.0a..0d`). |
| **3. Chiều sâu Cốt truyện & Nhiệm vụ** | Chỉ ghi chung chung *"Nhiệm vụ Chương 1–2"* ở Phase 1, thiếu cốt truyện xuyên suốt và đối thoại phân nhánh. | Phân bổ rõ **10 Chương Cốt Truyện Chính ("Gia Phả Ba Miền")** có lựa chọn phân nhánh (`EMP` Nghĩa Tình vs `PRAG` Thực Dụng) trải đều từ `Phase 1` đến `DLC 4`. |
| **4. Thống nhất Số lượng Thực thể** | Lệch số liệu giữa các file (`120+` ở GDD cũ, `140+` ở Plan cũ, `155` ở Code/CSV). | Chuẩn hóa đồng nhất **đúng `155 Thực thể`** (`48 Cây`, `19 Vật nuôi/Pet`, `19 Thủy sản`, `8 Máy`, `27 Món ăn`, `4 Đồ bảo hộ`, `12 Thời trang`, `6 Nhân công`, `12 Benchmark/IAP`). |
| **5. Phân giao Nhiệm vụ theo Bộ phận** | Chỉ liệt kê tên tính năng chung chung trên 1 bảng 6 dòng, không tách đầu việc cho PO, FE, BE, Art, UI/UX và QC. | Mỗi Giai đoạn (`Phase 0` ➔ `DLC 4`) đều có **Bảng Phân Giao Chi Tiết Cho Đúng 6 Bộ Phận** kèm **Tiêu chí Nghiệm thu (`Exit Criteria` & Mã Test Case)**. |

---

## PHẦN 2: QUY TRÌNH 4 CỔNG KIỂM SOÁT CHẤT LƯỢNG (`4 QUALITY GATES` CHO MỌI GIAI ĐOẠN)

Mọi tính năng trong từng Giai đoạn (`Phase 0` ➔ `DLC 4`) bắt buộc đi qua **4 Cổng Kiểm Soát**:
1. **Gate 1 (PO / Game & Narrative Designer):** Chốt công thức toán học, giới hạn chống lạm phát, ID thực thể khớp `04_MASTER_DATA.csv` và lời thoại phân nhánh (`EMP` / `PRAG`).
2. **Gate 2 (UI/UX Designer & Artist/Sound):** Bàn giao Wireframe `2-Thumb Landscape`, Sprite Sheet `32x32` / `48x64 px` (viền ấm `#3d2314`, vòng lặp 8–12 frames) và âm thanh WebAudio.
3. **Gate 3 (Backend & Frontend Engineers):** BE viết bảng SQL + RLS + Atomic RPC (`FOR UPDATE`); FE kết nối Zustand Store + Phaser 3 Scene + React Modal (`tsc --noEmit` 0 lỗi).
4. **Gate 4 (QA / QC Engineer):** Chạy bộ **`🧪 QC Test (25 TC)`** ngay trên UI đạt `100% PASS` và kiểm tra hiển thị thực tế trên màn hình ngang Mobile/iPad trước khi đóng giai đoạn.

---

## PHẦN 3: KẾ HOẠCH PHÁT TRIỂN CHI TIẾT TỪNG GIAI ĐOẠN THEO 6 BỘ PHẬN (`PHASE 0` ➔ `DLC 4`)

### 🏁 GIAI ĐOẠN 0 (`PHASE 0 - v0.1`): KHUNG ENGINE, SPLASH 4 BƯỚC, CỔNG ĐĂNG NHẬP/KHÁCH & ĐỒNG BỘ 155 THỰC THỂ
* **Thời lượng mục tiêu:** `3 – 4 Ngày` | **Độ ưu tiên:** `P0 (Blocker)`
* **Mục tiêu cốt lõi:** Dựng khung Vite + Phaser 3 + React 19 + Supabase Cloud, hoàn thiện màn hình **Splash Loading 4 bước**, **Cổng Làng Xác Thực 4 chế độ (Đăng nhập, Đăng ký, Chơi Khách, Quên MK OTP)** và nạp trọn bộ **155 Thực thể** lên Cloud.

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong Phase 0 | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Chốt cấu trúc dữ liệu `155 Thực thể` trong `04_MASTER_DATA.csv`.<br>• Quy định phần thưởng Lộc Đăng ký mới (`+500 🪙`) và thưởng Liên kết tài khoản Khách lên Chính thức (`+50 💎` + `+1,000 🪙`, bảo toàn 100% tài sản đang chơi).<br>• Soạn 4 câu Ca dao & Mẹo nhà nông hiển thị trên màn hình Splash Loading. | • `04_MASTER_DATA.csv` (155 dòng).<br>• Spec phần thưởng Auth & Ca dao Splash. |
| **2. UI / UX** | • Thiết kế **Màn hình 0A (Splash & Thanh tải 4 bước `0% ➔ 100%`)** có nút `⚡ Bỏ qua chờ`.<br>• Thiết kế **Màn hình 0B (Cổng Làng Xác Thực 4 Tabs)**: `🔑 Đăng Nhập`, `📝 Đăng Ký Mới`, `⚡ Chơi Khách / Liên Kết`, `🔓 Quên Mật Khẩu OTP`.<br>• Quy hoạch khung `2-Thumb Landscape Viewport` (`safe-area-inset-*`) và màn hình nhắc xoay ngang điện thoại. | • Wireframe `0A` & `0B` trong file `06` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`.<br>• Quy chuẩn CSS `.touch-btn` (`>= 38–44px`). |
| **3. Artist & Sound** | • Thiết kế bộ Icon App (`icon-192.svg`, `icon-512.svg`), Avatar & Cover (`fb_ava.png`, `fb_cover.png`).<br>• Tạo bộ Texture nền tảng trong `PixelAssetGenerator.ts`: 4 loại ô đất/ao (`168x80 px`), 4 cụm công trình chính (`Nhà chính, Lán thợ, Đình làng, Chợ phiên`).<br>• Lập trình bộ tổng hợp âm thanh `soundEffects.ts` (Nhạc nền Ngũ Cung 5 nốt + tiếng chiêng `playCelebrationGong`). | • `public/icon-192.svg`, `icon-512.svg`.<br>• `src/game/assets/PixelAssetGenerator.ts`.<br>• `src/services/soundEffects.ts`. |
| **4. Backend (BE)** | • Khởi tạo Project Supabase (`znabynzbcimpesrxxxsz.supabase.co`).<br>• Viết migration `0001` (Bảng `profiles`, `inventories`, `farm_entities` bật RLS) và `0002` (Bảng `public.master_catalog` + RPC `rpc_sync_master_catalog(p_items JSONB)`).<br>• Cấu hình Supabase Auth cho phép Email Sign-up / Sign-in & Password Reset. | • `supabase/migrations/0001_init_huong_dong_gio_noi.sql`.<br>• `supabase/migrations/0002_seed_full_master_data.sql`. |
| **5. Frontend (FE)** | • Xây dựng `src/data/masterData.ts` (155 thực thể) & `src/services/supabaseClient.ts`.<br>• Xây dựng `src/services/authService.ts` (kết nối kép Supabase Auth + Local Vault dự phòng Offline PWA).<br>• Xây dựng `src/components/SplashAndAuthGate.tsx`, camera Drag-to-Pan / Zoom trong `FarmScene.ts` và cửa sổ Đại Từ Điển `ENCYCLOPEDIA`. | • `src/services/authService.ts`.<br>• `src/components/SplashAndAuthGate.tsx`.<br>• `src/game/scenes/FarmScene.ts`. |
| **6. QA / QC** | • Kiểm thử tự động & thủ công các kịch bản:<br>  - `TC-01.0a`: Splash 4 bước & Chơi Khách 1 chạm (`accountType = GUEST`).<br>  - `TC-01.0b`: Đăng ký mới chặn mật khẩu `< 6 ký tự`, hợp lệ cộng `+500 🪙`.<br>  - `TC-01.0c`: Liên kết tài khoản Khách giữ nguyên Vàng & cộng `+50 💎` + `+1,000 🪙`.<br>  - `TC-01.0d`: Quên mật khẩu gửi OTP 6 số, chặn OTP sai, đổi mật khẩu khi đúng.<br>  - `TC-01.3a`: Đủ `155/155` thực thể không trùng ID, không có giá `NaN`. | • Pass 100% nhóm Test Cases `TC-01.0a..0d` & `TC-01.3a` trong `qcTestRunner.ts`. |

---

### 🌱 GIAI ĐOẠN 1 (`PHASE 1: CORE MVP - v1.0`): VÒNG LẶP VAC TỰ TAY, 3 MIỀN, BẾP CỦI NGẪU NHIÊN & CHƯƠNG 1–3
* **Thời lượng mục tiêu:** `10 – 14 Ngày` | **Độ ưu tiên:** `P0 (Core Launch)`
* **Mục tiêu cốt lõi:** Chơi mượt toàn bộ vòng lặp tự canh tác **Vườn – Ao – Chuồng**, chọn Quê hương 3 miền có Buff nội tại thực tế, Thời tiết động (`Nắng / Mưa Rào / Đêm Đom Đóm`), Vét bùn ao lấy Phù Sa kích nổ Hoàng Kim `⭐` (`x3`), Bếp củi phối món ngẫu nhiên, Đơn Hợp Tác Xã, Quà 7 Ngày Tân Thủ và **Chương 1–3 Cốt truyện chính**.
* **Phân bổ Thực thể mở khóa (42 Thực thể đầu tiên):** 12 Cây cơ bản (`CROP_01..12`), 2 Cây lâu năm (`Đu đủ, Dừa xiêm`), 4 Vật nuôi (`Gà Ri, Chim Cút, Vịt cỏ, Heo Móng Cái`), 4 Thủy sản (`Cá rô, Tép đồng, Cua ốc, Cá chép`), 3 Nhà máy đầu (`Cối xay MAC_01, Bếp củi MAC_02, Lò đậu MAC_03`), 12 Món ăn dân dã (`PROD_01..12`), 4 Quẻ Miếu Thần Nông (`BM_TOTEM_01..04`).

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong Phase 1 (MVP) | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Thiết kế thông số cân bằng cho 42 thực thể đầu tiên và công thức **Buff Nội tại 3 Miền**: Bắc (`-10%` thời gian chín `CROP`), Trung (`-10%` thời gian máy), Nam (`+1` sản lượng phụ `AQUA`).<br>• Viết kịch bản & lời thoại phân nhánh (`EMP` vs `PRAG`) cho **Chương 1 (*Chiếc Tráp Gỗ Lim*)**, **Chương 2 (*Mùi Khói Bếp Của Mẹ*)** và **Chương 3 (*Đêm Mưa Giông Đầu Mùa*)**.<br>• Thiết kế bảng Quà 7 Ngày Tân Thủ (Ngày 7 tặng Chó Phú Quốc SSR). | • Kịch bản Chương 1–3 trong file `01`.<br>• Công thức kinh tế Chương 1–2 trong file `02`. |
| **2. UI / UX** | • Thiết kế Modal **`REGISTER` (Giấy Đăng Ký Về Quê Lập Nghiệp)**: Chọn Nam/Nữ, đặt tên Điền chủ, chọn 3 thẻ Quê hương Bắc – Trung – Nam.<br>• Thiết kế **Khay Chọn Giống Thu Gọn (`Collapsible Seed Drawer`)** bên ngón cái trái.<br>• Thiết kế Modal **`COOKING` (8 Xưởng & Nồi Đất Phối Món Ngẫu Nhiên)** và Modal **`COOP_QUESTS` (Đơn HTX + Gia Phả 10 Chương + 7 Ngày Tân Thủ)**. | • Giao diện Modal `REGISTER`, `COOKING`, `COOP_QUESTS` và `Seed Drawer`. |
| **3. Artist & Sound** | • Tạo Sprite cho 4 nhóm cây trồng (`crop_rice_gold`, `crop_lotus`, `crop_fruit_tree`, `crop_mutant_purple`) có hiệu ứng đung đưa theo gió (`Wind Sway`).<br>• Tạo hiệu ứng hạt `fx_water_drop` (tưới nước), `fx_gold_star` (nổ Hoàng Kim ⭐), `fx_raindrop` (Mưa rào) và `fx_firefly` (Đêm đom đóm).<br>• Cài đặt âm thanh `playWaterSplash()` và `playHarvestCoin()`. | • Bộ Sprite cây trồng & 4 Particle VFX trong `FarmScene.ts`. |
| **4. Backend (BE)** | • Thiết lập ràng buộc `CHECK (region IN ('NORTH','CENTRAL','SOUTH'))` trên bảng `public.profiles`.<br>• Đảm bảo lưu trữ chính xác `planted_at`, `mature_at`, `watered`, `mud_applied`, `is_golden` trên `public.farm_entities`. | • Schema `profiles` & `farm_entities` hoạt động ổn định. |
| **5. Frontend (FE)** | • Lập trình hàm `setProfile` (có lọc chống XSS `/[<>]/g`), `interactTile` (Gieo hạt áp dụng Buff miền Bắc `x0.9`, Tưới nước `-15%` thời gian tốn `0 ⚡`, Bón Bùn Phù Sa nổ `45%` Hoàng Kim `⭐ x3`, Thu hoạch cộng độ bùn ao).<br>• Lập trình `dredgePondMud` (`-3 ⚡` nhận `+3 Bùn Phù Sa`), `expandWildLand` (`-5 ⚡`, trần `25/25`), `cycleWeather` (`RAINY` tự tưới 100% ô đất), `cookRandomDish` (`>= 3` nguyên liệu thưởng `+10 💎`), `deliverCoopOrder` và `claimStoryQuest(id, 'EMP'|'PRAG')`. | • Các action cốt lõi trong `src/store/useGameStore.ts` & `src/App.tsx`. |
| **6. QA / QC** | • Kiểm thử các Test Cases tự động:<br>  - `TC-02.1b`: Lọc sạch thẻ `<script>` trong tên Điền chủ.<br>  - `TC-02.1a`: Miền Bắc giảm đúng 10% thời gian chín cây `CROP`.<br>  - `TC-02.2b`: Chặn âm Năng lượng khi `⚡ < 3` bấm Vét Ao.<br>  - `TC-02.3a`: Chuyển sang `RAINY` tự động tưới 100% ô đất.<br>  - `TC-02.4a`: Chặn vượt trần `25/25` phân khu Đất Hoang.<br>  - `TC-03.2a` & `TC-03.4a`: Tưới nước giảm 15% t/g; Nông sản Hoàng Kim `⭐` bán gấp 3 giá gốc.<br>  - `TC-04.2a`: Bếp Củi chặn khi `< 3` nguyên liệu, cộng `+10 💎` khi đủ 3. | • Pass 100% 8 Test Cases của Phase 1 trong `qcTestRunner.ts`. |

---

### 🚂 GIAI ĐOẠN 2 (`DLC 1 - v1.2`): HỌP CHỢ BA MIỀN, GA TÀU THỐNG NHẤT, LÁN THỢ KHỞI ĐẦU & CHƯƠNG 5–6
* **Thời lượng mục tiêu:** `8 – 10 Ngày` | **Độ ưu tiên:** `P1 (High)`
* **Mục tiêu cốt lõi:** Mở nền kinh tế liên vùng P2P (**Nhật Báo Chợ Phiên 3 Miền**, **Ga Tàu Thống Nhất Bắc – Nam**, **Xe Thương Lái Đột Xuất `x2.5`**), khai trương **Lán Thợ Đồng Quê** với 3 Nhân công đầu tiên (**Chú Tư Cày `WORK_01`**, **Cô Năm Thảo `WORK_02`**, **Anh Sáu Kình `WORK_03`**), mở **Thám Hiểm Rừng Trúc (`-6 ⚡`)** và **Chương 5–6 Cốt truyện chính**.
* **Phân bổ Thực thể mở khóa (+45 Thực thể):** 15 Cây đặc sản 3 miền (`CROP_N01..S05`), 10 Cây nâng cao (*Sen, Dưa hấu, Nấm rơm, Xoài, Mít, Tre trúc*), Nuôi Tằm ăn lá dâu (`ANI_06`), Bò sữa, 6 Vật nuôi đặc sản 3 miền, Cá trắm đen, Cá tra, 3 Nhà máy mới (*Quán Nước `MAC_04`, Quầy Bún Phở `MAC_05`, Lò Gốm & Đan Lát `MAC_07`*), 6 Món ăn cấp trung (`PROD_13..18`), 3 Đồ bảo hộ đầu (`CRAFT_01..03`).

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong DLC 1 (`v1.2`) | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Thiết kế khung giá chống lạm phát Chợ P2P (`[0.8x, 2.0x Base_Sell_Gold]`) + **Thuế Chợ đốt tiền `10%`**.<br>• Thiết kế công thức vận hành Lán Thợ: Lương 3 ngày chiết khấu `12%` (`Round(Salary * 3 * 0.88)`), Bàn Ăn Chung Lán Thợ (`Độ No < 35%` tự về ăn), Giỏ Kho Thợ `120 ô` và độ trễ thu hoạch `5 phút` sau khi chín.<br>• Viết kịch bản **Chương 5 (*Tiếng Còi Tàu Thống Nhất*)** & **Chương 6 (*Giọt Mồ Hôi Chú Tư Cày*)**. | • Đặc tả toán học Chợ P2P & Lán Thợ trong file `02`.<br>• Kịch bản Chương 5–6 trong file `01`. |
| **2. UI / UX** | • Thiết kế Modal **`WORKERS` (Lán Thợ Đồng Quê)**: Bảng điều khiển `Auto-Tick`, thanh trạng thái **Bàn Ăn Chung Lán Thợ**, nút **`🌙 Giả Lập Offline 4h (Lazy-Tick)`**, danh sách nhân công kèm thanh tiến trình Độ No & Tinh thần.<br>• Thiết kế phần **Đăng Bán Nông Sản Từ Kho** và **Danh Sách Sạp Hàng Báo Chợ 3 Miền** trong Modal `MARKET_STEAL`. | • Giao diện Modal `WORKERS` & khu vực Chợ Phiên trong `MARKET_STEAL`. |
| **3. Artist & Sound** | • Tạo Sprite cho **Đầu máy Tàu Thống Nhất (`bldg_train`)** chạy dọc đường ray phía Bắc bản đồ.<br>• Tạo Sprite cho 3 nhân công đầu (`char_worker_garden`, `char_worker_breed`, `char_worker_fish`) có hành vi tự đổi màu nhãn sang đỏ và đi bộ về Lán Thợ khi `belly < 35%`.<br>• Cài đặt âm thanh còi tàu `playTrainWhistle()`. | • Sprite đoàn tàu & 3 nhân công đi tuần trong `FarmScene.ts`. |
| **4. Backend (BE)** | • Triển khai bảng `public.market_listings`, `public.hired_workers`, `public.trader_booms`.<br>• Viết hàm RPC `public.rpc_post_market_listing` (kẹp khung giá `0.8x–2.0x` trên Server) và `public.rpc_sell_to_friend_trader` (giới hạn bán ké tối đa `20 đơn vị/khách`, trích `+5%` hoa hồng cho chủ nhà). | • Các hàm RPC giao thương trong `0001` & `0002` SQL. |
| **5. Frontend (FE)** | • Lập trình `tickWorkerAutomation` (chạy tự động mỗi 10 giây khi bật `Auto-Tick`), `simulateOfflineWorkerProgress(hours)` (**Lazy-Tick Offline**), `payWorkerSalary`, `feedWorker`, `equipWorkerGear`, `giveWorkerBonus`, `claimWorkerPantry`.<br>• Lập trình `postItemToMarket`, `buyMarketAndVisit`, `fillTrainCrate` và `sellToTraderBoom`. | • Hệ thống Worker State Machine & Market trong `useGameStore.ts`. |
| **6. QA / QC** | • Kiểm thử các Test Cases tự động:<br>  - `TC-05.1a`: Gia hạn lương 3 ngày chiết khấu chuẩn 12%.<br>  - `TC-05.2a`: Nhân công `Độ No < 35%` tự ăn 1 suất cơm trên bàn & hồi lên `100%`.<br>  - `TC-05.5a`: Lazy-Tick Offline 4 giờ tự động tăng Giỏ Kho Thợ & trừ suất cơm.<br>  - `TC-06.2a`: Kẹp khung giá Chợ `[0.8x, 2.0x]` và khấu trừ đúng 10% Thuế Chợ.<br>  - `TC-06.3a`: Đóng toa Tàu Thống Nhất cộng đúng Voucher Tàu Hỏa. | • Pass 100% nhóm Test Cases `TC-05.*` & `TC-06.*` trong `qcTestRunner.ts`. |

---

### 🥷 GIAI ĐOẠN 3 (`DLC 2 - v1.5`): ĐẠO CHÍCH LÀNG QUÊ, 4 LỚP PHÒNG THỦ, ĐÌNH LÀNG, ĐUA THUYỀN & CHƯƠNG 4
* **Thời lượng mục tiêu:** `8 – 10 Ngày` | **Độ ưu tiên:** `P1 (High Social)`
* **Mục tiêu cốt lõi:** Bùng nổ tương tác xã hội thời gian thực: **Thăm Nhà Bạn Bè**, **Hái Trộm Vườn / Câu Trộm Cá** trong cửa sổ vàng 2 phút, **4 Lớp Phòng Thủ (*Chó Phú Quốc 70%, Ngỗng 40%, Bù nhìn, Bẫy vỏ chuối*)** kèm phạt **Zero-Sum (`50 🪙` + Rớt `Dép Tổ Ong`)**, **Cứu Trợ Sau Mưa Bão (`0 ⚡`)**, **Sổ Lưu Bút Cổng Làng**, **Trùng Tu Đình Làng 3 Cấp**, **Đua Thuyền Rồng HTX** và **Loa Phường Realtime Toàn Server**.

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong DLC 2 (`v1.5`) | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Chốt **5 Quy tắc Bảo hiểm Đi trộm**: (1) Bảo hiểm 80% sản lượng tối thiểu cho chủ nhà; (2) Mỗi khách chỉ trộm 1 lần/vụ; (3) 3 phút Ân huệ đầu; (4) Tốn `1~2 ⚡`; (5) Phạt Zero-Sum `50 🪙` chuyển cho chủ nhà + tặng `1 Chiếc Dép Tổ Ong`.<br>• Thiết kế 3 cấp Công đức Đình Làng (`5,000 🪙`, `15,000 🪙`, `50,000 🪙` mở Buff vĩnh viễn `+5%` sản lượng). | • Quy tắc Hái trộm & Đình Làng trong file `01` & `02`. |
| **2. UI / UX** | • Thiết kế khu vực **Đang Ghé Thăm Nhà Hàng Xóm** (`visitingFriendName`) kèm nút **`🤏 Rón Rén Hái Trộm (-1⚡)`**, **`🤝 Dựng Giúp Giàn Cây Sau Bão (0⚡)`** và **`📸 Check-in & Ký Sổ Lưu Bút Cổng Làng`**.<br>• Thiết kế thanh **Loa Phường Toàn Server** trên Top HUD kèm nút **`🧧 Xin Vía (50 suất)`**. | • Giao diện Thăm nhà, Lưu bút & Loa Phường trong `App.tsx`. |
| **3. Artist & Sound** | • Tạo Sprite **Chó Xoáy Phú Quốc (`char_dog_phuquoc`)** chạy tuần tra quanh cổng làng và Sạp Chợ.<br>• Cài đặt âm thanh tiếng chó sủa `playDogBark()` khi bắt trộm. | • Sprite Chó Phú Quốc & SFX `playDogBark()`. |
| **4. Backend (BE)** | • Hoàn thiện hàm Atomic RPC `public.rpc_attempt_steal` (chú ý escape `80%%` trong chuỗi `RAISE EXCEPTION` của PL/pgSQL) và `public.rpc_sign_guestbook`.<br>• Cấu hình kênh Supabase Realtime `vac_online_global_hub` phát sóng 4 sự kiện (`chat_message`, `loa_phuong`, `market_listing`, `guestbook_entry`) + Presence đếm số người online. | • `src/services/realtimeService.ts` & RPC `rpc_attempt_steal`. |
| **5. Frontend (FE)** | • Lập trình `attemptStealFromFriend` (xử lý cả trường hợp trộm thành công lẫn bị Chó Phú Quốc cắn trừ `Math.min(gold, 50)` và cộng `+1 ITEM_DEP_TO_ONG`), `helpFriendAfterStorm` (`0 ⚡`), `signFriendGuestbook`, `contributeDinhLang` (phát Loa Phường), `rowDragonBoatDerby` và `claimLoaPhuongLucky`. | • Các hàm tương tác xã hội & Realtime trong `useGameStore.ts`. |
| **6. QA / QC** | • Kiểm thử các Test Cases tự động & đa tab:<br>  - `TC-07.2a`: Dựng giúp giàn cây sau bão thực hiện thành công ngay cả khi `⚡ = 0`, cộng `+30 🪙` & `+2 Điểm Nghĩa Xóm`.<br>  - Kiểm tra mở 2 tab trình duyệt: chat, ký lưu bút và nâng cấp Đình Làng đồng bộ tức thì qua `vac_online_global_hub`. | • Pass `TC-07.2a` & kiểm thử Realtime Multi-Tab. |

---

### 👘 GIAI ĐOẠN 4 (`DLC 3 - v1.8`): THỜI TRANG 12 SLOTS, GHÉP 3➔1, TRANSMOG, 3 THỢ VIP, ĐỘT BIẾN PITY, VÉ SỐ 18H & CHƯƠNG 7–8
* **Thời lượng mục tiêu:** `10 – 12 Ngày` | **Độ ưu tiên:** `P2 (Monetization & Mid-Core Depth)`
* **Mục tiêu cốt lõi:** Hoàn thiện 3 Nhân công VIP (**Dì Bảy Bếp `WORK_04`**, **Chú Tám Mộc `WORK_05`**, **Ông Quản Gia Cửu `WORK_06`**), mở **Khung Cửi Dệt Lụa (`MAC_08`)**, **Gương Soi 12 Slots Thời Trang** (kèm **Khâu Ghép `3➔1`**, **Transmog Giữ Ngoại Hình**, **Hội Thi Duyên Dáng Làng Quê**), **Vườn Ươm Chiết Cành Đột Biến (Bảo hiểm Pity 100%)**, **Chợ Đêm Cuối Tuần (`x1.8` miễn thuế)**, **Lịch Bloc Điểm Danh**, **Đập Niêu Gacha**, **Xổ Số Kiến Thiết 18:00**, **Cửa Hàng 4 Gói IAP** và **Chương 7–8 Cốt truyện chính**.

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong DLC 3 (`v1.8`) | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Thiết kế cơ chế **Bảo hiểm Pity Vườn Ươm Đột Biến**: *Lúa Tím* (`Pity = 3`), *Dưa Hấu Vuông* (`Pity = 4`), *Bưởi Hồ Lô & Sen Nghìn Cánh SSR* (`Pity = 6`); nếu chưa nổ vẫn nhận bù `1 Xô Bùn Phù Sa`.<br>• Thiết kế công thức **Khâu Ghép 3 Đồ Trùng (`3➔1`)** tăng `+150 ✨ Phong Cách` và giải thưởng **Hội Thi Duyên Dáng Tuần**.<br>• Thiết kế 4 Gói IAP (`IAP_01..04`, trong đó Thẻ Tháng `79.000đ` miễn phí 100% lương Quản Gia Cửu). | • Đặc tả Đột biến Pity, Thời trang 12 Slots & IAP trong file `01` & `02`. |
| **2. UI / UX** | • Thiết kế Modal **`FASHION` (Gương Soi 12 Slots)**: Hiển thị số lượng sở hữu từng món, nút **`✨ Ghép 3➔1`**, nút **`🎭 Transmog`**, nút **`📸 Đăng Ký Thi Duyên Dáng Tuần`**.<br>• Thiết kế Modal **`LIVEOPS` (Lịch Bloc, Đập Niêu Đất, Xổ Số 18:00 & Cửa Hàng IAP)**. | • Giao diện Modal `FASHION`, `LIVEOPS` & `BENCHMARK`. |
| **3. Artist & Sound** | • Bổ sung Sprite cho 3 nhân công VIP (`char_worker_chef`, `char_worker_wood`, `char_worker_butler`) trên bản đồ.<br>• Cài đặt âm thanh đập niêu `playClayPotSmash()`. | • Bộ đủ 6 Nhân công trên bản đồ `FarmScene.ts`. |
| **4. Backend (BE)** | • Đồng bộ chỉ số `style_score`, `mutant_pity_count` và `dinh_lang_stage` trên bảng `public.profiles`. | • Cập nhật trường dữ liệu trong `public.profiles`. |
| **5. Frontend (FE)** | • Lập trình `breedMutantCrop` (cam kết nổ 100% khi `nextPity >= pityLimit`), `fuseDuplicateFashion` (kiểm tra `ownedQty >= 3`, trừ 2 món giữ 1 món nâng bậc, cộng `+150 ✨`), `setTransmogSlot`, `enterFashionContest`, `tearBlocCalendar` (chặn xé lần 2 trong ngày), `smashClayPotGacha`, `buyLotteryTicket` (mua riêng `500 🪙` hoặc mua tặng bạn bè `300 🪙` cùng nổ hũ). | • Các hàm Thời trang, Đột biến & LiveOps trong `useGameStore.ts`. |
| **6. QA / QC** | • Kiểm thử các Test Cases tự động:<br>  - `TC-08.2a`: Vườn Ươm Đột Biến nổ 100% khi chạm mốc Bảo hiểm Pity & reset bộ đếm về `0`.<br>  - `TC-09.1b`: Khâu ghép 3 món Thời trang trùng (`3➔1`) tăng đúng `+150 ✨ Phong Cách`.<br>  - `TC-09.2a`: Chặn xé Lịch Bloc nhận quà lần thứ 2 trong cùng 1 ngày. | • Pass 100% `TC-08.2a`, `TC-09.1b` & `TC-09.2a` trong `qcTestRunner.ts`. |

---

### 💍 GIAI ĐOẠN 5 (`DLC 4 - v2.0 COMPLETE EDITION`): HẸN HÒ 10 TIM, LỄ CƯỚI QUÊ, HOMESTAY ĐẦM SEN, XUẤT BẰNG KHEN `.PNG`, CHƯƠNG 9–10 & ĐÓNG GÓI APP STORE / GOOGLE PLAY
* **Thời lượng mục tiêu:** `10 – 14 Ngày` | **Độ ưu tiên:** `P2 (End-Game Meta & Native App Release)`
* **Mục tiêu cốt lõi:** Hoàn chỉnh End-game Meta với **Hẹn Hò 10 Tim ❤️**, **Lễ Cưới Làng Quê & Bé Tiểu Đồng Gia Bảo** (`+30 ⚡` cơm sáng vợ/chồng nấu + `+10` nông sản vào Giỏ Thợ mỗi ngày), **Khu Du Lịch Sinh Thái Homestay 2 Cấp**, **Xuất Ảnh Bằng Khen Điền Chủ Mẫu Mực (`.PNG` `960x540`)** để chia sẻ Zalo/Facebook, **Chương 9–10 Cốt truyện chính** (Cảm hóa Thương Nhân Bá Kiến xóa nợ `50,000 🪙`) và đóng gói lên **iOS App Store / Google Play** qua CapacitorJS.

| Bộ Phận | Nhiệm Vụ Cụ Thể Cần Triển Khai Trong DLC 4 (`v2.0`) | Đầu Ra Bàn Giao (Deliverables) |
| :--- | :--- | :--- |
| **1. PO / GD** | • Thiết kế lộ trình `1 ➔ 10 Tim ❤️` dẫn tới Lễ Cưới Làng Quê và quyền lợi Gia Bảo vĩnh viễn sau khi cưới.<br>• Thiết kế doanh thu đón đoàn khách **Homestay Đầm Sen** (`+650 🪙` ở Cấp 1, `+1,600 🪙` ở Cấp 2 + `+10 💎` + `+20 Phong Thủy`).<br>• Viết kịch bản cao trào **Chương 9 (*Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến*)** và **Chương 10 (*Trầu Cau Nên Duyên & Gia Bảo Truyền Đời*)**. | • Đặc tả End-game & Kịch bản Chương 9–10 trong file `01`. |
| **2. UI / UX** | • Thiết kế khu vực **💍 Hẹn Hò 10 Tim & Lễ Cưới Quê** và **🏡 Khu Du Lịch Sinh Thái Homestay** trong Modal `BENCHMARK`.<br>• Thiết kế bố cục tấm **Bằng Khen Điền Chủ Mẫu Mực Ba Miền (`960x540 px`)** có con dấu đỏ Hợp Tác Xã để xuất file `.PNG`. | • Giao diện Lễ Cưới, Homestay & mẫu Bằng Khen `.PNG`. |
| **3. Artist & Sound** | • Vẽ khung viền gỗ lim mạ vàng và con dấu đỏ `💮 HỢP TÁC XÃ ĐÃ ĐÓNG DẤU` trên Canvas trong `src/services/certificateExporter.ts`.<br>• Phát tiếng chiêng mừng đám cưới & xuất bằng khen `playCelebrationGong()`. | • `src/services/certificateExporter.ts`. |
| **4. Backend (BE)** | • Cấu hình `vercel.json` và `public/sw.js` đảm bảo caching Offline PWA hoàn chỉnh. | • `vercel.json` & `public/sw.js`. |
| **5. Frontend (FE)** | • Lập trình `giftNpcForMarriage`, `serveHomestayGuests` và tích hợp nút **`🏆 Xuất Ảnh Bằng Khen (.PNG)`**.<br>• Cấu hình `capacitor.config.ts` và `src/services/nativePlatform.ts` sẵn sàng chạy `npx cap sync` xuất bản iOS / Android. | • `capacitor.config.ts`, `nativePlatform.ts`, `certificateExporter.ts`. |
| **6. QA / QC** | • Chạy nghiệm thu tổng thể bộ **25 Automated Test Cases (`TC-01.0a` ➔ `TC-10.2a` + `TC-02.5a`)** trên cửa sổ **`🧪 QC Test (25 TC)`**:<br>  - `TC-10.1a`: Đạt `10/10 Tim` chuyển `isMarried = true` & phát Loa Phường.<br>  - `TC-10.2a`: Đón đoàn khách Homestay cộng đúng `+650 🪙`, `+10 💎` & `+20 Phong Thủy`.<br>  - `TC-02.5a`: Hoàn thành 10 Chương Gia Phả & kiểm tra lựa chọn đối thoại phân nhánh. | • Báo cáo Sign-off **`25 / 25 PASSED (100%)`** trên `QC_REPORT` Modal. |
