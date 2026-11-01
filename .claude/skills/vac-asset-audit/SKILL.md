---
name: vac-asset-audit
description: "Kiểm asset hình ảnh của VAC Online theo 05_MASTER_ART: không còn viền đen #000000, kích thước chuẩn (48x64 nhân vật, 168x80 ô đất, 32x32 icon), đúng palette, nền tách đúng. Dùng sau mỗi lô sprite từ agent-sprite-forge và trước khi đưa vào public/assets."
argument-hint: "[đường dẫn thư mục, mặc định public/assets]"
allowed-tools: Read, Glob, Bash(python3 tools/art/*), Bash(python3 -c *), Bash(ls *), Bash(find *)
---

# /vac-asset-audit (chuyển thể từ CCGS `asset-audit`)

## Bước 0 — Có asset chưa?
`find <thư mục> -name '*.png'`. Không có file nào thì kết luận **NOT ASSESSED — chưa có asset**; không báo "đạt" (nguyên tắc của CCGS).
Hiện tại game vẫn vẽ bằng code (`src/game/assets/PixelAssetGenerator.ts`), nên phần đó ghi là "không thuộc phạm vi audit file".

## Bước 1 — Viền
Mỗi PNG: `python3 tools/art/recolor_outline.py <file> --check`. File nào FAIL thì chạy `--out` để sửa, rồi kiểm lại.

## Bước 2 — Kích thước & nền
Dùng Pillow đọc kích thước. So với chuẩn theo loại:
- nhân vật 48×64
- ô đất 168×80
- icon 32×32
- sheet: bội số kích thước khung
Kiểm alpha: nền đã tách hết `#FF00FF` chưa (không còn pixel magenta).

## Bước 3 — Palette
So số màu với `art/palette/vac_base.gpl` (19 màu đã chốt). Bảng 64 màu **chưa chốt**, nên phần "đúng 64 màu" ghi NOT ASSESSED cho tới khi PO/Art chốt.

## Báo cáo
| File | Viền | Kích thước | Nền | Palette | Kết luận |
|---|---|---|---|---|---|

Kết luận tổng: **ĐẠT**, **CẦN SỬA (n file)** hoặc **NOT ASSESSED**. Agent: `vac-art-pipeline`.
