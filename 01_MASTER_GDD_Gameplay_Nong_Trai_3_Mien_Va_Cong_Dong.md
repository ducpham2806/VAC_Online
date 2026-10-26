# TÀI LIỆU TỔNG HỢP GAMEPLAY, KINH TẾ TUẦN HOÀN VAC, CỐT TRUYỆN 10 CHƯƠNG, LỄ HỘI 3 MIỀN, SẢNH CHUNG ĐA NGƯỜI CHƠI & VŨ TRỤ HYPER-CASUAL (MASTER GDD & NARRATIVE BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` *(Đã hợp nhất `01_MASTER_GDD` + `12_MASTER_NARRATIVE` + 6 Sự kiện Lễ hội 3 Miền + **Chương 6: Sảnh Chung Đa Người Chơi, Đấu Trường PK/Loạn Chiến & Cổng Game Hyper-Casual Siêu Tốc**, loại bỏ 100% trùng lặp)*  
**Phiên bản:** Master GDD & Narrative 7.0 (Full Production, LiveOps & Social Arena Expansion v3.0)  
**Thực hiện bởi:** `@game-designer`, `@narrative-designer`, `@level-designer`, `@godot-multiplayer-engineer` & `@growth-hacker`  
**Đối tượng sử dụng:** Product Owner (PO), Game Designer, Narrative Designer, Frontend & Backend Engineers, Artist/Sound, QC

---

## CHƯƠNG 1: TẦM NHÌN SẢN PHẨM & CƠ CHẾ LỐI CHƠI HYBRID (70% TYCOON + 30% LIFE-SIM & SOCIAL PARTY RPG)

### 1.1. Tầm Nhìn Sản Phẩm (High Concept)
**"Bỏ phố về quê, khôi phục Gia Phả Ba Miền từ mảnh vườn, bờ ao quê mẹ và hội tụ tại Sảnh Chung Chợ Đình."**  
Người chơi rời đô thị ồn ào trở về quê hương (**Bắc Bộ**, **Trung Bộ – Tây Nguyên**, hoặc **Nam Bộ**) tiếp quản mảnh đất tổ tiên cùng chiếc tráp gỗ lim của Ông Nội để lại. Bên trong là **Cuốn Sổ Gia Phả Nông Nghiệp Ba Miền bị thất lạc 9 trang** và tờ khế ước thế chấp đất `50,000 🪙 Xu Vàng` của **Thương Nhân Bá Kiến**. Từ vài luống lúa, đàn gà và cái ao nhỏ theo mô hình **Vườn – Ao – Chuồng (VAC)** tuần hoàn, người chơi mở rộng 25 phân khu, thuê 6 Gia nhân Lán Thợ, giải đố Ca dao ẩm thực, lập Thương Đội Liên Gia 3 Miền, và bước ra **Sảnh Chung Chợ Đình Ba Miền** để điều khiển nhân vật giao lưu trực tiếp, so tài **PK Võ Đài Dân Gian (1v1, 3v3, Loạn Chiến 8–12 người)** hoặc giải trí siêu tốc với hệ thống **Micro-Game Hyper-Casual (30s–90s)** ngay trong lúc chờ lúa chín.

### 1.2. Quy Tắc Vàng Lối Chơi Hybrid & Năng Lượng "Bát Cơm" (`⚡ Stamina`)
1. **Chế độ Quản lý Trang trại & Giải trí Sảnh Chung (Tycoon & Casual Arcade – Tốn `0 ⚡ Năng lượng`):**
   * Góc nhìn `3/4 Top-Down Oblique` trên lưới `32x32 px`. Mọi thao tác sản xuất cốt lõi tại nhà (*Gieo hạt, Tưới nước Giếng Làng, Thu hoạch, Cho vật nuôi ăn, Nấu ăn Bếp Quê, Tiếp củi Bánh Chưng giúp bạn, Dựng giàn cây sau bão*) và **mọi ván chơi giải trí tại Sảnh Chung / Hyper-Casual Arcade** đều **HOÀN TOÀN MIỄN PHÍ NĂNG LƯỢNG (`0 ⚡`)** để người chơi luôn có việc thú vị để làm khi chờ cây lớn.
2. **Chế độ Mở rộng, Khám phá & Tương tác Đặc biệt (RPG – Tốn `⚡ Năng lượng`):**
   * Thanh **Năng lượng (`⚡ 50/50`, hồi `+1 ⚡` mỗi 3 phút hoặc ăn món ăn Bếp Quê)** dùng cho:
     * **🪣 Vét Bùn Đáy Ao (`-3 ⚡`):** Thu `3 Xô Bùn Phù Sa` (`ITEM_BUN_PHU_SA`) bón cây nổ Hoàng Kim `⭐` (`x3 giá trị`) + cơ hội nhặt **Kỷ Vật Tuổi Thơ 8x–9x**.
     * **🪓 Khai Hoang Mở Rộng Đất (`-5 ⚡` + `500 🪙`):** Mở khóa từ `12/25` lên tối đa `25/25` phân khu bản đồ.
     * **🎋 Thám Hiểm Rừng Trúc & Bãi Bồi (`-6 ⚡`):** Đào măng rừng, tìm phấn hoa đột biến & săn **12 Kỷ Vật Tuổi Thơ** (`+5 💎`).
     * **🥁 Chèo Thuyền Rồng Hợp Tác Xã & Đua Trâu Vàng (`-4 ⚡`):** Thi đấu thể thao làng quê nhận Vàng, Ngọc & Cúp vinh danh.
     * **🥷 Hái Trộm Vườn (`-1 ⚡`) / Câu Trộm Cá (`-2 ⚡`):** Rình hái trộm nhà bạn bè trong cửa sổ vàng 2 phút.

