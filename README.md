<!-- markdownlint-disable MD013 MD022 MD032 MD031 MD040 MD036 -->
# M&A Intelligence Platform

**Version**: v1.0.0-rc1 (Release Candidate)
**Status**: ⚠️ 99.2% IN PROGRESS – Test suites are green, but manual QA, marketing Playwright evidence, and documentation sync are still outstanding
**Methodology**: BMAD v6-alpha + Test-Driven Development (TDD)
**Phase**: Phase 7 - Final QA + Marketing Website Implementation
**Completion**: All 13 core features + 7 Master Admin features + F-010 BlogAdminEditor implemented and deployed; evidence work for Master Admin QA + marketing remains
**Test Pass Rate (2025-11-17)**: Backend 1,432/1,432 (100%) ✅ · Frontend 1,742/1,742 (100%) ✅ · Master Admin 91/91 (100%) ✅

---

## ✅ Current Status (2025-11-17)

**Achievement**: Full backend + frontend RED→GREEN runs captured with authoritative logs
- Backend: 1,432/1,432 tests passing (100%), 55 skips (external OAuth/Postgres), 84% coverage ✅
- Frontend: 1,742/1,742 tests passing (100%), 85.1% coverage ✅
- Master Admin: 91/91 tests passing (100%) ✅
- F-010 BlogAdminEditor: Component created with TDD, routes integrated (commit 95a2bbd) ✅ (awaiting manual E2E verification)

**Deployment Status**: Production healthy and operational
- Frontend: https://100daysandbeyond.com (200 OK, all features operational)
- Backend: https://ma-saas-backend.onrender.com (healthy, all endpoints responding)
- Auto-deploy: Enabled on GitHub push to main branch

**Features Implemented**:
- ✅ All 13 core features (F-001 through F-013) - 100% complete
- ✅ All 7 Master Admin features (Dashboard, Activity Tracker, Prospect Pipeline, Campaign Manager, Content Studio, Lead Capture, Sales Collateral) - 100% complete
- ✅ F-010 BlogAdminEditor component with TDD tests and route integration - 95% complete (pending end-to-end verification)
- ✅ Production deployment with health monitoring and CI/CD

**Remaining Work** (See [COMPLETION-PLAN-2025-11-17.md](COMPLETION-PLAN-2025-11-17.md)):
- ⏳ F-010 BlogAdminEditor end-to-end verification in production
- ⏳ Manual Master Admin QA (4-6 hours) + evidence capture
- ⏳ Performance & accessibility audits (manual Lighthouse + Axe)
- ⏳ Marketing Playwright smoke suite + integrations evidence
- ⏳ Documentation + roadmap sync so nothing claims 100% without proof

**Documentation Evidence**:
- [FINAL-COMPLETION-PLAN.md](docs/FINAL-COMPLETION-PLAN.md) – Current completion roadmap
- [Master Admin Validation Checklist](docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md) – Manual QA procedures
- [Backend Verification Log](docs/deployments/2025-11-17-backend-verify.txt) – Health/Alembic/table/index results
- [BMAD Daily Status](docs/bmad/DAILY_STATUS_NOTES.md) – Build/Measure/Analyze log (new)
- [Session Summary](docs/2025-11-17-SESSION-SUMMARY.md) – Worklog for this execution window



## Executive Summary

The M&A Intelligence Platform is an enterprise-grade, fully-integrated SaaS ecosystem.
It empowers M&A professionals through every stage of the deal lifecycle.
The platform addresses the market gap for accessible, comprehensive M&A
technology. It combines deal flow management, AI-powered financial
intelligence, secure collaboration, and professional community features.

**Key Differentiators**:

- Integrated end-to-end M&A workflow (not fragmented tools)
- AI-powered intelligence:
  47+ financial ratios, automated valuations, deal matching
- Accessible pricing (£279/month vs £10,000+ enterprise solutions)
- Network effects through community and deal matching

---

## Quick Setup

### Prerequisites

- **Node.js 18+** (for BMAD CLI and frontend)
- **Python 3.11+** (for backend)
- **PostgreSQL 15+** (database)
- **Redis** (cache and task queue)

### BMAD Method Installation (One-Time)

This project uses the **BMAD v6-alpha methodology** for structured, agent-driven development. The BMAD CLI is vendored in this repository and must be installed once per development environment:

```bash
cd _vendor/BMAD-METHOD
npx bmad-method install
```

**What this does:**
- Compiles YAML agents to Markdown
- Generates agent/workflow manifests
- Sets up IDE integrations (Codex, Claude Code)
- Validates bmad/ directory structure

**Note**: Only needs to be run **once per development environment** (e.g., once per developer machine).

### Daily Development Commands

```bash
# Check workflow status and next recommended action
npx bmad-method status

# View available workflows
npx bmad-method workflows

# Execute workflow (e.g., create story, implement feature)
npx bmad-method run <workflow-name>
```

