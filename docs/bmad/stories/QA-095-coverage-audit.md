# QA-095: Coverage & Audit Gate for V1.2

**STATUS:** ⏳ PLANNED  
**Story ID:** QA-095  
**Track:** Quality Assurance / TEA  
**Priority:** Mandatory  
**Sprint:** V1.2 Release Readiness  
**Created:** 2025-11-18

---

## Story
As the **QA/TEA agent**, I must raise backend + frontend coverage to ≥90%, rerun Lighthouse/Axe audits, and execute BMAD `solutioning-gate-check` so that **v1.2 ships with measurable quality guarantees**.

### Acceptance Criteria
1. `pytest --cov=backend/app` reports ≥90% line coverage with no failures; results stored in `docs/testing/coverage-backend-v1.2.md`.  
2. `npm run test -- --coverage` (Vitest) yields ≥90% statements/branches; results stored in `docs/testing/coverage-frontend-v1.2.md`.  
3. `npm run lint` and `npm run audit:local` pass without critical findings; Lighthouse & Axe reports saved under `docs/testing/` with timestamps.  
4. BMAD `solutioning-gate-check` rerun referencing updated architecture/PRD/story artifacts; output saved to `docs/implementation-readiness-report-v1.2.md`.  
5. Release notes updated with QA summary, and `docs/bmm-workflow-status.yaml` reflects QA completion + next workflow.

---

## Plan
1. Add/extend missing tests produced by DEV/FRN stories until coverage meets thresholds.  
2. Capture coverage artifacts + include deltas from v1.1.  
3. Execute Lighthouse/Axe via `npm run preview:test` + `npm run audit:local`.  
4. Run BMAD workflow command and update status file.

---

## Deliverables
- Two coverage markdown reports.  
- Lighthouse HTML/JSON + Axe JSON.  
- Updated solutioning-gate-check report + release notes.  
- QA summary appended to `docs/bmad/V1.2-SCOPE.md`.

---

_Owner: QA / TEA agent._

