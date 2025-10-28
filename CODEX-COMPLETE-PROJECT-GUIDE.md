# CODEX Complete Project Implementation Guide

## 1. Executive Summary

- **Objective**: Finish the M&A Intelligence Platform and deliver an
  irresistible ApexDeliver Sales & Marketing Website using BMAD-inspired
  planning and strict TDD (Red → Green → Refactor) for every work item.
- **Scope Remaining**: Platform Phase 1 completion (DEV-011) plus Phase 2 & 3
  feature suites (DEV-012 through DEV-018); Marketing Phase 2–10 website
  roadmap.
- **Operating Principles**: Multi-tenant security, autonomous TDD execution,
  BMAD artefacts for both product and website, 90%+ backend coverage, 85%+
  frontend coverage, Render production deployment, Clerk-backed identity
  authority for authentication and **subscription tier enforcement** (Podcast Studio
  and other premium features gated by subscription level).
- **Handoff Context**: Product currently ~35% complete (Sprints 1–4); Sales &
  Marketing Website at ~25% (Phase 2 of 10). You expand both to 100% and deliver
  a unified handoff package for Claude Code QA/final polish.

---

## 2. Current Status Snapshot

### Product Platform

- Phase 0 (DEV-001 → DEV-006) — ✅ Auth, RBAC, admin portal ready.
- Phase 1 (DEV-007 → DEV-010) — ✅ Deal pipeline, data room, billing,
  intelligence delivered.
- Phase 1 (DEV-011) — ⚠️ Valuation CRUD/API/UI/tests outstanding.
- Phase 2 (DEV-012 → DEV-015) — ⏳ Task automation, matching, docs, content hub
  pending.
- Phase 3 (DEV-016 → DEV-018) — ⏳ **Podcast (subscription add-on)**, events, community pending.

### Sales & Marketing Website

- Phase 1 (Test Coverage) — ✅ 7 components, 206 tests, ≥90% pass rate.
- Phase 2 (Asset Generation) — 🟡 30%, remaining icons, logos, avatars.
- Phase 3–10 (Performance → Deployment) — ⏳ Execute roadmap once assets are
  complete.

### Test Baseline

- Backend (platform) — 80+ tests, ~75% coverage (raise to ≥90%).
- Frontend (platform) — 30+ tests, ~60% coverage (raise to ≥85%).
- Marketing frontend — 323/358 passing, ~90% coverage (maintain ≥90%).
- Target — 2,000–2,500 total tests, ≥90% backend, ≥85% platform frontend, ≥90%
  marketing frontend.

---

## 3. Delivery Framework (BMAD + TDD)

1. **PRD Alignment**: Reference `docs/bmad/prd.md` and story files under
   `docs/bmad/stories/DEV-xxx-*.md` plus marketing docs (`ApexDeliver Sales &
   Marketing Website - Complete Development Plan.md`, `Cursor Development
   Continuation Guide.md`).
2. **Architecture References**: Cross-check
   `docs/bmad/technical_specifications.md`, marketing component architecture in
   `frontend/src/components/marketing/`, existing service patterns, and Clerk
   deployment guides. Confirm FastAPI dependencies match documented settings.
3. **TDD Cadence**: RED (create failing tests) → GREEN (minimal implementation)
   → REFACTOR (clean up, document). Mirror this across backend, platform
   frontend, and marketing frontend.
4. **Documentation Loop**: After each story/phase, update story document/BMAD
   tracker or marketing plan. Maintain Conventional Commits.
5. **Quality Gates**: Commit only with green tests, lint clean state, coverage
   targets met, and documentation refreshed.

### 4.1 Phase 1 Completion — DEV-011 Multi-Method Valuation Suite

**Goal**: Deliver valuation CRUD, API, React workspace, analytics (scenarios,
Monte Carlo, exports).

### Dependencies

- Database migrations for valuation tables (extend Alembic as required).
- Existing helpers in `backend/app/services/valuation_service.py`.
- Auth context from Clerk for both API and UI layers.

### Execution Plan

1. **Backend Service Layer**
   - RED: expand `backend/tests/test_valuation_crud.py` with CRUD, analytics,
     exports.
   - GREEN: implement async CRUD logic using `AsyncSession`; enforce
     `organization_id` filters.
   - REFACTOR: centralize validation, prefer `Decimal`, add docstrings.
