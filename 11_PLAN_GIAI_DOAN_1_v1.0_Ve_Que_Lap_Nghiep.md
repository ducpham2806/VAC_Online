# KẾ HOẠCH TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 1 (`v1.0 CORE MVP` — 14 NGÀY): VỀ QUÊ LẬP NGHIỆP, SINH THÁI ĐỢT 1 (`23/81 LOÀI V-A-C`) & GÓI SẢN XUẤT ASSET / ANIMATION / VFX ĐỢT 1
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `11_PLAN_GIAI_DOAN_1_v1.0_Ve_Que_Lap_Nghiep.md`  
**Phiên bản:** Stage 1 Execution Runbook v1.1 (Bổ sung **Mục 2.5: Kế Hoạch Sản Xuất Chi Tiết Asset, Animation `8–12 Frames`, Tilemap & Particle VFX Giai Đoạn 1**, tuân thủ `RULE D0` & `RULE D1`)  
**Thời lượng Sprint:** 14 Ngày làm việc (Sprint 1–2)  
**Phạm vi Modules:** **14 Modules (`M01.0` ➔ `M03.5`)** thuộc `EPIC 01`, `EPIC 02` & `EPIC 03`  
**Đợt mở khóa nông – thủy – hải sản:** **📦 Đợt 1 (`23 / 81 loài V-A-C`) + 3 Xưởng sơ cấp + 5 Món dân dã + Chương 1–2 Gia Phả**  
**Tài liệu Master tham chiếu:** `00_MASTER_BIBLE`, `01_MASTER_GDD`, `02_MASTER_ECONOMY`, `03_MASTER_TECH`, `04_MASTER_DATA.csv`, `05_MASTER_ART`, `06_MASTER_UI_UX`, `10_MASTER_AI_PLAYBOOK`

---

## 🛡️ 1. BẢNG ĐÁNH GIÁ TÁC ĐỘNG CHÉO SỚM (`RULE D1 IMPACT REPORT — GIAI ĐOẠN 1`)

Trước khi triển khai bất kỳ Module hay tạo Asset nào trong Giai đoạn 1, toàn bộ đội ngũ và AI Agent bắt buộc kiểm tra 5 trụ cột `RULE D1`:

| Hạng Mục Kiểm Toán (`RULE D1`) | Trạng Thái | Quy Định Khóa Chặt Trong Giai Đoạn 1 (`v1.0 Core MVP`) |
| :--- | :---: | :--- |
| **1. Core Gameplay VAC & Năng Lượng Hybrid** | **🟢 Chuẩn Gốc** | Mọi thao tác trồng trọt, tưới nước, thu hoạch tại nhà tốn **`0 ⚡ Năng lượng`**. Chỉ trừ `⚡` khi Vét Bùn Ao (`-3⚡`) và Khai Hoang (`-5⚡`). Khóa chặt lộ trình mở khóa **Đợt 1 (`23/81 loài`)**, hiển thị nhãn khóa `[🔒 Mở tại Giai đoạn 2..5]` cho 58 loài còn lại. |
| **2. Cân Bằng Kinh Tế (`Sources vs. Sinks`)** | **🟢 `95% – 102%`** | Thu nhập ngày `2,500 – 7,000 🪙`; chi tiêu mua giống Đợt 1, xây 3 Xưởng sơ cấp (`150 🪙`, `350 🪙`, `850 🪙`) và Khai hoang (`500 🪙/khu`). Chống số dư âm tuyệt đối (`RULE C4`). |
| **3. Nhất Quán Art Style, Animation & UI/UX** | **🟢 Chuẩn Gốc** | Góc chiếu `3/4 Top-Down Oblique`, lưới `32x32 px` (`168x80 px` ô tương tác), bảng 64 màu 3 miền, **viền ấm `#3D2314` (cấm `#000000`)**, diễn hoạt `8–12 frames` (`planted feet`), giao diện Gỗ/Tre `2-Thumb Landscape` và âm thanh **Cozy Acoustic WebAudio v2.0**. |
| **4. Kiến Trúc Code & Cô Lập Module** | **🟢 Khởi Tạo Chuẩn** | TypeScript Strict Mode (`0 any`), tách biệt `PhaserGame.tsx` / `FarmScene.ts` với `useGameStore.ts` và `App.tsx` qua `EventBus.ts`. Phân biệt chạm vs kéo bản đồ (`dist > 12px`). |
| **5. Cơ Sở Dữ Liệu (`Additive-Only DB`)** | **🟢 Khởi Tạo An Toàn** | Khởi tạo `0001_init_huong_dong_gio_noi.sql` và `0002_seed_full_master_data.sql` (`CREATE TABLE IF NOT EXISTS`, `ON CONFLICT (id) DO UPDATE`), nạp đủ 155 thực thể gốc kèm cột `unlock_stage` (`1..5`) và `unlock_story_chapter` (`1..10`). |

