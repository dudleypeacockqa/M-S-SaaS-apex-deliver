#!/usr/bin/env python3
"""Update Render service Pre-Deploy Command via API."""

import os
import sys
import json
import urllib.request
import urllib.error

# Render API configuration
API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"
API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}"

# Pre-Deploy Command to set
PRE_DEPLOY_COMMAND = "alembic upgrade head"

print("=" * 70)
print("RENDER PRE-DEPLOY COMMAND UPDATE")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
print(f"Command: {PRE_DEPLOY_COMMAND}")
print()

# Prepare the request
data = {
    "preDeployCommand": PRE_DEPLOY_COMMAND
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

try:
    # Make the PATCH request
    print("[INFO] Updating Pre-Deploy Command...")

    request = urllib.request.Request(
        API_URL,
        data=json.dumps(data).encode('utf-8'),
        headers=headers,
        method='PATCH'
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode('utf-8'))

        print("[SUCCESS] Pre-Deploy Command updated!")
        print()
        print("Service Details:")
        print(f"  Name: {result.get('name', 'N/A')}")
        print(f"  Type: {result.get('serviceDetails', {}).get('env', 'N/A')}")
        print(f"  Pre-Deploy Command: {result.get('serviceDetails', {}).get('preDeployCommand', 'N/A')}")
        print()
        print("=" * 70)
        print("NEXT STEPS:")
        print("=" * 70)
        print("1. Trigger manual deploy in Render dashboard, OR")
        print("2. Push a commit to trigger auto-deploy")
        print("3. Monitor deployment logs to verify migrations run")
        print("=" * 70)

except urllib.error.HTTPError as e:
    print(f"[ERROR] HTTP {e.code}: {e.reason}")
    print(f"Response: {e.read().decode('utf-8')}")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
