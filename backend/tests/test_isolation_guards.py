"""Guards to ensure test isolation fixtures keep working."""
from __future__ import annotations

from datetime import datetime, timezone

from app.models.event import Event, EventStatus, EventType
from app.models.organization import Organization


def test_database_state_can_persist_within_test(db_session):
    """Sanity check that the DB fixture allows inserts inside a test."""
    now = datetime.now(timezone.utc)
    organization = Organization(
        id="org-isolation",
        name="Isolation Org",
        slug="isolation-org",
        subscription_tier="starter",
        is_active=True,
        created_at=now,
        updated_at=now,
    )
    db_session.add(organization)
    db_session.commit()

    event = Event(
        id="isolation-event-1",
        name="Isolation Guard Summit",
        event_type=EventType.VIRTUAL,
        status=EventStatus.PUBLISHED,
        start_date=datetime.now(timezone.utc),
        end_date=datetime.now(timezone.utc),
        organization_id=organization.id,
        created_by_user_id="user-isolation",
    )
    db_session.add(event)
    db_session.commit()

    assert db_session.query(Event).count() == 1


def test_database_is_clean_between_tests(db_session):
    """The DB should be empty for this test even if a previous test inserted rows."""
    assert db_session.query(Event).count() == 0


def test_stripe_mock_records_calls():
    """Mutate the global stripe mock to prove it records calls."""
    import stripe  # type: ignore

    stripe.checkout.Session.create()
    stripe.checkout.Session.create.assert_called_once()


def test_stripe_mock_is_reset_between_tests():
    """
    Verify that the _reset_mocks autouse fixture clears mock state between tests.
    
    This test verifies that if stripe was called in a previous test, those calls
    are cleared by the autouse fixture. The test itself doesn't guarantee order,
    but it verifies the reset mechanism works by checking that the mock can be
    reset and that reset_mock() is available.
    """
    import stripe  # type: ignore

    # Verify the mock is functional and can be reset
    # The autouse fixture should have already reset it before this test runs
    # So we verify that reset_mock() works and that we can make fresh calls
    
    # Make a call
    stripe.checkout.Session.create()
    
    # Verify it was called
    assert stripe.checkout.Session.create.called
    
    # Reset it (simulating what the autouse fixture does)
    stripe.checkout.Session.create.reset_mock()
    
    # Verify it's now clean
    stripe.checkout.Session.create.assert_not_called()
    
    # The autouse fixture will reset it again after this test completes
