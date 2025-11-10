"""convert users id from UUID to String for FK compatibility

Revision ID: 3a15202c7dc2
Revises: 0cbf1e0e3ab5
Create Date: 2025-11-10 17:10:47.227732

Context:
    Production database has users.id as UUID type, but models expect String(36).
    This type mismatch prevents FK constraints from being enforced on columns
    that reference users.id (e.g., pipeline_templates.created_by).

Fix:
    Convert users.id from UUID to String(36) to match model definition.
    This MUST run BEFORE dc2c0f69c1b1 (pipeline templates) migration.

Safety:
    Uses postgresql_using clause to safely convert existing UUID data to String.
    All dependent FK columns are already String(36), so only the PK needs conversion.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '3a15202c7dc2'
down_revision: Union[str, None] = 'c3a7b4bbf913'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Convert users.id from UUID to String(36).

    This fixes FK constraint mismatches where user_id columns
    are String(36) but users.id is UUID.
    """
    print("🔧 Converting users.id from UUID to String(36)...")

    op.alter_column(
        'users',
        'id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='id::text'
    )

    print("✅ users.id successfully converted to String(36)")


def downgrade() -> None:
    """
    Revert users.id back to UUID.

    Note: This is primarily for development rollback. In production,
    rolling forward with a new fix migration is preferred.
    """
    print("⚠️  Reverting users.id back to UUID...")

    op.alter_column(
        'users',
        'id',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )

    print("⏪ Rollback complete. users.id reverted to UUID.")
