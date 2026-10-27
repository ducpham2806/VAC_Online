# TÀI LIỆU KIẾN TRÚC KINH TẾ, LỘ TRÌNH MỞ KHÓA THỰC THỂ 5 ĐỢT, LƯƠNG NHÂN CÔNG, ĐẤU TRƯỜNG PK & CƠ CHẾ CHỐNG LẠM PHÁT (MASTER ECONOMY & MONETIZATION SPEC)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Mã tài liệu:** `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md`  
**Phiên bản:** Master Economy 8.0 (Tích hợp **Van Khóa #8: Phân Bổ Mở Khóa Nông – Thủy – Hải Sản & Xưởng Chế Biến Theo 5 Đợt Giai Đoạn Update & Cốt Truyện**, tuân thủ `RULE D0` không trùng lặp)  
**Thực hiện bởi:** `@economy-designer`, `@game-designer` & `@growth-hacker`

---

## PHẦN 1: BÁO CÁO KIỂM TOÁN RỦI RO LẠM PHÁT & 8 VAN KHÓA KINH TẾ (ANTI-INFLATION AUDIT)

| STT | Lỗ Hổng Tiềm Ẩn (Inflation Risk) | Giải Pháp Khóa Chặt Của `@economy-designer` (Áp dụng trong Master 8.0) |
| :---: | :--- | :--- |
| **1** | **Đổi Ngọc (Hard) ra Xu Vàng (Soft)** | 🔒 **Quy đổi Động theo Level ($\text{Xu} = 35 + 12 \times \text{Level}$, trần `400 Xu / 1 💎`)** + **CẤM tuyệt đối đổi ngược từ Xu sang Ngọc**. |
| **2** | **In tiền từ "Bắt Trộm Rớt Xu" & "Xin Vía"** | 🔒 **Zero-Sum Transfer:** Xu rớt ra khi bị Chó/Ngỗng/Bẫy bắt (`30–60 Xu`) **trừ trực tiếp từ Ví kẻ trộm** (khấu trừ 10% thuế hệ thống). Quỹ Xin Vía Loa Phường & Độc Đắc Xổ Số trích từ **Quỹ Thuế Chợ 10%**. |
| **3** | **Lạm phát & Chuyển tiền lậu qua Chợ P2P & Đổi Kỷ Vật** | 🔒 **Khung Giá Chặt (`0.8x -> 2.0x Giá Gốc`) + Thuế Chợ Đốt Tiền `10%`.** Tính năng **Đổi Kỷ Vật Tuổi Thơ (`FEAT_03`)** khóa cứng theo cơ chế **1-đổi-1 cùng bậc + thu phí bưu điện `100 🪙/lần`**. |
| **4** | **Dư thừa Nông sản, Món ăn & Xu Vàng khi người chơi lên Cấp Cao (Lv 14 – 30+)** | 🔒 **Hệ thống "Lán Thợ Đồng Quê" (4 Tầng Sink Liên Hoàn):** Thuê 1–6 Nhân công tiêu thụ **`13.900 – 16.700 Xu/ngày`** qua: *Trả lương cứng + Nấu 2 bữa Cơm Thợ/ngày + Cấp phát Áo Quần Bảo Hộ (hao mòn 72h) + Thưởng Phụ Cấp Ngày Mùa*. |
| **5** | **Lạm phát từ 17 Tính năng Benchmark & 6 Sự kiện Lễ hội** | 🔒 **Cơ chế "Đổi Tài Nguyên Tồn Kho Lấy Giá Trị Danh Vọng / Sưu Tầm" (`Resource-to-Prestige Conversion`):** Tiêu hủy Nếp, Đậu xanh, Hạt sen, Đặc sản 3 miền và Món ăn mỗi ngày qua *Thương Đội Liên Gia, Thực Khách Bí Ẩn, Nồi Bánh Chưng & Lò Bánh Trung Thu*. |
| **6** | **Phá vỡ độc quyền Đặc sản 3 Miền từ Hạt Giống Giao Thoa (`FEAT_01`)** | 🔒 **Giới hạn Sinh thái 3 Vụ (`3-Harvest Decay Cap`):** Hạt giống đặc sản miền bạn nhận từ *Thương Đội Liên Gia* chỉ trồng được **đúng 3 vụ** rồi tự thoái hóa. |
| **7** | **Cày tiền vô hạn (Bot Farming) từ game PK / Loạn Chiến / Hyper-Casual (`Giai Đoạn 6`)** | 🔒 **Khóa Kép "Trần Thưởng Hàng Ngày (`Daily Arcade Cap: 1,500 🪙/ngày`) + Quỹ Cược Võ Đài Zero-Sum Thu Thuế `10%`"** + Giới hạn tối đa 3 trận tính thưởng với cùng 1 đối thủ/ngày. |
| **8** | **Loãng kho hàng, Ngợp lựa chọn & Đứt gãy chuỗi cung ứng nếu mở toàn bộ 81 loài ngay từ Giai đoạn 1 (`MỚI`)** | 🔒 **Cơ chế "Phân Bổ Sinh Thái 5 Đợt Theo Cốt Truyện & Giai Đoạn Update" (`5-Wave Story & Stage Gating`):**<br>• Không tung cả 81 loài trồng & nuôi vào Giai đoạn 1. Mỗi Giai đoạn Update (`GĐ 1 ➔ GĐ 5`) và mỗi Chương Gia Phả (`Chương 1 ➔ 10`) chỉ mở khóa một nhóm **Nông – Thủy – Hải sản + Xưởng chế biến + Món ăn + Gia nhân khớp khít nhân quả với nhau** (`23 ➔ 45 ➔ 63 ➔ 76 ➔ 81 loài`).<br>• **Bộ lọc Đơn hàng Thông minh (`Stage-Aware Order Generator`):** Bảng đơn Hợp Tác Xã, Toa Tàu Hỏa, Thương Lái Giá Sốt và Câu đố Cụ Đồ Vũ Bằng **chỉ yêu cầu các mặt hàng thuộc những Đợt Giai đoạn đã mở khóa**, tuyệt đối không bao giờ đòi mặt hàng của Giai đoạn sau! |

---

## PHẦN 2: HỆ THỐNG TIỀN TỆ & TỶ GIÁ NEO CHUẨN (BAO GỒM ĐỒNG XU HỘI LÀNG `🏮`)

1. **🪙 Xu Vàng (`Soft Currency`):** Tiền tệ lưu thông chính từ canh tác Vườn – Ao – Chuồng, giao thương và trả lương Lán Thợ.
2. **💎 Ngọc Bích (`Hard Currency`):** Tỷ giá neo cơ sở **`1.000 VNĐ = 5 💎 Ngọc`** (`1 💎 = 200 VNĐ`).
   * **Chi phí Ngọc Bỏ Qua Thời Gian Chờ:** $\text{Cost}(T_{\text{phút}}) = \text{Ceil}\left( 0.8 \times T^{0.62} \right)$.
   * **Chi phí Mua Năng Lượng (+50 ⚡) Lũy Tiến Trong Ngày:** Lần 1: `10 💎` $\rightarrow$ Lần 2: `15 💎` $\rightarrow$ Lần 3: `25 💎` $\rightarrow$ Lần 4–5: `40 💎`.
   * **Quy đổi Động `1 💎 Ngọc -> 🪙 Xu Vàng` Theo Cấp Độ:** $\text{Xu} = \min(400, 35 + 12 \times \text{Level})$.
3. **🏮 Xu Hội Làng (`Festival & Arena Token` — Mở ở Giai Đoạn 6):** Nhận từ PK Võ Đài 1v1, 3v3, Loạn Chiến 8–12P và 5 ván Hyper-Casual đầu ngày (Trần `100 – 250 🏮/ngày`), dùng đổi Danh hiệu Phát sáng, Biểu cảm Múa Lân và Bùn Phù Sa.

---

## PHẦN 3: TOÁN HỌC CÂN BẰNG KINH TẾ THEO 5 ĐỢT MỞ KHÓA THỰC THỂ & LÁN THỢ GIA NHÂN

### 3.1. Bảng Nhịp Độ Mở Khóa Kinh Tế 5 Đợt (`5-Wave Economic Progression Curve`)

| Đợt Mở Khóa & Giai Đoạn | Cốt Truyện & Level | Số Loài V-A-C Mở Mới (Lũy Kế) | Xưởng, Món Ăn, Đồ Bảo Hộ & Gia Nhân Mở Mới | Giá Mua Giống / Con Giống (`Buy Cost`) | Lợi Nhuận Ròng Mỗi Mẻ (`Net Profit`) | Động Lực Tiêu Tiền Chính Của Đợt (`Primary Sinks`) |
| :--- | :---: | :---: | :--- | :---: | :---: | :--- |
| **Đợt 1 — Giai Đoạn 1 (`v1.0`)**<br>*Sinh Kế Quê Mẹ* | **Chương 1–2**<br>*(Lv.1–8)* | **`23 loài`**<br>*(16 Cây + 4 Vật nuôi + 3 Cá đồng)* | • **3 Xưởng:** `MAC_01..03` (*Cối Xay, Bếp Củi, Lò Đậu*)<br>• **5 Món:** `PROD_01..05`<br>• **2 Pet:** *Chó Phú Quốc, Mèo* | `2 🪙 ➔ 140 🪙` | `+2 🪙 ➔ +348 🪙` | Mua 3 xưởng đầu (`1,350 🪙`), khai hoang 6 ô đất đầu (`3,000 🪙`), mua giống cây Đu đủ & đàn Gà/Vịt/Cá rô. |
| **Đợt 2 — Giai Đoạn 2 (`v1.2`)**<br>*Làng Nghề & Lán Thợ* | **Chương 3, 6, 7**<br>*(Lv.9–15)* | **`+22 loài`**<br>*(Lũy kế `45/81`)* | • **3 Xưởng:** `MAC_04, 07, 08` (*Quán Nước, Đan Lát, Khung Cửi*)<br>• **9 Món:** `PROD_06..12, N01, C01`<br>• **2 Đồ thợ:** `CRAFT_01..02`<br>• **2 Thợ:** `WORK_01..02` | `19 🪙 ➔ 600 🪙` | `+19 🪙 ➔ +612 🪙` | Xây 3 xưởng làng nghề (`6,600 🪙`), nuôi *Tằm Nhả Tơ (`320 🪙`)* & *Bò Sữa (`600 🪙`)*, trả lương + nấu cơm nuôi *Chú Tư Cày & Cô Năm Thảo* (`~2,500 🪙/ngày`). |
| **Đợt 3 — Giai Đoạn 3 (`v1.5`)**<br>*Giao Thương 3 Miền* | **Chương 4–5**<br>*(Lv.16–20)* | **`+18 loài`**<br>*(Lũy kế `63/81`)* | • **2 Xưởng:** `MAC_05..06` (*Quầy Bún Phở, Xưởng Muối Mắm*)<br>• **9 Món:** `PROD_13..17, S01, 19..21`<br>• **Đồ thợ:** `CRAFT_03`<br>• **2 Thợ:** `WORK_03..04` | `33 🪙 ➔ 450 🪙` | `+36 🪙 ➔ +920 🪙` | Xây 2 xưởng lớn (`7,700 🪙`), trồng 6 vườn cây Đặc sản Bậc 3–4 (`Vải, Nho, Măng cụt, Nhãn, Hồ tiêu, Vú sữa`), thả *Cá Trắm Đen / Cá Linh / Trai Ngọc*, thuê *Anh Sáu Kình & Dì Bảy Bếp* + phí Thương Đội (`300 🪙/chuyến`). |
| **Đợt 4 — Giai Đoạn 4 (`v1.8`)**<br>*Đình Làng & Đột Biến* | **Chương 8–9**<br>*(Lv.21–24)* | **`+13 loài`**<br>*(Lũy kế `76/81`)* | • **2 Món Đại Tiệc:** `PROD_22..23`<br>• **Đồ thợ VIP:** `CRAFT_04`<br>• **Thợ:** `WORK_05` (*Chú Tám Mộc*)<br>• **12 Ô Thời trang & 12 Kỷ vật** | `380 🪙 ➔ 8,000 🪙` | `+60 🪙 ➔ +1,120 🪙` | Trùng tu Đình Làng 3 cấp (`70,000 🪙`), chiết cành **3 Giống Đột Biến (`2,000–8,000 🪙/lần`)**, nuôi *Hươu Sao / Nhà Yến / Ghẹ Ô Loan*, thuê *Chú Tám Mộc (`2,600 🪙/ngày`)*, Đua Trâu Vàng (`1,000 🪙/lượt`). |
| **Đợt 5 — Giai Đoạn 5 (`v2.0`)**<br>*Lễ Cưới, Hải Sản VIP & Homestay* | **Chương 10**<br>*(Lv.25–30+)*| **`+5 loài`**<br>*(Đủ `81/81` loài)* | • **2 Món Đỉnh Cao:** `PROD_18, 24` (*Bánh Chưng Tết & Chả Rươi Tôm Hùm*)<br>• **Tổng Quản:** `WORK_06`<br>• **Homestay 2 Cấp** | `340 🪙 ➔ 500 🪙` | `+80 🪙 ➔ +830 🪙` | Thả **3 Thủy Hải Sản VIP (`Rươi Tứ Kỳ, Tôm Hùm Phú Yên, Cua Cà Mau`)** & *Cá Chép Koi*, tổ chức Lễ Cưới (`50,000 🪙`), xây Homestay 2 cấp (`165,000 🪙`), thuê trọn 6 Gia nhân (`~15,000 🪙/ngày`). |

### 3.2. Chi Phí Vận Hành 6 Nhân Công Lán Thợ Theo Lộ Trình Mở Khóa (`WORK_01` – `WORK_06`)

| Mã ID | Tên Nhân Công & Chuyên Môn | Giai Đoạn & Cấp Mở | Lương 1 Ngày | Hợp Đồng 3 Ngày (-12%) | Tiêu Thụ "Mâm Cơm Thợ" / Ngày | Hao Mòn Áo Quần / 3 Ngày | Phụ Cấp Hăng Say (+25% Tốc Độ) | Tổng Giá Trị Hút Khỏi Kinh Tế / Ngày |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :---: |
| `WORK_01` | **🌾 Chú Tư Cày** *(Làm vườn)* | **GĐ 2** *(Lv 14)* | **800 🪙** | **2.100 🪙** | `60 Độ No` (~140 🪙) | *Nón Lá + Áo Nâu* (~60 🪙/ngày) | **+200 🪙** *(Hoặc Trà Đá)* | **~1.000 – 1.200 🪙** |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn nuôi)* | **GĐ 2** *(Lv 16)* | **1.100 🪙** | **2.900 🪙** | `75 Độ No` (~180 🪙) | *Khăn Rằn + Áo Bà Ba* (~80 🪙/ngày) | **+300 🪙** *(Hoặc Bánh Cuốn)* | **~1.360 – 1.660 🪙** |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Ao cá & Vét bùn)* | **GĐ 3** *(Lv 18)* | **1.500 🪙** | **4.000 🪙** | `90 Độ No` (~240 🪙) | *Áo Tơi + Ủng Cao Su* (~110 🪙/ngày) | **+400 🪙** *(Hoặc Ốc Hấp)* | **~1.850 – 2.250 🪙** |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Chạy máy & Nấu cơm)* | **GĐ 3** *(Lv 20)* | **2.000 🪙** | **5.400 🪙** | `100 Độ No` (~290 🪙) | *Tạp Dề Hoa Sen* (~140 🪙/ngày) | **+500 🪙** *(Hoặc Cốm Vòng)* | **~2.430 – 2.930 🪙** |
| `WORK_05` | **🪵 Chú Tám Mộc** *(18 Cây lâu năm)* | **GĐ 4** *(Lv 22)* | **2.600 🪙** | **7.000 🪙** | `120 Độ No` (~360 🪙) | *Mũ Cối + Áo Chàm* (~180 🪙/ngày) | **+650 🪙** *(Hoặc Bánh Pía)* | **~3.140 – 3.790 🪙** |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng quản VIP)* | **GĐ 5** *(Lv 25)* | **3.500 🪙** *(Free VIP)* | **9.200 🪙** | `140 Độ No` (~420 🪙) | *Áo Dài Ngũ Thân Lụa* (~220 🪙/ngày) | **+800 🪙** *(Hoặc Chè 3 Miền)* | **~4.140 – 4.940 🪙** |

