# Backend Operations

## Master Admin Schema Setup

1. Ensure DATABASE_URL is set in the .env file for the target Postgres instance.
2. Activate the bundled virtual environment (backend\venv\Scripts\activate on PowerShell or source backend/venv/bin/activate on bash).
3. Apply migrations, including the Master Admin tables, with: alembic upgrade head (run from backend/).
4. Seed demo data for activities, pipeline, campaigns, content, and collateral with: python scripts/seed_master_admin.py.
5. Verify the seed by inspecting the admin_% tables or loading the Master Admin UI.

The seed script creates a demo admin user (11111111-1111-1111-1111-111111111111), weekly goals, activity history, meeting templates for each meeting type, sample prospects and deals, campaign templates with recipients, content assets, collateral, and a lead capture record. Re-running the script is idempotent; existing rows are reused.

For a clean reseed, truncate the relevant admin_% tables before running the script again.

## Digital Growth Equity Tenant Seed

Use the dedicated script to provision the "Digital Growth Equity" organization + admin user for tenant-level testing:

1. Export `DATABASE_URL` for the target Postgres instance (local, staging, Render, etc.).
2. Optionally override any `DIGITAL_GROWTH_EQUITY_*` env vars (org name, tier, admin email) if you need non-default values.
3. Run the seeder:

   ```bash
   cd backend
   python scripts/seed_digital_growth_equity.py
   ```

The script calls `ensure_tenant_admin`, so it is idempotent—rerunning safely updates the organization metadata and Dudley’s admin account without duplicating data.

**Reminder:** run `python -m alembic upgrade head` against the same `DATABASE_URL` before seeding so the `organizations`/`users` tables exist (requires Postgres or another DB with UUID support).

# Pre-Deploy Command configured: alembic upgrade head
# Pre-Deploy Command corrected: cd backend && alembic upgrade head
# All fixes applied - ready for deployment
