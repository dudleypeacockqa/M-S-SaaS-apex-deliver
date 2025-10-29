# Render Deployment Prep (Backend & Frontend)

**Last Updated**: 2025-10-28 23:15 UTC  
**Owner**: Codex (BMAD orchestrator)

> This document inventories environment configuration required before we can redeploy to Render and declare production 100%. Values marked TODO must be supplied from secure vault/local `.env`.

---

## 1. Frontend Service (Static Site)

**Console path**: Render Dashboard → `ma-saas-frontend` (static) → Environment

### Required Variables

| Key | Source | Notes |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | `.env` line 35 (should start with `pk_live_`) | Currently set to `pk_test_…` (see checklist).
| `VITE_API_URL` | Confirm backend URL | Expected: `https://ma-saas-backend.onrender.com`.
| `VITE_STRIPE_PUBLISHABLE_KEY` | `.env` line 38 (?) | Ensure production public key (starts `pk_live_`).
| `NODE_ENV` | Static string | `production`.

### Variables to Remove
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `CORS_ORIGINS`
- Duplicate/legacy `STRIPE_PUBLISHABLE_KEY`

### Post-change
- Save → wait for auto redeploy.
- Capture screenshot/log line `Deployment succeeded` with timestamp.

---

## 2. Backend Service (Web Service)

**Console path**: Render Dashboard → `ma-saas-backend` → Environment

### Required Variables

| Key | Source | Notes |
| --- | --- | --- |
| `CLERK_PUBLISHABLE_KEY` | `.env` line 35 | Live key (starts `pk_live_`).
| `CLERK_SECRET_KEY` | `.env` line 36 | Live secret (starts `sk_live_`).
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks | New signing secret (`whsec_…`).
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks | Confirm matches production endpoint.
| `CORS_ORIGINS` | Production domains only | `https://100daysandbeyond.com, https://www.100daysandbeyond.com`.
| `DATABASE_URL` | Render managed DB or external | Ensure matches production DB.
| `ENVIRONMENT` | `production` | Align with code expectations.

### Variables to Remove
- `ALLOWED_ORIGINS`
- Any legacy test keys or unused toggles.

### Webhook Setup
1. Clerk Dashboard → Webhooks → Add endpoint `https://ma-saas-backend.onrender.com/api/webhooks/clerk` (events listed in checklist).
2. Stripe Dashboard → Verify `https://ma-saas-backend.onrender.com/api/webhooks/stripe` exists, copy signing secret.
3. Update Render env with new `CLERK_WEBHOOK_SECRET` & confirm `STRIPE_WEBHOOK_SECRET`.

### Post-change
- Save → allow redeploy.
- Check logs for `[info] Application startup complete` and `Deployment successful` stamps.
- Hit `https://ma-saas-backend.onrender.com/health` to confirm live status and record timestamp.

---

## 3. Verification Steps

1. **Backend Smoke**
   - `curl https://ma-saas-backend.onrender.com/health`
   - Verify `clerk_configured` & `webhook_configured` return `true`.
   - Run minimal API call (e.g., `/docs` or `/api/version`).

2. **Frontend Smoke**
   - Incognito visit `https://100daysandbeyond.com`.
   - Trigger Clerk sign-in to ensure live publishable key works (no "domain not allowed").
   - Verify valuation dashboard loads without console errors.

3. **Checklist Updates**
   - `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md` → mark steps 1-5 as complete with timestamps.
   - `docs/DEPLOYMENT_HEALTH.md` → add redeploy evidence (logs, health check outputs).

---

## 4. Dependencies / Owners

| Item | Owner | Notes |
| --- | --- | --- |
| Live Clerk keys | Product/DevOps | Secure vault or Render secrets manager.
| Live Stripe publishable/secret | Finance/DevOps | Coordinate for production account.
| Webhook secrets | DevOps | Regenerate if old/test ones leaked.
| Render credentials | DevOps | Access to dashboard.

---

## 5. Next Actions

- [ ] Collect live Clerk and Stripe keys (
secure channel).
- [ ] Update Render frontend env; record redeploy output.
- [ ] Update Render backend env & webhooks; record redeploy output.
- [ ] Run production smoke tests and log results in tracker.