---

## 📦 2. DANH MỤC THỰC THỂ & CỐT TRUYỆN MỞ KHÓA TRONG GIAI ĐOẠN 1 (`WAVE 1 CONTENT`)

1. **🌱 Vườn (`16 loài`):**
   * 12 Cây ruộng ngắn ngày (`CROP_01..12` - Lv.1–7): *Lúa nước, Rau muống, Ngô nếp, Hành & Mùi, Cải ngọt, Khoai lang mật, Đậu tương, Dưa chuột, Mía tím, Lạc, Sả – Ớt – Gừng, Đậu xanh*.
   * 1 Cây ăn quả sơ khởi (`CROP_23` - Lv.5): *Đu Đủ Ruột Đỏ*.
   * 3 Cây Đặc Sản 3 Miền Bậc 1 (`CROP_N01`, `CROP_C01`, `CROP_S01` - Lv.3): *Cải Cúc & Su Hào (Bắc), Hành Tăm & Tỏi Lý Sơn (Trung), Bông Điên Điển & Rau Nhút (Nam)*.
2. **🐄 Chuồng & Thú Cưng (`4 loài nuôi` + `2 Pet`):** *Gà Ri (`ANI_01`), Chim Cút (`ANI_02`), Vịt Cỏ (`ANI_03`), Thỏ Trắng & Bồ Câu (`ANI_04`)* + *Chó Phú Quốc (`PET_01`), Mèo Tam Thể (`PET_02`)*.
3. **🐟 Ao (`3 loài`):** *Cá Rô Đồng (`AQUA_01`), Tép Đồng (`AQUA_02`), Cua Đồng & Ốc Bươu (`AQUA_03`)*.
4. **🏭 Xưởng Sơ Cấp (`3/8 Xưởng`) & Món Ăn (`5/27 Món`):** *Cối Xay Cám (`MAC_01`), Bếp Củi Quê Mẹ (`MAC_02`), Lò Đậu Phụ (`MAC_03`)*; 5 món dân dã (`PROD_01..05`: *Cơm trắng, Khoai ngô nướng, Canh cải cá rô, Đậu phụ làng Mơ, Trứng vịt lộn*).
5. **📖 Cốt Truyện Mở Màn:** Câu chuyện khởi đầu *"Bức Thư Trong Chiếc Tráp Gỗ Lim"*, **Chương 1 (Lv.1)** & **Chương 2 (Lv.3)** với 2 nhánh lựa chọn `EMP` (Nghĩa Tình) và `PRAG` (Thực Dụng).

---

## 🎨 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), TILEMAP & VFX GIAI ĐOẠN 1 (`STAGE 1 ART & VFX PIPELINE`)

Để bản `v1.0 Core MVP` có hồn quê Việt Nam ngay từ giây đầu tiên mà không bị quá tải khối lượng vẽ, đội ngũ Artist/Sound hoặc AI thực hiện đúng bảng định mức dưới đây:

| Nhóm Hạng Mục Đồ Họa | Danh Sách Mã Asset Cần Sản Xuất Trong Giai Đoạn 1 | Thông Số Kỹ Thuật (`Size`, `Frames`, `Palette`) | Cách Thực Thi Bằng AI Skills (`How to Generate & Integrate`) |
| :--- | :--- | :--- | :--- |
| **1. Tilemap Nền & Ô Đất Tương Tác** | • `tile_land_dry` (Đất thịt khô `#8F5A3C`)<br>• `tile_land_wet` (Đất phù sa ướt `#5C3A21`)<br>• `tile_orchard` (Hố cây ăn quả viền đá ong)<br>• `tile_pond` (Mặt nước ao xanh `#2E8B8D`)<br>• Đường gạch đỏ Bát Tràng (`#C85A32`) | • Ô tương tác Oblique: `168 x 80 px` (lưới gốc `32x32 px`).<br>• Viền ấm `#3D2314` (`2px`), bo góc mềm. | Kích hoạt **`@generate2dmap`** & **`@codeart2d`**: Sinh trực tiếp bộ Texture ô đất/ao sắc nét trong `src/game/assets/PixelAssetGenerator.ts` (`0ms` tải mạng) và dựng lưới `3x4` trong `FarmScene.ts`. |
| **2. Công Trình Kiến Trúc Cốt Lõi** | • `bldg_house` (**Nhà Chính Ngói Đỏ 3 Gian** + Sân phơi + Giếng đá ong)<br>• 3 Xưởng sơ cấp: `MAC_01` (Cối Xay Cám), `MAC_02` (Bếp Củi Quê Mẹ), `MAC_03` (Lò Đậu Phụ) | • `bldg_house`: `185 x 74 px`.<br>• 3 Xưởng: `64 x 64 px`.<br>• Màu ngói đỏ `#B83224`, gỗ lim `#6E4121`. | Kích hoạt **`@generate2dmap`** & **`@codeart2d`**: Vẽ kiến trúc 3 miền với bóng đổ tím than `#23192D`, gắn tween nảy `scale 0.94` khi người chơi chạm mở Modal. |
| **3. Nhân Vật Chính, NPC & Thú Cưng Đợt 1** | • `CHAR_PLAYER_M` / `CHAR_PLAYER_F` (Điền chủ Nam/Nữ mặc áo nâu/bà ba khởi đầu)<br>• `NPC_01` (Bác Trưởng Thôn Bảy), `NPC_02` (Cô Giáo Hương), `NPC_04` (Bá Kiến)<br>• `char_dog_phuquoc` (**Chó Xoáy Phú Quốc** `#C85A32`) & `PET_02` (**Mèo Tam Thể**) | • Điền chủ & NPC: `48 x 64 px`, tâm neo `(0.5, 0.9)`.<br>• Chó Phú Quốc & Mèo: `48 x 48 px`. | Kích hoạt **`@generate2dsprite`** tạo 1 Master Still chuẩn trên nền `#FF00FF`, sau đó chuyển sang **`@video2dsprite`** sinh các chuỗi cử động `8–12 frames` khóa chân (`planted feet`). |
| **4. Sprite 23 Loài V-A-C Đợt 1 & 5 Món Ăn** | • **16 Cây Đợt 1** (`CROP_01..12`, `CROP_23`, `CROP_N01/C01/S01`): Mỗi cây gồm **4 giai đoạn phát triển** (`Mầm ➔ Non ➔ Ra hoa ➔ Chín rộ` + biến thể **Hoàng Kim `⭐`**)<br>• **4 Gia cầm** (`ANI_01..04`) & **3 Thủy sản đồng** (`AQUA_01..03`)<br>• **5 Icon Món dân dã** (`PROD_01..05`) & `ITEM_BUN_PHU_SA` (Xô Bùn Phù Sa) | • Cây ruộng: `32 x 32 px` x 4 frames (`128x32` strip).<br>• Cây Đu đủ (`CROP_23`): `48 x 64 px`.<br>• Icon món ăn/vật phẩm: `32 x 32 px`. | Kích hoạt **`@generate2dsprite`** & **`@codeart2d`**: Tạo bộ texture đại diện (`crop_rice_gold`, `crop_fruit_tree`, `crop_lotus`) trong `PixelAssetGenerator.ts` kết hợp hệ thống Icon & Nhãn trạng thái trực quan. |
| **5. Bộ Animation Đa Khung Hình (`8–12 Frames`)** | • **Điền chủ (`4 Clips`):** `Idle_Breathe` (`8f`), `Walk_4Dir` (`8f`), `Water_Can_Pour` (`8f`), `Harvest_Sickle_Swipe` (`8f`)<br>• **Môi trường:** `Crop_Wind_Sway` (Lúa đung đưa lệch pha `phaseOffset = idx * 0.85`), `Pond_Water_Ripple` (Sóng nước tròn đồng tâm)<br>• **Thú cưng:** `Dog_Patrol_Walk` (`8f` chạy tuần tra ngang cổng làng) | • Tốc độ `10 – 12 FPS`.<br>• Khép vòng hình Sin `0° ➔ 315°` không giật hình ở frame cuối. | Kích hoạt **`@video2dsprite`** & **`@technical-artist`**: Lập trình chuyển động hình Sin 60 FPS mượt mà cho cây trồng, sóng nước và tuần tra trong hàm `update(time)` của `FarmScene.ts`. |
| **6. Hệ Thống Particle VFX & Phản Hồi Xúc Giác 3 Lớp** | • **`fx_water_drop`** (`8x8 px`, xanh ngọc `#4DD0E1`): Tung 6 giọt nước bắn tỏa tròn khi tưới cây<br>• **`fx_gold_star`** (`6x6 px`, vàng kim `#FFEB3B`): Tung 6 ngôi sao lấp lánh khi gieo hạt / bón bùn / thu hoạch<br>• **`fx_raindrop`** (`2x12 px`, `#90E0EF`): 24 hạt mưa rơi chéo góc khi bật `🌧️ Mưa Rào`<br>• **`fx_firefly`** (`8x8 px`, `#D9ED92`): 24 đom đóm lập lòe (`alpha 0.45 ➔ 1.0`) khi bật `🌙 Đêm Đom Đóm`<br>• **3-Layer Tactile Tween:** Co giãn ô đất `scaleX: 1.07, scaleY: 0.92` (`90ms yoyo`) | • Tối đa `24–30` hạt hoạt động cùng lúc để giữ cứng **60 FPS** trên điện thoại tầm trung. | Kích hoạt **`@technical-artist`**: Cài đặt `createWeatherParticles` và `spawnClickParticles` trong `FarmScene.ts`, đồng bộ cùng lớp phủ màu thời tiết `weatherOverlay`. |