---

## CHƯƠNG 2: KHỞI TẠO NHÂN VẬT, BẢN SẮC 3 MIỀN & HỒ SƠ 11 NHÂN VẬT (`VOICE PILLARS`)

### 2.1. Chiến Lược "70% Tài Nguyên Chung – 30% Đặc Sản Độc Quyền 3 Miền"

| Tiêu Chí | 1. Đồng Bằng & Trung Du Bắc Bộ (`NORTH`) | 2. Duyên Hải & Tây Nguyên Trung Bộ (`CENTRAL`) | 3. Miệt Vườn Sông Nước Nam Bộ (`SOUTH`) |
| :--- | :--- | :--- | :--- |
| **Kiến trúc & Cảnh quan** | Nhà ngói đỏ 3 gian, cổng làng rêu phong, cây đa giếng nước đá ong, đồi chè xanh. | Nhà rường gỗ cổ kính / Nhà sàn đất đỏ Bazan, đèn lồng Hội An, rặng dừa biển. | Nhà ba gian ven kênh rạch, cầu khỉ tre, bến xuồng ba lá, đầm sen Đồng Tháp. |
| **Buff Nội Tại Vùng** | **Đất Phù Sa Cổ:** Giảm **10% thời gian chín** cho toàn bộ cây ngắn ngày (`CROP`). | **Nắng Gió Cao Nguyên:** Giảm **10% thời gian chế biến** tại 8 nhà máy (`MACHINE`). | **Mùa Nước Nổi:** Tăng **+1 sản lượng phụ** khi thu hoạch Thủy sản Ao (`AQUA`). |
| **10 Đặc Sản Độc Quyền** | *Cải cúc, Chè Thái Nguyên, Vải thiều, Nhãn lồng, Bưởi Diễn & Đào, Gà Đông Tảo, Lợn bản, Cá trắm đen, Cá anh vũ, Rươi Tứ Kỳ.* | *Tỏi Lý Sơn, Thanh long, Nho Ninh Thuận, Hồ tiêu & Điều, Cà phê Buôn Ma Thuột, Dê cừu, Hươu sao, Cá bống, Ghẹ Ô Loan, Tôm hùm.* | *Bông điên điển, Khóm Cầu Đúc, Măng cụt, Vú sữa, Sầu riêng Ri6, Vịt đồng, Nhà yến, Cá tra/Cá linh, Cá tai tượng, Cua Cà Mau.* |

### 2.2. Hồ Sơ Tâm Lý, Phương Ngữ & Lời Thoại Ngắn Của 11 NPC & Gia Nhân (`Character Voice Pillars`)

