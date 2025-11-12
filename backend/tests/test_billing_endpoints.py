"""Tests for subscription billing endpoints (DEV-009)."""
import pytest
from unittest.mock import Mock, patch
from starlette.testclient import TestClient
from datetime import datetime, timezone

from app.models.user import User, UserRole
from app.models.organization import Organization
from app.models.subscription import Subscription, SubscriptionTier, SubscriptionStatus


def test_create_checkout_session_success(client: TestClient, db_session, create_user, create_organization):
    """Test creating Stripe Checkout session for new subscription."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    # Arrange
    org = create_organization(name="Startup Co")
    user = create_user(email="founder@startup.co", organization_id=str(org.id), role=UserRole.solo)

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.checkout.Session.create') as mock_checkout, \
         patch('app.services.subscription_service.stripe.Customer.create') as mock_customer:

        mock_checkout.return_value = Mock(
            id='cs_test_123',
            url='https://checkout.stripe.com/c/pay/cs_test_123'
        )
        mock_customer.return_value = Mock(
            id='cus_test_123'
        )

        # Act
        response = client.post(
            "/api/billing/create-checkout-session",
            json={"tier": "professional"},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    # Assert
    if response.status_code != 200:
        print(f"ERROR Response: {response.status_code}")
        print(f"Body: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert data["checkout_url"] == 'https://checkout.stripe.com/c/pay/cs_test_123'
    assert data["session_id"] == 'cs_test_123'

    # Verify Stripe was called correctly
    mock_checkout.assert_called_once()
    call_kwargs = mock_checkout.call_args[1]
    assert call_kwargs["mode"] == "subscription"


def test_create_checkout_session_invalid_tier(client: TestClient, auth_headers_solo: dict, create_user, create_organization):
    """Test creating checkout session with invalid tier returns 400."""
    org = create_organization(name="Test Org")
    user = create_user(email="test@example.com", organization_id=str(org.id))

    response = client.post(
        "/api/billing/create-checkout-session",
        json={"tier": "invalid_tier"},
        headers=auth_headers_solo
    )

    assert response.status_code in [400, 422]  # 422 for validation error


def test_create_checkout_session_requires_auth(client: TestClient):
    """Test creating checkout session requires authentication."""
    response = client.post(
        "/api/billing/create-checkout-session",
        json={"tier": "professional"}
    )

    assert response.status_code == 401


def test_create_checkout_session_existing_subscription(client: TestClient, db_session, create_user, create_organization):
    """Test creating checkout session when organization already has active subscription."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Existing Sub Org")
    user = create_user(email="user@existing.co", organization_id=str(org.id))

    # Create existing subscription
    from uuid import uuid4
    existing_sub = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_existing",
        stripe_subscription_id="sub_existing",
        tier=SubscriptionTier.STARTER,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(existing_sub)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.checkout.Session.create') as mock_checkout, \
         patch('app.services.subscription_service.stripe.Customer.create') as mock_customer:

        mock_checkout.return_value = Mock(
            id='cs_upgrade_123',
            url='https://checkout.stripe.com/pay/cs_upgrade_123'
        )
        mock_customer.return_value = Mock(
            id='cus_existing'  # Should use existing customer
        )

        response = client.post(
            "/api/billing/create-checkout-session",
            json={"tier": "professional"},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    # May either reject (400) or create upgrade session (200) - implementation dependent
    assert response.status_code in [200, 400]


def test_create_checkout_session_with_trial(client: TestClient, db_session, create_user, create_organization):
    """Test creating checkout session includes 14-day trial."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Trial Org")
    user = create_user(email="trial@example.com", organization_id=str(org.id))

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.checkout.Session.create') as mock_checkout, \
         patch('app.services.subscription_service.stripe.Customer.create') as mock_customer:

        mock_checkout.return_value = Mock(
            id='cs_trial_123',
            url='https://checkout.stripe.com/pay/cs_trial_123'
        )
        mock_customer.return_value = Mock(
            id='cus_trial_123'
        )

        response = client.post(
            "/api/billing/create-checkout-session",
            json={"tier": "starter"},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200

    # Verify trial period was set
    call_kwargs = mock_checkout.call_args[1]
    assert call_kwargs["subscription_data"]["trial_period_days"] == 14


def test_get_customer_portal_success(client: TestClient, create_user, create_organization):
    """Test retrieving Stripe billing portal URL."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Portal Org")
    user = create_user(email="portal@example.com", organization_id=str(org.id))

    def override_get_current_user():
        return user

    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.create_billing_portal_session') as mock_portal:
        mock_portal.return_value = {"url": "https://billing.stripe.com/session/test"}

        response = client.get(
            "/api/billing/customer-portal",
            headers={"Authorization": "Bearer test_token"},
        )

    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    assert response.json() == {"url": "https://billing.stripe.com/session/test"}
    mock_portal.assert_called_once()


