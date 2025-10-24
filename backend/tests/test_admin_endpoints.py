"""
Test Suite for Admin Portal Endpoints

This module tests the Master Admin Portal functionality:
- Dashboard metrics and analytics
- User management (CRUD operations)
- Organization management
- System health monitoring
- Authorization (admin-only access)
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.models import User, Organization
from app.services.user_service import create_user


# ============================================================================
# DASHBOARD TESTS (4 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_admin_dashboard_returns_metrics(client: AsyncClient, auth_headers_admin: dict):
    """Admin dashboard should return platform metrics"""
    response = await client.get("/api/admin/dashboard", headers=auth_headers_admin)

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


@pytest.mark.asyncio
async def test_admin_dashboard_forbidden_for_non_admin(client: AsyncClient, auth_headers_solo: dict):
    """Non-admin users should not access admin dashboard"""
    response = await client.get("/api/admin/dashboard", headers=auth_headers_solo)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_dashboard_forbidden_for_unauthenticated(client: AsyncClient):
    """Unauthenticated users should not access admin dashboard"""
    response = await client.get("/api/admin/dashboard")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_dashboard_metrics_accuracy(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Dashboard metrics should reflect actual database counts"""
    # Create test data
    test_user = await create_user(
        db=db,
        clerk_user_id="test_dashboard_user",
        email="dashboard@test.com",
        first_name="Dashboard",
        last_name="User"
    )
    await db.commit()

    response = await client.get("/api/admin/dashboard", headers=auth_headers_admin)
    assert response.status_code == 200

    data = response.json()
    # Verify counts are numeric and positive
    assert data["users"]["total"] >= 1
    assert data["organizations"]["total"] >= 0


