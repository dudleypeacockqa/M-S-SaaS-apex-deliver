#!/bin/sh
# Entrypoint script for Render deployment
# Handles database migrations before starting the application

set -e  # Exit on error

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

normalize_database_url

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
