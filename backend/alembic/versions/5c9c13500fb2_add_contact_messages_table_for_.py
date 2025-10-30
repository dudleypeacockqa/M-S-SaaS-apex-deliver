"""add contact_messages table for marketing contact form

Revision ID: 5c9c13500fb2
Revises: 9913803fac51
Create Date: 2025-10-30 08:11:05.192797

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c9c13500fb2'
down_revision: Union[str, None] = '9913803fac51'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='new'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_messages_id'), 'contact_messages', ['id'], unique=False)
    op.create_index(op.f('ix_contact_messages_email'), 'contact_messages', ['email'], unique=False)
    op.create_index(op.f('ix_contact_messages_created_at'), 'contact_messages', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_contact_messages_created_at'), table_name='contact_messages')
    op.drop_index(op.f('ix_contact_messages_email'), table_name='contact_messages')
    op.drop_index(op.f('ix_contact_messages_id'), table_name='contact_messages')
    op.drop_table('contact_messages')
