#!/usr/bin/env python3
"""Trigger backend deployment on Render via API."""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Trigger a Render deploy")
    parser.add_argument(
        "--service",
        default=os.environ.get("RENDER_SERVICE_ID", "srv-d3ii9qk9c44c73aqsli0"),
        help="Render service ID to redeploy",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("RENDER_API_KEY"),
        help="Render API key (defaults to RENDER_API_KEY env variable)",
    )
    parser.add_argument(
        "--clear-cache",
        choices=["do_not_clear", "clear"],
        default="do_not_clear",
        help="Whether to clear Render build cache on redeploy",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.api_key:
        print("[ERROR] No API key provided via --api-key or RENDER_API_KEY env var", file=sys.stderr)
        return 1

    api_url = f"https://api.render.com/v1/services/{args.service}/deploys"
    payload = {"clearCache": args.clear_cache}
    headers = {
        "Authorization": f"Bearer {args.api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    print("=" * 70)
    print("RENDER BACKEND DEPLOYMENT TRIGGER")
    print("=" * 70)
    print(f"Service ID: {args.service}")
    print(f"API Key: {args.api_key[:5]}...{args.api_key[-4:]}")
    print(f"Payload: {json.dumps(payload)}")
    print()

    request = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        print("[INFO] Triggering manual deployment...")
        with urllib.request.urlopen(request) as response:
            body = response.read().decode("utf-8") or "{}"
            try:
                result = json.loads(body)
            except json.JSONDecodeError:
                result = {"raw": body}
            deploy = result.get("deploy")
            print(f"[SUCCESS] Render response status: {response.status}")
            if deploy:
                print("Deploy metadata:")
                print(json.dumps(deploy, indent=2))
            else:
                print("Full response body:")
                print(json.dumps(result, indent=2))
            return 0
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8")
        print(f"[ERROR] HTTP {exc.code}: {exc.reason}")
        print(error_body)
        return 1
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[ERROR] {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

