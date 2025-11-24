# FinanceFlo.ai Homepage Redesign Prompts

**Version**: 1.0  
**Date**: November 24, 2025  
**Purpose**: Detailed prompts for AI-assisted development of the FinanceFlo.ai homepage

---

## Overview

This document provides comprehensive, copy-paste-ready prompts for building each section of the FinanceFlo.ai homepage. Each prompt includes context, requirements, specifications, and expected output.

The homepage is designed to convert visitors into leads through clear value communication, social proof, and strategic CTAs.

### How to Use These Prompts

1. **Reference Tokens**: Keep `BRAND-IDENTITY-GUIDE.md` and `UI-UX-DESIGN-SYSTEM.md` open so typography, spacing, and color tokens remain consistent.
2. **Build Sequentially**: Prompts are ordered the way the page renders; completing them in order prevents rework on shared assets like the dashboard mockup.
3. **Capture Variants**: After finishing each section, export mobile, tablet, and desktop screenshots for QA plus attach any animation notes.
4. **Verify Acceptance**: Every prompt contains acceptance criteria—treat them as test cases before marking the section complete.

### Shared Technical Stack

- React 18 + TypeScript (Vite or Next.js)
- Tailwind CSS configured with FinanceFlo tokens
- Framer Motion for animation + React Intersection Observer for scroll triggers
- Lucide React for icons, React Hook Form + Zod for form logic
- React Helmet (or Next Head) for SEO metadata

---

## Prompt 1: Hero Section with Dashboard Mockup

### Context

You are building the hero section for FinanceFlo.ai, a finance automation platform that combines AI with ERP integration for UK mid-market businesses. This is the most important section of the website and must immediately communicate value while building trust.

### Requirements

Create a React component for the homepage hero section with the following specifications:

**Layout**:
- Two-column layout on desktop (60% left content, 40% right mockup)
- Stacked layout on mobile (content above mockup)
- Dark navy background (#081629)
- Minimum height 600px
- Padding: 6rem vertical, 2rem horizontal

**Left Column Content** (in order):
1. Trust badge: "Trusted by 450+ UK Businesses" (small, above headline)
2. Main headline: "Transform Your Finance Operations" (72px, bold, white)
3. Subheadline: "with AI+ERP" (48px, emerald gradient from #10b981 to #22c55e)
4. Description: "Stop letting manual tasks drain your finance team. FinanceFlo's Adaptive Intelligence Framework™ connects to your ERP in 15 minutes, learns your business in days, and delivers measurable results in weeks." (18px, white with 90% opacity, max-width 600px)
5. CTA buttons row:
   - Primary: "Start Free Trial" (emerald #10b981 background, white text, 16px semibold, padding 12px 32px, rounded 8px)
   - Secondary: "Watch Live Demo" (transparent background, emerald border, emerald text, same sizing)
6. Statistics row (4 metrics in grid):
   - "66% Cost Reduction" | "Average in first year"
   - "500% ROI Boost" | "Across all deployments"
   - "15 min Setup" | "Connect any major ERP"
   - "14 days" | "To full automation"

**Right Column Content**:
- Dashboard mockup component (see Prompt 2)
- Elevated with shadow: 0 20px 40px rgba(0,0,0,0.3)
- Slight rotation: -2deg
- Hover effect: rotate to 0deg, shadow increase

**Statistics Card Style**:
```css
background: rgba(255,255,255,0.1)
border: 1px solid rgba(255,255,255,0.2)
border-radius: 12px
padding: 24px
backdrop-filter: blur(10px)
```

**Responsive Behavior**:
- Desktop (1024px+): Side-by-side layout
- Tablet (640-1023px): Side-by-side with smaller text
- Mobile (<640px): Stacked, headline 48px, subheadline 32px

**Animations**:
- Headline: Fade in from bottom, 600ms, delay 0ms
- Description: Fade in from bottom, 600ms, delay 100ms
- CTAs: Fade in from bottom, 600ms, delay 200ms
- Mockup: Fade in from right, 800ms, delay 300ms
- Statistics: Fade in from bottom, stagger 100ms each

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation

### Expected Output

Provide:
1. Complete React component code (`HeroSection.tsx`)
2. Type definitions for props
3. Tailwind configuration additions (if needed)
4. Usage example in parent page

### Code Structure

```typescript
interface HeroSectionProps {
  onCtaClick?: (ctaType: 'trial' | 'demo') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  // Component implementation
};
```

### Acceptance Criteria

- Layout matches 60/40 split on desktop with full-height navy background and gradient subheadline.
- Statistics cards display four metrics with glassmorphism styling and remain legible on all breakpoints.
- CTA handlers emit `'trial'` / `'demo'` events and integrate with analytics hook stubs.
- Motion honors `prefers-reduced-motion` by disabling translations while keeping fade-in opacity.
- Component passes axe accessibility scan (heading order, button labels, contrast).

---

## Prompt 2: Dashboard Mockup Component

### Context

You are creating a realistic dashboard mockup that demonstrates the FinanceFlo.ai product interface. This mockup should look like a real application screenshot with live data indicators and professional styling.

### Requirements

Create a React component that renders a dashboard mockup with the following specifications:

**Browser Chrome** (macOS style):
- Height: 40px
- Background: #e5e7eb (gray)
- Border radius: 12px 12px 0 0
- Traffic light dots: 12px circles (red #ef4444, yellow #f59e0b, green #10b981) at 12px from left
- Address bar: "financeflo.ai/dashboard" (14px, gray-600, centered)

**Dashboard Interface**:
- Background: #f9fafb (light gray)
- Padding: 24px
- Border radius: 0 0 12px 12px
- Min height: 500px

**Top Bar**:
- "Live Data" badge (emerald background, white text, 12px, rounded-full, padding 4px 12px)
- "500% ROI" badge (emerald background, white text, same style)
- Position: top right

**Content Area** (2×2 grid):

**Card 1: Working Capital**
- White background
- 2px left border (teal #14b8a6)
- Border radius: 12px
- Padding: 20px
- Metric: "£2.4M" (48px, bold, navy)
- Change: "+23% vs last month" (14px, emerald, with up arrow)
- Label: "Cash flow optimization" (14px, gray-600)

**Card 2: AI Efficiency**
- White background
- 2px left border (blue #3b82f6)
- Same styling as Card 1
- Metric: "94%" (48px, bold, navy)
- Change: "+15% improvement" (14px, emerald, with up arrow)
- Label: "Automated processing" (14px, gray-600)

**Card 3: Cash Flow Analysis**
- White background
- Border radius: 12px
- Padding: 20px
- Line chart visualization (simple SVG or placeholder)
- X-axis: Jan, Feb, Mar, Apr, May, Jun, Jul
- Y-axis: Values
- Line color: Emerald
- Label: "Working Capital Optimization" (14px, gray-700, with flame icon)

**Card 4: Working Capital Trends**
- Same style as Card 3
- Bar chart visualization
- Bars: Alternating teal and blue
- Same axis labels

**Animations**:
- Subtle pulse on "Live Data" badge (opacity 0.8 to 1, 2s infinite)
- Gentle float on hover (translateY -8px, 400ms)

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Optional: Recharts or Chart.js for visualizations (or simple SVG)
- Framer Motion for animations

### Expected Output

Provide:
1. Complete React component code (`DashboardMockup.tsx`)
2. Type definitions for props
3. Optional: Simple chart components or SVG placeholders
4. Usage example

### Code Structure

```typescript
interface DashboardMockupProps {
  animated?: boolean;
  className?: string;
}

export const DashboardMockup: React.FC<DashboardMockupProps> = ({ 
  animated = true, 
  className 
}) => {
  // Component implementation
};
```

### Acceptance Criteria

- Browser chrome renders traffic lights, URL, and rounded corners exactly as specified.
- Working Capital and AI Efficiency cards use teal/blue borders, numeric formatting with tabular figures, and up-arrow indicators.
- Line and bar charts render with accessible SVGs (aria-label + descriptive titles) and responsive sizing.
- Badges animate with subtle pulse; entire mockup floats on hover unless `prefers-reduced-motion` is enabled.
- Component exposes `animated` prop to disable motion for testing and storybook documentation.

---

## Prompt 3: Trust Badges Section

### Context

You are creating a trust badges section that appears immediately below the hero to build credibility through security certifications, awards, and guarantees.

### Requirements

Create a React component for a horizontal row of trust badges with the following specifications:

**Layout**:
- Full-width container with light gray background (#f9fafb)
- Centered content (max-width 1280px)
- Padding: 2rem vertical
- Flex row on desktop, wrap on mobile

**Badges** (5 total):
1. "Enterprise Security" - Shield icon
2. "ISO 27001 Certified" - Certificate icon
3. "SOC 2 Compliant" - Lock icon
4. "Award Winning Platform" - Trophy icon
5. "Guaranteed Results" - Checkmark icon

**Badge Style**:
- Icon: 24px, emerald color (#10b981)
- Text: 14px, 600 weight, gray-700
- Gap between icon and text: 8px
- Padding: 12px 24px
- Background: white
- Border: 1px solid gray-200
- Border radius: 8px
- Hover: Border color emerald, shadow increase

**Responsive Behavior**:
- Desktop: 5 badges in single row
- Tablet: 3 badges in first row, 2 in second
- Mobile: 2 badges per row

**Icons**: Use Lucide React icons (Shield, Award, Lock, Trophy, CheckCircle)

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for hover effects

### Expected Output

Provide:
1. Complete React component code (`TrustBadges.tsx`)
2. Type definitions for badge data structure
3. Usage example

### Code Structure

```typescript
interface Badge {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

export const TrustBadges: React.FC = () => {
  const badges: Badge[] = [
    // Badge data
  ];
  
  return (
    // Component JSX
  );
};
```

### Acceptance Criteria

- Exactly five badges render with the prescribed label + icon pairs and wrap gracefully on smaller breakpoints.
- Hover/focus states update border + shadow while maintaining 3:1 contrast.
- Badge data is defined as an array (for easy CMS integration) and icons accept `aria-hidden` props.
- Section background spans full width with centered container max 1280px.
- Component exports default spacing tokens (`gap-6`, `py-8`) consistent with the design system.

---

## Prompt 4: Feature Grid Section

### Context

You are creating a feature grid that showcases the 4 core capabilities of FinanceFlo.ai with icon-based cards.

### Requirements

Create a React component for a 4-column feature grid with the following specifications:

**Section Container**:
- White background
- Padding: 4rem vertical, 2rem horizontal
- Centered content (max-width 1280px)

**Section Header**:
- Overline: "PLATFORM CAPABILITIES" (12px, uppercase, emerald, 600 weight, letter-spacing 0.1em)
- Headline: "Everything You Need to Transform Finance" (48px, 700 weight, navy)
- Description: "FinanceFlo's Adaptive Intelligence Framework™ delivers comprehensive automation across your entire finance operation." (18px, gray-600, max-width 768px, centered)
- Margin bottom: 3rem

**Features** (4 cards):

1. **AI-Powered Automation**
   - Icon: Zap (lightning bolt), emerald background circle
   - Title: "AI-Powered Automation"
   - Description: "Intelligent workflows that learn from your team's actions and automate repetitive tasks, reducing manual work by 66%."

2. **15-Minute ERP Integration**
   - Icon: Link (chain link), blue background circle
   - Title: "15-Minute ERP Integration"
   - Description: "Connect to Sage, NetSuite, Xero, or any major ERP in minutes. No complex setup, no IT involvement required."

3. **Real-Time Cash Visibility**
   - Icon: TrendingUp (chart), teal background circle
   - Title: "Real-Time Cash Visibility"
   - Description: "13-week cash forecasts, working capital optimization, and scenario planning with lender-grade exports."

4. **Guaranteed ROI**
   - Icon: Target (bullseye), orange background circle
   - Title: "Guaranteed ROI"
   - Description: "Average 500% ROI boost across all deployments. If you don't see results in 90 days, we'll refund your investment."

**Card Style**:
```css
background: white
border: 1px solid gray-100
border-radius: 16px
padding: 32px
text-align: center
hover: translateY(-4px), shadow increase
transition: 300ms ease-in-out
```

**Icon Circle**:
```css
width: 64px
height: 64px
border-radius: 50%
margin: 0 auto 16px
display: flex
align-items: center
justify-content: center
```

**Icon Colors**:
- AI: Emerald (#10b981)
- Integration: Blue (#3b82f6)
- Visibility: Teal (#14b8a6)
- ROI: Orange (#f97316)

**Responsive Grid**:
- Desktop (1024px+): 4 columns
- Tablet (640-1023px): 2 columns
- Mobile (<640px): 1 column

**Animations**:
- Fade in from bottom when 20% of section enters viewport
- Stagger: 100ms between cards

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations
- React Intersection Observer for scroll triggers

### Expected Output

Provide:
1. Complete React component code (`FeatureGrid.tsx`)
2. Type definitions for feature data structure
3. Usage example

### Code Structure

```typescript
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  title: string;
  description: string;
}

export const FeatureGrid: React.FC = () => {
  const features: Feature[] = [
    // Feature data
  ];
  
  return (
    // Component JSX
  );
};
```

### Acceptance Criteria

- Section header includes overline, headline, and description with correct typography tokens and centered alignment.
- Four features render with unique icon colors, titles, and descriptions; grid responds 1/2/4 columns across breakpoints.
- Hover state lifts cards by 4px and increases shadow without changing layout shift (no CLS impact).
- Animations trigger via intersection observer only once the section enters viewport, respecting reduced-motion queries.
- Component exposes optional props for custom feature lists to allow reuse on other pages.

---

## Prompt 5: ADAPT Framework Section

### Context

You are creating a section that explains FinanceFlo's proprietary ADAPT Framework™ methodology through a 5-step visual process.

### Requirements

Create a React component that displays the ADAPT Framework with the following specifications:

**Section Container**:
- Navy background (#081629)
- Padding: 6rem vertical, 2rem horizontal
- Centered content (max-width 1280px)

**Section Header**:
- Overline: "OUR METHODOLOGY" (12px, uppercase, emerald, 600 weight)
- Headline: "The ADAPT Framework™" (48px, 700 weight, white)
- Description: "Our proven 5-stage methodology ensures rapid deployment and measurable results from day one." (18px, white with 90% opacity, max-width 768px, centered)
- Margin bottom: 4rem

**ADAPT Steps** (5 stages):

1. **Assess**
   - Icon: Search (magnifying glass)
   - Title: "Assess Your Current State"
   - Description: "We analyze your existing processes, systems, and pain points to create a tailored automation roadmap."
   - Timeline: "Week 1"

2. **Deploy**
   - Icon: Rocket (rocket ship)
   - Title: "Deploy in 15 Minutes"
   - Description: "Connect your ERP and core systems with our zero-code integration. Your team starts seeing value immediately."
   - Timeline: "Week 1"

3. **Adapt**
   - Icon: RefreshCw (circular arrows)
   - Title: "Adapt to Your Business"
   - Description: "Our AI learns your workflows, terminology, and exceptions, becoming smarter every day without manual training."
   - Timeline: "Weeks 2-3"

4. **Perform**
   - Icon: BarChart3 (bar chart)
   - Title: "Perform at Scale"
   - Description: "Automation kicks in across forecasting, reporting, and analysis. Your team focuses on strategy, not spreadsheets."
   - Timeline: "Week 4+"

5. **Transform**
   - Icon: Sparkles (stars)
   - Title: "Transform Your Operations"
   - Description: "Achieve 66% cost reduction and 500% ROI as finance becomes a strategic growth driver for your business."
   - Timeline: "Ongoing"

**Step Card Style**:
```css
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 16px
padding: 32px
backdrop-filter: blur(10px)
hover: border-color emerald, translateY(-4px)
transition: 300ms ease-in-out
```

**Layout**:
- Desktop: 5 columns in single row with connecting arrows
- Tablet: 2 columns, 3 rows with vertical arrows
- Mobile: 1 column, 5 rows with vertical arrows

**Connecting Arrows**:
- Emerald color (#10b981)
- Dashed line (2px)
- Arrow head at end
- Between each step

**Icon Style**:
- 48px size
- Emerald color (#10b981)
- Margin bottom: 16px

**Timeline Badge**:
- Small pill shape
- Emerald background with 20% opacity
- Emerald text
- 12px font size
- Position: top right of card

**Animations**:
- Cards fade in from bottom with stagger
- Arrows draw in after cards (stroke-dasharray animation)
- Hover: Icon rotates slightly, card elevates

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations

### Expected Output

Provide:
1. Complete React component code (`AdaptFramework.tsx`)
2. Type definitions for step data structure
3. SVG arrow component
4. Usage example

### Code Structure

```typescript
interface AdaptStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  timeline: string;
  letter: string; // A, D, A, P, T
}

export const AdaptFramework: React.FC = () => {
  const steps: AdaptStep[] = [
    // Step data
  ];
  
  return (
    // Component JSX
  );
};
```

### Acceptance Criteria

- Five steps render with letters A/D/A/P/T, icons, descriptions, and timeline pills matching the copy provided.
- Connector arrows animate draw-in effect after cards load and degrade gracefully on mobile (hidden when vertical).
- Cards use glassmorphism styling from the brand guide and remain keyboard focusable with visible outlines.
- Section background spans full width navy with centered content + 6rem vertical padding.
- Props allow overriding copy or adding analytics hooks for step interactions.

---

## Prompt 6: Social Proof Section

### Context

You are creating a social proof section that combines company logos and a featured testimonial to build trust and credibility.

### Requirements

Create a React component for social proof with the following specifications:

**Section Container**:
- Light gray background (#f9fafb)
- Padding: 4rem vertical, 2rem horizontal
- Centered content (max-width 1280px)

**Section Header**:
- Headline: "Trusted by Leading UK Businesses" (36px, 700 weight, navy, centered)
- Margin bottom: 3rem

**Company Logos Grid**:
- 6 logos in 2 rows (desktop)
- 3 logos in 2 rows (tablet)
- 2 logos in 3 rows (mobile)
- Logo size: 120px × 60px
- Grayscale filter: 100%
- Opacity: 0.6
- Hover: Grayscale 0%, opacity 1
- Transition: 300ms ease-in-out

**Companies** (use placeholder logos or text):
1. Afritelecoms
2. TMF Group
3. EnergyDrive Systems
4. Diccorv Properties
5. Salesforce
6. Mouchel

**Featured Testimonial Card**:
- White background
- Border: 1px solid gray-200
- Border radius: 16px
- Padding: 48px
- Max width: 800px
- Centered
- Shadow: 0 4px 6px rgba(0,0,0,0.05)
- Margin top: 3rem

**Testimonial Content**:
- Large emerald quotation mark (48px, top left)
- Quote: "FinanceFlo transformed our finance operations in just 14 days. We've reduced manual work by 70% and gained real-time visibility into cash flow that we never had before. The ROI has been extraordinary." (20px, italic, gray-700, line-height 1.7)
- Author section (flex row):
  - Photo: 64px circle (use placeholder or avatar)
  - Name: "Sarah Mitchell" (18px, 600 weight, navy)
  - Title: "CFO" (16px, gray-600)
  - Company: "EnergyDrive Systems" (16px, gray-600)

**Animations**:
- Logos fade in with stagger (100ms each)
- Testimonial slides in from bottom (600ms delay)

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations

### Expected Output

Provide:
1. Complete React component code (`SocialProof.tsx`)
2. Type definitions for company and testimonial data
3. Usage example

### Code Structure

```typescript
interface Company {
  name: string;
  logo: string; // URL or placeholder
}

interface Testimonial {
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    photo: string;
  };
}

export const SocialProof: React.FC = () => {
  // Component implementation
};
```

### Acceptance Criteria

- Six logos load via array map with grayscale/opacity hover transitions and alt text for screen readers.
- Testimonial card includes decorative quotation mark, 64px avatar, author meta, and 48px padding on desktop.
- Section maintains 4rem vertical padding, centers content, and ensures testimonial width ≤800px.
- Motion staggers logos by 100ms and delays testimonial by 300ms without impacting performance.
- Component exposes props for custom logo/testimonial data and handles empty states gracefully.

---

## Prompt 7: Final CTA Section

### Context

You are creating the final call-to-action section before the footer, designed to convert visitors who have scrolled through the entire page.

### Requirements

Create a React component for the final CTA section with the following specifications:

**Section Container**:
- Navy background with gradient: linear-gradient(135deg, #081629 0%, #0a1b35 100%)
- Padding: 6rem vertical, 2rem horizontal
- Centered content (max-width 768px)
- Text align: center

**Content**:
- Headline: "Ready to Transform Your Finance Operations?" (48px, 700 weight, white)
- Description: "Join 450+ UK businesses achieving 66% cost reduction and 500% ROI boost. Start your free trial today—no credit card required." (18px, white with 90% opacity, line-height 1.7)
- CTA buttons row:
  - Primary: "Start Free Trial" (emerald background, white text, large size: 18px, padding 16px 48px)
  - Secondary: "Book Consultation" (white background, navy text, same sizing)
- Trust indicators row (3 items):
  - "No credit card required" (checkmark icon)
  - "30-day free trial" (checkmark icon)
  - "Setup in 24 hours" (checkmark icon)

**Button Styling**:
```css
Primary:
  background: #10b981
  color: white
  font-size: 18px
  font-weight: 600
  padding: 16px 48px
  border-radius: 8px
  hover: #1b6440, translateY(-2px)
  shadow: 0 4px 6px rgba(0,0,0,0.1)

Secondary:
  background: white
  color: #081629
  font-size: 18px
  font-weight: 600
  padding: 16px 48px
  border-radius: 8px
  hover: background #f9fafb
  shadow: 0 4px 6px rgba(0,0,0,0.1)
```

**Trust Indicators**:
- Flex row, centered
- Gap: 2rem
- Icon: 20px emerald checkmark
- Text: 14px, white with 80% opacity
- Responsive: Stack on mobile

**Animations**:
- Headline: Fade in from bottom, 600ms
- Description: Fade in from bottom, 600ms delay 100ms
- Buttons: Fade in from bottom, 600ms delay 200ms
- Trust indicators: Fade in from bottom, 600ms delay 300ms

### Technical Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons (CheckCircle)
- Framer Motion for animations

### Expected Output

Provide:
1. Complete React component code (`FinalCTA.tsx`)
2. Type definitions for props (optional onCtaClick handlers)
3. Usage example

### Code Structure

```typescript
interface FinalCTAProps {
  onStartTrial?: () => void;
  onBookConsultation?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onStartTrial,
  onBookConsultation
}) => {
  // Component implementation
};
```

### Acceptance Criteria

- Gradient background implements specified colors, center-aligned copy, and 6rem vertical padding.
- Primary/secondary CTAs pass analytics handlers through props and maintain 44px touch targets on mobile.
- Trust indicators render as flex row (desktop) + stacked list (mobile) with Lucide `CheckCircle` icons.
- Section honors reduced-motion setting and includes focus-visible outlines for both CTAs.
- Component exports default props for CTA text making it reusable on other pages.

---

## Prompt 8: Complete Homepage Assembly

### Context

You are assembling all the homepage sections into a single page component with proper layout, SEO, and analytics.

### Requirements

Create a complete homepage component that integrates all sections with the following specifications:

**Page Structure** (in order):
1. SEO component (meta tags, structured data)
2. Hero Section
3. Trust Badges
4. Feature Grid
5. ADAPT Framework
6. Social Proof
7. Final CTA
8. Footer (separate component)

**SEO Configuration**:
```typescript
{
  title: "Finance Automation Software UK | AI ERP Integration | FinanceFlo",
  description: "Transform your finance operations with FinanceFlo's AI+ERP platform. Join 450+ UK businesses achieving 66% cost reduction and 500% ROI boost.",
  canonical: "https://financeflo.ai/",
  openGraph: {
    title: "Finance Automation Software UK | FinanceFlo",
    description: "Transform your finance operations with AI+ERP integration.",
    image: "https://financeflo.ai/og-image.jpg",
    url: "https://financeflo.ai/"
  }
}
```

**Structured Data** (JSON-LD):
- Organization schema
- Product schema
- BreadcrumbList schema

**Analytics Tracking**:
- Page view on mount
- CTA click events
- Scroll depth tracking (25%, 50%, 75%, 100%)

**Sticky CTA Bar**:
- Appears after scrolling 50% of page
- Fixed bottom position
- White background with shadow
- Dismissible (stores cookie)
- Content: "Ready to transform?" + "Start Free Trial" button

**Performance Optimizations**:
- Lazy load images below the fold
- Preload hero image
- Code splitting for heavy sections
- Intersection Observer for animations

### Technical Stack

- React 18+ with TypeScript
- React Router for navigation
- React Helmet for SEO
- Framer Motion for animations
- Tailwind CSS for styling
- Analytics library (e.g., Mixpanel, GA4)

### Expected Output

Provide:
1. Complete page component code (`HomePage.tsx`)
2. SEO component code (`SEO.tsx`)
3. Sticky CTA bar component (`StickyCTABar.tsx`)
4. Analytics utility functions
5. Usage example in App.tsx

### Code Structure

```typescript
export const HomePage: React.FC = () => {
  // Analytics tracking
  useEffect(() => {
    trackPageView('homepage');
  }, []);
  
  // Scroll depth tracking
  useScrollDepth((depth) => {
    trackEvent('scroll_depth', { depth });
  });
  
  // CTA click handlers
  const handleStartTrial = () => {
    trackEvent('cta_click', { type: 'start_trial', location: 'hero' });
    // Navigate to trial signup
  };
  
  return (
    <>
      <SEO {...seoConfig} />
      <HeroSection onCtaClick={handleStartTrial} />
      <TrustBadges />
      <FeatureGrid />
      <AdaptFramework />
      <SocialProof />
      <FinalCTA onStartTrial={handleStartTrial} />
      <StickyCTABar />
    </>
  );
};
```

### Acceptance Criteria

- All seven sections render in the specified order with shared layout/container components.
- `SEO` component injects meta tags + structured data; analytics utilities fire page view and CTA events.
- Sticky CTA bar appears after 50% scroll, stores dismissal in `localStorage`/cookie, and suspends on mobile keyboards.
- Lazy loading applied to below-the-fold imagery; intersection observers gate animations to reduce main-thread work.
- Page passes Lighthouse 90+ for Performance and Accessibility when run locally via `npm run preview`.

---

## Implementation Checklist

Use this checklist to track progress:

- [ ] Hero Section component created
- [ ] Dashboard Mockup component created
- [ ] Trust Badges component created
- [ ] Feature Grid component created
- [ ] ADAPT Framework component created
- [ ] Social Proof component created
- [ ] Final CTA component created
- [ ] SEO component configured
- [ ] Sticky CTA Bar implemented
- [ ] Analytics tracking added
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Animations tested and optimized
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance audit passed (Lighthouse score 90+)
- [ ] Cross-browser testing completed
- [ ] Homepage deployed to staging

---

## Testing Requirements

### Functional Testing

**Navigation**:
- [ ] All CTA buttons navigate correctly
- [ ] External links open in new tab
- [ ] Smooth scrolling to sections works

**Forms** (if applicable):
- [ ] Validation works correctly
- [ ] Error messages display properly
- [ ] Success states show correctly
- [ ] Form submission tracks analytics

**Responsive**:
- [ ] Mobile layout displays correctly
- [ ] Tablet layout displays correctly
- [ ] Desktop layout displays correctly
- [ ] Touch targets are 44px minimum on mobile

### Visual Testing

**Design**:
- [ ] Colors match brand guide (#081629 navy, #10b981 emerald)
- [ ] Typography matches specifications (Inter font)
- [ ] Spacing follows 8px grid system
- [ ] Shadows and borders are consistent

**Animations**:
- [ ] Hero animations play on load
- [ ] Section animations trigger on scroll
- [ ] Hover states work correctly
- [ ] No janky or stuttering animations

### Performance Testing

**Metrics** (Lighthouse):
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Overall Performance Score > 90

**Optimization**:
- [ ] Images are optimized (WebP with fallbacks)
- [ ] Critical CSS is inlined
- [ ] JavaScript is code-split
- [ ] Fonts are preloaded

### Accessibility Testing

**WCAG 2.1 AA**:
- [ ] Color contrast ratios meet 4.5:1 minimum
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Screen reader testing passed
- [ ] ARIA labels are correct

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-24 | Initial homepage prompts created | Manus AI |

---

*These prompts are designed to be used with AI coding assistants (Claude, GPT-4, etc.) or as detailed specifications for human developers.*