| Mã NPC | Tên Nhân Vật & Vai Trò | Chiều Sâu Tâm Lý (Wound vs. Desire) | Phương Ngữ & Nhịp Câu | Câu Thoại Ngắn Đặc Trưng (`In-Game Barks`) |
| :--- | :--- | :--- | :--- | :--- |
| `NPC_01` | **👴 Bác Trưởng Thôn Bảy** *(Người dẫn đường)* | Sợ lớp trẻ bỏ làng đi hết; mong mảnh vườn của bạn ông (Ông Nội) trù phú trở lại. | Bắc Bộ ấm áp, chậm rãi, hay đọc ca dao thời tiết. | *"Nắng tốt dưa, mưa tốt lúa, ra đồng thôi cháu ơi!"* |
| `NPC_02` | **🎩 Thương Nhân Bá Kiến** *(Chủ nợ Khế ước)* | Từng trắng tay vì bão lụt nên chỉ tin vào tiền mặt; sâu thẳm vẫn nhớ vị cá kho của mẹ. | Sắc lạnh, thực dụng, quy mọi thứ ra con số, hay cười *"Hừm..."*. | *"Đất này phân lô lời gấp vạn trồng rau! Nhưng quả Hoàng Kim này ta mua giá gấp đôi!"* |
| `NPC_03` | **👩‍🏫 Cô Giáo Hương** *(Phụ trách Trường Làng)* | Thương học trò nghèo thiếu bữa cơm đủ chất; gây quỹ từ Hợp Tác Xã. | Trong trẻo, dịu dàng, giàu cảm xúc. | *"Bọn trẻ trường làng mong mẻ đậu phụ làng Mơ nóng hổi của bạn lắm!"* |
| `NPC_04` | **👗 Cô Ba Tiệm May** *(Nghệ nhân Tơ Lụa)* | Đam mê phục dựng cổ phục Việt 3 miền từ tơ tằm tự nhiên. | Tinh tế, duyên dáng, hay khen ngợi gu thẩm mỹ. | *"Ba món đồ trùng nhau đưa Cô Ba khâu ghép là lên thẳng bậc Tím SR!"* |
| `NPC_05` | **🥢 Cụ Đồ Ẩm Thực Vũ Bằng** *(Thực Khách Bí Ẩn)* | Đi khắp 3 miền tìm lại "Miếng ngon nhớ lâu" thuở xưa; chỉ truyền bí kíp cho người hiểu hồn quê qua từng câu ca dao. | Uyên bác, hào hoa, luôn mở đầu bằng 2 câu thơ đố. | *"Gió đưa hương cốm qua rào, Đố ai nấu được bát canh ngọt lòng?"* |
| `WORK_01` | **🌾 Chú Tư Cày** *(Thợ Vườn – Lv.14)* | Mất ruộng riêng vì bão nên đi làm thuê; trọng cái tình và bữa cơm nóng của chủ nhà. | Chất phác, thật thà, câu ngắn gọn. | • *No (85%+):* *"Đất có công, cây không phụ lòng người!"*<br>• *Đói (<35%):* *"Tôi về Lán Thợ làm bát cơm canh cá đã nhé!"* |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn Nuôi – Lv.16)* | Thương đàn vật nuôi như con; ghét nhất ai để gà vịt nhịn đói. | Giọng miền Trung đằm thắm (*"răng, rứa, mô, tê"*). | *"Trứng gà Đông Tảo mới đẻ còn ấm nóng tay đây nì!"* |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Thợ Ao Cá – Lv.18)* | Tay bơi lặn miệt vườn hào sảng, sẵn sàng lội bùn vét ao miễn phí `⚡` cho chủ. | Phương ngữ Nam Bộ (*"nghen, dữ thần, hết sảy"*). | *"Bùn đáy ao đặc quánh vầy bón Sầu riêng là hết sảy con bà Bảy!"* |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Đầu Bếp – Lv.20)* | Giữ lửa 27 công thức 3 miền, sợ hương vị xưa thất truyền. | Chu đáo, hay giục ăn khi cơm còn nóng. | *"Cá trắm Bắc gặp tiêu Trung, thêm nước dừa Nam là thơm nức xóm!"* |
| `WORK_05` | **🪵 Chú Tám Mộc** *(Thợ Cây Lâu Năm – Lv.22)* | Nghệ nhân chiết cành lão luyện, điềm đạm như gốc cổ thụ. | Chắc nịch, kiệm lời. | *"Gốc có vững, phù sa có dày thì quả mới hóa Hoàng Kim."* |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng Quản – Lv.25)* | Quản gia điền trang cổ truyền, yêu sự ngăn nắp và sổ sách minh bạch. | Lễ độ, trang trọng, báo cáo kèm số liệu. | *"Bẩm Điền chủ, 5 gia nhân đã no bụng, Giỏ Kho đạt 120/120 đơn vị!"* |

---

## CHƯƠNG 3: VÒNG LẶP TUẦN HOÀN VAC (155 THỰC THỂ), 8 XƯỞNG & 6 GIA NHÂN LÁN THỢ

