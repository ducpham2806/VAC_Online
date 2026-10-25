# TÀI LIỆU KIẾN TRÚC KINH TẾ, ĐỊNH GIÁ GÓI IAP, LƯƠNG NHÂN CÔNG & CƠ CHẾ CHỐNG LẠM PHÁT (MASTER ECONOMY & MONETIZATION SPEC)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Mã tài liệu:** `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md`  
**Phiên bản:** Master Economy 5.0 (Hoàn thiện Toán học Kinh tế cho chuẩn 155 Thực thể, 6 Nhân Công Lán Thợ & 12 Tính năng Benchmark / IAP)  
**Thực hiện bởi:** `@economy-designer` & `@game-designer`

---

## PHẦN 1: BÁO CÁO KIỂM TOÁN RỦI RO LẠM PHÁT & 6 VAN KHÓA KINH TẾ (ANTI-INFLATION AUDIT)

| STT | Lỗ Hổng Tiềm Ẩn (Inflation Risk) | Giải Pháp Khóa Chặt Của `@economy-designer` (Áp dụng trong Master 4.0) |
| :---: | :--- | :--- |
| **1** | **Đổi Ngọc (Hard) ra Xu Vàng (Soft)** | 🔒 **Quy đổi Động theo Level ($\text{Xu} = 35 + 12 \times \text{Level}$, trần `400 Xu / 1 💎`)** + **CẤM tuyệt đối đổi ngược từ Xu sang Ngọc**. |
| **2** | **In tiền từ "Bắt Trộm Rớt Xu" & "Xin Vía"** | 🔒 **Zero-Sum Transfer:** Xu rớt ra khi bị Chó/Ngỗng/Bẫy bắt (`30–60 Xu`) **trừ trực tiếp từ Ví kẻ trộm** (khấu trừ 10% thuế hệ thống). Quỹ Xin Vía Loa Phường & Độc Đắc Xổ Số trích từ **Quỹ Thuế Chợ 10%**. |
| **3** | **Lạm phát & Chuyển tiền lậu qua Chợ P2P** | 🔒 **Khung Giá Chặt (`0.8x -> 2.0x Giá Gốc`) + Thuế Chợ Đốt Tiền `10%` + Ẩn Tên Người Bán trên Báo Chợ.** |
| **4** | **Dư thừa Nông sản, Món ăn & Xu Vàng khi người chơi lên Cấp Cao (Lv 14 – 30+)** | 🔒 **Hệ thống "Lán Thợ Đồng Quê" (4 Tầng Sink Liên Hoàn):** Thuê 1–6 Nhân công tiêu thụ **`13.900 – 16.700 Xu/ngày`** qua: *Trả lương cứng + Nấu 2 bữa Cơm Thợ/ngày + Cấp phát Áo Quần Bảo Hộ (hao mòn 72h) + Thưởng Phụ Cấp Ngày Mùa*. |
| **5** | **Lạm phát từ 12 Tính năng Benchmark & Đột phá mới (Thương lái, Chợ Đêm, Homestay)** | 🔒 **Cơ chế "Đổi Tài Nguyên Lấy Giá Trị Cao" (Resource-to-Reward Conversion):**<br>• **Thương Lái Giá Cao (`1.5x–3.0x`) & Chợ Đêm (`1.8x`):** Không sinh ra từ không khí mà **tiêu hủy trực tiếp hàng trăm nông sản/món ăn** khỏi kho của người chơi (Giới hạn tối đa 200 đơn vị/ca).<br>• **Vườn Ươm Đột Biến (`2.000–8.000 🪙/lần`), Trùng Tu Đình Làng (`70.000 🪙`), Xây Homestay (`165.000 🪙`) & Lễ Cưới (`50.000 🪙`):** Đóng vai trò là các **Đại Dự Án Hút Xu (Mega Gold Sinks)** ở giai đoạn giữa và cuối game! |
| **6** | **Dư thừa Ngọc miễn phí từ Thành Tựu (600 mốc)** | 🔒 Bậc 1–2 (Đồng, Bạc) thưởng **Xu + Danh Vọng + Vé Gacha thường**; chỉ từ **Bậc 3–5 (Vàng, Bạch Kim, Huyền Thoại)** mới thưởng **💎 Ngọc**. |

