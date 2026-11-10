# 08 · Sổ quyết định

**Sở hữu:** mọi quyết định của PO và câu hỏi đang chờ. **Không chứa:** lý do dài dòng (dẫn link), luật chi tiết (ở file sở hữu luật).
Quy tắc: mỗi quyết định có mã `QD-nn`, không xóa, không sửa nghĩa. Đổi ý → thêm mã mới ghi "thay QD-xx" và gạch mã cũ. Tài liệu khác dẫn mã này thay vì chép lại.

## Đang chờ PO
| Mã | Câu hỏi | Chặn | Đề xuất của AI |
|---|---|---|---|
| QD-90 | Mục tiêu bản 1.0: thương mại có doanh thu hay game cộng đồng? | `03` KT-60, `07` LT-04 | Cộng đồng trước, kiếm tiền bằng đồ trang trí sau soft launch |
| QD-91 | Nguồn ảnh: PO tự tạo bằng ChatGPT/Gemini hay cấp API key cho AI tạo hàng loạt? | `07` LT-10 (P0-2) | Cấp key cho 5 sprite mẫu trước, rồi mới quyết hàng loạt |
| QD-92 | Build lại phần nền (DB mới, một bản luật TS) hay sửa tại chỗ? | `04` KY-10, `07` | Build lại (lý do: `docs/REVIEW-2026-11-10.md`) |
| QD-93 | Miền cho bản chơi thử | `01` GP-60, `05` | Bắc Bộ: có đủ 4 mùa, khớp hệ mùa vụ |
| QD-94 | Lịch mùa cho miền Nam (2 mùa mưa/khô) và Trung (mùa bão) | `01` GP-21 | Cả game dùng chung 4 mùa vụ; mỗi miền đặt tên và thời tiết riêng |
| QD-95 | Trần thưởng Hyper-Casual 1.500/ngày tính bằng 🏮 hay 🪙 | `03` KT-40 | Không cần quyết trước GĐ6 |
| QD-96 | Sảnh Chung 25 hay 30 người/phòng | `01` GP-80 | Không cần quyết trước GĐ6 |
| QD-97 | Đình Làng: hội 20–30 người hay mốc cá nhân 5k/15k/50k | `01` GP-70 | Mốc cá nhân (không cần hệ thống guild) |
| QD-98 | Lễ cưới: 1.000 điểm thân mật hay 10 tim | `01` GP-52 | 10 tim, theo hệ tim NPC `GP-50` |
| QD-99 | Nồi Bánh Chưng: 12h cả làng hay 6h tối đa 5 bạn | `01` GP-71 | 6h, tối đa 5 bạn |
| QD-86 | Bản đồ tile 32×32: mỗi ô trồng 1 cây, khai hoang bằng dọn chướng ngại, thay lưới 5×5 khu 168×80 (thay QD-05) | `01` GP-11, GP-14; `05` AR-20 | Duyệt — khớp lối chơi đi bộ |
| QD-85 | Chương 4–5 ở bản 1 miền dùng mục tiêu gì thay Thương Đội 3 miền; cấp mở chương trong `quests.ts` (Ch.4 Lv.9, Ch.5 Lv.12, Ch.8 Lv.18, Ch.9 Lv.22) khác thiết kế cũ (16/18/21/23) | `02` TG-30 | Theo code; Ch.5 dùng tàu + chợ |
| QD-84 | Cây lâu năm trồng quanh năm, ra quả theo mùa (có cần dọn gốc sau N mùa như bản cũ `13`?) | `01` GP-20 | Ra quả theo mùa, không cần dọn gốc |
| QD-83 | Poster `09` (đã lưu trữ) có từng đăng công khai không? Poster hứa 81 loài + 4 mùa ở GĐ1, 6 thợ, PK 45s, iOS/Android | Truyền thông | Nếu đã đăng: viết bài cập nhật lộ trình |
| QD-89 | Số món ăn đích: 22 hay 27 | `03`, dữ liệu | Theo dữ liệu khi làm từng Đợt |
| QD-88 | Duyệt đường cong XP `round(60 × L^1.5)`, Lv tối đa 60 | `03` KT-10 | Giữ, xem lại khi có số liệu beta |
| QD-87 | Pháp lý: game online có thanh toán tại Việt Nam, cơ chế may rủi | `03` KT-60 | Kiểm trước khi bật thanh toán |

## Đã quyết
| Mã | Ngày | Quyết định | Áp vào |
|---|---|---|---|
| QD-01 | 01/11 | Thu hoạch vào Kho, bán ở HTX; bắt đầu Lv.1; vòng chơi tính trên server | `01` GP-10, `04` |
| QD-02 | 01/11 | Thuế Chợ P2P 5%, giá đăng 0,8–2,0× giá gốc | `03` KT-31 |
| QD-03 | 01/11 | Bảo hiểm trộm 80% (trộm tối đa 20%/ô) | `03` KT-32 |
| QD-04 | 01/11 | PK tốn `-5⚡`/trận; Máy Thùng và đi dạo Sảnh `0⚡` | `03` KT-20 |
| QD-05 | 01/11 | Khai hoang thật lưới 5×5; kiểm mục tiêu nhiệm vụ trên server | `01` GP-14 |
| QD-06 | 02/11 | Chó Phú Quốc bắt trộm 50%, Ngỗng 40%, cùng thức 70%; cửa sổ trộm 2 phút | `03` KT-32 |
| QD-07 | 02/11 | Bảng 64 màu `art/palette/vac_base.gpl` | `05` AR-10 |
| QD-08 | 02/11 | Bếp: Nồi Đất là khám phá công thức; giữ dữ liệu gốc và giá | `01` GP-30 |
| QD-09 | 03/11 | Thợ chỉ thu + tưới; lương 25% (Chú Tư Lv.13/200🪙, Cô Năm Lv.15/275🪙); vật nuôi + thủy sản nuôi nhiều lứa | `01` GP-33, `03` KT-35 |
| QD-10 | 03/11 | Đồ thợ dùng loài Đợt 2 có sẵn; đồ thợ 72h = Độ No hao chậm 25%; Chương 3 mở Lv.9 | `01` GP-33, `02` TG-30 |
| QD-11 | 03/11 | Giữ Phụ Cấp Ngày Mùa 300🪙 (24h, thợ tưới cắt 25%) | `03` KT-35 |
| QD-12 | 10/11 | Tham khảo thể loại: Green Farm 3 (khôi phục điền trang, xưởng, đơn hàng, hàng xóm) + Harvest Moon / Story of Seasons (đi lại bằng nhân vật, mùa vụ, quan hệ NPC, lễ hội) | `00` TQ-02 |
| QD-13 | 10/11 | Điều khiển lai: nhân vật đi trên bản đồ + chạm nhanh vào ô / chuồng / xưởng | `01` GP-02 |
| QD-14 | 10/11 | Thời gian lai: cây lớn theo giờ thật; 4 mùa xoay theo tuần thật, quyết định loài gieo được; ⚡ chỉ tốn cho việc nặng | `01` GP-20, GP-22 |
| QD-15 | 10/11 | Bản chơi thử và closed beta làm 1 miền trước; thiết kế đầy đủ giữ 3 miền | `01` GP-60, `07` |
| QD-16 | 10/11 | Lưu trữ bộ tài liệu `00 → 17` cũ, thay bằng bộ `docs/00 → 08` | `00` |
| QD-17 | 10/11 | Ưu tiên chỉnh tài liệu trước code | `07` |
