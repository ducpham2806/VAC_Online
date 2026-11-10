# 00 · Tổng quan & bản đồ tài liệu — VAC Online (Hương Đồng Gió Nội)

**Sở hữu:** tầm nhìn, trụ cột, tham chiếu thể loại, bản đồ "thông tin nào nằm ở đâu", quy trình sửa tài liệu, thuật ngữ. **Không chứa:** luật chơi chi tiết, con số.
Bộ tài liệu này thay bộ `00 → 17` cũ (QD-16). Bản cũ nguyên văn: `docs_archive_merged/v1-2026-11-10/`, chỉ đọc khi truy vết.

## TQ-01 · Tầm nhìn
Game nông trại pixel ấm áp về làng quê Việt Nam, chơi trên web (PWA) màn ngang, sau đó lên app.
Người chơi bỏ phố về quê, dựng lại điền trang của ông nội theo mùa vụ, kết thân với dân làng và khôi phục 10 trang Gia Phả.
Nền là vòng **Vườn – Ao – Chuồng (VAC)** của 3 miền.

## TQ-02 · Tham chiếu thể loại (QD-12)
| Lấy từ | Lấy gì | Không lấy |
|---|---|---|
| Green Farm 3 | Điền trang cũ cần khôi phục từng hạng mục; chạm nhanh, kéo để thu cả loạt; xưởng chế biến xếp hàng chờ; bảng đơn hàng; thăm và giúp hàng xóm | Chờ đợi bị ép mua tăng tốc; hộp quà may rủi |
| Harvest Moon / Story of Seasons | Nhân vật đi lại dùng công cụ; 4 mùa quyết định cây trồng; tình cảm NPC bằng tim và quà; lễ hội theo lịch; tự do trong ngày | Ngày trong game ngắn ép chơi liên tục; cây chết khi quên tưới; thể lực cho mọi thao tác |

Chỉ tham khảo cơ chế. Tên, nhân vật, hình ảnh, âm nhạc của VAC đều là của riêng VAC, đặt trong bối cảnh Việt Nam.

## TQ-03 · Trụ cột (dùng để duyệt mọi tính năng)
1. **Mùa vụ Việt:** nhịp mùa, thời tiết và lễ hội Việt quyết định người chơi làm gì.
2. **Dựng lại điền trang:** tiến trình nhìn thấy được trên bản đồ (sửa nhà, giếng, chuồng, ao), gắn với chương Gia Phả.
3. **Làng có người:** NPC có tính cách, nhớ người chơi; hàng xóm giúp nhau, không phá nhau.
4. **Thư thả, không phạt:** không mất công sức vì vắng mặt; mỗi phiên 5–15 phút đều có việc đáng làm.

Tính năng không phục vụ ít nhất một trụ cột, hoặc làm hỏng trụ cột 4, thì không vào bản 1.0.

## TQ-04 · Bản đồ tài liệu — mỗi thông tin chỉ ở một nơi
| File | Sở hữu | Mã mục |
|---|---|---|
| [01_GAMEPLAY](01_GAMEPLAY.md) | Vòng chơi, điều khiển, thời gian/mùa, Vườn-Ao-Chuồng, xưởng/bếp, đơn hàng, điền trang, NPC/tim, xã hội, 3 miền, 5 Đợt (luật, không số) | `GP-nn` |
| [02_THE_GIOI_COT_TRUYEN](02_THE_GIOI_COT_TRUYEN.md) | Bối cảnh, 3 miền, nhân vật, 10 Chương Gia Phả, lịch lễ hội | `TG-nn` |
| [03_KINH_TE](03_KINH_TE.md) | Tiền tệ, công thức, hằng số, van chống lạm phát, Sources/Sinks, kiếm tiền | `KT-nn` |
| `data/catalog.csv` + `src/data/masterData.ts` | Thông số từng thực thể (giá, thời gian, XP, Đợt, mùa) | ID thực thể |
| [04_KY_THUAT](04_KY_THUAT.md) + `docs/adr/` | Kiến trúc, dữ liệu, DB, bảo mật, quy tắc code, kiểm thử, hiện trạng code; ADR ghi lý do chọn kiến trúc | `KY-nn`, `ADR-nnn` |
| [05_ART_AUDIO](05_ART_AUDIO.md) | Phong cách, palette, kích thước, hoạt ảnh, VFX, âm thanh, pipeline | `AR-nn` |
| [06_UI_UX](06_UI_UX.md) | Màn hình, luồng, HUD, điều khiển chạm, chuẩn giao diện | `UI-nn` |
| [07_LO_TRINH](07_LO_TRINH.md) | Pha phát triển, cổng kiểm chứng, nội dung mỗi Đợt theo pha, thẻ việc | `LT-nn` |
| [08_QUYET_DINH](08_QUYET_DINH.md) | Quyết định của PO và câu hỏi chờ | `QD-nn` |

