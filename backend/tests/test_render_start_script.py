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


def test_backend_render_start_runs_prestart_before_uvicorn() -> None:
    """Verify backend/render-start.sh executes migrations via prestart before Uvicorn."""
    backend_dir = Path(__file__).resolve().parents[1]
    script_path = backend_dir / "render-start.sh"

    assert script_path.exists(), "backend/render-start.sh must exist"
    contents = script_path.read_text().splitlines()

    def _find_line(keyword: str) -> int:
        for idx, line in enumerate(contents):
            if keyword in line:
                return idx
        raise AssertionError(f"{keyword} not found in backend/render-start.sh")

    prestart_idx = _find_line("/tmp/prestart")
    uvicorn_idx = _find_line("exec uvicorn")

    assert prestart_idx < uvicorn_idx, "prestart (migrations) must run before Uvicorn starts"


def test_backend_render_start_sanitizes_prestart_and_sets_env() -> None:
    """Ensure Render start script strips CRLF and forces migrations to run."""
    backend_dir = Path(__file__).resolve().parents[1]
    script_path = backend_dir / "render-start.sh"

    contents = script_path.read_text()

    assert "RENDER_PRESTART_RUN_MIGRATIONS=1" in contents, \
        "Script must export flag so prestart runs migrations"
    assert "unset SKIP_MIGRATIONS" in contents, "Script should ignore stale skip flag"
    assert "data.replace(b\"\\r\\n\", b\"\\n\")" in contents, \
        "Script must sanitize CRLF line endings before executing prestart"
