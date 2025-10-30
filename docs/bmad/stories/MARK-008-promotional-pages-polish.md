# MARK-008: Promotional Pages Polish & Interactivity

**Story ID**: MARK-008
**Epic**: Marketing & Lead Generation
**Priority**: Medium
**Sprint**: Marketing 70% → 100% Completion
**Estimated Effort**: 6 hours
**Status**: Pending
**Created**: 2025-10-30
**Assigned To**: Claude Code (AI Developer)

---

## Story Description

### User Story
**As a** prospective customer exploring specific features of 100daysandbeyond.com
**I want** interactive, visually engaging promotional pages for each major product module
**So that** I can deeply understand the product capabilities and visualize how it solves my problems

### Business Context
The website has 3 showcase/promotional pages that describe key product modules:
- ✅ CapLiquifyFPAPage - FP&A and cash forecasting features
- ✅ FourStageCyclePage - M&A lifecycle visualization
- ✅ SalesPromotionPricingPage - Dynamic pricing engine features

However, these pages are currently:
- **Static content** - just text and lists, no interactivity
- **No visuals** - missing product screenshots, diagrams, mockups
- **Generic** - could describe any product, not specific to our platform
- **Low conversion** - no compelling CTAs or social proof

Polishing these pages with:
- **Interactive demos** (calculator, timeline, pricing simulator)
- **Product screenshots** (actual dashboard views)
- **Visual diagrams** (workflow charts, process flows)
- **Customer testimonials** specific to each feature

...can increase feature page conversion by **30-50%** (industry benchmark).

### Success Metrics
- Each page includes at least 1 interactive element
- Each page has 3+ product screenshots
- Each page has at least 1 customer testimonial
- Time on page increases by 40% (from 60s to 84s average)
- Feature-to-trial conversion rate increases by 25%

---

## Requirements

### CapLiquify FP&A Page Enhancements

#### FR-1.1: Interactive 13-Week Cash Forecasting Calculator
- **FR-1.1.1**: Build simple cash flow calculator widget:
  - Input: Starting cash, weekly revenue, weekly expenses
  - Output: 13-week cash forecast chart
  - Visualization: Line chart showing cash balance over time
  - Warning: Highlight weeks where cash goes negative
- **FR-1.1.2**: Add "Try It" call-to-action after calculation
- **FR-1.1.3**: Track calculator usage in analytics

#### FR-1.2: Working Capital Drivers Diagram
- **FR-1.2.1**: Create visual diagram showing:
  - Inventory management
  - Accounts receivable optimization
  - Accounts payable management
  - Cash conversion cycle
- **FR-1.2.2**: Add hover effects explaining each driver
- **FR-1.2.3**: Link each driver to case study example

#### FR-1.3: Product Screenshots
- **FR-1.3.1**: Screenshot 1: Cash forecasting dashboard
- **FR-1.3.2**: Screenshot 2: Working capital analysis view
- **FR-1.3.3**: Screenshot 3: Lender-ready report export
- **FR-1.3.4**: Add annotations/callouts to screenshots

#### FR-1.4: Feature-Specific Testimonial
- **FR-1.4.1**: Add Sarah Reynolds (CFO) testimonial from MARK-007 case study
- **FR-1.4.2**: Highlight "20 hours/week saved" metric
- **FR-1.4.3**: Link to full case study

---

### Four Stage Cycle Page Enhancements

#### FR-2.1: Interactive Timeline Visualization
- **FR-2.1.1**: Build animated timeline component:
  - Stage 1: Evaluation (0-90 days)
  - Stage 2: Pre-Deal (90-180 days)
  - Stage 3: Post-Deal (180-270 days)
  - Stage 4: Ongoing Operations (270+ days)
- **FR-2.1.2**: Click each stage to expand details
- **FR-2.1.3**: Show key activities and milestones per stage
- **FR-2.1.4**: Add progress indicator animation

#### FR-2.2: Process Flow Diagram
- **FR-2.2.1**: Create visual flowchart showing:
  - Deal sourcing → screening → due diligence → valuation → closing
  - Integration planning → execution → monitoring → optimization
- **FR-2.2.2**: Highlight platform touchpoints in each step
- **FR-2.2.3**: Add icons for each activity

#### FR-2.3: Product Screenshots
- **FR-2.3.1**: Screenshot 1: Deal pipeline Kanban view
- **FR-2.3.2**: Screenshot 2: Due diligence document room
- **FR-2.3.3**: Screenshot 3: PMI task management dashboard
- **FR-2.3.4**: Add annotations showing key features

#### FR-2.4: Feature-Specific Testimonial
- **FR-2.4.1**: Add Emma Thompson (VP Operations) testimonial from MARK-007
- **FR-2.4.2**: Highlight "60% to 90% success rate" metric
- **FR-2.4.3**: Link to full case study

