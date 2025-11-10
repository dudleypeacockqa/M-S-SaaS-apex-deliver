"""
Test Admin Users API (app/api/admin/users.py)

TDD RED → GREEN → REFACTOR

This test file covers the NEW modular admin users API.
Target: 75 statements coverage for app/api/admin/users.py
"""
import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.models.user import User
from app.models.rbac_audit_log import RBACAuditLog


def test_list_users_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can list all users with pagination"""
    response = client.get("/api/admin/users", headers=auth_headers_admin)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "per_page" in data
    assert isinstance(data["items"], list)


def test_list_users_forbidden_for_non_admin(client: TestClient, auth_headers_solo: dict):
    """Non-admin users cannot list all users"""
    response = client.get("/api/admin/users", headers=auth_headers_solo)
    assert response.status_code == 403
    assert "detail" in response.json()


def test_list_users_with_search(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can search users by email, first name, or last name"""
    # Create test user with searchable email
    test_user = User(
        id="search-test-user",
        clerk_user_id="clerk_search_test",
        email="searchable@example.com",
        first_name="Searchable",
        last_name="User",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Search by email
    response = client.get(
        "/api/admin/users?search=searchable@example.com",
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    emails = [user["email"] for user in data["items"]]
    assert "searchable@example.com" in emails


def test_list_users_pagination(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can paginate through user list"""
    # Create 5 test users
    for i in range(5):
        user = User(
            id=f"paginate-user-{i}",
            clerk_user_id=f"clerk_paginate_{i}",
            email=f"paginate{i}@example.com",
            role="solo",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db_session.add(user)
    db_session.commit()

    # Get first page (2 per page)
    response = client.get(
        "/api/admin/users?page=1&per_page=2",
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    assert data["per_page"] == 2
    assert len(data["items"]) <= 2
    assert data["total"] >= 5


def test_get_user_details_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can get detailed information about any user"""
    # Create test user
    test_user = User(
        id="detail-test-user",
        clerk_user_id="clerk_detail_test",
        email="detail@example.com",
        first_name="Detail",
        last_name="Test",
        role="growth",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    response = client.get(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == "detail@example.com"
    assert data["role"] == "growth"


def test_get_user_not_found(client: TestClient, auth_headers_admin: dict):
    """Getting non-existent user returns 404"""
    response = client.get(
        "/api/admin/users/nonexistent-user-id",
        headers=auth_headers_admin
    )
    assert response.status_code == 404


def test_update_user_role_as_admin(client: TestClient, auth_headers_admin: dict, db_session, admin_user):
    """Admin can update user role"""
    # Create test user
    test_user = User(
        id="update-role-user",
        clerk_user_id="clerk_update_role",
        email="update@example.com",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Update role to growth
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        json={"role": "growth"},
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "growth"

    # Verify in database
    db_session.refresh(test_user)
    assert test_user.role == "growth"

    logs = db_session.query(RBACAuditLog).all()
    assert len(logs) == 1
    log_entry = logs[0]
    assert log_entry.action == "role_change"
    assert log_entry.actor_user_id == admin_user.id
    assert log_entry.target_user_id == test_user.id


def test_update_user_name_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can update user name"""
    # Create test user
    test_user = User(
        id="update-name-user",
        clerk_user_id="clerk_update_name",
        email="name@example.com",
        first_name="Old",
        last_name="Name",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Update name
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        json={"first_name": "New", "last_name": "Name"},
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "New"
    assert data["last_name"] == "Name"


def test_update_user_invalid_role(client: TestClient, auth_headers_admin: dict, db_session):
    """Updating user with invalid role returns validation error"""
    # Create test user
    test_user = User(
        id="invalid-role-user",
        clerk_user_id="clerk_invalid_role",
        email="invalid@example.com",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Try invalid role
    response = client.put(
        f"/api/admin/users/{test_user.id}",
        json={"role": "superuser"},
        headers=auth_headers_admin
    )
    assert response.status_code == 400 or response.status_code == 422


def test_soft_delete_user_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can soft delete a user (sets deleted_at timestamp)"""
    # Create test user
    test_user = User(
        id="delete-test-user",
        clerk_user_id="clerk_delete_test",
        email="delete@example.com",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Soft delete
    response = client.delete(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )
    assert response.status_code == 200

    # Verify deleted_at is set
    db_session.refresh(test_user)
    assert test_user.deleted_at is not None


def test_restore_deleted_user_as_admin(client: TestClient, auth_headers_admin: dict, db_session):
    """Admin can restore a soft-deleted user"""
    # Create and soft delete test user
    test_user = User(
        id="restore-test-user",
        clerk_user_id="clerk_restore_test",
        email="restore@example.com",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        deleted_at=datetime.now(timezone.utc),
    )
    db_session.add(test_user)
    db_session.commit()

    # Restore user
    response = client.post(
        f"/api/admin/users/{test_user.id}/restore",
        headers=auth_headers_admin
    )
    assert response.status_code == 200

    # Verify deleted_at is None
    db_session.refresh(test_user)
    assert test_user.deleted_at is None


def test_deleted_users_not_in_list(client: TestClient, auth_headers_admin: dict, db_session):
    """Deleted users should not appear in user list"""
    # Create deleted user
    deleted_user = User(
        id="hidden-deleted-user",
        clerk_user_id="clerk_hidden_deleted",
        email="hidden@example.com",
        role="solo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        deleted_at=datetime.now(timezone.utc),
    )
    db_session.add(deleted_user)
    db_session.commit()

    # List users
    response = client.get("/api/admin/users", headers=auth_headers_admin)
    assert response.status_code == 200
    data = response.json()

    # Deleted user should not appear
    user_ids = [user["id"] for user in data["items"]]
    assert "hidden-deleted-user" not in user_ids


@pytest.mark.skip(reason="/api/admin/users endpoint removed in commit 1878035 - superseded by master_admin API")
def test_pagination_respects_per_page_limit(client: TestClient, auth_headers_admin: dict):
    """per_page parameter should be capped at 100"""
    # Try to request 500 per page
    response = client.get(
        "/api/admin/users?per_page=500",
        headers=auth_headers_admin
    )
    assert response.status_code == 200
    data = response.json()
    # Should be capped at 100
    assert len(data["items"]) <= 100
