# Migration Fix - Community Follows Foreign Key Type Mismatch
**Date**: 2025-11-14  
**Issue**: Deployment failure due to foreign key type mismatch

---

## Problem

The migration `774225e563ca` was failing during deployment with:

```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DatatypeMismatch) 
foreign key constraint "community_follows_follower_user_id_fkey" cannot be implemented
DETAIL: Key columns "follower_user_id" and "id" are of incompatible types: 
character varying and uuid.
```

**Root Cause**: 
- The migration was creating `community_follows` table with `VARCHAR(36)` for `follower_user_id` and `following_user_id`
- But `users.id` in the database is `UUID` type
- PostgreSQL cannot create foreign keys between incompatible types

---

## Solution

Updated the migration to:
1. Check the actual type of `users.id` AFTER the conversion attempt
2. Use the matching type (`UUID` or `VARCHAR(36)`) for all user foreign key columns
3. Apply the fix to all community tables that reference `users.id`:
   - `community_follows` (follower_user_id, following_user_id)
   - `community_moderation_actions` (moderator_user_id)
   - `community_posts` (author_user_id)
   - `community_reactions` (user_id)
   - `community_comments` (author_user_id)

---

## Changes Made

**File**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

1. Added type detection after conversion attempt:
```python
# Determine user_id type AFTER potential conversion
bind = op.get_bind()
user_id_type = postgresql.UUID(as_uuid=False)  # Default to UUID for PostgreSQL
if bind.dialect.name == 'postgresql':
    # Check actual type of users.id AFTER conversion
    result = bind.execute(sa.text("""
        SELECT t.typname 
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_type t ON a.atttypid = t.oid
        WHERE c.relname = 'users' 
        AND a.attname = 'id'
        AND a.attnum > 0
        AND NOT a.attisdropped
    """))
    type_name = result.scalar()
    if type_name and (type_name == 'varchar' or type_name == 'text'):
        user_id_type = sa.String(length=36)
    # If UUID or null, use UUID type (matches GUID model definition)
```

2. Updated all user foreign key columns to use `user_id_type`:
   - `community_follows.follower_user_id`
   - `community_follows.following_user_id`
   - `community_moderation_actions.moderator_user_id`
   - `community_posts.author_user_id`
   - `community_reactions.user_id`
   - `community_comments.author_user_id`

---

## Verification

The migration will now:
- ✅ Detect the actual type of `users.id` after conversion
- ✅ Use matching type for all foreign key columns
- ✅ Work whether `users.id` is UUID or VARCHAR(36)
- ✅ Match the model definition (GUID type maps to UUID in PostgreSQL)

---

## Status

✅ **FIXED** - Migration updated and ready for deployment

---

**Fixed**: 2025-11-14  
**Next Action**: Deploy and verify migration runs successfully

