# TÀI LIỆU PHÂN RÃ CHI TIẾT HẠNG MỤC TÍNH NĂNG: Ý TƯỞNG (GD) – LẬP TRÌNH (DEV) – KIỂM THỬ (QC)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `11_MASTER_WBS_Phan_Ra_Chi_Tiet_Idea_Dev_QC_Toan_Du_An.md`  
**Phiên bản:** Master WBS 2.0 (Phân rã 10 Epics / 40 Modules từ Splash, Loading, Đăng Ký/Đăng Nhập/Chơi Khách/Quên Mật Khẩu đến DLC 4 v2.0 + Bộ 24 Test Cases QC Tự Động)  
**Đối tượng sử dụng:** Product Owner / Game Designer (Idea), Frontend & Backend Engineers (Dev), QA/QC Engineers (Testing)

---

## 1. QUY TRÌNH PHỐI HỢP BA BỘ PHẬN (IDEA ➔ DEV ➔ QC WORKFLOW)

Để đảm bảo từng tính năng trong **VAC Online** được triển khai đồng bộ từ bàn giấy lên đến bản build thực tế trên Web/Mobile PWA/iOS/Android, mỗi Module tính năng (`Work Package`) bắt buộc đi qua **4 Cổng Kiểm Soát (Quality Gates)**:

