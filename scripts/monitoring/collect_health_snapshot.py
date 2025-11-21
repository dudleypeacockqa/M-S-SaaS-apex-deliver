"""
Collect a simple health snapshot for the marketing site and backend APIs.

Outputs a JSON artifact under docs/monitoring/ with timestamped results so the
support team can archive availability checks alongside deployment evidence.
"""

from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import requests


DEFAULT_BACKEND_URL = "https://ma-saas-backend.onrender.com"
DEFAULT_FRONTEND_URL = "https://100daysandbeyond.com"


@dataclass
class EndpointResult:
    name: str
    url: str
    status_code: Optional[int]
    ok: bool
    elapsed_ms: Optional[float]
    error: Optional[str]


def probe_endpoint(name: str, url: str, expected_status: Optional[int] = 200) -> EndpointResult:
    """
    Execute a GET request against the supplied URL and return a structured result.

    The request times out after 10 seconds to protect CI and local runs. For endpoints
    that require authentication, pass expected_status=None to avoid treating 401/403
    as hard failures.
    """
    try:
        response = requests.get(url, timeout=10)
        ok = expected_status is None or response.status_code == expected_status
        return EndpointResult(
            name=name,
            url=url,
            status_code=response.status_code,
            ok=ok,
            elapsed_ms=response.elapsed.total_seconds() * 1000,
            error=None,
        )
    except requests.RequestException as exc:  # pragma: no cover - network failure guard
        return EndpointResult(
            name=name,
            url=url,
            status_code=None,
            ok=False,
            elapsed_ms=None,
            error=str(exc),
        )


def build_snapshot() -> dict[str, object]:
    """
    Collect the current health results for the core surfaced endpoints.
    """
    backend_url = os.getenv("OBS_BACKEND_URL", DEFAULT_BACKEND_URL).rstrip("/")
    frontend_url = os.getenv("OBS_FRONTEND_URL", DEFAULT_FRONTEND_URL).rstrip("/")

    checks = [
        probe_endpoint("backend_health", f"{backend_url}/health", expected_status=200),
        probe_endpoint("backend_billing_tiers", f"{backend_url}/api/billing/tiers", expected_status=200),
        probe_endpoint("backend_blog_listing", f"{backend_url}/api/blog?limit=5", expected_status=200),
        probe_endpoint("frontend_root", f"{frontend_url}/", expected_status=200),
        probe_endpoint("frontend_case_studies", f"{frontend_url}/case-studies", expected_status=200),
        # Master admin routes require auth; ensure endpoint responds (401 is acceptable)
        probe_endpoint("master_admin_dashboard", f"{backend_url}/api/master-admin/dashboard", expected_status=None),
    ]

    return {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "backend_url": backend_url,
        "frontend_url": frontend_url,
        "results": [asdict(check) for check in checks],
    }


def write_snapshot(snapshot: dict[str, object]) -> Path:
    """
    Write snapshot data to docs/monitoring/health-snapshot-<timestamp>.json.
    """
    output_dir = Path("docs/monitoring")
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = snapshot["collected_at"].replace(":", "").replace("-", "")
    filename = output_dir / f"health-snapshot-{timestamp}.json"

    with filename.open("w", encoding="utf-8") as handle:
        json.dump(snapshot, handle, indent=2, sort_keys=True)
        handle.write("\n")

    return filename


def main() -> None:
    snapshot = build_snapshot()
    artifact_path = write_snapshot(snapshot)

    healthy = all(result["ok"] for result in snapshot["results"])
    status_label = "OK" if healthy else "WARN"
    print(f"[{status_label}] health snapshot saved to {artifact_path}")

    for result in snapshot["results"]:
        indicator = "PASS" if result["ok"] else "WARN"
        status_code = result["status_code"] if result["status_code"] is not None else "n/a"
        elapsed = f"{result['elapsed_ms']:.1f}ms" if result["elapsed_ms"] is not None else "n/a"
        print(f"  [{indicator}] {result['name']}: {status_code} ({elapsed}) -> {result['url']}")
        if result["error"]:
            print(f"    error: {result['error']}")


if __name__ == "__main__":
    main()

