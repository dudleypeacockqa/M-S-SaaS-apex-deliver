"""RED-phase tests for DEV-012 task CRUD endpoints."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest
from fastapi import status

from app.models.user import UserRole


@pytest.fixture()
def deal_context(create_deal_for_org):
    deal, owner, org = create_deal_for_org()
    return deal, owner, org


def _task_payload(**overrides):
    payload = {
        "title": "Prepare diligence checklist",
        "description": "Collect initial financials",
        "status": "todo",
        "priority": "high",
        "due_date": (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
        "assignee_id": str(uuid4()),
        "stage_gate": "due_diligence",
    }
    payload.update(overrides)
    return payload


def test_create_task_returns_201(client, deal_context, auth_headers_growth):
    deal, owner, org = deal_context

    response = client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(assignee_id=str(owner.id)),
    )

    assert response.status_code == status.HTTP_201_CREATED
    body = response.json()
    assert body["deal_id"] == str(deal.id)
    assert body["organization_id"] == str(org.id)
    assert body["status"] == "todo"
    assert body["priority"] == "high"


def test_list_tasks_scopes_to_deal(client, deal_context, auth_headers_growth, create_deal_for_org):
    deal, owner, _ = deal_context

    # Create tasks for target deal
    client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(title="Kick-off call", assignee_id=str(owner.id)),
    )
    client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(title="Collect documents", assignee_id=str(owner.id)),
    )

    # Create task for different deal to ensure filtering occurs
    other_deal, other_owner, _ = create_deal_for_org()
    client.post(
        f"/api/api/deals/{other_deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(title="External task", assignee_id=str(other_owner.id)),
    )

    list_response = client.get(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
    )

    assert list_response.status_code == status.HTTP_200_OK
    payload = list_response.json()
    assert payload["total"] == 2
    titles = {item["title"] for item in payload["items"]}
    assert titles == {"Kick-off call", "Collect documents"}


def test_update_task_allows_status_and_due_date_change(client, deal_context, auth_headers_growth):
    deal, owner, _ = deal_context
    create_resp = client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(assignee_id=str(owner.id)),
    )
    task_id = create_resp.json()["id"]

    new_due_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    patch_resp = client.patch(
        f"/api/api/deals/{deal.id}/tasks/{task_id}",
        headers=auth_headers_growth,
        json={"status": "in_progress", "due_date": new_due_date},
    )

    assert patch_resp.status_code == status.HTTP_200_OK
    payload = patch_resp.json()
    assert payload["status"] == "in_progress"
    assert payload["due_date"].startswith(new_due_date[:10])


def test_delete_task_returns_204(client, deal_context, auth_headers_growth):
    deal, owner, _ = deal_context
    create_resp = client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(assignee_id=str(owner.id)),
    )
    task_id = create_resp.json()["id"]

    delete_resp = client.delete(
        f"/api/api/deals/{deal.id}/tasks/{task_id}",
        headers=auth_headers_growth,
    )

    assert delete_resp.status_code == status.HTTP_204_NO_CONTENT


def test_starter_tier_cannot_create_tasks(client, deal_context, auth_headers):
    deal, owner, _ = deal_context

    response = client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers,
        json=_task_payload(assignee_id=str(owner.id)),
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_cannot_access_tasks_from_other_org(client, create_deal_for_org, auth_headers_growth, create_organization, create_user, dependency_overrides):
    deal, owner, _ = create_deal_for_org()
    create_resp = client.post(
        f"/api/api/deals/{deal.id}/tasks",
        headers=auth_headers_growth,
        json=_task_payload(assignee_id=str(owner.id)),
    )
    task_id = create_resp.json()["id"]

    other_org = create_organization(subscription_tier="growth")
    outsider = create_user(role=UserRole.growth, organization_id=str(other_org.id))

    from app.api.dependencies.auth import get_current_user

    dependency_overrides(get_current_user, lambda: outsider)
    forbidden_resp = client.patch(
        f"/api/api/deals/{deal.id}/tasks/{task_id}",
        headers={"Authorization": "Bearer outsider"},
        json={"status": "done"},
    )

    assert forbidden_resp.status_code in {status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND}
