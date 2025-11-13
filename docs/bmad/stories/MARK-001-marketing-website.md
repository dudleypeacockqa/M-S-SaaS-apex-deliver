# MARK-001: Marketing Website - Landing, Pricing, Features & Legal Pages

**STATUS: ✅ COMPLETE** (2025-11-13 – Landing, pricing, features, legal pages shipped; tests verified via `docs/tests/2025-11-13-frontend-final-verification.txt` marketing block)

**Story ID**: MARK-001
**Epic**: Marketing & Lead Generation
**Priority**: High
**Sprint**: Sprint 3
**Estimated Effort**: 9-10 hours
**Status**: ✅ COMPLETE
**Created**: 2025-10-25
**Assigned To**: CODEX (AI Developer)

---

## Story Description

### User Story
**As a** prospective M&A professional visiting the platform
**I want** a professional, conversion-optimized marketing website
**So that** I can understand the value proposition, explore features, view pricing, and sign up for the platform

### Business Context
The current HomePage is minimal (just a header and two CTA buttons). To achieve the business goal of £1.4M ARR Year 1 and 1,000 active subscribers, we need a comprehensive marketing website that:

1. **Educates** prospects about the platform's unique value proposition
2. **Differentiates** us from £10k+ enterprise competitors
3. **Converts** visitors into trial users and paying subscribers
4. **Builds Trust** through professional design, social proof, and compliance
5. **Captures Leads** for the content marketing and email nurture campaigns

### Target Personas
- **Solo Dealmakers**: Independent M&A advisors, entrepreneurs (Starter tier: £279/month)
- **Growth Firm Users**: Professionals in small-medium PE firms (Professional tier: £598/month)
- **Enterprise Users**: Large investment banks, corporate dev teams (Enterprise tier: £1,598/month)
- **Community Leaders**: Industry influencers, event organizers (Community tier: £2,997/month)

### Success Metrics
- Landing page conversion rate >3% (visitors → sign-ups)
- Pricing page engagement >60 seconds average time
- Bounce rate <40%
- Page load time <2 seconds
- Lighthouse performance score >90
- Mobile usability score 100%

---

## Requirements

### Functional Requirements

#### FR-1: Landing Page
- **FR-1.1**: Hero section with compelling headline, subheadline, primary CTA, and hero visual
- **FR-1.2**: Problem-solution section addressing market pain points (£10k+ pricing, fragmented tools)
- **FR-1.3**: Feature highlights section showcasing 6-8 key capabilities with icons
- **FR-1.4**: Social proof section with testimonials, trust badges, industry logos (placeholder initially)
- **FR-1.5**: Secondary CTA section with strong conversion focus
- **FR-1.6**: Mobile-responsive design (320px to 1920px+)

#### FR-2: Pricing Page
- **FR-2.1**: Display all 4 subscription tiers in comparison format:
  - **Starter**: £279/month - For Solo Dealmakers
  - **Professional**: £598/month - For Growth Firms
  - **Enterprise**: £1,598/month - For Large Organizations
  - **Community Leader**: £2,997/month - For Event Organizers & Influencers
- **FR-2.2**: Feature comparison matrix showing tier-specific features
- **FR-2.3**: FAQ section addressing common pricing questions
- **FR-2.4**: CTA buttons linking to sign-up flow with tier pre-selection
- **FR-2.5**: Annual billing discount display (if applicable)

#### FR-3: Features Page
- **FR-3.1**: Detailed feature sections with descriptions and benefits:
  - Deal Flow & Pipeline Management
  - Financial Intelligence Engine (47+ ratios, AI narratives)
  - Multi-Method Valuation Suite (DCF, Comparables, Precedents)
  - Secure Document Room & Data Room
  - AI-Powered Deal Matching
  - Automated Document Generation
  - Task Management & Workflow Automation
  - Community & Networking Platform
- **FR-3.2**: Visual representations (screenshots/mockups) for each feature
- **FR-3.3**: Use case examples for each persona
- **FR-3.4**: CTA to pricing or sign-up at bottom

#### FR-4: Legal Pages (GDPR Compliance)
- **FR-4.1**: Terms of Service page with comprehensive legal terms
- **FR-4.2**: Privacy Policy page with GDPR-compliant data handling disclosure
- **FR-4.3**: Cookie Policy page explaining cookie usage
- **FR-4.4**: Last updated dates on all legal pages
- **FR-4.5**: Contact information for data protection officer

