#!/bin/bash

# Smoke Test Runner
# Runs automated smoke tests against production or staging environment

set -e  # Exit on error

ENVIRONMENT=${1:-production}

echo "========================================="
echo "Running Smoke Tests: $ENVIRONMENT"
echo "========================================="
echo ""

# Set environment variables based on target
if [ "$ENVIRONMENT" = "production" ]; then
    export SMOKE_TEST_BASE_URL="https://ma-saas-backend.onrender.com"
    export SMOKE_TEST_FRONTEND_URL="https://apexdeliver.com"
elif [ "$ENVIRONMENT" = "staging" ]; then
    export SMOKE_TEST_BASE_URL="https://staging-ma-saas-backend.onrender.com"
    export SMOKE_TEST_FRONTEND_URL="https://staging.apexdeliver.com"
else
    echo "❌ ERROR: Invalid environment '$ENVIRONMENT'"
    echo "Usage: $0 [production|staging]"
    exit 1
fi

echo "Target Backend:  $SMOKE_TEST_BASE_URL"
echo "Target Frontend: $SMOKE_TEST_FRONTEND_URL"
echo ""

# Navigate to backend directory
cd backend

# Run smoke tests
echo "Running pytest smoke tests..."
python -m pytest tests/smoke_tests.py -v --tb=short

echo ""
echo "========================================="
echo "✅ Smoke tests completed"
echo "========================================="
