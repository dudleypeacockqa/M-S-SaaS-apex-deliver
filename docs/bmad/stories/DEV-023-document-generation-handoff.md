# DEV-023: Document Generation Attribution & Background Exports

**STATUS:** ⏳ PLANNED  
**Story ID:** DEV-023  
**Epic:** F-003 Secure Document & Data Room  
**Priority:** High  
**Sprint Target:** V1.2 Backend Wave  
**Created:** 2025-11-18

---

## Story
As a **Compliance Officer**, I need generated documents to record who created them and to trigger background export jobs, so that **audit trails remain intact and large exports do not block user interactions**.

### Acceptance Criteria
1. `DocumentGenerationResponse.created_by` populates the user’s name/email derived from `created_by_user_id`.  
2. When `generate_file=True`, a Celery task is enqueued to produce PDF/DOCX artifacts and update `file_path` upon completion.  
3. API responses include `job_id` so the frontend can poll for completion.  
4. Audit log entry (organization scoped) is written for every export with metadata (template_id, format, created_by).  
5. Tests cover metadata hydration, task dispatch, and failure handling.

---

## References
- `backend/app/api/routes/document_generation.py` lines ~686 and ~802 contain TODO comments.  
- `backend/app/services/document_generation_service.py` line ~198 for file creation.  
- `backend/app/tasks/document_tasks.py` (create) to house Celery job.

---

## TDD Steps
1. **Tests First:**  
   - Extend `backend/tests/test_document_generation.py` (new) for metadata + job dispatch.  
   - Add Celery worker tests with `celery_app` fixture verifying task invocation.
2. **Implementation:**  
   - Inject `UserService` (or existing repo) to fetch creator info.  
   - Wire Celery task via `app.tasks.__init__`.  
   - Update schemas to include `job_id`, `created_by_name`.
3. **Refactor:**  
   - Ensure background job updates DB via repository helper.  
   - Document behavior in `docs/architecture.md` (Document Security section).

---

## Deliverables
- Updated FastAPI route + service logic.  
- New Celery task module with PDF/DOCX generation stub (respecting existing storage service).  
- Audit logging helper reuse (`app.services.audit_log_service`).  
- Tests with coverage ≥95% for new code paths.

---

## Dependencies
- Requires Celery/Redis infrastructure already configured.  
- Coordinates with DEV-024 for logging utility reuse.

---

_Owner: Backend Engineer. Update workflow status + release notes upon completion._

