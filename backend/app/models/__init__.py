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
]
