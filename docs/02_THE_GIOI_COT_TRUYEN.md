# 02 · Thế giới & cốt truyện

**Sở hữu:** bối cảnh, 3 miền, nhân vật, 10 Chương Gia Phả, cảnh mở đầu, lịch lễ hội.
**Không chứa:** luật hệ thống (`01`), phần thưởng bằng số (dữ liệu: `src/data/quests.ts`; công thức: `03`).

### TG-01 · Bối cảnh
- **Mở đầu:** người chơi bỏ phố về quê, nhận chiếc tráp gỗ lim của Ông Nội. Trong tráp có:
  - **Sổ Gia Phả Nông Nghiệp Ba Miền**, mất 8 trang (chỉ còn trang 1–2);
  - **tờ khế ước** thế chấp đất 50.000🪙 của Thương Nhân Bá Kiến.
- **Mục tiêu:** tìm lại 10 trang Gia Phả. Mỗi trang là một chương; mỗi chương mở thêm loài, công trình và người trong làng.
- **Giọng kể:** hoài niệm làng quê 8x–9x, ca dao, ẩm thực, ấm áp và hơi hài.

### TG-10 · Ba miền
| Miền | Cảnh quan | Giọng | Thưởng (KT-50) | Đặc sản tiêu biểu theo Đợt |
|---|---|---|---|---|
| **Bắc** (bản chơi thử, QD-21) | Nhà ngói đỏ 3 gian, cổng làng rêu, cây đa, giếng đá ong, đồi chè, ao sen | Ấm, chậm, hay dùng ca dao thời tiết | Cây ngắn ngày nhanh hơn | Đợt 1: Cải cúc & Su hào. Đợt 2: Chè Thái, Gà Đông Tảo. Đợt 3: Vải thiều, Nhãn lồng, Cá trắm đen. Đợt 4: Bưởi Diễn, Lợn bản, Cá anh vũ. Đợt 5: Rươi Tứ Kỳ |
| **Trung – Tây Nguyên** | Nhà rường, nhà sàn đất đỏ bazan, đèn lồng, rặng dừa biển | "Răng, rứa, mô, tê" | Xưởng nhanh hơn | Tỏi Lý Sơn, Thanh long, Dê Ninh Thuận, Nho, Hồ tiêu, Cà phê BMT, Hươu sao, Tôm hùm Phú Yên |
| **Nam** | Nhà ba gian ven kênh, cầu khỉ, xuồng ba lá, đầm sen Đồng Tháp | "Nghen, dữ thần, hết sảy" | Thủy sản thêm sản lượng | Bông điên điển, Khóm, Vịt chạy đồng, Măng cụt, Sầu riêng Ri6, Nhà yến, Cua Cà Mau |

ID chính xác của từng đặc sản: dữ liệu (`CROP_N/C/S..`, `ANI_N/C/S..`, `AQUA_N/C/S..`).

### TG-20 · Nhân vật
**NPC trong làng** (có tim, GP-50; sở thích ghi trong dữ liệu NPC khi làm P1):
| NPC | Vai | Tính cách, giọng | Ứng viên cưới |
|---|---|---|---|
| Bác Trưởng Thôn Bảy | Dẫn đường, bạn của Ông Nội | Giọng Bắc ấm, chậm, đọc ca dao: "Nắng tốt dưa, mưa tốt lúa, ra đồng thôi cháu ơi!" | Không |
| Thương Nhân Bá Kiến | Chủ nợ, phản diện được cảm hóa | Lạnh lùng, quy mọi thứ ra tiền, "Hừm…"; từng trắng tay vì bão lụt, nhớ vị cá kho của mẹ | Không |
| Cô Giáo Hương | Trường làng, đặt đơn bữa trưa cho học trò | Trong trẻo, dịu dàng | Có |
| Cô Ba Tiệm May | Tơ lụa, thời trang | Tinh tế, hay khen | Có |
| Cụ Đồ Vũ Bằng | Thực Khách Bí Ẩn | Uyên bác, mở lời bằng 2 câu thơ đố | Không |
| Út Nhỏ Miền Tây | Cô bé bán sầu riêng trên ghe (Ch.5) | Giọng Nam, "nghen" | Không (trẻ em) |
| Ứng viên nam (thêm ở P1) | 2 người: thợ mộc trẻ, kỹ sư nông nghiệp về quê | Chờ viết | Có |

**Thợ** (Lán Thợ, GP-33):
| Thợ | Việc | Tính cách |
|---|---|---|
| Chú Tư Cày `WORK_01` | Vườn | Chất phác, câu ngắn: "Đất có công, cây không phụ lòng người!" |
| Cô Năm Thảo `WORK_02` | Chuồng | Thương vật nuôi như con, giọng Trung |
| Anh Sáu Kình `WORK_03` | Ao, vét bùn | Hào sảng miệt vườn |
| Dì Bảy Bếp `WORK_04` | Bếp | Chu đáo, hay giục ăn |
| Chú Tám Mộc `WORK_05` | Cây lâu năm, chiết cành | Điềm đạm, kiệm lời |
| Ông Quản Gia Cửu `WORK_06` | Tổng quản | Lễ độ, báo cáo kèm số liệu |

