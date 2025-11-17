"""merge metadata rename and other heads

Revision ID: 079ee49539ef
Revises: 3ecece8fd99d, ffd0bb93a551
Create Date: 2025-11-17 16:01:25.526321

Merges two migration heads that were deployed to production:
- ffd0bb93a551: Rename metadata to access_metadata in document_access_logs
- 3ecece8fd99d: Other changes

Note: f6c0cba0b97a is handled separately to avoid merge conflicts.

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '079ee49539ef'
down_revision: Union[str, None] = ('3ecece8fd99d', 'ffd0bb93a551')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
