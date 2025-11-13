"""Alembic environment configuration for M&A SaaS Platform."""
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import all models so Alembic can detect them
from app.db.base import Base  # noqa: E402
from app.models.user import User  # noqa: F401, E402
from app.models.organization import Organization  # noqa: F401, E402
from app.models.subscription import Subscription  # noqa: F401, E402
from app.models.deal import Deal, PipelineStage  # noqa: F401, E402
from app.models.document import Document, Folder  # noqa: F401, E402
from app.models.financial_connection import FinancialConnection  # noqa: F401, E402
from app.models.financial_statement import FinancialStatement  # noqa: F401, E402
from app.models.financial_ratio import FinancialRatio  # noqa: F401, E402
from app.models.financial_narrative import FinancialNarrative  # noqa: F401, E402
from app.models.master_admin import (  # noqa: F401, E402
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
    AdminContentScript,
    AdminContentPiece,
    AdminLeadCapture,
    AdminCollateral,
    AdminCollateralUsage,
)
from app.models.rbac_audit_log import RBACAuditLog  # noqa: F401, E402
from app.models.pipeline_template import PipelineTemplate, PipelineTemplateStage  # noqa: F401, E402
from app.models.document_generation import (  # noqa: F401, E402
    DocumentTemplate,
    GeneratedDocument,
    DocumentAISuggestion,
    DocumentVersion,
)
from app.models.event_payment import EventPayment, EventPaymentReceipt  # noqa: F401, E402

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target_metadata to our Base metadata for autogenerate support
target_metadata = Base.metadata


def get_url():
    """Get database URL from environment variable."""
    from dotenv import load_dotenv
    load_dotenv()
    return os.getenv("DATABASE_URL", "postgresql://localhost/ma_saas_platform")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Detect column type changes
            compare_server_default=True,  # Detect default changes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
