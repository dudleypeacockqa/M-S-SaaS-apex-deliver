#!/bin/bash
# Post-deployment health check script
# Verifies that the backend is healthy after deployment

set -e

BACKEND_URL="${BACKEND_URL:-https://ma-saas-backend.onrender.com}"
MAX_RETRIES=10
RETRY_DELAY=10

echo "========================================="
echo "Post-Deployment Health Check"
echo "========================================="
echo "Backend URL: $BACKEND_URL"
echo ""

# Function to check health endpoint
check_health() {
    local response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health" || echo "000")
    local body=$(echo "$response" | head -n -1)
    local status_code=$(echo "$response" | tail -n 1)
    
    if [ "$status_code" = "200" ]; then
        echo "✅ Health check passed (HTTP $status_code)"
        echo "Response: $body"
        return 0
    else
        echo "❌ Health check failed (HTTP $status_code)"
        return 1
    fi
}

# Retry logic
attempt=1
while [ $attempt -le $MAX_RETRIES ]; do
    echo "Attempt $attempt/$MAX_RETRIES..."
    
    if check_health; then
        echo ""
        echo "========================================="
        echo "✅ Deployment Health Check: PASSED"
        echo "========================================="
        exit 0
    fi
    
    if [ $attempt -lt $MAX_RETRIES ]; then
        echo "Waiting ${RETRY_DELAY}s before retry..."
        sleep $RETRY_DELAY
    fi
    
    attempt=$((attempt + 1))
done

echo ""
echo "========================================="
echo "❌ Deployment Health Check: FAILED"
echo "========================================="
echo "Health check failed after $MAX_RETRIES attempts"
exit 1

