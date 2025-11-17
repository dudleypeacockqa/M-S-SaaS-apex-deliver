# M&A Intelligence Platform - Technical Specification (v1.2 Enhancements)

**Author:** BMad
**Date:** 2025-11-17
**Project Level:** 1 (Coherent Feature Set)
**Change Type:** Polish & Optimization
**Development Context:** Brownfield - Post-Production Enhancement

---

## Context

### Available Documents

**Documents Loaded:**
- ✅ **PRD** (docs/PRD.md) - Comprehensive product requirements for M&A Intelligence Platform
- ✅ **Architecture** (docs/architecture.md) - System design, integration patterns, infrastructure
- ✅ **Project Documentation** (docs/index.md) - Brownfield codebase structure and quick reference
- ✅ **Progress Tracker** (docs/bmad/BMAD_PROGRESS_TRACKER.md) - v1.0/v1.1 completion metrics

**Key Insights:**
- Production platform at v1.1.0 with 13/13 features complete
- 2,821 tests passing (100% pass rate)
- Backend coverage: 84.0%, Frontend coverage: 85.1%
- Lighthouse performance: 63-69% (needs optimization)
- TODOs identified: 11 backend, 12 frontend

### Project Stack

**Backend Stack:**
- **Runtime:** Python 3.11+
- **Framework:** FastAPI 0.104.1
- **Web Server:** Uvicorn 0.24.0 (standard)
- **Database ORM:** SQLAlchemy 2.0.23 with Alembic 1.13.0 migrations
- **Database Driver:** asyncpg 0.29.0 (PostgreSQL), psycopg2-binary 2.9.9
- **Validation:** Pydantic 2.8.2, pydantic-settings 2.1.0
- **Authentication:** Clerk Backend API 1.0.0
- **Payments:** Stripe ≥8.0.0
- **Task Queue:** Celery 5.3.4 + Redis 5.0.1
- **AI Services:** OpenAI ≥1.3.0
- **Testing:** pytest 7.4.3, pytest-asyncio 0.21.1, pytest-cov 4.1.0
- **HTTP Clients:** httpx 0.27.0, requests 2.32.3

**Frontend Stack:**
- **Runtime:** Node.js 20.x
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.2.2
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.4.17
- **Routing:** React Router DOM 7.9.4
- **State Management:** Zustand 5.0.8, @tanstack/react-query 5.90.5
- **Authentication:** @clerk/clerk-react 5.53.3
- **Testing:** Vitest 4.0.8, @testing-library/react 16.3.0, jsdom 27.2.0
- **Coverage:** @vitest/coverage-v8 4.0.4
- **Performance:** Lighthouse 11.7.0, @axe-core/cli 4.11.0
- **Drag & Drop:** @hello-pangea/dnd 18.0.1
- **Charts:** recharts 3.4.1

**Infrastructure:**
- **Hosting:** Render (Python web service + static site)
- **Database:** PostgreSQL 15+ (managed)
- **Cache:** Redis (managed)
- **Storage:** Cloudflare R2 / S3 (boto3 ≥1.28.0)
- **CI/CD:** GitHub Actions
- **Monitoring:** Datadog, Sentry

### Existing Codebase Structure

**Monorepo Layout:**
```
M-S-SaaS-apex-deliver/
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── main.py       # FastAPI app initialization
│   │   ├── core/         # Config, security, database
│   │   ├── api/routes/   # Domain routers (deals, documents, etc.)
│   │   ├── services/     # Business logic layer
│   │   ├── models/       # SQLAlchemy ORM models
│   │   └── schemas/      # Pydantic request/response schemas
│   ├── alembic/          # Database migrations
│   ├── tests/            # pytest suites (84% coverage, 1,089 tests)
│   └── requirements.txt
├── frontend/             # React/Vite SPA
│   ├── src/
│   │   ├── main.tsx      # Entry point
│   │   ├── App.tsx       # Lazy-loaded routes
│   │   ├── components/   # Domain components (marketing, deals, etc.)
│   │   ├── pages/        # Route screens
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client wrappers
│   │   └── styles/       # Tailwind config
│   ├── tests/            # Vitest suites (85.1% coverage, 1,735 tests)
│   └── package.json
├── docs/                 # BMAD artifacts, runbooks
├── .bmad/                # BMAD workflow definitions
└── scripts/              # Utilities, smoke tests
```

**Code Organization Patterns:**
- **Backend:** Service-oriented architecture with clear separation (routes → services → models)
- **Frontend:** Component-based with domain-specific folders (marketing/, deals/, documents/, etc.)
- **Testing:** Colocated tests (`.test.tsx`, `test_*.py`) with domain mirroring
- **Naming:** Backend uses `snake_case`, Frontend uses `PascalCase` for components, `camelCase` for functions

**Testing Patterns:**
- **Backend:** pytest with async support, fixtures in `conftest.py`, 84% coverage target
- **Frontend:** Vitest + React Testing Library, 85.1% coverage, accessibility tests with axe
- **Integration:** API smoke tests, end-to-end scenarios
- **Performance:** Lighthouse audits (target: 90%+)

---

## The Change

### Problem Statement

The M&A Intelligence Platform successfully shipped v1.0 and v1.1 with all 13 core features complete and production-deployed. However, technical debt remains in the form of:

1. **23 TODO comments** scattered across codebase (11 backend, 12 frontend) indicating incomplete optimizations
2. **Suboptimal performance** - Lighthouse scores at 63-69% vs 90%+ industry standard
3. **Coverage gaps** - Backend at 84%, Frontend at 85.1% vs 90%+ target
4. **Missing production tooling** - No monitoring dashboard, analytics integration incomplete
5. **Document export queue lacks UI** - Background jobs run but no user-facing status

These gaps prevent the platform from achieving "100% polish" status expected of enterprise SaaS products.

### Proposed Solution

**v1.2 Enhancement Epic** - Systematic resolution of all technical debt through 5 coordinated work streams:

**Stream 1: Backend TODO Resolution**
- Implement pagination for community endpoints
- Add metric caching to dashboard routes
- Complete document generation file creation
- Implement ratio optimization for financial endpoints
- Add permission checks for community moderation
- Wire background task triggers

**Stream 2: Frontend TODO Resolution**
- Connect bulk action API endpoints
- Enhance drag-and-drop in ProspectKanban
- Implement permission management APIs
- Add audit log integration
- Build confirmation dialogs
- Complete analytics tracking hooks

**Stream 3: Performance Optimization**
- Expand code splitting with React.lazy()
- Optimize images (WebP, lazy loading)
- Integrate CDN for static assets
- Tune backend API response times
- Reduce bundle size
- Achieve Lighthouse Performance 90%+

**Stream 4: Test Coverage Enhancement**
- Add edge case tests for all services (backend)
- Expand integration test scenarios (backend)
- Cover error paths comprehensively (backend)
- Add missing component test cases (frontend)
- Expand accessibility test coverage (frontend)
- Achieve 90%+ coverage (both stacks)

**Stream 5: Production Polish**
- Build document export queue UI with status polling
- Create performance monitoring dashboard
- Integrate analytics tracking comprehensively
- Add real-time health monitoring

### Scope

**In Scope:**

1. ✅ **All 23 TODO Resolutions** - Complete every TODO/FIXME in codebase
2. ✅ **Performance Optimization** - Lighthouse Performance score ≥90%
3. ✅ **Coverage Enhancement** - Backend ≥90%, Frontend ≥90%
4. ✅ **Export Queue UI** - User-facing status for background document jobs
5. ✅ **Monitoring Dashboard** - Internal performance tracking console
6. ✅ **Analytics Integration** - Complete event tracking implementation
7. ✅ **Documentation Updates** - Release notes, progress tracker, deployment guides

**Out of Scope:**

1. ❌ **New Features** - No new epics from PRD (F-001 through F-013 remain unchanged)
2. ❌ **Breaking Changes** - All enhancements backward-compatible
3. ❌ **Schema Migrations** - No database model changes
4. ❌ **Third-Party Integrations** - No new external services beyond existing stack
5. ❌ **UI/UX Redesign** - Visual design remains consistent with v1.1
6. ❌ **Infrastructure Changes** - Render deployment model unchanged

---

## Implementation Details

### Source Tree Changes

**Backend Changes:**

**MODIFY - Dashboard Routes** (`backend/app/api/routes/dashboard.py`)
- Lines 42, 80, 99, 118: Replace TODO stubs with real metric queries
- Add caching layer using Redis for expensive aggregations
- Implement proper error handling for missing models

**MODIFY - Community Routes** (`backend/app/api/routes/community.py`)
- Lines 437, 452: Add RBAC permission checks for moderator actions
- Implement pagination for community listings
- Add rate limiting for moderation endpoints

**MODIFY - Financial Routes** (`backend/app/api/routes/financial.py`)
- Lines 189, 309: Query FinancialRatio and FinancialNarrative models
- Add response caching for ratio calculations
- Optimize narrative generation with parallel AI calls

**MODIFY - Document Generation Routes** (`backend/app/api/routes/document_generation.py`)
- Line 686: Resolve created_by from User model
- Line 802: Trigger Celery task for background processing
- Add job status tracking endpoints

**MODIFY - Document Generation Service** (`backend/app/services/document_generation_service.py`)
- Line 198: Implement PDF/DOCX file generation when generate_file=True
- Use ReportLab for PDFs, python-docx for DOCX
- Store files in R2/S3 via storage service

**CREATE - Export Queue Service** (`backend/app/services/export_queue_service.py`)
- Job status tracking (pending, processing, completed, failed)
- Queue management with Redis
- Webhook notifications on completion

**Frontend Changes:**

