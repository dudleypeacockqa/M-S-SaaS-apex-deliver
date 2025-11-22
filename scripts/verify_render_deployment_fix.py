#!/usr/bin/env python3
"""
Verify Render Deployment Fix - Check Start Command Configuration

This script verifies that the Render backend service has the start command
cleared so it uses the Dockerfile ENTRYPOINT instead.

TDD Approach:
1. RED: Check current configuration (may still have start command)
2. GREEN: Clear start command if present
3. REFACTOR: Verify deployment succeeds
"""

import os
import sys
import requests
import json
from datetime import datetime

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_gzv8IfskVtGEFcBGLg6zSaqOXfOu")
BACKEND_SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"  # ma-saas-backend

def get_service_config(service_id: str) -> dict:
    """Get current service configuration from Render API."""
    url = f"https://api.render.com/v1/services/{service_id}"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error fetching service config: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Response: {e.response.text}")
        return None

def check_start_command(service_config: dict) -> tuple[bool, str]:
    """Check if start command is cleared (should be empty for Docker)."""
    if not service_config:
        return False, "No service config available"
    
    service = service_config.get('service', {})
    service_details = service.get('serviceDetails', {})
    
    # Check for start command in service details
    start_command = service_details.get('startCommand', '')
    
    if start_command and start_command.strip():
        return False, f"Start command is set: {start_command}"
    else:
        return True, "Start command is cleared (using Dockerfile ENTRYPOINT)"

def check_deployment_status(service_id: str) -> dict:
    """Get latest deployment status."""
    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, params={"limit": 1})
        response.raise_for_status()
        deploys = response.json()
        if deploys and len(deploys) > 0:
            return deploys[0]
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching deployment status: {e}")
        return None

def trigger_deploy(service_id: str) -> dict:
    """Trigger a new deployment."""
    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    
    payload = {
        "clearCache": "clear"
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error triggering deployment: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Response: {e.response.text}")
        return None

def main():
    print("=" * 80)
    print("Render Deployment Fix Verification")
    print("=" * 80)
    print(f"Date: {datetime.now().isoformat()}")
    print(f"Service ID: {BACKEND_SERVICE_ID}")
    print()
    
    # Step 1: Get current configuration
    print("Step 1: Checking current service configuration...")
    service_config = get_service_config(BACKEND_SERVICE_ID)
    
    if not service_config:
        print("[ERROR] Failed to fetch service configuration")
        return 1
    
    service = service_config.get('service', {})
    print(f"   [OK] Service: {service.get('name', 'Unknown')}")
    print(f"   [INFO] Type: {service.get('type', 'Unknown')}")
    print(f"   [INFO] URL: {service.get('serviceDetails', {}).get('url', 'Unknown')}")
    print()
    
    # Step 2: Check start command
    print("Step 2: Verifying start command configuration...")
    is_cleared, message = check_start_command(service_config)
    
    if is_cleared:
        print(f"   [OK] {message}")
    else:
        print(f"   [WARN] {message}")
        print()
        print("   ACTION REQUIRED:")
        print("   1. Go to https://dashboard.render.com")
        print("   2. Navigate to ma-saas-backend → Settings")
        print("   3. Find 'Start Command' field")
        print("   4. Clear it completely (leave empty)")
        print("   5. Save changes")
        print()
        print("   After clearing, run this script again to verify.")
        return 1
    
    print()
    
    # Step 3: Check latest deployment
    print("Step 3: Checking latest deployment status...")
    latest_deploy = check_deployment_status(BACKEND_SERVICE_ID)
    
    if latest_deploy:
        deploy_id = latest_deploy.get('id', 'unknown')
        status = latest_deploy.get('status', 'unknown')
        created_at = latest_deploy.get('createdAt', 'unknown')
        print(f"   [INFO] Latest Deploy: {deploy_id}")
        print(f"   [INFO] Status: {status}")
        print(f"   [INFO] Created: {created_at}")
        
        if status == 'live':
            print("   [OK] Deployment is LIVE")
        elif status in ['update_failed', 'build_failed']:
            print(f"   [ERROR] Deployment failed with status: {status}")
            print("   Check Render dashboard logs for details")
        else:
            print(f"   [WAIT] Deployment status: {status}")
    else:
        print("   [WARN] Could not fetch deployment status")
    
    print()
    
    # Step 4: Test backend health
    print("Step 4: Testing backend health endpoint...")
    backend_url = service.get('serviceDetails', {}).get('url', 'https://ma-saas-backend.onrender.com')
    health_url = f"{backend_url}/health"
    
    try:
        response = requests.get(health_url, timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            print(f"   [OK] Backend is healthy")
            print(f"   [INFO] Response: {json.dumps(health_data, indent=2)}")
        else:
            print(f"   [WARN] Backend returned status {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except requests.exceptions.RequestException as e:
        print(f"   [ERROR] Error checking health: {e}")
    
    print()
    print("=" * 80)
    print("Verification Complete")
    print("=" * 80)
    print()
    print("Next Steps:")
    print("1. If start command is cleared [OK], deployment should use Dockerfile ENTRYPOINT")
    print("2. Monitor deployment logs in Render dashboard")
    print("3. Verify logs show 'Starting Render Backend Service' from entrypoint.sh")
    print("4. If deployment fails, check logs for entrypoint.sh execution")
    print()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

