#!/usr/bin/env python3
"""Get Render deployment logs and events."""

import json
import os
import sys
import urllib.request

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")
SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"


def api_request(url):
    """Make authenticated API request to Render."""
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())


def main():
    # Get latest deploy
    print("Fetching latest deployment...")
    deploys_url = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys?limit=1"
    deploys = api_request(deploys_url)

    if not deploys:
        print("No deployments found")
        return 1

    latest_deploy = deploys[0]["deploy"]
    deploy_id = latest_deploy["id"]
    status = latest_deploy["status"]
    commit_msg = latest_deploy["commit"]["message"].split("\n")[0]

    print(f"\nLatest Deploy ID: {deploy_id}")
    print(f"Status: {status}")
    print(f"Commit: {commit_msg}")
    print("\n" + "="*70)

    # Get deploy events
    print("DEPLOY EVENTS (First Errors)")
    print("="*70)
    events_url = f"https://api.render.com/v1/deploys/{deploy_id}/events?limit=1000"
    events = api_request(events_url)

    for event in events[:50]:  # First 50 events
        ts = event.get("ts", "")
        event_type = event.get("type", "")
        message = event.get("message", "")
        print(f"{ts} {event_type}: {message}")

    print("\n" + "="*70)

    # Get deploy logs
    print("DEPLOY LOGS (Raw)")
    print("="*70)
    logs_url = f"https://api.render.com/v1/deploys/{deploy_id}/logs?limit=10000"
    try:
        logs = api_request(logs_url)
        for log in logs[:200]:  # First 200 log lines
            message = log.get("message", "")
            print(message)
    except Exception as e:
        print(f"Could not fetch logs: {e}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
