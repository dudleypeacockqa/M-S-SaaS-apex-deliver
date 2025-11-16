# M&A Intelligence Platform - AI Development Context

**Document Purpose**: This file provides comprehensive context for AI coding assistants (Claude Code, CODEX) to understand the project, architecture, conventions, and development approach.

**Last Updated**: November 16, 2025
**Project Version**: 2.0 (Full Production)
**Methodology**: BMAD v6.0.0-alpha.9 (core + bmb + bmm + cis) with Test-Driven Development (TDD)
**Note**: Official BMAD-METHOD v6.0.0-alpha.9 CLI installed (core + bmb + bmm + cis) alongside enforced TDD

---

## 1. Project Overview

### What We're Building

The M&A Intelligence Platform is an enterprise-grade SaaS ecosystem for M&A professionals. It's not an MVP—it's a complete, production-ready system with all features from basic to advanced.

**Core Purpose**: Democratize access to professional M&A tools by providing an integrated platform that combines deal flow management, AI-powered financial intelligence, secure collaboration, and professional networking at accessible price points (starting at £279/month vs £10,000+ enterprise solutions).

**Target Users**:
1. **Solo Dealmakers** - Independent M&A advisors, entrepreneurs (Starter tier: £279/month)
2. **Growth Firm Users** - Professionals in small-medium PE firms (Professional tier: £598/month)
3. **Enterprise Users** - Large investment banks, corporate dev teams (Enterprise tier: £1,598/month)
4. **Community Leaders** - Industry influencers, event organizers (Community tier: £2,997/month)
5. **Platform Admins** - Internal team managing the platform

### Business Model

**Revenue Streams**:
- Subscription revenue (target: £1.4M ARR Year 1)
- Premium events (target: £300K/year)
- PMI consulting services (target: £200K/year)

**Strategic Goal**: Bootstrap to £75K MRR by Month 12 to fund founder's systematic LBO acquisition strategy (long-term goal: £200M personal wealth).

---

## 2. Technical Architecture

### Technology Stack

#### Frontend
```
React 18+ + TypeScript
├── Build: Vite
├── Styling: Tailwind CSS
├── State: Zustand / Redux Toolkit
├── Routing: React Router v6
├── API: React Query (TanStack Query)
├── Auth: Clerk React SDK
└── Payments: Stripe React SDK
```

#### Backend
```
Python 3.11+ + FastAPI
├── ORM: SQLAlchemy 2.0
├── Validation: Pydantic v2
├── Migrations: Alembic
├── Tasks: Celery + Redis
├── Auth: Clerk Python SDK
└── Payments: Stripe Python SDK
```

#### Database & Infrastructure
```
PostgreSQL 15+ (PostGIS, pgvector)
├── Cache: Redis
├── Hosting: Render
├── CI/CD: GitHub Actions
└── Monitoring: Sentry, Datadog
```

#### AI Services
```
OpenAI GPT-4 (narratives, analysis)
├── Anthropic Claude 3 (reasoning, matching)
└── Whisper (transcription)
```

### Architecture Principles

1. **Multi-Tenant**: Each organization has isolated data and workspace
2. **RBAC**: Role-based access control at platform, organization, and resource levels
3. **Async-First**: Background tasks via Celery for long-running operations
4. **API-Driven**: RESTful API with comprehensive OpenAPI documentation
5. **Scalable**: Horizontal scaling via stateless services
6. **Secure**: Encryption at rest and in transit, GDPR compliant

---

## 3. Development Methodology: BMAD v6-alpha + TDD

### Current Status
- Official BMAD-METHOD v6-alpha CLI installed from _vendor/BMAD-METHOD
- Modules active: **core**, **bmb**, **bmm**, **cis** (with maintainer module **bmd** preserved)
- Codex CLI and Claude Code exports regenerated (mad/docs/codex-instructions.md, mad/docs/claude-code-instructions.md)
- Agents compiled via installer.compileAgents to keep YAML & Markdown in sync

