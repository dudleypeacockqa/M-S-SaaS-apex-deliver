#!/usr/bin/env python3
"""
Set Missing Environment Variables in Render Frontend Service

This script sets the VITE_CLERK_PUBLISHABLE_KEY environment variable
in the Render frontend service to fix the blank screen issue.

Root Cause:
- main.tsx checks for VITE_CLERK_PUBLISHABLE_KEY
- If missing, app renders WITHOUT ClerkProvider
- All authenticated routes require Clerk context → blank screens

Fix:
- Set VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k
- Trigger redeploy to rebuild with env var
"""

import os
import sys
import requests

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")
FRONTEND_SERVICE_ID = "srv-d3ii7jjipnbc73e7chhg"  # ma-saas-frontend (static site)

CLERK_PUBLISHABLE_KEY = "pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k"

def get_service_details(service_id: str) -> dict:
    """Get current service configuration."""
    url = f"https://api.render.com/v1/services/{service_id}"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def update_env_vars(service_id: str, env_vars: dict) -> dict:
    """Update environment variables for a service."""
    url = f"https://api.render.com/v1/services/{service_id}/env-vars"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    # Format env vars for Render API
    env_var_list = [
        {
            "key": key,
            "value": value
        }
        for key, value in env_vars.items()
    ]

    response = requests.put(url, headers=headers, json=env_var_list)
    response.raise_for_status()
    return response.json()

def trigger_deploy(service_id: str) -> dict:
    """Trigger a new deployment."""
    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "clearCache": "clear"  # Clear build cache to force fresh build
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

def main():
    print("=" * 80)
    print("Render Environment Variable Fix Script")
    print("=" * 80)
    print()

    # Step 1: Get current service details
    print(f"1. Fetching current service details for {FRONTEND_SERVICE_ID}...")
    try:
        service = get_service_details(FRONTEND_SERVICE_ID)
        print(f"   ✅ Service: {service['service']['name']}")
        print(f"   📍 URL: {service['service']['serviceDetails']['url']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return 1

    print()

    # Step 2: Update environment variables
    print("2. Setting VITE_CLERK_PUBLISHABLE_KEY environment variable...")
    env_vars_to_set = {
        "VITE_CLERK_PUBLISHABLE_KEY": CLERK_PUBLISHABLE_KEY,
        "VITE_API_URL": "https://ma-saas-backend.onrender.com",
        "VITE_ENABLE_MASTER_ADMIN": "true",
    }

    try:
        result = update_env_vars(FRONTEND_SERVICE_ID, env_vars_to_set)
        print("   ✅ Environment variables set:")
        for key in env_vars_to_set:
            # Mask the Clerk key for security
            display_value = env_vars_to_set[key]
            if "CLERK" in key:
                display_value = f"{display_value[:15]}...{display_value[-5:]}"
            print(f"      - {key}={display_value}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return 1

    print()

    # Step 3: Trigger deployment
    print("3. Triggering new deployment with environment variables...")
    try:
        deploy = trigger_deploy(FRONTEND_SERVICE_ID)
        deploy_id = deploy.get('id', 'unknown')
        print(f"   ✅ Deployment triggered: {deploy_id}")
        print(f"   🔗 Monitor at: https://dashboard.render.com/static/{FRONTEND_SERVICE_ID}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return 1

    print()
    print("=" * 80)
    print("🎉 Fix Applied Successfully!")
    print("=" * 80)
    print()
    print("Next Steps:")
    print("1. Wait 2-3 minutes for deployment to complete")
    print("2. Check https://ma-saas-platform.onrender.com")
    print("3. Verify landing page loads correctly")
    print("4. Test sign-in functionality")
    print()
    print("Expected Fix:")
    print("- Clerk authentication will now work in production")
    print("- Blank screens will be replaced with proper UI")
    print("- All authenticated routes will function correctly")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
