#!/bin/sh
# Entrypoint script for Render deployment
# Simplified version that calls prestart then starts uvicorn

set -e  # Exit on error

echo "========================================="
echo "Starting Render Backend Service"
echo "========================================="

# Run prestart script (migrations)
if [ -f "/app/prestart.sh" ]; then
    echo "Running prestart script..."
    SANITIZED_PRESTART="/tmp/prestart"
    python - <<'PY'
from pathlib import Path
src = Path("/app/prestart.sh")
dst = Path("/tmp/prestart")
data = src.read_bytes()
if b"\r" in data:
    data = data.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
dst.write_bytes(data)
PY
    chmod +x "${SANITIZED_PRESTART}"
    "${SANITIZED_PRESTART}"
else
    echo "WARNING: prestart.sh not found, skipping migrations"
fi

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
