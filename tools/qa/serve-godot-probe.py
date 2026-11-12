"""Phục vụ Web/PWA Godot và apply-actions thử nghiệm, chỉ trên loopback."""

import argparse
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


DIST = Path(__file__).resolve().parents[2] / "godot" / "dist"
ORIGIN = "http://127.0.0.1:4173"
PREVIEW_ORIGIN = os.environ.get("VAC_GODOT_PREVIEW_ORIGIN", "")
ORIGINS = {origin for origin in (ORIGIN, PREVIEW_ORIGIN) if origin}
HOSTS = {urlsplit(origin).netloc for origin in ORIGINS}
EDGE = "http://127.0.0.1:8787"
TEST_USER = "00000000-0000-0000-0000-0000000000c1"
PROBE_ACTIONS = ([], [{"type": "PLANT", "tileId": "P5_7", "itemId": "CROP_01"}])
FARM_LOOP = False


class ProbeHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".wasm": "application/wasm"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def send_head(self):
        encodings = self.headers.get("Accept-Encoding", "").replace(" ", "").split(",")
        compressed = DIST / "index.wasm.gz"
        if urlsplit(self.path).path != "/index.wasm" or "gzip" not in encodings or not compressed.is_file():
            return super().send_head()
        wasm = compressed.open("rb")
        self.send_response(200)
        self.send_header("Content-Type", "application/wasm")
        self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(os.fstat(wasm.fileno()).st_size))
        self.send_header("Cache-Control", "max-age=300, no-transform")
        self.send_header("Vary", "Accept-Encoding")
        self.end_headers()
        return wasm

    def do_POST(self):
        if self.path != "/api/actions":
            self.send_error(404)
            return
        if self.headers.get("Host") not in HOSTS or self.headers.get("Origin", ORIGIN) not in ORIGINS:
            self.send_error(403)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if not 0 < length <= 16_384:
            self.send_error(400)
            return
        data = self.rfile.read(length)
        try:
            payload = json.loads(data)
        except (ValueError, UnicodeError):
            payload = None
        actions = payload.get("actions") if isinstance(payload, dict) else None
        if not isinstance(actions, list) or (not FARM_LOOP and actions not in PROBE_ACTIONS):
            self.send_error(400)
            return
        request = Request(
            EDGE, data=json.dumps({"actions": actions}).encode("utf-8"), method="POST",
            headers={"content-type": "application/json", "x-test-user": TEST_USER},
        )
        try:
            with urlopen(request, timeout=6) as reply:
                self._json(reply.status, reply.read())
        except HTTPError as error:
            self._json(error.code, error.read())
        except (URLError, TimeoutError):
            self._json(502, b'{"error":"local_edge_unavailable"}')

    def _json(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store, no-transform")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--farm-loop", action="store_true", help="Dùng nông trại thử trong bộ nhớ ở cổng 8798.")
    FARM_LOOP = parser.parse_args().farm_loop
    if FARM_LOOP:
        EDGE = "http://127.0.0.1:8798"
    if not (DIST / "index.html").is_file():
        raise SystemExit("Chạy scripts/build-godot-web.sh trước.")
    print(f"VAC Godot Web/PWA · {ORIGIN}", flush=True)
    with ThreadingHTTPServer(("127.0.0.1", 4173), ProbeHandler) as server:
        server.serve_forever()
