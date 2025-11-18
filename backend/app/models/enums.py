"""
Master Admin Portal Enums

All enum types used across Master Admin Portal models and schemas.
Separated from models.py to avoid namespace pollution and enable clean imports.
"""
from enum import Enum as PyEnum


# ============================================================================
# Activity Tracker Enums
# ============================================================================

class ActivityType(str, PyEnum):
    """Activity types for tracking."""
    DISCOVERY = "discovery"
    EMAIL = "email"
    VIDEO = "video"
    CALL = "call"


class ActivityStatus(str, PyEnum):
    """Activity completion status."""
    DONE = "done"
    PENDING = "pending"
    CANCELLED = "cancelled"


class NudgeType(str, PyEnum):
    """Types of nudges/notifications."""
    REMINDER = "reminder"
    SUGGESTION = "suggestion"
    ALERT = "alert"
    CELEBRATION = "celebration"


class NudgePriority(str, PyEnum):
    """Priority levels for nudges."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class MeetingType(str, PyEnum):
    """Types of meetings."""
    DISCOVERY = "discovery"
    DEMO = "demo"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"


# ============================================================================
# Prospect & Pipeline Enums
# ============================================================================

class ProspectStatus(str, PyEnum):
    """Prospect lifecycle status."""
    NEW = "new"
    QUALIFIED = "qualified"
    ENGAGED = "engaged"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class AdminDealStage(str, PyEnum):
    """Master Admin deal pipeline stages."""
    DISCOVERY = "discovery"
    QUALIFICATION = "qualification"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"
    WON = "won"
    LOST = "lost"


# ============================================================================
# Campaign Management Enums
# ============================================================================

class CampaignType(str, PyEnum):
    """Campaign types."""
    EMAIL = "email"
    SMS = "sms"
    MIXED = "mixed"
    VOICE = "voice"
    LINKEDIN = "linkedin"
    MULTI_CHANNEL = "multi_channel"


class CampaignStatus(str, PyEnum):
    """Campaign status."""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    PAUSED = "paused"
    CANCELLED = "cancelled"


# ============================================================================
# Content Creation Enums
# ============================================================================

class ContentType(str, PyEnum):
    """Content piece types."""
    YOUTUBE = "youtube"
    PODCAST = "podcast"
    BLOG = "blog"
    SOCIAL = "social"


class ContentStatus(str, PyEnum):
    """Content production status."""
    IDEA = "idea"
    SCRIPTING = "scripting"
    RECORDING = "recording"
    EDITING = "editing"
    READY = "ready"
    PUBLISHED = "published"

# Compatibility alias
DealStage = AdminDealStage
