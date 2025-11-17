#!/bin/bash
# Verify Render Environment Variables
# Usage: ./scripts/verify-render-env.sh

set -e

echo "🔍 Verifying Render Environment Configuration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required frontend environment variables
FRONTEND_VARS=(
  "VITE_API_URL"
  "VITE_CLERK_PUBLISHABLE_KEY"
  "VITE_ENABLE_MASTER_ADMIN"
)

# Required backend environment variables
BACKEND_VARS=(
  "DATABASE_URL"
  "CLERK_SECRET_KEY"
  "CLERK_PUBLISHABLE_KEY"
  "STRIPE_SECRET_KEY"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
)

check_frontend_env() {
  echo "📱 Frontend Environment Variables:"
  echo "=================================="

  for var in "${FRONTEND_VARS[@]}"; do
    if [ -z "${!var}" ]; then
      echo -e "${RED}❌ $var${NC} - NOT SET"
    else
      echo -e "${GREEN}✅ $var${NC} - SET"
    fi
  done
  echo ""
}

check_backend_env() {
  echo "🔧 Backend Environment Variables:"
  echo "=================================="

  for var in "${BACKEND_VARS[@]}"; do
    if [ -z "${!var}" ]; then
      echo -e "${RED}❌ $var${NC} - NOT SET"
    else
      echo -e "${GREEN}✅ $var${NC} - SET"
    fi
  done
  echo ""
}

check_build() {
  echo "🏗️  Testing Frontend Build:"
  echo "=================================="

  cd frontend

  if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: VITE_CLERK_PUBLISHABLE_KEY not set${NC}"
    echo "   This will cause blank screens in production!"
    echo ""
  fi

  echo "Running build..."
  npm run build > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build succeeded${NC}"
  else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
  fi

  # Check if index.html exists
  if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ dist/index.html exists${NC}"
  else
    echo -e "${RED}❌ dist/index.html missing${NC}"
    exit 1
  fi

  cd ..
  echo ""
}

check_render_services() {
  echo "🌐 Checking Render Services:"
  echo "=================================="

  # Check frontend
  FRONTEND_URL="https://ma-saas-frontend.onrender.com"
  echo "Testing $FRONTEND_URL..."

  if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend service responding${NC}"
  else
    echo -e "${RED}❌ Frontend service not responding${NC}"
  fi

  # Check backend
  BACKEND_URL="https://ma-saas-backend.onrender.com/health"
  echo "Testing $BACKEND_URL..."

  if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Backend service responding${NC}"
  else
    echo -e "${RED}❌ Backend service not responding${NC}"
  fi

  echo ""
}

print_summary() {
  echo "📋 Summary:"
  echo "=================================="
  echo ""
  echo "If you see blank screens on Render:"
  echo ""
  echo "1. ✅ Verify VITE_CLERK_PUBLISHABLE_KEY is set in Render dashboard"
  echo "2. ✅ Trigger manual redeploy after setting env vars"
  echo "3. ✅ Check browser console (F12) for errors"
  echo "4. ✅ Hard refresh (Ctrl+Shift+R) to clear cache"
  echo ""
  echo "See docs/deployments/RENDER-BLANK-SCREEN-FIX.md for detailed guide."
  echo ""
}

# Main execution
check_frontend_env
check_backend_env
check_build
check_render_services
print_summary

echo -e "${GREEN}✅ Environment verification complete!${NC}"
