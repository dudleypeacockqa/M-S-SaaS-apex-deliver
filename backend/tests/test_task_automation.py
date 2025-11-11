from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import Mock, patch

import pytest

from app.tasks import task_automation


def _make_log() -> SimpleNamespace:
    return SimpleNamespace(rule_id="rule-123", organization_id="org-1", triggered_by="user-1")


def _make_rule() -> SimpleNamespace:
    return SimpleNamespace(template_id="tpl-123", organization_id="org-1")


def _make_template() -> SimpleNamespace:
    return SimpleNamespace(id="tpl-123")


def test_enqueue_manual_rule_run_returns_when_log_missing() -> None:
    mock_session = Mock()
    with patch.object(task_automation, "SessionLocal", return_value=mock_session), \
        patch.object(task_automation.task_template_service, "get_log", return_value=None), \
        patch.object(task_automation.task_template_service, "update_log_status") as update_log_status, \
        patch.object(task_automation.task_template_service, "execute_rule") as execute_rule:

        task_automation.enqueue_manual_rule_run("missing-log")

    execute_rule.assert_not_called()
    update_log_status.assert_not_called()
    mock_session.close.assert_called_once_with()


def test_enqueue_manual_rule_run_marks_failed_when_rule_missing() -> None:
    mock_session = Mock()
    log = _make_log()
    with patch.object(task_automation, "SessionLocal", return_value=mock_session), \
        patch.object(task_automation.task_template_service, "get_log", return_value=log), \
        patch.object(task_automation.task_template_service, "get_rule", return_value=None), \
        patch.object(task_automation.task_template_service, "update_log_status") as update_log_status:

        task_automation.enqueue_manual_rule_run("log-123")

    update_log_status.assert_called_once_with(
        db=mock_session,
        log=log,
        status="failed",
        message="Rule missing",
    )
    mock_session.close.assert_called_once_with()


def test_enqueue_manual_rule_run_marks_failed_when_template_missing() -> None:
    mock_session = Mock()
    log = _make_log()
    rule = _make_rule()
    with patch.object(task_automation, "SessionLocal", return_value=mock_session), \
        patch.object(task_automation.task_template_service, "get_log", return_value=log), \
        patch.object(task_automation.task_template_service, "get_rule", return_value=rule), \
        patch.object(task_automation.task_template_service, "get_template", return_value=None), \
        patch.object(task_automation.task_template_service, "update_log_status") as update_log_status:

        task_automation.enqueue_manual_rule_run("log-123")

    update_log_status.assert_called_once_with(
        db=mock_session,
        log=log,
        status="failed",
        message="Template missing",
    )


def test_enqueue_manual_rule_run_success_flow() -> None:
    mock_session = Mock()
    log = _make_log()
    rule = _make_rule()
    template = _make_template()
    with patch.object(task_automation, "SessionLocal", return_value=mock_session), \
        patch.object(task_automation.task_template_service, "get_log", return_value=log), \
        patch.object(task_automation.task_template_service, "get_rule", return_value=rule), \
        patch.object(task_automation.task_template_service, "get_template", return_value=template), \
        patch.object(task_automation.task_template_service, "execute_rule") as execute_rule, \
        patch.object(task_automation.task_template_service, "update_log_status") as update_log_status:

        task_automation.enqueue_manual_rule_run("log-123")

    execute_rule.assert_called_once_with(
        db=mock_session,
        rule=rule,
        template=template,
        triggered_by=log.triggered_by,
    )
    update_log_status.assert_called_with(
        db=mock_session,
        log=log,
        status="completed",
        message="Tasks created",
    )


def test_enqueue_manual_rule_run_logs_exception_and_reraises() -> None:
    mock_session = Mock()
    log = _make_log()
    rule = _make_rule()
    template = _make_template()
    with patch.object(task_automation, "SessionLocal", return_value=mock_session), \
        patch.object(task_automation.task_template_service, "get_log", return_value=log), \
        patch.object(task_automation.task_template_service, "get_rule", return_value=rule), \
        patch.object(task_automation.task_template_service, "get_template", return_value=template), \
        patch.object(task_automation.task_template_service, "execute_rule", side_effect=RuntimeError("boom")), \
        patch.object(task_automation.task_template_service, "update_log_status") as update_log_status:

        with pytest.raises(RuntimeError, match="boom"):
            task_automation.enqueue_manual_rule_run("log-123")

    update_log_status.assert_any_call(
        db=mock_session,
        log=log,
        status="failed",
        message="boom",
    )
    mock_session.close.assert_called_once_with()

