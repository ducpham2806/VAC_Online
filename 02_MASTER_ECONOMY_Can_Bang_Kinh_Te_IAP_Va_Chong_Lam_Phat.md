# TÀI LIỆU KIẾN TRÚC KINH TẾ, ĐỊNH GIÁ GÓI IAP, LƯƠNG NHÂN CÔNG, SỰ KIỆN LỄ HỘI, ĐẤU TRƯỜNG PK & CƠ CHẾ CHỐNG LẠM PHÁT (MASTER ECONOMY & MONETIZATION SPEC)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Mã tài liệu:** `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md`  
**Phiên bản:** Master Economy 7.0 (Hoàn thiện Toán học Kinh tế cho 155 Thực thể, 6 Gia nhân Lán Thợ, 17 Tính năng Lễ hội & **Kinh tế Sảnh Chung / Đấu Trường PK Zero-Sum / Trần Thưởng Hyper-Casual Giai Đoạn 6**)  
**Thực hiện bởi:** `@economy-designer`, `@game-designer` & `@growth-hacker`

---

## PHẦN 1: BÁO CÁO KIỂM TOÁN RỦI RO LẠM PHÁT & 7 VAN KHÓA KINH TẾ (ANTI-INFLATION AUDIT)

| STT | Lỗ Hổng Tiềm Ẩn (Inflation Risk) | Giải Pháp Khóa Chặt Của `@economy-designer` (Áp dụng trong Master 7.0) |
| :---: | :--- | :--- |
| **1** | **Đổi Ngọc (Hard) ra Xu Vàng (Soft)** | 🔒 **Quy đổi Động theo Level ($\text{Xu} = 35 + 12 \times \text{Level}$, trần `400 Xu / 1 💎`)** + **CẤM tuyệt đối đổi ngược từ Xu sang Ngọc**. |
| **2** | **In tiền từ "Bắt Trộm Rớt Xu" & "Xin Vía"** | 🔒 **Zero-Sum Transfer:** Xu rớt ra khi bị Chó/Ngỗng/Bẫy bắt (`30–60 Xu`) **trừ trực tiếp từ Ví kẻ trộm** (khấu trừ 10% thuế hệ thống). Quỹ Xin Vía Loa Phường & Độc Đắc Xổ Số trích từ **Quỹ Thuế Chợ 10%**. |
| **3** | **Lạm phát & Chuyển tiền lậu qua Chợ P2P & Đổi Kỷ Vật** | 🔒 **Khung Giá Chặt (`0.8x -> 2.0x Giá Gốc`) + Thuế Chợ Đốt Tiền `10%`.** Tính năng **Đổi Kỷ Vật Tuổi Thơ (`FEAT_03`)** khóa cứng theo cơ chế **1-đổi-1 cùng bậc + thu phí bưu điện `100 🪙/lần`**, không cho phép kèm Xu hay Ngọc. |
| **4** | **Dư thừa Nông sản, Món ăn & Xu Vàng khi người chơi lên Cấp Cao (Lv 14 – 30+)** | 🔒 **Hệ thống "Lán Thợ Đồng Quê" (4 Tầng Sink Liên Hoàn):** Thuê 1–6 Nhân công tiêu thụ **`13.900 – 16.700 Xu/ngày`** qua: *Trả lương cứng + Nấu 2 bữa Cơm Thợ/ngày + Cấp phát Áo Quần Bảo Hộ (hao mòn 72h) + Thưởng Phụ Cấp Ngày Mùa*. |
| **5** | **Lạm phát từ 17 Tính năng Benchmark & 6 Sự kiện Lễ hội** | 🔒 **Cơ chế "Đổi Tài Nguyên Tồn Kho Lấy Giá Trị Danh Vọng / Sưu Tầm" (`Resource-to-Prestige Conversion`):**<br>• **Thương Đội Liên Gia (`FEAT_01`), Thực Khách Bí Ẩn (`FEAT_02`), Nồi Bánh Chưng (`EVENT_01`) & Lò Bánh Trung Thu (`EVENT_02`):** Trực tiếp **tiêu hủy hàng chục đơn vị Nếp, Đậu xanh, Hạt sen, Đặc sản 3 miền và Món ăn** mỗi ngày.<br>• **Hội Thi Trâu Vàng (`EVENT_03`), Vườn Ươm Đột Biến, Đình Làng (`70.000 🪙`), Homestay (`165.000 🪙`) & Lễ Cưới (`50.000 🪙`):** Các **Van Hút Xu Chủ Lực (Gold Sinks)**. |
| **6** | **Phá vỡ độc quyền Đặc sản 3 Miền từ Hạt Giống Giao Thoa (`FEAT_01`)** | 🔒 **Giới hạn Sinh thái 3 Vụ (`3-Harvest Decay Cap`):** Hạt giống đặc sản miền bạn nhận từ *Thương Đội Liên Gia* chỉ trồng được **đúng 3 vụ** rồi tự thoái hóa, không thể nhân giống tiếp. |
| **7** | **Cày tiền vô hạn (Bot Farming) hoặc Dàn xếp tỉ số từ các game PK / Loạn Chiến / Hyper-Casual (`Giai Đoạn 6 - Mới`)** | 🔒 **Khóa Kép "Trần Thưởng Hàng Ngày (`Daily Arcade Cap`) + Quỹ Cược Võ Đài Zero-Sum Thu Thuế `10%`":**<br>• **Game Đơn Hyper-Casual (`M11.5`):** Miễn phí `0 ⚡` để giải trí bất cứ lúc nào, nhưng phần thưởng Xu Vàng bị **khóa trần cứng ở mức tối đa `1,500 🪙` và `100 🏮 Xu Hội Làng / ngày`** (tương đương 5 ván thắng đầu tiên). Từ ván thứ 6 trở đi chỉ cộng Điểm Kỷ Lục Bảng Xếp Hạng, triệt tiêu 100% nguy cơ dùng auto-clicker cày tiền!<br>• **Đấu Trường PK 1v1, 3v3 & Loạn Chiến 8–12P (`M11.2 ➔ M11.4`):** Khi thi đấu có vé vào cửa (`200 🪙` hoặc `500 🪙/người`), hệ thống gom vào Quỹ Thưởng Trận Đấu, **khấu trừ `10% Thuế Sới Đình` (đốt vĩnh viễn khỏi nền kinh tế)** và trao `90%` còn lại cho người thắng + **Giới hạn tối đa 3 trận đấu tính thưởng với cùng 1 đối thủ/ngày** (Chống chuyển tiền lậu qua PK!). |

