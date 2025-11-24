# Legacy Site Migration Strategy

**Date**: 2025-11-22
**Legacy Site**: https://flo-finance-uk-website.onrender.com/
**New Site**: https://financeflo.ai
**Status**: Planning

---

## Migration Approach

### Phase 1: Content Analysis & Mapping (2-3 hours)

1. **Complete Site Crawl**
   - Document all pages on legacy site
   - Capture unique content, images, assets
   - Identify SEO-valuable pages

2. **Content Comparison**
   - Compare legacy content with new site
   - Identify gaps and unique content
   - Map legacy pages to new site structure

3. **Priority Assessment**
   - High: Must migrate (contact info, legal, unique content)
   - Medium: Should migrate (valuable content, SEO)
   - Low: Optional (outdated, redundant)

### Phase 2: Content Migration (8-12 hours)

#### 2.1 High Priority Content
- [ ] **Contact Information**
  - Add UK phone number (+44 7360 539147) to contact page
  - Update company registration details in footer/legal pages
  - Ensure helpdesk@financeflo.ai is used consistently

- [ ] **Legal Pages**
  - Review and merge Privacy Policy
  - Review and merge Terms of Service
  - Review and merge Cookie Policy
  - Ensure company details correct

- [ ] **Unique Pages**
  - Create/update Industry pages (6 industries)
  - Create/update ERP solution pages (6 ERP systems)
  - Create IntelliFlow AI platform page (if still relevant)
  - Create ROI Calculator page
  - Create Free Assessment page
  - Create Careers page

#### 2.2 Medium Priority Content
- [ ] **ADAPT Framework™**
  - Compare with 4-Stage Cycle
  - Decide if both should exist or merge
  - Update content accordingly

- [ ] **Free Book Offer**
  - Integrate book offer form into new site
  - Add to landing page or dedicated page
  - Connect to backend/CRM

- [ ] **Testimonials**
  - Migrate client testimonials
  - Add company logos
  - Integrate into EnhancedTestimonials component

- [ ] **Blog Content**
  - Review legacy blog posts
  - Migrate valuable posts
  - Update for new site structure

#### 2.3 Low Priority Content
- [ ] **Design Assets**
  - Extract reusable images
  - Update dashboard mockups if better
  - Archive outdated assets

### Phase 3: Redirect Strategy (1-2 hours)

**301 Redirects to Set Up:**
- `/` → `https://financeflo.ai/`
- `/pricing` → `https://financeflo.ai/pricing`
- `/industries/*` → `https://financeflo.ai/industries/*` (if pages created)
- `/erp/*` → `https://financeflo.ai/erp/*` (if pages created)
- `/blog` → `https://financeflo.ai/blog`
- `/contact` → `https://financeflo.ai/contact`
- `/about` → `https://financeflo.ai/about`
- `/privacy` → `https://financeflo.ai/legal/privacy`
- `/terms` → `https://financeflo.ai/legal/terms`
- `/cookies` → `https://financeflo.ai/legal/cookies`

**Implementation:**
- Add redirects to legacy site (if possible)
- Or configure in Render/CDN
- Update sitemap to remove legacy URLs

### Phase 4: SEO Preservation (2-3 hours)

- [ ] **Preserve SEO Value**
  - Migrate meta descriptions
  - Preserve canonical URLs
  - Update internal links
  - Submit new sitemap to Google Search Console

- [ ] **Content Updates**
  - Update domain references
  - Ensure all links point to new site
  - Update structured data

### Phase 5: Verification (1-2 hours)

- [ ] **Content Verification**
  - Verify all content migrated
  - Test all links
  - Check redirects work

- [ ] **Functionality Verification**
  - Test forms
  - Verify CTAs
  - Check mobile responsiveness

---

## Key Decisions Needed

1. **ADAPT Framework vs 4-Stage Cycle**: Keep both or merge?
2. **Industry Pages**: Create all 6 or prioritize?
3. **ERP Solution Pages**: Create all 6 or prioritize?
4. **IntelliFlow AI**: Still relevant or deprecated?
5. **Free Book Offer**: Keep or replace with different lead magnet?

---

## Estimated Time

- **Phase 1**: 2-3 hours
- **Phase 2**: 8-12 hours
- **Phase 3**: 1-2 hours
- **Phase 4**: 2-3 hours
- **Phase 5**: 1-2 hours

**Total**: 14-22 hours

---

## Success Criteria

- All high-priority content migrated
- All redirects functional
- SEO value preserved
- No broken links
- Legal pages updated with correct company info
- Contact information consistent across site

---

**Next Step**: Complete full site crawl and content mapping