### 3.1. Đại Danh Mục 155 Thực Thể Chuẩn Hóa (`04_MASTER_DATA.csv` & `src/data/masterData.ts`)
1. **🌱 Vườn (`48 Loài`):** 22 Cây ruộng ngắn/trung hạn (`CROP_01..22`), 8 Cây lâu năm chung (`CROP_23..30`), 15 Cây đặc sản 3 miền (`CROP_N01..S05`), 3 Giống đột biến ngũ sắc (`CROP_MUT_01..03`).
2. **🐄 Chuồng & Thú Cưng (`19 Loài`):** 8 Vật nuôi chung (`ANI_01..08`), 6 Vật nuôi đặc sản 3 miền (`ANI_N01..S02`), 5 Thú cưng canh gác & hỗ trợ (`PET_01..04`, `DEF_02`).
3. **🐟 Ao & Đầm Nước (`19 Loài`):** 10 Thủy sản chung (`AQUA_01..10`) + 9 Thủy sản đặc sản 3 miền (`AQUA_N01..S03`).
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
| **Chương 5** *(Lv.12)* | **Tiếng Còi Tàu Thống Nhất Bắc – Nam** | **👧 Út Nhỏ:** *"Ghe Sầu riêng Ri6 của em vừa cập bến tàu! Mình kết nghĩa giao thương 3 miền Bắc – Trung – Nam nghen!"* | Đóng 1 Toa Hàng trên Ga Tàu Thống Nhất hoặc lập Thương Đội Liên Gia 3 Miền $\rightarrow$ **Mở Trang Gia Phả #5 (Voucher Trâu Đen)**. | `2,000 🪙`<br>`35 💎` |
| **Chương 6** *(Lv.14)* | **Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư** | **👨‍🌾 Chú Tư Cày:** *"Cậu/Cô chủ không chê lão nông này già cả, còn nấu canh cải cá rô đãi cơm trưa... Tôi xin thề chăm từng gốc lúa!"* | Thuê nhân công Lán Thợ, dọn cơm lên Bàn Ăn Chung & thu Giỏ Kho Thợ (`120 ô`) $\rightarrow$ **Mở Trang Gia Phả #6 (Lazy-Tick Offline)**. | `2,500 🪙`<br>`40 💎` |
| **Chương 7** *(Lv.16)* | **Bí Truyền Khung Cửi Lụa & Áo Mới** | **👗 Cô Ba Tiệm May:** *"Tơ tằm năm nay óng ả như nắng thu! Điền chủ muốn may áo bảo hộ cho Lán Thợ trước hay may Áo Dài dự hội?"* | Cấp phát áo bảo hộ 72h cho nhân công & khâu ghép trang phục 12 Slots (`3➔1`) $\rightarrow$ **Mở Trang Gia Phả #7 (Transmog)**. | `3,200 🪙`<br>`45 💎` |
| **Chương 8** *(Lv.18)* | **Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ** | **🪵 Chú Tám Mộc:** *"Hũ sành cổ trong Rừng Trúc chứa phấn hoa đột biến và kỷ vật tuổi thơ của Ông Nội cháu đấy!"* | Thám hiểm Rừng Trúc (`-6⚡`) & chiết cành tại Vườn Ươm Đột Biến Đình Làng $\rightarrow$ **Mở Trang Gia Phả #8 (Pity Đột Biến & Kỷ Vật)**. | `4,000 🪙`<br>`50 💎` |
| **Chương 9** *(Lv.22)* | **Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến** | **🎩 Bá Kiến:** *"Miếng cá trắm kho tiêu thấm nước dừa này... 40 năm rồi ta mới được ăn lại vị mẹ nấu. Ta xin đốt tờ khế ước!"* | Giải đố Ca dao của Cụ Đồ Vũ Bằng, nấu món Đại Tiệc 3 Miền & công đức trùng tu Đình Làng $\rightarrow$ **Mở Trang Gia Phả #9 (Đình Làng Cấp 3 `+5%`)**. | `6,000 🪙`<br>`60 💎` |
| **Chương 10** *(Lv.25+)*| **Trầu Cau Nên Duyên & Gia Bảo Truyền Đời** | **💍 Tri Kỷ:** *"Từ hai bàn tay trắng ngày mới về quê, giờ cánh đồng lúa chín vàng rực rỡ... Mình viết tiếp cuốn Gia Phả Ba Miền nhé!"* | Đạt 10/10 Tim Kết hôn, đón đoàn khách Homestay Đầm Sen & xuất ảnh **Bằng Khen Điền Chủ (`.PNG`)**. | `10,000 🪙`<br>`100 💎` |

---

## CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 6 TÍNH NĂNG CHIỀU SÂU & SỰ KIỆN LỄ HỘI 3 MIỀN (`FEAT_01..03`, `EVENT_01..03`)

1. **`FEAT_01` — 🛶 Thương Đội Liên Gia 3 Miền (`Co-op Caravan Bắc – Trung – Nam` | Giai Đoạn 3 - Lv.13):** Tổ đội 3 người chơi thuộc đủ 3 miền (`1 Bắc + 1 Trung + 1 Nam`), mỗi người góp 10 Đặc sản miền mình + `300 🪙` trong 4 giờ $\rightarrow$ Cả 3 nhận `+1,800 🪙`, `+15 💎`, `+5 Nghĩa Xóm` và **3 Túi Hạt Giống Giao Thoa** (cho phép trồng thử đặc sản miền bạn tối đa 3 vụ).
2. **`FEAT_02` — 🥢 Thực Khách Bí Ẩn & Đố Ca Dao Bếp Quê (`Mystery Food Critic NPC` | Giai Đoạn 2 - Lv.10):** Lúc `12:00` và `19:00`, **Cụ Đồ Vũ Bằng (`NPC_05`)** ra 1 trong 30 câu đố Ca dao ẩm thực. Phối đúng 3 nguyên liệu hoặc nộp 2 món ăn khớp đáp án trong 15 phút nhận `+650 🪙`, `+10 💎`, `+20 ⚡` & `1 Sao Mai Ẩm Thực`.
3. **`FEAT_03` — 📻 Bảo Tàng 12 Kỷ Vật Tuổi Thơ 8x–9x (`Nostalgia Collection & 1-for-1 Swap` | Giai Đoạn 4 - Lv.11):** Hợp nhất hoàn toàn mảnh cổ vật cũ thành 12 Kỷ vật 8x–9x (*Bi ve, Máy điện tử 4 nút, Bút Trường Sơn, Đài Cassette...*) rơi `18%` khi Vét Ao / Rừng Trúc / Bắt trộm. Cho phép **Đổi 1-1 với hàng xóm (`-100 🪙`)**; đủ bộ nhận tổng `+150 💎`, Nhạc Sáo Trúc và Buff vĩnh viễn `+5% Xu Đơn HTX`.
4. **`EVENT_01` — 🔥 Canh Nồi Bánh Chưng Xuyên Đêm (`Tết Co-op Fire-Tending` | Giai Đoạn 5 - Lv.15):** Chủ nhà bắc nồi bánh 6 giờ (`5 Nếp + 3 Đậu + 2 Thịt Heo + 500 🪙`); tối đa 5 người bạn bấm **`🪵 Tiếp Thêm Củi Lửa (0⚡)`** giúp giảm 20 phút/người & chống mưa tắt bếp. Bạn nhận **Bao Lì Xì Đỏ (`+150 🪙`, `15%` nổ `5 💎`)**, chủ nhà nhận **4 Cặp Bánh Chưng Hoàng Kim** & `+20 💎`.
5. **`EVENT_02` — 🌕 Đêm Hội Trăng Rằm & Lò Bánh Trung Thu (`Mid-Autumn Lantern Event` | Giai Đoạn 4 - Lv.12):** Khi thời tiết chuyển sang `🌙 Đêm Đom Đóm`, nộp `2 Hạt Sen + 2 Đậu Xanh + 2 Trứng Vịt + 300 🪙` nướng Hộp Bánh Trung Thu (đãi Lán Thợ khóa `100% Tinh thần Hăng Say` suốt 24h hoặc biếu NPC nhân đôi `x2 Tim ❤️`).
6. **`EVENT_03` — 🐃 Hội Thi "Trâu Vàng Cày Giỏi & Vịt Chạy Đồng" (`Weekend Pet Derby` | Giai Đoạn 4 - Lv.14):** Đua thú cưng cuối tuần (`1,000 🪙` + `1 Bùn Phù Sa` + `4⚡`), về Nhất nhận `2,200 🪙`, `+15 💎` & **Cúp Trâu Vàng (`+150 Phong Thủy`)**.

