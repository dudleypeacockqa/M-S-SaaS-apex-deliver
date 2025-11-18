# BMAD Daily Status Notes

## 2025-11-17 - Evidence Refresh + Marketing Guardrails
- **Build**: Updated README/bmm-workflow-status/100-PERCENT-COMPLETION-STATUS to reflect 1,432 backend + 1,742 frontend passing specs; added TeamPage assets test, Playwright smoke specs, and marketing CI workflow scaffold.
- **Measure**: Referenced existing Nov-17 pytest/Vitest logs (backend/tests/test-results-2025-11-17.txt & frontend/test-results-2025-11-17.txt) for automation proof; configured Playwright + CI to run once MARKETING_BASE_URL is provided.
- **Analyze**: Confirmed remaining Decide blockers are manual Master Admin QA, Lighthouse/Axe audits, and first successful Playwright run; documented gaps in TODO.md.
- **Decide**: Keep Sprint 1-B open until Playwright + manual QA evidence is attached; next session must capture MARKETING_BASE_URL context and rerun marketing-ci.yml to archive outputs.

## 2025-11-18 - Phase 0 Baseline Resync
- **Build**: Re-ran targeted Vitest stack (routing/auth/App/PodcastStudio/blog contract) per Phase 0 instructions; BlogListingPage contract + Auth suite now RED due to MSW 500 + heading timeout.
- **Measure**: Captured backend targeted pytest (`backend/tests/api/test_event_api.py`, `backend/tests/test_event_service.py`) with 40 PASS to confirm Event Hub regressions are cleared before new RED specs.
- **Analyze**: Vitest failures show marketing MSW outage handler + lazy SignIn heading drift; these become first RED specs when wiring marketing + auth surfaces.
- **Decide**: Blocked on fixing marketing MSW handler + SignIn copy before resuming DEV-014/011 loops; keep evidence in docs/tests once GREEN.