**MODIFY - Bulk Actions Hook** (`frontend/src/hooks/useBulkActions.ts`)
- Lines 84, 180, 220: Connect to actual API endpoints
- Add optimistic updates with React Query
- Implement rollback on errors

**MODIFY - Prospect Kanban** (`frontend/src/components/master-admin/prospects/ProspectKanban.tsx`)
- Line 155: Enhance with @hello-pangea/dnd for drag-and-drop
- Add visual feedback during drag
- Persist stage changes via API

**MODIFY - Document Workspace** (`frontend/src/pages/documents/DocumentWorkspace.tsx`)
- Lines 117, 130, 215: Connect permission API, audit logs, confirmations
- Add real-time collaboration indicators
- Implement permission management UI

**MODIFY - Dashboard Page** (`frontend/src/pages/DashboardPage.tsx`)
- Line 349: Replace mock tasks with real API integration
- Add loading states and error boundaries
- Implement real-time updates

**MODIFY - Marketing Layout** (`frontend/src/components/marketing/MarketingLayout.tsx`)
- Line 24: Update contact telephone to real number
- Add A/B testing hooks for analytics
- Implement conversion tracking

**CREATE - Export Queue UI** (`frontend/src/components/documents/ExportQueue.tsx`)
- Real-time job status polling
- Progress indicators with recharts
- Download links on completion
- Retry/cancel actions

**CREATE - Performance Dashboard** (`frontend/src/pages/master-admin/PerformanceDashboard.tsx`)
- Lighthouse score history chart
- API response time graphs
- Error rate monitoring
- User activity metrics

**Testing Additions:**

**Backend Tests** (Estimated +320 tests):
- `tests/api/test_dashboard_metrics.py` - Dashboard caching and real metrics
- `tests/api/test_community_permissions.py` - RBAC enforcement
- `tests/services/test_export_queue_service.py` - Job lifecycle
- `tests/services/test_document_generation.py` - File generation edge cases
- Edge case coverage for all services

**Frontend Tests** (Estimated +280 tests):
- `src/components/documents/ExportQueue.test.tsx` - Queue UI interactions
- `src/pages/master-admin/PerformanceDashboard.test.tsx` - Dashboard rendering
- `src/hooks/useBulkActions.test.ts` - API integration
- Accessibility tests for all modified components

### Technical Approach

**Phase 1: Backend TODO Resolution (TDD Cycle)**
1. **RED:** Write failing tests for each TODO item
2. **GREEN:** Implement minimal code to pass tests
3. **REFACTOR:** Optimize with caching, error handling

**Caching Strategy:**
- Use Redis for dashboard metrics (TTL: 5 minutes)
- Cache financial ratios per organization (TTL: 1 hour)
- Invalidate cache on data mutations

**Background Jobs:**
- Celery workers consume document generation queue
- Job status stored in Redis with 24-hour expiry
- WebSocket notifications for real-time updates (future enhancement)

**Phase 2: Frontend TODO Resolution (TDD Cycle)**
1. **RED:** Write component tests expecting API integration
2. **GREEN:** Connect to backend endpoints
3. **REFACTOR:** Add optimistic updates, error handling

**Drag & Drop Implementation:**
- Use @hello-pangea/dnd (already in package.json)
- Follow existing pattern in DealPipeline (if applicable)
- Persist state changes via PATCH /api/prospects/:id

**Phase 3: Performance Optimization**
- **Code Splitting:** Lazy load all route components (expand beyond current)
- **Image Optimization:** Convert PNGs to WebP, implement lazy loading
- **Bundle Analysis:** Use rollup-plugin-visualizer (added to package.json)
- **API Tuning:** Profile slow endpoints with Datadog APM, add indexes

**Performance Targets:**
- Lighthouse Performance: 90%+
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

**Phase 4: Coverage Enhancement (TDD by Definition)**
- **Gap Analysis:** Use coverage reports to identify untested code
- **RED:** Write tests for uncovered lines/branches
- **GREEN:** Verify tests pass
- **REFACTOR:** Remove dead code if discovered

**Coverage Strategy:**
- Backend: Target critical paths (services, API routes) first
- Frontend: Component interaction tests, accessibility tests
- Integration: End-to-end scenarios with real API calls

### Existing Patterns to Follow

**Backend Patterns:**

**Service Layer:**
```python
# Pattern: backend/app/services/deal_service.py
async def create_deal(deal: DealCreate, db: AsyncSession) -> Deal:
    """Service methods are async, use SQLAlchemy sessions"""
    db_deal = Deal(**deal.dict())
    db.add(db_deal)
    await db.commit()
    await db.refresh(db_deal)
    return db_deal
```

**Route Handlers:**
```python
# Pattern: backend/app/api/routes/deals.py
@router.post("/deals", response_model=DealResponse)
async def create_deal_endpoint(
    deal: DealCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Routes use dependency injection, validate with Pydantic"""
    return await deal_service.create_deal(deal, db)
```

**Testing:**
```python
# Pattern: backend/tests/api/test_deals.py
@pytest.mark.asyncio
async def test_create_deal(client: AsyncClient, auth_headers: dict):
    """Tests use AsyncClient, fixtures from conftest.py"""
    response = await client.post("/api/deals", json={...}, headers=auth_headers)
    assert response.status_code == 201
```

**Frontend Patterns:**

**Component Structure:**
```tsx
// Pattern: frontend/src/components/deals/DealCard.tsx
export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { mutate: updateDeal } = useMutation({...});
  return <Card>...</Card>;
};
```

**API Integration:**
```tsx
// Pattern: frontend/src/hooks/useDeals.ts
export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await axios.get('/api/deals');
      return response.data;
    }
  });
};
```

**Testing:**
```tsx
// Pattern: frontend/src/components/deals/DealCard.test.tsx
describe('DealCard', () => {
  it('should render deal information', () => {
    render(<DealCard deal={mockDeal} />);
    expect(screen.getByText(mockDeal.name)).toBeInTheDocument();
  });
});
```

**Code Style Conventions:**
- **Backend:** snake_case, async/await, type hints, docstrings
- **Frontend:** PascalCase (components), camelCase (functions), explicit types
- **Testing:** Descriptive test names, AAA pattern (Arrange-Act-Assert)
- **Commits:** Conventional Commits (feat/fix/test/docs/refactor)

### Integration Points

**Internal Module Dependencies:**

**Backend:**
- `app.core.database` → All services requiring DB access
- `app.core.security` → All routes requiring authentication
- `app.core.subscription` → Entitlement-gated features
- `app.services.storage_service` → Document upload/download
- `app.tasks.task_automation` → Background job triggers

**Frontend:**
- `src/hooks/useAuth` → Clerk authentication state
- `src/services/api` → Centralized axios client
- `@tanstack/react-query` → Server state management
- `src/components/ui/*` → Shared Tailwind primitives

**External Service Integration:**
- **Clerk API:** JWT verification on every backend request
- **Stripe API:** Subscription webhooks, checkout sessions
- **OpenAI API:** Financial narrative generation (concurrent calls for optimization)
- **Cloudflare R2:** Document storage with signed URLs
- **Redis:** Caching + Celery task queue

**Data Flow:**
```
Frontend (React Query)
  → API Route (/api/*)
    → Service Layer (business logic)
      → Database (SQLAlchemy)
      → External APIs (Clerk, Stripe, OpenAI)
      → Storage (R2/S3)
    → Celery Tasks (async processing)
      → Redis (queue + cache)
```

---

## Development Context

### Relevant Existing Code

**Backend References:**

**Dashboard Metrics:**
- See `backend/app/services/deal_service.py` for query patterns
- Reference `backend/app/core/database.py` for session management
- Follow caching pattern in `backend/app/api/routes/valuation.py` (if exists)

**Document Generation:**
- Existing pattern: `backend/app/services/document_generation_service.py:1-197`
- Storage integration: `backend/app/services/s3_storage_service.py`
- File handling: `backend/app/services/storage_service.py`

**Community Moderation:**
- RBAC pattern: `backend/app/core/security.py` (permission checking)
- User role checks: `backend/app/models/user.py` or organization membership

**Frontend References:**

**Drag & Drop:**
- Check if DealPipeline uses drag-and-drop (pattern to follow)
- Location: `frontend/src/components/deals/*` or `frontend/src/pages/deals/*`

**API Integration:**
- Service pattern: `frontend/src/services/*` (axios wrappers)
- Query hooks: `frontend/src/hooks/use*.ts`

**Component Testing:**
- Example: `frontend/src/components/marketing/MarketingLayout.test.tsx`
- Accessibility: `frontend/src/pages/*/accessibility.test.tsx` (if exists)

### Dependencies

**Framework/Libraries (Backend):**
- FastAPI 0.104.1 - Web framework
- SQLAlchemy 2.0.23 - ORM with async support
- Pydantic 2.8.2 - Request/response validation
- Clerk Backend API 1.0.0 - Authentication
- Stripe ≥8.0.0 - Payments
- Celery 5.3.4 - Task queue
- Redis 5.0.1 - Cache + queue backend
- OpenAI ≥1.3.0 - AI narratives
- ReportLab ≥4.0.0 - PDF generation
- python-docx ≥1.1.0 - DOCX generation
- pytest 7.4.3 - Testing framework
- pytest-cov 4.1.0 - Coverage reporting

**Framework/Libraries (Frontend):**
- React 19.1.1 - UI framework
- Vite 7.2.2 - Build tool
- TypeScript 5.9.3 - Type safety
- Tailwind CSS 3.4.17 - Styling
- @tanstack/react-query 5.90.5 - Data fetching
- @clerk/clerk-react 5.53.3 - Authentication
- Zustand 5.0.8 - State management
- @hello-pangea/dnd 18.0.1 - Drag & drop
- Recharts 3.4.1 - Charts
- Vitest 4.0.8 - Testing framework
- Lighthouse 11.7.0 - Performance audits
- rollup-plugin-visualizer 6.0.5 - Bundle analysis

