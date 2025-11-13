# Production Database Investigation Procedure

**Date**: 2025-11-13
**Purpose**: Identify true migration state before UUID→VARCHAR conversion
**Duration**: 1-2 hours

---

## Prerequisites

1. ✅ Credentials rotated (see SECURITY_CREDENTIAL_ROTATION_REQUIRED.md)
2. ✅ Read-only access confirmed
3. ✅ psql client installed: `psql --version`

---

## Investigation Steps

### Step 1: Connect to Production (Read-Only)

```bash
# Set connection string (use NEW password after rotation)
export DATABASE_URL="postgresql://ma_saas_user:<NEW_PASSWORD>@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com:5432/ma_saas_platform"

# Test connection
psql "$DATABASE_URL" -c "SELECT version();"

# Expected output:
# PostgreSQL 15.x on x86_64-pc-linux-gnu...
```

### Step 2: Check Current alembic_version

```sql
-- Connect
psql "$DATABASE_URL"

-- Query alembic_version
SELECT version_num FROM alembic_version;

-- Expected: One of these values
-- ba1a5bcdb110 (likely - before recent features)
-- dc2c0f69c1b1 (possible - if some migrations applied)
-- f867c7e3d51c (UNLIKELY - user said it failed)
```

**Record Result**:
```
Current alembic_version: ___________________
```

### Step 3: List All Tables

```sql
-- Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- Expected: 165 (per user's report)

-- List all tables (sorted)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Save output to file for analysis
\o /tmp/production_tables.txt
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
\o
\q
```

**Record Result**:
```
Total table count: ___________________
```

### Step 4: Check for Indicator Tables

These tables were added in specific migrations. Their presence tells us which migrations succeeded:

```sql
-- Check for key indicator tables
SELECT
    'folders' AS table_name,
    'd37ed4cd3013' AS migration_id,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='folders' AND table_schema='public') AS exists
UNION ALL SELECT 'pipeline_templates', 'dc2c0f69c1b1', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='pipeline_templates' AND table_schema='public')
UNION ALL SELECT 'pipeline_template_stages', 'dc2c0f69c1b1', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='pipeline_template_stages' AND table_schema='public')
UNION ALL SELECT 'rbac_audit_logs', 'c3a7b4bbf913', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='rbac_audit_logs' AND table_schema='public')
UNION ALL SELECT 'document_questions', 'f867c7e3d51c', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='document_questions' AND table_schema='public')
UNION ALL SELECT 'document_templates', 'b354d12d1e7d', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='document_templates' AND table_schema='public')
UNION ALL SELECT 'generated_documents', 'b354d12d1e7d', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='generated_documents' AND table_schema='public');
```

**Record Results**:
```
Table Name                  | Migration ID   | Exists?
----------------------------|----------------|--------
folders                     | d37ed4cd3013   | ______
pipeline_templates          | dc2c0f69c1b1   | ______
pipeline_template_stages    | dc2c0f69c1b1   | ______
rbac_audit_logs             | c3a7b4bbf913   | ______
document_questions          | f867c7e3d51c   | ______
document_templates          | b354d12d1e7d   | ______
generated_documents         | b354d12d1e7d   | ______
```

### Step 5: Verify UUID vs VARCHAR Types

```sql
-- Check users.id type
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id';

-- Expected: data_type='uuid' (problem) or 'character varying' (good)

-- Check organizations.id type
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'organizations' AND column_name = 'id';

-- Check a few FK columns
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE column_name = 'organization_id'
ORDER BY table_name
LIMIT 10;
```

**Record Results**:
```
users.id type: ___________________
organizations.id type: ___________________
Sample FK types: ___________________
```

### Step 6: Check Record Counts

```sql
-- Core tables
SELECT
    'users' AS table_name,
    COUNT(*) AS record_count
FROM users
UNION ALL SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL SELECT 'deals', COUNT(*) FROM deals
UNION ALL SELECT 'documents', COUNT(*) FROM documents;
```

**Record Results**:
```
users: __________ records
organizations: __________ records
deals: __________ records
documents: __________ records
```

### Step 7: Sample ID Format

```sql
-- Check actual ID formats (are they valid UUIDs?)
SELECT id FROM users LIMIT 5;
SELECT id FROM organizations LIMIT 5;

-- Verify UUID format (should be 36 chars with hyphens)
-- Example: 550e8400-e29b-41d4-a716-446655440000
```

**Record Results**:
```
Sample user IDs:
- ___________________
- ___________________

Sample org IDs:
- ___________________
- ___________________
```

---

## Analysis & Determination

### Based on Investigation Results

**Current Migration State**:
```
alembic_version value: ___________________

Indicator Table Analysis:
- If folders=false → Migration is BEFORE d37ed4cd3013
- If folders=true, rbac_audit_logs=false → Between d37ed4cd3013 and c3a7b4bbf913
- If rbac_audit_logs=true, pipeline_templates=false → Between c3a7b4bbf913 and dc2c0f69c1b1
- If pipeline_templates=true, document_questions=false → Between dc2c0f69c1b1 and f867c7e3d51c
- If document_questions=true → Migration attempted f867c7e3d51c (likely failed mid-way)

TRUE Migration State: ___________________
(This is what alembic_version should be set to after conversion)
```

**Type Conversion Required**:
```
users.id current type: ___________________
organizations.id current type: ___________________

Conversion needed? [ ] YES (if uuid) [ ] NO (if character varying)
```

**Data Volume**:
```
Total records to convert: ___________________
Estimated conversion time: ___________minutes
(Rule of thumb: ~10,000 records/minute)
```

---

## Decision Point

### If users.id is already VARCHAR(36):
✅ **Conversion NOT needed!** The issue must be elsewhere.
→ Investigate why migrations are failing (check Render logs, test locally)

### If users.id is UUID:
⚠️ **Conversion REQUIRED**
→ Proceed to Phase 2 (conversion script audit and execution)

---

## Next Steps After Investigation

1. **Update BMAD Progress Tracker** with findings
2. **Document true migration state** in this file
3. **Calculate downtime estimate** based on data volume
4. **Schedule maintenance window**
5. **Proceed to Phase 2** (conversion script audit)

---

## Investigation Complete Template

```markdown
## Investigation Completed

**Date**: YYYY-MM-DD HH:MM UTC
**Investigator**: [Name]
**Duration**: XX minutes

### Findings
- Current alembic_version: ___________________
- True migration state: ___________________
- users.id type: ___________________
- organizations.id type: ___________________
- Total tables: ___________________
- Total users: ___________________
- Total organizations: ___________________

### Decision
- [ ] Conversion required (users.id is UUID)
- [ ] Conversion NOT required (already VARCHAR)

### Estimated Conversion Time
- Records to convert: ___________________
- Estimated duration: ___________ minutes
- Recommended window: [Date/Time]

### Next Action
- [ ] Phase 2: Audit conversion script
- [ ] Alternative: Debug migration failures without conversion
```

---

**END OF INVESTIGATION PROCEDURE**
