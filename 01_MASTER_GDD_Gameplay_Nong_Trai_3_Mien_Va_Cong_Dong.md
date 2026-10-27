# TÀI LIỆU TỔNG HỢP GAMEPLAY, LỘ TRÌNH MỞ KHÓA NÔNG – THỦY – HẢI SẢN 5 ĐỢT, CỐT TRUYỆN 10 CHƯƠNG, LỄ HỘI 3 MIỀN & SẢNH CHUNG HYPER-CASUAL (MASTER GDD & NARRATIVE BIBLE)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` *(Đã hợp nhất `01_MASTER_GDD` + `12_MASTER_NARRATIVE` + **Lộ Trình Chia Nhỏ 5 Đợt Xuất Hiện Nông – Thủy – Hải Sản Theo Cốt Truyện & Giai Đoạn Update** + Chương 6 Sảnh Chung PK/Hyper-Casual, tuân thủ tuyệt đối `RULE D0` không trùng lặp)*  
**Phiên bản:** Master GDD & Narrative 8.0 (Staged Content Rollout & Story-Gated Ecosystem Edition)  
**Thực hiện bởi:** `@game-designer`, `@narrative-designer`, `@economy-designer`, `@level-designer`, `@godot-multiplayer-engineer` & `@growth-hacker`  
**Đối tượng sử dụng:** Product Owner (PO), Game Designer, Narrative Designer, Frontend & Backend Engineers, Artist/Sound, QC

---

## CHƯƠNG 1: TẦM NHÌN SẢN PHẨM & CƠ CHẾ LỐI CHƠI HYBRID (70% TYCOON + 30% LIFE-SIM & SOCIAL PARTY RPG)

### 1.1. Tầm Nhìn Sản Phẩm (High Concept)
**"Bỏ phố về quê, từng bước khôi phục 10 Chương Gia Phả Ba Miền từ luống rau, con cá rô đầu tiên đến đại điền trang và Sảnh Chung Chợ Đình."**  
Người chơi rời đô thị ồn ào trở về quê hương (**Bắc Bộ**, **Trung Bộ – Tây Nguyên**, hoặc **Nam Bộ**) tiếp quản mảnh đất tổ tiên cùng chiếc tráp gỗ lim của Ông Nội để lại. Bên trong là **Cuốn Sổ Gia Phả Nông Nghiệp Ba Miền bị thất lạc 9 trang** và tờ khế ước thế chấp đất `50,000 🪙 Xu Vàng` của **Thương Nhân Bá Kiến**. Thay vì mở sẵn toàn bộ cây trồng vật nuôi ngay từ đầu gây ngợp, hệ sinh thái **81 loài Vườn – Ao – Chuồng (+5 Thú cưng), 8 Xưởng chế biến, 27 Món ăn và 6 Gia nhân** được **chia nhỏ thành 5 Đợt Xuất Hiện (`5 Content Waves`) gắn liền với từng Trang Gia Phả được tìm thấy và từng Giai Đoạn Update (`Giai đoạn 1 ➔ Giai đoạn 5`)**, trước khi hội tụ tranh tài tại **Sảnh Chung Chợ Đình (`Giai đoạn 6`)**.

### 1.2. Quy Tắc Vàng Lối Chơi Hybrid & Năng Lượng "Bát Cơm" (`⚡ Stamina`)
1. **Chế độ Quản lý Trang trại & Giải trí Sảnh Chung (Tycoon & Casual Arcade – Tốn `0 ⚡ Năng lượng`):**
   * Góc nhìn `3/4 Top-Down Oblique` trên lưới `32x32 px`. Mọi thao tác sản xuất cốt lõi tại nhà (*Gieo hạt, Tưới nước Giếng Làng, Thu hoạch, Cho vật nuôi ăn, Nấu ăn Bếp Quê, Tiếp củi Bánh Chưng giúp bạn, Dựng giàn cây sau bão*) và **mọi ván chơi giải trí tại Sảnh Chung / Hyper-Casual Arcade** đều **HOÀN TOÀN MIỄN PHÍ NĂNG LƯỢNG (`0 ⚡`)**.
2. **Chế độ Mở rộng, Khám phá & Tương tác Đặc biệt (RPG – Tốn `⚡ Năng lượng`):**
   * Thanh **Năng lượng (`⚡ 50/50`, hồi `+1 ⚡` mỗi 3 phút hoặc ăn món ăn Bếp Quê)** dùng cho:
     * **🪣 Vét Bùn Đáy Ao (`-3 ⚡`):** Thu `3 Xô Bùn Phù Sa` (`ITEM_BUN_PHU_SA`) bón cây nổ Hoàng Kim `⭐` (`x3 giá trị`) + cơ hội nhặt **Kỷ Vật Tuổi Thơ 8x–9x**.
     * **🪓 Khai Hoang Mở Rộng Đất (`-5 ⚡` + `500 🪙`):** Mở khóa từ `12/25` lên tối đa `25/25` phân khu bản đồ.
     * **🎋 Thám Hiểm Rừng Trúc & Bãi Bồi (`-6 ⚡`):** Đào măng rừng, tìm phấn hoa đột biến & săn **12 Kỷ Vật Tuổi Thơ** (`+5 💎`).
     * **🥁 Chèo Thuyền Rồng Hợp Tác Xã & Đua Trâu Vàng (`-4 ⚡`):** Thi đấu thể thao làng quê nhận Vàng, Ngọc & Cúp vinh danh.
     * **🥷 Hái Trộm Vườn (`-1 ⚡`) / Câu Trộm Cá (`-2 ⚡`):** Rình hái trộm nhà bạn bè trong cửa sổ vàng 2 phút.

---

## CHƯƠNG 2: KHỞI TẠO NHÂN VẬT, BẢN SẮC 3 MIỀN & HỒ SƠ 11 NHÂN VẬT (`VOICE PILLARS`)

### 2.1. Chiến Lược "70% Tài Nguyên Chung – 30% Đặc Sản Độc Quyền 3 Miền (Mở Dần Theo 5 Bậc Giai Đoạn)"

