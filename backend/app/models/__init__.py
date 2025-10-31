"""Models package."""
# Import base models first
from .user import User, UserRole
from .organization import Organization

# Import financial models BEFORE Deal (Deal has relationships to these)
from .financial_connection import FinancialConnection
from .financial_statement import FinancialStatement
from .financial_ratio import FinancialRatio
from .financial_narrative import FinancialNarrative

# Now import Deal (has FK relationships to financial models)
from .deal import Deal, DealStage, PipelineStage
from .document import Document, Folder, DocumentPermission, DocumentAccessLog
from .subscription import Subscription, Invoice, SubscriptionTier, SubscriptionStatus
from .valuation import (
    ValuationModel,
    ValuationScenario,
    ComparableCompany,
    PrecedentTransaction,
    ValuationExportLog,
)
from .task import DealTask, TaskTemplate, TaskAutomationRule, TaskAutomationLog
from .podcast import PodcastEpisode, PodcastTranscript, PodcastAnalytics
from .podcast_usage import PodcastUsage

from .deal_match import DealMatchCriteria, DealMatch, DealMatchAction
from .blog_post import BlogPost
from .newsletter_subscription import NewsletterSubscription

# Master Admin Portal models
from .master_admin import (
    AdminGoal,
    AdminActivity,
    AdminScore,
    AdminFocusSession,
    AdminNudge,
    AdminMeeting,
    AdminProspect,
    AdminDeal,
    AdminCampaign,
    AdminCampaignRecipient,
    AdminContentPiece,
    AdminContentScript,
    AdminLeadCapture,
    AdminCollateral,
    AdminCollateralUsage,
    ActivityType,
    ActivityStatus,
    NudgeType,
    NudgePriority,
    MeetingType,
    ProspectStatus,
    DealStage as AdminDealStage,
    CampaignType,
    CampaignStatus,
    ContentType,
    ContentStatus,
)

__all__ = [
    "User",
    "UserRole",
    "Organization",
    "FinancialConnection",
    "FinancialStatement",
    "FinancialRatio",
    "FinancialNarrative",
    "Deal",
    "DealStage",
    "PipelineStage",
    "Document",
    "Folder",
    "DocumentPermission",
    "DocumentAccessLog",
    "Subscription",
    "Invoice",
    "SubscriptionTier",
    "SubscriptionStatus",
    "ValuationModel",
    "ValuationScenario",
    "ComparableCompany",
    "PrecedentTransaction",
    "ValuationExportLog",
    "DealTask",
    "TaskTemplate",
    "TaskAutomationRule",
    "TaskAutomationLog",
    "PodcastEpisode",
    "PodcastTranscript",
    "PodcastAnalytics",
    "PodcastUsage",
    "DealMatchCriteria",
    "DealMatch",
    "DealMatchAction",
    "BlogPost",
    "NewsletterSubscription",
    # Master Admin Portal
    "AdminGoal",
    "AdminActivity",
    "AdminScore",
    "AdminFocusSession",
    "AdminNudge",
    "AdminMeeting",
    "AdminProspect",
    "AdminDeal",
    "AdminCampaign",
    "AdminCampaignRecipient",
    "AdminContentPiece",
    "AdminContentScript",
    "AdminLeadCapture",
    "AdminCollateral",
    "AdminCollateralUsage",
    "ActivityType",
    "ActivityStatus",
    "NudgeType",
    "NudgePriority",
    "MeetingType",
    "ProspectStatus",
    "AdminDealStage",
    "CampaignType",
    "CampaignStatus",
    "ContentType",
    "ContentStatus",
]
