"""fix organizations id type from UUID to String

Revision ID: 0cbf1e0e3ab5
Revises: c80cbaa32b50
Create Date: 2025-11-10 15:42:26.814652

Context:
    Production database has organizations.id as UUID type, but models expect
    String(36). This type mismatch prevents FK constraints from being enforced
    on all organization_id foreign key columns.

Fix:
    Convert organizations.id from UUID to String(36) to match model definition.

Safety:
    Uses postgresql_using clause to safely convert existing UUID data to String.
    All dependent FK columns are already String(36), so only the PK needs conversion.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '0cbf1e0e3ab5'
down_revision: Union[str, None] = 'c80cbaa32b50'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Convert organizations.id from UUID to String(36).

    This fixes FK constraint mismatches where organization_id columns
    are String(36) but organizations.id is UUID.
    """
    print("🔧 Converting organizations.id from UUID to String(36)...")

    op.alter_column(
        'organizations',
        'id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='id::text'
    )

    print("✅ organizations.id successfully converted to String(36)")


def downgrade() -> None:
    """
    Revert organizations.id back to UUID.

    Note: This is primarily for development rollback. In production,
    rolling forward with a new fix migration is preferred.
    """
    print("⚠️  Reverting organizations.id back to UUID...")

    op.alter_column(
        'organizations',
        'id',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )

    print("⏪ Rollback complete. organizations.id reverted to UUID.")
