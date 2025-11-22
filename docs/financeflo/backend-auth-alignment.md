# FinanceFlo Backend & Clerk Alignment (2025-11-22)

## 1. Environment & Automation Updates
- `.env-backend.md`, `.env-frontend.md`, and `FinanceFlo Environment Variables - Master Reference.md` (now in `docs/secrets/`) now specify the FinanceFlo production keys (`pk_live_[REDACTED]` / `sk_live_[REDACTED]`) plus the existing webhook secret `[REDACTED]`.
- `frontend/vitest.config.ts` injects the FinanceFlo publishable key into the test environment to keep Clerk-enabled specs in sync with production.
- Render helper scripts now require the FinanceFlo key to be provided at runtime:
  - `frontend/scripts/update-render-predeploy.py` reads `FINANCEFLO_VITE_CLERK_PUBLISHABLE_KEY`, requires `RENDER_API_KEY`, and refuses to run if either is missing; the post-deploy instruction now points to `https://financeflo.ai`.
  - `set_render_env_vars.py` enforces both `FINANCEFLO_VITE_CLERK_PUBLISHABLE_KEY` and `RENDER_API_KEY`, so redeployments can only proceed after the operator injects sandbox/test credentials.
- `backend/scripts/diagnose_and_fix_deployment.py`’s operator instructions reference `https://financeflo.ai/blog` so the standard smoke test matches the new domain.

## 2. Clerk Webhook Re-Enablement
The production webhook endpoint (`https://ma-saas-backend.onrender.com/api/webhooks/clerk`) is currently disabled inside the Clerk dashboard (see screenshot from 2025-11-22). Delivery stats show 6 failures / 5 pendings, and the signing secret listed matches `[REDACTED]`.

**Action Plan:**
1. In the Clerk dashboard, edit the endpoint and ensure the signing secret is rotated only after the backend `.env` and Render service receive the new value.
2. Re-enable the endpoint and send a sample event (e.g., `user.created`) from the Testing tab.
3. Watch Render backend logs for `Received Clerk webhook` entries to confirm the FastAPI handler processes the event without `403` or signature mismatch errors (the svix-style signature parser is now covered by `backend/tests/test_security_utils.py` + `backend/tests/test_clerk_auth_complete.py` so CI will fail if the header format regresses).
4. Once verified, mark the webhook as “Healthy” in `docs/tests/` after the QA run.

## 3. Next Steps Before Moving to Data Migration
- Double-check Render backend and frontend services include the FinanceFlo keys (use the updated scripts or manual dashboard review).
- Update infrastructure runbooks (README, deployment checklists) to list `https://financeflo.ai` as the canonical frontend domain (tracked in the merge inventory doc).
- After webhook confirmation, proceed with the database/org migration (next task in the master plan).Run relevant smoke tests to ensure Clerk auth works end-to-end on the FinanceFlo domain before modifying tenant data.

