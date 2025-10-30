# Critical Bugs Report - ApexDeliver Marketing Website
**Last Updated:** October 30, 2025
**Site:** https://100daysandbeyond.com  
**Status:** MAJOR FIXES DEPLOYED - AWAITING VERIFICATION

---

## 🔴 Critical Regressions (2025-10-30 QA Retest)

### R1. Blog content still inaccessible
- **Symptom:** `/blog` renders the empty state and `https://100daysandbeyond.com/api/blog/posts` returns the SPA shell; direct call to `https://ma-saas-backend.onrender.com/api/blog/posts` replies with `500 Internal Server Error`.
- **Impact:** Zero organic content exposure; SEO plan blocked.
- **Evidence:** Cypress/Playwright smoke + manual curl during 2025-10-30 audit.
- **TDD Gate:** Add Vitest contract test for the fetch hook and a Playwright regression against seeded posts before shipping fix.
- **Action:** Re-open ticket DEV-010; rebuild API + seeds, wire frontend to `VITE_API_URL`, add monitor.

### R2. Contact form submissions dropped *(frontend wired May 2026 — notifications pending)*
- **Symptom:** `/contact` now posts to `/api/marketing/contact` via the shared API client; backend persists messages. Email/CRM notifications still stubbed.
- **Impact:** Leads flow into `contact_messages` table; ops still needs notification channel.
- **TDD Gate:** Vitest form test mocking the contact service + backend pytest for `/api/marketing/contact`.
- **Action:** Implement SendGrid/CRM background task before removing this from Critical list.

### R3. Newsletter opt-in fails silently
- **Symptom:** Exit intent + sticky CTA posts to `/api/marketing/subscribe`; Render responds with SPA HTML and `catch` logs error. UI shows success even on failure.
- **Impact:** Email list growth halted.
- **TDD Gate:** Hook unit test asserting error UI + backend pytest mocking ESP provider.
- **Action:** Deploy real subscription endpoint and surface error message.

### R4. Team imagery 404s
- **Symptom:** `/assets/team/*.jpg` resolves to SPA index, leaving blank portraits.
- **Impact:** Trust erosion on About/Team pages.
- **TDD Gate:** Vitest fallback avatar test + CI HEAD request check.
- **Action:** Publish assets to CDN or bundle locally.

### R5. Canonical/OG metadata still references legacy domains
- **Symptom:** SEO helpers still hardcode `apexdeliver.com` / `ma-saas-platform.onrender.com`; canonical + OG tags continue to point to legacy hosts.
- **Impact:** Duplicate indexing persists; social previews remain incorrect.
- **TDD Gate:** Metadata snapshot tests must assert host = `100daysandbeyond.com` (landing, pricing, features, about, contact, legal).
- **Action:** Centralize domain constant, refresh HTML shell + SEO helpers, rerun Lighthouse/Search Console crawl.



## 🟢 FIXED & DEPLOYED

### 1. ✅ Blog Page "No posts yet"
**Status:** FIXED (Commit: be56da8)
**Impact:** HIGH - 50 blog posts exist but weren't displaying  
**Root Cause:** Frontend using placeholder data instead of API  
**Solution:**
- Created `/api/blog` backend endpoint ✅
- Updated Blog.tsx to use VITE_API_URL ✅
- Set VITE_API_URL environment variable in Render ✅
**Deployment:** Auto-deploying now

### 2. ✅ Navigation Dropdowns Close Immediately  
**Status:** FIXED (Commit: be56da8)
**Impact:** HIGH - Users couldn't click dropdown items  
**Root Cause:** Gap + no delay + no click-outside handler  
**Solution:**
- Removed gap between button and dropdown ✅
- Added 150ms delay before closing ✅
- Added click-outside detection ✅
- Added Escape key handler ✅
**Deployment:** Auto-deploying now

### 3. ✅ Sticky Email Bar Too Aggressive
**Status:** FIXED (Commit: be56da8)
**Impact:** MEDIUM - Blocked content too early  
**Solution:** Changed from 50% to 80% scroll threshold ✅
**Deployment:** Auto-deploying now

### 4. ✅ Email Popup Too Aggressive
**Status:** FIXED (Commit: 1573d32)
**Impact:** MEDIUM - Appeared after 30s  
**Solution:** Changed delay from 30s to 90s ✅
**Deployment:** Already live

