#!/usr/bin/env python3
import requests
import time
import sys

RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"

headers = {"Authorization": f"Bearer {RENDER_API_KEY}"}
url = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys?limit=1"

print("Monitoring Render deployment...")
print("=" * 70)

for i in range(1, 21):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data:
                deploy = data[0]['deploy']
                status = deploy['status']
                commit_msg = deploy['commit']['message'].split('\n')[0][:60]

                print(f"[Check {i}/20] Status: {status}")
                print(f"  Commit: {commit_msg}")

                if status == 'live':
                    print("\nDEPLOYMENT SUCCESSFUL!")
                    print("=" * 70)
                    sys.exit(0)
                elif status in ['update_failed', 'build_failed', 'deactivated']:
                    print(f"\nDEPLOYMENT FAILED: {status}")
                    print("=" * 70)
                    sys.exit(1)
                elif status in ['build_in_progress', 'update_in_progress']:
                    print(f"  Still deploying... ({status})")
            else:
                print(f"[Check {i}/20] No deployments found")
        else:
            print(f"[Check {i}/20] API error: {response.status_code}")
    except Exception as e:
        print(f"[Check {i}/20] Error: {e}")

    if i < 20:
        time.sleep(15)
    print()

print("Deployment still in progress after 5 minutes")
print("Check Render dashboard: https://dashboard.render.com/")
sys.exit(2)