**Internal Modules (Backend):**
- `app.core.config.Settings` - Environment configuration
- `app.core.database.get_db` - DB session dependency
- `app.core.security.get_current_user` - Auth dependency
- `app.services.*` - All domain services
- `app.models.*` - SQLAlchemy models
- `app.schemas.*` - Pydantic schemas

**Internal Modules (Frontend):**
- `src/hooks/useAuth` - Clerk authentication
- `src/services/api` - Axios client
- `src/components/ui/*` - Design system primitives
- `src/utils/*` - Helper functions

### Configuration Changes

**Backend (.env):**
```bash
# No new environment variables required
# Existing vars used:
# - DATABASE_URL (PostgreSQL)
# - REDIS_URL (Cache + Celery)
# - CLERK_SECRET_KEY (Auth)
# - STRIPE_SECRET_KEY (Payments)
# - OPENAI_API_KEY (AI)
# - R2_* or AWS_* (Storage)
```

**Frontend (.env.local):**
```bash
# No new environment variables required
# Existing vars used:
# - VITE_API_URL (Backend endpoint)
# - VITE_CLERK_PUBLISHABLE_KEY (Auth)
```

**Backend Configuration Updates:**
- `backend/app/core/config.py`: Ensure `enable_caching` and `redis_url` configured
- Celery settings: Worker concurrency, task routing

**Frontend Build Configuration:**
- `vite.config.ts`: Add bundle visualization plugin
- `package.json`: Ensure rollup-plugin-visualizer in devDependencies (✅ added)

**CI/CD Updates:**
- GitHub Actions: Add Lighthouse CI step
- Coverage thresholds: Update to 90%

### Existing Conventions (Brownfield)

**File Organization:**
- Backend: Domain-based grouping (`routes/deals.py`, `services/deal_service.py`)
- Frontend: Feature folders (`components/deals/`, `pages/deals/`)
- Tests: Mirror source structure

**Naming Conventions:**
- Backend files: `snake_case.py`
- Backend classes: `PascalCase`
- Backend functions: `snake_case()`
- Frontend files: `PascalCase.tsx` (components), `camelCase.ts` (utilities)
- Frontend components: `PascalCase`
- Frontend functions: `camelCase()`

**Code Style:**
- Backend: Follow PEP 8, use type hints, async/await patterns
- Frontend: ESLint config in `eslint.config.js`, TypeScript strict mode
- Formatting: Backend adhoc, Frontend via ESLint
- Imports: Absolute imports preferred (`app.*` backend, `src/*` frontend)

**Error Handling:**
- Backend: Raise HTTPException with status codes
- Frontend: Try-catch in async functions, error boundaries for React

**Logging:**
- Backend: Use Python logging module (configured in main.py)
- Frontend: Console methods, Sentry integration for production

**Documentation:**
- Backend: Docstrings for public functions/classes
- Frontend: JSDoc for complex functions
- API: OpenAPI auto-generated at `/api/docs`

### Test Framework & Standards

**Backend Testing:**
- **Framework:** pytest 7.4.3
- **Async Support:** pytest-asyncio 0.21.1
- **Coverage Tool:** pytest-cov 4.1.0
- **File Naming:** `test_*.py` or `*_test.py`
- **Location:** `backend/tests/` mirroring `backend/app/`
- **Fixtures:** Centralized in `conftest.py`
- **Assertions:** Native `assert` statements
- **Mocking:** `unittest.mock`, `pytest-mock`
- **Coverage Target:** ≥90% (currently 84%)
- **Command:** `pytest --cov=app --cov-report=term --cov-report=json`

**Frontend Testing:**
- **Framework:** Vitest 4.0.8
- **DOM Testing:** @testing-library/react 16.3.0
- **User Events:** @testing-library/user-event 14.6.1
- **Assertions:** Vitest expect, @testing-library/jest-dom
- **File Naming:** `*.test.tsx` or `*.spec.tsx`
- **Location:** Colocated with components
- **Mocking:** MSW 2.12.1 (API mocking), Vitest mocks
- **Coverage Tool:** @vitest/coverage-v8 4.0.4
- **Coverage Target:** ≥90% (currently 85.1%)
- **Command:** `npm run test:coverage`
- **Accessibility:** @axe-core/cli 4.11.0 for automated checks

**Integration Testing:**
- Backend: `httpx.AsyncClient` for API endpoint tests
- Frontend: Full component rendering with MSW for API responses
- End-to-End: Manual smoke tests (future: Playwright)

**Performance Testing:**
- Lighthouse 11.7.0 for frontend performance audits
- Backend profiling with Datadog APM

---

## Implementation Stack

**Complete Technology Stack with Exact Versions:**

**Backend Runtime & Framework:**
- Python 3.11+
- FastAPI 0.104.1
- Uvicorn 0.24.0 (with standard extras: uvloop, httptools)
- python-multipart 0.0.6

**Backend Data & Persistence:**
- SQLAlchemy 2.0.23 (ORM with async support)
- Alembic 1.13.0 (migrations)
- PostgreSQL 15+ (production database)
- asyncpg 0.29.0 (async PostgreSQL driver)
- psycopg2-binary 2.9.9 (sync PostgreSQL driver for Alembic)

**Backend Validation & Security:**
- Pydantic 2.8.2 (request/response validation)
- pydantic-settings 2.1.0 (configuration management)
- email-validator 2.1.1 (email validation)
- python-jose 3.3.0 (JWT handling)
- passlib 1.7.4 (password hashing)
- Clerk Backend API 1.0.0 (authentication service)

**Backend Payments & Integrations:**
- Stripe ≥8.0.0 (payment processing)
- xero-python ≥5.0.0 (Xero accounting)
- python-quickbooks ≥0.9.5 (QuickBooks)
- intuit-oauth ≥1.2.4 (QuickBooks OAuth)

**Backend Task Queue & Caching:**
- Celery 5.3.4 (distributed task queue)
- Redis 5.0.1 (cache + message broker)

**Backend AI & External Services:**
- OpenAI ≥1.3.0 (GPT-4 narratives)
- requests 2.32.3 (HTTP client)
- httpx 0.27.0 (async HTTP client)

**Backend Document & Media Processing:**
- ReportLab ≥4.0.0 (PDF generation)
- python-docx ≥1.1.0 (DOCX generation)
- weasyprint ≥60.0 (HTML to PDF)
- pandas ≥2.0.0 (data processing, Excel export)
- openpyxl ≥3.1.0 (Excel file generation)
- ffmpeg-python ≥0.2.0 (video processing)
- Pillow ≥10.0.0 (image processing)
- pydub ≥0.25.1 (audio processing)

**Backend Storage:**
- boto3 ≥1.28.0 (AWS S3 / Cloudflare R2 client)
- botocore ≥1.31.0 (boto3 dependency)

**Backend Testing:**
- pytest 7.4.3 (test framework)
- pytest-asyncio 0.21.1 (async test support)
- pytest-cov 4.1.0 (coverage reporting)

**Backend Utilities:**
- numpy 2.1.1 (deal matching scoring)
- python-dotenv 1.0.0 (environment variables)

**Frontend Runtime & Framework:**
- Node.js 20.x
- React 19.1.1
- React DOM 19.1.1
- Vite 7.2.2 (build tool)
- TypeScript 5.9.3

**Frontend Routing & State:**
- React Router DOM 7.9.4 (routing)
- Wouter 3.7.1 (lightweight routing alternative)
- Zustand 5.0.8 (state management)
- @tanstack/react-query 5.90.5 (server state)

**Frontend UI & Styling:**
- Tailwind CSS 3.4.17 (utility-first CSS)
- Lucide React 0.552.0 (icons)
- @hello-pangea/dnd 18.0.1 (drag & drop)
- Recharts 3.4.1 (charts)

**Frontend Authentication & Payments:**
- @clerk/clerk-react 5.53.3 (authentication)

**Frontend HTTP & Data:**
- Axios 1.12.2 (HTTP client)
- date-fns 3.6.0 (date utilities)
- react-markdown 10.1.0 (markdown rendering)

**Frontend Build & Optimization:**
- @vitejs/plugin-react 5.1.1 (Vite React plugin)
- Terser 5.44.0 (minification)
- vite-plugin-imagemin 0.1.0 (image optimization)
- rollup-plugin-visualizer 6.0.5 (bundle analysis)

**Frontend Testing:**
- Vitest 4.0.8 (test runner)
- @vitest/ui 4.0.8 (test UI)
- @vitest/coverage-v8 4.0.4 (coverage)
- @testing-library/react 16.3.0 (component testing)
- @testing-library/user-event 14.6.1 (user interactions)
- @testing-library/jest-dom 6.6.3 (DOM matchers)
- jsdom 27.2.0 (DOM implementation)
- MSW 2.12.1 (API mocking)

**Frontend Quality & Performance:**
- ESLint 9.36.0 (linting)
- eslint-plugin-react-hooks 5.2.0 (React hooks rules)
- eslint-plugin-react-refresh 0.4.22 (Fast Refresh rules)
- TypeScript ESLint 8.45.0 (TypeScript linting)
- Lighthouse 11.7.0 (performance audits)
- @axe-core/cli 4.11.0 (accessibility testing)

**Frontend Utilities:**
- PostCSS 8.5.6 (CSS processing)
- Autoprefixer 10.4.21 (vendor prefixes)
- web-streams-polyfill 3.3.3 (streams polyfill)
- serve 14.2.5 (static file server)

**Infrastructure:**
- PostgreSQL 15+ (managed on Render)
- Redis (managed on Render)
- Render (hosting: Python web service + static site)
- Cloudflare R2 (object storage)
- GitHub Actions (CI/CD)

