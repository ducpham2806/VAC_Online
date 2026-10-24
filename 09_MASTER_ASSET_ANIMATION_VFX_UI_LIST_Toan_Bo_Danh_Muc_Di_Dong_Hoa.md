# DANH MỤC TỔNG THỂ GAME ASSETS, QUY CHUẨN ANIMATION NHIỀU FRAME MƯỢT MÀ, VFX & UI ASSETS (MASTER ASSET & HIGH-FPS ANIMATION BIBLE)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Phiên bản:** Master Asset & Animation 4.0 (Bao gồm Toàn bộ 140+ Thực thể, 6 Nhân Công Lán Thợ, 12 Tính năng Benchmark/Mới, 8–12 Frames Seamless Loops, VFX & UI Kit)  
**Thực hiện bởi:** `@technical-artist`, `@ui-designer` & `@game-designer`

---

## PHẦN 1: 5 QUY TẮC DIỄN HOẠT ĐA KHUNG HÌNH MƯỢT MÀ – KHÔNG GIẬT (`8 – 12 FRAMES SEAMLESS LOOP`)
1. **Nâng chuẩn Số Frame (`8 – 12 Frames / Vòng lặp` ở `8 – 15 FPS`):** Tuyệt đối không dùng 2–3 frames thô cứng; bổ sung đầy đủ các frame trung gian (*In-betweens*).
2. **Quy tắc Khép Vòng Lặp (`Frame N -> Frame 1 Seamless Continuity`):** `Frame Cuối` không trùng `Frame Đầu`, chia theo góc pha sóng Sin (`0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°`) để nối vòng trơn tru 100%.
3. **Dịch chuyển Sub-Pixel bằng Sắc độ (`Sub-Pixel Shading`):** Dịch `0.5px` bằng độ sáng cặp pixel cạnh nhau cho các chuyển động nhẹ (lúa rì rào, lá rau rung rinh, nhân vật thở).
4. **Lệch Pha Theo Tọa Độ (`Per-Tile Phase Offset`):** Mỗi ô đất cộng độ trễ `animOffset = (gridX * 0.15 + gridY * 0.25)s` tạo thành từng đợt sóng gió đuổi nhau trên cánh đồng.
5. **Chuyển động Thứ cấp (`Follow-Through`):** Tà áo, tóc, vành nón lá, lá cây đi trễ hơn thân chính `1–2 frames`.

---

## PHẦN 2: DANH MỤC ASSETS MÔI TRƯỜNG, NƯỚC AO, CÁ NHẢY & RỪNG TRÚC (`45 BỘ ASSETS SỐNG ĐỘNG`)
* **Mặt nước Ao, Đầm Sen & Ruộng Lúa (`ENV_WATER_01..03`):** `32x32 px`, **8 frames loop (`8 FPS`)** gợn sóng lấp lánh và bọt trắng vỗ bờ.
* **Cá Nhảy Búng Nước Tự Nhiên Trong Ao (`ENV_FISH_AMB_01`):** `48x48 px`, **10 frames (`12 FPS`)** cá vọt lên uốn mình lấp lánh dưới nắng rồi lao xuống bắn tia nước tròn và vòng sóng lan tỏa.
* **Khu Thám Hiểm Rừng Trúc & Bãi Bồi Ven Sông (`ENV_EXP_01..04`):** *Bụi măng rừng nhú mầm (`32x32`, 6f), Hốc đá cua suối thò càng kẹp (`32x32`, 8f), Rương gỗ trầm tích nửa chìm nửa nổi bên mép nước (`48x48`, 8f lấp lánh)*.
* **Cảnh quan 3 Miền:** *Lũy tre làng lá rơi (`96x128`), Cây đa bến nước + Cột mốc Check-in & Sổ Lưu Bút (`160x160`), Rặng dừa nghiêng bóng (`96x144`), Đồi thông hoa dã quỳ (`96x128`), Cầu khỉ nhún 2px khi bước qua (`96x48`), Xuồng ba lá dập dềnh (`64x48`), Giếng đá ong (`64x64`)*.

---

