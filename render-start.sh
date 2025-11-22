#!/usr/bin/env bash
# Wrapper script invoked by Render's dashboard-level start command.
# It simply delegates to the backend's render-start.sh so we keep all startup
# logic colocated with the API codebase.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${REPO_ROOT}/backend"
BACKEND_SCRIPT="${BACKEND_DIR}/render-start.sh"

echo "[render-start] Starting backend via ${BACKEND_SCRIPT}"

if [ ! -f "${BACKEND_SCRIPT}" ]; then
  echo "[render-start] ERROR: backend/render-start.sh not found" >&2
  exit 1
fi

cd "${BACKEND_DIR}"

# Ensure required scripts are executable (Render can strip +x bits).
chmod +x render-start.sh entrypoint.sh prestart.sh

# Delegate to backend start script (which runs migrations + uvicorn).
exec "${BACKEND_SCRIPT}" "$@"