---

## PHẦN 2: HỆ THỐNG TIỀN TỆ & TỶ GIÁ NEO CHUẨN (BAO GỒM ĐỒNG XU HỘI LÀNG `🏮`)

1. **🪙 Xu Vàng (`Soft Currency`):** Tiền tệ lưu thông chính từ canh tác Vườn – Ao – Chuồng, giao thương và trả lương Lán Thợ.
2. **💎 Ngọc Bích (`Hard Currency`):** Tỷ giá neo cơ sở **`1.000 VNĐ = 5 💎 Ngọc`** (`1 💎 = 200 VNĐ`).
   * **Chi phí Ngọc Bỏ Qua Thời Gian Chờ:** $\text{Cost}(T_{\text{phút}}) = \text{Ceil}\left( 0.8 \times T^{0.62} \right)$.
   * **Chi phí Mua Năng Lượng (+50 ⚡) Lũy Tiến Trong Ngày:** Lần 1: `10 💎` $\rightarrow$ Lần 2: `15 💎` $\rightarrow$ Lần 3: `25 💎` $\rightarrow$ Lần 4–5: `40 💎`.
   * **Quy đổi Động `1 💎 Ngọc -> 🪙 Xu Vàng` Theo Cấp Độ:** $\text{Xu} = \min(400, 35 + 12 \times \text{Level})$.