| Tiêu Chí | 1. Đồng Bằng & Trung Du Bắc Bộ (`NORTH`) | 2. Duyên Hải & Tây Nguyên Trung Bộ (`CENTRAL`) | 3. Miệt Vườn Sông Nước Nam Bộ (`SOUTH`) |
| :--- | :--- | :--- | :--- |
| **Kiến trúc & Cảnh quan** | Nhà ngói đỏ 3 gian, cổng làng rêu phong, cây đa giếng nước đá ong, đồi chè xanh. | Nhà rường gỗ cổ kính / Nhà sàn đất đỏ Bazan, đèn lồng Hội An, rặng dừa biển. | Nhà ba gian ven kênh rạch, cầu khỉ tre, bến xuồng ba lá, đầm sen Đồng Tháp. |
| **Buff Nội Tại Vùng** | **Đất Phù Sa Cổ:** Giảm **10% thời gian chín** cho toàn bộ cây ngắn ngày (`CROP`). | **Nắng Gió Cao Nguyên:** Giảm **10% thời gian chế biến** tại 8 nhà máy (`MACHINE`). | **Mùa Nước Nổi:** Tăng **+1 sản lượng phụ** khi thu hoạch Thủy sản Ao (`AQUA`). |
| **Lộ Trình Mở 10 Đặc Sản Độc Quyền Theo Giai Đoạn** | • **GĐ 1:** *Cải cúc & Su hào*<br>• **GĐ 2:** *Chè Thái Nguyên, Gà Đông Tảo*<br>• **GĐ 3:** *Vải thiều, Nhãn lồng, Cá trắm đen*<br>• **GĐ 4:** *Bưởi Diễn & Đào, Lợn bản, Cá anh vũ*<br>• **GĐ 5:** *Rươi Tứ Kỳ Hải Dương (VIP)* | • **GĐ 1:** *Tỏi Lý Sơn & Ớt xiêm*<br>• **GĐ 2:** *Thanh long đỏ, Dê cừu Ninh Thuận*<br>• **GĐ 3:** *Nho Ninh Thuận, Hồ tiêu & Điều, Cá bống*<br>• **GĐ 4:** *Cà phê BMT, Hươu sao, Ghẹ Ô Loan*<br>• **GĐ 5:** *Tôm Hùm Bông Phú Yên (VIP)* | • **GĐ 1:** *Bông điên điển & Bông súng*<br>• **GĐ 2:** *Khóm Cầu Đúc, Vịt đồng trứng son*<br>• **GĐ 3:** *Măng cụt, Vú sữa, Cá linh & Cá tra*<br>• **GĐ 4:** *Sầu riêng Ri6, Nhà yến, Cá tai tượng*<br>• **GĐ 5:** *Tôm Càng Xanh & Cua Cà Mau (VIP)* |

### 2.2. Hồ Sơ Tâm Lý, Phương Ngữ & Lời Thoại Ngắn Của 11 NPC & Gia Nhân (`Character Voice Pillars`)

| Mã NPC | Tên Nhân Vật & Vai Trò | Chiều Sâu Tâm Lý (Wound vs. Desire) | Phương Ngữ & Nhịp Câu | Câu Thoại Ngắn Đặc Trưng (`In-Game Barks`) |
| :--- | :--- | :--- | :--- | :--- |
| `NPC_01` | **👴 Bác Trưởng Thôn Bảy** *(Người dẫn đường - GĐ 1)* | Sợ lớp trẻ bỏ làng đi hết; mong mảnh vườn của bạn ông (Ông Nội) trù phú trở lại. | Bắc Bộ ấm áp, chậm rãi, hay đọc ca dao thời tiết. | *"Nắng tốt dưa, mưa tốt lúa, ra đồng thôi cháu ơi!"* |
| `NPC_02` | **🎩 Thương Nhân Bá Kiến** *(Chủ nợ Khế ước - GĐ 1..4)* | Từng trắng tay vì bão lụt nên chỉ tin vào tiền mặt; sâu thẳm vẫn nhớ vị cá kho của mẹ. | Sắc lạnh, thực dụng, quy mọi thứ ra con số, hay cười *"Hừm..."*. | *"Đất này phân lô lời gấp vạn trồng rau! Nhưng quả Hoàng Kim này ta mua giá gấp đôi!"* |
| `NPC_03` | **👩‍🏫 Cô Giáo Hương** *(Trường Làng - GĐ 2)* | Thương học trò nghèo thiếu bữa cơm đủ chất; gây quỹ từ Hợp Tác Xã. | Trong trẻo, dịu dàng, giàu cảm xúc. | *"Bọn trẻ trường làng mong mẻ đậu phụ làng Mơ nóng hổi của bạn lắm!"* |
| `NPC_04` | **👗 Cô Ba Tiệm May** *(Nghệ nhân Tơ Lụa - GĐ 2)* | Đam mê phục dựng cổ phục Việt 3 miền từ tơ tằm tự nhiên. | Tinh tế, duyên dáng, hay khen ngợi gu thẩm mỹ. | *"Ba món đồ trùng nhau đưa Cô Ba khâu ghép là lên thẳng bậc Tím SR!"* |
| `NPC_05` | **🥢 Cụ Đồ Ẩm Thực Vũ Bằng** *(Thực Khách Bí Ẩn - GĐ 2)* | Đi khắp 3 miền tìm lại "Miếng ngon nhớ lâu" thuở xưa; chỉ truyền bí kíp cho người hiểu hồn quê qua từng câu ca dao. | Uyên bác, hào hoa, luôn mở đầu bằng 2 câu thơ đố. | *"Gió đưa hương cốm qua rào, Đố ai nấu được bát canh ngọt lòng?"* |
| `WORK_01` | **🌾 Chú Tư Cày** *(Thợ Vườn – GĐ 2 / Lv.14)* | Mất ruộng riêng vì bão nên đi làm thuê; trọng cái tình và bữa cơm nóng của chủ nhà. | Chất phác, thật thà, câu ngắn gọn. | • *No (85%+):* *"Đất có công, cây không phụ lòng người!"*<br>• *Đói (<35%):* *"Tôi về Lán Thợ làm bát cơm canh cá đã nhé!"* |
| `WORK_02` | **🐄 Cô Năm Thảo** *(Chăn Nuôi – GĐ 2 / Lv.16)* | Thương đàn vật nuôi như con; ghét nhất ai để gà vịt nhịn đói. | Giọng miền Trung đằm thắm (*"răng, rứa, mô, tê"*). | *"Trứng gà Đông Tảo mới đẻ còn ấm nóng tay đây nì!"* |
| `WORK_03` | **🐟 Anh Sáu Kình** *(Thợ Ao Cá – GĐ 3 / Lv.18)* | Tay bơi lặn miệt vườn hào sảng, sẵn sàng lội bùn vét ao miễn phí `⚡` cho chủ. | Phương ngữ Nam Bộ (*"nghen, dữ thần, hết sảy"*). | *"Bùn đáy ao đặc quánh vầy bón Sầu riêng là hết sảy con bà Bảy!"* |
| `WORK_04` | **🍲 Dì Bảy Bếp** *(Đầu Bếp – GĐ 3 / Lv.20)* | Giữ lửa 27 công thức 3 miền, sợ hương vị xưa thất truyền. | Chu đáo, hay giục ăn khi cơm còn nóng. | *"Cá trắm Bắc gặp tiêu Trung, thêm nước dừa Nam là thơm nức xóm!"* |
| `WORK_05` | **🪵 Chú Tám Mộc** *(Thợ Cây Lâu Năm – GĐ 4 / Lv.22)* | Nghệ nhân chiết cành lão luyện, điềm đạm như gốc cổ thụ. | Chắc nịch, kiệm lời. | *"Gốc có vững, phù sa có dày thì quả mới hóa Hoàng Kim."* |
| `WORK_06` | **📋 Ông Quản Gia Cửu** *(Tổng Quản – GĐ 5 / Lv.25)* | Quản gia điền trang cổ truyền, yêu sự ngăn nắp và sổ sách minh bạch. | Lễ độ, trang trọng, báo cáo kèm số liệu. | *"Bẩm Điền chủ, 5 gia nhân đã no bụng, Giỏ Kho đạt 120/120 đơn vị!"* |

