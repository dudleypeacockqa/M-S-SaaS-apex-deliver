# Sprint 1A Test Coverage Enhancement Plan

**Created**: 2025-11-10
**Sprint**: Sprint 1A
**Goal**: Achieve 90%+ backend coverage, 70%+ frontend coverage
**Estimated Effort**: 50 hours total
**Expected Outcome**: +280 tests across backend, frontend, and integration suites

---

## Executive Summary

### Current State
- **Backend**: Mixed coverage (79% routes, 59% subscription service)
- **Frontend**: 38% component coverage (73 test files for 194 components)
- **Integration**: Minimal E2E coverage for critical flows
- **Issues**: 93 Vitest failures, 6 services with zero tests

### Target State
- **Backend**: 90%+ coverage with comprehensive service-level tests
- **Frontend**: 70%+ coverage with component and integration tests
- **Integration**: E2E coverage for all P0 user flows
- **Quality**: All tests passing, TDD methodology enforced

---

## Priority 0: Critical Test Additions (32 hours)

### 1. Pipeline Template Service Tests ⚠️ HIGHEST PRIORITY
**File to Create**: `backend/tests/test_pipeline_template_service.py`
**Current Coverage**: 0% (no tests exist)
**Effort**: 4 hours
**Test Count**: 10-12 tests

**Critical Scenarios**:
```python
def test_list_templates_returns_default_first()
def test_get_template_validates_organization_access()
def test_create_template_clears_existing_default()
def test_update_template_stage_order_validation()
def test_delete_template_cascade_behavior()
def test_apply_stage_changes_handles_duplicate_order_index()
def test_clear_default_affects_only_org_templates()
def test_template_inheritance_from_tier()
def test_stage_sla_hours_calculation()
def test_stage_probability_weight_validation()
```

**Rationale**: Recently added feature (migration dc2c0f69c1b1), integrated with Kanban UI, zero service-level coverage creates deployment risk.

**TDD Command**:
```bash
pytest backend/tests/test_pipeline_template_service.py -v \
  --cov=app.services.pipeline_template_service \
  --cov-report=term-missing
```

---

### 2. User Service + Organization Auto-Creation Tests
**File to Create**: `backend/tests/test_user_service.py`
**Current Coverage**: 0% (no tests exist)
**Effort**: 4 hours
**Test Count**: 10-12 tests

**Critical Scenarios**:
```python
def test_create_user_auto_creates_organization_when_missing()  # NEW BEHAVIOR!
def test_create_user_with_existing_org_links_correctly()
def test_update_user_role_enforces_rbac()
def test_delete_user_archives_related_data()
def test_list_users_by_organization_scoped()
def test_get_user_by_clerk_id_caches_result()
def test_sync_clerk_metadata_handles_conflicts()
def test_user_organization_claim_mismatch_handled()
```

**Rationale**: Recent auth.py fix (commit 01d4814) added organization auto-creation logic that is completely untested. Critical auth flow regression risk.

**TDD Command**:
```bash
pytest backend/tests/test_user_service.py -v \
  --cov=app.services.user_service \
  --cov-report=term-missing
```

---

### 3. Document Room Frontend Components
**Files to Create**:
- `frontend/src/components/documents/FolderTree.test.tsx`
- `frontend/src/components/documents/PermissionModal.test.tsx`

**Current Coverage**: 0% (no test files)
**Effort**: 8 hours
**Test Count**: 40-50 tests

**FolderTree.test.tsx Critical Scenarios**:
```typescript
describe('FolderTree', () => {
  it('should render folder hierarchy from API')
  it('should expand/collapse folders on click')
  it('should highlight selected folder')
  it('should show folder permissions badge')
  it('should handle drag-and-drop folder reordering')
  it('should display context menu for folder actions')
  it('should handle empty folder state')
  it('should show loading skeleton while fetching')
  it('should handle API error gracefully')
})
```

**PermissionModal.test.tsx Critical Scenarios**:
```typescript
describe('PermissionModal', () => {
  it('should display current folder permissions')
  it('should add user permission with role selection')
  it('should remove user permission with confirmation')
  it('should update permission role')
  it('should validate permission changes before save')
  it('should handle inherited permissions display')
  it('should enforce RBAC rules for permission management')
})
```

**Rationale**: DEV-008 feature (Secure Document & Data Room) has zero frontend test coverage. Core feature blocker.

