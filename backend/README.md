# Backend Operations

## Master Admin Schema Setup

1. Ensure DATABASE_URL is set in the .env file for the target Postgres instance.
2. Activate the bundled virtual environment (backend\venv\Scripts\activate on PowerShell or source backend/venv/bin/activate on bash).
3. Apply migrations, including the Master Admin tables, with: alembic upgrade head (run from backend/).
4. Seed demo data for activities, pipeline, campaigns, content, and collateral with: python scripts/seed_master_admin.py.
5. Verify the seed by inspecting the admin_% tables or loading the Master Admin UI.

The seed script creates a demo admin user (11111111-1111-1111-1111-111111111111), weekly goals, activity history, meeting templates for each meeting type, sample prospects and deals, campaign templates with recipients, content assets, collateral, and a lead capture record. Re-running the script is idempotent; existing rows are reused.

For a clean reseed, truncate the relevant admin_% tables before running the script again.
