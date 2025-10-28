"""Tests for quota enforcement service.







Tests monthly episode limits based on subscription tiers:



- Starter: No podcast access (0 episodes)



- Professional: 10 episodes/month



- Premium: Unlimited



- Enterprise: Unlimited










def async_test(fn):

    """Simple decorator to run coroutine tests without pytest-asyncio."""

    @wraps(fn)

    def wrapper(*args, **kwargs):

        return asyncio.run(fn(*args, **kwargs))

    return wrapper

Following TDD: RED → GREEN → REFACTOR



"""



import pytest



from datetime import datetime, timedelta



from unittest.mock import patch, AsyncMock, Mock



from sqlalchemy.ext.asyncio import AsyncSession







from app.services.quota_service import (
    check_episode_quota,
    get_remaining_quota,
    increment_episode_count,
    get_monthly_usage,
    get_quota_summary,
    QuotaExceededError,
)



from app.core.subscription import SubscriptionTier











class TestCheckEpisodeQuota:



    """Tests for check_episode_quota function."""







    @async_test



    async def test_professional_tier_allows_creation_within_quota(self):



        """Test Professional tier (10/month) allows episode creation when under limit."""



        org_id = "org_professional"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.PROFESSIONAL



                mock_usage.return_value = 5  # Under 10 limit







                # Should not raise exception



                can_create = await check_episode_quota(org_id)



                assert can_create is True







    @async_test



    async def test_professional_tier_blocks_creation_at_quota_limit(self, mock_db_session):



        """Test Professional tier blocks episode creation at 10 episodes."""



        org_id = "org_professional"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.PROFESSIONAL



                mock_usage.return_value = 10  # At limit







                with pytest.raises(QuotaExceededError) as exc_info:



                    await check_episode_quota(org_id, mock_db_session)







                assert "exceeded" in str(exc_info.value).lower()



                assert "10" in str(exc_info.value)  # Mentions limit







    @async_test



    async def test_premium_tier_unlimited_never_blocks(self):



        """Test Premium tier has unlimited episodes (never blocks)."""



        org_id = "org_premium"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.PREMIUM



                mock_usage.return_value = 999  # Very high usage







                # Should never raise exception



                can_create = await check_episode_quota(org_id)



                assert can_create is True







    @async_test



    async def test_enterprise_tier_unlimited_never_blocks(self):



        """Test Enterprise tier has unlimited episodes (never blocks)."""



        org_id = "org_enterprise"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.ENTERPRISE



                mock_usage.return_value = 9999  # Extremely high usage







                # Should never raise exception



                can_create = await check_episode_quota(org_id)



                assert can_create is True







    @async_test



    async def test_starter_tier_blocks_all_podcast_creation(self):



        """Test Starter tier has no podcast access (0 quota)."""



        org_id = "org_starter"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            mock_tier.return_value = SubscriptionTier.STARTER







            with pytest.raises(QuotaExceededError) as exc_info:



                await check_episode_quota(org_id)







            assert "podcast access" in str(exc_info.value).lower()











class TestGetRemainingQuota:



    """Tests for get_remaining_quota function."""







    @async_test



    async def test_professional_tier_returns_correct_remaining(self, mock_db_session):



        """Test Professional tier calculates remaining quota correctly."""



        org_id = "org_professional"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.PROFESSIONAL



                mock_usage.return_value = 7  # Used 7 out of 10







                remaining = await get_remaining_quota(org_id, mock_db_session)



                assert remaining == 3







    @async_test



    async def test_premium_tier_returns_unlimited_indicator(self):



        """Test Premium tier returns -1 or None to indicate unlimited."""



        org_id = "org_premium"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            mock_tier.return_value = SubscriptionTier.PREMIUM







            remaining = await get_remaining_quota(org_id)



            # -1 or None both acceptable to indicate unlimited



            assert remaining in (-1, None, float('inf'))







    @async_test



    async def test_returns_zero_when_quota_exhausted(self, mock_db_session):



        """Test returns 0 when quota is fully used."""



        org_id = "org_professional"







        with patch('app.services.quota_service.get_organization_tier', new_callable=AsyncMock) as mock_tier:



            with patch('app.services.quota_service.get_monthly_usage', new_callable=AsyncMock) as mock_usage:



                mock_tier.return_value = SubscriptionTier.PROFESSIONAL



                mock_usage.return_value = 10  # Fully used







                remaining = await get_remaining_quota(org_id, mock_db_session)



                assert remaining == 0











