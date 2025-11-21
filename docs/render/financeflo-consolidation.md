## FinanceFlo Render Consolidation Runbook

This runbook captures the concrete steps to move the Render project to a single stack (`ma-saas-platform`, `ma-saas-backend`, `ma-saas-db`) and map `financeflo.ai` to the unified frontend.

### 1. Current Service Targets

| Service | Type | Region | Notes |
| --- | --- | --- | --- |
| `ma-saas-platform` | Static Site | `frankfurt` | Builds the Vite frontend (marketing + SaaS). Domains: `financeflo.ai`, `www.financeflo.ai`. |
| `ma-saas-backend` | Web (Python) | `frankfurt` | FastAPI stack with Alembic migrations (`prestart.sh`). Needs DATABASE_URL + API secrets. |
| `ma-saas-db` | Managed Postgres 18 | `frankfurt` | Single source of truth for SaaS data. Keep backups enabled. |
| `flo-finance-uk-website` | Static Site | `global` | Legacy marketing site. Decommission after new frontend is live. |

> **Why Frankfurt?** The Render dashboard already runs the production services there. `render.yaml` now matches that region so infra-as-code deploys align with the dashboard view.

### 2. Environment Variables & Secrets

#### Frontend (`ma-saas-platform`)

| Key | Source |
| --- | --- |
| `VITE_API_URL` / `VITE_API_V1_URL` | `https://ma-saas-backend.onrender.com` (update when custom backend domain is added). |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dashboard. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard. |
| `VITE_APP_NAME` | `"FinanceFlo"` (already updated in `.env-frontend.md`). |
| Feature toggles | `VITE_FEATURE_*`, `VITE_ENABLE_*` values taken from `.env-frontend.md`. |

Render UI: Settings → Environment → add the keys above. Use “Sync from Repo” option for non-secret values or paste manually.

#### Backend (`ma-saas-backend`)

| Key | Description |
| --- | --- |
| `DATABASE_URL` | Render Postgres connection string or external secret. |
| `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET` | Clerk. |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `SENDGRID_*`, etc. | Third-party services referenced in `backend/app/core/config.py`. |
| `CORS_ORIGINS` *(optional)* | Override default if more granular control is needed (see section 3). |

### 3. CORS & Domain Readiness

The backend default CORS list now includes `https://financeflo.ai` and `https://www.financeflo.ai`. After DNS cutover nothing else is required, but you can set a `CORS_ORIGINS` env var in Render if you want to avoid redeploying code for future domain additions.

### 4. Deployment Steps

1. **Backend**
   - Trigger a manual deploy in Render (`ma-saas-backend` → “Deploy latest commit”).
   - Watch logs for migration output (`prestart.sh`). Ensure `/health` returns 200.

2. **Frontend**
   - Trigger deploy for `ma-saas-platform`. Build command `cd frontend && npm install && npm run build` publishes `frontend/dist`.
   - Validate https://ma-saas-platform.onrender.com while DNS still points elsewhere (calculator, blog, dashboard marketing flows).

3. **Domain Attachment**
   - Render Dashboard → `ma-saas-platform` → “Custom domains” → add `financeflo.ai` + `www.financeflo.ai`.
   - Update DNS at registrar with the A/CNAME values Render provides (root uses A to 216.24.57.1, www uses CNAME to `ma-saas-platform.onrender.com` – double-check Render panel for current values).
   - Enable force HTTPS & www→root redirect as needed.

4. **Decommission `flo-finance-uk-website`**
   - Once `financeflo.ai` serves the unified frontend for 24+ hours without regressions, scale the old service to zero or delete it. Note the last working commit and domain just in case rollback is needed.

### 5. Verification Checklist

- [ ] All three services show green in Render dashboard (`Available` / `Deployed`).
- [ ] Visiting `financeflo.ai` renders the combined marketing + SaaS marketing site.
- [ ] App auth flows (Clerk sign-in) hit the backend successfully.
- [ ] Calculator exports and blog/article routes load without 404s.
- [ ] DNS propagation confirmed via `dig financeflo.ai`.

Document deployment results in `docs/deployments/README.md` (or current log) including date/time, links to Render deploys, and any follow-up work.