---

## PHẦN 4: MA TRẬN CÂN BẰNG KINH TẾ CHO 17 TÍNH NĂNG BENCHMARK / LỄ HỘI & 6 HỆ THỐNG SẢNH CHUNG / PK / HYPER-CASUAL

*(Giữ nguyên toàn bộ thông số chuẩn hóa của 17 Tính năng Benchmark/Lễ hội từ Giai đoạn 2 ➔ 5 và 6 Chế độ Sảnh Chung / Võ Đài PK / Loạn Chiến / Hyper-Casual ở Giai đoạn 6 như đã đối chiếu tại `01_MASTER_GDD`).*

---

## PHẦN 5: HỆ THỐNG GÓI NẠP IAP & BẢNG CÂN ĐỐI DÒNG TIỀN TỔNG THỂ QUA 6 GIAI ĐOẠN (DAILY SOURCES VS. SINKS)

| Giai Đoạn & Quy Mô Sinh Thái Mở Khóa | Tổng Thu Nhập Xu / Ngày (`Sources`) | Chi Tiêu Mua Máy, Cây, Con Giống Mới Mở (`Base Sinks`) | Chi Phí Nuôi Gia Nhân Theo Đợt (`Worker Sinks`) | Chi Phí Lễ Hội, Đình Làng, Thuế Chợ/Sới Đình 10% (`Event & Arena Sinks`) | Tỷ Lệ Hút Tiền (`Sink / Source Ratio`) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Giai đoạn 1 (`23/81` loài V-A-C • 3 Xưởng • 5 Món)** | `2.500 – 7.500 🪙` | `2.200 – 5.500 🪙` *(Mua 3 xưởng sơ cấp, giống lúa/rau/gà/cá rô)* | *Chưa mở Lán Thợ* | `500 – 1.800 🪙` *(Khai hoang 6 phân khu đầu)* | **95% – 102%** |
| **Giai đoạn 2 (`45/81` loài V-A-C • 6 Xưởng • 14 Món • 2 Thợ)** | `12.000 – 20.000 🪙` | `4.500 – 7.500 🪙` *(Xây Quán nước, Đan lát, Khung cửi; nuôi Tằm, Bò sữa, Gà Đông Tảo)* | **`2.360 – 2.860 🪙/ngày`** *(Thuê Chú Tư & Cô Năm)* | `4.000 – 8.500 🪙` *(Đố Ca dao Cụ Đồ, khai hoang tiếp)* | **94% – 100%** |
| **Giai đoạn 3 (`63/81` loài V-A-C • 8 Xưởng • 23 Món • 4 Thợ)** | `22.000 – 35.000 🪙` | `7.500 – 12.000 🪙` *(Xây Quầy Bún Phở, Xưởng Mắm; trồng 6 vườn cây Đặc sản Bậc 3–4; thả Cá Trắm/Trai Ngọc)* | **`6.640 – 8.040 🪙/ngày`** *(Thêm Anh Sáu & Dì Bảy)* | `6.500 – 13.000 🪙` *(Thuế Chợ 10%, Thương Đội Liên Gia, Cột mốc Lưu bút)* | **95% – 102%** |
| **Giai đoạn 4 (`76/81` loài V-A-C • Đột biến • 25 Món • 5 Thợ)** | `38.000 – 55.000 🪙` | `10.000 – 15.000 🪙` *(Trồng Bưởi Diễn/Cà Phê/Sầu Riêng Ri6; nuôi Hươu Sao/Nhà Yến/Ghẹ Ô Loan)* | **`9.780 – 11.830 🪙/ngày`** *(Thêm Chú Tám Mộc)* | `16.000 – 28.000 🪙` *(Đình Làng 70K, Chiết cành Đột biến, Đổi Kỷ vật 8x–9x, Đua Trâu, Bánh Trung Thu)* | **97% – 108%** |
| **Giai đoạn 5 (`81/81` loài V-A-C • Hải sản VIP • 27 Món • 6 Thợ)** | `52.000 – 72.000 🪙` | `12.000 – 18.000 🪙` *(Trồng Cau Trầu; thả Rươi Tứ Kỳ, Tôm Hùm Phú Yên, Cua Cà Mau, Cá Koi)* | **`13.920 – 16.770 🪙/ngày`** *(Đủ 6 Gia nhân)* | `24.000 – 38.000 🪙` *(Lễ Cưới 50K, Homestay 165K, Nồi Bánh Chưng Tết)* | **98% – 110%** |
| **Giai đoạn 6 (Sảnh Chung, Võ Đài PK & Hyper-Casual)** | `+1.500 🪙/ngày` *(Trần thưởng 5 ván Hyper-Casual đầu ngày)* | *Giữ nguyên* | *Giữ nguyên* | **`+2.000 – 5.500 🪙/ngày` đốt thêm** *(10% Thuế Sới Đình PK/Loạn Chiến + Trà đá/Pháo hoa Sảnh Chung + Vé Đua Top)* | **99% – 112%** *(Chống lạm phát tuyệt đối!)* |