3. **🏮 Xu Hội Làng (`Festival & Arena Token` — Mở ở Giai Đoạn 6):**
   * **Nguồn thu (`Source`):** Nhận được khi tham gia PK Võ Đài 1v1, Đấu Nhóm 3v3, Loạn Chiến Ao Làng và 5 ván Hyper-Casual đầu ngày (Trần `100 – 250 🏮/ngày`).
   * **Đầu ra (`Sink` tại Cửa Hàng Sảnh Chung):** Dùng để đổi **Danh Hiệu Phát Sáng Trên Đầu** (*"Độc Cô Cầu Bại Cầu Khỉ" - `500 🏮`*, *"Trạng Vật Sới Đình" - `800 🏮`*), **Động Tác Biểu Cảm Đặc Biệt** (*Múa Lân Sư Rồng - `600 🏮`*, *Múa Sạp Tây Bắc - `400 🏮`*), **Bóng Nước / Pháo Giấy Tương Tác Sảnh Chung** (`20 🏮`) và **Xô Bùn Phù Sa** (`50 🏮`, giới hạn 2 xô/ngày).
   * **Ý nghĩa Kinh tế:** Tách bạch phần thưởng kỹ năng Arcade sang `🏮 Xu Hội Làng` giúp người chơi đam mê PK/Hyper-Casual có mục tiêu sưu tầm danh vọng cực kỳ cuốn hút mà **không làm lạm phát hệ thống Xu Vàng Nông Trại**!

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

## PHẦN 4: MA TRẬN CÂN BẰNG KINH TẾ CHO 17 TÍNH NĂNG BENCHMARK / LỄ HỘI & 6 HỆ THỐNG SẢNH CHUNG / PK / HYPER-CASUAL

### 4.1. Bảng Cân Bằng 17 Tính Năng Benchmark & Lễ Hội (`Giai Đoạn 2 ➔ Giai Đoạn 5`)