**Thú cưng:** Chó Xoáy Phú Quốc (giữ nhà, đi theo Bác Bảy ở cảnh mở đầu), Mèo Tam Thể, Ngỗng, Trâu Đen, Chim Sáo.

### TG-30 · Mười Chương Gia Phả (QD-10, QD-28)
- Mục tiêu đo được, cấp mở và thưởng của từng chương ở `src/data/quests.ts` (nguồn chuẩn). Bảng dưới chỉ có tên và nội dung.
- Mỗi chương có một lựa chọn: **tình nghĩa** (Phong Thủy, Nghĩa Xóm) hoặc **thực dụng** (vàng).
- Thứ tự chơi khác số chương, vì chương được gắn theo Đợt phát hành.

| Thứ tự chơi | Ch. | Tên | Đợt | Nội dung chính |
|---|---|---|---|---|
| 1 | 1 | Bức Thư Trong Chiếc Tráp Gỗ Lim | 1 | Từ chối bán đất cho Bá Kiến; tưới và gặt vụ lúa đầu |
| 2 | 2 | Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao | 1 | Vét bùn, bón bùn, mẻ Hoàng Kim đầu tiên |
| 3 | 3 | Chuyến Xe HTX & Đêm Mưa Giông | 2 | Xây Bếp Củi, nấu món đầu; dựng giàn sau giông |
| 4 | 6 | Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư | 2 | Thuê Chú Tư, dọn mâm cơm cho thợ |
| 5 | 7 | Bí Truyền Khung Cửi Lụa & Áo Mới | 2 | Làm đồ thợ (Nón lá hoặc Áo cánh nâu) |
| 6 | 4 | Bóng Đêm Rình Rập & Chó Phú Quốc | 3 | Thăm hàng xóm, Sổ Lưu Bút, giữ vườn |
| 7 | 5 | Tiếng Còi Tàu Thống Nhất Bắc – Nam | 3 | Đóng toa tàu, đăng bán ở Chợ phiên |
| 8 | 8 | Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ | 4 | Thám hiểm rừng trúc, Kỷ Vật, chiết cành đột biến |
| 9 | 9 | Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến | 4 | Nấu Cá Kho Vũ Đại, sửa Đình Làng; Bá Kiến đốt khế ước |
| 10 | 10 | Trầu Cau Nên Duyên & Gia Bảo Truyền Đời | 5 | Cưới, Homestay, nồi Bánh Chưng, Bằng khen |

**Lỗi cần sửa khi làm lại dữ liệu nhiệm vụ:**
- Ch.7 cần Kén Tằm nhưng Tằm lại mở *bằng* Ch.7. Hiện có đường thoát qua Nón lá; khi làm lại nên mở Tằm ở Ch.6.
- Ch.4–5 dựa vào tính năng nhiều miền; bản 1 miền cần mục tiêu thay thế (QD-28).

### TG-40 · Cảnh mở đầu "Bức Thư Trong Chiếc Tráp Gỗ Lim"
1. **Chiều cuối Thu.** Cổng làng rêu phong; nhà ngói đổ nát bên giếng đá ong. Bác Bảy cùng Chó Xoáy trao tráp: Sổ Gia Phả, một túi hạt Lúa tổ tiên, tờ khế ước.
2. **Bá Kiến đến** ép bán đứt đất với giá 2.000🪙 để chia lô.
3. **Người chơi chọn:**
   - "Tự cày trả sạch nợ" (tình nghĩa: +Phong Thủy, +Nghĩa Xóm);
   - "Mười mùa vụ nữa ông sẽ mua lúa Hoàng Kim của tôi" (thực dụng: +vàng).
4. **Vào game:** hướng dẫn tân thủ bắt đầu (GP-62). Mùa trong cảnh là Thu, còn game bắt đầu ở mùa đang chạy trên server.

### TG-50 · Lịch lễ hội theo mùa (GP-70)
| Mùa | Lễ hội | Hoạt động | Từ Đợt |
|---|---|---|---|
| Xuân | Tết Nguyên Đán (nối từ cuối Đông) | Canh nồi Bánh Chưng (GP-71), lì xì, chợ hoa | 5 |
| Xuân | Hội Làng mùa xuân | Trò dân gian ở Đình, trưng bày nông sản đẹp nhất | 2 |
| Hạ | Tết Đoan Ngọ | Đua Thuyền Rồng (trò bấm nhịp), Đua Trâu Vàng & Vịt Chạy Đồng (thú cưng) | 4 |
| Thu | Trung Thu – Đêm Hội Trăng Rằm | Nướng bánh Trung Thu (hạt sen, đậu xanh, trứng vịt), rước đèn ông sao, tặng NPC tăng tim gấp đôi | 2 |
| Thu | Lễ Cơm Mới | Dâng nông sản vụ mùa; HTX nhận đơn giá cao | 1 |
| Đông | Chợ Đêm cuối năm | Chợ cuối tuần giá ×1,8, miễn thuế (số liệu chốt ở `03` khi làm) | 3 |

Ngày cụ thể trong mùa và phần thưởng: chốt khi làm từng Đợt, ghi ở dữ liệu sự kiện.