---

## CHƯƠNG 3: MA TRẬN PHÂN BỔ 5 ĐỢT XUẤT HIỆN NÔNG – THỦY – HẢI SẢN & HỆ SINH THÁI LIÊN QUAN THEO CỐT TRUYỆN & GIAI ĐOẠN UPDATE (`5-WAVE CONTENT ROLLOUT`)

### 3.1. Nguyên Tắc Khóa Mở Khóa 3 Tầng (`3-Layer Content Gating` — Không Đổ Dồn Ở Giai Đoạn 1)

Để người chơi mới không bị ngợp bởi hàng trăm giống cây/cá ngay ngày đầu tiên, đồng thời mỗi bản Update lớn (`Giai đoạn 1 ➔ Giai đoạn 5`) đều mang lại cảm giác háo hức khám phá hệ sinh thái mới, mọi thực thể trong **155 Thực thể** đều đi qua **3 Điều Kiện Mở Khóa Đồng Thời**:
$$\text{Unlock\_Condition} = (\text{Game\_Stage} \ge \text{Item.unlockStage}) \land (\text{Story\_Chapter} \ge \text{Item.unlockChapter}) \land (\text{Player\_Level} \ge \text{Item.unlockLevel})$$

### 3.2. Bảng Phân Bổ Chi Tiết 81 Loài Trồng & Nuôi (+5 Thú Cưng, 8 Xưởng, 27 Món Ăn, 4 Đồ Bảo Hộ & 6 Gia Nhân) Qua 5 Đợt Giai Đoạn

