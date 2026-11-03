---
name: vac-balance-check
description: "Kiểm cân bằng kinh tế VAC Online từ dữ liệu thật: lời/phút theo Đợt, thời gian lên cấp, loài lỗ hoặc lời bất thường, so với mục tiêu Sources/Sinks 94–112% của 02_MASTER_ECONOMY. Dùng trước khi đổi giá/thời gian/XP hoặc mở Đợt mới."
argument-hint: "[wave:<1-5> | item:<ID> | all]"
allowed-tools: Read, Grep, Glob, Bash(npx tsx *), Bash(node *)
---

# /vac-balance-check
Input: `GAME_CATALOG`, `src/domain/progression.ts`, `src/domain/farm.ts`, Sources/Sinks ở `02`, dữ liệu chơi thật (`npm run supabase -- report`). Thiếu input → **NOT ASSESSED — NO DATA**, không ước đoán.

1. **Tính:** script tạm `npx tsx` trong scratchpad (không commit) import catalog + domain. Mỗi loài: `lãi/mẻ = baseSellGold × yieldCount − buyCostGold` (nhiều lứa: nhân số lứa), `lãi/phút` (buff miền: Bắc −10% thời gian CROP, Nam +1 AQUA), `XP/phút`, thời gian lên cấp khi trồng loài tốt nhất đang mở (`xpToNext`).
2. **Bất thường:** lãi ≤ 0; lãi/phút > 3× trung vị cùng Đợt; loài cấp cao kém cấp thấp; thời gian lên cấp nhảy vọt; Đợt sau kém Đợt trước.
3. **So `02`:** thu nhập/ngày, trần Hyper-Casual 1.500 🏮/ngày, Sources/Sinks 94–112%.

Báo cáo: bảng theo Đợt (min/trung vị/max lãi/phút, loài bất thường), thời gian lên Lv 3/8/15, đề xuất. **Không tự sửa số** — PO duyệt rồi `/vac-propagate-change`. Agent: `vac-economy`.
