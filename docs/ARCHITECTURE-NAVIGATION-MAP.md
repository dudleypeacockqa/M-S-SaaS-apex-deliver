# ApexDeliver Architecture & Navigation Map

## Deployment & Health Snapshot
- Backend FastAPI service (`/app/app/main.py`) is healthy per platform diagnostics; database, Clerk auth, and webhook configs are active (latest check 2025-11-18).
- Frontend static build `ma-saas-platform.onrender.com` serves the current marketing + app bundle and is working correctly (HTTP 200).
- Custom domain `100daysandbeyond.com` returns 500 errors via Cloudflare; DNS needs to be updated to point CNAME records to `ma-saas-platform.onrender.com` (see `docs/FIX_500_ERROR_2025-11-18.md` for fix instructions).
- Blog API endpoints now have improved error handling (return 503 instead of 500 when `blog_posts` table missing); migration `9913803fac51` will run automatically on next deployment.
- BlogAdminEditor and related admin routes exist in code (`frontend/src/pages/admin/BlogAdminEditor.tsx`) but are not present in the deployed bundle, and the backend exposes read-only blog APIs (GET-only), so the 52-post import still requires a DB seed/migration.

## User Roles & Access Model
| Role | Description | Default Navigation |
| --- | --- | --- |
| `solo` | Individual operator / starter tier. | Dashboard, Deals, Tasks, Documents, Billing, Customer Portal (if enabled). |
| `growth` | Professional tier with GTM + FP&A features. | Adds Deal Matching, Events, Community, Podcast Studio, FP&A modules. |
| `enterprise` | Multi-entity orchestration, same app nav as growth with enterprise entitlements. |
| `admin` | Workspace admin with access to `/admin` controls plus growth/enterprise modules. |
| `master_admin` | Platform-level operator with full visibility plus `/master-admin` workspace. |

_Source: `frontend/src/components/auth/ProtectedRoute.tsx:6-44` and `frontend/src/const.ts:5-78`._

## Global Navigation Surfaces
1. **Marketing & Public:** `MarketingNav` drives top-level menus: Products, Solutions, Resources, Company, Pricing, Sign In/Trial CTAs. Each dropdown item maps to a marketing page (CapLiquify FP&A, Sales & Promotion Pricing, 4-Stage Cycle, Case Studies, Blog, Podcast, FAQ, About, Team, Contact, Pricing). (`frontend/src/components/marketing/MarketingNav.tsx:15-143`).
2. **RootLayout Header:** Minimal home/dashboard links plus Clerk sign-in/out for non-authenticated experience. (`frontend/src/layouts/RootLayout.tsx:1-71`).
3. **Workspace Navigation:** Role-aware pill menu generated from `WORKSPACE_NAV_ITEMS`, filtered at runtime; master admin sees everything, others see role-specific items. (`frontend/src/components/layout/NavigationMenu.tsx:1-63`, `frontend/src/const.ts:5-90`).
4. **ProtectedLayout:** Wraps signed-in routes with `NavigationMenu`, breadcrumbs, and enforcement of required roles via `ProtectedRoute`. (`frontend/src/layouts/ProtectedLayout.tsx:1-36`).

## Marketing Experience Architecture
```
Marketing Landing (EnhancedLandingPage)
├─ Hero (CapLiquify + ApexDeliver positioning, stats, CTA)
├─ Trust Signals & Platform Map (6 capability tiles)
├─ New Launch Highlights (Sales & Promotion Pricing, Event Hub, Community)
├─ First 100-Day Value Sprints (4-step timeline)
├─ Persona Plays (CFOs, Corp Dev, RevOps, Community)
├─ Activation Flow (CapLiquify → ApexDeliver → Portfolio Growth)
├─ Feature Showcase Grid
└─ Pricing teaser + CTA
```
_Pages: `EnhancedLandingPage.tsx`, `LandingPage.tsx`, `PricingPage.tsx`, `FeaturesPage.tsx`, `CapLiquifyFPAPage.tsx`, `SalesPromotionPricingPage.tsx`, `FourStageCyclePage.tsx`, `CaseStudiesPage.tsx`, `BookTrial.tsx`, `AboutPage.tsx`, `TeamPage.tsx`, `SecurityPage.tsx`, `FAQPage.tsx`, `BlogListingPage.tsx`, `BlogPostPage.tsx`, `PodcastPage.tsx`, plus legal pages under `marketing/legal/`._

