"""Add PMI notification preferences to user_notification_preferences

Revision ID: pmi_notif_prefs_001
Revises: pmi_001
Create Date: 2025-11-18 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'pmi_notif_prefs_001'
down_revision: Union[str, None] = 'pmi_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add PMI notification preference columns
    op.add_column('user_notification_preferences', sa.Column('pmi_milestone_reminders', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('user_notification_preferences', sa.Column('pmi_risk_alerts', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('user_notification_preferences', sa.Column('pmi_synergy_alerts', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('user_notification_preferences', sa.Column('pmi_day_one_warnings', sa.Boolean(), nullable=False, server_default='true'))


def downgrade() -> None:
    # Remove PMI notification preference columns
    op.drop_column('user_notification_preferences', 'pmi_day_one_warnings')
    op.drop_column('user_notification_preferences', 'pmi_synergy_alerts')
    op.drop_column('user_notification_preferences', 'pmi_risk_alerts')
    op.drop_column('user_notification_preferences', 'pmi_milestone_reminders')

