# UUID Migration Attempt Summary - 2025-11-13

## Objective

Fix Render deployment failures caused by database schema type mismatches between local development (VARCHAR(36)) and production (UUID).

## Actions Taken

### 1. Initial Analysis
- Identified root cause: Production database has `documents.id` as UUID
- Local models and new migrations expected VARCHAR(36)
- Error: `foreign key constraint cannot be implemented - incompatible types`

### 2. Strategy Change: VARCHAR → UUID Conversion (FAILED)
**Commits**: 0dd41274, 96ef8ab4

Created migration `ef1234567890` to convert production UUID columns to VARCHAR(36):
- Dynamic constraint discovery
- Tried to handle all foreign key relationships
- **Result**: Deployment failed - likely hit unknown schema state or constraint issues

### 3. Strategy Change: Align to UUID (Current)
**Commit**: 931faf97

Reversed approach - updated ALL models and migrations to use UUID to match production:

#### Models Updated
- `backend/app/models/document.py`:
  - Folder: All UUID columns (id, deal_id, parent_folder_id, organization_id, created_by)
  - Document: All UUID columns (id, deal_id, folder_id, organization_id, uploaded_by, parent_document_id)
  - DocumentShareLink: All UUID columns
  - DocumentQuestion: All UUID columns

- `backend/app/models/document_generation.py`:
  - DocumentTemplate: All UUID columns
  - GeneratedDocument: All UUID columns
  - DocumentAISuggestion: All UUID columns
  - DocumentVersion: All UUID columns

#### Migrations Updated
- `f867c7e3d51c_add_document_questions.py`: All columns changed to `postgresql.UUID(as_uuid=True)`
- `b354d12d1e7d_add_document_generation_tables.py`: document_templates and generated_documents use UUID
- `8f6162b4dd13_add_document_ai_suggestions_and_version_.py`: All new tables use UUID

#### Migration Chain
Removed ef1234567890 and restored original chain:
```
86d427f030f2 → f867c7e3d51c → b354d12d1e7d → 8f6162b4dd13
```

**Result**: Deployment still failed at 08:29:32 UTC

## Current Status

**Deployment Status**: ❌ FAILED (deploy dep-d4apd7fdiees73ctgg8g)

## Possible Remaining Issues

Without access to Render logs, potential issues could be:

1. **Partial Schema State**: Production database may have SOME tables with UUID and others with VARCHAR
2. **Existing Data**: Some tables may have existing data that can't be migrated
3. **Other Dependencies**: Referenced tables (users, organizations, deals, folders) may still be VARCHAR
4. **Migration Order**: Production may not be at revision 86d427f030f2

## Required Next Steps

### Option 1: Direct Database Access (RECOMMENDED)
1. Log into Render PostgreSQL console
2. Run diagnostic queries:
   ```sql
   -- Check all table ID types
   SELECT table_name, column_name, data_type, udt_name
   FROM information_schema.columns
   WHERE column_name = 'id'
   AND table_schema = 'public'
   ORDER BY table_name;

   -- Check current migration revision
   SELECT * FROM alembic_version;

   -- Check foreign key constraints
   SELECT
     tc.table_name,
     kcu.column_name,
     ccu.table_name AS foreign_table,
     ccu.column_name AS foreign_column,
     cols.data_type AS column_type
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   JOIN information_schema.columns AS cols
     ON cols.table_name = kcu.table_name AND cols.column_name = kcu.column_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
   ORDER BY tc.table_name;
   ```

3. Based on results, either:
   - Manually run conversion SQL if mostly UUID
   - Manually run reverse conversion if mostly VARCHAR
   - Drop and recreate schema if no critical data

### Option 2: Fresh Migration
If production has no critical data:
```bash
# In Render PostgreSQL console
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO ma_saas_user;
GRANT ALL ON SCHEMA public TO public;

# Then redeploy - migrations will run from scratch
```

### Option 3: Hybrid Approach
Create a smart migration that:
1. Detects current type of each table
2. Converts only what needs converting
3. Handles both UUID→VARCHAR and VARCHAR→UUID scenarios

## Files Changed

- backend/app/models/document.py
- backend/app/models/document_generation.py
- backend/alembic/versions/f867c7e3d51c_add_document_questions.py
- backend/alembic/versions/b354d12d1e7d_add_document_generation_tables.py
- backend/alembic/versions/8f6162b4dd13_add_document_ai_suggestions_and_version_.py
- Removed: backend/alembic/versions/ef1234567890_convert_documents_id_uuid_to_varchar36.py

## Deployment History

| Deploy ID | Commit | Status | Strategy |
|-----------|--------|--------|----------|
| dep-d4ap008dl3ps73epkgbg | 4cdcac4b | update_failed | Original changes |
| dep-d4ap5vmmcj7s73dadtr0 | 0dd41274 | update_failed | UUID→VARCHAR conversion |
| dep-d4ap768dl3ps73eplumg | 96ef8ab4 | update_failed | Improved conversion |
| dep-d4apd7fdiees73ctgg8g | 931faf97 | update_failed | Full UUID alignment |

## Recommendation

**Manual database inspection is required**. The automated migration approach cannot succeed without understanding the exact state of the production schema. Access Render's database console and run the diagnostic queries above to determine the next course of action.