**Monitoring & Observability:**
- Datadog (APM, logs, metrics)
- Sentry (error tracking)

---

## Technical Details

### Backend TODO Resolutions

**1. Dashboard Metrics (dashboard.py:42, 80, 99, 118)**

**Current:** Stub TODO comments returning mock data
**Solution:** Query real models with caching

```python
# dashboard.py:42 - Real deal metrics
@router.get("/metrics")
async def get_dashboard_metrics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check Redis cache first
    cache_key = f"metrics:{current_user.organization_id}"
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    # Query real data
    deals_count = await db.scalar(
        select(func.count(Deal.id))
        .where(Deal.organization_id == current_user.organization_id)
    )
    # ... more metrics

    metrics = {"deals": deals_count, ...}
    await redis.setex(cache_key, 300, json.dumps(metrics))  # 5 min TTL
    return metrics
```

**Testing:** Add `test_dashboard_metrics.py` with cache hit/miss scenarios

**2. Community Permissions (community.py:437, 452)**

**Current:** Missing moderator role checks
**Solution:** Add RBAC enforcement

```python
# community.py:437 - Permission check
async def check_moderator_permission(user: User, community_id: str, db: AsyncSession):
    membership = await db.scalar(
        select(CommunityMember)
        .where(
            CommunityMember.user_id == user.id,
            CommunityMember.community_id == community_id,
            CommunityMember.role.in_(['moderator', 'admin'])
        )
    )
    if not membership:
        raise HTTPException(status_code=403, detail="Moderator access required")
```

**Testing:** Add `test_community_permissions.py` with role-based scenarios

**3. Financial Routes (financial.py:189, 309)**

**Current:** TODO stubs for ratio/narrative queries
**Solution:** Query FinancialRatio and FinancialNarrative models with caching

```python
# financial.py:189 - Latest ratios
@router.get("/ratios/latest")
async def get_latest_ratios(
    organization_id: str,
    db: AsyncSession = Depends(get_db)
):
    cache_key = f"ratios:{organization_id}"
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    ratios = await db.scalars(
        select(FinancialRatio)
        .where(FinancialRatio.organization_id == organization_id)
        .order_by(FinancialRatio.created_at.desc())
        .limit(1)
    )
    result = ratios.first()
    await redis.setex(cache_key, 3600, json.dumps(result.dict()))  # 1 hour TTL
    return result
```

**Testing:** Add ratio calculation edge cases, cache invalidation tests

**4. Document Generation (document_generation.py:686, 802)**

**Current:** Missing user resolution and background task trigger
**Solution:** Query User model, trigger Celery task

```python
# document_generation.py:686 - User lookup
user = await db.get(User, created_by_user_id)
created_by = f"{user.first_name} {user.last_name}" if user else "Unknown"

# document_generation.py:802 - Celery task
from app.tasks.document_generation import generate_document_file
task = generate_document_file.delay(job_id=job.id)
job.celery_task_id = task.id
await db.commit()
```

**Testing:** Mock Celery task, test user lookup failures

**5. Document Generation Service (document_generation_service.py:198)**

**Current:** TODO for file generation
**Solution:** Generate PDF/DOCX using ReportLab/python-docx

```python
# document_generation_service.py:198
if generate_file:
    if file_format == "pdf":
        file_path = await _generate_pdf(content, template_id)
    elif file_format == "docx":
        file_path = await _generate_docx(content, template_id)

    # Upload to R2
    from app.services.s3_storage_service import upload_file
    s3_path = await upload_file(file_path, f"documents/{job_id}.{file_format}")
    return s3_path
```

**Testing:** Test PDF/DOCX generation, storage upload, error handling

### Frontend TODO Resolutions

**1. Bulk Actions (useBulkActions.ts:84, 180, 220)**

**Current:** Mock API calls
**Solution:** Connect to real backend endpoints

```typescript
// useBulkActions.ts:84 - Archive
const { mutate: archiveItems } = useMutation({
  mutationFn: async (ids: string[]) => {
    return axios.post('/api/bulk/archive', { ids });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  }
});
```

**Testing:** Test optimistic updates, rollback on errors

**2. Prospect Kanban (ProspectKanban.tsx:155)**

**Current:** TODO for drag-and-drop
**Solution:** Implement with @hello-pangea/dnd

```tsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const onDragEnd = async (result: DropResult) => {
  if (!result.destination) return;

  const { draggableId, destination } = result;
  await updateProspectStage.mutateAsync({
    prospectId: draggableId,
    stage: destination.droppableId
  });
};

return (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="prospects">
      {/* Draggable items */}
    </Droppable>
  </DragDropContext>
);
```

**Testing:** Test drag interactions, stage persistence, visual feedback

**3. Document Workspace (DocumentWorkspace.tsx:117, 130, 215)**

**Current:** TODO stubs for permissions, audit logs, confirmations
**Solution:** Connect to backend APIs

```tsx
// Line 117 - Update permissions
const updatePermissions = async (docId: string, permissions: Permission[]) => {
  await axios.patch(`/api/documents/${docId}/permissions`, { permissions });
};

// Line 130 - Send audit log
const logAudit = async (action: string, docId: string) => {
  await axios.post('/api/audit-logs', {
    action,
    resource_type: 'document',
    resource_id: docId,
    timestamp: new Date().toISOString()
  });
};

// Line 215 - Confirmation dialog
const handleDelete = async (docId: string) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Document',
    message: 'This action cannot be undone.',
    confirmText: 'Delete'
  });
  if (confirmed) {
    await deleteDocument(docId);
  }
};
```

**Testing:** Test permission updates, audit log creation, dialog interactions

**4. Dashboard Page (DashboardPage.tsx:349)**

**Current:** Mock task data
**Solution:** Query real task API

```tsx
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks', organizationId],
  queryFn: async () => {
    const response = await axios.get(`/api/tasks?organization_id=${organizationId}`);
    return response.data;
  }
});
```

**Testing:** Test loading states, error handling, real-time updates

**5. Marketing Layout (MarketingLayout.tsx:24)**

**Current:** Placeholder telephone number
**Solution:** Update to real contact number + add analytics

```tsx
telephone: '+44-20-7946-0958',  // Real contact number

// Add A/B testing hooks
const { variant } = useABTest('hero-cta');
const trackConversion = useAnalytics('conversion');

<button onClick={() => trackConversion('cta-click')}>
  {variant === 'A' ? 'Get Started' : 'Start Free Trial'}
</button>
```

**Testing:** Test analytics tracking, A/B variant rendering

### Performance Optimization Details

**Code Splitting Expansion:**
- Lazy load all route components (extend beyond current setup)
- Dynamic imports for heavy libraries (recharts, markdown parser)
- Route-based code splitting with React.lazy()

**Image Optimization:**
- Convert PNG/JPG to WebP format
- Implement lazy loading with Intersection Observer
- Use srcset for responsive images
- Compress images with vite-plugin-imagemin

**Bundle Analysis & Reduction:**
- Use rollup-plugin-visualizer to identify large dependencies
- Tree-shake unused exports
- Replace heavy libraries with lighter alternatives if possible
- Minify with Terser

**Backend API Tuning:**
- Add database indexes for frequently queried fields
- Implement response caching with Redis
- Use SQLAlchemy query optimization (select_related, joinedload)
- Profile slow endpoints with Datadog APM

**CDN Integration:**
- Serve static assets via CDN (Cloudflare)
- Implement cache headers (max-age, immutable)
- Use asset fingerprinting for cache busting

**Lighthouse Targets:**
- Performance: 90%+ (currently 63-69%)
- Accessibility: 95%+ (maintain current 94%)
- Best Practices: 95%+
- SEO: 95%+

### Test Coverage Enhancement Strategy

**Backend Coverage Gaps (84% → 90%+):**

**Service Layer:**
- Add edge case tests for all services
- Test error paths (database errors, external API failures)
- Test concurrent operations
- Test transaction rollback scenarios

**API Routes:**
- Test authentication failures
- Test permission denied scenarios
- Test validation errors
- Test rate limiting

**Integration Tests:**
- Full API workflows (create deal → add documents → generate valuation)
- OAuth flows (Xero, QuickBooks)
- Webhook handling (Stripe, Clerk)

**Estimated Tests to Add:** +320 tests

**Frontend Coverage Gaps (85.1% → 90%+):**

**Component Coverage:**
- Test all component variants (loading, error, empty states)
- Test user interactions (clicks, form submissions, drag-drop)
- Test conditional rendering logic
- Test accessibility features

**Integration Tests:**
- Full user workflows (login → dashboard → create deal)
- Form validations
- API error handling
- Optimistic updates

**Accessibility Tests:**
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA labels

**Estimated Tests to Add:** +280 tests

**Total Test Count Target:** ~3,141 tests (currently 2,821)

### Export Queue UI Architecture

**Components:**

**ExportQueue.tsx** - Main queue UI
- Job list with status indicators (pending, processing, completed, failed)
- Progress bars using recharts
- Download links on completion
- Retry/cancel actions
- Real-time polling (5-second intervals)

**ExportJob.tsx** - Individual job card
- Job metadata (type, created_at, user)
- Status badge with color coding
- Progress percentage
- Action buttons (download, retry, cancel)

**State Management:**
- Use React Query for polling (`refetchInterval: 5000`)
- Optimistic updates on retry/cancel
- Toast notifications on completion

**API Endpoints:**
- GET /api/export-jobs - List jobs
- GET /api/export-jobs/:id - Job status
- POST /api/export-jobs/:id/retry - Retry failed job
- DELETE /api/export-jobs/:id - Cancel pending job

### Performance Monitoring Dashboard

**Components:**