2. **API Endpoints**
   - RED: create integration tests (`backend/tests/test_valuation_api.py`) with
     auth fixtures and 403 assertions.
   - GREEN: add router `backend/app/api/v1/endpoints/valuation.py`; register in
     `backend/app/api/v1/api.py`.
   - REFACTOR: align schemas (`backend/app/schemas/valuation.py`) and error
     handling.
3. **Advanced Analytics**: Implement scenario management, Monte Carlo, tornado
   sensitivity; document deterministic seeds for tests; add dependencies in
   `backend/requirements.txt` if new libraries used.
4. **Exports**
   - RED: test PDF/Excel generation (bytes length, content markers).
   - GREEN: implement `generate_pdf_report` and `generate_excel_export` using
     templated HTML and `pandas`; mock AI calls in tests.
5. **Frontend Workspace**
   - RED: tests in `frontend/src/pages/deals/ValuationSuite.test.tsx` covering
     forms, results, error handling.
   - GREEN: build components/hooks in `frontend/src/pages/deals/valuation/` with
     React Query and charts.
6. **Exit Criteria**: Tests green, migrations applied, docs updated, commit
   `feat(DEV-011): complete valuation suite` prepared.

### Phase 2 Stories

- **DEV-012 (Tasks & automation)**: Task models/service, deal task API, React
  boards, Celery jobs. References: `task_service.py`, Celery docs.
- **DEV-013 (Deal matching)**: Matching service, Claude 3 integration, dashboard
  UI. References: AI integration guides.
- **DEV-014 (Document generation)**: GPT-4 drafting, storage workflows, editors.
  References: `document_service.py` patterns.
- **DEV-015 (Content hub)**: Campaign planner, GoHighLevel sync, analytics.
  References: marketing dashboards.

### TDD Pattern

1. Define acceptance tests in story doc.
2. RED backend (unit + API) tests.
3. RED frontend component tests.
4. Validate async tasks and external API mocks.
5. Update docs/tracker upon completion.

### Phase 3 Stories

- **DEV-016 (Podcast Studio - SUBSCRIPTION ADD-ON)**: **CRITICAL SCOPE CHANGE** -
  Podcast Studio is now a subscription-gated add-on feature available to paying
  tenants only. Each tenant gets their own fully functional podcast workspace
  based on their Clerk subscription tier.

  **Subscription Tier Matrix**:
  - **Starter (£279/mo)**: No podcast access
  - **Professional (£598/mo)**: Audio-only podcasts, 10 episodes/month, basic transcription
  - **Premium (£1,598/mo)**: Audio + video, unlimited episodes, YouTube auto-publish, AI transcription
  - **Enterprise (£2,997/mo)**: Full suite + StreamYard-quality live streaming, multi-language, priority support

  **Implementation Requirements**:
  1. Clerk middleware for subscription tier validation
  2. Feature entitlement service with quota enforcement
  3. API endpoints with 403 responses for insufficient tiers
  4. Frontend feature gates and upgrade CTAs
  5. Whisper transcription (Professional+)
  6. YouTube integration (Premium+)
  7. Live streaming capabilities (Enterprise only)
  8. Background jobs with tier-aware limits
  9. Comprehensive tier-based testing

  **TDD Approach**:
  - RED: Write tests for tier checking middleware
  - GREEN: Implement Clerk subscription validation
  - RED: Write tests for podcast service with quota limits
  - GREEN: Implement service layer with tier gates
  - RED: Write API tests with 403 for locked features
  - GREEN: Implement API routes with entitlement checks
  - RED: Write UI tests for feature flags
  - GREEN: Implement frontend with conditional rendering
  - REFACTOR: Optimize and document subscription logic

- **DEV-017 (Event management)**: Stripe ticketing, check-in tools; support
  multi-currency flows.
- **DEV-018 (Community platform)**: Messaging, moderation, RBAC; maintain
  privacy and audit logs.

Execution checklist mirrors earlier phases: migrations, services, auth, API,
React modules, and E2E coverage as needed. **For DEV-016, add subscription
tier enforcement at every layer.**

### Sales & Marketing Roadmap

- Phase 1 — Test coverage: baseline components/tests (see marketing work
  summary).
- Phase 2 — Asset generation: icons, logos, avatars, Open Graph assets (marketing
  plan).
- Phase 3 — Performance: WebP, lazy loading, bundle analysis (marketing plan).
- Phase 4 — SEO: sitemap.xml, schema, meta tags (marketing plan).
- Phase 5 — Analytics: GA4, conversion events, heatmaps (marketing plan).
- Phase 6 — Content: testimonials, case studies, blog (marketing plan).
- Phase 7 — Additional pages: Pricing, Features, About, Legal suite (marketing
  plan).
