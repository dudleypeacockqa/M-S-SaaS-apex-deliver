# Manual Table Creation Guide - November 16, 2025

## Purpose
Create missing module tables in Render production database to prevent migration `774225e563ca` from failing.

## Background
Migration `774225e563ca_add_document_ai_suggestions_and_version_.py` attempts to alter columns on tables that may not exist in production (optional module tables). Even with defensive guards, the safest approach is to create these tables upfront.

---

## Execution Steps

### Step 1: Access Render Database

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your PostgreSQL database service
3. Click the **"Shell"** tab in the top navigation
4. Wait for the shell to connect

### Step 2: Verify Connection

Run this command to confirm you're connected:
```sql
SELECT current_database(), current_user;
```

Expected output: Shows your database name and user.

### Step 3: Execute Table Creation Script

1. Open the file: [`2025-11-16-manual-table-creation.sql`](2025-11-16-manual-table-creation.sql)
2. Copy the **entire file contents** (Ctrl+A, Ctrl+C)
3. Paste into the Render database shell
4. Press Enter to execute

### Step 4: Verify Success

You should see output like:
```
BEGIN
CREATE TYPE
CREATE TABLE
CREATE INDEX
...
NOTICE: ✅ SUCCESS: Created 13 tables for Community, Events, and Document modules
COMMIT

 table_name                    | exists
-------------------------------+--------
 community_follows             | t
 community_moderation_actions  | t
 community_posts               | t
 community_reactions           | t
 community_comments            | t
 events                        | t
 event_analytics               | t
 event_sessions                | t
 event_tickets                 | t
 event_registrations           | t
 document_ai_suggestions       | t
 document_versions             | t
 document_share_links          | t
(13 rows)
```

All `exists` values should be `t` (true).

---

## What This Script Does

### Creates 13 Tables in 3 Modules

#### 1. Community Module (5 tables)
- `community_follows` - User following relationships
- `community_moderation_actions` - Moderation activity log
- `community_posts` - Community discussion posts
- `community_reactions` - Reactions to posts/comments
- `community_comments` - Comments on posts

#### 2. Events Module (5 tables)
- `events` - Event listings
- `event_analytics` - Event metrics and reporting
- `event_sessions` - Event session schedule
- `event_tickets` - Ticket types and pricing
- `event_registrations` - Registration tracking

#### 3. Document Module (3 tables)
- `document_ai_suggestions` - AI-generated document improvements
- `document_versions` - Document version history
- `document_share_links` - Secure document sharing

### Creates 10 ENUM Types
- `targettype` - Target types for reactions/moderation
- `moderationactiontype` - Moderation action types
- `postcategory` - Post categories
- `poststatus` - Post publication status
- `reactiontype` - Reaction types
- `eventtype` - Event types
- `eventstatus` - Event status
- `ticketstatus` - Ticket availability status
- `registrationstatus` - Registration status
- `suggestionstatus` - AI suggestion status

### Creates Indexes
- Primary keys on all tables
- Foreign key indexes for performance
- Composite indexes for common queries
- Unique indexes where appropriate

---

## Safety Features

✅ **Transaction-wrapped**: All changes are atomic (BEGIN/COMMIT)
✅ **Idempotent**: Uses `IF NOT EXISTS` - safe to run multiple times
✅ **No data modification**: Only creates schema, doesn't touch existing data
✅ **Verification built-in**: Automatically checks all tables were created
✅ **Foreign key constraints**: Links to `organizations` table for multi-tenancy

---

## Troubleshooting

### Error: "relation 'organizations' does not exist"
**Cause**: Base organizations table is missing
**Solution**: Run core application migrations first

### Error: "permission denied"
**Cause**: Insufficient database permissions
**Solution**: Contact Render support or verify you're using admin credentials

### Error: "current transaction is aborted"
**Cause**: Previous error in shell session
**Solution**: Close shell, reconnect, and try again

### Success but tables still missing
**Cause**: Script ran but COMMIT didn't execute
**Solution**: Verify you see "COMMIT" in output, run verification query

---

## After Execution

### Immediate Next Steps

1. **Verify all tables exist** - Run the verification query at the end of the script
2. **Check table structure** - `\d community_posts` to inspect a sample table
3. **Redeploy backend** - Trigger Render redeploy (or wait for automatic deployment)
4. **Monitor migration** - Check Render logs to confirm migration `774225e563ca` succeeds

### Expected Migration Behavior

After creating these tables, migration `774225e563ca` will:
- ✅ Find all tables exist
- ✅ Safely alter columns (operations succeed because tables exist)
- ✅ Complete successfully
- ✅ Update `alembic_version` to `774225e563ca`

---

## Rollback Plan

If you need to undo this (unlikely):

```sql
BEGIN;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS document_share_links CASCADE;
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS document_ai_suggestions CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS event_tickets CASCADE;
DROP TABLE IF EXISTS event_sessions CASCADE;
DROP TABLE IF EXISTS event_analytics CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_reactions CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS community_moderation_actions CASCADE;
DROP TABLE IF EXISTS community_follows CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS suggestionstatus CASCADE;
DROP TYPE IF EXISTS registrationstatus CASCADE;
DROP TYPE IF EXISTS ticketstatus CASCADE;
DROP TYPE IF EXISTS eventstatus CASCADE;
DROP TYPE IF EXISTS eventtype CASCADE;
DROP TYPE IF EXISTS reactiontype CASCADE;
DROP TYPE IF EXISTS poststatus CASCADE;
DROP TYPE IF EXISTS postcategory CASCADE;
DROP TYPE IF EXISTS moderationactiontype CASCADE;
DROP TYPE IF EXISTS targettype CASCADE;

COMMIT;
```

**WARNING**: Only use rollback if absolutely necessary. This will delete all data in these tables.

---

## Related Documentation

- **Migration File**: [`backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`](../../backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py)
- **Previous Attempt**: [`2025-11-14-render-table-setup-guide.md`](2025-11-14-render-table-setup-guide.md)
- **Deployment Summary**: [`2025-11-14-deployment-summary-session2.md`](2025-11-14-deployment-summary-session2.md)

---

**Script Location**: `docs/deployments/2025-11-16-manual-table-creation.sql`
**Execution Date**: 2025-11-16
**Status**: ⏳ Ready for execution
**Next Action**: Execute SQL script in Render Shell
