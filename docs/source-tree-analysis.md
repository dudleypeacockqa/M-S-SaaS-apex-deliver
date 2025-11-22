# Apex Deliver Capliquify – Source Tree Analysis

**Date:** 2025-11-10  
**Scope:** Annotated inventory of key directories/files to accelerate brownfield onboarding.

## Repository Overview

The repo is a monorepo containing:
- Production FastAPI backend (`backend/`)
- React/Vite frontend (`frontend/`)
- Extensive documentation + BMAD artefacts (`docs/`, `.bmad/`)
- Vendored tooling (`_vendor/`, `backend/venv/`, root `node_modules/`)
- Legacy references (`ma-saas-platform-v2/`, `blog_*` assets)

## Directory Breakdown

| Path | Description |
| --- | --- |
| `backend/` | FastAPI project root (Dockerfile, Alembic, tests, helper scripts, committed venv) |
| `backend/app/` | Application package with `api/`, `core/`, `db/`, `models/`, `services/`, `schemas/`, `tasks/`, `utils/` |
| `backend/app/api/routes/` | Modular routers for admin, auth, deals, deal matching, documents, financial, marketing, master_admin, podcasts, subscriptions, tasks, valuation |
| `backend/app/services/` | Service layer modules (deal_service, valuation_service, entitlement_service, storage services, accounting integrations, automation, media helpers) |
| `backend/app/models/` | SQLAlchemy models covering deals, valuations, documents, subscriptions, tasks, organizations, users, podcasts, financial statements |
| `backend/tests/` | Pytest suites mirroring every feature domain plus integration stubs (`test_valuation_service.py`, `test_master_admin_api.py`, `test_xero_integration.py`, etc.) |
| `backend/alembic/` | Migration env + versioned revisions; referenced by `prestart.sh` |
| `backend/scripts/` | Maintenance scripts (enum cleaners, schema fix utilities) |
| `frontend/` | React + Vite workspace (src, public, dist, node_modules, configs, Vitest outputs) |
| `frontend/src/App.tsx` | Main router with lazy-loaded marketing + workspace routes guarded by Clerk |
| `frontend/src/components/` | Domain component folders (auth, billing, deal-matching, documents, financial, marketing, master-admin, podcast, subscription, tasks, valuation, `ui/` primitives) |
| `frontend/src/pages/` | Page-level screens (marketing landing pages, dashboards, deals, admin consoles, podcasts, legal) |
| `frontend/src/hooks/` & `src/services/` | Custom hooks, API clients, analytics/utilities used by pages/components |
| `frontend/tests/` & `src/**/*.test.tsx` | Vitest + RTL suites (MarketingLayout, CTASection, App, etc.) with coverage reports under `frontend/test-results*.txt` |
| `docs/` | Project-wide documentation (PRDs, architecture, deployment guides, environment references, marketing plans) plus new document-project outputs |
| `docs/bmad/` | BMAD artefacts (PRD, architecture, sprint/session logs, workflow trackers, prompts, stories) |
| `docs/bmad/bmm-workflow-status.md` | Prior workflow status log (before YAML mirroring) |
| `docs/...` (status reports, deployment checklists) | Operational history, marketing handoffs, release summaries |
| `.bmad/` | Installed BMAD workflows (document-project, workflow-status, stories, agent manifests, workflow instructions) |
| `_vendor/BMAD-METHOD/` | Vendored BMAD CLI, docs, and templates (includes original `bmm-workflow-status.yaml` template) |
| `_vendor/` (root) | Houses other vendored assets (BMAD, Node CLI) |
| `scripts/` | Repo-level utilities (sitemap generation, blog import, smoke tests, Render verification, secure DB config) |
| `ma-saas-platform-v2/` | Legacy snapshot retained for historical reference—do not edit unless migrating history |
| `blog_content/`, `blog_images/`, `blog_posts_for_database*.json` | Blog import assets feeding marketing site |
| `render.yaml` & `prestart.sh` | Render deployment config + migration prestart script |
| `FinanceFlo Environment Variables - Master Reference.md` | Single source of truth for secrets |

## Additional Notes

- **Vendored Environments:** `backend/venv/` and root `node_modules/` are committed for reproducibility but should be refreshed locally after cloning.
- **Legacy Files:** `test_deal_matching_api.py`, `original_conftest.py`, and directories like `v4-backup/` provide historical context—review before deletion.
- **Temporary Files:** `tmp/`, `tmp_test.txt`, and coverage/test reports can be regenerated; avoid committing local noise.
- **Workflow Data:** `.bmad-ephemeral/` (if present) stores transient BMAD outputs; safe to clear when resetting workflows.

---

_Use with `docs/index.md` to target relevant modules quickly._
