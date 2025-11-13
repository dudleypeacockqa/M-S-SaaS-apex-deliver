#!/usr/bin/env python3
"""Check Render deployment status via API."""

import json
import os
import urllib.request
import urllib.error

SERVICE_ID = os.environ.get("RENDER_SERVICE_ID", "srv-d3ii9qk9c44c73aqsli0")
API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")
API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys?limit=5"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json",
}

print("=" * 70)
print("RENDER DEPLOYMENT STATUS CHECK")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
print()

try:
    request = urllib.request.Request(API_URL, headers=headers)
    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode("utf-8"))
        # Render API returns a list of deploy objects directly
        if isinstance(data, list):
            deploys = data
        elif isinstance(data, dict):
            deploys = data.get("deploys", [])
        else:
            deploys = []
        
        if not deploys:
            print("No deployments found")
            print(f"Response data: {json.dumps(data, indent=2)[:500]}")
        else:
            print(f"Found {len(deploys)} recent deployments:")
            print()
            for deploy_item in deploys:
                # Handle both direct deploy objects and wrapped objects
                if isinstance(deploy_item, dict) and "deploy" in deploy_item:
                    deploy_info = deploy_item["deploy"]
                else:
                    deploy_info = deploy_item
                
                commit = deploy_info.get("commit", {})
                print(f"Deploy ID: {deploy_info.get('id')}")
                print(f"Status: {deploy_info.get('status')}")
                if commit:
                    commit_id = commit.get('id', 'N/A')
                    commit_msg = commit.get('message', 'N/A')
                    print(f"Commit: {commit_id[:8] if len(commit_id) > 8 else commit_id}")
                    print(f"Message: {commit_msg[:60]}...")
                print(f"Created: {deploy_info.get('createdAt')}")
                print(f"Finished: {deploy_info.get('finishedAt', 'N/A')}")
                print("-" * 70)
                
except urllib.error.HTTPError as exc:
    error_body = exc.read().decode("utf-8")
    print(f"[ERROR] HTTP {exc.code}: {exc.reason}")
    print(error_body)
except Exception as exc:
    print(f"[ERROR] {exc}")

