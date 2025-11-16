#!/bin/bash
# Stamp the Render database to migration version 774225e563ca
# This bypasses the aborted transaction issue

set -e

echo "======================================================================"
echo "ALEMBIC DATABASE STAMPING TOOL"
echo "======================================================================"
echo "Target version: 774225e563ca"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "[ERROR] DATABASE_URL not set!"
    echo ""
    echo "Please set DATABASE_URL environment variable:"
    echo '  export DATABASE_URL="postgresql://user:pass@host:port/dbname"'
    echo ""
    echo "You can get this from Render dashboard:"
    echo "  Dashboard > Database > Connection > External Connection String"
    exit 1
fi

echo "[INFO] Ensuring alembic_version table exists..."
PGSSLMODE=require psql "$DATABASE_URL" -c "CREATE TABLE IF NOT EXISTS alembic_version (
  version_num VARCHAR(32) NOT NULL PRIMARY KEY
);"
echo "[OK] alembic_version table ready"

echo "[INFO] Stamping database to version 774225e563ca..."
PGSSLMODE=require psql "$DATABASE_URL" -c "WITH up AS (
  UPDATE alembic_version
  SET version_num='774225e563ca'
  RETURNING 1
)
INSERT INTO alembic_version(version_num)
SELECT '774225e563ca'
WHERE NOT EXISTS (SELECT 1 FROM up);"
echo "[OK] Database stamped successfully"

echo "[INFO] Verifying current version..."
PGSSLMODE=require psql "$DATABASE_URL" -c "SELECT * FROM alembic_version;"

echo ""
echo "======================================================================"
echo "STAMPING COMPLETE"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "1. Redeploy the backend service on Render"
echo "2. Alembic will now continue from version 774225e563ca"
echo "3. Subsequent migrations (if any) will run normally"
echo ""
