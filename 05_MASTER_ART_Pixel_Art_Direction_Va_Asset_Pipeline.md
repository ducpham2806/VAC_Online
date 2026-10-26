# TÀI LIỆU ĐỊNH HƯỚNG NGHỆ THUẬT PIXEL ART 64 MÀU, QUY CHUẨN ANIMATION 8–12 FRAMES, VFX & ÂM THANH ĐỒNG QUÊ / VÕ ĐÀI (MASTER ART, ANIMATION & AUDIO BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` *(Đã hợp nhất `05_MASTER_ART` + `09_MASTER_ASSET_LIST`, đồng bộ 100% với 6 Giai đoạn / 52 Modules từ Nông trại đến Sảnh Chung & Võ Đài PK, loại bỏ mọi phần trùng lặp)*  
**Phiên bản:** Master Art & Audio 6.0 (Zero-Redundancy Synchronized Edition)  
**Thực hiện bởi:** `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist` & `@game-audio-engineer`  
**Đối tượng sử dụng:** Technical Artist, 2D Pixel Animator, VFX Artist, Sound Engineer & Frontend Developer

---

## PHẦN 1: THÔNG SỐ KỸ THUẬT PIXEL ART & BẢNG MÀU 3 MIỀN (`CORE ART SPECS`)

### 1.1. Quy Chuẩn Góc Nhìn, Lưới Ô Đất & Viền Màu Ấm
* **Góc nhìn (`Camera Projection`):** `3/4 Top-Down Oblique` (Nhìn từ trên xuống nghiêng 45°, áp dụng thống nhất cho cả Bản đồ Nông trại `60x60` và Sảnh Chung Chợ Đình `48x32`).
* **Đơn vị Lưới gốc (`Base Grid`):** `32 x 32 px` (Khi render lên bản đồ Oblique trong `FarmScene.ts` có kích thước ô tương tác `168 x 80 px` để ngón cái chạm chính xác trên màn hình điện thoại ngang).
* **3 Quy Tắc Vàng Pixel Art (`Zero Mixels & Selective Outlines`):**
  1. Bật `pixelArt: true` và `roundPixels: true` trong cấu hình Phaser 3.
  2. **CẤM dùng viền đen tuyền (`#000000`)**: Bắt buộc dùng **Viền Màu Ấm Chọn Lọc (`Selective Colored Outlines`)** — Nâu đất nung đậm `#3D2314` cho nhà gỗ/thân cây/nhân vật, Xanh rừng đậm `#1B3B2B` cho tán lá/bờ ao, Tím than `#23192D` cho bóng đổ.
  3. Khi xuất file từ phần mềm vẽ (Aseprite / AI Generator), đặt trên nền khóa màu `#FF00FF` (Magenta) để tách nền sạch 100%.

### 1.2. Bảng Màu Chủ Đạo Ba Miền, Đột Biến & Sảnh Hội Làng

| Phân Vùng / Hệ | Bộ Mã Màu Chủ Đạo (`Hex Palette`) | Ứng Dụng Thị Giác Trên Bản Đồ |
| :--- | :--- | :--- |
| **Miền Bắc (`NORTH`)** | `#7FB800` (Xanh Cốm), `#C85A32` (Đỏ Gạch Bát Tràng), `#5C6B73` (Xám Đá Ong), `#F4A7B9` (Hồng Đào) | Nhà chính ngói đỏ 3 gian, giếng làng đá ong, sân gạch đình làng, đồi chè và vườn vải thiều. |
| **Miền Trung (`CENTRAL`)** | `#F5B700` (Vàng Nắng/Hoa Mai), `#5E4B56` (Tím Huế), `#8D3B24` (Đất Đỏ Bazan), `#2EC4B6` (Xanh Biển) | Nhà rường cổ kính, phố đèn lồng Hội An, vườn cà phê Buôn Ma Thuột và hồ tiêu. |
| **Miền Nam (`SOUTH`)** | `#8AC926` (Xanh Lá Dừa), `#C99E67` (Nâu Phù Sa), `#FFB703` (Vàng Lúa Chín), `#2E8B8D` (Xanh Kênh Rạch) | Cầu khỉ tre đấu gậy, xuồng ba lá, đầm sen Đồng Tháp, vườn sầu riêng Ri6 và măng cụt. |
| **Đột Biến & Võ Đài (`MUTANT / ARENA`)** | `#9B5DE5` (Tím Thảo Dược), `#FFD166` (Vàng Kim Tài Lộc), `#F15BB5` (Hồng Sen), `#D62828` (Đỏ Cờ Hội) | Hạt sáng cây đột biến, cờ đuôi nheo Sới vật Đình làng và hiệu ứng va chạm Võ đài PK. |

