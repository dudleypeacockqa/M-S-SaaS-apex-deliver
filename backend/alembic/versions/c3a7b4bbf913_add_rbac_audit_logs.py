"""add rbac audit logs

Revision ID: c3a7b4bbf913
Revises: ba1a5bcdb110
Create Date: 2025-11-10 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3a7b4bbf913"
down_revision: Union[str, None] = "ba1a5bcdb110"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "rbac_audit_logs",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("actor_user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column(
            "target_user_id",
            sa.String(length=36),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("organization_id", sa.String(length=36), nullable=True),
        sa.Column("action", sa.String(length=32), nullable=False),
        sa.Column("detail", sa.Text, nullable=True),
        sa.Column("claim_snapshot", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_rbac_audit_logs_actor", "rbac_audit_logs", ["actor_user_id"])
    op.create_index("ix_rbac_audit_logs_target", "rbac_audit_logs", ["target_user_id"])
    op.create_index("ix_rbac_audit_logs_org", "rbac_audit_logs", ["organization_id"])
    op.create_index("ix_rbac_audit_logs_action", "rbac_audit_logs", ["action"])


def downgrade() -> None:
    op.drop_index("ix_rbac_audit_logs_action", table_name="rbac_audit_logs")
    op.drop_index("ix_rbac_audit_logs_org", table_name="rbac_audit_logs")
    op.drop_index("ix_rbac_audit_logs_target", table_name="rbac_audit_logs")
    op.drop_index("ix_rbac_audit_logs_actor", table_name="rbac_audit_logs")
    op.drop_table("rbac_audit_logs")
