# Apex Deliver Capliquify – Architecture Reference

**Last Updated:** 2025-11-10  
**Scope:** Monorepo architecture covering backend (FastAPI), frontend (React/Vite), infrastructure (Render, PostgreSQL, Redis), and integrations (Clerk, Stripe, accounting APIs, AI providers, storage).

## Platform Topology

```
Clerk ↔ Frontend (React) ↔ FastAPI API → PostgreSQL
                                ↓
                             Redis / Celery
                                ↓
                      External APIs (Stripe, SendGrid, Xero, QuickBooks, Sage, NetSuite, OpenAI/Anthropic)
                                ↓
                    Cloudflare R2 / S3 (Document & media storage)
```

The repository is a multi-part monorepo. `frontend/` serves a marketing funnel plus the authenticated workspace. `backend/` exposes REST APIs at `/api/*` that power the frontend, supports automation tasks, and integrates external providers. Render deploys two services (Python web & static frontend) defined in `render.yaml`, while BMAD workflows orchestrate delivery.

## Backend Architecture (`backend/app`)

### Application Shell
- `app/main.py` constructs the FastAPI app, configures CORS, and registers routers in `app/api`.
- Lifespan hooks call `init_db()`/`close_db()` from `app/core/database.py` to manage SQLAlchemy sessions.
- `app/api/__init__.py` mounts routers for auth, clerk webhooks, admin, deals, deal matching, documents, financial, subscriptions, podcasts, tasks, valuation, marketing, master-admin, etc.

### Core Modules
- `app/core/config.py` defines `Settings` using Pydantic Settings for secrets (Clerk, Stripe, OpenAI, R2, SendGrid, etc.) and toggles (rate limiting, analytics, storage mode).
- `app/core/security.py` (not shown but adjacent) handles JWT verification, password hashing, Clerk claims, and OAuth flows.
- `app/core/subscription.py` enforces tier gating and entitlements.
- `app/db/` contains ORM base classes and session helpers.

### Domain Layers
- **Routes (`app/api/routes/*.py`):** Each route groups endpoints per domain (e.g., `deals.py`, `valuation.py`, `master_admin.py`, `documents.py`, `subscriptions.py`, `podcasts.py`). Routes import domain services to enforce business rules before hitting the ORM.
- **Services (`app/services/*.py`):** Encapsulate logic for deals, deal matching, documents/storage, entitlements, organizations, quotas, financial ratios/narratives, valuations, subscription billing, accounting integrations (Xero, QuickBooks, Sage, NetSuite), podcasts, tasks, YouTube, thumbnail generation, etc.
- **Models & Schemas:** SQLAlchemy models under `app/models/*.py` map to database tables; Pydantic schemas in `app/schemas/` mirror them for request/response validation.
- **Tasks (`app/tasks/task_automation.py`):** Defines Celery-ready automation (recurring task generation, review workflows) and is tested via `backend/tests/test_task_automation.py`.

### Testing
- `backend/tests/` mirrors every feature, including API endpoint tests (`test_deal_endpoints.py`, `test_document_endpoints.py`, `test_subscription.py`), service tests (`test_valuation_service.py`, `test_task_service.py`), and integration stubs for accounting providers.
- Coverage artifacts (e.g., `backend/coverage.json`) verify ≥90% service coverage per AGENTS.md.

## Data & Persistence

- **Primary DB:** PostgreSQL 15+ in production, SQLite fallback for local dev via `Settings.database_url`.
- **ORM:** SQLAlchemy 2.0 with typed models (deals, deal_match, valuation, documents, subscriptions, tasks, orgs, users, podcasts, financial statements/ratios).
- **Migrations:** Alembic setup in `backend/alembic/` with CLI invoked via Render `prestart.sh` to ensure `alembic upgrade head` before app boot.
- **Storage:** Local filesystem (`Settings.storage_path`) or Cloudflare R2/S3 via `s3_storage_service.py`. Media helpers (`thumbnail_service.py`, `audio_chunking_service.py`) rely on ffmpeg, Pillow, and pydub.
- **Cache/Queue:** Redis used for Celery, rate limiting, and caching toggles (configured via env). Future tasks can be wired by enabling Celery worker to import `app.tasks`.

## External Integrations

- **Identity:** Clerk (React SDK on frontend; backend verifies JWT claims, webhook handler in `app/api/webhooks/clerk.py`).
- **Billing:** Stripe API & webhook coverage inside `subscriptions.py`, `subscription_service.py`. Frontend includes checkout flows in `src/pages/checkout/`.
- **Email & Notifications:** SendGrid keys stored in settings; `contact_notification_email` ensures marketing form submissions notify staff.
- **Accounting APIs:** Dedicated services for Xero (`xero_oauth_service.py`), Sage, QuickBooks, NetSuite, plus tests to ensure token handling.
- **AI Providers:** OpenAI & Anthropic keys power valuation narratives, automation, and assistants (see README + `docs/AI_PROMPT_LIBRARY.md`).
- **Media/Content:** YouTube ingestion (`youtube_service.py`), podcast services, blog import scripts under `scripts/`.