---

## PHẦN 2: HỆ THỐNG TIỀN TỆ & TỶ GIÁ NEO CHUẨN (CURRENCY PEGGING MATHEMATICS)

* **Tỷ giá Neo Cơ Sở:** **`1.000 VNĐ = 5 💎 Ngọc`** (`1 💎 = 200 VNĐ`).
* **Chi phí Ngọc Bỏ Qua Thời Gian Chờ:** $\text{Cost}(T_{\text{phút}}) = \text{Ceil}\left( 0.8 \times T^{0.62} \right)$.
* **Chi phí Mua Năng Lượng (+50 ⚡) Lũy Tiến Trong Ngày:** Lần 1: `10 💎` $\rightarrow$ Lần 2: `15 💎` $\rightarrow$ Lần 3: `25 💎` $\rightarrow$ Lần 4–5: `40 💎`.
* **Quy đổi Động `1 💎 Ngọc -> 🪙 Xu Vàng` Theo Cấp Độ:** $\text{Xu} = \min(400, 35 + 12 \times \text{Level})$.
* **Mua Thiếu Vật Tư Ngay Lập Tức (Just-in-Time Buy):** Vật tư nâng cấp Kho (`8 💎/món`), Vật tư khai hoang (`6 💎/món`).

---

## PHẦN 3: TOÁN HỌC CÂN BẰNG HỆ THỐNG THUÊ NHÂN CÔNG ("LÁN THỢ ĐỒNG QUÊ")

$$\text{Chi Phí Duy Trì 1 Nhân Công / Ngày} = \text{Lương Cứng (Xu)} + \text{2 Bữa Cơm Thợ (Món Ăn)} + \text{Hao Mòn Áo Quần (72h)} + \text{Phụ Cấp Thưởng}$$

| Mã ID | Tên Nhân Công & Chuyên Môn | Cấp Mở | Lương 1 Ngày | Hợp Đồng 3 Ngày (-12%) | Tiêu Thụ "Mâm Cơm Thợ" / Ngày | Hao Mòn Áo Quần / 3 Ngày | Phụ Cấp Hăng Say (+25% Tốc Độ) | Tổng Giá Trị Hút Khỏi Kinh Tế / Ngày |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :---: |
| `WORK_01` | **🌾 Chú Tư Cày** *(Làm vườn)* | **Lv 14** | **800 🪙** | **2.100 🪙** | `60 Độ No` (~140 🪙) | *Nón Lá + Áo Nâu* (~60 🪙/ngày) | **+200 🪙** *(Hoặc Trà Đá)* | **~1.000 – 1.200 🪙** |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn nuôi)* | **Lv 16** | **1.100 🪙** | **2.900 🪙** | `75 Độ No` (~180 🪙) | *Khăn Rằn + Áo Bà Ba* (~80 🪙/ngày) | **+300 🪙** *(Hoặc Bánh Cuốn)* | **~1.360 – 1.660 🪙** |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Ao cá & Vét bùn)* | **Lv 18** | **1.500 🪙** | **4.000 🪙** | `90 Độ No` (~240 🪙) | *Áo Tơi + Ủng Cao Su* (~110 🪙/ngày) | **+400 🪙** *(Hoặc Ốc Hấp)* | **~1.850 – 2.250 🪙** |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Chạy máy & Nấu cơm)* | **Lv 20** | **2.000 🪙** | **5.400 🪙** | `100 Độ No` (~290 🪙) | *Tạp Dề Hoa Sen* (~140 🪙/ngày) | **+500 🪙** *(Hoặc Cốm Vòng)* | **~2.430 – 2.930 🪙** |
| `WORK_05` | **🪵 Chú Tám Mộc** *(18 Cây lâu năm)* | **Lv 22** | **2.600 🪙** | **7.000 🪙** | `120 Độ No` (~360 🪙) | *Mũ Cối + Áo Chàm* (~180 🪙/ngày) | **+650 🪙** *(Hoặc Bánh Pía)* | **~3.140 – 3.790 🪙** |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng quản VIP)* | **Lv 25** | **3.500 🪙** *(Free VIP)* | **9.200 🪙** | `140 Độ No` (~420 🪙) | *Áo Dài Ngũ Thân Lụa* (~220 🪙/ngày) | **+800 🪙** *(Hoặc Chè 3 Miền)* | **~4.140 – 4.940 🪙** |

