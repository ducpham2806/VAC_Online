# 💒 PLAN TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 5: LỄ CƯỚI LÀNG QUÊ, TỔ ẤM GIA ĐÌNH, DU LỊCH HOMESTAY & TẾT ĐOÀN VIÊN (`v2.0`)
**Phiên bản:** `1.1 (Stage 5 Execution Plan & AI Delegation Playbook — Bổ sung Kế Hoạch Sản Xuất Chi Tiết Asset, Animation 8–12f, Bằng Khen & VFX)`  
**Mốc phát hành:** Tháng 5–6 (Tuần 9–12 — Bản Đại Cập Nhật Kết Tinh Tình Yêu, Gia Đình, Du Lịch Sinh Thái & Sự Kiện Tết Nguyên Đán)  
**Tài liệu tham chiếu gốc:** `00_MASTER_BIBLE` ➔ `01_MASTER_GDD` ➔ `02_MASTER_ECONOMY` ➔ `03_MASTER_TECH` ➔ `04_MASTER_NARRATIVE` ➔ `05_MASTER_ART` ➔ `06_MASTER_UI_UX`  
**Quy tắc bắt buộc:** Thực thi nghiêm ngặt **`RULE D0`** (Đối chiếu khử trùng lặp) & **`RULE D1`** (Bảo toàn Core Gameplay, Nhất quán Art `#3D2314`/Code/DB Additive-Only & Cảnh báo tác động chéo ngay tại Bước 1).

---

## 1. MỤC TIÊU CỐT LÕI & CÂU CHUYỆN GIAI ĐOẠN 5 (CHAPTER 5: TRẦU CAU NÊN DUYÊN, MÁI ẤM GIA ĐÌNH & ĐÊM GIAO THỪA ĐỎ LỬA)
- **Bối cảnh cốt truyện (`04_MASTER_NARRATIVE` Mục 1.7):** Sau 4 mùa mưa nắng cùng nhau dựng xây nông trại từ mảnh vườn hoang của Nội, mối tình quê mộc mạc đã đến ngày đơm hoa kết trái! Giàn **Trầu Không quấn quýt thân Cau** trước ngõ đã xanh mướt, đôi **Cá Chép Koi Ngũ Sắc** bơi lượn trong hồ, và mâm **Đại Tiệc Cưới Quê 3 Miền** (*Rươi Tứ Kỳ, Tôm Hùm Phú Yên, Cua Cà Mau*) đã sẵn sàng đón họ hàng hai bên. Sau đám cưới rộn ràng rước dâu bằng thuyền hoa/kiệu cổ, hai vợ chồng đón **Bé Tiểu Đồng Gia Bảo** lon ton phụ nhặt trứng ngoài sân, mở **Khu Du Lịch Sinh Thái Homestay** đón du khách phương xa, cùng bà con canh **Nồi Bánh Chưng Tết Đỏ Lửa** đêm Giao Thừa và nhận tấm **Bằng Khen Gia Đình Văn Hóa & Nông Dân Tiêu Biểu** treo trang trọng giữa nhà!
- **Mục tiêu sản phẩm & KPI:**
  - Hoàn thiện **100% Hệ sinh thái 81 Sinh vật & 22 Công thức Chế biến** (mở khóa 5 loài Đỉnh cao Đợt 5 + *Mâm Cỗ Cưới / Mâm Ngũ Quả*).
  - Ra mắt trọn vẹn vòng lặp End-game ấm áp: **Lễ Cưới Làng Quê & Nuôi Con Nhỏ (`MarriageFamilyModal`)**, **Khu Nghỉ Dưỡng Homestay (`HomestayModal`)**, **Sự Kiện Nấu Bánh Chưng Tết Cộng Đồng**, và **Máy Xuất Ảnh Bằng Khen `.PNG` (`certificateExporter.ts`)** để chia sẻ lên Facebook.
  - Đạt tỷ lệ **Viral Share > 15% DAU** (nhờ tính năng xuất ảnh Bằng Khen & Thiệp Cưới Làng Quê).

---

## 2. DANH MỤC TÍNH NĂNG, HỆ SINH THÁI & PHẠM VI TRIỂN KHAI GIAI ĐOẠN 5 (`WHAT TO BUILD`)

