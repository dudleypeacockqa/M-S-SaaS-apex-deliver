"""Utility script to inspect podcast-related tables in the configured DB."""

from __future__ import annotations

import os

import psycopg2


def main() -> None:
    database_url = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(database_url, sslmode="require")
    cur = conn.cursor()

    try:
        cur.execute("SELECT version_num FROM alembic_version")
        print("alembic_version rows:", cur.fetchall())
    except psycopg2.errors.UndefinedTable:
        conn.rollback()
        print("alembic_version table is missing (migrations likely rolled back).")

    for table in ("podcast_episodes", "podcast_transcripts", "podcast_analytics"):
        cur.execute(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = %s
            """,
            (table,),
        )
        print(f"{table} exists?:", bool(cur.fetchall()))

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()

