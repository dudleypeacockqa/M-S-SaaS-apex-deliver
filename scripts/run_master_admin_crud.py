
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

CLERK_SECRET = os.environ.get("CLERK_SECRET_KEY", "sk_test_placeholder")
MASTER_ADMIN_USER_ID = os.environ.get("MASTER_ADMIN_USER_ID", "user_placeholder")


def generate_sign_in_token():
    data = json.dumps({"user_id": MASTER_ADMIN_USER_ID}).encode("utf-8")
    request = urllib.request.Request(
        "https://api.clerk.com/v1/sign_in_tokens",
        data=data,
        method="POST",
    )
    request.add_header("Authorization", f"Bearer {CLERK_SECRET}")
    request.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
            return payload["token"]
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(
            f"Failed to generate Clerk sign-in token: {exc.code} {exc.reason} - {detail}"
        ) from exc


def main():
    token = generate_sign_in_token()
    os.environ["CLERK_SIGN_IN_TOKEN"] = token
    os.environ["MASTER_ADMIN_BASE_URL"] = "https://ma-saas-platform.onrender.com"
    os.environ["API_BASE_URL"] = "https://ma-saas-backend.onrender.com"
    os.environ["MASTER_ADMIN_TENANT_ID"] = "qa-dge-tenant"

    result = subprocess.run(
        ["node", "scripts/exercise-master-admin-crud.mjs"],
        check=False,
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()

