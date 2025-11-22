#!/bin/bash
# Run Full Test Suite Baseline - TDD RED/GREEN Verification
# BMAD Wave 0: Establish accurate test state before fixes

set -e

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
LOG_DIR="docs/tests"
mkdir -p "$LOG_DIR"

echo "================================================================================"
echo "BMAD Wave 0: Test Suite Baseline (TDD RED/GREEN State)"
echo "================================================================================"
echo "Timestamp: $TIMESTAMP"
echo ""

# Backend pytest baseline
echo "Step 1: Running backend pytest suite..."
cd backend
if [ -f "venv/Scripts/python.exe" ]; then
    PYTHON="venv/Scripts/python.exe"
elif [ -f "venv/bin/python" ]; then
    PYTHON="venv/bin/python"
else
    PYTHON="python"
fi

"$PYTHON" -m pytest tests/ \
    --tb=short \
    --maxfail=10 \
    -v \
    2>&1 | tee "../$LOG_DIR/2025-11-22-backend-pytest-baseline.txt"

cd ..

echo ""
echo "Step 2: Running frontend Vitest suite..."
cd frontend
npm run test -- --run --reporter=verbose 2>&1 | tee "../$LOG_DIR/2025-11-22-frontend-vitest-baseline.txt" || true
cd ..

echo ""
echo "================================================================================"
echo "Baseline Complete - Check logs in $LOG_DIR/"
echo "================================================================================"