def test_get_customer_portal_handles_value_errors(client: TestClient, create_user, create_organization):
    """Test billing portal endpoint returns 400 when service raises ValueError."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Portal Error Org")
    user = create_user(email="portal-error@example.com", organization_id=str(org.id))

    def override_get_current_user():
        return user

    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.create_billing_portal_session') as mock_portal:
        mock_portal.side_effect = ValueError("No active subscription found")

        response = client.get(
            "/api/billing/customer-portal",
            headers={"Authorization": "Bearer test_token"},
        )

    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 400
    assert response.json()["detail"] == "No active subscription found"


def test_get_subscription_success(client: TestClient, db_session, create_user, create_organization):
    """Test retrieving current subscription."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Sub Org")
    user = create_user(email="user@sub.org", organization_id=str(org.id))

    # Create subscription
    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_test456",
        stripe_subscription_id="sub_test456",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        current_period_start=datetime.now(timezone.utc),
        current_period_end=datetime.now(timezone.utc)
    )
    db_session.add(subscription)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    response = client.get(
        "/api/billing/me",
        headers={"Authorization": "Bearer test_token"}
    )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    data = response.json()
    assert data["tier"] == "professional"
    assert data["status"] == "active"
    assert data["stripe_customer_id"] == "cus_test456"


def test_get_subscription_not_found(client: TestClient, auth_headers_solo: dict, create_user, create_organization):
    """Test retrieving subscription when none exists returns 404."""
    org = create_organization(name="No Sub Org")
    user = create_user(email="user@nosub.org", organization_id=str(org.id))

    response = client.get(
        "/api/billing/me",
        headers=auth_headers_solo
    )

    assert response.status_code == 404


def test_get_subscription_requires_auth(client: TestClient):
    """Test getting subscription requires authentication."""
    response = client.get("/api/billing/me")

    assert response.status_code == 401


