"""Add metadata column to document access logs"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f6c0cba0b97a"
down_revision: Union[str, None] = "e2c1f2f5a7b7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "document_access_logs",
        sa.Column("metadata", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("document_access_logs", "metadata")
