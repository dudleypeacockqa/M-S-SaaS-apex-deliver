"""
Deployment verification script with detailed diagnostics
Tests all Phase 1 critical endpoints to ensure deployment is healthy
"""
import requests
import sys
import io
import os
from typing import Tuple, Optional

def get_env_or_default(key: str, default: str) -> str:
    """Allow overriding default endpoints via environment variables."""
    return os.environ.get(key, default).strip() or default

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BACKEND_URL = get_env_or_default("BACKEND_URL", "https://ma-saas-backend.onrender.com")
FRONTEND_URL = get_env_or_default("FRONTEND_URL", "https://financeflo.ai")


def test_endpoint(name: str, url: str, expected_status: int = 200,
                  check_content: Optional[str] = None) -> Tuple[bool, str]:
    """Test a single endpoint and return (passed, message)"""
    try:
        response = requests.get(url, timeout=10)

        if response.status_code != expected_status:
            return False, f"Expected {expected_status}, got {response.status_code}"

        if check_content and check_content not in response.text:
            return False, f"Content check failed: '{check_content}' not found"

        return True, f"HTTP {response.status_code}"

    except requests.exceptions.RequestException as e:
        return False, f"Request failed: {str(e)}"


def main():
    print("=" * 60)
    print("  Deployment Verification - Phase 1")
    print(f"  Backend:  {BACKEND_URL}")
    print(f"  Frontend: {FRONTEND_URL}")
    print("=" * 60)
    print()

    passed = 0
    failed = 0

    tests = [
        ("Backend Health", f"{BACKEND_URL}/health", 200, "healthy"),
        ("Blog Listing", f"{BACKEND_URL}/api/blog?limit=5", 200, "title"),
        ("Blog Categories", f"{BACKEND_URL}/api/blog/categories/list", 200, None),
        (
            "Blog Post by Slug",
            f"{BACKEND_URL}/api/blog/pricing-strategy-for-new-product-launches-why-95-get-it-wrong-and-how-to-be-the-5",
            200,
            "Pricing Strategy",
        ),
        ("Contact Endpoint (POST only)", f"{BACKEND_URL}/api/marketing/contact", 405, None),
        ("Subscribe Endpoint (POST only)", f"{BACKEND_URL}/api/marketing/subscribe", 405, None),
        ("Frontend Home", f"{FRONTEND_URL}", 200, None),
        ("Contact Page", f"{FRONTEND_URL}/contact", 200, None),
        ("Blog Page", f"{FRONTEND_URL}/blog", 200, None),
        ("Pricing Page", f"{FRONTEND_URL}/pricing", 200, None),
    ]

    for name, url, status, content in tests:
        success, msg = test_endpoint(name, url, status, content)
        status_icon = "✓" if success else "✗"
        status_color = "\033[0;32m" if success else "\033[0;31m"

        print(f"{status_color}{status_icon}\033[0m {name:<40} ... {msg}")

        if success:
            passed += 1
        else:
            failed += 1

    print()
    print("=" * 60)
    print(f"  Results: {passed} passed, {failed} failed")
    print("=" * 60)

    if failed == 0:
        print("\033[0;32m✓ ALL CRITICAL TESTS PASSED\033[0m")
    else:
        print(f"\033[0;31m✗ {failed} CRITICAL TESTS FAILED\033[0m")

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
