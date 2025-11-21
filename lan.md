# LAN Execution Notes — 2025-11-21

This doc records the current execution state for the “LAN” (Landing + Admin Networks) surface so future BMAD agents can pick up the work without scanning every plan file. It mirrors the canonical scopes already captured in `plan.md`, `docs/FINAL-COMPLETION-PLAN.md`, and `TODO.md` but keeps the day-to-day checkpoints close to the repo root.

## Current Signals
- **Automation:** `npm run test` (Vitest) is green as of 2025-11-21 10:26 UTC. Evidence lives in `docs/tests/2025-11-21-frontend-vitest.jsonl` plus stdout archive `docs/tests/2025-11-21-frontend-vitest.txt`. Backend pytest last captured on 2025-11-19.
- **Manual QA:** Master Admin checklist still blank; seed via `scripts/seed_master_admin_demo.py` and capture evidence in `docs/testing/master-admin/2025-11-19/`.
- **Marketing:** Playwright helper works with `scripts/run-marketing-playwright.mjs`, but marketing backlog (landing, contact, book trial, SEO) continues to rely on TODO/tasks. Lighthouse/Axe reruns outstanding.
- **Data:** `docs/testing/master-admin/2025-11-19/data/records.json` holds the latest seeded dataset; refresh before running manual steps.

## Workstreams (mirrors FINAL-COMPLETION-PLAN)
1. **Governance:** Keep README, `TODO.md`, and BMAD trackers synchronized whenever evidence or test status changes.
2. **Automation Evidence:** Archive Vitest/pytest/Playwright outputs under `docs/tests/<date>-*.txt|jsonl`; attach screenshots and traces for Playwright runs.
3. **Master Admin QA:** Execute the seven-surface checklist, store screenshots/logs under `docs/testing/master-admin/<date>/`, and summarize defects in BMAD stories.
4. **Marketing Parity:** Implement outstanding landing/contact/book-trial/SEO items using TDD (Vitest + Playwright) and document progress in `docs/marketing/marketing-gap-analysis-2025-11-19.md`.
5. **Performance & Accessibility:** Use `scripts/run-lighthouse-axe.mjs` once marketing parity lands; archive reports and remediation tickets.
6. **Coverage Decision:** Either raise backend coverage from ~84% to ≥90% or document the waiver with rationale alongside test evidence.

## Immediate Next Actions
1. Export today’s Vitest JSON reporter output into `docs/tests/2025-11-21-frontend-vitest.jsonl` (append only) and link it from README/TODO.
2. Kick off the Master Admin manual QA run: confirm `.env` secrets, seed data, and capture `before` screenshots of each surface.
3. Continue the marketing backlog from `docs/marketing/marketing-gap-analysis-2025-11-19.md` (next stories: BookTrial CTA wiring, contact form submission log, SEO canonical tags).
4. Schedule Lighthouse/Axe reruns once BookTrial + Contact pages are fully green.

## TDD Guardrails
- Extend tests (`backend/tests/test_<feature>.py` or `frontend/src/**/__tests__`) before touching routers/services/components.
- Keep Playwright routes enabled locally (`$env:PLAYWRIGHT_ENABLE_TEST_ROUTES='true'`) when capturing marketing evidence.
- Store every manual/automation log in `docs/tests/` or `docs/testing/` on the same day it runs.

> **Reminder:** Treat this file as a scratchpad for the LAN surface only; long-term plans still belong in `plan.md` or the BMAD docs.
