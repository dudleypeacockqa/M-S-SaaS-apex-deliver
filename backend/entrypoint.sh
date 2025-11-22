#!/bin/bash
# Entrypoint script for Render deployment
# Simplified version that calls prestart then starts uvicorn

set -euo pipefail  # Exit fast on failures/undefined vars

SANITIZED_PRESTART="/tmp/prestart.sh"
trap 'rm -f "${SANITIZED_PRESTART}"' EXIT

echo "========================================="
echo "Starting Render Backend Service"
echo "========================================="

# Run prestart script (migrations)
if [ -f "/app/prestart.sh" ]; then
    echo "Running prestart script..."
    # Strip Windows line endings (CRLF) before executing.
    if ! tr -d '\r' < /app/prestart.sh > "${SANITIZED_PRESTART}"; then
        echo "ERROR: Failed to sanitize prestart.sh" >&2
        exit 1
    fi
    chmod +x "${SANITIZED_PRESTART}"
    bash "${SANITIZED_PRESTART}"
else
    echo "WARNING: prestart.sh not found, skipping migrations"
fi

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
