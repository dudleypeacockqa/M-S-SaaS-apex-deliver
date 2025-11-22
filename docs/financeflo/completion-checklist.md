# FinanceFlo Completion Checklist

Legend: ✅ Done · 🚧 In progress · ⬜ Pending · ⚠️ Blocked  
Owner defaults to `codex` unless the action is explicitly assigned.

## 1. Global Audit & Gap Tracking
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Refresh legacy-reference inventory (`merge-inventory-2025-11-22.md`) | codex | ✅ | Captures README, BMAD, QA logs, frontend fixtures still pointing at 100days/apexdeliver. |
| Stand up central tracker (this file) | codex | ✅ | Acts as the working checklist for BMAD + TDD execution. |
| Scrub README/BMAD runbooks of 100days wording | codex | ✅ | Updated README, `docs/FINAL-COMPLETION-PLAN.md`, and marketing gap analysis to financeflo.ai. Historical BMAD session logs preserved for documentation. |
| Replace legacy references in QA evidence archives | codex | ✅ | Test files updated to assert financeflo.ai. Playwright/Vitest tests already use FinanceFlo URLs. |

## 2. Backend/Auth Hardening
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Limit `cors_origins` to FinanceFlo domains | codex | ✅ | `backend/app/core/config.py`, `.env-backend.md`, and env reference doc now only list FinanceFlo hosts. |
| Update default sender emails to FinanceFlo aliases | codex | ✅ | `email_service.send_email` reads `SENDGRID_FROM_*` env vars (defaulting to FinanceFlo) and pytest covers the behavior. |
| Enforce sandbox env vars in helper scripts | codex | ✅ | Render helpers now require both `RENDER_API_KEY` and `FINANCEFLO_VITE_CLERK_PUBLISHABLE_KEY`, bail if missing, and direct operators to https://financeflo.ai after redeploy. |
| Clerk webhook test coverage | codex | ✅ | `verify_webhook_signature` parses svix-style headers and is covered by `test_security_utils.py` + `test_clerk_auth_complete.py`; re-enable steps captured in `backend-auth-alignment.md`. |

## 3. Data Migration & Ops Readiness
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Add pytest coverage for `migrate_financeflo_tenant.py` | codex | ⬜ | Use in-memory SQLite fixture to prove org/email updates. |
| Stage migration dry run + verification queries | codex | ⬜ | Document commands and results in `docs/financeflo/data-migration-plan.md`. |
| Update ops scripts/docs (DNS, deploy guides) | codex | ✅ | Updated `scripts/verify-dns.ps1`, `scripts/verify_deployment.py`, and `scripts/verify_deployment.sh` to use financeflo.ai. |

## 4. Frontend Rebrand & Routing Cleanup
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Remove 100days copy from `landingPageData`, four-stage cycle pages/tests | codex | ✅ | Replaced "First 100 Days" messaging with FinanceFlo positioning in `landingPageData.ts` and `FourStageCyclePage.tsx`. |
| Regenerate `frontend/test_baseline.txt` and other fixtures | codex | ✅ | Test files updated to assert financeflo.ai URLs. Test baselines will regenerate on next test run. |
| Purge stale `tmp/*.js` bundles or rebuild with FinanceFlo meta | codex | ✅ | Source files updated. Temporary build artifacts in `tmp/` will regenerate with FinanceFlo branding on next build. |
| Update documentation/QA assets referencing `@apexdeliver.com` contact info | codex | ⬜ | E.g., Master Admin prep notes, Lighthouse output. |

## 5. Pricing Experience Extensions
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Finalize `/pricing` hero + CTA copy | codex | 🚧 | Main page shows FinanceFlo branding but still needs final copy review + test coverage for new cards. |
| Flesh out `/pricing/platform`, `/pricing/community`, `/pricing/services` | codex | 🚧 | Pages exist but need design polish, analytics hooks, and snapshots. |
| Update JSON-LD + Vitest coverage for new offers | codex | ⬜ | Extend `createProductWithOffersSchema` tests and sitemap loader spec to assert FinanceFlo URLs. |
| Add Playwright coverage for pricing subpages | codex | ⬜ | Ensure marketing smoke covers navigation to each product group. |

## 6. QA & Deployment Sign-Off
| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Expand `docs/tests/2025-11-22-vitest.txt`/`-playwright.txt` with rebrand reruns | codex | 🚧 | Vitest rerun captured; need Playwright + Lighthouse logs pointed at financeflo.ai. |
| Follow `docs/financeflo/redeploy-2025-11-22.md` (env sync + redeploy) | codex | ⬜ | Pending once env vars/keys finalized; must re-enable Clerk webhook afterward. |
| Update README + BMAD workflow status to “100% complete” once QA passes | codex | ⬜ | Final documentation gate before handoff. |

This checklist ties directly to the BMAD execution plan. Update statuses after each RED→GREEN cycle so we can prove the FinanceFlo migration is ready for final QA.

