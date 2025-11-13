# M&A SaaS Platform - v1.1 Roadmap

**Target Release**: Q1 2026 (January-February 2026)
**Focus**: Test Suite Stabilization + Performance Optimization
**Estimated Effort**: 40-60 hours total

---

## Overview

v1.1 focuses on hardening the test infrastructure, completing minor pending features, and optimizing performance. The core product (v1.0) is feature-complete and production-ready; v1.1 addresses technical debt and quality-of-life improvements.

**Goals**:
- ✅ Achieve 90%+ backend test suite pass rate (full suite)
- ✅ Implement document export queue polling UI
- ✅ Reach 90%+ Lighthouse performance score
- ✅ Fix all remaining test failures
- ✅ Achieve 90%+ backend code coverage

---

## Phase 1: Critical Fixes (Week 1-2)

### 1.1 Test Suite Stabilization (P0)

**Effort**: 8-12 hours
**Assignee**: Backend Team
**Status**: Planned

#### Problem
Backend test suite exhibits order-dependency issues:
- Full suite: 30% pass rate
- By module: 90%+ pass rate
- Individual: 95%+ pass rate

Root causes:
- Test execution order dependencies
- Shared mock state not being cleaned
- Async resource cleanup timing issues

#### Solution

**Step 1: Fixture Scoping Analysis** (2 hours)
```python
# Analyze current fixture scopes in conftest.py
# Identify fixtures that should be function-scoped vs session-scoped
# Document dependencies between fixtures
```

**Tasks**:
- [ ] Audit all fixtures in `backend/tests/conftest.py`
- [ ] Identify shared state fixtures (engine, db_session, client)
- [ ] Document fixture dependencies
- [ ] Create fixture dependency graph

**Step 2: Mock Cleanup** (3-4 hours)
```python
# Add explicit teardown for all mocks
@pytest.fixture(autouse=True)
def reset_mocks():
    yield
    # Reset Stripe mock
    stripe_mock.reset_mock()
    # Reset OpenAI mock
    openai_mock.reset_mock()
    # Reset Celery mock
    celery_mock.reset_mock()
```

**Tasks**:
- [ ] Add `reset_mock()` calls to autouse fixture
- [ ] Ensure Stripe mock state clears between tests
- [ ] Ensure OpenAI mock state clears between tests
- [ ] Ensure Celery mock state clears between tests
- [ ] Test with problematic test modules

**Step 3: Database Isolation** (2-3 hours)
```python
# Ensure complete database cleanup between tests
@pytest.fixture(autouse=True)
def _reset_database(engine):
    yield
    # Drop all tables
    _reset_metadata(engine)
    # Recreate schema
    Base.metadata.create_all(engine, checkfirst=True)
```

**Tasks**:
- [ ] Verify `_reset_database` fixture is working
- [ ] Add explicit foreign key constraint handling
- [ ] Ensure all tables are dropped between tests
- [ ] Verify no orphaned connections

**Step 4: Async Resource Cleanup** (1-2 hours)
```python
# Add proper async resource cleanup
@pytest.fixture(autouse=True)
async def cleanup_async_resources():
    yield
    # Close all async connections
    # Cancel pending tasks
    # Reset event loop state
```

**Tasks**:
- [ ] Add async cleanup fixture
- [ ] Close all pending async connections
- [ ] Cancel pending asyncio tasks
- [ ] Reset event loop state between tests

**Step 5: Verification** (1-2 hours)
- [ ] Run full suite 3 times, verify consistent results
- [ ] Run randomized test order: `pytest --random-order`
- [ ] Run parallel: `pytest -n 4`
- [ ] Document any remaining flaky tests

**Success Criteria**:
- ✅ Full suite pass rate ≥ 90%
- ✅ Consistent results across multiple runs
- ✅ No test order dependencies
- ✅ Works with parallel execution

---

### 1.2 Document Export Queue UI (P0)

**Effort**: 2-4 hours
**Assignee**: Frontend Team
**Status**: Planned

#### Problem
Export job completion requires manual page refresh. Backend API works correctly, but frontend lacks polling mechanism.

#### Solution

**TDD Implementation**:

**RED - Write Failing Tests** (30 minutes)
```typescript
// frontend/src/components/documents/DocumentExporter.test.tsx
describe('DocumentExporter export queue', () => {
  it('should poll export job status', async () => {
    // Mock job status API
    // Verify polling every 2 seconds
    // Verify stops when complete
  });

  it('should show progress indicator', () => {
    // Verify loading spinner
    // Verify "Exporting..." message
  });

  it('should download file when complete', async () => {
    // Mock successful export
    // Verify download triggered
  });

  it('should enforce export quotas', async () => {
    // Mock quota exceeded
    // Verify upgrade prompt shown
  });
});
```

