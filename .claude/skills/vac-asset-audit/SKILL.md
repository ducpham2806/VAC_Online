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
Mọi pixel không trong suốt phải thuộc bảng **64 màu đã chốt** `art/palette/vac_base.gpl` (05 mục 1.3, PO chốt 2026-11-02). Kiểm bằng `python3 tools/art/recolor_outline.py <file> --palette art/palette/vac_base.gpl --check`; sửa bằng `--out` (đưa về màu gần nhất).

## Báo cáo
| File | Viền | Kích thước | Nền | Palette | Kết luận |
|---|---|---|---|---|---|

Kết luận tổng: **ĐẠT**, **CẦN SỬA (n file)** hoặc **NOT ASSESSED**. Agent: `vac-art-pipeline`.
