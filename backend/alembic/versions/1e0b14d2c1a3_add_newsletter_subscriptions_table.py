"""Add newsletter_subscriptions table for marketing opt-ins."""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "1e0b14d2c1a3"
down_revision: Union[str, None] = "f1b4a3c0d8c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "newsletter_subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("source", sa.String(length=100), nullable=False, server_default="website"),
        sa.Column("subscribed_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(
        op.f("ix_newsletter_subscriptions_email"),
        "newsletter_subscriptions",
        ["email"],
        unique=True,
    )
    op.create_index(
        op.f("ix_newsletter_subscriptions_subscribed_at"),
        "newsletter_subscriptions",
        ["subscribed_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_newsletter_subscriptions_subscribed_at"), table_name="newsletter_subscriptions")
    op.drop_index(op.f("ix_newsletter_subscriptions_email"), table_name="newsletter_subscriptions")
    op.drop_table("newsletter_subscriptions")
