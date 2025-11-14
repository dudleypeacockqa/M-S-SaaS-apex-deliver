-- =============================================================================
-- RENDER DATABASE HOTFIX: Convert documents.id from UUID to VARCHAR(36)
-- =============================================================================
-- Date: 2025-11-14
-- Issue: Migration 774225e563ca fails with FK type mismatch
-- Error: document_share_links.document_id (VARCHAR) → documents.id (UUID)
-- Solution: Convert documents.id and all FKs to VARCHAR(36)
-- =============================================================================

-- STEP 0: Verify current state (run this first to understand what we're fixing)
-- =============================================================================
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND (column_name = 'id' OR column_name LIKE '%document_id%')
ORDER BY table_name, ordinal_position;

-- Expected to show:
-- documents.id = uuid (this is the problem!)
-- document_questions.document_id = uuid
-- We need these to be character varying(36)

-- =============================================================================
-- STEP 1: Drop all foreign key constraints referencing documents.id
-- =============================================================================
-- This is required before we can alter the column type

-- Drop document_questions FK
ALTER TABLE document_questions
DROP CONSTRAINT IF EXISTS document_questions_document_id_fkey CASCADE;

-- Drop document_permissions FK
ALTER TABLE document_permissions
DROP CONSTRAINT IF EXISTS document_permissions_document_id_fkey CASCADE;

-- Drop document_access_logs FK
ALTER TABLE document_access_logs
DROP CONSTRAINT IF EXISTS document_access_logs_document_id_fkey CASCADE;

-- Drop documents self-referential FK
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_parent_document_id_fkey CASCADE;

COMMIT;

-- =============================================================================
-- STEP 2: Convert all FK columns to VARCHAR(36)
-- =============================================================================
-- Convert these BEFORE converting documents.id to avoid cascade issues

-- Convert document_questions.document_id
ALTER TABLE document_questions
ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;

-- Convert document_permissions.document_id
ALTER TABLE document_permissions
ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;

-- Convert document_access_logs.document_id
ALTER TABLE document_access_logs
ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;

-- Convert documents.parent_document_id
ALTER TABLE documents
ALTER COLUMN parent_document_id TYPE VARCHAR(36) USING parent_document_id::text;

COMMIT;

-- =============================================================================
-- STEP 3: Convert documents.id to VARCHAR(36)
-- =============================================================================
-- This is the critical conversion

ALTER TABLE documents
ALTER COLUMN id TYPE VARCHAR(36) USING id::text;

COMMIT;

-- =============================================================================
-- STEP 4: Recreate all foreign key constraints
-- =============================================================================
-- Now that all columns are VARCHAR(36), we can safely recreate FKs

-- Recreate documents self-referential FK
ALTER TABLE documents
ADD CONSTRAINT documents_parent_document_id_fkey
FOREIGN KEY (parent_document_id) REFERENCES documents(id);

-- Recreate document_questions FK with CASCADE
ALTER TABLE document_questions
ADD CONSTRAINT document_questions_document_id_fkey
FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

-- Recreate document_permissions FK
ALTER TABLE document_permissions
ADD CONSTRAINT document_permissions_document_id_fkey
FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

-- Recreate document_access_logs FK
ALTER TABLE document_access_logs
ADD CONSTRAINT document_access_logs_document_id_fkey
FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

COMMIT;

-- =============================================================================
-- STEP 5: Verify conversion succeeded
-- =============================================================================
-- Run this to confirm all columns are now VARCHAR(36)

SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length as max_length
FROM information_schema.columns
WHERE table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND (column_name = 'id' OR column_name LIKE '%document_id%')
ORDER BY table_name, ordinal_position;

-- Expected result: ALL should show "character varying" with max_length = 36

-- =============================================================================
-- STEP 6: Verify foreign key constraints exist
-- =============================================================================

SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND kcu.column_name LIKE '%document_id%'
ORDER BY tc.table_name;

-- Expected: Should see all 4 FK constraints recreated

-- =============================================================================
-- SUCCESS VERIFICATION
-- =============================================================================
-- If you see:
-- ✅ All id/document_id columns are VARCHAR(36)
-- ✅ All 4 FK constraints exist
-- ✅ No errors during execution
--
-- Then you're ready to trigger Render redeploy!
-- =============================================================================

-- =============================================================================
-- ROLLBACK PLAN (if needed)
-- =============================================================================
-- If something goes wrong, you can convert back to UUID:
--
-- ALTER TABLE document_questions DROP CONSTRAINT document_questions_document_id_fkey CASCADE;
-- ALTER TABLE document_permissions DROP CONSTRAINT document_permissions_document_id_fkey CASCADE;
-- ALTER TABLE document_access_logs DROP CONSTRAINT document_access_logs_document_id_fkey CASCADE;
-- ALTER TABLE documents DROP CONSTRAINT documents_parent_document_id_fkey CASCADE;
--
-- ALTER TABLE documents ALTER COLUMN id TYPE UUID USING id::uuid;
-- ALTER TABLE documents ALTER COLUMN parent_document_id TYPE UUID USING parent_document_id::uuid;
-- ALTER TABLE document_questions ALTER COLUMN document_id TYPE UUID USING document_id::uuid;
-- ALTER TABLE document_permissions ALTER COLUMN document_id TYPE UUID USING document_id::uuid;
-- ALTER TABLE document_access_logs ALTER COLUMN document_id TYPE UUID USING document_id::uuid;
--
-- Then recreate FKs...
-- =============================================================================
