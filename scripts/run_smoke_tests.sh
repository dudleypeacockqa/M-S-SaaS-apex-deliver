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

log "1. Checking backend health endpoint..."
curl --fail --silent --show-error "${SMOKE_TEST_BASE_URL}/health" | python -m json.tool >/dev/null
log "   ✅ Backend health check passed"
log ""

log "2. Verifying frontend availability..."
curl --fail --silent --show-error --head "${SMOKE_TEST_FRONTEND_URL}" >/dev/null
log "   ✅ Frontend responded with HTTP 2xx/3xx"
log ""

log "3. Running backend smoke pytest suite..."
pushd backend >/dev/null
python -m pytest tests/smoke_tests.py -v --tb=short
popd >/dev/null

log ""
divider
log "✅ Smoke tests completed successfully"
divider
