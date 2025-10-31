#!/bin/sh
# Entrypoint script for Render deployment
# Handles database migrations before starting the application

set -e  # Exit on error

echo "========================================="
echo "Starting Render Backend Service"
echo "========================================="

# Check if database has an invalid migration stamp (like '001')
CURRENT=$(alembic current 2>&1 || echo "none")

if echo "$CURRENT" | grep -q "Can't locate revision identified by '001'"; then
    echo "❌ Found invalid migration stamp '001' in database"
    echo "🔧 Clearing alembic_version table and re-stamping..."

    # Clear the alembic_version table using psql
    echo "DELETE FROM alembic_version;" | psql "$DATABASE_URL"

    echo "✅ Cleared alembic_version table"
    echo "📌 Stamping with base migration (users table)..."

    # Stamp with the first migration (users table - 8dcb6880a52b)
    alembic stamp 8dcb6880a52b

    echo "✅ Database stamped with base migration"
fi

# Check current status again
CURRENT=$(alembic current 2>&1 || echo "none")

if echo "$CURRENT" | grep -q "Can't locate revision\|No current revision"; then
    echo "No current migration found - stamping with base"
    alembic stamp 8dcb6880a52b 2>&1 || echo "Could not stamp"
fi

# Now try to upgrade
echo "Running alembic upgrade head..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations applied successfully"
    alembic current
else
    echo "❌ Migration failed - exiting"
    exit 1
fi

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