---

## CHƯƠNG 6: SẢNH CHUNG ĐA NGƯỜI CHƠI ("CHỢ ĐÌNH BA MIỀN"), ĐẤU TRƯỜNG DÂN GIAN (PK / TỔ ĐỘI / LOẠN CHIẾN) & VŨ TRỤ HYPER-CASUAL SIÊU TỐC (`GIAI ĐOẠN 6 — EXPANSION v3.0`)

*(Được thiết kế bởi `@game-designer`, `@level-designer`, `@godot-multiplayer-engineer`, `@economy-designer` & `@frontend-developer` để biến VAC Online từ game nông trại cá nhân thành một **Thế Giới Mở Xã Hội Thu Nhỏ (Social Party Hub & Hyper-Casual Arcade)** giúp giữ chân người chơi suốt thời gian chờ cây trồng chín).*

### 6.1. Triết Lý Thiết Kế: "Trồng Cây Ở Trang Trại – Tụ Hội Quẩy Hết Mình Ở Sảnh Đình Làng"
* **Giải quyết điểm nghẽn lớn nhất của thể loại Farm Tycoon:** Trong các game nông trại truyền thống, sau khi gieo hạt và giao việc cho Nhân công xong, người chơi phải thoát game chờ 15–60 phút.
* **Giải pháp Giai đoạn 6 (`EPIC 11: M11.1 ➔ M11.6`):** Ngay trên thanh HUD chính có nút **`⛩️ Ra Sảnh Chợ Đình (Online)`**. Chỉ mất `< 0.5 giây` chuyển cảnh, người chơi bước vào một không gian chung sôi động, nơi **25–30 Điền chủ đang trực tiếp điều khiển nhân vật đi lại**, khoe bộ trang phục 12 Slots lấp lánh, rủ nhau đấu **PK Cầu Khỉ 1v1**, lập đội **Cướp Cờ Lúa Vàng 3v3**, nhảy vào **Ao Bùn Loạn Chiến 8–12 người**, hoặc đứng bên **Lều Máy Thùng Điện Tử Xóm** cày các game **Hyper-Casual 30 giây**!

---

### 6.2. Quy Hoạch Không Gian Sảnh Chung "Chợ Đình Ba Miền" (`M11.1` — `@level-designer`)

Bản đồ Sảnh Chung có kích thước **`48 x 32 Tiles` (`1536 x 1024 px`)**, chia thành **5 Phân Khu Tương Tác Trực Quan (`5 Spatial Activity Zones`)** xoay quanh Cây Đa nghìn năm:

```
+====================================================================================================+
|                     [KHU BẮC] 🕹️ LỀU TRÒ CHƠI DÂN GIAN & CỔNG MÁY THÙNG HYPER-CASUAL               |
|                     (Chẻ Tre Siêu Tốc 15s • Nhảy Lá Sen Qua Ao 30s • Bắn Bi Ve & Tạt Lon)          |
+------------------------------------+-------------------------------+-------------------------------+
| [KHU TÂY] 💥 BÃI BỒI LOẠN CHIẾN    |   🌳 QUẢNG TRƯỜNG CÂY ĐA      | [KHU ĐÔNG] 🥊 VÕ ĐÀI & SỚI VẬT|
| (Party Brawl 8 - 12 Người)         |   & CHIẾU HOA TRUNG TÂM       | (PK Đối Kháng 1v1 & 3v3)      |
| • Ao Làng Đại Náo Bắt Vịt (8P)     |   • Khoe Thời Trang 12 Slots  | • Đi Cầu Tre Đấu Gậy Bông 1v1 |
| • Tranh Pháo Đất & Né Trâu (12P)   |   • Bong Bóng Chat Trên Đầu   | • Đấu Vật Sới Đình Sumo 1v1   |
| • Vòng Tròn Đăng Ký Ghép Trận Tự Động| • Biểu Cảm Múa Sạp / Múa Lân| • Cướp Cờ Bông Lúa Vàng 3v3  |
+------------------------------------+-------------------------------+-------------------------------+
|                     [KHU NAM] 🍵 QUÁN NƯỚC ĐẦU LÀNG & BẾN XUỒNG VỀ TRANG TRẠI                      |
|                     (Ngồi ghế đẩu uống trà đá nhận Buff • Bảng Vàng Võ Đài • Cửa Hàng Xu Hội Làng) |
+====================================================================================================+
```

