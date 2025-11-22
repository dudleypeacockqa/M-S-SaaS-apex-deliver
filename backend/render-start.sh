#!/usr/bin/env bash
set -euo pipefail

unset SKIP_MIGRATIONS
export RENDER_PRESTART_RUN_MIGRATIONS=1

# Strip Windows line endings from prestart, then execute it before launching the API
tr -d '\r' < prestart.sh > /tmp/prestart
chmod +x /tmp/prestart
/tmp/prestart

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"

