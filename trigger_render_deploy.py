#!/usr/bin/env python3
"""Trigger manual deployment on Render via API."""

import json
import os
import sys
import urllib.error
import urllib.request

SERVICE_ID = os.environ.get("RENDER_SERVICE_ID", "srv-d3ii9qk9c44c73aqsli0")
API_KEY = os.environ.get("RENDER_API_KEY")
API_URL = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys"

if not API_KEY:
    sys.stderr.write("RENDER_API_KEY is not set; export it before running this script.\n")
    sys.exit(1)

data = {"clearCache": os.environ.get("RENDER_DEPLOY_CACHE", "do_not_clear")}
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

print("=" * 70)
print("RENDER MANUAL DEPLOYMENT TRIGGER")
print("=" * 70)
print(f"Service ID: {SERVICE_ID}")
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
        deploy = json.loads(response.read().decode("utf-8")).get("deploy")
        print("[SUCCESS] Deployment triggered!")
        if deploy:
            print(json.dumps(deploy, indent=2))
except urllib.error.HTTPError as exc:
    sys.stderr.write(f"[ERROR] HTTP {exc.code}: {exc.reason}\n")
    sys.stderr.write(exc.read().decode("utf-8"))
    sys.exit(1)
except Exception as exc:
    sys.stderr.write(f"[ERROR] {exc}\n")
    sys.exit(1)