#### Cơ Chế Điều Khiển & Tương Tác Trực Tiếp Tại Sảnh Chung (`Avatar Control & Social Mechanics`):
1. **Điều khiển di chuyển mượt mà (`Movement`):**
   * **Mobile / Tablet Landscape:** Cần gạt **Virtual Joystick 8 hướng** dưới ngón cái trái.
   * **Web PC:** Phím **`WASD` / Mũi tên** hoặc **Chạm/Click chuột xuống nền gạch (`Click-to-Move`)**.
   * **Thú cưng đi theo (`Follower Pet`):** *Chó Phú Quốc, Mèo Tam Thể* hoặc *Bé Tiểu Đồng* tự động chạy lon ton theo sau lưng chủ nhân trên sân đình!
2. **Bánh Xe Biểu Cảm & Tương Tác Nhanh (`Emote & Action Wheel` dưới ngón cái phải):**
   * **8 Biểu cảm & Hành động xã hội:** `👋 Vẫy chào`, `💃 Nhảy Múa Sạp`, `🦁 Múa Đầu Lân`, `🍵 Mời Trà Đá`, `🌸 Tung Pháo Hoa Giấy`, `😂 Cười Lăn Lộn`, `🩴 Giơ Dép Tổ Ong Dọa`, và **`🥊 Gạ Kèo PK Trực Tiếp`**.
   * **Bong bóng hội thoại trực tiếp (`Proximity Chat Bubble`):** Khi người chơi nhắn tin ở Sảnh Chung, câu nói hiện ngay trong khung bong bóng trắng trên đầu nhân vật trong `5 giây` để mọi người đứng gần đọc được ngay lập tức.
   * **Chạm vào người chơi khác (`Player Inspect Popover`):** Xem nhanh bộ trang phục 12 Slots, Điểm Phong Cách `✨`, Danh hiệu Võ Đài và 3 nút nhanh: **`🏡 Thăm Trang Trại`**, **`🔄 Đổi Kỷ Vật 1-1`**, **`🥊 Thách Đấu PK 1v1`**.

---

### 6.3. Đặc Tả 4 Nhóm Chế Độ Chơi: PK Đối Kháng (1v1), Tổ Đội (2v2/3v3), Loạn Chiến (8–12P) & Chơi Đơn Hyper-Casual (`M11.2 ➔ M11.5`)

*(Lưu ý Kiểm toán Không Trùng Lặp: Khác hoàn toàn với `EVENT_03: Đua Trâu Vàng` và `M08.3: Đua Thuyền Rồng` vốn là sự kiện chỉ số nông trại, các chế độ tại Sảnh Chung là **Action Minigames điều khiển thời gian thực (Real-time Skill-based Arcade)** nơi trang bị nạp tiền không làm mất cân bằng kỹ năng tay!).*

#### Nhóm 1: 🥊 Hoạt Động PK Đối Kháng 1v1 — "Võ Đài Dân Gian" (`M11.2` | Thời lượng: `45 – 60 giây/trận`)

| Mã Mode | Tên Trò Chơi PK 1v1 | Cơ Chế Điều Khiển & Kỹ Năng (`Inputs & Mechanics`) | Điều Kiện Thắng (`Win Condition`) |
| :--- | :--- | :--- | :--- |
| `PK_1V1_01` | **🎋 Đi Cầu Tre Đấu Gậy Bông**<br>*(Bamboo Bridge Joust)* | Hai người chơi đứng trên cây cầu khỉ đung đưa bắc qua ao bùn. Sử dụng **3 nút kỹ năng theo luật Kéo – Búa – Bao có căn nhịp**:<br>• `🗡️ Đập Gậy Bông Tầm Cao` (Phá thế Nhảy, thua thế Quét thấp).<br>• `🧹 Quét Gậy Tầm Thấp` (Phá thế Đứng thủ, thua thế Nhảy).<br>• `🦘 Nhảy Lộn & Phản Đòn` (Né đòn thấp và đẩy lùi đối thủ `1.5m`). | Ai đẩy đối thủ rơi ùm xuống ao bùn trước (**Thắng 2/3 Hiệp**) sẽ giành chiến thắng kèm hiệu ứng cá trắm nhảy lên đớp! |
| `PK_1V1_02` | **🤼 Đấu Vật Sới Đình**<br>*(Village Sumo Arena)* | Điều khiển nhân vật trong vòng tròn sới vật đường kính `8m` (thu hẹp dần mỗi 15 giây). Giữ nút **`⚡ Tụ Lực Húc (Charge Dash)`** rồi thả tay để lao tới hất văng đối phương, hoặc bấm **`🌀 Nghiêng Người Né (Sidestep)`** đúng khoảnh khắc đối thủ lao vào để mượn lực đẩy họ văng khỏi vạch vôi! | Hất đối phương ra ngoài vòng tròn sới vật (**2/3 Hiệp**). |
| `PK_1V1_03` | **🩴 Đại Chiến Ném Dép Tổ Ong**<br>*(Dodge-Slipper Duel)* | Sân chia làm 2 nửa cách nhau bờ rào tre. Hai bên chạy nhặt *Dép Tổ Ong, Quả Bưởi, Bóng Nước* xuất hiện ngẫu nhiên, kéo thả căn hướng ném (`Skillshot`) sang sân đối phương. Trúng *Bóng Nước* bị làm chậm `30%`, trúng *Dép Tổ Ong* mất `1 Tim` (Mỗi bên có `3 Tim`). | Hạ gục hết `3 Tim` của đối phương hoặc còn nhiều Tim hơn khi hết `60 giây`. |

