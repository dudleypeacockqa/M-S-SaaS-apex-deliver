"""add_fpa_tables

Revision ID: b6f9d4a12abc
Revises: 20251118104453
Create Date: 2025-11-18 21:15:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b6f9d4a12abc"
down_revision: Union[str, Sequence[str], None] = "20251118104453"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create FP&A tables for v1.2 enhancements."""

    op.create_table(
        "fpa_forecasts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("organization_id", sa.String(length=36), sa.ForeignKey("organizations.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("period", sa.String(length=32), nullable=False),
        sa.Column("forecasted_demand", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("actual_demand", sa.Numeric(precision=12, scale=2)),
        sa.Column("confidence_level", sa.Numeric(precision=4, scale=3), nullable=False),
        sa.Column("assumptions", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_by_user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index(
        op.f("ix_fpa_forecasts_org_period"),
        "fpa_forecasts",
        ["organization_id", "period"],
        unique=False,
    )

    op.create_table(
        "fpa_scenarios",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("organization_id", sa.String(length=36), sa.ForeignKey("organizations.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("assumptions", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("metrics", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_by_user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index(
        op.f("ix_fpa_scenarios_org_name"),
        "fpa_scenarios",
        ["organization_id", "name"],
        unique=False,
    )

    op.create_table(
        "fpa_reports",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("organization_id", sa.String(length=36), sa.ForeignKey("organizations.id"), nullable=False),
        sa.Column("report_type", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_by_user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index(
        op.f("ix_fpa_reports_org_type"),
        "fpa_reports",
        ["organization_id", "report_type"],
        unique=False,
    )


def downgrade() -> None:
    """Drop FP&A tables."""
    op.drop_index(op.f("ix_fpa_reports_org_type"), table_name="fpa_reports")
    op.drop_table("fpa_reports")
    op.drop_index(op.f("ix_fpa_scenarios_org_name"), table_name="fpa_scenarios")
    op.drop_table("fpa_scenarios")
    op.drop_index(op.f("ix_fpa_forecasts_org_period"), table_name="fpa_forecasts")
    op.drop_table("fpa_forecasts")