### Workflow Overview
`
Analysis → Planning → Solutioning → Implementation → Review
           (workflow-status drives next action)
`
1. **workflow-status** (/bmad:bmm:workflows:workflow-status) parses docs/bmad/bmm-workflow-status.md
2. **Planning / Solutioning** leverage /bmad:bmm:workflows:prd and /bmad:bmm:workflows:tech-spec
3. **Implementation Loop** runs create-story → story-ready → dev-story → review-story
4. **Quality Gates** enforced via /bmad:bmm:workflows:retrospective plus platform TDD suites

### Installation & Maintenance Commands
`
cd _vendor/BMAD-METHOD
npm install
npm run install:bmad   # target project root, modules bmb/bmm/cis, ides codex/claude-code
`

**Automation snippet (skip IDE prompts during rebuilds):**
`
node -e "const path=require('node:path');
const ui=require('./tools/cli/lib/ui');
ui.UI.prototype.promptToolSelection = async () => ({ skipIde: true, ides: ['codex','claude-code'] });
const {Installer}=require('./tools/cli/installers/lib/core/installer');
(async()=>{const installer=new Installer();
  await installer.compileAgents({ directory: path.resolve('..','..') });})();"
`

**Regenerate manifests after copying module sources:**
`
node -e "const path=require('node:path');const {ManifestGenerator}=require('./tools/cli/installers/lib/core/manifest-generator');
(async()=>{const project=path.resolve('..','..');const bmad=path.join(project,'bmad');
  const gen=new ManifestGenerator();
  await gen.generateManifests(bmad,['bmb','bmm','cis'],[],{ ides:['codex','claude-code'], preservedModules:['bmd']});})();"
`

### Workflow Status File
- docs/bmad/bmm-workflow-status.md populated (Level 4 greenfield, current workflow prd)
- Update NEXT_ACTION, NEXT_COMMAND, and NEXT_AGENT after each workflow completes

### TDD Commitments
- Maintain failing test first → implementation → refactor loop
- Keep backend coverage ≥ 80%, platform frontend ≥ 85%
- Use BMAD TEA agent /bmad:bmm:agents:tea for test strategy reviews

---

## 3.1 BMAD Local Installation & Daily Workflow

### One-Time Environment Setup

BMAD v6-alpha is already baked into this repository via the official BMAD-METHOD CLI inside `_vendor/BMAD-METHOD/`. To set up your local environment:

```bash
cd _vendor/BMAD-METHOD
npx bmad-method install
```

**Note**: This only needs to be done **once per development environment** (e.g., once per developer machine, once per CI/CD runner).

The install command will:
- Compile agents from YAML to Markdown
- Generate manifests (agent-manifest.csv, workflow-manifest.csv, etc.)
- Set up IDE integrations for Codex CLI and Claude Code
- Ensure bmad/ directory structure is correct

### Day-to-Day Workflow Commands

Once installed, use these commands from anywhere in the project:

```bash
# Check current workflow status
npx bmad-method status

# View available workflows
npx bmad-method workflows

# Execute specific workflow
npx bmad-method run <workflow-name>
```

**Common workflows:**
- `/bmad:bmm:workflows:workflow-status` - Check project state and next action
- `/bmad:bmm:workflows:create-story` - Draft new user story
- `/bmad:bmm:workflows:dev-story` - Implement story with TDD
- `/bmad:bmm:workflows:review-story` - QA review cycle

### Progress Tracking (Critical)

After completing each sprint or major story, update:
- **`docs/bmad/BMAD_PROGRESS_TRACKER.md`** - Main progress log with test counts, metrics, completion status
- **`docs/bmad/bmm-workflow-status.md`** - Current workflow state (NEXT_ACTION, NEXT_COMMAND, NEXT_AGENT)

This keeps BMAD agents synchronized with actual project progress.

### TDD Cadence (Mandatory)

All development follows strict TDD:
1. **RED**: Write failing test first ❌
2. **GREEN**: Implement minimal code to pass ✅
3. **REFACTOR**: Clean up while keeping tests green ♻️

BMAD workflows enforce this cadence at every step.

### Further Reading

