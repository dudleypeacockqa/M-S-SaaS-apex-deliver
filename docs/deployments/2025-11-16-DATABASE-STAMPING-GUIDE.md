# Database Stamping Guide - Migration 774225e563ca

**Date**: 2025-11-16
**Purpose**: Bypass aborted transaction in migration 774225e563ca
**Target Version**: 774225e563ca

---

## Problem

Migration `774225e563ca` is stuck in an aborted PostgreSQL transaction and cannot update the `alembic_version` table. This prevents deployments from completing.

The error:
```
sqlalchemy.exc.InternalError: (psycopg2.errors.InFailedSqlTransaction)
current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='774225e563ca'
 WHERE alembic_version.version_num = 'b354d12d1e7d']
```

## Solution

**Manually stamp the database** to version `774225e563ca`, bypassing the failed migration's version update.

---

## Prerequisites

1. **Get DATABASE_URL** from Render Dashboard:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Navigate to: **Databases** → **ma-saas-db** (or your database name)
   - Click on **Connect** → **External Connection**
   - Copy the **External Database URL** (starts with `postgresql://`)

2. **Required tools**:
   - **Option A (Python)**: Python 3.8+ with `psycopg2` installed
   - **Option B (Bash)**: `psql` command-line tool installed

---

## Execution Methods

### Method 1: Python Script (Recommended)

**Advantages**: Cross-platform, built-in error handling, detailed output

```bash
# 1. Set DATABASE_URL
export DATABASE_URL="postgresql://ma_saas_db_user:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/ma_saas_db"

# 2. Install dependencies (if needed)
pip install psycopg2-binary

# 3. Run stamping script
python stamp_database_774225e563ca.py
```

**Expected Output**:
```
======================================================================
ALEMBIC DATABASE STAMPING TOOL
======================================================================
Target version: 774225e563ca

Connecting to: dpg-XXXXX.oregon-postgres.render.com:5432/ma_saas_db
User: ma_saas_db_user

[INFO] Establishing database connection...
[INFO] Ensuring alembic_version table exists...
[OK] alembic_version table ready
[INFO] Stamping database to version 774225e563ca...
[OK] Database stamped successfully
[INFO] Verifying current version...
[SUCCESS] ✓ Current version: 774225e563ca

======================================================================
STAMPING COMPLETE
======================================================================

Next steps:
1. Redeploy the backend service on Render
2. Alembic will now continue from version 774225e563ca
3. Subsequent migrations (if any) will run normally
```

### Method 2: Bash Script

**Advantages**: Simple, no Python required

```bash
# 1. Set DATABASE_URL
export DATABASE_URL="postgresql://ma_saas_db_user:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/ma_saas_db"

# 2. Make script executable (if needed)
chmod +x stamp_database_774225e563ca.sh

# 3. Run stamping script
bash stamp_database_774225e563ca.sh
```

### Method 3: Direct psql Commands

**Advantages**: Most direct, no scripts needed

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://ma_saas_db_user:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/ma_saas_db"

# 1. Ensure alembic_version table exists
PGSSLMODE=require psql "$DATABASE_URL" -c "CREATE TABLE IF NOT EXISTS alembic_version (
  version_num VARCHAR(32) NOT NULL PRIMARY KEY
);"

# 2. Stamp to version 774225e563ca
PGSSLMODE=require psql "$DATABASE_URL" -c "WITH up AS (
  UPDATE alembic_version
  SET version_num='774225e563ca'
  RETURNING 1
)
INSERT INTO alembic_version(version_num)
SELECT '774225e563ca'
WHERE NOT EXISTS (SELECT 1 FROM up);"

# 3. Verify
PGSSLMODE=require psql "$DATABASE_URL" -c "SELECT * FROM alembic_version;"
```

**Expected Output**:
```
 version_num
--------------
 774225e563ca
(1 row)
```

---

## Post-Stamping Steps

After successfully stamping the database:

### 1. Trigger Backend Deployment

```bash
# Using Python script
export RENDER_API_KEY="rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
python trigger_backend_deploy.py
```

**Or manually via Render Dashboard**:
- Go to [Render Dashboard](https://dashboard.render.com)
- Navigate to: **Services** → **ma-saas-backend**
- Click **Manual Deploy** → **Deploy latest commit**

### 2. Monitor Deployment

Watch the deployment logs to ensure migrations continue successfully:

```bash
# Get latest deploy ID from trigger output, then:
python get_render_deploy_logs.py <deploy-id>
```

**Or via Dashboard**:
- Dashboard → Services → ma-saas-backend → Events
- Look for "Running migrations..." logs
- Should see migrations continuing from 774225e563ca

### 3. Verify Migration Chain

After deployment completes, check the final database version:

```bash
PGSSLMODE=require psql "$DATABASE_URL" -c "SELECT * FROM alembic_version;"
```

**Expected**: Should show the latest migration in the chain (e.g., `aae3309a2a8b` or later)

---

## Safety Notes

✅ **Safe to run multiple times**: The stamping operation uses UPSERT pattern
✅ **No data loss**: Only updates the alembic_version table
✅ **Idempotent**: Can be re-executed without side effects
✅ **Autocommit mode**: Avoids transaction conflicts

⚠️ **Important**: This bypasses migration `774225e563ca` execution. Ensure all required schema objects (enum types, tables) exist before stamping. Migration `65e4b4ef883d` should have created them.

---

## Troubleshooting

### "psql: command not found"

**Solution**: Install PostgreSQL client:
- **macOS**: `brew install postgresql`
- **Ubuntu/Debian**: `sudo apt-get install postgresql-client`
- **Windows**: Use Python script instead, or install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

### "psycopg2: No module named 'psycopg2'"

**Solution**:
```bash
pip install psycopg2-binary
```

### "connection refused" or "timeout"

**Possible causes**:
1. DATABASE_URL is incorrect (check Render dashboard)
2. Database is paused (unpause in Render dashboard)
3. IP allowlist is restricting access (check database settings)

### "permission denied"

**Cause**: User doesn't have CREATE TABLE permissions

**Solution**: Ensure you're using the database owner credentials from Render

---

## Migration Chain Reference

Current state:
```
b354d12d1e7d (Production DB)
    ↓
65e4b4ef883d (Create enum types and tables) ← NEW
    ↓
774225e563ca (Add document AI suggestions) ← STAMPING TO HERE
    ↓
d47310025be2 (Convert document identifiers to UUID)
    ↓
... (more migrations)
    ↓
aae3309a2a8b (Latest)
```

After stamping, Alembic will pick up from `774225e563ca` and run subsequent migrations.

---

## Related Files

- **Stamping scripts**:
  - `stamp_database_774225e563ca.py` (Python version)
  - `stamp_database_774225e563ca.sh` (Bash version)

- **Migrations**:
  - `backend/alembic/versions/65e4b4ef883d_create_enum_types_and_tables_before_.py`
  - `backend/alembic/versions/774225e563ca_add_document_ai_suggestions_and_version_.py`

- **Documentation**:
  - `docs/deployments/2025-11-14-DEFENSIVE-MIGRATION-FIX.md`
  - `docs/deployments/2025-11-16-DEPLOYMENT-FAILURE-ANALYSIS.md`

---

## Support

If stamping fails or deployment continues to have issues:

1. Check deployment logs: `python get_render_deploy_logs.py <deploy-id>`
2. Verify database schema manually:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
3. Check migration history:
   ```bash
   cd backend && alembic history
   ```

---

**Status**: Ready for execution
**Last Updated**: 2025-11-16
**Author**: Claude Code (Anthropic)
