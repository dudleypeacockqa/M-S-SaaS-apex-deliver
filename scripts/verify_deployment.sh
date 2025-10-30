#!/bin/bash
# Comprehensive deployment verification for Phase 1 critical blockers
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-https://ma-saas-backend.onrender.com}"
FRONTEND_URL="${FRONTEND_URL:-https://100daysandbeyond.com}"
PASSED=0
FAILED=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local check_content="${4:-}"

    printf "Testing %-40s ... " "$name"

    response=$(curl -s -w "\n%{http_code}" "$url")
    status=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)

    if [ "$status" -eq "$expected_status" ]; then
        if [ -n "$check_content" ] && ! echo "$body" | grep -q "$check_content"; then
            printf "${YELLOW}⚠ WARN${NC} (HTTP $status but content missing)\n"
            WARNINGS=$((WARNINGS + 1))
        else
            printf "${GREEN}✓ PASS${NC} (HTTP $status)\n"
            PASSED=$((PASSED + 1))
        fi
    else
        printf "${RED}✗ FAIL${NC} (Expected $expected_status, got $status)\n"
        FAILED=$((FAILED + 1))
        [ -n "$body" ] && echo "  Response: ${body:0:200}"
    fi
}

echo "=============================================="
echo "  Deployment Verification - Phase 1"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo "=============================================="
echo ""

# Core Health Checks
echo "--- Core Health Checks ---"
test_endpoint "Backend Health" "$BACKEND_URL/health" 200 "healthy"
test_endpoint "Frontend Home" "$FRONTEND_URL" 200

# Phase 1.1: Blog API
echo ""
echo "--- Phase 1.1: Blog API ---"
test_endpoint "Blog Listing" "$BACKEND_URL/api/blog?limit=5" 200 "title"
test_endpoint "Blog Categories" "$BACKEND_URL/api/blog/categories/list" 200
test_endpoint "Blog Post (slug)" "$BACKEND_URL/api/blog/the-complete-guide-to-m-a-deal-flow-management-in-2025" 200 "M&A"
test_endpoint "Blog Post Count" "$BACKEND_URL/api/blog?limit=100" 200

# Phase 1.2: Contact Form Endpoint
echo ""
echo "--- Phase 1.2: Contact Form ---"
test_endpoint "Contact Endpoint (GET=405)" "$BACKEND_URL/api/marketing/contact" 405

# Phase 1.3: Newsletter Endpoint
echo ""
echo "--- Phase 1.3: Newsletter ---"
test_endpoint "Subscribe Endpoint (GET=405)" "$BACKEND_URL/api/marketing/subscribe" 405

# Database Schema Verification
echo ""
echo "--- Database Verification ---"
# Check if blog_posts table has data
blog_count=$(curl -s "$BACKEND_URL/api/blog?limit=1" | grep -c "id" || echo "0")
if [ "$blog_count" -gt 0 ]; then
    printf "Blog Posts in Database          ... ${GREEN}✓ PASS${NC} (Data present)\n"
    PASSED=$((PASSED + 1))
else
    printf "Blog Posts in Database          ... ${RED}✗ FAIL${NC} (No data)\n"
    FAILED=$((FAILED + 1))
fi

# Frontend Integration Checks
echo ""
echo "--- Frontend Integration ---"
test_endpoint "Contact Page" "$FRONTEND_URL/contact" 200
test_endpoint "Blog Page" "$FRONTEND_URL/blog" 200
test_endpoint "Pricing Page" "$FRONTEND_URL/pricing" 200

echo ""
echo "=============================================="
echo "  Results: $PASSED passed, $FAILED failed, $WARNINGS warnings"
echo "=============================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CRITICAL TESTS PASSED${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED CRITICAL TESTS FAILED${NC}"
    exit 1
fi
