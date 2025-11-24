# Content Migration Plan - Old FinanceFlo Website

**Source**: https://flo-finance-uk-website.onrender.com/
**Target**: https://financeflo.ai/ (new M&A Intelligence Platform)
**Date**: 2025-11-22

---

## Migration Strategy Overview

The old FinanceFlo website focused on **AI+ERP integration** for UK mid-market businesses, while the new site focuses on **M&A Intelligence Platform**. We need to merge valuable content while maintaining the new positioning.

---

## Content Mapping

### 1. Industries Pages → Solutions Pages

**Old Site Pages**:
- `/industries/private-equity` → Private Equity industry content
- `/industries/construction` → Construction industry content
- `/industries/financial-services` → Financial Services content
- `/industries/healthcare` → Healthcare content
- `/industries/professional-services` → Professional Services content
- `/industries/manufacturing` → Manufacturing content

**Migration Strategy**:
- **Option A**: Create industry-specific landing pages under `/solutions/industries/*`
- **Option B**: Integrate industry content into existing solutions pages
- **Option C**: Create industry case studies and link from solutions pages

**Recommendation**: Option B - Enhance existing `/solutions/cfo` and `/solutions/deal-team` with industry-specific sections

### 2. ERP Solutions Pages → Integrations Section

**Old Site Pages**:
- `/erp/sage-intacct` → Sage Intacct integration guide
- `/erp/acumatica` → Acumatica integration guide
- `/erp/odoo` → Odoo integration guide
- `/erp/netsuite` → NetSuite integration guide
- `/erp/microsoft-dynamics` → Microsoft Dynamics guide
- `/erp/sap` → SAP integration guide

**Migration Strategy**:
- Create `/integrations/*` section
- Migrate ERP-specific content
- Update to reflect M&A platform context
- Link from CapLiquify FP&A page (which mentions ERP integrations)

**Action**: Create integration pages or add to existing features page

### 3. IntelliFlow AI Platform → Platform Features

**Old Site Pages**:
- `/ipaas/intelliflow` → IntelliFlow platform overview
- `/ipaas/intelliflow#demos` → Demo content
- `/ipaas/intelliflow#pricing` → Pricing info
- `/ipaas/intelliflow#success-stories` → Success stories
- `/ipaas/intelliflow#natural-language` → Natural language config
- `/ipaas/intelliflow#predictive` → Predictive intelligence

**Migration Strategy**:
- Integrate IntelliFlow concepts into platform features
- Add to `/features` page
- Reference in CapLiquify FP&A page (AI-powered features)
- Create dedicated AI features section if needed

### 4. Resources Pages

**Old Site Pages**:
- `/resources/roi-calculator` → ROI calculator tool
- `/assessment` → Free assessment form

**Migration Strategy**:
- **ROI Calculator**: Already exists in new site (`ROICalculator` component)
- **Free Assessment**: Map to `/book-trial` or `/contact`

**Action**: Verify ROI calculator accessible, update assessment flow

### 5. ADAPT Framework™ → Methodology Page

**Old Site Content**:
- 5-step methodology: Assess → Design → Automate → Pilot → Transform
- Week-by-week timeline
- Framework explanation

**Migration Strategy**:
- Create `/methodology` or `/adapt-framework` page
- Or integrate into `/4-stage-cycle` page (aligns with M&A cycle)
- Update messaging to M&A context

**Action**: Create methodology page or enhance 4-stage cycle page

### 6. Free Book Offer

**Old Site Content**:
- "Connected Intelligence" book by Dudley Peacock
- Free paperback offer with address collection
- Book content highlights

**Migration Strategy**:
- **Option A**: Keep as lead magnet on new site
- **Option B**: Convert to digital download
- **Option C**: Reference in blog/resources section

**Recommendation**: Option A - Valuable lead magnet, update form to match new site design

### 7. Testimonials & Case Studies

**Old Site Content**:
- 9 testimonials in carousel
- Featured: Ronel Mostert (Afritelecoms)
- Client logos: Afritelecoms, TMF Group, EnergyDrive Systems, Diccorv Properties, Salesforce, Mouchel

**Migration Strategy**:
- Merge with existing `EnhancedTestimonials` component
- Add new testimonials to testimonial data
- Update client logos if needed
- Ensure testimonials align with M&A positioning

