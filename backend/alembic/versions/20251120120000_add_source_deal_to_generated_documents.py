"""Add source_deal_id to generated_documents."""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20251120120000"
down_revision = "20251119120000"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "generated_documents",
        sa.Column("source_deal_id", sa.String(length=36), nullable=True),
    )
    op.create_foreign_key(
        "fk_generated_documents_source_deal",
        "generated_documents",
        "deals",
        ["source_deal_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_generated_documents_source_deal", "generated_documents", type_="foreignkey")
    op.drop_column("generated_documents", "source_deal_id")
