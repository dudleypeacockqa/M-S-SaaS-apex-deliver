"""Inspect document-related column types to diagnose FK mismatches."""

from __future__ import annotations

import os

import psycopg2


def main() -> None:
    conn = psycopg2.connect(os.environ["DATABASE_URL"], sslmode="require")
    cur = conn.cursor()

    def column_info(table: str, column: str) -> None:
        cur.execute(
            """
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = %s
              AND column_name = %s
            """,
            (table, column),
        )
        print(f"{table}.{column}:", cur.fetchall())

    column_info("documents", "id")
    column_info("documents", "parent_document_id")
    column_info("document_questions", "document_id")
    column_info("document_questions", "id")
    column_info("document_access_logs", "document_id")
    column_info("document_permissions", "document_id")
    column_info("document_share_links", "document_id")
    column_info("valuation_export_logs", "document_id")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()