**Action**: Review existing testimonials, add unique ones from old site

### 8. Contact Information

**Old Site Contact**:
- Phone: +44 7360 539147
- Email: helpdesk@financeflo.ai
- Location: London, United Kingdom

**Migration Strategy**:
- Add phone number to footer
- Update contact page with phone option
- Ensure email addresses consistent

**Action**: Update footer and contact page

---

## Redirect Mapping

### Critical Redirects (Preserve SEO)

| Old URL | New URL | Type | Priority |
|---------|---------|------|----------|
| `/industries/*` | `/solutions/*` or `/industries/*` | 301 | High |
| `/erp/*` | `/integrations/*` or `/features#erp` | 301 | High |
| `/ipaas/*` | `/features#ai` or `/platform` | 301 | Medium |
| `/resources/roi-calculator` | `/resources/roi-calculator` or `/pricing#calculator` | 301 | Medium |
| `/assessment` | `/book-trial` or `/contact` | 301 | Medium |
| `/blog?category=*` | `/blog?category=*` | 301 | Low |
| `/about` | `/about` | 301 | Low |
| `/contact` | `/contact` | 301 | Low |
| `/pricing` | `/pricing` | 301 | Low |
| `/privacy` | `/legal/privacy` | 301 | Medium |
| `/terms` | `/legal/terms` | 301 | Medium |
| `/cookies` | `/legal/cookies` | 301 | Medium |

### Implementation

**Frontend Routing** (React Router):
- Add redirect routes in `App.tsx` or routing configuration
- Use `<Navigate>` component for client-side redirects

**Server-Side** (Render):
- Configure redirects in `render.yaml` if needed
- Or use `_redirects` file for static site

---

## Content Gaps Analysis

### Content on Old Site, Missing on New Site

1. **Industries Pages** (6 pages) - Industry-specific content
2. **ERP Integration Guides** (6 pages) - Detailed ERP integration content
3. **ADAPT Framework** - Methodology page
4. **Free Book Offer** - Lead magnet
5. **Phone Number CTA** - Direct call-to-action
6. **Careers Page** - Job listings
7. **IntelliFlow Platform** - Dedicated AI platform pages

### Content on New Site, Not on Old Site

1. **M&A Deal Management** - Core new feature
2. **CapLiquify FP&A** - New product focus
3. **Sales & Promotion Pricing** - New module
4. **4-Stage M&A Cycle** - New methodology
5. **Deal Matching** - AI-powered matching
6. **Valuation Suite** - Multi-method valuations
7. **Master Admin Portal** - New admin features

---

## Migration Priority

### High Priority (Immediate)
1. **Contact Information** - Add phone number, update email
2. **Domain Consistency** - Fix all 100daysandbeyond.com references
3. **Redirect Configuration** - Set up critical redirects
4. **Testimonials Merge** - Add valuable testimonials

### Medium Priority (This Week)
1. **ERP Integration Pages** - Create `/integrations/*` section
2. **Industries Content** - Enhance solutions pages with industry focus
3. **ADAPT Framework** - Create methodology page or integrate
4. **ROI Calculator** - Verify accessibility and update

### Low Priority (Future)
1. **IntelliFlow Content** - Integrate into features
2. **Free Book Offer** - Implement as lead magnet
3. **Careers Page** - Create if needed
4. **Blog Category Migration** - Ensure blog categories align

---

## SEO Considerations

### Preserve Rankings
- Use 301 redirects for all old URLs
- Maintain canonical URLs
- Update internal links
- Preserve meta descriptions where valuable
- Update sitemap with new URLs

### Domain Migration
- Old site: `flo-finance-uk-website.onrender.com`
- New site: `financeflo.ai`
- Ensure Google Search Console updated
- Submit new sitemap
- Monitor 404 errors

---

## Implementation Steps

1. **Phase 1**: Fix domain inconsistencies (in progress)
2. **Phase 2**: Set up redirects
3. **Phase 3**: Migrate high-priority content
4. **Phase 4**: Create new pages for unique content
5. **Phase 5**: Update navigation
6. **Phase 6**: Test all redirects
7. **Phase 7**: Update sitemap
8. **Phase 8**: Verify SEO preservation

---

**Last Updated**: 2025-11-22
**Status**: Planning Complete - Ready for Execution

