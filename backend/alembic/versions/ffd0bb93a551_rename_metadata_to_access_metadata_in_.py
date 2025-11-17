"""placeholder to preserve history"""
from typing import Sequence, Union

from alembic import op  # noqa
import sqlalchemy as sa  # noqa

revision: str = 'ffd0bb93a551'
down_revision: Union[str, None] = '65e4b4ef883d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # No-op: column rename handled by downstream schema changes.
    pass


def downgrade() -> None:
    # No-op downgrade.
    pass
