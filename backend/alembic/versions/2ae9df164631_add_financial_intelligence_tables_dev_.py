"""Add financial intelligence tables (DEV-010)

Revision ID: 2ae9df164631
Revises: 95b4f69d2ac2
Create Date: 2025-10-25 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '2ae9df164631'
down_revision: Union[str, None] = '95b4f69d2ac2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create financial_connections table
    op.create_table('financial_connections',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('platform', sa.String(50), nullable=False),
        sa.Column('platform_organization_id', sa.String(255), nullable=True),
        sa.Column('platform_organization_name', sa.String(255), nullable=True),
        sa.Column('access_token', sa.Text(), nullable=False),
        sa.Column('refresh_token', sa.Text(), nullable=True),
        sa.Column('token_expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('connection_status', sa.String(50), nullable=False),
        sa.Column('last_sync_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_sync_status', sa.String(50), nullable=True),
        sa.Column('last_sync_error', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['deal_id'], ['deals.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_financial_connections_deal_id', 'financial_connections', ['deal_id'])
    op.create_index('ix_financial_connections_organization_id', 'financial_connections', ['organization_id'])

    # Create financial_statements table
    op.create_table('financial_statements',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('connection_id', sa.String(36), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('statement_type', sa.String(50), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('period_type', sa.String(20), nullable=False),
        sa.Column('currency', sa.String(3), nullable=False),
        sa.Column('total_assets', sa.Numeric(15, 2), nullable=True),
        sa.Column('total_liabilities', sa.Numeric(15, 2), nullable=True),
        sa.Column('total_equity', sa.Numeric(15, 2), nullable=True),
        sa.Column('revenue', sa.Numeric(15, 2), nullable=True),
        sa.Column('net_income', sa.Numeric(15, 2), nullable=True),
        sa.Column('ebitda', sa.Numeric(15, 2), nullable=True),
        sa.Column('data_completeness_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('raw_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('imported_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['connection_id'], ['financial_connections.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['deal_id'], ['deals.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_financial_statements_connection_id', 'financial_statements', ['connection_id'])
    op.create_index('ix_financial_statements_deal_id', 'financial_statements', ['deal_id'])
    op.create_index('ix_financial_statements_organization_id', 'financial_statements', ['organization_id'])

    # Create financial_ratios table (simplified - add more columns later)
    op.create_table('financial_ratios',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('statement_id', sa.String(36), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('current_ratio', sa.Numeric(10, 4), nullable=True),
        sa.Column('gross_profit_margin', sa.Numeric(10, 4), nullable=True),
        sa.Column('debt_to_equity', sa.Numeric(10, 4), nullable=True),
        sa.Column('return_on_equity', sa.Numeric(10, 4), nullable=True),
        sa.Column('calculation_notes', sa.Text(), nullable=True),
        sa.Column('calculated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['deal_id'], ['deals.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['statement_id'], ['financial_statements.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_financial_ratios_deal_id', 'financial_ratios', ['deal_id'])
    op.create_index('ix_financial_ratios_organization_id', 'financial_ratios', ['organization_id'])
    op.create_index('ix_financial_ratios_statement_id', 'financial_ratios', ['statement_id'])

    # Create financial_narratives table
    op.create_table('financial_narratives',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('strengths', postgresql.JSONB(), nullable=True),
        sa.Column('weaknesses', postgresql.JSONB(), nullable=True),
        sa.Column('red_flags', postgresql.JSONB(), nullable=True),
        sa.Column('growth_signals', postgresql.JSONB(), nullable=True),
        sa.Column('readiness_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('readiness_score_breakdown', postgresql.JSONB(), nullable=True),
        sa.Column('data_quality_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('financial_health_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('growth_trajectory_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('risk_assessment_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('recommendations', postgresql.JSONB(), nullable=True),
        sa.Column('ai_model', sa.String(100), nullable=False),
        sa.Column('prompt_version', sa.String(50), nullable=True),
        sa.Column('token_count', sa.Integer(), nullable=True),
        sa.Column('generation_time_ms', sa.Integer(), nullable=True),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('supersedes_id', sa.String(36), nullable=True),
        sa.Column('generated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_by', sa.String(36), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['deal_id'], ['deals.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['supersedes_id'], ['financial_narratives.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_financial_narratives_deal_id', 'financial_narratives', ['deal_id'])
    op.create_index('ix_financial_narratives_organization_id', 'financial_narratives', ['organization_id'])


def downgrade() -> None:
    op.drop_index('ix_financial_narratives_organization_id', table_name='financial_narratives')
    op.drop_index('ix_financial_narratives_deal_id', table_name='financial_narratives')
    op.drop_table('financial_narratives')
    op.drop_index('ix_financial_ratios_statement_id', table_name='financial_ratios')
    op.drop_index('ix_financial_ratios_organization_id', table_name='financial_ratios')
    op.drop_index('ix_financial_ratios_deal_id', table_name='financial_ratios')
    op.drop_table('financial_ratios')
    op.drop_index('ix_financial_statements_organization_id', table_name='financial_statements')
    op.drop_index('ix_financial_statements_deal_id', table_name='financial_statements')
    op.drop_index('ix_financial_statements_connection_id', table_name='financial_statements')
    op.drop_table('financial_statements')
    op.drop_index('ix_financial_connections_organization_id', table_name='financial_connections')
    op.drop_index('ix_financial_connections_deal_id', table_name='financial_connections')
    op.drop_table('financial_connections')