### 5. ✅ Pricing Table Too Sparse
**Status:** FIXED (Commit: be56da8)
**Impact:** HIGH - Missing 7+ key features  
**Solution:**
- Added 13-Week Cash Forecasting ✅
- Added Working Capital Management ✅
- Added Due Diligence Data Room ✅
- Added Post-Merger Integration Tools ✅
- Added Portfolio Management Dashboard ✅
- Created Bolt-On Modules section:
  * Customer Portal Module (£499/month + £1,500 setup) ✅
  * Sales & Promotion Pricing Module (£399/month + £1,200 setup) ✅
**Deployment:** Auto-deploying now

### 6. ✅ MVP Trial Workflow Implemented
**Status:** NEW FEATURE (Commit: be56da8)
**Description:** Complete sign-up → book meeting workflow  
**Implementation:**
- Created `/book-trial` page with Vimcal calendar embed ✅
- Updated SignUpPage to redirect to /book-trial after auth ✅
- Added route to App.tsx ✅
**User Flow:**
1. Click "Start Free Trial" → /sign-up
2. Complete Clerk authentication
3. Redirect to /book-trial
4. Book 60-min requirements planning meeting
5. MVP trial setup after meeting
**Deployment:** Auto-deploying now

---

## 🟡 KNOWN ISSUES (Non-Critical)

### 7. ⚠️ Poor Image Quality on Features Page
**Status:** KNOWN ISSUE  
**Impact:** MEDIUM - Affects visual appeal but not functionality  
**Description:** Feature illustrations appear low quality/generic  
**Priority:** Medium (can address after core functionality verified)  
**Solution:** Replace with high-quality images or AI-generated graphics

### 8. ⚠️ Invisible Buttons Issue
**Status:** NEEDS INVESTIGATION  
**Impact:** UNKNOWN - User reported blank buttons on hover  
**Note:** Could not reproduce in testing - buttons appear visible  
**Action:** Will verify on live site after deployment

---

## 🔵 DEPLOYMENT STATUS

**Latest Commit:** be56da8  
**Pushed:** Just now  
**Status:** ⏳ Auto-deploying on Render

**Services:**
- **Frontend:** ma-saas-platform → https://100daysandbeyond.com
- **Backend:** ma-saas-backend → https://ma-saas-backend.onrender.com

**ETA:** 3-5 minutes from push

---

## ✅ POST-DEPLOYMENT VERIFICATION CHECKLIST

### Critical Functionality
- [ ] Blog page displays seeded posts (no "No posts yet" message)
- [ ] Blog API responds with 200 + JSON payload (network tab + curl)
- [x] Contact form posts to marketing endpoint and surfaces success + error states
- [ ] Newsletter opt-in returns 200 and shows confirmation to user

### Pricing Page
- [ ] Feature comparison table shows 14 rows with new capabilities
- [ ] Bolt-On Modules section displays with correct pricing (£499 / £399)

### MVP Trial Workflow
- [ ] "Start Free Trial" buttons route to Clerk sign-up
- [ ] Post-auth redirect hits /book-trial with Vimcal embed
- [ ] Booking can be completed and confirmation email delivered

### UX + Engagement
- [ ] Sticky CTA bar appears at 80% scroll and hides correctly
- [ ] Exit-intent/email popup triggers after 90s and respects dismissal

### Brand & Assets
- [ ] Team portraits and hero assets load without 404s
- [ ] Integrations CTA resolves to live content (no SPA 404)
- [ ] Canonical + OG metadata host is 100daysandbeyond.com on every page

### General
- [ ] Navigation (desktop/mobile) and footer links functional
- [ ] No console errors across key journeys
- [ ] Render logs clean (no 5xx) during verification window

---


## 📊 SUMMARY

**Total Issues Identified:** 13  
**Fixed:** 6 (46%)  
**Remaining:** 7 (54% - 5 critical, 2 high)  
**Critical Blockers:** 5  
**Site Readiness:** 🚫 Blocked – marketing funnel broken

---

## 🎯 NEXT ACTIONS

1. Patch blog API routing + seed data, then rerun RED → GREEN Vitest/Playwright suite.
2. Implement marketing contact + newsletter subscription endpoints and wire the frontend forms.
3. Publish team assets + integrations page, updating navigation to avoid 404s.
4. Normalize canonical/OG metadata for every marketing page and re-run Lighthouse/Search Console scans.
5. Update CI (npm test, lint, pytest, Playwright) and add Render health checks for marketing endpoints.
6. Re-run the full verification checklist (below) and capture evidence before sign-off.

---

## 📝 NOTES

- All changes committed to main branch
- GitHub repository: dudleypeacockqa/M-S-SaaS-apex-deliver
- Render auto-deploys from main branch
- No manual deployment triggers needed
- Environment variables already configured in Render
