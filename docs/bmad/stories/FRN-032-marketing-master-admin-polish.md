# FRN-032: Marketing & Master Admin Polish

**STATUS:** ⏳ PLANNED  
**Story ID:** FRN-032  
**Epic:** MARK-Track + Master Admin (MAP)  
**Priority:** Medium  
**Sprint:** V1.2 Frontend Wave  
**Created:** 2025-11-18

---

## Story
As a **Marketing Lead & Master Admin**, I need the marketing podcast page, prospect Kanban, and asset pipeline to feel production-ready so that **public touchpoints and internal tooling inspire confidence**.

### Acceptance Criteria
1. `frontend/src/pages/marketing/PodcastPage.tsx` embeds the real YouTube playlist (configurable via env) instead of placeholder markup.  
2. `frontend/src/components/master-admin/prospects/ProspectKanban.tsx` supports drag-and-drop between stages using `@hello-pangea/dnd` (or similar), with persistence via API calls.  
3. `frontend/vite.config.ts` re-enables `vite-plugin-imagemin` (or equivalent) behind a config guard to shrink marketing assets without breaking builds.  
4. `ProspectKanban` interactions include aria labels + keyboard shortcuts for accessibility.  
5. Vitest tests cover Kanban drag/drop reducers and playlist rendering.

---

## Implementation Notes
- Update env config for YouTube playlist ID (document in `docs/development-guide.md`).  
- Add Kanban drag/drop state management (Zustand or component-level) tied to `/api/admin/prospects`.  
- Reintroduce imagemin plugin with try/catch fallback and document optional disable flag.

---

## TDD Plan
1. **Red:**  
   - Add tests for playlist rendering with provided ID.  
   - Add Kanban reducer tests verifying stage transitions + API calls.  
2. **Green:** Implement DnD + API wiring; re-enable imagemin with config guard.  
3. **Refactor:** Ensure accessibility snapshots + storybook docs (if any) updated.

### Test Cases
- `renders YouTube embed with provided playlist`  
- `kanban drag updates stage and calls API`  
- `kanban accessible via keyboard shortcuts`  
- `imagemin plugin toggles based on env`

---

## Deliverables
- Updated marketing podcast page, master-admin Kanban, and build config.  
- Tests + documentation updates (README/DEV guide).  
- Entry in QA report for marketing accessibility.

---

_Owner: Frontend Engineer._

