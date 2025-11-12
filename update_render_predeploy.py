#!/usr/bin/env python3
"""Update Render service Pre-Deploy Command via API."""

import json
import os
import sys
import urllib.error
import urllib.request

SERVICE_ID = os.environ.get("RENDER_SERVICE_ID", "srv-d3ii9qk9c44c73aqsli0")
API_KEY = os.environ.get("RENDER_API_KEY")
PRE_DEPLOY_COMMAND = os.environ.get("RENDER_PRE_DEPLOY_COMMAND", "alembic upgrade head")

if not API_KEY:
    sys.stderr.write("RENDER_API_KEY is not set; export it before running this script.\n")
    sys.exit(1)

API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}"

print("=" * 70)
print("RENDER PRE-DEPLOY COMMAND UPDATE")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
print(f"Command: {PRE_DEPLOY_COMMAND}")
print()

data = {"preDeployCommand": PRE_DEPLOY_COMMAND}
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

try:
    print("[INFO] Updating Pre-Deploy Command...")
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="PATCH",
    )
    with urllib.request.urlopen(request) as response:
        payload = json.loads(response.read().decode("utf-8"))
        print("[SUCCESS] Pre-deploy command updated")
        print(json.dumps(payload, indent=2))
except urllib.error.HTTPError as exc:
    sys.stderr.write(f"[ERROR] HTTP {exc.code}: {exc.reason}\n")
    sys.stderr.write(exc.read().decode("utf-8"))
    sys.exit(1)
except Exception as exc:
    sys.stderr.write(f"[ERROR] {exc}\n")
    sys.exit(1)