### 2.1. Hệ Sinh Thái Nông – Thủy – Hải Sản Đợt 5 (+5 Loài Đỉnh Cao = Hoàn Thiện 81/81 Loài)
1. **1 Cây trồng Tín vật Tình yêu Đợt 5:**
   - *Cây Cau & Giàn Trầu Không (`CROP_30` - Lâu năm Bậc 5, thu hoạch Buồng Cau & Lá Trầu Phượng Vũ dùng làm Sính lễ Cầu Hôn & Cỗ Cưới)*.
2. **4 Thủy – Hải sản Đại Tiệc & Phong Thủy Đợt 5:**
   - *Rươi Tứ Kỳ Mùa Thu (`AQUA_13` - Bắc, chỉ xuất hiện vào tiết Thu – Đông, nguyên liệu làm Chả Rươi VõBếp Thượng Hạng)*.
   - *Tôm Hùm Bông Phú Yên (`AQUA_14` - Trung, nuôi lồng bè biển sâu)*.
   - *Cua Biển Cà Mau (`AQUA_15` - Nam, nuôi vuông tôm rừng ngập mặn)*.
   - *Cá Chép Koi Ngũ Sắc (`AQUA_10` - Cá cảnh phong thủy thả hồ trước nhà, tăng **+10% Điểm Hạnh Phúc Tổ Ấm & Hấp dẫn Du khách Homestay**)*.

### 2.2. Dây Chuyền Chế Biến Đợt 5 (+1 Tuyệt Phẩm = Hoàn Thiện 22/22 Công Thức) & Tổng Quản VIP
- Mở khóa công thức thứ 22 đỉnh cao: **Mâm Cỗ Cưới / Mâm Ngũ Quả Đoàn Viên (`PROD_22`)** tại **Nhà Hàng Ẩm Thực 3 Miền (`MACH_08`)** — kết tinh nông thủy hải sản 3 Miền.
- Mở khóa **Gia Nhân Thứ 6 (Tổng Quản VIP):** **Ông Quản Gia Cửu (`WORK_06`)** — Điều phối đồng bộ cả 5 Gia nhân trước đó, tự động tối ưu hóa lịch gieo trồng – chế biến – đóng kiện Tàu Hỏa và tiếp đón đoàn khách Homestay.

### 2.3. Lễ Cưới Làng Quê, Tổ Ấm Gia Đình, Du Lịch Homestay, Nồi Bánh Chưng Tết & Bằng Khen `.PNG`
- **Lễ Cưới Làng Quê & Tổ Ấm Gia Đình (`MarriageFamilyModal.tsx`):**
  - Khi đạt **1.000 Điểm Hảo Cảm (Trái Tim Tri Kỷ)** với NPC Ý Trung Nhân (*Mai, Lan, Cúc, Trúc, Nam, Minh, Khôi...*) hoặc Bạn Đời Co-op: Trao **Trầu Cau Tín Vật + Nhẫn Cỏ Đồng Nội** để tổ chức **Lễ Rước Dâu 3 Miền** (bạn bè trong Đình Làng vào dự tiệc, thả pháo giấy hồng & nhận lì xì hỷ sự).
  - Mở khóa **Sổ Gia Đình & Bé Tiểu Đồng Gia Bảo**: Bé lớn lên qua 3 giai đoạn (*Nằm nôi ➔ Tập đi ➔ Tiểu đồng hiếu thảo*), tự động đi nhặt trứng gà, hái hoa và gửi những câu thoại ngộ nghĩnh ấm lòng bố mẹ.
- **Khu Du Lịch Sinh Thái Homestay (`HomestayModal.tsx`):**
  - Xây dựng **Nhà Sàn Tre / Biệt Thự Đầm Sen** đón 6 nhóm Du khách đặc biệt (*Nhiếp ảnh gia săn ảnh mùa vàng, Việt kiều về thăm quê, Blogger ẩm thực, Đoàn học sinh dã ngoại...*).
  - Phục vụ các món ăn 3 Miền trong Bếp Quê và dẫn khách tham quan vườn Cây Đột Biến để nhận **Vé Du Lịch Sinh Thái, Kim Cương 💎 và Danh vọng Nông Trại**.
- **Sự Kiện Nấu Bánh Chưng / Bánh Tét Đêm Giao Thừa:**
  - Cả Đình Làng quây quần bên **Nồi Bánh Chưng Khổng Lồ Giữa Sân Đình**, thay phiên nhau **Châm Củi Giữ Lửa** suốt 12 giờ (nếu lửa reo đều ở vùng Nhiệt Độ Vàng sẽ ra lò **Bánh Chưng Rền Xanh Mướt Sao Vàng ⭐**).
