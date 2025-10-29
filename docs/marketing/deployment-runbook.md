# MARK-002 Deployment Runbook

_Last updated: 2025-10-28_

## Overview

Deploy the enhanced marketing website to Render as a static site with Cloudflare CDN/SSL and custom domain routing. Build currently blocked by TypeScript errors; resolve before executing.

## Render Static Site Configuration

- **Service type:** Static Site
- **Repository:** `ma-saas-platform`
- **Build command:** `cd frontend && npm run build`
- **Publish directory:** `frontend/dist`
- **Environment variables:**
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_GA_MEASUREMENT_ID`
  - `VITE_HOTJAR_ID`
  - `VITE_HOTJAR_VERSION`
  - `VITE_LINKEDIN_PARTNER_ID`
  - Additional marketing flags as needed

### Steps
1. Ensure `npm run build` succeeds locally.
2. Push the `feat(MARK-002): complete enhanced marketing website` commit to the default branch.
3. In Render, create/update the static site with the configuration above.
4. Trigger a manual deploy and verify build logs reach “Deployed successfully”.

## CDN (Cloudflare)

1. Add the Render static site origin to Cloudflare.
2. Configure caching rules for static assets (`/assets/*`, `/icons/*`) with appropriate TTL.
3. Enable brotli compression and HTTP/2.

## SSL & Custom Domain

1. In Render, add the custom domain (e.g., `apexdeliver.com`).
2. Update DNS records in Cloudflare to point to Render’s provided CNAME.
3. Enable Cloudflare “Full” SSL and confirm TLS 1.2+ support.

## Post-Deployment Validation

1. Visit the production domain and confirm the marketing pages render without console errors.
2. Verify service worker registration (`/service-worker.js`) and cached assets.
3. Use browser extensions (Hotjar/LinkedIn helpers) to confirm analytics scripts load.
4. Run Lighthouse against production URLs and archive reports under `docs/marketing/`.

## Rollback Plan

- Use Render’s previous deployment image to roll back if regressions detected.
- Maintain the prior production build artifact in `frontend/dist` until new version validated.

Document deployment timestamps, operator, and verification results in this file after execution.
