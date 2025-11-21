#!/usr/bin/env python3
"""Check Render deployment status and trigger new deployment if needed."""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime

SERVICE_ID = os.environ.get("RENDER_SERVICE_ID", "srv-d3ii9qk9c44c73aqsli0")
API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8sE4fgIiIXTsNAqM")
BASE_URL = "https://api.render.com/v1"

def get_service_info():
    """Get current service information."""
    url = f"{BASE_URL}/services/{SERVICE_ID}"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }
    
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        sys.stderr.write(f"[ERROR] HTTP {exc.code}: {exc.reason}\n")
        sys.stderr.write(exc.read().decode("utf-8"))
        return None

def get_latest_deploy():
    """Get the latest deployment."""
    url = f"{BASE_URL}/services/{SERVICE_ID}/deploys?limit=1"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }
    
    try:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request) as response:
            data = json.loads(response.read().decode("utf-8"))
            if data and len(data) > 0:
                return data[0]
            return None
    except urllib.error.HTTPError as exc:
        sys.stderr.write(f"[ERROR] HTTP {exc.code}: {exc.reason}\n")
        sys.stderr.write(exc.read().decode("utf-8"))
        return None

def trigger_deploy():
    """Trigger a new manual deployment."""
    url = f"{BASE_URL}/services/{SERVICE_ID}/deploys"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    data = {"clearCache": "do_not_clear"}
    
    try:
        request = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(request) as response:
            deploy = json.loads(response.read().decode("utf-8"))
            return deploy
    except urllib.error.HTTPError as exc:
        sys.stderr.write(f"[ERROR] HTTP {exc.code}: {exc.reason}\n")
        sys.stderr.write(exc.read().decode("utf-8"))
        return None

def main():
    print("=" * 70)
    print("RENDER BACKEND DEPLOYMENT STATUS CHECK")
    print("=" * 70)
    print(f"Service ID: {SERVICE_ID}")
    print()
    
    # Get service info
    print("[INFO] Fetching service information...")
    service = get_service_info()
    if not service:
        sys.exit(1)
    
    print(f"[INFO] Service: {service.get('service', {}).get('name', 'Unknown')}")
    print(f"[INFO] Status: {service.get('service', {}).get('suspended', False) and 'Suspended' or 'Active'}")
    print()
    
    # Get latest deploy
    print("[INFO] Fetching latest deployment...")
    latest_deploy = get_latest_deploy()
    if latest_deploy:
        deploy = latest_deploy.get("deploy", {})
        print(f"[INFO] Latest Deploy ID: {deploy.get('id', 'Unknown')}")
        print(f"[INFO] Status: {deploy.get('status', 'Unknown')}")
        print(f"[INFO] Commit: {deploy.get('commit', {}).get('id', 'Unknown')[:8]}")
        print(f"[INFO] Created: {deploy.get('createdAt', 'Unknown')}")
        print()
        
        if deploy.get('status') in ['live', 'deployed']:
            print("[SUCCESS] Backend is currently deployed and live.")
            return 0
        elif deploy.get('status') in ['update_failed', 'build_failed']:
            print("[WARNING] Latest deployment failed. Triggering new deployment...")
        else:
            print(f"[INFO] Latest deployment status: {deploy.get('status')}")
            print("[INFO] Triggering new deployment to ensure latest code is deployed...")
    else:
        print("[INFO] No deployment found. Triggering new deployment...")
    
    # Trigger new deployment
    print()
    print("[INFO] Triggering manual deployment...")
    new_deploy = trigger_deploy()
    
    if new_deploy:
        deploy = new_deploy.get("deploy", {})
        print("[SUCCESS] Deployment triggered!")
        print(f"[INFO] Deploy ID: {deploy.get('id', 'Unknown')}")
        print(f"[INFO] Status: {deploy.get('status', 'Unknown')}")
        print()
        
        # Save deployment info
        output = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "service_id": SERVICE_ID,
            "deploy_id": deploy.get('id'),
            "status": deploy.get('status'),
            "commit": deploy.get('commit', {}).get('id'),
            "triggered": True
        }
        
        output_file = f"docs/deployments/{datetime.utcnow().strftime('%Y-%m-%d')}-backend-redeploy.txt"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w') as f:
            f.write(f"Backend Deployment Triggered\n")
            f.write(f"{'=' * 70}\n")
            f.write(f"Timestamp: {output['timestamp']}\n")
            f.write(f"Service ID: {output['service_id']}\n")
            f.write(f"Deploy ID: {output['deploy_id']}\n")
            f.write(f"Status: {output['status']}\n")
            f.write(f"Commit: {output['commit']}\n")
            f.write(f"\nFull JSON:\n{json.dumps(output, indent=2)}\n")
        
        print(f"[INFO] Deployment info saved to: {output_file}")
        return 0
    else:
        print("[ERROR] Failed to trigger deployment.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

