#!/bin/bash

# Migration Verification Script
# Checks that all Alembic migrations are applied and required tables exist

set -euo pipefail

divider() {
  printf '%s\n' "========================================="
}

divider
printf '%s\n' "Database Migration Verification"
divider
printf '\n'

# Ensure script is run from backend directory
if [ ! -f "alembic.ini" ]; then
  printf '%s\n' "❌ ERROR: alembic.ini not found. Run this script from the backend directory."
  exit 1
fi

printf '%s\n' "1. Checking Alembic current revision..."
CURRENT_REVISION=$(alembic current 2>&1)
printf '%s\n\n' "$CURRENT_REVISION"

if echo "$CURRENT_REVISION" | grep -q "Can't locate revision"; then
  printf '%s\n' "❌ ERROR: No migrations applied to database"
  exit 1
fi

printf '%s\n' "2. Checking migration history (latest entries)..."
alembic history --verbose | head -20
printf '\n'

printf '%s\n' "3. Verifying required tables exist..."

PYTHON_BIN=${PYTHON_BIN:-python}
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  PYTHON_BIN=python3
fi

"$PYTHON_BIN" <<'PYTHON_SCRIPT'
import os
import sys
from sqlalchemy import create_engine, inspect

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print('❌ ERROR: DATABASE_URL not set')
    sys.exit(1)

engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

existing_tables = inspector.get_table_names()
print(f"Found {len(existing_tables)} tables in database:")
for table in sorted(existing_tables):
    print(f"  ✓ {table}")

print("")

required_tables = [
    'users',
    'organizations',
    'deals',
    'pipeline_stages',
    'documents',
    'folders',
    'financial_ratios',
    'valuations',
    'valuation_scenarios',
    'valuation_export_logs',
    'comparable_companies',
    'precedent_transactions',
    'subscriptions',
    'invoices',
    'podcast_usage',
]

missing_tables = [table for table in required_tables if table not in existing_tables]

if missing_tables:
    print(f"❌ ERROR: Missing {len(missing_tables)} required tables:")
    for table in missing_tables:
        print(f"  ✗ {table}")
    sys.exit(1)

print(f"✅ All {len(required_tables)} required tables exist")
print("")
print("========================================")
print("✅ Migration verification PASSED")
print("========================================")
PYTHON_SCRIPT

printf '\n'
printf '%s\n' "Migration verification complete!"
