# 06 · UI / UX

**Sở hữu:** luồng màn hình, HUD, điều khiển chạm, chuẩn giao diện.
**Không chứa:** luật của từng hệ thống (`01`), chuẩn hình ảnh (`05`).
Wireframe cũ (`07_INTERACTIVE_WIREFRAME_VIEWER.html`) đã lưu trữ. Wireframe mới cho HUD điều khiển lai là thẻ P0-5 (`07` LT-10).

### UI-01 · Chất liệu và chuẩn chung
- **Chất liệu:** khung Gỗ Lim, Tre, Giấy Dó (9-slice `ui_wood.png`, `ui_paper.png`).
- **Thông báo:** toast bằng gỗ/tre; không dùng hộp thoại hệ thống.
- **Nút chạm** (`.touch-btn`) ≥ 44×44 px. Đây là số chốt; các chỗ ghi "38–44" là bản cũ.
- **Màn hình:** chỉ chơi màn ngang, full màn hình, `env(safe-area-inset-*)` cho mọi HUD nổi.
- **Không che bản đồ:** giữ trống ~80% giữa màn hình. Bảng/modal mở thì bản đồ mờ đi.

### UI-10 · Kích thước kiểm thử
Mọi thay đổi giao diện phải chụp ở 1280×720 và 844×390 (điện thoại ngang thấp).

### UI-20 · Điều khiển lai (QD-13)
| Vùng | Thao tác |
|---|---|
| Góc dưới trái | Joystick ảo nổi (hiện ở chỗ chạm) để đi |
| Chạm vào đất trống | Nhân vật tự tìm đường tới đó |
| Chạm vào ô / chuồng / xưởng / NPC | Ở gần thì làm ngay bằng công cụ phù hợp (GP-02); ở xa thì nhân vật tự đi tới rồi làm |
| Giữ và kéo trên các ô | Làm cả loạt: gặt, tưới, gieo (kiểu kéo để thu của Green Farm 3) |
| Góc phải | Nút hành động theo ngữ cảnh + thanh công cụ 5–8 ô (cuốc, bình tưới, liềm, túi hạt, rìu, thức ăn, cần câu) |
| Kéo hai ngón / kéo ở vùng trống | Di chuyển camera |

**Nút hành động:** làm việc trên ô ruộng trong tầm (ưu tiên ô đang đứng, rồi ô gần nhất); không có thì báo đối tượng kề bên. Biểu tượng trên nút luôn là công cụ sẽ dùng.

Phân biệt chạm với kéo: dịch quá 12 px là kéo, khi nhả thì không thực hiện thao tác. Joystick chỉ nhận ở góc dưới trái (~1/3 rộng, ~40% cao), để không tranh với kéo camera.

**Wireframe (P0-5):** [`docs/wireframes/hud-dieu-khien-lai.html`](wireframes/hud-dieu-khien-lai.html), ảnh 1280×720 và 844×390 cùng thư mục. Mọi nút ≥ 44 px ở cả 2 cỡ.
- **Phát hiện ở 844×390:** thanh công cụ 2 hàng + dock che gần nửa bản đồ.
- **Luật:** vì công cụ tự chọn theo đối tượng (GP-02), thanh công cụ mặc định **thu gọn** thành 1 nút hiện công cụ đang dùng; chạm để mở 8 ô. Ở màn cao < 420 px thì dock chỉ hiện icon.

### UI-30 · HUD nông trại
- **Góc trên trái:** chân dung, cấp + thanh XP.
- **Góc trên giữa:** ngày, mùa (biểu tượng + "còn N ngày"), thời tiết.
- **Góc trên phải:** 🪙, 💎, ⚡. Thanh ⚡ nổi bật lên khi đang dùng việc nặng.
- **Đáy:** dock gỗ gồm Kho, Bảng đơn, Gia Phả (nhiệm vụ), Bạn bè, Cài đặt.
- **Trên đầu đối tượng:** ô sắp chín hiện vòng thời gian khi chạm giữ; NPC có quà hoặc việc thì hiện bong bóng.

### UI-40 · Luồng màn hình
1. **Splash:** khởi động Phaser → nạp dữ liệu → kết nối → kiểm phiên đăng nhập.
2. **Cổng làng:** 4 tab — đăng nhập, đăng ký, chơi khách, quên mật khẩu (OTP 6 số). Tài khoản khách có nút liên kết tài khoản.
3. **Giấy về quê:** chọn nhân vật Nam/Nữ và tên. Ở bản 1 miền, ô chọn miền hiện 2 miền "sắp mở" (QD-15).
4. **Cutscene mở đầu** (`02` TG-40) → nông trại đổ nát + hướng dẫn tân thủ (GP-62).
5. **Nông trại:** HUD (UI-30). Các bảng mở từ dock hoặc từ đối tượng:
   - Kho, Khay giống (lọc theo mùa và Đợt; loài bị khóa hiện "mở ở Chương N");
   - Xưởng/Bếp, Bảng đơn HTX, Lán Thợ;
   - Gia Phả, Hồ sơ NPC (tim, sở thích đã biết);
   - Lịch mùa và lễ hội.
6. **Làng** (khi mở): đi bộ ra cổng nông trại sang bản đồ làng có nhà NPC, chợ, HTX, đình.

### UI-50 · Màn sau 1.0
Sảnh Chung và Võ Đài (GP-80): joystick 8 hướng, kênh phòng, chat bong bóng ≤ 60 ký tự, bánh xe biểu cảm, đồng hồ trận ở giữa đỉnh màn, nút kỹ năng ở 2 góc dưới.
