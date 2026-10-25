# TÀI LIỆU TỔNG HỢP GAMEPLAY, KINH TẾ TUẦN HOÀN VAC, CỐT TRUYỆN 10 CHƯƠNG & HỆ THỐNG NHIỆM VỤ 5 TẦNG (MASTER GDD & NARRATIVE BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` *(Đã hợp nhất `01_MASTER_GDD` + `12_MASTER_NARRATIVE`, loại bỏ trùng lặp & đồng bộ chuẩn 155 Thực thể)*  
**Phiên bản:** Master GDD & Narrative 5.0 (Production-Ready)  
**Đối tượng sử dụng:** Product Owner (PO), Game Designer, Narrative Designer, Frontend & Backend Engineers, QC

---

## CHƯƠNG 1: TẦM NHÌN SẢN PHẨM & CƠ CHẾ LỐI CHƠI HYBRID (70% TYCOON + 30% LIFE-SIM RPG)

### 1.1. Tầm Nhìn Sản Phẩm (High Concept)
**"Bỏ phố về quê, khôi phục Gia Phả Ba Miền từ mảnh vườn, bờ ao quê mẹ."**  
Người chơi rời đô thị ồn ào trở về quê hương (**Bắc Bộ**, **Trung Bộ – Tây Nguyên**, hoặc **Nam Bộ**) tiếp quản mảnh đất tổ tiên cùng chiếc tráp gỗ lim của Ông Nội để lại. Bên trong là **Cuốn Sổ Gia Phả Nông Nghiệp Ba Miền bị thất lạc 9 trang** và tờ khế ước thế chấp đất `50,000 🪙 Xu Vàng` của **Thương Nhân Bá Kiến**. Từ vài luống lúa, đàn gà và cái ao nhỏ theo mô hình **Vườn – Ao – Chuồng (VAC)** tuần hoàn, người chơi mở rộng 25 phân khu, thuê 6 Gia nhân Lán Thợ, sáng tạo 27 món ẩm thực 3 miền, diện thời trang 12 Slots, kết nối giao thương xuyên Việt và cảm hóa chính đối thủ ở Hồi kết.

### 1.2. Quy Tắc Vàng Lối Chơi Hybrid & Năng Lượng "Bát Cơm" (`⚡ Stamina`)
1. **Chế độ Quản lý Trang trại (Tycoon – Tốn `0 ⚡ Năng lượng`):**
   * Góc nhìn `3/4 Top-Down Oblique` trên lưới `32x32 px`. Mọi thao tác sản xuất cốt lõi tại nhà (*Gieo hạt, Tưới nước Giếng Làng, Thu hoạch, Cho vật nuôi ăn, Nấu ăn Bếp Quê*) **HOÀN TOÀN MIỄN PHÍ NĂNG LƯỢNG (`0 ⚡`)** để người chơi không bao giờ bị chặn khi đang chăm trang trại.
2. **Chế độ Mở rộng, Khám phá & Tương tác Xã hội (RPG – Tốn `⚡ Năng lượng`):**
   * Thanh **Năng lượng (`⚡ 50/50`, hồi `+1 ⚡` mỗi 3 phút hoặc ăn món ăn Bếp Quê)** dùng cho:
     * **🪣 Vét Bùn Đáy Ao (`-3 ⚡`):** Thu `3 Xô Bùn Phù Sa` (`ITEM_BUN_PHU_SA`) bón cây nổ Hoàng Kim `⭐` (`x3 giá trị`).
     * **🪓 Khai Hoang Mở Rộng Đất (`-5 ⚡` + `500 🪙`):** Mở khóa từ `12/25` lên tối đa `25/25` phân khu bản đồ.
     * **🎋 Thám Hiểm Rừng Trúc & Bãi Bồi (`-6 ⚡`):** Đào măng rừng, tìm phấn hoa đột biến & mảnh cổ vật (`+5 💎`).
     * **🥁 Chèo Thuyền Rồng Hợp Tác Xã (`-4 ⚡`):** Đua thuyền rồng tiến thêm `+120m` nhận `+380 🪙` & `+5 💎`.
     * **🥷 Hái Trộm Vườn (`-1 ⚡`) / Câu Trộm Cá (`-2 ⚡`):** Rình hái trộm nhà bạn bè trong cửa sổ vàng 2 phút.

