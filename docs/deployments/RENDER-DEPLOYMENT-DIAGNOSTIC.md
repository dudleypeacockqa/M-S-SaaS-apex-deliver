# Render Deployment Diagnostic

## Current Status (2025-11-13 08:18 UTC)

All recent deployments are failing during the migration phase.

## Error Pattern

Based on the error message from deploy `dep-d4ap008dl3ps73epkgbg`:

```
foreign key constraint "document_questions_document_id_fkey" cannot be implemented
DETAIL: Key columns "document_id" and "id" are of incompatible types: character varying and uuid.
```

## Root Cause

The production database on Render has `documents.id` as **UUID type**, but our local codebase and new migrations expect **VARCHAR(36)**.

This mismatch occurred because:
1. Production database was created with an earlier schema version that used UUID
2. Local development migrated to VARCHAR(36) at some point
3. New migrations (f867c7e3d51c, b354d12d1e7d, 8f6162b4dd13) all assume VARCHAR(36)

## Attempted Solutions

### Attempt 1: Direct UUID to VARCHAR Conversion (0dd41274)
- Created migration ef1234567890 to convert documents.id from UUID to VARCHAR(36)
- Updated migration chain: 86d427f030f2 → ef1234567890 → f867c7e3d51c
- **Result**: Failed - likely hit constraint or dependency issues

### Attempt 2: Improved Error Handling (96ef8ab4)
- Enhanced migration with dynamic constraint discovery
- Added try/except blocks for graceful handling
- Checks table existence before conversion
- **Result**: Still failing

## Next Steps

### Option A: Manual Database Fix (Recommended)
Connect to Render PostgreSQL database directly and:
1. Check current documents table schema
2. Manually convert UUID columns to VARCHAR(36)
3. Update all foreign key constraints
4. Re-run migrations

### Option B: Revert to UUID Everywhere
Update all models and migrations to use UUID instead of VARCHAR(36):
- Modify document.py, document_generation.py models
- Update all three failing migrations
- This aligns with production but diverges from current local schema

### Option C: Fresh Migration Reset
If production has no critical data:
1. Drop all tables in production
2. Re-run all migrations from scratch
3. This ensures clean alignment

## Commands to Diagnose

```bash
# Connect to Render database (if possible)
psql $DATABASE_URL

# Check documents table schema
\d documents

# Check data type of ID column
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'documents' AND column_name = 'id';

# List all foreign keys referencing documents
SELECT
  tc.table_name, kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'documents';
```

## Recommended Action

**Manual intervention required**. The automated migration approach is hitting unknown constraints or schema state in production. Need to:

1. Access Render database console
2. Inspect actual schema state
3. Either manually run conversion SQL or update migrations to match production
4. Test on a staging database first if available
