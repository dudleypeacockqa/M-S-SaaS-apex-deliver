"""Test suite for Deal CRUD endpoints (TDD RED phase)."""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

import pytest

from app.models.deal import DealStage
from app.models.user import UserRole


# ============================================================================
# CREATE DEAL TESTS (5 tests)
# ============================================================================


def test_create_deal_success(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can create a deal with all required fields."""
    org = create_organization(name="Deal Org")
    user = create_user(email="dealer@example.com", organization_id=str(org.id))
    token = f"Bearer mock_token_{user.id}"

    # Override auth dependency to return our test user
    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.post(
        "/api/deals",
        headers={"Authorization": token},
        json={
            "name": "Acme Corp Acquisition",
            "target_company": "Acme Corp",
            "industry": "Technology",
            "deal_size": "5000000.00",
            "currency": "GBP",
            "stage": "sourcing",
            "description": "Strategic acquisition opportunity",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Acme Corp Acquisition"
    assert data["target_company"] == "Acme Corp"
    assert data["industry"] == "Technology"
    assert data["deal_size"] == "5000000.00"
    assert data["currency"] == "GBP"
    assert data["stage"] == "sourcing"
    assert data["organization_id"] == str(org.id)
    assert data["owner_id"] == str(user.id)
    assert "id" in data
    assert "created_at" in data


def test_create_deal_validation_errors(
    client,
    create_user,
    create_organization,
    dependency_overrides,
):
    """Invalid inputs are rejected with validation errors."""
    org = create_organization(name="Deal Org")
    user = create_user(email="dealer@example.com", organization_id=str(org.id))
    token = f"Bearer mock_token_{user.id}"

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Missing required field: target_company
    response = client.post(
        "/api/deals",
        headers={"Authorization": token},
        json={"name": "Test Deal", "industry": "Tech"},
    )

    assert response.status_code == 422  # Validation error


def test_create_deal_sets_owner_and_org(
    client,
    create_user,
    create_organization,
    dependency_overrides,
):
    """Deal is automatically associated with user's organization and set as owner."""
    org = create_organization(name="Auto Org")
    user = create_user(email="owner@example.com", organization_id=str(org.id))
    token = f"Bearer mock_token_{user.id}"

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.post(
        "/api/deals",
        headers={"Authorization": token},
        json={"name": "Auto Deal", "target_company": "Target Inc"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["organization_id"] == str(org.id)
    assert data["owner_id"] == str(user.id)


def test_create_deal_requires_auth(client):
    """Unauthenticated users cannot create deals."""
    response = client.post(
        "/api/deals",
        json={"name": "Unauthorized Deal", "target_company": "Test Co"},
    )

    assert response.status_code == 401


def test_create_deal_default_stage(
    client,
    create_user,
    create_organization,
    dependency_overrides,
):
    """Deal defaults to 'sourcing' stage if not specified."""
    org = create_organization(name="Default Org")
    user = create_user(email="default@example.com", organization_id=str(org.id))
    token = f"Bearer mock_token_{user.id}"

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.post(
        "/api/deals",
        headers={"Authorization": token},
        json={"name": "Default Stage Deal", "target_company": "Default Inc"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["stage"] == "sourcing"


# ============================================================================
# LIST DEALS TESTS (7 tests)
# ============================================================================


def test_list_deals_returns_org_deals_only(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Users only see deals from their organization (multi-tenant isolation)."""
    org1 = create_organization(name="Org 1")
    org2 = create_organization(name="Org 2")
    user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
    user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

    from app.models.deal import Deal
    from app.main import app

    # Create deals in different orgs
    deal1 = Deal(
        name="Org 1 Deal",
        target_company="Target 1",
        organization_id=str(org1.id),
        owner_id=str(user1.id),
        stage=DealStage.sourcing,
    )
    deal2 = Deal(
        name="Org 2 Deal",
        target_company="Target 2",
        organization_id=str(org2.id),
        owner_id=str(user2.id),
        stage=DealStage.sourcing,
    )
    db_session.add_all([deal1, deal2])
    db_session.commit()

    # User 1 should only see their org's deal
    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user1)

    response = client.get("/api/deals", headers={"Authorization": "Bearer token1"})

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Org 1 Deal"

def test_list_deals_pagination_works(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Pagination returns correct number of items."""
    org = create_organization(name="Pagination Org")
    user = create_user(email="paginate@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    # Create 10 deals
    for i in range(10):
        deal = Deal(
            name=f"Deal {i}",
            target_company=f"Target {i}",
            organization_id=str(org.id),
            owner_id=str(user.id),
            stage=DealStage.sourcing,
        )
        db_session.add(deal)
    db_session.commit()

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Request first 5
    response = client.get(
        "/api/deals",
        headers={"Authorization": "Bearer token"},
        params={"page": 1, "per_page": 5},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
    assert data["total"] == 10
    assert data["page"] == 1
    assert data["per_page"] == 5

def test_list_deals_filter_by_stage(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Users can filter deals by stage."""
    org = create_organization(name="Filter Org")
    user = create_user(email="filter@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    # Create deals in different stages
    deal1 = Deal(
        name="Sourcing Deal",
        target_company="Target A",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    deal2 = Deal(
        name="Due Diligence Deal",
        target_company="Target B",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.due_diligence,
    )
    db_session.add_all([deal1, deal2])
    db_session.commit()

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Filter by due_diligence stage
    response = client.get(
        "/api/deals",
        headers={"Authorization": "Bearer token"},
        params={"stage": "due_diligence"},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["stage"] == "due_diligence"



def test_list_deals_search_by_name(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Users can search deals by name or target company."""
    org = create_organization(name="Search Org")
    user = create_user(email="search@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal1 = Deal(
        name="Searchable Deal",
        target_company="Target X",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    deal2 = Deal(
        name="Other Deal",
        target_company="Target Y",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add_all([deal1, deal2])
    db_session.commit()

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Search for "Searchable"
    response = client.get(
        "/api/deals",
        headers={"Authorization": "Bearer token"},
        params={"search": "Searchable"},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert "Searchable" in data["items"][0]["name"]

def test_list_deals_sort_by_created_at(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Deals can be sorted by created_at."""
    org = create_organization(name="Sort Org")
    user = create_user(email="sort@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app
    import time

    # Create deals with slight time difference
    deal1 = Deal(
        name="First Deal",
        target_company="Target 1",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal1)
    db_session.commit()
    time.sleep(0.01)  # Small delay

    deal2 = Deal(
        name="Second Deal",
        target_company="Target 2",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal2)
    db_session.commit()

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Sort by created_at descending (newest first)
    response = client.get(
        "/api/deals",
        headers={"Authorization": "Bearer token"},
        params={"sort": "-created_at"},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["items"][0]["name"] == "Second Deal"  # Newest first

def test_list_deals_excludes_archived(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Archived deals are hidden by default."""
    org = create_organization(name="Archive Org")
    user = create_user(email="archive@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    # Create active and archived deals
    deal1 = Deal(
        name="Active Deal",
        target_company="Active Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
        is_archived=False,
    )
    deal2 = Deal(
        name="Archived Deal",
        target_company="Archived Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
        is_archived=True,
        archived_at=datetime.now(timezone.utc),
    )
    db_session.add_all([deal1, deal2])
    db_session.commit()

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Default list should exclude archived
    response = client.get("/api/deals", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Active Deal"



def test_list_deals_requires_auth(client):
    """Unauthenticated users cannot list deals."""
    response = client.get("/api/deals")
    assert response.status_code == 401


# ============================================================================
# GET DEAL TESTS (4 tests)
# ============================================================================


def test_get_deal_success(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can retrieve deal details by ID."""
    org = create_organization(name="Get Org")
    user = create_user(email="getter@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="Detailed Deal",
        target_company="Detail Co",
        industry="Finance",
        deal_size=Decimal("10000000.00"),
        currency="USD",
        stage=DealStage.evaluation,
        description="Full details here",
        organization_id=str(org.id),
        owner_id=str(user.id),
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.get(f"/api/deals/{deal.id}", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == deal.id
    assert data["name"] == "Detailed Deal"
    assert data["target_company"] == "Detail Co"
    assert data["industry"] == "Finance"
    assert data["deal_size"] == "10000000.00"
    assert data["currency"] == "USD"
    assert data["stage"] == "evaluation"
    assert data["description"] == "Full details here"

def test_get_deal_not_found(
    client,
    create_user,
    create_organization,
    dependency_overrides,
):
    """Non-existent deal returns 404."""
    org = create_organization(name="404 Org")
    user = create_user(email="404@example.com", organization_id=str(org.id))

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.get("/api/deals/nonexistent-id", headers={"Authorization": "Bearer token"})

    assert response.status_code == 404



def test_get_deal_forbidden_other_org(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User cannot view deals from other organizations (returns 404 to not leak info)."""
    org1 = create_organization(name="Org A")
    org2 = create_organization(name="Org B")
    user1 = create_user(email="user1@example.com", organization_id=str(org1.id))
    user2 = create_user(email="user2@example.com", organization_id=str(org2.id))

    from app.models.deal import Deal
    from app.main import app

    # Deal belongs to org2
    deal = Deal(
        name="Org 2 Deal",
        target_company="Target 2",
        organization_id=str(org2.id),
        owner_id=str(user2.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user1)

    response = client.get(f"/api/deals/{deal.id}", headers={"Authorization": "Bearer token"})

    # Returns 404 to not leak information about deals in other orgs
    assert response.status_code == 404



def test_get_deal_requires_auth(client):
    """Unauthenticated users cannot get deal details."""
    response = client.get("/api/deals/some-id")
    assert response.status_code == 401


# ============================================================================
# UPDATE DEAL TESTS (5 tests)
# ============================================================================


def test_update_deal_success(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can update all deal fields."""
    org = create_organization(name="Update Org")
    user = create_user(email="updater@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="Original Name",
        target_company="Original Co",
        industry="Tech",
        deal_size=Decimal("5000000.00"),
        currency="GBP",
        stage=DealStage.sourcing,
        description="Original description",
        organization_id=str(org.id),
        owner_id=str(user.id),
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.put(
        f"/api/deals/{deal.id}",
        headers={"Authorization": "Bearer token"},
        json={
            "name": "Updated Name",
            "target_company": "Updated Co",
            "industry": "Finance",
            "deal_size": "10000000.00",
            "currency": "USD",
            "stage": "evaluation",
            "description": "Updated description",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["target_company"] == "Updated Co"
    assert data["industry"] == "Finance"
    assert data["deal_size"] == "10000000.00"
    assert data["currency"] == "USD"
    assert data["stage"] == "evaluation"
    assert data["description"] == "Updated description"

def test_update_deal_stage_change(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can progress deal through pipeline stages."""
    org = create_organization(name="Stage Org")
    user = create_user(email="stager@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="Stage Deal",
        target_company="Stage Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Progress through stages
    for stage in ["evaluation", "due_diligence", "negotiation", "closing", "won"]:
        response = client.put(
            f"/api/deals/{deal.id}",
            headers={"Authorization": "Bearer token"},
            json={"stage": stage},
        )
        assert response.status_code == 200
        assert response.json()["stage"] == stage

def test_update_deal_partial_update(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Partial updates work (only specified fields are updated)."""
    org = create_organization(name="Partial Org")
    user = create_user(email="partial@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="Original Name",
        target_company="Original Co",
        industry="Tech",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Update only the name
    response = client.put(
        f"/api/deals/{deal.id}",
        headers={"Authorization": "Bearer token"},
        json={"name": "Updated Name Only"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name Only"
    assert data["target_company"] == "Original Co"  # Unchanged
    assert data["industry"] == "Tech"  # Unchanged



def test_update_deal_forbidden_other_org(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User cannot update deals from other organizations."""
    org1 = create_organization(name="Org X")
    org2 = create_organization(name="Org Y")
    user1 = create_user(email="userx@example.com", organization_id=str(org1.id))
    user2 = create_user(email="usery@example.com", organization_id=str(org2.id))

    from app.models.deal import Deal
    from app.main import app

    # Deal belongs to org2
    deal = Deal(
        name="Org Y Deal",
        target_company="Target Y",
        organization_id=str(org2.id),
        owner_id=str(user2.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user1)

    response = client.put(
        f"/api/deals/{deal.id}",
        headers={"Authorization": "Bearer token"},
        json={"name": "Hacked Name"},
    )

    assert response.status_code == 403

def test_update_deal_validation_errors(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """Invalid update inputs are rejected."""
    org = create_organization(name="Validation Org")
    user = create_user(email="validator@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="Valid Deal",
        target_company="Valid Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    # Try to set invalid deal_size (negative)
    response = client.put(
        f"/api/deals/{deal.id}",
        headers={"Authorization": "Bearer token"},
        json={"deal_size": "-1000"},
    )

    assert response.status_code == 422  # Validation error



# ============================================================================
# ARCHIVE/UNARCHIVE TESTS (4 tests)
# ============================================================================


def test_archive_deal_success(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can archive a deal (soft delete)."""
    org = create_organization(name="Archive Org")
    user = create_user(email="archiver@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    deal = Deal(
        name="To Archive",
        target_company="Archive Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.lost,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.delete(f"/api/deals/{deal.id}", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Deal archived successfully"

    # Verify deal is archived in database
    db_session.refresh(deal)
    assert deal.is_archived is True
    assert deal.archived_at is not None

def test_archive_deal_forbidden_other_org(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User cannot archive deals from other organizations."""
    org1 = create_organization(name="Org P")
    org2 = create_organization(name="Org Q")
    user1 = create_user(email="userp@example.com", organization_id=str(org1.id))
    user2 = create_user(email="userq@example.com", organization_id=str(org2.id))

    from app.models.deal import Deal
    from app.main import app

    # Deal belongs to org2
    deal = Deal(
        name="Org Q Deal",
        target_company="Target Q",
        organization_id=str(org2.id),
        owner_id=str(user2.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user1)

    response = client.delete(f"/api/deals/{deal.id}", headers={"Authorization": "Bearer token"})

    assert response.status_code == 403

def test_unarchive_deal_success(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User can restore an archived deal."""
    org = create_organization(name="Restore Org")
    user = create_user(email="restorer@example.com", organization_id=str(org.id))

    from app.models.deal import Deal
    from app.main import app

    # Create archived deal
    deal = Deal(
        name="Archived Deal",
        target_company="Archived Co",
        organization_id=str(org.id),
        owner_id=str(user.id),
        stage=DealStage.lost,
        is_archived=True,
        archived_at=datetime.now(timezone.utc),
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user)

    response = client.post(f"/api/deals/{deal.id}/restore", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    data = response.json()
    assert data["is_archived"] is False
    assert data["archived_at"] is None

def test_unarchive_deal_forbidden_other_org(
    client,
    create_user,
    create_organization,
    db_session,
    dependency_overrides,
):
    """User cannot restore deals from other organizations."""
    org1 = create_organization(name="Org R")
    org2 = create_organization(name="Org S")
    user1 = create_user(email="userr@example.com", organization_id=str(org1.id))
    user2 = create_user(email="users@example.com", organization_id=str(org2.id))

    from app.models.deal import Deal
    from app.main import app

    # Archived deal belongs to org2
    deal = Deal(
        name="Org S Deal",
        target_company="Target S",
        organization_id=str(org2.id),
        owner_id=str(user2.id),
        stage=DealStage.lost,
        is_archived=True,
        archived_at=datetime.now(timezone.utc),
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)

    from app.api.dependencies.auth import get_current_user
    dependency_overrides(get_current_user, lambda: user1)

    response = client.post(f"/api/deals/{deal.id}/restore", headers={"Authorization": "Bearer token"})

    assert response.status_code == 403
