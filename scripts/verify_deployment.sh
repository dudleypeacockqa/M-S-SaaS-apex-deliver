#!/bin/bash
# ============================================================================
# Deployment Verification Script - Database Recovery Edition
# ============================================================================
# PROJECT: M&A Intelligence Platform
# PURPOSE: Verify production deployment health after database recovery
# DATE: 2025-11-10
# ============================================================================
set -euo pipefail

# Configuration
BACKEND_URL="${BACKEND_URL:-https://ma-saas-backend.onrender.com}"
FRONTEND_URL="${FRONTEND_URL:-https://100daysandbeyond.com}"
PASSED=0
FAILED=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Database Schema Verification (CRITICAL for UUID recovery)
echo ""
echo -e "${BLUE}--- Database Schema Verification (POST-RECOVERY) ---${NC}"

# Check if DATABASE_URL is set for direct DB checks
if [ -z "${DATABASE_URL:-}" ]; then
    echo -e "${YELLOW}⚠ DATABASE_URL not set - skipping direct DB checks${NC}"
    echo "  Set with: export DATABASE_URL='postgresql://user:pass@host/db'"
    WARNINGS=$((WARNINGS + 1))
else
    # Check alembic_version
    printf "Alembic Version (should be dc2c0f69c1b1) ... "
    alembic_ver=$(psql "$DATABASE_URL" -t -c "SELECT version_num FROM alembic_version;" 2>&1 | tr -d ' \n')
    if [ "$alembic_ver" = "dc2c0f69c1b1" ]; then
        printf "${GREEN}✓ PASS${NC} ($alembic_ver)\n"
        PASSED=$((PASSED + 1))
    else
        printf "${RED}✗ FAIL${NC} (Got: $alembic_ver)\n"
        FAILED=$((FAILED + 1))
    fi

    # Check users.id type (should be VARCHAR after recovery)
    printf "users.id Type (should be VARCHAR(36))   ... "
    users_id_type=$(psql "$DATABASE_URL" -t -c "SELECT data_type || '(' || character_maximum_length || ')' FROM information_schema.columns WHERE table_name='users' AND column_name='id';" 2>&1 | tr -d ' \n')
    if [[ "$users_id_type" == *"varchar(36)"* ]]; then
        printf "${GREEN}✓ PASS${NC} ($users_id_type)\n"
        PASSED=$((PASSED + 1))
    else
        printf "${RED}✗ FAIL${NC} ($users_id_type - UUID not converted!)\n"
        FAILED=$((FAILED + 1))
    fi

    # Check organizations.id type
    printf "organizations.id Type (should be VARCHAR(36)) ... "
    orgs_id_type=$(psql "$DATABASE_URL" -t -c "SELECT data_type || '(' || character_maximum_length || ')' FROM information_schema.columns WHERE table_name='organizations' AND column_name='id';" 2>&1 | tr -d ' \n')
    if [[ "$orgs_id_type" == *"varchar(36)"* ]]; then
        printf "${GREEN}✓ PASS${NC} ($orgs_id_type)\n"
        PASSED=$((PASSED + 1))
    else
        printf "${RED}✗ FAIL${NC} ($orgs_id_type - UUID not converted!)\n"
        FAILED=$((FAILED + 1))
    fi

    # Check for required tables
    required_tables=("folders" "pipeline_templates" "pipeline_template_stages" "rbac_audit_logs")
    for table in "${required_tables[@]}"; do
        printf "Required Table: %-30s ... " "$table"
        table_exists=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='$table');" 2>&1 | tr -d ' \n')
        if [ "$table_exists" = "t" ]; then
            printf "${GREEN}✓ PASS${NC}\n"
            PASSED=$((PASSED + 1))
        else
            printf "${RED}✗ FAIL${NC} (Missing - migrations not applied!)\n"
            FAILED=$((FAILED + 1))
        fi
    done
fi

# Check if blog_posts table has data
echo ""
echo "--- Application Data Verification ---"
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
