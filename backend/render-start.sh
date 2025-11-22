#!/usr/bin/env bash
set -euo pipefail

unset SKIP_MIGRATIONS
export RENDER_PRESTART_RUN_MIGRATIONS=1

# Strip Windows line endings from prestart, then execute it before launching the API
python - <<'PY'
from pathlib import Path
src = Path("prestart.sh")
dst = Path("/tmp/prestart")
data = src.read_bytes()
if b"\r" in data:
    data = data.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
dst.write_bytes(data)
PY
chmod +x /tmp/prestart
/tmp/prestart

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"

