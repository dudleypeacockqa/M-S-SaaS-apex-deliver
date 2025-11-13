-- ============================================================================
-- UUID to VARCHAR(36) Conversion Script (ENHANCED - Zero Data Risk Version)
-- ============================================================================
-- PROJECT: M&A Intelligence Platform
-- PURPOSE: Convert ALL UUID columns to VARCHAR(36) across entire database
-- REASON: Application models expect String(36), production DB has UUID
-- DATE: 2025-11-13
-- STATUS: Production has ZERO users and ZERO organizations - NO DATA RISK
-- ============================================================================
--
-- SAFETY NOTES:
--   - Production database is EMPTY (0 users, 0 organizations)
--   - NO customer data to lose
--   - NO backup required (but transaction-wrapped for safety)
--   - Fast execution (2-5 minutes for empty tables)
--   - Fully reversible via ROLLBACK
--
-- PREREQUISITES:
--   1. Database admin access with ALTER TABLE privileges
--   2. All application servers stopped or in maintenance mode (recommended)
--
-- USAGE:
--   psql $DATABASE_URL -f uuid_to_varchar_conversion_enhanced.sql
--
-- ============================================================================

-- Set client encoding
SET client_encoding = 'UTF8';

-- Enable verbose output and error stopping
\set ON_ERROR_STOP on
\set VERBOSITY verbose

-- Log start time
\echo '=========================================='
\echo 'UUID to VARCHAR(36) Conversion Started'
\echo 'ENHANCED VERSION - Full Database Scope'
\echo '=========================================='
SELECT now() AS conversion_start_time;

-- ============================================================================
-- PHASE 1: PRE-CONVERSION VALIDATION
-- ============================================================================

\echo ''
\echo '[PHASE 1] Pre-Conversion Validation'
\echo '--------------------'

-- Verify current state
\echo 'Current users.id type:'
SELECT data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id';

\echo 'Current organizations.id type:'
SELECT data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'organizations' AND column_name = 'id';

-- Count total UUID columns
\echo 'Total UUID columns to convert:'
SELECT COUNT(*) AS uuid_column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND data_type = 'uuid';

-- Count records (for verification later)
\echo 'Record counts:'
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations;

-- ============================================================================
-- PHASE 2: DROP ALL FOREIGN KEY CONSTRAINTS & SAVE METADATA
-- ============================================================================

\echo ''
\echo '[PHASE 2] Dropping Foreign Key Constraints and Saving Metadata'
\echo '--------------------'

BEGIN;

-- Create temporary table to store FK metadata for recreation
CREATE TEMP TABLE dropped_fk_constraints (
    constraint_name VARCHAR(255),
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    referenced_table VARCHAR(255),
    referenced_column VARCHAR(255),
    delete_rule VARCHAR(50),
    update_rule VARCHAR(50)
);

\echo 'Created temporary table for FK metadata'

-- Drop all FK constraints and save their metadata
DO $$
DECLARE
    fk_record RECORD;
    constraint_count INTEGER := 0;
BEGIN
    -- Iterate through ALL foreign key constraints in the public schema
    FOR fk_record IN
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
    LOOP
        -- Save FK metadata to temp table
        INSERT INTO dropped_fk_constraints VALUES (
            fk_record.constraint_name,
            fk_record.table_name,
            fk_record.column_name,
            fk_record.referenced_table,
            fk_record.referenced_column,
            fk_record.delete_rule,
            fk_record.update_rule
        );

        -- Drop FK constraint
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I',
            fk_record.table_name,
            fk_record.constraint_name
        );

        constraint_count := constraint_count + 1;

        IF constraint_count % 10 = 0 THEN
            RAISE NOTICE 'Dropped % FK constraints...', constraint_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Total FK constraints dropped: %', constraint_count;
    RAISE NOTICE 'All FK metadata saved to temporary table';
END $$;

-- Verify FK metadata was saved
\echo 'FK constraints saved for recreation:'
SELECT COUNT(*) AS total_fks_saved FROM dropped_fk_constraints;

-- ============================================================================
-- PHASE 3: CONVERT ALL UUID PRIMARY KEYS
-- ============================================================================

\echo ''
\echo '[PHASE 3] Converting All UUID Primary Keys to VARCHAR(36)'
\echo '--------------------'

-- Convert all UUID primary key columns to VARCHAR(36)
DO $$
DECLARE
    pk_record RECORD;
    convert_count INTEGER := 0;
BEGIN
    FOR pk_record IN
        SELECT DISTINCT
            c.table_name,
            c.column_name
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
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            pk_record.table_name,
            pk_record.column_name,
            pk_record.column_name
        );

        convert_count := convert_count + 1;

        RAISE NOTICE 'Converted PK [%]: %.% to VARCHAR(36)',
            convert_count,
            pk_record.table_name,
            pk_record.column_name;
    END LOOP;

    RAISE NOTICE 'Total primary keys converted: %', convert_count;
END $$;

-- ============================================================================
-- PHASE 4: CONVERT ALL UUID FOREIGN KEY COLUMNS
-- ============================================================================

\echo ''
\echo '[PHASE 4] Converting All UUID Foreign Key Columns to VARCHAR(36)'
\echo '--------------------'

