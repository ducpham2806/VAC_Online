# Cài đặt Game Studio và Graphify cho VAC Online

## 1. Game Studio Agent (116 skill · 21 vai trò · 4 rule · 6 template)
- **Nguồn:** `ducpham2806/Game_Studio_Agent` commit `c5dac46` (tổng hợp Claude-Code-Game-Studios + awesome-gamedev-agent-skills, MIT). Chi tiết từng file và mã băm: [SOURCE-MANIFEST](SOURCE-MANIFEST.md).
- **Vị trí:** `.agents/game-studio/` — chép nguyên vẹn, không sửa. Không chạy `init-game-project.sh` của thư viện vào repo này: script đó tạo `project.yaml`, `design/`, `production/` và hàng trăm skill ở `.claude/skills/`, thành hệ tài liệu thứ hai (trái RULE D0) và làm phình danh sách skill nạp mỗi phiên.
- **Cách dùng:** skill `/vac-studio` (`.claude/skills/vac-studio/`) hoặc tra [INDEX](INDEX.md) rồi mở 1–3 `SKILL.md`. Mô tả skill chỉ tốn ngữ cảnh khi được mở, vì vậy chỉ một skill định tuyến được đăng ký với Claude Code thay vì 116.
- **Đã có từ trước, giữ nguyên:** 6 agent `vac-*`, 6 skill `vac-*`, 7 rule `.claude/rules/`, plugin `agent-sprite-forge` (sinh ảnh thật). Bốn skill art cùng tên trong thư viện là tài liệu tham khảo; khi chạy dùng plugin.
- **Cập nhật bản ghim:** chép bản mới bằng `git archive` vào `.agents/game-studio/`, sinh lại bảng trong SOURCE-MANIFEST, chạy `npm run check:docs`, ghi commit mới vào file này và `docs/WORKLOG.md`.

## 2. Graphify (đồ thị tri thức code + tài liệu)
- **Gói:** `graphifyy[sql]==0.9.105` (PyPI). Phiên bản ghim trong `scripts/graphify-build.sh`.
- **Cài và dựng:** `bash scripts/graphify-build.sh` (thêm `--force` để dựng lại từ đầu). Phiên cloud tự chạy qua hook SessionStart. Máy cá nhân chạy tay một lần.
- **Phạm vi:** `.graphifyignore` bỏ `node_modules`, bản build, ảnh, `.agents/`, archive. Đồ thị lấy cấu trúc từ code TS/Python/SQL và heading Markdown — không gọi LLM, không tốn API.
- **Đầu ra:** `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`) — không commit, dựng lại ~3 giây.
- **Skill:** `.claude/skills/graphify/SKILL.md` (bản của gói, lệnh `/graphify`). Luật dùng ở `CLAUDE.md` mục graphify.
- **Hook:** `.claude/hooks/graphify-guard.sh` gọi `graphify hook-guard` trước Grep/Read/Glob để nhắc tra đồ thị; chưa cài graphify thì cho qua.
- **Tùy chọn (chưa bật):** trích xuất ngữ nghĩa tài liệu bằng LLM (`/graphify . --update` trong phiên Claude, hoặc `graphify extract` cần API key) — chỉ làm khi PO đồng ý chi phí.
