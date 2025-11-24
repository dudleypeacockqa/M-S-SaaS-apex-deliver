# Legacy Site Redirect Configuration

**Date**: 2025-11-22
**Legacy Site**: https://flo-finance-uk-website.onrender.com/
**New Site**: https://financeflo.ai

---

## Redirect Status

### Routes Already Exist (No Redirect Needed) ✅

The following legacy site routes already exist in the new site, so no redirects are needed:

**Industries** (All exist):
- ✅ `/industries/private-equity` → Already exists
- ✅ `/industries/construction` → Already exists
- ✅ `/industries/financial-services` → Already exists
- ✅ `/industries/healthcare` → Already exists
- ✅ `/industries/professional-services` → Already exists
- ✅ `/industries/manufacturing` → Redirects to `/industries/professional-services` (already configured)

**ERP Solutions** (All exist):
- ✅ `/erp/sage-intacct` → Already exists
- ✅ `/erp/acumatica` → Already exists
- ✅ `/erp/odoo` → Already exists
- ✅ `/erp/netsuite` → Already exists
- ✅ `/erp/microsoft-dynamics` → Already exists
- ✅ `/erp/sap` → Already exists

**Resources**:
- ✅ `/resources/roi-calculator` → Already exists
- ✅ `/assessment` → Already exists (ReadinessAssessmentPage)

**Core Pages**:
- ✅ `/` → Already exists (EnhancedLandingPage)
- ✅ `/pricing` → Already exists
- ✅ `/contact` → Already exists
- ✅ `/about` → Already exists
- ✅ `/blog` → Already exists
- ✅ `/blog?category=*` → Already exists (query params supported)

**IntelliFlow iPaaS (Added 2025-11-22):**
- ✅ `/ipaas` → Client-side redirect to `/ipaas/intelliflow`
- ✅ `/ipaas/intelliflow` → IntelliFlow AI platform page
- ✅ `/ipaas/strategy` → AI integration strategy offer
- ✅ `/ipaas/connectors` → Custom connector program
- ✅ `/ipaas/api-management` → API management solution

---

## Redirects Needed

### High Priority Redirects

**Legal Pages** (Different paths):
- `/privacy` → `/legal/privacy` (301 redirect)
- `/terms` → `/legal/terms` (301 redirect)
- `/cookies` → `/legal/cookies` (301 redirect)

**Blog Categories** (If structure changed):
- `/blog?category=case-studies` → `/case-studies` (301 redirect)
- `/blog?category=implementation-guides` → `/blog?category=implementation-guides` (No redirect needed if query params work)

---

## Implementation Options

### Option 1: React Router Redirects (Client-Side)

Add redirect routes in `frontend/src/App.tsx`:

```typescript
// Legal page redirects
<Route path="privacy" element={<Navigate to="/legal/privacy" replace />} />
<Route path="terms" element={<Navigate to="/legal/terms" replace />} />
<Route path="cookies" element={<Navigate to="/legal/cookies" replace />} />

// IntelliFlow redirects (if needed)
<Route path="ipaas/intelliflow" element={<Navigate to="/features#ai" replace />} />
<Route path="ipaas/intelliflow/*" element={<Navigate to="/features#ai" replace />} />
```

> _Update (2025-11-22): The `/ipaas/*` paths now render dedicated IntelliFlow pages instead of redirecting. Keep the example above for future reference if those URLs are ever retired again._

**Pros**: Easy to implement, works for client-side navigation
**Cons**: Only works for client-side navigation, doesn't help with external links or SEO

### Option 2: Server-Side Redirects (Render)

Configure redirects in `render.yaml` or via Render dashboard:

```yaml
services:
  - type: web
    name: ma-saas-platform
    redirects:
      - from: /privacy
        to: /legal/privacy
        status: 301
      - from: /terms
        to: /legal/terms
        status: 301
      - from: /cookies
        to: /legal/cookies
        status: 301
```

**Pros**: Proper 301 redirects for SEO, works for all requests
**Cons**: Requires Render configuration

### Option 3: _redirects File (Static Site)

Create `frontend/public/_redirects` file:

```
/privacy /legal/privacy 301
/terms /legal/terms 301
/cookies /legal/cookies 301
/ipaas/* /features#ai 301
```

**Pros**: Works with static site hosting
**Cons**: May not work with all hosting providers

---

## Recommended Approach

**Use Option 1 (React Router) for now** because:
1. Most routes already exist
2. Only a few redirects needed
3. Easy to implement
4. Can be upgraded to server-side later if needed

**Add server-side redirects later** if:
- SEO rankings are important for legacy URLs
- External sites link to old URLs
- Need proper 301 status codes for search engines

---

## Implementation Status

- [x] Add React Router redirects for legal pages (App.tsx)
- [x] Add IntelliFlow/iPaaS routes so `/ipaas/*` URLs resolve without redirects
- [ ] Test redirects work correctly
- [ ] Update sitemap to remove old URLs
- [ ] Monitor 404 errors after deployment

---

## Testing Checklist

After implementing redirects:

- [ ] Test `/privacy` redirects to `/legal/privacy`
- [ ] Test `/terms` redirects to `/legal/terms`
- [ ] Test `/cookies` redirects to `/legal/cookies`
- [ ] Test redirects work from external links
- [ ] Test redirects preserve query parameters (if needed)
- [ ] Verify no 404 errors in Google Search Console
- [ ] Check redirects return 301 status code (if server-side)
- [ ] Visit `/ipaas`, `/ipaas/intelliflow`, `/ipaas/strategy`, `/ipaas/connectors`, `/ipaas/api-management` to confirm they render successfully

---

**Last Updated**: 2025-11-22
**Status**: Ready for Implementation

## Implementation Update (2025-11-24)
- Added `/privacy`, `/terms`, `/cookies`, `/ipaas`, and `/ipaas/*` entries to `frontend/public/_redirects` so Render serves 301s for key legacy URLs.
- Regression coverage added in `frontend/src/__tests__/redirects.test.ts` (Vitest) to ensure future edits keep these redirects intact.
