"""
Check Render deployment status and trigger redeploy if needed
"""
import os
import requests
import json
import sys
from datetime import datetime

RENDER_API_KEY = os.environ.get(
    "RENDER_API_KEY",
    "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM",
)
BACKEND_SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"
BACKEND_URL = "https://ma-saas-backend.onrender.com"

def get_service_info():
    """Get current service information"""
    url = f"https://api.render.com/v1/services/{BACKEND_SERVICE_ID}"
    headers = {"Authorization": f"Bearer {RENDER_API_KEY}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching service info: {e}")
        return None

def get_latest_deploy():
    """Get latest deployment"""
    url = f"https://api.render.com/v1/services/{BACKEND_SERVICE_ID}/deploys"
    headers = {"Authorization": f"Bearer {RENDER_API_KEY}"}
    params = {"limit": 1}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        deploys = response.json()
        if deploys:
            return deploys[0]
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching deployments: {e}")
        return None

def trigger_deploy():
    """Trigger a new deployment"""
    url = f"https://api.render.com/v1/services/{BACKEND_SERVICE_ID}/deploys"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {"clearCache": "clear"}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error triggering deployment: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return None

def check_backend_health():
    """Check if backend is healthy"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        return response.status_code == 200
    except:
        return False

def main():
    print("=" * 60)
    print("  Render Backend Deployment Check")
    print("=" * 60)
    print()
    
    # Check backend health
    print("Checking backend health...")
    if check_backend_health():
        print("✓ Backend is healthy")
    else:
        print("✗ Backend health check failed")
    
    # Get service info
    print("\nFetching service information...")
    service = get_service_info()
    if service:
        print(f"Service: {service.get('service', {}).get('name', 'Unknown')}")
        print(f"Status: {service.get('service', {}).get('suspendedInactiveAt') or 'Active'}")
    
    # Get latest deploy
    print("\nFetching latest deployment...")
    deploy = get_latest_deploy()
    if deploy:
        deploy_info = deploy.get('deploy', {})
        print(f"Deploy ID: {deploy_info.get('id', 'Unknown')}")
        print(f"Status: {deploy_info.get('status', 'Unknown')}")
        print(f"Commit: {deploy_info.get('commit', {}).get('id', 'Unknown')[:8]}")
        print(f"Message: {deploy_info.get('commit', {}).get('message', 'Unknown')[:60]}")
        
        if deploy_info.get('status') in ['update_failed', 'build_failed']:
            print("\n⚠ Latest deployment failed. Triggering new deployment...")
            new_deploy = trigger_deploy()
            if new_deploy:
                print(f"✓ New deployment triggered: {new_deploy.get('deploy', {}).get('id', 'Unknown')}")
            else:
                print("✗ Failed to trigger deployment")
        elif deploy_info.get('status') == 'live':
            print("\n✓ Latest deployment is live")
        else:
            print(f"\n⚠ Deployment status: {deploy_info.get('status')}")
    else:
        print("✗ Could not fetch deployment info")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()

