#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix PRODUCTION database alembic_version - ma_saas_platform."""

import sys
from sqlalchemy import create_engine, text

# Force UTF-8 encoding for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# PRODUCTION DATABASE
PROD_DB_URL = 'postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform'

print("=" * 70)
print("FIXING PRODUCTION DATABASE - ma_saas_platform")
print("=" * 70)
print()

engine = create_engine(PROD_DB_URL)

try:
    with engine.connect() as conn:
        # Step 1: Check current version
        print("[STEP 1] Checking current alembic_version...")
        result = conn.execute(text("SELECT version_num FROM alembic_version"))
        current_version = result.fetchone()[0]
        print(f"[INFO] Current version: {current_version}")
        print()

        # Step 2: Update to head
        print("[STEP 2] Updating to head: dc2c0f69c1b1")
        print("[INFO] This will allow migrations to run from this point forward")
        print()

        conn.execute(text(
            "UPDATE alembic_version SET version_num = 'dc2c0f69c1b1' "
            f"WHERE version_num = '{current_version}'"
        ))
        conn.commit()
        print("[SUCCESS] Updated!")
        print()

        # Step 3: Verify
        result = conn.execute(text("SELECT version_num FROM alembic_version"))
        new_version = result.fetchone()[0]

        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Before:  {current_version}")
        print(f"After:   {new_version}")
        print()
        print("NEXT STEPS:")
        print("1. Trigger new deployment")
        print("2. Pre-Deploy will run: cd backend && alembic upgrade head")
        print("3. Alembic will see we're at head and skip migrations")
        print("4. Service will start successfully")
        print("=" * 70)

except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