| Mã Tính Năng | Tên Tính Năng / Sự Kiện | Giai Đoạn & Cấp Mở | Chi Phí Đầu Vào / Điều Kiện Tham Gia (`Sinks`) | Phần Thưởng & Lợi Ích Kinh Tế Đầu Ra (`Rewards`) | Vai Trò Điều Tiết Vĩ Mô |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `FEAT_02` | **🥢 Thực Khách Bí Ẩn & Đố Ca Dao Bếp Quê** | **Giai đoạn 2** *(Lv 10)* | Phối 3 nguyên liệu hoặc nộp **2 Món Ăn khớp câu đố Ca dao** trong 15 phút (`12:00` & `19:00`). | Nhận **`+650 🪙`** + **`+10 💎`** + **`+20 ⚡`** + **`1 Sao Mai Ẩm Thực`**. | Tiêu thụ món ăn cấp thấp/trung hàng ngày. |
| `BM_BOOM_01` | **🚚 Thương Lái Đột Xuất (09:00 & 20:00)** | **Giai đoạn 3** *(Lv 9)* | Nộp Nông sản / Món ăn khớp yêu cầu (Tối đa 20 món/khách, 200 món/xe). | Giá thu mua **`1.5x -> 3.0x Base_Price`**; Chủ nhà nhận **+5% Hoa hồng Xu**. | Đốt nhanh lượng nông sản tồn kho toàn Server. |
| `NEW_RELIEF_01`| **🤝 Cứu Trợ Sau Mưa Bão ("Lá Lành Đùm Lá Rách")** | **Giai đoạn 3** *(Lv 9)* | Bạn bè sang bấm dựng lại giàn cây bị nghiêng sau cơn giông (`0 ⚡`). | Cây chủ nhà **+20% sản lượng**; Bạn bè giúp nhận **`+30 🪙 + 2 Nghĩa Xóm`**. | Gắn kết tình làng nghĩa xóm miễn phí `⚡`. |
| `NEW_GUEST_01` | **📸 Cột Mốc Check-in & Sổ Lưu Bút Cổng Làng** | **Giai đoạn 3** *(Lv 7)* | Phí dựng Cột mốc Cây Đa: **`800 🪙`**. Tối đa 10 khách ký lưu bút/ngày. | Chủ nhà nhận **`+10 Phong Thủy + 20 🪙`/khách**; Khách ký nhận **`+15 🪙`**. | Khuyến khích đi thăm nhà bạn bè hàng ngày. |
| `FEAT_01` | **🛶 Thương Đội Liên Gia 3 Miền (Co-op Caravan)** | **Giai đoạn 3** *(Lv 13)* | Đội 3 người (`1 Bắc + 1 Trung + 1 Nam`), mỗi người góp **10 Đặc sản miền mình** + **`300 🪙`**. | Cả 3 nhận **`+1,800 🪙`** + **`+15 💎`** + **`3 Hạt Giống Giao Thoa`** (Trồng thử 3 vụ). | Kết bạn xuyên vùng miền; đốt 30 Đặc sản/chuyến. |
| `BM_TOTEM_01..04`| **⛩️ Miếu Thần Nông / Ông Địa (Rút Xăm)** | **Giai đoạn 4** *(Lv 8)* | Dâng lễ mỗi sáng (`-80 🪙` + `1 Trái cây / Trà / Bánh`). | Rút 1 trong 4 Quẻ Đại Cát (24h): **+20% Hoàng Kim ⭐**, **+10% Xu Đơn**, **+15% Chó bắt trộm**, **-30% đói Thợ**. | Tiêu thụ trái cây/món ăn mỗi sáng. |
| `BM_FASHION_01`| **🪞 Hội Thi "Duyên Dáng Làng Quê" Tuần** | **Giai đoạn 4** *(Lv 10)* | Phí đăng ký dự thi: **`500 🪙/tuần`**. | Top 3 dựng **Tượng Đồng ở Cổng Chợ 7 ngày** + **Vương Miện SSR** + **`150 💎`**. | Thúc đẩy khâu ghép Thời trang 12 Slots (`3➔1`). |
| `BM_DINH_01..03`| **🏮 Trùng Tu Đình Làng (3 Giai Đoạn)** | **Giai đoạn 4** *(Lv 11)* | Nộp 12 Gói Sản Vật 3 Miền + Tổng phí công đức **`70.000 🪙`** (`5K -> 15K -> 50K`). | Nhận tổng **`70 💎 Ngọc`** + **Buff vĩnh viễn +5% Sản lượng Toàn Trang Trại**. | Mục tiêu tiêu thụ Nông sản & Xu dài hạn. |
| `NEW_EXP_01` & `FEAT_03` | **🎋 Thám Hiểm Rừng Trúc & 📻 Bảo Tàng 12 Kỷ Vật 8x–9x** | **Giai đoạn 4** *(Lv 11)* | Rừng Trúc tốn **`6 ⚡/lượt`**; Đổi Kỷ Vật trùng (`1-đổi-1`) tốn **`100 🪙/lần`**. | Rơi **12 Kỷ Vật 8x–9x** (`18%`); đủ bộ nhận **`150 💎`** + **Buff `+5% Xu Đơn HTX`**. | Stamina Sink & Gold Sink sưu tầm hoài niệm. |
| `EVENT_02` | **🌕 Đêm Hội Trăng Rằm & Lò Bánh Trung Thu** | **Giai đoạn 4** *(Lv 12)* | Khi trời `🌙 Đêm Đom Đóm`, nộp `2 Hạt Sen + 2 Đậu Xanh + 2 Trứng Vịt + 300 🪙`/hộp. | Đãi Lán Thợ khóa **`100% Tinh thần Hăng Say` 24h**; Biếu NPC **`x2 Tim ❤️`**. | Đốt mạnh Hạt sen, Đậu xanh & Trứng vịt. |
| `BM_DERBY_01` | **🥁 Hội Làng Đua Thuyền Rồng (Thứ 6 – CN)** | **Giai đoạn 4** *(Lv 13)* | Chèo thuyền tốn **`4 ⚡/nhịp`** (`+120m`, mục tiêu `1,000m`). | Nhận **`+380 🪙`** + **`+5 💎`**/nhịp. | Đốt Năng lượng `⚡` cuối tuần. |
| `EVENT_03` | **🐃 Hội Thi "Trâu Vàng Cày Giỏi & Vịt Chạy Đồng"** | **Giai đoạn 4** *(Lv 14)* | Phí đăng ký: **`1,000 🪙/lượt`** + `1 Xô Bùn Phù Sa` + `4 ⚡`. | Về Nhất nhận **`2,200 🪙`** + **`+15 💎`** + **`Cúp Trâu Vàng (+150 Phong Thủy)`**. | Đầu ra thi đấu cho thú cưng *Trâu Đen* & *Vịt Đồng*. |
| `NEW_NIGHT_01` | **🏮 Chợ Đêm Ẩm Thực Đường Phố (T7 & CN)** | **Giai đoạn 4** *(Lv 15)* | Phí thuê sạp: **`1.000 🪙/phiên`** + Mang theo 20–50 Món Ăn. | Bán hết món ăn với giá **`1.8x Base_Price` (Miễn thuế)** + **`+8 💎`**. | Giải phóng nhanh kho Món Ăn tồn đọng cuối tuần. |
| `CROP_MUT_01..03`| **🧬 Vườn Ươm Lai Tạo Đột Biến Ngũ Sắc (Pity)** | **Giai đoạn 4** *(Lv 17)* | Phí chiết cành **`2.000 -> 8.000 🪙/lần`**. | Tỷ lệ `15%–35%` (**Bảo hiểm Pity 3–6 lần trúng 100%**). | Gold Sink tự nguyện cực mạnh. |
| `EVENT_01` | **🔥 Canh Nồi Bánh Chưng Xuyên Đêm (Tết Co-op)** | **Giai đoạn 5** *(Lv 15)* | Chủ nhà: `5 Nếp + 3 Đậu + 2 Thịt Heo + 500 🪙`; Bạn bè: **`🪵 Tiếp Củi (0 ⚡)`**. | Bạn nhận **Bao Lì Xì (`+150 🪙`)**; Chủ nhận **4 Bánh Chưng Hoàng Kim** + **`+20 💎`**. | Sự kiện Co-op chủ lực đốt nông sản vụ Tết. |
| `BM_HOME_01..02`| **🏡 Khu Du Lịch Sinh Thái Homestay (Cấp 1–2)** | **Giai đoạn 5** *(Lv 26)* | Chi phí xây dựng: **`45.000 🪙 -> 120.000 🪙`** + Phục vụ *Món Đại Tiệc 3 Miền*. | Thu **`650 -> 1.600 🪙/lượt`** + **`+10 💎`** + **`+20 Phong Thủy`**. | End-Game Gold & Food Sink lớn nhất. |
| `NEW_HEIR_01` | **💍 Lễ Cưới Quê & Bé Tiểu Đồng Gia Bảo** | **Giai đoạn 5** *(Lv 28)* | Đạt `10/10 Tim ❤️` + **`50.000 🪙`** + `10 Buồng Cau Trầu`. | Vợ/Chồng nấu **Mâm Cơm Sáng (`+30 ⚡/ngày`)** + **Bé Tiểu Đồng (`+10` nông sản/ngày)**. | Đỉnh cao thành tựu đời sống giữ chân dài hạn. |