---

## CHƯƠNG 2: KHỞI TẠO NHÂN VẬT, BẢN SẮC 3 MIỀN & HỒ SƠ 10 NHÂN VẬT (`VOICE PILLARS`)

### 2.1. Chiến Lược "70% Tài Nguyên Chung – 30% Đặc Sản Độc Quyền 3 Miền"

| Tiêu Chí | 1. Đồng Bằng & Trung Du Bắc Bộ (`NORTH`) | 2. Duyên Hải & Tây Nguyên Trung Bộ (`CENTRAL`) | 3. Miệt Vườn Sông Nước Nam Bộ (`SOUTH`) |
| :--- | :--- | :--- | :--- |
| **Kiến trúc & Cảnh quan** | Nhà ngói đỏ 3 gian, cổng làng rêu phong, cây đa giếng nước đá ong, đồi chè xanh. | Nhà rường gỗ cổ kính / Nhà sàn đất đỏ Bazan, đèn lồng Hội An, rặng dừa biển. | Nhà ba gian ven kênh rạch, cầu khỉ tre, bến xuồng ba lá, đầm sen Đồng Tháp. |
| **Buff Nội Tại Vùng** | **Đất Phù Sa Cổ:** Giảm **10% thời gian chín** cho toàn bộ cây ngắn ngày (`CROP`). | **Nắng Gió Cao Nguyên:** Giảm **10% thời gian chế biến** tại 8 nhà máy (`MACHINE`). | **Mùa Nước Nổi:** Tăng **+1 sản lượng phụ** khi thu hoạch Thủy sản Ao (`AQUA`). |
| **10 Đặc Sản Độc Quyền** | *Cải cúc, Chè Thái Nguyên, Vải thiều, Nhãn lồng, Bưởi Diễn & Đào, Gà Đông Tảo, Lợn bản, Cá trắm đen, Cá anh vũ, Rươi Tứ Kỳ.* | *Tỏi Lý Sơn, Thanh long, Nho Ninh Thuận, Hồ tiêu & Điều, Cà phê Buôn Ma Thuột, Dê cừu, Hươu sao, Cá bống, Ghẹ Ô Loan, Tôm hùm.* | *Bông điên điển, Khóm Cầu Đúc, Măng cụt, Vú sữa, Sầu riêng Ri6, Vịt đồng, Nhà yến, Cá tra/Cá linh, Cá tai tượng, Cua Cà Mau.* |

### 2.2. Hồ Sơ Tâm Lý, Phương Ngữ & Lời Thoại Ngắn Của 10 NPC & Gia Nhân (`Character Voice Pillars`)

