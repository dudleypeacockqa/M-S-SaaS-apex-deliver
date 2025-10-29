"""Quota enforcement service for podcast subscription limits."""

from __future__ import annotations

import inspect
import logging
import calendar
from datetime import datetime, timezone
from typing import Optional, Union

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app.core.subscription import SubscriptionTier, get_organization_tier
from app.models.podcast_usage import PodcastUsage
from app.schemas.podcast import PodcastQuotaSummary

try:  # pragma: no cover - AsyncMock is only needed for unit tests
    from unittest.mock import AsyncMock
except ImportError:  # pragma: no cover
    AsyncMock = None  # type: ignore

logger = logging.getLogger(__name__)

SessionLike = Union[Session, AsyncSession]
if AsyncMock is not None:  # pragma: no branch
    SessionLikeWithMock = Union[Session, AsyncSession, AsyncMock]  # type: ignore[misc]
else:  # pragma: no cover - fallback when AsyncMock unavailable
    SessionLikeWithMock = Union[Session, AsyncSession]

if AsyncMock is not None:  # pragma: no branch
    _ASYNC_SESSION_TYPES = (AsyncSession, AsyncMock)
else:  # pragma: no cover
    _ASYNC_SESSION_TYPES = (AsyncSession,)

TIER_QUOTAS: dict[SubscriptionTier, int] = {
    SubscriptionTier.STARTER: 0,         # No access
    SubscriptionTier.PROFESSIONAL: 10,   # 10 episodes per month
    SubscriptionTier.PREMIUM: -1,        # Unlimited
    SubscriptionTier.ENTERPRISE: -1,     # Unlimited
}

DEFAULT_UPGRADE_CTA = "/pricing"


class QuotaExceededError(Exception):
    """Raised when an organization has exhausted their quota."""


def _current_month_start() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


async def _maybe_await(value):
    if inspect.isawaitable(value):
        return await value
    return value


def _is_async_session(db: SessionLikeWithMock) -> bool:
    return isinstance(db, _ASYNC_SESSION_TYPES)


async def check_episode_quota(
    organization_id: str,
    db: Optional[SessionLikeWithMock] = None,
) -> bool:
    """Validate that the organization can create another episode this month."""

    tier = await get_organization_tier(organization_id)
    limit = TIER_QUOTAS.get(tier, 0)

    if tier == SubscriptionTier.STARTER:
        logger.warning("Starter tier organization %s attempted podcast creation", organization_id)
        raise QuotaExceededError(
            "Your subscription plan does not include podcast access. "
            "Upgrade to Professional tier to create audio podcasts."
        )

    if limit == -1:
        logger.debug("Organization %s has unlimited podcast quota (%s)", organization_id, tier.value)
        return True

    used = 0
    if db is not None:
        used = await get_monthly_usage(organization_id, db)

    if used >= limit:
        logger.warning("Organization %s exceeded podcast quota %s/%s", organization_id, used, limit)
        raise QuotaExceededError(
            f"Monthly quota of {limit} episodes exceeded ({used}/{limit}). "
            "Upgrade to Premium tier for unlimited episodes."
        )

    logger.debug("Organization %s within quota %s/%s", organization_id, used, limit)
    return True


async def get_remaining_quota(
    organization_id: str,
    db: Optional[SessionLikeWithMock] = None,
    tier: Optional[SubscriptionTier] = None,
) -> int:
    """Return remaining episodes for the month (-1 for unlimited tiers)."""

    tier = tier or await get_organization_tier(organization_id)
    limit = TIER_QUOTAS.get(tier, 0)

    if limit == -1:
        return -1
    if tier == SubscriptionTier.STARTER:
        return 0

    used = 0
    if db is not None:
        used = await get_monthly_usage(organization_id, db)
    return max(0, limit - used)


async def increment_episode_count(organization_id: str, db: SessionLikeWithMock) -> None:
    """Increment usage for the current month, creating the record if necessary."""

    if db is None:
        raise ValueError("Database session is required to increment usage")

    current_month = _current_month_start()
    stmt = select(PodcastUsage).where(
        and_(
            PodcastUsage.organization_id == organization_id,
            PodcastUsage.month == current_month,
        )
    )

    if _is_async_session(db):
        result = await db.execute(stmt)
    else:
        result = db.execute(stmt)  # type: ignore[arg-type]

    usage = result.scalar_one_or_none()
    usage = await _maybe_await(usage)

    if usage is None:
        usage = PodcastUsage(
            organization_id=organization_id,
            month=current_month,
            episode_count=1,
        )
        await _maybe_await(db.add(usage))
        logger.info("Created podcast usage record for %s/%s", organization_id, current_month.strftime("%Y-%m"))
    else:
        usage.episode_count += 1
        logger.debug("Incremented podcast usage for %s to %s", organization_id, usage.episode_count)

    await _maybe_await(db.commit())
    await _maybe_await(db.refresh(usage))