---

### 4.2. Bảng Cân Bằng Kinh Tế Sảnh Chung, Đấu Trường PK / Loạn Chiến & Hyper-Casual (`Giai Đoạn 6 — EPIC 11: M11.1 ➔ M11.6`)

| Mã Module | Tên Chế Độ Chơi Tại Sảnh Chung | Chi Phí Tham Gia / Lệ Phí Sới Đình (`Input Sink`) | Cơ Chế Giải Thưởng & Khóa Chống Lạm Phát (`Zero-Sum & Daily Cap`) | Vai Trò Kinh Tế & Giữ Chân (`Retention Role`) |
| :--- | :--- | :--- | :--- | :--- |
| `M11.1` | **⛩️ Sảnh Chung "Chợ Đình Ba Miền" & Tương Tác** | • Vào sảnh & Biểu cảm cơ bản: **`0 🪙, 0 ⚡`**.<br>• Mua *Pháo Hoa Giấy / Mời Trà Đá Cả Sảnh*: **`200 🪙/lần`**. | Người mời Trà Đá nhận **`+5 Điểm Nghĩa Xóm`**; tối đa 10 người đứng gần nhấp uống nhận **`+5 ⚡ Năng lượng`** (tối đa 1 lần/ngày/người nhận). | Nơi khoe Thời trang 12 Slots (`FASH_01..12`), kích thích nhu cầu mua sắm ngoại trang mạnh gấp 3 lần khi chỉ đứng ở nhà. |
| `M11.2` | **🥊 PK Đối Kháng 1v1: Cầu Tre, Đấu Vật & Ném Dép** | • **Chế độ Giao Hữu:** `0 🪙, 0 ⚡`.<br>• **Chế độ Sới Đình Có Vé:** Lệ phí **`300 🪙/người`** (Tổng quỹ `600 🪙`). | • **Thuế Sới Đình `10%` (`-60 🪙` đốt khỏi game)**.<br>• Người thắng nhận **`540 🪙` (Lãi ròng `+240 🪙`)** + **`+25 🏮 Xu Hội Làng`** + **`+15 Điểm Võ Đài ELO`**.<br>• Người thua vẫn nhận an ủi **`+5 🏮 Xu Hội Làng`**. | **100% Deflationary (Giảm phát):** Mỗi trận PK có vé đốt trực tiếp `60 🪙` khỏi nền kinh tế mà không in thêm tiền mới! |
| `M11.3` | **⚔️ Đấu Tổ Đội 2v2 / 3v3: Cướp Cờ Lúa Vàng & Kéo Co** | • Lệ phí mỗi thành viên: **`250 🪙/người`** (Tổng quỹ 3v3 = `1,500 🪙`, `0 ⚡`). | • **Thuế Sới Đình `10%` (`-150 🪙` đốt khỏi game)**.<br>• Đội thắng chia đều **`1,350 🪙` (`450 🪙/người`, lãi ròng `+200 🪙`)** + **`+30 🏮 Xu Hội Làng`**. | Thúc đẩy rủ bạn bè lập nhóm cố định online cùng giờ mỗi tối (`20:00 – 22:00`). |
| `M11.4` | **💥 Loạn Chiến 8–12 Người: Ao Làng Bắt Vịt & Truyền Pháo** | • Lệ phí vé vào hội: **`200 🪙/người`** (Tổng quỹ 8 người = `1,600 🪙`, `0 ⚡`). | • **Thuế Sới Đình `10%` (`-160 🪙` đốt khỏi game)**.<br>• Quỹ `1,440 🪙` chia theo Top: **Top 1 nhận `700 🪙` + `40 🏮`**, **Top 2 nhận `440 🪙` + `25 🏮`**, **Top 3 nhận `300 🪙` + `15 🏮`**. | Đốt `160 🪙/trận` và tạo tiếng cười sảng khoái kiểu *Fall Guys / Party Animals* đậm chất thôn quê. |
| `M11.5` & `M11.6` | **⚡ Cổng Máy Thùng Hyper-Casual Đơn (Chẻ Tre, Nhảy Lá Sen, Bắn Bi Ve)** | • Chơi thử / Luyện tập: **`0 🪙, 0 ⚡`**.<br>• Vé Đua Top Bảng Vàng Tuần: **`150 🪙/lượt`**. | • **5 ván đầu trong ngày:** Thưởng `150 – 300 🪙/ván` (Khóa cứng **Trần `1,500 🪙/ngày` & `100 🏮/ngày`**).<br>• **Từ ván thứ 6 trở đi:** Chỉ ghi nhận **Điểm Kỷ Lục (`High Score`)** tranh Top Tuần nhận Cúp & Danh hiệu. | Giữ chân người chơi ở lại trong game suốt các khoảng chờ 5–15 phút mà không làm lạm phát Vàng. |