**TDD Command**:
```bash
npm run test -- src/components/documents/FolderTree.test.tsx --coverage
npm run test -- src/components/documents/PermissionModal.test.tsx --coverage
```

---

### 4. Deal Matching Workspace
**File to Fix/Expand**: `frontend/src/pages/deals/MatchingWorkspace.test.tsx`
**Current Status**: Tests exist but failing
**Effort**: 6 hours
**Test Count**: 20-25 tests

**CriteriaBuilderModal Missing Tests**:
```typescript
describe('CriteriaBuilderModal', () => {
  it('should validate industry selection required')
  it('should handle multi-select for industries')
  it('should save criteria to React Query cache')
  it('should display industry suggestions as user types')
  it('should enforce tier-based criteria limits')
})
```

**MatchActions Missing Tests**:
```typescript
describe('MatchActions', () => {
  it('should save match and update cache optimistically')
  it('should pass match and remove from list')
  it('should request introduction with message')
  it('should handle API errors with rollback')
})
```

**AnalyticsDashboard Missing Tests**:
```typescript
describe('AnalyticsDashboard', () => {
  it('should display match score distribution chart')
  it('should show recent matches timeline')
  it('should calculate success rate KPI')
  it('should filter by date range')
})
```

**Rationale**: DEV-018 feature (Intelligent Deal Matching) has failing tests. Must be fixed before feature completion.

**TDD Command**:
```bash
npm run test -- src/pages/deals/MatchingWorkspace.test.tsx --coverage
```

---

### 5. Invite Service Tests
**File to Create**: `backend/tests/test_invite_service.py`
**Current Coverage**: 0% (no tests exist)
**Effort**: 5 hours
**Test Count**: 12-15 tests

**Critical Scenarios**:
```python
def test_create_invite_generates_unique_token()
def test_create_invite_enforces_org_seat_limits()
def test_accept_invite_creates_user_and_deletes_token()
def test_accept_invite_validates_token_expiry()
def test_list_pending_invites_scoped_by_org()
def test_revoke_invite_soft_deletes_record()
def test_resend_invite_updates_timestamp_and_token()
def test_invite_email_sends_correctly()
def test_duplicate_invite_to_same_email_prevented()
def test_accept_invite_with_invalid_token_fails()
def test_invite_to_max_seats_org_fails()
```

**Rationale**: Critical onboarding flow, affects user acquisition and team collaboration. No test coverage.

**TDD Command**:
```bash
pytest backend/tests/test_invite_service.py -v \
  --cov=app.services.invite_service \
  --cov-report=term-missing
```

---

### 6. Deal Service Tests
**File to Create**: `backend/tests/test_deal_service.py`
**Current Coverage**: API tests exist, no service-level tests
**Effort**: 5 hours
**Test Count**: 12-15 tests

**Critical Scenarios**:
```python
def test_create_deal_validates_pipeline_template()
def test_create_deal_sets_default_stage()
def test_update_deal_stage_triggers_sla_tracking()
def test_calculate_weighted_pipeline_value()
def test_deal_stage_transition_validation()
def test_deal_filtering_by_owner_and_stage()
def test_deal_archival_preserves_audit_trail()
def test_deal_assignment_enforces_org_membership()
def test_deal_duplication_handling()
def test_deal_stage_history_tracking()
```

**Rationale**: Core business logic for deal management, pipeline template integration untested at service level.

**TDD Command**:
```bash
pytest backend/tests/test_deal_service.py -v \
  --cov=app.services.deal_service \
  --cov-report=term-missing
```

---

## Priority 1: High Priority Test Additions (18 hours)

### 7. Valuation Service KPI Edge Cases
**File to Expand**: `backend/tests/test_valuation_service.py`
**Current Coverage**: Good for main functions, missing edge cases for new KPIs
**Effort**: 2 hours
**Test Count**: 5-8 additional tests

**Missing Edge Cases**:
```python
def test_go_to_market_kpis_with_negative_arr()
def test_go_to_market_kpis_division_by_zero_safety()
def test_go_to_market_kpis_extreme_churn_rates()
def test_go_to_market_kpis_zero_sales_spend()
def test_go_to_market_kpis_fractional_customers()
```

**TDD Command**:
```bash
pytest backend/tests/test_valuation_service.py::test_go_to_market_kpis_edge_cases -v
```

---

### 8. Podcast Video Upload Frontend
**File to Expand**: `frontend/src/components/podcast/VideoUploadModal.test.tsx`
**Current Coverage**: 26/26 passing, but video path incomplete
**Effort**: 4 hours
**Test Count**: 10-12 additional tests

