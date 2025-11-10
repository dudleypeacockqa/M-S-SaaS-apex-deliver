# Apex Deliver Capliquify – Documentation Index

**Type:** Monorepo (backend FastAPI + frontend React)  
**Primary Languages:** Python 3.11, TypeScript 5.x  
**Architecture:** Service-oriented FastAPI API + Vite/React SPA, Render-hosted  
**Last Updated:** 2025-11-10

## Project Overview

Apex Deliver’s “M&A Intelligence Platform” is a brownfield, enterprise SaaS workspace that merges authenticated deal execution tools with a marketing funnel and content hub. The repository contains a production-grade FastAPI stack in `backend/` that exposes domain routers for deals, valuations, document rooms, automation, billing, and master-admin workflows, plus a Vite/React TypeScript SPA in `frontend/` that serves both authenticated workspaces and a marketing/publication surface. BMAD v6-alpha workflows, PRDs, and operational playbooks live under `docs/` and `.bmad/` to guide AI-first delivery.

## Project Structure

### Backend API (`backend/`)
- `app/main.py` bootstraps FastAPI with lifespan hooks and mounts routers from `app/api`.
- `app/core/` loads config, database sessions, and security/entitlement helpers.
- `app/api/routes/` groups route modules (`deals.py`, `valuation.py`, `master_admin.py`, etc.) that call into services.
- `app/services/` implements all business logic (deal matching, valuations, subscription enforcement, storage, accounting connectors).
- `app/models/` and `app/schemas/` pair SQLAlchemy models with Pydantic contracts.
- `alembic/` manages migrations; `scripts/` under backend automate admin checks.
- `tests/` mirrors feature domains with pytest suites targeting models, services, and APIs.

### Frontend App (`frontend/`)
- React 18 + Vite entry under `src/main.tsx` / `src/App.tsx` with lazy-loaded routes, Clerk authentication, and React Query for data.
- `src/components/` holds UI kits by domain (marketing, deals, master-admin, valuation, documents, tasks, subscription) plus shared Tailwind-based primitives in `src/components/ui/`.
- `src/pages/` contains marketing funnels, dashboards, admin consoles, valuations, podcasts, etc.
- `src/services/` and `src/hooks/` wrap API calls, valuations, analytics, and billing logic.
- Vitest suites are colocated (e.g., `MarketingLayout.test.tsx`, `App.test.tsx`) with coverage reports stored alongside `test-results*.txt`.

### Documentation & Tooling
- `docs/` aggregates BMAD artefacts (PRD, architecture, deployment reports, runbooks) and now hosts this workflow output.
- `.bmad/` + `_vendor/BMAD-METHOD/` provide workflow definitions (`document-project`, `workflow-status`, agent manifests).
- `scripts/` contains repo-level utilities (smoke tests, sitemap generation, Render verification).
- `ma-saas-platform-v2/` is a legacy snapshot; `_vendor/` stores vendored dependencies (BMAD CLI, node modules, backend venv).

## Cross-Part Integration

- **API Surface:** `frontend/src/services` calls the FastAPI routers exposed under `/api` (auth, deals, documents, valuations, subscriptions, podcasts, master-admin, webhooks) with Clerk-issued tokens.
- **Shared Identity & Billing:** Clerk is consumed on both sides (`frontend` for auth components, `backend/app/core/security.py` for JWT verification) while Stripe billing flows originate from frontend pages and land on backend `subscriptions.py` + webhook handlers.
- **Storage & Documents:** Frontend editors/uploaders invoke document routes which delegate to `s3_storage_service.py` / `storage_service.py`, toggling local vs R2/S3 via `Settings.use_s3_storage`.
- **Automation:** Background tasks defined in `backend/app/tasks/task_automation.py` surface as UI task timelines and notifications rendered via React components.

## Quick Reference

### Backend Quick Ref
- **Stack:** FastAPI, SQLAlchemy 2.0, Alembic, Celery, Redis, Stripe, Clerk, OpenAI/Anthropic.
- **Entry Point:** `backend/app/main.py`
- **Local Commands:**  
  - Install deps: `python -m venv .venv && pip install -r backend/requirements.txt`  
  - Run API: `cd backend && uvicorn app.main:app --reload`  
  - Tests: `cd backend && pytest --cov=backend/app`
- **Database:** PostgreSQL 15+ (dev default SQLite) with migrations in `backend/alembic`.
- **Deployment:** Render web service (`render.yaml` + `prestart.sh` handles Alembic upgrade).

### Frontend Quick Ref
- **Stack:** React 18, TypeScript 5, Vite, Tailwind, React Query, Clerk, Zustand.
- **Entry Point:** `frontend/src/main.tsx`
- **Local Commands:**  
  - Install deps: `cd frontend && npm install`  
  - Dev server: `npm run dev`  
  - Build: `npm run build`  
  - Tests: `npm run test` / `npm run test:coverage`
- **Deployment:** Render static site with rewrites to `index.html`.

## Generated Documentation

- [Project Overview](./project-overview.md) – executive summary, classification, key stacks, commands.
- [Architecture](./architecture.md) – backend/frontend/data/integration detail plus security and deployment notes.
- [Development Guide](./development-guide.md) – environment setup, scripts, testing cadence, workflow expectations.
- [Source Tree Analysis](./source-tree-analysis.md) – annotated directory inventory across backend, frontend, docs, and tooling.

## Existing Documentation Highlights

- `README.md` – investor-grade overview, setup, and BMAD usage.
- `CLAUDE.md` & `CODEX-COMPLETE-PROJECT-GUIDE.md` – AI assistant briefs.
- `docs/bmad/prd.md` – full PRD and epics.
- `docs/bmad/architecture.md` – legacy architecture decisions.
- `ApexDeliver Environment Variables - Master Reference.md` – authoritative env var ledger.

## Getting Started

### Backend Setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # update secrets
cd backend && uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # provide API + Clerk keys
npm run dev
```

### Testing Baseline
- Backend: `pytest --cov=backend/app` (target ≥90% on services per AGENTS.md).
- Frontend: `npm run test:coverage` (Vitest, ≥85% coverage for product UI, 90%+ for marketing).
- Smoke: `scripts/run_smoke_tests.sh` pairs a local `uvicorn` session with `npm run preview`.

## For AI-Assisted Development

- **Backend/API work:** Load `architecture.md`, `development-guide.md`, `backend/app/services/*`, and relevant pytest files before coding.
- **Frontend/UX work:** Reference `component` directories, Tailwind tokens in `index.css`, and domain tests inside `src/components/**.test.tsx`.
- **Full-stack epics:** Combine both plus integration docs; confirm Clerk + Stripe env values via `ApexDeliver Environment Variables - Master Reference.md`.
- **BMAD Workflow Context:** Workflow status tracked in `docs/bmm-workflow-status.yaml`; new work should only start after this document-project deliverable is recorded.

---

_Generated manually per BMAD `document-project` workflow – ready for planning agents._