class TestIncrementEpisodeCount:



    """Tests for increment_episode_count function."""







    @async_test



    async def test_increments_usage_count_in_database(self, mock_db_session):



        """Test increments monthly usage count in database."""



        org_id = "org_123"







        # Mock existing usage record



        mock_usage_record = Mock()



        mock_usage_record.episode_count = 5







        # Mock execute result



        mock_result = Mock()



        mock_result.scalar_one_or_none = Mock(return_value=mock_usage_record)



        mock_db_session.execute = AsyncMock(return_value=mock_result)



        mock_db_session.refresh = AsyncMock()







        # Should create or update usage record



        await increment_episode_count(org_id, mock_db_session)







        # Verify database interaction



        mock_db_session.commit.assert_called_once()



        # Verify count incremented



        assert mock_usage_record.episode_count == 6







    @async_test



    async def test_sync_session_increments_usage(self, mock_sync_session):



        """Test sync Session updates usage count properly."""



        org_id = "org_sync"



        mock_usage_record = Mock()



        mock_usage_record.episode_count = 2



        mock_result = Mock()



        mock_result.scalar_one_or_none.return_value = mock_usage_record



        mock_sync_session.execute.return_value = mock_result







        await increment_episode_count(org_id, mock_sync_session)







        assert mock_usage_record.episode_count == 3



        mock_sync_session.commit.assert_called_once()



        mock_sync_session.refresh.assert_called_once_with(mock_usage_record)







    @async_test



    async def test_creates_new_usage_record_for_first_episode(self, mock_db_session):



        """Test creates new usage record if none exists for current month."""



        org_id = "org_new"







        # Mock no existing usage record



        mock_result = Mock()



        mock_result.scalar_one_or_none = Mock(return_value=None)



        mock_db_session.execute = AsyncMock(return_value=mock_result)



        mock_db_session.refresh = AsyncMock()







        await increment_episode_count(org_id, mock_db_session)







        # Should have created new record



        mock_db_session.add.assert_called_once()











class TestGetMonthlyUsage:



    """Tests for get_monthly_usage function."""







    @async_test



    async def test_returns_current_month_usage_count(self, mock_db_session):



        """Test returns episode count for current month."""



        org_id = "org_123"







        with patch('app.services.quota_service._query_usage_for_month', new_callable=AsyncMock) as mock_query:



            mock_query.return_value = 5







            usage = await get_monthly_usage(org_id, mock_db_session)



            assert usage == 5







    @async_test



    async def test_sync_session_returns_usage(self, mock_sync_session):



        """Test sync Session path returns usage count."""



        org_id = "org_sync"



        mock_result = Mock()



        mock_result.scalar_one_or_none.return_value = 4



        mock_sync_session.execute.return_value = mock_result







        usage = await get_monthly_usage(org_id, mock_sync_session)



        assert usage == 4







    @async_test



    async def test_returns_zero_when_no_usage_records(self, mock_db_session):



        """Test returns 0 when no usage records exist."""



        org_id = "org_new"







        with patch('app.services.quota_service._query_usage_for_month', new_callable=AsyncMock) as mock_query:



            mock_query.return_value = 0







            usage = await get_monthly_usage(org_id, mock_db_session)



            assert usage == 0











class TestQuotaExceededError:



    """Tests for QuotaExceededError exception."""







    def test_quota_exceeded_error_has_clear_message(self):



        """Test QuotaExceededError provides clear error message."""



        error = QuotaExceededError("Monthly quota of 10 episodes exceeded")



        assert "quota" in str(error).lower()



        assert "10" in str(error)







    def test_quota_exceeded_error_includes_upgrade_guidance(self):



        """Test error message includes upgrade guidance."""



        error = QuotaExceededError(



            "Monthly quota exceeded. Upgrade to Premium for unlimited episodes."



        )



        assert "upgrade" in str(error).lower()



        assert "premium" in str(error).lower()


class TestGetQuotaSummary:
    @async_test
    async def test_returns_professional_summary(self, mock_db_session):
        org_id = "org_professional"

        with patch(
            "app.services.quota_service.get_organization_tier",
            new_callable=AsyncMock,
        ) as mock_tier, patch(
            "app.services.quota_service.get_monthly_usage",
            new_callable=AsyncMock,
        ) as mock_usage, patch(
            "app.services.quota_service.get_remaining_quota",
            new_callable=AsyncMock,
        ) as mock_remaining:
            mock_tier.return_value = SubscriptionTier.PROFESSIONAL
            mock_usage.return_value = 3
            mock_remaining.return_value = 7

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PROFESSIONAL, db=mock_db_session)

        assert summary.tier == SubscriptionTier.PROFESSIONAL.value
        assert summary.limit == 10
        assert summary.used == 3
        assert summary.remaining == 7
        assert summary.is_unlimited is False
        assert "-" in summary.period

    @async_test
    async def test_returns_unlimited_summary(self, mock_db_session):
        org_id = "org_premium"

        with patch(
            "app.services.quota_service.get_organization_tier",
            new_callable=AsyncMock,
        ) as mock_tier, patch(
            "app.services.quota_service.get_monthly_usage",
            new_callable=AsyncMock,
        ) as mock_usage, patch(
            "app.services.quota_service.get_remaining_quota",
            new_callable=AsyncMock,
        ) as mock_remaining:
            mock_tier.return_value = SubscriptionTier.PREMIUM
            mock_usage.return_value = 5
            mock_remaining.return_value = -1

            summary = await get_quota_summary(org_id, tier=SubscriptionTier.PREMIUM, db=mock_db_session)

        assert summary.tier == SubscriptionTier.PREMIUM.value
        assert summary.limit is None
        assert summary.used == 5
        assert summary.remaining == -1
        assert summary.is_unlimited is True











# Fixtures







@pytest.fixture



def mock_db_session():

    """Mock AsyncSession for database operations."""

    session = Mock(spec=AsyncSession)

    session.commit = AsyncMock()

    session.add = Mock()

    session.execute = AsyncMock()

    return session



@pytest.fixture



def mock_sync_session():

    """Mock synchronous Session for database operations."""

    session = Mock()

    session.commit = Mock()

    session.add = Mock()

    session.execute = Mock()

    session.refresh = Mock()

    return session

