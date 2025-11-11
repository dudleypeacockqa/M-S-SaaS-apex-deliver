from __future__ import annotations

from dataclasses import dataclass, field
from types import SimpleNamespace
from typing import Any, List, Optional
from unittest.mock import Mock, patch
import importlib
import sys

import pytest

# Ensure Celery's shared_task decorator is a no-op during these unit tests.
celery_module = sys.modules.get("celery")
if celery_module is not None:
    celery_module.shared_task.side_effect = (
        lambda func=None, **kwargs: func if func is not None else (lambda f: f)
    )

from app.tasks import task_automation as _task_automation_module

task_automation = importlib.reload(_task_automation_module)


@dataclass
class StubTaskTemplateService:
    log: Optional[Any] = None
    rule: Optional[Any] = None
    template: Optional[Any] = None
    execute_exception: Optional[Exception] = None
    update_calls: List[dict] = field(default_factory=list)
    execute_calls: List[dict] = field(default_factory=list)

    def get_log(self, *, db: Any, log_id: str) -> Any:
        return self.log

    def get_rule(self, *, db: Any, rule_id: str, organization_id: str) -> Any:
        return self.rule

    def get_template(self, *, db: Any, template_id: str, organization_id: str) -> Any:
        return self.template

    def execute_rule(self, *, db: Any, rule: Any, template: Any, triggered_by: str) -> None:
        self.execute_calls.append(
            {"db": db, "rule": rule, "template": template, "triggered_by": triggered_by}
        )
        if self.execute_exception:
            raise self.execute_exception

    def update_log_status(self, *, db: Any, log: Any, status: str, message: Optional[str] = None) -> None:
        self.update_calls.append({"db": db, "log": log, "status": status, "message": message})


def _log() -> SimpleNamespace:
    return SimpleNamespace(rule_id="rule-123", organization_id="org-1", triggered_by="user-1")


def _rule() -> SimpleNamespace:
    return SimpleNamespace(template_id="tpl-456", organization_id="org-1")


def _template() -> SimpleNamespace:
    return SimpleNamespace(id="tpl-456")


def _patch_session(mock_session: Mock):
    return patch.object(task_automation, "SessionLocal", return_value=mock_session)


def test_enqueue_manual_rule_run_returns_when_log_missing() -> None:
    stub = StubTaskTemplateService(log=None)
    mock_session = Mock(close=Mock())

    with _patch_session(mock_session), patch.object(task_automation, "task_template_service", stub):
        task_automation.enqueue_manual_rule_run("log-missing")

    assert stub.update_calls == []
    assert stub.execute_calls == []
    mock_session.close.assert_called_once_with()


def test_enqueue_manual_rule_run_marks_failed_when_rule_missing() -> None:
    log = _log()
    stub = StubTaskTemplateService(log=log, rule=None)
    mock_session = Mock(close=Mock())

    with _patch_session(mock_session), patch.object(task_automation, "task_template_service", stub):
        task_automation.enqueue_manual_rule_run("log-123")

    assert stub.execute_calls == []
    assert stub.update_calls == [
        {"db": mock_session, "log": log, "status": "failed", "message": "Rule missing"}
    ]
    mock_session.close.assert_called_once_with()


def test_enqueue_manual_rule_run_marks_failed_when_template_missing() -> None:
    log = _log()
    rule = _rule()
    stub = StubTaskTemplateService(log=log, rule=rule, template=None)
    mock_session = Mock(close=Mock())

    with _patch_session(mock_session), patch.object(task_automation, "task_template_service", stub):
        task_automation.enqueue_manual_rule_run("log-123")

    assert stub.execute_calls == []
    assert stub.update_calls == [
        {"db": mock_session, "log": log, "status": "failed", "message": "Template missing"}
    ]


def test_enqueue_manual_rule_run_success_flow() -> None:
    log = _log()
    rule = _rule()
    template = _template()
    stub = StubTaskTemplateService(log=log, rule=rule, template=template)
    mock_session = Mock(close=Mock())

    with _patch_session(mock_session), patch.object(task_automation, "task_template_service", stub):
        task_automation.enqueue_manual_rule_run("log-123")

    assert stub.execute_calls == [
        {"db": mock_session, "rule": rule, "template": template, "triggered_by": log.triggered_by}
    ]
    assert stub.update_calls[-1] == {
        "db": mock_session,
        "log": log,
        "status": "completed",
        "message": "Tasks created",
    }


def test_enqueue_manual_rule_run_logs_exception_and_reraises() -> None:
    log = _log()
    rule = _rule()
    template = _template()
    stub = StubTaskTemplateService(
        log=log,
        rule=rule,
        template=template,
        execute_exception=RuntimeError("boom"),
    )
    mock_session = Mock(close=Mock())

    with _patch_session(mock_session), patch.object(task_automation, "task_template_service", stub):
        with pytest.raises(RuntimeError, match="boom"):
            task_automation.enqueue_manual_rule_run("log-123")

    assert stub.update_calls[-1] == {
        "db": mock_session,
        "log": log,
        "status": "failed",
        "message": "boom",
    }
    mock_session.close.assert_called_once_with()

