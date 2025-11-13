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
from .pipeline_template import PipelineTemplate, PipelineTemplateStage
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
from .rbac_audit_log import RBACAuditLog, RBACAuditAction

from .deal_match import DealMatchCriteria, DealMatch, DealMatchAction
from .blog_post import BlogPost
from .newsletter_subscription import NewsletterSubscription
from .document_generation import (
    DocumentTemplate,
    GeneratedDocument,
    TemplateStatus,
    DocumentStatus,
    DocumentExportStatus,
    DocumentExportJob,
)
from .event import (
    Event,
    EventTicket,
    EventRegistration,
    EventSession,
    EventAnalytics,
    EventType as EventLocationType,  # Alias for compatibility
    EventStatus,
    RegistrationStatus,
)

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
    AdminDealStage,
    CampaignType,
    CampaignStatus,
    ContentType,
    ContentStatus,
)

# Community Platform models
from .community import (
    Post,
    Comment,
    Reaction,
    Follow,
    ModerationAction,
    PostStatus,
    PostCategory,
    ReactionType,
    ModerationActionType,
    TargetType,
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
    "PipelineTemplate",
    "PipelineTemplateStage",
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
    "RBACAuditLog",
    "RBACAuditAction",
    "DealMatchCriteria",
    "DealMatch",
    "DealMatchAction",
    "BlogPost",
    "NewsletterSubscription",
    "DocumentTemplate",
    "GeneratedDocument",
    "TemplateStatus",
    "DocumentStatus",
    "DocumentExportStatus",
    "DocumentExportJob",
    # Event Management
    "Event",
    "EventTicket",
    "EventRegistration",
    "EventSession",
    "EventAnalytics",
    "EventLocationType",
    "EventStatus",
    "RegistrationStatus",
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
    # Community Platform
    "Post",
    "Comment",
    "Reaction",
    "Follow",
    "ModerationAction",
    "PostStatus",
    "PostCategory",
    "ReactionType",
    "ModerationActionType",
    "TargetType",
]