For deeper understanding of BMAD ceremony expectations, agent prompts, and documentation requirements, see:
- `docs/BMAD-METHOD-IMPLEMENTATION.md` - Full implementation record
- `docs/BMAD-V6-ADOPTION-GUIDE.md` - Adoption guide
- `.bmad-core/user-guide.md` - Workflow diagrams and user guide

---

## 4. Test-Driven Development (TDD)


### TDD Workflow (MANDATORY)

```
1. Write Test (RED)
   ↓
2. Run Test → Fails ✗
   ↓
3. Write Minimal Code
   ↓
4. Run Test → Passes ✓
   ↓
5. Refactor (keep tests green)
   ↓
6. Repeat for next feature
```

### Testing Stack

**Frontend**:
```typescript
// Vitest + React Testing Library
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('DealPipeline', () => {
  it('should render Kanban board', () => {
    render(<DealPipeline />);
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
  });
});
```

**Backend**:
```python
# pytest + httpx
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_deal(client: AsyncClient):
    response = await client.post("/api/deals", json={
        "name": "Test Deal",
        "stage": "sourcing"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "Test Deal"
```

### Coverage Requirements

- **Minimum**: 80% code coverage
- **Critical Paths**: 100% coverage (auth, payments, data security)
- **Run Coverage**: `npm run test:coverage` (frontend), `pytest --cov=app` (backend)

### Accessibility & Performance Testing

In addition to unit tests, we run automated accessibility and performance audits using **Lighthouse** and **Axe**.

#### Quality Gates

| Category | Minimum Score | Target Score |
|----------|--------------|--------------|
| Performance | 90% | 95%+ |
| Accessibility | 95% | 100% |
| Best Practices | 90% | 95%+ |
| SEO | 90% | 95%+ |

#### Running Audits Locally

**Automated (Recommended)**:
```bash
# From project root
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
```

**Manual**:
```bash
# Terminal 1: Start preview server
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx npm run preview:test

# Terminal 2: Run audits
cd frontend
npm run audit:local  # Runs both Lighthouse + Axe
```

**Reports Location**: `docs/testing/`
- `lighthouse-report.html` - Performance, accessibility, SEO metrics
- `lighthouse-report.json` - Machine-readable results
- `axe-report.json` - Detailed accessibility violations

#### NPM Scripts

```json
"preview:test": "vite preview --host 0.0.0.0 --port 4173 --strictPort",
"lighthouse:local": "lighthouse http://127.0.0.1:4173/ --output html --output json",
"axe:local": "axe http://127.0.0.1:4173/ --load-delay 5000 --timeout 60000",
"audit:local": "npm run lighthouse:local && npm run axe:local"
```

#### When to Run

- **Before every PR**: Ensure no regressions
- **After accessibility changes**: Verify fixes work
- **Before deployment**: Final quality gate

#### Documentation

See [docs/testing/ACCESSIBILITY-TESTING.md](docs/testing/ACCESSIBILITY-TESTING.md) for:
- Detailed testing guide
- Understanding reports
- Common violations and fixes
- CI/CD integration
- Troubleshooting

---

## 5. Code Conventions & Best Practices

### File Naming

**Frontend**:
- Components: `PascalCase.tsx` (e.g., `DealPipeline.tsx`)
- Hooks: `camelCase.ts` (e.g., `useDealPipeline.ts`)
- Utils: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Tests: `*.test.tsx` or `*.spec.tsx`

**Backend**:
- Modules: `snake_case.py` (e.g., `deal_service.py`)
- Classes: `PascalCase` (e.g., `class DealService`)
- Functions: `snake_case` (e.g., `def create_deal()`)
- Tests: `test_*.py` (e.g., `test_deal_service.py`)

### Code Style

**TypeScript**:
```typescript
// Use explicit types
interface Deal {
  id: string;
  name: string;
  stage: DealStage;
  createdAt: Date;
}

// Use functional components with hooks
export const DealPipeline: React.FC = () => {
  const { deals, loading } = useDealPipeline();
  
  if (loading) return <Spinner />;
  
  return <KanbanBoard deals={deals} />;
};

// Use React Query for API calls
const { data, isLoading } = useQuery({
  queryKey: ['deals'],
  queryFn: fetchDeals
});
```

