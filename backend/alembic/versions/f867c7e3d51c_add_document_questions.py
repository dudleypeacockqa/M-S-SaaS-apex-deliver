"""add document questions table for data room q&a

Revision ID: f867c7e3d51c
Revises: 86d427f030f2
Create Date: 2025-11-12 17:25:00.000000
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f867c7e3d51c"
down_revision: Union[str, None] = "86d427f030f2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "document_questions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("document_id", sa.String(length=36), nullable=False),
        sa.Column("organization_id", sa.String(length=36), nullable=False),
        sa.Column("asked_by", sa.String(length=36), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="open"),
        sa.Column("answer", sa.Text(), nullable=True),
        sa.Column("answered_by", sa.String(length=36), nullable=True),
        sa.Column("answered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.ForeignKeyConstraint(["asked_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["answered_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_document_questions_document_id",
        "document_questions",
        ["document_id"],
    )
    op.create_index(
        "ix_document_questions_org_id",
        "document_questions",
        ["organization_id"],
    )
    op.create_index(
        "ix_document_questions_status",
        "document_questions",
        ["status"],
    )


def downgrade() -> None:
    op.drop_index("ix_document_questions_status", table_name="document_questions")
    op.drop_index("ix_document_questions_org_id", table_name="document_questions")
    op.drop_index("ix_document_questions_document_id", table_name="document_questions")
    op.drop_table("document_questions")