---

## 🛠️ 3. PHÂN RÃ CHI TIẾT 14 MODULES: LÀM GÌ & LÀM NHƯ THẾ NÀO (`WHAT & HOW TO BUILD`)

| Mã Module | Tên Tính Năng | Phải Làm Gì (`What to Build`) | Làm Như Thế Nào (`How to Implement Step-by-Step`) | File Đích & Test Case |
| :---: | :--- | :--- | :--- | :--- |
| **`M01.0`** | **Splash 4 Bước & Cổng Xác Thực 4 Tabs** | Màn hình nạp game 4 bước + Đăng nhập, Đăng ký (`+500🪙`), Chơi Khách (`1-Tap`), Liên kết TK (`+50💎`, `+1,000🪙`), Quên MK OTP 6 số. | Viết `authService.ts` kết nối Supabase Auth + Local Session Fallback; dựng `SplashAndAuthGate.tsx` với hiệu ứng đóng dấu triện đỏ và kiểm tra mật khẩu/email hợp lệ. | `src/services/authService.ts`, `src/components/SplashAndAuthGate.tsx` • `TC-01.0a..0d` |
| **`M01.1`** | **Viewport `2-Thumb Landscape HUD` & Nhắc Xoay Ngang** | Giao diện ngang 2 ngón cái, dành `>= 82%` diện tích giữa màn hình cho bản đồ; nhắc xoay ngang khi cầm dọc (`height > width`). | Cấu hình `Phaser.Scale.RESIZE` trong `PhaserGame.tsx`; dùng `env(safe-area-inset-*)` và `.touch-btn >= 38–44px` trong `App.tsx`; cấu hình khóa hướng ngang trong `capacitor.config.ts`. | `src/game/PhaserGame.tsx`, `src/App.tsx`, `capacitor.config.ts` • `TC-01.1a..c` |
| **`M01.2`** | **Điều Khiển Bản Đồ Cảm Ứng (`Drag-to-Pan & Zoom`)** | Vuốt kéo bản đồ mượt mà không bị nhầm với chạm thu hoạch; cụm 3 nút Zoom `➕ / 🎯 / ➖` (`0.75x – 1.45x`). | Trong `FarmScene.ts`, đo `Phaser.Math.Distance.Between(dragStartX, dragStartY, pointer.x, pointer.y)`. Nếu `dist > 12px` bật `this.isDragging = true` và hủy lệnh thu hoạch khi `pointerup`. | `src/game/scenes/FarmScene.ts` • `TC-01.2a..b` |
| **`M01.3`** | **Đại Từ Điển 155 Thực Thể & Đồng Bộ Cloud** | Nạp 155 thực thể vào `GAME_CATALOG` kèm `unlockStage` (`1..5`), `unlockChapter` (`1..10`) và đồng bộ lên Supabase. | Khai báo `types.ts` & `masterData.ts`; viết bảng `public.master_catalog` và hàm RPC `rpc_sync_master_catalog` trong `0002_seed_full_master_data.sql`. | `src/data/masterData.ts`, `supabase/migrations/0002_*.sql` • `TC-01.3a..b` |
| **`M01.4`** | **Kênh Realtime `vac_online_global_hub`** | Hiển thị `🟢 Online (N)`, khung Chat làng xóm và dải băng Loa Phường kèm 50 suất `🧧 Xin Vía` (`+120🪙`, `+5⚡`). | Viết `realtimeService.ts` kết nối Supabase Presence & Broadcast (`chat_message`, `loa_phuong`); lọc XSS `.replace(/[<>]/g, '')`. | `src/services/realtimeService.ts`, `useGameStore.ts` • `TC-01.4a..b` |
| **`M02.1`** | **Giấy Đăng Ký Về Quê & Chọn 3 Miền** | Chọn Nam/Nữ, đặt tên Điền chủ và chọn quê `NORTH` (`-10%` t/g cây ruộng), `CENTRAL` (`-10%` t/g máy), hoặc `SOUTH` (`+10%` thủy sản). | Dựng Modal `REGISTER` trong `App.tsx`; lưu vào `setProfile` trong `useGameStore.ts` và áp dụng hệ số nhân thời gian theo vùng miền. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-02.1a..b` |
| **`M02.2`** | **Hệ Thống Năng Lượng "Bát Cơm" `⚡` Hybrid** | Thanh `⚡ 50/50` (hồi `+1⚡/3p`). Làm nông tại nhà tốn `0⚡`; các hoạt động mở rộng kiểm tra `stamina >= cost`. | Lập trình kiểm tra chống âm năng lượng và khóa trần `Math.min(maxStamina, stamina + gain)` trong `useGameStore.ts`. | `src/store/useGameStore.ts` • `TC-02.2a..b` |
| **`M02.3`** | **Thời Tiết Động 3 Miền & Âm Thanh Thích Ứng** | 3 trạng thái `☀️ Nắng Vàng`, `🌧️ Mưa Rào` (tự tưới `100%` ô đất + xác suất nghiêng giàn dựng lại nổ `⭐`), `🌙 Đêm Đom Đóm`. | Lập trình `cycleWeather` trong Store, hiệu ứng hạt `fx_raindrop` / `fx_firefly` trong `FarmScene.ts` và đồng bộ âm thanh `soundFX.syncWithWeather(weather)`. | `src/game/scenes/FarmScene.ts`, `src/services/soundEffects.ts` • `TC-02.3a..b` |
| **`M02.4`** | **Khai Hoang Mở Rộng 25 Phân Khu** | Mở đầu `12/25` phân khu; mỗi lần bấm `🪓 Khai Hoang` trừ `5⚡` + `500🪙`, nhận `+45 XP` & `+25 Phong Thủy` cho tới trần `25/25`. | Viết action `expandWildLand` trong `useGameStore.ts` kiểm tra `wildPlotsUnlocked < 25`, `stamina >= 5`, `gold >= 500`. | `src/store/useGameStore.ts` • `TC-02.4a` |
| **`M03.1`** | **Khay Chọn Giống 6 Nhóm & Khóa Mở Khóa 5 Đợt** | Hiển thị khay hạt giống bên trái; cho phép gieo 23 loài Đợt 1 (`0⚡`, trừ đúng `buyCostGold`) và báo khóa rõ ràng với giống Đợt 2–5. | Lập trình `Collapsible Seed Drawer` trong `App.tsx` và kiểm tra điều kiện mở khóa 3 tầng (`unlockStage`, `unlockChapter`, `unlockLevel`) trong `interactTile`. | `src/App.tsx`, `src/store/useGameStore.ts` • `TC-03.1a..b` |
| **`M03.2`** | **Tưới Nước Giếng Làng (`-15%` Thời Gian, `0⚡`)** | Chạm vào ô cây đang lớn (`watered === false`) giảm ngay `15%` thời gian chờ còn lại, đổi sang `tile_land_wet`. | Cập nhật `interactTile` trong `useGameStore.ts`, phát `soundFX.playWaterSplash()` và tung hạt `fx_water_drop` trong `FarmScene.ts`. | `src/store/useGameStore.ts`, `FarmScene.ts` • `TC-03.2a` |
| **`M03.3`** | **Nuôi Thủy Sản Ao & Vét Bùn Đáy Ao (`-3⚡`)** | Thu hoạch cá tăng `pondMudCounter` (`0 ➔ 10`); bấm `🪣 Vét Bùn Ao (-3⚡)` reset bùn về `0` và cộng `+3 ITEM_BUN_PHU_SA`. | Viết hàm `dredgePondMud` và cập nhật nhánh thu hoạch `POND` trong `useGameStore.ts`. | `src/store/useGameStore.ts` • `TC-03.3a` |
| **`M03.4`** | **Bón Bùn Phù Sa & Nổ Hoàng Kim `⭐` (`x3 Giá`)** | Ô đã tưới nước chạm lần 2 trừ `1 ITEM_BUN_PHU_SA`, chín ngay lập tức và có `45%` nổ `isGolden = true` (bán gấp `3 lần`). | Cập nhật `interactTile` trong `useGameStore.ts`, phát `soundFX.playGoldenSparkle()` và nhân `baseSellGold * 3` khi thu hoạch. | `src/store/useGameStore.ts` • `TC-03.4a` |
| **`M03.5`** | **Cốt Truyện Chương 1–2 (`EMP`/`PRAG`) & Quà 7 Ngày** | Hoàn thành Chương 1–2 với 2 nhánh lựa chọn đạo đức (`EMP` `+30 Phong Thủy` / `PRAG` `+350🪙`) và nhận quà Điểm danh 7 ngày Tân thủ. | Lập trình `claimStoryQuest(questId, branchChoice)` và `claimRookieDayReward` trong `useGameStore.ts`. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-02.5a` |

