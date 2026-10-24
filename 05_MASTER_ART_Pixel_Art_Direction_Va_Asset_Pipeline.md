# 🎨 MASTER ART BIBLE 3.0: ĐỊNH HƯỚNG NGHỆ THUẬT PIXEL ART & QUY TRÌNH TẠO ASSET TOÀN GAME
**Dự án:** Hương Đồng Gió Nội (Nông Trại Ba Miền – VAC Online)
**Thể loại Art:** Cozy Bright Vietnamese Pixel Art (`3/4 Top-Down Oblique`, `32x32 px` Grid, `8–12 Frames` Seamless Loop)
**Phiên bản:** Master Art 3.0 (Đã đồng bộ 140+ Nông/Thủy sản, Cây đột biến, 6 Nhân công `WORK_01..06`, Đình làng & 12 Tính năng Benchmark)

---

## 1. TẦM NHÌN NGHỆ THUẬT & THÔNG SỐ KỸ THUẬT CỐT LÕI (CORE SPECS)

* **Tầm nhìn:** Tái hiện bức tranh làng quê Việt Nam tươi sáng, ấm áp, hoài niệm nhưng rực rỡ sức sống – kết hợp độ sắc nét Pixel Art hiện đại của *Stardew Valley / Fields of Mistria* với màu nắng vàng mật ong của *Mùa Hè Của Kikujiro / Mắt Biếc*.
* **Góc nhìn (Camera Projection):** **3/4 Top-Down Oblique** (Nhìn từ trên xuống nghiêng 45 độ, thấy rõ mặt đứng phía trước và mặt trên của mái nhà, luống đất, bờ ao).
* **Đơn vị Lưới chuẩn (Base Tile Grid):** **`32 x 32 pixels`** (`1 Tile = 32x32 px`).
* **Độ phân giải Render gốc (Internal Resolution):** `640 x 360 px` (Ngang 16:9) hoặc `360 x 640 px` (Dọc 9:16), phóng đại nguyên lần (`integer scale 3x / 4x`) lên màn hình Full HD/Mobile.
* **Quy tắc Vàng Pixel Art (Zero Anti-Aliasing):**
  1. Tuyệt đối dùng `image-rendering: pixelated;` và `roundPixels: true` trong Phaser 3.
  2. Không bao giờ xoay (rotate) hoặc co giãn lẻ (`scale 1.35x`) một sprite pixel bằng code (gây hiện tượng răng cưa Mixels).
  3. Viền ngoài (Outline) không bao giờ dùng màu đen tuyền (`#000000`) mà dùng **Selective Colored Outlines** (nâu đất `#3D2314` cho gỗ/cây, xanh rêu đậm `#1B3B2B` cho lá, tím than `#23192D` cho bóng đổ ban đêm).

---

## 2. BẢNG MÀU CHUẨN 3 MIỀN & ÁNH SÁNG ĐỘNG (COLOR PALETTES)

| Vùng / Hệ | Mã Màu Chủ Đạo (Hex) | Cảm Hứng & Ứng Dụng Thị Giác |
| :--- | :--- | :--- |
| **Miền Bắc (Đồng Bằng & Trung Du)** | `#7FB800` (Xanh Cốm), `#C85A32` (Đỏ Gạch Nung), `#5C6B73` (Xám Đá Ong) | Ngói mũi hài rêu phong, bờ đê cỏ mượt, hoa đào phai `#F4A7B9`, sương sớm mờ ảo. |
| **Miền Trung (Duyên Hải & Cao Nguyên)** | `#F5B700` (Vàng Hoa Mai/Nắng), `#5E4B56` (Tím Huế Trầm), `#8D3B24` (Đất Đỏ Bazan) | Đèn lồng Hội An lung linh, nhà rường gỗ lim, đồi cà phê đất đỏ, cát trắng biển xanh `#2EC4B6`. |
| **Miền Nam (Miền Tây Sông Nước)** | `#8AC926` (Xanh Lá Dừa Tươi), `#C99E67` (Nâu Phù Sa), `#FFB703` (Vàng Lúa Chín) | Kênh rạch chằng chịt, cầu khỉ tre, xuồng ba lá, vườn sầu riêng – măng cụt – bưởi da xanh trĩu quả. |
| **Cây Đột Biến & Thần Thoại (`CROP_MUT`)** | `#9B5DE5` (Tím Thảo Dược), `#FFD166` (Vàng Kim Tài Lộc), `#F15BB5` (Hồng Sen Nghìn Cánh) | Hiệu ứng hạt sáng lấp lánh (Sparkle Shimmer `8 frames`), viền lá ánh kim nổi bật trên nền ruộng thường. |