#### FR-5: About Page
- **FR-5.1**: Mission statement and vision (democratizing M&A tools)
- **FR-5.2**: Founder story and long-term goal (£200M wealth through platform revenue)
- **FR-5.3**: Company values and approach
- **FR-5.4**: Team section (placeholder for future expansion)

#### FR-6: Contact/Support Page
- **FR-6.1**: Contact form with validation (name, email, message, subject)
- **FR-6.2**: Support channels display (email, hours)
- **FR-6.3**: Demo request form
- **FR-6.4**: Sales inquiry option for Enterprise prospects

### Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1**: Page load time <2 seconds on 3G connection
- **NFR-1.2**: First Contentful Paint (FCP) <1.5 seconds
- **NFR-1.3**: Time to Interactive (TTI) <3 seconds
- **NFR-1.4**: Images optimized (WebP format, lazy loading)

#### NFR-2: SEO & Accessibility
- **NFR-2.1**: Semantic HTML5 markup
- **NFR-2.2**: Meta tags (title, description, OpenGraph, Twitter cards) on all pages
- **NFR-2.3**: WCAG 2.1 AA compliance (color contrast, keyboard navigation, screen reader support)
- **NFR-2.4**: Lighthouse accessibility score >90

#### NFR-3: Responsive Design
- **NFR-3.1**: Mobile-first design approach
- **NFR-3.2**: Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1920px+ (large desktop)
- **NFR-3.3**: Touch-friendly CTAs (minimum 44x44px)

#### NFR-4: Browser Support
- **NFR-4.1**: Chrome 90+
- **NFR-4.2**: Firefox 88+
- **NFR-4.3**: Safari 14+
- **NFR-4.4**: Edge 90+

---

## Technical Design

### Architecture

**Decision**: Integrate marketing pages into existing frontend React app

**Rationale**:
- Seamless user experience (marketing → sign-up → authenticated app)
- Single deployment pipeline
- Shared component library and styling
- Easier state management for logged-in users viewing marketing content

### Technology Stack
- **Frontend**: React 19.1.1 + TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router 7.9.4
- **Testing**: Vitest 4.0.2 + React Testing Library 16.3.0

### File Structure
```
frontend/src/
├── pages/
│   ├── marketing/
│   │   ├── LandingPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── FeaturesPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── legal/
│   │       ├── TermsOfService.tsx
│   │       ├── PrivacyPolicy.tsx
│   │       └── CookiePolicy.tsx
├── components/
│   ├── marketing/
│   │   ├── MarketingLayout.tsx
│   │   ├── MarketingNav.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── PricingCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
├── tests/
│   ├── marketing/
│   │   ├── LandingPage.test.tsx
│   │   ├── PricingPage.test.tsx
│   │   ├── FeaturesPage.test.tsx
│   │   └── ContactPage.test.tsx
```

### Component Design

#### MarketingLayout
- Wrapper component for all marketing pages
- Contains MarketingNav and Footer
- Provides consistent styling and structure

#### MarketingNav
- Logo + navigation links (Features, Pricing, About, Contact)
- Sign In / Sign Up CTAs
- Mobile hamburger menu
- Sticky header on scroll

#### HeroSection
- Full-width section with gradient background
- H1 headline: "M&A Intelligence Platform for Every Dealmaker"
- Subheadline: Value proposition (£279/month vs £10k+ enterprise)
- Primary CTA: "Start Free Trial"
- Secondary CTA: "View Pricing"
- Hero image/illustration

#### FeatureCard
- Icon (placeholder or icon library)
- Feature title
- Brief description
- "Learn More" link to Features page

#### PricingCard
- Tier name and target persona
- Price display (£/month)
- Feature list (checkmarks)
- "Get Started" CTA button
- Highlight "Most Popular" tier (Professional)

#### TestimonialCard
- User avatar (placeholder)
- Quote text
- Name, title, company
- Rating stars (if applicable)

#### CTASection
- Conversion-focused section at bottom of pages
- Headline + supporting text
- Primary CTA button
- Trust signals (security, compliance badges)

---

## Test-Driven Development (TDD) Plan

### Test Coverage Target
- **Minimum**: 80% code coverage
- **Target**: 95%+ for marketing components

### Test Suites

#### 1. LandingPage.test.tsx
```typescript
describe('LandingPage', () => {
  it('renders hero section with headline and CTAs', () => {})
  it('displays feature highlights section', () => {})
  it('shows social proof/testimonials section', () => {})
  it('contains final CTA section', () => {})
  it('is mobile responsive', () => {})
  it('has correct meta tags for SEO', () => {})
})
```

