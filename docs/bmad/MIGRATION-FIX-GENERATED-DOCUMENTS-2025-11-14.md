# Migration Fix - generated_documents.id Type Conversion
**Date**: 2025-11-14  
**Issue**: Foreign key type mismatch - `generated_documents.id` is UUID but FK columns are VARCHAR(36)

---

## Problem

After fixing `users.id` and `organizations.id` conversion, a new error appeared:

```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DatatypeMismatch) 
foreign key constraint "document_ai_suggestions_document_id_fkey" cannot be implemented
DETAIL: Key columns "document_id" and "id" are of incompatible types: 
character varying and uuid.
```

**Root Cause**: 
- `generated_documents.id` in the database is `UUID` type (created in migration `b354d12d1e7d`)
- Migration creates `document_id` columns as `VARCHAR(36)`
- PostgreSQL cannot create foreign keys between incompatible types

---

## Solution

Added conversion for `generated_documents.id` from UUID to VARCHAR(36), following the same pattern as `users.id` and `organizations.id` conversion:

1. **Check** if `generated_documents.id` is UUID
2. **Drop** all FK constraints that reference `generated_documents.id`
3. **Convert** all FK columns from UUID to VARCHAR(36)
4. **Convert** `generated_documents.id` itself from UUID to VARCHAR(36)
5. **Convert** other UUID columns in `generated_documents` (template_id, organization_id, generated_by_user_id)

---

## Changes Made

**File**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

Added Step 5 in the conversion block (after organizations.id conversion):

```sql
-- Step 5: Convert generated_documents.id from UUID to VARCHAR(36) if needed
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generated_documents') THEN
    SELECT data_type INTO col_type
    FROM information_schema.columns
    WHERE table_name = 'generated_documents' AND column_name = 'id';
    
    IF col_type = 'uuid' THEN
        -- Drop all FK constraints that reference generated_documents.id
        -- Convert all FK columns to VARCHAR(36)
        -- Convert generated_documents.id itself to VARCHAR(36)
        -- Convert other UUID columns (template_id, organization_id, generated_by_user_id)
    END IF;
END IF;
```

---

## Tables Affected

All tables with `document_id` foreign keys referencing `generated_documents.id`:
- ✅ `document_ai_suggestions` (document_id → generated_documents.id)
- ✅ `document_versions` (document_id → generated_documents.id)
- ✅ `document_share_links` (document_id → generated_documents.id) - if it references generated_documents

---

## Migration Flow

1. **Convert users.id**: UUID → VARCHAR(36) (if needed)
2. **Convert organizations.id**: UUID → VARCHAR(36) (if needed)
3. **Convert document_templates.id**: UUID → VARCHAR(36) (if needed)
4. **Convert generated_documents.id**: UUID → VARCHAR(36) (if needed) ← **NEW**
5. **Create new tables**: All with VARCHAR(36) foreign keys

---

## Status

✅ **FIXED** - `generated_documents.id` conversion added to migration

**Next Action**: Deploy and verify migration runs successfully

---

**Fixed**: 2025-11-14  
**File**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

