# TDD Execution Plan - 100% Completion (2025-11-22)

**Methodology**: BMAD-method + TDD (RED → GREEN → REFACTOR)  
**Objective**: Reach 100% validated completion autonomously  
**Approach**: Write failing tests first, implement fixes, measure results, decide next steps

---

## Phase 1: SEO Metadata Standardization (TDD)

### RED: Write Failing Tests
1. Create test: `frontend/src/pages/marketing/__tests__/seo-metadata-consistency.test.tsx`
   - Assert all pricing sub-pages use consistent canonical URLs
   - Verify OG tags match canonical strategy
   - Check structured data URLs are consistent

### GREEN: Implement Fixes
2. Update pricing sub-pages to use consistent domain strategy
3. Ensure all SEO metadata follows same pattern

### REFACTOR: Clean Up
4. Extract domain constants to shared config
5. Update SEO component to use constants

---

## Phase 2: Sitemap & Robots.txt Validation (TDD)

### RED: Write Failing Tests
1. Create test: `frontend/src/__tests__/sitemap-validation.test.ts`
   - Verify sitemap.xml includes all marketing pages
   - Check robots.txt references correct sitemap URL
   - Validate XML structure

### GREEN: Implement Fixes
2. Update sitemap generation to include all pages
3. Verify robots.txt configuration

### REFACTOR: Document
4. Create validation guide with test results

---

## Phase 3: Newsletter Integration Verification (TDD)

### RED: Write Failing Tests
1. Create integration test: `frontend/src/services/__tests__/newsletterService.integration.test.ts`
   - Verify newsletter service calls correct endpoint
   - Test error handling
   - Verify success responses

### GREEN: Verify Implementation
2. Confirm backend endpoint works
3. Test frontend integration

### REFACTOR: Add Error Handling
4. Improve error messages and user feedback

---

## Phase 4: Mobile Navigation Polish (TDD)

### RED: Write Failing Tests
1. Create test: `frontend/src/components/marketing/__tests__/MarketingNav.mobile.test.tsx`
   - Test mobile dropdown animations
   - Verify focus traps
   - Check keyboard navigation

### GREEN: Implement Features
2. Add slide/fade animations
3. Implement focus traps
4. Add keyboard navigation support

### REFACTOR: Optimize
5. Improve performance and accessibility

---

## Phase 5: Sticky CTA / ROI Widgets (TDD)

### RED: Write Failing Tests
1. Create test: `frontend/src/components/marketing/__tests__/StickyCTABar.scroll.test.tsx`
   - Test sticky behavior on scroll
   - Verify ROI data display
   - Check CTA functionality

### GREEN: Implement Features
2. Add sticky CTA component
3. Integrate ROI/benchmark data
4. Wire up CTA actions

### REFACTOR: Polish
5. Improve animations and UX

---

## Phase 6: Evidence Collection Execution

### Master Admin CRUD
1. Generate Clerk sign-in token
2. Execute `scripts/exercise-master-admin-crud.mjs`
3. Capture evidence in `docs/testing/master-admin/2025-11-21/crud-evidence/`

### BlogAdmin Proof
1. Start preview server
2. Execute `scripts/capture-blogadmin-proof.mjs`
3. Archive screenshots and evidence

### Lighthouse/Axe Audits
1. Start preview server or access production
2. Execute `scripts/run-lighthouse-axe.mjs`
3. Archive reports

### SEO Validation
1. Run automated validation tools
2. Document results
3. Fix any issues found

---

## Execution Order

1. **SEO Metadata** (can be done immediately)
2. **Sitemap/Robots Validation** (can be done immediately)
3. **Newsletter Integration** (verify existing implementation)
4. **Mobile Nav** (requires UI work)
5. **Sticky CTA** (requires UI work)
6. **Evidence Collection** (requires credentials/servers)

---

**Status**: Ready to execute  
**Next Step**: Begin Phase 1 - SEO Metadata Standardization

