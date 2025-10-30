#!/bin/bash
# Render prestart script - runs before starting the FastAPI application
# This script is executed from the repository root directory
# Purpose: Apply Alembic database migrations before app starts

set -e  # Exit on any error

echo "========================================="
echo "Render Prestart Script - Database Migrations"
echo "========================================="
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo ""

# Navigate to backend directory where alembic.ini is located
echo "Navigating to backend directory..."
cd backend

# Check if alembic is installed
if ! command -v alembic &> /dev/null; then
    echo "❌ ERROR: Alembic not found in PATH"
    echo "Installing alembic..."
    pip install alembic
fi

# Show current migration status
echo ""
echo "Current migration status:"
alembic current || echo "No current migration (fresh database)"

# Show available migrations
echo ""
echo "Available migration heads:"
alembic heads

# Apply all pending migrations
echo ""
echo "Applying database migrations..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS: All migrations applied"
    echo ""
    echo "Final migration status:"
    alembic current
    echo ""
    echo "========================================="
    echo "Prestart complete - ready to start application"
    echo "========================================="
else
    echo ""
    echo "❌ ERROR: Migration failed"
    echo "========================================="
    exit 1
fi
