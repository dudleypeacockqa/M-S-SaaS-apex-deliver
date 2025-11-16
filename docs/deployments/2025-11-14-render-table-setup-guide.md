# Render Database Setup Guide - Missing Tables

**Date**: November 14, 2025
**Purpose**: Create all module-specific tables in Render production database to prevent future migration failures

---

## Quick Start

### Step 1: Access Render Database Shell

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your PostgreSQL database service
3. Click on **"Shell"** tab in the top navigation
4. Wait for shell to connect

### Step 2: Execute Setup Script

1. Open [`render-missing-tables-setup.sql`](render-missing-tables-setup.sql)
2. Copy the **entire file contents** (Ctrl+A, Ctrl+C)
3. Paste into Render database shell
4. Press Enter to execute

### Step 3: Verify Success

You should see:
```
BEGIN
CREATE TABLE
CREATE INDEX
...
✅ Successfully created all 34 missing tables!
COMMIT
```

**If you see any errors**, check the error message and ensure:
- The `organizations` table exists (required for foreign keys)
- You have sufficient permissions
- The database is not in read-only mode

---

## What This Script Does

### Tables Created (34 Total)

#### Pipeline Management (2 tables)
- `pipeline_templates` - Custom deal pipeline templates
- `pipeline_template_stages` - Stages within pipeline templates

#### Master Admin (16 tables)
- `admin_campaigns` - Marketing campaign tracking
- `admin_campaign_metrics` - Campaign performance metrics
- `admin_campaign_events` - Campaign event history
- `admin_integrations` - Third-party integrations
- `admin_integration_logs` - Integration activity logs
- `admin_feature_flags` - Feature toggle management
- `admin_notifications` - System notifications
- `admin_notification_recipients` - Notification delivery tracking
- `admin_audit_logs` - System audit trail
- `admin_api_keys` - API key management
- `admin_webhooks` - Webhook configurations
- `admin_webhook_deliveries` - Webhook delivery history
- `admin_scheduled_jobs` - Background job scheduling
- `admin_email_templates` - Email template library
- `admin_sms_templates` - SMS template library
- `rbac_audit_logs` - RBAC activity audit trail

#### Valuation Export (1 table)
- `valuation_export_logs` - Valuation export activity tracking

#### Deal Matching (1 table)
- `deal_matches` - AI-powered deal matching results

#### Document Generation (3 tables)
- `document_templates` - Document template library
- `generated_documents` - Generated document instances
- `document_questions` - Document generation questionnaires

#### Blog/Content (1 table)
- `blog_posts` - Blog post content

#### Community (5 tables)
- `community_members` - Community member profiles
- `community_posts` - Community discussions
- `community_comments` - Post comments
- `community_reactions` - Post reactions (likes, etc.)
- `community_member_stats` - Member activity statistics

#### Event Management (5 tables)
- `events` - Event listings
- `event_registrations` - Event registration tracking
- `event_sessions` - Event session schedule
- `event_speakers` - Event speaker profiles
- `event_sponsors` - Event sponsor information

---

## Why This Is Needed

### Problem
Alembic migration `774225e563ca_add_document_ai_suggestions_and_version_.py` attempts to alter columns on tables that don't exist in production (because optional modules aren't deployed).

### Previous Approach (Failed)
- Used safe wrapper functions with table existence checks
- PostgreSQL transaction behavior caused cascade failures
- ANY failed operation aborted entire transaction
- Subsequent queries failed with `InFailedSqlTransaction`

### Current Solution
1. **Migration uses zero pre-check guards** - Let operations fail gracefully
2. **Proactively create all tables** - This script ensures tables exist upfront
3. **Idempotent table creation** - Safe to run multiple times (`CREATE TABLE IF NOT EXISTS`)

---

## Script Safety Features

### Transaction Safety
```sql
BEGIN;
-- All CREATE TABLE statements
COMMIT;
```
All changes are atomic - either everything succeeds or nothing changes.

### Idempotent Operations
```sql
CREATE TABLE IF NOT EXISTS pipeline_templates (...);
CREATE INDEX IF NOT EXISTS ix_pipeline_templates_organization_id ...;
```
Safe to run multiple times - won't fail if tables/indexes already exist.

### Verification Logic
After creating all tables, the script verifies all 34 tables were created:
```sql
DO $
DECLARE
    missing_tables TEXT[];
BEGIN
    SELECT ARRAY_AGG(table_name)
    INTO missing_tables
    FROM (VALUES
        ('pipeline_templates'), ('pipeline_template_stages'),
        -- ... all 34 tables ...
    ) AS expected(table_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = expected.table_name
    );

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ Successfully created all 34 missing tables!';
    END IF;
END $;
```

---

## Post-Execution Verification

### Manual Check (Optional)
After running the script, verify table count:

```sql
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'pipeline_templates', 'pipeline_template_stages',
    'admin_campaigns', 'admin_campaign_metrics',
    -- ... (list continues)
);
```

Should return: **34**

### Check Specific Module Tables
```sql
-- Pipeline Module
SELECT * FROM pipeline_templates LIMIT 1;
SELECT * FROM pipeline_template_stages LIMIT 1;

-- Admin Module
SELECT * FROM admin_campaigns LIMIT 1;

-- Community Module
SELECT * FROM community_members LIMIT 1;
```

All queries should return successfully (even if empty).

---

## Next Deployment

After running this script, future deployments should succeed without migration errors because:

1. ✅ All 34 module tables now exist
2. ✅ Migration `774225e563ca` can safely alter columns (tables exist)
3. ✅ Safe wrappers will skip operations gracefully if issues arise
4. ✅ No pre-check queries to trigger transaction cascade failures

---

## Troubleshooting

### Error: "relation 'organizations' does not exist"
**Cause**: Base organizations table is missing
**Solution**: Ensure core application tables are created first

### Error: "permission denied"
**Cause**: Insufficient database permissions
**Solution**: Contact Render support or use admin credentials

### Error: "current transaction is aborted"
**Cause**: Previous error in transaction
**Solution**: Exit shell, reconnect, and try again

### Success but tables still missing
**Cause**: Script ran but COMMIT didn't execute
**Solution**: Verify you see "COMMIT" in output, check transaction status

---

## Maintenance Notes

### Adding New Module Tables
When new optional modules are added:

1. Add CREATE TABLE statements to this script
2. Update the verification query to include new tables
3. Update table count in documentation (currently 34)
4. Re-run script in Render shell

### Schema Changes
If module table schemas change:
- This script creates **base schemas only**
- Alembic migrations will handle ALTER TABLE operations
- Safe wrappers in migration ensure backward compatibility

---

**Script Location**: `docs/deployments/render-missing-tables-setup.sql`
**Related Migration**: `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`
**Success Report**: `docs/deployments/2025-11-14-FINAL-SUCCESS-REPORT.md`
