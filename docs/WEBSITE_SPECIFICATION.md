# ApexDeliver + CapLiquify Marketing Website - Complete Specification

**Live URL:** https://100daysandbeyond.com  
**Repository:** https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver  
**Project Path:** `/home/ubuntu/apex-deliver-main`  
**Last Updated:** October 29, 2025

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features & Modules](#features--modules)
5. [Page Structure](#page-structure)
6. [User Flows](#user-flows)
7. [Current Issues](#current-issues)
8. [Recent Fixes](#recent-fixes)
9. [Deployment](#deployment)
10. [Database Schema](#database-schema)
11. [API Endpoints](#api-endpoints)
12. [Environment Variables](#environment-variables)

---

## Project Overview

ApexDeliver + CapLiquify is a comprehensive M&A intelligence and financial planning platform marketed to mid-market dealmakers, corporate development teams, and financial professionals.

### Business Model
- **Core Platform:** Tiered subscription (Starter, Professional, Enterprise, Portfolio)
- **Bolt-On Modules:** Separate add-ons (Customer Portal, Sales & Promotion Pricing)
- **MVP Trial:** Users sign up → book consultation → receive customized trial

### Target Audience
- M&A professionals and dealmakers
- Corporate development teams
- CFOs and financial planning teams
- Private equity firms
- Business owners considering acquisitions

---

## Technology Stack

### Frontend
- **Framework:** React 19.1.1 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM 7.9.4
- **Authentication:** Clerk (@clerk/clerk-react 5.53.3)
- **State Management:** Zustand 5.0.8
- **HTTP Client:** Axios 1.12.2
- **Styling:** Tailwind CSS (assumed from class names)
- **Drag & Drop:** @hello-pangea/dnd 18.0.1
- **Data Fetching:** @tanstack/react-query 5.90.5

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (via SQLAlchemy ORM)
- **Authentication:** Integrated with Clerk
- **API Documentation:** Auto-generated via FastAPI

### Deployment
- **Platform:** Render.com
- **Backend Service:** `ma-saas-backend` (srv-d3ii9qk9c44c73aqsli0)
  - URL: https://ma-saas-backend.onrender.com
- **Frontend Service:** `ma-saas-platform` (srv-d3ihptbipnbc73e72ne0)
  - URL: https://100daysandbeyond.com
- **Auto-Deploy:** Enabled on push to `main` branch

---

## Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── marketing/          # Public marketing pages
│   │   │   ├── Home.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BookTrial.tsx   # Post-signup calendar booking
│   │   │   ├── FeaturesPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   └── ...
│   │   ├── deals/              # Authenticated deal management
│   │   ├── podcast/            # Podcast studio features
│   │   └── ...
│   ├── components/
│   │   ├── marketing/          # Marketing site components
│   │   │   ├── MarketingNav.tsx
│   │   │   ├── MarketingLayout.tsx
│   │   │   ├── StickyCTABar.tsx
│   │   │   └── OptInPopup.tsx
│   │   └── common/             # Shared components
│   ├── assets/
│   └── App.tsx
└── package.json
```

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── blog.py         # Blog API endpoints
│   │   │   └── ...
│   │   └── __init__.py
│   ├── models/
│   │   ├── blog_post.py        # BlogPost SQLAlchemy model
│   │   └── ...
│   ├── db/
│   │   └── session.py          # Database session management
│   └── main.py
└── requirements.txt
```

---

## Features & Modules

### Core Platform Features

#### 1. CapLiquify FP&A Engine
- **13-Week Cash Forecasting** - Rolling cash flow projections
- **Working Capital Management** - Optimize cash conversion cycle
- **Financial Intelligence Engine** - 47+ financial ratios with AI insights
- **Scenario Modeling** - Stress test financial assumptions
- **Integration:** Xero, QuickBooks, Sage, NetSuite

**Pricing:** £598/month + £2,500 setup

#### 2. ApexDeliver M&A Suite
- **Deal Flow & Pipeline Management** - Kanban boards, deal tracking
- **AI-Powered Deal Matching** - Find relevant acquisition targets
- **Multi-Method Valuation Suite** - DCF, Comps, Precedents
- **Due Diligence Data Room** - Secure document management (10GB storage)
- **Document Generation** - NDAs, LOIs, Term Sheets, SPAs
- **Post-Merger Integration Tools** - 100-day plans, milestone tracking
- **Task Management & Workflow Automation** - Automated assignments

**Tiers:**
- **Professional:** £1,598/month (up to 5 team members)
- **Enterprise:** £2,997/month (unlimited team, API access)
- **Portfolio:** Custom pricing (multi-entity management)

#### 3. Bolt-On Modules (Add to any tier)

**Customer Portal Module (B2B2C)**
- Self-service portals for end customers
- ERP integration for real-time data
- Branded white-label interface
- Reduce administrative overhead

**Pricing:** £499/month + £1,500 setup

**Sales & Promotion Pricing Module**
- Dynamic pricing engine
- Customer-specific pricing portals
- Promotional campaign management
- Real-time margin analysis

**Pricing:** £399/month + £1,200 setup

#### 4. Professional Community Platform
- Networking with M&A professionals
- Premium events, forums, summits
- Exclusive content and insights
- Integration with deal flow for serendipitous opportunities

---

## Page Structure

### Public Marketing Pages

#### Homepage (`/`)
- Hero section with dual CTAs (Start Free Trial, Schedule Demo)
- Feature highlights (3 product cards)
- Social proof (testimonials)
- Integration logos (Xero, QuickBooks, Sage, NetSuite, Stripe, Slack)
- CTA sections throughout

#### Features Page (`/features`)
- Detailed feature breakdowns with illustrations:
  - Deal Flow & Pipeline Management
  - Financial Intelligence Engine
  - Multi-Method Valuation Suite
  - Automated Document Generation
  - Task Management & Workflow Automation
  - Professional Community Platform
- M&A Process Timeline (4 stages: Evaluation, Pre-Deal, Deal Execution, Post-Merger)

#### Pricing Page (`/pricing`)
- 4 pricing tiers with feature comparison table
- Bolt-On Modules section (Customer Portal, Sales & Promotion Pricing)
- FAQ section
- CTA buttons for each tier

#### Blog Page (`/blog`)
- Category filters: All Posts, M&A Strategy, Financial Planning, Post-Merger Integration, Working Capital, Pricing Strategy
- Search functionality
- Post grid with featured images, excerpts, read time
- **Status:** Currently broken (showing "No posts yet")

#### Book Trial Page (`/book-trial`)
- **Access:** Authenticated users only (redirect to sign-in if not logged in)
- Vimcal calendar embed for booking 60-min requirements planning session
- Left sidebar: What to Expect (4-step process)
- Right side: Calendar booking interface
- **Purpose:** MVP trial setup after user registration

#### Other Pages
- `/about` - Company information
- `/contact` - Contact form
- `/terms-of-service` - Legal terms
- `/privacy-policy` - Privacy policy
- `/cookie-policy` - Cookie policy

### Authenticated Pages (Behind Clerk Auth)
- `/deals` - Deal management workspace
- `/deals/matching` - AI-powered deal matching
- `/podcast` - Podcast studio features
- `/dashboard` - User dashboard

---

## User Flows

### MVP Trial Sign-Up Flow
```
1. User clicks "Start Free Trial" button (anywhere on site)
   ↓
2. Redirect to Clerk sign-up page (/sign-up)
   ↓
3. User creates account (email/password or OAuth)
   ↓
4. Clerk redirects to /book-trial page
   ↓
5. User sees Vimcal calendar embed
   ↓
6. User books 60-min requirements planning session
   ↓
7. Meeting confirmation sent
   ↓
8. During meeting: Requirements discovery, platform demo, MVP trial setup
   ↓
9. After meeting: User receives customized trial environment access
```

### Blog Reading Flow
```
1. User visits /blog
   ↓
2. Sees list of blog posts (currently broken)
   ↓
3. Can filter by category or search
   ↓
4. Clicks on post to read full article (/blog/{slug})
```

### Navigation Dropdown Flow
```
1. User hovers over Products/Solutions/Resources/Company
   ↓
2. Dropdown menu appears
   ↓
3. User moves mouse to dropdown
   ↓
4. Dropdown stays open (150ms delay before closing)
   ↓
5. User clicks outside OR presses Escape
   ↓
6. Dropdown closes
```

---

## Current Issues
## Current Issues

### 🔴 CRITICAL (Site Broken)

#### 1. Blog Page Does Not Load Content
**Status:** BROKEN  
**Description:**  immediately renders the "No posts yet" empty state. Fetching  from the production domain returns the SPA HTML shell instead of JSON; hitting the FastAPI service directly () responds with .  
**Root Cause:** The marketing bundle calls a relative path, so requests never leave . Even when routed to the backend, the API is crashing (likely missing tables or seed data).  
**Impact:** Blog pillar content is unavailable, gutting organic SEO plans and breaking internal links.  
**TDD Coverage:** Add Vitest contract tests that stub the fetch and assert fallback messaging; add an integration test (Playwright/pytest) that hits the deployed endpoint once routing is fixed.  
**Next Steps:**
1. Update the frontend to use  (already documented) and add production env on Render.  
2. Restore the FastAPI  endpoint (ensure migrations + seed complete).  
3. Add monitoring + integration test to CI to catch regressions.

#### 2. Contact Form Submissions Are Dropped
**Status:** BROKEN  
**Description:** Submitting  only logs to the console and toggles a success message; no network request is made, so leads are discarded.  
**Impact:** High-intent visitors cannot reach the team, creating an immediate revenue leak.  
**TDD Coverage:** Write a failing Vitest test that asserts  is called with the payload → implement POST to backend (or email service). Pair with backend pytest to validate request handling.  
**Next Steps:**
1. Design  endpoint (FastAPI) with validation + notification.  
2. Update the React form to call the endpoint and surface error states.  
3. Add end-to-end coverage (Playwright) to ensure form > success toast works.

#### 3. Newsletter Opt-In Popup Fails Silently
**Status:** BROKEN  
**Description:** The exit-intent/sticky CTA posts to ; Render returns the SPA HTML, so the  logs "Failed to subscribe" and users never see confirmation.  
**Impact:** Marketing opt-ins are lost; customer journey cannot be nurtured.  
**TDD Coverage:** Add a unit test for the opt-in hook that mocks a rejected promise; ensure UI surfaces failure. Add backend pytest covering subscription storage/integration.  
**Next Steps:**
1. Expose a working subscription endpoint (FastAPI or external ESP).  
2. Wire the frontend to use the configured .  
3. Track conversions via telemetry.

### 🟡 HIGH PRIORITY (SEO & Brand Risk)

#### 4. Canonical/OG Metadata Points to Legacy Domains
**Status:** NOT FIXED  
**Description:** Many SEO helpers still reference  or  (see Pricing, Features, About, Contact, legal pages).  
**Impact:** Duplicate indexing, diluted link equity, incorrect social-sharing previews.  
**TDD Coverage:** Introduce metadata snapshot tests (Vitest + react-testing-library) that assert canonical URLs match .  
**Next Steps:** Normalize domain constants, update the HTML shell, and add deployment smoke tests that grep for the correct host.

#### 5. Team Portraits & Media Assets Return 404s
**Status:** NOT FIXED  
**Description:** Requests like  resolve to the SPA HTML, leaving broken avatars on .  
**Impact:** Erodes credibility on a key trust-building page.  
**TDD Coverage:** Add a Vitest test for  that asserts fallback avatar is rendered when image fails; add a CI check that HEAD requests for key assets return .  
**Next Steps:** Upload assets to the deployed CDN (or bundle locally) and update import paths.

#### 6. "View All Integrations" CTA Hits Missing Route
**Status:** NOT FIXED  
**Description:** Landing-page CTA links to , but the router lacks a matching element so the SPA displays the 404.  
**Impact:** Frustrates users exploring ecosystem capabilities.  
**TDD Coverage:** Add a router test that navigates to  and expects a valid component; implement the page or redirect to an existing section.  
**Next Steps:** Ship either a dedicated integrations page or deep-link to Features → Integrations section.

### 🟢 MEDIUM PRIORITY (Technical Debt)

#### 7. TypeScript Errors (184 errors)
**Status:** TEMPORARILY BYPASSED  
**Description:** Project still skips type-checking via . Errors cluster in Podcast Studio, Matching Workspace, etc.  
**Impact:** Type safety compromised; potential runtime issues.  
**TDD Coverage:** Enforce  in CI once errors are resolved and maintain RED → GREEN cycles for type fixes.  
**Next Steps:** Tackle errors per module while maintaining strict TDD (write failing test demonstrating the type issue, fix code, re-enable compiler checks).

## Recent Fixes

### ✅ Completed Fixes (October 29, 2025)

#### 1. Navigation Dropdown Behavior
**Issue:** Dropdowns stayed open when clicking elsewhere or moving mouse away  
**Fix:** Added click-outside detection, Escape key handler, 150ms close delay  
**Files Changed:** `/frontend/src/components/marketing/MarketingNav.tsx`  
**Commit:** aaacadb

#### 2. Sticky CTA Bar Too Aggressive
**Issue:** Bar appeared after 50% scroll, blocking content  
**Fix:** Changed to 80% scroll threshold  
**Files Changed:** `/frontend/src/components/marketing/StickyCTABar.tsx`  
**Commit:** be56da8

#### 3. Email Popup Timing
**Issue:** Popup appeared after 30 seconds, too intrusive  
**Fix:** Changed to 90 seconds  
**Files Changed:** `/frontend/src/components/marketing/OptInPopup.tsx`  
**Commit:** 9ce481f

#### 4. MVP Trial Workflow
**Issue:** "Start Free Trial" button went directly to platform  
**Fix:** Created `/book-trial` page with Vimcal calendar embed, updated sign-up flow  
**Files Changed:**
- `/frontend/src/pages/marketing/BookTrial.tsx` (new)
- `/frontend/src/pages/SignUpPage.tsx`
- `/frontend/src/App.tsx`  
**Commit:** be56da8

#### 5. Pricing Page Expansion
**Issue:** Feature comparison table too sparse, missing bolt-on modules  
**Fix:** Added 5 missing features, created Bolt-On Modules section  
**Features Added:**
- 13-Week Cash Forecasting
- Working Capital Management
- Due Diligence Data Room
- Post-Merger Integration Tools
- Portfolio Management Dashboard  
**Bolt-Ons Added:**
- Customer Portal Module (£499/month)
- Sales & Promotion Pricing Module (£399/month)  
**Files Changed:** `/frontend/src/pages/marketing/PricingPage.tsx`  
**Commit:** be56da8

#### 6. Frontend Build Errors
**Issue:** Build failing with 184 TypeScript errors, preventing deployment  
**Fix:** 
- Fixed missing closing `</div>` in MatchingWorkspace.tsx
- Fixed import path in BookTrial.tsx
- Temporarily disabled TypeScript strict checking  
**Files Changed:**
- `/frontend/src/pages/deals/MatchingWorkspace.tsx`
- `/frontend/src/pages/marketing/BookTrial.tsx`
- `/frontend/package.json`  
**Commit:** 5e76565

#### 7. Blog API Backend
**Issue:** No backend API endpoint for blog posts  
**Fix:** Created `/api/blog` endpoint with filtering, search, pagination  
**Features:**
- List all posts with pagination
- Filter by category
- Search in title/excerpt/content
- Get post by slug
- List all categories  
**Files Changed:**
- `/backend/app/api/routes/blog.py` (new)
- `/backend/app/api/__init__.py`  
**Commit:** 9ce481f, 1ac79b0

#### 8. Blog Frontend Connection
**Issue:** Frontend using placeholder data instead of API  
**Fix:** Updated Blog.tsx to fetch from `${VITE_API_URL}/api/blog`  
**Files Changed:** `/frontend/src/pages/marketing/Blog.tsx`  
**Commit:** 1573d32

---

## Deployment

### Render Services

#### Backend Service
- **Name:** ma-saas-backend
- **Service ID:** srv-d3ii9qk9c44c73aqsli0
- **URL:** https://ma-saas-backend.onrender.com
- **Type:** Web Service
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Auto-Deploy:** Enabled (on push to main)

#### Frontend Service
- **Name:** ma-saas-platform
- **Service ID:** srv-d3ihptbipnbc73e72ne0
- **URL:** https://100daysandbeyond.com
- **Type:** Static Site or Web Service
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/dist`
- **Auto-Deploy:** Enabled (on push to main)

### Deployment Process
1. Push commits to `main` branch on GitHub
2. Render detects new commits via webhook
3. Backend and frontend services rebuild automatically
4. Deployment typically takes 3-5 minutes
5. Services go live when build succeeds

### Manual Deployment Trigger
```bash
# Backend
curl -X POST \
  -H "Authorization: Bearer rnd_7cK6Tcaqek5sZ4WSZ5Y3Xqbq2hZ4" \
  "https://api.render.com/v1/services/srv-d3ii9qk9c44c73aqsli0/deploys" \
  -d '{"clearCache": "clear"}'

# Frontend
curl -X POST \
  -H "Authorization: Bearer rnd_7cK6Tcaqek5sZ4WSZ5Y3Xqbq2hZ4" \
  "https://api.render.com/v1/services/srv-d3ihptbipnbc73e72ne0/deploys" \
  -d '{"clearCache": "clear"}'
```

---

## Database Schema

### BlogPost Model

**Table:** `blog_posts`

**Columns:**
```python
id: Integer (Primary Key, Auto-increment)
title: String(200) - Blog post title
slug: String(200) - URL-friendly slug (unique, indexed)
excerpt: Text - Short summary for listings
content: Text - Full blog post content (Markdown)
category: String(100) - Category (M&A Strategy, FP&A, PMI, Working Capital, Pricing Strategy)
primary_keyword: String(100) - Main SEO keyword
secondary_keywords: Text - Comma-separated keywords
meta_description: String(160) - SEO meta description
featured_image_url: String(500) - Featured image URL (nullable)
author: String(100) - Author name (default: "ApexDeliver Team")
read_time_minutes: Integer - Estimated read time
published: Boolean - Publication status (default: False)
published_at: DateTime - Publication timestamp (nullable)
created_at: DateTime - Creation timestamp (auto)
updated_at: DateTime - Last update timestamp (auto)
```

**Indexes:**
- `slug` (unique)
- `category`
- `published`
- `published_at`

**Sample Data Location:** `/home/ubuntu/blog_posts_for_database.json`

---

## API Endpoints

### Blog API (`/api/blog`)

#### List Blog Posts
```
GET /api/blog
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `search` (optional) - Search in title, excerpt, content
- `published_only` (optional, default: true) - Only published posts
- `limit` (optional, default: 50, max: 100) - Posts per page
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Ultimate Guide to M&A Due Diligence",
    "slug": "ultimate-guide-ma-due-diligence",
    "excerpt": "Master the art of due diligence...",
    "content": "Full markdown content...",
    "category": "M&A Strategy",
    "primary_keyword": "M&A due diligence",
    "secondary_keywords": ["due diligence checklist", "M&A process"],
    "meta_description": "Learn how to conduct thorough M&A due diligence...",
    "featured_image": "https://example.com/image.jpg",
    "author": "ApexDeliver Team",
    "read_time_minutes": 12,
    "published": true,
    "published_at": "2025-01-15T10:00:00",
    "created_at": "2025-01-10T14:30:00",
    "updated_at": "2025-01-14T09:15:00"
  }
]
```

#### Get Single Post
```
GET /api/blog/{slug}
```

**Response:** Same as list item above

#### List Categories
```
GET /api/blog/categories/list
```

**Response:**
```json
["M&A Strategy", "Financial Planning", "Post-Merger Integration", "Working Capital", "Pricing Strategy"]
```

---

## Environment Variables

### Frontend (`VITE_*`)
```bash
VITE_API_URL=https://ma-saas-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Backend
```bash
DATABASE_URL=postgresql://user:password@host:port/database
CLERK_SECRET_KEY=sk_test_...
SECRET_KEY=your-secret-key-for-jwt
```

### Setting Environment Variables on Render
```bash
# Frontend
curl -X PUT \
  -H "Authorization: Bearer rnd_7cK6Tcaqek5sZ4WSZ5Y3Xqbq2hZ4" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/services/srv-d3ihptbipnbc73e72ne0/env-vars" \
  -d '[{"key": "VITE_API_URL", "value": "https://ma-saas-backend.onrender.com"}]'
```

---

## Development Workflow

### Local Development

#### Frontend
```bash
cd /home/ubuntu/apex-deliver-main/frontend
npm install
npm run dev  # Starts Vite dev server on http://localhost:5173
```

#### Backend
```bash
cd /home/ubuntu/apex-deliver-main/backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # Starts FastAPI on http://localhost:8000
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build  # Output: dist/

# Backend
# No build step, runs directly with uvicorn
```

### Testing
```bash
# Frontend
cd frontend
npm run test         # Run tests once
npm run test:watch   # Watch mode
npm run test:coverage # With coverage

# Backend
cd backend
pytest  # (if tests exist)
```

---

## Key Files Reference

### Configuration Files
- `/frontend/package.json` - Frontend dependencies and scripts
- `/frontend/vite.config.ts` - Vite configuration
- `/frontend/tsconfig.json` - TypeScript configuration
- `/backend/requirements.txt` - Python dependencies
- `/backend/app/main.py` - FastAPI application entry point

### Important Components
- `/frontend/src/App.tsx` - Main app component with routing
- `/frontend/src/components/marketing/MarketingNav.tsx` - Navigation with dropdowns
- `/frontend/src/components/marketing/MarketingLayout.tsx` - Layout wrapper for marketing pages
- `/frontend/src/pages/marketing/Home.tsx` - Homepage
- `/frontend/src/pages/marketing/BookTrial.tsx` - Post-signup booking page

### Data Files
- `/home/ubuntu/blog_posts_for_database.json` - 50 blog posts ready for import
- `/home/ubuntu/BLOG_CONTENT_PLAN.md` - Blog content strategy and outlines
- `/home/ubuntu/CRITICAL_BUGS_REPORT.md` - Bug tracking document

---

## Contact & Support

**Developer:** Dudley Peacock  
**Email:** dudley@apexdeliver.com  
**Calendar:** https://book.vimcal.com/p/dudleypeacock/requirements-planning-60-min-meet  
**GitHub:** https://github.com/dudleypeacockqa

---

## Next Actions Required

### Immediate (Critical)
1. **Fix Blog Page**
   - Check if `blog_posts` table exists in production database
   - Run database migrations if needed
   - Import 50 blog posts from `/home/ubuntu/blog_posts_for_database.json`
   - Verify API returns data correctly
   - Test blog page displays posts

### Short-term (High Priority)
2. **Replace Poor Quality Images**
   - Generate or source high-quality feature illustrations
   - Update FeaturesPage.tsx with new images
   - Ensure consistent visual style

3. **Fix TypeScript Errors**
   - Address 184 TypeScript compilation errors
   - Re-enable strict type checking in build
   - Test thoroughly after fixes

### Medium-term (Nice to Have)
4. **Content Generation**
   - Generate full 2,000-2,500 word content for all 50 blog posts
   - Add featured images to blog posts
   - Implement blog post detail pages

5. **Testing & QA**
   - Test all user flows end-to-end
   - Mobile responsiveness testing
   - Cross-browser compatibility
   - Performance optimization

---

**Document Version:** 1.0  
**Last Updated:** October 29, 2025  
**Status:** Ready for handover to Codex CLI