---

## PHẦN 5: HỆ THỐNG GÓI NẠP IAP & BẢNG CÂN ĐỐI DÒNG TIỀN TỔNG THỂ QUA 6 GIAI ĐOẠN (DAILY SOURCES VS. SINKS)

### 5.1. 6 Gói IAP Chiến Lược (Đã Tích Hợp Đặc Quyền Sảnh Chung & Võ Đài)
1. **🌱 Gói Khởi Nghiệp: "Về Quê Lập Nghiệp" (`19.000đ` - 1 lần):** `120 💎` + `3.000 🪙` + **🐕 Chó Phú Quốc Giữ Nhà** + **Áo Bà Ba/Tứ Thân Lụa Đỏ (R)**.
2. **🌾 Thẻ Tháng: "Bác Nông Dân Mẫu Mực" (`79.000đ` / 30 ngày):** Tổng `750 💎` + `1.200 ⚡` + **Skip Ads** + **+20% Sức chứa Kho** + **+1 Ô Máy** + **Miễn phí 100% Lương Ông Quản Gia Cửu (`WORK_06`)** + **Tặng kèm Biểu Cảm Múa Lân VIP tại Sảnh Chung**.
3. **🏮 Sổ Tay Mùa Vụ (Season Pass `99.000đ`):** Tổng `400 💎` + `25.000 🪙` + **Bộ Thời Trang Lễ Hội (SR)** + **Skin Nhà Chính & Khung Bong Bóng Chat Hoàng Kim tại Sảnh Chung**.
4. **📈 Quỹ Khuyến Nông Trưởng Thành (`149.000đ` - 1 lần):** Nhận tổng `1.750 💎` giải ngân từ Lv 5 đến Lv 30.
5. **👗 Gói Thời Trang Tháng: "Lụa Là Gấm Vóc" (`49.000đ`):** Bộ Thời Trang 6 Món (SR) + `150 💎` (Mặc đi dạo ở Sảnh Chung kích hoạt **Hiệu ứng Hoa Đào / Hoa Mai Rơi Quanh Chân**).
6. **📦 Gói Giải Cứu Đầy Kho: "Nới Rộng Bồ Thóc" (`29.000đ`):** `100 💎` + Đủ bộ 6 Vật tư Nâng cấp Kho đang thiếu + `50 ⚡`.

