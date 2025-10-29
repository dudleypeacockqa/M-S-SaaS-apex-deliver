# Cross-Browser & Responsive Test Plan

_Last updated: 2025-10-28_

## Target Browsers

- Chrome (latest)
- Firefox (latest)
- Safari (latest macOS/iOS)
- Microsoft Edge (latest)

## Browser Support Matrix

| Browser | Version | Desktop | Tablet | Mobile | Notes |
| --- | --- | --- | --- | --- | --- |
| Chrome | Latest stable | Pending | Pending | Pending | Execute after marketing build succeeds |
| Firefox | Latest stable | Pending | Pending | Pending |  |
| Safari | 17.x (macOS / iOS) | Pending | Pending | Pending | Test on physical iOS device for sticky CTA |
| Edge | Latest stable | Pending | Pending | Pending |  |

## Test Matrix

| Viewport | Devices | Notes |
| --- | --- | --- |
| 1440×900 | Desktop | Default marketing layout, sticky CTA bar |
| 1024×768 | Tablet landscape | Ensure nav collapses gracefully |
| 768×1024 | Tablet portrait | Validate hero, feature grid stacking |
| 414×896 | Large phone | Verify sticky CTA, modals, forms |
| 360×640 | Small phone | Ensure CTA buttons remain accessible |

## Manual Checklist

1. Load `/`, `/features`, `/pricing`, `/about`, `/contact` in each browser.
2. Confirm hero animations, testimonials carousel, and CTA tracking (network tab) work.
3. Verify forms (contact) accept input and display validation states.
4. Inspect console for runtime errors or CSP issues.
5. Run Lighthouse (desktop + mobile) once TypeScript build errors are cleared.

> Note: Real device testing is recommended for Safari/iOS to confirm Sticky CTA behaviour. Record findings in this document with browser + version details.
