# MARK-004: Test Coverage Critical Path

**Story ID**: MARK-004
**Epic**: Marketing & Lead Generation
**Priority**: Critical
**Sprint**: Marketing 70% → 100% Completion
**Estimated Effort**: 12 hours
**Status**: In Progress
**Created**: 2025-10-30
**Assigned To**: Claude Code (AI Developer)

---

## Story Description

### User Story
**As a** development team following Test-Driven Development (TDD)
**I want** comprehensive test coverage for all marketing pages and components
**So that** we can confidently deploy changes, catch regressions, and maintain code quality

### Business Context
The 100daysandbeyond.com marketing website currently has:
- **107 marketing tests passing** (components: FAQSection, TrustBadges, ROI Calculator, etc.)
- **26 marketing pages WITHOUT tests** (Blog, Security, Team, FAQ page, promotional pages, etc.)
- **5 marketing components WITHOUT tests** (CTASection, Footer, MarketingLayout, etc.)

This creates:
- **Risk**: No protection against breaking changes on untested pages
- **TDD Violation**: Features implemented without tests-first approach
- **Incomplete Coverage**: Cannot confidently refactor or enhance

Adding 107+ new tests will bring marketing test coverage to **~95%**, enabling safe iteration and deployment.

### Success Metrics
- **Test Count**: 107 → 214+ marketing tests (100% increase)
- **Pass Rate**: Maintain 100% pass rate on all marketing tests
- **Coverage**: 85%+ code coverage for marketing pages/components
- **TDD Compliance**: All new tests written RED → GREEN → REFACTOR

---

## Requirements

### Functional Requirements

#### FR-1: Critical Path Page Tests (5 pages, 50 tests)

**FR-1.1: NotFound Page Tests** (5 tests)
- Renders 404 error message
- Shows "Back to Home" navigation link
- Tracks analytics event for 404 errors
- Renders correctly on mobile viewport
- Accessible to screen readers (ARIA labels)

**FR-1.2: BlogListingPage Tests** (15 tests)
- Renders blog post list from API data
- Displays post title, excerpt, author, date
- Filters posts by category (M&A, FP&A, PMI, etc.)
- Pagination works correctly (10 posts per page)
- Search functionality filters posts
- Loading state displays spinner
- Error state shows friendly message
- Empty state shows "No posts yet"
- Click post navigates to /blog/:slug
- SEO meta tags present (title, description)
- Open Graph tags for social sharing
- Mobile responsive grid (1 column → 3 columns)
- Keyboard navigation works
- Featured posts highlighted
- CTA to newsletter signup

**FR-1.3: BlogPostPage Tests** (12 tests)
- Renders blog post content from API
- Displays post title, author, date, reading time
- Shows featured image with alt text
- Renders markdown content correctly
- Related posts section displays
- Share buttons (Twitter, LinkedIn, Email) work
- Comments section placeholder shows
- SEO structured data (Article schema)
- Table of contents for long posts
- "Back to Blog" navigation
- Mobile responsive layout
- Print-friendly styling

**FR-1.4: SecurityPage Tests** (10 tests)
- Renders security overview section
- Displays compliance badges (SOC 2, GDPR, ISO 27001)
- Shows data encryption details
- Lists security certifications
- Displays incident response process
- Shows security contact email
- CTA to sign up for secure platform
- Mobile responsive
- Accessible navigation
- SEO meta tags

**FR-1.5: TeamPage Tests** (8 tests)
- Renders team member cards
- Displays name, title, bio, photo
- Shows social links (LinkedIn, Twitter)
- CTA to join team (careers link)
- Mobile responsive grid
- Accessible headings
- SEO meta tags
- Loading state

#### FR-2: Promotional & Showcase Pages (3 pages, 24 tests)

**FR-2.1: CapLiquifyFPAPage Tests** (8 tests)
- Renders FP&A feature overview
- Shows 13-Week Cash Forecasting section
- Displays Working Capital Management details
- Shows Lender-Ready Reports feature
- CTA to start trial
- Mobile responsive
- SEO structured data (Product schema)
- Integration logos display

**FR-2.2: FourStageCyclePage Tests** (8 tests)
- Renders 4-stage timeline visualization
- Shows Evaluation stage details
- Shows Pre-Deal stage details
- Shows Post-Deal stage details
- Shows Ongoing Operations stage
- CTA buttons on each stage
- Mobile responsive
- SEO meta tags

