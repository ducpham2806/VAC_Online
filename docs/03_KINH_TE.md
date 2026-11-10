# 03 · Kinh tế

**Sở hữu:** tiền tệ, mọi công thức và hằng số chung, van chống lạm phát, mục tiêu Sources/Sinks, chính sách kiếm tiền.
**Không chứa:** thông số từng thực thể (giá, thời gian, sản lượng, XP, Đợt) — các số đó ở dữ liệu (`data/catalog.csv` → `GAME_CATALOG`, `04` KY-20). Luật chơi bằng chữ ở `01`.

Cột "Nơi ở trong code" cho biết hằng số đang nằm ở đâu. Đổi số phải sửa đúng chỗ đó và SQL tương ứng (`/vac-propagate-change`), rồi chạy `/vac-balance-check`. Cần PO duyệt (`AGENTS.md` RULE D1).

### KT-01 · Tiền tệ
| Tiền | Vai trò | Luật |
|---|---|---|
| 🪙 Vàng | Tiền mềm: bán nông sản, mua giống, xây, lương | Người mới có 2.500 (`initialState.ts`) |
| 💎 Ngọc | Tiền cứng (neo 1.000đ = 5💎) | Đổi ngọc → vàng: `min(400, 35 + 12 × Lv)` vàng/💎 (chưa code). **Cấm** đổi vàng → ngọc. Khám phá công thức +10💎 |
| 🏮 Xu Hội Làng | Phần thưởng lễ hội / Sảnh (sau 1.0) | Chỉ đổi đồ trang trí, danh hiệu. Trần ở KT-40 |
| ⚡ Thể lực | Giới hạn việc nặng | KT-20 |

### KT-10 · Cấp độ và XP
`xpToNext(L) = round(60 × L^1.5)`, L = cấp hiện tại, cấp tối đa 60. Ví dụ: lên Lv.2 cần 60 XP; tổng tới Lv.9 là 5.044 XP. Code: `src/domain/progression.ts` + SQL `_xp_to_next`. Chờ duyệt lại: QD-31.

### KT-11 · Thời gian lớn, tưới, sản lượng
- **Thời gian chín:** `growMs = max(1, phút) × 60.000 × f`, với phút lấy từ dữ liệu thực thể. `f` là hệ số miền (KT-50), mặc định 1.
- **Tưới:** cắt 15% thời gian còn lại (`WATER_TIME_CUT = 0,15`). Mưa cũng tính là đã tưới (GP-21).
- **Sản lượng:** `qty = yieldCount × (Hoàng Kim ? 3 : 1) + thưởng miền`. `yieldCount` lấy từ dữ liệu, mặc định 2.
- Code: `src/domain/farm.ts`, SQL `_grow_ms`.

### KT-12 · Bùn phù sa và Hoàng Kim
- **Vét bùn ao:** −3⚡, +3 Bùn, +20 XP. Mỗi ao chứa tối đa 10 bùn.
- **Bón bùn:** 1 Bùn làm ô chín ngay, với 45% thành Hoàng Kim (×3 sản lượng).
- Code: `DREDGE_*`, `MAX_POND_MUD`, `GOLDEN_CHANCE` trong `farm.ts`.
- Lưu ý cân bằng: đây là nguồn lời mạnh nhất hiện nay, đang chờ đo lại ở P2.

### KT-13 · Vật nuôi và thủy sản nhiều lứa
- **Số lứa:** `N = max(2, ceil(1,5 × giá giống ÷ (giá bán × yieldCount)))`; cây trồng N = 1.
- Ví dụ: Gà 5 lứa, Cá Rô 3, Heo 9, Bò Sữa 15.
- Code: `LIVESTOCK_RETURN = 1,5`, `MIN_LIVESTOCK_CYCLES = 2` trong `farm.ts`; SQL `0010`.

### KT-14 · Bán ở HTX và đơn hàng
- **Bán thẳng HTX:** vàng = `giá bán × qty`, không thuế.
- **Đơn hàng HTX** (GP-40): thưởng = `Σ(giá bán × sl) × hệ số đơn`. Hệ số đơn 1,2–1,5 cộng XP (chưa code, chốt ở P1). Đơn chỉ đòi hàng thuộc Đợt đã mở và đúng mùa.

