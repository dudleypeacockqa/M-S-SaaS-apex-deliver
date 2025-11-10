# Apex Deliver Capliquify – Project Overview

**Date:** 2025-11-10  
**Track:** BMad Enterprise Method – Brownfield  
**Architecture:** Monorepo (FastAPI backend + Vite/React frontend) deployed on Render

## Executive Summary

Apex Deliver’s M&A Intelligence Platform is an enterprise SaaS workspace that unifies deal sourcing, diligence, valuation, collaboration, and revenue operations. The backend (`backend/app`) is a modular FastAPI service exposing routers for authentication, deals, valuations, automation, billing, documents, podcasts, and a staff-only Master Admin portal. The frontend (`frontend/`) is a React 18 + TypeScript SPA delivered via Vite that renders both the authenticated workspace (Clerk-protected) and a public marketing funnel. PostgreSQL, Redis, and Stripe/Clerk anchors underpin the platform, while BMAD v6-alpha artefacts in `docs/` and `.bmad/` direct agent workflows, story planning, and operational reporting.

## Project Classification

- **Repository Type:** Multi-part monorepo (backend API + frontend SPA)
- **Field Type:** Brownfield (existing production-grade codebase)
- **Project Track:** Enterprise (BMAD 6.0.0-alpha.8)
- **Primary Languages:** Python 3.11, TypeScript 5.x
- **Architecture Pattern:** Service-oriented API + SPA with shared identity (Clerk) and billing (Stripe)

## Multi-Part Structure

### Backend API Service
- **Path:** `backend/`
- **Type:** FastAPI service with Celery-ready task automation
- **Entry Point:** `backend/app/main.py`
- **Purpose:** Expose authenticated REST APIs for deals, valuations, documents, billing, automation, podcasts, marketing content, and master-admin operations. Houses SQLAlchemy models, service layer logic, integrations (Stripe, Clerk, SendGrid, accounting SDKs, S3/R2), and pytest suites.
- **Tech Stack:** FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, Celery + Redis, python-jose, Clerk backend SDK, Stripe, boto3, OpenAI/Anthropic SDKs.

### Frontend Web Application
- **Path:** `frontend/`
- **Type:** React + Vite SPA with server-side generated marketing pages and authenticated workspaces
- **Entry Point:** `frontend/src/main.tsx` mounting `App.tsx`
- **Purpose:** Provide the marketing site, checkout funnel, analytics instrumentation, and the authenticated workspace (deal pipelines, valuations, podcast studio, master-admin console). Integrates with Clerk, Stripe checkout, and the backend API via React Query hooks.
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind, React Router v6, React Query, Zustand, Clerk React SDK, Vitest/RTL, lucide-react icon set.

### Integration Narrative

The frontend authenticates through Clerk, then attaches JWTs to API calls hitting the backend `/api` routers. Billing flows originate in React pages and settle through Stripe webhooks back into `backend/app/api/routes/subscriptions.py`. Document uploads leverage frontend editors that post to the backend document routes, which hand off to `s3_storage_service.py` / `storage_service.py` and optionally Cloudflare R2. Task automation and valuation workloads mutate backend models that appear in React dashboards via React Query caches.

## Technology Stack Summary

| Layer | Stack Highlights |
| --- | --- |
| API & Services | FastAPI, SQLAlchemy 2.0, Alembic, Celery, Redis, python-multipart, python-jose, Clerk backend SDK, Stripe SDK, OpenAI/Anthropic, SendGrid, boto3/R2 |
| Data & Storage | PostgreSQL 15+ (default SQLite dev), SQLAlchemy models, Alembic migrations, Cloudflare R2/S3 abstraction, ffmpeg/Pillow/pydub for media |
| Frontend | React 18, TypeScript 5.9, Vite 7, Tailwind 3.4, React Router 7, React Query 5, Clerk React SDK, Zustand, Vitest/RTL |
| Tooling & QA | Pytest + pytest-cov, Vitest + V8 coverage, GitHub Actions, Render prestart migrations, `scripts/run_smoke_tests.sh`, BMAD workflows |
| Documentation | `docs/bmad/*.md` PRDs and architecture, AI prompt libraries (`CLAUDE.md`, `CODEX-COMPLETE-PROJECT-GUIDE.md`), BMAD workflow manifests |