---

## PHẦN 2: QUY CHUẨN DIỄN HOẠT ĐA KHUNG HÌNH (`8 – 12 FRAMES SEAMLESS LOOPS`)

1. **Số lượng Frame tiêu chuẩn:** Mọi chuyển động lặp lại (`Idle, Walk, Sóng lúa, Sóng nước, Múa sạp, Múa lân, Đấu gậy bông`) có từ **8 đến 12 frames** ở tốc độ `8 – 15 FPS`.
2. **Khép vòng hình Sin (`0° -> 315°`):** `Frame 8` là bước chuyển tiếp ngay trước `Frame 1` để không bị khựng hình.
3. **Độ trễ lệch pha theo tọa độ (`Per-Tile Phase Offset`):** Mỗi ô đất có `phaseOffset = idx * 0.85`, giúp các luống lúa đung đưa nối tiếp nhau.
4. **Chuyển động thứ cấp (`Follow-Through`):** Tà áo bà ba, vành nón lá, đầu lân và tai chó Phú Quốc nảy trễ hơn thân người `1 frame`.
5. **Phản hồi Xúc giác 3 Lớp (`3-Layer Tactile Feedback`):** Kết hợp Tween co giãn (`90ms`) + Particle VFX + WebAudio SFX & Haptic.

---

## PHẦN 3: DANH MỤC KIỂM KÊ ASSETS TOÀN DỰ ÁN (TỪ GIAI ĐOẠN 1 ĐẾN GIAI ĐOẠN 6)

### 3.1. Nhóm Nhân Vật Chính, NPC, 6 Gia Nhân Lán Thợ & Đạo Cụ Sảnh Chung / PK

| Mã Định Danh | Tên Nhân Vật / Thực Thể | Kích Thước Khung | Màu Sắc & Đặc Điểm Nhận Diện | Bộ Animation Trên Nông Trại & Sảnh Chung (`Giai đoạn 1 ➔ 6`) |
| :--- | :--- | :---: | :--- | :--- |
| `CHAR_PLAYER` | **👦/👧 Điền Chủ (Nam/Nữ)** | `48 x 64 px` | 12 lớp tách rời (`FASH_01..12`) | • *Nông trại:* `Idle`, `Walk_4Dir`, `Water`, `Harvest`, `Steal_Sneak`.<br>• *Sảnh Chung & PK (GĐ 6):* `Emote_BambooDance` (Múa sạp), `Emote_LionDance` (Múa lân), `PK_JoustHigh/Low/Jump` (Đấu gậy cầu tre), `PK_SumoDash` (Húc sới vật), `Brawl_HoldDuck` (Ôm vịt vàng). |
| `NPC_05` | **🥢 Cụ Đồ Ẩm Thực Vũ Bằng** *(GĐ 2)* | `48 x 56 px` | Áo the đen + Khăn xếp + Quạt giấy | Đứng trước hiên Nhà Chính lúc `12:00` & `19:00` vuốt râu ngâm ca dao đố món ăn. |
| `WORK_01..06` | **🛖 6 Gia Nhân Lán Thợ** *(Chú Tư, Cô Năm, Anh Sáu, Dì Bảy, Chú Tám, Quản Gia Cửu - GĐ 2)* | `48 x 48 px` | Trang phục đặc trưng từng vị trí (`CRAFT_01..04`) | Đi tuần làm việc tự động; khi `Độ No < 35%` hiện nhãn đỏ **`[Đói ➔ Về Lán]`** và đi bộ về Bàn Ăn Chung. |
| `PET_DOG` & `PET_BUFFALO` | **🐕 Chó Phú Quốc & 🐃 Trâu Đen** *(GĐ 1, 4, 6)* | `48 x 48 px` | Lông vàng lửa `#C85A32` / Xám đen `#2B2D42` | Canh gác cổng làng, chạy đua ở *Hội Thi Trâu Vàng (`M08.6`)*, chạy theo chủ ở *Sảnh Chung (`M11.1`)* & húc ngang sân ở *Loạn Chiến (`M11.4`)*. |
| `PROP_NOSTALGIA`| **📻 12 Icon Kỷ Vật Tuổi Thơ 8x–9x** *(GĐ 4 - `M08.5`)* | `32 x 32 px` | *Bi ve, Máy 4 nút, Bút Trường Sơn, Đài Cassette...* | Hiển thị trong Tủ kính Bảo tàng và hiệu ứng nổ quà khi Vét ao / Rừng trúc. |
| `PROP_ARENA` | **🎋 Đạo Cụ Võ Đài & Máy Thùng Hyper-Casual** *(GĐ 6 - `M11.2..11.5`)* | `32 x 32 px` | *Gậy bông, Cờ bông lúa vàng, Pháo đất đếm ngược, Vịt Hoàng Kim, Lon sữa bò* | Dùng chung cho cả Võ đài PK/Loạn chiến và các băng trò chơi `IHyperCasualCartridge` (`0 KB` tải thêm). |

