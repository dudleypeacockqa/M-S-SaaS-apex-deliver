# ApexDeliver / CapLiquify – 100% Completion Plan

_Last updated: 2025-11-12T00:00:00Z_

## Goal
Achieve a fully operational platform for both tenant (CapLiquify) and master business admin (ApexDeliver) personas, with production data integrity restored, all automated tests passing, observability and security controls in place, and deployments verified.

## Guiding Principles
1. **Security first** – Rotate exposed credentials and unblock compliance tasks before shifting traffic.
2. **Data integrity** – Fix the production database schema before feature work to avoid cascading failures.
3. **TDD discipline** – Maintain/raise backend ≥80% coverage and frontend ≥85%, expanding tests as fixes land.
4. **Environment parity** – Keep local, staging, and production configs aligned (regions, feature flags, secrets).
5. **Incremental verification** – Gate each workstream with smoke/regression evidence before progressing.

## Workstreams

### 1. Security & Credential Rotation (P0)
- Rotate Render API key, production DB password, and test DB password (`docs/NEXT_STEPS_FOR_USER.md`).
- Update secrets across Render services, GitHub Actions, local `.env` files, and automation scripts.
- Validate no plaintext secrets remain in repo or transcripts; document in `docs/security/CREDENTIAL_ROTATION_2025-11.md`.
- Success criteria: Credential inventory updated, audit log filed, smoke verifications still pass.

### 2. Production Database Recovery (P0)
1. **Investigation**: Capture actual migration version/tables (read-only) and log in `docs/runbooks/DB_RECOVERY_LOG.md`.
2. **Type conversion**: Execute `scripts/uuid_to_varchar_conversion.sql` during maintenance window with full backups.
3. **Alembic correction**: Set `alembic_version` to actual state, then redeploy with `cd backend && alembic upgrade head`.
4. **Verification**: Run `scripts/verify_deployment.sh`, manual SQL checks, and FastAPI smoke endpoints.
5. **Documentation**: Update `docs/DATABASE_RECOVERY_INDEX.md` + BMAD trackers with results.
- Success criteria: `users/organizations.id` are VARCHAR(36), missing tables exist, migrations at head, API CRUD works.

### 3. Backend Hardening (P0)
- Resolve remaining test failure(s) (e.g., `test_run_monte_carlo_validation`) and ensure `pytest` passes cleanly.
- Add missing `ListResponse` schemas + Ruff exclusions per `backend/SCHEMA_FIX_STATUS.md`.
- Raise coverage to ≥80% by targeting low-coverage services (QuickBooks/Sage/Xero OAuth, valuation edges).
- Configure GitHub Actions workflow running `pytest --cov=backend/app` with artifact uploads.
- Add integration test harness toggled by env secrets; document skip conditions.
- Success criteria: 0 pytest failures/skips except credential-gated ones, coverage ≥80%, CI badge green.

### 4. Frontend Stabilization (P0)
- Fix current Vitest failures (StatCard, MatchCard, Contact schema, PodcastStudio routing) and ensure `npm test` uses correct args.
- Address broader failures listed in `TODO.md` (93 tests) and rebaseline snapshots where needed.
- Implement lint job (`npm run lint`) in CI and resolve outstanding warnings/errors.
- Complete Cloudflare verification, note status in `docs/operations/FRONTEND_STATUS.md`.
- Success criteria: `npm run test` + `npm run lint` exit 0 locally and in CI; Cloudflare check marked complete.

### 5. Master Admin Enablement (P1)
- Validate backend seed data via `scripts/seed_master_admin.py` post-DB fix.
- Finish UI polish & accessibility on Activity Tracker, Prospect Pipeline, Campaigns, Content, Leads, Collateral.
- Flip `VITE_ENABLE_MASTER_ADMIN` to true in Render (post-QA) and guard with RBAC checks.
- Add end-to-end smoke covering master-admin routes (login → dashboard → CRUD happy paths).
- Success criteria: Master Admin portal accessible to authorized users, e2e smokes green, documentation updated.

### 6. Operations, Observability & Compliance (P1)
- Align Render region with Frankfurt requirement or document exception; ensure tenancy doc codified.
- Implement health/backup alerting per `STATUS.md` traffic-light items (scripts + runbooks).
- Add automated smoke tests post-deploy (backend + frontend) with reporting to `docs/deployments/`.
- Produce updated sales/demo seed data sets and marketing copy merge (ApexDeliver ↔ CapLiquify).
- Success criteria: Traffic lights in `STATUS.md` all green, smoke evidence attached to latest deployment summary.

## Timeline (aggressive)
| Week | Focus | Key Deliverables |
| --- | --- | --- |
| 0 | Security + DB recovery | Credential rotation, DB conversion, migrations @ head |
| 1 | Backend hardening | Pytest green, coverage ≥80%, CI workflow live |
| 2 | Frontend stabilization | Vitest green, linting enforced, Cloudflare cleared |
| 3 | Master Admin enablement | Feature flag on, e2e smokes, updated docs |
| 4 | Ops & compliance | Observability scripts, smoke automation, STATUS.md green |

## Dependencies & Owner Notes
- **DB access** required for Workstreams 1–2 (assign DevOps/DBA).
- **Secrets** for external integrations needed before integration tests pass.
- **CI configuration** requires GitHub repo admin rights to add workflows/secrets.
- **Cloudflare** tasks require DNS/marketing owner.

## Reporting & Artifacts
- Update `docs/bmad/BMAD_PROGRESS_TRACKER.md` and `docs/bmad/bmm-workflow-status.md` after each sprint.
- Maintain a running checklist in `docs/operations/COMPLETION_CHECKLIST.md` (create if missing).
- Summaries of each deployment go into `docs/deployments/DEPLOYMENT_LOG_2025.md` with links to smoke outputs.

## Risks & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| DB conversion fails mid-transaction | Production downtime/data loss | Full backup + runbook rollback, maintenance window |
| Credential rotation incomplete | Security exposure | Centralized inventory + validation script |
| Feature flag flipped before QA | Broken Master Admin UX | Require signed-off smoke evidence before toggling |
| Region mismatch persists | Compliance/regulatory breach | Escalate to leadership, document variance, schedule region migration |
| Test suites regress | Reduced confidence | CI gates + coverage enforcement + TDD discipline |

---

**Next Action:** Execute Workstream 1 (Security) and Workstream 2 (DB recovery) per runbooks, then proceed sequentially while keeping this plan updated.