#### Nhóm 2: ⚔️ Tổ Đội Đối Kháng 2v2 / 3v3 — "Hiệp Lực Đồng Hương" (`M11.3` | Thời lượng: `60 – 90 giây/trận`)

| Mã Mode | Tên Trò Chơi Đấu Nhóm | Cơ Chế Phối Hợp Đồng Đội (`Teamwork Mechanics`) | Điều Kiện Thắng (`Win Condition`) |
| :--- | :--- | :--- | :--- |
| `TEAM_3V3_01` | **🚩 Cướp Cờ Bông Lúa Vàng**<br>*(3v3 Capture the Flag)* | Hai đội Đỏ – Xanh (hoặc đại diện 2 Miền) tranh nhau **Cờ Bông Lúa Vàng** mọc giữa sân đình để đem về cắm tại bệ đá đội nhà. Người cầm cờ bị giảm `20%` tốc chạy; 2 đồng đội đi cùng phải dùng **`🛡️ Nón Lá Chắn Đòn`** hoặc ném **`🪣 Bùn Phù Sa Trơn Trượt`** cản đối phương truy đuổi! | Đội cắm được **3 Cờ trước** hoặc nhiều cờ hơn sau `90 giây`. |
| `TEAM_2V2_02` | **🪢 Kéo Co & Ném Còn Phối Hợp**<br>*(Sync Tug-of-War)* | Kết hợp phản xạ bấm đúng vùng Vàng thanh nhịp điệu (`Rhythm Bar`). Khi cả 2–3 thành viên trong đội cùng bấm trúng điểm **`PERFECT`** trong cùng 1 nhịp trống đình, đội kích hoạt cú **`💥 Giật Đồng Tâm`** kéo dây thừng lùi mạnh về phía mình! | Kéo khăn đỏ qua vạch chiến thắng trong `45 giây`. |

#### Nhóm 3: 💥 Loạn Chiến Quần Đấu 8 – 12 Người — "Hội Làng Đại Náo" (`M11.4` | Thời lượng: `60 – 90 giây/trận`)

| Mã Mode | Tên Trò Chơi Loạn Chiến | Cơ Chế Loạn Chiến Nhiều Người (`Party Brawl / Battle Royale`) | Điều Kiện Thắng (`Win Condition`) |
| :--- | :--- | :--- | :--- |
| `BRAWL_8P_01` | **🦆 Ao Làng Đại Náo – Bắt Vịt Vàng**<br>*(8-Player Mud Pond Brawl)* | 8 người chơi cùng lội xuống ao bùn trơn trượt đuổi bắt đàn vịt chạy tán loạn (*Vịt thường `+10 điểm`, Vịt Hoàng Kim `+50 điểm`*). Người chơi có thể dùng **`🪤 Quăng Lưới Cá`** hoặc **`💥 Húc Vai`** làm người đang ôm Vịt Hoàng Kim bị choáng `1.5s` và đánh rơi vịt ra giữa ao! | Top 1, 2, 3 người chơi có tổng điểm bắt vịt cao nhất sau `75 giây`. |
| `BRAWL_12P_02`| **🧨 Truyền Pháo Đất & Né Trâu Húc**<br>*(12-Player Last Farmer Standing)* | 12 người chơi chạy trong sân rào tre. Mỗi `12 giây`, một người ngẫu nhiên bị gắn **`🧨 Quả Pháo Đất Đếm Ngược`** trên tay và phải đuổi chạm vào người khác để truyền quả pháo đi trước khi hết giờ! Đồng thời mỗi `8 giây` có chú Trâu Đen chạy ngang sân húc văng ai không kịp né. | Người trụ lại cuối cùng không bị nổ pháo lấm bồ hóng trở thành **Trạng Nguyên Hội Làng**. |

#### Nhóm 4: ⚡ Chơi Đơn Siêu Tốc — "Lều Máy Thùng Hyper-Casual" (`M11.5` | Thời lượng: `15 – 45 giây/ván`)

