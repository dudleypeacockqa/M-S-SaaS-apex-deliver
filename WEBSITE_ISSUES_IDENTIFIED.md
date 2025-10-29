# Website Issues Identified from Live Site Review

## Critical Issues

### 1. Pricing Page - Missing One-Off Fees
**Current:** Only shows monthly subscription fees
**Required:** Must show both subscription + one-off implementation fees

| Tier | Monthly | Annual | **ONE-OFF SETUP** |
|------|---------|--------|-------------------|
| CapLiquify FP&A | £598 | £5,976 | **£2,500** |
| Professional | £1,598 | £15,976 | **£7,500** |
| Enterprise | £2,997 | £29,964 | **£15,000** |
| Portfolio Leader | Custom | Custom | **£30,000+** |

### 2. Wrong Integrations Shown
**Current:** Xero, QuickBooks, Sage, NetSuite, Stripe, Slack
**Correct (from PRD):** Sage Intacct, Odoo, CSV imports ONLY (no bank aggregator at MVP)

### 3. Missing Pages
- [ ] FAQ page (from Buyer FAQ document)
- [ ] CapLiquify FP&A showcase page
- [ ] Sales & Pricing Module page  
- [ ] 4-Stage Cycle page (Evaluation → Pre-Deal → Post-Deal → Ongoing)
- [ ] Price comparison table page

### 4. Navigation Issues
**Current:** Flat menu (Features, Pricing, About, Contact, Team, Podcast, Security, Blog)
**Required:** FinanceFlo.ai style with dropdowns:
- Industries (dropdown)
- Solutions (dropdown) - CapLiquify FP&A, ApexDeliver M&A, Pricing Module
- Resources (dropdown) - Blog, Podcast, FAQ, ROI Calculator
- Pricing
- About
- Contact

### 5. Missing CapLiquify Context
**Not Emphasized:**
- 13-week direct cash forecasting
- DSO/DPO/DIO working capital drivers
- AR/AP roll-forwards
- PMI Finance Ops Stabilisation (Option B) - £30k package, 2-4 weeks
- Lender-ready PDF pack generation
- Multi-scenario modeling
- Inventory turns
- Sources & Uses reports

### 6. Security Page Issues
**Missing Details:**
- EU (Frankfurt) primary data residency
- USA as DR/failover only
- Schema-per-tenant isolation
- Field-level encryption with KMS
- 7-year immutable audit logs
- RTO 4h / RPO 1h
- Daily backups, 30-day retention
- Quarterly DR tests
- No third-party bank aggregator (compliance requirement)

### 7. Design Quality Issues
**Missing from FinanceFlo.ai Quality:**
- No live dashboard mockup on homepage
- No ADAPT Framework™ visual
- No stat cards showing business impact
- Generic security badges instead of specific compliance details
- No client testimonials with company logos
- Missing "Trusted by X businesses" social proof specific to M&A/PE

### 8. Homepage Issues
**Missing:**
- Live dashboard mockup showing 13-week cash flow
- Specific stats (e.g., "450+ businesses transformed", "66% cost reduction")
- ADAPT Framework section
- Client logos from PE/M&A space
- Specific value props for each persona (Portfolio CFO, Controller, PMI Lead)

### 9. Features Page Issues
**Not Organized by Module:**
Should be structured as:
1. CapLiquify FP&A (core platform)
2. ApexDeliver M&A (deal flow to PMI)
3. Sales & Pricing Module (pricing engine + customer portal)
4. Integrations (Intacct, Odoo, CSV)

### 10. Pricing Structure Confusion
**Issue:** Doesn't clearly explain the land-and-expand model:
1. Start with CapLiquify FP&A (£598/mo + £2,500 setup)
2. Expand to ApexDeliver M&A when ready
3. Add Sales & Pricing Module for growth
4. Enterprise/Portfolio for PE firms

## Rebuild Priority
1. Fix pricing page with one-off fees + comparison table
2. Create FAQ page
3. Fix integrations (remove wrong ones, show only Intacct/Odoo/CSV)
4. Rebuild homepage with live dashboard mockup
5. Create CapLiquify FP&A showcase page
6. Create 4-Stage Cycle page
7. Create Sales & Pricing Module page
8. Rebuild navigation with dropdowns
9. Update Security page with correct details
10. Reorganize Features page by module
