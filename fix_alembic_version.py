#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix production database alembic_version table.

This script manually updates the alembic_version table to point to
a valid migration (c3a7b4bbf913) instead of the deleted migration (f5b6c2c9d4f2).
"""

import os
import sys
from sqlalchemy import create_engine, text

# Force UTF-8 encoding for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[ERROR] DATABASE_URL environment variable not set")
    sys.exit(1)

print("[INFO] Connecting to database...")
print(f"[INFO] Host: {DATABASE_URL.split('@')[1].split('/')[0]}")
print()

# Create engine
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # Step 1: Check current alembic_version
        print("[STEP 1] Checking current alembic_version...")
        result = conn.execute(text("SELECT version_num FROM alembic_version"))
        current_version = result.fetchone()

        if current_version:
            current_version = current_version[0]
            print(f"[INFO] Current version: {current_version}")
        else:
            print("[WARN] No version found in alembic_version table")
            current_version = None
        print()

        # Step 2: Update to safe migration
        if current_version == "f5b6c2c9d4f2":
            print("[STEP 2] Updating alembic_version to c3a7b4bbf913...")
            conn.execute(text(
                "UPDATE alembic_version SET version_num = 'c3a7b4bbf913' "
                "WHERE version_num = 'f5b6c2c9d4f2'"
            ))
            conn.commit()
            print("[SUCCESS] Update successful!")
        elif current_version == "c3a7b4bbf913":
            print("[INFO] Already at c3a7b4bbf913 - no update needed")
        elif current_version == "9a3aba324f7f":
            print("[SUCCESS] Already at head (9a3aba324f7f) - migrations complete!")
        else:
            print(f"[WARN] Unexpected version {current_version}")
            print("[WARN] Manual investigation required.")
        print()

        # Step 3: Verify update
        print("[STEP 3] Verifying alembic_version...")
        result = conn.execute(text("SELECT version_num FROM alembic_version"))
        new_version = result.fetchone()[0]
        print(f"[INFO] New version: {new_version}")
        print()

        # Summary
        print("=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Before:  {current_version}")
        print(f"After:   {new_version}")

        if new_version == "c3a7b4bbf913":
            print()
            print("[SUCCESS] Database ready for migration upgrade.")
            print("[NEXT] Run 'cd backend && alembic upgrade head'")
        elif new_version == "9a3aba324f7f":
            print()
            print("[SUCCESS] Database already at head - all migrations applied.")
        else:
            print()
            print("[WARN] Manual review required.")
        print("=" * 60)

except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
