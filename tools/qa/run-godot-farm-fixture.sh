#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
fixture_dir="$(mktemp -d)"
trap 'rm -rf "$fixture_dir"' EXIT
npx --no-install esbuild tools/qa/godot-farm-fixture.ts --bundle --format=esm --platform=neutral \
  --target=es2022 --outfile="$fixture_dir/fixture.mjs" --log-level=warning
"${DENO:-deno}" run --allow-net=127.0.0.1:8798 "$fixture_dir/fixture.mjs"
