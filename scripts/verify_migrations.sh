#!/bin/bash
# ==============================================================================
# Database Migration Verification Script
# ==============================================================================
# Purpose: Verify all Alembic migrations are applied to production database
# Usage: ./scripts/verify_migrations.sh
# Environment: Requires DATABASE_URL to be set (or .env file)
#
# Exit Codes:
#   0 = Success (all migrations applied, all tables exist)
#   1 = Failure (missing migrations or tables)
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  Database Migration Verification Script${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Check if running in backend directory
if [ ! -f "alembic.ini" ]; then
    echo -e "${RED}ERROR: alembic.ini not found${NC}"
    echo "Please run this script from the backend directory:"
    echo "  cd backend && ../scripts/verify_migrations.sh"
    exit 1
fi

# Load environment variables if .env exists
if [ -f ".env" ]; then
    echo -e "${BLUE}Loading environment variables from .env...${NC}"
    export $(grep -v '^#' .env | xargs)
fi

# Check DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERROR: DATABASE_URL environment variable not set${NC}"
    echo "Set it in your .env file or export it:"
    echo "  export DATABASE_URL=postgresql://user:pass@host/db"
    exit 1
fi

echo -e "${GREEN}✓ DATABASE_URL configured${NC}"
echo ""

# ==============================================================================
# Step 1: Check current migration revision
# ==============================================================================
echo -e "${YELLOW}Step 1: Checking current migration revision...${NC}"
CURRENT_REVISION=$(alembic current 2>&1)

if echo "$CURRENT_REVISION" | grep -q "No such table: alembic_version"; then
    echo -e "${RED}✗ Alembic not initialized${NC}"
    echo "Run: alembic upgrade head"
    exit 1
elif echo "$CURRENT_REVISION" | grep -q "(head)"; then
    echo -e "${GREEN}✓ Database is at head revision${NC}"
else
    echo -e "${YELLOW}⚠ Database revision:${NC}"
    echo "$CURRENT_REVISION"
fi
echo ""

# ==============================================================================
# Step 2: Check target migration revision (head)
# ==============================================================================
echo -e "${YELLOW}Step 2: Checking target migration revision...${NC}"
HEAD_REVISION=$(alembic heads)
echo "Target revision: $HEAD_REVISION"
echo ""

# ==============================================================================
# Step 3: List all migration files
# ==============================================================================
echo -e "${YELLOW}Step 3: Listing all migration files...${NC}"
MIGRATION_COUNT=$(ls -1 alembic/versions/*.py 2>/dev/null | wc -l)
echo "Found $MIGRATION_COUNT migration files:"
ls -1 alembic/versions/*.py | while read file; do
    filename=$(basename "$file")
    revision=$(echo "$filename" | cut -d'_' -f1)
    description=$(echo "$filename" | cut -d'_' -f2- | sed 's/.py$//' | tr '_' ' ')
    echo "  - $revision: $description"
done
echo ""

# ==============================================================================
# Step 4: Verify required tables exist
# ==============================================================================
echo -e "${YELLOW}Step 4: Verifying required tables exist in database...${NC}"

# Python script to check tables
python3 << 'PYTHON_SCRIPT'
import sys
import os
from sqlalchemy import create_engine, inspect

# Required tables based on migrations
REQUIRED_TABLES = [
    'users',                    # 8dcb6880a52b - Create users table
    'deals',                    # 36b3e62b4148 - Add deals table
    'pipeline_stages',          # 36b3e62b4148 - Add pipeline stages
    'documents',                # d37ed4cd3013 - Add document table
    'folders',                  # d37ed4cd3013 - Add folder table
    'financial_ratios',         # 2ae9df164631 - Add financial intelligence
    'valuations',               # 658051b7d4f9 - Add valuation tables
    'valuation_scenarios',      # 658051b7d4f9 - Add scenarios
    'subscriptions',            # 95b4f69d2ac2 - Add subscription tables
    'invoices',                 # 95b4f69d2ac2 - Add invoice tables
    'podcast_usage',            # de0a8956401c - Add podcast usage
]

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("❌ DATABASE_URL not set")
    sys.exit(1)

try:
    # Create engine and inspector
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)

    # Get all tables
    existing_tables = inspector.get_table_names()

    # Check each required table
    missing_tables = []
    for table in REQUIRED_TABLES:
        if table in existing_tables:
            print(f"✓ {table}")
        else:
            print(f"✗ {table} (MISSING)")
            missing_tables.append(table)

    # Summary
    print()
    if missing_tables:
        print(f"❌ Missing {len(missing_tables)} required tables:")
        for table in missing_tables:
            print(f"   - {table}")
        print()
        print("Run: alembic upgrade head")
        sys.exit(1)
    else:
        print(f"✅ All {len(REQUIRED_TABLES)} required tables exist")
        sys.exit(0)

except Exception as e:
    print(f"❌ Database connection error: {e}")
    sys.exit(1)
PYTHON_SCRIPT

PYTHON_EXIT_CODE=$?
echo ""

# ==============================================================================
# Step 5: Check for pending migrations
# ==============================================================================
if [ $PYTHON_EXIT_CODE -eq 0 ]; then
    echo -e "${YELLOW}Step 5: Checking for pending migrations...${NC}"

    # Compare current with head
    if echo "$CURRENT_REVISION" | grep -q "(head)"; then
        echo -e "${GREEN}✓ No pending migrations${NC}"
    else
        echo -e "${YELLOW}⚠ Pending migrations detected${NC}"
        echo "Current revision does not match head."
        echo ""
        echo "To apply pending migrations:"
        echo "  alembic upgrade head"
    fi
    echo ""
fi

# ==============================================================================
# Final Summary
# ==============================================================================
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  Verification Summary${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

if [ $PYTHON_EXIT_CODE -eq 0 ] && echo "$CURRENT_REVISION" | grep -q "(head)"; then
    echo -e "${GREEN}✅ SUCCESS: Database is fully migrated${NC}"
    echo -e "${GREEN}   - All migrations applied${NC}"
    echo -e "${GREEN}   - All required tables exist${NC}"
    echo -e "${GREEN}   - Database at head revision${NC}"
    echo ""
    echo -e "${GREEN}Production deployment: SAFE TO PROCEED${NC}"
    exit 0
else
    echo -e "${RED}❌ FAILURE: Database migration issues detected${NC}"
    echo ""
    echo -e "${YELLOW}Remediation Steps:${NC}"
    echo "1. Review migration status above"
    echo "2. Run: alembic upgrade head"
    echo "3. Re-run this script to verify"
    echo ""
    echo -e "${RED}Production deployment: DO NOT PROCEED${NC}"
    exit 1
fi