**Missing Video Upload Tests**:
```typescript
describe('VideoUploadModal - Video Features', () => {
  it('should validate video file format (MP4/MOV only)')
  it('should enforce tier-based file size limits')
  it('should display upload progress with cancel button')
  it('should show quota warning when near limit')
  it('should trigger transcription job on success')
  it('should handle S3 upload failure with retry')
  it('should preview video thumbnail before upload')
  it('should extract video metadata (duration, resolution)')
})
```

**TDD Command**:
```bash
npm run test -- src/components/podcast/VideoUploadModal.test.tsx --coverage
```

---

### 9. Auth E2E Flow - Organization Auto-Creation
**File to Create**: `frontend/src/tests/integration/AuthOrgCreationFlow.test.tsx`
**Current Coverage**: 0% (no E2E tests)
**Effort**: 5 hours
**Test Count**: 10-12 E2E tests

**E2E Scenarios**:
```typescript
describe('Auth - Organization Creation E2E', () => {
  it('should create user and auto-create org on first login')
  it('should redirect to dashboard after org creation')
  it('should handle org creation failures gracefully')
  it('should sync Clerk org to database org')
  it('should assign default subscription tier on creation')
  it('should create default pipeline template for new org')
  it('should handle concurrent user creation in same org')
})
```

**TDD Command**:
```bash
npm run test:e2e -- AuthOrgCreationFlow.test.tsx
```

---

### 10. Valuation Suite Frontend KPI Panel
**File to Expand**: `frontend/src/pages/deals/valuation/ValuationSuite.test.tsx`
**Current Coverage**: 13/13 passing, but KPI panel untested
**Effort**: 3 hours
**Test Count**: 8-10 tests

**Missing KPI Panel Tests**:
```typescript
describe('GTM KPIs Panel', () => {
  it('should display CAC and LTV calculations')
  it('should show LTV:CAC ratio with color coding')
  it('should handle zero/null input values gracefully')
  it('should update calculations on form input change')
  it('should display magic number with tooltip')
  it('should show sales efficiency percentage')
  it('should format currency values correctly')
})
```

**TDD Command**:
```bash
npm run test -- src/pages/deals/valuation/ValuationSuite.test.tsx --coverage
```

---

### 11. Deal Pipeline E2E Flow
**File to Create**: `frontend/src/tests/integration/DealPipelineFlow.test.tsx`
**Current Coverage**: 0% (no E2E tests)
**Effort**: 4 hours
**Test Count**: 5-8 E2E tests

**E2E Scenarios**:
```typescript
describe('Deal Pipeline E2E', () => {
  it('should create deal → assign to pipeline → display in Kanban with SLA/probability')
  it('should drag deal between stages → update weighted value → persist')
  it('should apply pipeline template → generate stage tasks')
  it('should track SLA violations on stage transitions')
  it('should calculate and display weighted pipeline value')
})
```

**TDD Command**:
```bash
npm run test:e2e -- DealPipelineFlow.test.tsx
```

---

## Priority 2: Medium Priority (10 hours)

### 12. Task Template Service Tests
**File to Create**: `backend/tests/test_task_template_service.py`
**Effort**: 3 hours, Test Count: 8-10

### 13. RBAC Audit Service Tests
**File to Create**: `backend/tests/test_rbac_audit_service.py`
**Effort**: 3 hours, Test Count: 8-10

### 14. Organization Service Additional Tests
**File to Expand**: `backend/tests/test_organization_service.py`
**Effort**: 3 hours, Test Count: 8-10

### 15. Document Room E2E Flow
**File to Create**: `frontend/src/tests/integration/DocumentRoomFlow.test.tsx`
**Effort**: 6 hours (P2 due to P0 component tests)

---

## TDD Execution Cadence

### RED → GREEN → REFACTOR Workflow

**For Each Test File**:
1. **RED**: Write failing test first
   ```bash
   # Run test, confirm it fails
   pytest backend/tests/test_pipeline_template_service.py::test_list_templates_returns_default_first -v
   ```

2. **GREEN**: Write minimal implementation
   ```bash
   # Implement just enough to pass
   # Re-run test, confirm it passes
   ```

3. **REFACTOR**: Improve code quality
   ```bash
   # Clean up, optimize, add docstrings
   # Re-run test, confirm still passes
   ```

