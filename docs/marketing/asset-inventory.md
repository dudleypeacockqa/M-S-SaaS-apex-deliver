# Marketing Asset Inventory

_Last updated: 2025-10-28_

This catalogue tracks all marketing visuals generated for the ApexDeliver enhanced website initiative (MARK-002). Assets are stored within the frontend bundle so they can be versioned with the codebase and served directly by Vite.

## Quick Reference

| Category | Asset | Path | Primary Usage |
| --- | --- | --- | --- |
| Brand | ApexDeliver wordmark | <code>frontend/public/assets/brand/apexdeliver-wordmark.svg</code> | Structured data logo, footer branding |
| Brand | Favicon + app icons | <code>frontend/public/favicon.ico</code>; <code>frontend/public/apple-touch-icon.png</code>; <code>frontend/public/icons/icon-192.png</code>; <code>frontend/public/icons/icon-512.png</code> | Browser tabs, PWA manifest, mobile shortcuts |
| Feature illustrations | Deal flow pipeline | <code>frontend/src/assets/marketing/illustrations/deal-flow-illustration.svg</code> | Features page – Deal flow section |
| Feature illustrations | Financial intelligence dashboard | <code>frontend/src/assets/marketing/illustrations/financial-intelligence-illustration.svg</code> | Features page – Financial intelligence section |
| Feature illustrations | Valuation suite comparison | <code>frontend/src/assets/marketing/illustrations/valuation-suite-illustration.svg</code> | Features page – Valuation suite section |
| Feature illustrations | Secure data room vault | <code>frontend/src/assets/marketing/illustrations/secure-data-room-illustration.svg</code> | Features page – Secure document room section |
| Feature illustrations | AI deal matching network | <code>frontend/src/assets/marketing/illustrations/ai-deal-matching-illustration.svg</code> | Features page – AI matching section |
| Feature illustrations | Document automation workspace | <code>frontend/src/assets/marketing/illustrations/document-automation-illustration.svg</code> | Features page – Automated documents section |
| Feature illustrations | Workflow automation graph | <code>frontend/src/assets/marketing/illustrations/workflow-automation-illustration.svg</code> | Features page – Workflow automation section |
| Feature illustrations | Community platform hub | <code>frontend/src/assets/marketing/illustrations/community-illustration.svg</code> | Features page – Community section |
| Icons | Feature icon set (9 SVGs) | <code>frontend/src/assets/marketing/icons/</code> | Enhanced landing page feature grid |
| Icons | Public hero/iconography (WebP) | <code>frontend/public/assets/icons/*.webp</code> | General marketing use, hero callouts |
| Avatars | Testimonial avatars (5 SVGs) | <code>frontend/src/assets/marketing/avatars/</code> | Enhanced testimonials carousel |
| Logos | Partner logos (8 SVGs) | <code>frontend/src/assets/marketing/logos/</code> | Testimonials & trust badges integrations |
| Integrations | Integration logos (6 SVGs) | <code>frontend/src/assets/marketing/logos/integration-*.svg</code> | Trust badges integration rail |
| Optimised imagery | Marketing hero/web visuals (WebP) | <code>frontend/public/assets/*.webp</code> | Hero, feature callouts (WebP, 85 quality) |

## Optimisation Notes

- All PNG marketing assets under <code>frontend/public/assets</code> now ship with WebP equivalents (quality 85, method 6). Update <code>&lt;picture&gt;</code> sources to prefer WebP where raster assets are consumed.
- New illustration work is fully vector (SVG) to minimise bundle weight and supports lazy-loading in the Features page.
- Favicon and PWA icons are procedurally generated (Apex gradient motif) to maintain consistent branding across touchpoints.

## Maintenance Checklist

1. When adding new marketing visuals, drop raw design exports into <code>frontend/public/assets/raw/</code> (not yet created) and commit optimised derivatives (<code>.webp</code>, <code>.svg</code>).
2. Keep this inventory in sync by appending new rows with usage notes.
3. Run the optimisation script <code>scripts/marketing/optimise_assets.py</code> (TBD) or rerun the Pillow conversion command to ensure parity between PNG and WebP files.
4. Update structured data references (<code>frontend/src/components/marketing/MarketingLayout.tsx</code>) if brand asset filenames change.
