"""Add email notification tables (DEV-020)

Revision ID: b2c3d4e5f6a8
Revises: a1b2c3d4e5f7
Create Date: 2025-11-15 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a8'
down_revision: Union[str, None] = 'a1b2c3d4e5f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create user_notification_preferences table
    op.create_table(
        'user_notification_preferences',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('email_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('event_ticket_confirmation', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('event_reminders', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('community_comments', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('community_reactions', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('community_mentions', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('system_updates', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('security_alerts', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_index('ix_user_notification_preferences_user_id', 'user_notification_preferences', ['user_id'], unique=True)
    
    # Create email_queue table
    op.create_table(
        'email_queue',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('to_email', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=500), nullable=False),
        sa.Column('template_name', sa.String(length=100), nullable=False),
        sa.Column('template_data', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_email_queue_to_email', 'email_queue', ['to_email'])
    op.create_index('ix_email_queue_status', 'email_queue', ['status'])


def downgrade() -> None:
    # Drop tables
    op.drop_index('ix_email_queue_status', table_name='email_queue')
    op.drop_index('ix_email_queue_to_email', table_name='email_queue')
    op.drop_table('email_queue')
    
    op.drop_index('ix_user_notification_preferences_user_id', table_name='user_notification_preferences')
    op.drop_table('user_notification_preferences')