**PerformanceDashboard.tsx** - Main dashboard
- Lighthouse score history (line chart)
- API response time trends (area chart)
- Error rate monitoring (bar chart)
- User activity metrics (heatmap)

**Metrics Collected:**
- Lighthouse scores (daily runs)
- API endpoint response times (p50, p95, p99)
- Error rates by endpoint
- Frontend render performance (FCP, TTI, CLS)
- User session metrics

**Data Source:**
- Backend: Datadog APM API
- Frontend: Performance API + custom tracking
- Lighthouse: CI/CD pipeline results stored in DB

**Refresh:** Real-time with WebSocket (future) or 30-second polling

---

## Development Setup

### Prerequisites

**Required Tools:**
- Python 3.11+ (check: `python --version`)
- Node.js 20.x (check: `node --version`)
- PostgreSQL 15+ (local dev or Docker)
- Redis 5.x+ (local dev or Docker)
- Git

**Optional Tools:**
- Docker (for PostgreSQL + Redis)
- Render CLI (for deployment)
- Lighthouse CLI (for performance testing)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Set up environment variables
cp .env.example .env
# Edit .env with your secrets (DATABASE_URL, CLERK_SECRET_KEY, etc.)

# 6. Run database migrations
alembic upgrade head

# 7. Start development server
uvicorn app.main:app --reload

# Server runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys (VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY)

# 4. Start development server
npm run dev

# Server runs at http://localhost:5173
```

### Running Tests

**Backend:**
```bash
cd backend
pytest                          # Run all tests
pytest --cov=app               # Run with coverage
pytest -v                      # Verbose output
pytest tests/api/              # Run specific directory
pytest -k "test_dashboard"     # Run tests matching pattern
```

**Frontend:**
```bash
cd frontend
npm run test                   # Run tests
npm run test:watch             # Watch mode
npm run test:coverage          # Run with coverage
npm run test -- DealCard       # Run specific test file
```

### Performance Testing

**Lighthouse (Frontend):**
```bash
cd frontend

# Terminal 1: Start preview server
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx npm run preview:test

# Terminal 2: Run Lighthouse
npm run lighthouse:local

