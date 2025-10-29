"""
Test Suite for Admin Portal Endpoints

This module tests the Master Admin Portal functionality:
- Dashboard metrics and analytics
- User management (CRUD operations)
- Organization management
- System health monitoring
- Authorization (admin-only access)

All tests are synchronous for simplicity and speed.
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone

from app.models.user import User
from app.models.organization import Organization


# ============================================================================
# DASHBOARD TESTS (4 tests)
# ============================================================================

def test_admin_dashboard_returns_metrics(client: TestClient, auth_headers_admin: dict):
    """Admin dashboard should return platform metrics"""
    response = client.get("/api/admin/dashboard", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    # Verify all required sections exist
    assert "users" in data
    assert "organizations" in data
    assert "revenue" in data
    assert "activity" in data

    # Verify user metrics structure
    assert "total" in data["users"]
    assert "active_last_30_days" in data["users"]
    assert "new_this_month" in data["users"]

    # Verify organization metrics
    assert "total" in data["organizations"]
    assert "new_this_month" in data["organizations"]

    # Verify revenue metrics
    assert "mrr" in data["revenue"]
    assert "arr_projection" in data["revenue"]


def test_admin_dashboard_forbidden_for_non_admin(client: TestClient, auth_headers_solo: dict):
    """Non-admin users should not access admin dashboard"""
    response = client.get("/api/admin/dashboard", headers=auth_headers_solo)
    assert response.status_code == 403


def test_admin_dashboard_forbidden_for_unauthenticated(client: TestClient):
    """Unauthenticated users should not access admin dashboard"""
    response = client.get("/api/admin/dashboard")
    assert response.status_code == 401


def test_admin_dashboard_metrics_accuracy(client: TestClient, auth_headers_admin: dict, db_session):
    """Dashboard metrics should reflect actual database counts"""
    # Create test data
    test_org = Organization(
        id="test-metrics-org",
        name="Metrics Org",
        slug="metrics_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="test-metrics-user",
        clerk_user_id="test_clerk_metrics_user",
        email="metrics@test.com",
        first_name="Metrics",
        last_name="User",
        role="solo",
        organization_id="test-metrics-org"
    )
    db_session.add(test_user)
    db_session.commit()

    response = client.get("/api/admin/dashboard", headers=auth_headers_admin)
    assert response.status_code == 200

    data = response.json()
    # Verify counts are numeric and positive (includes test data)
    assert data["users"]["total"] >= 1  # At least metrics user exists
    assert data["organizations"]["total"] >= 1  # At least metrics org exists


# ============================================================================
# USER MANAGEMENT TESTS (8 tests)
# ============================================================================

def test_list_all_users_as_admin(client: TestClient, auth_headers_admin: dict):
    """Admin can list all users across all organizations"""
    response = client.get("/api/admin/users", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "per_page" in data

    # Verify items is a list
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)


def test_list_users_forbidden_for_non_admin(client: TestClient, auth_headers_solo: dict):
    """Non-admin cannot list all users"""
    response = client.get("/api/admin/users", headers=auth_headers_solo)
    assert response.status_code == 403


def test_search_users_by_email(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can search users by email"""
    # Create a test user with specific email
    test_org = Organization(
        id="search-org",
        name="Search Org",
        slug="search_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="search-user",
        clerk_user_id="test_clerk_search_user",
        email="searchable@test.com",
        first_name="Search",
        last_name="User",
        role="solo",
        organization_id="search-org"
    )
    db_session.add(test_user)
    db_session.commit()

    response = client.get(
        "/api/admin/users?search=searchable@test.com",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()

    # Should find at least the user we just created
    assert data["total"] >= 1
    emails = [user["email"] for user in data["items"]]
    assert "searchable@test.com" in emails


def test_pagination_users_list(client: TestClient, auth_headers_admin: dict):
    """User list should support pagination"""
    # Request first page with 5 items
    response = client.get(
        "/api/admin/users?page=1&per_page=5",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()

    assert data["page"] == 1
    assert data["per_page"] == 5
    assert len(data["items"]) <= 5


def test_get_user_details_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can view any user's details"""
    # Create a test user
    test_org = Organization(
        id="detail-org",
        name="Detail Org",
        slug="detail_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="detail-user",
        clerk_user_id="test_clerk_detail_user",
        email="detail@test.com",
        first_name="Detail",
        last_name="User",
        role="solo",
        organization_id="detail-org"
    )
    db_session.add(test_user)
    db_session.commit()

    response = client.get(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    user_data = response.json()

    assert user_data["id"] == str(test_user.id)
    assert user_data["email"] == "detail@test.com"
    assert "role" in user_data
    assert "created_at" in user_data


def test_update_user_role_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can update any user's role"""
    # Create a test user with solo role
    test_org = Organization(
        id="update-org",
        name="Update Org",
        slug="update_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="update-user",
        clerk_user_id="test_clerk_update_user",
        email="update@test.com",
        first_name="Update",
        last_name="User",
        role="solo",
        organization_id="update-org"
    )
    db_session.add(test_user)
    db_session.commit()

    # Update to enterprise role
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin,
        json={"role": "enterprise"}
    )

    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["role"] == "enterprise"


def test_soft_delete_user_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can soft delete users"""
    # Create a test user
    test_org = Organization(
        id="delete-org",
        name="Delete Org",
        slug="delete_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="delete-user",
        clerk_user_id="test_clerk_delete_user",
        email="delete@test.com",
        first_name="Delete",
        last_name="User",
        role="solo",
        organization_id="delete-org"
    )
    db_session.add(test_user)
    db_session.commit()

    # Soft delete the user
    response = client.delete(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200

    # Verify user is marked as deleted
    response = client.get(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    user_data = response.json()
    assert user_data["deleted_at"] is not None


def test_restore_deleted_user(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can restore soft-deleted users"""
    # Create and soft delete a user
    test_org = Organization(
        id="restore-org",
        name="Restore Org",
        slug="restore_org",
        subscription_tier="starter"
    )
    db_session.add(test_org)

    test_user = User(
        id="restore-user",
        clerk_user_id="test_clerk_restore_user",
        email="restore@test.com",
        first_name="Restore",
        last_name="User",
        role="solo",
        organization_id="restore-org",
        deleted_at=datetime.now(timezone.utc)
    )
    db_session.add(test_user)
    db_session.commit()

    # Restore the user
    response = client.post(
        f"/api/admin/users/{test_user.id}/restore",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    restored_user = response.json()
    assert restored_user["deleted_at"] is None


# ============================================================================
# ORGANIZATION MANAGEMENT TESTS (5 tests)
# ============================================================================

def test_list_all_organizations(client: TestClient, auth_headers_admin: dict):
    """Admin can list all organizations"""
    response = client.get("/api/admin/organizations", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_list_organizations_forbidden_for_non_admin(client: TestClient, auth_headers_solo: dict):
    """Non-admin cannot list all organizations"""
    response = client.get("/api/admin/organizations", headers=auth_headers_solo)
    assert response.status_code == 403


def test_get_organization_details(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can view organization details"""
    # Create a test organization
    test_org = Organization(
        id="org-detail",
        name="Test Organization",
        slug="org_detail",
        subscription_tier="professional"
    )
    db_session.add(test_org)
    db_session.commit()

    response = client.get(
        f"/api/admin/organizations/{test_org.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    org_data = response.json()
    assert org_data["name"] == "Test Organization"
    assert "subscription_tier" in org_data


def test_get_organization_users(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can view all users in an organization"""
    # Create organization and users
    test_org = Organization(
        id="org-users",
        name="User Org Test",
        slug="org_users",
        subscription_tier="starter"
    )
    db_session.add(test_org)
    db_session.commit()

    # Create a user in this org
    test_user = User(
        id="org-user",
        clerk_user_id="test_clerk_org_user",
        email="orguser@test.com",
        first_name="Org",
        last_name="User",
        role="solo",
        organization_id=test_org.id
    )
    db_session.add(test_user)
    db_session.commit()

    response = client.get(
        f"/api/admin/organizations/{test_org.id}/users",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert len(data["users"]) >= 1


def test_get_organization_metrics(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can view organization metrics"""
    # Create a test organization
    test_org = Organization(
        id="org-metrics",
        name="Metrics Org",
        slug="org_metrics",
        subscription_tier="starter"
    )
    db_session.add(test_org)
    db_session.commit()

    response = client.get(
        f"/api/admin/organizations/{test_org.id}/metrics",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()
    assert "user_count" in data
    assert "created_at" in data


# ============================================================================
# SYSTEM HEALTH TESTS (3 tests)
# ============================================================================

def test_system_health_check_as_admin(client: TestClient, auth_headers_admin: dict):
    """Admin can view system health metrics"""
    response = client.get("/api/admin/system/health", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    # Verify required health sections
    assert "database" in data
    assert "clerk" in data
    assert "api_metrics" in data

    # Verify database health structure
    assert "status" in data["database"]

    # Verify Clerk health
    assert "status" in data["clerk"]
    assert "configured" in data["clerk"]


def test_system_health_forbidden_for_non_admin(client: TestClient, auth_headers_solo: dict):
    """Non-admin cannot view system health"""
    response = client.get("/api/admin/system/health", headers=auth_headers_solo)
    assert response.status_code == 403


def test_system_health_includes_api_metrics(client: TestClient, auth_headers_admin: dict):
    """System health should include API performance metrics"""
    response = client.get("/api/admin/system/health", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    # Verify API metrics exist
    assert "api_metrics" in data
    api_metrics = data["api_metrics"]

    # Should have performance data
    assert "avg_response_time_ms" in api_metrics or "status" in api_metrics
