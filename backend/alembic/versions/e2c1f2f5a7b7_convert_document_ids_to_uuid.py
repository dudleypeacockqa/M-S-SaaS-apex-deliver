"""Convert document-related identifiers to UUID

Revision ID: e2c1f2f5a7b7
Revises: d47310025be2
Create Date: 2025-11-14 13:55:00.000000
"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e2c1f2f5a7b7"
down_revision: Union[str, None] = "d47310025be2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

UUID_COLUMNS = [
    ("documents", "id"),
    ("documents", "parent_document_id"),
    ("document_permissions", "document_id"),
    ("document_access_logs", "document_id"),
    ("document_share_links", "document_id"),
    ("document_questions", "id"),
    ("document_questions", "document_id"),
    ("valuation_export_logs", "document_id"),
]

FOREIGN_KEYS = [
    ("documents", "documents_parent_document_id_fkey", None, None, {"source": ["parent_document_id"], "target": ["id"]}),
    ("document_permissions", "document_permissions_document_id_fkey", None, None, {"source": ["document_id"], "target": ["id"]}),
    ("document_access_logs", "document_access_logs_document_id_fkey", None, None, {"source": ["document_id"], "target": ["id"]}),
    ("document_share_links", "document_share_links_document_id_fkey", None, None, {"source": ["document_id"], "target": ["id"]}),
    ("document_questions", "document_questions_document_id_fkey", "CASCADE", None, {"source": ["document_id"], "target": ["id"]}),
    ("valuation_export_logs", "valuation_export_logs_document_id_fkey", None, None, {"source": ["document_id"], "target": ["id"]}),
]


def _alter_column_to_uuid(table: str, column: str) -> None:
    op.execute(
        f"ALTER TABLE {table} "
        f"ALTER COLUMN {column} TYPE uuid USING NULLIF({column}::text, '')::uuid"
    )


def _alter_column_to_varchar(table: str, column: str) -> None:
    op.execute(
        f"ALTER TABLE {table} ALTER COLUMN {column} TYPE varchar(36) USING {column}::text"
    )


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    # Drop foreign keys before altering column types
    for table, constraint, *_ in FOREIGN_KEYS:
        op.execute(
            f"ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {constraint}"
        )

    for table, column in UUID_COLUMNS:
        _alter_column_to_uuid(table, column)

    # Recreate foreign keys
    for table, constraint, ondelete, _, spec in FOREIGN_KEYS:
        source_cols = spec["source"]
        target_cols = spec["target"]
        op.create_foreign_key(
            constraint,
            table,
            "documents",
            source_cols,
            target_cols,
            ondelete=ondelete,
        )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    for table, constraint, *_ in FOREIGN_KEYS:
        op.execute(
            f"ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {constraint}"
        )

    # Revert columns back to varchar(36)
    for table, column in UUID_COLUMNS:
        _alter_column_to_varchar(table, column)

    for table, constraint, ondelete, _, spec in FOREIGN_KEYS:
        source_cols = spec["source"]
        target_cols = spec["target"]
        op.create_foreign_key(
            constraint,
            table,
            "documents",
            source_cols,
            target_cols,
            ondelete=ondelete,
        )
