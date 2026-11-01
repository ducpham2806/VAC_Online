# Ghi nguồn bên thứ ba

## Claude-Code-Game-Studios (CCGS)
- Nguồn: https://github.com/Donchitos/Claude-Code-Game-Studios. Giấy phép MIT © Donchitos và cộng sự.
- Dự án **không cài nguyên bộ** CCGS (bộ đó viết cho Godot/Unity/Unreal và có hệ tài liệu riêng). Các phần dưới đây được **viết lại, rút gọn và chuyển thể** cho VAC Online (Phaser + React + Supabase, RULE D0/D1):

| File trong dự án | Chuyển thể từ CCGS |
|---|---|
| `.claude/rules/domain-rules.md` | `.claude/rules/gameplay-code.md` |
| `.claude/rules/supabase.md`, `client-network.md` | `.claude/rules/network-code.md` |
| `.claude/rules/ui.md` | `.claude/rules/ui-code.md` |
| `.claude/rules/data.md` | `.claude/rules/data-files.md` |
| `.claude/rules/tests.md` | `.claude/rules/test-standards.md` |
| `.claude/rules/docs.md` | `.claude/rules/design-docs.md` |
| `.claude/skills/vac-consistency-check` | `skills/consistency-check` |
| `.claude/skills/vac-balance-check` | `skills/balance-check` |
| `.claude/skills/vac-propagate-change` | `skills/propagate-design-change` |
| `.claude/skills/vac-story-done` | `skills/story-done` + `skills/gate-check` |
| `.claude/skills/vac-scope-check` | `skills/scope-check` |
| `.claude/skills/vac-asset-audit` | `skills/asset-audit` |
| `.claude/hooks/read-guard.sh` + `read_guard.py` | `hooks/validate-read.sh` |
| `.claude/hooks/secret-guard.sh` | ý tưởng từ `hooks/validate-commit.sh` |
| Nguyên tắc "NOT ASSESSED — NO DATA" trong skill và agent | phần "Insufficient input" của các skill CCGS |

## agent-sprite-forge
- Nguồn: https://github.com/0x0funky/agent-sprite-forge. Giấy phép MIT. Dùng dưới dạng plugin (`.claude/settings.json`), không chép mã vào repo.