---

## 👥 4. PHÂN CÔNG 6 BỘ PHẬN & CÁCH GIAO AI LÀM 100% CÔNG VIỆC KÈM SKILL (`HUMAN ROLES & FULL AI AUTOMATION`)

| Bộ Phận (Role) | AI Skills Tự Động Kích Hoạt | Công Việc Cụ Thể Trong Giai Đoạn 1 | Cách AI Thực Thi Thay Thế Con Người 100% |
| :--- | :--- | :--- | :--- |
| **1. PO / Game, Economy & Narrative Designer** | `@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer` | Chốt thông số 23 loài Đợt 1, công thức tưới nước `-15%`, Hoàng Kim `x3`, kịch bản Chương 1–2 và quy hoạch 25 khu đất. | AI đọc `01_MASTER_GDD`, `02_MASTER_ECONOMY`, `04_MASTER_DATA.csv`, tự động kiểm toán `RULE D0/D1` và nạp dữ liệu chuẩn vào `masterData.ts` + `storyQuests`. |
| **2. UI / UX Designer** | `@ui-designer` | Thiết kế Splash 4 bước, Auth 4 Tabs, Giấy Đăng Ký 3 Miền, Main HUD 2-Thumb và Khay Chọn Giống. | AI tự căn chỉnh bố cục Tailwind CSS v4 chuẩn công thái học 2 ngón cái (`.touch-btn >= 38–44px`, `safe-area-inset-*`) trong `SplashAndAuthGate.tsx` & `App.tsx`. |
| **3. Artist, Animator, VFX & Sound Engineer** | `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer` | Sản xuất trọn bộ Asset Đợt 1 theo **Mục 2.5**: 4 Tile nền, Nhà Chính, 23 loài V-A-C (4 giai đoạn lớn), Animation `8–12 frames`, 4 Particle VFX (`fx_water_drop`, `fx_gold_star`, `fx_raindrop`, `fx_firefly`) & Cozy Acoustic WebAudio v2.0. | AI sinh trực tiếp Texture/Sprite Sheet chuẩn viền ấm `#3D2314` trong `PixelAssetGenerator.ts`, lập trình VFX/Tween 3 lớp trong `FarmScene.ts` và tổng hợp BGM/SFX trong `soundEffects.ts`. |
| **4. Backend & Multiplayer Engineer** | `@backend-architect`, `@godot-multiplayer-engineer` | Viết bảng PostgreSQL (`profiles`, `master_catalog`, `farm_entities`, `inventories`), RLS, RPC đồng bộ và kênh Realtime `vac_online_global_hub`. | AI tự viết file SQL Migration `0001` & `0002` chuẩn Additive-Only (`RULE C13`) và kết nối WebSockets trong `realtimeService.ts`. |
| **5. Frontend Engineer** | `@frontend-developer`, `@technical-artist` | Lập trình Phaser 3 `FarmScene.ts`, React 19 `App.tsx` và Zustand `useGameStore.ts`. | AI viết code TypeScript Strict (`0 any`), xử lý mượt cử chỉ `Tap vs Drag > 12px`, hiệu ứng gió đung đưa 60 FPS và phản hồi xúc giác 3 lớp. |
| **6. QA / QC Engineer** | `@code-reviewer` | Kiểm tra biên dịch TypeScript và chạy tự động các kịch bản kiểm thử Giai đoạn 1. | AI tự chạy `npx tsc --noEmit` (`0 errors`) và thực thi bộ Test Cases `TC-01.0a ➔ TC-03.4a` trong `src/services/qcTestRunner.ts`. |