| Mã NPC | Tên Nhân Vật & Vai Trò | Chiều Sâu Tâm Lý (Wound vs. Desire) | Phương Ngữ & Nhịp Câu | Câu Thoại Ngắn Đặc Trưng (`In-Game Barks`) |
| :--- | :--- | :--- | :--- | :--- |
| `NPC_01` | **👴 Bác Trưởng Thôn Bảy** *(Người dẫn đường)* | Sợ lớp trẻ bỏ làng đi hết; mong mảnh vườn của bạn ông (Ông Nội) trù phú trở lại. | Bắc Bộ ấm áp, chậm rãi, hay đọc ca dao thời tiết. | *"Nắng tốt dưa, mưa tốt lúa, ra đồng thôi cháu ơi!"* |
| `NPC_02` | **🎩 Thương Nhân Bá Kiến** *(Chủ nợ Khế ước)* | Từng trắng tay vì bão lụt nên chỉ tin vào tiền mặt; sâu thẳm vẫn nhớ vị cá kho của mẹ. | Sắc lạnh, thực dụng, quy mọi thứ ra con số, hay cười *"Hừm..."*. | *"Đất này phân lô lời gấp vạn trồng rau! Nhưng quả Hoàng Kim này ta mua giá gấp đôi!"* |
| `NPC_03` | **👩‍🏫 Cô Giáo Hương** *(Phụ trách Trường Làng)* | Thương học trò nghèo thiếu bữa cơm đủ chất; gây quỹ từ Hợp Tác Xã. | Trong trẻo, dịu dàng, giàu cảm xúc. | *"Bọn trẻ trường làng mong mẻ đậu phụ làng Mơ nóng hổi của bạn lắm!"* |
| `NPC_04` | **👗 Cô Ba Tiệm May** *(Nghệ nhân Tơ Lụa)* | Đam mê phục dựng cổ phục Việt 3 miền từ tơ tằm tự nhiên. | Tinh tế, duyên dáng, hay khen ngợi gu thẩm mỹ. | *"Ba món đồ trùng nhau đưa Cô Ba khâu ghép là lên thẳng bậc Tím SR!"* |
| `WORK_01` | **🌾 Chú Tư Cày** *(Thợ Vườn – Lv.14)* | Mất ruộng riêng vì bão nên đi làm thuê; trọng cái tình và bữa cơm nóng của chủ nhà. | Chất phác, thật thà, câu ngắn gọn. | • *No (85%+):* *"Đất có công, cây không phụ lòng người!"*<br>• *Đói (<35%):* *"Tôi về Lán Thợ làm bát cơm canh cá đã nhé!"* |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn Nuôi – Lv.16)* | Thương đàn vật nuôi như con; ghét nhất ai để gà vịt nhịn đói. | Giọng miền Trung đằm thắm (*"răng, rứa, mô, tê"*). | *"Trứng gà Đông Tảo mới đẻ còn ấm nóng tay đây nì!"* |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Thợ Ao Cá – Lv.18)* | Tay bơi lặn miệt vườn hào sảng, sẵn sàng lội bùn vét ao miễn phí `⚡` cho chủ. | Phương ngữ Nam Bộ (*"nghen, dữ thần, hết sảy"*). | *"Bùn đáy ao đặc quánh vầy bón Sầu riêng là hết sảy con bà Bảy!"* |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Đầu Bếp – Lv.20)* | Giữ lửa 27 công thức 3 miền, sợ hương vị xưa thất truyền. | Chu đáo, hay giục ăn khi cơm còn nóng. | *"Cá trắm Bắc gặp tiêu Trung, thêm nước dừa Nam là thơm nức xóm!"* |
| `WORK_05` | **🪵 Chú Tám Mộc** *(Thợ Cây Lâu Năm – Lv.22)* | Nghệ nhân chiết cành lão luyện, điềm đạm như gốc cổ thụ. | Chắc nịch, kiệm lời. | *"Gốc có vững, phù sa có dày thì quả mới hóa Hoàng Kim."* |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng Quản – Lv.25)* | Quản gia điền trang cổ truyền, yêu sự ngăn nắp và sổ sách minh bạch. | Lễ độ, trang trọng, báo cáo kèm số liệu. | *"Bẩm Điền chủ, 5 gia nhân đã no bụng, Giỏ Kho đạt 120/120 đơn vị!"* |

---

## CHƯƠNG 3: VÒNG LẶP TUẦN HOÀN VAC (155 THỰC THỂ), 8 XƯỞNG & 6 GIA NHÂN LÁN THỢ