- **Trình Xuất Bằng Khen "Gia Đình Văn Hóa & Nông Dân Tiêu Biểu" (`src/services/certificateExporter.ts`):**
  - Vẽ trực tiếp lên HTML5 Canvas (`960x540 px`, khung gỗ lim chạm hoa văn sen vàng, quốc huy/huy hiệu Làng Quê 3 Miền, tên Nông Trại, tên Hai Vợ Chồng, cấp độ Đình Làng & chữ ký Cụ Trưởng Làng có đóng dấu đỏ) và tải về file `.PNG` sắc nét chỉ bằng 1 cú click.

---

## 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), BẰNG KHEN & VFX GIAI ĐOẠN 5 (`05_MASTER_ART`)

### A. Bảng Định Mức Sản Xuất Asset & Animation Giai Đoạn 5
| Nhóm Asset | Danh mục chi tiết & Mã ID (`05_MASTER_ART`) | Kích thước chuẩn | Số Frames / Biến thể | Kỹ năng AI phụ trách |
| :--- | :--- | :--- | :--- | :--- |
| **1. Cây trồng & Thủy Hải Sản Đại Tiệc Đợt 5 (5 loài)** | `CROP_30` (*Cây Cau & Giàn Trầu Không* `48x80 px`), `AQUA_10` (*Cá Chép Koi Ngũ Sắc*), `AQUA_13..15` (*Rươi Tứ Kỳ, Tôm Hùm Phú Yên, Cua Cà Mau*) | `32x32 px` (Thủy sản) & `48x80 px` (Cây Cau cao vút) | **4 giai đoạn** Trầu Cau + Animation `Koi_Figure8_Swim` (**12 frames** — Cá Koi bơi lượn hình số 8 uyển chuyển) | `@generate2dsprite` ➔ `@video2dsprite` |
| **2. Công trình Cổng Hoa Cưới, Homestay & Nồi Bánh Chưng Tết** | Cổng Hoa Cưới Lá Dừa (`96x80 px`), Bàn Đại Tiệc Cưới (`128x64 px`), Homestay 2 Cấp (*Nhà Sàn Tre & Biệt Thự Đầm Sen* `160x96 px`), Nồi Bánh Chưng Tết Đỏ Lửa (`80x80 px`) | `80x80 px` ➔ `160x96 px` | `Idle_Festive` (**8 frames**), `Fire_Crackling_Loop` (**8 frames** — lửa củi bập bùng dưới nồi bánh chưng) | `@generate2dmap` + `@generate2dsprite` |
| **3. Nhân vật Cô Dâu - Chú Rể, Bé Tiểu Đồng & Tổng Quản VIP** | Trang phục *Áo Dài Cưới Đỏ Khăn Đóng*, *Bé Tiểu Đồng Gia Bảo* (`24x32 px`), *Ông Quản Gia Cửu (`WORK_06`)* (`32x48 px`), 6 Du khách Homestay | `24x32 px` (Bé) & `32x48 px` (Người lớn) | `Wedding_Bow` (**8 frames** — lễ bái gia tiên/giao bái), `Heir_Helper_Walk` (**8 frames** — bé lon ton cầm giỏ trứng) | `@generate2dsprite` ➔ `@video2dsprite` |
| **4. Khung Bằng Khen Gia Đình Văn Hóa & Icon Đại Tiệc** | Template nền `certificate_frame_960x540.png` (Khung gỗ lim + hoa sen vàng + con dấu đỏ), Icon `PROD_22` (*Mâm Cỗ Cưới / Mâm Ngũ Quả*), *Nhẫn Cỏ Đồng Nội* | `960x540 px` (Khung Bằng Khen) & `32x32 px` (Icons) | 1 Khung HD Pixel Art + 6 Icons tín vật | `@generate2dsprite` + `@codeart2d` |
| **5. Hệ thống Particle VFX Giai Đoạn 5** | `fx_wedding_confetti` (Mưa hoa giấy hồng & cánh hoa cau rơi), `fx_banh_chung_fire` (Tia lửa củi ấm áp + khói thơm bánh chưng đêm Tết), `fx_heart_bubble` (Bong bóng tim đôi bay lên từ mái nhà) | `12x12 px` ➔ `32x32 px` | Particle JSON + Sprite strip **8 frames** | `@codeart2d` + `@technical-artist` |

