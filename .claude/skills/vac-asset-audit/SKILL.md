---
name: vac-asset-audit
description: "Kiểm asset hình ảnh của VAC Online theo 05_MASTER_ART: không còn viền đen #000000, kích thước chuẩn (48x64 nhân vật, 168x80 ô đất, 32x32 icon), đúng palette, nền tách đúng. Dùng sau mỗi lô sprite từ agent-sprite-forge và trước khi đưa vào public/assets."
argument-hint: "[đường dẫn thư mục, mặc định public/assets]"
allowed-tools: Read, Glob, Bash(python3 tools/art/*), Bash(python3 -c *), Bash(ls *), Bash(find *)
---

# /vac-asset-audit
0. `find <thư mục> -name '*.png'`; không có file → **NOT ASSESSED — chưa có asset**. Hình vẽ bằng code (`PixelAssetGenerator.ts`) ngoài phạm vi.
1. **Viền:** `python3 tools/art/recolor_outline.py <file> --check`; FAIL → `--out` rồi kiểm lại.
2. **Kích thước & nền** (Pillow): nhân vật 48×64, ô đất 168×80, icon 32×32, sheet = bội số khung; không còn pixel `#FF00FF`.
3. **Palette:** `recolor_outline.py <file> --palette art/palette/vac_base.gpl --check` (64 màu, `05` mục 1.3); sửa bằng `--out`.

Báo cáo bảng `File | Viền | Kích thước | Nền | Palette | Kết luận`; tổng: **ĐẠT** / **CẦN SỬA (n)** / **NOT ASSESSED**. Agent: `vac-art-pipeline`.
