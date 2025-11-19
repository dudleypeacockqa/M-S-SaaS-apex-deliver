#!/bin/bash
# Render prestart script - runs before starting the FastAPI application
# This script applies Alembic database migrations before app starts

set -e  # Exit on any error

echo "========================================="
echo "Starting Render Backend Prestart"
echo "========================================="
echo "Database URL is set (length: ${#DATABASE_URL} characters)"
echo "Working directory: $(pwd)"

# Check if we should skip migrations
if [ "$SKIP_MIGRATIONS" = "true" ]; then
    echo "SKIP_MIGRATIONS is set - skipping database migrations"
else
    echo "Running database migrations..."
    echo "Current Alembic revision:"
    alembic current || echo "No current revision found"
    echo ""
    echo "Available migration heads:"
    alembic heads || echo "No heads found"
    echo ""
    echo "Applying migrations..."
    alembic upgrade head
    echo "? Migrations applied successfully"
    echo ""
    echo "Final Alembic revision:"
    alembic current
fi

echo "Prestart script completed!"