Dành cho người chơi muốn giải trí 1 mình siêu nhanh bằng **1 ngón tay (`One-Tap / One-Swipe`)**, vào ván trong **`0 giây`** không cần chờ ghép trận:
1. **`HC_SOLO_01` — 🎋 Chẻ Tre & Bổ Dừa Siêu Tốc (`Reflex Swipe Slicer` - 30 giây):** Vuốt ngón tay chẻ đôi các khúc tre, dừa xiêm, dưa hấu tung lên màn hình để lấy combo điểm; tuyệt đối tránh chém trúng *Quả Pháo Đỏ* hoặc *Tổ Ong Mật*.
2. **`HC_SOLO_02` — 🐸 Nhảy Lá Sen Qua Ao Cá (`One-Tap Endless Hopper` - 30 giây):** Chạm trái/phải để nhân vật (hoặc Chú Ếch Cốm) nhảy qua các tàu lá sen trôi ngược chiều và lưng cá trắm đen mà không rơi xuống nước.
3. **`HC_SOLO_03` — 🎯 Bắn Bi Ve & Tạt Lon Sữa Bò (`Physics Flick & Aim` - 45 giây):** Kéo căn lực và góc bắn viên bi ve ngũ sắc đẩy bi đối phương ra khỏi vòng tròn đất, hoặc ném dép tổ ong hạ đổ tháp 10 lon sữa bò chỉ trong 3 lượt ném.

---

### 6.4. Kiến Trúc Mở Rộng "Plug-and-Play Hyper-Casual SDK" (`M11.6` — Dựng Thêm Game Mới Chỉ Trong 2–4 Giờ)

Để đội ngũ Dev hoặc AI Agent có thể liên tục bổ sung thêm hàng chục trò chơi Hyper-Casual mới trong tương lai mà **không làm phình to hay ảnh hưởng đến code Nông trại chính (`FarmScene.ts`)**, toàn bộ hệ thống trò chơi tại Sảnh Chung được chuẩn hóa theo kiến trúc **Modular Cartridge (`Băng Điện Tử 4 Nút Lắp Ghép`)**:

1. **Tách biệt hoàn toàn Scene (`Zero Coupling`):**
   * Mỗi trò chơi Hyper-Casual hoặc PK là một class độc lập thực thi giao diện `IHyperCasualCartridge` (`init()`, `update(dt)`, `onPointerInput()`, `getScore()`, `dispose()`).
   * Khung vỏ **`ArcadeCabinetModal.tsx` & `MinigameHostScene.ts`** lo sẵn 100% các phần dùng chung: *Đếm ngược `3-2-1`, Thanh thời gian `30s–90s`, Xử lý Joystick/Swipe, Hiệu ứng Pháo hoa Chiến thắng, Bảng Xếp Hạng Tuần và Gửi kết quả nhận thưởng lên Server*.
2. **Tái sử dụng 100% Kho Asset Sẵn Có (`Zero Extra Download`):**
   * Toàn bộ các trò chơi Hyper-Casual dùng trực tiếp các Sprite đã được `PixelAssetGenerator.ts` sinh sẵn trong RAM (*Dép tổ ong, Dưa hấu, Tre trúc, Cá trắm, Vịt cỏ, Trâu đen, Ла sen*) $\rightarrow$ Dung lượng tăng thêm bằng `0 KB`, bấm là chơi ngay trong `0ms`!

---

## CHƯƠNG 7: KIẾN TRÚC HỆ THỐNG NHIỆM VỤ 6 TẦNG (`6-TIER QUEST ARCHITECTURE`)

1. **Tầng 1 – Nhiệm vụ Chính tuyến 10 Chương (*Gia Phả Ba Miền*):** Dẫn dắt cốt truyện từ Lv.1 đến Lv.30+ kèm lựa chọn phân nhánh `EMP` / `PRAG`.
2. **Tầng 2 – Chuỗi 7 Ngày Tân Thủ (*Về Quê Lập Nghiệp*):** Điểm danh 7 ngày nhận Vàng, Ngọc, *Áo Bà Ba Lụa*, *Nón Lá Bài Thơ* và **🐕 Chó Phú Quốc Giữ Nhà SSR**.
3. **Tầng 3 – Vòng lặp Phiên chơi (*Đơn Hợp Tác Xã, 3 Toa Tàu Thống Nhất & Đố Ca Dao Thực Khách Bí Ẩn*):** Tiêu thụ nông sản và món ăn mỗi 15–30 phút.
4. **Tầng 4 – Tâm Tình Lán Thợ & Kỷ Vật Tuổi Thơ (*Chuyện Đời 6 Gia Nhân & Bảo Tàng 8x–9x*):** Đãi món khoái khẩu, cấp áo bảo hộ 72h và sưu tầm đủ 12 Kỷ vật tuổi thơ.
5. **Tầng 5 – Sự kiện Cộng đồng & Lễ Hội 3 Miền (*Thương Đội Liên Gia, Canh Nồi Bánh Chưng, Đêm Hội Trăng Rằm, Đua Trâu Vàng & Đua Thuyền Rồng*).**
6. **Tầng 6 (MỚI) – Nhiệm vụ Sảnh Chung & Đấu Trường Dân Gian (*Hội Thao Chợ Đình Hàng Ngày*):** Giao lưu biểu cảm tại Sảnh Chung, thắng 1 trận PK Cầu Tre 1v1 hoặc đạt mốc điểm Hyper-Casual để nhận **`🏮 Xu Hội Làng`** đổi Danh hiệu Phát sáng và Khung Avatar Độc quyền.