## PHẦN 3: DANH MỤC ASSETS & ANIMATION 48 LOẠI CÂY TRỒNG, LÚA, RAU CỎ, CÂY ĂN QUẢ & CÂY ĐỘT BIẾN
* **28 Loại Cây Ruộng Ngắn & Trung Hạn (`32 x 48 px / frame`, 5 Stages x 8 frames):**
  * *Lúa (Tẻ, Nếp cái hoa vàng, Lúa tím thảo dược đột biến):* Uốn sóng 8 frames.
  * *Rau lá & Gia vị (Rau muống, Hành mùi, Cải ngọt, Sả ớt gừng, Cải cúc, Tỏi Lý Sơn, Bông điên điển):* Tàu lá rung rinh kèm bướm trắng đậu.
  * *Cây củ & Thân đứng (Ngô, Khoai lang, Đậu tương, Mía, Lạc, Đậu xanh, Khoai môn, Vừng, Chè, Khóm):* Lá phe phẩy trong gió.
  * *Giàn leo & Quả bò đất (Dưa chuột, Cà chua/Cà tím, Mướp hương/Khổ qua, Bầu sao/Bí đao, Dưa hấu Mai An Tiêm, Dưa hấu vuông Tài Lộc):* Quả treo dưới giàn tre đung đưa như con lắc đồng hồ (`8 frames pendulum`); thêm 1 trạng thái `Storm_Tilted` (giàn tre hơi nghiêng sau cơn mưa giông chờ bạn bè bấm dựng giúp!).
  * *Đầm nước, Nấm & Hoa (Sen, Sen nghìn cánh đột biến, Nấm rơm trên ụ rơm, Hoa nhài/Hoa cúc):* Nhấp nhô trên nước và tỏa hạt hương sáng.
* **20 Loại Cây Ăn Quả Lâu Năm & Đại Đặc Sản (`64 x 96 px / frame`, 5 Stages x 8 frames):**
  * *Đu đủ, Dừa xiêm, Ổi lê/Hồng xiêm, Chuối tiêu, Xoài cát, Mít Thái, Tre làng/Trúc xanh, Cau/Trầu không, Vải thiều, Nhãn lồng/Mận hậu, Bưởi Diễn/Đào, Bưởi Hồ Lô đột biến, Thanh long, Giàn nho, Hồ tiêu/Điều, Cà phê, Măng cụt, Vú sữa/Chôm chôm, Sầu riêng Ri6 & Dừa sáp*.

---

## PHẦN 4: DANH MỤC ASSETS 19 VẬT NUÔI, 19 THỦY SẢN, 8 NHÀ MÁY, 6 NHÂN CÔNG & CÔNG TRÌNH ĐẶC BIỆT

### 4.1. 19 Vật Nuôi Chuồng, Thú Cưng & 19 Thủy Sản Ao (`8 – 12 Frames / Hành Động`)
* **Gia cầm & Vật nuôi nhỏ (`32x32 px`):** *Gà Ri, Chim Cút, Vịt cỏ, Thỏ trắng & Bồ câu, Nong Tằm ăn lá dâu nhả tơ vàng, Ong mật, Gà Đông Tảo, Vịt đồng, Chó Phú Quốc, Mèo Tam Thể, Đàn Ngỗng Trời, Chim Sáo Đen biết nói (vỗ cánh hót báo Thương lái giá cao!)*.
* **Gia súc lớn (`48x48 px`):** *Heo Móng Cái, Bò vàng/Bò sữa, Dê núi & Cừu Ninh Thuận, Lợn bản/Bò Mông, Hươu sao lấy nhung, Nhà chim yến, Trâu Đen cày ruộng*.
* **19 Thủy sản Ao (`24x24` bóng bơi & `32x32` thu hoạch):** Đầy đủ từ Cá Rô, Tép đồng, Lươn, Trai sông ngậm Ngọc Trai, Cá Koi ngũ sắc cho đến Cá Trắm Đen, Rươi Tứ Kỳ, Tôm Hùm Phú Yên, Cua Cà Mau.

### 4.2. Khu "Lán Thợ Đồng Quê", Đội Ngũ 6 Nhân Công & Công Trình Benchmark (`8 – 12 Frames Loop`)

