#!/bin/bash

# Migration Verification Script
# Checks that all Alembic migrations are applied and required tables exist

set -e  # Exit on error

echo "========================================="
echo "Database Migration Verification"
echo "========================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "alembic.ini" ]; then
    echo "Error: alembic.ini not found. Run this script from the backend directory."
    exit 1
fi

echo "1. Checking Alembic current revision..."
CURRENT_REVISION=$(alembic current 2>&1)
echo "$CURRENT_REVISION"
echo ""

if echo "$CURRENT_REVISION" | grep -q "Can't locate revision"; then
    echo "❌ ERROR: No migrations applied to database"
    exit 1
fi

echo "2. Checking migration history..."
alembic history --verbose | head -20
echo ""

echo "3. Verifying required tables exist..."
# Define required tables
REQUIRED_TABLES=(
    'users'
    'deals'
    'pipeline_stages'
    'documents'
    'folders'
    'financial_ratios'
    'valuations'
    'valuation_scenarios'
    'subscriptions'
    'invoices'
    'podcast_usage'
)

# Python script to check tables
python3 << 'PYTHON_SCRIPT'
import os
import sys
from sqlalchemy import create_engine, inspect

# Get database URL from environment
database_url = os.getenv('DATABASE_URL')
if not database_url:
    print("❌ ERROR: DATABASE_URL not set")
    sys.exit(1)

# Create engine and inspector
engine = create_engine(database_url)
inspector = inspect(engine)

# Get existing tables
existing_tables = inspector.get_table_names()
print(f"Found {len(existing_tables)} tables in database:")
for table in sorted(existing_tables):
    print(f"  ✓ {table}")

print("")

# Check required tables
REQUIRED_TABLES = [
    'users', 'deals', 'pipeline_stages', 'documents', 'folders',
    'financial_ratios', 'valuations', 'valuation_scenarios',
    'subscriptions', 'invoices', 'podcast_usage'
]

missing_tables = [t for t in REQUIRED_TABLES if t not in existing_tables]

if missing_tables:
    print(f"❌ ERROR: Missing {len(missing_tables)} required tables:")
    for table in missing_tables:
        print(f"  ✗ {table}")
    sys.exit(1)
else:
    print(f"✅ All {len(REQUIRED_TABLES)} required tables exist")

print("")
print("========================================")
print("✅ Migration verification PASSED")
print("========================================")
PYTHON_SCRIPT

echo ""
echo "Migration verification complete!"