def test_update_subscription_tier_upgrade(client: TestClient, db_session, create_user, create_organization):
    """Test upgrading subscription tier."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Upgrade Org")
    user = create_user(email="user@upgrade.org", organization_id=str(org.id))

    # Create existing subscription
    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_upgrade",
        stripe_subscription_id="sub_upgrade123",
        tier=SubscriptionTier.STARTER,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(subscription)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.Subscription.modify') as mock_stripe, \
         patch('app.services.subscription_service.stripe.Subscription.retrieve') as mock_retrieve:

        # Create a proper nested mock structure
        item_mock = Mock()
        item_mock.id = "si_test123"
        mock_retrieve.return_value = {"items": {"data": [item_mock]}}
        mock_stripe.return_value = Mock(
            id='sub_upgrade123',
            status='active'
        )

        response = client.put(
            "/api/billing/change-tier",
            json={"new_tier": "professional", "prorate": True},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    if response.status_code != 200:
        print(f"ERROR: {response.status_code}")
        print(f"Body: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert data["tier"] == "professional"


def test_update_subscription_tier_downgrade(client: TestClient, db_session, create_user, create_organization):
    """Test downgrading subscription tier (at period end)."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Downgrade Org")
    user = create_user(email="user@downgrade.org", organization_id=str(org.id))

    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_downgrade",
        stripe_subscription_id="sub_downgrade123",
        tier=SubscriptionTier.ENTERPRISE,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(subscription)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.Subscription.modify') as mock_stripe, \
         patch('app.services.subscription_service.stripe.Subscription.retrieve') as mock_retrieve:

        # Create a proper nested mock structure
        item_mock = Mock()
        item_mock.id = "si_test123"
        mock_retrieve.return_value = {"items": {"data": [item_mock]}}
        mock_stripe.return_value = Mock(id='sub_downgrade123')

        response = client.put(
            "/api/billing/change-tier",
            json={"new_tier": "starter", "prorate": False},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    if response.status_code != 200:
        print(f"ERROR: {response.status_code}")
        print(f"Body: {response.text}")
    assert response.status_code == 200


def test_cancel_subscription_at_period_end(client: TestClient, db_session, create_user, create_organization):
    """Test canceling subscription at end of billing period."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Cancel Org")
    user = create_user(email="user@cancel.org", organization_id=str(org.id))

    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_cancel",
        stripe_subscription_id="sub_cancel123",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(subscription)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.Subscription.modify') as mock_stripe:
        mock_stripe.return_value = Mock(
            id='sub_cancel123',
            cancel_at_period_end=True
        )

        response = client.post(
            "/api/billing/cancel",
            json={"immediately": False},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    data = response.json()
    assert data["cancel_at_period_end"] is True


def test_cancel_subscription_immediately(client: TestClient, db_session, create_user, create_organization):
    """Test canceling subscription immediately."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    org = create_organization(name="Immediate Cancel Org")
    user = create_user(email="user@immediate.org", organization_id=str(org.id))

    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_imm",
        stripe_subscription_id="sub_imm123",
        tier=SubscriptionTier.STARTER,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(subscription)
    db_session.commit()

    # Override auth to use our test user
    def override_get_current_user():
        return user
    app.dependency_overrides[get_current_user] = override_get_current_user

    with patch('app.services.subscription_service.stripe.Subscription.delete') as mock_stripe:
        mock_stripe.return_value = Mock(
            id='sub_imm123',
            status='canceled'
        )

        response = client.post(
            "/api/billing/cancel",
            json={"immediately": True},
            headers={"Authorization": "Bearer test_token"}
        )

    # Clean up
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "canceled"


def test_cancel_subscription_requires_active_subscription(client: TestClient, auth_headers_solo: dict, create_user, create_organization):
    """Test canceling requires an active subscription."""
    org = create_organization(name="No Active Sub")
    user = create_user(email="user@noactive.org", organization_id=str(org.id))

    response = client.post(
        "/api/billing/cancel",
        json={"immediately": False},
        headers=auth_headers_solo
    )

    assert response.status_code in [400, 404]


def test_customer_portal_redirect(client: TestClient, auth_headers_solo: dict, db_session, create_user, create_organization):
    """Test creating Stripe Customer Portal session."""
    org = create_organization(name="Portal Org")
    user = create_user(email="user@portal.org", organization_id=str(org.id))

    from uuid import uuid4
    subscription = Subscription(
        id=str(uuid4()),
        organization_id=str(org.id),
        stripe_customer_id="cus_portal",
        stripe_subscription_id="sub_portal123",
        tier=SubscriptionTier.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE
    )
    db_session.add(subscription)
    db_session.commit()

    with patch('app.services.subscription_service.create_billing_portal_session') as mock_portal:
        mock_portal.return_value = {"url": "https://billing.stripe.com/session/test"}

        response = client.get(
            "/api/billing/customer-portal",
            headers=auth_headers_solo
        )

    assert response.status_code == 200
    assert response.json()["url"] == "https://billing.stripe.com/session/test"
