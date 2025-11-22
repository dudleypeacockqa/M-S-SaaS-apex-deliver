# Wave 0 Evidence Automation Plan (2025-11-22)

**Methodology**: BMAD-method + TDD  
**Goal**: Capture deployment-quality evidence automatically (Master Admin CRUD, BlogAdmin proof, Lighthouse/Axe) without manual log wrangling.

---

## Overall Approach
1. Add regression tests that ensure an evidence orchestrator script exists and fails safely when required inputs are missing (RED).
2. Build `scripts/run-evidence-suite.mjs` to orchestrate existing scripts, normalize output paths (`docs/evidence/<date>/...`), and emit a JSON summary (GREEN).
3. Update BMAD documentation to reference the new automation flow and evidence log locations (REFACTOR).

---

## Step-by-Step

### 1. Tests (RED)
- Create `backend/tests/test_evidence_runner.py`:
  - When `node scripts/run-evidence-suite.mjs --dry-run` is executed without required env vars, exit code must be `0` and stdout must mention each task with `SKIPPED` status plus reason.
  - When invoking `--dry-run --tasks lighthouse` (which only needs URLs), ensure the script still creates a dated metadata stub in `docs/evidence/<today>/suite-report.json`.

### 2. Implementation (GREEN)
- **New script**: `scripts/run-evidence-suite.mjs`
  - Tasks: `master-admin`, `blogadmin`, `lighthouse`.
  - Arguments: `--date`, `--tasks`, `--dry-run`, `--output`.
  - Behavior: For each task, check env prerequisites; if satisfied, spawn the underlying script (e.g., `node scripts/exercise-master-admin-crud.mjs`) while teeing output into `docs/evidence/<date>/<task>.log`.
  - Always emit `suite-report.json` containing task statuses (`success|skipped|failed`), requirements, and log paths.
- Update `scripts/exercise-master-admin-crud.mjs` and `scripts/capture-blogadmin-proof.mjs` to accept `EVIDENCE_OUTPUT_DIR` so they write artifacts into orchestrated folders.

### 3. Documentation (REFACTOR)
- Add run instructions to:
  - `docs/bmad/2025-11-22-EXECUTION-SUMMARY.md` (Wave 0 section)
  - `docs/bmad/BMAD_PROGRESS_TRACKER.md` (latest session entry)
  - `docs/testing/README.md` (new “Evidence Suite” section)
- Document expected outputs in `docs/testing/lighthouse/2025-11-22/EXECUTION_STATUS.md` and create `docs/evidence/README.md` describing bundle structure.

---

## Deliverables
- `backend/tests/test_evidence_runner.py`
- `scripts/run-evidence-suite.mjs`
- Updated Playwright scripts with `EVIDENCE_OUTPUT_DIR` support
- `docs/evidence/<date>/suite-report.json` example + README
- Documentation updates listed above

---

## Success Criteria
1. Pytest suite includes new evidence runner tests and passes (skips allowed only when Docker/test prerequisites missing).
2. `node scripts/run-evidence-suite.mjs --dry-run --tasks master-admin,blogadmin,lighthouse` completes with structured JSON summary and task-level logs.
3. Documentation clearly describes how to provide Clerk token / preview URLs and where evidence artifacts are stored.

