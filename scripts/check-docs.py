#!/usr/bin/env python3
"""Kiểm tài liệu đầu vào của VAC Online (chỉ dùng thư viện chuẩn).

- Trần ký tự của các file đọc mỗi phiên (docs/WORKFLOW.md mục Budget).
- Link tương đối không hỏng trong các file đó và trong docs/.
- docs/WORKLOG.md có 1–3 mục.
- Mã mục thiết kế (TQ/GP/TG/KT/KY/AR/UI/LT/QD-nn): mỗi mã định nghĩa đúng một lần,
  mọi chỗ dẫn mã đều trỏ tới mã có thật (docs/00_TONG_QUAN.md mục TQ-05).
- Bản ghim Game Studio trong .agents/game-studio/ khớp đúng docs/studio/SOURCE-MANIFEST.md.
"""
import hashlib
import re
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
LIMITS = {
    'AGENTS.md': 7000,
    'CLAUDE.md': 2000,
    'docs/SESSION-HANDOFF.md': 3000,
    'docs/WORKLOG.md': 4500,
    'docs/COMPLETED.md': 9000,
    'VIEC_CAN_LAM.md': 16000,
}
OTHER_INPUTS = [
    'README.md', 'docs/WORKFLOW.md', 'docs/REVIEW-2026-11-10.md',
    'docs/studio/INDEX.md', 'docs/studio/INSTALLATION.md',
    '.claude/skills/vac-studio/SKILL.md',
]
LINK = re.compile(r'\[[^\]]*\]\(([^)\s]+)\)')
errors = []

# --- Mã mục thiết kế ---
DESIGN = sorted((ROOT / 'docs').glob('0[0-8]_*.md'))
if len(DESIGN) != 9:
    errors.append(f'Cần 9 tài liệu thiết kế docs/00 → 08, đang có {len(DESIGN)}')
CODE = r'(?:TQ|GP|TG|KT|KY|AR|UI|LT|QD)-\d{2}'
DEF_HEADING = re.compile(rf'^#{{2,4}} ({CODE}) ·', re.M)
DEF_ROW = re.compile(rf'^\| ({CODE}) \|', re.M)
REF = re.compile(rf'(?<![A-Za-z0-9_-])({CODE})(?![0-9])')
defined = {}
for f in DESIGN:
    text = f.read_text(encoding='utf-8')
    LIMITS[f.relative_to(ROOT).as_posix()] = 24000 if f.name.startswith('01_') else 16000
    for code in DEF_HEADING.findall(text) + DEF_ROW.findall(text):
        if code in defined:
            errors.append(f'Mã {code} định nghĩa 2 lần: {defined[code]} và {f.name}')
        defined[code] = f.name
REF_FILES = DESIGN + [ROOT / n for n in ('AGENTS.md', 'CLAUDE.md', 'VIEC_CAN_LAM.md', 'README.md')]
REF_FILES += sorted((ROOT / '.claude').glob('**/*.md'))
REF_FILES += [ROOT / 'docs' / n for n in ('WORKFLOW.md', 'SESSION-HANDOFF.md', 'COMPLETED.md')]
for f in REF_FILES:
    if not f.is_file():
        continue
    for code in sorted(set(REF.findall(f.read_text(encoding='utf-8')))):
        if code not in defined:
            errors.append(f'{f.relative_to(ROOT).as_posix()}: dẫn mã {code} không tồn tại')

for name in list(LIMITS) + OTHER_INPUTS:
    path = ROOT / name
    if not path.is_file():
        errors.append(f'Thiếu file: {name}')
        continue
    text = path.read_text(encoding='utf-8')
    if name in LIMITS and len(text) > LIMITS[name]:
        errors.append(f'{name}: {len(text)} ký tự > trần {LIMITS[name]}')
    prose = re.sub(r'```.*?```', '', text, flags=re.S)
    for target in LINK.findall(prose):
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', target) or target.startswith('#'):
            continue
        target = unquote(target.strip('<>').split('#')[0].split('?')[0])
        if target and not (path.parent / target).exists():
            errors.append(f'{name}: link hỏng {target}')

log = (ROOT / 'docs/WORKLOG.md').read_text(encoding='utf-8') if (ROOT / 'docs/WORKLOG.md').is_file() else ''
entries = re.findall(r'^## ', log, flags=re.M)
if not 1 <= len(entries) <= 3:
    errors.append(f'WORKLOG: cần 1–3 mục, đang có {len(entries)}')

studio = ROOT / '.agents/game-studio'
for pattern, expected in [('skills/*/*/SKILL.md', 116), ('agents/*/*.md', 21),
                          ('rules/*.md', 4), ('templates/*.md', 6)]:
    found = len(list(studio.glob(pattern)))
    if found != expected:
        errors.append(f'Game Studio {pattern}: {found}, cần {expected}')

manifest = ROOT / 'docs/studio/SOURCE-MANIFEST.md'
rows = re.findall(r'^\| `([^`]+)` \| `([^`]+)` \| `([a-f0-9]{40})` \|$',
                  manifest.read_text(encoding='utf-8'), flags=re.M) if manifest.is_file() else []
if len(rows) != 297 or len({r[1] for r in rows}) != 297:
    errors.append(f'SOURCE-MANIFEST phải có 297 file khác nhau, đang có {len(rows)}')
listed = {r[1] for r in rows}
for f in studio.rglob('*'):
    if f.is_file() and f.relative_to(ROOT).as_posix() not in listed:
        errors.append(f'File lạ trong bản ghim Game Studio: {f.relative_to(ROOT).as_posix()}')
for _source, installed, expected in rows:
    path = ROOT / installed
    if not path.is_file():
        errors.append(f'Thiếu file Game Studio: {installed}')
        continue
    data = path.read_bytes()
    actual = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
    if actual != expected:
        errors.append(f'File Game Studio bị sửa so với bản ghim: {installed}')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(LIMITS) + len(OTHER_INPUTS)} file đầu vào trong trần + link OK; {len(defined)} mã mục; '
      f'WORKLOG {len(entries)} mục; Game Studio {len(rows)} file khớp bản ghim')