---

## PHẦN 4: BẢNG CÂN BẰNG KINH TẾ CHO 12 TÍNH NĂNG BENCHMARK & ĐỀ XUẤT MỚI

Để đảm bảo mọi tính năng học hỏi từ thị trường đều có **Đầu vào (Cost / Sink)** và **Đầu ra (Reward / Source)** định lượng rõ ràng, không gây lạm phát:

| Mã Tính Năng | Tên Tính Năng Benchmark / Mới | Cấp Mở | Chi Phí Đầu Vào / Điều Kiện Tham Gia (Sinks) | Phần Thưởng & Lợi Ích Kinh Tế Đầu Ra (Rewards) | Vai Trò Điều Tiết Vĩ Mô |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `BM_BOOM_01` | **Thương Lái Đột Xuất (09:00 & 20:00)** | Lv 9 | Nộp Nông sản / Món ăn khớp yêu cầu (Tối đa 20 món/khách, 200 món/xe). | Bán được giá **`1.5x -> 3.0x Base_Price`**; Chủ nhà nhận **+5% Hoa hồng Xu** + `1 Điểm Nghĩa Xóm`/giao dịch. | Đốt nhanh lượng nông sản tồn kho toàn Server; kích thích giao lưu. |
| `CROP_MUT_01..03` | **Vườn Ươm Lai Tạo Đột Biến Ngũ Sắc** | Lv 17 | `2 Hạt giống + 1 Phấn Hoa/Mật Ong/Bùn Ao` + Phí ghép **`2.000 -> 8.000 🪙/lần`**. | Tỷ lệ `15%–35%` (Có Pity 3–6 lần) ra *Lúa Tím, Dưa Vuông, Bưởi Hồ Lô* (Bán `190–480 🪙`); Xịt vẫn nhận *Phân Bón Siêu Tốc*. | **Gold Sink tự nguyện cực mạnh** cho người chơi thích sưu tầm hàng hiếm. |
| `BM_DINH_01..03` | **Trùng Tu Đình Làng (3 Giai Đoạn)** | Lv 11 | Nộp 12 Gói Sản Vật 3 Miền + Tổng phí công đức **`70.000 🪙`** (`5K -> 15K -> 50K`). | Nhận tổng **`70 💎 Ngọc`** + Mở *Đập Niêu Gacha & Sân Thi Thời Trang* + **Buff vĩnh viễn +5% Sản lượng Toàn Trang Trại**. | Mục tiêu tiêu thụ Nông sản & Xu dài hạn suốt từ Lv 11 đến Lv 25. |
| `BM_TOTEM_01..04` | **Miếu Thần Nông / Ông Địa (Rút Xăm)** | Lv 8 | Dâng lễ mỗi sáng: `1 Trái cây tươi / 1 Cà phê / 1 Bánh chưng / 1 Ấm trà`. | Rút 1 trong 4 Quẻ Đại Cát (24h): **+20% nổ Hoàng Kim ⭐**, **+10% Xu Đơn hàng**, **+15% Chó bắt trộm**, hoặc **-30% độ đói Nhân công**. | Tiêu thụ trái cây/món ăn mỗi sáng; tạo niềm vui đăng nhập đầu ngày. |
| `NEW_RELIEF_01` | **Cứu Trợ Sau Mưa Bão ("Lá Lành Đùm Lá Rách")** | Lv 9 | Bạn bè sang bấm dựng lại 3 giàn cây bị nghiêng sau cơn giông (`0 ⚡`). | Cây chủ nhà tăng **+20% sản lượng vụ đó**; Bạn bè giúp nhận **`+30 🪙 + 2 Điểm Nghĩa Xóm`**. | Gắn kết tình làng nghĩa xóm mà không phạt làm chết cây của người chơi. |
| `BM_DERBY_01` | **Hội Làng Đua Thuyền Rồng (Thứ 6 – CN)** | Lv 13 | Hoàn thành 5 Nhiệm vụ Nông vụ Bang hội/tuần (+50m -> +150m/nhiệm vụ). | Mở 3 Rương Mốc; Top 3 Bang hội nhận **Cúp Vàng + `100 💎` + Giống Đột Biến**. | Đốt lượng lớn Nông sản & Món ăn vào dịp cuối tuần để đua Top Bang. |
| `BM_FASHION_01` | **Hội Thi "Duyên Dáng Làng Quê" Tuần** | Lv 10 | Phí đăng ký dự thi: **`500 🪙/tuần`**. Người đi chấm điểm nhận `+30 🪙/lượt` (tối đa 5 lượt/ngày). | Top 3 dựng **Tượng Đồng ở Cổng Chợ 7 ngày** + **Vương Miện SSR** + **`150 💎`**. | Tạo động lực mua sắm/khâu ghép Thời trang 12 Slots mỗi tuần. |
| `NEW_EXP_01` | **Thám Hiểm Rừng Trúc & Bãi Bồi** | Lv 11 | Tiêu hao **`5 ⚡ -> 15 ⚡ Năng lượng`** mỗi lần đào măng, bắt cua đá, mò rương. | Nhận *Măng rừng, Nấm hương, Đất sét, Củ nâu nhuộm vải* + **Mảnh Cổ Vật Đáy Ao** (Ghép đủ bộ nhận `100 💎`). | **Stamina Sink chủ lực** thúc đẩy người chơi ăn món Bếp Quê & xem Ads hồi ⚡. |
| `NEW_NIGHT_01` | **Chợ Đêm Ẩm Thực Đường Phố (T7 & CN)** | Lv 15 | Phí thuê sạp đèn lồng: **`1.000 🪙/phiên`** + Mang theo 20–50 Món Ăn đã nấu. | Mini-game phục vụ khách 3 phút: Bán hết món ăn với giá **`1.8x Base_Price` (Miễn thuế)** + Thưởng Combo **Vé Số & `10 💎`**. | Giải phóng nhanh kho Món Ăn tồn đọng vào mỗi cuối tuần. |
| `NEW_GUEST_01` | **Cột Mốc Check-in & Sổ Lưu Bút** | Lv 7 | Phí dựng Cột mốc Cây Đa: **`800 🪙`**. Tối đa 10 khách ký lưu bút/ngày. | Chủ nhà nhận **`+10 Mỹ Quan + 20 🪙`/khách**; Khách ký nhận **`+15 🪙 + 3 XP`**. | Khuyến khích đi thăm nhà bạn bè hàng ngày. |
| `BM_HOME_01..02` | **Khu Du Lịch Sinh Thái Homestay (Cấp 1–2)** | Lv 26 | Chi phí xây dựng: **`45.000 🪙 -> 120.000 🪙`** + Phục vụ 2–4 *Món Đại Tiệc 3 Miền* mỗi 6h. | Thu **`650 -> 1.600 🪙/lượt`** + `20–50 Danh Vọng` + **10%–25% rớt Quà Phố Thị (Ngọc / Rương Thời Trang SR-SSR)**. | **End-Game Gold & Food Sink** lớn nhất, biến món ăn thành cơ hội nổ đồ Thời trang hiếm! |
| `NEW_HEIR_01` | **Lễ Cưới Quê & Truyền Nghề Con Cái** | Lv 28 | Đạt 10 Tim ❤️ + **`50.000 🪙`** + `10 Buồng Cau Trầu` + `Đôi Nhẫn Vàng`. | Bạn đời nấu **Mâm Cơm Sáng (`+30 ⚡/ngày`)** + Con lớn phụ nhặt nông sản miễn phí + **Buff Gia Bảo `+10% XP` vĩnh viễn**! | Đỉnh cao thành tựu đời sống (Life-sim Endgame) giữ chân người chơi gắn bó lâu dài. |

