#!/bin/bash
# Render prestart script - runs before starting the FastAPI application
# This script is executed from the repository root directory
# Purpose: Apply Alembic database migrations before app starts

set -e  # Exit on any error

normalize_database_url() {
  if [ -z "${DATABASE_URL:-}" ]; then
    return
  fi

  DATABASE_URL=$(DB_URL_TMP="$DATABASE_URL" RENDER_DB_DOMAIN_SUFFIX="${RENDER_DB_DOMAIN_SUFFIX:-frankfurt-postgres.render.com}" python3 - <<'PY'
import os
from urllib.parse import urlsplit, urlunsplit, parse_qs, urlencode

url = os.environ["DB_URL_TMP"]
suffix = os.environ["RENDER_DB_DOMAIN_SUFFIX"]
parts = urlsplit(url)
host = parts.hostname or ""

if host and "." not in host:
    host = f"{host}.{suffix}"

query = parse_qs(parts.query, keep_blank_values=True)
normalized = {}
ssl_added = False
for key, value in query.items():
    if key.lower() == "sslmode":
        normalized["sslmode"] = [value[0] or "require"]
        ssl_added = True
    else:
        normalized[key] = value
if not ssl_added:
    normalized["sslmode"] = ["require"]

rebuilt_query = urlencode(normalized, doseq=True)

if parts.port:
    netloc = f"{host}:{parts.port}"
else:
    netloc = host
if parts.username:
    auth = parts.username
    if parts.password:
        auth = f"{auth}:{parts.password}"
    netloc = f"{auth}@{netloc}"

print(urlunsplit((parts.scheme, netloc, parts.path, rebuilt_query, parts.fragment)), end="")
PY
)
  export DATABASE_URL
}

check_db_connection() {
  python3 - <<'PY'
import os, sys
import psycopg2

dsn = os.environ.get("DATABASE_URL")
if not dsn:
    sys.exit(0)

try:
    with psycopg2.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
except psycopg2.OperationalError as exc:
    sys.stderr.write(f"Database connection failed: {exc}\n")
    sys.exit(1)
PY
}

run_with_retry() {
  attempts="${RENDER_DB_RETRY_MAX:-5}"
  delay="${RENDER_DB_RETRY_DELAY:-5}"
  attempt=1
  while [ $attempt -le $attempts ]; do
    if "$@"; then
      return 0
    fi
    echo "Command '$*' failed (attempt $attempt/$attempts)."
    if [ $attempt -eq $attempts ]; then
      echo "Giving up after $attempts attempts."
      return 1
    fi
    sleep $delay
    delay=$((delay * 2))
    attempt=$((attempt + 1))
  done
}

normalize_database_url

# Ensure Render DATABASE_URL host includes region FQDN (Render sometimes omits .frankfurt-postgres.render.com)
python3 <<'PY'
import os
from urllib.parse import urlsplit, urlunsplit

db_url = os.environ.get("DATABASE_URL")
if db_url:
    split = urlsplit(db_url)
    host = split.hostname or ""
    if host.startswith("dpg-") and "." not in host:
        region = os.environ.get("DATABASE_REGION") or os.environ.get("RENDER_REGION") or "frankfurt"
        new_host = f"{host}.{region}-postgres.render.com"
        netloc = split.netloc.replace(host, new_host, 1)
        new_url = urlunsplit((split.scheme, netloc, split.path, split.query, split.fragment))
        os.environ["DATABASE_URL"] = new_url
        print(f"[prestart] Normalized DATABASE_URL host -> {new_host}")
        # Persist for downstream shell commands
        with open('.render_database_url', 'w') as fh:
            fh.write(new_url)
        print('[prestart] Wrote normalized DATABASE_URL to .render_database_url for troubleshooting')
PY

if [ -f .render_database_url ]; then
  export DATABASE_URL="$(cat .render_database_url)"
  rm .render_database_url
fi

echo "========================================="
echo "Render Prestart Script - Database Migrations"
echo "========================================="
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
# Mask credentials if present so logs don't expose secrets
echo "Target DB Host: ${DATABASE_URL}" | sed -E 's#://[^@]*@#://***@#'
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

# ==============================================================================
# MIGRATION RECOVERY: Handle partially-applied 89a67cacf69a migration
# ==============================================================================
echo ""
echo "🔍 Checking for partial migration state..."
python3 <<'PY'
import os
import sys
from sqlalchemy import create_engine, text

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("⚠️  DATABASE_URL not set - skipping recovery check")
    sys.exit(0)

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        # Check if valuation_export_logs table exists
        result = conn.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'valuation_export_logs')"
        ))
        table_exists = result.scalar()

        if not table_exists:
            print("✅ Table valuation_export_logs doesn't exist yet - no recovery needed")
            sys.exit(0)

        # Check if task_id column exists (indicator that migration was partially applied)
        result = conn.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'valuation_export_logs' AND column_name = 'task_id')"
        ))
        task_id_exists = result.scalar()

        if task_id_exists:
            # Migration was partially applied - check if it's marked as complete
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM alembic_version WHERE version_num = '89a67cacf69a')"
            ))
            migration_recorded = result.scalar()

            if not migration_recorded:
                print("⚠️  PARTIAL MIGRATION DETECTED!")
                print("   - valuation_export_logs.task_id column exists")
                print("   - But migration 89a67cacf69a not recorded in alembic_version")
                print("")
                print("🔧 Applying recovery: Marking migration as complete...")

                conn.execute(text("INSERT INTO alembic_version (version_num) VALUES ('89a67cacf69a')"))
                conn.commit()

                print("✅ Recovery complete: Migration 89a67cacf69a marked as applied")
                print("   Next: Alembic will skip 89a67cacf69a and apply 86d427f030f2")
            else:
                print("✅ Migration 89a67cacf69a already recorded - no recovery needed")
        else:
            print("✅ No partial migration detected - proceeding normally")

except Exception as e:
    print(f"⚠️  Recovery check failed: {e}")
    print("   Proceeding with normal migration (may fail if state is inconsistent)")
PY

echo ""
echo "========================================="

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
