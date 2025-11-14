"""
Coverage.py plugin that hardens the pure Python tracer.

When the C accelerator (``coverage.tracer``) is unavailable, Coverage.py
falls back to ``PyTracer``.  Under heavy asyncio usage this tracer can pop
from an empty stack, raising ``IndexError`` during FastAPI ``TestClient``
teardown.  The plugin below swaps in a defensive trace function that mirrors
the behaviour of the C tracer by gracefully ignoring those underflows.
"""

from __future__ import annotations

from coverage import pytracer


def coverage_init(registry, options):  # pragma: no cover - invoked by Coverage.py
    """Install the patched tracer once Coverage spins up."""

    original_trace = pytracer.PyTracer._trace  # type: ignore[attr-defined]

    def _safe_trace(self, frame, event, arg, lineno=None):
        try:
            return original_trace(self, frame, event, arg, lineno)
        except IndexError:
            if not getattr(self, "data_stack", None):
                self.cur_file_data = None
                self.cur_file_name = frame.f_code.co_filename
                self.last_line = frame.f_lineno
                self.started_context = False
                return self._cached_bound_method_trace
            raise

    pytracer.PyTracer._trace = _safe_trace  # type: ignore[attr-defined]
