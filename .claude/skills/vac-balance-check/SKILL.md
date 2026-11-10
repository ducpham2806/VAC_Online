---
name: vac-balance-check
description: "Kiểm cân bằng kinh tế VAC Online từ dữ liệu thật: lời/phút theo Đợt, thời gian lên cấp, loài lỗ hoặc lời bất thường, so với mục tiêu Sources/Sinks 94–112% của 02_MASTER_ECONOMY. Dùng trước khi đổi giá/thời gian/XP hoặc mở Đợt mới."
argument-hint: "[wave:<1-5> | item:<ID> | all]"
allowed-tools: Read, Grep, Glob, Bash(npx tsx *), Bash(node *)
---

# /vac-balance-check (chuyển thể từ CCGS `balance-check`)

## Thiếu dữ liệu thì dừng (nguyên tắc NOT ASSESSED của CCGS)
Liệt kê input: `GAME_CATALOG`, `src/domain/progression.ts`, `src/domain/farm.ts`, mục tiêu Sources/Sinks `docs/03_KINH_TE.md` KT-55, và **dữ liệu chơi thật** (chưa có analytics cho tới S3).
Phần nào thiếu input thì ghi **NOT ASSESSED — NO DATA**. Không ước đoán; báo "đạt" khi không có dữ liệu là lỗi.

## Bước 1 — Tính từ dữ liệu
Viết script tạm (`npx tsx` trong scratchpad, **không** commit) import `GAME_CATALOG` và hàm domain. Với mỗi loài trồng/nuôi trong phạm vi:
- `lãi/mẻ = baseSellGold × yieldCount − buyCostGold`
- `lãi/phút = lãi/mẻ ÷ growMs` (tính cả buff miền: Bắc −10% CROP, Nam +1 AQUA).
- `XP/phút`, và **thời gian lên cấp** khi chỉ trồng loài tốt nhất đang mở (dùng `xpToNext`).

## Bước 2 — Tìm bất thường
- Lãi âm hoặc bằng 0.
- Lãi/phút cao gấp hơn 3 lần trung vị cùng Đợt (sẽ thành chiến lược duy nhất).
- Loài cấp cao kém loài cấp thấp.
- Thời gian lên cấp nhảy vọt giữa 2 cấp liền nhau.
- Đợt sau kém Đợt trước.

## Bước 3 — So với thiết kế
Đối chiếu mục tiêu trong `docs/03_KINH_TE.md`: thu nhập/ngày, trần 1.500🪙/ngày cho hyper-casual, Sources/Sinks 94–112%. Chưa có số người chơi thật thì phần "thực tế" ghi NOT ASSESSED.

## Báo cáo
Bảng theo Đợt (min / trung vị / max lãi/phút, loài bất thường), thời gian lên các mốc Lv 3/8/15, kèm danh sách đề xuất.
**Không tự sửa số.** Đổi kinh tế cần PO duyệt (RULE D1), sau đó làm tiếp bằng `/vac-propagate-change`. Agent: `vac-economy`.
