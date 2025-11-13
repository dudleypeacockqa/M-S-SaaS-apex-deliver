#!/bin/bash

###############################################################################
# Local Accessibility & Performance Audit Script
#
# This script automates running Lighthouse and Axe accessibility tests
# against a local Vite preview server.
#
# Usage:
#   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
#
# Requirements:
#   - Node.js and npm installed
#   - lighthouse and @axe-core/cli installed (via npm install)
#   - VITE_CLERK_PUBLISHABLE_KEY environment variable set
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PREVIEW_HOST="0.0.0.0"
PREVIEW_PORT="4173"
PRIMARY_URL=${AUDIT_PREVIEW_URL:-"http://127.0.0.1:${PREVIEW_PORT}"}
FALLBACK_URL=${AUDIT_PREVIEW_FALLBACK:-"http://localhost:${PREVIEW_PORT}"}
PREVIEW_CMD=${AUDIT_PREVIEW_CMD:-"npm run preview:test"}
REPORT_DIR="docs/testing"
# Allow overriding via AUDIT_WAIT_SECONDS env (defaults to 60s to account for cold builds)
MAX_WAIT_TIME=${AUDIT_WAIT_SECONDS:-60}

# Print banner
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  M&A Platform - Local Audit Runner${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Validation: Check if VITE_CLERK_PUBLISHABLE_KEY is set
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
    echo -e "${RED}ERROR: VITE_CLERK_PUBLISHABLE_KEY environment variable is not set${NC}"
    echo ""
    echo "Usage:"
    echo "  VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh"
    echo ""
    exit 1
fi

# Validation: Check if we're in the project root
if [ ! -d "frontend" ]; then
    echo -e "${RED}ERROR: Must run from project root directory${NC}"
    exit 1
fi

# Create report directory if it doesn't exist
mkdir -p "$REPORT_DIR"

# Navigate to frontend directory
cd frontend

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install --include=dev --silent

echo -e "${YELLOW}Step 2: Building frontend for preview...${NC}"
npm run build

# Start preview server in background
echo -e "${YELLOW}Step 3: Starting preview server on ${PREVIEW_HOST}:${PREVIEW_PORT}...${NC}"
echo "  Command: ${PREVIEW_CMD}"
(
  export VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
  bash -lc "$PREVIEW_CMD"
) &
SERVER_PID=$!

# Function to cleanup on exit
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        echo -e "\n${YELLOW}Cleaning up: Stopping preview server (PID: $SERVER_PID)...${NC}"
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
}

# Register cleanup function to run on script exit
trap cleanup EXIT INT TERM

# Wait for server to be ready
echo -e "${YELLOW}Step 4: Waiting for server to start...${NC}"
ELAPSED=0
ACTIVE_URL=""
while true; do
    if curl -sf "$PRIMARY_URL" > /dev/null 2>&1; then
        ACTIVE_URL="$PRIMARY_URL"
        break
    fi

    if [ "$FALLBACK_URL" != "$PRIMARY_URL" ] && curl -sf "$FALLBACK_URL" > /dev/null 2>&1; then
        ACTIVE_URL="$FALLBACK_URL"
        break
    fi

    if [ $ELAPSED -ge $MAX_WAIT_TIME ]; then
        echo -e "${RED}ERROR: Server failed to start within ${MAX_WAIT_TIME} seconds${NC}"
        exit 1
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
    echo -n "."
done
echo ""
echo -e "${GREEN}Server is ready at ${ACTIVE_URL}!${NC}"
echo ""

# Run Lighthouse audit
echo -e "${YELLOW}Step 5: Running Lighthouse performance audit...${NC}"
echo "  URL: $ACTIVE_URL"
echo "  Report: ${REPORT_DIR}/lighthouse-report.html"

npx lighthouse "$ACTIVE_URL" \
    --output html \
    --output json \
    --output-path="../${REPORT_DIR}/lighthouse-report.html" \
    --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
    --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lighthouse audit completed successfully${NC}"
else
    echo -e "${RED}✗ Lighthouse audit failed${NC}"
fi

echo ""

# Run Axe accessibility audit
echo -e "${YELLOW}Step 6: Running Axe accessibility audit...${NC}"
echo "  URL: $ACTIVE_URL"
echo "  Report: ${REPORT_DIR}/axe-report.json"

npx axe "$ACTIVE_URL" \
    --load-delay 5000 \
    --timeout 60000 \
    --save "../${REPORT_DIR}/axe-report.json" \
    --chrome-options="no-sandbox,disable-dev-shm-usage" \
    2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Axe accessibility audit completed successfully${NC}"
else
    echo -e "${RED}✗ Axe accessibility audit failed (check output above)${NC}"
fi

echo ""

# Parse and display summary from Lighthouse JSON report
if [ -f "../${REPORT_DIR}/lighthouse-report.json" ]; then
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Lighthouse Score Summary${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Extract scores using grep and awk (works on most systems)
    PERF=$(grep -o '"performance":[0-9.]*' "../${REPORT_DIR}/lighthouse-report.json" | head -1 | awk -F':' '{print int($2*100)}')
    ACCESS=$(grep -o '"accessibility":[0-9.]*' "../${REPORT_DIR}/lighthouse-report.json" | head -1 | awk -F':' '{print int($2*100)}')
    BEST=$(grep -o '"best-practices":[0-9.]*' "../${REPORT_DIR}/lighthouse-report.json" | head -1 | awk -F':' '{print int($2*100)}')
    SEO=$(grep -o '"seo":[0-9.]*' "../${REPORT_DIR}/lighthouse-report.json" | head -1 | awk -F':' '{print int($2*100)}')

    echo "  Performance:       ${PERF}%"
    echo "  Accessibility:     ${ACCESS}%"
    echo "  Best Practices:    ${BEST}%"
    echo "  SEO:               ${SEO}%"
    echo ""
fi

# Display Axe summary
if [ -f "../${REPORT_DIR}/axe-report.json" ]; then
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Axe Accessibility Summary${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Count violations by severity
    CRITICAL=$(grep -o '"impact":"critical"' "../${REPORT_DIR}/axe-report.json" | wc -l)
    SERIOUS=$(grep -o '"impact":"serious"' "../${REPORT_DIR}/axe-report.json" | wc -l)
    MODERATE=$(grep -o '"impact":"moderate"' "../${REPORT_DIR}/axe-report.json" | wc -l)
    MINOR=$(grep -o '"impact":"minor"' "../${REPORT_DIR}/axe-report.json" | wc -l)

    echo "  Critical:   ${CRITICAL}"
    echo "  Serious:    ${SERIOUS}"
    echo "  Moderate:   ${MODERATE}"
    echo "  Minor:      ${MINOR}"
    echo ""
fi

# Final summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Audit Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Reports saved to:"
echo "  - ${REPORT_DIR}/lighthouse-report.html (open in browser)"
echo "  - ${REPORT_DIR}/lighthouse-report.json (machine-readable)"
echo "  - ${REPORT_DIR}/axe-report.json (accessibility violations)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Open lighthouse-report.html in your browser to view detailed results"
echo "  2. Review axe-report.json for accessibility violations"
echo "  3. Address any critical/serious issues before deployment"
echo ""

# Return to project root
cd ..

exit 0
