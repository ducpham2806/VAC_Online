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
- **Đơn hàng HTX** (GP-40, QD-87): bảng luôn có 3 đơn; mỗi đơn đòi 1–3 loại hàng đã mở và đúng mùa.
  - Số lượng mỗi dòng: nông sản 3–6, trứng/cá 1–3, món ăn 1.
  - Hệ số đơn `k` theo số loại: 1 loại 1,2 · 2 loại 1,35 · 3 loại 1,5.
  - Thưởng vàng = `round(Σ(giá bán × sl) × k)`; XP = `round(Σ(XP loài × sl) × k)`. Ví dụ: 3 Lúa (giá 4, XP 1) → 14🪙 + 4 XP. Giao đơn 0⚡.
  - Giao xong: chỗ đó có đơn mới ngay. Bỏ đơn: chỗ đó trống 10 phút rồi mới có đơn mới.
  - Code: `src/domain/orders.ts` (`ORDER_SLOTS`, `ORDER_FACTOR`, `ORDER_QTY`, `ORDER_SKIP_COOLDOWN_MS`).

### KT-15 · Khai hoang
- **Khai hoang theo vùng** (QD-18, QD-83): vùng thứ k (k = số vùng đã khai, từ 0) giá `500 × 1,25^k` 🪙 + 5⚡; nhận +45 XP và +25 Phong Thủy; cả vùng thành ô ruộng trống. Ví dụ: vùng 1 = 500🪙, vùng 2 = 625🪙.
- Vùng mở theo thứ tự cố định (GP-14). Bản thử: vùng 1 = 8 ô, vùng 2 = 14 ô.
- Code: `src/domain/estate.ts` (`reclaimCost`, `RECLAIM_REGIONS`, dùng `EXPAND_*` của `farm.ts`).
- MVP cũ (giá phẳng 500 mỗi ô, lưới 5×5): `farm.ts` `expandFarm`, `farmGrid.ts`.

### KT-18 · Vật liệu và sửa hạng mục (QD-83)
- **Vật liệu:** `MAT_GO` (Gỗ), `MAT_DA` (Đá). Chỉ có từ dọn chướng ngại, không bán ở HTX. Bản thử: chướng ngại không mọc lại.
- **Dọn chướng ngại:** tảng đá −2⚡ → +3 Đá; gốc cây −4⚡ → +5 Gỗ. Dọn xong ô thành đất đi được.
- **Sửa hạng mục bậc 1:**

| Hạng mục | Chi phí | Phong Thủy | Mở |
|---|---|---|---|
| Giếng | 300🪙 + 4 Đá | +20 | Tưới cả loạt khi kéo (chưa sửa: mỗi lượt tưới 1 ô) |
| Chuồng gà | 400🪙 + 6 Gỗ | +30 | Nuôi gà (P1-9) |
| Nhà chính | 500🪙 + 6 Gỗ + 2 Đá | +40 | Gia Phả Chương 1 (P1-11) |
| Bếp Củi (QD-87) | giá xây `MAC_02` trong dữ liệu (350🪙) + 2 Gỗ + 2 Đá; từ cấp 3 (KT-21) | 0 | Nấu món, Nồi Đất (KT-30) |

- Tổng sửa đủ 4 hạng mục: 1.550🪙 + 14 Gỗ + 8 Đá; bản đồ bản thử cho 15 Gỗ + 9 Đá.
- Code: `src/domain/estate.ts` (`CLEAR_RULES`, `REPAIRS`), khóa tưới ở `src/engine/applyActions.ts` (`WELL_LOCKED_WATER_PER_BATCH`).

### KT-19 · Tim NPC (QD-84)
- **Thang:** 0–10 tim, mỗi tim 100 điểm (`HEART_POINTS`).
- **Nói chuyện:** +20, có tác dụng 1 lần mỗi ngày mỗi NPC (ngày theo giờ Việt Nam).
- **Tặng quà:** 1 món trong Kho, có tác dụng 1 lần mỗi ngày mỗi NPC: thích +80, thường +30, ghét −20 (không dưới 0). Món tặng bị trừ khỏi Kho.
- **Mốc 2 tim:** mở 1 cảnh ngắn (bản thử).
- **Thưởng Chương 1** (dữ liệu `src/data/quests.ts`): 600🪙 + 15💎 + 100 XP, cộng nhánh tình nghĩa (+30 Phong Thủy, +3 Nghĩa Xóm) hoặc thực dụng (+350🪙, +10 Phong Thủy, +1 Nghĩa Xóm).
- Code: `src/domain/npc.ts`, `src/domain/story.ts`; sở thích ở `src/data/npcs.ts`.

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
- **Tốn ⚡ (việc nặng):** vét bùn 3, khai hoang 5, dọn đá 2 / gốc cây 4 (KT-18), câu cá 1/lần (mới), đi rừng 6, PK 5/trận (QD-04, sau 1.0).
- Không bán ⚡ bằng ngọc trong 1.0 (QD-18; thiết kế cũ: 10/15/25/40💎, tối đa 5 lần/ngày).

### KT-30 · Xưởng và bếp
Thời gian, nguyên liệu và giá thành phẩm lấy từ dữ liệu (`machineId`, `recipe`). Khám phá công thức ở Nồi Đất được +10💎 và +50 XP (`cooking.ts`). Mỗi xưởng nấu 1 mẻ một lúc, có hàng chờ (GP-30).

### KT-21 · Nội dung bản thử P1 (QD-86, QD-87)
- **Loài:** 8 loài Đợt 1, giá/thời gian/sản lượng/XP giữ nguyên dữ liệu. Danh sách: `src/data/sliceContent.ts`.
- **Cấp mở riêng bản thử** (dữ liệu gốc không đổi): Gà 2, Cá Rô 3, Hành 3, Cải 3, Bếp Củi và Cơm 3, Canh Cải Cá Rô 4, Vịt 5. Lúa 1, Rau Muống 2, Ngô 2 theo dữ liệu. Ước tính: buổi đầu ~30–40 phút lên cấp 3; tới cấp 5 cần ~3 giờ chơi.
- **Chỗ nuôi:** 4 chỗ gà (mở khi sửa Chuồng gà), 2 chỗ vịt, 3 chỗ cá ở ao. Mỗi chỗ chỉ nuôi đúng loài của nó; số lứa theo KT-13.
- **Cho ăn:** bản thử chưa có (mua con giống là đủ lứa); cho ăn + Cối Xay Cám ở P2. Lý do: cho ăn bằng nông sản theo dữ liệu làm gà lỗ (5 lứa bán 70🪙, tốn 40🪙 cám + 40🪙 con giống).
- **Bếp:** mở ở Giai đoạn 1 cho bản thử, chỉ 2 món (Cơm Trắng biết sẵn, Canh Cải Cá Rô tìm ở Nồi Đất).
- Code: `src/data/sliceContent.ts` (`SLICE_UNLOCK_LEVEL`, `ANIMAL_SLOTS`), engine `ctx.slice` (`src/engine/applyActions.ts`).

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