**Python**:
```python
# Use type hints
from typing import List, Optional
from pydantic import BaseModel

class DealCreate(BaseModel):
    name: str
    stage: str
    organization_id: str

# Use async/await for I/O operations
async def create_deal(deal: DealCreate, db: AsyncSession) -> Deal:
    db_deal = Deal(**deal.dict())
    db.add(db_deal)
    await db.commit()
    await db.refresh(db_deal)
    return db_deal

# Use dependency injection
@router.post("/deals", response_model=DealResponse)
async def create_deal_endpoint(
    deal: DealCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await create_deal(deal, db)
```

### Commit Messages

Follow Conventional Commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(deal-pipeline): add Kanban drag-and-drop

- Implement react-beautiful-dnd integration
- Add stage transition validation
- Include comprehensive tests

Closes #123

---

fix(auth): resolve Clerk webhook signature validation

The webhook handler was failing due to incorrect header parsing.
Updated to use Clerk's official verification method.

Fixes #456

---

test(financial-engine): add ratio calculation tests

Added comprehensive test coverage for all 47 financial ratios.
Coverage increased from 65% to 92%.
```

---

## 6. Feature Implementation Guide

### Phase 1: Foundational Core (Months 1-3) - HIGH PRIORITY

**F-001: User & Organization Management**
- Multi-tenant architecture
- Clerk authentication integration
- RBAC implementation
- Master Admin Portal

**F-002: Deal Flow & Pipeline Management**
- Kanban board (react-beautiful-dnd)
- Custom pipeline stages
- Deal CRUD operations
- Team collaboration

**F-003: Secure Document & Data Room**
- File upload/download
- Folder hierarchy
- Access permissions
- Version control

**F-005: Subscription & Billing**
- Stripe integration
- 4 subscription tiers
- Webhook handling
- Billing portal

**F-006: Financial Intelligence Engine**
- Accounting platform integrations (Xero, QuickBooks, Sage, NetSuite)
- 47+ financial ratio calculations
- AI-generated narratives (GPT-4)
- Deal Readiness Score

**F-007: Multi-Method Valuation Suite**
- DCF valuation
- Comparables analysis
- Precedent transactions
- Sensitivity analysis

### Phase 2: Advanced Intelligence (Months 4-6) - MEDIUM PRIORITY

**F-004: Task Management & Workflow Automation**
**F-008: Intelligent Deal Matching**
**F-009: Automated Document Generation**
**F-010: Content Creation & Lead Generation Hub**

### Phase 3: Ecosystem & Network Effects (Months 7-12) - LOWER PRIORITY

**F-011: Podcast & Video Production Studio**
**F-012: Event Management Hub**
**F-013: Professional Community Platform**

---

## 7. Database Schema Principles

### Multi-Tenancy

Every table (except `users` and `organizations`) must have an `organization_id` foreign key:

```python
class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organization = relationship("Organization", back_populates="deals")
```

### Indexes

Add indexes for frequently queried fields:

```python
__table_args__ = (
    Index('idx_deals_organization_id', 'organization_id'),
    Index('idx_deals_stage', 'stage'),
    Index('idx_deals_created_at', 'created_at'),
)
```

### Migrations

Always create migrations for schema changes:

```bash
# Create migration
alembic revision --autogenerate -m "Add deals table"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 8. API Design Principles

### RESTful Conventions

```
GET    /api/deals           # List all deals
POST   /api/deals           # Create deal
GET    /api/deals/{id}      # Get specific deal
PUT    /api/deals/{id}      # Update deal
DELETE /api/deals/{id}      # Delete deal

# Nested resources
GET    /api/deals/{id}/documents
POST   /api/deals/{id}/documents
```

### Request/Response Format

**Request**:
```json
{
  "name": "Acme Corp Acquisition",
  "stage": "due_diligence",
  "deal_size": 5000000,
  "currency": "GBP"
}
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corp Acquisition",
  "stage": "due_diligence",
  "deal_size": 5000000,
  "currency": "GBP",
  "created_at": "2025-10-23T10:30:00Z",
  "updated_at": "2025-10-23T10:30:00Z",
  "organization_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

### Error Handling

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid deal stage",
    "details": {
      "field": "stage",
      "allowed_values": ["sourcing", "evaluation", "due_diligence", "negotiation", "closing"]
    }
  }
}
```