#### 2. PricingPage.test.tsx
```typescript
describe('PricingPage', () => {
  it('renders all 4 pricing tiers', () => {})
  it('displays correct pricing amounts (£279, £598, £1598, £2997)', () => {})
  it('highlights Professional tier as most popular', () => {})
  it('shows feature comparison matrix', () => {})
  it('displays FAQ section', () => {})
  it('CTA buttons link to sign-up with correct tier', () => {})
})
```

#### 3. FeaturesPage.test.tsx
```typescript
describe('FeaturesPage', () => {
  it('lists all major features', () => {})
  it('renders feature cards correctly', () => {})
  it('displays use case examples', () => {})
  it('contains CTA to pricing', () => {})
})
```

#### 4. LegalPages.test.tsx
```typescript
describe('TermsOfService', () => {
  it('renders terms content', () => {})
  it('displays last updated date', () => {})
})

describe('PrivacyPolicy', () => {
  it('renders GDPR-compliant privacy content', () => {})
  it('includes data protection officer contact', () => {})
  it('displays last updated date', () => {})
})

describe('CookiePolicy', () => {
  it('renders cookie usage information', () => {})
})
```

#### 5. ContactPage.test.tsx
```typescript
describe('ContactPage', () => {
  it('renders contact form', () => {})
  it('validates required fields', () => {})
  it('displays support channels', () => {})
  it('shows demo request option', () => {})
})
```

#### 6. MarketingNav.test.tsx
```typescript
describe('MarketingNav', () => {
  it('renders logo and navigation links', () => {})
  it('shows Sign In / Sign Up buttons', () => {})
  it('displays mobile hamburger menu on small screens', () => {})
  it('highlights active page', () => {})
})
```

#### 7. Component Tests
```typescript
describe('HeroSection', () => {
  it('renders headline and subheadline', () => {})
  it('displays primary and secondary CTAs', () => {})
})

describe('PricingCard', () => {
  it('renders tier name and price', () => {})
  it('displays feature list', () => {})
  it('shows CTA button', () => {})
  it('highlights most popular tier', () => {})
})

describe('FeatureCard', () => {
  it('renders icon, title, and description', () => {})
  it('contains learn more link', () => {})
})
```

---

## Implementation Phases

### Phase 1: Story & Structure (30 min) ✅ IN PROGRESS
- [x] Create MARK-001 story file
- [ ] Create marketing folder structure
- [ ] Update App.tsx routing
- [ ] Create MarketingLayout component skeleton

### Phase 2: Landing Page (2 hours)
1. **Test-First**:
   - Write LandingPage.test.tsx
   - Write HeroSection.test.tsx
   - Write FeatureCard.test.tsx
   - Run tests → RED ❌

2. **Implementation**:
   - Create MarketingNav component
   - Create HeroSection component
   - Create FeatureCard component
   - Create TestimonialCard component
   - Create CTASection component
   - Compose LandingPage
   - Run tests → GREEN ✅

3. **Refactor**:
   - Optimize component structure
   - Extract reusable styles
   - Improve accessibility
   - Run tests → GREEN ✅

### Phase 3: Pricing Page (1.5 hours)
1. **Test-First**:
   - Write PricingPage.test.tsx
   - Write PricingCard.test.tsx
   - Run tests → RED ❌

2. **Implementation**:
   - Create PricingCard component
   - Create feature comparison matrix
   - Create FAQ section component
   - Compose PricingPage
   - Run tests → GREEN ✅

3. **Refactor**:
   - Optimize pricing display
   - Improve mobile responsiveness
   - Run tests → GREEN ✅

### Phase 4: Features Page (1.5 hours)
1. **Test-First**:
   - Write FeaturesPage.test.tsx
   - Run tests → RED ❌

2. **Implementation**:
   - Create FeatureDetail component
   - Create use case examples
   - Compose FeaturesPage
   - Run tests → GREEN ✅

3. **Refactor**:
   - Improve visual hierarchy
   - Run tests → GREEN ✅

### Phase 5: Legal & About Pages (1 hour)
1. **Test-First**:
   - Write LegalPages.test.tsx
   - Write AboutPage.test.tsx
   - Run tests → RED ❌

2. **Implementation**:
   - Create TermsOfService page with comprehensive legal content
   - Create PrivacyPolicy page (GDPR-compliant)
   - Create CookiePolicy page
   - Create AboutPage
   - Run tests → GREEN ✅

