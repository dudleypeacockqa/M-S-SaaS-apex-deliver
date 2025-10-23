# M&A Intelligence Platform

**Version**: 2.0 (Full Production Build)  
**Status**: Active Development  
**Methodology**: BMAD v6-alpha  
**Development Approach**: Test-Driven Development (TDD) + Continuous Development

---

## Executive Summary

The M&A Intelligence Platform is an enterprise-grade, fully-integrated SaaS ecosystem designed to empower M&A professionals through every stage of the deal lifecycle. The platform addresses the critical market gap for accessible, comprehensive M&A technology by combining deal flow management, AI-powered financial intelligence, secure collaboration, and professional community features.

**Key Differentiators**:
- Integrated end-to-end M&A workflow (not fragmented tools)
- AI-powered intelligence (47+ financial ratios, automated valuations, deal matching)
- Accessible pricing (£279/month vs £10,000+ enterprise solutions)
- Network effects through community and deal matching

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand / Redux Toolkit
- **Routing**: React Router v6
- **API Client**: React Query (TanStack Query)
- **Authentication**: Clerk React SDK
- **Payments**: Stripe React SDK

### Backend
- **Framework**: Python 3.11+ with FastAPI
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **Task Queue**: Celery + Redis
- **Authentication**: Clerk Python SDK
- **Payments**: Stripe Python SDK

### Database & Infrastructure
- **Primary Database**: PostgreSQL 15+ (with PostGIS, pgvector)
- **Cache & Queue**: Redis
- **Hosting**: Render (Web Services, Static Site, PostgreSQL, Redis)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Datadog

### AI & Integrations
- **AI Services**: OpenAI GPT-4, Anthropic Claude 3, Whisper
- **Accounting**: Xero, QuickBooks, Sage, NetSuite APIs
- **Marketing**: GoHighLevel API
- **Email**: SendGrid / AWS SES

---

## Project Structure

```
ma-saas-platform-v2/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── features/        # Feature-based modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── tests/               # Frontend tests
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Python + FastAPI backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── core/            # Core configuration
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── tasks/           # Celery tasks
│   │   └── utils/           # Utility functions
│   ├── tests/               # Backend tests
│   ├── alembic/             # Database migrations
│   └── requirements.txt
│
├── docs/                     # Documentation
│   ├── bmad/                # BMAD methodology docs
│   ├── api/                 # API documentation
│   ├── architecture/        # Architecture diagrams
│   └── guides/              # User & developer guides
│
├── tests/                    # Integration & E2E tests
│   ├── integration/
│   └── e2e/
│
├── .github/                  # GitHub configuration
│   └── workflows/           # CI/CD workflows
│
├── CLAUDE.md                # Claude AI context file
├── README.md                # This file
├── .gitignore               # Git ignore rules
└── .env.example             # Environment variable template
```

---

## Development Methodology: BMAD v6-alpha

This project follows the **BMAD (Build, Measure, Analyze, Decide) methodology v6-alpha** for AI-assisted development. Key principles:

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

# Or use Render PostgreSQL (recommended)
# Connection string in .env: DATABASE_URL
```

---

## Test-Driven Development (TDD)

This project follows strict TDD principles:

### TDD Workflow
1. **Write Test First**: Define expected behavior in a test
2. **Run Test (Fail)**: Verify test fails (red)
3. **Write Minimal Code**: Implement just enough to pass
4. **Run Test (Pass)**: Verify test passes (green)
5. **Refactor**: Improve code while keeping tests green
6. **Repeat**: For each new feature or bug fix

### Testing Stack
- **Frontend**: Vitest, React Testing Library, Playwright (E2E)
- **Backend**: pytest, pytest-asyncio, httpx (for FastAPI testing)
- **Integration**: pytest with database fixtures
- **Coverage**: Minimum 80% code coverage required

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test              # Unit tests
npm run test:coverage     # With coverage
npm run test:e2e          # End-to-end tests

# Backend tests
cd backend
pytest                    # All tests
pytest --cov=app          # With coverage
pytest tests/unit         # Unit tests only
pytest tests/integration  # Integration tests only
```

---

## AI-Assisted Development

### Using CODEX CLI (GPT-5)
```bash
# From project root
codex -d "Implement user authentication with Clerk following TDD principles. Write tests first, then implementation. Use the CLAUDE.md file for context."

# For specific features
codex -d "Create the Deal Pipeline Kanban board component. Reference docs/bmad/stories/deal-pipeline-kanban.md for requirements. Write tests first."
```

### Using Claude Code CLI (Sonnet 4.5)
```bash
# From project root
claude-code -d "Implement the Financial Intelligence Engine API endpoint. Follow TDD. Reference CLAUDE.md and docs/bmad/prd.md for full context."

# For debugging
claude-code -d "Fix the failing test in tests/backend/test_deal_service.py. Analyze the error and provide a solution that maintains test coverage."
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
    name: ma-saas-frontend
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
```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
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

**Copyright © 2025 Dudley Peacock / Apex Deliver**

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

