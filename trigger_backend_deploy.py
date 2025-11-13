#!/usr/bin/env python3
"""Trigger backend deployment on Render via API."""

import json
import os
import sys
import urllib.request
import urllib.error

SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"
API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8sE4fgIiIXTsNAqM")
API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys"

data = {"clearCache": "do_not_clear"}
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

print("=" * 70)
print("RENDER BACKEND DEPLOYMENT TRIGGER")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
print(f"API Key: {API_KEY[:20]}...")
print()

try:
    print("[INFO] Triggering manual deployment...")
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))
        deploy = result.get("deploy", {})
        print("[SUCCESS] Deployment triggered!")
        print(json.dumps(deploy, indent=2))
        sys.exit(0)
except urllib.error.HTTPError as exc:
    error_body = exc.read().decode("utf-8")
    print(f"[ERROR] HTTP {exc.code}: {exc.reason}")
    print(error_body)
    sys.exit(1)
except Exception as exc:
    print(f"[ERROR] {exc}")
    sys.exit(1)

