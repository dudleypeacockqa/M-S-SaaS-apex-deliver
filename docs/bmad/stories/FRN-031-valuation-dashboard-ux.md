# FRN-031: Valuation & Dashboard UX Hardening

**STATUS:** ⏳ PLANNED  
**Story ID:** FRN-031  
**Epic:** F-006 Financial Intelligence Engine / F-005 Automation & Tasks  
**Priority:** Medium-High  
**Sprint:** V1.2 Frontend Wave  
**Created:** 2025-11-18

---

## Story
As a **Valuation Lead**, I need the valuation suite tests, upgrade handling, and dashboard tasks widget to reflect real APIs so that **users get accurate guidance and entitlement prompts**.

### Acceptance Criteria
1. Skipped test in `frontend/src/pages/deals/valuation/ValuationSuite.test.tsx` is implemented with realistic analytics view assertions.  
2. Valuation suite handles 403 responses by surfacing an upgrade modal or CTA referencing Pro tier.  
3. Dashboard task widget (`DashboardPage.tsx` line ~349) calls backend task API (`/api/tasks/summary`) via React Query; placeholders removed.  
4. Bulk actions hook (`useBulkActions.ts`) uses actual API endpoints for archive/unarchive/bulk updates with optimistic updates and error handling.  
5. Vitest coverage updated; snapshots regenerated to include upgrade messaging and task data states.

---

## Implementation Notes
- Update `frontend/src/services/taskService.ts` (or create) with `fetchTaskSummary`, `bulkUpdateTasks`.  
- Add React Query hooks for valuations & tasks.  
- Introduce `UpgradeRequiredModal` component reused by valuation suite.  
- Ensure error boundaries log to Sentry/Datadog where available.

---

## TDD Plan
1. **Red:**  
   - Enable + write valuations analytics test.  
   - Add tests for 403 handling (mock fetch rejecting).  
   - Add tests for dashboard task widget hooking into API + error state.  
2. **Green:** Implement API hooks/components.  
3. **Refactor:** Deduplicate upgrade modal logic, ensure TypeScript types align with backend schemas.

### Test Cases
- `renders analytics view with metrics when API succeeds`  
- `prompts upgrade when valuation API returns 403`  
- `dashboard task widget renders data from task summary API`  
- `bulk actions hook calls archive API and updates state`

---

## Deliverables
- Updated valuation suite page + tests.  
- Real dashboard/task wiring.  
- `useBulkActions` API implementations with error toasts.  
- Test coverage report snippet for QA-095.

---

_Owner: Frontend Engineer._

