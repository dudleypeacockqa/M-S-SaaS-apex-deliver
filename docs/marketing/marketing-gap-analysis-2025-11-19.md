# Marketing Gap Analysis – 2025-11-19

**Scope**: Identify the remaining work required to bring https://financeflo.ai to parity with the FinanceFlo + CapLiquify positioning described in `MARKETING_WEBSITE_STATUS.md`, README, and `docs/FINAL-COMPLETION-PLAN.md` (Wave 3).

## Snapshot
| Dimension | Current Evidence | Status | Gap |
| --- | --- | --- | --- |
| Navigation & Layout | Enhanced dropdown nav, CapLiquify hero (Nov 12) | ✅ Desktop done | ❌ Mobile dropdown focus/animation polish still outstanding |
| Content Depth | 12/50 long-form posts, CapLiquify FP&A / 4-stage cycle / Sales Promotion pages | ⚠️ Partial | ❌ Need 38 more posts + imagery, refreshed case studies, testimonial overlays |
| Lead Capture & Integrations | Contact + book trial forms wired to local handlers | ⚠️ Partial | ❌ Missing GoHighLevel + newsletter/chatbot hand-off confirmations |
| SEO / Performance | 2025-11-12 Lighthouse + axe reports | ⚠️ Stale | ❌ Need reruns post-navigation rebuild + sitemap/robots/structured-data audit |
| Automation Evidence | Marketing Playwright log (docs/tests/2025-11-19-playwright.txt) | ✅ Logged | ➖ Keep log cadence as UI gaps close |

## Navigation & Layout Tasks
| Area | Current State | Required Action |
| --- | --- | --- |
| Mobile dropdowns | Keyboard-friendly desktop dropdown exists; mobile animation/focus still TODO | Implement slide/fade animation + focus traps, document testing strategy, add Vitest stories |
| Sticky CTA / ROI widgets | Enhanced hero shows ROI chips but lacks sales-engine CTA on scroll | Add sticky CTA component referencing ROI/benchmark data |
| Solutions/Product mega panels | Present but not linked from marketing compare/solutions sub-routes | Link `/marketing/compare/*` + `/marketing/solutions/*` pages inside nav and cover them in routing tests |

## Content Backlog
1. **Blog**: 38 new posts (remaining mix: 7 M&A Strategy, 8 FP&A, 8 PMI, 7 Working Capital, 8 Pricing). Each needs hero art + og:image metadata stored in `frontend/src/data/caseStudies.ts` or blog service.
2. **Case Studies**: Update `frontend/src/data/caseStudies.ts` with metrics, logos, and CTA copy; ensure Playwright smoke covers new cards.
3. **Testimonials & Social Proof**: Extend `LandingPage` and `PricingPage` with customer quotes, metrics, and logos (align with README differentiators).
4. **Compare/Solutions Pages**: `/marketing/compare` and `/marketing/solutions` directories exist but content is MVP; add graphics + CTA flows per page and cover with Vitest + Playwright.

## Lead Capture / Integrations
| Feature | Current Behaviour | Gap & Plan |
| --- | --- | --- |
| Contact form (`/contact`) | Local handler logs payload; no CRM hand-off | Wire to GoHighLevel (per README), capture API response, add Playwright coverage + docs/tests log |
| Newsletter | CTA present but no backend endpoint | Add `/api/marketing/newsletter` + Supabase/ESP integration, show success/failure toast |
| Book Trial / Chatbot | Buttons open static modal | Integrate with Intercom/Drift or placeholder script, ensure fallback CTA for no-script |
| Podcast/Video embeds | Static placeholders | Add actual embed URLs + loading skeletons, expand tests |

## SEO & Performance Items
- Generate up-to-date `sitemap.xml` + `robots.txt` (ensure Sales Promotion, CapLiquify pages included).
- Add structured data (FAQ, Article, Breadcrumb) for new posts/case studies.
- Re-run Lighthouse + axe after Wave 3 and store outputs (`docs/testing/lighthouse/<date>/`).
- Ensure `<head>` metadata (OG/Twitter) references CapLiquify copy; link to blog cover art once imagery lands.

## Evidence & Test Coverage
| Artifact | Location |
| --- | --- |
| Marketing Playwright log | `docs/tests/2025-11-19-playwright.txt` |
| Backend blog/marketing API smoke log | `docs/tests/2025-11-19-backend-blog-marketing.txt` |
| Upcoming Lighthouse/Axe runs | `docs/testing/lighthouse/<date>/` via `scripts/run-lighthouse-axe.mjs` |

## Next Actions
1. Implement mobile nav polish + record Vitest/Playwright updates.
2. Draft content plan for the remaining 38 blog posts (outline + owner + ETA) and begin populating CMS/BogAdminEditor.
3. Connect contact/newsletter forms to GoHighLevel (or Supabase) and document API keys in `FinanceFlo Environment Variables - Master Reference.md`.
4. Build ROI widget + testimonial overlays on Landing/Pricing pages.
5. Add SEO artefacts (sitemap, robots, structured data) and schedule Lighthouse/Axe rerun using the new script/runbook.