---

### Sales & Promotion Pricing Page Enhancements

#### FR-3.1: Dynamic Pricing Simulator
- **FR-3.1.1**: Build pricing calculator widget:
  - Input: Base price, discount %, quantity tiers
  - Output: Final price calculation
  - Visualization: Tiered pricing chart
  - Use case: Show how dynamic pricing increases revenue
- **FR-3.1.2**: Add example scenarios (seasonal discount, volume discount, bundle pricing)
- **FR-3.1.3**: Add "See It In Action" CTA

#### FR-3.2: Customer Portal Mockup
- **FR-3.2.1**: Create visual mockup of customer portal interface:
  - Product catalog with pricing
  - Shopping cart
  - Checkout flow
  - Order history
- **FR-3.2.2**: Add hover effects to show interactivity
- **FR-3.2.3**: Annotate key features (real-time pricing, approval workflows)

#### FR-3.3: Pricing Analytics Dashboard Preview
- **FR-3.3.1**: Screenshot of analytics dashboard showing:
  - Revenue by pricing tier
  - Discount effectiveness
  - Price elasticity analysis
  - Customer segment pricing performance
- **FR-3.3.2**: Add callouts explaining each metric
- **FR-3.3.3**: Show how data drives pricing decisions

#### FR-3.4: Product Screenshots
- **FR-3.4.1**: Screenshot 1: Pricing rule engine configuration
- **FR-3.4.2**: Screenshot 2: Customer portal product catalog
- **FR-3.4.3**: Screenshot 3: Approval workflow dashboard
- **FR-3.4.4**: Add annotations and callouts

#### FR-3.5: Feature-Specific Testimonial
- **FR-3.5.1**: Add testimonial from pricing module user (create new or repurpose)
- **FR-3.5.2**: Highlight revenue increase metric
- **FR-3.5.3**: Link to case study or trial signup

---

### Shared Enhancements (All 3 Pages)

#### FR-4.1: Page Structure Improvements
- **FR-4.1.1**: Add hero section with:
  - Compelling headline
  - Subheadline explaining value prop
  - Primary CTA (Start Free Trial)
  - Hero visual (product screenshot or illustration)

- **FR-4.1.2**: Add "Key Benefits" section with icon + text blocks
- **FR-4.1.3**: Add "How It Works" section with step-by-step process
- **FR-4.1.4**: Add "Who It's For" section with persona descriptions
- **FR-4.1.5**: Add testimonial section (feature-specific)
- **FR-4.1.6**: Add pricing callout (pricing card with CTA)
- **FR-4.1.7**: Add final CTA section at bottom

#### FR-4.2: Navigation & Cross-Linking
- **FR-4.2.1**: Add breadcrumbs (Home → Features → [Page])
- **FR-4.2.2**: Add "Related Features" section linking to other pages
- **FR-4.2.3**: Add "Next Steps" section with CTAs (trial, demo, contact)

#### FR-4.3: SEO Optimization
- **FR-4.3.1**: Add unique title tags (60 chars max)
- **FR-4.3.2**: Add unique meta descriptions (160 chars max)
- **FR-4.3.3**: Add Open Graph tags for social sharing
- **FR-4.3.4**: Add Product structured data (JSON-LD)

---

## Technical Design

### Interactive Components

**Cash Flow Calculator Component**:
```typescript
// frontend/src/components/marketing/CashFlowCalculator.tsx
export const CashFlowCalculator: React.FC = () => {
  const [startingCash, setStartingCash] = useState(100000);
  const [weeklyRevenue, setWeeklyRevenue] = useState(50000);
  const [weeklyExpenses, setWeeklyExpenses] = useState(40000);
  const [forecast, setForecast] = useState<number[]>([]);

  const calculate = () => {
    const weeks = 13;
    const cashFlow: number[] = [startingCash];
    for (let i = 1; i <= weeks; i++) {
      const previousCash = cashFlow[i - 1];
      const netCash = previousCash + weeklyRevenue - weeklyExpenses;
      cashFlow.push(netCash);
    }
    setForecast(cashFlow);
  };

  return (
    <div className="calculator-widget bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">13-Week Cash Forecast Calculator</h3>

      <div className="inputs space-y-4">
        <Input
          label="Starting Cash"
          value={startingCash}
          onChange={(e) => setStartingCash(Number(e.target.value))}
        />
        <Input
          label="Weekly Revenue"
          value={weeklyRevenue}
          onChange={(e) => setWeeklyRevenue(Number(e.target.value))}
        />
        <Input
          label="Weekly Expenses"
          value={weeklyExpenses}
          onChange={(e) => setWeeklyExpenses(Number(e.target.value))}
        />
      </div>

      <button onClick={calculate} className="btn-primary mt-4">
        Calculate Forecast
      </button>

      {forecast.length > 0 && (
        <div className="results mt-6">
          <LineChart data={forecast} />
          <p className="text-sm text-gray-600 mt-2">
            {forecast.some((v) => v < 0)
              ? "⚠️ Warning: Cash goes negative in week X"
              : "✅ Cash remains positive throughout forecast"}
          </p>
        </div>
      )}

      <div className="cta mt-6">
        <p className="text-sm mb-2">
          Want automated forecasting with real-time updates?
        </p>
        <button className="btn-secondary">Start Free Trial</button>
      </div>
    </div>
  );
};
```

