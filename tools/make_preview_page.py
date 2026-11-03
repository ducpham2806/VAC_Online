#!/usr/bin/env python3
"""Tạo dist-preview/play.html — trang đăng Artifact cho bản chạy thử (sau `vite build --base=./`).

Artifact tự bọc trang trong <!doctype html><head><body>, nên trang chỉ gồm title, meta, style, link CSS,
script module của Vite và #root. Không có đoạn đăng ký service worker (Artifact không hỗ trợ).
"""
import re
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "dist-preview"
title = sys.argv[2] if len(sys.argv) > 2 else "Hương Đồng Gió Nội — Bản Chạy Thử"
html = open(f"{src}/index.html", encoding="utf-8").read()
js = re.search(r'src="\./(assets/index-[^"]+\.js)"', html).group(1)
css = re.search(r'href="\./(assets/index-[^"]+\.css)"', html).group(1)
page = f"""<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#321b0d">
<link rel="icon" type="image/svg+xml" href="./icon-192.svg">
<style>
  /* Một thế giới màu cố định (gỗ lim, đêm đồng quê): game tự vẽ toàn bộ khung hình. */
  :root {{ color-scheme: dark; --bg: #1a120c; }}
  html, body {{ height: 100%; margin: 0; overflow: hidden; background: var(--bg); }}
</style>
<link rel="stylesheet" href="./{css}">
<script type="module" src="./{js}"></script>
<div id="root"></div>
"""
open(f"{src}/play.html", "w", encoding="utf-8").write(page)
print(f"Đã tạo {src}/play.html ({js}, {css})")
