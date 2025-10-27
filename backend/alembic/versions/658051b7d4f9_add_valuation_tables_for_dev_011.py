"""add valuation tables for DEV-011

Revision ID: 658051b7d4f9
Revises: 2ae9df164631
Create Date: 2025-10-27 13:53:17.573957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '658051b7d4f9'
down_revision: Union[str, None] = '2ae9df164631'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create valuations table
    op.create_table(
        'valuations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('deal_id', sa.String(36), sa.ForeignKey('deals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('forecast_years', sa.Integer(), default=5, nullable=False),
        sa.Column('discount_rate', sa.Float(), nullable=False),
        sa.Column('terminal_growth_rate', sa.Float(), nullable=True),
        sa.Column('terminal_ebitda_multiple', sa.Float(), nullable=True),
        sa.Column('terminal_method', sa.String(20), default='gordon_growth', nullable=False),
        sa.Column('cash_flows', sa.JSON(), nullable=False),
        sa.Column('terminal_cash_flow', sa.Float(), nullable=False),
        sa.Column('enterprise_value', sa.Float(), nullable=True),
        sa.Column('equity_value', sa.Float(), nullable=True),
        sa.Column('implied_share_price', sa.Float(), nullable=True),
        sa.Column('net_debt', sa.Float(), default=0.0, nullable=False),
        sa.Column('shares_outstanding', sa.Float(), nullable=True),
        sa.Column('created_by', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create valuation_scenarios table
    op.create_table(
        'valuation_scenarios',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('valuation_id', sa.String(36), sa.ForeignKey('valuations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('assumptions', sa.JSON(), nullable=False),
        sa.Column('enterprise_value', sa.Float(), nullable=True),
        sa.Column('equity_value', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create comparable_companies table
    op.create_table(
        'comparable_companies',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('valuation_id', sa.String(36), sa.ForeignKey('valuations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('company_name', sa.String(200), nullable=False),
        sa.Column('ticker', sa.String(10), nullable=True),
        sa.Column('industry', sa.String(100), nullable=True),
        sa.Column('country', sa.String(50), nullable=True),
        sa.Column('revenue', sa.Float(), nullable=True),
        sa.Column('ebitda', sa.Float(), nullable=True),
        sa.Column('ebit', sa.Float(), nullable=True),
        sa.Column('net_income', sa.Float(), nullable=True),
        sa.Column('enterprise_value', sa.Float(), nullable=True),
        sa.Column('market_cap', sa.Float(), nullable=True),
        sa.Column('ev_revenue_multiple', sa.Float(), nullable=True),
        sa.Column('ev_ebitda_multiple', sa.Float(), nullable=True),
        sa.Column('ev_ebit_multiple', sa.Float(), nullable=True),
        sa.Column('pe_multiple', sa.Float(), nullable=True),
        sa.Column('is_outlier', sa.String(10), default='false', nullable=False),
        sa.Column('weight', sa.Float(), default=1.0, nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create precedent_transactions table
    op.create_table(
        'precedent_transactions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('valuation_id', sa.String(36), sa.ForeignKey('valuations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('target_company', sa.String(200), nullable=False),
        sa.Column('acquirer_company', sa.String(200), nullable=False),
        sa.Column('announcement_date', sa.DateTime(), nullable=True),
        sa.Column('close_date', sa.DateTime(), nullable=True),
        sa.Column('deal_value', sa.Float(), nullable=True),
        sa.Column('target_revenue', sa.Float(), nullable=True),
        sa.Column('target_ebitda', sa.Float(), nullable=True),
        sa.Column('target_ebit', sa.Float(), nullable=True),
        sa.Column('ev_revenue_multiple', sa.Float(), nullable=True),
        sa.Column('ev_ebitda_multiple', sa.Float(), nullable=True),
        sa.Column('ev_ebit_multiple', sa.Float(), nullable=True),
        sa.Column('industry', sa.String(100), nullable=True),
        sa.Column('deal_type', sa.String(50), nullable=True),
        sa.Column('is_public_target', sa.String(10), default='false', nullable=False),
        sa.Column('is_stale', sa.String(10), default='false', nullable=False),
        sa.Column('weight', sa.Float(), default=1.0, nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create valuation_export_logs table
    op.create_table(
        'valuation_export_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('valuation_id', sa.String(36), sa.ForeignKey('valuations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('export_type', sa.String(20), nullable=False),
        sa.Column('export_format', sa.String(50), nullable=True),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('document_id', sa.String(36), sa.ForeignKey('documents.id'), nullable=True),
        sa.Column('exported_by', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('exported_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    # Drop tables in reverse order (respecting foreign keys)
    op.drop_table('valuation_export_logs')
    op.drop_table('precedent_transactions')
    op.drop_table('comparable_companies')
    op.drop_table('valuation_scenarios')
    op.drop_table('valuations')
