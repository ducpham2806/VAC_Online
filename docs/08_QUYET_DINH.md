# 08 · Sổ quyết định

**Sở hữu:** mọi quyết định của PO và câu hỏi đang chờ. **Không chứa:** lý do dài dòng (dẫn link), luật chi tiết (ở file sở hữu luật).
Quy tắc: mỗi quyết định có mã `QD-nn`, không xóa, không sửa nghĩa. Đổi ý → thêm mã mới ghi "thay QD-xx" và gạch mã cũ. Tài liệu khác dẫn mã này thay vì chép lại.

## Đang chờ PO
| Mã | Câu hỏi | Chặn | Đề xuất của AI |
|---|---|---|---|
| QD-84 | P1-11: chọn 2 NPC có tim, số điểm tim, thưởng Chương 1, thứ tự hướng dẫn 15 phút đầu | P1-11 | NPC: Bác Bảy + Cô Giáo Hương (Bá Kiến chỉ xuất hiện ở cảnh mở đầu, chưa có tim). Tim 0–10, 100 điểm/tim; nói chuyện +20 (1 lần/ngày/NPC), quà thường +30, quà thích +80, quà ghét −20 (1 quà/ngày/NPC); mốc 2 tim mở 1 cảnh ngắn. Chương 1: chọn tình nghĩa/thực dụng ở cảnh mở đầu (TG-40), thưởng giữ số đang có trong `src/data/quests.ts` (600🪙 + 15💎 + 100 XP + nhánh) trả khi đủ: tưới, gặt lúa, sửa Nhà. Hướng dẫn 8 bước: đi → gieo → tưới → gặt → bán HTX → dọn đá → sửa Giếng → sửa Nhà mở Sổ Gia Phả. Chi tiết trong WORKLOG 10/11 |

## Đã quyết
| Mã | Ngày | Quyết định | Áp vào |
|---|---|---|---|
| QD-01 | 01/11 | Thu hoạch vào Kho, bán ở HTX; bắt đầu Lv.1; vòng chơi tính trên server | `01` GP-10, `04` |
| QD-02 | 01/11 | Thuế Chợ P2P 5%, giá đăng 0,8–2,0× giá gốc | `03` KT-31 |
| QD-03 | 01/11 | Bảo hiểm trộm 80% (trộm tối đa 20%/ô) | `03` KT-32 |
| QD-04 | 01/11 | PK tốn `-5⚡`/trận; Máy Thùng và đi dạo Sảnh `0⚡` | `03` KT-20 |
| QD-05 | 01/11 | ~~Khai hoang thật lưới 5×5~~ (thay bằng QD-27); kiểm mục tiêu nhiệm vụ trên server | `01` GP-14 |
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
| QD-18 | 10/11 | PO duyệt toàn bộ mục "(đề xuất)" trong `docs/00 → 08` bản 10/11 (mùa chung server 7 ngày, kéo làm loạt 12 ô, vuốt ve vật nuôi, Phong Thủy có mốc thưởng, bật/tắt hái trộm, khai hoang `500 × 1,25^k`, không bán ⚡ / bỏ qua chờ trong 1.0, 2 ứng viên cưới nam…) | `01`, `02`, `03` |
| QD-19 | 10/11 | Bản 1.0 ưu tiên cộng đồng; kiếm tiền chỉ bằng đồ trang trí, sau soft launch | `03` KT-60, `07` LT-04 |
| QD-20 | 10/11 | Build lại phần nền: ~~DB mới (DB cũ giữ nguyên)~~ (phần DB thay bằng QD-81), một bản luật TS chạy trên Edge Function | `04` KY-10 |
| QD-21 | 10/11 | Miền cho bản chơi thử: Bắc Bộ | `01` GP-60 |
| QD-22 | 10/11 | Cả game dùng chung 4 mùa vụ; Nam và Trung chỉ khác tên gọi và thời tiết | `01` GP-21 |
| QD-23 | 10/11 | Trần Hyper-Casual và số người/phòng Sảnh: quyết khi làm GĐ6 | `03` KT-40, `04` KY-60 |
| QD-24 | 10/11 | Đình Làng: mốc cá nhân, không hệ thống hội | `01` GP-70 |
| QD-25 | 10/11 | Cưới khi đạt 10 tim | `01` GP-52 |
| QD-26 | 10/11 | Nồi Bánh Chưng 6h, tối đa 5 bạn tiếp củi | `01` GP-71 |
| QD-27 | 10/11 | Bản đồ tile 32×32, mỗi ô trồng 1 cây, khai hoang bằng dọn chướng ngại (thay QD-05) | `01` GP-11, GP-14; `05` AR-20 |
| QD-28 | 10/11 | Cấp mở chương theo `src/data/quests.ts`; Ch.5 bản 1 miền dùng tàu + chợ thay Thương Đội | `02` TG-30 |
| QD-29 | 10/11 | Cây lâu năm trồng quanh năm, ra quả theo mùa, không cần dọn gốc | `01` GP-20 |
| QD-30 | 10/11 | Poster cũ: nếu đã đăng thì viết bài cập nhật lộ trình | Truyền thông |
| QD-31 | 10/11 | Số món ăn theo dữ liệu từng Đợt; giữ đường cong XP `round(60 × L^1.5)`, Lv.60 (xem lại khi có số beta) | `03` KT-10 |
| QD-32 | 10/11 | Kiểm pháp lý trước khi bật bất kỳ thanh toán nào | `03` KT-60 |
| QD-33 | 10/11 | PO không cấp API key ảnh; P0-2 làm mẫu bằng code + prompt cho PO tự tạo (thay đề xuất "cấp key") | `07` LT-10 |
| QD-80 | 10/11 | Ảnh thật: PO tự tạo bằng ChatGPT/Gemini theo `art/prompts/`, AI hậu kỳ (`tools/art/import_sheet.py`). 5 tấm mẫu P0-2 đã nhập | `05` AR-50 |
| QD-81 | 10/11 | Thay QD-20 (phần DB): không tạo project mới, dùng project Supabase cũ của MVP. Dữ liệu MVP bỏ được; được viết lại schema **một lần** khi chuyển sang ADR-002, sau đó lại additive-only | `04` KY-31 |
| QD-82 | 10/11 | Vật nuôi nhỏ thu hình về ~40×40 trong khung 48×48; cây không mang ụ bùn riêng (ô đất đã có đất). Đã áp bằng `import_sheet.py` (`fit`, `strip_soil`) | `05` AR-20, AR-50 |
| QD-83 | 10/11 | Số liệu P1-10 theo đề xuất: vật liệu `MAT_GO`/`MAT_DA` chỉ từ dọn chướng ngại, hữu hạn trong bản thử; dọn đá 2⚡ → 3 Đá, gốc cây 4⚡ → 5 Gỗ; sửa Giếng / Chuồng gà / Nhà; Giếng mở tưới cả loạt; khai hoang theo vùng `500 × 1,25^k` | `03` KT-15, KT-18, KT-20; `01` GP-14 |
