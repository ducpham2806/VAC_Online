# TÀI LIỆU TỔNG HỢP HỆ THỐNG GAMEPLAY & KỊCH BẢN (MASTER GDD)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Phiên bản:** Master 3.0 (Hoàn thiện Đặc tả Kỹ thuật Đầy đủ cho Toàn bộ Tính năng Benchmark, Hệ thống Nhân Công Lán Thợ & 5 Tính năng Đột phá Mới)  
**Thể loại:** Hybrid Casual Farm Tycoon & Social Life-Sim RPG  
**Nền tảng lộ trình:** Webgame (HTML5/WebGL) & PWA $\rightarrow$ Mobile App (iOS/Android)  
**Tài liệu liên kết:**
* Kinh tế, IAP, Lương Nhân Công & Chống lạm phát: `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md`
* Kiến trúc Server Realtime & Database: `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md`
* Dữ liệu thông số gốc 140+ thực thể (CSV): `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv`
* Định hướng Pixel Art & Danh mục Diễn hoạt 8–12 Frames: `05_MASTER_ART` & `09_MASTER_ASSET`
* Wireframe & Sơ đồ Luồng toàn game: `06_MASTER_UI_UX` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`

---

## CHƯƠNG 1: TẦM NHÌN, ĐỊNH VỊ & TỐI ƯU HÓA LỐI CHƠI HYBRID

### 1.1. Tầm nhìn Sản phẩm (High Concept)
**"Bỏ phố về quê, gây dựng cơ đồ từ mảnh vườn, bờ ao quê mẹ."**  
Người chơi hóa thân thành một người trẻ rời đô thị ồn ào trở về quê hương (**Bắc Bộ**, **Trung Bộ - Tây Nguyên**, hoặc **Nam Bộ**), tiếp quản mảnh đất hoang hóa của ông bà. Từ vài luống rau, con gà và cái ao nhỏ theo mô hình **Vườn – Ao – Chuồng (VAC)** tuần hoàn, người chơi mở rộng đất đai, thuê bà con lối xóm về phụ việc tại Lán Thợ, sáng tạo ẩm thực 3 miền, diện cổ phục truyền thống, kết nối giao thương liên vùng và trải nghiệm những màn "hái trộm – chó rượt", "đua thuyền đình làng" đầy ắp tiếng cười.

### 1.2. Cơ chế Lối chơi Hybrid (70% Quản lý Nông trại + 30% Nhập vai Đời sống)
1. **Tại Trang trại (Chế độ Quản lý Tycoon – Không tốn Năng lượng):**
   * Góc nhìn `3/4 Top-Down Oblique` trên lưới `32x32 px`. Thao tác **Chạm & Vuốt (Tap & Swipe)** để gieo hạt, tưới nước, thu hoạch, cho vật nuôi ăn và chạy máy chế biến hàng loạt **MIỄN PHÍ 100% NĂNG LƯỢNG (`0 ⚡`)**, chỉ tốn thời gian chờ thực tế (2 phút đến 6 giờ).
   * Từ **Level 14 – 25+**, mở khóa **Lán Thợ Đồng Quê** để thuê 6 Nhân công tự động hóa các khâu lặp lại.
2. **Hoạt động Mở rộng, Khám phá & Tương tác Xã hội (Chế độ RPG – Tốn ⚡ Năng lượng):**
   * Thanh **Năng lượng ("Bát Cơm" ⚡ - Trần cơ bản 50 ⚡, hồi +1 ⚡ mỗi 3 phút)** dùng cho: *Phát cỏ/Đập đá khai hoang, Vét bùn ao, Câu cá thủ công bằng tay, Hái trộm/Câu trộm nhà bạn bè, và Thám hiểm Rừng Trúc & Bãi Bồi Ven Sông*.

---

## CHƯƠNG 2: HỆ THỐNG NHÂN VẬT, 3 VÙNG QUÊ HƯƠNG & KỊCH BẢN MỞ ĐẦU

### 2.1. Khởi tạo Nhân vật & Chọn Quê hương ("Giấy Đăng Ký Về Quê Lập Nghiệp")
* **Tùy chỉnh Nhân vật:** Chọn Giới tính (**Nam** / **Nữ**), đặt tên Nhân vật & tên Trang trại, tùy chọn Kiểu tóc, Khuôn mặt và Bộ trang phục khởi đầu.
* **Chiến lược "70% Tài nguyên Chung – 30% Đặc sản Độc quyền Vùng (10 Bậc)":**

| Tiêu chí | 1. Đồng Bằng & Trung Du Bắc Bộ | 2. Duyên Hải & Cao Nguyên Trung Bộ | 3. Miệt Vườn Sông Nước Nam Bộ |
| :--- | :--- | :--- | :--- |
| **Kiến trúc & Cảnh quan** | Nhà ngói đỏ 3 gian, cổng làng rêu phong, cây đa bến nước, tường gạch Bát Tràng, đồi chè xanh. | Nhà rường gỗ cổ kính / Nhà sàn đất đỏ Bazan, đồi thông, cối xay gió, rặng dừa biển. | Nhà ba gian mái lá/mái ngói ven kênh rạch, cầu khỉ, bến xuồng ba lá, rặng bần. |
| **Thời tiết Đặc trưng** | 4 mùa rõ rệt (Xuân mưa phùn hoa đào, Hạ nắng vàng, Thu cốm mới, Đông sương mù). | Nắng gió rực rỡ, mùa hoa dã quỳ vàng rực và mùa mưa sương giăng. | Nắng ấm quanh năm, có **Mùa Nước Nổi** dâng nước kênh rạch. |
| **Buff Nội tại Vùng** | **Đất Phù Sa Cổ:** Cây lương thực & hoa màu ngắn ngày giảm **10% thời gian chín**. | **Nắng Gió Cao Nguyên:** Máy chế biến & Phơi sấy giảm **10% thời gian sản xuất**. | **Mùa Nước Nổi:** Thủy sản trong Ao và Vịt chạy đồng tăng **10% xác suất rơi sản phẩm phụ**. |

### 2.2. Hồ sơ Nhân vật Phụ (NPC Voice Pillars) & Kịch bản Onboarding (15 Phút Đầu)
* **Dàn NPC Làng Quê:** **Ông Bảy Trưởng Thôn** (Hướng dẫn Tutorial, đổi Dép Tổ Ong, quản lý Đình Làng), **Cô Tư Hậu Tạp Hóa** (Bán giống mồi, thu mua đơn tân thủ), **Anh Ba / Chú Tèo Thợ Mộc** (Xây nhà, nâng kho), **Cô Ba Thợ May** (Dệt lụa, khâu ghép thời trang), cùng **3 NPC Hẹn hò & Kết hôn (10 Tim ❤️)**: *Mai/Minh (Khuyến nông – quản lý Vườn Ươm Đột Biến)*, *Lan/Lâm (Ẩm thực & Gốm)*, *Hùng/Thảo (Thương lái phố thị)*.
* **Onboarding 4 Beats:** Nhận bức thư của Ông Nội rời phố về quê $\rightarrow$ Chọn nhánh thoại định hình tính cách (+5 ⚡, +50 Thiện cảm hoặc +200 Xu) $\rightarrow$ Vuốt liềm dọn cỏ, trồng Lúa, xay cám nuôi Gà Ri, đào Ao thả Cá Rô $\rightarrow$ Tự phối nguyên liệu nấu tô *Canh Cải Cá Rô* đầu tiên trong Bếp Củi để lên Level 2.

---

## CHƯƠNG 3: QUY HOẠCH BẢN ĐỒ & VÒNG ĐỜI TOÀN DIỆN MÔ HÌNH VƯỜN – AO – CHUỒNG (VAC)

### 3.1. Quy hoạch Lưới Bản đồ (`60 x 60 Tiles` – Góc nhìn `3/4 Top-Down Oblique`)
Chia làm **25 Phân khu Mở rộng** với 6 lớp không gian chức năng:
1. `TERRAIN_LAND` (Đất thịt trồng màu, cây ăn quả, chuồng trại, nhà máy).
2. `TERRAIN_WETLAND` (Đất trũng trồng Lúa nước, Rau muống, Đầm Sen, thả Vịt chạy đồng).
3. `TERRAIN_WATER` (Mặt nước Ao/Kênh nuôi 19 loài thủy sản, bắc cầu khỉ, đặt ống trúm lươn, bến câu cá).
4. `TERRAIN_HOUSE_YARD` (Khuôn viên Nhà Chính, Sân phơi, Giếng Làng đá ong, Miếu Thần Nông / Ông Địa, Cột mốc Check-in & Sổ Lưu Bút).
5. `TERRAIN_WORKER_LODGE` (Khu **Lán Thợ & Bàn Ăn Gia Nhân** mở ở Lv 14).
6. `TERRAIN_EXPEDITION_BORDER` (Bìa **Rừng Trúc & Bãi Bồi Ven Sông** ở rìa Đông-Bắc bản đồ – nơi người chơi dùng ⚡ Năng lượng thám hiểm đào măng, bắt cua đá, mò cổ vật).

### 3.2. Vòng Đời 8 Bước Của Nông Sản & Chuỗi Tuần Hoàn Sinh Thái VAC
1. **Nhận Giống:** Cây ruộng gieo 1 thu 2; cây lâu năm mua bầu giống bằng Xu thu hoạch **4 mùa (2 -> 3 -> 4 -> 4 = 13 quả)**.
2. **Làm Đất:** Đất trống quá 24h mọc cỏ dại; vuốt liềm dọn cỏ miễn phí nhận `+1 Rơm + 1 XP`.
3. **Gieo Hạt / Thả Giống:** Mở Radial Menu tại chỗ và vuốt qua các ô đất/ao.
4. **4 Thao tác Chăm Sóc Chủ Động:** (1) *Tưới nước Giếng Làng* (-15% t/g); (2) *Bón Phân Hữu Cơ từ Chuồng* (-30% t/g); (3) *Bón Bùn Phù Sa từ đáy Ao* (+1~2 quả & 30% nổ **Hoàng Kim ⭐**); (4) *Bắt sâu / Chải lông vật nuôi* (+1 Sâu mồi câu & -10% t/g tiêu hóa).
5. **Sinh Trưởng 4 Giai Đoạn Hình Ảnh (Diễn hoạt 8 frames sóng lúa/đung đưa quả)**.
6. **Thu Hoạch & Rơi Đồ Phụ:** 3 phút Ân huệ chống trộm khi vừa chín. Thu hoạch nhận: `100% Nông sản chính` + `10%–30% Nông sản Hoàng Kim ⭐ (giá x2.0)` + `18% Phụ phẩm VAC (Rơm, Thân chuối)` + `4% Vật tư Kho (Gỗ, Ngói, Đinh theo nhóm bất đối xứng A/B/C)` + `0.4%–8.0% Rương Gấm Thời Trang`.

---

## CHƯƠNG 4: ĐẠI DANH MỤC 140+ THỰC THỂ VAC, 10 BẬC ĐẶC SẢN 3 MIỀN & SÁNG TẠO ẨM THỰC

### 4.1. Tổng Quan Đại Danh Mục Thực Thể Toàn Game (Đồng bộ 100% với `04_MASTER_DATA.csv`)
* **🌱 Hệ Thống VƯỜN (`48 Loại Cây Trồng, Cây Lâu Năm & Cây Đột Biến`):**
  * **22 Cây Ruộng Chung (`CROP_01` – `CROP_22`):** *Lúa nước, Rau muống, Ngô nếp, Hành mùi, Cải ngọt, Khoai lang, Đậu tương, Dưa chuột, Mía tím, Lạc, Sả ớt gừng, Đậu xanh, Cà chua/Cà tím, Mướp hương/Khổ qua, Nếp cái hoa vàng, Bầu sao/Bí đao, Khoai môn/Củ sắn, Vừng đen/Hạt sen, Sen đầm nước, Dưa hấu Mai An Tiêm, Nấm rơm/Mộc nhĩ, Hoa nhài/Hoa cúc*.
  * **8 Cây Lâu Năm Chung (`CROP_23` – `CROP_30`):** *Đu đủ, Dừa xiêm, Ổi lê/Hồng xiêm, Chuối tiêu, Xoài cát, Mít Thái, Tre làng/Trúc xanh (thu Măng & Thân tre đan nón cho thợ), Cau & Trầu không (vật phẩm Cưới & Cúng lễ)*.
  * **15 Cây Đặc Sản Độc Quyền 3 Miền (`CROP_N01..S05`)** & **3 Cấp Cây Đột Biến Ngũ Sắc (`CROP_MUT_01..03`)**.
* **🐄 Hệ Thống CHUỒNG & THÚ CƯNG (`19 Loài`):** *Gà Ri, Chim Cút, Vịt cỏ, Thỏ trắng & Bồ câu, Heo Móng Cái, Tằm ăn lá dâu (nhả Kén Tơ Vàng dệt vải may áo thợ & thời trang), Bò vàng/Bò sữa, Ong mật (cho Mật Ong & Phấn Hoa lai giống)* + **6 Vật nuôi Đặc sản 3 Miền** + **5 Thú cưng Canh gác** (*Chó Phú Quốc, Mèo Tam Thể, Ngỗng Trời, Trâu Đen, Chim Sáo Đen biết nói*).
* **🐟 Hệ Thống AO & ĐẦM NƯỚC (`19 Loài`):** *Cá Rô, Tép đồng, Cua đồng/Ốc bươu, Cá Chép, Ếch/Lươn (ống trúm), Cá Trê, Cá Lóc, Trai sông ngậm Ngọc Trai (25% rớt Ngọc Trai chế tác trang sức), Ba Ba, Cá Koi ngũ sắc* + **9 Thủy sản Đặc sản 3 Miền**.

### 4.2. Ma Trận 10 Bậc Sản Vật Đặc Trưng 3 Miền (Đối Xứng Kinh Tế 100%)

| Bậc Mở Khóa | Đặc Sản Miền Bắc | Đặc Sản Miền Trung - Tây Nguyên | Đặc Sản Miền Nam | Thời Gian |
| :--- | :--- | :--- | :--- | :---: |
| **Bậc 1: Rau Đặc Sản (Lv 6)** | Cải Cúc & Su Hào (`CROP_N01`) | Tỏi Lý Sơn & Ớt Xiêm (`CROP_C01`) | Bông Điên Điển & Bông Súng (`CROP_S01`) | **25 phút** |
| **Bậc 2: Cây Trung Hạn (Lv 10)** | Chè Tân Cương Thái Nguyên (`CROP_N02`) | Thanh Long Ruột Đỏ (`CROP_C02`) | Khóm (Dứa) Cầu Đúc (`CROP_S02`) | **2.5 giờ** |
| **Bậc 3: Chuồng Đặc Sản 1 (Lv 14)** | Gà Đông Tảo Hưng Yên (`ANI_N01`) | Dê Núi & Cừu Ninh Thuận (`ANI_C01`) | Vịt Đồng Lòng Đỏ Son (`ANI_S01`) | **1 giờ** |
| **Bậc 4: Ao Đặc Sản 1 (Lv 15)** | Cá Trắm Đen Vũ Đại (`AQUA_N01`) | Cá Bống Sông Trà & Tôm Sú (`AQUA_C01`) | Cá Tra, Basa & Cá Linh (`AQUA_S01`) | **2.5 giờ** |
| **Bậc 5: Trái Cây Quý 1 (Lv 16)** | Vải Thiều Thanh Hà (`CROP_N03`) | Giàn Nho Ninh Thuận (`CROP_C03`) | Măng Cụt Lái Thiêu (`CROP_S03`) | **4 giờ** |
| **Bậc 6: Trái Cây Quý 2 (Lv 18)** | Nhãn Lồng & Mận Hậu (`CROP_N04`) | Hồ Tiêu Chư Sê & Điều Đỏ (`CROP_C04`) | Vú Sữa Lò Rèn & Chôm Chôm (`CROP_S04`) | **4 giờ 40p** |
| **Bậc 7: Chuồng VIP (Lv 21)** | Lợn Bản Cắp Nách / Bò Mông (`ANI_N02`) | Hươu Sao Hương Sơn Lấy Nhung (`ANI_C02`) | Nhà Nuôi Chim Yến Miệt Vườn (`ANI_S02`) | **2.5 giờ** |
| **Bậc 8: Ao Đặc Sản 2 (Lv 21)** | Cá Anh Vũ & Cá Lăng Sông Đà (`AQUA_N02`) | Cá Chình & Ghẹ Đầm Ô Loan (`AQUA_C02`) | Cá Tai Tượng & Cá Kèo (`AQUA_S02`) | **3 giờ 15p** |
| **Bậc 9: Đại Đặc Sản Vườn (Lv 22)** | Bưởi Diễn & Đào Nhật Tân (`CROP_N05`) | Cà Phê Buôn Ma Thuột (`CROP_C05`) | Sầu Riêng Ri6 & Dừa Sáp (`CROP_S05`) | **5.5 giờ** |
| **Bậc 10: Thủy Sản VIP (Lv 26)** | Rươi Tứ Kỳ Hải Dương (`AQUA_N03`) | Tôm Hùm Bông Phú Yên (`AQUA_C03`) | Tôm Càng Xanh & Cua Cà Mau (`AQUA_S03`) | **4 giờ** |

### 4.3. Hệ Thống 8 Xưởng Sản Xuất & Cơ Chế Nấu Ăn Ngẫu Nhiên ("Thử Tài Bếp Quê")
* **8 Xưởng (`MAC_01` – `MAC_08`):** (1) *Cối Xay Cám & Ủ Mồi*, (2) *Bếp Củi Quê Mẹ*, (3) *Lò Làm Đậu & Bánh Dân Gian*, (4) *Quán Nước Đầu Làng*, (5) *Quầy Bún – Phở – Lẩu*, (6) *Xưởng Muối Dưa & Đồ Khô*, (7) *Lò Gốm & Đan Lát Thủ Công*, (8) *Khung Cửi Dệt Lụa Tơ Tằm & Chế Tác Trang Sức*.
* **Nấu Ăn Ngẫu Nhiên (Alchemy Cooking):** Tự do bỏ 3–4 nguyên liệu vào *Nồi Đất Thử Nghiệm* (kèm mini-game quạt than 3s) trả về 5 kết quả: **Mở khóa công thức bí truyền mới (`100%` lần đầu, thưởng `+10 💎 + 50 XP`)**, **Đột biến Mỹ Vị Tiến Vua (`15%–35%`, giá bán x2.0)**, **Món ngon theo Tag (`60%`)**, **Món độc lạ bán cho Chú Tèo giá x2 (`15%`)**, hoặc **Đĩa Cơm Khê (`5%`, dùng ủ làm Phân Bón Siêu Tốc +40% tốc độ cây)**.

---

## CHƯƠNG 5: HỆ THỐNG THUÊ NHÂN CÔNG & NGƯỜI GIÚP VIỆC ("LÁN THỢ ĐỒNG QUÊ & GIA NHÂN")

Mở khóa từ **Level 14 – 25+**, giúp người chơi tự động hóa trang trại lớn đồng thời tạo ra **4 Vòng Lặp Tiêu Tiền & Tiêu Thụ Sản Phẩm (`Gold + Food + Cloth + Bonus Sink`)**:
1. **6 Vị Trí Nhân Công (`WORK_01` – `WORK_06`):**
   * `WORK_01` **Chú Tư Cày (Lv 14 - `800 🪙/ngày`):** Tự gieo hạt, tưới nước Giếng, bắt sâu & thu hoạch Vườn (chờ đúng **5 phút sau khi chín** mới thu để chừa **2 phút cửa sổ vàng** cho bạn bè rình hái trộm!).
   * `WORK_02` **Cô Năm Thảo (Lv 16 - `1.100 🪙/ngày`):** Tự xay cám, cho Chuồng ăn, chải lông & thu Trứng/Sữa/Kén Tơ/Phân Hữu Cơ.
   * `WORK_03` **Anh Sáu Kình (Lv 18 - `1.500 🪙/ngày`):** Tự ủ mồi, kéo lưới Ao Cá & **tự động Vét Bùn Ao (Miễn phí ⚡ chủ nhà!)**.
   * `WORK_04` **Dì Bảy Bếp (Lv 20 - `2.000 🪙/ngày`):** Tự chạy 8 Nhà máy & tự nấu **Mâm Cơm Thợ** dọn ra Bàn Ăn Lán Thợ.
   * `WORK_05` **Chú Tám Mộc (Lv 22 - `2.600 🪙/ngày`):** Tự bón Bùn Phù Sa cho 18 Cây Lâu Năm (tăng nổ Hoàng Kim ⭐) & cưa cây già.
   * `WORK_06` **Ông Quản Gia Cửu (Lv 25 - `3.500 🪙/ngày` hoặc Miễn phí với Thẻ Tháng VIP):** Điều phối cả 5 thợ, tự phát lương/cơm/áo mới & đóng thùng Tàu Hỏa.
2. **Cơ Chế Duy Trì:** Phải dọn món ăn lên **Bàn Ăn Lán Thợ** mỗi bữa trưa (`12:00`) & chiều (`18:00`) để hồi `Belly_Points`; cấp phát **Áo Quần Bảo Hộ (`CRAFT_01` – `CRAFT_04`, độ bền 72 giờ)** để tăng `+15% -> +25%` tốc độ; toàn bộ đồ thu được cất vào **Giỏ Kho Lán Thợ (`60–150 ô riêng`)** không làm đầy Kho chính.

---

## CHƯƠNG 6: ĐẶC TẢ CHI TIẾT 12 TÍNH NĂNG BENCHMARK THỊ TRƯỜNG & ĐỀ XUẤT ĐỘT PHÁ MỚI (FULL FEATURE SPECIFICATIONS)

Dưới đây là quy cách thiết kế đầy đủ (Inputs, Outputs, Công thức, Điều kiện mở khóa và Tác động kinh tế – đã đồng bộ vào `04_MASTER_DATA.csv`) cho toàn bộ 12 tính năng nâng cao:

---

### 6.1. Tính Năng 1: Thương Lái Thu Mua Đột Xuất – "Cơn Sốt Nông Sản Trong Ngày" (`BM_BOOM_01` – Mở Lv 9)
* **Nguồn cảm hứng:** *Stalk Market (Cổ phiếu Củ Cải)* của *Animal Crossing: New Horizons*.
* **Cơ chế Vận hành Đầy đủ:**
  * Mỗi ngày vào 2 ca (**Ca Sáng `09:00 – 12:00`** và **Ca Tối `20:00 – 23:00`**), xe tải nhỏ của **Thương Lái Phố Thị** đỗ trước cổng nông trại của mỗi người chơi.
  * Hệ thống quay ngẫu nhiên **1 Mặt Hàng Nông Sản / Món Ăn** và **1 Hệ Số Giá Thu Mua (`Multiplier` từ `1.5x` đến `3.0x Base_Price`)** riêng biệt cho từng tài khoản!
  * **Tương tác Cộng đồng (Social Arbitrage):**
    * Nếu nhà Người chơi A quay trúng hệ số đỉnh **`x2.8 – x3.0`** cho mặt hàng *Sầu Riêng Ri6* hoặc *Cá Trắm Đen*, Người chơi A bấm nút **[📢 Rao Lên Kênh Làng / Hợp Tác Xã]** (Miễn phí).
    * Bạn bè và người chơi khác trên Server bấm vào thẻ rao sẽ bay thẳng sang nhà A để bán *Sầu Riêng / Cá Trắm* cho xe tải nhà A (Giới hạn mỗi khách bán tối đa **20 đơn vị/ca**, mỗi xe tải thu mua tối đa **200 đơn vị/ca**).
    * **Phần thưởng Chủ nhà:** Chủ nhà A nhận ngay **+5% Hoa Hồng Môi Giới bằng Xu Vàng** + **+1 Điểm Nghĩa Xóm** trên mỗi giao dịch của khách! (Nếu nuôi *Chim Sáo Đen Biết Nói `PET_04`*, chim sáo sẽ báo trước mặt hàng Thương lái sắp mua từ 30 phút trước!).

---

### 6.2. Tính Năng 2: Vườn Ươm Chiết Cành – Lai Tạo Giống Cây Đột Biến Ngũ Sắc (`CROP_MUT_01..03` – Mở Lv 17)
* **Nguồn cảm hứng:** Cơ chế nâng cấp chậu & lai hạt giống của *Khu Vườn Trên Mây (Zing Me)* & *Story of Seasons: AWL*.
* **Cơ chế Vận hành Đầy đủ:**
  * Tại góc vườn có **Lán Khuyến Nông của Cô Mai / Anh Minh** với 2 Bàn Chiết Ghép.
  * **Công thức Lai tạo & Xác suất Thành công (Có Bảo Hiểm Pity):**

| Mã Giống Đột Biến | Tên Giống Đột Biến | Công Thức Ghép Đầu Vào | Phí Ghép (Xu) | Tỷ Lệ Thành Công | Sản Phẩm Khi Thành Công | Kết Quả Khi Thất Bại (Không Bao Giờ Mất Trắng!) |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| `CROP_MUT_01` | **🌾 Lúa Tím Thảo Dược** | `2 Lúa Nếp Hoa Vàng + 1 Phấn Hoa Ong Mật` | `2.000 🪙` | **35%**<br>*(Pity: 3 lần chắc chắn nổ)* | Hạt giống Lúa Tím phát sáng (Bán `190 🪙/bó`, nấu *Cơm Tím Dưỡng Sinh hồi +35 ⚡*) | Nhận lại **2 Túi Phân Bón Siêu Tốc (+40% tốc độ cây)** + `15 XP`. |
| `CROP_MUT_02` | **🍉 Dưa Hấu Vuông Tài Lộc** | `2 Dưa Hấu Mai An Tiêm + 1 Xô Bùn Phù Sa` | `4.000 🪙` | **25%**<br>*(Pity: 4 lần chắc chắn nổ)* | Dưa Hấu Vuông khắc chữ vàng (Bán `300 🪙/quả` hoặc trưng bày sân nhà `+50 Mỹ Quan`) | Nhận lại **1 Giỏ Trái Cây Đãi Thợ (+60 Độ No)** + `25 XP`. |
| `CROP_MUT_03` | **🍐 Bưởi Hồ Lô & Sen Nghìn Cánh** | `1 Bưởi Diễn/Sen + 1 Mật Ong Rừng + 1 Bùn Ao` | `8.000 🪙` | **15%**<br>*(Pity: 6 lần chắc chắn nổ)* | Đại Đặc Sản Đột Biến phát hào quang (Bán `480 🪙`, lên thẳng **Loa Phường Toàn Server**!) | Nhận lại **1 Vé Đập Niêu Gacha** + `40 XP`. |

---

### 6.3. Tính Năng 3: Trùng Tu Đình Làng Cổ Kính & Sổ Vàng Công Đức (`BM_DINH_01..03` – Mở Lv 11)
* **Nguồn cảm hứng:** *Community Center Bundles (Nhà Văn Hóa)* của *Stardew Valley*.
* **Cơ chế Vận hành Đầy đủ:**
  * Ngôi **Đình Làng Cổ Kính** bị hư hại sau trận bão xưa, chia làm **3 Giai đoạn Trùng Tu** (mỗi giai đoạn gồm 4 Gói Sản Vật yêu cầu nông sản Vườn – Ao – Chuồng và Đặc sản 3 Miền):
    1. **Bậc 1 – Khôi phục Cổng Tam Quan (`Lv 11`, Phí công đức `5.000 🪙` + Gói Nông sản sơ cấp):** Mở khóa **Gánh Hàng Rong** ghé thăm cổng làng thường xuyên gấp đôi + Thưởng `20 💎 Ngọc`.
    2. **Bậc 2 – Khôi phục Sân Đình & Thủy Đình (`Lv 16`, Phí `15.000 🪙` + Gói Đặc sản 3 Miền):** Mở khóa **Giàn Đập Niêu Đất Gacha** và **Sân Khấu Hội Thi Duyên Dáng Làng Quê** + Thưởng `50 💎 Ngọc`.
    3. **Bậc 3 – Khôi phục Đại Đình & Bia Đá Công Đức (`Lv 23`, Phí `50.000 🪙` + Gói Đại Tiệc Tiến Vua):** Khắc tên người chơi lên **Bia Đá Công Đức Toàn Server**, nhận **Danh hiệu "Bậc Tiên Chỉ Làng Quê"** và kích hoạt **Buff Vĩnh Viễn: +5% Sản lượng & +5% Xu trên toàn trang trại**!

---

### 6.4. Tính Năng 4: Miếu Thần Nông / Tượng Ông Địa Cười Tươi – Rút Quẻ Xăm Đầu Ngày (`BM_TOTEM_01..04` – Mở Lv 8)
* **Nguồn cảm hứng:** Tín ngưỡng thờ Thần Nông / Ông Địa dân gian Việt Nam kết hợp *Statue of Perfection* (*Stardew Valley*).
* **Cơ chế Vận hành Đầy đủ:**
  * Mỗi sáng (sau khi xé Lịch Bloc), người chơi đặt **1 Lễ Vật Nhỏ** (*1 Trái cây tươi, 1 Ly Cà phê sữa, 1 Bánh chưng, hoặc 1 Ấm trà xanh*) lên bàn lễ trước **Miếu Thần Nông / Tượng Ông Địa** ở góc sân.
  * Ông Địa cười lớn *"Hahaha!"* (Animation 8 frames quạt mo cau), lắc ống xăm tre và ban cho người chơi **1 trong 4 Quẻ Đại Cát (Hiệu lực suốt 24 giờ)**:
    * 🌸 **Quẻ Đại Cát Mùa Vụ (`BM_TOTEM_01`):** Tăng **+20% xác suất nổ Nông sản Hoàng Kim ⭐** khi thu hoạch Vườn & Ao hôm nay.
    * 🪙 **Quẻ Tài Lộc Chợ Phiên (`BM_TOTEM_02`):** Tăng **+10% Xu Vàng** nhận được từ mọi Đơn hàng Hợp Tác Xã & Khách làng hôm nay.
    * 🐕 **Quẻ An Ninh Thôn Xóm (`BM_TOTEM_03`):** Chó Phú Quốc và Đàn Ngỗng tăng thêm **+15% tỷ lệ bắt trộm** suốt 24 giờ.
    * 🍚 **Quẻ Gia Nhân Hăng Say (`BM_TOTEM_04`):** Toàn bộ Nhân công trong Lán Thợ giảm **30% tốc độ đói bụng** và tăng **+15% tốc độ làm việc** hôm nay!

---

### 6.5. Tính Năng 5: Hệ Thống Thời Tiết Động & Sự Kiện "Lá Lành Đùm Lá Rách" Sau Mưa Bão (`NEW_RELIEF_01`)
* **Chu kỳ Thời tiết Server (Thay đổi mỗi 4 giờ, dự báo trước trên tờ Lịch Bloc):**
  1. ☀️ **Nắng Vàng Rực Rỡ (50% thời gian):** Cây công nghiệp (Cà phê, Mía, Thanh long) & Xưởng Đồ Khô/Lò Gốm tăng **+10% tốc độ**.
  2. 🌧️ **Mưa Rào Mùa Hạ (25% thời gian):** **Tự động tưới nước miễn phí 100% ô ruộng trên bản đồ!** Đồng thời kích hoạt mọc thêm *Nấm Rơm & Măng Tre* ở bìa rừng.
  3. 🌊 **Mùa Nước Nổi (15% thời gian - Sự kiện 3 ngày/tháng):** Thủy sản Ao & Vịt chạy đồng tăng **+20% tốc độ lớn**, xuất hiện *Cá Linh Non & Bông Điên Điển* dày đặc.
  4. ⛈️ **Cơn Giông Ngắn & Sự Kiện Nhân Văn "Lá Lành Đùm Lá Rách" (`NEW_RELIEF_01` - 10% thời gian):**
     * Sau cơn giông 15 phút, cây trồng **không bao giờ bị chết**, nhưng có 2–3 giàn bầu/cây ăn trái trên vườn bị **"Nghiêng Giàn Tre"**.
     * Chủ nhà có thể tự dựng lại (`0 ⚡`) HOẶC bấm **[🆘 Nhờ Hàng Xóm Dựng Giúp]**: Khi bạn bè sang bấm dựng lại giàn tre giúp bạn, bạn bè nhận ngay **`+30 🪙 Xu + 2 Điểm Nghĩa Xóm`**, còn cây vừa được dựng dậy sẽ nhận **Buff "Vươn Lên Sau Bão": Tăng +20% sản lượng ở vụ đó**!

---

### 6.6. Tính Năng 6: Hội Làng Đua Thuyền Rồng Hợp Tác Xã Cuối Tuần (`BM_DERBY_01` – Mở Lv 13)
* **Nguồn cảm hứng:** *Neighborhood Derby* (*Hay Day*).
* **Cơ chế Vận hành Đầy đủ:**
  * Diễn ra từ **`08:00 Thứ Sáu` đến `22:00 Chủ Nhật`** hàng tuần trên dòng sông trước Đình Làng.
  * Mỗi Hợp Tác Xã (Bang hội 30 người) sở hữu 1 chiếc **Thuyền Rồng / Ghe Ngo**.
  * Trên bảng nhiệm vụ Đua Thuyền có 12 thẻ nhiệm vụ chung (VD: *Gặt 200 bó Lúa, Kéo lưới 30 con Cá Trắm, Nấu 10 nồi Bún Riêu, Hái trộm thành công 15 lần, Cho Nhân công ăn 20 bữa*).
  * Mỗi thành viên được nhận tối đa **5 Nhiệm vụ/tuần** (mỗi nhiệm vụ đẩy thuyền tiến lên `50m – 150m`). Đặc biệt, vào **Khung giờ Trống Hội (`20:00 tối Thứ Bảy & Chủ Nhật`)**, nếu từ 5 thành viên trở lên cùng online bấm **[🥁 Đánh Trống Chèo Đều Tay]**, tốc độ thuyền được nhân đôi (`x2`)!
  * **Phần thưởng Cuối tuần:** Đạt các cột mốc `500m – 1.500m – 3.000m` mở 3 Rương Bang Hội; Top 3 Hợp Tác Xã về đích đầu tiên nhận **Cúp Vàng Đình Làng + 100 💎 Ngọc + Hạt Giống Đột Biến Ngũ Sắc**!

---

### 6.7. Tính Năng 7: Hội Thi Thời Trang "Duyên Dáng Làng Quê" Hàng Tuần (`BM_FASHION_01` – Mở Lv 10)
* **Nguồn cảm hứng:** *Love Nikki (Ngôi Sao Thời Trang)* & *Play Together Fashion Contest*.
* **Cơ chế Vận hành:** Mỗi tuần Sân Đình công bố **1 Chủ Đề Phối Đồ** (VD: *"Nét Đẹp Ngày Mùa"*, *"Cổ Phục Ba Miền"*, *"Đạo Chích Hài Hước Nhất Làng"*). Người chơi mặc 12 Slots thời trang, chọn biểu cảm (Pose) và bấm nộp ảnh dự thi. Mỗi ngày người chơi khác vào chấm điểm 5 cặp ảnh nhận `+30 🪙/lần`. Top 3 người đạt nhiều tim nhất tuần được **dựng Tượng Đồng vinh danh ngay cổng Chợ Chung Liên Vùng suốt 7 ngày** kèm Vương Miện SSR & `150 💎 Ngọc`!

---

### 6.8. Tính Năng 8 (MỚI): Bản Đồ Thám Hiểm "Rừng Trúc & Bãi Bồi Ven Sông" (`NEW_EXP_01` – Mở Lv 11)
* **Nguồn cảm hứng:** *Family Island* & *Coral Island Foraging*.
* **Mục đích:** Tạo nơi **đốt ⚡ Năng lượng (Stamina) dư thừa** cực kỳ cuốn hút khi người chơi đã khai hoang xong đất chính và đang chờ cây trồng chín!
* **Cơ chế Vận hành:**
  * Ngay sát rìa Đông-Bắc của nông trại là cây cầu tre dẫn sang **Khu Rừng Trúc & Bãi Bồi Ven Sông** (Tự động làm mới tài nguyên mỗi **6 giờ**).
  * Người chơi dùng `5 ⚡ – 15 ⚡ Năng lượng` để tương tác với các điểm tài nguyên tự nhiên:
    * **Đào Măng Rừng & Hái Nấm Hương (`-5 ⚡`):** Nhận *Măng tươi, Nấm rừng, Củ nâu nhuộm vải*.
    * **Lật Đá Bãi Bồi Bắt Cua Đá & Ốc Suối (`-8 ⚡`):** Nhận *Cua đá, Ốc suối, Đất sét Bát Tràng*.
    * **Mò Rương Trầm Tích Bến Sông (`-12 ⚡`):** Chắc chắn nhận **1 Mảnh Kỷ Vật Tuổi Thơ / Cổ Vật Đáy Ao** (để trưng bày Tủ Kính Nhà Chính nhận 100 💎) + Xác suất 15% nổ **Rương Gấm Thời Trang**!

---

### 6.9. Tính Năng 9 (MỚI): Chợ Đêm & Quầy Ẩm Thực Đường Phố Cuối Tuần (`NEW_NIGHT_01` – Mở Lv 15)
* **Nguồn cảm hứng:** *Dave the Diver (Bancho Sushi Night Service)* & *Touhou Mystia's Izakaya*.
* **Cơ chế Vận hành:**
  * Mở cửa vào mỗi tối **Thứ Bảy & Chủ Nhật (`19:00 – 23:00`)** tại khu phố đèn lồng bên cạnh Đình Làng.
  * Người chơi chọn **5 Món Ăn & Thức Uống ngon nhất** mình đã nấu sẵn trong Kho mang ra bày lên **Quầy Hàng Đêm Đèn Lồng**.
  * Trong phiên mở bán **3 phút (Mini-game Phục Vụ Thực Khách Sành Ăn)**: Các NPC thực khách và hình đại diện của người chơi khác đi dạo qua gọi món theo sở thích (VD: *"Cho tôi 1 món cay nồng miền Trung và 1 ly giải khát mát lạnh!"*).
  * Người chơi chạm chọn đúng món giao nhanh tạo **Chuỗi Phục Vụ Hoàn Hảo (Combo Streak x2, x3)** $\rightarrow$ Bán toàn bộ món ăn với giá cao gấp **`1.8x Base_Price` (Miễn thuế!)** kèm tiền Tip là **Vé Số Kiến Thiết & Ngọc Lục Bảo**!

---

### 6.10. Tính Năng 10 (MỚI): Cột Mốc Check-in, Chế Độ Chụp Ảnh & Sổ Lưu Bút Cổng Làng (`NEW_GUEST_01` – Mở Lv 7)
* **Nguồn cảm hứng:** *Animal Crossing Guestbook* & *Play Together Photo Mode*.
* **Cơ chế Vận hành:**
  * Trước cổng mỗi trang trại có **Cột Mốc Cây Đa & Cuốn Sổ Lưu Bút Gỗ**.
  * Khi bạn bè sang thăm nhà (hoặc sau khi hái trộm / tưới nước xong!), họ có thể đứng cạnh chủ nhà bấm **[📸 Chụp Ảnh Check-in & ✍️ Ký Lưu Bút]**:
    * Để lại 1 dòng nhắn (hoặc 1 Sticker hài hước như *"Nhà đẹp quá nhưng Sầu riêng hơi chua nha haha!"*) gắn thẳng lên Sổ Lưu Bút của chủ nhà.
    * **Phần thưởng Đôi Bên (Tối đa 10 khách ký/ngày):** Chủ nhà nhận ngay **`+10 Điểm Mỹ Quan + 20 🪙 Xu`** mỗi lượt khách ký; Khách ký nhận **`+15 🪙 Xu + 3 XP`**!

---

### 6.11. Tính Năng 11 & 12: Khu Du Lịch Sinh Thái Homestay (`BM_HOME_01..02` – Lv 26) & Lễ Cưới Quê – Gia Bảo Truyền Đời (`NEW_HEIR_01` – Lv 28)
* **Khu Du Lịch Sinh Thái Homestay (`BM_HOME_01` Nhà Sàn Tre & `BM_HOME_02` Biệt Thự Đầm Sen):**
  * Khi đạt **Level 26** và có từ **500 Điểm Mỹ Quan** trở lên, người chơi mở khóa khu **Đảo Nổi Homestay** đón khách du lịch từ thành phố về nghỉ dưỡng (Mỗi đoàn khách ở trong `6 giờ`, tiêu thụ 2–4 *Món Ăn Đại Tiệc 3 Miền*).
  * Khi đoàn khách trả phòng: Thu về **`650 – 1.600 🪙 Xu Vàng` + `20–50 Điểm Danh Vọng` + `10%–25% rớt Quà Phố Thị (Ngọc / Vé Gacha / Rương Thời Trang SR-SSR)`**!
* **Lễ Cưới Quê & Truyền Nghề Con Cái ("Gia Bảo Truyền Đời" – `NEW_HEIR_01` Mở Lv 28):**
  * Lấy cảm hứng từ *Harvest Moon: A Wonderful Life* & *Rune Factory*: Khi đạt **10 Tim ❤️** với 1 NPC hẹn hò (*Mai/Minh, Lan/Lâm, Hùng/Thảo*) hoặc với 1 người chơi khác, người chơi dùng **10 Buồng Cau Trầu (`CROP_30`) + Đôi Nhẫn Vàng** tổ chức **Lễ Rước Dâu Truyền Thống** (được thông báo lên Loa Phường Toàn Server!).
  * Sau khi kết hôn: Bạn đời dọn về Nhà Chính, mỗi sáng nấu tặng **1 Mâm Cơm Sáng (`+30 ⚡ Năng lượng miễn phí`)**. Sau 14 ngày kết hôn, gia đình đón thêm **Em Bé Làng Quê** lớn lên thành **Tiểu Đồng Đáng Yêu** chạy lon ton quanh sân, tự động nhặt giúp toàn bộ Trứng/Sữa/Trái cây rơi và mở khóa **Tủ Gia Bảo Truyền Đời (+10% XP toàn trang trại vĩnh viễn)**!