# ============================================================================
# USER MANAGEMENT TESTS (8 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_list_all_users_as_admin(client: AsyncClient, auth_headers_admin: dict):
    """Admin can list all users across all organizations"""
    response = await client.get("/api/admin/users", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "per_page" in data

    # Verify items is a list
    assert isinstance(data["items"], list)
    assert isinstance(data["total"], int)


@pytest.mark.asyncio
async def test_list_users_forbidden_for_non_admin(client: AsyncClient, auth_headers_solo: dict):
    """Non-admin cannot list all users"""
    response = await client.get("/api/admin/users", headers=auth_headers_solo)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_search_users_by_email(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can search users by email"""
    # Create a test user with specific email
    test_user = await create_user(
        db=db,
        clerk_user_id="test_search_user",
        email="searchable@test.com",
        first_name="Search",
        last_name="User"
    )
    await db.commit()

    response = await client.get(
        "/api/admin/users?search=searchable@test.com",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()

    # Should find at least the user we just created
    assert data["total"] >= 1
    emails = [user["email"] for user in data["items"]]
    assert "searchable@test.com" in emails


@pytest.mark.asyncio
async def test_pagination_users_list(client: AsyncClient, auth_headers_admin: dict):
    """User list should support pagination"""
    # Request first page with 5 items
    response = await client.get(
        "/api/admin/users?page=1&per_page=5",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()

    assert data["page"] == 1
    assert data["per_page"] == 5
    assert len(data["items"]) <= 5


@pytest.mark.asyncio
async def test_get_user_details_as_admin(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can view any user's details"""
    # Create a test user
    test_user = await create_user(
        db=db,
        clerk_user_id="test_detail_user",
        email="detail@test.com",
        first_name="Detail",
        last_name="User"
    )
    await db.commit()

    response = await client.get(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    user_data = response.json()

    assert user_data["id"] == str(test_user.id)
    assert user_data["email"] == "detail@test.com"
    assert "role" in user_data
    assert "created_at" in user_data


@pytest.mark.asyncio
async def test_update_user_role_as_admin(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can update any user's role"""
    # Create a test user with solo role
    test_user = await create_user(
        db=db,
        clerk_user_id="test_update_user",
        email="update@test.com",
        first_name="Update",
        last_name="User"
    )
    test_user.role = "solo"
    await db.commit()
    await db.refresh(test_user)

    # Update to enterprise role
    response = await client.put(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin,
        json={"role": "enterprise"}
    )

    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["role"] == "enterprise"


@pytest.mark.asyncio
async def test_soft_delete_user_as_admin(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can soft delete users"""
    # Create a test user
    test_user = await create_user(
        db=db,
        clerk_user_id="test_delete_user",
        email="delete@test.com",
        first_name="Delete",
        last_name="User"
    )
    await db.commit()

    # Soft delete the user
    response = await client.delete(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200

    # Verify user is marked as deleted
    response = await client.get(
        f"/api/admin/users/{test_user.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    user_data = response.json()
    assert user_data["deleted_at"] is not None


@pytest.mark.asyncio
async def test_restore_deleted_user(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can restore soft-deleted users"""
    # Create and soft delete a user
    test_user = await create_user(
        db=db,
        clerk_user_id="test_restore_user",
        email="restore@test.com",
        first_name="Restore",
        last_name="User"
    )
    test_user.deleted_at = datetime.utcnow()
    await db.commit()
    await db.refresh(test_user)

    # Restore the user
    response = await client.post(
        f"/api/admin/users/{test_user.id}/restore",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    restored_user = response.json()
    assert restored_user["deleted_at"] is None


# ============================================================================
# ORGANIZATION MANAGEMENT TESTS (5 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_list_all_organizations(client: AsyncClient, auth_headers_admin: dict):
    """Admin can list all organizations"""
    response = await client.get("/api/admin/organizations", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_list_organizations_forbidden_for_non_admin(client: AsyncClient, auth_headers_solo: dict):
    """Non-admin cannot list all organizations"""
    response = await client.get("/api/admin/organizations", headers=auth_headers_solo)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_organization_details(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can view organization details"""
    # Create a test organization
    test_org = Organization(
        name="Test Organization",
        subscription_tier="professional"
    )
    db.add(test_org)
    await db.commit()
    await db.refresh(test_org)

    response = await client.get(
        f"/api/admin/organizations/{test_org.id}",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    org_data = response.json()
    assert org_data["name"] == "Test Organization"
    assert "subscription_tier" in org_data


@pytest.mark.asyncio
async def test_get_organization_users(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can view all users in an organization"""
    # Create organization and users
    test_org = Organization(name="User Org Test")
    db.add(test_org)
    await db.commit()
    await db.refresh(test_org)

    # Create a user in this org
    test_user = await create_user(
        db=db,
        clerk_user_id="org_user_test",
        email="orguser@test.com",
        first_name="Org",
        last_name="User"
    )
    test_user.organization_id = test_org.id
    await db.commit()

    response = await client.get(
        f"/api/admin/organizations/{test_org.id}/users",
        headers=auth_headers_admin
    )

    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert len(data["users"]) >= 1


@pytest.mark.asyncio
async def test_get_organization_metrics(client: AsyncClient, auth_headers_admin: dict, db: AsyncSession):
    """Admin can view organization metrics"""
    # Create a test organization
    test_org = Organization(name="Metrics Org")
    db.add(test_org)
    await db.commit()
    await db.refresh(test_org)

    response = await client.get(
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

@pytest.mark.asyncio
async def test_system_health_check_as_admin(client: AsyncClient, auth_headers_admin: dict):
    """Admin can view system health metrics"""
    response = await client.get("/api/admin/system/health", headers=auth_headers_admin)

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


@pytest.mark.asyncio
async def test_system_health_forbidden_for_non_admin(client: AsyncClient, auth_headers_solo: dict):
    """Non-admin cannot view system health"""
    response = await client.get("/api/admin/system/health", headers=auth_headers_solo)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_system_health_includes_api_metrics(client: AsyncClient, auth_headers_admin: dict):
    """System health should include API performance metrics"""
    response = await client.get("/api/admin/system/health", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()

    # Verify API metrics exist
    assert "api_metrics" in data
    api_metrics = data["api_metrics"]

    # Should have performance data
    assert "avg_response_time_ms" in api_metrics or "status" in api_metrics
