#!/bin/bash
# Entrypoint script for Render deployment
# Simplified version that calls prestart then starts uvicorn

set -e  # Exit on error

echo "========================================="
echo "Starting Render Backend Service"
echo "========================================="

# Run prestart script (migrations)
if [ -f "/app/prestart.sh" ]; then
    echo "Running prestart script..."
    # Strip Windows line endings (CRLF) before executing
    # This ensures the script works even if checked out with CRLF line endings
    SANITIZED_PRESTART="/tmp/prestart"
    tr -d '\r' < /app/prestart.sh > "${SANITIZED_PRESTART}"
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
