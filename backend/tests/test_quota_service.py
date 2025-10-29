"""Tests for quota enforcement service with mocked dependencies."""

from __future__ import annotations

import asyncio
from functools import wraps
from datetime import datetime, UTC
from typing import Any, Awaitable, Callable
from unittest.mock import AsyncMock, Mock, patch

import pytest

from app.core.subscription import SubscriptionTier
from app.services.quota_service import (
    QuotaExceededError,
    check_episode_quota,
    get_monthly_usage,
    get_quota_summary,
    get_remaining_quota,
    increment_episode_count,
)
from app.models.podcast_usage import PodcastUsage


# Tests follow the TDD cadence: RED -> GREEN -> REFACTOR

def async_test(fn: Callable[..., Awaitable[Any]]) -> Callable[..., Any]:
    """Run async tests without pytest-asyncio."""

    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        return asyncio.run(fn(*args, **kwargs))

    return wrapper


class TestCheckEpisodeQuota:
    """Unit tests for `check_episode_quota`."""

    @async_test
    async def test_professional_tier_allows_creation_within_quota(self) -> None:
        org_id = "org_professional"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 5

            can_create = await check_episode_quota(org_id)

        assert can_create is True

    @async_test
    async def test_professional_tier_blocks_creation_at_quota_limit(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_professional"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 10

            with pytest.raises(QuotaExceededError) as exc_info:
                await check_episode_quota(org_id, mock_db_session)

        message = str(exc_info.value).lower()
        assert "exceeded" in message
        assert "10" in message

    @async_test
    async def test_premium_tier_unlimited_never_blocks(self) -> None:
        org_id = "org_premium"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.PREMIUM
            mock_usage.return_value = 999

            can_create = await check_episode_quota(org_id)

        assert can_create is True

    @async_test
    async def test_enterprise_tier_unlimited_never_blocks(self) -> None:
        org_id = "org_enterprise"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.ENTERPRISE
            mock_usage.return_value = 9_999

            can_create = await check_episode_quota(org_id)

        assert can_create is True

    @async_test
    async def test_starter_tier_blocks_all_podcast_creation(self) -> None:
        org_id = "org_starter"

        with patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier:
            mock_tier.return_value = SubscriptionTier.STARTER

            with pytest.raises(QuotaExceededError) as exc_info:
                await check_episode_quota(org_id)

        assert "podcast" in str(exc_info.value).lower()


class TestGetRemainingQuota:
    """Unit tests for `get_remaining_quota`."""

    @async_test
    async def test_professional_tier_returns_correct_remaining(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_professional"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 7

            remaining = await get_remaining_quota(org_id, mock_db_session)

        assert remaining == 3

    @async_test
    async def test_premium_tier_returns_unlimited_indicator(self) -> None:
        org_id = "org_premium"

        with patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier:
            mock_tier.return_value = SubscriptionTier.PREMIUM
            remaining = await get_remaining_quota(org_id)

        assert remaining in (-1, None, float("inf"))

    @async_test
    async def test_returns_zero_when_quota_exhausted(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_professional"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 10

            remaining = await get_remaining_quota(org_id, mock_db_session)

        assert remaining == 0


class TestIncrementEpisodeCount:
    """Unit tests for `increment_episode_count`."""

    @async_test
    async def test_increments_usage_count_in_database(self, db_session) -> None:
        org_id = "org_123"
        current_month = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        usage = PodcastUsage(
            organization_id=org_id,
            month=current_month,
            episode_count=5,
        )
        db_session.add(usage)
        db_session.commit()

        await increment_episode_count(org_id, db_session)

        refreshed = (
            db_session.query(PodcastUsage)
            .filter(
                PodcastUsage.organization_id == org_id,
                PodcastUsage.month == current_month,
            )
            .one()
        )
        assert refreshed.episode_count == 6

    @async_test
    async def test_sync_session_increments_usage(self, db_session) -> None:
        org_id = "org_sync"
        current_month = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        usage = PodcastUsage(
            organization_id=org_id,
            month=current_month,
            episode_count=2,
        )
        db_session.add(usage)
        db_session.commit()

        await increment_episode_count(org_id, db_session)

        refreshed = (
            db_session.query(PodcastUsage)
            .filter(
                PodcastUsage.organization_id == org_id,
                PodcastUsage.month == current_month,
            )
            .one()
        )
        assert refreshed.episode_count == 3

    @async_test
    async def test_creates_new_usage_record_for_first_episode(self, db_session) -> None:
        org_id = "org_new"
        current_month = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        await increment_episode_count(org_id, db_session)

        refreshed = (
            db_session.query(PodcastUsage)
            .filter(
                PodcastUsage.organization_id == org_id,
                PodcastUsage.month == current_month,
            )
            .one()
        )
        assert refreshed.episode_count == 1


class TestGetMonthlyUsage:
    """Unit tests for `get_monthly_usage`."""

    @async_test
    async def test_returns_current_month_usage_count(self, db_session) -> None:
        org_id = "org_123"
        current_month = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        usage_record = PodcastUsage(
            organization_id=org_id,
            month=current_month,
            episode_count=5,
        )
        db_session.add(usage_record)
        db_session.commit()

        usage = await get_monthly_usage(org_id, db_session)

        assert usage == 5

    @async_test
    async def test_sync_session_returns_usage(self, db_session) -> None:
        org_id = "org_sync"
        current_month = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        usage_record = PodcastUsage(
            organization_id=org_id,
            month=current_month,
            episode_count=4,
        )
        db_session.add(usage_record)
        db_session.commit()

        usage = await get_monthly_usage(org_id, db_session)

        assert usage == 4

    @async_test
    async def test_returns_zero_when_no_usage_records(self, db_session) -> None:
        org_id = "org_new"

        usage = await get_monthly_usage(org_id, db_session)

        assert usage == 0


class TestQuotaExceededError:
    """Unit tests for the `QuotaExceededError` exception."""

    def test_quota_exceeded_error_has_clear_message(self) -> None:
        error = QuotaExceededError("Monthly quota of 10 episodes exceeded")

        assert "quota" in str(error).lower()
        assert "10" in str(error)

    def test_quota_exceeded_error_includes_upgrade_guidance(self) -> None:
        error = QuotaExceededError("Monthly quota exceeded. Upgrade to Premium for unlimited episodes.")

        message = str(error).lower()
        assert "upgrade" in message
        assert "premium" in message


class TestGetQuotaSummary:
    """Unit tests for `get_quota_summary`."""

    @async_test
    async def test_returns_professional_summary(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_professional"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 3
            mock_remaining.return_value = 7

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.tier == SubscriptionTier.PROFESSIONAL.value
        assert summary.tier_label == "Professional"
        assert summary.limit == 10
        assert summary.used == 3
        assert summary.remaining == 7
        assert summary.quota_state == "normal"
        assert summary.is_unlimited is False
        assert summary.warning_status is None
        assert summary.warning_message is None
        assert summary.upgrade_required is False
        assert summary.upgrade_message is None
        assert summary.upgrade_cta_url is None
        assert "-" in summary.period

    @async_test
    async def test_returns_unlimited_summary(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_premium"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PREMIUM
            mock_usage.return_value = 5
            mock_remaining.return_value = -1

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PREMIUM, db=mock_db_session)

        assert summary.tier == SubscriptionTier.PREMIUM.value
        assert summary.tier_label == "Premium"
        assert summary.limit is None
        assert summary.used == 5
        assert summary.remaining == -1
        assert summary.is_unlimited is True
        assert summary.quota_state == "unlimited"
        assert summary.warning_status is None
        assert summary.warning_message is None
        assert summary.upgrade_required is False
        assert summary.upgrade_message is None
        assert summary.upgrade_cta_url is None

    @async_test
    async def test_sets_warning_status_when_usage_exceeds_eighty_percent(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_warning"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 8
            mock_remaining.return_value = 2

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.warning_status == "warning"
        assert (
            summary.warning_message
            == "80% of monthly quota used (8/10). 2 episodes remaining this month."
        )
        assert summary.quota_state == "warning"
        assert summary.upgrade_required is False
        assert summary.remaining == 2

    @async_test
    async def test_sets_critical_status_when_usage_exceeds_ninety_percent(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_critical"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 9
            mock_remaining.return_value = 1

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.warning_status == "critical"
        assert (
            summary.warning_message
            == "90% of monthly quota used (9/10). 1 episode remaining this month."
        )
        assert summary.quota_state == "critical"
        assert summary.upgrade_required is False
        assert summary.remaining == 1

    @async_test
    async def test_includes_period_bounds_for_monthly_reset(self, mock_db_session: AsyncMock) -> None:
        """Quota summary should expose explicit start/end to communicate reset timing."""

        fixed_now = datetime(2025, 10, 5, tzinfo=UTC)
        expected_start = datetime(2025, 10, 1, tzinfo=UTC).isoformat()
        expected_end = datetime(2025, 10, 31, 23, 59, 59, tzinfo=UTC).isoformat()

        class FixedDatetime(datetime):
            @classmethod
            def now(cls, tz=None):
                return fixed_now if tz else fixed_now.replace(tzinfo=None)

        with (
            patch("app.services.quota_service.datetime", FixedDatetime),
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 2
            mock_remaining.return_value = 8

            summary = await get_quota_summary("org_period", tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.period_start == expected_start
        assert summary.period_end == expected_end
        assert summary.period_label == "October 2025"

    @async_test
    async def test_marks_quota_exceeded_as_upgrade_required(self, mock_db_session: AsyncMock) -> None:
        org_id = "org_over"

        with (
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
            patch("app.services.quota_service.get_monthly_usage", new_callable=AsyncMock) as mock_usage,
            patch("app.services.quota_service.get_remaining_quota", new_callable=AsyncMock) as mock_remaining,
        ):
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 10
            mock_remaining.return_value = 0

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.warning_status == "critical"
        assert (
            summary.warning_message
            == "Monthly quota exceeded (10/10). 0 episodes remaining this month."
        )
        assert summary.quota_state == "exceeded"
        assert summary.upgrade_required is True
        assert summary.upgrade_message == "Upgrade to Premium tier for unlimited episodes."
        assert summary.upgrade_cta_url == "/pricing"
        assert summary.remaining == 0


class TestMonthlyQuotaReset:
    """Unit tests for automatic monthly quota reset logic."""

    @async_test
    async def test_quota_resets_when_new_billing_cycle_starts(self, db_session) -> None:
        """Test that quota automatically resets when checking in a new month."""
        org_id = "org_reset_test"

        # Create usage record for previous month (September 2025)
        previous_month = datetime(2025, 9, 1, tzinfo=UTC)
        usage_record = PodcastUsage(
            organization_id=org_id,
            month=previous_month,
            episode_count=10,  # Hit quota limit in September
        )
        db_session.add(usage_record)
        db_session.commit()

        # Mock current date as October 2025 (new billing cycle)
        october_2025 = datetime(2025, 10, 15, tzinfo=UTC)

        with (
            patch("app.services.quota_service.datetime") as mock_datetime,
            patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier,
        ):
            # Mock datetime.now() to return October
            mock_datetime.now.return_value = october_2025
            # But also provide the real datetime class for other uses
            mock_datetime.side_effect = lambda *args, **kw: datetime(*args, **kw) if args else october_2025

            mock_tier.return_value = SubscriptionTier.PROFESSIONAL

            # Check quota - should automatically reset and allow creation
            can_create = await check_episode_quota(org_id, db_session)

        assert can_create is True, "Should allow creation in new billing cycle"

    @async_test
    async def test_usage_count_returns_zero_in_new_month(self, db_session) -> None:
        """Test that get_monthly_usage returns 0 when checking a new month with stale data."""
        org_id = "org_usage_reset"

        # Create usage record for previous month
        previous_month = datetime(2025, 8, 1, tzinfo=UTC)
        usage_record = PodcastUsage(
            organization_id=org_id,
            month=previous_month,
            episode_count=8,
        )
        db_session.add(usage_record)
        db_session.commit()

        # Query usage for current month (should be 0, not 8)
        usage = await get_monthly_usage(org_id, db_session)

        assert usage == 0, "Should return 0 for new month with no usage record"

    @async_test
    async def test_remaining_quota_resets_after_month_boundary(self, db_session) -> None:
        """Test that get_remaining_quota returns full quota in new month."""
        org_id = "org_remaining_reset"

        # Create usage record for previous month at quota limit
        previous_month = datetime(2025, 7, 1, tzinfo=UTC)
        usage_record = PodcastUsage(
            organization_id=org_id,
            month=previous_month,
            episode_count=10,
        )
        db_session.add(usage_record)
        db_session.commit()

        with patch("app.services.quota_service.get_organization_tier", new_callable=AsyncMock) as mock_tier:
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL

            # Get remaining quota (should be 10, not 0)
            remaining = await get_remaining_quota(org_id, db_session)

        assert remaining == 10, "Should return full quota in new month"


# Fixtures -----------------------------------------------------------------


@pytest.fixture
def mock_db_session() -> AsyncMock:
    session = AsyncMock()
    session.commit = AsyncMock()
    session.add = AsyncMock()
    session.execute = AsyncMock()
    session.refresh = AsyncMock()
    return session


@pytest.fixture
def mock_sync_session() -> Mock:
    session = Mock()
    session.commit = Mock()
    session.add = Mock()
    session.execute = Mock()
    session.refresh = Mock()
    return session