## Key Features

1. **Identity & Entitlements:** Clerk-backed JWT validation with role-aware enforcement inside `app/core/security.py` and `services/entitlement_service.py`.
2. **Deal Lifecycle Management:** Route modules (`deals.py`, `deal_matching.py`, `documents.py`, `tasks.py`) plus services (`deal_service.py`, `deal_matching_service.py`) cover Kanban pipelines, valuations, data rooms, and automation.
3. **Valuation & Financial Intelligence:** `valuation_service.py`, `financial_ratios.py`, `financial_narrative_service.py`, and related tests calculate ratios, build narratives, and persist valuations.
4. **Subscription & Billing:** Stripe-based flows via `subscriptions.py`, `subscription_service.py`, webhook processors, and UI dashboards (`frontend/src/pages/dashboard/BillingDashboard.tsx`).
5. **Master Admin Portal:** Staff consoles in backend (`master_admin.py`, `master_admin_service.py`) and frontend components (`src/components/master-admin/*`) to audit tenants, campaigns, and collateral.
6. **Content & Marketing Engine:** Marketing pages, blog ingestion scripts (`scripts/seed_blog_posts.py`, `docs/blog_*`), podcast tooling, and marketing analytics providers.
7. **Automation & Tasks:** `task_service.py`, `task_template_service.py`, `task_automation.py`, and Celery-ready configuration to auto-sequence workflows.
8. **External Integrations:** Services for NetSuite, QuickBooks, Sage, Xero, SendGrid, YouTube, and storage to connect finance, marketing, and media systems.

## Architecture Highlights

### Backend Focus
- **Router/Service Structure:** `app/api/routes/*` import cohesive service modules that enforce entitlement checks before hitting SQLAlchemy models. Pydantic schemas align with models for consistent serialization.
- **Database Layer:** `app/db/session.py` centralizes scoped sessions; `backend/alembic` contains revision history for Postgres. Local dev defaults to SQLite while Render uses Postgres 15 via `DATABASE_URL`.
- **Task Processing:** `app/tasks/task_automation.py` outlines Celery tasks for recurring workflows; Redis powers rate limiting, caching, and queueing.
- **Integrations:** Dedicated services wrap external APIs (Stripe, Clerk, SendGrid, Xero, QuickBooks, Sage, NetSuite) guarding secrets via `app/core/config.Settings`.
- **Storage/Media:** `storage_service.py`, `s3_storage_service.py`, and `thumbnail_service.py` coordinate local storage vs R2/S3 plus ffmpeg/Pillow conversions.
- **Security:** JWT verification, RBAC enforcement, and rate limiting toggles live inside `app/core/security.py` and `app/core/config.py`.

### Frontend Focus
- **Routing & Lazy Loading:** `src/App.tsx` wires marketing, auth, dashboard, master-admin, valuation, podcast, and checkout routes via lazy-loaded components guarded by `<SignedIn>`.
- **State & Data:** React Query caches server data while Zustand stores localized UI state. Hooks such as `src/hooks/usePageAnalytics.ts` unify telemetry.
- **UI System:** Domain-specific components under `src/components/*` pair with Tailwind tokens in `src/index.css` and share primitives (`src/components/ui/button.ts`, `card.ts`, etc.).
- **Testing:** Vitest tests live next to components/pages (`MarketingLayout.test.tsx`, `CTASection.test.tsx`, `App.test.tsx`). Reports stored as `test-results*.txt`.

