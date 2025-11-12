#!/bin/sh
# Simpler prestart script for Render deployment
# This script runs migrations in a more straightforward way

set -e  # Exit on error

echo "========================================="
echo "Starting Render Backend Prestart"
echo "========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set"
    exit 1
fi

echo "Database URL is set (length: ${#DATABASE_URL} characters)"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

echo "✅ Migrations completed successfully"
alembic current

echo "========================================="
echo "Prestart script completed"
echo "========================================="
