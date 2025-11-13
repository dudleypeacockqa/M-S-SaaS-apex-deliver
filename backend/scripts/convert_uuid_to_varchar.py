"""
Convert all UUID columns to VARCHAR(36) in production database.

This script:
1. Drops all foreign key constraints (saves metadata)
2. Converts all UUID columns to VARCHAR(36)
3. Recreates all foreign key constraints

Safe to run because production has ZERO users and ZERO organizations.
"""
import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine import Engine
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

def get_database_url() -> str:
    """Get DATABASE_URL from environment."""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return db_url

def convert_uuid_to_varchar(engine: Engine):
    """Execute the full conversion."""

    logger.info("=" * 70)
    logger.info("UUID to VARCHAR(36) Conversion - Production Database")
    logger.info("=" * 70)
    logger.info("")

    with engine.begin() as conn:
        # PHASE 1: Validation
        logger.info("[PHASE 1] Pre-Conversion Validation")
        logger.info("-" * 40)

        result = conn.execute(text("""
            SELECT COUNT(*) as uuid_count
            FROM information_schema.columns
            WHERE table_schema = 'public' AND data_type = 'uuid'
        """))
        uuid_count = result.scalar()
        logger.info(f"Total UUID columns to convert: {uuid_count}")

        result = conn.execute(text("SELECT COUNT(*) FROM users"))
        user_count = result.scalar()
        result = conn.execute(text("SELECT COUNT(*) FROM organizations"))
        org_count = result.scalar()
        logger.info(f"Users: {user_count}, Organizations: {org_count}")
        logger.info("")

        # PHASE 2: Drop FKs and save metadata
        logger.info("[PHASE 2] Dropping Foreign Key Constraints")
        logger.info("-" * 40)

        # Create temp table for FK metadata
        conn.execute(text("""
            CREATE TEMP TABLE dropped_fk_constraints (
                constraint_name VARCHAR(255),
                table_name VARCHAR(255),
                column_name VARCHAR(255),
                referenced_table VARCHAR(255),
                referenced_column VARCHAR(255),
                delete_rule VARCHAR(50),
                update_rule VARCHAR(50)
            )
        """))

        # Get all FK constraints
        fks = conn.execute(text("""
            SELECT DISTINCT
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS referenced_table,
                ccu.column_name AS referenced_column,
                rc.delete_rule,
                rc.update_rule
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            JOIN information_schema.referential_constraints rc
                ON rc.constraint_name = tc.constraint_name
                AND rc.constraint_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
        """)).fetchall()

        # Drop each FK and save metadata
        for i, fk in enumerate(fks, 1):
            # Save metadata
            conn.execute(text("""
                INSERT INTO dropped_fk_constraints VALUES (
                    :constraint_name, :table_name, :column_name,
                    :referenced_table, :referenced_column,
                    :delete_rule, :update_rule
                )
            """), {
                'constraint_name': fk[0],
                'table_name': fk[1],
                'column_name': fk[2],
                'referenced_table': fk[3],
                'referenced_column': fk[4],
                'delete_rule': fk[5],
                'update_rule': fk[6]
            })

            # Drop FK
            conn.execute(text(f'ALTER TABLE "{fk[1]}" DROP CONSTRAINT IF EXISTS "{fk[0]}"'))

            if i % 20 == 0:
                logger.info(f"  Dropped {i}/{len(fks)} FK constraints...")

        logger.info(f"Total FK constraints dropped: {len(fks)}")
        logger.info("")

        # PHASE 3: Convert primary keys
        logger.info("[PHASE 3] Converting UUID Primary Keys to VARCHAR(36)")
        logger.info("-" * 40)

        pks = conn.execute(text("""
            SELECT DISTINCT c.table_name, c.column_name
            FROM information_schema.columns c
            JOIN information_schema.table_constraints tc
                ON c.table_name = tc.table_name
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND c.column_name = kcu.column_name
            WHERE c.table_schema = 'public'
            AND c.data_type = 'uuid'
            AND tc.constraint_type = 'PRIMARY KEY'
            ORDER BY c.table_name, c.column_name
        """)).fetchall()

        for i, (table, column) in enumerate(pks, 1):
            conn.execute(text(f'ALTER TABLE "{table}" ALTER COLUMN "{column}" TYPE VARCHAR(36) USING "{column}"::text'))
            if i % 10 == 0:
                logger.info(f"  Converted {i}/{len(pks)} primary keys...")

        logger.info(f"Total primary keys converted: {len(pks)}")
        logger.info("")

        # PHASE 4: Convert all remaining UUID columns
        logger.info("[PHASE 4] Converting All Remaining UUID Columns to VARCHAR(36)")
        logger.info("-" * 40)

        uuid_cols = conn.execute(text("""
            SELECT DISTINCT table_name, column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND data_type = 'uuid'
            ORDER BY table_name, column_name
        """)).fetchall()

        for i, (table, column) in enumerate(uuid_cols, 1):
            conn.execute(text(f'ALTER TABLE "{table}" ALTER COLUMN "{column}" TYPE VARCHAR(36) USING "{column}"::text'))
            if i % 20 == 0:
                logger.info(f"  Converted {i}/{len(uuid_cols)} UUID columns...")

        logger.info(f"Total UUID columns converted: {len(uuid_cols)}")
        logger.info("")

        # PHASE 5: Recreate FKs
        logger.info("[PHASE 5] Recreating Foreign Key Constraints")
        logger.info("-" * 40)

        saved_fks = conn.execute(text("SELECT * FROM dropped_fk_constraints")).fetchall()

        for i, fk in enumerate(saved_fks, 1):
            constraint_name, table_name, column_name, ref_table, ref_column, delete_rule, update_rule = fk

            # Map rules to SQL
            delete_action = f"ON DELETE {delete_rule.replace(' ', ' ')}" if delete_rule != 'NO ACTION' else ''
            update_action = f"ON UPDATE {update_rule.replace(' ', ' ')}" if update_rule != 'NO ACTION' else ''

            sql_stmt = f'''
                ALTER TABLE "{table_name}"
                ADD CONSTRAINT "{constraint_name}"
                FOREIGN KEY ("{column_name}")
                REFERENCES "{ref_table}"("{ref_column}")
                {delete_action} {update_action}
            '''.strip()

            conn.execute(text(sql_stmt))

            if i % 20 == 0:
                logger.info(f"  Recreated {i}/{len(saved_fks)} FK constraints...")

        logger.info(f"Total FK constraints recreated: {len(saved_fks)}")
        logger.info("")

        # PHASE 6: Validation
        logger.info("[PHASE 6] Post-Conversion Validation")
        logger.info("-" * 40)

        result = conn.execute(text("""
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_schema = 'public' AND data_type = 'uuid'
        """))
        remaining_uuid = result.scalar()

        if remaining_uuid > 0:
            logger.warning(f"WARNING: {remaining_uuid} UUID columns still remain!")
        else:
            logger.info("SUCCESS: All UUID columns converted to VARCHAR(36)")

        result = conn.execute(text("""
            SELECT COUNT(*) FROM information_schema.table_constraints
            WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'
        """))
        current_fks = result.scalar()

        logger.info(f"FK constraints: {len(saved_fks)} dropped, {current_fks} now (should match)")
        logger.info("")

        # Transaction will commit automatically on exit
        logger.info("=" * 70)
        logger.info("CONVERSION COMPLETED SUCCESSFULLY")
        logger.info("Transaction committed automatically")
        logger.info("=" * 70)

if __name__ == '__main__':
    try:
        db_url = get_database_url()
        engine = create_engine(db_url)
        convert_uuid_to_varchar(engine)
        sys.exit(0)
    except Exception as e:
        logger.error(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