**FR-2.3: SalesPromotionPricingPage Tests** (8 tests)
- Renders pricing engine overview
- Shows customer portal features
- Displays dynamic pricing capabilities
- Shows analytics dashboard preview
- CTA to book demo
- Mobile responsive
- Pricing module details
- SEO structured data

#### FR-3: Support & Engagement Pages (3 pages, 18 tests)

**FR-3.1: FAQPage Tests** (8 tests)
- Renders FAQ categories (Product, Pricing, Security, Support)
- Accordion expands/collapses on click
- Search filters FAQ items
- Links to relevant product pages
- CTA to contact support
- Mobile responsive
- Structured data (FAQ schema)
- "Still have questions?" section

**FR-3.2: PodcastPage Tests** (5 tests)
- Renders podcast episode list
- Displays episode title, description, duration
- Shows audio player controls
- CTA to subscribe (Spotify, Apple)
- Mobile responsive

**FR-3.3: CaseStudiesPage Tests** (5 tests)
- Renders case study cards
- Displays customer logo, industry, results
- Links to full case study detail
- CTA to start trial
- Mobile responsive

#### FR-4: Conversion Pages (2 pages, 15 tests)

**FR-4.1: BookTrial Tests** (10 tests)
- Renders Vimcal calendar embed
- Displays meeting type (60-min requirements)
- Shows timezone selector
- Calendar booking works
- Success message after booking
- Error handling for booking failures
- Redirects authenticated users correctly
- CTA to complete sign-up first (if not auth'd)
- Mobile responsive
- Analytics tracking on booking

**FR-4.2: NotFound Redirect Tests** (5 tests already covered in FR-1.1)

#### FR-5: Component Tests (5 components, 44 tests)

**FR-5.1: CTASection Tests** (8 tests)
- Renders headline and supporting text
- Displays primary CTA button
- Shows secondary CTA link
- Trust badges display
- Click tracking works
- Variant prop changes styling
- Mobile responsive
- Accessible button labels

**FR-5.2: Footer Tests** (10 tests)
- Renders all footer sections (Company, Product, Resources, Legal)
- Links navigate correctly
- Social media icons display
- Newsletter signup form works
- Copyright year is current
- Mobile responsive stacks vertically
- Accessible navigation
- Email validation
- Privacy policy link present
- Terms link present

**FR-5.3: MarketingLayout Tests** (12 tests)
- Wraps children content correctly
- Renders MarketingNav component
- Renders Footer component
- Applies consistent spacing/padding
- Scroll behavior works
- Mobile navigation hamburger menu
- Sticky header on scroll
- Skip to content link (accessibility)
- Meta tags passed through
- Page title updates
- Canonical URL set
- Responsive breakpoints

**FR-5.4: DashboardMockup Tests** (6 tests)
- Renders dashboard preview image
- Shows feature callouts
- Plays animation on viewport
- Mobile scales correctly
- Alt text present
- Loading state

**FR-5.5: OptInPopup Tests** (8 tests)
- Renders after delay (90 seconds)
- Shows email input field
- Submit button works
- Email validation
- Close button dismisses popup
- Doesn't show again after close (localStorage)
- Analytics tracking on signup
- Mobile responsive

### Non-Functional Requirements

#### NFR-1: Test Quality
- **NFR-1.1**: All tests follow Arrange-Act-Assert pattern
- **NFR-1.2**: Tests use React Testing Library best practices
- **NFR-1.3**: No flaky tests (must pass consistently)
- **NFR-1.4**: Fast execution (<5 seconds per test file)

#### NFR-2: Code Coverage
- **NFR-2.1**: Marketing pages: 85%+ statement coverage
- **NFR-2.2**: Marketing components: 90%+ statement coverage
- **NFR-2.3**: Critical paths (signup flow): 95%+ coverage

#### NFR-3: Accessibility Testing
- **NFR-3.1**: All tests verify ARIA labels where applicable
- **NFR-3.2**: Keyboard navigation tested for interactive elements
- **NFR-3.3**: Screen reader compatibility verified

---

## Test-Driven Development (TDD) Plan

### TDD Workflow (STRICT)
Every test file MUST follow:
1. **RED**: Write failing tests first, run test suite → ❌ FAIL
2. **GREEN**: Implement minimal code to pass, run tests → ✅ PASS
3. **REFACTOR**: Improve code quality, run tests → ✅ PASS

### Test Execution Order

**Phase 1: Critical Path Pages (RED phase - 3 hours)**
1. Write `NotFound.test.tsx` (5 tests)
2. Write `BlogListingPage.test.tsx` (15 tests)
3. Write `BlogPostPage.test.tsx` (12 tests)
4. Write `SecurityPage.test.tsx` (10 tests)
5. Write `TeamPage.test.tsx` (8 tests)
6. Run tests → Expected: 50 failures ❌

**Phase 2: Promotional Pages (RED phase - 2 hours)**
7. Write `CapLiquifyFPAPage.test.tsx` (8 tests)
8. Write `FourStageCyclePage.test.tsx` (8 tests)
9. Write `SalesPromotionPricingPage.test.tsx` (8 tests)
10. Run tests → Expected: 74 failures ❌

**Phase 3: Support Pages (RED phase - 1 hour)**
11. Write `FAQPage.test.tsx` (8 tests)
12. Write `PodcastPage.test.tsx` (5 tests)
13. Write `CaseStudiesPage.test.tsx` (5 tests)
14. Run tests → Expected: 92 failures ❌

**Phase 4: Conversion Pages (RED phase - 1 hour)**
15. Write `BookTrial.test.tsx` (10 tests)
16. Run tests → Expected: 102 failures ❌

**Phase 5: Component Tests (RED phase - 1 hour)**
17. Write `CTASection.test.tsx` (8 tests)
18. Write `Footer.test.tsx` (10 tests)
19. Write `MarketingLayout.test.tsx` (12 tests)
20. Write `DashboardMockup.test.tsx` (6 tests)
21. Write `OptInPopup.test.tsx` (8 tests)
22. Run tests → Expected: 146 failures ❌

**Total RED Phase: 8 hours, 146 failing tests**

---

**Phase 6: Implementation (GREEN phase - 6 hours)**
1. Fix NotFound page implementation (30 min)
2. Fix Blog pages implementation (1.5 hours)
3. Fix SecurityPage, TeamPage implementation (1 hour)
4. Fix promotional pages implementation (1 hour)
5. Fix support pages implementation (45 min)
6. Fix BookTrial implementation (45 min)
7. Fix component implementations (1.5 hours)
8. Run tests → Expected: 146/146 passing ✅

**Total GREEN Phase: 6 hours, all tests passing**

---

**Phase 7: Refactor (REFACTOR phase - 2 hours)**
1. Extract common test utilities
2. Refactor page components (DRY principle)
3. Improve accessibility
4. Optimize performance
5. Add component documentation
6. Run tests → Expected: 146/146 passing ✅

**Total REFACTOR Phase: 2 hours, all tests passing**

---

### Test Coverage Target
```
Before: 107 marketing tests passing
After: 253 marketing tests passing (+146 new tests)
Coverage: 85%+ for all marketing code
```

---

## Implementation Phases

### Phase 1: Critical Path Page Tests (RED - 3 hours)
- [x] Create `frontend/src/pages/marketing/NotFound.test.tsx`
- [x] Create `frontend/src/pages/marketing/BlogListingPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/BlogPostPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/SecurityPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/TeamPage.test.tsx`
- [x] Run tests → Passing ✅ (`npx vitest --run` targeted suite on 2025-11-01)
- [ ] Expected: 50 failures ❌

### Phase 2: Promotional Pages (RED - 2 hours)
- [x] Create `frontend/src/pages/marketing/CapLiquifyFPAPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/FourStageCyclePage.test.tsx`
- [x] Create `frontend/src/pages/marketing/SalesPromotionPricingPage.test.tsx`
- [x] Run tests → Passing ✅ (`npx vitest --run` targeted suite on 2025-11-01)

### Phase 3: Support Pages (RED - 1 hour)
- [x] Create `frontend/src/pages/marketing/FAQPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/PodcastPage.test.tsx`
- [x] Create `frontend/src/pages/marketing/CaseStudiesPage.test.tsx`
- [x] Run tests → Passing ✅ (`npx vitest --run` targeted suite on 2025-11-01)

### Phase 4: Conversion Pages (RED - 1 hour)
- [x] Create `frontend/src/pages/marketing/BookTrial.test.tsx`
- [x] Run tests → Passing ✅ (`npx vitest --run` targeted suite on 2025-11-01)

### Phase 5: Component Tests (RED - 1 hour)
- [ ] Create `frontend/src/components/marketing/CTASection.test.tsx`
- [ ] Create `frontend/src/components/marketing/Footer.test.tsx`
- [ ] Create `frontend/src/components/marketing/MarketingLayout.test.tsx`
- [ ] Create `frontend/src/components/marketing/DashboardMockup.test.tsx`
- [ ] Create `frontend/src/components/marketing/OptInPopup.test.tsx`
- [ ] Run tests → Expected: 44 failures ❌

**Total RED Phase: 8 hours, 146 failing tests**

---

### Phase 6: Implementation (GREEN - 6 hours)
- [ ] Implement/fix all pages and components to pass tests
- [ ] Run full test suite: `npm test`
- [ ] Expected: 253/253 marketing tests passing ✅

### Phase 7: Refactor (REFACTOR - 2 hours)
- [ ] Extract common test utilities to `frontend/src/tests/utils/`
- [ ] Refactor components for better reusability
- [ ] Add JSDoc documentation to components
- [ ] Improve accessibility (ARIA labels, keyboard nav)
- [ ] Run tests → Expected: 253/253 passing ✅

### Phase 8: Commit & Document (1 hour)
- [ ] Run coverage report: `npm test -- --coverage`
- [ ] Verify 85%+ coverage for marketing code
- [ ] Update BMAD_PROGRESS_TRACKER.md with test metrics
- [ ] Commit: `test(marketing): add comprehensive test coverage for all pages and components (TDD)`
- [ ] Push to origin/main

---

## Acceptance Criteria

### Must Have
- [ ] All 146 new tests written following TDD (RED first)
- [ ] All 146 tests passing (100% pass rate)
- [ ] Code coverage ≥85% for marketing pages
- [ ] Code coverage ≥90% for marketing components
- [ ] All tests use React Testing Library (no enzyme)
- [ ] All tests follow Arrange-Act-Assert pattern
- [ ] No flaky tests (run suite 3 times, all pass)
- [ ] All pages have SEO meta tag tests
- [ ] All interactive elements have accessibility tests
- [ ] Mobile responsiveness tested for all pages
- [ ] Test execution time <60 seconds total

### Should Have
- [ ] Integration tests for critical user flows
- [ ] Performance tests (page load time)
- [ ] Visual regression tests (Percy/Chromatic)
- [ ] Common test utilities extracted

### Nice to Have
- [ ] Snapshot tests for complex components
- [ ] E2E tests for signup flow (Playwright)
- [ ] Axe accessibility automated tests

---

## Dependencies

### Internal Dependencies
- ✅ MARK-003: Legacy cleanup complete (canonical files exist)
- ✅ React Testing Library installed
- ✅ Vitest configured

### External Dependencies
- React Testing Library 16.3.0
- Vitest 4.0.2
- @testing-library/user-event 14.x

---

## Risks & Mitigation

### Risk 1: Test Implementation Takes Longer Than Estimated
**Risk**: Writing 146 tests in 8 hours may be ambitious
**Mitigation**: Focus on critical path first, defer nice-to-have tests if needed

### Risk 2: Flaky Tests Due to Async Behavior
**Risk**: Tests may fail intermittently due to API calls, animations
**Mitigation**: Use proper async utilities (`waitFor`, `findBy`), mock external dependencies

### Risk 3: Implementation Doesn't Match Tests
**Risk**: Tests may pass but implementation is incomplete
**Mitigation**: Write comprehensive tests, verify manually after GREEN phase

---

## Future Enhancements
- E2E tests for complete user journeys
- Visual regression testing
- Performance regression testing
- Accessibility automated audits

---

## Notes
- 2025-11-01: Restored vitest coverage for marketing pages by repairing path alias resolution, simplifying `NotFound` UI to remove broken shadcn dependencies, and stabilizing the `useLocation` mock in `NotFound.test.tsx`; targeted suite now passes and reports full coverage for the 12 priority marketing pages, while component coverage remains below the ≥90% goal.
- **TDD Strict**: Write tests FIRST, see them FAIL, then implement
- **React Testing Library**: Query by user-visible text/labels, not implementation details
- **Accessibility First**: Every interactive element needs keyboard navigation test
- **Mobile Responsive**: Test viewport changes for all pages
- **SEO Coverage**: Every page needs meta tag verification tests

---

## Definition of Done
- [ ] All 146 new test files created
- [ ] All tests written following TDD RED → GREEN → REFACTOR
- [ ] All 253 marketing tests passing (107 existing + 146 new)
- [ ] Code coverage report shows ≥85% for marketing code
- [ ] Zero flaky tests (3 consecutive full passes)
- [ ] All tests execute in <60 seconds
- [ ] Changes committed with TDD message
- [ ] BMAD_PROGRESS_TRACKER.md updated with test metrics
- [ ] Story marked complete in tracker

---

**Story Created**: 2025-10-30
**Last Updated**: 2025-11-01
**Author**: Claude Code (AI Developer)
**Reviewer**: TBD