File vận hành (không phải thiết kế): `AGENTS.md`, `VIEC_CAN_LAM.md` (việc cần làm), `docs/WORKFLOW.md`, `WORKLOG.md`, `COMPLETED.md`, `SESSION-HANDOFF.md`, `docs/studio/`.

## TQ-05 · Cách liên kết và sửa đổi (chống chồng chéo)
1. **Mã mục:** mỗi luật/công thức là một heading `### XX-nn · Tên`. Nơi khác chỉ dẫn mã (ví dụ "xem KT-20"), không chép nội dung. `npm run check:docs` báo khi dẫn tới mã không tồn tại hoặc trùng mã.
2. **Con số:** chỉ ở `03_KINH_TE` (hằng số chung) hoặc dữ liệu thực thể. `01` viết luật bằng chữ và dẫn mã `KT-`. Ngoại lệ là các mốc cố định của thiết kế (5 Đợt `23 → 45 → 63 → 76 → 81`, 4 mùa, 10 chương).
3. **Quy trình sửa:**
   - (a) tìm file sở hữu ở bảng TQ-04;
   - (b) chỉ sửa ở đó;
   - (c) nếu là quyết định của PO thì thêm `QD-nn` ở `08`;
   - (d) đổi số kinh tế thì chạy `/vac-balance-check`, đổi luật thì chạy `/vac-propagate-change` (code + SQL + test);
   - (e) chạy `npm run check:docs`.
4. **Thiết kế đích ≠ hiện trạng:** `01 → 06` mô tả đích. Code đang chạy khác gì thì ghi ở `04` KY-90.
5. **Mã đã dùng không đổi số.** Bỏ một mục thì để lại heading kèm "(bỏ — QD-nn)".

## TQ-06 · Thuật ngữ
- **VAC:** Vườn (cây trồng), Ao (thủy sản), Chuồng (vật nuôi).
- **Đợt:** gói nội dung mở theo chương/cấp, 5 Đợt.
- **Mùa vụ:** 4 mùa xoay theo tuần thật (GP-20).
- **⚡ Thể lực:** chỉ tốn cho việc nặng.
- **🪙 Vàng, 💎 Ngọc, 🏮 Xu Hội Làng:** tiền tệ (KT-01).
- **HTX:** Hợp tác xã, nơi bán nông sản và nhận đơn.
- **Gia nhân / thợ:** người làm thuê.
- **Điền trang:** khu nhà và đất của người chơi.
- **Tiền tố ID thực thể:** `CROP_` cây, `ANI_` vật nuôi, `AQUA_` thủy sản, `PROD_` món/sản phẩm, `MAC_` xưởng, `WORK_` thợ, `PET_` thú cưng, `FASH_` thời trang, `BM_` tính năng, `NEW_` mới, `CRAFT_` đồ nghề, `IAP_` gói nạp, `DEF_` phòng thủ, `TRAP_` bẫy, `MAT_` vật liệu (QD-83). **Không bao giờ đổi ID đã có** (`04` KY-31).
