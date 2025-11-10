# Worktree Dirty Catalog — 2025-10-29 10:30 UTC

Purpose: snapshot and map all outstanding local changes to their owning BMAD stories / follow-up actions before resuming DEV-016/DEV-018 delivery.

---

## 1. BMAD Framework Assets (process documentation)
- `.bmad-core/**` (74 files) — core BMAD guides, checklists, manifests. Align with governance story (BMAD maintenance) or revert to upstream vendor copy before commit.
- `.bmad-creative-writing/**` (89 files) — creative-writing module updates; confirm necessity or drop from this delivery scope.
- `.bmad-infrastructure-devops/**` (15 files) — infra checklists/scripts; same treatment as above.
- Numerous plan/status docs in root (`100.plan.md`, `finish.plan.md`, `full.plan.md`, `baseline_entry.md`, `tracker_tmp.md`, etc.) — consolidate into BMAD tracker or remove.

## 2. Documentation (docs/)
- 66 modified files across `docs/` (deployment guides, status reports, BMAD stories). Review per story before staging; merge duplicates (`PRODUCTION-DEPLOYMENT-*`, `STATUS-REPORT-*`, etc.).
- New `docs/bmad/WORKTREE_DIRTY_CATALOG.md` (this file) — keep as reference until worktree cleared.

## 3. Backend Code (124 files + new modules)
- Key modified modules: `backend/app/api/routes/{documents,podcasts,financial}.py`, `backend/app/services/{document_service,storage_service,quota_service}.py` (DEV-008/DEV-016), plus supporting tests (`backend/tests/test_document_endpoints.py`, `test_quota_service.py`, `test_podcast_api.py`).
- New files: `backend/app/services/audio_chunking_service.py`, `backend/tests/test_audio_chunking_service.py`, `backend/tests/test_storage_factory.py` — assign to DEV-016/DEV-008 stories or remove if experimental.

## 4. Frontend Code (208 files + new document components)
- Broad modifications in `frontend/src/components/**`, `frontend/src/pages/**`, `frontend/src/services/**`, `frontend/src/hooks/**` touching podcasts, documents, valuation, marketing.
- New DEV-008 document-room assets: `frontend/src/components/documents/DocumentList.test.tsx`, `FolderTree.test.tsx`, `PermissionModal.test.tsx` (untracked).
- Podcast UI enhancements (DEV-016): upload modals, media player, gating controls.
- Verify each file aligns with DEV-008/DEV-016 plans before staging.

## 5. Scripts & Utilities
- Modified: `scripts/secure_render_database.py`, `scripts/verify_migrations.sh` — confirm story ownership.
- Temporary helpers: `update_tracker.ps1`, `patch.diff`, `testfile` — delete once content is migrated elsewhere.

## 6. Root-Level Docs & Guides
- Strategy/guide documents (`CLAUDE.md`, `CODEX-*`, `CURSOR-*`, `DECISION-REQUIRED.md`, etc.) changed. Determine if updates are required for current delivery scope.
- `README.md`, `PR_DESCRIPTION.md`, deployment checklists touched — link to release-engineering story or revert to baseline.

---

### Action Items
1. Assign each group above to specific BMAD stories (DEV-008 backend/frontend, DEV-016 media pipeline, governance docs, etc.).
2. Remove obvious temporary artifacts (`testfile`, `tracker_tmp.md`, `baseline_entry.md`) once content is migrated.
3. After staging intentional changes, rerun `git status --porcelain` to ensure only story-related files remain.