async def get_monthly_usage(organization_id: str, db: SessionLikeWithMock) -> int:
    """Return the number of episodes created in the current month."""

    if db is None:
        raise ValueError("Database session is required to compute usage")

    if _is_async_session(db):
        return await _query_usage_async(organization_id, db)
    return _query_usage_sync(organization_id, db)  # type: ignore[arg-type]


async def _query_usage_async(organization_id: str, db: AsyncSession | AsyncMock) -> int:
    current_month = _current_month_start()
    stmt = select(PodcastUsage.episode_count).where(
        and_(
            PodcastUsage.organization_id == organization_id,
            PodcastUsage.month == current_month,
        )
    )

    result = await db.execute(stmt)
    count = result.scalar_one_or_none()
    count = await _maybe_await(count)
    return count or 0


def _query_usage_sync(organization_id: str, db: Session) -> int:
    current_month = _current_month_start()
    stmt = select(PodcastUsage.episode_count).where(
        and_(
            PodcastUsage.organization_id == organization_id,
            PodcastUsage.month == current_month,
        )
    )

    result = db.execute(stmt)
    count = result.scalar_one_or_none()
    return count or 0


async def get_quota_summary(
    organization_id: str,
    tier: SubscriptionTier,
    db: SessionLikeWithMock,
) -> PodcastQuotaSummary:
    """Aggregate quota information for API responses and UI displays."""

    if db is None:
        raise ValueError("Database session is required to compute quota summary")

    limit = TIER_QUOTAS.get(tier, 0)
    used = await get_monthly_usage(organization_id, db)
    remaining = await get_remaining_quota(organization_id, db=db, tier=tier)

    is_unlimited = limit == -1
    limit_value: Optional[int] = None if is_unlimited else limit
    remaining_value = -1 if is_unlimited else remaining

    tier_label = tier.value.title()
    quota_state = "unlimited" if is_unlimited else "normal"
    warning_status: Optional[str] = None
    warning_message: Optional[str] = None
    upgrade_required = False
    upgrade_message: Optional[str] = None
    upgrade_cta_url: Optional[str] = None

    if not is_unlimited and limit_value:
        usage_ratio = used / limit_value
        def _remaining_phrase(count: int) -> str:
            episode_word = "episode" if count == 1 else "episodes"
            return f"{count} {episode_word} remaining this month."

        if usage_ratio >= 1:
            quota_state = "exceeded"
            warning_status = "critical"
            remaining_value = 0
            warning_message = (
                f"Monthly quota exceeded ({used}/{limit_value}). {_remaining_phrase(remaining_value)}"
            )
            upgrade_required = True
            upgrade_message = "Upgrade to Premium tier for unlimited episodes."
            upgrade_cta_url = DEFAULT_UPGRADE_CTA
        elif usage_ratio >= 0.9:
            quota_state = "critical"
            warning_status = "critical"
            remaining_count = max(remaining_value, 0)
            warning_message = (
                f"90% of monthly quota used ({used}/{limit_value}). {_remaining_phrase(remaining_count)}"
            )
        elif usage_ratio >= 0.8:
            quota_state = "warning"
            warning_status = "warning"
            remaining_count = max(remaining_value, 0)
            warning_message = (
                f"80% of monthly quota used ({used}/{limit_value}). {_remaining_phrase(remaining_count)}"
            )

    now = datetime.now(timezone.utc)
    period = now.strftime("%Y-%m")
    current_year = now.year
    current_month = now.month
    period_start_dt = datetime(current_year, current_month, 1, tzinfo=timezone.utc)
    last_day = calendar.monthrange(current_year, current_month)[1]
    period_end_dt = datetime(current_year, current_month, last_day, 23, 59, 59, tzinfo=timezone.utc)
    period_label = period_start_dt.strftime("%B %Y")

    return PodcastQuotaSummary(
        tier=tier.value,
        tier_label=tier_label,
        limit=limit_value,
        remaining=remaining_value,
        used=used,
        is_unlimited=is_unlimited,
        period=period,
        period_start=period_start_dt.isoformat(),
        period_end=period_end_dt.isoformat(),
        period_label=period_label,
        quota_state=quota_state,
        warning_status=warning_status,
        warning_message=warning_message,
        upgrade_required=upgrade_required,
        upgrade_message=upgrade_message,
        upgrade_cta_url=upgrade_cta_url,
    )


__all__ = [
    "QuotaExceededError",
    "check_episode_quota",
    "get_remaining_quota",
    "increment_episode_count",
    "get_monthly_usage",
    "get_quota_summary",
    "TIER_QUOTAS",
]