### KT-15 · Khai hoang
- **Chi phí mỗi ô:** 500🪙 + 5⚡; nhận +45 XP và +25 Phong Thủy.
- **Lưới:** nền 12 ô, tối đa 25 ô (lưới 5×5).
- Code: `EXPAND_*` trong `farm.ts`, `farmGrid.ts`.
- Bản làm lại (QD-18): giá tăng dần `500 × 1,25^k`, k = số vùng đã khai (bản cũ giá phẳng 500).

### KT-16 · Thao tác hàng loạt
Kéo để làm cả loạt (GP-02): tối đa 12 ô mỗi lượt kéo, mỗi ô vẫn tính đúng luật như khi chạm từng ô (chi phí giống, Kho đầy thì dừng).

### KT-17 · Lịch mùa
- **Mốc:** thứ Hai 05/01/2026 00:00 giờ Việt Nam là ngày 1 mùa Xuân năm 1.
- **Độ dài:** mỗi mùa 7 ngày thật, một năm game 28 ngày.
- **Thứ tự:** Xuân → Hạ → Thu → Đông.
- Code: `src/domain/season.ts` (`SEASON_EPOCH_MS`, `SEASON_LENGTH_DAYS`). Mùa gieo của từng cây: cột `Seasons` trong dữ liệu.

### KT-20 · Thể lực ⚡ (QD-14)
- **Trần và hồi:** trần 50; hồi +1⚡/3 phút theo giờ thật (`STAMINA_REGEN_MS = 180.000`, SQL `0004`). Ăn món ăn để hồi thêm (`staminaDelta` trong dữ liệu).
- **Không tốn ⚡:** gieo, tưới, thu, cho ăn, nấu, giao đơn, nói chuyện với NPC.
- **Tốn ⚡ (việc nặng):** vét bùn 3, khai hoang 5, dọn đá/gốc cây 2–4 (mới, chốt ở P1), câu cá 1/lần (mới), đi rừng 6, PK 5/trận (QD-04, sau 1.0).
- Không bán ⚡ bằng ngọc trong 1.0 (QD-18; thiết kế cũ: 10/15/25/40💎, tối đa 5 lần/ngày).

### KT-30 · Xưởng và bếp
Thời gian, nguyên liệu và giá thành phẩm lấy từ dữ liệu (`machineId`, `recipe`). Khám phá công thức ở Nồi Đất được +10💎 và +50 XP (`cooking.ts`). Mỗi xưởng nấu 1 mẻ một lúc, có hàng chờ (GP-30).

### KT-31 · Chợ phiên P2P (QD-02)
- **Khung giá:** từ `max(1, floor(0,8 × giá gốc))` đến `2,0 × giá gốc`.
- **Tiền người bán nhận:** `floor(giá × sl × 0,95)`; 5% thuế bị đốt.
- **Thanh toán:** qua giữ tiền trung gian (escrow) trên server, người bán chỉ nhận khi có người mua.
- Code: `src/domain/market.ts`.

### KT-32 · Trộm và phòng thủ (QD-03, QD-06)
- **Bảo hiểm:** chủ vườn luôn giữ ≥ 80% mỗi ô; cửa sổ trộm 2 phút sau khi chín.
- **Bắt trộm:** Chó 50%, Ngỗng 40%; có cả hai thì gộp `1 − Π(1 − p)` = 70%.
- **Vàng rớt (thiết kế cũ):** 30–60🪙 trừ từ ví kẻ trộm.
- Code: `src/domain/social.ts`. Trộm có còn trong 1.0 hay không: GP-41.

### KT-35 · Thợ (QD-09, QD-10, QD-11)
- **Hợp đồng:** 3 ngày, trả trước `round(lương × 3 × 0,88)`. Ví dụ Chú Tư `WORK_01`: lương 200 → 528🪙/hợp đồng.
- **Độ No:** hao 60/75/90 mỗi ngày (thợ 1/2/3). Dưới 35 thì nghỉ làm; ăn tới 85; trần 100.
- **Bữa ăn:** 1 suất = 25 Độ No. Một món dọn ra được `max(1, round(staminaDelta ÷ 5))` suất.
- **Giỏ:** thợ thu ô đã chín ≥ 5 phút vào Giỏ (trần 120), không ra XP hay vàng.
- **Đồ thợ:** dùng 72h, Độ No hao ×0,75.
- **Phụ Cấp Ngày Mùa:** 300🪙 cho 24h, tưới cắt 25% thay vì 15%.
- Code: `src/domain/workers.ts`, SQL `0011`–`0014`. Thợ 3–6 chưa có số liệu theo luật mới.

