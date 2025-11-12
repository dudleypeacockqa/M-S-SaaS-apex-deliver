#!/bin/bash
# Render prestart script - runs before starting the FastAPI application
# This script is executed from the repository root directory
# Purpose: Apply Alembic database migrations before app starts

set -e  # Exit on any error

normalize_database_url() {
  if [ -z "${DATABASE_URL:-}" ]; then
    return
  fi

  if printf '%s' "$DATABASE_URL" | grep -q "@dpg-" && ! printf '%s' "$DATABASE_URL" | grep -q "\.render\.com"; then
    echo "Normalizing DATABASE_URL host for Render public endpoint..."
    local suffix="${RENDER_DB_DOMAIN_SUFFIX:-frankfurt-postgres.render.com}"
    DATABASE_URL=$(DB_URL_TMP="$DATABASE_URL" RENDER_DB_DOMAIN_SUFFIX="$suffix" python - <<'PY'
import os
from urllib.parse import urlsplit, urlunsplit

url = os.environ["DB_URL_TMP"]
suffix = os.environ["RENDER_DB_DOMAIN_SUFFIX"]
parts = urlsplit(url)
host = parts.hostname or ""
if host and "." not in host:
    host = f"{host}.{suffix}"
if parts.port:
    netloc = f"{host}:{parts.port}"
else:
    netloc = host
if parts.username:
    auth = parts.username
    if parts.password:
        auth = f"{auth}:{parts.password}"
    netloc = f"{auth}@{netloc}"
print(urlunsplit((parts.scheme, netloc, parts.path, parts.query, parts.fragment)), end="")
PY
)
    export DATABASE_URL
  fi
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
echo "Target DB Host: ${DATABASE_URL}" | sed 's/:.*@/://'
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
