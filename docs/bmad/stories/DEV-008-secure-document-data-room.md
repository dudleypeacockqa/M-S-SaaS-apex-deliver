# Story: DEV-008 Secure Document & Data Room
_Last updated: 2025-11-11_

## Context
- Backend document/data-room endpoints completed and verified during previous sessions (see `backend/app/api/routes/documents.py`, `docs/100-PERCENT-COMPLETION-PLAN.md`).
- Frontend workspace UI (FolderTree, DocumentList, PermissionModal, Upload experience) remains incomplete; Vitest coverage missing.
- This story brings the workspace to production readiness with full BMAD + TDD evidence.

## Goals
1. Deliver an end-to-end document workspace experience covering navigation, permissions, upload progress, and bulk actions.
2. Maintain strict RED→GREEN→REFACTOR cadence with Vitest + MSW and any required backend pytest additions.
3. Update BMAD artefacts (story file, completion plan, workflow status) after each GREEN cycle.

## Definition of Done
- Folder tree renders hierarchical structure, async loads children, and preserves expansion state per tenant.
- Permission modal supports invite/search, role toggles, and enforces entitlement warnings.
- Upload panel handles drag-drop, multi-file progress, cancel/retry, and surfaces quota errors.
- Bulk actions (download, move, archive) emit API calls + optimistic updates; errors surfaced via toast/snackbar.
- Vitest suites cover each user flow with MSW handlers for `documents.ts` API; coverage ≥ 85% for `src/components/documents/**/*`.
- If backend behavior changes are required (e.g., new entitlement guard), pytest coverage updated accordingly.
- Story doc (this file) annotated with timestamps + evidence links per loop; completion plan updated.

## TDD & Implementation Plan
1. **Test Harness Setup**
   - Create `frontend/src/components/documents/UploadPanel.enhanced.test.tsx` (already staged) plus new suites for FolderTree, PermissionModal, BulkActions toolbar.
   - Configure MSW handlers in `frontend/src/tests/mocks/documentsHandlers.ts` (new) to simulate API responses + error cases.
   - Ensure `vitest.config.ts` loads the new MSW layer (already dirty in repo—review and finalize once tests fail as expected).
   - Harness note: single-file Vitest runs currently hang when launched from bash; use PowerShell with `VITEST_POOL=forks` (documented 2025-11-11) until we land a config-level fix.

2. **RED Cycles**
   - Write failing tests for:
     - Folder tree expansion, lazy loading, selection state persistence.
     - Permission modal role toggles, validation errors, API failure surfaces.
     - Upload panel: drag/drop, progress updates, cancel/retry, quota error toast.
     - Bulk actions: multi-select move/archive/download flows, optimistic update rollback on failure.
   - Commit failing tests (documented in this story) before implementation begins.

3. **GREEN Cycles**
   - Implement components incrementally to satisfy failing tests; leverage shared hooks (`useDocumentRoom`, `usePermissionsPanel`).
   - Apply accessibility and loading-state polish per UX spec (reference `docs/ux-design-specification.md`).
   - When backend adjustments are required, add failing pytest coverage first (e.g., new entitlement error) then implement service/router updates.

4. **REFACTOR & Evidence**
   - Consolidate duplicated logic into hooks/utilities (e.g., `frontend/src/utils/fileHelpers.ts`).
   - Update documentation: PRD addendum, UX spec cross-reference, `docs/100-PERCENT-COMPLETION-PLAN.md` progress, `docs/bmad/mna-completion-plan.md` status.
   - Capture screenshots/gifs for release notes + marketing assets if needed.

## Test Matrix
| Area | Tests | Notes |
| --- | --- | --- |
| Folder Tree | Expand/collapse, async child load, breadcrumb sync, keyboard navigation | Add RTL focus tests |
| Permissions | Role toggle, invite validation, API error toast, entitlement guard | Mock quota + admin-only cases |
| Uploads | Drag/drop, multi-upload progress, cancel/retry, quota exceeded message | Simulate network failures |
| Bulk Actions | Move folder, archive docs, download selection, optimistic rollback | Verify API payloads + UI feedback |
| Backend (if needed) | Entitlement enforcement, audit logging | Extend `backend/tests/test_subscription_error_paths.py` or new doc tests |

## Dependencies & Notes
- Requires updated icons/strings from UX spec section 4.1–4.3.
- Coordinate with deployment plan to ensure new environment variables or storage configs are documented.
- Keep BMAD workflow tracker updated after each significant milestone (brainstorm/design already completed, next entry under Implementation).

## Progress Log
- 2025-11-11: UploadPanel enhanced Vitest suite running GREEN (PowerShell + `--pool vmThreads` workaround) with drag/drop + queue behaviours.
- 2025-11-11: FolderTree persistence + PermissionModal entitlement alerts implemented after RED tests; Vitest suites now pass under `--pool vmThreads`.
- 2025-11-11: DocumentList integrates BulkActionsToolbar for multi-select download/delete/clear; new Vitest coverage exercises optimistic flows.
- 2025-11-12: DocumentRoomPage now exposes search + file-type filters with Vitest coverage (`DocumentRoomPage.test.tsx`), wiring through `listDocuments` query params.

## Next Steps
1. Extend BulkActions coverage to move/archive flows and optimistic rollback/error toasts (DocumentWorkspace wiring).
2. Finalize MSW handler scaffolding + ensure Vitest config loads it.
3. Implement remaining UI polish and update PRD/UX docs after GREEN.