### Infrastructure & Ops
- **Render Deployment:** `render.yaml` defines two Render services (Python web + static site). Backend uses `prestart.sh` to run Alembic migrations each deploy.
- **Environment Management:** Secrets tracked in `ApexDeliver Environment Variables - Master Reference.md`; `backend/.env.example` and `frontend/.env.example` illustrate local needs.
- **CI Expectations:** GitHub Actions run unit tests; BMAD workflows enforce coverage thresholds (≥90% backend services, ≥85% frontend, ≥90% marketing UI).

## Development Overview

### Prerequisites
- Node.js 18+ (22+ preferred per README), npm
- Python 3.11 with `venv`
- PostgreSQL 15+, Redis 7+
- Git, Cursor/Codex/Claude CLI tooling
- BMAD Method CLI (vendored under `_vendor/BMAD-METHOD/`)

### Getting Started Summary
1. Clone repository and install BMAD method once: `cd _vendor/BMAD-METHOD && npx bmad-method install`.
2. Backend: create `.venv`, install requirements, copy `.env.example`, run Alembic migrations, start `uvicorn`.
3. Frontend: `npm install`, create `.env.local` with `VITE_API_URL` + Clerk keys, run `npm run dev`.
4. Run `npx bmad-method status` to confirm workflow slate, then follow NEXT_ACTION guidance.

### Key Commands

| Area | Install | Run | Test |
| --- | --- | --- | --- |
| Backend | `python -m venv .venv && pip install -r backend/requirements.txt` | `cd backend && uvicorn app.main:app --reload` | `cd backend && pytest --cov=backend/app` |
| Frontend | `cd frontend && npm install` | `npm run dev` / `npm run preview` | `npm run test` / `npm run test:coverage` |
| Tooling | `npx bmad-method install` | `npx bmad-method status` / `npx bmad-method run <workflow>` | `scripts/run_smoke_tests.sh` (pairs API + preview) |

### Testing & Quality
- Backend pytest suites live in `backend/tests/` with parity to each service/route; coverage recorded in `backend/coverage.json`.
- Frontend Vitest/RTL suites are colocated; aggregated reports exist in `frontend/test-results*.txt`.
- `scripts/verify_migrations.sh` and `scripts/verify_deployment.py` support release smoke tests.
- Coverage targets per AGENTS.md: backend services ≥90%, frontend platform ≥85%, marketing UI ≥90%.

## Repository Structure Summary

- `backend/` – FastAPI app, Alembic migrations, service layer, tests, committed virtualenv.
- `frontend/` – Vite React SPA, domain components, Vitest suites, coverage reports.
- `docs/` – BMAD artefacts, deployment guides, marketing plans, this workflow output.
- `.bmad/` – Installed BMAD workflows (document-project, workflow-status, stories/agents).
- `_vendor/` – Vendored BMAD CLI, Node modules, supporting packages.
- `scripts/` – Repo-level automation (sitemap generator, smoke/deployment checks, blog import).
- `ma-saas-platform-v2/` – Legacy reference snapshot (do not modify unless migrating history).

## Documentation Map

- **This package:** `docs/index.md`, `docs/project-overview.md`, `docs/architecture.md`, `docs/development-guide.md`, `docs/source-tree-analysis.md`.
- **Product & Planning:** `docs/bmad/prd.md`, `docs/bmad/architecture.md`, `docs/bmad/stories/`, `BMAD_PROGRESS_TRACKER.md`.
- **AI Context:** `CLAUDE.md`, `CODEX-COMPLETE-PROJECT-GUIDE.md`, `AGENTS.md`.
- **Operations:** `ApexDeliver Environment Variables - Master Reference.md`, `render.yaml`, `PRODUCTION-DEPLOYMENT-CHECKLIST.md`, `DEPLOYMENT-SESSION-SUMMARY.md`.

---

_Prepared by Codex Analyst to satisfy BMAD `document-project` prerequisite._
