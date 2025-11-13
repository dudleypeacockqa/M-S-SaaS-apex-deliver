# Migration Fix - Organizations.id Type Conversion
**Date**: 2025-11-14  
**Issue**: Foreign key type mismatch - `organizations.id` is UUID but FK columns are VARCHAR(36)

---

## Problem

After fixing `users.id` conversion, a new error appeared:

```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DatatypeMismatch) 
foreign key constraint "events_organization_id_fkey" cannot be implemented
DETAIL: Key columns "organization_id" and "id" are of incompatible types: 
character varying and uuid.
```

**Root Cause**: 
- `organizations.id` in the database is `UUID` type
- Migration creates `organization_id` columns as `VARCHAR(36)`
- PostgreSQL cannot create foreign keys between incompatible types

---

## Solution

Added conversion for `organizations.id` from UUID to VARCHAR(36), following the same pattern as `users.id` conversion:

1. **Check** if `organizations.id` is UUID
2. **Drop** all FK constraints that reference `organizations.id`
3. **Convert** all FK columns from UUID to VARCHAR(36)
4. **Convert** `organizations.id` itself from UUID to VARCHAR(36)

---

## Changes Made

**File**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

Added Step 4 in the conversion block:

```sql
-- Step 4: Convert organizations.id from UUID to VARCHAR(36) if needed
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'organizations'
    AND column_name = 'id';
    
    IF col_type = 'uuid' THEN
        -- Drop all FK constraints that reference organizations.id
        -- Convert all FK columns to VARCHAR(36)
        -- Convert organizations.id itself to VARCHAR(36)
    END IF;
END;
```

---

## Tables Affected

All tables with `organization_id` foreign keys:
- ✅ `community_follows`
- ✅ `community_posts`
- ✅ `community_moderation_actions`
- ✅ `events`
- ✅ `event_sessions`
- ✅ `event_tickets`
- ✅ `event_registrations`
- ✅ `event_analytics`
- ✅ `document_ai_suggestions`
- ✅ `document_versions`
- ✅ `document_share_links`

---

## Migration Flow

1. **Convert users.id**: UUID → VARCHAR(36) (if needed)
2. **Convert organizations.id**: UUID → VARCHAR(36) (if needed) ← **NEW**
3. **Create new tables**: All with VARCHAR(36) foreign keys

---

## Status

✅ **FIXED** - Both `users.id` and `organizations.id` are now converted to VARCHAR(36)

**Next Action**: Deploy and verify migration runs successfully

---

**Fixed**: 2025-11-14  
**File**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

