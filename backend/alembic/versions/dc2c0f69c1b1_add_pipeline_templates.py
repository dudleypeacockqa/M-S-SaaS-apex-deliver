"""add pipeline templates

Revision ID: dc2c0f69c1b1
Revises: c3a7b4bbf913
Create Date: 2025-11-10 12:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "dc2c0f69c1b1"
down_revision: Union[str, None] = "3a15202c7dc2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pipeline_templates",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("organization_id", sa.String(length=36), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_by", sa.String(length=36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_pipeline_templates_org_default", "pipeline_templates", ["organization_id", "is_default"])

    op.create_table(
        "pipeline_template_stages",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("template_id", sa.String(length=36), sa.ForeignKey("pipeline_templates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("order_index", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column("probability", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("sla_hours", sa.Integer(), nullable=True),
        sa.Column("color", sa.String(length=7), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_pipeline_template_stages_template", "pipeline_template_stages", ["template_id"])
    op.create_index("ix_pipeline_template_stages_order", "pipeline_template_stages", ["order_index"])


def downgrade() -> None:
    op.drop_index("ix_pipeline_template_stages_order", table_name="pipeline_template_stages")
    op.drop_index("ix_pipeline_template_stages_template", table_name="pipeline_template_stages")
    op.drop_table("pipeline_template_stages")
    op.drop_index("ix_pipeline_templates_org_default", table_name="pipeline_templates")
    op.drop_table("pipeline_templates")
