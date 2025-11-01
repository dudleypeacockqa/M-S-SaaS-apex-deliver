# Backend Operations

## Master Admin Schema Setup

1. Ensure  is present in  and points at the target Postgres instance.
2. Activate the bundled virtual environment:  (PowerShell) or  (bash).
3. Apply migrations, including the Master Admin tables:  from .
4. Seed demo data for activities, pipeline, campaigns, and collateral: .
5. Verify the seed by checking row counts for the  tables or by logging into the app.

The seed script creates a demo admin user (), weekly goals, activity history, meeting templates for each meeting type, sample prospects and deals, campaign templates, content assets, collateral, and a lead capture record. Re-running the script is idempotent; existing records are reused.

For a clean reseed, delete the  tables or truncate them before running the script again.
