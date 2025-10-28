"""Background tasks entrypoint."""

from .task_automation import enqueue_manual_rule_run

__all__ = ["enqueue_manual_rule_run"]
