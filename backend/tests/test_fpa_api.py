"""Backend contract tests for FP&A endpoints."""
from __future__ import annotations

from unittest.mock import AsyncMock

import pytest

from app.api.dependencies.auth import get_current_user
from app.services import entitlement_service


@pytest.fixture(autouse=True)
def allow_fpa_access(monkeypatch):
    """Allow FP&A feature checks for the duration of each test."""
    mock = AsyncMock(return_value=True)
    monkeypatch.setattr(entitlement_service, "check_feature_access", mock)
    return mock


def _authorize_user(dependency_overrides, user):
    dependency_overrides(get_current_user, lambda: user)


def test_dashboard_metrics_returns_expected_shape(client, dependency_overrides, solo_user):
    _authorize_user(dependency_overrides, solo_user)

    response = client.get("/api/fpa/dashboard")

    assert response.status_code == 200
    data = response.json()
    assert data["active_orders"] == 1250
    assert data["working_capital_growth"] == pytest.approx(13.5)


def test_production_metrics_feed_frontend_tables(client, dependency_overrides, solo_user):
    _authorize_user(dependency_overrides, solo_user)

    response = client.get("/api/fpa/production")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    first = data[0]
    assert {"date", "units_produced", "efficiency", "downtime"} <= set(first.keys())


def test_ai_chat_returns_response_with_context(client, dependency_overrides, solo_user):
    _authorize_user(dependency_overrides, solo_user)

    payload = {
        "message": "Summarize cash runway.",
        "conversation_history": [],
        "context": {"current_page": "production"},
    }
    response = client.post("/api/fpa/ai-chat", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "cash runway" in data["response"].lower()
    assert data["context_used"] == ["fpa_module", "production"]
