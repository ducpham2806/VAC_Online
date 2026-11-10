# VAC Online — Claude Code

@AGENTS.md

Luật chung chỉ đặt tại `AGENTS.md`; file này chỉ thêm phần riêng của Claude Code.

## graphify

Dự án có đồ thị tri thức ở `graphify-out/` (hook SessionStart tự cài `graphifyy` và dựng lại; không commit thư mục này).

- Khi có `graphify-out/graph.json`: chạy `graphify query "<câu hỏi>"` trước lần grep/đọc file đầu tiên cho câu hỏi về code hoặc tài liệu; ghi luật này vào prompt của mọi subagent đi khám phá code. Chỉ đọc file gốc ở đúng dòng mà đồ thị đã chỉ ra.
- Quan hệ giữa hai thứ: `graphify path "<A>" "<B>"`; giải thích một khái niệm: `graphify explain "<X>"`; ảnh hưởng khi sửa X: `graphify affected "<X>"`.
- `graphify-out/GRAPH_REPORT.md` chỉ đọc khi rà kiến trúc tổng thể.
- Sửa code xong: `graphify update .` (chỉ AST, không tốn API). Lập lại cả đồ thị: `bash scripts/graphify-build.sh`.
