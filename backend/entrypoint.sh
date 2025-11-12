#!/bin/sh
# Entrypoint script for Render deployment
# Handles database migrations before starting the application

set -e  # Exit on error

normalize_database_url() {
  if [ -z "${DATABASE_URL:-}" ]; then
    return
  fi

  case "$DATABASE_URL" in
    DATABASE_URL=*)
      DATABASE_URL="${DATABASE_URL#DATABASE_URL=}"
      ;;
  esac

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

raw = os.environ["DATABASE_URL"].strip()
if raw.upper().startswith("DATABASE_URL="):
    raw = raw.split("=", 1)[1].strip()
dsn = raw
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

# Run migrations (alembic will handle the state automatically)
echo "Running database migrations..."
run_with_retry alembic_upgrade

echo "✅ Migrations applied successfully"
alembic current

echo "========================================="
echo "Starting uvicorn server..."
echo "========================================="

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