### 3.1. Đại Danh Mục 155 Thực Thể Chuẩn Hóa (`04_MASTER_DATA.csv` & `src/data/masterData.ts`)
1. **🌱 Vườn (`48 Loài`):** 22 Cây ruộng ngắn/trung hạn (`CROP_01..22`), 8 Cây lâu năm chung (`CROP_23..30`), 15 Cây đặc sản 3 miền (`CROP_N01..S05`), 3 Giống đột biến ngũ sắc (`CROP_MUT_01..03`: *Lúa Tím Thảo Dược, Dưa Hấu Vuông Tài Lộc, Bưởi Hồ Lô & Sen Nghìn Cánh*).
2. **🐄 Chuồng & Thú Cưng (`19 Loài`):** 8 Vật nuôi chung (`ANI_01..08`, có *Tằm ăn lá dâu nhả Kén Tơ Vàng*), 6 Vật nuôi đặc sản 3 miền (`ANI_N01..S02`), 5 Thú cưng canh gác & hỗ trợ (`PET_01..04`, `DEF_02`: *Chó Phú Quốc, Mèo Tam Thể, Trâu Đen, Chim Sáo, Đàn Ngỗng*).
3. **🐟 Ao & Đầm Nước (`19 Loài`):** 10 Thủy sản chung (`AQUA_01..10`, có *Trai sông ngậm Ngọc Trai*) + 9 Thủy sản đặc sản 3 miền (`AQUA_N01..S03`).
4. **🏭 8 Xưởng Chế Biến (`MAC_01..08`) & 🍲 27 Món Ăn 3 Miền (`PROD_01..24`, `PROD_N01/C01/S01`):** Kết hợp cơ chế **Nồi Đất Phối Món Ngẫu Nhiên ("Thử Tài Bếp Quê" >= 3 nguyên liệu)** thưởng nóng `+10 💎 Ngọc`, `+50 XP`, `+25 ⚡`.
5. **🛖 6 Nhân Công Lán Thợ (`WORK_01..06`) & 4 Đồ Bảo Hộ 72 Giờ (`CRAFT_01..04`):**
   * Khép kín **4 Vòng lặp Tiêu tiền Mid/Late-Game**: (1) Trả lương Xu Vàng (`800 ➔ 3,500 🪙/ngày`, chiết khấu 12% khi thuê 3 ngày); (2) Dọn cơm lên **Bàn Ăn Chung Lán Thợ** (khi `Độ No < 35%`, thợ tự đi bộ về bàn ăn hồi `100% Độ No`); (3) Cấp phát *Nón lá, Áo cánh nâu, Áo tơi, Đồng phục lụa* (độ bền `72h`); (4) Thưởng Phụ cấp Ngày mùa (`-300 🪙` lên `100% Hăng Say`).
   * **Quy tắc Cửa sổ Vàng 2 Phút & Giỏ Kho Thợ (`120 ô`):** Sau khi cây/cá chín, chủ nhà có **3 phút Ân huệ** bảo vệ tuyệt đối; Nhân công chờ đúng **5 phút** sau khi chín mới tự động thu hoạch vào Giỏ Kho Thợ $\rightarrow$ Mở ra **2 phút cửa sổ vàng (phút thứ 3 đến phút thứ 5)** cho hàng xóm rình hái trộm!
6. **🪞 12 Slots Thời Trang (`FASH_01..12`) & 12 Tính Năng Benchmark / IAP (`BM_*`, `IAP_01..04`).**

---

## CHƯƠNG 4: BIÊN NIÊN SỬ CỐT TRUYỆN CHÍNH 10 CHƯƠNG ("GIA PHẢ BA MIỀN") & ĐỐI THOẠI PHÂN NHÁNH

Ở mỗi chương, người chơi lựa chọn giữa 2 nhánh đối thoại mang lại phần thưởng khác nhau về bản chất:
* **🤝 Nhánh Nghĩa Tình Làng Xóm (`EMP`):** Cộng **`+30 Điểm Mỹ Quan Phong Thủy` + `+3 Điểm Nghĩa Xóm`**.
* **🪙 Nhánh Kinh Tế Thực Dụng (`PRAG`):** Cộng nóng **`+350 🪙 Xu Vàng`** bổ sung vào phần thưởng chương.

