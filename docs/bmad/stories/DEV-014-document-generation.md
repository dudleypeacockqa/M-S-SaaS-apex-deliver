# DEV-014 – Document Generation Frontend

**STATUS: 🚧 IN PROGRESS** (2025-11-14 – Backend `/api/document-generation` surface + pytest suite ✅; frontend editor uses the new client but export job queue, polling, and integration specs still outstanding.)

## Status
- **Completion:** ~85% (backend + synchronous exports complete; frontend editor live but lacks async export job queue, MSW contract tests, and entitlement regression coverage)
- **Scope:** Frontend document editor with AI assistance, template management, exports, version history, and entitlement-aware export workflows
- **Backend alignment (2025-11-14):** FastAPI routes/services/tests live under `backend/app/api/routes/document_generation.py` + `backend/tests/test_document_generation_api.py` (19/19 passing). Export + version history toggles covered by pytest fixtures.
- **Frontend alignment (2025-11-14):** `frontend/src/services/api/documentGeneration.ts` now targets `/api/document-generation/*`; `DocumentEditor` consumes the client for CRUD/AI/export flows. Async export queue + integration spec still pending.
- **Owner:** Frontend platform team (paired with backend service owners for job orchestration)

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

## Evidence (2025-11-14)
- `pytest backend/tests/test_document_generation_api.py` → ✅ 15/15 passing (CRUD, AI assistance, export + version routes); log archived at `docs/tests/2025-11-13-f009-document-generation-15-15-passing.txt`.
- `npm run test -- --run src/pages/documents/DocumentEditor.test.tsx --reporter=verbose` → ✅ 9/9 passing (auto-save, template apply, AI workflows, export hook); log archived at `docs/tests/2025-11-14-document-editor-vitest.txt`.
- `npm run test -- --run frontend/src/services/api/__tests__/documentGeneration.integration.test.ts` → ✅ 10/10 passing (client ↔ API contract). Log capture scheduled alongside upcoming integration refactor.
- Manual export smoke (PDF + DOCX) executed locally after wiring; capture refreshed once async queue ships.

## Remaining Work (Blocking 100%)
1. **Export job queue + polling UI** – Backend now supports async job creation (`DocumentExportService.enqueue_export_job`), but the frontend only handles inline downloads. Need queue DTO wiring, status chips, and retry/cancel controls.
2. **Entitlement enforcement** – Reintroduce subscription-tier checks inside export + AI suggestion flows so Free/Pro tiers respect quota rules (`getExportStatus` MSW mock currently stubbed).
3. **Integration spec** – Author `DocumentEditor.integration.test.tsx` with MSW to cover template → AI suggestion → export job success/failure (RED → GREEN evidence stored in `docs/tests/`).
4. **Docs & artefacts** – Capture screenshot walkthrough + update `docs/bmad/100-PERCENT-COMPLETION-STATUS.md` once queue/polling ships; ensure story links reference fresh Vitest/pytest logs.

## Next Steps (BMAD + TDD)
1. Start with RED tests for export job polling (Vitest integration + MSW). Commit failing spec + tracker notes.
2. Implement queue/polling UI + entitlement guards until tests GREEN.
3. Extend backend pytest coverage for export entitlement toggles if gaps discovered during wiring.
4. Capture artefacts (Vitest log, pytest log, screenshots) and update this story + status report.