### KT-40 · Trần thưởng ngoài nông trại
Sau 1.0 (GP-80): Hyper-Casual tối đa 1.500/ngày (đơn vị quyết ở GĐ6, QD-23); 🏮 100–250/ngày; thuế Sới Đình 10% zero-sum; tối đa 3 trận có thưởng mỗi cặp mỗi ngày.

### KT-45 · Van chống lạm phát
1. Chỉ đổi ngọc → vàng (có trần), cấm chiều ngược lại.
2. Chợ: khung giá + thuế đốt 5% + escrow (KT-31).
3. Trộm zero-sum + bảo hiểm 80% (KT-32).
4. Lán Thợ: lương, bữa ăn, đồ thợ, phụ cấp (KT-35).
5. Đổi hàng tồn lấy danh vọng/sưu tầm: lễ hội, khách bí ẩn, Thương Đội.
6. Đặc sản miền khác chỉ trồng được 3 vụ (khi mở miền thứ 2).
7. **Mùa vụ (mới, QD-14):** mỗi mùa chỉ một nhóm loài trồng được, nên không thể cày mãi một loài lời nhất.
8. Mở nội dung theo 5 Đợt; đơn hàng chỉ đòi hàng của Đợt đã mở.

Bỏ khỏi bộ van cũ: quỹ xổ số và cược PK (LT-04).

### KT-50 · Thưởng miền (khi có đủ 3 miền)
- **Bắc:** cây trồng ×0,9 thời gian (`NORTH_CROP_TIME_FACTOR`).
- **Trung:** xưởng ×0,9 thời gian (`CENTRAL_CRAFT_TIME_FACTOR`).
- **Nam:** thủy sản +1 sản lượng (`SOUTH_AQUA_BONUS`).
- **Bản chơi thử 1 miền:** tắt thưởng miền để số liệu đo được là số gốc.

### KT-55 · Mục tiêu Sources/Sinks
- **Mục tiêu:** tỉ lệ tiêu/thu mỗi ngày nằm trong 94–112%.
- **Bảng cũ đã bỏ:** bảng theo giai đoạn của bản cũ (GĐ2 thu 12.000–20.000🪙/ngày) không còn dùng được. Đo thật cho thấy thu nhập tối đa ~3.240🪙/ngày ở 12 ô Lúa (bằng chứng: `docs/archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md`, mục 02/11).
- **Mục tiêu mới:** lập ở P1 bằng script mô phỏng, chốt bằng số liệu closed beta (view `analytics_economy`, `npm run supabase -- report`).
- **Lỗi đã biết phải sửa khi cân bằng lại:**
  - đường lời ngược: Lúa Lv.1 lời nhất trên mỗi phút;
  - vật nuôi chỉ lời 0,1–0,4🪙/phút, thua cây trồng;
  - Bùn quá mạnh (KT-12);
  - lương thợ 3–6 quá cao.

### KT-60 · Kiếm tiền (QD-19, QD-32)
- **Bản 1.0 chỉ bán thứ không ảnh hưởng tiến trình:** đồ trang trí, thời trang `FASH_`, skin nhà, gói ủng hộ.
- **Không có** gacha, xổ số, cược vàng, hộp quà may rủi (LT-04).
- **Bỏ qua thời gian chờ bằng ngọc** (`ceil(0,8 × T^0,62)`, T = phút còn lại): không có trong 1.0 (QD-18), vì làm hỏng trụ cột mùa vụ (TQ-03).
- **Bốn gói nạp cũ** `IAP_01..04` (19k/79k/99k/149k, có ngọc, vàng, ⚡) được giữ trong dữ liệu như ý tưởng. Chúng bán tiến trình nên phải thiết kế lại trước khi bán. Đổi tên "Season Pass" để khỏi trùng khái niệm mùa vụ.
