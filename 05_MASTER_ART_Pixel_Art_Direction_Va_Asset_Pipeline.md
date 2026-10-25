# TÀI LIỆU ĐỊNH HƯỚNG NGHỆ THUẬT PIXEL ART 64 MÀU, QUY CHUẨN ANIMATION 8–12 FRAMES, VFX & ÂM THANH ĐỒNG QUÊ (MASTER ART, ANIMATION & AUDIO BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` *(Đã hợp nhất `05_MASTER_ART` + `09_MASTER_ASSET_ANIMATION_VFX_UI_LIST`, chuẩn hóa tên 6 Nhân công & 155 Thực thể)*  
**Phiên bản:** Master Art & Audio 5.0  
**Đối tượng sử dụng:** Technical Artist, 2D Pixel Animator, VFX Artist, Sound Engineer & Frontend Developer

---

## PHẦN 1: THÔNG SỐ KỸ THUẬT PIXEL ART & BẢNG MÀU 3 MIỀN (`CORE ART SPECS`)

### 1.1. Quy Chuẩn Góc Nhìn, Lưới Ô Đất & Viền Màu Ấm
* **Góc nhìn (`Camera Projection`):** `3/4 Top-Down Oblique` (Nhìn từ trên xuống nghiêng 45°, thấy rõ cả mặt trước và mặt mái công trình/luống đất).
* **Đơn vị Lưới gốc (`Base Grid`):** `32 x 32 px` (Khi render lên bản đồ Oblique/Isometric trong `FarmScene.ts` có kích thước ô tương tác `168 x 80 px` để ngón cái chạm chính xác trên màn hình điện thoại ngang).
* **3 Quy Tắc Vàng Pixel Art (`Zero Mixels & Selective Outlines`):**
  1. Bật `pixelArt: true` và `roundPixels: true` trong cấu hình Phaser 3.
  2. **CẤM dùng viền đen tuyền (`#000000`)**: Bắt buộc dùng **Viền Màu Ấm Chọn Lọc (`Selective Colored Outlines`)** — Nâu đất nung đậm `#3D2314` cho nhà gỗ/thân cây/nhân vật, Xanh rừng đậm `#1B3B2B` cho tán lá/bờ ao, Tím than `#23192D` cho bóng đổ.
  3. Khi xuất file từ phần mềm vẽ (Aseprite / Photoshop / AI Generator), đặt trên nền khóa màu `#FF00FF` (Magenta) để script tách nền sạch 100% không bị viền răng cưa trắng.

### 1.2. Bảng Màu Chủ Đạo Ba Miền & Đột Biến Ngũ Sắc

| Phân Vùng / Hệ | Bộ Mã Màu Chủ Đạo (`Hex Palette`) | Ứng Dụng Thị Giác Trên Bản Đồ |
| :--- | :--- | :--- |
| **Miền Bắc (`NORTH`)** | `#7FB800` (Xanh Cốm), `#C85A32` (Đỏ Gạch Bát Tràng), `#5C6B73` (Xám Đá Ong), `#F4A7B9` (Hồng Đào) | Nhà chính ngói đỏ 3 gian, giếng làng đá ong, đường gạch đỏ, đồi chè và vườn vải thiều. |
| **Miền Trung (`CENTRAL`)** | `#F5B700` (Vàng Nắng/Hoa Mai), `#5E4B56` (Tím Huế), `#8D3B24` (Đất Đỏ Bazan), `#2EC4B6` (Xanh Biển) | Nhà rường cổ kính, đèn lồng Hội An, vườn cà phê Buôn Ma Thuột và hồ tiêu. |
| **Miền Nam (`SOUTH`)** | `#8AC926` (Xanh Lá Dừa), `#C99E67` (Nâu Phù Sa), `#FFB703` (Vàng Lúa Chín), `#2E8B8D` (Xanh Kênh Rạch) | Cầu khỉ tre, xuồng ba lá, đầm sen Đồng Tháp, vườn sầu riêng Ri6 và măng cụt. |
| **Đột Biến (`MUTANT`)** | `#9B5DE5` (Tím Thảo Dược), `#FFD166` (Vàng Kim Tài Lộc), `#F15BB5` (Hồng Sen Nghìn Cánh) | Hạt sáng lấp lánh quanh gốc *Lúa Tím*, *Dưa Hấu Vuông* và *Bưởi Hồ Lô*. |

---

## PHẦN 2: QUY CHUẨN DIỄN HOẠT ĐA KHUNG HÌNH (`8 – 12 FRAMES SEAMLESS LOOPS`)

