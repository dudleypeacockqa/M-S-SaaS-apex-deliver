# M&A Intelligence Platform - AI Development Context

**Document Purpose**: This file provides comprehensive context for AI coding assistants (Claude Code, CODEX) to understand the project, architecture, conventions, and development approach.

**Last Updated**: October 27, 2025
**Project Version**: 2.0 (Full Production)
**Methodology**: BMAD-Inspired Agile with Test-Driven Development (TDD)
**Note**: Following BMAD principles manually (not using official BMAD-METHOD framework)

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

## 3. Development Methodology: BMAD-Inspired Agile with TDD

### Important Clarification

**This project follows BMAD principles but does NOT use the official BMAD-METHOD framework/tooling.**

What we DO:
- ✅ Follow BMAD structure (PRD → Architecture → Stories → Implementation)
- ✅ Use BMAD principles (Business-first, Architecture-driven, Iterative, Test-driven)
- ✅ Organize docs in `docs/bmad/` directory
- ✅ Track progress with Sprint planning

What we DON'T do:
- ❌ Use BMAD CLI commands (`*po shard prd`, `*sm draft next`, etc.)
- ❌ Use BMAD agents or automated workflows
- ❌ Run `npx bmad-method install`

**Why this approach?** Manual control, proven workflow through 4 sprints, production deployment successful.

**Official BMAD-METHOD reference**: Available in `_vendor/BMAD-METHOD/` and `docs/BMAD-V6-ALPHA-REFERENCE.md` if you want to adopt the official framework later.

### Core Workflow (Manual BMAD-Inspired)

```
Planning → Story Creation → Implementation → QA → Deploy
   (PO)      (Manual)         (AI Dev + TDD)   (Auto)  (Auto)
```

**Key Point**: Stories are created manually by humans, then implemented by AI following TDD.

### Team Roles (Manual Implementation)

**Product Owner (Human)**:
- Creates `docs/bmad/prd.md` (Product Requirements Document)
- Writes user stories manually in `docs/bmad/stories/`
- Maintains `docs/bmad/technical_specifications.md` (Architecture)
- No automation - all manual planning

**Developer (AI - Claude Code)**:
- Implements features following TDD (Write test → Implement → Refactor)
- Writes tests first, then implementation
- Follows story specifications exactly
- Uses CLAUDE.md for project context

**QA (Automated Tests)**:
- Runs test suites automatically (npm test / pytest)
- Validates code coverage (minimum 80%)
- Checks code quality and linting (ESLint/Black)

### Current Development Workflow

```bash
# Story Management (100% Manual)
# 1. Create story file manually: docs/bmad/stories/DEV-XXX-feature-name.md
# 2. Write story details following template
# 3. Track progress in: docs/bmad/BMAD_PROGRESS_TRACKER.md

# Development with Claude Code
claude-code -d "Implement [feature] following TDD. Reference docs/bmad/stories/[story].md"

# Example
claude-code -d "Implement DEV-010 Financial Intelligence Engine following TDD. See docs/bmad/stories/DEV-010-financial-intelligence-engine.md"
```

### Optional: Adopt Official BMAD-METHOD Framework

If you want to use the **official BMAD-METHOD framework** with automated agents and workflows:

**Installation**:
```bash
cd _vendor/BMAD-METHOD
npm install
npm run install:bmad
```

**Commands Available** (after installation):
```bash
*prd                   # Scale-adaptive project planning (PM agent)
*create-story          # SM drafts story automatically
*story-ready           # SM approves for development
*dev-story             # DEV agent implements
*story-done            # Mark complete
*review-story          # Quality validation
```

**Migration Guide**: See `docs/BMAD-V6-ALPHA-REFERENCE.md` for complete documentation.

**Current Status**: Not using official framework - manual workflow is working well.

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

