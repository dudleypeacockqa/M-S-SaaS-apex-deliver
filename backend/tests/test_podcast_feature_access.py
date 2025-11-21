"""Tests for podcast feature entitlement endpoints."""

from fastapi import status


def test_master_admin_without_org_can_access_feature_endpoint(client, auth_headers_master_admin_no_org):
    response = client.get("/api/podcasts/features/podcast_audio", headers=auth_headers_master_admin_no_org)
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["feature"] == "podcast_audio"
    assert body["has_access"] is True
    assert body["upgrade_required"] is False
