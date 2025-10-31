#!/bin/sh
# Entrypoint script for Render deployment
# Handles database migrations before starting the application

set -e  # Exit on error

echo "========================================="
echo "Starting Render Backend Service"
echo "========================================="

# Check if this is the first deployment (no migrations applied yet)
CURRENT=$(alembic current 2>&1 || echo "none")

if echo "$CURRENT" | grep -q "Can't locate revision\|No current revision"; then
    echo "No current migration found - this might be a fresh database"
    echo "Attempting to stamp with latest migration..."

    # Get the latest migration head
    LATEST=$(alembic heads | grep -oP '^\w+' | head -1)
    echo "Latest migration: $LATEST"

    # Try to stamp, if it fails, it means tables might exist
    alembic stamp $LATEST 2>&1 || echo "Could not stamp - continuing anyway"
fi

# Now try to upgrade
echo "Running alembic upgrade head..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations applied successfully"
else
    echo "❌ Migration failed - exiting"
    exit 1
fi

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
