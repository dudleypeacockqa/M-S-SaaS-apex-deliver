#!/bin/bash
echo "========================================="
echo "Starting Render Backend Prestart"
echo "========================================="
echo "Database URL is set (length: ${#DATABASE_URL} characters)"

# Check if we should skip migrations
if [ "$SKIP_MIGRATIONS" = "true" ]; then
    echo "SKIP_MIGRATIONS is set - skipping database migrations"
else
    echo "Running database migrations..."
    alembic upgrade head || echo "Migration failed but continuing..."
fi

echo "Prestart script completed!"
