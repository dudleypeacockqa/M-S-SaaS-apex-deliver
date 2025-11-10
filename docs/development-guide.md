# Apex Deliver Capliquify – Development Guide

**Last Updated:** 2025-11-10  
**Audience:** Engineers + AI agents executing BMAD workflows on the M&A Intelligence Platform repository.

## 1. Environment Prerequisites

- **Node.js:** 18+ (22+ recommended as per README) with npm.
- **Python:** 3.11.x with `venv`.
- **Datastores:** PostgreSQL 15+, Redis 7+ (local Docker or managed).
- **CLI Tooling:** Git, Cursor (or VS Code), BMAD Method CLI (`_vendor/BMAD-METHOD`), Codex/Claude CLIs.
- **System Packages:** ffmpeg (for audio/video transforms), libsndfile (pydub), Git LFS if working with media.
- **Accounts/Keys:** Clerk (publishable + secret + webhook), Stripe, OpenAI, Anthropic, SendGrid, Cloudflare R2/S3, accounting platforms (Xero, QuickBooks, Sage, NetSuite) as needed.

## 2. Bootstrap Workflow

1. **Install BMAD Method (one-time per machine)**
   ```bash
   cd _vendor/BMAD-METHOD
   npx bmad-method install
   ```
   This compiles `.bmad/` workflows (document-project, workflow-status, etc.) and IDE manifests.

2. **Clone & Verify Status**
   ```bash
   git clone <repo>
   cd M-S-SaaS-apex-deliver
   npx bmad-method status
   ```
   Confirm workflow slate matches `docs/bmm-workflow-status.yaml`.

3. **Backend Setup**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt
   cp backend/.env.example backend/.env  # edit DATABASE_URL, Clerk, Stripe, AI keys
   cd backend && alembic upgrade head
   uvicorn app.main:app --reload
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # set VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY, Stripe keys
   npm run dev
   ```

5. **Database & Storage**
   - Local dev can start with SQLite, but integration work should use PostgreSQL 15+.
   - Redis is required for Celery, rate limiting, and replicating production conditions.
   - Optional: configure Cloudflare R2/S3 credentials in `.env` to validate document workflows.

## 3. Standard Commands

| Purpose | Command |
| --- | --- |
| Backend API dev | `cd backend && uvicorn app.main:app --reload` |
| Backend tests + coverage | `cd backend && pytest --cov=backend/app` |
| Frontend dev server | `cd frontend && npm run dev` |
| Frontend build | `npm run build` |
| Frontend tests | `npm run test` / `npm run test:coverage` |
| Smoke check (API + preview) | `scripts/run_smoke_tests.sh` |
| Render deployment verification | `scripts/verify_deployment.py` |
| Workflow status | `npx bmad-method status` |
| Launch workflow | `npx bmad-method run <workflow>` (e.g., `document-project`, `prd`, etc.) |

## 4. Testing & Quality Gates

- **Backend**
  - Tests located in `backend/tests/` and mirror services/routes (e.g., `test_valuation_service.py`, `test_subscription.py`).
  - Run `pytest --cov=backend/app`; enforce ≥90% coverage for services & models.
  - Use `pytest -k <keyword>` for focused runs; commit coverage reports to `backend/coverage.json` if updated.
- **Frontend**
  - Vitest suites colocated with components/pages (`*.test.tsx`). Run `npm run test:coverage`.
  - Target ≥85% coverage overall, ≥90% for marketing UI suites.
- **Smoke / Integration**
  - `scripts/run_smoke_tests.sh` spins API + `npm run preview` and exercises primary flows.
  - `scripts/verify_migrations.sh` ensures Alembic heads apply cleanly.
- **CI Expectations**
  - GitHub Actions should run both `pytest` and `npm run test`.
  - Perform manual audits before deployment: `render.yaml`, `prestart.sh`, and `PRODUCTION-DEPLOYMENT-CHECKLIST.md`.

## 5. Data & Migrations

- Schema changes live under `backend/alembic/versions/`.
- Always run `alembic revision --autogenerate -m "<summary>"` from `backend/`, inspect diff, and include migration with PR.
- Render executes `prestart.sh` → `alembic upgrade head` on every deployment; ensure scripts remain idempotent.
- Use `backend/scripts/check_tables.py` and `apply_master_admin_migration.py` for validation of admin-specific schema adjustments.

## 6. Scripts & Utilities

- `scripts/generate_sitemap.py` – refresh marketing sitemap (call after landing page changes).
- `scripts/import_blog_production.py` & `seed_blog_posts.py` – sync blog content into the database.
- `scripts/secure_render_database.py` – patch Render DB config.
- `scripts/verify_deployment.py` / `.sh` – ping Render services, confirm health endpoints, and check caching headers.
- `scripts/run_smoke_tests.sh` – orchestrate backend + frontend preview for manual QA.

## 7. Secrets & Configuration

- `ApexDeliver Environment Variables - Master Reference.md` is the authoritative ledger for all keys (Clerk, Stripe, AI, storage, accounting).
- Keep `.env` files out of source control; use Render dashboard or 1Password for production secrets.
- Backend `Settings` (in `backend/app/core/config.py`) reads `.env` and `.env.local`. Frontend uses `.env.local` (Vite semantics).
- Update `render.yaml` plus `render/*.md` docs if services/tiers change.

## 8. Deployment Checklist

1. Ensure `main` is green in CI and coverage targets met.
2. Run `npx bmad-method status` → confirm workflow gating (e.g., document-project complete, PRD validated, etc.).
3. Execute smoke tests locally (`scripts/run_smoke_tests.sh` with `npm run preview` + local API).
4. Bump version metadata in `README.md` or release notes if shipping major change.
5. Deploy via Render dashboard or CLI; backend prestart applies migrations.
6. Post-deploy, run `scripts/verify_deployment.py` and capture results in `DEPLOYMENT-SESSION-SUMMARY.md` / `PRODUCTION-DEPLOYMENT-CHECKLIST.md`.

## 9. Workflow & Collaboration Notes

- Work test-first: update relevant pytest/Vitest suites before touching services/routes/components.
- Maintain BMAD artefacts: `docs/bmad/BMAD_PROGRESS_TRACKER.md`, `docs/bmad/stories/*`, and `docs/bmm-workflow-status.yaml`.
- Use Conventional Commits (`feat(entitlement): ...`) and reference BMAD shard IDs when applicable.
- For AI pair programming, load `CLAUDE.md`, `CODEX-COMPLETE-PROJECT-GUIDE.md`, and related story files to provide full context.
- Always coordinate backend + frontend changes; marketing updates require screenshot/Loom evidence with PR.

---

_Follow alongside `docs/project-overview.md`, `docs/architecture.md`, and `docs/index.md` for complete project context._