- Phase 8 — Conversion: CRO experiments, trust signals (marketing plan).
- Phase 9 — QA & polish: accessibility, cross-browser, content QA (marketing
  plan).
- Phase 10 — Deployment: build, deploy, monitoring, release (marketing plan).

## 5. Subscription-Gated Feature Architecture

### Overview

The platform implements **subscription tier-based feature access** using Clerk as
the identity and subscription authority. Premium features (e.g., Podcast Studio)
are conditionally available based on the organization's active subscription tier.

### Subscription Tiers

| Tier | Monthly Price | Podcast Access | Episodes/Month | Features |
|------|--------------|----------------|----------------|----------|
| **Starter** | £279 | ❌ None | - | Core deal flow, basic analytics |
| **Professional** | £598 | ✅ Audio Only | 10 | + Audio podcasts, basic transcription |
| **Premium** | £1,598 | ✅ Full Suite | Unlimited | + Video, YouTube, AI transcription |
| **Enterprise** | £2,997 | ✅ Advanced | Unlimited | + Live streaming, multi-language, priority |

### Technical Implementation

#### 1. Clerk Integration

```python
# backend/app/core/subscription.py
from clerk_backend_api import Clerk

async def get_organization_tier(organization_id: str) -> str:
    """Fetch subscription tier from Clerk."""
    clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)
    org = await clerk.organizations.get(organization_id)
    return org.public_metadata.get("subscription_tier", "starter")
```

#### 2. Feature Entitlement Service

```python
# backend/app/services/entitlement_service.py
from typing import Dict, List

FEATURE_ENTITLEMENTS: Dict[str, List[str]] = {
    "podcast_audio": ["professional", "premium", "enterprise"],
    "podcast_video": ["premium", "enterprise"],
    "youtube_integration": ["premium", "enterprise"],
    "live_streaming": ["enterprise"],
}

async def check_feature_access(
    organization_id: str,
    feature: str
) -> bool:
    """Check if organization has access to feature."""
    tier = await get_organization_tier(organization_id)
    allowed_tiers = FEATURE_ENTITLEMENTS.get(feature, [])
    return tier in allowed_tiers
```

#### 3. API Middleware

```python
# backend/app/api/deps.py
from fastapi import HTTPException, Depends

async def require_feature(feature: str):
    """Dependency to enforce feature access."""
    async def check(
        current_user: User = Depends(get_current_user)
    ):
        has_access = await check_feature_access(
            current_user.organization_id,
            feature
        )
        if not has_access:
            raise HTTPException(
                status_code=403,
                detail=f"Feature '{feature}' requires subscription upgrade"
            )
        return current_user
    return check
```

#### 4. API Endpoint Usage

```python
# backend/app/api/v1/endpoints/podcast.py
@router.post("/episodes")
async def create_episode(
    episode: EpisodeCreate,
    current_user: User = Depends(require_feature("podcast_audio"))
):
    """Create podcast episode (Professional+ only)."""
    return await podcast_service.create_episode(episode, current_user)
```

#### 5. Frontend Feature Gates

```typescript
// frontend/src/hooks/useFeatureAccess.ts
export const useFeatureAccess = (feature: string) => {
  const { organization } = useAuth();

  const { data: hasAccess } = useQuery({
    queryKey: ['feature-access', feature],
    queryFn: () => checkFeatureAccess(feature),
  });

  return { hasAccess, tier: organization?.tier };
};

// Usage in components
const PodcastStudio = () => {
  const { hasAccess, tier } = useFeatureAccess('podcast_audio');

  if (!hasAccess) {
    return <UpgradePrompt feature="Podcast Studio" requiredTier="Professional" />;
  }

  return <PodcastWorkspace />;
};
```

### Testing Strategy

1. **Unit Tests**: Test tier checking logic in isolation
2. **Integration Tests**: Test API 403 responses for insufficient tiers
3. **E2E Tests**: Test full user journey with tier upgrades
4. **Mocking**: Mock Clerk responses for deterministic tests

```python
# Example test
@pytest.mark.asyncio
async def test_podcast_requires_professional_tier(client, starter_user):
    response = await client.post(
        "/api/podcast/episodes",
        headers=starter_user.auth_headers,
        json={"title": "Test Episode"}
    )
    assert response.status_code == 403
    assert "subscription upgrade" in response.json()["detail"]
```

### Quota Enforcement

