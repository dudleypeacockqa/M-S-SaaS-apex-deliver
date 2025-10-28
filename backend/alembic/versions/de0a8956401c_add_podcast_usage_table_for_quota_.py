"""Add podcast_usage table for quota tracking

Revision ID: de0a8956401c
Revises: 658051b7d4f9
Create Date: 2025-10-28 09:44:39.328744

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de0a8956401c'
down_revision: Union[str, None] = '658051b7d4f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create podcast_usage table for quota tracking
    op.create_table(
        'podcast_usage',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('organization_id', sa.String(), nullable=False),
        sa.Column('month', sa.DateTime(), nullable=False),
        sa.Column('episode_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('idx_podcast_usage_org_month', 'podcast_usage', ['organization_id', 'month'])
    op.create_index('idx_podcast_usage_unique_org_month', 'podcast_usage', ['organization_id', 'month'], unique=True)
    op.create_index(op.f('ix_podcast_usage_organization_id'), 'podcast_usage', ['organization_id'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_podcast_usage_organization_id'), table_name='podcast_usage')
    op.drop_index('idx_podcast_usage_unique_org_month', table_name='podcast_usage')
    op.drop_index('idx_podcast_usage_org_month', table_name='podcast_usage')

    # Drop table
    op.drop_table('podcast_usage')
