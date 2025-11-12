#!/usr/bin/env python3
"""
Update backend DATABASE_URL environment variable via Render API.

This script updates the ma-saas-backend service's DATABASE_URL to use the full
External Database URL with proper hostname suffix.
"""

import os
import sys
import requests
from typing import Optional

# Render API configuration
RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
RENDER_API_BASE = "https://api.render.com/v1"
BACKEND_SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"  # ma-saas-backend

# Correct External Database URL from screenshot
CORRECT_DATABASE_URL = (
    "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@"
    "dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"
)

def get_service_env_vars(service_id: str) -> Optional[dict]:
    """Fetch current environment variables for a service."""
    url = f"{RENDER_API_BASE}/services/{service_id}/env-vars"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {RENDER_API_KEY}"
    }

    print(f"[*] Fetching environment variables for service {service_id}...")
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        env_vars = response.json()
        print(f"[OK] Successfully fetched {len(env_vars)} environment variables")
        return env_vars
    else:
        print(f"[ERROR] Failed to fetch env vars: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def update_env_var(service_id: str, key: str, value: str) -> bool:
    """Update a specific environment variable."""
    url = f"{RENDER_API_BASE}/services/{service_id}/env-vars/{key}"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "value": value
    }

    print(f"\n[*] Updating {key}...")
    response = requests.put(url, headers=headers, json=payload)

    if response.status_code == 200:
        print(f"[OK] Successfully updated {key}")
        return True
    else:
        print(f"[ERROR] Failed to update {key}: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def trigger_deploy(service_id: str) -> Optional[dict]:
    """Trigger a manual deploy for the service."""
    url = f"{RENDER_API_BASE}/services/{service_id}/deploys"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "clearCache": "do_not_clear"
    }

    print(f"\n[*] Triggering deploy for service {service_id}...")
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code in (200, 201):
        deploy_info = response.json()
        print(f"[OK] Deploy triggered successfully")
        print(f"   Deploy ID: {deploy_info.get('id', 'unknown')}")
        print(f"   Status: {deploy_info.get('status', 'unknown')}")
        return deploy_info
    else:
        print(f"[ERROR] Failed to trigger deploy: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def main():
    """Main execution flow."""
    print("=" * 80)
    print("Render Backend DATABASE_URL Update Script")
    print("=" * 80)

    # Step 1: Fetch current env vars
    env_vars = get_service_env_vars(BACKEND_SERVICE_ID)
    if not env_vars:
        print("\n[ERROR] Cannot proceed without current env vars")
        return 1

    # Step 2: Check current DATABASE_URL
    current_database_url = None
    for env_var in env_vars:
        if env_var.get('key') == 'DATABASE_URL':
            current_database_url = env_var.get('value', '')
            break

    if not current_database_url:
        print("\n[WARN] DATABASE_URL not found in environment variables!")
    else:
        print(f"\n[INFO] Current DATABASE_URL:")
        # Mask password for security
        masked_url = current_database_url.replace('iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t', '***MASKED***')
        print(f"   {masked_url}")

        if 'frankfurt-postgres.render.com' in current_database_url:
            print("   [OK] Already has correct hostname suffix")
        else:
            print("   [WARN] Missing hostname suffix - needs update")

    # Step 3: Update DATABASE_URL
    print(f"\n[INFO] New DATABASE_URL:")
    masked_new_url = CORRECT_DATABASE_URL.replace('iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t', '***MASKED***')
    print(f"   {masked_new_url}")

    if current_database_url == CORRECT_DATABASE_URL:
        print("\n[OK] DATABASE_URL already correct - no update needed")
    else:
        success = update_env_var(BACKEND_SERVICE_ID, 'DATABASE_URL', CORRECT_DATABASE_URL)
        if not success:
            print("\n[ERROR] Failed to update DATABASE_URL")
            return 1

    # Step 4: Trigger redeploy
    deploy_info = trigger_deploy(BACKEND_SERVICE_ID)
    if not deploy_info:
        print("\n[ERROR] Failed to trigger deploy")
        return 1

    print("\n" + "=" * 80)
    print("[OK] SUCCESS: DATABASE_URL updated and deploy triggered")
    print("=" * 80)
    print(f"\n[INFO] Next steps:")
    print(f"   1. Monitor deploy status: {deploy_info.get('id', 'unknown')}")
    print(f"   2. Check Render dashboard for progress")
    print(f"   3. Run verification scripts once deploy is live")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
