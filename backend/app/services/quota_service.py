"""Quota enforcement service for subscription-based feature limits.



Manages monthly episode quotas based on subscription tiers:

- Starter: 0 episodes (no podcast access)

- Professional: 10 episodes/month

- Premium: Unlimited

- Enterprise: Unlimited



Tracks usage in database and enforces limits before episode creation.

"""

import logging

from datetime import datetime

from typing import Optional, Union

from sqlalchemy import select, func, and_

from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.orm import Session



from app.core.subscription import get_organization_tier, SubscriptionTier

from app.models.podcast_usage import PodcastUsage
from app.schemas.podcast import PodcastQuotaSummary



logger = logging.getLogger(__name__)



SessionLike = Union[AsyncSession, Session]





class QuotaExceededError(Exception):

    """Exception raised when organization exceeds their episode quota."""



    pass





# Quota limits by tier

TIER_QUOTAS = {

    SubscriptionTier.STARTER: 0,  # No podcast access

    SubscriptionTier.PROFESSIONAL: 10,  # 10 episodes/month

    SubscriptionTier.PREMIUM: -1,  # Unlimited (represented as -1)

    SubscriptionTier.ENTERPRISE: -1,  # Unlimited

}





async def check_episode_quota(organization_id: str, db: Optional[SessionLike] = None) -> bool:

    """

    Check if organization can create another episode within their quota.



    Args:

        organization_id: Clerk organization ID

        db: Database session (optional, will create if not provided)



    Returns:

        bool: True if can create episode, raises QuotaExceededError otherwise



    Raises:

        QuotaExceededError: If quota is exceeded or tier has no podcast access



    Examples:

        >>> can_create = await check_episode_quota("org_123", db)

        >>> if can_create:

        ...     # Create episode

    """

    tier = await get_organization_tier(organization_id)

    quota_limit = TIER_QUOTAS.get(tier, 0)



    if tier == SubscriptionTier.STARTER:

        logger.warning(f"Organization {organization_id} has no podcast access (Starter tier)")

        raise QuotaExceededError(

            "Your subscription plan does not include podcast access. "

            "Upgrade to Professional tier to create audio podcasts."

        )



    if quota_limit == -1:

        logger.debug(f"Organization {organization_id} has unlimited quota ({tier.value})")

        return True



    if db is not None:

        current_usage = await get_monthly_usage(organization_id, db)

    else:

        current_usage = 0



    if current_usage >= quota_limit:

        logger.warning(

            f"Organization {organization_id} quota exceeded: {current_usage}/{quota_limit}"

        )

        raise QuotaExceededError(

            f"Monthly quota of {quota_limit} episodes exceeded ({current_usage}/{quota_limit}). "

            f"Upgrade to Premium tier for unlimited episodes."

        )



    logger.debug(

        f"Organization {organization_id} within quota: {current_usage}/{quota_limit} used"

    )

    return True





async def get_remaining_quota(organization_id: str, db: Optional[SessionLike] = None) -> Optional[int]:

    """

    Get remaining episode quota for organization this month.



    Args:

        organization_id: Clerk organization ID

        db: Database session (optional)



    Returns:

        int: Number of episodes remaining (-1 for unlimited, 0 if exhausted)



    Examples:

        >>> remaining = await get_remaining_quota("org_123", db)

        >>> print(f"You have {remaining} episodes remaining this month")

    """

    tier = await get_organization_tier(organization_id)

    quota_limit = TIER_QUOTAS.get(tier, 0)



    # Starter tier has no access

    if tier == SubscriptionTier.STARTER:

        return 0



    # Unlimited tiers

    if quota_limit == -1:

        return -1  # -1 indicates unlimited



    # Professional tier: calculate remaining

    if db:

        current_usage = await get_monthly_usage(organization_id, db)

    else:

        current_usage = 0



    remaining = max(0, quota_limit - current_usage)

    return remaining





async def increment_episode_count(organization_id: str, db: SessionLike) -> None:

    """

    Increment episode count for organization in current month.



    Creates new usage record if none exists for current month.



    Args:

        organization_id: Clerk organization ID

        db: Database session



    Examples:

        >>> await increment_episode_count("org_123", db)

        >>> # Usage count incremented by 1

    """

    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)



    stmt = select(PodcastUsage).where(

        and_(

            PodcastUsage.organization_id == organization_id,

            PodcastUsage.month == current_month

        )

    )



    if isinstance(db, AsyncSession):

        result = await db.execute(stmt)

        usage_record = result.scalar_one_or_none()

    else:

        result = db.execute(stmt)

        usage_record = result.scalar_one_or_none()



    if usage_record:

        usage_record.episode_count += 1

        logger.debug(

            f"Incremented episode count for {organization_id}: {usage_record.episode_count}"

        )

    else:

        usage_record = PodcastUsage(

            organization_id=organization_id,

            month=current_month,

            episode_count=1

        )

        db.add(usage_record)

        logger.info(

            f"Created new usage record for {organization_id} in {current_month.strftime('%Y-%m')}"

        )



    if isinstance(db, AsyncSession):

        await db.commit()

        await db.refresh(usage_record)

    else:

        db.commit()

        db.refresh(usage_record)





async def get_monthly_usage(organization_id: str, db: SessionLike) -> int:

    """

    Get current month's episode count for organization.



    Args:

        organization_id: Clerk organization ID

        db: Database session



    Returns:

        int: Number of episodes created this month (0 if none)



    Examples:

        >>> usage = await get_monthly_usage("org_123", db)

        >>> print(f"Created {usage} episodes this month")

    """

    if isinstance(db, AsyncSession):

        return await _query_usage_for_month(organization_id, db)

    return _query_usage_for_month_sync(organization_id, db)





async def _query_usage_for_month(organization_id: str, db: AsyncSession) -> int:

    """

    Internal helper to query usage for current month.



    Args:

        organization_id: Clerk organization ID

        db: Database session



    Returns:

        int: Episode count for current month

    """

    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)



    stmt = select(PodcastUsage.episode_count).where(

        and_(

            PodcastUsage.organization_id == organization_id,

            PodcastUsage.month == current_month

        )

    )

    result = await db.execute(stmt)

    count = result.scalar_one_or_none()



    return count if count is not None else 0



async def get_quota_summary(
    organization_id: str,
    db: Optional[SessionLike] = None,
) -> PodcastQuotaSummary:
    """Aggregate quota information for API responses."""

    tier = await get_organization_tier(organization_id)
    limit = TIER_QUOTAS.get(tier, 0)

    if db is None:
        raise ValueError("Database session is required to compute quota summary")

    used = await get_monthly_usage(organization_id, db=db)
    quota_remaining = await get_remaining_quota(organization_id, db=db)

    is_unlimited = limit == -1

    limit_value: Optional[int] = None if is_unlimited else limit

    if is_unlimited:
        remaining_value = -1
    else:
        remaining_value = max(0, quota_remaining if quota_remaining is not None else limit - used)

    period = datetime.utcnow().strftime("%Y-%m")

    return PodcastQuotaSummary(
        tier=tier.value,
        limit=limit_value,
        remaining=remaining_value,
        used=used,
        is_unlimited=is_unlimited,
        period=period,
    )





def _query_usage_for_month_sync(organization_id: str, db: Session) -> int:

    """Synchronous helper for monthly usage queries."""

    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    stmt = select(PodcastUsage.episode_count).where(

        and_(

            PodcastUsage.organization_id == organization_id,

            PodcastUsage.month == current_month

        )

    )

    result = db.execute(stmt)

    count = result.scalar_one_or_none()

    return count if count is not None else 0