| Đợt & Giai Đoạn Update | Chương Gia Phả & Cấp Độ | 🌱 Nhóm Vườn & Cây Lâu Năm Mở Khóa (`Tổng 48 loài`) | 🐄 Nhóm Chuồng & Thú Cưng Mở Khóa (`Tổng 14 loài + 5 Pet`) | 🐟 Nhóm Ao & Thủy Hải Sản Mở Khóa (`Tổng 19 loài`) | 🏭 Xưởng, Món Ăn, Đồ Bảo Hộ & Gia Nhân Đi Kèm | Lũy Kế Loài V-A-C |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **ĐỢT 1**<br>**Giai Đoạn 1 (`v1.0`)**<br>*Khởi Tạo Sinh Kế Quê Mẹ* | **Chương 1 – 2**<br>*(Lv.1 – 8)* | **`16 loài`:**<br>• 12 Cây ruộng ngắn ngày (`CROP_01..12`: *Lúa nước, Rau muống, Ngô, Hành mùi, Cải ngọt, Khoai lang, Đậu tương, Dưa chuột, Mía tím, Lạc, Sả ớt gừng, Đậu xanh*).<br>• 1 Cây ăn quả đầu sân (`CROP_23` *Đu đủ đỏ*).<br>• 3 Đặc sản vùng Bậc 1 (`CROP_N01` *Cải cúc*, `CROP_C01` *Tỏi Lý Sơn*, `CROP_S01` *Bông điên điển*). | **`4 loài` (+2 Pet):**<br>• Gia cầm & vật nuôi nhỏ (`ANI_01` *Gà Ri*, `ANI_02` *Chim Cút*, `ANI_03` *Vịt Cỏ*, `ANI_04` *Thỏ & Bồ Câu*).<br>• Thú cưng: `PET_01` *Chó Phú Quốc*, `PET_02` *Mèo Tam Thể*. | **`3 loài`:**<br>• Cá đồng cơ bản tích bùn Phù Sa (`AQUA_01` *Cá Rô Đồng*, `AQUA_02` *Tép Đồng & Cá Bống Nhỏ*, `AQUA_03` *Cua Đồng & Ốc Bươu Đen*). | • **3 Xưởng sơ cấp:** `MAC_01` *Cối Xay Cám*, `MAC_02` *Bếp Củi*, `MAC_03` *Lò Đậu Phụ*.<br>• **5 Món dân dã:** `PROD_01..05` (*Cơm trắng, Khoai ngô nướng, Canh cải cá rô, Tép rang khế, Đậu phụ làng Mơ*). | **`23 / 81`**<br>*(28%)* |
| **ĐỢT 2**<br>**Giai Đoạn 2 (`v1.2`)**<br>*Làng Nghề, Dệt Lụa & Lán Thợ* | **Chương 3, 6, 7**<br>*(Lv.9 – 15)* | **`+13 loài`:**<br>• 7 Cây ruộng trung hạn (`CROP_13..19`: *Cà chua, Mướp hương, Nếp cái hoa vàng, Bầu sao, Khoai môn, Vừng & Hạt sen, Sen đầm*).<br>• 3 Cây lâu năm (`CROP_24..26`: *Dừa xiêm, Ổi lê, Chuối tiêu*).<br>• 3 Đặc sản vùng Bậc 2 (`CROP_N02` *Chè Thái Nguyên*, `CROP_C02` *Thanh long*, `CROP_S02` *Khóm Cầu Đúc*). | **`+6 loài`:**<br>• Gia súc & Tơ tằm (`ANI_05` *Heo Móng Cái*, `ANI_06` *Tằm Ăn Lá Dâu nhả Kén Tơ*, `ANI_07` *Bò Sữa*).<br>• 3 Đặc sản Chuồng Bậc 1 (`ANI_N01` *Gà Đông Tảo*, `ANI_C01` *Dê Cừu*, `ANI_S01` *Vịt Đồng Trứng Son*). | **`+3 loài`:**<br>• Thủy sản nước ngọt tầm trung (`AQUA_04` *Cá Chép Vàng*, `AQUA_05` *Ếch Đồng & Lươn Vàng*, `AQUA_06` *Cá Trê & Rô Phi*). | • **3 Xưởng làng nghề:** `MAC_04` *Quán Nước*, `MAC_07` *Lò Gốm Đan Lát*, `MAC_08` *Khung Cửi Lụa*.<br>• **9 Món ăn & Trà:** `PROD_06..12`, `PROD_N01`, `PROD_C01`.<br>• **2 Đồ bảo hộ:** `CRAFT_01..02` (*Nón lá, Áo cánh nâu*).<br>• **2 Gia nhân đầu:** `WORK_01` *Chú Tư Cày*, `WORK_02` *Cô Năm Thảo*. | **`45 / 81`**<br>*(55%)* |
| **ĐỢT 3**<br>**Giai Đoạn 3 (`v1.5`)**<br>*Chuyến Tàu Bắc – Nam & Đặc Sản Liên Vùng* | **Chương 4 – 5**<br>*(Lv.16 – 20)* | **`+12 loài`:**<br>• 3 Cây hàng hóa & hoa (`CROP_20..22`: *Dưa hấu Mai An Tiêm, Nấm rơm, Hoa nhài & Cúc*).<br>• 3 Cây lâu năm (`CROP_27..29`: *Xoài Hòa Lộc, Mít Thái, Tre làng & Trúc*).<br>• 6 Cây Đặc sản 3 Miền Bậc 3 & 4 (`CROP_N03..S04`: *Vải thiều, Nho, Măng cụt, Nhãn lồng, Hồ tiêu & Điều, Vú sữa*). | **`+1 loài` (+2 Pet):**<br>• `ANI_08` *Ong Mật Hoa Nhãn / Cà Phê* (thu Mật Ong & Phấn Hoa).<br>• Thú cưng: `DEF_02` *Đàn Ngỗng Trời*, `PET_03` *Trâu Đen Cày Ruộng* (đổi từ Voucher Tàu Hỏa). | **`+5 loài`:**<br>• `AQUA_07` *Cá Lóc Đồng*, `AQUA_08` *Trai Sông Ngậm Ngọc Trai*.<br>• 3 Thủy sản Đặc sản 3 Miền Bậc 1 (`AQUA_N01` *Cá Trắm Đen Vũ Đại*, `AQUA_C01` *Cá Bống Sông Trà & Tôm Sú*, `AQUA_S01` *Cá Tra & Cá Linh Non*). | • **2 Xưởng ẩm thực lớn:** `MAC_05` *Quầy Bún Phở 3 Miền*, `MAC_06` *Xưởng Muối Dưa & Mắm*.<br>• **9 Món đặc sản vùng:** `PROD_13..17`, `PROD_S01`, `PROD_19..21` (*Phở bò, Bún bò Huế, Gỏi gà măng cụt, Lẩu cá linh*).<br>• **Đồ bảo hộ:** `CRAFT_03` (*Áo tơi & Ủng*).<br>• **2 Gia nhân:** `WORK_03` *Anh Sáu Kình*, `WORK_04` *Dì Bảy Bếp*. | **`63 / 81`**<br>*(78%)* |
| **ĐỢT 4**<br>**Giai Đoạn 4 (`v1.8`)**<br>*Đình Làng, Đột Biến & Sản Vật Tiến Vua* | **Chương 8 – 9**<br>*(Lv.21 – 24)* | **`+6 loài`:**<br>• 3 Đại Đặc Sản 3 Miền Bậc 5 (`CROP_N05` *Bưởi Diễn & Đào*, `CROP_C05` *Cà Phê BMT*, `CROP_S05` *Sầu Riêng Ri6*).<br>• **3 Giống Cây Đột Biến Ngũ Sắc (`CROP_MUT_01..03`):** *Lúa Tím Thảo Dược, Dưa Hấu Vuông, Bưởi Hồ Lô & Sen Nghìn Cánh*. | **`+3 loài` (+1 Pet):**<br>• 3 Vật nuôi Đặc sản VIP 3 Miền (`ANI_N02` *Lợn Bản / Bò Mông*, `ANI_C02` *Hươu Sao Lấy Nhung*, `ANI_S02` *Nhà Nuôi Chim Yến*).<br>• Thú cưng: `PET_04` *Chim Sáo Đen*. | **`+4 loài`:**<br>• `AQUA_09` *Ba Ba / Cua Đinh Ao Đá*.<br>• 3 Thủy Hải Sản Đặc sản Bậc 2 (`AQUA_N02` *Cá Anh Vũ Sông Đà*, `AQUA_C02` *Cá Chình & Ghẹ Xanh Ô Loan*, `AQUA_S02` *Cá Tai Tượng & Cá Kèo*). | • **2 Món Đại Tiệc 3 Miền:** `PROD_22` *Cá Kho Tộ Vũ Đại*, `PROD_23` *Chè Khúc Bạch Sầu Riêng Vải Thiều*.<br>• **Đồ bảo hộ VIP:** `CRAFT_04` (*Đồng phục Lụa Tân Châu*).<br>• **Gia nhân:** `WORK_05` *Chú Tám Mộc* (chăm 18 cây lâu năm).<br>• **12 Ô Thời trang & 12 Kỷ vật 8x–9x.** | **`76 / 81`**<br>*(94%)* |
| **ĐỢT 5**<br>**Giai Đoạn 5 (`v2.0`)**<br>*Lễ Cưới, Hải Sản VIP & Homestay* | **Chương 10**<br>*(Lv.25 – 30+)*| **`+1 loài`:**<br>• `CROP_30` *Cau & Trầu Không Lâu Năm* (Vật phẩm定 ước Lễ Cưới Làng Quê). | *Đã mở đủ 14/14 loài Chuồng & 5/5 Pet (Thêm **Bé Tiểu Đồng Gia Bảo** sau Lễ Cưới).* | **`+4 loài`:**<br>• `AQUA_10` *Cá Chép Koi Ngũ Sắc* (`+80 Phong Thủy`).<br>• **3 Thủy Hải Sản Đại Tiệc VIP (`AQUA_N03..S03`):** *Rươi Tứ Kỳ (Bắc), Tôm Hùm Phú Yên (Trung), Tôm Càng & Cua Cà Mau (Nam)*. | • **2 Món Đỉnh Cao Tết & Endgame:** `PROD_18` *Bánh Chưng Hoàng Kim Tết* & `PROD_24` *Chả Rươi & Tôm Hùm Hấp Dừa*.<br>• **Tổng Quản VIP:** `WORK_06` *Ông Quản Gia Cửu* + **Homestay 2 Cấp**. | **`81 / 81`**<br>*(100%)* |

