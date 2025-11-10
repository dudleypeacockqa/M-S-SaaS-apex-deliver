#!/usr/bin/env python3
"""Trigger manual deployment on Render via API."""

import os
import sys
import json
import urllib.request
import urllib.error

# Render API configuration
API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"
API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys"

print("=" * 70)
print("RENDER MANUAL DEPLOYMENT TRIGGER")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
print()

# Prepare the request
data = {
    "clearCache": "do_not_clear"
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

try:
    # Make the POST request
    print("[INFO] Triggering manual deployment...")

    request = urllib.request.Request(
        API_URL,
        data=json.dumps(data).encode('utf-8'),
        headers=headers,
        method='POST'
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode('utf-8'))

        deploy = result.get('deploy', result)

        print("[SUCCESS] Deployment triggered!")
        print()
        print("Deployment Details:")
        print(f"  Deploy ID: {deploy.get('id', 'N/A')}")
        print(f"  Status: {deploy.get('status', 'N/A')}")
        print(f"  Trigger: {deploy.get('trigger', 'N/A')}")
        print(f"  Created: {deploy.get('createdAt', 'N/A')}")

        if 'commit' in deploy:
            commit = deploy['commit']
            print(f"  Commit: {commit.get('id', 'N/A')[:7]}")
            print(f"  Message: {commit.get('message', 'N/A').split(chr(10))[0]}")

        print()
        print("=" * 70)
        print("MONITORING:")
        print("=" * 70)
        print("Watch for these phases in deployment logs:")
        print("  1. BUILD - Docker image build")
        print("  2. PRE-DEPLOY - alembic upgrade head (NEW!)")
        print("  3. START - Service startup")
        print("  4. HEALTH CHECK - /health endpoint")
        print()
        print("Expected migrations to run:")
        print("  - Already at: dc2c0f69c1b1 (head)")
        print("  - Should show: 'Already at head' message")
        print("=" * 70)

except urllib.error.HTTPError as e:
    print(f"[ERROR] HTTP {e.code}: {e.reason}")
    error_body = e.read().decode('utf-8')
    print(f"Response: {error_body}")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
