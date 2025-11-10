"""merge heads for uuid fixes

Revision ID: f5b6c2c9d4f2
Revises: 0cbf1e0e3ab5, e19f4551fcb0
Create Date: 2025-11-10 16:25:00.000000

This is a no-op merge migration to reconcile parallel heads introduced by:
- 0cbf1e0e3ab5 (organizations.id UUID → String)
- e19f4551fcb0 (users.id UUID → String)
"""
from typing import Sequence, Union

from alembic import op  # noqa: F401

revision: str = "f5b6c2c9d4f2"
down_revision: Union[str, tuple[str, ...]] = ("0cbf1e0e3ab5", "e19f4551fcb0")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