## Frontend Architecture (`frontend/src`)

### Composition
- `src/main.tsx` mounts `<App />` within `QueryClientProvider` and wraps the Router.
- `src/App.tsx` lazy-loads every marketing, workspace, admin, valuation, document, and podcast page. `<SignedIn>` gate files requiring auth; `<ErrorBoundary>` centralizes error handling.
- Layouts (`src/layouts/RootLayout.tsx`) supply shared nav + footers; analytics hook `usePageAnalytics` tracks route changes.

### Modular Structure
- `src/components/` contains domain-specific subfolders (auth, billing, deal-matching, documents, financial, marketing, master-admin, podcast, subscription, tasks, valuation) plus `ui/` primitives (e.g., `button.ts`, `card.ts`) aligned with Tailwind tokens.
- `src/pages/` organizes actual route screens (marketing landing pages, dashboard views, deal flows, admin consoles, podcasts, legal pages).
- `src/hooks/` and `src/services/` hide API calls, billing logic, valuations, analytics, and storage interactions.
- `src/tests/` + colocated `*.test.tsx` files use Vitest & React Testing Library.
- Styling lives in `src/index.css` and `src/styles/` (Tailwind config).

### State & Data
- React Query manages server state and caching. Zustand (and custom hooks) store lightweight UI state (filters, wizards, modals).
- Clerk React SDK supplies `SignedIn/SignedOut` wrappers, user context, and organization membership for gating.

## API ↔ Frontend Contract

- All workspace calls hit `/api/*` routes with Bearer tokens from Clerk. API modules mirror React service hooks: e.g., `frontend/src/services/dealService.ts` (if present) targets `backend/app/api/routes/deals.py`.
- File uploads and downloads coordinate with `documents.py` and storage services.
- Q&A data, valuations, tasks, and automation surfaces align with backend JSON structures defined in Pydantic schemas, ensuring parity between React Query expectations and FastAPI responses.

## Infrastructure & Deployment

- **Render Configuration:** `render.yaml` declares `ma-saas-backend` (Python web) and `ma-saas-frontend` (static). Backend `startCommand` runs `bash ./prestart.sh` before `uvicorn` to guarantee migrations. Frontend rewrites `/*` → `/index.html` for SPA routing.
- **Prestart Script:** `prestart.sh` logs environment info, ensures Alembic is installed, lists heads, and completes `alembic upgrade head` before serving traffic.
- **Secrets:** Stored in Render dashboard per `FinanceFlo Environment Variables - Master Reference.md`. Local `.env` files mirror required keys.
- **Vendored Tooling:** `_vendor/BMAD-METHOD/` houses BMAD CLI; `backend/venv/` and root `node_modules/` are checked in to aid reproducibility (refresh locally if stale).

## Security & Compliance

- **Authentication/Authorization:** Clerk handles identity; backend enforces JWT validation (`clerk_jwt_algorithm` default RS256) and role-based gating via services such as `entitlement_service.py`.
- **Data Protection:** Storage services support Cloudflare R2 (S3-compatible) with encryption at rest; documents feature watermarking and audit logs.
- **Rate Limiting & Guardrails:** Config toggles `enable_rate_limiting` and `rate_limit_per_minute` allow future enforcement. Master Admin routes audit privileged actions.
- **Compliance Artefacts:** SOC2/GDPR expectations documented across `docs/` (e.g., `PRODUCTION-DEPLOYMENT-CHECKLIST.md`, `MASTER_ADMIN_*` files) with automated checklists tracked in `docs/bmad/BMAD_PROGRESS_TRACKER.md`.
- **Testing Gates:** AGENTS.md mandates coverage floors and TDD workflow before merges. `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md` + `DEPLOYMENT-SESSION-SUMMARY.md` capture release sign-offs.

## Observability & Operations

- **Monitoring:** README lists Sentry + Datadog; instrumentation hooks exist in `frontend/src/components/marketing/AnalyticsProvider.tsx` and backend services.
- **Smoke Testing:** `scripts/run_smoke_tests.sh` spins API + `npm run preview` for manual verification; `verify_deployment.py/sh` check Render health.
- **Workflow Tracking:** `docs/bmm-workflow-status.yaml` records BMAD workflow progress. Use `npx bmad-method status`/`workflows` to stay aligned.

## V1.2 Enhancement Focus

- **Reliability & Performance:** Close the backlog of backend/frontend TODOs (pagination, caching, Celery/Redis instrumentation, React Query cache tuning) while targeting ≥92 Lighthouse performance and ≥95 accessibility (see `docs/bmad/V1.2-SCOPE.md`).  
- **Quality Gates:** Lift backend coverage from 84% to ≥90% and frontend from 85.1% to ≥90% via TDD-first updates to `backend/tests/**` and `frontend/src/**/*.test.tsx`.  
- **Infrastructure Guardrails:** Update `render.yaml`, `prestart.sh`, and deployment checklists to enforce schema drift detection, health checks, and rollback procedures before v1.2 release.  
- **Document Export Hardening:** Document exports now enqueue Celery jobs with real file generation plus audit logging, ensuring `DocumentVersionSummary` and `DocumentExportJob` entries include attribution and consistent storage metadata.  
- **Cross-Cutting Consistency:** Re-run BMAD `solutioning-gate-check` after enhancements and keep architecture/stories in sync so multiple AI agents implement features without conflict.