### B. Quy Trình Kỹ Thuật & Kiểm Định Art Giai Đoạn 5 (`RULE D1`)
1. **Chuẩn Hóa Khung Bằng Khen Canvas (`960x540 px`):** Kết hợp vector/pixel border trong `certificateExporter.ts` với bảng màu `#3D2314` (khung gỗ lim), `#FFFDF5` (nền giấy tuyên dương), `#D90429` (con dấu mộc đỏ) và `#FFB703` (viền lúa vàng), đảm bảo xuất file `.PNG` tức thì không bị lỗi CORS.
2. **Đóng gói Atlas Giai Đoạn 5:** Xuất vào `assets/atlases/farm_stage5_wedding_homestay.json` + `.png` (`<= 2048x2048 px`).

---

## 3. PHÂN CÔNG NHIỆM VỤ THEO BỘ PHẬN & KỸ NĂNG AI (`WHO DOES WHAT & HOW`)

| Bộ phận | Kỹ năng AI sử dụng | Nhiệm vụ cụ thể trong Giai đoạn 5 | Đầu ra nghiệm thu (`Deliverables`) |
| :--- | :--- | :--- | :--- |
| **1. Game Design & Narrative** | `@game-designer` + `@narrative-designer` + `@economy-designer` | - Viết kịch bản **Lễ Cầu Hôn Trầu Cau & Đám Cưới Quê 3 Miền**, cùng 30 câu thoại ấm áp của Bạn Đời & Bé Tiểu Đồng.<br>- Cân bằng doanh thu **Khu Du Lịch Homestay** (hút nông sản chế biến Bậc 4–5 đổi lấy Vé Du Lịch & Danh vọng). | Kịch bản Cưới + `STAGE5_HOMESTAY_CONFIG`. |
| **2. Backend & Co-op Family** | `@backend-architect` | - Viết **Migration Additive-Only** cho bảng `marriages`, `homestay_bookings`, `tet_cauldron_sessions`.<br>- Viết RPC `propose_marriage` và `tend_tet_cauldron` (châm củi cộng điểm nhiệt độ chung cho cả Đình Làng). | File SQL Migration Giai đoạn 5 + 2 RPCs. |
| **3. Art, Animation & VFX** | `@generate2dsprite` + `@video2dsprite` + `@generate2dmap` + `@codeart2d` + `@technical-artist` | - Sản xuất Cây Cau Trầu Không, 4 Thủy hải sản VIP, Cổng cưới, Homestay 2 cấp, Nồi bánh chưng Tết.<br>- Tạo animation `Wedding_Bow`, `Heir_Helper_Walk`, `Koi_Figure8_Swim` và VFX `fx_wedding_confetti`, `fx_banh_chung_fire`. | Atlas `farm_stage5_wedding_homestay.json/.png`. |
| **4. Frontend & Certificate Exporter** | `@frontend-developer` + `@ui-designer` | - Hoàn thiện `MarriageFamilyModal.tsx`, `HomestayModal.tsx` và `src/services/certificateExporter.ts` (xuất ảnh `.PNG` `960x540`). | UI Modals + Canvas PNG Certificate Exporter. |
| **5. Audio & QA** | `@game-audio-engineer` + `@code-reviewer` | - Gắn nhạc nền Lễ Cưới / Đêm Tết Đoàn Viên (`night` & `festival` pentatonic) + tiếng pháo giấy hỷ sự.<br>- Kiểm tra tổng thể 81/81 loài và 22/22 công thức chế biến hoạt động trơn tru. | Báo cáo Audit `RULE D0 & D1` Giai đoạn 5. |

---

## 4. QUY TRÌNH GIAO VIỆC CHO AI (`AI DELEGATION WORKFLOW & READY-TO-USE PROMPTS`)