**GREEN - Implement Feature** (1-2 hours)
```typescript
// frontend/src/components/documents/DocumentExporter.tsx
const useExportJob = (jobId: string) => {
  return useQuery({
    queryKey: ['export-job', jobId],
    queryFn: () => fetchExportStatus(jobId),
    refetchInterval: (data) => {
      if (data?.status === 'completed') return false;
      if (data?.status === 'failed') return false;
      return 2000; // Poll every 2 seconds
    },
    enabled: !!jobId,
  });
};

const handleExport = async () => {
  // Check quota first
  if (!hasExportQuota) {
    showUpgradePrompt();
    return;
  }

  // Start export job
  const job = await createExportJob(documentId, format);
  setExportJobId(job.id);
};
```

**REFACTOR - Polish** (30 minutes)
- Add proper error handling
- Add user-friendly messages
- Add cancel button
- Improve UX

**Tasks**:
- [ ] Write tests (RED)
- [ ] Implement polling mechanism (GREEN)
- [ ] Add progress indicators
- [ ] Implement quota checks
- [ ] Add error handling
- [ ] Refactor for code quality
- [ ] Verify all tests pass

**Success Criteria**:
- ✅ Export status polls automatically
- ✅ Progress shown to user
- ✅ File downloads when ready
- ✅ Quota enforcement working
- ✅ All tests passing

---

### 1.3 CreateDealModal Validation Fix (P1)

**Effort**: 30 minutes
**Assignee**: Frontend Team
**Status**: Planned

#### Problem
1 failing test: `CreateDealModal` - "should show error for negative deal size"

#### Solution

**TDD Fix**:

**Step 1: Verify Test** (5 minutes)
```bash
cd frontend
npm test -- CreateDealModal.test.tsx
```

**Step 2: Fix Validation** (15 minutes)
```typescript
// frontend/src/components/deals/CreateDealModal.tsx
const handleSubmit = async () => {
  // Add validation
  if (dealSize < 0) {
    setError('Deal size must be positive');
    return;
  }

  // ... rest of logic
};
```

**Step 3: Verify Fix** (10 minutes)
```bash
npm test -- CreateDealModal.test.tsx
# All tests should pass
```

**Tasks**:
- [ ] Run test to verify failure
- [ ] Add negative number validation
- [ ] Add error message display
- [ ] Run test to verify pass
- [ ] Manual UI testing

**Success Criteria**:
- ✅ Test passes
- ✅ UI shows error for negative values
- ✅ No regression in other tests

---

## Phase 2: Optimization (Week 3-4)

### 2.1 Backend Coverage to 90% (P1)

**Effort**: 20-30 hours
**Assignee**: Backend Team
**Status**: Planned

#### Current State
- Full suite coverage: 54%
- Modular coverage estimate: ~75%
- Target: 90%
- Gap: +897 statements to cover

#### Strategy

**Step 1: Coverage Analysis** (2 hours)
```bash
cd backend
pytest --cov=app --cov-report=html --cov-report=json
# Review coverage.json for gaps
```

**Step 2: Prioritize Uncovered Code** (2 hours)
Focus areas (from previous analysis):
- Document service error paths: 121 statements
- Subscription routes + service: 110 statements
- Error handling in API endpoints
- Edge cases in services

**Step 3: TDD Implementation** (16-26 hours)
For each uncovered code path:
1. **RED**: Write test that exercises the path
2. **GREEN**: Verify code handles it correctly (or fix)
3. **REFACTOR**: Improve code quality

Example:
```python
# tests/test_subscription_service_edge_cases.py
def test_handle_subscription_updated_with_invalid_data():
    """Test subscription webhook with malformed data."""
    # RED: Write test
    # GREEN: Fix service to handle gracefully
    # REFACTOR: Extract validation logic
```

**Tasks**:
- [ ] Analyze coverage gaps
- [ ] Create test plan for each gap
- [ ] Implement tests following TDD
- [ ] Verify coverage reaches 90%
- [ ] Document any intentionally excluded code

**Success Criteria**:
- ✅ Backend coverage ≥ 90%
- ✅ All new tests passing
- ✅ No regression in existing tests

---

### 2.2 Frontend Performance Optimization (P1)

**Effort**: 4-6 hours
**Assignee**: Frontend Team
**Status**: Planned

#### Current State
- Lighthouse score: 74%
- Target: 90%+
- Issues: ValuationSuite not code-split, render-blocking resources

#### Solution

**Step 1: Code Splitting** (2-3 hours)
```typescript
// src/App.tsx - Use lazy loading
const ValuationSuite = lazy(() => import('./pages/ValuationSuite'));
const PodcastStudio = lazy(() => import('./pages/PodcastStudio'));
const EventCreator = lazy(() => import('./pages/EventCreator'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/valuations/*" element={<ValuationSuite />} />
    <Route path="/podcast/*" element={<PodcastStudio />} />
    <Route path="/events/create" element={<EventCreator />} />
  </Routes>
</Suspense>
```

**Tasks**:
- [ ] Implement lazy loading for ValuationSuite
- [ ] Implement lazy loading for PodcastStudio
- [ ] Implement lazy loading for EventCreator
- [ ] Add loading spinners
- [ ] Test navigation still works

