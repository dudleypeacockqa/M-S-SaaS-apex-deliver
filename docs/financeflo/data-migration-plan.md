# FinanceFlo Data Migration Plan (2025-11-22)

This note covers how to migrate tenant data from the legacy `100daysandbeyond` naming to FinanceFlo without losing existing subscriptions or documents.

## 1. Pre-Requisites
- **Back up the production database** via Render or `pg_dump` before any updates.
- Ensure backend deployments are running with the FinanceFlo Clerk/Stripe keys (see `backend-auth-alignment.md`).
- Pause webhook/event consumers so duplicate updates are not emitted while emails/slugs change.

## 2. Automated Migration Script
- Script: `backend/scripts/migrate_financeflo_tenant.py`
- Behavior:
  - Renames any organization with slug `100daysandbeyond` to `financeflo` and updates the name to “FinanceFlo”.
  - Rewrites user emails ending with `@100daysandbeyond.com` to `@financeflo.ai` so marketing automation sees the new domain.
- Usage:
  ```bash
  cd backend
  python scripts/migrate_financeflo_tenant.py
  ```
- The script logs counts of affected organizations and users; if nothing matches it will roll back automatically.

## 3. Additional Manual Updates
- **Files / Documents:** verify any S3/R2 keys under `100days/` folders; rename if URLs are user-facing (mainly marketing assets).
- **Stripe metadata:** confirm plan descriptions or billing statements referencing “100 Days & Beyond” are updated in the Stripe dashboard.
- **Master Admin Portal records:** If campaigns or collateral reference the old brand, update via Prisma admin UI or follow-up SQL.

## 4. Verification Checklist
1. Query `organizations` table – confirm only `financeflo` slug remains.
2. Confirm key user accounts/auth admins now use `@financeflo.ai` emails (Clerk should sync automatically after next sign-in).
3. Run smoke tests (auth, billing, document upload) to ensure no tenant ID mismatches.
4. Update `docs/tests/` with a short verification log once staging+production runs succeed.

This completes the “Data Migration” milestone in the FinanceFlo merge plan. Further branding changes happen in the frontend tasks.