**Timeline Component**:
```typescript
// frontend/src/components/marketing/InteractiveTimeline.tsx
export const InteractiveTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      title: "Stage 1: Evaluation",
      duration: "0-90 days",
      activities: ["Deal sourcing", "Screening", "Initial analysis"],
    },
    // ... other stages
  ];

  return (
    <div className="timeline">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`stage ${activeStage === stage.id ? "active" : ""}`}
          onClick={() => setActiveStage(stage.id)}
        >
          <h4>{stage.title}</h4>
          <p>{stage.duration}</p>
          {activeStage === stage.id && (
            <ul className="activities">
              {stage.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## Test-Driven Development (TDD) Plan

### Tests

```typescript
// frontend/src/pages/marketing/CapLiquifyFPAPage.test.tsx
describe('CapLiquifyFPAPage', () => {
  it('renders page title and hero section', () => {
    render(<CapLiquifyFPAPage />);
    expect(screen.getByText(/capliquify fp&a/i)).toBeInTheDocument();
  });

  it('displays cash flow calculator widget', () => {
    render(<CapLiquifyFPAPage />);
    expect(screen.getByText(/13-week cash forecast calculator/i)).toBeInTheDocument();
  });

  it('shows working capital drivers diagram', () => {
    render(<CapLiquifyFPAPage />);
    expect(screen.getByText(/working capital drivers/i)).toBeInTheDocument();
  });

  it('renders product screenshots with annotations', () => {
    render(<CapLiquifyFPAPage />);
    const screenshots = screen.getAllByRole('img', { name: /screenshot/i });
    expect(screenshots.length).toBeGreaterThanOrEqual(3);
  });

  it('displays customer testimonial', () => {
    render(<CapLiquifyFPAPage />);
    expect(screen.getByText(/sarah reynolds/i)).toBeInTheDocument();
  });

  it('includes CTA buttons', () => {
    render(<CapLiquifyFPAPage />);
    expect(screen.getAllByText(/start free trial/i).length).toBeGreaterThan(0);
  });

  it('has SEO meta tags', () => {
    render(<CapLiquifyFPAPage />);
    // Verify meta tags via SEO component
  });
});

