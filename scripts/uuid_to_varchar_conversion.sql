-- ============================================================================
-- UUID to VARCHAR(36) Conversion Script
-- ============================================================================
-- PROJECT: M&A Intelligence Platform
-- PURPOSE: Convert users.id and organizations.id from UUID to VARCHAR(36)
-- REASON: Application models expect String(36), production DB has UUID
-- DATE: 2025-11-10
-- ============================================================================
--
-- WARNING: This is a DESTRUCTIVE OPERATION that affects the entire database.
--          MUST have full backup before proceeding.
--          This will lock tables during conversion.
--          Run during maintenance window with no active users.
--
-- PREREQUISITES:
--   1. Full database backup exists and verified
--   2. Maintenance window scheduled (estimated 10-30 minutes)
--   3. All application servers stopped or in maintenance mode
--   4. Database admin access with ALTER TABLE privileges
--
-- USAGE:
--   psql $DATABASE_URL -f uuid_to_varchar_conversion.sql
--
-- ============================================================================

-- Set client encoding
SET client_encoding = 'UTF8';

-- Enable verbose output
\set ON_ERROR_STOP on
\set VERBOSITY verbose

-- Log start time
\echo '=========================================='
\echo 'UUID to VARCHAR(36) Conversion Started'
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

-- Count records (for verification later)
\echo 'Record counts:'
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations;

-- ============================================================================
-- PHASE 2: DROP FOREIGN KEY CONSTRAINTS
-- ============================================================================

\echo ''
\echo '[PHASE 2] Dropping Foreign Key Constraints'
\echo '--------------------'

BEGIN;

-- Drop all FK constraints referencing users.id
DO $$
DECLARE
    fk_record RECORD;
    constraint_count INTEGER := 0;
BEGIN
    FOR fk_record IN
        SELECT DISTINCT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND ccu.table_name = 'users'
        AND ccu.column_name = 'id'
    LOOP
        -- Drop FK constraint
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I',
            fk_record.table_name,
            fk_record.constraint_name
        );

        constraint_count := constraint_count + 1;

        RAISE NOTICE 'Dropped FK [%/%]: %.% references users.id',
            constraint_count,
            (SELECT COUNT(DISTINCT tc.constraint_name)
             FROM information_schema.table_constraints tc
             JOIN information_schema.constraint_column_usage ccu
                 ON ccu.constraint_name = tc.constraint_name
             WHERE tc.constraint_type = 'FOREIGN KEY'
             AND ccu.table_name = 'users'
             AND ccu.column_name = 'id'),
            fk_record.table_name,
            fk_record.constraint_name;
    END LOOP;

    RAISE NOTICE 'Total users.id FKs dropped: %', constraint_count;
END $$;

-- Drop all FK constraints referencing organizations.id
DO $$
DECLARE
    fk_record RECORD;
    constraint_count INTEGER := 0;
BEGIN
    FOR fk_record IN
        SELECT DISTINCT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND ccu.table_name = 'organizations'
        AND ccu.column_name = 'id'
    LOOP
        -- Drop FK constraint
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I',
            fk_record.table_name,
            fk_record.constraint_name
        );

        constraint_count := constraint_count + 1;

        RAISE NOTICE 'Dropped FK [%]: %.% references organizations.id',
            constraint_count,
            fk_record.table_name,
            fk_record.constraint_name;
    END LOOP;

    RAISE NOTICE 'Total organizations.id FKs dropped: %', constraint_count;
END $$;

-- ============================================================================
-- PHASE 3: CONVERT PRIMARY KEYS
-- ============================================================================

\echo ''
\echo '[PHASE 3] Converting Primary Key Columns'
\echo '--------------------'

-- Convert users.id
ALTER TABLE users
    ALTER COLUMN id TYPE VARCHAR(36) USING id::text;

\echo 'Converted users.id to VARCHAR(36)'

-- Convert organizations.id
ALTER TABLE organizations
    ALTER COLUMN id TYPE VARCHAR(36) USING id::text;

\echo 'Converted organizations.id to VARCHAR(36)'

-- ============================================================================
-- PHASE 4: CONVERT FOREIGN KEY COLUMNS
-- ============================================================================

\echo ''
\echo '[PHASE 4] Converting Foreign Key Columns'
\echo '--------------------'

