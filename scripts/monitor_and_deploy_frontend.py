#!/usr/bin/env python3
"""
Monitor backend deployment and trigger frontend deployment.

This script:
1. Monitors the backend deployment status
2. Once backend is live, triggers frontend deployment
3. Monitors frontend deployment status
4. Runs verification scripts when both are live
"""

import os
import sys
import time
import requests
from typing import Optional, Dict

# Render API configuration
RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
RENDER_API_BASE = "https://api.render.com/v1"
BACKEND_SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"
FRONTEND_SERVICE_ID = "srv-d3ihptbipnbc73e72ne0"

def get_deploy_status(service_id: str, deploy_id: str) -> Optional[Dict]:
    """Get status of a specific deployment."""
    url = f"{RENDER_API_BASE}/services/{service_id}/deploys/{deploy_id}"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {RENDER_API_KEY}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"[ERROR] Failed to get deploy status: {response.status_code}")
        return None

def trigger_deploy(service_id: str, service_name: str) -> Optional[Dict]:
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

    print(f"\n[*] Triggering {service_name} deploy...")
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code in (200, 201):
        deploy_info = response.json()
        print(f"[OK] {service_name} deploy triggered")
        print(f"   Deploy ID: {deploy_info.get('id', 'unknown')}")
        print(f"   Status: {deploy_info.get('status', 'unknown')}")
        return deploy_info
    else:
        print(f"[ERROR] Failed to trigger {service_name} deploy: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def wait_for_deploy(service_id: str, deploy_id: str, service_name: str, max_wait_minutes: int = 15) -> bool:
    """Wait for deployment to complete."""
    print(f"\n[*] Waiting for {service_name} deployment {deploy_id}...")

    start_time = time.time()
    max_wait_seconds = max_wait_minutes * 60
    check_interval = 30  # Check every 30 seconds

    while True:
        elapsed = time.time() - start_time
        if elapsed > max_wait_seconds:
            print(f"[TIMEOUT] Deployment exceeded {max_wait_minutes} minute timeout")
            return False

        deploy_status = get_deploy_status(service_id, deploy_id)
        if not deploy_status:
            print(f"[WARN] Could not fetch deploy status, will retry...")
            time.sleep(check_interval)
            continue

        status = deploy_status.get('status', 'unknown')
        print(f"[{int(elapsed/60)}m {int(elapsed%60)}s] Status: {status}")

        if status == 'live':
            print(f"[OK] {service_name} deployment successful!")
            return True
        elif status in ('build_failed', 'update_failed', 'deactivated', 'canceled'):
            print(f"[ERROR] {service_name} deployment failed with status: {status}")
            return False

        # Still in progress
        time.sleep(check_interval)

def main():
    """Main execution flow."""
    print("=" * 80)
    print("Render Deployment Monitor & Frontend Deployer")
    print("=" * 80)

    # Step 1: Get the latest backend deploy ID
    backend_deploy_id = "dep-d4abgeqli9vc73ff04r0"  # From update_backend_database_url.py output

    print(f"\n[INFO] Monitoring backend deployment: {backend_deploy_id}")

    # Step 2: Wait for backend deployment
    backend_success = wait_for_deploy(BACKEND_SERVICE_ID, backend_deploy_id, "backend", max_wait_minutes=15)

    if not backend_success:
        print("\n[ERROR] Backend deployment failed or timed out")
        print("[INFO] Check Render dashboard and container logs for details")
        return 1

    # Step 3: Trigger frontend deployment
    print("\n" + "=" * 80)
    print("[INFO] Backend is live! Triggering frontend deployment...")
    print("=" * 80)

    frontend_deploy_info = trigger_deploy(FRONTEND_SERVICE_ID, "frontend")
    if not frontend_deploy_info:
        print("\n[ERROR] Failed to trigger frontend deployment")
        return 1

    frontend_deploy_id = frontend_deploy_info.get('id')

    # Step 4: Wait for frontend deployment
    frontend_success = wait_for_deploy(FRONTEND_SERVICE_ID, frontend_deploy_id, "frontend", max_wait_minutes=10)

    if not frontend_success:
        print("\n[ERROR] Frontend deployment failed or timed out")
        return 1

    # Step 5: Success!
    print("\n" + "=" * 80)
    print("[OK] SUCCESS: Both deployments are live!")
    print("=" * 80)
    print(f"\n[INFO] Deployment Summary:")
    print(f"   Backend Deploy:  {backend_deploy_id} - LIVE")
    print(f"   Frontend Deploy: {frontend_deploy_id} - LIVE")
    print(f"\n[INFO] Next steps:")
    print(f"   1. Run: python scripts/verify_deployment.py")
    print(f"   2. Run: bash scripts/run_smoke_tests.sh production")
    print(f"   3. Archive outputs in docs/deployments/")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
