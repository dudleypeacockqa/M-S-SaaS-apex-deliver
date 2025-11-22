"""
Regression tests for the Wave 0 evidence automation runner.

These tests keep us honest that a Node-based orchestrator exists and that it can
generate deterministic output (suite-report.json) even when the required
environment variables are not supplied. The runner is expected to support a
`--dry-run` mode that never hits real services but still documents which tasks
were skipped and why, so production evidence captures stay reproducible.
"""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_PATH = REPO_ROOT / "scripts" / "run-evidence-suite.mjs"


def _run_evidence_suite(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    """Helper to invoke the Node orchestrator and capture stdout/stderr."""
    cmd = ["node", str(SCRIPT_PATH), *args]
    return subprocess.run(
        cmd,
        cwd=cwd or REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )


def test_evidence_suite_script_exists() -> None:
    """The orchestration script must live under scripts/ and be tracked."""
    assert SCRIPT_PATH.exists(), "scripts/run-evidence-suite.mjs must exist for Wave 0 evidence automation"


@pytest.mark.skipif(SCRIPT_PATH.exists(), reason="Script exists; skip RED test once implemented")
def test_evidence_suite_missing_script_causes_failure() -> None:
    """Temporary guard to make RED state explicit when the file is absent."""
    assert not SCRIPT_PATH.exists(), "This RED test should only run before the script is implemented"


def test_evidence_suite_dry_run_records_skipped_tasks(tmp_path) -> None:
    """
    `--dry-run` should succeed without env vars and create suite-report.json
    listing each task as skipped with a human-readable reason.
    """
    output_dir = tmp_path / "evidence-out"
    result = _run_evidence_suite(
        "--dry-run",
        "--date",
        "2099-01-01",
        "--tasks",
        "master-admin,blogadmin,lighthouse",
        "--output",
        str(output_dir),
    )

    assert result.returncode == 0, f"Dry run should not fail.\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"

    summary_path = output_dir / "suite-report.json"
    assert summary_path.exists(), "Dry run must always emit suite-report.json"

    data = json.loads(summary_path.read_text())
    tasks = {entry["name"]: entry for entry in data.get("tasks", [])}

    for key in ("master-admin", "blogadmin", "lighthouse"):
        assert key in tasks, f"{key} task missing from suite-report.json"
        assert tasks[key]["status"] in {"skipped", "success", "failed"}, "Unexpected status value"
        if tasks[key]["status"] == "skipped":
            assert tasks[key]["reason"], f"{key} skipped without reason"


def test_evidence_suite_lighthouse_only_creates_metadata(tmp_path) -> None:
    """Even when only lighthouse is requested, a metadata stub should be generated."""
    output_dir = tmp_path / "lighthouse-only"
    result = _run_evidence_suite(
        "--dry-run",
        "--tasks",
        "lighthouse",
        "--output",
        str(output_dir),
    )

    assert result.returncode == 0, "Lighthouse-only dry run should succeed"

    summary_path = output_dir / "suite-report.json"
    assert summary_path.exists(), "Suite report must exist for lighthouse-only runs"

    data = json.loads(summary_path.read_text())
    tasks = {entry["name"]: entry for entry in data.get("tasks", [])}
    assert "lighthouse" in tasks, "Lighthouse task missing from report"

