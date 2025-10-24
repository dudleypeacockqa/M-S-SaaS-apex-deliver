"""create users table for MA platform

Revision ID: 8dcb6880a52b
Revises:
Create Date: 2025-10-24 12:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8dcb6880a52b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade: Clean database and create users table for M&A platform."""

    # Drop all old tables from previous project (if they exist)
    # Using if_exists to avoid errors if tables don't exist
    old_tables = [
        'quality_records', 'sessions', 'ai_insights', 'audit_logs', 'departments',
        'products', 'cash_flow_forecasts', 'system_settings', '_prisma_migrations',
        'notifications', 'production_jobs', 'demand_forecasts', 'inventory_items',
        'mcp_requests', 'scheduled_jobs', 'dashboards', 'inventory_movements',
        'vector_store', 'working_capital', 'data_exports', 'what_if_scenarios',
        'organizations', 'users'  # Drop old users table too
    ]

    # Note: CASCADE is PostgreSQL-specific, SQLite will fail silently if table doesn't exist
    for table in old_tables:
        try:
            op.execute(f'DROP TABLE IF EXISTS {table} CASCADE')
        except Exception:
            # SQLite doesn't support CASCADE, try without it
            try:
                op.execute(f'DROP TABLE IF EXISTS {table}')
            except Exception:
                # Table doesn't exist or can't be dropped, continue
                pass

    # Drop old enum types (PostgreSQL only, will fail silently on SQLite)
    try:
        op.execute('DROP TYPE IF EXISTS "UserRole" CASCADE')
    except Exception:
        pass
    try:
        op.execute('DROP TYPE IF EXISTS "userrole" CASCADE')
    except Exception:
        pass

    # Create new users table for M&A platform
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('clerk_user_id', sa.String(), nullable=False, unique=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('profile_image_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('role', sa.String(length=32), nullable=False, server_default='solo'),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=True),
    )

    # Create indexes
    op.create_index(op.f('ix_users_clerk_user_id'), 'users', ['clerk_user_id'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    print("✅ Database cleaned and users table created for M&A platform")


def downgrade() -> None:
    """Downgrade: Drop users table."""
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_clerk_user_id'), table_name='users')
    op.drop_table('users')

    print("⚠️  Users table dropped - database reverted")
