#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update Render Frontend Environment Variables
Automatically sets required environment variables for frontend deployment
"""

import os
import sys
import json
import requests
from typing import Dict, List, Optional

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration
RENDER_API_KEY = os.getenv('RENDER_API_KEY', 'rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM')
RENDER_API_BASE = 'https://api.render.com/v1'

# Environment variables to set
REQUIRED_ENV_VARS = {
    'VITE_API_URL': 'https://ma-saas-backend.onrender.com',
    'VITE_CLERK_PUBLISHABLE_KEY': 'pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k',
    'VITE_ENABLE_MASTER_ADMIN': 'false',
}

def get_headers() -> Dict[str, str]:
    """Get API headers with authorization"""
    return {
        'Authorization': f'Bearer {RENDER_API_KEY}',
        'Content-Type': 'application/json',
    }

def find_frontend_service() -> Optional[str]:
    """Find the frontend service ID"""
    print("🔍 Finding frontend service...")

    response = requests.get(
        f'{RENDER_API_BASE}/services',
        headers=get_headers(),
        params={'limit': 20}
    )

    if response.status_code != 200:
        print(f"❌ Failed to fetch services: {response.status_code}")
        print(f"Response: {response.text}")
        return None

    services = response.json()

    # Look for frontend service (static site with 'frontend' or 'platform' in name)
    for service in services:
        service_data = service.get('service', service)
        name = service_data.get('name', '')
        service_type = service_data.get('type', '')

        if service_type == 'static_site' and ('frontend' in name.lower() or 'platform' in name.lower()):
            service_id = service_data.get('id')
            print(f"✅ Found frontend service: {name} ({service_id})")
            return service_id

    print("❌ Frontend service not found")
    return None

def get_current_env_vars(service_id: str) -> Dict[str, str]:
    """Get current environment variables"""
    print(f"\n📋 Fetching current environment variables...")

    response = requests.get(
        f'{RENDER_API_BASE}/services/{service_id}/env-vars',
        headers=get_headers()
    )

    if response.status_code != 200:
        print(f"❌ Failed to fetch env vars: {response.status_code}")
        return {}

    env_vars = {}
    for env_var in response.json():
        env_var_data = env_var.get('envVar', env_var)
        key = env_var_data.get('key')
        value = env_var_data.get('value', '')
        if key:
            env_vars[key] = value

    print(f"✅ Found {len(env_vars)} existing environment variables")
    return env_vars

def update_env_var(service_id: str, key: str, value: str) -> bool:
    """Update or create an environment variable"""
    payload = {
        'key': key,
        'value': value
    }

    response = requests.put(
        f'{RENDER_API_BASE}/services/{service_id}/env-vars/{key}',
        headers=get_headers(),
        json=payload
    )

    if response.status_code in [200, 201]:
        print(f"  ✅ {key}: Set successfully")
        return True
    else:
        print(f"  ❌ {key}: Failed ({response.status_code})")
        print(f"     Response: {response.text}")
        return False

def trigger_deploy(service_id: str) -> bool:
    """Trigger a manual deployment"""
    print(f"\n🚀 Triggering manual deployment...")

    payload = {
        'clearCache': 'clear'
    }

    response = requests.post(
        f'{RENDER_API_BASE}/services/{service_id}/deploys',
        headers=get_headers(),
        json=payload
    )

    if response.status_code in [200, 201]:
        deploy_data = response.json()
        deploy_id = deploy_data.get('id', 'unknown')
        print(f"✅ Deployment triggered: {deploy_id}")
        print(f"   Monitor at: https://dashboard.render.com")
        return True
    else:
        print(f"❌ Failed to trigger deployment: {response.status_code}")
        print(f"Response: {response.text}")
        return False

def main():
    print("=" * 60)
    print("🔧 Render Frontend Environment Variable Updater")
    print("=" * 60)
    print()

    # Step 1: Find frontend service
    service_id = find_frontend_service()
    if not service_id:
        print("\n❌ Cannot proceed without service ID")
        sys.exit(1)

    # Step 2: Get current env vars
    current_env_vars = get_current_env_vars(service_id)

    # Step 3: Update required env vars
    print(f"\n🔄 Updating environment variables...")
    updated_count = 0
    failed_count = 0

    for key, value in REQUIRED_ENV_VARS.items():
        current_value = current_env_vars.get(key)

        if current_value == value:
            print(f"  ⏭️  {key}: Already set correctly")
            continue

        if update_env_var(service_id, key, value):
            updated_count += 1
        else:
            failed_count += 1

    # Step 4: Summary
    print(f"\n📊 Summary:")
    print(f"   Updated: {updated_count}")
    print(f"   Failed: {failed_count}")
    print(f"   Already Set: {len(REQUIRED_ENV_VARS) - updated_count - failed_count}")

    if failed_count > 0:
        print(f"\n⚠️  {failed_count} variables failed to update")
        print("   Manual intervention required")
        sys.exit(1)

    # Step 5: Trigger deployment
    if updated_count > 0:
        print(f"\n🎯 Changes detected, triggering deployment...")
        if trigger_deploy(service_id):
            print(f"\n✅ Deployment initiated successfully!")
            print(f"   Wait 3-5 minutes for build to complete")
            print(f"   Then visit: https://financeflo.ai")
        else:
            print(f"\n⚠️  Deployment trigger failed")
            print("   Please trigger manually from Render dashboard")
            sys.exit(1)
    else:
        print(f"\n✅ All environment variables already set correctly!")
        print("   No deployment needed")

    print()
    print("=" * 60)
    print("✅ Environment variable update complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()
