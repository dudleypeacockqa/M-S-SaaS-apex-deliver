"""add blog_posts table for marketing content

Revision ID: 9913803fac51
Revises: 1038e72b10f1
Create Date: 2025-10-30 08:06:53.642866

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9913803fac51'
down_revision: Union[str, None] = '1038e72b10f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'blog_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('excerpt', sa.Text(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('author', sa.String(length=100), nullable=False, server_default='Dudley Peacock'),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('primary_keyword', sa.String(length=255), nullable=False),
        sa.Column('secondary_keywords', sa.Text(), nullable=True),
        sa.Column('meta_description', sa.String(length=160), nullable=False),
        sa.Column('featured_image_url', sa.String(length=500), nullable=True),
        sa.Column('published', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('read_time_minutes', sa.Integer(), nullable=False, server_default='10'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blog_posts_id'), 'blog_posts', ['id'], unique=False)
    op.create_index(op.f('ix_blog_posts_slug'), 'blog_posts', ['slug'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_blog_posts_slug'), table_name='blog_posts')
    op.drop_index(op.f('ix_blog_posts_id'), table_name='blog_posts')
    op.drop_table('blog_posts')