---

## 📋 5. BỘ CÂU LỆNH (PROMPT) COPY-PASTE ĐỂ GIAO AI TRIỂN KHAI GIAI ĐOẠN 1

### 🔹 Cách 1: Giao AI chạy toàn bộ hoặc rà soát nghiệm thu trọn gói Giai đoạn 1 (Bao gồm cả Asset, Animation, VFX & Code)
```text
Hãy đọc file `AGENTS.md`, `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` và `11_PLAN_GIAI_DOAN_1_v1.0_Ve_Que_Lap_Nghiep.md`.
Hãy đóng vai trò toàn bộ 6 bộ phận và tự động kích hoạt các Skill chuyên môn liên quan (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`, `@ui-designer`, `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`, `@backend-architect`, `@frontend-developer`, `@code-reviewer`) để thực thi/kiểm toán trọn vẹn GIAI ĐOẠN 1 (`v1.0 Core MVP` — 14 Modules từ `M01.0` đến `M03.5`, mở khóa Đợt 1 gồm 23/81 loài V-A-C, kèm trọn bộ Asset/Animation/VFX ở Mục 2.5).
BẮT BUỘC tuân thủ `RULE D0` (không trùng lặp) và `RULE D1` (xuất bảng `[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]` ngay ở Bước 1). Sau khi hoàn tất, hãy chạy `tsc --noEmit` (0 lỗi) và bộ Test Cases Giai đoạn 1 trong `qcTestRunner.ts` rồi xuất Phiếu Nghiệm Thu trình tôi duyệt.
```

### 🔹 Cách 2: Giao AI chuyên biệt sản xuất / nâng cấp gói Asset, Animation (`8–12 frames`) & Particle VFX của Giai đoạn 1
```text
Hãy kích hoạt `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist` và `@game-audio-engineer`.
Dựa theo Mục 2.5 trong `11_PLAN_GIAI_DOAN_1_v1.0_Ve_Que_Lap_Nghiep.md` và quy chuẩn tại `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` (góc `3/4 Top-Down Oblique`, bảng 64 màu 3 miền, viền ấm `#3D2314`, cấm viền đen `#000000`, tâm neo `(0.5, 0.9)` khóa chân), hãy tạo/cập nhật trọn bộ Sprite, Animation 8–12 frames (Điền chủ, Sóng lúa, Sóng nước, Chó Phú Quốc) và 4 Particle VFX (`fx_water_drop`, `fx_gold_star`, `fx_raindrop`, `fx_firefly`) của Giai đoạn 1 trong `src/game/assets/PixelAssetGenerator.ts` và `src/game/scenes/FarmScene.ts`.
```

### 🔹 Cách 3: Giao AI dựng từng Module lẻ trong Giai đoạn 1 (Từ `M01.0` đến `M03.5`)
```text
Dựa theo `11_PLAN_GIAI_DOAN_1_v1.0_Ve_Que_Lap_Nghiep.md` và quy trình 6 bước khép kín trong `10_MASTER_AI_PLAYBOOK`, hãy tự động nhận diện Skill và triển khai Module: [NHẬP MÃ MODULE, VD: M03.1 - Khay Chọn Giống & Mở Khóa Đợt 1].
Nhớ xuất bảng `[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]` ở Bước 1, thực hiện đầy đủ phần Asset/VFX ở Bước 2 và dừng chờ tôi duyệt ở Bước 6.
```

---

## ✅ 6. TIÊU CHÍ NGHIỆM THU HOÀN THÀNH GIAI ĐOẠN 1 (`STAGE 1 EXIT CRITERIA`)
- [x] Màn hình `0A Splash 4 bước` & `0B Auth 4 Tabs` hoạt động mượt, hỗ trợ cả tài khoản chính thức lẫn chế độ Khách (`1-Tap Guest`).
- [x] Chọn 3 Miền áp dụng đúng Buff nội tại (`-10%` t/g cây Bắc, `-10%` t/g máy Trung, `+10%` thủy sản Nam).
- [x] Toàn bộ **Asset, Animation (`8–12 frames`) và 4 Particle VFX của Đợt 1 (`Mục 2.5`)** hiển thị sắc nét với viền ấm `#3D2314`, sóng lúa đung đưa lệch pha 60 FPS và phản hồi xúc giác 3 lớp (`90ms`).
- [x] Khay hạt giống mở đúng **23 loài V-A-C Đợt 1**, khóa an toàn các loài Đợt 2–5 kèm thông báo chương mở khóa.
- [x] Tưới nước (`-15%` t/g `0⚡`), Vét Bùn Ao (`-3⚡` nhận 3 Bùn Phù Sa), Bón Bùn nổ Hoàng Kim `⭐` (`x3 giá bán`) và Âm thanh **Cozy Acoustic WebAudio v2.0** hoạt động chính xác 100%.
- [x] Pass 100% các Test Cases `TC-01.0a..0d`, `TC-01.1a..c`, `TC-01.2a..b`, `TC-01.3a..b`, `TC-01.4a..b`, `TC-02.1a..b`, `TC-02.2a..b`, `TC-02.3a..b`, `TC-02.4a`, `TC-02.5a`, `TC-03.1a..b`, `TC-03.2a`, `TC-03.3a`, `TC-03.4a`.