### Cách 1: Prompt Giao AI Triển Khai Toàn Bộ Giai Đoạn 5 (Full-Stack Execution)
```markdown
Hãy đóng vai đội ngũ phát triển dự án "Nông Trại Tình Yêu & Gia Đình 3 Miền" và triển khai GIAI ĐOẠN 5 (v2.0 - Lễ Cưới Làng Quê, Tổ Ấm Gia Đình, Homestay & Tết Đoàn Viên) theo đúng file `15_PLAN_GIAI_DOAN_5_v2.0_Le_Cuoi_Va_Homestay.md`:
1. BƯỚC 1 (Khai báo Tác động chéo theo RULE D0 & D1): Kiểm tra tính toàn vẹn của toàn bộ 81 sinh vật & 22 công thức chế biến, đảm bảo Database Additive-Only.
2. BƯỚC 2 (Database & Economy - @economy-designer + @backend-architect): Tạo migration SQL cho `marriages`, `homestay_bookings`, `tet_cauldron_sessions` và mở khóa 5 loài Đợt 5 (`CROP_30` Trầu Cau, `AQUA_10, 13..15`) cùng công thức thứ 22 (`PROD_22` Mâm Cỗ Cưới) và Tổng quản `WORK_06`.
3. BƯỚC 3 (Gameplay, UI & Xuất Bằng Khen - @frontend-developer + @ui-designer): Hoàn thiện `MarriageFamilyModal.tsx`, `HomestayModal.tsx`, sự kiện Nồi Bánh Chưng Tết và `src/services/certificateExporter.ts` (xuất ảnh Bằng Khen Gia Đình Văn Hóa `.PNG` 960x540).
4. BƯỚC 4 (QA & Nghiệm thu - @code-reviewer): Kiểm tra xuất ảnh `.PNG` trên mọi trình duyệt và nghiệm thu theo Checklist Mục 5.
```

### Cách 2: Prompt Giao AI Sản Xuất Riêng Gói Asset, Animation (`8–12f`) & VFX Giai Đoạn 5
```markdown
Hãy kích hoạt chuỗi kỹ năng `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d` và `@technical-artist` để sản xuất trọn bộ Asset, Animation & VFX cho GIAI ĐOẠN 5 theo đúng Mục 2.5 của `15_PLAN_GIAI_DOAN_5_v2.0_Le_Cuoi_Va_Homestay.md` và `05_MASTER_ART`:
1. Tuân thủ tuyệt đối RULE D1 Art Lock: Góc nhìn 3/4 Top-Down Oblique, viền ấm `#3D2314` (cấm `#000000`), nền `#FF00FF`, Anchor `(0.5, 0.9)`.
2. Tạo Sprite 4 giai đoạn cho *Cây Cau & Giàn Trầu Không (`CROP_30` `48x80 px`)*, 4 Thủy hải sản VIP (`AQUA_10, 13..15`, kèm animation `Koi_Figure8_Swim` 12 frames).
3. Tạo Sprite Công trình Cổng Hoa Cưới, Homestay 2 Cấp (*Nhà Sàn Tre & Biệt Thự Đầm Sen*), Nồi Bánh Chưng Tết Đỏ Lửa (`Fire_Crackling_Loop` 8f), cùng nhân vật Cô Dâu - Chú Rể (`Wedding_Bow` 8f), *Bé Tiểu Đồng Gia Bảo* (`Heir_Helper_Walk` 8f) và *Ông Quản Gia Cửu (`WORK_06`)*.
4. Tạo 3 Particle VFX (`fx_wedding_confetti`, `fx_banh_chung_fire`, `fx_heart_bubble`) và đóng gói vào Atlas `farm_stage5_wedding_homestay.json/.png`.
```

---

## 5. CHECKLIST NGHIỆM THU GIAI ĐOẠN 5 (`DEFINITION OF DONE`)
- [ ] **Nghiệm thu RULE D0 & D1:** Đạt mốc 100% hệ sinh thái nông trại (81/81 loài, 22/22 công thức, 6/6 Gia nhân) đồng bộ tuyệt đối giữa `00_MASTER_BIBLE`, `01_MASTER_GDD`, `02_MASTER_ECONOMY` và Codebase.
- [ ] **Nghiệm thu Asset, Animation & VFX Đợt 5:** Animation `Wedding_Bow`, `Heir_Helper_Walk` và `Koi_Figure8_Swim` mượt 60fps; mưa hoa giấy `fx_wedding_confetti` và lửa nồi bánh chưng `fx_banh_chung_fire` ấm áp.
- [ ] **Nghiệm thu Xuất Bằng Khen `.PNG`:** File ảnh tải về từ `certificateExporter.ts` đúng kích thước `960x540 px`, hiển thị rõ nét tiếng Việt có dấu và con dấu đỏ.