| Mã Asset | Tên Nhân Công / Công Trình Đặc Biệt | Kích Thước (`px`) | Các Bộ Animation Cần Làm (Số Frames & FPS) | Mô Tả Diễn Hoạt Tự Nhiên |
| :--- | :--- | :---: | :--- | :--- |
| `BLD_LODGE` | **🛖 Lán Thợ & Bàn Ăn Gia Nhân** | `128x96` | `Idle_Empty` (4f) \| `Feast_SmokingHot` (8f, 8fps) | Bàn tre dài hiện mâm cơm bốc khói nghi ngút khi chủ nhà dọn cơm cho thợ. |
| `WORK_01..06` | **👷 6 Nhân Công Giúp Việc** *(Chú Tư Cày, Cô Năm Thảo, Anh Sáu Kình, Dì Bảy Bếp, Chú Tám Mộc, Quản Gia Cửu)* | `64x64` | `Walk_Carry` (8f) \| `Work_Action` (8f–10f) \| `Sit_Eat_Rice` (8f) \| `Sit_Fan_Hungry` (6f) | Đi làm việc thoăn thoắt, trưa về ngồi quây quần và cơm; đổi màu áo khi được cấp phát *Áo cánh nâu / Áo tơi / Đồng phục lụa VIP*! |
| `BM_TOTEM` | **🙏 Miếu Thần Nông / Tượng Ông Địa** | `48x64` | `Idle_IncenseSmoke` (8f) \| `Laugh_ShakeFortune` (10f, 12fps) | Tượng Ông Địa bụng phệ cầm quạt mo cau cười *Hahaha* và lắc ống xăm tre phát sáng khi người chơi dâng lễ đầu ngày! |
| `BM_TRADER` | **🚚 Xe Tải Thương Lái Đột Xuất** | `96x64` | `Drive_In_Bounce` (8f) \| `Open_Tailgate_Scale` (8f) | Chiếc xe tải nhỏ màu xanh/vàng chạy phành phạch vào cổng lúc 09:00 & 20:00, treo bảng giá `x2.8` nhấp nháy! |
| `BM_NURSERY` | **🧬 Lán Vườn Ươm Chiết Cành Đột Biến** | `96x80` | `Idle_PollenGlow` (8f) \| `Graft_Success_Burst` (12f) | Bàn chiết ghép bằng tre có lọ phấn hoa phát sáng; nổ hào quang ngũ sắc khi lai tạo thành công giống đột biến. |
| `BM_SHRINE` | **⛩️ Đình Làng Cổ Kính (3 Cấp Trùng Tu)** | `192x160` | `Stage1_Ruined` \| `Stage2_Restored` \| `Stage3_GoldenBanner` (8f cờ bay) | Từ mái đình rêu phong hư hại (Bậc 1) $\rightarrow$ Khôi phục Sân đình & Thủy đình (Bậc 2) $\rightarrow$ Đại đình nguy nga cờ hội bay phần phật & Bia đá công đức (Bậc 3)! |
| `BM_DERBY` | **🐉 Thuyền Rồng / Ghe Ngo Hợp Tác Xã** | `128x48` | `Row_Normal` (8f, 10fps) \| `Drum_Sprint_x2` (8f, 16fps) | Đầu rồng uy nghiêm, 6 tay chèo vung mái dầm đều tăm tắp rẽ sóng nước trắng xóa trên sông Đình Làng. |
| `NEW_NIGHT` | **🏮 Quầy Ẩm Thực Chợ Đêm Cuối Tuần** | `96x80` | `Lantern_Sway_Cook` (8f, 10fps) | Treo đèn lồng Hội An lung linh, chảo gang xào nấu bốc lửa phục vụ thực khách dạo chợ đêm. |
| `BM_HOMESTAY`| **🏡 Đảo Du Lịch Homestay (2 Cấp)** | `160x128` | `Tourist_Relax_Tea` (8f, 8fps) | Nhà sàn tre bên đầm sen có võng mắc đung đưa và du khách thành phố ngồi thưởng trà chụp ảnh. |
| `NEW_HEIR` | **👶 Kiệu Hoa Đám Cưới & Tiểu Đồng (Con Cái)** | `48x48` | `Wedding_Parade` (8f) \| `Child_Run_Collect` (8f, 12fps) | Đám rước dâu nhộn nhịp và hình ảnh bé Tiểu Đồng buộc tóc trái đào chạy lon ton nhặt trứng/trái cây giúp bố mẹ! |

---

## PHẦN 5: DANH MỤC 30 HIỆU ỨNG VFX & 185+ UI ASSETS / ICONS (`32 x 32 px`)
* **30 Hiệu ứng VFX:** Đầy đủ VFX gặt lúa, tưới nước, nổ Hoàng Kim ⭐, khói bếp, chó rượt văng dép, thời tiết động (nắng xuyên tán tre, mưa rào, đom đóm đêm), hào quang SSR, và bổ sung **`VFX_MUTANT_RAINBOW` (Nổ hào quang lai tạo giống đột biến)** + **`VFX_TOTEM_BLESSING` (Luồng sáng vàng khi Ông Địa ban Quẻ Đại Cát)**.
* **185+ Icons `32x32 px`:** Toàn bộ 48 cây trồng, 19 vật nuôi, 19 thủy sản, 30+ món ăn/đồ bảo hộ thợ, 40+ món thời trang 12 Slots, các mảnh Cổ vật đáy ao, Quẻ xăm Ông Địa và 16 Sticker Nông Dân.