### Marketing Smoke (Playwright)

Serve the marketing bundle (`npm run preview:test` from `frontend/`), export `MARKETING_BASE_URL` (defaults to `http://127.0.0.1:4173` locally), then execute the Playwright suite:

```bash
MARKETING_BASE_URL=http://127.0.0.1:4173 npx playwright test --config playwright.dev.config.ts
```

### TDD Discipline (Mandatory)

All feature development follows strict Test-Driven Development:

1. **RED** ❌ - Write failing test first
2. **GREEN** ✅ - Implement minimal code to pass
3. **REFACTOR** ♻️ - Clean up while keeping tests green

BMAD workflows enforce TDD at every step.

### Progress Tracking

After completing each sprint or major story, update:
- `docs/bmad/BMAD_PROGRESS_TRACKER.md` - Log test counts, coverage, commits
- `docs/bmad/bmm-workflow-status.md` - Update workflow state

### Full Documentation

- **[AGENTS.md](./AGENTS.md)** - Repository guidelines for contributors
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant context (primary developer reference)
- **[CODEX-COMPLETE-PROJECT-GUIDE.md](./CODEX-COMPLETE-PROJECT-GUIDE.md)** - Complete implementation guide
- **[docs/BMAD-METHOD-IMPLEMENTATION.md](./docs/BMAD-METHOD-IMPLEMENTATION.md)** - BMAD setup details and troubleshooting
- **[docs/BMAD-V6-ADOPTION-GUIDE.md](./docs/BMAD-V6-ADOPTION-GUIDE.md)** - Comprehensive adoption guide

---

## Technology Stack

### Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand / Redux Toolkit
- **Routing**: React Router v6
- **API Client**: React Query (TanStack Query)
- **Authentication & Subscription Management**:
  - Clerk React SDK
  - Connected to Stripe billing
- **Payments**:
  - Stripe React SDK
  - Supports one-off transactions and event tickets

### Backend

- **Framework**: Python 3.11+ with FastAPI
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **Task Queue**: Celery + Redis
- **Authentication & Subscription Management**:
  - Clerk Python SDK verifies JWTs
  - Reads subscription tiers from Clerk
- **Payments**:
  - Stripe Python SDK
  - Handles webhooks for one-off charges

### Database & Infrastructure

- **Primary Database**: PostgreSQL 15+
- **Extensions**: PostGIS, pgvector
- **Cache & Queue**: Redis
- **Hosting**: Render
  - Web Services
  - Static Site
  - PostgreSQL
  - Redis
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Datadog

### AI & Integrations

- **AI Services**: OpenAI GPT-4, Anthropic Claude 3, Whisper
- **Accounting**: Xero, QuickBooks, Sage, NetSuite APIs
- **Marketing**: GoHighLevel API
- **Email**: SendGrid / AWS SES

---

## Project Structure

```text
./
├── backend/                  # FastAPI application (app/, alembic/, tests/)
├── frontend/                 # React + Vite frontend (src/, public/, dist/)
├── docs/                     # Project documentation, including BMAD artefacts
├── scripts/                  # Utility scripts (e.g., secure_render_database.py)
├── node_modules/             # Committed Node workspace (consider pruning)
├── backend/venv/             # Committed Python virtualenv (stale packages)
├── ma-saas-platform-v2/      # Legacy snapshot retained for reference only
├── AGENTS.md                 # Contributor guide
├── CODEX-*.md                # Implementation playbooks
├── QUICK_START_GUIDE.md      # Local setup instructions
└── ...                       # Additional operational docs and assets
```

---

## Development Methodology: BMAD v6-alpha

This project follows the **BMAD (Build, Measure, Analyze, Decide) methodology
v6-alpha** for AI-assisted development.

### Core Workflow

1. **Planning**: Define features in Product Requirements Documents (PRDs)
2. **Sharding**: Break PRDs into manageable user stories
3. **Story Management**: Use Story Manager (SM) to draft and track stories
4. **Implementation**: Use AI coding assistants (CODEX, Claude Code) to implement
5. **Quality Assurance**: Automated testing, code review, deployment
6. **Iteration**: Continuous feedback and improvement

### Agent Roles

- **Product Owner (PO)**: Manages PRDs and shards them into stories
- **Story Manager (SM)**: Drafts stories with full context for implementation
- **Analyst**: Provides research and technical analysis
- **Developer**: AI coding assistants (CODEX GPT-5, Claude Code Sonnet 4.5)
- **QA**: Automated testing and quality assurance

### Key Files

- `docs/bmad/prd.md` - Product Requirements Document
- `docs/bmad/architecture.md` - System Architecture
- `docs/bmad/stories/` - User stories directory
- `.bmad-core/` - BMAD configuration (created after BMAD installation)

