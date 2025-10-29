# Marketing Analytics Implementation

_Last updated: 2025-10-28_

## Hotjar Integration

ApexDeliver loads Hotjar through `MarketingLayout` → `AnalyticsProvider` when both variables are available:

- `VITE_HOTJAR_ID`
- `VITE_HOTJAR_VERSION`

### Setup

1. Add the variables above to the deployment environment (or `.env` during local development).
2. Deploy the marketing build; the provider injects the standard Hotjar snippet and queues calls until the script loads.
3. In Hotjar, create heatmaps for key URLs (`/`, `/features`, `/pricing`).
4. Start a session recording and confirm events appear on the Hotjar dashboard.

## LinkedIn Insight Tag

The LinkedIn pixel initialises when `VITE_LINKEDIN_PARTNER_ID` is present. The Insight script is appended by `AnalyticsProvider` and supports conversion events emitted by `trackMarketingEvent` / `trackCtaClick`.

### Setup Checklist

1. Add `VITE_LINKEDIN_PARTNER_ID` to the environment.
2. Publish the site and verify the pixel with the LinkedIn Insight Tag helper browser extension.
3. Create conversion rules for `marketing_cta_click` events (e.g., demo requests, pricing CTAs).

## Testing Notes

- Use browser devtools to confirm Hotjar (`window.hj`) and LinkedIn (`window.lintrk`) are defined once scripts load.
- Page views are dispatched by the `usePageAnalytics` hook; CTA/form submissions use helpers in `frontend/src/lib/analytics.ts`.
- Real recordings/pixel hits require production or staging; sandboxed local builds will not send live telemetry.
