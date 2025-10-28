#!/bin/bash
# ==============================================================================
# Smoke Test Runner Script
# ==============================================================================
# Purpose: Run automated smoke tests against production/staging environment
# Usage: ./scripts/run_smoke_tests.sh [environment]
#
# Arguments:
#   environment: "production" (default) or "staging"
#
# Examples:
#   ./scripts/run_smoke_tests.sh                # Test production
#   ./scripts/run_smoke_tests.sh staging       # Test staging
#
# Exit Codes:
#   0 = All tests passed
#   1 = One or more tests failed
# ==============================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# Configuration
# ==============================================================================

ENVIRONMENT=${1:-production}

case $ENVIRONMENT in
    production)
        export SMOKE_TEST_URL="https://ma-saas-backend.onrender.com"
        export FRONTEND_URL="https://100daysandbeyond.com"
        ;;
    staging)
        export SMOKE_TEST_URL="https://ma-saas-backend-staging.onrender.com"
        export FRONTEND_URL="https://staging.100daysandbeyond.com"
        ;;
    local)
        export SMOKE_TEST_URL="http://localhost:8000"
        export FRONTEND_URL="http://localhost:5173"
        ;;
    *)
        echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
        echo "Valid options: production, staging, local"
        exit 1
        ;;
esac

# ==============================================================================
# Banner
# ==============================================================================

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Smoke Test Runner${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Backend URL:${NC} $SMOKE_TEST_URL"
echo -e "${BLUE}Frontend URL:${NC} $FRONTEND_URL"
echo -e "${BLUE}===============================================${NC}"
echo ""

# ==============================================================================
# Pre-flight Checks
# ==============================================================================

echo -e "${YELLOW}Pre-flight checks...${NC}"

# Check pytest is installed
if ! command -v pytest &> /dev/null; then
    echo -e "${RED}✗ pytest not found${NC}"
    echo "Install pytest: pip install pytest pytest-asyncio httpx"
    exit 1
fi
echo -e "${GREEN}✓ pytest installed${NC}"

# Check backend is reachable
echo -e "${YELLOW}Testing connection to ${SMOKE_TEST_URL}...${NC}"
if curl --output /dev/null --silent --head --fail "$SMOKE_TEST_URL/health"; then
    echo -e "${GREEN}✓ Backend is reachable${NC}"
else
    echo -e "${RED}✗ Backend is NOT reachable${NC}"
    echo "Check that $SMOKE_TEST_URL is accessible"
    exit 1
fi

echo ""

# ==============================================================================
# Run Smoke Tests
# ==============================================================================

echo -e "${BLUE}Running smoke tests...${NC}"
echo ""

# Run pytest with verbose output
cd backend || exit 1
pytest tests/smoke_tests.py -v --tb=short

TEST_EXIT_CODE=$?

# ==============================================================================
# Results
# ==============================================================================

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ SMOKE TESTS PASSED                    ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🚀 Production deployment: SAFE TO PROCEED${NC}"
    echo -e "${GREEN}   All critical systems operational${NC}"
    echo ""
else
    echo -e "${RED}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ SMOKE TESTS FAILED                    ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}🛑 Production deployment: DO NOT PROCEED${NC}"
    echo -e "${RED}   Fix failing tests before deploying${NC}"
    echo ""
fi

exit $TEST_EXIT_CODE