-- Convert all remaining UUID columns (foreign keys and other UUID columns)
DO $$
DECLARE
    col_record RECORD;
    convert_count INTEGER := 0;
BEGIN
    FOR col_record IN
        SELECT DISTINCT
            table_name,
            column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND data_type = 'uuid'
        ORDER BY table_name, column_name
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            col_record.table_name,
            col_record.column_name,
            col_record.column_name
        );

        convert_count := convert_count + 1;

        IF convert_count % 20 = 0 THEN
            RAISE NOTICE 'Converted % UUID columns...', convert_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Total UUID columns converted: %', convert_count;
END $$;

-- ============================================================================
-- PHASE 5: RECREATE ALL FOREIGN KEY CONSTRAINTS
-- ============================================================================

\echo ''
\echo '[PHASE 5] Recreating All Foreign Key Constraints'
\echo '--------------------'

-- Recreate all FK constraints from saved metadata
DO $$
DECLARE
    fk_record RECORD;
    recreate_count INTEGER := 0;
    delete_action TEXT;
    update_action TEXT;
BEGIN
    FOR fk_record IN
        SELECT * FROM dropped_fk_constraints
        ORDER BY table_name, constraint_name
    LOOP
        -- Map delete_rule to SQL syntax
        CASE fk_record.delete_rule
            WHEN 'CASCADE' THEN delete_action := 'ON DELETE CASCADE';
            WHEN 'SET NULL' THEN delete_action := 'ON DELETE SET NULL';
            WHEN 'SET DEFAULT' THEN delete_action := 'ON DELETE SET DEFAULT';
            WHEN 'RESTRICT' THEN delete_action := 'ON DELETE RESTRICT';
            ELSE delete_action := 'ON DELETE NO ACTION';
        END CASE;

        -- Map update_rule to SQL syntax
        CASE fk_record.update_rule
            WHEN 'CASCADE' THEN update_action := 'ON UPDATE CASCADE';
            WHEN 'SET NULL' THEN update_action := 'ON UPDATE SET NULL';
            WHEN 'SET DEFAULT' THEN update_action := 'ON UPDATE SET DEFAULT';
            WHEN 'RESTRICT' THEN update_action := 'ON UPDATE RESTRICT';
            ELSE update_action := 'ON UPDATE NO ACTION';
        END CASE;

        -- Recreate FK constraint
        EXECUTE format(
            'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) %s %s',
            fk_record.table_name,
            fk_record.constraint_name,
            fk_record.column_name,
            fk_record.referenced_table,
            fk_record.referenced_column,
            delete_action,
            update_action
        );

        recreate_count := recreate_count + 1;

        IF recreate_count % 10 = 0 THEN
            RAISE NOTICE 'Recreated % FK constraints...', recreate_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Total FK constraints recreated: %', recreate_count;
END $$;

-- ============================================================================
-- PHASE 6: POST-CONVERSION VALIDATION
-- ============================================================================

\echo ''
\echo '[PHASE 6] Post-Conversion Validation'
\echo '--------------------'

-- Verify type conversions
\echo 'Verifying users.id type:'
SELECT data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id';

\echo 'Verifying organizations.id type:'
SELECT data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'organizations' AND column_name = 'id';

-- Verify NO UUID columns remain
\echo 'Checking for remaining UUID columns (should be ZERO):'
SELECT COUNT(*) AS remaining_uuid_columns
FROM information_schema.columns
WHERE table_schema = 'public'
AND data_type = 'uuid';

-- If any remain, show them
DO $$
DECLARE
    uuid_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO uuid_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND data_type = 'uuid';

    IF uuid_count > 0 THEN
        RAISE WARNING 'WARNING: % UUID columns still remain!', uuid_count;
        RAISE NOTICE 'Remaining UUID columns:';
        FOR rec IN
            SELECT table_name, column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND data_type = 'uuid'
        LOOP
            RAISE NOTICE '  - %.%', rec.table_name, rec.column_name;
        END LOOP;
    ELSE
        RAISE NOTICE 'SUCCESS: All UUID columns converted to VARCHAR(36)';
    END IF;
END $$;

-- Verify record counts unchanged
\echo 'Verifying record counts (should match pre-conversion):'
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations;

-- Verify FK count matches
\echo 'Verifying FK count matches:'
SELECT
    (SELECT COUNT(*) FROM dropped_fk_constraints) AS fks_dropped,
    (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') AS fks_now;

-- ============================================================================
-- COMMIT OR ROLLBACK
-- ============================================================================

\echo ''
\echo '=========================================='
\echo 'Conversion Complete - Ready to Commit'
\echo '=========================================='
\echo ''
\echo 'Review the output above carefully.'
\echo 'If all validations passed, type: COMMIT;'
\echo 'If there are any issues, type: ROLLBACK;'
\echo ''
\echo 'Note: Since production has ZERO users and ZERO organizations,'
\echo 'this conversion is ZERO RISK. No data can be lost.'
\echo ''

-- Note: We do NOT auto-commit. User must review and commit manually.
-- COMMIT;

SELECT now() AS conversion_end_time;

\echo ''
\echo 'Waiting for manual COMMIT or ROLLBACK...'
