# Analytics & Tracking Setup Guide

## Overview

100 Days & Beyond uses a comprehensive analytics stack to track user behavior, optimize conversions, and understand customer journeys.

**Last Updated**: 2025-10-31
**Status**: Phase 6 COMPLETE - Infrastructure ready, placeholder IDs need replacement

---

## Analytics Stack

### 1. Google Analytics 4 (GA4)

**Purpose**: Page views, user journeys, conversion tracking, demographic insights

**Setup Steps**:
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Set `VITE_GA_MEASUREMENT_ID` in Render → **ma-saas-frontend** service (or `.env`) so the React `AnalyticsProvider` can bootstrap GA without inline scripts.

**Events Tracked**:
- `page_view` (automatic)
- `marketing_cta_click` (custom)
- `marketing_form_submission` (custom)
- `email_optin` (custom)

**Configuration**:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'send_page_view': true,
  'anonymize_ip': true, // GDPR compliance
  'cookie_flags': 'SameSite=None;Secure'
});
```

---

### 2. Microsoft Clarity

**Purpose**: Heatmaps, session recordings, user behavior analysis

**Why Clarity over Hotjar**:
- Free unlimited recordings & heatmaps
- Better performance (no impact on Core Web Vitals)
- Native Microsoft Advertising integration
- GDPR compliant out-of-the-box

**Setup Steps**:
1. Create project at https://clarity.microsoft.com
2. Get Project ID (format: `XXXXXXXXXX`)
3. Set `VITE_CLARITY_PROJECT_ID` in the frontend environment variables (Render → **Environment** tab) to allow the AnalyticsProvider to lazy-load Clarity.

**Features**:
- Session recordings
- Heatmaps (click, scroll, area)
- Rage clicks detection
- JavaScript error tracking
- Conversion funnels

---

### 3. LinkedIn Insight Tag

**Purpose**: B2B conversion tracking, LinkedIn Ads attribution, professional audience insights

**Setup Steps**:
1. Get Partner ID from LinkedIn Campaign Manager
2. Set `VITE_LINKEDIN_PARTNER_ID` in the frontend environment variables; the AnalyticsProvider takes care of loading `snap.licdn.com` plus the `<noscript>` pixel.

**Use Cases**:
- Track conversions from LinkedIn Ads
- Build matched audiences
- Professional demographic insights (job titles, industries, company sizes)

---

## Custom Event Tracking

All custom events are defined in `frontend/src/lib/analytics.ts`:

### trackCtaClick(ctaName, location)

Tracks call-to-action button clicks across the marketing website.

**Parameters**:
- `ctaName`: Button identifier (e.g., "start-free-trial", "schedule-demo")
- `location`: Page/section location (e.g., "hero", "pricing-page", "cta-section")

**Example**:
```typescript
import { trackCtaClick } from '@/lib/analytics';

<button onClick={() => trackCtaClick('start-free-trial', 'hero')}>
  Start Your Free Trial
</button>
```

**Sent to**: Google Analytics, Microsoft Clarity, LinkedIn

---

### trackFormSubmission(formName, location)

Tracks form submissions (contact, newsletter, trial booking).

**Parameters**:
- `formName`: Form identifier (e.g., "contact-form", "newsletter", "book-trial")
- `location`: Page/section location

**Example**:
```typescript
import { trackFormSubmission } from '@/lib/analytics';

const handleSubmit = async () => {
  // ... form submission logic
  trackFormSubmission('contact-form', 'contact-page');
};
```

**Sent to**: Google Analytics, Microsoft Clarity, LinkedIn

---

### trackMarketingEvent(event, params)

Generic marketing event tracker (foundation for custom events).

**Example**:
```typescript
import { trackMarketingEvent } from '@/lib/analytics';

trackMarketingEvent('video_play', {
  video_title: 'Product Demo',
  duration: 120,
  location: 'features-page'
});
```

---

## Page Analytics Hook

`usePageAnalytics()` automatically tracks page views and navigation:

**Location**: `frontend/src/hooks/usePageAnalytics.ts`

**Features**:
- Automatic page view tracking on route change
- Path, search params, and referrer captured
- Debounced to prevent duplicate events

**Already integrated** in `frontend/src/App.tsx` (line 107).

---

## GDPR Compliance

### IP Anonymization

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true // Last octet of IP removed
});
```

### Cookie Consent

**Implementation Required** (Post-Launch):
1. Add cookie consent banner (use library like `react-cookie-consent`)
2. Delay analytics script loading until consent given
3. Provide opt-out mechanism

**Example**:
```typescript
import CookieConsent from 'react-cookie-consent';

<CookieConsent
  onAccept={() => {
    // Enable analytics tracking
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }}
>
  We use cookies to improve your experience.
</CookieConsent>
```

---

## Verification Checklist

After replacing placeholder IDs:

- [ ] Visit https://100daysandbeyond.com in browser
- [ ] Open DevTools → Network tab
- [ ] Confirm requests to:
  - `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
  - `https://www.clarity.ms/tag/XXXXXXXXXX`
  - `https://snap.licdn.com/li.lms-analytics/insight.min.js`
- [ ] Check GA4 Realtime report (should show 1 active user)
- [ ] Check Microsoft Clarity Dashboard (recording should appear within 2 minutes)
- [ ] Verify events firing:
  - Click a CTA button → Check GA4 Events report for `marketing_cta_click`
  - Submit a form → Check GA4 Events report for `marketing_form_submission`

---

## Performance Impact

All analytics scripts are loaded **asynchronously** to prevent blocking page render:

- **GA4**: ~15KB gzipped, loaded async
- **Microsoft Clarity**: ~30KB gzipped, loaded after page interactive
- **LinkedIn**: ~10KB gzipped, loaded async

**Total Impact**: ~55KB additional JavaScript, negligible effect on Core Web Vitals (Lighthouse Performance score >90).

---

## Dashboard Links (Post-Setup)

- **Google Analytics 4**: https://analytics.google.com/
- **Microsoft Clarity**: https://clarity.microsoft.com/projects/
- **LinkedIn Campaign Manager**: https://www.linkedin.com/campaignmanager/

---

## Future Enhancements

1. **Google Tag Manager (GTM)**: Replace direct script tags with GTM container for easier event management
2. **Enhanced E-commerce Tracking**: Track subscription upgrades, downgrades, cancellations
3. **A/B Testing**: Integrate with Google Optimize or Optimizely
4. **Attribution Modeling**: Multi-touch attribution for marketing channels
5. **User Feedback**: Add survey tools (Hotjar Surveys or Typeform)

---

**Status**: ✅ Phase 6 COMPLETE - Infrastructure ready, pending production IDs
