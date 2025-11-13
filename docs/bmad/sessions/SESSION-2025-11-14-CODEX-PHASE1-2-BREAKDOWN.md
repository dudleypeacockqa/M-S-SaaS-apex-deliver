
# Session 2025-11-14: Codex Phase 1/2 Breakdown

**Status**: Drafted – ready for execution
**Author**: Codex (GPT-5)
**Scope**: Translate the 100% Completion Plan (Session 2025-11-13) into TDD-ready work slices covering Phase 1 (complete in-flight features) and Phase 2 (net-new ecosystem work).

---

## 1. Methodology Guardrails

1. **BMAD** – Keep every task tied to a story/status artefact + evidence (tests, logs, deploy notes).
2. **TDD** – Every capability starts RED (pytest/Vitest), goes GREEN, then refactor/document.
3. **Dual Evidence** – Functional code + documentation update per slice (stories, tracker, deployment/audit logs).
4. **Deployment Ready** – No feature considered complete until Render deploy + smoke evidence references the change.

---

## 2. Phase 1 – Complete In-Flight Features (ETA 1–2 weeks)

### 2.1 Event Management Hub (F-012)

| Track | Slice | RED Tests | Implementation | Exit Evidence |
|-------|-------|-----------|----------------|---------------|
| Backend | Attendee CRUD parity | `backend/tests/test_event_attendees_api.py::test_create_attendee_requires_event`, `::test_attendee_status_transitions` | Extend FastAPI router/service to cover attendance states (registered, waitlisted, checked_in); Alembic migration for attendee history | pytest log, updated ERD in `docs/architecture/event-hub.md` |
| Backend | Ticket payments + invoices | `backend/tests/test_event_payments.py` (Stripe session creation, webhook signature) | Integrate Stripe client; store payment intents, issue invoice PDFs via existing doc-gen service | pytest log, mock Stripe secret usage note |
| Frontend | Event creation wizard polish | `frontend/src/pages/events/__tests__/EventCreator.integration.test.tsx` | Add schedule builder, capacity management, live validation | Vitest log, screenshot |
| Frontend | Attendee management dashboard | `frontend/src/pages/events/__tests__/EventDashboard.attendees.test.tsx` | Implement attendee table, filters, CSV export button (calls backend `/events/{id}/attendees/export`) | Vitest log, CSV fixture |
| Comms | Confirmation + reminders | `backend/tests/test_event_notifications.py` (Celery task stub) | Leverage notification service to email confirmations + calendar invites | pytest log, doc update |

### 2.2 Document Generation Polish (F-009)

1. **Export Queue**  
   - RED: `backend/tests/test_document_generation_api.py::test_create_export_job_returns_poll_token`, `frontend/src/pages/documents/__tests__/DocumentEditor.export.test.tsx`.  
   - Implement background job (RQ/Celery) + polling endpoint `/document-generation/exports/{job_id}`.  
   - Exit: UI poller updates status, download button available, Vitest + pytest logs archived.
2. **Entitlement Guards**  
   - RED: `frontend/src/pages/documents/__tests__/DocumentEditor.entitlements.test.tsx` (free tier blocked).  
   - Extend backend service to check subscription tier + return 402-coded error.  
   - Exit: Tests + story DEV-014 updated.
3. **Autosave PATCH alignment**  
   - RED: `frontend/src/pages/documents/__tests__/DocumentEditor.autosave.test.tsx`.  
   - Implement debounced PATCH -> `/document-generation/documents/{id}/content`.  
   - Exit: Tests + API docs.

### 2.3 Valuation Suite Polish (DEV-011)

- RED: `frontend/src/pages/deals/valuation/__tests__/ValuationSuite.exports.test.tsx` for template picker + bulk export.  
- Implement template metadata endpoint + Recharts comparison cards.  
- Exit: Updated story, screenshots, Vitest log.

### 2.4 Marketing Hub Admin Tools (MARK-005/006)

- RED: `frontend/src/pages/marketing/__tests__/BlogAdminWorkflow.test.tsx` ensuring draft → review → publish pipeline.  
- Backend additions: moderation endpoints + role guard tests.  
- Exit: Admin UI demo + audit log entry.

---

## 3. Phase 2 – Net-New Ecosystem Features (ETA 4–6 weeks)

### 3.1 Community Platform (F-013)

| Track | Slice | RED Tests | Implementation | Exit Evidence |
|-------|-------|-----------|----------------|---------------|
| Models | Threads + replies | `backend/tests/test_community_models.py` | SQLAlchemy models (Thread, Reply, Channel, Reaction) with Alembic migration | pytest log, ERD |
| API | Thread CRUD + pinning | `backend/tests/test_community_api.py::test_create_thread_requires_entitlement`, `::test_pin_requires_admin` | FastAPI router `/community`, service for pinning/highlights | pytest log |
| Realtime | Live updates | `frontend/src/community/__tests__/useThreadSubscription.test.ts` | Use Ably/Supabase or WebSocket events to push updates | Vitest log |
| UI | Channel list + thread view | `frontend/src/community/__tests__/CommunityPage.integration.test.tsx` | Build React feature module with query caching + composer | Vitest log, Storybook shots |
| Moderation | Reporting & audit | `backend/tests/test_community_moderation.py`, `frontend/src/community/__tests__/CommunityModeration.test.tsx` | Abuse reports, role gating, email notifications | Logs + doc |

### 3.2 Event → Community Integration

- RED: `backend/tests/test_event_community_bridge.py` ensures event chat threads auto-provision.  
- Implementation: When an event is created, auto-provision a community channel + invite attendees.  
- Exit: Tests + doc linking Event + Community features.

---

## 4. Evidence Checklist per Slice

1. **Tests** – pytest / Vitest logs stored under `docs/tests/YYYY-MM-DD-<feature>.txt`.
2. **Docs** – Update the relevant BMAD story + tracker entry + `docs/bmad/100-PERCENT-COMPLETION-STATUS.md` progress table.
3. **Deployments** – Re-run `trigger_render_deploy.py` + `npm run build && npm run preview` with smoke log once a feature is merged.
4. **Accessibility** – Re-run `scripts/run_local_audits.sh` whenever marketing/admin UI surfaces change.

---

## 5. Next Actions (Codex)

1. Close Phase 0 by producing backend redeploy + Lighthouse artefacts (T2/T3).
2. Open Event Hub attendee export RED tests (backend + frontend) and run them to establish baseline failures.
3. Implement attendee export functionality + CSV download until tests pass.
4. Repeat for ticket payments + communications before shifting to Community Platform groundwork.
