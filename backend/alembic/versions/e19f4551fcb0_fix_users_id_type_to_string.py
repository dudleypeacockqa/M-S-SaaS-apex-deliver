"""fix users id type from UUID to String(36)

Revision ID: e19f4551fcb0
Revises: dc2c0f69c1b1
Create Date: 2025-11-10 16:05:00.000000

Context:
    Production databases still have `users.id` as UUID even though the model
    has been String(36) for several releases. Any FK column that has already
    been migrated to String(36) cannot reference the UUID primary key, which
    causes Alembic/Render deploys to fail when constraints get recreated.

Fix:
    Convert `users.id` to String(36) using the same approach as the
    organizations migration (0cbf1e0e3ab5).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "e19f4551fcb0"
down_revision: Union[str, None] = "dc2c0f69c1b1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    print("🔧 Converting users.id from UUID to String(36)...")
    op.alter_column(
        "users",
        "id",
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(36),
        existing_nullable=False,
        postgresql_using="id::text",
    )
    print("✅ users.id successfully converted to String(36)")


def downgrade() -> None:
    print("⚠️  Reverting users.id back to UUID...")
    op.alter_column(
        "users",
        "id",
        existing_type=sa.String(36),
        type_=postgresql.UUID(as_uuid=True),
        existing_nullable=False,
        postgresql_using="id::uuid",
    )
    print("⏪ Rollback complete. users.id reverted to UUID.")
