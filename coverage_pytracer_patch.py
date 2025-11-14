"""
Coverage.py plugin that hardens the pure Python tracer.

The Windows CI image ships without the C accelerator (`coverage.tracer`),
which means Coverage.py falls back to the slower `PyTracer`.  Under heavy
asyncio usage, the standard implementation occasionally pops from an empty
stack, raising ``IndexError`` during TestClient teardown.  This plugin swaps in
an augmented trace function that gracefully ignores those underflows so test
runs can complete while still recording coverage data.
"""

from __future__ import annotations

from coverage import pytracer


def coverage_init(registry, options):  # pragma: no cover - exercised via coverage itself
    """Entry-point invoked by Coverage.py to install the patch."""

    original_trace = pytracer.PyTracer._trace

    def _safe_trace(self, frame, event, arg, lineno=None):
        try:
            return original_trace(self, frame, event, arg, lineno)
        except IndexError:
            if not getattr(self, "data_stack", None):
                # Mirror the behaviour of the C tracer: quietly ignore the
                # underflow and continue tracing future events.
                self.cur_file_data = None
                self.cur_file_name = frame.f_code.co_filename
                self.last_line = frame.f_lineno
                self.started_context = False
                return self._cached_bound_method_trace
            raise

    pytracer.PyTracer._trace = _safe_trace