### Phase 6: Contact/Support (1 hour)
1. **Test-First**:
   - Write ContactPage.test.tsx
   - Run tests → RED ❌

2. **Implementation**:
   - Create ContactForm component with validation
   - Create support info display
   - Compose ContactPage
   - Run tests → GREEN ✅

### Phase 7: SEO & Performance (1 hour)
- Add meta tags to all pages (react-helmet or manual)
- Optimize images (WebP, lazy loading)
- Implement analytics tracking hooks (placeholder for Google Analytics)
- Run Lighthouse audit (target: >90 performance, accessibility, SEO)
- Verify page load time <2 seconds

### Phase 8: Integration & Deployment (30 min)
- Update App.tsx routing for all marketing pages
- Test navigation flow: landing → pricing → sign-up
- Run full test suite (`npm test`)
- Build production bundle (`npm run build`)
- Deploy to Render
- Verify production deployment
- Update BMAD_PROGRESS_TRACKER.md

---

## Acceptance Criteria

### Must Have
- [ ] Landing page with hero, features, social proof, and CTA sections
- [ ] Pricing page displaying all 4 tiers (£279, £598, £1,598, £2,997)
- [ ] Features page with detailed descriptions of 8 core features
- [ ] Legal pages: Terms of Service, Privacy Policy, Cookie Policy (GDPR-compliant)
- [ ] About page with mission, vision, and founder story
- [ ] Contact/Support page with functional form
- [ ] Mobile-responsive design (320px to 1920px+)
- [ ] Page load time <2 seconds
- [ ] All tests passing (target: 25+ new tests)
- [ ] Lighthouse performance score >90
- [ ] SEO meta tags on all pages
- [ ] Smooth navigation between marketing and authenticated app
- [ ] Deployed to production on Render

### Should Have
- [ ] Testimonials section (placeholder content)
- [ ] Trust badges and security certifications
- [ ] Demo request functionality
- [ ] Analytics tracking implementation
- [ ] OpenGraph and Twitter card meta tags

### Nice to Have
- [ ] Animated hero section
- [ ] Interactive feature demos
- [ ] Video testimonials
- [ ] Live chat widget integration
- [ ] A/B testing setup for hero headlines

---

## Dependencies

### Internal Dependencies
- ✅ DEV-001: Project initialization complete
- ✅ DEV-002: Clerk authentication (sign-up flow must work)
- ⏳ DEV-009: Subscription & Billing (Stripe integration for pricing tiers)

### External Dependencies
- Clerk authentication (already integrated)
- Stripe (for pricing information, integration in DEV-009)
- Tailwind CSS (already configured)

---

## Risks & Mitigation

### Risk 1: Content Creation Bottleneck
**Risk**: Writing compelling marketing copy is time-consuming
**Mitigation**: Use AI-assisted copywriting; focus on clarity over perfection initially; iterate based on user feedback

### Risk 2: Design Consistency
**Risk**: Marketing pages may look disconnected from authenticated app
**Mitigation**: Use shared Tailwind config; maintain consistent color palette, typography, and spacing

### Risk 3: SEO Optimization
**Risk**: Poor SEO may limit organic discovery
**Mitigation**: Implement meta tags, semantic HTML, fast load times; plan for future SEO enhancements

### Risk 4: GDPR Compliance
**Risk**: Incomplete or non-compliant privacy policy
**Mitigation**: Use comprehensive GDPR template; include all required disclosures; plan for legal review

---

## Future Enhancements
- A/B testing for hero headlines and CTAs
- Video testimonials and product demos
- Interactive ROI calculator
- Live chat support widget
- Blog/content marketing section
- Case studies page
- Integration showcase page
- Comparison page (vs. competitors)

---

## Notes
- **Copy Tone**: Professional, confident, benefit-driven; address pain points directly (£10k+ enterprise pricing, fragmented tools)
- **Visual Style**: Modern, clean, trust-building; use professional imagery and icons
- **Conversion Focus**: Every page should have a clear CTA; guide visitors toward sign-up
- **Mobile-First**: Majority of traffic will likely be mobile; design mobile experience first

---

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tests passing (25+ new tests, 80%+ coverage)
- [ ] Code reviewed (self-review for AI developer)
- [ ] Deployed to production
- [ ] Verified in production environment
- [ ] Documentation updated (BMAD_PROGRESS_TRACKER.md)
- [ ] Story marked as complete in tracker

---

**Story Created**: 2025-10-25
**Last Updated**: 2025-10-25
**Author**: CODEX (AI Developer)
**Reviewer**: TBD