# View report: docs/testing/lighthouse-report.html
```

**Bundle Analysis (Frontend):**
```bash
cd frontend
npm run build
# Bundle visualizer opens automatically in browser
```

### Database Management

**Create Migration:**
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

**Apply Migrations:**
```bash
alembic upgrade head
```

**Rollback Migration:**
```bash
alembic downgrade -1
```

**Check Current Version:**
```bash
alembic current
```

---

## Implementation Guide

### Setup Steps

**Pre-Implementation Checklist:**

1. ✅ **Create Feature Branch**
   ```bash
   git checkout -b feature/v1.2-enhancements
   ```

2. ✅ **Verify Development Environment**
   ```bash
   # Backend
   cd backend && pytest --version && python --version

   # Frontend
   cd frontend && npm --version && node --version
   ```

3. ✅ **Pull Latest Main**
   ```bash
   git fetch origin
   git merge origin/main
   ```

4. ✅ **Run Baseline Tests**
   ```bash
   # Backend
   cd backend && pytest --cov=app --cov-report=term

   # Frontend
   cd frontend && npm run test:coverage
   ```

5. ✅ **Review Existing Code References**
   - Read service patterns in `backend/app/services/`
   - Review component patterns in `frontend/src/components/`
   - Check test patterns in `backend/tests/` and `frontend/src/**/*.test.tsx`

6. ✅ **Set Up Test Data (if needed)**
   - Seed database with test organizations, users, deals
   - Create test fixtures in `backend/tests/conftest.py`

### Implementation Steps

**Phase 1: Backend TODO Resolution (8-12 hours)**

**Story 1.1: Dashboard Metrics Implementation**
- **RED:** Write test `test_dashboard_metrics.py` expecting real data
- **GREEN:** Implement metrics queries with caching
- **REFACTOR:** Optimize queries, add error handling
- **Files:** `backend/app/api/routes/dashboard.py`, `backend/tests/api/test_dashboard_metrics.py`

**Story 1.2: Community Permissions**
- **RED:** Write test `test_community_permissions.py` for RBAC enforcement
- **GREEN:** Add permission check functions
- **REFACTOR:** Extract to reusable decorator
- **Files:** `backend/app/api/routes/community.py`, `backend/tests/api/test_community_permissions.py`

**Story 1.3: Financial Routes Optimization**
- **RED:** Write tests for ratio/narrative queries with caching
- **GREEN:** Implement queries and Redis caching
- **REFACTOR:** Optimize cache invalidation logic
- **Files:** `backend/app/api/routes/financial.py`, `backend/tests/api/test_financial.py`

**Story 1.4: Document Generation Enhancement**
- **RED:** Write tests for PDF/DOCX generation and Celery tasks
- **GREEN:** Implement file generation and background task trigger
- **REFACTOR:** Extract file generation to service methods
- **Files:**
  - `backend/app/api/routes/document_generation.py`
  - `backend/app/services/document_generation_service.py`
  - `backend/tests/services/test_document_generation.py`

**Story 1.5: Export Queue Service**
- **RED:** Write tests for job tracking and queue management
- **GREEN:** Create `export_queue_service.py` with Redis-backed queue
- **REFACTOR:** Add webhook notifications
- **Files:**
  - `backend/app/services/export_queue_service.py`
  - `backend/tests/services/test_export_queue_service.py`

**Phase 2: Frontend TODO Resolution (10-14 hours)**

**Story 2.1: Bulk Actions API Integration**
- **RED:** Write tests for API integration with optimistic updates
- **GREEN:** Connect to backend endpoints
- **REFACTOR:** Add error rollback logic
- **Files:** `frontend/src/hooks/useBulkActions.ts`, `frontend/src/hooks/useBulkActions.test.ts`

**Story 2.2: Prospect Kanban Drag & Drop**
- **RED:** Write tests for drag-and-drop interactions
- **GREEN:** Implement with @hello-pangea/dnd
- **REFACTOR:** Add visual feedback, optimize re-renders
- **Files:**
  - `frontend/src/components/master-admin/prospects/ProspectKanban.tsx`
  - `frontend/src/components/master-admin/prospects/ProspectKanban.test.tsx`

**Story 2.3: Document Workspace Enhancements**
- **RED:** Write tests for permissions, audit logs, confirmations
- **GREEN:** Connect to backend APIs
- **REFACTOR:** Extract confirmation dialog to reusable component
- **Files:**
  - `frontend/src/pages/documents/DocumentWorkspace.tsx`
  - `frontend/src/pages/documents/DocumentWorkspace.test.tsx`
  - `frontend/src/components/ui/ConfirmDialog.tsx`

**Story 2.4: Dashboard Real Tasks**
- **RED:** Write tests for task API integration
- **GREEN:** Replace mock data with real API calls
- **REFACTOR:** Add loading states, error boundaries
- **Files:**
  - `frontend/src/pages/DashboardPage.tsx`
  - `frontend/src/pages/DashboardPage.test.tsx`

**Story 2.5: Export Queue UI**
- **RED:** Write tests for queue UI interactions
- **GREEN:** Build ExportQueue component with polling
- **REFACTOR:** Add toast notifications, optimize polling
- **Files:**
  - `frontend/src/components/documents/ExportQueue.tsx`
  - `frontend/src/components/documents/ExportQueue.test.tsx`
  - `frontend/src/components/documents/ExportJob.tsx`

**Phase 3: Performance Optimization (10-15 hours)**

**Story 3.1: Code Splitting Expansion**
- **RED:** Lighthouse test expecting 90%+ performance score
- **GREEN:** Expand React.lazy() to all routes, dynamic imports for heavy libs
- **REFACTOR:** Optimize chunk splitting in vite.config.ts
- **Files:** `frontend/src/App.tsx`, `vite.config.ts`

**Story 3.2: Image Optimization**
- **RED:** Test image load performance metrics
- **GREEN:** Convert to WebP, implement lazy loading
- **REFACTOR:** Add srcset for responsive images
- **Files:** All image imports, `vite.config.ts` (imagemin plugin)

**Story 3.3: Bundle Analysis & Reduction**
- **Action:** Run rollup-plugin-visualizer
- **GREEN:** Identify and remove heavy dependencies
- **REFACTOR:** Tree-shake unused exports, replace heavy libs
- **Files:** `vite.config.ts`, `package.json`

**Story 3.4: Backend API Tuning**
- **RED:** Performance tests for slow endpoints
- **GREEN:** Add database indexes, optimize queries
- **REFACTOR:** Implement Redis caching
- **Files:** Database migration for indexes, service optimizations

**Story 3.5: CDN Integration**
- **Action:** Configure Cloudflare CDN
- **GREEN:** Add cache headers to Render config
- **REFACTOR:** Implement asset fingerprinting
- **Files:** `render.yaml`, `vite.config.ts`

**Phase 4: Test Coverage Enhancement (20-30 hours)**

**Story 4.1: Backend Edge Case Tests**
- **RED:** Write failing tests for uncovered edge cases
- **GREEN:** Verify tests pass (code already handles edge cases)
- **REFACTOR:** Add error handling if gaps found
- **Estimated:** +150 tests

**Story 4.2: Backend Integration Tests**
- **RED:** Write full workflow integration tests
- **GREEN:** Implement test scenarios
- **REFACTOR:** Extract common fixtures
- **Estimated:** +100 tests

**Story 4.3: Backend Error Path Coverage**
- **RED:** Write tests for error scenarios
- **GREEN:** Add error handling code
- **REFACTOR:** Standardize error responses
- **Estimated:** +70 tests

**Story 4.4: Frontend Component Coverage**
- **RED:** Write tests for missing component variants
- **GREEN:** Verify tests pass
- **REFACTOR:** Improve component testability
- **Estimated:** +150 tests

**Story 4.5: Frontend Accessibility Tests**
- **RED:** Write axe accessibility tests for all pages
- **GREEN:** Fix accessibility violations
- **REFACTOR:** Add ARIA labels, keyboard navigation
- **Estimated:** +130 tests

**Phase 5: Production Polish (5-8 hours)**

**Story 5.1: Performance Monitoring Dashboard**
- **RED:** Write tests for dashboard rendering
- **GREEN:** Build PerformanceDashboard component
- **REFACTOR:** Add real-time data updates
- **Files:**
  - `frontend/src/pages/master-admin/PerformanceDashboard.tsx`
  - `frontend/src/pages/master-admin/PerformanceDashboard.test.tsx`

**Story 5.2: Analytics Integration**
- **RED:** Write tests for analytics tracking
- **GREEN:** Implement conversion tracking, A/B tests
- **REFACTOR:** Extract to custom hooks
- **Files:**
  - `frontend/src/hooks/useAnalytics.ts`
  - `frontend/src/hooks/useABTest.ts`

### Testing Strategy

**Test-Driven Development (TDD) Cycle:**

**Every Implementation Follows:**
1. **RED:** Write failing test first ❌
2. **GREEN:** Implement minimal code to pass ✅
3. **REFACTOR:** Clean up while keeping tests green ♻️

**Backend Testing:**
- **Unit Tests:** Every service method has corresponding test
- **Integration Tests:** API endpoints tested with AsyncClient
- **Edge Cases:** Null values, empty lists, concurrent operations
- **Error Paths:** Database errors, external API failures, validation errors
- **Performance:** Slow query detection, cache hit/miss ratios

**Frontend Testing:**
- **Component Tests:** All components tested in isolation
- **Integration Tests:** Full user workflows with MSW mocked APIs
- **Accessibility Tests:** Axe automated checks for all pages
- **User Interactions:** Click, form submission, drag-and-drop
- **Error States:** Loading, error, empty states

**Performance Testing:**
- **Lighthouse:** Run daily in CI/CD, target 90%+ scores
- **Bundle Analysis:** Monitor bundle size, alert on >10% increase
- **API Profiling:** Datadog APM tracking p95 response times

**Coverage Enforcement:**
- Backend: Fail CI if coverage <90%
- Frontend: Fail CI if coverage <90%
- Report coverage delta on PRs

### Acceptance Criteria

**v1.2 Release is COMPLETE when:**

✅ **Code Quality:**
- [ ] 0 TODO/FIXME comments remaining in codebase
- [ ] ESLint/pytest warnings resolved
- [ ] All console errors/warnings fixed

✅ **Performance:**
- [ ] Lighthouse Performance score ≥90%
- [ ] Lighthouse Accessibility score ≥95%
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3.5s
- [ ] Bundle size <500KB (gzipped)

✅ **Test Coverage:**
- [ ] Backend coverage ≥90% (pytest-cov report)
- [ ] Frontend coverage ≥90% (Vitest coverage report)
- [ ] All tests passing (~3,141 total)
- [ ] No skipped/ignored tests

✅ **Functionality:**
- [ ] All dashboard metrics show real data
- [ ] Community moderation permissions enforced
- [ ] Financial ratios cached and optimized
- [ ] Document generation creates PDF/DOCX files
- [ ] Export queue UI displays job status
- [ ] Bulk actions connected to API
- [ ] Drag-and-drop works in ProspectKanban
- [ ] Document workspace has permissions/audit/confirmations
- [ ] Performance dashboard renders metrics
- [ ] Analytics tracking functional

✅ **Production Readiness:**
- [ ] All services healthy on Render
- [ ] Database migrations applied successfully
- [ ] No critical/high severity Sentry errors
- [ ] Datadog dashboards configured
- [ ] Smoke tests passing (6/6)
- [ ] Documentation updated (RELEASE-NOTES-v1.2.md)

✅ **User Acceptance:**
- [ ] Export queue provides clear status visibility
- [ ] Performance improvements noticeable (<3s page loads)
- [ ] No regressions in existing features

---

## Developer Resources

### File Paths Reference

**Backend Files (TODO Resolutions):**
- `backend/app/api/routes/dashboard.py` - Dashboard metrics implementation
- `backend/app/api/routes/community.py` - Community permission checks
- `backend/app/api/routes/financial.py` - Financial ratio/narrative queries
- `backend/app/api/routes/document_generation.py` - User lookup, Celery trigger
- `backend/app/services/document_generation_service.py` - PDF/DOCX generation
- `backend/app/services/export_queue_service.py` - NEW: Queue management
- `backend/app/services/s3_storage_service.py` - File upload integration
- `backend/app/tasks/document_generation.py` - NEW: Celery tasks

**Frontend Files (TODO Resolutions):**
- `frontend/src/hooks/useBulkActions.ts` - API integration
- `frontend/src/components/master-admin/prospects/ProspectKanban.tsx` - Drag & drop
- `frontend/src/pages/documents/DocumentWorkspace.tsx` - Permissions/audit/confirmations
- `frontend/src/pages/DashboardPage.tsx` - Real task integration
- `frontend/src/components/marketing/MarketingLayout.tsx` - Contact number, analytics
- `frontend/src/components/documents/ExportQueue.tsx` - NEW: Queue UI
- `frontend/src/components/documents/ExportJob.tsx` - NEW: Job card
- `frontend/src/pages/master-admin/PerformanceDashboard.tsx` - NEW: Monitoring dashboard

**Test Files to Create:**
- `backend/tests/api/test_dashboard_metrics.py`
- `backend/tests/api/test_community_permissions.py`
- `backend/tests/api/test_financial_optimization.py`
- `backend/tests/services/test_document_generation.py`
- `backend/tests/services/test_export_queue_service.py`
- `frontend/src/hooks/useBulkActions.test.ts`
- `frontend/src/components/master-admin/prospects/ProspectKanban.test.tsx`
- `frontend/src/pages/documents/DocumentWorkspace.test.tsx`
- `frontend/src/components/documents/ExportQueue.test.tsx`
- `frontend/src/pages/master-admin/PerformanceDashboard.test.tsx`

**Configuration Files:**
- `backend/alembic/versions/` - NEW: Migration for database indexes
- `frontend/vite.config.ts` - Bundle optimization, imagemin plugin
- `frontend/package.json` - rollup-plugin-visualizer (already added)
- `.github/workflows/` - Lighthouse CI step

### Key Code Locations

**Backend:**
- Dashboard service layer: `backend/app/services/dashboard_service.py` (create if missing)
- Permission helpers: `backend/app/core/security.py`
- Cache utilities: `backend/app/core/cache.py` (create if missing)
- Celery configuration: `backend/app/core/celery.py` (verify exists)
- Models: `backend/app/models/*.py` (Deal, User, FinancialRatio, etc.)

**Frontend:**
- API client: `frontend/src/services/api.ts`
- Query hooks: `frontend/src/hooks/use*.ts`
- UI primitives: `frontend/src/components/ui/*`
- Analytics utilities: `frontend/src/utils/analytics.ts` (create)
- A/B testing: `frontend/src/hooks/useABTest.ts` (create)

**Shared:**
- Environment variables: `backend/.env`, `frontend/.env.local`
- Documentation: `docs/`, `docs/bmad/`
- Scripts: `scripts/`

### Testing Locations

**Backend Tests:**
- Unit tests: `backend/tests/services/` (mirrors `backend/app/services/`)
- API tests: `backend/tests/api/` (mirrors `backend/app/api/routes/`)
- Integration tests: `backend/tests/integration/`
- Fixtures: `backend/tests/conftest.py`

**Frontend Tests:**
- Component tests: Colocated with components (`*.test.tsx`)
- Hook tests: Colocated with hooks (`*.test.ts`)
- Integration tests: `frontend/src/tests/integration/`
- Accessibility tests: `frontend/src/tests/accessibility/`
- Test utilities: `frontend/src/tests/utils.tsx`

**Performance Tests:**
- Lighthouse reports: `docs/testing/lighthouse-report.html`
- Bundle analysis: `frontend/dist/stats.html` (after build)
- Coverage reports:
  - Backend: `backend/htmlcov/index.html`
  - Frontend: `frontend/coverage/index.html`

### Documentation to Update

**Release Documentation:**
- `docs/bmad/RELEASE-NOTES-v1.2.md` - NEW: Comprehensive release notes
- `docs/bmad/BMAD_PROGRESS_TRACKER.md` - UPDATE: Session completion
- `docs/bmm-workflow-status.yaml` - UPDATE: Mark v1.2-planning complete

**Technical Documentation:**
- `CLAUDE.md` - UPDATE: v1.2 status, test counts
- `README.md` - UPDATE: Version badge, latest features
- `docs/architecture.md` - UPDATE: Export queue architecture
- `docs/development-guide.md` - UPDATE: Testing commands

**Deployment Documentation:**
- `docs/deployments/2025-11-XX-V1.2-DEPLOYMENT.md` - NEW: Deployment log
- `render.yaml` - VERIFY: No changes needed
- `.github/workflows/` - UPDATE: Coverage thresholds

**API Documentation:**
- Auto-generated at `/api/docs` (FastAPI OpenAPI)
- No manual updates needed

---

## UX/UI Considerations

**UI Components Affected:**

**New Components:**
1. **ExportQueue** - Document export job queue UI
   - Job list with status badges (pending/processing/completed/failed)
   - Progress bars for active jobs
   - Download buttons on completion
   - Retry/cancel actions

2. **PerformanceDashboard** - Master admin monitoring console
   - Line charts for Lighthouse score trends
   - Area charts for API response times
   - Bar charts for error rates
   - Heatmaps for user activity

3. **ConfirmDialog** - Reusable confirmation modal
   - Title, message, confirm/cancel buttons
   - Destructive action styling (red for delete)
   - Escape key to cancel, Enter to confirm

**Modified Components:**
1. **ProspectKanban** - Enhanced with drag-and-drop
   - Visual feedback during drag (opacity, border)
   - Drop zone highlighting
   - Smooth animations

2. **DocumentWorkspace** - Additional actions
   - Permission management modal
   - Audit log viewer (timeline component)
   - Confirmation dialogs for destructive actions

3. **DashboardPage** - Real task data
   - Loading skeletons for tasks
   - Empty state when no tasks
   - Error boundary for API failures

**UX Flow Changes:**

**Export Queue Flow:**
1. User initiates document export (PDF/DOCX)
2. Job added to queue, user sees "Processing..." status
3. User can navigate away, return later to check status
4. Progress bar shows completion percentage
5. On completion, download button appears
6. On failure, error message + retry button shown

**Drag & Drop Flow:**
1. User hovers over prospect card → cursor changes to grab
2. User drags card → card becomes semi-transparent, drop zones highlight
3. User drops on new stage → optimistic update (card moves immediately)
4. API call persists change → confirmation or rollback on error

**Visual/Interaction Patterns:**

**Follow Existing Design System:**
- ✅ Tailwind CSS utility classes (already in use)
- ✅ UI primitives in `frontend/src/components/ui/`
- ✅ Lucide React icons (consistent icon set)
- ✅ Color palette from Tailwind config
- ✅ Typography scale from `frontend/src/index.css`

**New Patterns:**
- **Job Status Badges:** Use existing `Badge` component with status colors
  - Pending: gray
  - Processing: blue
  - Completed: green
  - Failed: red
- **Progress Bars:** Use recharts `ProgressBar` or custom Tailwind implementation
- **Drag Feedback:** Semi-transparent draggable, border on drop zone
- **Toast Notifications:** Use existing toast system (if present) or add library

**Responsive Design:**
- Desktop: Full dashboard layouts, multi-column grids
- Tablet: Stacked columns, collapsible sidebars
- Mobile: Single column, bottom sheets for modals

**Accessibility:**

**Keyboard Navigation:**
- Tab order: Logical flow through interactive elements
- Escape key: Close modals, cancel drag operations
- Enter/Space: Activate buttons, confirm dialogs
- Arrow keys: Navigate lists (future enhancement)

**Screen Reader Compatibility:**
- ARIA labels on all interactive elements
- Role attributes (dialog, alertdialog, progressbar)
- Live regions for status updates (`aria-live="polite"`)
- Focus management (trap focus in modals)

**ARIA Labels:**
```tsx
<button aria-label="Retry document export">Retry</button>
<div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
  {progress}%
</div>
<div role="status" aria-live="polite">
  {exportStatus}
</div>
```

**Color Contrast:**
- Maintain WCAG AA standards (4.5:1 for text)
- Test with axe DevTools
- Use Tailwind's color palette (pre-tested for contrast)

**User Feedback:**

**Loading States:**
- Skeleton loaders for data fetching (DashboardPage tasks)
- Spinner for button actions (retry, cancel)
- Progress bars for long-running operations (export jobs)
- Optimistic updates with rollback (drag-and-drop, bulk actions)

**Error Messages:**
- Specific, actionable error text ("Failed to export document. Please try again.")
- Error boundaries for unexpected failures
- Retry buttons on recoverable errors
- Contact support link on critical errors

**Success Confirmations:**
- Toast notifications for completed actions
- Green checkmark icons
- Auto-dismiss after 3 seconds (or manual dismiss)

**Progress Indicators:**
- Determinate progress bars (known duration)
- Indeterminate spinners (unknown duration)
- Step indicators for multi-step workflows (future)

---

## Testing Approach

**Test Framework Information:**

**Backend:**
- **Framework:** pytest 7.4.3
- **Async Plugin:** pytest-asyncio 0.21.1
- **Coverage Tool:** pytest-cov 4.1.0
- **HTTP Client:** httpx.AsyncClient (for API tests)
- **Database:** SQLite in-memory for tests (fast, isolated)
- **Fixtures:** Centralized in `backend/tests/conftest.py`
- **Mocking:** unittest.mock, pytest-mock
- **Assertion Style:** Native `assert` statements

**Frontend:**
- **Framework:** Vitest 4.0.8
- **Component Testing:** @testing-library/react 16.3.0
- **User Events:** @testing-library/user-event 14.6.1
- **DOM Matchers:** @testing-library/jest-dom 6.6.3
- **API Mocking:** MSW 2.12.1 (Mock Service Worker)
- **Coverage Tool:** @vitest/coverage-v8 4.0.4
- **Assertion Style:** Vitest `expect`, @testing-library matchers

**Testing Approach by Category:**

**Unit Tests:**

**Backend (Service Layer):**
```python
# backend/tests/services/test_dashboard_service.py
@pytest.mark.asyncio
async def test_get_metrics_with_cache(db_session, redis_mock):
    """Test dashboard metrics retrieval with Redis cache hit"""
    # Arrange
    redis_mock.get.return_value = json.dumps({"deals": 42})

    # Act
    metrics = await dashboard_service.get_metrics(org_id="123", db=db_session)

    # Assert
    assert metrics["deals"] == 42
    redis_mock.get.assert_called_once()
    # Database NOT queried (cache hit)
```

**Frontend (Hooks):**
```tsx
// frontend/src/hooks/useBulkActions.test.ts
describe('useBulkActions', () => {
  it('should archive items with optimistic update', async () => {
    // Arrange
    const { result } = renderHook(() => useBulkActions());

    // Act
    await result.current.archiveItems(['id1', 'id2']);

    // Assert
    expect(mockAxios.post).toHaveBeenCalledWith('/api/bulk/archive', {
      ids: ['id1', 'id2']
    });
  });
});
```

**Integration Tests:**

**Backend (API Endpoints):**
```python
# backend/tests/api/test_dashboard_metrics.py
@pytest.mark.asyncio
async def test_dashboard_metrics_endpoint(client: AsyncClient, auth_headers: dict):
    """Test GET /api/dashboard/metrics returns real data"""
    # Act
    response = await client.get("/api/dashboard/metrics", headers=auth_headers)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "deals" in data
    assert isinstance(data["deals"], int)
```

**Frontend (Component Integration):**
```tsx
// frontend/src/components/documents/ExportQueue.test.tsx
describe('ExportQueue', () => {
  it('should display jobs and allow retry on failure', async () => {
    // Arrange
    server.use(
      rest.get('/api/export-jobs', (req, res, ctx) => {
        return res(ctx.json([{ id: '1', status: 'failed' }]));
      })
    );

    // Act
    render(<ExportQueue />);
    const retryButton = await screen.findByRole('button', { name: /retry/i });
    await userEvent.click(retryButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });
});
```

**Edge Case Tests:**

**Backend:**
- Null/empty values in requests
- Concurrent requests to same resource
- Database connection failures
- External API timeouts
- Large dataset pagination
- Cache expiry edge cases

**Frontend:**
- Empty states (no data)
- Loading states (slow network)
- Error states (API failures)
- Offline scenarios
- Rapid user interactions (debouncing)
- Browser compatibility (modern browsers)

**Performance Tests:**

**Backend:**
- Slow query detection (>1s query time)
- Cache hit/miss ratios (target >80% hit rate)
- Concurrent request handling (100+ simultaneous)
- Memory usage profiling (Datadog APM)

**Frontend:**
- Lighthouse CI (Performance ≥90%)
- Bundle size monitoring (<500KB gzipped)
- Render performance (React DevTools Profiler)
- Memory leak detection (heap snapshots)

**Accessibility Tests:**

**Automated (axe-core):**
```bash
cd frontend
npm run axe:local
# Generates axe-report.json with violations
```

**Manual Checks:**
- Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification (Lighthouse, axe)
- Focus visible indicators
- Semantic HTML (headings, landmarks)

**Test Coverage Goals:**

**Backend:**
- Overall: ≥90% (currently 84%)
- Services: ≥95% (critical business logic)
- API Routes: ≥90%
- Models: ≥80% (mostly auto-generated)
- Utilities: ≥85%

**Frontend:**
- Overall: ≥90% (currently 85.1%)
- Components: ≥90%
- Hooks: ≥95% (critical state management)
- Pages: ≥85%
- Utilities: ≥90%

**Coverage Enforcement:**
- CI fails if coverage drops below target
- Coverage delta reported on PRs
- Uncovered lines highlighted in reports

**Mock Strategies:**

**Backend:**
- External APIs: Mock with unittest.mock
- Database: Use in-memory SQLite for speed
- Redis: Use fakeredis library
- Celery: Mock `.delay()` calls, test task logic separately

**Frontend:**
- API calls: Mock with MSW (request handlers)
- Browser APIs: Mock with Vitest vi.mock()
- Third-party libraries: Spy on methods, mock responses
- WebSocket: Mock with manual implementation (future)

**Test Organization:**

**Backend:**
```
backend/tests/
├── conftest.py               # Shared fixtures
├── api/
│   ├── test_dashboard_metrics.py
│   ├── test_community_permissions.py
│   └── test_financial_optimization.py
├── services/
│   ├── test_document_generation.py
│   └── test_export_queue_service.py
└── integration/
    └── test_export_workflow.py
```

**Frontend:**
```
frontend/src/
├── hooks/
│   ├── useBulkActions.ts
│   └── useBulkActions.test.ts
├── components/
│   └── documents/
│       ├── ExportQueue.tsx
│       └── ExportQueue.test.tsx
└── tests/
    ├── utils.tsx             # Test utilities
    ├── integration/
    │   └── export-flow.test.tsx
    └── accessibility/
        └── pages.test.tsx
```

---

## Deployment Strategy

### Deployment Steps

**Pre-Deployment Checklist:**

1. ✅ **All Tests Passing**
   ```bash
   # Backend
   cd backend && pytest --cov=app --cov-fail-under=90

   # Frontend
   cd frontend && npm run test:coverage -- --coverage.lines=90
   ```

2. ✅ **Coverage Meets Targets**
   - Backend: ≥90%
   - Frontend: ≥90%

3. ✅ **Lighthouse Audit Passing**
   ```bash
   cd frontend && npm run audit:local
   # Performance ≥90%, Accessibility ≥95%
   ```

4. ✅ **Build Succeeds**
   ```bash
   # Backend
   cd backend && python -m compileall app/

   # Frontend
   cd frontend && npm run build
   ```

5. ✅ **Smoke Tests Pass Locally**
   ```bash
   ./scripts/run_smoke_tests.sh
   ```

6. ✅ **Environment Variables Verified**
   - Check Render dashboard for all required secrets
   - Verify DATABASE_URL, REDIS_URL, CLERK_*, STRIPE_*, etc.

**Deployment Sequence:**

**Step 1: Database Migration (if any)**
```bash
# No schema changes in v1.2, but verify current state
alembic current
# Should show: 9a90b381abd5 (head)

# If new migration created for indexes:
alembic upgrade head
```

**Step 2: Backend Deployment**
```bash
# Commit and push to trigger Render auto-deploy
git add .
git commit -m "feat(v1.2): complete enhancement epic - TODOs, performance, coverage

- Resolve 23 TODO items (backend + frontend)
- Achieve 90%+ test coverage (3,141 tests)
- Optimize performance to Lighthouse 90%+
- Add export queue UI and monitoring dashboard
- Complete analytics integration

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin feature/v1.2-enhancements

# Monitor Render deployment
# Backend: srv-d3ii9qk9c44c73aqsli0
# Wait for "Live" status (~5 minutes)
```

**Step 3: Frontend Deployment**
```bash
# Frontend auto-deploys on same push
# Frontend: srv-d3ihptbipnbc73e72ne0
# Wait for "Live" status (~3 minutes)
```

**Step 4: Post-Deployment Verification**
```bash
# Health checks
curl https://ma-saas-backend.onrender.com/health
# Expected: {"status": "healthy"}

curl https://ma-saas-platform.onrender.com
# Expected: 200 OK with HTML

# Smoke tests (production)
./scripts/verify_deployment.py
```

**Step 5: Functional Verification**
- [ ] Login to production platform
- [ ] Navigate to dashboard (verify real metrics load)
- [ ] Create test export job (verify queue UI shows status)
- [ ] Test drag-and-drop in ProspectKanban
- [ ] Verify document permissions dialog works
- [ ] Check performance dashboard (master admin)

**Step 6: Create GitHub Release**
```bash
gh release create v1.2.0 \
  --title "v1.2.0 - Polish & Optimization" \
  --notes-file docs/bmad/RELEASE-NOTES-v1.2.md \
  --target main
```

**Step 7: Tag in Git**
```bash
git tag -a v1.2.0 -m "Release v1.2.0: Complete enhancement epic"
git push origin v1.2.0
```

### Rollback Plan

**If Critical Issues Detected Post-Deployment:**

**Immediate Actions:**
1. **Assess Severity**
   - P0 (Critical): Data loss, auth broken, payment failure → Immediate rollback
   - P1 (High): Feature broken, performance degraded → Evaluate rollback vs hotfix
   - P2 (Medium): Minor bugs, cosmetic issues → Hotfix in next deployment

2. **Rollback Procedure**

**Option A: Revert Commit (Preferred)**
```bash
# Revert v1.2 changes
git revert <v1.2-commit-hash>
git push origin main

# Render auto-deploys reverted version
# Wait for "Live" status
```

**Option B: Rollback to Previous Tag**
```bash
# Reset to v1.1.0
git reset --hard v1.1.0
git push --force origin main

# ⚠️ Force push triggers immediate deployment
```

**Option C: Render Dashboard Manual Rollback**
- Navigate to Render dashboard
- Select backend/frontend service
- Click "Manual Deploy" → "Redeploy" previous successful deployment

3. **Database Rollback (if migration applied)**
```bash
# If v1.2 included schema changes (none planned)
alembic downgrade -1
```

4. **Verify Rollback Success**
```bash
# Health checks
curl https://ma-saas-backend.onrender.com/health

# Smoke tests
./scripts/verify_deployment.py
```

5. **Communicate Incident**
- Post in #incidents Slack channel
- Update status page (if applicable)
- Notify affected users

**Post-Rollback Actions:**
- Investigate root cause (Sentry errors, Datadog logs)
- Create hotfix branch from main
- Fix issue with TDD approach
- Re-test thoroughly
- Re-deploy with incremental approach

### Monitoring Approach

**Health Monitoring:**

**Endpoint Checks (Every 5 minutes):**
- Backend: `https://ma-saas-backend.onrender.com/health`
- Frontend: `https://ma-saas-platform.onrender.com`
- Expected: 200 OK response

**Alert Triggers:**
- 3 consecutive failures → Page on-call engineer
- Response time >5s → Warning alert
- Error rate >1% → Investigation alert

**Application Performance Monitoring (Datadog):**

**Backend Metrics:**
- API endpoint response times (p50, p95, p99)
  - Target: p95 <500ms
- Database query performance
  - Target: p95 <100ms
- Cache hit rate
  - Target: >80%
- Celery task queue depth
  - Alert if >100 pending jobs
- Error rates by endpoint
  - Alert if >1%

**Frontend Metrics:**
- Page load times (FCP, TTI, CLS)
  - FCP: <1.5s
  - TTI: <3.5s
  - CLS: <0.1
- JavaScript errors
  - Alert if >10/hour
- API request failures
  - Alert if >5%
- User session metrics
  - Track active users, bounce rate

**Error Tracking (Sentry):**

**Backend:**
- Python exceptions by severity
  - Critical: Page immediately
  - Error: Daily digest
  - Warning: Weekly summary
- Request context (user, org, endpoint)
- Stack traces with source maps

**Frontend:**
- JavaScript errors by component
- React error boundaries triggered
- User interaction context
- Browser/device information

**Business Metrics:**

**Export Queue:**
- Jobs processed per hour
- Average processing time
- Failure rate (target: <2%)
- Queue depth over time

**Performance:**
- Lighthouse scores (daily CI runs)
  - Track trends over time
  - Alert if score drops >5 points
- Bundle size (on every deployment)
  - Alert if increase >10%

**User Activity:**
- Active sessions
- Page views per route
- Conversion events (analytics)
- Feature adoption (export queue usage)

**Dashboards:**

**Datadog Dashboard: "M&A Platform - v1.2 Health"**
- Backend API response times (line chart)
- Frontend page load times (line chart)
- Error rates (bar chart)
- Cache hit rates (gauge)
- Celery queue depth (time series)
- Active users (counter)

**Internal Performance Dashboard:**
- Lighthouse score history (frontend/src/pages/master-admin/PerformanceDashboard.tsx)
- Real-time metrics pulled from Datadog API
- Accessible to master admins only

**Log Aggregation:**
- Centralized logs in Datadog
- Structured JSON logging (backend)
- Error level filtering
- Search by user ID, organization ID, request ID

**Incident Response:**

**Runbook Location:** `docs/runbooks/v1.2-incidents.md`

**Common Issues & Fixes:**
1. **Export queue stuck** → Restart Celery worker
2. **Dashboard metrics empty** → Check Redis connection
3. **Drag-and-drop not saving** → Verify API endpoint reachable
4. **Performance degradation** → Check database query logs, add indexes

**On-Call Rotation:**
- Primary: DevOps engineer
- Secondary: Backend engineer
- Escalation: CTO

**Post-Deployment Monitoring Period:**
- First 24 hours: Intensive monitoring (every 30 minutes)
- First week: Daily health checks
- Ongoing: Standard monitoring cadence

---

## Summary

**v1.2 Enhancement Epic: Polish to Perfection**

This technical specification defines a comprehensive Level 1 enhancement epic that takes the M&A Intelligence Platform from "100% feature complete" (v1.1.0) to "100% polished and optimized" (v1.2.0).

**Scope:** 5 coordinated work streams
1. Backend TODO resolution (11 items)
2. Frontend TODO resolution (12 items)
3. Performance optimization (Lighthouse 90%+)
4. Test coverage enhancement (90%+ both stacks)
5. Production polish (monitoring, analytics)

**Implementation Approach:** Strict Test-Driven Development (TDD)
- RED: Write failing test first
- GREEN: Implement minimal code to pass
- REFACTOR: Clean up while keeping tests green

**Success Criteria:**
- ✅ 0 TODOs remaining
- ✅ Lighthouse Performance ≥90%
- ✅ Backend coverage ≥90%
- ✅ Frontend coverage ≥90%
- ✅ ~3,141 tests passing
- ✅ Production-ready monitoring

**Estimated Effort:** 46-70 hours over 6-9 weeks

**Tech Stack:** Brownfield enterprise SaaS platform
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery
- Frontend: React 19, TypeScript 5, Vite 7, Tailwind 3
- Testing: pytest (backend), Vitest (frontend)
- Infrastructure: Render, Datadog, Sentry

**Next Steps:**
1. Create feature branch
2. Implement Phase 1 (Backend TODOs) with TDD
3. Implement Phase 2 (Frontend TODOs) with TDD
4. Optimize performance (Phase 3)
5. Enhance test coverage (Phase 4)
6. Add production polish (Phase 5)
7. Deploy to production
8. Verify and monitor

This tech-spec is comprehensive, definitive, and ready for implementation! 🚀
