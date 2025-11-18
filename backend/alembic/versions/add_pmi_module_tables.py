"""Add PMI module tables

Revision ID: pmi_001
Revises: 20251118104453
Create Date: 2025-11-18 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'pmi_001'
down_revision: Union[str, None] = '20251118104453'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types for PMI
    op.execute("""
        CREATE TYPE pmi_project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
        CREATE TYPE pmi_workstream_status AS ENUM ('not_started', 'in_progress', 'at_risk', 'completed', 'blocked');
        CREATE TYPE pmi_workstream_type AS ENUM ('it', 'hr', 'finance', 'sales', 'operations', 'legal', 'culture', 'other');
        CREATE TYPE pmi_phase AS ENUM ('stabilization', 'integration', 'optimization');
        CREATE TYPE pmi_synergy_category AS ENUM ('cost_synergy', 'revenue_synergy', 'operational_efficiency');
        CREATE TYPE pmi_synergy_status AS ENUM ('planned', 'in_progress', 'realized', 'at_risk', 'cancelled');
        CREATE TYPE pmi_metric_type AS ENUM ('ktrr', 'ccr', 'srr', 'nps', 'integration_cost', 'time_to_synergy', 'other');
        CREATE TYPE pmi_risk_severity AS ENUM ('low', 'medium', 'high', 'critical');
        CREATE TYPE pmi_risk_status AS ENUM ('open', 'mitigated', 'closed', 'accepted');
        CREATE TYPE pmi_day_one_checklist_status AS ENUM ('not_started', 'in_progress', 'complete', 'at_risk');
        CREATE TYPE pmi_day_one_category AS ENUM ('it', 'hr', 'finance', 'legal', 'communications', 'operations', 'other');
    """)

    # Create pmi_projects table
    op.create_table('pmi_projects',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('status', postgresql.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled', name='pmi_project_status', create_type=False), nullable=False),
        sa.Column('close_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('day_one_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('target_completion_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_completion_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_by', sa.String(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['deal_id'], ['deals.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_projects_organization_id', 'pmi_projects', ['organization_id'])
    op.create_index('idx_pmi_projects_deal_id', 'pmi_projects', ['deal_id'])
    op.create_index('idx_pmi_projects_status', 'pmi_projects', ['status'])
    op.create_index('idx_pmi_projects_created_at', 'pmi_projects', ['created_at'])

    # Create pmi_workstreams table
    op.create_table('pmi_workstreams',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('project_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('workstream_type', postgresql.ENUM('it', 'hr', 'finance', 'sales', 'operations', 'legal', 'culture', 'other', name='pmi_workstream_type', create_type=False), nullable=False),
        sa.Column('owner_id', sa.String(36), nullable=True),
        sa.Column('status', postgresql.ENUM('not_started', 'in_progress', 'at_risk', 'completed', 'blocked', name='pmi_workstream_status', create_type=False), nullable=False),
        sa.Column('priority', sa.String(32), nullable=False),
        sa.Column('phase', postgresql.ENUM('stabilization', 'integration', 'optimization', name='pmi_phase', create_type=False), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('progress_percentage', sa.Numeric(5, 2), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['pmi_projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_workstreams_project_id', 'pmi_workstreams', ['project_id'])
    op.create_index('idx_pmi_workstreams_organization_id', 'pmi_workstreams', ['organization_id'])
    op.create_index('idx_pmi_workstreams_status', 'pmi_workstreams', ['status'])
    op.create_index('idx_pmi_workstreams_type', 'pmi_workstreams', ['workstream_type'])

    # Create pmi_milestones table
    op.create_table('pmi_milestones',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('workstream_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('target_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.String(32), nullable=False),
        sa.Column('dependencies', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['workstream_id'], ['pmi_workstreams.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_milestones_workstream_id', 'pmi_milestones', ['workstream_id'])
    op.create_index('idx_pmi_milestones_organization_id', 'pmi_milestones', ['organization_id'])
    op.create_index('idx_pmi_milestones_target_date', 'pmi_milestones', ['target_date'])

    # Create pmi_synergies table
    op.create_table('pmi_synergies',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('project_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('category', postgresql.ENUM('cost_synergy', 'revenue_synergy', 'operational_efficiency', name='pmi_synergy_category', create_type=False), nullable=False),
        sa.Column('planned_value', sa.Numeric(15, 2), nullable=False),
        sa.Column('realized_value', sa.Numeric(15, 2), nullable=True),
        sa.Column('currency', sa.String(3), nullable=False),
        sa.Column('target_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('realized_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', postgresql.ENUM('planned', 'in_progress', 'realized', 'at_risk', 'cancelled', name='pmi_synergy_status', create_type=False), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['pmi_projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_synergies_project_id', 'pmi_synergies', ['project_id'])
    op.create_index('idx_pmi_synergies_organization_id', 'pmi_synergies', ['organization_id'])
    op.create_index('idx_pmi_synergies_status', 'pmi_synergies', ['status'])
    op.create_index('idx_pmi_synergies_category', 'pmi_synergies', ['category'])

    # Create pmi_metrics table
    op.create_table('pmi_metrics',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('project_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('metric_type', postgresql.ENUM('ktrr', 'ccr', 'srr', 'nps', 'integration_cost', 'time_to_synergy', 'other', name='pmi_metric_type', create_type=False), nullable=False),
        sa.Column('value', sa.Numeric(15, 2), nullable=False),
        sa.Column('target_value', sa.Numeric(15, 2), nullable=True),
        sa.Column('measurement_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['pmi_projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_metrics_project_id', 'pmi_metrics', ['project_id'])
    op.create_index('idx_pmi_metrics_organization_id', 'pmi_metrics', ['organization_id'])
    op.create_index('idx_pmi_metrics_type', 'pmi_metrics', ['metric_type'])
    op.create_index('idx_pmi_metrics_measurement_date', 'pmi_metrics', ['measurement_date'])

    # Create pmi_risks table
    op.create_table('pmi_risks',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('project_id', sa.String(36), nullable=False),
        sa.Column('workstream_id', sa.String(36), nullable=True),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('severity', postgresql.ENUM('low', 'medium', 'high', 'critical', name='pmi_risk_severity', create_type=False), nullable=False),
        sa.Column('status', postgresql.ENUM('open', 'mitigated', 'closed', 'accepted', name='pmi_risk_status', create_type=False), nullable=False),
        sa.Column('mitigation_plan', sa.Text(), nullable=True),
        sa.Column('owner_id', sa.String(36), nullable=True),
        sa.Column('created_by', sa.String(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['pmi_projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['workstream_id'], ['pmi_workstreams.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_risks_project_id', 'pmi_risks', ['project_id'])
    op.create_index('idx_pmi_risks_workstream_id', 'pmi_risks', ['workstream_id'])
    op.create_index('idx_pmi_risks_organization_id', 'pmi_risks', ['organization_id'])
    op.create_index('idx_pmi_risks_severity', 'pmi_risks', ['severity'])
    op.create_index('idx_pmi_risks_status', 'pmi_risks', ['status'])

    # Create pmi_day_one_checklist table
    op.create_table('pmi_day_one_checklist',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('project_id', sa.String(36), nullable=False),
        sa.Column('organization_id', sa.String(36), nullable=False),
        sa.Column('category', postgresql.ENUM('it', 'hr', 'finance', 'legal', 'communications', 'operations', 'other', name='pmi_day_one_category', create_type=False), nullable=False),
        sa.Column('item', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', postgresql.ENUM('not_started', 'in_progress', 'complete', 'at_risk', name='pmi_day_one_checklist_status', create_type=False), nullable=False),
        sa.Column('owner_id', sa.String(36), nullable=True),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['pmi_projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_pmi_day_one_project_id', 'pmi_day_one_checklist', ['project_id'])
    op.create_index('idx_pmi_day_one_organization_id', 'pmi_day_one_checklist', ['organization_id'])
    op.create_index('idx_pmi_day_one_category', 'pmi_day_one_checklist', ['category'])
    op.create_index('idx_pmi_day_one_status', 'pmi_day_one_checklist', ['status'])
    op.create_index('idx_pmi_day_one_due_date', 'pmi_day_one_checklist', ['due_date'])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('pmi_day_one_checklist')
    op.drop_table('pmi_risks')
    op.drop_table('pmi_metrics')
    op.drop_table('pmi_synergies')
    op.drop_table('pmi_milestones')
    op.drop_table('pmi_workstreams')
    op.drop_table('pmi_projects')

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS pmi_day_one_category")
    op.execute("DROP TYPE IF EXISTS pmi_day_one_checklist_status")
    op.execute("DROP TYPE IF EXISTS pmi_risk_status")
    op.execute("DROP TYPE IF EXISTS pmi_risk_severity")
    op.execute("DROP TYPE IF EXISTS pmi_metric_type")
    op.execute("DROP TYPE IF EXISTS pmi_synergy_status")
    op.execute("DROP TYPE IF EXISTS pmi_synergy_category")
    op.execute("DROP TYPE IF EXISTS pmi_phase")
    op.execute("DROP TYPE IF EXISTS pmi_workstream_type")
    op.execute("DROP TYPE IF EXISTS pmi_workstream_status")
    op.execute("DROP TYPE IF EXISTS pmi_project_status")

