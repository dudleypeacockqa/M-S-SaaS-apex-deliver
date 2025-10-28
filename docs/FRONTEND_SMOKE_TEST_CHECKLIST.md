# Frontend Smoke Test Checklist

**Purpose**: Manual verification of critical frontend functionality after deployment
**Test Environment**: https://100daysandbeyond.com
**Last Tested**: _________
**Tested By**: _________

---

## Pre-Test Setup

### Required Tools
- [ ] Chrome browser (latest version)
- [ ] Chrome DevTools (F12)
- [ ] Test user credentials (if testing authenticated features)
- [ ] Incognito/Private window (for clean state testing)

### Test Credentials (Example - Replace with actual)
```
Username: test@apexdeliver.com
Password: [REDACTED - Store securely]
```

---

## Test Section 1: Landing Page & Public Pages

**URL**: https://100daysandbeyond.com

### Basic Functionality
- [ ] **Page loads successfully** (HTTP 200)
  - [ ] Loads within 3 seconds
  - [ ] No "Page Not Found" or error messages
  - [ ] No blank white screen

- [ ] **Hero section displays correctly**
  - [ ] Headline visible: "Close Deals 10x Faster..."
  - [ ] Primary CTA button present: "Get Started"
  - [ ] Secondary CTA button present
  - [ ] Background gradient renders

- [ ] **Navigation menu works**
  - [ ] "Pricing" link navigates to /pricing
  - [ ] "Features" link navigates to /features
  - [ ] "About" link navigates to /about
  - [ ] "Contact" link navigates to /contact
  - [ ] "Sign In" button visible
  - [ ] All links working (no 404s)

- [ ] **Conversion elements functional**
  - [ ] Exit-intent popup triggers when mouse moves to close tab
  - [ ] Sticky CTA bar appears after scrolling 50% down page
  - [ ] Both can be dismissed with X button
  - [ ] Don't re-appear after dismissal (sessionStorage working)

### Visual Verification
- [ ] **Tailwind CSS loaded**
  - [ ] Inspect any element → Classes like `bg-gradient-to-r`, `text-white` applied
  - [ ] Styles render correctly (not unstyled HTML)
  - [ ] Responsive design works (resize browser window)

- [ ] **Images load**
  - [ ] Hero image/graphics visible
  - [ ] Feature icons display
  - [ ] Testimonial avatars (if present)
  - [ ] Trust badges/logos

- [ ] **Typography correct**
  - [ ] Headings are bold and large
  - [ ] Body text is readable
  - [ ] No font-loading issues (FOUT/FOIT)

### Console Check
- [ ] **No JavaScript errors** (check DevTools Console tab)
  - [ ] No red error messages
  - [ ] No warnings about missing resources
  - [ ] No CORS errors

- [ ] **No 404 errors** (check DevTools Network tab)
  - [ ] All assets load successfully (200 status)
  - [ ] No missing CSS/JS files
  - [ ] No broken image requests

---

## Test Section 2: Pricing Page

**URL**: https://100daysandbeyond.com/pricing

- [ ] Page loads successfully
- [ ] Pricing table renders with all 4 tiers
  - [ ] Starter: £279/month
  - [ ] Professional: £598/month
  - [ ] Enterprise: £1,598/month
  - [ ] Community: £2,997/month
- [ ] "Get Started" buttons present for each tier
- [ ] Feature comparison list displays
- [ ] No layout breaks on mobile (test responsive)

---

## Test Section 3: Features Page

**URL**: https://100daysandbeyond.com/features

- [ ] Page loads successfully
- [ ] All 7+ features listed
  - [ ] Deal Pipeline Management
  - [ ] Financial Intelligence Engine
  - [ ] Valuation Suite
  - [ ] Secure Document Room
  - [ ] AI-Powered Deal Matching
  - [ ] Document Generation
  - [ ] Task Automation
- [ ] Feature cards/sections render correctly
- [ ] Icons/images display

---

## Test Section 4: Authentication

**URL**: https://100daysandbeyond.com/sign-in

### Sign-In Flow
- [ ] Sign-in page loads (/sign-in)
- [ ] Clerk authentication modal displays
- [ ] Can enter email/password
- [ ] "Sign In" button functional
- [ ] **Test actual sign-in**:
  - [ ] Enter test credentials
  - [ ] Click "Sign In"
  - [ ] Redirects to /dashboard after successful auth
  - [ ] No errors during sign-in process

### Sign-Up Flow
- [ ] Sign-up page loads (/sign-up)
- [ ] Clerk sign-up form displays
- [ ] Email and password fields present
- [ ] "Create Account" button functional
- [ ] (Optional) Test creating new account

### Sign-Out
- [ ] Navigate to dashboard
- [ ] Click "Sign Out" button (usually in user menu)
- [ ] Redirects to landing page or sign-in
- [ ] Cannot access /dashboard without re-authenticating

---

## Test Section 5: Dashboard (Authenticated Users Only)

**Pre-requisite**: Must be signed in

**URL**: https://100daysandbeyond.com/dashboard

### Dashboard Rendering
- [ ] Dashboard page loads successfully
- [ ] **Personalized greeting displays**
  - [ ] "Good morning/afternoon/evening, [FirstName]"
  - [ ] Current date shown
  - [ ] Time-sensitive greeting correct

- [ ] **Key metrics render**
  - [ ] Active Deals card shows number
  - [ ] Pipeline Value displays currency (£)
  - [ ] Completion Rate shows percentage
  - [ ] Average Deal Size displays

- [ ] **Activity feed present**
  - [ ] Recent activities listed (or "No recent activity")
  - [ ] Timestamps shown ("X hours ago")
  - [ ] Activity types indicated (deal, document, valuation)

