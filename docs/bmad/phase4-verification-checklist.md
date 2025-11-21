# Phase 4 Verification Checklist – Operational Modules

_Last updated: 2025-11-19 08:32 UTC_

## Scope
Phase 4 of the Enterprise UI/UX Overhaul requires every major workspace module to be both **accessible** and **functional** for paying tenants. This checklist captures current evidence, outstanding gaps, and next actions for each feature family.

| Module | Key Surface(s) | Observed Status | Gaps / Next Actions |
| --- | --- | --- | --- |
| Tasks | `frontend/src/pages/tasks/TaskBoard.tsx`, `frontend/src/components/tasks/*` | ✅ Drag/drop Kanban + filters + detail modal + template workflow already implemented with rich React Query hooks. | ⚠️ Need to re-test with live backend (`services/tasksService.ts`) and apply new design tokens/loading states. Document task automation rules for docs/FAQ. |
| Documents | `frontend/src/pages/documents/DocumentWorkspace.tsx`, `frontend/src/components/documents/*` | ✅ Full upload queue, permissions, audit logs, AI Q&A. | ⚠️ Re-validate API coverage (`frontend/src/services/api/documents.ts`) vs plan; add contextual help tooltips and link from Deal Details (recently added). |
| Events | `frontend/src/pages/events/EventDashboard.tsx`, `frontend/src/services/api/events.ts` | ⚠️ UI exists (ticket sales, attendees, analytics), but not yet verified against backend endpoints. | TODO: Run API smoke tests, confirm payment integrations, add empty/loading states referencing design tokens. |
| Community | `frontend/src/pages/community/CommunityFeed.tsx`, `frontend/src/services/api/community.ts` | ⚠️ Feed + reactions present, but moderation/admin tooling needs validation. | TODO: Audit backend routes (`backend/app/api/routes/community.py`), ensure authentication + moderation actions, add guided help for new users. |
| Podcast Studio | `frontend/src/pages/podcast/PodcastStudio.tsx`, `frontend/src/components/podcast/*` | ⚠️ Rich UI (episode planner, YouTube publishing) already coded. | TODO: Re-run service tests, ensure asset uploads + publishing flows align with plan, add announcements/help cues. |
| PMI Module | `frontend/src/modules/pmi/pages/*`, `frontend/src/modules/pmi/services/pmiApi.ts` | ⚠️ Project list/detail/create + components exist. | TODO: Validate feature gates, confirm backend endpoints (projects, workstreams, risks) behave; integrate PMI alerts into Deal Team card (now partially done). |
| Admin Dashboard | `frontend/src/pages/admin/*.tsx`, `frontend/src/services/api/admin.ts` | ✅ User/org/system health surfaces built. | TODO: Run backend audit for admin routes, add documentation + in-app help for master admin controls. |
| Master Admin Portal | `frontend/src/pages/master-admin/*`, `frontend/src/components/master-admin/*` | ⚠️ Many components built, but entitlement toggles + activity tracking need verification post-navigation overhaul. | TODO: Confirm feature gating, ensure data hooks hit backend once endpoints live. |
| Billing | `frontend/src/pages/dashboard/BillingDashboard.tsx`, `frontend/src/services/api/billing.ts` | ⚠️ UI present, requires backend verification + documentation (pricing page already updated). | TODO: Validate subscription tiers, enforce entitlement rules in `frontend/src/hooks/useSubscriptionTier.ts`. |

## Immediate Actions
1. **Testing** – schedule targeted API smoke tests per module (`npm run test` + MSW where applicable) and corresponding backend pytest slices.
2. **Design polish** – apply new `design-tokens` gradients/shadows and `LoadingState`/`EmptyState` components across the modules above.
3. **Help content** – identify where tooltips/guides should live (Task Board filters, Document Workspace permissions, PMI risk register, etc.) to feed Phase 8 work.
4. **Backend audit** – for each module, confirm `backend/app/api/routes/` has the full set of endpoints promised in the plan and update docs where gaps exist.

Use this checklist to track Phase 4 completion. As we implement fixes or enhancements, update the table above with dates/evidence (links to commits, tests, or screenshots) so we can demonstrate 100% coverage before moving into Phase 5 polish + Phase 6/7 QA.
