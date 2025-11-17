#!/usr/bin/env python3
"""Monitor Render deployment status until completion."""

import time
import requests
import sys

RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
SERVICE_ID = "srv-d3ihptbipnbc73e72ne0"
DEPLOY_ID = "dep-d4ddqm0dl3ps73c0l51g"

def get_deploy_status(service_id: str, deploy_id: str) -> dict:
    """Get deployment status."""
    url = f"https://api.render.com/v1/services/{service_id}/deploys/{deploy_id}"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def main():
    print("Monitoring deployment progress...")
    print(f"Deploy ID: {DEPLOY_ID}")
    print("=" * 80)
    print()

    last_status = None
    start_time = time.time()

    while True:
        try:
            deploy = get_deploy_status(SERVICE_ID, DEPLOY_ID)
            status = deploy.get("status", "unknown")
            elapsed = int(time.time() - start_time)

            # Print status update if changed
            if status != last_status:
                timestamp = time.strftime("%H:%M:%S")
                print(f"[{timestamp}] [{elapsed}s] Status: {status}")
                last_status = status

            # Check if deployment is complete
            if status == "live":
                print()
                print("=" * 80)
                print("✅ DEPLOYMENT SUCCESSFUL!")
                print("=" * 80)
                print()
                print(f"Total time: {elapsed}s")
                print(f"Service URL: https://ma-saas-platform.onrender.com")
                print()
                print("Next steps:")
                print("1. Visit https://ma-saas-platform.onrender.com")
                print("2. Verify landing page loads correctly")
                print("3. Test sign-in functionality")
                print()
                return 0

            elif status in ["build_failed", "pre_deploy_failed", "deploy_failed"]:
                print()
                print("=" * 80)
                print(f"❌ DEPLOYMENT FAILED: {status}")
                print("=" * 80)
                print()
                print(f"Check logs at: https://dashboard.render.com/web/{SERVICE_ID}")
                return 1

            # Wait 10 seconds before next check
            time.sleep(10)

        except KeyboardInterrupt:
            print("\n\nMonitoring interrupted by user.")
            return 1
        except Exception as e:
            print(f"\n❌ Error checking deployment status: {e}")
            return 1

if __name__ == "__main__":
    sys.exit(main())
