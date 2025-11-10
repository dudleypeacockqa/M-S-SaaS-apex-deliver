# Sprint Planning – Phase 3 Kickoff (Sprint 1)

**Date:** 2025-11-10  
**Duration:** 2 weeks (target deploy via GitHub → Render auto-deploy)  
**Inputs:** `docs/PRD.md`, `docs/ux-design-specification.md`, `docs/architecture.md`, `docs/bmad/epics.md`, `docs/implementation-readiness-report-2025-11-10.md`, Post Merger Integration PMI Toolkit (`../Post Merger Integration PMI Toolkit`), Mergers & Acquisitions Toolkit (`../8. Mergers and Acquisitions Toolkit`), Eric Andrews Modelling Spreadsheets (`../48 - Eric Andrews Modelling Spreadsheets`)

---

## 1. Sprint Objective

Deliver a hardened **Identity & Trust + Pipeline Foundations** slice that real M&A operators can exercise while the valuation workbench and data-room enhancements move into implementation-ready status. This sprint aligns directly with PRD MVP items (Tenant & Identity, Deal Workspace, Valuation baseline) and keeps Render deployments flowing through the GitHub main branch pipeline.

---

## 2. Guiding Context

- **PMI & M&A Toolkits:** Use the PMI toolkit’s three-phase integration playbooks to shape automation templates, and the M&A toolkit’s due-diligence guidance to inform data-room workflows and customer onboarding copy.  
- **Financial Models:** Utilize Eric Andrews spreadsheet pack to validate valuation inputs (ratio calculations, CAC/LTV, budgeting) before codifying formulas inside FastAPI services and frontend visualizations.  
- **Deployment Model:** All code merges to `main` trigger Render builds (backend + frontend). Feature flags should be toggled in code/config, not in Render UI, to keep deployments deterministic.

---

## 3. Sprint Backlog (Committed)

| ID | Epic Ref | Story / Deliverable | Owners | Dependencies | Notes |
| --- | --- | --- | --- | --- | --- |
| SP1-01 | E1.1/E1.3 | Harden Clerk claims + RBAC audit log | Backend | Existing auth stack | Extend `entitlement_service.py`, log to audit tables, ensure pytest coverage. |
| SP1-02 | E1.2 | Org provisioning & invite workflow uplift | Backend + Frontend | SP1-01 | UI updates in `frontend/src/pages/admin/UserManagement.tsx`; email copy references PMI onboarding steps. |
| SP1-03 | E1.4 | Master Admin tenant search + health chips | Full-stack | SP1-01/02 | Use UX spec Section 4.6; include compliance checklist referencing PMI toolkit gating. |
| SP1-04 | E2.1 | Pipeline template CRUD + SLA metadata | Backend + Frontend | Identity foundation | API in `backend/app/api/routes/deals.py`; UI overlay in `DealPipeline.tsx`. |
| SP1-05 | E2.2 | Kanban board enhancements (SLA badges, inline actions) | Frontend | SP1-04 | UI updates from UX spec 4.1; use CTA tokens from `docs/ux-color-themes.html`. |
| SP1-06 | E4.* | Valuation ratio baseline with spreadsheet parity | Backend + Data | None | Map Eric Andrews KPI sheets into `valuation_service.py` and tests; document mapping in repo. |
| SP1-07 | Ops | Render deployment dry-run + rollback rehearsal | DevOps | All above | Branch strategy: feature branches → PR → merge; verify `prestart.sh` logs; update `PRODUCTION-DEPLOYMENT-CHECKLIST.md`. |

---

## 4. Stretch Goals (Pull if capacity frees up)

- **Data Room Guardrails (E3):** Add watermark toggle + legal-hold badges in `DataRoomTree` component using PMI toolkit compliance copy.  
- **Automation Kickoff (E5):** Prototype template gallery referencing PMI quick-win automations (e.g., Day 0 stabilization tasks).  
- **Marketing Alignment:** Sync landing page CTA copy with PMI & M&A toolkit messaging to reduce post-signup friction.

---

## 5. Sprint Logistics

- **Cadence:** Daily stand-up (async) + mid-sprint architecture sync focused on Celery worker topologies.  
- **Testing:** Backend `pytest --cov=backend/app`; Frontend `npm run test`. Both must pass before merge.  
- **Deployment:** Merge to `main` → GitHub Actions (if enabled) → Render auto-deploy. Verify backend migrations via `prestart.sh` output and run smoke tests (`scripts/run_smoke_tests.sh`) post-deploy.  
- **Observability:** Instrument RBAC changes and pipeline SLA breaches with structured logs; ensure Datadog alerts configured.

---

## 6. Acceptance & Exit Criteria

1. RBAC + invite flows audited and visible in Master Admin console.  
2. Pipeline templates + Kanban enhancements usable end-to-end with real data.  
3. Valuation service replicates spreadsheet ratios (documented mapping + tests).  
4. Render dry-run documented (logs attached to `PRODUCTION-DEPLOYMENT-CHECKLIST.md`).  
5. Sprint demo referencing PMI/M&A toolkit-derived flows delivered to stakeholders.

---

## 7. Next Steps After Sprint

- Feed lessons into `/bmad:bmm/workflows/4-implementation/sprint-planning` for Sprint 2.  
- Decide on running `create-security-architecture` based on compliance findings.  
- Schedule user validation sessions using PMI playbooks and spreadsheet outputs to prove parity before scaling valuations + automation epics.
