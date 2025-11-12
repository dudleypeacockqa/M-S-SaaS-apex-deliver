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

check_db_connection() {
  python3 - <<'PY'
import os, sys
import psycopg2

dsn = os.environ["DATABASE_URL"]
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

alembic_upgrade() {
  alembic upgrade head
}

normalize_database_url
run_with_retry check_db_connection

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

run_with_retry alembic_upgrade

echo "✅ Migrations applied successfully"
alembic current

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