**Step 2: Bundle Optimization** (1-2 hours)
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'clerk': ['@clerk/clerk-react'],
          'charts': ['recharts'],
        },
      },
    },
  },
});
```

**Tasks**:
- [ ] Configure manual chunks for large vendors
- [ ] Split React, Clerk, Charts into separate bundles
- [ ] Verify bundle sizes reduced

**Step 3: Resource Hints** (30 minutes)
```html
<!-- index.html -->
<link rel="preconnect" href="https://api.clerk.com">
<link rel="preconnect" href="https://api.stripe.com">
<link rel="dns-prefetch" href="https://ma-saas-backend.onrender.com">
```

**Tasks**:
- [ ] Add preconnect for external APIs
- [ ] Add dns-prefetch for backend
- [ ] Test performance improvement

**Step 4: Verification** (30 minutes)
```bash
cd frontend
npm run audit:local
# Verify Lighthouse score ≥ 90%
```

**Tasks**:
- [ ] Run Lighthouse audit
- [ ] Verify performance ≥ 90%
- [ ] Verify no accessibility regression
- [ ] Document results

**Success Criteria**:
- ✅ Lighthouse performance score ≥ 90%
- ✅ ValuationSuite bundle < 200 KB
- ✅ Initial load time improved
- ✅ No regression in functionality

---

## Phase 3: Infrastructure (Week 5-6)

### 3.1 CI/CD Hardening (P2)

**Effort**: 6-8 hours
**Assignee**: DevOps Team
**Status**: Planned

#### Tasks

**Backend CI**:
- [ ] Add GitHub Actions workflow for backend tests
- [ ] Run tests by module (not full suite)
- [ ] Add coverage reporting to PR comments
- [ ] Add deployment health checks

**Frontend CI**:
- [ ] Add GitHub Actions workflow for frontend tests
- [ ] Add Lighthouse CI (on Linux runner)
- [ ] Add bundle size monitoring
- [ ] Add visual regression tests (optional)

**Render Deployment**:
- [ ] Investigate `update_failed` errors
- [ ] Add deployment rollback strategy
- [ ] Add deployment notifications
- [ ] Document deployment process

**Success Criteria**:
- ✅ Automated tests run on every PR
- ✅ Coverage reports visible
- ✅ Deployment issues resolved
- ✅ Rollback strategy documented

---

## Success Metrics

### Code Quality
- [ ] Backend test pass rate ≥ 90% (full suite)
- [ ] Backend coverage ≥ 90%
- [ ] Frontend tests 100% passing
- [ ] Frontend coverage ≥ 85% (maintained)

### Performance
- [ ] Lighthouse performance ≥ 90%
- [ ] LCP < 2.5s
- [ ] Bundle size < 500 KB (main chunk)

### User Experience
- [ ] Document export with progress indicators
- [ ] No known UI validation issues
- [ ] All features tested and working

### Infrastructure
- [ ] Automated CI/CD pipeline
- [ ] Deployment health checks
- [ ] Rollback strategy documented

---

## Timeline

### January 2026 (Weeks 1-2)
- Week 1: Test suite stabilization + Document export queue UI
- Week 2: CreateDealModal fix + Backend coverage work (Part 1)

### February 2026 (Weeks 3-4)
- Week 3: Backend coverage work (Part 2) + Frontend performance optimization
- Week 4: CI/CD hardening + Final testing

### Release: End of February 2026

---

## Post-v1.1 (v1.2 Backlog)

### Medium Priority
- Render backend deployment investigation
- Lighthouse CI Windows support
- Additional backend coverage (90% → 95%)
- Advanced performance optimizations (95%+ score)

### Low Priority
- E2E test suite (Playwright/Cypress)
- Visual regression testing
- Load testing
- Security audit

---

## Resources

### Documentation
- [V1-0-COMPLETION-REPORT.md](./V1-0-COMPLETION-REPORT.md) - Current state analysis
- [BMAD_PROGRESS_TRACKER.md](./BMAD_PROGRESS_TRACKER.md) - Development history
- [docs/testing/ACCESSIBILITY-TESTING.md](../testing/ACCESSIBILITY-TESTING.md) - Testing guide

### Test Evidence
- Backend: `test_results_backend_full.txt`
- Frontend: `docs/tests/2025-11-13-vitest-run-from-gitbash.txt`
- Coverage: `backend/htmlcov/index.html`

---

## Conclusion

v1.1 is a **quality-focused release** that addresses technical debt from v1.0, hardens the test infrastructure, and optimizes performance. The work is well-scoped (40-60 hours), has clear success criteria, and will result in a more robust, performant platform.

**Estimated Release**: End of February 2026
**Total Effort**: 40-60 hours
**Team**: Backend (30-40h), Frontend (8-10h), DevOps (6-8h)

---

**Roadmap Created**: November 13, 2025
**Target Release**: February 2026
**Status**: Planned