---

## 3. QUY CHUẨN KÍCH THƯỚC & DIỄN HOẠT NHÂN VẬT, THÚ CƯNG, GIA NHÂN (`8–12 FRAMES`)

### 3.1. Khung xương Nhân vật Người chơi (12-Slot Layered Paperdoll)
* **Kích thước khung (Canvas):** `48 x 64 px` (chừa khoảng trống phía trên cho Nón lá, Khăn đóng, Vương miện và phía bên cho Cần câu, Cuốc).
* **Thứ tự vẽ 12 Lớp (Z-Index từ thấp đến cao):**
  `[0] Shadow` -> `[1] Back/Cape` -> `[2] Body Base` -> `[3] Pants/Skirt` -> `[4] Shoes (Dép tổ ong/Guốc mộc)` -> `[5] Shirt (Áo bà ba/Áo dài/Áo tứ thân)` -> `[6] Hair` -> `[7] Face/Eyes` -> `[8] Glasses` -> `[9] Hat` -> `[10] Hand Tool` -> `[11] Pet/Aura`.
* **Số khung hình (Frame Count) bắt buộc để mượt mà:**
  * `Idle (Đứng thở & chớp mắt)`: **8 frames** (`10 FPS`, seamless loop).
  * `Walk (Đi bộ 4 hướng)`: **8 frames** (`12 FPS`, có độ nảy đầu 1–2px và vung tay tự nhiên).
  * `Run (Chạy nhanh / Rượt trộm)`: **8 frames** (`15 FPS`, nghiêng người về phía trước + bụi đất bay sau gót).
  * `Farm Actions (Cuốc đất / Tưới nước / Gặt lúa / Quăng chài)`: **10–12 frames** (`14 FPS`, có Anticipation lấy đà -> Impact -> Follow-through).

### 3.2. Bộ 6 Nhân công Thuê (`WORK_01..WORK_06`) & Trang thái Biểu cảm
Mỗi nhân công có kích thước `48 x 64 px`, phân biệt rõ silhouette và trang phục bảo hộ:
* **`WORK_01` – Bác Ba Làm Vườn:** Đội nón lá, vắt khăn rằn trên vai, cầm bình ô-doa tưới nước miệt mài (`10 frames`).
* **`WORK_02` – Chú Tư Điền Chủ:** Mặc áo nâu sồng, đội nón cối/nón lá, tay cầm liềm gặt lúa xoèn xoẹt + vác bao thóc (`12 frames`).
* **`WORK_03` – Cô Năm Chăn Nuôi:** Mặc áo bà ba hồng phấn, xách xô cám gỗ, vẫy tay gọi gà vịt chạy theo (`10 frames`).
* **`WORK_04` – Anh Sáu Ngư Phủ:** Mặc áo tơi lá cọ, đội nón lá, đứng trên cầu tre quăng chài & kéo vó bè cá (`12 frames`).
* **`WORK_05` – Dì Bảy Đầu Bếp:** Mặc tạp dề thổ cẩm, tay cầm quạt nan quạt bếp củi đỏ lửa & đảo chảo gang (`10 frames`).
* **`WORK_06` – Chú Tám Quản Gia:** Mặc áo dài khăn đóng lịch lãm, cầm sổ sách và bàn tính gỗ gõ lách cách (`8 frames`).
* **Trạng thái đặc biệt (Visual States):**
  * **Đói bụng (`No Stamina`):** Ngồi bệt dưới gốc cây phe phẩy nón lá, bong bóng `[💭 Đói bụng!]` nảy trên đầu (`8 frames`).
  * **Rách đồ bảo hộ (`0% Durability`):** Quần áo có vết vá, đi chậm lại, hiện icon `[🧥 Cần thay đồ bảo hộ]`.
  * **Hưng phấn (`Morale Bonus`):** Có nốt nhạc dân ca và tim hồng bay quanh người khi làm việc.