---

## PHẦN 5: HỆ THỐNG GÓI NẠP IAP & BẢNG CÂN ĐỐI DÒNG TIỀN TỔNG THỂ (DAILY SOURCES VS. SINKS)

### 5.1. 6 Mệnh Giá Nạp Ngọc (`20.000đ -> 1.000.000đ`, Nhân Đôi `x2` Lần Đầu) & 6 Gói IAP Chiến Lược
1. **🌱 Gói Khởi Nghiệp: "Về Quê Lập Nghiệp" (`19.000đ` - 1 lần):** `120 💎` + `3.000 🪙` + **🐕 Chó Phú Quốc Giữ Nhà** + **Áo Bà Ba/Tứ Thân Lụa Đỏ (R)**.
2. **🌾 Thẻ Tháng: "Bác Nông Dân Mẫu Mực" (`79.000đ` / 30 ngày):** Tổng `750 💎` + `1.200 ⚡` + **Skip Ads** + **+20% Sức chứa Kho** + **+1 Ô Máy** + **Miễn phí 100% Lương Ông Quản Gia Cửu (`WORK_06`) suốt 30 ngày**.
3. **🏮 Sổ Tay Mùa Vụ (Season Pass `99.000đ`):** Tổng `400 💎` + `25.000 🪙` + **Bộ Thời Trang Lễ Hội (SR)** + **Skin Nhà Chính & Hào Quang (SSR)**.
4. **📈 Quỹ Khuyến Nông Trưởng Thành (`149.000đ` - 1 lần):** Nhận tổng `1.750 💎` giải ngân từ Lv 5 đến Lv 30.
5. **👗 Gói Thời Trang Tháng: "Lụa Là Gấm Vóc" (`49.000đ`):** Bộ Thời Trang 6 Món (SR) + `150 💎` (Mua tặng kích hoạt **Hiệu ứng Tim Bay Đôi**).
6. **📦 Gói Giải Cứu Đầy Kho: "Nới Rộng Bồ Thóc" (`29.000đ`):** `100 💎` + Đủ bộ 6 Vật tư Nâng cấp Kho đang thiếu + `50 ⚡`.