---

## Getting Started

### Prerequisites

- **Node.js**: 22.13.0+ (for frontend)
- **Python**: 3.11+ (for backend)
- **PostgreSQL**: 15+ (local or Render)
- **Redis**: 7+ (local or Render)
- **Git**: Latest version
- **Cursor IDE**: With CODEX and Claude Code CLIs installed

### Initial Setup

#### 1. Clone and Navigate

```bash
cd C:\Projects\ma-saas-platform
# This directory will be synced with the repository
```

#### 2. Install BMAD Method

```bash
npx bmad-method install
# Select: Cursor IDE
# This creates .bmad-core/ directory with agent configurations
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

#### 4. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database and API keys
alembic upgrade head
uvicorn app.main:app --reload
```

#### 5. Database Setup

```bash
# Local PostgreSQL
createdb ma_saas_platform
# Seed data if needed
psql ma_saas_platform < scripts/seed.sql
```

---

## Test-Driven Development (TDD)

This project follows strict TDD principles:

### TDD Workflow

1. **Write Test First**: Define expected behavior
2. **Run Tests**: Ensure they fail (RED)
3. **Implement**: Write minimal code to pass (GREEN)
4. **Refactor**: Clean up while keeping tests green

### Testing Stack

- **Frontend**: Vitest, React Testing Library
- **Backend**: Pytest, httpx
- **E2E**: Playwright/Selenium scripts

### Running Tests

```bash
# Frontend
cd frontend
npm test
# Backend
cd backend
pytest
```

---

## AI-Assisted Development

### Using CODEX CLI (GPT-5)

```bash
# From project root (summarized prompt)
codex -d "Implement Clerk authentication with TDD. Write tests first, then code."

# For specific features (summarized prompt)
codex -d "Create Deal Pipeline Kanban board. See docs/bmad/stories/deal-pipeline-kanban.md."
```

### Using Claude Code CLI (Sonnet 4.5)

```bash
# From project root (summarized prompt)
claude-code -d "Implement the Financial Intelligence Engine API using TDD."

# For debugging (summarized prompt)
claude-code -d "Fix failing test in tests/backend/test_deal_service.py with coverage."
```

### Context Files for AI

- **CLAUDE.md**: Primary context file with project overview, architecture, and guidelines
- **docs/bmad/prd.md**: Product requirements and feature specifications
- **docs/bmad/architecture.md**: System architecture and technical decisions
- **docs/bmad/stories/[story-name].md**: Individual user story context

---

## Deployment

### Render Deployment

#### Frontend (Static Site)

```yaml
# render.yaml (frontend)
services:
  - type: web
    name: ma-saas-platform
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://ma-saas-backend.onrender.com
      - key: VITE_CLERK_PUBLISHABLE_KEY
        sync: false
```

#### Backend (Web Service)

```yaml
# render.yaml (backend)
services:
  - type: web
    name: ma-saas-backend
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: ma-saas-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: ma-saas-redis
          type: redis
          property: connectionString
```

### CI/CD Pipeline

- **GitHub Actions**: Automated testing on every push
- **Render Auto-Deploy**: Automatic deployment on merge to `main`
- **Environment Variables**: Managed in Render dashboard

---

## Contributing

### Workflow

1. Create feature branch from `main`
2. Write tests first (TDD)
3. Implement feature
4. Ensure all tests pass
5. Commit with conventional commit messages
6. Push and create Pull Request
7. AI agents and automated tests will review
8. Merge after approval

### Commit Message Format

```text
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:

```text
feat(deal-pipeline): add Kanban board component

- Implement drag-and-drop functionality
- Add stage customization
- Include comprehensive tests

Closes #123
```

---

## Support & Documentation

- **Technical Docs**: `/docs/`
- **API Docs**: Auto-generated at `/api/docs` (FastAPI)
- **BMAD Guides**: `/docs/bmad/`
- **Issue Tracking**: GitHub Issues
- **Questions**: GitHub Discussions

---

## License

Proprietary - All Rights Reserved

Copyright © 2025 Dudley Peacock / Apex Deliver

---

## Project Status

**Current Phase**: Phase 1 - Foundational Core & Revenue Engine (Months 1-3)

**Completed**:

- [x] Project structure setup
- [x] Git repository initialization
- [x] Documentation framework
- [x] BMAD methodology integration

**In Progress**:

- [ ] User & Organization Management (F-001)
- [ ] Deal Flow & Pipeline Management (F-002)
- [ ] Subscription & Billing System (F-005)

**Next Up**:

- [ ] Financial Intelligence Engine (F-006)
- [ ] Secure Document & Data Room (F-003)
- [ ] Multi-Method Valuation Suite (F-007)

---

**Last Updated**: October 23, 2025  
**Maintained By**: Dudley Peacock with AI assistance (Manus, CODEX, Claude Code)
