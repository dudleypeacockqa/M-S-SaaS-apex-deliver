#!/usr/bin/env python3
"""Fix production alembic version for ma_saas_platform."""

from __future__ import annotations

import os
import sys
from typing import Optional

from sqlalchemy import create_engine, text

DB_URL_ENV = "RENDER_PROD_DATABASE_URL"
TARGET_HEAD = "dc2c0f69c1b1"


def _configure_stdout() -> None:
    """Ensure UTF-8 output on Windows shells."""

    if sys.platform == "win32":
        import io

        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")  # type: ignore[attr-defined]


def _get_database_url() -> str:
    url: Optional[str] = os.environ.get(DB_URL_ENV)
    if not url:
        raise RuntimeError(
            f"Missing {DB_URL_ENV}. Export the production DATABASE_URL or set {DB_URL_ENV} before running this helper."
        )
    return url


def main() -> int:
    _configure_stdout()
    print("=" * 70)
    print("FIXING PRODUCTION DATABASE - ma_saas_platform")
    print("=" * 70)
    print()

    try:
        engine = create_engine(_get_database_url())
    except Exception as exc:  # pragma: no cover
        print(f"[ERROR] Unable to create engine: {exc}")
        return 1

    try:
        with engine.connect() as conn:
            # Step 1: Check current version
            print("[STEP 1] Checking current alembic_version...")
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            current_version = result.fetchone()[0]
            print(f"[INFO] Current version: {current_version}")
            print()

            # Step 2: Update to desired head
            print(f"[STEP 2] Updating to head: {TARGET_HEAD}")
            print("[INFO] This will allow migrations to continue from this point forward")
            print()
            conn.execute(
                text("UPDATE alembic_version SET version_num = :target WHERE version_num = :current"),
                {"target": TARGET_HEAD, "current": current_version},
            )
            conn.commit()
            print("[SUCCESS] Updated alembic_version table")
            print()

            # Step 3: Verify result
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            new_version = result.fetchone()[0]

        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Before:  {current_version}")
        print(f"After:   {new_version}")
        print()
        print("NEXT STEPS:")
        print("1. Rotate the Render production password immediately (password is no longer stored in this helper)")
        print("2. Trigger new deployment")
        print("3. Pre-Deploy will run: cd backend && alembic upgrade head")
        print("4. Alembic will see we're at head and skip migrations")
        print("5. Service will start successfully")
        print("=" * 70)

    except Exception as exc:  # pragma: no cover
        print(f"[ERROR] {exc}")
        import traceback

        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