// Similar tests for FourStageCyclePage and SalesPromotionPricingPage
```

### Component Tests

```typescript
// frontend/src/components/marketing/CashFlowCalculator.test.tsx
describe('CashFlowCalculator', () => {
  it('renders input fields for starting cash, revenue, expenses', () => {
    render(<CashFlowCalculator />);
    expect(screen.getByLabelText(/starting cash/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly revenue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly expenses/i)).toBeInTheDocument();
  });

  it('calculates 13-week forecast when button clicked', () => {
    render(<CashFlowCalculator />);

    fireEvent.change(screen.getByLabelText(/starting cash/i), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText(/weekly revenue/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/weekly expenses/i), { target: { value: '40000' } });

    fireEvent.click(screen.getByText(/calculate forecast/i));

    await waitFor(() => {
      expect(screen.getByText(/cash remains positive/i)).toBeInTheDocument();
    });
  });

  it('shows warning when cash goes negative', () => {
    render(<CashFlowCalculator />);

    fireEvent.change(screen.getByLabelText(/starting cash/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/weekly revenue/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/weekly expenses/i), { target: { value: '10000' } });

    fireEvent.click(screen.getByText(/calculate forecast/i));

    await waitFor(() => {
      expect(screen.getByText(/warning.*negative/i)).toBeInTheDocument();
    });
  });

  it('includes CTA after calculation', () => {
    render(<CashFlowCalculator />);
    fireEvent.click(screen.getByText(/calculate forecast/i));

    await waitFor(() => {
      expect(screen.getByText(/start free trial/i)).toBeInTheDocument();
    });
  });
});
```

---

## Implementation Phases

### Phase 1: CapLiquify FP&A Page (2 hours)
- [ ] Build CashFlowCalculator component with chart
- [ ] Create working capital drivers diagram
- [ ] Add 3 product screenshots with annotations
- [ ] Add Sarah Reynolds testimonial
- [ ] Update page structure with hero, benefits, how it works sections
- [ ] Add SEO meta tags
- [ ] Write 8 tests (page + component)

### Phase 2: Four Stage Cycle Page (2 hours)
- [ ] Build InteractiveTimeline component
- [ ] Create process flow diagram
- [ ] Add 3 product screenshots with annotations
- [ ] Add Emma Thompson testimonial
- [ ] Update page structure
- [ ] Add SEO meta tags
- [ ] Write 8 tests

### Phase 3: Sales & Promotion Pricing Page (2 hours)
- [ ] Build DynamicPricingSimulator component
- [ ] Create customer portal mockup
- [ ] Add analytics dashboard preview screenshot
- [ ] Add 3 product screenshots
- [ ] Add pricing module testimonial
- [ ] Update page structure
- [ ] Add SEO meta tags
- [ ] Write 8 tests

### Phase 4: Testing & Polish (1 hour)
- [ ] Run all 24+ tests
- [ ] Verify interactive elements work on mobile
- [ ] Verify CTAs tracked in analytics
- [ ] Test cross-linking between pages
- [ ] Verify SEO meta tags
- [ ] Deploy to production

---

## Acceptance Criteria

### Must Have
- [ ] CapLiquify FP&A Page:
  - Interactive cash flow calculator with chart
  - Working capital drivers diagram
  - 3 product screenshots with annotations
  - Customer testimonial
  - 8 tests passing

- [ ] Four Stage Cycle Page:
  - Interactive timeline component
  - Process flow diagram
  - 3 product screenshots
  - Customer testimonial
  - 8 tests passing

- [ ] Sales & Promotion Pricing Page:
  - Dynamic pricing simulator
  - Customer portal mockup
  - Analytics dashboard preview
  - 3 product screenshots
  - Customer testimonial
  - 8 tests passing

- [ ] All 3 Pages:
  - Hero section with CTA
  - Key benefits section
  - How it works section
  - Testimonial section
  - Final CTA section
  - SEO meta tags
  - Open Graph tags
  - Product structured data

### Should Have
- [ ] Interactive elements mobile-responsive
- [ ] Breadcrumb navigation
- [ ] Related features cross-linking
- [ ] Analytics tracking on interactions

### Nice to Have
- [ ] Video demos embedded
- [ ] PDF downloads (feature guides)
- [ ] Live product tours

---

## Dependencies

### Internal Dependencies
- ✅ CapLiquifyFPAPage exists (needs polish)
- ✅ FourStageCyclePage exists (needs polish)
- ✅ SalesPromotionPricingPage exists (needs polish)
- ⏳ MARK-007: Case studies (for testimonials)

### External Dependencies
- Product screenshots (capture from platform)
- Diagram creation tools (Figma, Lucidchart)
- Chart library (Recharts, Chart.js)

---

## Risks & Mitigation

### Risk 1: Interactive Components Take Too Long
**Risk**: Building calculators/simulators may exceed 6 hours
**Mitigation**: Build simple MVP versions first, defer advanced features

### Risk 2: Product Screenshots Not Ready
**Risk**: Platform features may not be fully implemented for screenshots
**Mitigation**: Use mockups or wireframes temporarily; update when features complete

### Risk 3: Interactive Elements Don't Work on Mobile
**Risk**: Touch interactions may not work properly
**Mitigation**: Test on mobile devices; use touch-friendly UI patterns

---

## Future Enhancements
- Video demos and tutorials
- Live product tours (Appcues, Intercom)
- A/B testing for CTAs
- Chatbot for feature questions
- Downloadable feature PDFs

---

## Notes
- **Focus on Value**: Every interactive element must show value, not just "coolness"
- **Keep It Simple**: MVP versions of calculators - don't over-engineer
- **Mobile First**: Test all interactions on mobile devices
- **Analytics**: Track all calculator/simulator usage

---

## Definition of Done
- [ ] All 3 pages polished with interactive elements
- [ ] Each page has 1+ interactive widget
- [ ] Each page has 3+ product screenshots
- [ ] Each page has customer testimonial
- [ ] 24+ tests passing (8 per page)
- [ ] All pages have SEO meta tags and structured data
- [ ] Interactive elements work on mobile
- [ ] Analytics tracking implemented
- [ ] Changes committed with promotional pages message
- [ ] BMAD_PROGRESS_TRACKER.md updated
- [ ] Story marked complete in tracker

---

**Story Created**: 2025-10-30
**Last Updated**: 2025-10-30
**Author**: Claude Code (AI Developer)
**Reviewer**: TBD