### 2.1. 5 Quy Tắc Làm Mượt Animation Không Bị Giật (`Zero Popping`)
1. **Số lượng Frame tiêu chuẩn:** Mọi chuyển động lặp lại (Idle, Walk, Sóng lúa, Sóng nước, Cá nhảy) phải có từ **8 đến 12 frames** ở tốc độ `8 – 15 FPS`.
2. **Khép vòng hình Sin (`0° -> 315°`):** `Frame 8` không bao giờ vẽ trùng hệt `Frame 1` mà là bước chuyển tiếp ngay trước `Frame 1`.
3. **Độ trễ lệch pha theo tọa độ (`Per-Tile Phase Offset`):** Trong `FarmScene.ts`, mỗi ô đất có `phaseOffset = idx * 0.85`, giúp các luống lúa đung đưa nối tiếp nhau như làn sóng gió thực tế.
4. **Chuyển động thứ cấp (`Follow-Through`):** Tà áo bà ba, vành nón lá, tai chú chó Phú Quốc nảy trễ hơn thân người `1 frame`.
5. **Phản hồi Xúc giác 3 Lớp khi chạm (`3-Layer Tactile Feedback`):**
   * *Lớp 1 (Tween):* Co giãn `scaleX: 1.07, scaleY: 0.92` trong `90ms` (`yoyo: true`).
   * *Lớp 2 (Particles):* Bắn 6 hạt nước `fx_water_drop` (khi tưới) hoặc 6 ngôi sao vàng `fx_gold_star` (khi thu hoạch).
   * *Lớp 3 (Sound & Haptic):* Phát âm thanh `playWaterSplash()` / `playHarvestCoin()` + rung nhẹ `triggerHaptic('light')`.

---

## PHẦN 3: DANH MỤC KIỂM KÊ TOÀN BỘ ASSETS THEO TỪNG NHÓM THỰC THỂ

### 3.1. Nhóm Nhân Vật Chính (12-Slot Paperdoll) & 6 Gia Nhân Lán Thợ (`WORK_01..06`)

| Mã Định Danh | Tên Nhân Vật / Nhân Công | Kích Thước Khung | Màu Áo & Nón Đặc Trưng | Bộ Animation & Trạng Thái Biểu Cảm Trên Bản Đồ |
| :--- | :--- | :---: | :--- | :--- |
| `CHAR_PLAYER` | **👦/👧 Điền Chủ (Nam/Nữ)** | `48 x 64 px` | 12 lớp tách rời (`FASH_01..12`) | `Idle` (8f), `Walk_4Dir` (8f), `Water` (10f), `Harvest` (10f), `Steal_Sneak` (8f). |
| `WORK_01` | **🌾 Chú Tư Cày** *(Thợ Làm Vườn – Lv.14)* | `48 x 48 px` | Áo cánh nâu `#8D5524` + Nón lá `#F5DEB3` | Đi tuần khu Vườn; khi `Độ No < 35%` đổi nhãn đỏ **`[Đói ➔ Về Lán]`** và tự đi bộ về Lán Thợ. |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn Nuôi – Lv.16)* | `48 x 48 px` | Áo bà ba hồng `#F4A7B9` + Nón lá `#F5DEB3` | Đi tuần khu Chuồng & Xay cám; tự về Lán Thợ ăn cơm khi đói. |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Thợ Ao Cá – Lv.18)* | `48 x 48 px` | Áo tơi xanh `#2E8B8D` + Mũ cói `#D2B48C` | Đi tuần bờ Ao & tự Vét Bùn Ao; tự về Lán Thợ ăn cơm khi đói. |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Đầu Bếp – Lv.20)* | `48 x 48 px` | Áo đỏ `#E63946` + Khăn bếp `#FFF8EB` | Đứng cạnh Nhà Chính & Bếp Củi quạt than nấu cơm nuôi thợ. |
| `WORK_05` | **🪵 Chú Tám Mộc** *(Cây Lâu Năm – Lv.22)*| `48 x 48 px` | Áo chàm `#386641` + Mũ cối `#A7C957` | Đi tuần khu Vườn Cây Ăn Quả Lâu Năm & bón Bùn Phù Sa. |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng Quản – Lv.25)*| `48 x 48 px` | Áo dài vàng `#F5B82E` + Khăn đóng `#3D2314`| Đi tuần giữa Lán Thợ và Ga Tàu Thống Nhất điều phối cả đội. |
| `PET_DOG` | **🐕 Chó Xoáy Phú Quốc** *(Canh gác 70%)* | `48 x 48 px` | Lông vàng lửa `#C85A32` + Cổ đỏ `#3D2314` | Chạy tuần tra dọc cổng làng và Sạp Chợ, sủa vang khi có kẻ trộm. |

