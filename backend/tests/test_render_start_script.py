"""Tests for the top-level Render start script.

These tests enforce that the repository root contains a `render-start.sh`
wrapper which delegates to the backend implementation. Render's dashboard
invokes the root-level script, so keeping this file present and pointing to the
backend script prevents deploy regressions.
"""
from pathlib import Path


def test_root_render_start_script_exists_and_targets_backend() -> None:
    """Ensure `render-start.sh` exists and hands off to backend/start script."""
    repo_root = Path(__file__).resolve().parents[2]
    script_path = repo_root / "render-start.sh"

    assert script_path.exists(), "render-start.sh must exist at repo root"

    contents = script_path.read_text()
    assert "backend" in contents, "script should cd into backend directory"
    assert "render-start.sh" in contents, "script should delegate to backend script"