### 5.2. Bảng Cân Đối Dòng Tiền Xu Vàng Tổng Thể Theo 6 Giai Đoạn (`Daily Gold Velocity Balance Sheet`)

| Giai Đoạn Lộ Trình | Tổng Thu Nhập Xu / Ngày (`Sources`) | Chi Tiêu Mua Máy, Cây, Giống (`Base Sinks`) | Chi Phí Nuôi Nhân Công Lán Thợ (`Worker Sinks`) | Chi Phí Lễ Hội, Thuế Sới Đình PK 10% & Vé Đua Top Hyper-Casual (`Event & Arena Sinks`) | Tỷ Lệ Hút Tiền (`Sink / Source Ratio`) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Giai đoạn 1 (Lv 1 – 9)** | `2.500 – 7.500 🪙` | `2.200 – 5.500 🪙` | *Chưa mở Lán Thợ* | `500 – 1.800 🪙` *(Khai hoang đất hoang, Mua giống cây lâu năm)* | **95% – 102%** |
| **Giai đoạn 2 & 3 (Lv 10 – 17)** | `15.000 – 28.000 🪙` | `5.500 – 9.000 🪙` | **`2.500 – 5.500 🪙/ngày`** *(Thuê 1–3 Thợ)* | `5.500 – 11.500 🪙` *(Đố Ca dao, Thương Đội Liên Gia, Thuế Chợ 10%, Đổi Kỷ vật 8x–9x)* | **94% – 101%** |
| **Giai đoạn 4 & 5 (Lv 18 – 30)** | `38.000 – 68.000 🪙` | `12.000 – 18.000 🪙` | **`10.000 – 16.700 🪙/ngày`** *(Thuê 4–6 Thợ)* | `16.000 – 33.000 🪙` *(Vườn Ươm Đột Biến, Đình Làng, Đua Trâu, Bánh Trung Thu, Bánh Chưng Tết, Homestay, Lễ Cưới)* | **97% – 110%** |
| **Giai đoạn 6 (Mở rộng Sảnh Chung & PK)** | `+1.500 🪙/ngày` *(Trần thưởng 5 ván Hyper-Casual đầu ngày)* | *Giữ nguyên* | *Giữ nguyên* | **`+2.000 – 5.500 🪙/ngày` đốt thêm** *(10% Thuế Sới Đình PK/Loạn Chiến + Pháo hoa/Trà đá Sảnh Chung + Vé Đua Top Máy Thùng)* | **99% – 112%** *(Giảm phát ròng cực kỳ lành mạnh!)* |