---

## 9. Security Requirements

### Authentication

- All API endpoints require authentication (except public landing page)
- Use Clerk JWT tokens for authentication
- Validate tokens on every request

```python
from fastapi import Depends, HTTPException
from app.core.auth import get_current_user

@router.get("/deals")
async def get_deals(current_user: User = Depends(get_current_user)):
    # current_user is guaranteed to be authenticated
    pass
```

### Authorization

- Check organization membership before data access
- Validate RBAC permissions for sensitive operations

```python
async def get_deal(deal_id: str, current_user: User, db: AsyncSession):
    deal = await db.get(Deal, deal_id)
    
    if deal.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return deal
```

### Data Protection

- Encrypt sensitive data at rest (financial data, documents)
- Use HTTPS for all communications
- Sanitize all user inputs
- Implement rate limiting

---

## 10. AI Integration Guidelines

### OpenAI GPT-4 (Financial Narratives)

```python
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_financial_narrative(ratios: dict) -> str:
    prompt = f"""
    Analyze the following financial ratios and provide a concise narrative summary:
    
    Liquidity Ratios:
    - Current Ratio: {ratios['current_ratio']}
    - Quick Ratio: {ratios['quick_ratio']}
    
    Profitability Ratios:
    - Gross Margin: {ratios['gross_margin']}%
    - Net Margin: {ratios['net_margin']}%
    
    Provide a 2-3 paragraph analysis highlighting strengths, weaknesses, and key insights.
    """
    
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    
    return response.choices[0].message.content
```

### Anthropic Claude 3 (Deal Matching)

```python
from anthropic import AsyncAnthropic

client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

async def match_deals(sell_side: dict, buy_side_list: list) -> list:
    prompt = f"""
    Analyze this sell-side mandate and rank the following buy-side opportunities:
    
    Sell-Side: {json.dumps(sell_side)}
    Buy-Side Opportunities: {json.dumps(buy_side_list)}
    
    Provide a ranked list with confidence scores and rationale.
    """
    
    response = await client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return parse_match_results(response.content)
```

---

## 11. Performance Optimization

### Frontend

- Use React.lazy() for code splitting
- Implement virtual scrolling for large lists (react-window)
- Optimize images (WebP format, lazy loading)
- Use React Query for caching and deduplication

### Backend

- Use database connection pooling
- Implement Redis caching for frequently accessed data
- Use async/await for I/O operations
- Batch database queries where possible

### Database

- Add indexes for frequently queried fields
- Use EXPLAIN ANALYZE to optimize slow queries
- Implement pagination for large result sets
- Use database views for complex queries

---

## 12. Deployment & DevOps

### Environment Variables

Always use environment variables for:
- API keys and secrets
- Database connection strings
- Feature flags
- External service URLs

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Frontend Tests
        run: cd frontend && npm install && npm test
      - name: Run Backend Tests
        run: cd backend && pip install -r requirements.txt && pytest
```

### Render Deployment

- Frontend: Static Site (auto-deploy from `main` branch)
- Backend: Web Service (auto-deploy from `main` branch)
- Database: PostgreSQL (managed service)
- Redis: Redis (managed service)

---

## 13. Common Patterns & Examples

### Creating a New Feature (TDD)

```bash
# 1. Read the story
cat docs/bmad/stories/deal-pipeline-kanban.md

# 2. Write test first (RED)
# frontend/src/components/DealPipeline.test.tsx

# 3. Run test (should fail)
npm test

# 4. Implement minimal code (GREEN)
# frontend/src/components/DealPipeline.tsx

# 5. Run test (should pass)
npm test

# 6. Refactor (keep tests green)
# Improve code quality, add comments

# 7. Commit
git add .
git commit -m "feat(deal-pipeline): add Kanban board component"
```

### Adding a New API Endpoint

```python
# 1. Write test first
# tests/api/test_deals.py
@pytest.mark.asyncio
async def test_create_deal(client, auth_headers):
    response = await client.post(
        "/api/deals",
        json={"name": "Test Deal", "stage": "sourcing"},
        headers=auth_headers
    )
    assert response.status_code == 201