## Architecture Decisions & Patterns

- **Multi-tenant Isolation:** All SQLAlchemy queries scope by `organization_id`, and service methods call `entitlement_service.py` before acting. Redis namespaces mirror org IDs to isolate rate limiting and Celery jobs. Clerk-issued org claims are the single source of truth for tenancy.
- **Master Admin Impersonation:** FastAPI now exposes an `AccessScope` dependency (`app/api/dependencies/tenant_scope.py`) that inspects the `X-Master-Tenant-Id` and `X-Master-Customer-Id` headers. Only `UserRole.master_admin` users can supply those headers; everyone else is bound to their own `organization_id`. Key routers (billing, deals, documents, document-generation, tasks) resolve the effective org via `require_scoped_organization_id`, ensuring tenant overrides are auditable and consistent.
- **AI & Automation Guardrails:** Valuation narratives and Copilot suggestions always record provenance (inputs + timestamp) and require reviewer sign-off before publishing to documents or Q&A. Automation tasks live in Celery but surface to the React UI through polling endpoints so users can approve/override.
- **Document Security:** `storage_service.py` abstracts local vs Cloudflare R2. Watermarking + legal-hold metadata live alongside file keys so downloads can be blocked instantly without re-uploading.
- **Upgrade Hooks:** Billing and marketing components share CTA primitives; back-end `subscription_service.py` exposes feature flags so front-end surfaces can check entitlement before enabling AI-heavy workflows.

## Data & Integration Flow

1. **Workspace Actions → API:** React Query hooks call `/api` routes with Clerk JWT; FastAPI routers validate entitlements then call domain services.
2. **Domain Services → Persistence:** Services orchestrate SQLAlchemy models, Redis (for automation state), and Cloudflare R2 via `boto3`. Alembic tracks schema versions.
3. **Automation Loop:** Certain events enqueue Celery tasks via Redis. Results are written back to Postgres and surfaced to the UI (e.g., task timelines, Copilot suggestions).
4. **External Integrations:** Stripe webhooks post to `/api/webhooks/clerk.py`/`subscriptions.py`; accounting connectors run via service classes with OAuth credential storage. AI providers (OpenAI/Anthropic) accessed through dedicated utility modules.
5. **Analytics & Marketing:** Marketing site components emit events (Segment/GoHighLevel) while workspace analytics feed Datadog/Sentry for ops visibility.

## Deployment & DevOps (Render via GitHub)

- **Source of Truth:** The `c:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver` repo pushes to GitHub; Render services (`ma-saas-backend`, `ma-saas-frontend`) are configured to auto-deploy from the `main` branch. Every merge to GitHub triggers Render builds (Python web + static) using the repo as the deployment artifact.
- **Backend Pipeline:** Render clones the repo, runs `bash ./prestart.sh` (which executes Alembic migrations) and then starts `uvicorn`. Secrets (DATABASE_URL, Clerk, Stripe, AI keys) are stored in Render env vars; ensure they are updated in lockstep with `FinanceFlo Environment Variables - Master Reference.md`.
- **Frontend Pipeline:** Render’s static site service runs `cd frontend && npm install && npm run build`, publishing `frontend/dist`. SPA routing is enabled via rewrites to `/index.html`.
- **GitHub Actions & Quality Gates:** Prior to pushing to GitHub (and triggering Render), run `pytest --cov=backend/app` and `npm run test`. Linting (`npm run lint`) applies to the frontend. Optional CI can block merges unless coverage thresholds in AGENTS.md are met.
- **Rollback Strategy:** Render keeps previous deployments; if a deploy fails, promote the last healthy version from Render dashboard. Database migrations must remain backward compatible or include rollback scripts in `backend/alembic`.
- **Access & Secrets Hygiene:** Use GitHub branch protections (PR reviews, status checks) to ensure only validated code reaches Render. Rotate Render secrets quarterly and document updates in `PRODUCTION-DEPLOYMENT-CHECKLIST.md`.

## Risks & Follow-ups

1. **Celery Worker Topology:** Current Render setup covers web + static services; dedicated worker processes are needed once automation load increases. Evaluate Render Background Workers or alternative task runners.
2. **Redis Throughput:** As valuations and automation scale, monitor Redis latency; consider migrating to managed Redis tiers with higher connection limits.
3. **Multi-region Requirements:** PRD targets global tenants; plan for data residency by evaluating Render regions or multi-region Postgres/Cloudflare R2 replication.
4. **Secrets Drift:** Vendored `backend/venv/` and root `node_modules/` ease onboarding but can hide dependency updates; refresh them before major deployments to avoid mismatches with Render environments.
5. **Observability Coverage:** Ensure Sentry/Datadog capture both marketing and workspace incidents, especially around AI narrative generation and document downloads.

---

_Use alongside `docs/project-overview.md` and `docs/development-guide.md` for implementation planning._