- [ ] **Tasks/Todo list displays**
  - [ ] Upcoming tasks shown (or "No tasks")
  - [ ] Due dates visible
  - [ ] Priority badges (High/Medium/Low)

- [ ] **Navigation menu (sidebar/header) functional**
  - [ ] Dashboard link
  - [ ] Deals link
  - [ ] Documents link (if present)
  - [ ] Settings link
  - [ ] Billing link

---

## Test Section 6: Core Features (Quick Checks)

### Deals Page
**URL**: https://100daysandbeyond.com/deals

- [ ] Deals page loads
- [ ] Kanban board or list view displays
- [ ] "New Deal" button present
- [ ] No errors when viewing deals

### Create Deal
**URL**: https://100daysandbeyond.com/deals/new

- [ ] "New Deal" page/modal loads
- [ ] Form fields present (Deal Name, Stage, etc.)
- [ ] "Save" or "Create" button functional
- [ ] (Optional) Test creating a test deal

### Billing Dashboard
**URL**: https://100daysandbeyond.com/dashboard/billing

- [ ] Billing page loads
- [ ] Current subscription tier displayed
- [ ] "Manage Subscription" or "Upgrade" buttons present
- [ ] Stripe integration functional (redirects to Stripe portal)

---

## Test Section 7: SEO & Metadata

### Sitemap
**URL**: https://100daysandbeyond.com/sitemap.xml

- [ ] sitemap.xml accessible (not 404)
- [ ] Contains expected URLs (/, /pricing, /features, /about, etc.)
- [ ] Valid XML format (no parse errors)

### Robots.txt
**URL**: https://100daysandbeyond.com/robots.txt

- [ ] robots.txt accessible
- [ ] Contains User-agent directives
- [ ] Contains Sitemap reference
- [ ] Disallows private routes (/dashboard, /admin)

### Meta Tags (View Page Source)
- [ ] `<title>` tag present and descriptive
- [ ] `<meta name="description">` present
- [ ] Open Graph tags present (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card tags present (`twitter:card`, `twitter:title`)
- [ ] Canonical URL set (`<link rel="canonical">`)

### Schema.org Structured Data
- [ ] View page source of landing page
- [ ] Search for `application/ld+json`
- [ ] Schema.org JSON-LD present
- [ ] Contains software application data (pricing, rating, features)

---

## Test Section 8: Performance & Optimization

### Lighthouse Audit (Chrome DevTools)
**Steps**:
1. Open landing page in Chrome Incognito
2. Open DevTools (F12) → Lighthouse tab
3. Select "Performance, Accessibility, Best Practices, SEO"
4. Click "Generate report"

**Target Scores**:
- [ ] Performance: **90+** (Current: _____)
- [ ] Accessibility: **95+** (Current: _____)
- [ ] Best Practices: **95+** (Current: _____)
- [ ] SEO: **95+** (Current: _____)

**If scores are low**, note specific issues in Lighthouse report.

### Page Load Speed
- [ ] Landing page loads in < 3 seconds (first load)
- [ ] Dashboard loads in < 2 seconds (authenticated)
- [ ] No noticeable lag when navigating between pages

### Network Tab Analysis
- [ ] CSS bundle loads successfully (`index.css` or `main.css`)
- [ ] JavaScript bundle loads successfully (`index.js` or `main.js`)
- [ ] No resources blocked by CORS
- [ ] No excessive bundle sizes (> 1MB warning)

---

## Test Section 9: Mobile Responsiveness

**Test on**:
- [ ] iPhone (Safari browser) or Chrome mobile emulator
- [ ] Android device or Chrome mobile emulator

### Mobile Landing Page
- [ ] Page renders correctly (no horizontal scroll)
- [ ] Navigation menu collapses to hamburger icon
- [ ] CTA buttons large enough to tap
- [ ] Text is readable (not too small)
- [ ] Images scale appropriately

### Mobile Dashboard
- [ ] Dashboard accessible on mobile
- [ ] Metrics cards stack vertically
- [ ] Navigation menu accessible
- [ ] All features usable (no tiny tap targets)

---

## Test Section 10: Browser Compatibility

**Test on**:
- [ ] **Chrome** (latest) - ✅ Primary browser
- [ ] **Firefox** (latest)
- [ ] **Safari** (macOS/iOS)
- [ ] **Edge** (latest)

**For each browser**:
- [ ] Landing page renders correctly
- [ ] Sign-in works
- [ ] Dashboard loads
- [ ] No console errors unique to that browser

---

## Final Checklist Summary

**Total Checks**: 100+
**Critical Checks Passed**: _____ / _____
**Non-Critical Issues Found**: _____

### Critical Issues (Must Fix Before Launch)
```
1. [Issue description]
   Impact: [e.g., "Users cannot sign in"]
   Priority: P0

2. [Issue description]
   Impact: [e.g., "Dashboard doesn't load"]
   Priority: P0
```

### Non-Critical Issues (Post-Launch Fixes)
```
1. [Issue description]
   Impact: [e.g., "Minor styling issue on mobile"]
   Priority: P2

2. [Issue description]
   Impact: [e.g., "Lighthouse performance score 85"]
   Priority: P1
```

---

## Sign-Off

**Tester Name**: _____________
**Date**: _____________
**Status**: [ ] PASS (Safe to launch) / [ ] FAIL (Issues must be fixed)

**Notes**:
```
[Additional notes, observations, or recommendations]
```

---

**Next Steps After Testing**:
1. ✅ If all critical checks pass → Proceed with production launch
2. ❌ If critical issues found → Fix issues and re-test
3. ⚠️ If non-critical issues found → Document for post-launch sprint