Wayfinding:
- **Products dropdown** → deep links (CapLiquify FP&A, Sales & Promotion Pricing, Pricing tiers).
- **Solutions dropdown** → 4-Stage Cycle, Features, Security.
- **Resources dropdown** → Case Studies, Blog, Podcast, FAQ.
- **Company** → About, Team, Contact.
- Footer extends to Terms, Privacy, Cookie policy.

## Authentication & Onboarding
- Standalone `SignInPage`, `SignUpPage`, and `RootLayout` home present the minimal brand shell leading to the authenticated workspace.
- Unauthorized hits route to `UnauthorizedPage` with role guidance.

## Authenticated Workspace Architecture
```
/dashboard            → Core metrics & quick links (DashboardPage.tsx)
/deals               → Pipeline board, detail, new deal wizard, valuations, data room
/tasks               → Task board & workflows
/documents           → Document vault + e-sign/data room flows
/events              → Event hub (sessions, tickets, analytics)
/community           → Feed, posts, moderation
/podcast-studio      → Episode planner, assets
/fpa/*               → FP&A control tower (demand, inventory, production, quality, working capital, what-if, reports, data import, admin)
/customer-portal/*   → Customer-facing dashboard, account, invoices, settings
/dashboard/billing   → Subscription/billing center
/deals/matching      → AI deal-matching workspace
```
_Feature gating handled via `FeatureGate` wrappers inside `AppRoutes` ensuring tier-based access (e.g., `feature="deal_matching" requiredTier="professional"`)._ (`frontend/src/App.tsx`, search for `<FeatureGate ...>` near the FP&A, events, community routes.)

## Admin Portal (`/admin`)
Modules under `frontend/src/pages/admin/`:
- `AdminDashboard.tsx` – rollup of usage, org status.
- `UserManagement.tsx`, `OrganizationManagement.tsx` – CRUD for workspace users/orgs.
- `SystemHealth.tsx` – monitors backend services.
- `Analytics.tsx` – admin-level reporting.
- `BlogAdminEditor.tsx` – Rich-text editor + metadata management for blog posts (currently absent from prod build).
Navigation: Admin role inherits growth/enterprise nav plus an “Admin” pill linking into this suite. (`frontend/src/const.ts:63-86`).

## Master Admin Portal (`/master-admin`)
Feature set aimed at platform operators (files under `frontend/src/pages/master-admin/`):
- `MasterAdminDashboard.tsx` – productivity + activity overview (score, streaks, quick stats, actions). (`frontend/src/pages/master-admin/MasterAdminDashboard.tsx:1-167`).
- `ActivityTracker.tsx` – goals, nudges, focus sessions.
- `ProspectPipeline.tsx` – multi-entity prospect/deal tracker.
- `CampaignManager.tsx` + `TemplateManager.tsx` – outreach campaigns & templates.
- `VoiceCampaign.tsx` – Synthflow-integrated voice automation hub.
- `LeadCapture.tsx`, `ContentStudio.tsx`, `SalesCollateral.tsx` – supporting GTM tooling.
Access: `master_admin` role (and optionally `admin` if feature flag `VITE_ENABLE_MASTER_ADMIN` true) via nav pill.

## Customer Portal (`/customer-portal`)
Sub-app for B2B2C partners: dashboard, account, invoices, settings. Currently exposed to all logged-in roles but intended for dedicated customer accounts once backend wiring is complete (`frontend/src/pages/customer-portal/*.tsx`).

## Marketing Blog Surfaces
- Public listing/post detail at `/blog` + `/blog/:slug` (cards, categories, related posts).
- Admin editing capability exists in code (`frontend/src/pages/admin/BlogAdminEditor.tsx`) but deploy + backend write APIs pending (only GET endpoints exist per earlier investigation).

## Outstanding Gaps & Recommendations
1. **Domain Routing:** ⏳ IN PROGRESS - Update Cloudflare DNS CNAME records to point `100daysandbeyond.com` to `ma-saas-platform.onrender.com`. See `docs/FIX_500_ERROR_2025-11-18.md` for detailed instructions.
2. **Blog Content Upload:** Either add POST endpoints under `/api/blog` or run the provided 52-post SQL/seed via backend tasks to populate the CMS.
3. **Deployment Sync:** Ensure the latest frontend build (containing BlogAdminEditor + EnhancedLandingPage updates) is deployed once domain fix is complete.
4. **Backend Deployment:** Push current changes to trigger automatic migration execution and verify `blog_posts` table creation.