-- Convert all user_id columns
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
        AND column_name IN ('user_id', 'created_by', 'updated_by', 'owner_id', 'assignee_id', 'reviewed_by', 'approved_by')
        ORDER BY table_name, column_name
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            col_record.table_name,
            col_record.column_name,
            col_record.column_name
        );

        convert_count := convert_count + 1;

        RAISE NOTICE 'Converted [%]: %.% to VARCHAR(36)',
            convert_count,
            col_record.table_name,
            col_record.column_name;
    END LOOP;

    RAISE NOTICE 'Total user FK columns converted: %', convert_count;
END $$;

-- Convert all organization_id columns
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
        AND column_name = 'organization_id'
        ORDER BY table_name
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            col_record.table_name,
            col_record.column_name,
            col_record.column_name
        );

        convert_count := convert_count + 1;

        RAISE NOTICE 'Converted [%]: %.organization_id to VARCHAR(36)',
            convert_count,
            col_record.table_name;
    END LOOP;

    RAISE NOTICE 'Total organization FK columns converted: %', convert_count;
END $$;

-- ============================================================================
-- PHASE 5: RECREATE FOREIGN KEY CONSTRAINTS
-- ============================================================================

\echo ''
\echo '[PHASE 5] Recreating Foreign Key Constraints'
\echo '--------------------'

-- Note: This section needs to be populated based on the actual FK constraints
-- that were dropped in Phase 2. The following is a template based on common patterns.

-- Example FK constraints (adjust based on actual schema):

-- Organizations
ALTER TABLE users
    ADD CONSTRAINT fk_users_organization_id
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE;

-- Deals
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deals') THEN
        EXECUTE 'ALTER TABLE deals ADD CONSTRAINT fk_deals_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE';
        EXECUTE 'ALTER TABLE deals ADD CONSTRAINT fk_deals_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL';
        RAISE NOTICE 'Recreated deals FK constraints';
    END IF;
END $$;

-- Documents
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        EXECUTE 'ALTER TABLE documents ADD CONSTRAINT fk_documents_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE';
        EXECUTE 'ALTER TABLE documents ADD CONSTRAINT fk_documents_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL';
        RAISE NOTICE 'Recreated documents FK constraints';
    END IF;
END $$;

-- Add more FK constraints based on your schema...
-- TODO: Review the FK list from Phase 2 and add all necessary constraints here

\echo 'Foreign key constraints recreated (review and add any missing constraints)'

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

-- Verify no UUID columns remain for user/org IDs
\echo 'Checking for remaining UUID columns (should be empty):'
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND data_type = 'uuid'
AND (column_name LIKE '%user%' OR column_name LIKE '%organization%')
ORDER BY table_name, column_name;

-- Verify record counts unchanged
\echo 'Verifying record counts (should match pre-conversion):'
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations;

-- Sample data validation
\echo 'Sample users.id values (should be VARCHAR formatted):'
SELECT id, email FROM users LIMIT 3;

\echo 'Sample organizations.id values (should be VARCHAR formatted):'
SELECT id, name FROM organizations LIMIT 3;

-- Check if any data was lost (all IDs should still be valid UUIDs in string format)
DO $$
DECLARE
    invalid_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_count
    FROM users
    WHERE LENGTH(id) != 36 OR id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    IF invalid_count > 0 THEN
        RAISE EXCEPTION 'Found % invalid user IDs after conversion!', invalid_count;
    ELSE
        RAISE NOTICE 'All user IDs are valid VARCHAR(36) UUIDs';
    END IF;

    SELECT COUNT(*) INTO invalid_count
    FROM organizations
    WHERE LENGTH(id) != 36 OR id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    IF invalid_count > 0 THEN
        RAISE EXCEPTION 'Found % invalid organization IDs after conversion!', invalid_count;
    ELSE
        RAISE NOTICE 'All organization IDs are valid VARCHAR(36) UUIDs';
    END IF;
END $$;

-- ============================================================================
-- COMMIT OR ROLLBACK
-- ============================================================================

\echo ''
\echo '=========================================='
\echo 'Conversion Complete - Ready to Commit'
\echo '=========================================='
\echo ''
\echo 'Review the output above carefully.'
\echo 'If everything looks correct, type: COMMIT;'
\echo 'If there are any issues, type: ROLLBACK;'
\echo ''

-- Note: We do NOT auto-commit. DBA must review and commit manually.
-- COMMIT;

SELECT now() AS conversion_end_time;

\echo ''
\echo 'Waiting for manual COMMIT or ROLLBACK...'
