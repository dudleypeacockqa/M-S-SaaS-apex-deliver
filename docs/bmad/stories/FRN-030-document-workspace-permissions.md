# FRN-030: Document Workspace Permissions & Audit Flows

**STATUS:** ⏳ PLANNED  
**Story ID:** FRN-030  
**Epic:** F-003 Secure Document & Data Room  
**Priority:** High  
**Sprint:** V1.2 Frontend Wave  
**Created:** 2025-11-18

---

## Story
As a **Deal Room Admin**, I need the document workspace UI to actually call backend APIs for permission changes, emit audit logs, and confirm destructive actions so that **compliance rules are enforced inside the browser**.

### Acceptance Criteria
1. Permission toggles in `DocumentWorkspace` call the corresponding `/api/documents/{id}/permissions` endpoint and reflect optimistic loading states.  
2. Every permission update triggers an audit log request (reuse existing `useAuditLog` hook or create).  
3. Deleting folders/files requires a confirmation dialog with clear messaging; success/failure toasts leverage shared UI components.  
4. API failures display inline error states with retry affordances and do not leave UI stuck.  
5. Vitest/RTL coverage ensures permission updates, audit log dispatch, and confirmations are tested.

---

## Implementation Notes
- Touch `frontend/src/pages/documents/DocumentWorkspace.tsx` (lines ~141, 162, 247).  
- Extend `frontend/src/services/documentService.ts` with `updatePermissions`, `logAudit`, `deleteWithConfirmation`.  
- Add React Query mutations + optimistic updates; ensure Clerk orgId included.  
- Update `frontend/src/components/ui/Dialog` usage for confirmation flows.

---

## TDD Plan
1. **Red:** Write failing tests in `DocumentWorkspace.test.tsx` covering permission update success/failure, audit logging, and confirmation.  
2. **Green:** Implement service hooks + UI wiring.  
3. **Refactor:** Extract shared confirmation modal, ensure accessibility snapshots updated.

### Test Cases
- `updates permissions via API and shows success toast`  
- `shows error message when permission update fails`  
- `sends audit log payload after permission change`  
- `requires confirmation before destructive delete`

---

## Deliverables
- Updated DocumentWorkspace UI + services.  
- New tests with coverage evidence (include in QA report).  
- Documentation snippet in `docs/bmad/V1.2-SCOPE.md` (progress section).

---

_Owner: Frontend Engineer._

