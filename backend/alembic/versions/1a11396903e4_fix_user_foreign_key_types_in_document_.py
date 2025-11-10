"""fix user foreign key types in document tables

Revision ID: 1a11396903e4
Revises: c3a7b4bbf913
Create Date: 2025-11-10 13:50:56.011795

Context:
    Migration d37ed4cd3013 incorrectly defined user foreign key columns as
    postgresql.UUID(as_uuid=True), but users.id is String(36) (converted in
    migration 36b3e62b4148). This type mismatch prevents PostgreSQL from
    enforcing foreign key constraints.

Fix:
    Convert 5 columns from UUID to String(36) to match users.id type.

Affected Columns:
    - folders.created_by
    - documents.uploaded_by
    - document_permissions.user_id
    - document_permissions.granted_by
    - document_access_logs.user_id

Safety:
    Uses postgresql_using clause to safely convert existing UUID data to String.
    Rollback path provided via downgrade().
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '1a11396903e4'
down_revision: Union[str, None] = 'c3a7b4bbf913'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Fix user foreign key column types from UUID to String(36).

    Converts all user reference columns to match users.id type (String(36)).
    Uses postgresql_using='column::text' for safe data conversion.
    """
    print("🔧 Fixing user foreign key types in document tables...")

    # 1. folders.created_by: UUID → String(36)
    print("   → Converting folders.created_by (UUID → String)...")
    op.alter_column(
        'folders',
        'created_by',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='created_by::text'
    )

    # 2. documents.uploaded_by: UUID → String(36)
    print("   → Converting documents.uploaded_by (UUID → String)...")
    op.alter_column(
        'documents',
        'uploaded_by',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='uploaded_by::text'
    )

    # 3. document_permissions.user_id: UUID → String(36)
    print("   → Converting document_permissions.user_id (UUID → String)...")
    op.alter_column(
        'document_permissions',
        'user_id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='user_id::text'
    )

    # 4. document_permissions.granted_by: UUID → String(36)
    print("   → Converting document_permissions.granted_by (UUID → String)...")
    op.alter_column(
        'document_permissions',
        'granted_by',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='granted_by::text'
    )

    # 5. document_access_logs.user_id: UUID → String(36)
    print("   → Converting document_access_logs.user_id (UUID → String)...")
    op.alter_column(
        'document_access_logs',
        'user_id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using='user_id::text'
    )

    print("✅ User foreign key types fixed successfully!")
    print("   All 5 columns now use String(36) to match users.id type.")


def downgrade() -> None:
    """
    Revert user foreign key column types back to UUID.

    Rollback path: converts String(36) back to UUID if needed.
    Note: This is primarily for development rollback. In production,
    rolling forward with a new fix migration is preferred.
    """
    print("⚠️  Rolling back user foreign key type fixes...")

    # Reverse order of upgrade
    print("   → Reverting document_access_logs.user_id (String → UUID)...")
    op.alter_column(
        'document_access_logs',
        'user_id',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='user_id::uuid'
    )

    print("   → Reverting document_permissions.granted_by (String → UUID)...")
    op.alter_column(
        'document_permissions',
        'granted_by',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='granted_by::uuid'
    )

    print("   → Reverting document_permissions.user_id (String → UUID)...")
    op.alter_column(
        'document_permissions',
        'user_id',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='user_id::uuid'
    )

    print("   → Reverting documents.uploaded_by (String → UUID)...")
    op.alter_column(
        'documents',
        'uploaded_by',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='uploaded_by::uuid'
    )

    print("   → Reverting folders.created_by (String → UUID)...")
    op.alter_column(
        'folders',
        'created_by',
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using='created_by::uuid'
    )

    print("⏪ Rollback complete. Types reverted to UUID.")