| Chương | Tên Chương & Cấp Mở | Nhân Vật & Lời Thoại Tình Huống (`NPC Quote`) | Mục Tiêu Gameplay & Trang Gia Phả Mở Khóa | Thưởng Cơ Bản |
| :--- | :--- | :--- | :--- | :---: |
| **Chương 1** *(Lv.1)* | **Bức Thư Trong Chiếc Tráp Gỗ Lim** | **🎩 Bá Kiến:** *"Ký giấy nhượng lại mảnh vườn này lấy 2,000 Xu tiêu xài, đỡ phải chân lấm tay bùn trả khoản khế ước 50,000 Xu!"* | Từ chối bán đất tổ tiên, tưới nước Giếng Làng (`-15%` t/g) và thu hoạch vụ Lúa Nước đầu tiên $\rightarrow$ **Mở Trang Gia Phả #1**. | `600 🪙`<br>`15 💎` |
| **Chương 2** *(Lv.3)* | **Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao** | **👴 Bác Bảy:** *"Mùi cá kho riềng sả bốc lên làm bác nhớ bà nội cháu xưa kia quá... Bát đầu tiên cháu tính đem biếu ai?"* | Vét Bùn Ao (`-3⚡`) lấy 3 Xô Phù Sa & phối 3 nguyên liệu trong Nồi Đất Bếp Quê $\rightarrow$ **Mở Trang Gia Phả #2 (Nổ Hoàng Kim `⭐ x3`)**. | `900 🪙`<br>`20 💎` |
| **Chương 3** *(Lv.6)* | **Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông** | **👩‍🏫 Cô Giáo Hương:** *"Cơn mưa đầu mùa làm tốc mái bếp ăn trường làng rồi... May mà có chuyến xe rau gạo của bạn kịp chở tới!"* | Dựng lại giàn cây sau bão (`+20%` sản lượng) & giao 1 Đơn Hàng Hợp Tác Xã $\rightarrow$ **Mở Trang Gia Phả #3 (Cứu trợ 0⚡)**. | `1,200 🪙`<br>`25 💎` |
| **Chương 4** *(Lv.9)* | **Bóng Đêm Rình Rập & Chó Phú Quốc** | **👴 Bác Bảy:** *"Đêm qua có kẻ rón rén vào vườn xoài đánh rơi chiếc Dép Tổ Ong! Cháu mau huấn luyện chú Chó Phú Quốc canh sân!"* | Ghé thăm nhà hàng xóm qua Báo Chợ, ký Sổ Lưu Bút & mở khóa **4 Lớp Phòng Thủ (Trang Gia Phả #4)**. | `1,500 🪙`<br>`30 💎` |
| **Chương 5** *(Lv.12)* | **Tiếng Còi Tàu Thống Nhất Bắc – Nam** | **👧 Út Nhỏ:** *"Ghe Sầu riêng Ri6 của em vừa cập bến tàu! Mình kết nghĩa giao thương 3 miền Bắc – Trung – Nam nghen!"* | Đóng 1 Toa Hàng trên Ga Tàu Thống Nhất hoặc đăng bán lên Chợ Phiên 3 Miền $\rightarrow$ **Mở Trang Gia Phả #5 (Voucher Trâu Đen)**. | `2,000 🪙`<br>`35 💎` |
| **Chương 6** *(Lv.14)* | **Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư** | **👨‍🌾 Chú Tư Cày:** *"Cậu/Cô chủ không chê lão nông này già cả, còn nấu canh cải cá rô đãi cơm trưa... Tôi xin thề chăm từng gốc lúa!"* | Thuê nhân công Lán Thợ, dọn cơm lên Bàn Ăn Chung & thu Giỏ Kho Thợ (`120 ô`) $\rightarrow$ **Mở Trang Gia Phả #6 (Lazy-Tick Offline)**. | `2,500 🪙`<br>`40 💎` |
| **Chương 7** *(Lv.16)* | **Bí Truyền Khung Cửi Lụa & Áo Mới** | **👗 Cô Ba Tiệm May:** *"Tơ tằm năm nay óng ả như nắng thu! Điền chủ muốn may áo bảo hộ cho Lán Thợ trước hay may Áo Dài dự hội?"* | Cấp phát áo bảo hộ 72h cho nhân công & khâu ghép trang phục 12 Slots (`3➔1`) $\rightarrow$ **Mở Trang Gia Phả #7 (Transmog)**. | `3,200 🪙`<br>`45 💎` |
| **Chương 8** *(Lv.18)* | **Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ** | **🪵 Chú Tám Mộc:** *"Hũ sành cổ trong Rừng Trúc chứa phấn hoa đột biến của Ông Nội cháu đấy! Chiết cành đủ Pity là nổ 100%!"* | Thám hiểm Rừng Trúc (`-6⚡`) & chiết cành tại Vườn Ươm Đột Biến Đình Làng $\rightarrow$ **Mở Trang Gia Phả #8 (Pity Đột Biến)**. | `4,000 🪙`<br>`50 💎` |
| **Chương 9** *(Lv.22)* | **Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến** | **🎩 Bá Kiến:** *"Miếng cá trắm kho tiêu thấm nước dừa này... 40 năm rồi ta mới được ăn lại vị mẹ nấu. Ta xin đốt tờ khế ước!"* | Nấu món Đại Tiệc Giao Thoa 3 Miền & công đức trùng tu Đình Làng $\rightarrow$ **Mở Trang Gia Phả #9 (Đình Làng Cấp 3 `+5%` sản lượng)**. | `6,000 🪙`<br>`60 💎` |
| **Chương 10** *(Lv.25+)*| **Trầu Cau Nên Duyên & Gia Bảo Truyền Đời** | **💍 Tri Kỷ:** *"Từ hai bàn tay trắng ngày mới về quê, giờ cánh đồng lúa chín vàng rực rỡ... Mình viết tiếp cuốn Gia Phả Ba Miền nhé!"* | Đạt 10/10 Tim Kết hôn, đón đoàn khách Homestay Đầm Sen & xuất ảnh **Bằng Khen Điền Chủ (`.PNG`)**. | `10,000 🪙`<br>`100 💎` |

---

## CHƯƠNG 5: KIẾN TRÚC HỆ THỐNG NHIỆM VỤ 5 TẦNG (`5-TIER QUEST ARCHITECTURE`)

1. **Tầng 1 – Nhiệm vụ Chính tuyến 10 Chương (*Gia Phả Ba Miền*):** Dẫn dắt cốt truyện từ Lv.1 đến Lv.30+ kèm lựa chọn phân nhánh `EMP` / `PRAG`.
2. **Tầng 2 – Chuỗi 7 Ngày Tân Thủ (*Về Quê Lập Nghiệp*):** Điểm danh 7 ngày nhận Vàng, Ngọc, *Áo Bà Ba Lụa* (Ngày 3), *Nón Lá Bài Thơ* (Ngày 5) và **🐕 Chó Phú Quốc Giữ Nhà SSR** (Ngày 7).
3. **Tầng 3 – Vòng lặp Phiên chơi (*Đơn Hợp Tác Xã & 3 Toa Tàu Thống Nhất*):** Tiêu thụ nông sản và món ăn mỗi 15–30 phút để lấy Vàng, XP, Điểm Nghĩa Xóm và Voucher Tàu Hỏa.
4. **Tầng 4 – Tâm Tình Lán Thợ (*Chuyện Đời 6 Gia Nhân*):** Đãi đúng món ăn khoái khẩu và cấp phát áo bảo hộ mới mỗi 72 giờ cho 6 nhân công để kích hoạt trạng thái `100% Hăng Say`.
5. **Tầng 5 – Sự kiện Cộng đồng & LiveOps (*Đình Làng, Đua Thuyền Rồng, Chợ Đêm, Hội Thi Duyên Dáng*):** Gắn kết hàng xóm toàn Server qua Loa Phường, Sổ Lưu Bút và Xổ Số Kiến Thiết 18:00.