### 5.2. Bảng Cân Đối Dòng Tiền Xu Vàng Tổng Thể (`Daily Gold Velocity Balance Sheet`)

| Giai Đoạn Người Chơi | Tổng Thu Nhập Xu / Ngày (`Sources`) | Chi Tiêu Mua Máy, Cây, Giống (`Base Sinks`) | Chi Phí Nuôi Nhân Công Lán Thợ (`Worker Sinks`) | Chi Phí 12 Tính Năng Benchmark (Đình Làng, Đột Biến, Vé Số, Thuế Chợ, Homestay) | Tỷ Lệ Hút Tiền (`Sink / Source Ratio`) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Giai đoạn 1 (Lv 1 – 13)** | `2.500 – 7.500 🪙` | `2.200 – 5.500 🪙` | *Chưa mở Lán Thợ* | `500 – 1.800 🪙` *(Cột mốc Check-in, Đình Làng Bậc 1, Vé Số)* | **95% – 102%** |
| **Giai đoạn 2 (Lv 14 – 20)** | `14.000 – 26.000 🪙` | `5.500 – 8.500 🪙` | **`2.500 – 5.500 🪙/ngày`** *(Thuê 1–3 Thợ)* | `5.000 – 10.000 🪙` *(Vườn Ươm Đột Biến, Đình Làng Bậc 2, Chợ Đêm, Thuế Chợ 10%)* | **93% – 100%** |
| **Giai đoạn 3 (Lv 21 – 30+)** | `35.000 – 65.000 🪙` | `12.000 – 18.000 🪙` | **`10.000 – 16.700 🪙/ngày`** *(Thuê 4–6 Thợ)* | `15.000 – 30.000 🪙` *(Xây Homestay, Lễ Cưới, Đình Làng Bậc 3, Nâng Sao Máy, Ghép Đồ)* | **96% – 110%** *(Chống lạm phát tuyệt đối!)* |
