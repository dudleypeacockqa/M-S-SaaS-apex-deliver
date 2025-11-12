"""Coverage.py plugin that guards the pure Python tracer on Windows.

Pytest runs with ``--cov`` trigger ``coverage.py``'s pure Python tracer
(``coverage.pytracer.PyTracer``) because the compiled extension is not
available in this environment.  When FastAPI's ``TestClient`` tears down
asynchronous background tasks, coverage occasionally sees return events
without matching stack frames and raises ``IndexError: pop from empty list``.

This plugin wraps the tracer to ignore those spurious pops so that the test
suite can complete while still collecting line data.  The fix is applied once
at coverage initialization time via the plugin hook below.
"""

from __future__ import annotations

from typing import Any


def _install_safe_pytracer() -> None:
    try:
        from coverage import pytracer  # type: ignore
    except Exception:
        return

    tracer = pytracer.PyTracer  # type: ignore[attr-defined]

    if getattr(tracer, "_safe_pop_installed", False):
        return

    original_trace = tracer._trace  # type: ignore[attr-defined]

    def _safe_trace(self, frame, event, arg, lineno=None):  # type: ignore[override]
        try:
            return original_trace(self, frame, event, arg, lineno)
        except IndexError as exc:  # pragma: no cover - defensive shim
            if "pop from empty list" not in str(exc):
                raise
            return None

    tracer._trace = _safe_trace  # type: ignore[attr-defined]
    tracer._safe_pop_installed = True


def coverage_init(reg, options):  # type: ignore[override]
    """Coverage.py entrypoint invoked via the ``[run] plugins`` setting."""

    _install_safe_pytracer()

    # `reg` is unused; signature retained for coverage's plugin API.
    _ = (reg, options)
