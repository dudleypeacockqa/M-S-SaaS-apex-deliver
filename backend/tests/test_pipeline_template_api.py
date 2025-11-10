"""Tests for pipeline template API."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.pipeline_template import PipelineTemplate


def test_create_and_list_pipeline_templates(client: TestClient, auth_headers: dict, db_session: Session, solo_user):
    payload = {
        "name": "PMI Default",
        "description": "Sprint-aligned pipeline",
        "is_default": True,
        "stages": [
            {"name": "Stability", "order_index": 1, "probability": 10, "sla_hours": 48},
            {"name": "Quick Wins", "order_index": 2, "probability": 30, "sla_hours": 72},
        ],
    }

    response = client.post("/api/pipeline-templates", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "PMI Default"
    assert data["is_default"] is True
    assert len(data["stages"]) == 2

    list_response = client.get("/api/pipeline-templates", headers=auth_headers)
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert len(list_data) == 1


def test_update_pipeline_template(client: TestClient, auth_headers: dict, db_session: Session, solo_user):
    template = PipelineTemplate(
        organization_id=solo_user.organization_id,
        name="Legacy Pipeline",
        is_default=False,
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    response = client.put(
        f"/api/pipeline-templates/{template.id}",
        json={
            "name": "Updated Pipeline",
            "description": "New flow",
            "is_default": True,
            "stages": [
                {"name": "Source", "order_index": 1, "probability": 5, "sla_hours": 24},
                {"name": "Enablement", "order_index": 2, "probability": 80, "sla_hours": 120},
            ],
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Pipeline"
    assert data["is_default"] is True
    assert len(data["stages"]) == 2


def test_delete_pipeline_template(client: TestClient, auth_headers: dict, db_session: Session, solo_user):
    template = PipelineTemplate(
        organization_id=solo_user.organization_id,
        name="Delete Me",
        is_default=False,
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    response = client.delete(f"/api/pipeline-templates/{template.id}", headers=auth_headers)
    assert response.status_code == 204

    get_response = client.get(f"/api/pipeline-templates/{template.id}", headers=auth_headers)
    assert get_response.status_code == 404
