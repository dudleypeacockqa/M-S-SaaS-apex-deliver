# DEV-014 – Document Generation Frontend

**STATUS: 🔄 IN PROGRESS** (2025-11-13 – Backend CRUD/render API now lives under <code>/api/document-generation</code>, targeted Vitest routing/auth/podcast/valuation suites are GREEN per `docs/tests/2025-11-13-frontend-focused-run.txt`, but the SPA still targets legacy <code>/api/v1/documents</code> and export job polling/file generation remain TODO.)

## Status
- **Completion:** ~60% (frontend UI + tests complete; backend routes/services/tests landed in `backend/app/api/routes/document_generation.py`, but wiring + export jobs still outstanding)
- **Scope:** Frontend document editor with AI assistance, template management, exports, and version history
- **Backend alignment (2025-11-13):** FastAPI routes/services/tests now live under <code>backend/app/api/routes/document_generation.py</code> and <code>backend/tests/api/test_document_generation_api.py</code>; the frontend still calls legacy <code>/api/v1/documents</code> until this integration plan lands.
- **Owner:** Frontend platform team

## What Shipped
- New `DocumentEditor` page integrates real-time rich text editing, template library, AI suggestion workflows, export controls, and version history viewing/restoration.
- Supporting UI components delivered:
  - `TemplateSelector` renders metadata-rich template cards with preview excerpts and selection state.
  - `AISuggestionPanel` surfaces AI recommendations with contextual prompts, accept/reject/regenerate controls, and confidence signals.
  - `DocumentExporter` provides format selection (PDF/DOCX/HTML), stylistic options, and download orchestration.
  - `VersionHistory` lists prior revisions, authorship, and restoration actions.
- Dedicated API client (`frontend/src/services/api/documentGeneration.ts`) wraps document generation endpoints, AI suggestion routes, export, and presence subscriptions.
- Auto-save pipeline with debounced saving, explicit retry handling, and title/content synchronisation.
- Presence indicator hook wired into the backend presence feed (SSE-ready) for collaborator awareness.
- Keyboard shortcut modal, toolbar scaffolding, and layout optimisations for high-frequency editing tasks.

## Testing & Validation
- New Vitest suite `DocumentEditor.test.tsx` (9 focused cases) validating:
  - Rich text editing auto-save flow with retry handling
  - Template application & editor state syncing
  - AI suggestion acceptance/rejection/regeneration plus context refresh
  - Export pipeline invocation with format/options payloads
  - Version restoration & presence updates
  - Keyboard shortcut modal behaviour
- All tests pass locally via `npm run test -- DocumentEditor.test.tsx`.
- Phase 0 Vitest focus command (`npm run test -- --run --pool=threads src/tests/integration/routing.test.tsx src/features/auth/Auth.test.tsx src/App.test.tsx src/tests/integration/PodcastStudioRouting.test.tsx src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx`) logged in `docs/tests/2025-11-13-frontend-focused-run.txt` to document GREEN state before wiring the new API.

## Follow-ups
- RED: add `frontend/src/pages/documents/DocumentEditor.integration.test.tsx` exercising `/api/document-generation` list/render/job flows (MSW fixtures mirrored from backend tests).
- GREEN: point `frontend/src/services/api/documentGeneration.ts` + DocumentEditor mutations at the new endpoints and remove the `/api/v1/documents` shim.
- GREEN: implement async export job queue + polling UI (PDF/DOCX) with entitlement checks enforced client + server side.
- GREEN: align collaborative editing/presence payloads with backend IDs before flipping sockets on.
- DOCUMENT: capture screenshots + evidence for DEV-014 and completion status once exports + presence wiring are proven.

## Integration Plan (2025-11-13 refresh)
1. **API wiring** – Point <code>frontend/src/services/api/documentGeneration.ts</code> and the DocumentEditor mutations to <code>/api/document-generation/*</code> (create/update/render) and drop the legacy <code>/api/v1/documents</code> shim.
2. **Async export jobs** – Mirror the queue contract proven in <code>backend/tests/api/test_document_generation_api.py</code>, expose job status polling in <code>DocumentExporter</code>, and persist completed artifacts (PDF/DOCX/HTML) for download.
3. **Collaboration/presence sync** – Align presence payloads + template metadata with the new backend IDs so version history and collaborator pills reference the same records.
4. **New integration spec** – Add <code>DocumentEditor.integration.test.tsx</code> to cover template selection → AI suggestion acceptance → export completion using MSW mocks; archive evidence under <code>docs/tests/</code> per BMAD plan.
5. **Backend toggles** – Extend pytest coverage for export formats + entitlement checks before declaring DEV-014 complete.
6. **Documentation** – Capture before/after screenshots and refresh this story + <code>docs/bmad/100-PERCENT-COMPLETION-STATUS.md</code> once wiring + exports are live.