---

## CHƯƠNG 4: BIÊN NIÊN SỬ CỐT TRUYỆN CHÍNH 10 CHƯƠNG ("GIA PHẢ BA MIỀN") GẮN LIỀN VỚI MỞ KHÓA SINH THÁI

### 4.1. Kịch Bản Mở Đầu Giai Đoạn 1 ("Bức Thư Trong Chiếc Tráp Gỗ Lim" — Chuẩn Hóa Cho Cutscene Mở Màn & Bài Đăng Facebook)

* **Bối cảnh & Cảm xúc chủ đạo (`@narrative-designer` & `@content-creator`):** Chiều cuối thu nơi cổng làng rêu phong. Nhân vật chính rời phố thị ồn ào trở về ngôi nhà ngói đỏ 3 gian của Ông Nội để lại bên giếng nước đá ong, bờ ao sen và cánh đồng lúa.
* **Diễn biến Mở màn (3 Nhịp Tương Tác — Không Trùng Lặp):**
  1. **Nhịp 1 – Mở Chiếc Tráp Gỗ Lim (`Environmental Discovery`):** Trên chiếc chiếu cói trải giữa sân gạch, **Bác Trưởng Thôn Bảy (`NPC_01`)** cùng chú **Chó Xoáy Phú Quốc** trao lại chiếc Tráp Gỗ Lim khóa đồng của Ông Nội. Bên trong phát sáng **Cuốn Sổ Gia Phả Nông Nghiệp Ba Miền** (chỉ còn giữ lại **Trang #1 & #2** dạy trồng *16 giống cây sơ cấp, nuôi 4 loài gia cầm nhỏ và thả 3 loài cá đồng*, còn 8 trang sau đã thất lạc khắp 3 miền), **1 Túi Hạt Giống Lúa Nước Tổ Tiên**, và tờ khế ước thế chấp mảnh vườn trị giá `50,000 🪙 Xu Vàng`.
  2. **Nhịp 2 – Cuộc Đối Đầu Đầu Tiên Với Bá Kiến (`Interactive Conflict`):** **Thương Nhân Bá Kiến (`NPC_02`)** cầm tờ khế ước đứng trước cổng tre ép bán đứt mảnh vườn lấy `2,000 🪙` tiền mặt để ông ta phân lô.
  3. **Nhịp 3 – Lựa Chọn Định Mệnh Của Điền Chủ (`Meaningful Player Choice`):**
     * **🤝 Nhánh Nghĩa Tình Làng Xóm (`EMP`):** *"Đất của Ông Nội và tình làng nghĩa xóm không đo bằng tiền! Tôi sẽ tự tay cày cấy trả sạch 50,000 Xu!"* $\rightarrow$ Nhận **`+30 Điểm Mỹ Quan Phong Thủy` + `+3 Điểm Nghĩa Xóm`** + mở khóa Giếng Làng tưới nước miễn phí `0 ⚡`.
     * **🪙 Nhánh Kinh Tế Thực Dụng (`PRAG`):** *"Ông cứ giữ tờ khế ước đó! Trong 10 mùa vụ nữa, chính ông sẽ phải mang tiền đến mua lại nông sản Hoàng Kim của trang trại này!"* $\rightarrow$ Nhận nóng **`+350 🪙 Xu Vàng` vốn khởi nghiệp** bổ sung vào thưởng Chương 1.

---

### 4.2. Bảng Tổng Quan 10 Chương Chính Tuyến ("Gia Phả Ba Miền") & Gói Thực Thể Nông – Thủy – Hải Sản Mở Khóa Tương Ứng

| Chương & Giai Đoạn | Tên Chương & Cấp Mở | Nhân Vật & Lời Thoại Tình Huống (`NPC Quote`) | Mục Tiêu Gameplay & **Gói Nông – Thủy – Hải Sản Mở Khóa Theo Trang Gia Phả** | Thưởng Cơ Bản |
| :--- | :--- | :--- | :--- | :---: |
| **Chương 1**<br>*(GĐ 1 - Lv.1)* | **Bức Thư Trong Chiếc Tráp Gỗ Lim** | **🎩 Bá Kiến:** *"Ký giấy nhượng lại mảnh vườn này lấy 2,000 Xu tiêu xài, đỡ phải chân lấm tay bùn trả khoản khế ước 50,000 Xu!"* | Từ chối bán đất, tưới nước Giếng Làng (`-15%` t/g) & thu vụ Lúa đầu tiên $\rightarrow$ **Mở Trang Gia Phả #1:** Mở khóa *Lúa nước, Rau muống, Ngô, Hành, Cải, Khoai lang*, *Gà Ri, Chim Cút* & *Cối Xay Cám (`MAC_01`)*. | `600 🪙`<br>`15 💎` |
| **Chương 2**<br>*(GĐ 1 - Lv.3)* | **Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao** | **👴 Bác Bảy:** *"Mùi cá rô đồng kho gừng sả bốc lên làm bác nhớ bà nội cháu xưa kia quá... Bát đầu tiên cháu tính đem biếu ai?"* | Vét Bùn Ao (`-3⚡`) lấy 3 Xô Phù Sa & nấu thử trong Bếp Củi $\rightarrow$ **Mở Trang Gia Phả #2 (Hoàn tất Đợt 1 - 23 loài):** Mở khóa *Cá Rô Đồng, Tép Đồng, Cua Ốc*, *Vịt Cỏ, Thỏ*, *Đậu tương, Mía, Lạc, Đu đủ, Đặc sản Bậc 1 (`Cải cúc / Tỏi Lý Sơn / Điên điển`)* & *Bếp Củi, Lò Đậu (`MAC_02..03`)*. | `900 🪙`<br>`20 💎` |
| **Chương 3**<br>*(GĐ 2 - Lv.9)* | **Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông** | **👩‍🏫 Cô Giáo Hương:** *"Cơn mưa đầu mùa làm tốc mái bếp ăn trường làng rồi... May mà có chuyến xe rau gạo của bạn kịp chở tới!"* | Dựng giàn cây sau bão (`+20%` sản lượng) & giải đố Ca dao của Cụ Đồ Vũ Bằng $\rightarrow$ **Mở Trang Gia Phả #3:** Mở khóa *Cà chua, Mướp hương, Nếp cái hoa vàng, Bầu sao, Dừa xiêm, Ổi*, *Heo Móng Cái*, *Cá Chép, Ếch & Lươn* + *Quán Nước (`MAC_04`)*. | `1,200 🪙`<br>`25 💎` |
| **Chương 6**<br>*(GĐ 2 - Lv.13)* | **Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư** | **👨‍🌾 Chú Tư Cày:** *"Cậu/Cô chủ không chê lão nông này già cả, còn nấu canh cải cá rô đãi cơm trưa... Tôi xin thề chăm từng gốc lúa!"* | Xây Lán Thợ, thuê *Chú Tư Cày (`WORK_01`)* & *Cô Năm Thảo (`WORK_02`)*, dọn cơm Bàn Ăn Chung $\rightarrow$ **Mở Trang Gia Phả #6:** Mở khóa *Khoai môn, Vừng & Hạt sen, Sen đầm, Chuối tiêu*, *Đặc sản Bậc 2 (`Chè / Thanh long / Khóm`)* & *Cá Trê, Rô Phi*. | `2,500 🪙`<br>`40 💎` |
| **Chương 7**<br>*(GĐ 2 - Lv.15)* | **Bí Truyền Khung Cửi Lụa & Áo Mới** | **👗 Cô Ba Tiệm May:** *"Tơ tằm năm nay óng ả như nắng thu! Điền chủ muốn may áo bảo hộ cho Lán Thợ trước hay may Áo Dài dự hội?"* | Nuôi *Tằm Ăn Lá Dâu* & cấp phát *Nón lá, Áo cánh nâu* 72h cho nhân công $\rightarrow$ **Mở Trang Gia Phả #7 (Hoàn tất Đợt 2 - 45 loài):** Mở khóa *Tằm Nhả Tơ (`ANI_06`), Bò Sữa (`ANI_07`)*, *3 Vật nuôi Đặc sản Bậc 1 (`Gà Đông Tảo / Dê Cừu / Vịt Đồng`)* & *Lò Đan Lát, Khung Cửi Lụa (`MAC_07..08`)*. | `3,200 🪙`<br>`45 💎` |
| **Chương 4**<br>*(GĐ 3 - Lv.16)* | **Bóng Đêm Rình Rập & Chó Phú Quốc** | **👴 Bác Bảy:** *"Đêm qua có kẻ rón rén vào vườn xoài đánh rơi chiếc Dép Tổ Ong! Cháu mau huấn luyện chú Chó Phú Quốc canh sân!"* | Ghé thăm nhà bạn qua Báo Chợ, ký Lưu Bút & kích hoạt 4 Lớp Phòng Thủ $\rightarrow$ **Mở Trang Gia Phả #4:** Mở khóa *Dưa hấu, Nấm rơm, Xoài Hòa Lộc, Mít Thái*, *Đàn Ngỗng Trời (`DEF_02`)*, *Cá Lóc Đồng* & *Quầy Bún Phở (`MAC_05`)*. | `1,500 🪙`<br>`30 💎` |
| **Chương 5**<br>*(GĐ 3 - Lv.18)* | **Tiếng Còi Tàu Thống Nhất Bắc – Nam** | **👧 Út Nhỏ:** *"Ghe Sầu riêng của em vừa cập bến tàu! Mình lập Thương Đội Liên Gia 3 miền Bắc – Trung – Nam nghen!"* | Đóng Toa Hàng Tàu Hỏa & lập Thương Đội Liên Gia (`FEAT_01`) $\rightarrow$ **Mở Trang Gia Phả #5 (Hoàn tất Đợt 3 - 63 loài):** Mở khóa *6 Cây Đặc sản Bậc 3–4 (`Vải, Nho, Măng cụt, Nhãn, Hồ tiêu, Vú sữa`)*, *Tre trúc, Hoa nhài*, *Ong Mật (`ANI_08`), Trâu Đen (`PET_03`)*, *Trai Ngọc (`AQUA_08`), 3 Cá Đặc sản Bậc 1 (`Trắm đen / Cá bống / Cá linh`)*, *Xưởng Muối Mắm (`MAC_06`)* & *Anh Sáu Kình, Dì Bảy Bếp (`WORK_03..04`)*. | `2,000 🪙`<br>`35 💎` |
| **Chương 8**<br>*(GĐ 4 - Lv.21)* | **Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ** | **🪵 Chú Tám Mộc:** *"Hũ sành cổ trong Rừng Trúc chứa phấn hoa đột biến và kỷ vật tuổi thơ của Ông Nội cháu đấy!"* | Thám hiểm Rừng Trúc (`-6⚡`), sưu tầm Kỷ vật 8x–9x & chiết cành Đột biến $\rightarrow$ **Mở Trang Gia Phả #8:** Mở khóa **3 Giống Cây Đột Biến Ngũ Sắc (`CROP_MUT_01..03`)**, *3 Vật nuôi Đặc sản VIP (`Lợn Bản / Hươu Sao / Nhà Yến`)* & *Chú Tám Mộc (`WORK_05`)*. | `4,000 🪙`<br>`50 💎` |
| **Chương 9**<br>*(GĐ 4 - Lv.23)* | **Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến** | **🎩 Bá Kiến:** *"Miếng cá trắm kho tiêu thấm nước dừa này... 40 năm rồi ta mới được ăn lại vị mẹ nấu. Ta xin đốt tờ khế ước!"* | Nấu món *Cá Kho Vũ Đại 3 Miền* & trùng tu Đình Làng $\rightarrow$ **Mở Trang Gia Phả #9 (Hoàn tất Đợt 4 - 76 loài):** Mở khóa **3 Đại Đặc Sản Bậc 5 (`Bưởi Diễn & Đào / Cà Phê BMT / Sầu Riêng Ri6`)**, *Ba Ba Ao Đá (`AQUA_09`)* & **3 Thủy Hải Sản Đặc Sản Bậc 2 (`Cá Anh Vũ / Ghẹ Xanh Ô Loan / Cá Tai Tượng`)**. | `6,000 🪙`<br>`60 💎` |
| **Chương 10**<br>*(GĐ 5 - Lv.25+)*| **Trầu Cau Nên Duyên & Gia Bảo Truyền Đời** | **💍 Tri Kỷ:** *"Từ hai bàn tay trắng ngày mới về quê, giờ cánh đồng lúa chín vàng rực rỡ... Mình viết tiếp cuốn Gia Phả Ba Miền nhé!"* | Đạt 10/10 Tim Kết hôn, mở Homestay Đầm Sen & Canh Nồi Bánh Chưng Tết $\rightarrow$ **Mở Trang Gia Phả #10 (Hoàn tất 81/81 loài):** Mở khóa *Cau & Trầu Không (`CROP_30`)*, *Cá Chép Koi (`AQUA_10`)*, **3 Thủy Hải Sản Đại Tiệc VIP (`Rươi Tứ Kỳ / Tôm Hùm Phú Yên / Tôm Càng & Cua Cà Mau`)**, món *Chả Rươi & Tôm Hùm (`PROD_24`)* & *Ông Quản Gia Cửu (`WORK_06`)*. | `10,000 🪙`<br>`100 💎` |

---

## CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 6 TÍNH NĂNG CHIỀU SÂU & SỰ KIỆN LỄ HỘI 3 MIỀN (`FEAT_01..03`, `EVENT_01..03`)

1. **`FEAT_01` — 🛶 Thương Đội Liên Gia 3 Miền (`Co-op Caravan Bắc – Trung – Nam` | Giai Đoạn 3 - Lv.16):** Tổ đội 3 người chơi thuộc đủ 3 miền (`1 Bắc + 1 Trung + 1 Nam`), mỗi người góp 10 Đặc sản miền mình + `300 🪙` trong 4 giờ $\rightarrow$ Cả 3 nhận `+1,800 🪙`, `+15 💎`, `+5 Nghĩa Xóm` và **3 Túi Hạt Giống Giao Thoa** (cho phép trồng thử đặc sản miền bạn tối đa 3 vụ).
2. **`FEAT_02` — 🥢 Thực Khách Bí Ẩn & Đố Ca Dao Bếp Quê (`Mystery Food Critic NPC` | Giai Đoạn 2 - Lv.10):** Lúc `12:00` và `19:00`, **Cụ Đồ Vũ Bằng (`NPC_05`)** ra câu đố Ca dao ẩm thực khớp với **danh mục nguyên liệu đã mở ở Giai đoạn hiện tại** (không bao giờ đố món của Giai đoạn sau chưa mở!). Giải đúng trong 15 phút nhận `+650 🪙`, `+10 💎`, `+20 ⚡` & `1 Sao Mai Ẩm Thực`.
3. **`FEAT_03` — 📻 Bảo Tàng 12 Kỷ Vật Tuổi Thơ 8x–9x (`Nostalgia Collection & 1-for-1 Swap` | Giai Đoạn 4 - Lv.21):** Hợp nhất mảnh cổ vật cũ thành 12 Kỷ vật 8x–9x rơi `18%` khi Vét Ao / Rừng Trúc / Bắt trộm; hỗ trợ **Đổi 1-1 với hàng xóm (`-100 🪙`)**; đủ bộ nhận tổng `+150 💎`, Nhạc Sáo Trúc và Buff vĩnh viễn `+5% Xu Đơn HTX`.
4. **`EVENT_01` — 🔥 Canh Nồi Bánh Chưng Xuyên Đêm (`Tết Co-op Fire-Tending` | Giai Đoạn 5 - Lv.25):** Chủ nhà bắc nồi bánh 6 giờ (`5 Nếp + 3 Đậu + 2 Thịt Heo + 500 🪙`); tối đa 5 người bạn bấm **`🪵 Tiếp Thêm Củi Lửa (0⚡)`** giảm 20 phút/người & nhận **Bao Lì Xì Đỏ (`+150 🪙`, `15%` nổ `5 💎`)**, chủ nhà nhận **4 Cặp Bánh Chưng Hoàng Kim** & `+20 💎`.
5. **`EVENT_02` — 🌕 Đêm Hội Trăng Rằm & Lò Bánh Trung Thu (`Mid-Autumn Lantern Event` | Giai Đoạn 4 - Lv.21):** Khi thời tiết chuyển sang `🌙 Đêm Đom Đóm`, nộp `2 Hạt Sen + 2 Đậu Xanh + 2 Trứng Vịt + 300 🪙` nướng Hộp Bánh Trung Thu (đãi Lán Thợ khóa `100% Tinh thần Hăng Say` suốt 24h hoặc biếu NPC nhân đôi `x2 Tim ❤️`).
6. **`EVENT_03` — 🐃 Hội Thi "Trâu Vàng Cày Giỏi & Vịt Chạy Đồng" (`Weekend Pet Derby` | Giai Đoạn 4 - Lv.21):** Đua thú cưng cuối tuần (`1,000 🪙` + `1 Bùn Phù Sa` + `4⚡`), về Nhất nhận `2,200 🪙`, `+15 💎` & **Cúp Trâu Vàng (`+150 Phong Thủy`)**.

---

## CHƯƠNG 6: SẢNH CHUNG ĐA NGƯỜI CHƠI ("CHỢ ĐÌNH BA MIỀN"), ĐẤU TRƯỜNG DÂN GIAN (PK / TỔ ĐỘI / LOẠN CHIẾN) & VŨ TRỤ HYPER-CASUAL SIÊU TỐC (`GIAI ĐOẠN 6 — EXPANSION v3.0`)

### 6.1. Quy Hoạch Không Gian Sảnh Chung "Chợ Đình Ba Miền" (`M11.1` — `48 x 32 Tiles`, `25–30 CCU/Kênh`)
* Chia làm **5 Phân Khu Tương Tác** quanh Cây Đa cổ thụ: (1) *Quảng Trường Cây Đa & Chiếu Hoa* (khoe Thời trang 12 Slots, Bong bóng Chat trên đầu, thú cưng chạy theo sau); (2) *Võ Đài & Sới Vật Khu Đông* (PK 1v1 & 3v3); (3) *Bãi Bồi Loạn Chiến Khu Tây* (8–12 người); (4) *Lều Máy Thùng Hyper-Casual Khu Bắc* (`15s–45s`, `0⚡`); (5) *Quán Nước Đầu Làng Khu Nam* (mời trà đá nhận Buff & Shop `🏮 Xu Hội Làng`).

### 6.2. Đặc Tả 4 Nhóm Chế Độ Chơi Tại Sảnh Chung (`M11.2 ➔ M11.5`) & Khung Lắp Ghép `IHyperCasualCartridge` (`M11.6`)
1. **🥊 PK Đối Kháng 1v1 (`M11.2` - `45–60s`):** *Đi Cầu Tre Đấu Gậy Bông (`PK_1V1_01`)*, *Đấu Vật Sới Đình Sumo (`PK_1V1_02`)* & *Đại Chiến Ném Dép Tổ Ong (`PK_1V1_03`)*.
2. **⚔️ Tổ Đội Đối Kháng 2v2 / 3v3 (`M11.3` - `60–90s`):** *Cướp Cờ Bông Lúa Vàng 3v3 (`TEAM_3V3_01`)* & *Kéo Co Đồng Tâm 2v2 (`TEAM_2V2_02`)*.
3. **💥 Loạn Chiến Quần Đấu 8–12 Người (`M11.4` - `60–90s`):** *Ao Làng Đại Náo – Bắt Vịt Vàng 8P (`BRAWL_8P_01`)* & *Truyền Pháo Đất Né Trâu Húc 12P (`BRAWL_12P_02`)*.
4. **⚡ Chơi Đơn Siêu Tốc — Lều Máy Thùng Hyper-Casual (`M11.5` - `15–45s`, `0⚡`):** *Chẻ Tre & Bổ Dừa Siêu Tốc (`HC_SOLO_01`)*, *Nhảy Lá Sen Qua Ao Cá (`HC_SOLO_02`)*, *Bắn Bi Ve & Tạt Lon Sữa Bò (`HC_SOLO_03`)*.
5. **🧩 Khung Lắp Ghép "Plug-and-Play Hyper-Casual SDK" (`M11.6`):** Mọi trò chơi mới chỉ cần viết trong **1 file độc lập (`< 200 dòng`)** thực thi `IHyperCasualCartridge`, tái sử dụng 100% Texture Nông – Thủy – Hải sản sẵn có trong RAM (`0 KB` tải thêm).

---

## CHƯƠNG 7: KIẾN TRÚC HỆ THỐNG NHIỆM VỤ 6 TẦNG (`6-TIER QUEST ARCHITECTURE`)

1. **Tầng 1 – Nhiệm vụ Chính tuyến 10 Chương (*Gia Phả Ba Miền*):** Dẫn dắt cốt truyện và **mở khóa tuần tự 5 Đợt Nông – Thủy – Hải sản (`23 ➔ 45 ➔ 63 ➔ 76 ➔ 81 loài`)** kèm lựa chọn phân nhánh `EMP` / `PRAG`.
2. **Tầng 2 – Chuỗi 7 Ngày Tân Thủ (*Về Quê Lập Nghiệp*):** Điểm danh 7 ngày nhận Vàng, Ngọc, *Áo Bà Ba Lụa*, *Nón Lá Bài Thơ* và **🐕 Chó Phú Quốc Giữ Nhà SSR**.
3. **Tầng 3 – Vòng lặp Phiên chơi (*Đơn Hợp Tác Xã, 3 Toa Tàu Thống Nhất & Đố Ca Dao Thực Khách Bí Ẩn*):** Chỉ yêu cầu các nông sản/món ăn thuộc những Đợt Giai Đoạn người chơi đã mở khóa.
4. **Tầng 4 – Tâm Tình Lán Thợ & Kỷ Vật Tuổi Thơ (*Chuyện Đời 6 Gia Nhân & Bảo Tàng 8x–9x*).**
5. **Tầng 5 – Sự kiện Cộng đồng & Lễ Hội 3 Miền (*Thương Đội Liên Gia, Canh Nồi Bánh Chưng, Đêm Hội Trăng Rằm, Đua Trâu Vàng & Đua Thuyền Rồng*).**
6. **Tầng 6 – Nhiệm vụ Sảnh Chung & Đấu Trường Dân Gian (*Hội Thao Chợ Đình Hàng Ngày*):** Nhận **`🏮 Xu Hội Làng`** đổi Danh hiệu Phát sáng và Biểu cảm Múa Lân.