4. **COMMIT**: Commit after each passing test
   ```bash
   git add backend/tests/test_pipeline_template_service.py backend/app/services/pipeline_template_service.py
   git commit -m "test(pipeline-template): add test_list_templates_returns_default_first"
   ```

### Daily Progress Tracking

**End of Each Day**:
1. Run full test suite
2. Capture coverage report
3. Update BMAD_PROGRESS_TRACKER.md with:
   - Tests added (count)
   - Coverage delta
   - Issues encountered
   - Next day's focus

---

## Sprint 1A Week-by-Week Plan

### Week 1 (25-30 hours)
**Goal**: Eliminate P0 test gaps

| Day | Focus Area | Tests Added | Coverage Impact |
|-----|-----------|-------------|-----------------|
| Mon | Pipeline Template Service | 12 tests | Backend +2% |
| Tue | User Service + Org Auto-Create | 12 tests | Backend +2% |
| Wed-Thu | Document Room Frontend | 40 tests | Frontend +8% |
| Fri | Deal Matching Workspace | 25 tests | Frontend +5% |

**End of Week 1 Target**:
- ✅ 90 new tests added
- ✅ Backend: 82% → 87% coverage
- ✅ Frontend: 38% → 52% coverage
- ✅ 0 P0 test gaps remaining

---

### Week 2 (20-25 hours)
**Goal**: Complete P1 tests + E2E coverage

| Day | Focus Area | Tests Added | Coverage Impact |
|-----|-----------|-------------|-----------------|
| Mon | Invite Service + Deal Service | 25 tests | Backend +3% |
| Tue | Valuation KPI Edge Cases | 8 tests | Backend +1% |
| Wed | Podcast Video Upload | 12 tests | Frontend +2% |
| Thu | Auth E2E + Deal Pipeline E2E | 20 tests | Integration +2 suites |
| Fri | Valuation Suite Frontend | 10 tests | Frontend +2% |

**End of Week 2 Target**:
- ✅ 75 new tests added
- ✅ Backend: 87% → 91% coverage
- ✅ Frontend: 52% → 68% coverage
- ✅ 2 E2E suites operational

---

## Success Metrics

### Quantitative Goals
- **Backend Coverage**: 82% → 91%+ ✅
- **Frontend Coverage**: 38% → 70%+ ✅
- **Total Tests Added**: 280+ ✅
- **Test Execution Time**: < 120 seconds backend, < 60 seconds frontend ✅
- **Zero Test Failures**: All tests passing ✅

### Qualitative Goals
- ✅ TDD methodology strictly followed
- ✅ All P0 features have comprehensive test coverage
- ✅ Critical auth/onboarding flows validated via E2E
- ✅ Deployment confidence increased (no untested features)
- ✅ BMAD documentation updated daily

---

## Test File Creation Checklist

### Backend Test Template
```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.{service_name} import {ServiceClass}
from app.models.{model_name} import {ModelClass}

@pytest.fixture
def {fixture_name}():
    return {test_data}

@pytest.mark.asyncio
async def test_{scenario_name}(db_session: AsyncSession, {fixture_name}):
    """
    Test {specific behavior}.

    Given: {preconditions}
    When: {action}
    Then: {expected outcome}
    """
    # RED: Write failing test first
    # GREEN: Implement minimal code
    # REFACTOR: Clean up
    pass
```

### Frontend Test Template
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const queryClient = new QueryClient();
  const mockProps = { /* ... */ };

  it('should {specific behavior}', () => {
    // RED: Write failing test first
    render(
      <QueryClientProvider client={queryClient}>
        <ComponentName {...mockProps} />
      </QueryClientProvider>
    );

    // GREEN: Implement minimal code
    expect(screen.getByTestId('element-id')).toBeInTheDocument();

    // REFACTOR: Clean up
  });
});
```

---

## Related Documentation

- [BMAD_PROGRESS_TRACKER.md](BMAD_PROGRESS_TRACKER.md) - Daily progress updates
- [bmm-workflow-status.md](bmm-workflow-status.md) - Current workflow state
- [DEPLOYMENT_HEALTH.md](../DEPLOYMENT_HEALTH.md) - Deployment verification
- [CLAUDE.md](../../CLAUDE.md) - Project context and TDD requirements

---

**Created**: 2025-11-10
**Last Updated**: 2025-11-10
**Next Review**: End of Week 1 (estimate coverage delta)
**Sprint Goal**: 90% backend, 70% frontend, 280+ tests
