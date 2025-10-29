#!/bin/bash

# Smoke Test Runner
# Verifies production/staging health using lightweight API checks and backend smoke tests

set -euo pipefail

ENVIRONMENT=${1:-production}

log() {
    printf '%s\n' "$1"
}

divider() {
    log "========================================="
}

divider
log "Running Smoke Tests: ${ENVIRONMENT}"
divider
log ""

case "$ENVIRONMENT" in
    production)
        export SMOKE_TEST_BASE_URL="https://ma-saas-backend.onrender.com"
        export SMOKE_TEST_FRONTEND_URL="https://apexdeliver.com"
        ;;
    staging)
        export SMOKE_TEST_BASE_URL="https://staging-ma-saas-backend.onrender.com"
        export SMOKE_TEST_FRONTEND_URL="https://staging.apexdeliver.com"
        ;;
    *)
        log "❌ ERROR: Invalid environment '$ENVIRONMENT'"
        log "Usage: $0 [production|staging]"
        exit 1
        ;;
esac

log "Target Backend:  ${SMOKE_TEST_BASE_URL}"
log "Target Frontend: ${SMOKE_TEST_FRONTEND_URL}"
log ""

if ! command -v curl >/dev/null 2>&1; then
    log "❌ ERROR: curl is required for smoke tests"
    exit 1
fi

PYTHON_BIN=""
if command -v python >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python)"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="$(command -v python3)"
fi

if [[ -z "${PYTHON_BIN}" ]]; then
    log "❌ ERROR: python or python3 is required for smoke tests"
    exit 1
fi

if ! "${PYTHON_BIN}" -m pytest --version >/dev/null 2>&1; then
    for candidate in "./backend/venv/Scripts/python.exe" "./backend/venv/bin/python"; do
        if [[ -x "${candidate}" ]] && "${candidate}" -m pytest --version >/dev/null 2>&1; then
            PYTHON_BIN="$(cd "$(dirname "${candidate}")" && pwd)/$(basename "${candidate}")"
            break
        fi
    done

    if ! "${PYTHON_BIN}" -m pytest --version >/dev/null 2>&1; then
        log "❌ ERROR: pytest is not available. Please install backend dependencies (backend/venv)."
        exit 1
    fi
fi

log "1. Checking backend health endpoint..."
curl --fail --silent --show-error "${SMOKE_TEST_BASE_URL}/health" | "${PYTHON_BIN}" -m json.tool >/dev/null
log "   ✅ Backend health check passed"
log ""

log "2. Verifying frontend availability..."
FRONTEND_STATUS=$(curl --silent --output /dev/null --write-out "%{http_code}" --head "${SMOKE_TEST_FRONTEND_URL}" || true)

if [[ "${FRONTEND_STATUS}" =~ ^(20|30)[0-9]$ ]]; then
    log "   ✅ Frontend responded with HTTP ${FRONTEND_STATUS}"
elif [[ "${FRONTEND_STATUS}" == "403" ]]; then
    log "   ⚠️  Frontend responded with HTTP 403 (Cloudflare bot protection). Manual browser check required."
else
    log "   ❌ Frontend returned unexpected status ${FRONTEND_STATUS}"
    exit 1
fi
log ""

log "3. Running backend smoke pytest suite..."
pushd backend >/dev/null
if [[ -f "tests/smoke_tests.py" ]]; then
    "${PYTHON_BIN}" -m pytest tests/smoke_tests.py -v --tb=short
else
    log "   ⚠️  No backend smoke_tests.py found; skipping targeted smoke pytest suite."
fi
popd >/dev/null

log ""
divider
log "✅ Smoke tests completed successfully"
divider