# 2. Create schema
# app/schemas/deal.py
class DealCreate(BaseModel):
    name: str
    stage: str

# 3. Create model
# app/models/deal.py
class Deal(Base):
    __tablename__ = "deals"
    id = Column(UUID, primary_key=True)
    name = Column(String)
    stage = Column(String)

# 4. Create service
# app/services/deal_service.py
async def create_deal(deal: DealCreate, db: AsyncSession) -> Deal:
    db_deal = Deal(**deal.dict())
    db.add(db_deal)
    await db.commit()
    return db_deal

# 5. Create endpoint
# app/api/deals.py
@router.post("/deals", response_model=DealResponse)
async def create_deal_endpoint(
    deal: DealCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_deal(deal, db)
```

---

## 14. Troubleshooting

### Common Issues

**Issue**: Tests failing with "Module not found"
**Solution**: Ensure all dependencies are installed (`npm install` or `pip install -r requirements.txt`)

**Issue**: Database connection errors
**Solution**: Check `DATABASE_URL` in `.env` file, ensure PostgreSQL is running

**Issue**: Clerk authentication not working
**Solution**: Verify `CLERK_SECRET_KEY` and `VITE_CLERK_PUBLISHABLE_KEY` are set correctly

**Issue**: Stripe webhooks not received
**Solution**: Use Stripe CLI for local testing: `stripe listen --forward-to localhost:8000/api/webhooks/stripe`

---

## 15. Resources & Documentation

### Internal Documentation
- **PRD**: `docs/bmad/prd.md`
- **Architecture**: `docs/bmad/technical_specifications.md`
- **Stories**: `docs/bmad/stories/`
- **Progress Tracker**: `docs/bmad/BMAD_PROGRESS_TRACKER.md`
- **Current Methodology**: `docs/BMAD-METHOD-IMPLEMENTATION.md` (BMAD-inspired approach)
- **API Docs**: Auto-generated at `/api/docs` (FastAPI)

### External Resources
- **React Docs**: https://react.dev
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Clerk Docs**: https://clerk.com/docs
- **Stripe Docs**: https://stripe.com/docs

### Optional: Official BMAD-METHOD Framework
- **BMAD Method Repository**: https://github.com/bmad-code-org/BMAD-METHOD
- **v6-alpha Reference Guide**: `docs/BMAD-V6-ALPHA-REFERENCE.md` (if you want to adopt official framework)
- **Adoption Guide**: `docs/BMAD-V6-ADOPTION-GUIDE.md` (migration planning)
- **Local Reference**: `_vendor/BMAD-METHOD/` (v6-alpha source for reference only)

---

## 16. AI Assistant Instructions

### When Implementing Features

1. **Always read the story first**: `docs/bmad/stories/[feature-name].md`
2. **Write tests before code**: Follow TDD strictly
3. **Use type hints**: TypeScript types, Python type hints
4. **Follow conventions**: File naming, code style, commit messages
5. **Check coverage**: Ensure 80%+ code coverage
6. **Update documentation**: If behavior changes, update docs

### When Debugging

1. **Read error messages carefully**: They usually tell you exactly what's wrong
2. **Check environment variables**: Many issues are due to missing/incorrect env vars
3. **Run tests**: `npm test` or `pytest` to identify failing tests
4. **Check logs**: Sentry for production, console for development
5. **Ask for clarification**: If requirements are unclear, ask the user

### When Refactoring

1. **Ensure tests pass first**: Green before refactoring
2. **Refactor incrementally**: Small changes, run tests frequently
3. **Keep tests green**: If tests fail, revert and try again
4. **Improve readability**: Clear variable names, comments where needed
5. **Remove dead code**: Delete unused imports, functions, files

---

**End of CLAUDE.md**

This file should be referenced for all AI-assisted development on this project. When in doubt, follow the patterns and conventions outlined here, and always prioritize Test-Driven Development.

**Happy coding! 🚀**

