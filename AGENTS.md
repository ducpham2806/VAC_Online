# 🌾 AGENTS.MD — QUY TẮC TỐI THƯỢNG ĐỐI CHIẾU TÀI LIỆU (ZERO-REDUNDANCY) & VÒNG LẶP 6 BƯỚC KÈM TỰ NHẬN DIỆN 17 SKILLS ("HƯƠNG ĐỒNG GIÓ NỘI - VAC ONLINE")

Tài liệu này được nạp tự động cho các AI Coding Agents (**Antigravity, Claude, ChatGPT, Cursor, Windsurf**) khi làm việc trong kho mã nguồn dự án.

---

## 🚨 0. QUY TẮC BẤT DI BẤT DỊCH CHO MỌI TASK (`RULE D0: ĐỐI CHIẾU CHÉO & TRIỆT TIÊU TRÙNG LẶP 100%`)

Ở **TẤT CẢ CÁC TASK** (dù là thêm tính năng, chỉnh sửa thiết kế, cân bằng kinh tế hay viết code), AI **BẮT BUỘC** thực hiện quy trình kiểm toán 3 bước sau trước khi kết thúc task:
1. **Đối chiếu chéo toàn bộ tài liệu hiện có (`Cross-Document Reconciliation`):** Rà soát toàn bộ các file chuẩn (`00` ➔ `10` và `AGENTS.md`) để đảm bảo mọi con số (**6 Giai đoạn, 11 Epics, 52 Modules `M01.0 ➔ M11.6`, 155 Thực thể gốc, 17 AI Skills, 37 Test Cases**) và tên thực thể khớp nhau 100%, không để sót bất kỳ tham chiếu cũ nào (như `5 Giai đoạn`, `46 Modules` hay `M10.3`).
2. **Loại bỏ triệt để phần trùng lặp, dư thừa hoặc không cần thiết (`Zero Redundancy & Pruning`):**
   * Khi thêm tính năng/sự kiện mới có giao thoa với phần cũ, bắt buộc **hợp nhất (Merge) vào cùng một hệ thống duy nhất** và xóa bỏ phần rời rạc cũ (VD: hợp nhất mảnh cổ vật cũ vào `FEAT_03: 12 Kỷ Vật Tuổi Thơ 8x–9x`; phân tách rõ `EVENT_03: Đua Trâu Vàng chỉ số nông trại` với `M11.2..M11.4: Võ Đài PK & Loạn Chiến điều khiển thời gian thực`).
   * Tuân thủ nguyên tắc **Single Source of Truth (Một Nguồn Chân Lý Duy Nhất)**:
     * Gameplay, Cốt truyện & Luật chơi chi tiết $\rightarrow$ Chỉ viết đầy đủ tại `01_MASTER_GDD`.
     * Công thức toán học, Giá, Thuế, Trần thưởng & Bảng `Sources vs. Sinks` $\rightarrow$ Chỉ viết đầy đủ tại `02_MASTER_ECONOMY` & `04_MASTER_DATA.csv`.
     * Kiến trúc Database, RPC, Netcode `10Hz LERP`, `IHyperCasualCartridge` & 12 Quy tắc Code $\rightarrow$ Chỉ viết đầy đủ tại `03_MASTER_TECH`.
     * Quy chuẩn Màu sắc, Kích thước Sprite, Animation & WebAudio SFX $\rightarrow$ Chỉ viết đầy đủ tại `05_MASTER_ART`.
     * Sơ đồ luồng & Wireframe màn hình $\rightarrow$ Chỉ viết đầy đủ tại `06_MASTER_UI_UX` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`.
     * Phân rã công việc 6 Bộ phận theo 6 Giai đoạn & 37 Test Cases $\rightarrow$ Chỉ viết đầy đủ tại `08_MASTER_PLAN` & `10_MASTER_AI_PLAYBOOK`.
3. **Lưu trữ sạch sẽ (`Clean Root Directory`):** Mọi file tài liệu rời rạc đã được gộp phải chuyển vào `docs_archive_merged/`, giữ thư mục gốc gọn nhẹ đúng bộ file `00 ➔ 10`.

---

## 1. Bản Đồ Bộ Tài Liệu Chuẩn Duy Nhất (`00` ➔ `10` — Đã Đồng Bộ v9.0)
* `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` *(v9.0)*: Sổ tay tổng chỉ huy, điều hướng tài liệu `00 ➔ 10`, quy tắc `RULE D0` & ánh xạ 6 Bộ phận với **17 AI Skills**.
* `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` *(v7.0)*: Gameplay Vườn – Ao – Chuồng (155 thực thể), 3 Miền, 6 Gia nhân, Cốt truyện 10 Chương (`EMP`/`PRAG`), 6 Sự kiện Lễ hội (`FEAT_01..03`, `EVENT_01..03`) & **Chương 6: Sảnh Chung Đa Người Chơi, Võ Đài PK 1v1 / Tổ Đội 3v3 / Loạn Chiến 8–12P & Máy Thùng Hyper-Casual (`15s–45s`)**.
* `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md` *(v7.0)*: Toán học kinh tế, **7 Van chống lạm phát** (bổ sung **Thuế Sới Đình `10%` Zero-Sum** & **Trần thưởng Hyper-Casual `1,500 🪙/ngày`**), đồng **`🏮 Xu Hội Làng`** & Bảng `Sources vs. Sinks` 6 Giai đoạn.
* `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` *(v6.0)*: Kiến trúc Phaser 3 + React 19 + 11 Bảng Supabase SQL + 7 Hàm Atomic RPC (`FOR UPDATE`), **Phân kênh Sảnh Chung `30 CCU/Shard` + Đồng bộ `10Hz LERP`**, chuẩn băng game **`IHyperCasualCartridge`** & **12 Quy tắc Code (`RULE C1 ➔ C12`)**.
* `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv`: Dữ liệu thông số kinh tế gốc (155 thực thể).
* `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` *(v6.0)*: Quy chuẩn Pixel Art 64 màu, viền ấm `#3D2314`, animation 8–12 frames (bao gồm Sảnh Chung & Võ Đài PK) & WebAudio Ngũ cung / Trống hội.
* `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` *(v7.0)* & `07_INTERACTIVE_WIREFRAME_VIEWER.html`: Wireframe Splash 4 bước, Auth 4 Tabs, 2-Thumb Landscape HUD, Lán Thợ, Sảnh Chung Chợ Đình (Joystick + Emote Wheel) & Võ Đài PK / Hyper-Casual.
* `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` *(v8.0)* & `09_FACEBOOK_ROADMAP_POSTER.html`: Lộ trình **6 Giai đoạn đồng nhất (11 Epics / 52 Modules / 37 Test Cases)** và phân công 6 vị trí.
* `10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md` *(v9.0)*: Quy trình 6 bước khép kín có tích hợp Tự Nhận Diện & Kích Hoạt **17 Skills Chuyên Môn** cho từng Module `M01.0` ➔ `M11.6`.