### 3.2. Nhóm Công Trình Kiến Trúc, Phương Tiện & Thời Tiết Động
1. **5 Công trình Tương tác Chính trên Bản đồ (`FarmScene.ts`):**
   * `bldg_house` (`185 x 74 px`): **🏠 Nhà Chính 3 Gian Mái Ngói Đỏ** (Mở `COOKING` Modal).
   * `bldg_lodge` (`198 x 74 px`): **🛖 Lán Thợ Gia Nhân Mái Tranh** (Mở `WORKERS` Modal).
   * `bldg_dinh` (`210 x 74 px`): **⛩️ Đình Làng Cổ Kính & Vườn Ươm Đột Biến** (Mở `BENCHMARK` Modal).
   * `bldg_market` (`175 x 74 px`): **📰 Sạp Báo Chợ 3 Miền & Cổng Đi Trộm** (Mở `MARKET_STEAL` Modal).
   * `bldg_train` (`120 x 32 px`): **🚂 Đầu Máy Tàu Thống Nhất Bắc – Nam** chạy dọc đường ray phía Bắc làng (Chạm vào phát tiếng còi tàu và mở `COOP_QUESTS` Modal).
2. **4 Bộ Hiệu Ứng Hạt Thời Tiết & Phản Hồi (`Particle Textures`):**
   * `fx_water_drop` (`8x8 px`, `#4DD0E1`): Hạt nước bắn ra khi tưới cây.
   * `fx_gold_star` (`6x6 px`, `#FFEB3B`): Sao vàng lấp lánh khi thu hoạch nông sản.
   * `fx_raindrop` (`2x12 px`, `#90E0EF`): Mưa rào rơi chéo toàn màn hình khi thời tiết `RAINY` (kèm lớp phủ màu `#1D3557` alpha `0.22`).
   * `fx_firefly` (`8x8 px`, `#D9ED92`): Đom đóm bay lượn nhấp nháy ban đêm khi thời tiết `FIREFLY_NIGHT` (kèm lớp phủ đêm trăng `#0B132B` alpha `0.36`).

---

## PHẦN 4: ĐẶC TẢ ÂM THANH ĐỒNG QUÊ & NHẠC NỀN NGŨ CUNG (`WEB AUDIO SYNTHESIZER`)

Toàn bộ âm thanh trong `src/services/soundEffects.ts` được tổng hợp trực tiếp bằng **Web Audio API** (không phụ thuộc file `.mp3` ngoài, giúp tốc độ tải trang `< 1 giây` và không bao giờ lỗi 404 Audio):
1. **🎵 Nhạc Nền Ngũ Cung Ba Miền (`toggleFolkBgm`):**
   * Chuỗi giai điệu Ngũ cung Việt Nam (*Hò – Xự – Xang – Xê – Cống*: `523.25Hz (C5) ➔ 587.33Hz (D5) ➔ 698.46Hz (F5) ➔ 783.99Hz (G5) ➔ 880.0Hz (A5)`), nhịp `680ms/nốt`, âm sắc `sine` êm dịu như tiếng sáo trúc chiều quê.
2. **🔊 6 Hiệu Ứng Âm Thanh Tương Tác (`SFX`):**
   * `playWaterSplash()`: Sóng `sine` vuốt tần số từ `520Hz` lên `880Hz` trong `120ms` (Tiếng gáo nước dừa tưới cây).
   * `playHarvestCoin()`: Hợp âm đôi `triangle` (`660Hz` & `880Hz`) ngân vang trong `230ms` (Tiếng thu hoạch nổ Xu Vàng).
   * `playDogBark()`: Sóng `sawtooth` gằn từ `220Hz` xuống `110Hz` trong `190ms` (Tiếng Chó Phú Quốc sủa bắt trộm).
   * `playTrainWhistle()`: Hợp âm đôi `440Hz + 554.37Hz` ngân `360ms` (Tiếng còi Tàu Thống Nhất Bắc – Nam).
   * `playClayPotSmash()`: Sóng `square` dội từ `310Hz` xuống `95Hz` (Tiếng đập vỡ niêu đất Đình Làng).
   * `playCelebrationGong()`: Chuỗi hợp âm 4 nốt `C5 – E5 – G5 – C6` (Tiếng chiêng trống mừng Đăng ký / Kết hôn / Xuất Bằng Khen).
