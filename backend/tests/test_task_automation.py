"""RED tests for DEV-012 task automation rules and notifications."""

from __future__ import annotations

import pytest
from uuid import uuid4

from fastapi import status


def _template_payload():
    return {
        "name": "Due Diligence Checklist",
        "description": "Auto-generated tasks for diligence stage",
        "tasks": [
            {
                "title": "Collect financial statements",
                "description": "Request last 3 years of financials",
                "priority": "high",
                "stage_gate": "due_diligence",
            }
        ],
    }


def _rule_payload(template_id: str):
    return {
        "name": "Auto create diligence tasks",
        "trigger": "manual_run",
        "action": "create_tasks_from_template",
        "template_id": template_id,
        "suppress_minutes": 0,
    }


@pytest.fixture()
def deal_context(create_deal_for_org):
    return create_deal_for_org()


def test_manual_rule_run_creates_tasks_and_logs(
    client,
    auth_headers_growth,
    deal_context,
):
    deal, owner, _ = deal_context

    template_resp = client.post(
        f"/api/api/deals/{deal.id}/task-templates",
        headers=auth_headers_growth,
        json=_template_payload(),
    )
    assert template_resp.status_code == status.HTTP_201_CREATED
    template_id = template_resp.json()["id"]

    rule_resp = client.post(
        f"/api/api/deals/{deal.id}/automation/rules",
        headers=auth_headers_growth,
        json=_rule_payload(template_id),
    )
    assert rule_resp.status_code == status.HTTP_201_CREATED
    rule_id = rule_resp.json()["id"]

    run_resp = client.post(
        f"/api/api/deals/{deal.id}/automation/rules/{rule_id}/run",
        headers=auth_headers_growth,
        json={"run_id": str(uuid4())},
    )

    assert run_resp.status_code == status.HTTP_202_ACCEPTED
    payload = run_resp.json()
    assert payload["status"] == "queued"

    list_resp = client.get(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
    )
    assert list_resp.status_code == status.HTTP_200_OK
    tasks = list_resp.json()["items"]
    assert any(task["title"] == "Collect financial statements" for task in tasks)

    log_resp = client.get(
        f"/api/api/deals/{deal.id}/automation/logs",
        headers=auth_headers_growth,
    )
    assert log_resp.status_code == status.HTTP_200_OK
    logs = log_resp.json()["items"]
    assert logs
    assert logs[0]["rule_id"] == rule_id
    assert logs[0]["status"] in {"queued", "completed"}


def test_starter_tier_cannot_create_automation_rule(
    client,
    auth_headers,
    deal_context,
):
    deal, _, _ = deal_context

    template_resp = client.post(
        f"/api/api/deals/{deal.id}/task-templates",
        headers=auth_headers,
        json=_template_payload(),
    )
    assert template_resp.status_code == status.HTTP_403_FORBIDDEN


