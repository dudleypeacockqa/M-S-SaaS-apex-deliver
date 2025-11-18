#!/bin/bash
# Full Test Suite Execution Script
# Runs all test suites and generates coverage reports

set -e

echo "=========================================="
echo "Full Test Suite Execution"
echo "Date: $(date)"
echo "=========================================="

# Backend Tests
echo ""
echo "--- Backend Test Suite ---"
cd backend
if [ -d "venv" ]; then
    source venv/Scripts/activate 2>/dev/null || source venv/bin/activate
fi

python -m pytest tests/ \
    --cov=app \
    --cov-report=term \
    --cov-report=html \
    --cov-report=json \
    --maxfail=5 \
    -v \
    > ../docs/tests/backend-test-results-$(date +%Y-%m-%d).txt 2>&1

BACKEND_EXIT=$?

# Frontend Tests
echo ""
echo "--- Frontend Test Suite ---"
cd ../frontend
npm run test -- --run --coverage \
    > ../docs/tests/frontend-test-results-$(date +%Y-%m-%d).txt 2>&1

FRONTEND_EXIT=$?

# Master Admin Tests
echo ""
echo "--- Master Admin Test Suite ---"
cd ../backend
python -m pytest tests/master_admin/ \
    -v \
    > ../docs/tests/master-admin-test-results-$(date +%Y-%m-%d).txt 2>&1

MASTER_ADMIN_EXIT=$?

# Summary
echo ""
echo "=========================================="
echo "Test Suite Summary"
echo "=========================================="
echo "Backend: $([ $BACKEND_EXIT -eq 0 ] && echo 'PASS' || echo 'FAIL')"
echo "Frontend: $([ $FRONTEND_EXIT -eq 0 ] && echo 'PASS' || echo 'FAIL')"
echo "Master Admin: $([ $MASTER_ADMIN_EXIT -eq 0 ] && echo 'PASS' || echo 'FAIL')"
echo "=========================================="

if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ] && [ $MASTER_ADMIN_EXIT -eq 0 ]; then
    echo "✅ All test suites passed!"
    exit 0
else
    echo "❌ Some test suites failed. Check logs in docs/tests/"
    exit 1
fi