### 3.2. Nhóm Công Trình Kiến Trúc & Hiệu Ứng Hạt (`Buildings & Particle VFX`)
1. **6 Công trình Tương tác Chính (`FarmScene.ts` & `SocialPlazaScene.ts`):**
   * `bldg_house` (`185x74`): Nhà Chính 3 Gian & Nồi Bánh Chưng Tết Đỏ Lửa (`M10.4`).
   * `bldg_lodge` (`198x74`): Lán Thợ Gia Nhân Mái Tranh (`M05.1`).
   * `bldg_dinh` (`210x74`): Đình Làng Cổ Kính, Lò Bánh Trung Thu (`M09.3`) & Cổng Ra Sảnh Chung Chợ Đình (`M11.1`).
   * `bldg_market` (`175x74`): Sạp Báo Chợ 3 Miền & Cổng Đi Trộm (`M06.2`).
   * `bldg_train` (`120x32`): Đầu Máy Tàu Thống Nhất Bắc – Nam & Thương Đội Liên Gia (`M06.3`, `M06.5`).
   * `bldg_arcade_tent` (`180x80` - *Giai đoạn 6*): **🕹️ Lều Trò Chơi Dân Gian & Máy Thùng Hyper-Casual** tại Khu Bắc Sảnh Chung (`M11.5`).
2. **5 Bộ Hiệu Ứng Hạt (`Particle Textures`):**
   * `fx_water_drop` (`8x8`, `#4DD0E1`), `fx_gold_star` (`6x6`, `#FFEB3B`), `fx_raindrop` (`2x12`, `#90E0EF`), `fx_firefly` (`8x8`, `#D9ED92`), và **`fx_arena_impact` (`12x12`, `#FF9F1C` - Tia sáng va chạm khi Đấu gậy cầu tre / Húc Sumo / Chẻ tre Hyper-Casual)**.

---

## PHẦN 4: ĐẶC TẢ ÂM THANH ĐỒNG QUÊ & VÕ ĐÀI (`WEB AUDIO SYNTHESIZER - 0MS LATENCY`)

Toàn bộ âm thanh trong `src/services/soundEffects.ts` được tổng hợp trực tiếp bằng **Web Audio API** (không phụ thuộc file `.mp3` ngoài):
1. **🎵 2 Chế Độ Nhạc Nền (`BGM`):**
   * `toggleFolkBgm()`: Giai điệu Ngũ cung Việt Nam (*Hò – Xự – Xang – Xê – Cống*: `C5 – D5 – F5 – G5 – A5`), nhịp `680ms/nốt`, âm sắc sáo trúc êm dịu (kích hoạt thêm biến tấu *Sáo Trúc Hoài Niệm* khi đủ 12 Kỷ vật 8x–9x).
   * `playArenaDrumBgm()` *(Giai đoạn 6 - Mới)*: Nhịp trống hội Đình Làng dồn dập (`110Hz -> 65Hz` sóng `triangle` kết hợp phách tre `880Hz`) khi bước vào trận đấu PK 1v1, 3v3 hoặc Loạn Chiến 8–12P.
2. **🔊 8 Hiệu Ứng Âm Thanh Tương Tác (`SFX`):**
   * `playWaterSplash()` (Tưới nước), `playHarvestCoin()` (Thu vàng), `playDogBark()` (Chó Phú Quốc sủa), `playTrainWhistle()` (Còi tàu & Thương đội), `playClayPotSmash()` (Đập niêu), `playCelebrationGong()` (Chiêng mừng đám cưới/bằng khen), **`playJoustHit()` (Tiếng gậy bông / húc vai võ đài PK)** và **`playArcadeSlice()` (Tiếng vuốt chẻ tre / nhảy lá sen Hyper-Casual)**.
