"""Merge the source_deal_id branch back into the prior consolidated head.

This revision reconciles the new `20251120120000` migration (adds
`generated_documents.source_deal_id`) with the existing multi-head merge
`8b95e2bec471`, ensuring a single linear history before deploying to
Render.

Revision ID: 4c02488ea178
Revises: 20251120120000, 8b95e2bec471
Create Date: 2025-11-21 09:13:14.638688
"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "4c02488ea178"
down_revision: Union[str, None] = ("20251120120000", "8b95e2bec471")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No-op merge to align divergent heads."""
    pass


def downgrade() -> None:
    """No-op merge to align divergent heads."""
    pass