| Cổng (Gate) | Bộ Phận Phụ Trách | Đầu Vào (Input) | Đầu Ra Bắt Buộc (Deliverable) | Tiêu Chí Qua Cổng (Exit Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **Gate 1: Idea & GD Spec** | Game Designer / Product | Master GDD (`01`), Economy (`02`), CSV (`04`), UI/UX (`06`) | Đặc tả luồng Splash/Auth/UX, công thức toán học, giới hạn chống lạm phát & Edge cases | Không còn chỉ số mơ hồ; mọi item đều có `ID` khớp CSV 155 thực thể. |
| **Gate 2: Art & Audio** | Technical Artist / Sound | Danh sách `ID` từ Gate 1 & Quy chuẩn Pixel (`05`) | Sprite Sheet `32x32` / `64x64`, JSON Atlas, hiệu ứng Particle & SFX/BGM Ngũ Cung | Tách nền `#FF00FF` sạch 100%, đúng bảng 64 màu, loop 8–12 frames mượt không giật. |
| **Gate 3: Dev Implementation** | Frontend (Phaser/React) & Backend (Supabase) | GD Spec + Art Atlas + Schema (`03`) | Splash + Auth Gate, HUD 2-Thumb Landscape, Zustand Store, Supabase Auth/RLS/RPC | Build TypeScript `0 errors`; mọi thao tác xác thực và cộng/trừ tiền đều an toàn tuyệt đối. |
| **Gate 4: QC & Sign-off** | QA / QC Engineer | Bản build + Bộ **QC Auto-Test (`src/services/qcTestRunner.ts`)** | Báo cáo Pass/Fail (24 Automated Test Cases across 10 Epics) | Pass 100% (`24/24`) các Test Cases tự động & thủ công; đạt 60 FPS trên trình duyệt di động xoay ngang. |

---

## 2. MA TRẬN TỔNG QUAN 10 EPICS & 40 MODULE TÍNH NĂNG (MASTER BACKLOG)

| Mã Epic | Tên Epic (Nhóm Hệ Thống Lớn) | Số Module Con | Giai Đoạn Lộ Trình | Độ Ưu Tiên | Phụ Thuộc Kỹ Thuật (Dependencies) |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **EPIC 01** | Splash, Loading 4 Bước, Xác Thực (Đăng Nhập/Đăng Ký/Chơi Khách/Quên MK), Mobile PWA & Cloud | 6 Modules (`M01.0A`, `M01.0B`, `M01.1` – `M01.4`) | Phase 0 (`v0.1`) | **P0 (Blocker)** | Vite, Phaser 3, React 19, Supabase Auth & Realtime |
| **EPIC 02** | Khởi Tạo Điền Chủ, Bản Đồ 3 Miền & Thời Tiết Động | 4 Modules (`M02.1` – `M02.4`) | Phase 1 (`v1.0`) | **P0 (Core)** | `EPIC 01`, Bảng `public.profiles` |
| **EPIC 03** | Vòng Lặp Sản Xuất Cốt Lõi: Vườn – Ao – Chuồng (81 Loài) | 5 Modules (`M03.1` – `M03.5`) | Phase 1 (`v1.0`) | **P0 (Core)** | `EPIC 02`, Bảng `farm_entities` & `inventories` |
| **EPIC 04** | 8 Xưởng Chế Biến Sâu & Bếp Củi Nấu Ngẫu Nhiên (27 Món) | 4 Modules (`M04.1` – `M04.4`) | Phase 1 & DLC 1 | **P1 (High)** | `EPIC 03`, Hệ thống Tag nguyên liệu |
| **EPIC 05** | Hệ Thống Lán Thợ Đồng Quê & 6 Gia Nhân Tự Động Hóa (Online + Offline Lazy-Tick) | 5 Modules (`M05.1` – `M05.5`) | DLC 1 & DLC 3 | **P1 (High)** | `EPIC 03`, `EPIC 04`, Bảng `hired_workers` |
| **EPIC 06** | Giao Thương 4 Tầng: HTX, Chợ Phiên 3 Miền, Tàu Hỏa & Thương Lái | 4 Modules (`M06.1` – `M06.4`) | Phase 1 & DLC 1 | **P1 (High)** | `EPIC 03`, Bảng `market_listings`, `trader_booms` |
| **EPIC 07** | Tương Tác Xã Hội: Thăm Nhà, Hái Trộm, 4 Lớp Phòng Thủ & Lưu Bút | 4 Modules (`M07.1` – `M07.4`) | DLC 2 (`v1.5`) | **P1 (High)** | `EPIC 06`, RPC `rpc_attempt_steal`, `farm_guestbook` |
| **EPIC 08** | Đình Làng, Miếu Thần Nông, Vườn Ươm Đột Biến & Hội Làng | 4 Modules (`M08.1` – `M08.4`) | DLC 2 & DLC 3 | **P2 (Medium)** | `EPIC 03`, Kênh Realtime `vac_online_global_hub` |
| **EPIC 09** | Thời Trang 12 Slots, Ghép 3➔1, Transmog, Lịch Bloc, Vé Số 18h, Bằng Khen & IAP | 2 Modules (`M09.1` – `M09.2`) | DLC 3 (`v1.8`) | **P2 (Medium)** | `EPIC 04`, Khung Cửi Lụa `MAC_08` |
| **EPIC 10** | End-Game Meta: Hẹn Hò 10 Tim, Lễ Cưới Quê, Con Cái & Homestay | 2 Modules (`M10.1` – `M10.2`) | DLC 4 (`v2.0`) | **P3 (Polish)** | Toàn bộ `EPIC 01` ➔ `EPIC 09` |

---

## 3. ĐẶC TẢ CHI TIẾT CÁC MODULE SPLASH, LOADING & XÁC THỰC TÀI KHOẢN (`M01.0A` & `M01.0B`)

### Module `M01.0A`: Màn Hình Chào (`Splash Screen`) & Thanh Tải Tài Nguyên 4 Giai Đoạn (`Multi-Stage Preloader`)
* **🎯 Ý Tưởng & Game Design (Idea/GD):**
  * Khi người chơi mở game lần đầu (hoặc bấm xem lại màn hình Cổng Làng), hiển thị bức tranh **Cổng Làng Hương Đồng Gió Nội Ba Miền** cùng thanh tiến trình tải 4 cột mốc rõ ràng (`0% ➔ 25% ➔ 50% ➔ 75% ➔ 100%`):
    1. **Mốc 1 (`0% – 25%`):** Khởi tạo Engine Phaser 3 WebGL & Bộ Pixel Art Atlas 64 Màu.
    2. **Mốc 2 (`25% – 50%`):** Nạp Đại Từ Điển 155 Thực Thể Vườn – Ao – Chuồng 3 Miền.
    3. **Mốc 3 (`50% – 75%`):** Kết nối Supabase Cloud & Kênh Loa Phường Realtime.
    4. **Mốc 4 (`75% – 100%`):** Kiểm tra Phiên Đăng Nhập & Đồng bộ Hồ sơ Điền chủ.
  * Hiển thị ngẫu nhiên **Ca Dao Tục Ngữ & Mẹo Nhà Nông** dưới thanh Loading để người chơi đọc trong lúc chờ (`~1.8 – 2.5 giây`), kèm nút **`⚡ Bỏ Qua Chờ ➔`** cho người chơi muốn vào ngay lập tức.
* **💻 Hạng Mục Lập Trình (Dev Tasks):**
  * **Frontend (`src/services/authService.ts` & `src/App.tsx`):** Quản lý state `bootStage` (`'SPLASH' | 'AUTH_GATE' | 'PLAYING'`), `loadingProgress` (`0..100`) và `loadingStepText`.
* **🧪 Kịch Bản Kiểm Thử & Nghiệm Thu (QC Checklist):**
  * **[TC-01.0a] Kiểm tra tiến trình tải Splash 4 bước (`0% ➔ 100%`):** Khởi chạy Splash $\rightarrow$ Tiến trình tăng tuần tự qua đủ 4 mốc, khi đạt `100%` tự động chuyển sang Cổng Làng Xác Thực (`AUTH_GATE`) hoặc vào thẳng nông trại nếu đã có phiên đăng nhập ghi nhớ.

---

### Module `M01.0B`: Cổng Làng Xác Thực 4 Chế Độ (`Đăng Nhập`, `Đăng Ký`, `Chơi Khách`, `Quên Mật Khẩu OTP` & `Liên Kết Tài Khoản Khách`)
* **🎯 Ý Tưởng & Game Design (Idea/GD):**
  * Cung cấp trọn vẹn **4 phương thức truy cập** để không làm rớt bất kỳ tệp người chơi nào (từ người chơi Casual ngại tạo tài khoản đến người chơi Hardcore muốn bảo mật Cloud):
    1. **🔑 Đăng Nhập (`LOGIN`):** Nhập Email / Tên đăng nhập + Mật khẩu, có nút Hiện/Ẩn mật khẩu (`👁️`) và tùy chọn *"Ghi nhớ phiên đăng nhập"*.
    2. **📝 Đăng Ký Tài Khoản Mới (`REGISTER_ACCOUNT`):** Nhập Tên Điền chủ, Email, Mật khẩu (`>= 6 ký tự`) và Xác nhận mật khẩu. Đăng ký thành công tặng ngay **`+500 🪙 Xu Vàng Khởi Nghiệp`** và tự động mở **Giấy Đăng Ký Về Quê Lập Nghiệp (Chọn Nam/Nữ & Quê hương Bắc – Trung – Nam)**.
    3. **⚡ Chơi Khách 1 Chạm (`GUEST MODE`):** Vào thẳng game chỉ với 1 cú chạm mà không cần nhập Email/Mật khẩu. Tạo mã khách (`Khách_XXXX`), gắn nhãn **`👤 Khách [🔗 Liên Kết +50💎]`** trên Top HUD. Khi người chơi Khách quyết định nhập Email + Mật khẩu để **Liên Kết Tài Khoản Chính Thức (`bindGuestToPermanentAccount`)**, giữ nguyên 100% tiến trình trang trại hiện có và thưởng nóng **`+50 💎 Ngọc Bảo Hộ`** + **`+1,000 🪙 Xu Vàng`**!
    4. **🔓 Quên Mật Khẩu & Đặt Lại Mật Khẩu Bằng OTP (`FORGOT_PASSWORD`):**
       * **Bước 1:** Nhập Email đã đăng ký $\rightarrow$ Gửi yêu cầu khôi phục lên Supabase Auth (`resetPasswordForEmail`) đồng thời cấp mã OTP 6 chữ số để xác thực nhanh.
       * **Bước 2:** Nhập đúng mã OTP 6 số + Mật khẩu mới (`>= 6 ký tự`) $\rightarrow$ Cập nhật mật khẩu mới thành công và cho phép đăng nhập lại ngay.
* **💻 Hạng Mục Lập Trình (Dev Tasks):**
  * **Frontend & Cloud (`src/services/authService.ts` & `useGameStore.ts`):**
    * Xây dựng `authService` kết nối kép: vừa gọi `supabase.auth.signUp / signInWithPassword / resetPasswordForEmail` khi có mạng, vừa lưu trữ băm an toàn trong `localStorage` (`vac_auth_users_v1`, `vac_auth_session_v1`) để đảm bảo game chạy mượt 100% ngay cả khi đứt cáp hoặc chơi Offline PWA.
    * Tích hợp các action vào `useGameStore`: `registerAccount`, `loginAccount`, `loginAsGuest`, `bindGuestAccount`, `requestPasswordResetOtp`, `confirmPasswordResetOtp`, `logoutAccount`.
* **🧪 Kịch Bản Kiểm Thử & Nghiệm Thu (QC Checklist):**
  * **[TC-01.0b] Kiểm tra Đăng ký & Chặn mật khẩu yếu / không khớp:** Nhập mật khẩu `< 6 ký tự` hoặc `confirmPassword !== password` $\rightarrow$ Hệ thống từ chối và báo lỗi rõ ràng; nhập hợp lệ $\rightarrow$ Tạo tài khoản `REGISTERED` thành công, cộng `+500 🪙` và mở bảng chọn Quê hương 3 miền.
  * **[TC-01.0c] Kiểm tra Chơi Khách (`GUEST`) & Liên kết lên Tài khoản Chính thức (`+50 💎`):** Vào bằng chế độ Chơi Khách (`accountType === 'GUEST'`), cày lên một số Vàng nhất định rồi gọi `bindGuestAccount(email, password, name)` $\rightarrow$ Toàn bộ Vàng & Ruộng vườn được giữ nguyên, `accountType` chuyển thành `'REGISTERED'` và cộng đúng `+50 💎 Ngọc` + `+1,000 🪙`.
  * **[TC-01.0d] Kiểm tra luồng Quên Mật Khẩu 2 Bước (Gửi OTP & Đặt lại mật khẩu):** Gọi `requestPasswordResetOtp(email)` $\rightarrow$ Sinh mã OTP 6 chữ số hợp lệ; nhập sai OTP bị chặn; nhập đúng OTP + mật khẩu mới $\rightarrow$ Đổi mật khẩu thành công và đăng nhập được bằng mật khẩu mới.

---

## 4. DANH SÁCH 24 TEST CASES TỰ ĐỘNG TRONG `src/services/qcTestRunner.ts`

1. **`TC-01.0a` (`EPIC 01`):** Tiến trình Splash & 4-Stage Loading (`0% ➔ 100%`) vận hành chuẩn xác.
2. **`TC-01.0b` (`EPIC 01`):** Đăng ký tài khoản mới chặn mật khẩu yếu (`< 6 ký tự`), tạo tài khoản hợp lệ thưởng `+500 🪙`.
3. **`TC-01.0c` (`EPIC 01`):** Chơi Khách (`GUEST`) & Liên kết lên Tài khoản Chính thức bảo toàn 100% tài sản + thưởng `+50 💎`.
4. **`TC-01.0d` (`EPIC 01`):** Quên mật khẩu gửi mã OTP 6 số, chặn OTP sai và cập nhật mật khẩu mới khi nhập đúng OTP.
5. **`TC-01.3a` (`EPIC 01`):** Toàn vẹn Danh mục 155 Thực thể Master Data & Không trùng lặp ID.
6. **`TC-02.1b` (`EPIC 02`):** Chống XSS & Lọc ký tự thẻ HTML (`<script>`) trong Tên Điền Chủ.
7. **`TC-02.1a` (`EPIC 02`):** Buff Vùng Miền Bắc Bộ (`-10%` thời gian chín cây ngắn ngày `CROP`).
8. **`TC-02.2b` (`EPIC 02`):** Chặn âm Năng lượng (`Stamina`) khi Vét Ao lúc `⚡ < 3`.
9. **`TC-02.3a` (`EPIC 02`):** Thời tiết Mưa Rào tự động tưới ướt 100% ô đất.
10. **`TC-02.4a` (`EPIC 02`):** Chặn vượt trần khi đã mở tối đa `25/25` Phân khu Đất Hoang.
11. **`TC-03.2a` (`EPIC 03`):** Tưới nước Giếng Làng giảm `15%` thời gian chín và không cộng dồn.
12. **`TC-03.4a` (`EPIC 03`):** Thu hoạch Nông sản Hoàng Kim `⭐` nhận gấp `3 lần` giá trị Xu Vàng.
13. **`TC-04.2a` (`EPIC 04`):** Bếp Củi Ngẫu Nhiên chặn nấu khi `< 3` nguyên liệu & thưởng `+10 💎` khi đủ.
14. **`TC-05.1a` (`EPIC 05`):** Gia hạn Hợp đồng 3 ngày Nhân công chiết khấu chuẩn `12%`.
15. **`TC-05.2a` (`EPIC 05`):** Nhân công tự động ăn 1 suất cơm trên Bàn Lán Thợ khi `Độ No < 35%`.
16. **`TC-05.5a` (`EPIC 05`):** Lazy-Tick Offline 4 Giờ tự động thu nông sản vào Giỏ Thợ & trừ suất cơm.
17. **`TC-06.2a` (`EPIC 06`):** Chợ Phiên P2P kẹp khung giá `[0.8x, 2.0x]` và đốt đúng `10%` Thuế Chợ.
18. **`TC-06.3a` (`EPIC 06`):** Đóng toa Tàu Thống Nhất Bắc – Nam cộng đúng Voucher Tàu Hỏa.
19. **`TC-07.2a` (`EPIC 07`):** Sự kiện "Lá Lành Đùm Lá Rách" tốn `0 ⚡` và cộng Điểm Nghĩa Xóm.
20. **`TC-08.2a` (`EPIC 08`):** Vườn Ươm Đột Biến cam kết nổ `100%` khi chạm ngưỡng Bảo hiểm Pity.
21. **`TC-09.1b` (`EPIC 09`):** Khâu ghép 3 món Thời trang trùng nhau (`3➔1`) tăng `+150 ✨ Phong Cách`.
22. **`TC-09.2a` (`EPIC 09`):** Chặn xé Lịch Bloc Quê Nội lần thứ 2 trong cùng 1 ngày.
23. **`TC-10.1a` (`EPIC 10`):** Biếu quà chạm mốc `10/10 Tim` kích hoạt Lễ Cưới Quê & Quyền lợi Gia Bảo.
24. **`TC-10.2a` (`EPIC 10`):** Đón đoàn khách Homestay cộng đúng Vàng, Ngọc và Điểm Phong Thủy.