---

## 2. Quy Trình 6 Bước Khép Kín Kèm Tự Nhận Diện Skill (`Auto-Skill Routing Loop`)
Khi được yêu cầu làm một tính năng (`Module Mxx.y` từ `M01.0` đến `M11.6`), AI **BẮT BUỘC** tự động nhận diện và kích hoạt các Skill liên quan theo từng bước trong `10_MASTER_AI_PLAYBOOK`:
1. **Bước 1 — Thiết kế, Đối chiếu Không Trùng Lặp & Chốt Spec (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`):** Áp dụng `RULE D0` đối chiếu với `01`, `02`, `04`, `06` để chốt thông số, công thức chống lạm phát và trường hợp biên.
2. **Bước 2 — Tạo Asset, Bản đồ, VFX & Âm thanh (`@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`):** Cập nhật Sprite/Texture trong `src/game/assets/PixelAssetGenerator.ts` (viền ấm `#3D2314`), Particle VFX và SFX trong `src/services/soundEffects.ts`.
3. **Bước 3 — Code Backend, Multiplayer Sync & Store (`@backend-architect`, `@godot-multiplayer-engineer`, `@economy-designer`):** Cập nhật SQL/RPC (`FOR UPDATE`), kênh Realtime / Sharded Plaza `10Hz LERP`, Types (`0 any`) và Action trong `src/store/useGameStore.ts`.
4. **Bước 4 — Code Giao diện 2-Thumb Landscape & Cartridge SDK (`@ui-designer`, `@frontend-developer`):** Cập nhật `FarmScene.ts`, `SocialPlazaScene.ts`, `MinigameHostScene.ts` (`IHyperCasualCartridge`) và `src/App.tsx` (`.touch-btn >= 38–44px`, `safe-area-inset-*`).
5. **Bước 5 — Tự kiểm thử, Đối chiếu Tài liệu & Audit (`@code-reviewer`):** Chạy `npx tsc --noEmit` (`0 errors`), chạy **37 Test Cases** trong `src/services/qcTestRunner.ts` đạt `100% PASS` và kiểm tra lại `RULE D0` (không sinh code/tài liệu thừa).
6. **Bước 6 — Trình duyệt & Dừng chờ lệnh (`@growth-hacker`, `@content-creator`):** Xuất **Phiếu Nghiệm Thu Tính Năng** (ghi rõ các Skill đã kích hoạt + xác nhận đã đối chiếu `RULE D0`) và **dừng lại chờ Chủ dự án duyệt (`Approval Gate`)**.
