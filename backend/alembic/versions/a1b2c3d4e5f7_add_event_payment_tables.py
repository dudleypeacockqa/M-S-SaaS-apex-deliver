"""Add event payment tables (DEV-019)

Revision ID: a1b2c3d4e5f7
Revises: d47310025be2
Create Date: 2025-11-15 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f7'
down_revision: Union[str, None] = 'd47310025be2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create paymentstatus enum
    op.execute("""
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paymentstatus') THEN
                CREATE TYPE paymentstatus AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded');
            END IF;
        END $$;
    """)
    
    # Create event_payments table
    op.create_table(
        'event_payments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('payment_intent_id', sa.String(length=255), nullable=False),
        sa.Column('event_id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False, server_default='GBP'),
        sa.Column('status', postgresql.ENUM('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', name='paymentstatus', create_type=False), nullable=False, server_default='pending'),
        sa.Column('ticket_type', sa.String(length=50), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('receipt_id', sa.String(length=36), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_event_payments_payment_intent_id', 'event_payments', ['payment_intent_id'], unique=True)
    op.create_index('ix_event_payments_event_id', 'event_payments', ['event_id'])
    op.create_index('ix_event_payments_user_id', 'event_payments', ['user_id'])
    op.create_index('ix_event_payments_organization_id', 'event_payments', ['organization_id'])
    
    # Create event_payment_receipts table
    op.create_table(
        'event_payment_receipts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('payment_id', sa.String(length=36), nullable=False),
        sa.Column('receipt_number', sa.String(length=50), nullable=False),
        sa.Column('pdf_path', sa.String(length=500), nullable=True),
        sa.Column('receipt_data', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['payment_id'], ['event_payments.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('payment_id'),
        sa.UniqueConstraint('receipt_number'),
    )
    op.create_index('ix_event_payment_receipts_payment_id', 'event_payment_receipts', ['payment_id'], unique=True)
    op.create_index('ix_event_payment_receipts_receipt_number', 'event_payment_receipts', ['receipt_number'], unique=True)
    
    # Add foreign key constraint for receipt_id after event_payment_receipts is created
    op.create_foreign_key(
        'event_payments_receipt_id_fkey',
        'event_payments',
        'event_payment_receipts',
        ['receipt_id'],
        ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    # Drop tables
    op.drop_index('ix_event_payment_receipts_receipt_number', table_name='event_payment_receipts')
    op.drop_index('ix_event_payment_receipts_payment_id', table_name='event_payment_receipts')
    op.drop_table('event_payment_receipts')
    
    op.drop_index('ix_event_payments_organization_id', table_name='event_payments')
    op.drop_index('ix_event_payments_user_id', table_name='event_payments')
    op.drop_index('ix_event_payments_event_id', table_name='event_payments')
    op.drop_index('ix_event_payments_payment_intent_id', table_name='event_payments')
    op.drop_table('event_payments')
    
    # Drop enum (only if no other tables use it)
    op.execute("DROP TYPE IF EXISTS paymentstatus")