---

## 4. QUY CHUẨN CÂY TRỒNG, ĐỘT BIẾN, VẬT NUÔI & CÔNG TRÌNH BENCHMARK

### 4.1. Cây trồng Ngắn ngày, Cây ăn quả & Cây Đột Biến (48 loài)
* **5 Giai đoạn sinh trưởng:** `Hạt giống` -> `Nảy mầm` -> `Cây non` -> `Ra hoa/Trưởng thành` -> `Thu hoạch (Quả chín lấp lánh)`.
* **Sức sống Môi trường (Ambient Life – Không bao giờ tĩnh):** Toàn bộ lúa, rau, hoa, lá cây ăn quả đều phải có **8 frames đung đưa theo gió (`Wind Sway Loop`)** lệch pha nhau giữa các ô đất liền kề để tạo hiệu ứng "sóng lúa rì rào".
* **3 Cây Đột Biến Ngũ Sắc (`CROP_MUT_01..03`):**
  * *Lúa Tím Thảo Dược:* Bông lúa màu tím ngọc bích tỏa đom đóm tím ban đêm (`8 frames`).
  * *Dưa Hấu Vuông Tài Lộc:* Quả dưa hình lập phương màu xanh ngọc bích, chính giữa có chữ "Phúc/Lộc" khắc nổi vàng kim (`8 frames` lấp lánh).
  * *Bưởi Hồ Lô & Sen Nghìn Cánh:* Quả bưởi thắt eo hình hồ lô buộc dây chỉ đỏ; hoa sen 3 tầng cánh xếp lớp tỏa hào quang hồng phấn.

### 4.2. Kiến trúc Công trình Làng Quê & Tính năng Benchmark
1. **Lán Thợ Đồng Quê (`Worker Lodge` – `128x96 px`, 4x3 Tiles):** Nhà gỗ mái tranh 3 gian ấm cúng, trước sân có bàn tre uống trà đá, giá treo nón lá – ủng cao su – áo tơi, ống khói bếp bốc khói trắng hình xoắn ốc (`10 frames`).
2. **Vườn Ươm Chiết Cành (`Mutant Nursery` – `128x128 px`, 4x4 Tiles):** Giàn tre lợp lưới mát, bàn ghép cành có lọ phấn hoa phát sáng, chậu đất nung chạm khắc hoa văn Đông Sơn.
3. **Đình Làng Cổ Kính (`Village Communal House` – `256x192 px`, 8x6 Tiles):**
   * *Giai đoạn 0 (Đổ nát):* Mái ngói rêu phong sứt mẻ, cột gỗ phủ dây leo.
   * *Giai đoạn 1–2 (Đang trùng tu):* Có giàn giáo tre, thợ mộc đục đẽo.
   * *Giai đoạn 3 (Hoàn mỹ):* Mái đao cong vút chạm Lưỡng Long Chầu Nguyệt, sân gạch Bát Tràng đỏ au, Cổng Tam Quan treo cờ hội ngũ sắc bay phấp phới (`10 frames`) và **Bia Đá Công Đức** chạm vàng.
4. **Miếu Thần Nông / Tượng Ông Địa (`64x64 px`, 2x2 Tiles):** Miếu gạch đỏ nhỏ dưới gốc đa cổ thụ, đĩa ngũ quả tươi tắn, nén nhang cháy đỏ có làn khói trầm hương uốn lượn bay lên (`12 frames`).
5. **Khu Homestay Sinh Thái (`160x128 px`, 5x4 Tiles):** Nhà sàn gỗ bên hồ sen (Bắc), Nhà rường đèn lồng (Trung), hoặc Bungalow lá dừa ven kênh (Nam) có bàn tiệc bày mâm cỗ 3 miền.
6. **Xe Thương Lái Đột Xuất (`96x64 px`):** Xe công nông đỏ / Xe lam cổ điển chở đầy sọt tre hoặc Ghe bầu thương hồ cập bến sông, có đèn nháy và bảng giá `🔥 x2.5 GIÁ THU MUA!`.
7. **Cột Mốc Check-in & Sổ Lưu Bút Cổng Làng (`64x64 px`):** Cột mốc đá khắc tên nông trại kèm cuốn sổ gỗ đặt trên bệ tre cho khách ký tên.