```python
# backend/app/services/quota_service.py
async def check_monthly_quota(
    organization_id: str,
    resource_type: str
) -> bool:
    """Check if organization is within monthly quota."""
    tier = await get_organization_tier(organization_id)

    quotas = {
        "professional": {"episodes": 10},
        "premium": {"episodes": -1},  # unlimited
        "enterprise": {"episodes": -1},
    }

    current_usage = await get_monthly_usage(organization_id, resource_type)
    limit = quotas.get(tier, {}).get(resource_type, 0)

    return limit == -1 or current_usage < limit
```

## 6. Quality Gates & Verification

- **Unit / Integration Tests**: Required for every module addition across backend
  and both frontends.
- **Coverage Tracking**: `pytest --cov=app`, `npm test -- --coverage`; document
  percentages post-story.
- **Static Analysis**: Run linters before committing; resolve warnings.
- **Security**: Enforce tenant scoping, validate payloads, secure external
  calls.
- **Performance**: Add indexes, cache, optimize bundles; monitor Lighthouse
  scores.
- **User Acceptance**: Provide demos/screenshots; log manual QA in docs.

## 6. Deployment & Documentation Checklist

- **Migrations**: Create/apply Alembic revisions; log commands in story docs.
- **Environment Variables**: Update `.env.example`, Render dashboards, and
  `PRODUCTION-DEPLOYMENT-GUIDE.md` for new keys.
- **CI Verification**: Ensure automated pipelines pass before merging.
- **Render Release**: Trigger backend/frontend deploys; run smoke tests against
  production URLs.
- **Documentation Updates**
  - Mark story status as ✅ with date, test counts, coverage.
  - Update `docs/bmad/BMAD_PROGRESS_TRACKER.md` with metrics.
  - Refresh marketing docs and README when user-facing features change.
  - Add runbooks when new procedures exist.
- **Handoff Artifacts**: Produce `CODEX-COMPLETION-SUMMARY.md` and marketing
  completion summary capturing metrics, risks, QA focus.

## 7. Risk Register & Mitigations

- Insufficient test depth (High) — enforce RED-first tests and cover success
  and failure paths.
- AI dependency failures (Medium) — add fallbacks, timeouts, feature flags.
- Multi-tenant leakage (Critical) — always scope by `organization_id`, add
  regression tests.
- **Subscription bypass vulnerabilities (Critical)** — enforce tier checking at
  API, service, and frontend layers; add comprehensive 403 tests; never trust
  client-side checks alone.
- **Clerk API failures (High)** — implement caching for tier data; add circuit
  breakers; graceful degradation with safe defaults (deny access on failure).
- **Quota enforcement gaps (Medium)** — track usage in real-time; prevent
  race conditions with database constraints; add alerts for quota violations.
- Long-running tasks (Medium) — configure Celery retries, monitor queues.
- Deployment drift (Medium) — update docs after deploy, verify environment
  parity.
- Marketing asset gaps (Medium) — track asset backlog, schedule reviews, run QA
  checks.

## 8. Definition of Done (Project Level)

1. Platform stories DEV-011 → DEV-018 marked ✅; marketing phases 1–10 complete.
2. BMAD tracker and marketing plan show 100% with test counts/coverage.
3. Backend/frontend (platform + marketing) suites pass with thresholds met.
4. Render production deployment verified via smoke tests.
5. Completion summaries published with metrics and recommendations.
6. Conventional Commits chronicle each closure.
7. Handoff includes testing evidence, risk notes, final readiness statements.

## 9. Quick Reference Index

- **Stories**: `docs/bmad/stories/DEV-011-valuation-suite.md` → `DEV-018-*.md`
- **Marketing Docs**: `ApexDeliver Sales & Marketing Website - Complete
  Development Plan.md`, `Cursor Development Continuation Guide.md`, `ApexDeliver
  Website Development - Work Summary.md`
- **Progress Tracker**: `docs/bmad/BMAD_PROGRESS_TRACKER.md`
- **Architecture**: `docs/bmad/technical_specifications.md`
- **Backend Services**: `backend/app/services/`
- **API Routers**: `backend/app/api/v1/endpoints/`
- **Frontend Pages**: `frontend/src/pages/`, `frontend/src/components/marketing/`
- **Tests**: `backend/tests/`, `frontend/src/**/*.test.tsx`,
  `frontend/src/components/marketing/*.test.tsx`
- **Deployment Guides**: `PRODUCTION-DEPLOYMENT-GUIDE.md`,
  `RENDER_DEPLOYMENT_INSTRUCTIONS.md`