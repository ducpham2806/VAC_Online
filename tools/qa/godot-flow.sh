#!/usr/bin/env bash
# LT-14. Chạy một kịch bản kiểm trong godot/qa/ trên cảnh Godot không cửa sổ, qua máy chủ thử.
# Cách dùng: godot-flow.sh <bộ dựng sẵn: p1-9 | fast> <tên kịch bản> [mùa]
# Cần: scripts/build-godot-web.sh đã chạy, Godot 4.7.2 (GODOT_BIN), Deno (DENO).
set -euo pipefail
cd "$(dirname "$0")/../.."
exec python3 - "$@" <<'PYTHON'
import os
import signal
import socket
import subprocess
import sys
import tempfile
import time
from urllib.error import URLError
from urllib.request import Request, urlopen

if not 3 <= len(sys.argv) <= 4:
    sys.exit("Cách dùng: godot-flow.sh <bộ dựng sẵn> <kịch bản> [mùa]")
preset, scenario, *args = sys.argv[1:]
if os.path.isfile("godot/generated/godot_online.json"):
    sys.exit("Kịch bản cần bản Godot dùng fixture cục bộ. Hãy chạy từ checkout không có godot_online.json.")
for port in (4173, 8798):
    with socket.socket() as probe:
        if probe.connect_ex(("127.0.0.1", port)) == 0:
            sys.exit(f"Cổng thử nghiệm {port} đang được dùng.")
season = args[0] if args else "XUAN"
url = "http://127.0.0.1:4173/api/actions"
request = Request(url, data=b'{"actions":[]}', headers={"Content-Type": "application/json"})
children = []

with tempfile.TemporaryDirectory(prefix="vac-godot-flow-") as data, tempfile.TemporaryFile() as logs:
    try:
        for command in (
            ["bash", "tools/qa/run-godot-farm-fixture.sh", season, preset],
            ["python3", "tools/qa/serve-godot-probe.py", "--farm-loop"],
        ):
            children.append(subprocess.Popen(command, start_new_session=True, stdout=logs, stderr=logs))
        for _ in range(40):
            if any(child.poll() is not None for child in children):
                raise RuntimeError("Máy chủ kiểm thử dừng khi khởi động.")
            try:
                with urlopen(request, timeout=1) as response:
                    if response.status == 200:
                        break
            except (URLError, TimeoutError):
                pass
            time.sleep(0.5)
        else:
            raise RuntimeError("Máy chủ kiểm thử chưa sẵn sàng.")
        result = subprocess.call([
            os.environ.get("GODOT_BIN", "godot"), "--headless", "--path", "godot",
            "--script", f"res://qa/{scenario}.gd",
        ], env={**os.environ, "VAC_GODOT_QA_CACHE": os.path.join(data, "farm.json")})
        sys.exit(result)
    except RuntimeError as error:
        logs.seek(0)
        sys.stderr.write(logs.read().decode(errors="replace"))
        sys.exit(str(error))
    finally:
        for child in children:
            try:
                os.killpg(child.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
        for child in children:
            child.wait()
PYTHON
