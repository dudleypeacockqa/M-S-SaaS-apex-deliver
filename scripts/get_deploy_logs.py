#!/usr/bin/env python3
"""
Fetch deployment logs from Render API.
"""

import sys
import requests

RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
RENDER_API_BASE = "https://api.render.com/v1"
BACKEND_SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"

def get_deploy_logs(service_id: str, deploy_id: str):
    """Fetch logs for a specific deployment."""
    url = f"{RENDER_API_BASE}/services/{service_id}/deploys/{deploy_id}/logs"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {RENDER_API_KEY}"
    }

    print(f"[*] Fetching logs for deploy {deploy_id}...")
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        logs = response.json()
        print("\n" + "=" * 80)
        print(f"Deploy Logs for {deploy_id}")
        print("=" * 80)
        print(logs)
        print("=" * 80)
        return logs
    else:
        print(f"[ERROR] Failed to fetch logs: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def main():
    deploy_id = "dep-d4abgeqli9vc73ff04r0"
    logs = get_deploy_logs(BACKEND_SERVICE_ID, deploy_id)
    return 0 if logs else 1

if __name__ == "__main__":
    sys.exit(main())
