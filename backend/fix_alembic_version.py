#!/usr/bin/env python3
"""
Fix script to reset alembic_version table when orphaned revisions exist.
This handles the case where the database references a migration that no longer exists in the codebase.
"""
import os
import sys
from sqlalchemy import create_engine, text

def fix_alembic_version():
    """Reset alembic_version to the current head if it references a missing revision."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)
    
    # The current head revision in the codebase
    CURRENT_HEAD = "4c02488ea178"
    
    # The orphaned revision that's causing the error
    ORPHANED_REVISION = "20251129_135045_merge_consultative_sales_and_barkers"
    
    try:
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Check if alembic_version table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'alembic_version'
                )
            """))
            table_exists = result.scalar()
            
            if not table_exists:
                print("✓ alembic_version table does not exist yet - no fix needed")
                return
            
            # Get current version
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            current_version = result.scalar()
            
            print(f"Current alembic version in database: {current_version}")
            
            if current_version == ORPHANED_REVISION:
                print(f"⚠ Found orphaned revision: {ORPHANED_REVISION}")
                print(f"→ Updating to current head: {CURRENT_HEAD}")
                
                conn.execute(text(f"""
                    UPDATE alembic_version 
                    SET version_num = '{CURRENT_HEAD}'
                """))
                conn.commit()
                
                print("✓ Successfully updated alembic_version to current head")
            elif current_version == CURRENT_HEAD:
                print("✓ Database is already at current head - no fix needed")
            else:
                print(f"ℹ Database is at revision: {current_version}")
                print(f"  Current head is: {CURRENT_HEAD}")
                print("  Alembic upgrade will handle this normally")
        
        engine.dispose()
        
    except Exception as e:
        print(f"ERROR fixing alembic_version: {e}")
        sys.exit(1)

if __name__ == "__main__":
    fix_alembic_version()
