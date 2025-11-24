# FinanceFlo.ai UI/UX Design System

**Version**: 1.0  
**Date**: November 24, 2025  
**Purpose**: Comprehensive design system for building consistent, accessible, and beautiful user interfaces

---

## Introduction

This design system provides a complete framework for designing and building the FinanceFlo.ai website. It establishes patterns, components, and guidelines that ensure consistency across all pages while maintaining flexibility for unique content needs.

The system is built on principles of clarity, professionalism, and user-centricity, with a focus on conversion optimization and accessibility.

> **Source of Truth**  
> Pair this document with `BRAND-IDENTITY-GUIDE.md` for visual tokens (color, typography, spacing) and `HOMEPAGE-REDESIGN-PROMPTS.md` for build-ready implementation sequences. All component specs below reference the brand tokens defined in those companion guides.

---

## Design Principles

### 1. Clarity First

Every element serves a clear purpose. The interface guides users toward understanding the value proposition and taking action without confusion or cognitive overload.

**Implementation**:
- Clear visual hierarchy with distinct heading sizes
- Ample white space between sections
- One primary call-to-action per section
- Descriptive labels and microcopy
- Progressive disclosure of complex information

### 2. Professional Trust

The design conveys expertise, reliability, and enterprise-grade quality through refined aesthetics and attention to detail.

**Implementation**:
- Sophisticated color palette (navy + emerald)
- Professional typography (Inter font family)
- Subtle shadows and depth
- High-quality imagery and mockups
- Consistent spacing and alignment

### 3. Results-Oriented

Every page emphasizes tangible outcomes and measurable benefits, using data and social proof to build credibility.

**Implementation**:
- Prominent display of metrics (66% cost reduction, 500% ROI)
- Customer testimonials with specific results
- Case studies with quantifiable outcomes
- Before/after comparisons
- Trust badges and certifications

### 4. Conversion-Focused

The design actively guides users toward desired actions through strategic placement of CTAs and removal of friction.

**Implementation**:
- Multiple CTAs with clear hierarchy
- Sticky CTA bar for persistent access
- Exit-intent popups for lead capture
- Minimal form fields
- Clear value propositions near CTAs

### 5. Accessible by Default

The interface works for everyone, regardless of ability, device, or context, meeting WCAG 2.1 AA standards minimum.

**Implementation**:
- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Responsive design for all devices
- Clear focus indicators

---

## Layout System

### Grid Structure

The layout uses a 12-column grid system with responsive breakpoints for optimal display across devices.

**Breakpoints**:
| Name | Min Width | Max Width | Columns | Gutter | Container |
|------|-----------|-----------|---------|--------|-----------|
| Mobile | 0px | 639px | 4 | 16px | Fluid |
| Tablet | 640px | 1023px | 8 | 24px | 640px |
| Desktop | 1024px | 1279px | 12 | 24px | 1024px |
| Wide | 1280px | ∞ | 12 | 32px | 1280px |

### Container Types

**Full Width**: Spans entire viewport width (used for hero sections, full-bleed images)

**Contained**: Maximum width of 1280px, centered with horizontal padding
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 2rem;
```

**Narrow**: Maximum width of 768px for reading content
```css
max-width: 768px;
margin: 0 auto;
padding: 0 2rem;
```

### Token Mapping (Tailwind Utility Reference)

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| Container | 1280px max | `max-w-screen-xl` | Primary marketing sections |
| Content | 768px max | `max-w-3xl` | Long-form copy blocks |
| Section Padding | 4rem | `py-16` | Default vertical rhythm |
| Hero Padding | 6rem | `py-24` | Above-the-fold areas |
| Gutters | 2rem | `px-8` | Desktop horizontal padding |
| Card Radius | 12-16px | `rounded-xl` | Cards, testimonials |

Always prefer these shared utilities over bespoke CSS to keep spacing and breakpoints consistent across teams.

### Section Spacing

**Standard Section**:
```css
padding-top: 4rem;    /* 64px */
padding-bottom: 4rem; /* 64px */
```

**Hero Section**:
```css
padding-top: 6rem;    /* 96px */
padding-bottom: 6rem; /* 96px */
min-height: 600px;
```

**Compact Section**:
```css
padding-top: 3rem;    /* 48px */
padding-bottom: 3rem; /* 48px */
```

---

## Component Library

### Navigation

#### Header

The header provides primary navigation and brand identity, remaining accessible throughout the user journey.

**Structure**:
- Logo (left)
- Navigation menu (center)
- CTA button (right)
- Sticky on scroll

**Specifications**:
```
Height: 80px
Background: White with subtle shadow on scroll
Logo: 180px width
Menu Items: 16px, 600 weight, Gray 700
Hover: Emerald Primary underline
CTA Button: Emerald Primary, "Book Consultation"
Mobile: Hamburger menu at 1024px breakpoint
```

**Navigation Items**:
- Industries (dropdown)
- Solutions (dropdown)
- Resources (dropdown)
- Pricing (link)
- Watch Demos (dropdown)

**Dropdown Style**:
```css
background: white;
border: 1px solid gray-100;
border-radius: 12px;
box-shadow: 0 10px 20px rgba(0,0,0,0.1);
padding: 16px;
min-width: 240px;
```

#### Footer

The footer provides comprehensive site navigation, legal links, and company information.

**Structure**:
- 4-column layout on desktop
- Stacked on mobile
- Newsletter signup
- Social media icons
- Legal links
- Company information

**Columns**:
1. **Company**: About, Team, Careers, Contact
2. **Product**: Features, Pricing, Security, Integrations
3. **Resources**: Blog, Case Studies, Documentation, Support
4. **Legal**: Privacy Policy, Terms of Service, Cookie Policy

**Specifications**:
```
Background: Navy Primary (#081629)
Text: Gray 300 (light)
Heading: White, 18px, 600 weight
Links: Gray 300, 16px, hover to Emerald Primary
Padding: 4rem vertical
```

### Hero Sections

#### Primary Hero

The primary hero is the most important section, making a strong first impression and communicating core value.

**Layout**:
- Left: Headline, subhead, description, CTAs, trust badges, statistics
- Right: Dashboard mockup or product visualization

**Components**:
1. **Trust Badge**: "Trusted by 450+ UK Businesses" (small, above headline)
2. **Headline**: Large (48-72px), bold, with green gradient on key words
3. **Subheadline**: "with AI+ERP" (32-48px, lighter weight)
4. **Description**: 18px, 1-2 sentences, clear value proposition
5. **CTA Row**: Primary button + secondary button
6. **Statistics Row**: 3-4 key metrics in grid
7. **Dashboard Mockup**: Right side, elevated with shadow

**Specifications**:
```css
Background: Navy Primary (#081629)
Text: White
Headline: 72px, 700 weight, line-height 1.1
Gradient: linear-gradient(to right, #10b981, #22c55e)
Description: 18px, 400 weight, opacity 0.9
Min Height: 600px
Padding: 6rem vertical
```

**Statistics Card**:
```css
Background: rgba(255,255,255,0.1)
Border: 1px solid rgba(255,255,255,0.2)
Border Radius: 12px
Padding: 24px
Backdrop Filter: blur(10px)
```

#### Feature Hero

Simpler hero for interior pages, focusing on page title and breadcrumb navigation.

**Layout**:
- Centered content
- Breadcrumb navigation above title
- Page title
- Brief description
- Optional CTA

**Specifications**:
```css
Background: Gray 50 (#f9fafb)
Text: Navy Primary
Padding: 3rem vertical
Text Align: center
Max Width: 768px
```

### Feature Cards

#### Icon Feature Card

Used to showcase product features, benefits, or services with visual icons.

**Structure**:
- Circular icon with colored background (64px)
- Title (24px, 600 weight)
- Description (16px, 400 weight, 2-3 lines)
- Optional link or button

**Specifications**:
```css
Background: White
Border: 1px solid Gray 100
Border Radius: 16px
Padding: 32px
Text Align: center
Hover: translateY(-4px), shadow increase
Transition: 300ms ease-in-out
```

**Icon Circle**:
```css
Width: 64px
Height: 64px
Border Radius: 50%
Background: Varies by feature type
Icon: 32px, white
Margin: 0 auto 16px
```

**Icon Colors**:
- AI/Automation: Emerald Primary (#10b981)
- Analytics: Blue (#3b82f6)
- Integration: Teal (#14b8a6)
- Security: Orange (#f97316)
- Collaboration: Pink (#ec4899)

#### Metric Feature Card

Highlights specific metrics or statistics with large numbers.

**Structure**:
- Large metric (48px, 700 weight)
- Label (14px, 600 weight, uppercase, letter-spacing)
- Description (16px, 400 weight)
- Optional icon

**Specifications**:
```css
Background: White
Border: 1px solid Gray 100
Border Radius: 12px
Padding: 24px
Min Height: 160px
```

**Example**:
```
300%
EFFICIENCY GAIN
AI That Learns Your Business
```

### Dashboard Mockup

The dashboard mockup demonstrates the product interface in a realistic context.

**Structure**:
- Browser chrome (macOS style)
- Dashboard interface
- Live data indicators
- Metrics cards
- Chart visualization

**Browser Chrome**:
```css
Height: 40px
Background: #e5e7eb (Gray 200)
Border Radius: 12px 12px 0 0
Dots: 12px circles (red, yellow, green)
Address Bar: "financeflo.ai/dashboard"
```

**Dashboard**:
```css
Background: #f9fafb (Gray 50)
Padding: 24px
Border Radius: 0 0 12px 12px
```

**Badges**:
```css
"Live Data": Emerald background, white text, 12px
"500% ROI": Emerald background, white text, 12px
Position: Top right
```

**Metrics Cards**:
```css
Background: White
Border: 2px solid (Teal or Blue)
Border Radius: 12px
Padding: 20px
```

### Call-to-Action Components

#### Primary CTA Button

The most prominent action button, used for primary conversions.

**Specifications**:
```css
Background: Emerald Primary (#10b981)
Text: White, 16px, 600 weight
Padding: 12px 32px
Border Radius: 8px
Hover: Emerald Dark (#1b6440), translateY(-2px)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover Shadow: 0 4px 6px rgba(0,0,0,0.15)
Transition: all 200ms ease-in-out
```

**Text Examples**:
- "Start Free Trial"
- "Book Consultation"
- "Watch Live Demo"
- "Get Started"

#### Secondary CTA Button

Alternative action, less prominent than primary.

**Specifications**:
```css
Background: Transparent
Text: Emerald Primary, 16px, 600 weight
Padding: 12px 32px
Border: 2px solid Emerald Primary
Border Radius: 8px
Hover: Background #f0fdf4 (light green tint)
Transition: all 200ms ease-in-out
```

**Text Examples**:
- "Learn More"
- "View Pricing"
- "Contact Sales"
- "Read Case Study"

#### CTA Section

Full-width section dedicated to driving conversion.

**Structure**:
- Background (Navy or Emerald gradient)
- Centered content (max 768px)
- Headline (36px, 700 weight)
- Description (18px)
- CTA buttons (primary + secondary)
- Trust indicators (optional)

**Specifications**:
```css
Background: linear-gradient(135deg, #081629 0%, #0a1b35 100%)
Text: White
Padding: 6rem vertical
Text Align: center
```

**Trust Indicators**:
- "No credit card required"
- "30-day free trial"
- "Setup in under 24 hours"
- "Cancel anytime"

#### Sticky CTA Bar

Persistent bottom bar that appears on scroll.

**Specifications**:
```css
Position: fixed
Bottom: 0
Width: 100%
Background: White
Border Top: 1px solid Gray 200
Box Shadow: 0 -4px 6px rgba(0,0,0,0.1)
Padding: 16px
Z-Index: 50
```

**Content**:
- Left: Brief message ("Ready to transform your finance operations?")
- Right: Primary CTA button
- Close button (X) in top right

**Behavior**:
- Appears after scrolling 50% of page
- Dismissible (sets cookie)
- Hides on form pages

### Social Proof Components

#### Testimonial Card

Customer quotes with attribution, building trust and credibility.

**Structure**:
- Quote text (18px, italic)
- Customer photo (64px circle)
- Customer name (16px, 600 weight)
- Customer title (14px, 400 weight)
- Company name (14px, 400 weight)
- Company logo (optional)

**Specifications**:
```css
Background: White
Border: 1px solid Gray 100
Border Radius: 16px
Padding: 32px
Max Width: 600px
```

**Quote Style**:
```css
Font Size: 18px
Font Style: italic
Line Height: 1.7
Color: Gray 700
Margin Bottom: 24px
Quote Marks: Large emerald quotation marks
```

#### Company Logo Grid

Grid of client company logos for social proof.

**Layout**:
- 6 logos in 2 rows (desktop)
- 3 logos in 2 rows (tablet)
- 2 logos in 3 rows (mobile)

**Specifications**:
```css
Logo Size: 120px × 60px
Filter: grayscale(100%)
Opacity: 0.6
Hover: grayscale(0%), opacity 1
Transition: 300ms ease-in-out
```

**Companies** (from original site):
- Afritelecoms
- TMF Group
- EnergyDrive Systems
- Diccorv Properties
- Salesforce
- Mouchel

#### Trust Badges

Icons and text indicating security, awards, or certifications.

**Layout**: Horizontal row of badges

**Badge Structure**:
- Icon (24px)
- Text (14px, 600 weight)

**Examples**:
- "Enterprise Security" (shield icon)
- "Award Winning Platform" (trophy icon)
- "Guaranteed Results" (checkmark icon)
- "ISO 27001 Certified" (certificate icon)
- "SOC 2 Compliant" (lock icon)

### Content Components

#### Feature List

Bulleted list of features or benefits with checkmark icons.

**Structure**:
- Emerald checkmark icon (20px)
- Feature text (16px, 400 weight)
- Vertical spacing (12px between items)

**Specifications**:
```css
List Style: none
Padding Left: 0
Icon: Emerald Primary checkmark
Icon Position: Left, aligned with first line
Text Indent: 32px (space for icon)
```

#### Accordion (FAQ)

Expandable/collapsible content sections for FAQs.

**Structure**:
- Question (18px, 600 weight, clickable)
- Expand/collapse icon (chevron)
- Answer (16px, 400 weight, hidden until expanded)

**Specifications**:
```css
Border: 1px solid Gray 200
Border Radius: 12px
Margin Bottom: 16px
Padding: 24px
```

**Expanded State**:
```css
Background: Gray 50
Border Color: Emerald Primary
Icon: Rotate 180deg
Answer: Slide down with fade in
```

#### Comparison Table

Side-by-side feature comparison, often used for pricing tiers.

**Structure**:
- Header row with plan names
- Feature rows with checkmarks/crosses
- Highlighted column for recommended plan

**Specifications**:
```css
Border: 1px solid Gray 200
Border Radius: 12px
Overflow: hidden
```

**Header Cell**:
```css
Background: Gray 50
Padding: 24px
Text Align: center
Font Size: 24px
Font Weight: 700
```

**Feature Cell**:
```css
Padding: 16px
Border Top: 1px solid Gray 100
Text Align: center
```

**Highlighted Column**:
```css
Background: linear-gradient(to bottom, #f0fdf4, white)
Border: 2px solid Emerald Primary
Position: relative
Z-Index: 1
```

### Form Components

#### Contact Form

Standard form for lead capture and inquiries.

**Fields**:
1. Name (text input, required)
2. Email (email input, required)
3. Company (text input, optional)
4. Phone (tel input, optional)
5. Message (textarea, required)
6. Submit button

**Specifications**:
```css
Max Width: 600px
Margin: 0 auto
```

**Input Field**:
```css
Width: 100%
Padding: 12px 16px
Border: 1px solid Gray 300
Border Radius: 8px
Font Size: 16px
Margin Bottom: 16px
Focus: Border Emerald Primary, Shadow 0 0 0 3px rgba(16,185,129,0.1)
```

**Label**:
```css
Display: block
Font Size: 14px
Font Weight: 600
Color: Gray 700
Margin Bottom: 8px
```

**Submit Button**:
```css
Width: 100%
Background: Emerald Primary
Text: White, 16px, 600 weight
Padding: 14px 32px
Border: none
Border Radius: 8px
Cursor: pointer
Hover: Emerald Dark
```

#### Newsletter Signup

Simple email capture form, typically in footer.

**Structure**:
- Email input (inline)
- Submit button (inline)
- Privacy notice (small text below)

**Specifications**:
```css
Display: flex
Max Width: 400px
```

**Input**:
```css
Flex: 1
Padding: 12px 16px
Border: 1px solid Gray 300
Border Radius: 8px 0 0 8px
```

**Button**:
```css
Padding: 12px 24px
Background: Emerald Primary
Text: White
Border: none
Border Radius: 0 8px 8px 0
```

---

## Page Templates

### Homepage Template

The homepage is the primary entry point, optimized for conversion and clear value communication.

**Sections** (in order):
1. **Hero Section**: Headline, description, CTAs, dashboard mockup, statistics
2. **Trust Badges**: Row of security/award badges
3. **Feature Grid**: 4 key features with icons
4. **Product Showcase**: Detailed feature explanation with imagery
5. **ADAPT Framework**: 5-step methodology visualization
6. **Social Proof**: Company logos + featured testimonial
7. **CTA Section**: Final conversion push
8. **Footer**: Comprehensive navigation and links

**Total Length**: ~8000px (scrollable)

### Features Page Template

Detailed explanation of product capabilities and benefits.

**Sections**:
1. **Feature Hero**: Page title, breadcrumb, brief description
2. **Feature Overview**: Grid of all features with icons
3. **Detailed Features**: Each feature with description, benefits, screenshot
4. **Comparison Table**: Feature comparison across tiers
5. **CTA Section**: Trial signup
6. **Footer**

### Pricing Page Template

Clear pricing tiers with feature comparison and CTAs.

**Sections**:
1. **Pricing Hero**: "Simple, Transparent Pricing"
2. **Pricing Cards**: 3 tiers (Starter, Professional, Enterprise)
3. **Comparison Table**: Detailed feature comparison
4. **FAQ**: Common pricing questions
5. **CTA Section**: "Not sure which plan? Talk to sales"
6. **Footer**

**Pricing Card**:
```css
Background: White
Border: 2px solid Gray 200
Border Radius: 16px
Padding: 32px
Text Align: center
Min Height: 500px
```

**Recommended Plan**:
```css
Border: 2px solid Emerald Primary
Box Shadow: 0 10px 20px rgba(16,185,129,0.1)
Transform: scale(1.05)
Z-Index: 1
Badge: "Most Popular" (Emerald, top right)
```

### About Page Template

Company story, mission, team, and values.

**Sections**:
1. **About Hero**: Company mission statement
2. **Story Section**: Company history and founding
3. **Values Grid**: 4-6 core values with icons
4. **Team Grid**: Team member photos and bios
5. **Timeline**: Company milestones
6. **CTA Section**: "Join our team" or "Work with us"
7. **Footer**

### Contact Page Template

Multiple ways to get in touch with clear CTAs.

**Sections**:
1. **Contact Hero**: "Get in Touch"
2. **Contact Methods**: Phone, email, address, social media
3. **Contact Form**: Lead capture form
4. **Map**: Office location (if applicable)
5. **FAQ**: Common questions
6. **Footer**

### Blog Listing Page Template

Grid of blog posts with filtering and search.

**Sections**:
1. **Blog Hero**: "Insights & Resources"
2. **Search Bar**: Keyword search
3. **Category Filter**: Filter by topic
4. **Blog Grid**: 3-column grid of post cards
5. **Pagination**: Page navigation
6. **Newsletter Signup**: Subscribe to blog
7. **Footer**

**Blog Post Card**:
```css
Background: White
Border: 1px solid Gray 100
Border Radius: 12px
Overflow: hidden
Hover: Shadow increase, translateY(-4px)
```

**Card Structure**:
- Featured image (16:9 ratio)
- Category badge
- Title (20px, 600 weight, 2 lines max)
- Excerpt (16px, 3 lines max)
- Author + date
- Read time

### Blog Post Page Template

Individual blog post with rich content formatting.

**Sections**:
1. **Post Header**: Title, author, date, read time, featured image
2. **Post Content**: Rich text with headings, images, quotes, lists
3. **Author Bio**: Photo, name, bio, social links
4. **Related Posts**: 3 related articles
5. **Newsletter Signup**: Subscribe CTA
6. **Footer**

**Content Width**: 768px maximum for readability

**Typography**:
- H2: 36px, 600 weight
- H3: 30px, 600 weight
- Paragraph: 18px, 1.7 line-height
- Blockquote: 20px, italic, left border

---

## Responsive Behavior

### Mobile-First Approach

Design for mobile first, then enhance for larger screens.

**Mobile (< 640px)**:
- Single column layout
- Stacked navigation (hamburger menu)
- Full-width buttons
- Larger touch targets (44px minimum)
- Simplified hero (text above mockup)
- 2-column feature grid

**Tablet (640px - 1023px)**:
- 2-column layout where appropriate
- Expanded navigation (still hamburger)
- Side-by-side CTAs
- 3-column feature grid
- Hero with text and mockup side-by-side

**Desktop (1024px+)**:
- Full 12-column grid
- Horizontal navigation
- 4-column feature grid
- Complex layouts (asymmetric, overlapping)
- Full hero with all elements

### Component Responsiveness Matrix

| Component | Mobile (<640px) | Tablet (640-1023px) | Desktop (1024px+) |
|-----------|-----------------|---------------------|-------------------|
| Header | Logo + hamburger; CTA as button row | Logo + hamburger with inline CTA | Full navigation with dropdowns and dual CTAs |
| Hero | Stacked columns, 48px headline | 60/40 split with reduced mockup scale | 60/40 split with full animation, stat grid |
| Feature Grid | Single column stack | Two columns, staggered animation | Four columns with equal widths |
| ADAPT Framework | Vertical timeline with numbered steps | Two columns, auto-wrap connectors | Horizontal timeline with arrows |
| Testimonials | Carousel or stacked cards | Two-column layout | Grid with featured testimonial centered |
| Footer | Accordion columns | Two columns + inline newsletter | Four columns + inline newsletter |

Use Tailwind responsive variants (`sm:`, `md:`, `lg:`) to codify these behaviors directly in JSX.

### Breakpoint Strategy

**Navigation**:
- Mobile: Hamburger menu
- Desktop (1024px+): Horizontal menu with dropdowns

**Hero**:
- Mobile: Stacked (text above mockup)
- Tablet: Side-by-side with smaller mockup
- Desktop: Side-by-side with full mockup

**Feature Grid**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

**Typography**:
- Mobile: Smaller sizes (H1: 36px)
- Tablet: Medium sizes (H1: 48px)
- Desktop: Full sizes (H1: 72px)

---

## Animation Guidelines

### Page Load Animations

**Hero Elements**:
```css
Headline: Fade in from bottom, 600ms delay 0ms
Description: Fade in from bottom, 600ms delay 100ms
CTAs: Fade in from bottom, 600ms delay 200ms
Mockup: Fade in from right, 800ms delay 300ms
```

**Section Entrance**:
```css
Trigger: When 20% of section enters viewport
Animation: Fade in from bottom, 400ms
Stagger: 100ms between child elements
```

### Hover States

**Buttons**:
```css
Transform: translateY(-2px)
Shadow: Increase
Duration: 200ms
Easing: ease-in-out
```

**Cards**:
```css
Transform: translateY(-4px)
Shadow: Increase significantly
Duration: 300ms
Easing: ease-in-out
```

**Links**:
```css
Color: Change to Emerald Primary
Underline: Slide in from left
Duration: 200ms
Easing: ease-out
```

### Loading States

**Button Loading**:
```css
Text: "Loading..."
Cursor: not-allowed
Opacity: 0.6
Spinner: Rotating circle icon
```

**Page Loading**:
```css
Skeleton Screens: Gray animated placeholders
Fade In: Content fades in when loaded
Duration: 300ms
```

### Motion Accessibility

- Respect `prefers-reduced-motion`: disable parallax/float effects and switch to simple fade transitions when enabled.
- Keep maximum displacement under 40px to avoid disorientation.
- Avoid flashing animations (>3Hz) and ensure focus states remain visible during transitions.
- Document any custom motion tokens in Storybook so QA can verify consistency.

---

## Accessibility Checklist

### Color & Contrast

- [ ] All text meets 4.5:1 contrast ratio (normal text)
- [ ] Large text (18pt+) meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Color is not the only means of conveying information
- [ ] Links are distinguishable from surrounding text

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible (2px solid Emerald Primary)
- [ ] Tab order is logical and intuitive
- [ ] No keyboard traps
- [ ] Skip to main content link provided

### Screen Readers

- [ ] All images have descriptive alt text
- [ ] ARIA labels for icon-only buttons
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Form labels associated with inputs
- [ ] Error messages are announced

### Responsive & Mobile

- [ ] Touch targets are at least 44×44px
- [ ] Content is readable without horizontal scrolling
- [ ] Zoom up to 200% without loss of functionality
- [ ] Text can be resized without breaking layout
- [ ] Mobile navigation is accessible

### Forms

- [ ] Labels are visible and descriptive
- [ ] Required fields are indicated
- [ ] Error messages are clear and helpful
- [ ] Success messages are provided
- [ ] Autocomplete attributes are used

---

## Performance Guidelines

### Image Optimization

**Format**:
- WebP for photos (with JPEG fallback)
- SVG for logos and icons
- PNG for screenshots with transparency

**Sizing**:
- Serve appropriate size for viewport
- Use srcset for responsive images
- Lazy load images below the fold

**Compression**:
- Photos: 80% quality JPEG/WebP
- Screenshots: 85% quality PNG
- Logos: Optimize SVG code

### Loading Strategy

**Critical CSS**: Inline above-the-fold styles

**Fonts**: Preload Inter font files
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

**JavaScript**: Defer non-critical scripts

**Images**: Lazy load with native loading="lazy"

### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.8s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Total Blocking Time | < 200ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Time to Interactive | < 3.8s | Lighthouse |

---

## SEO Guidelines

### Meta Tags

**Title Tag**:
```html
<title>Finance Automation Software UK | AI ERP Integration | FinanceFlo</title>
```
- 50-60 characters
- Include primary keyword
- Include brand name

**Meta Description**:
```html
<meta name="description" content="Transform your finance operations with FinanceFlo's AI+ERP platform. Join 450+ UK businesses achieving 66% cost reduction and 500% ROI boost.">
```
- 150-160 characters
- Include call-to-action
- Include key benefits

**Open Graph**:
```html
<meta property="og:title" content="Finance Automation Software UK | FinanceFlo">
<meta property="og:description" content="Transform your finance operations with AI+ERP integration.">
<meta property="og:image" content="https://financeflo.ai/og-image.jpg">
<meta property="og:url" content="https://financeflo.ai/">
<meta property="og:type" content="website">
```

**Twitter Card**:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Finance Automation Software UK | FinanceFlo">
<meta name="twitter:description" content="Transform your finance operations with AI+ERP integration.">
<meta name="twitter:image" content="https://financeflo.ai/twitter-image.jpg">
```

### Structured Data

**Organization**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FinanceFlo.ai",
  "url": "https://financeflo.ai",
  "logo": "https://financeflo.ai/logo.svg",
  "description": "Finance automation software with AI+ERP integration",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB"
  }
}
```

**Product**:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FinanceFlo",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "Contact for pricing"
  }
}
```

---

## Content Guidelines

### Headline Formulas

**Value Proposition**:
"Transform Your [Outcome] with [Solution]"
- Example: "Transform Your Finance Operations with AI+ERP"

**Benefit-Focused**:
"[Action] [Outcome] in [Timeframe]"
- Example: "Reduce Costs by 66% in 14 Days"

**Problem-Solution**:
"Stop [Pain Point]. Start [Benefit]."
- Example: "Stop Manual Tasks. Start Intelligent Automation."

### CTA Copy

**Primary Actions**:
- "Start Free Trial"
- "Book Consultation"
- "Get Started"
- "Watch Demo"

**Secondary Actions**:
- "Learn More"
- "View Pricing"
- "Read Case Study"
- "Contact Sales"

**Urgency**:
- "Start Your Free Trial Today"
- "Book Your Assessment Now"
- "Limited Spots Available"

### Microcopy

**Form Placeholders**:
- "Enter your work email"
- "Your company name"
- "Tell us about your needs"

**Button States**:
- Default: "Submit"
- Loading: "Submitting..."
- Success: "Submitted ✓"
- Error: "Try Again"

**Trust Indicators**:
- "No credit card required"
- "30-day free trial"
- "Cancel anytime"
- "Setup in 24 hours"

---

## Design QA Checklist

Use this pre-handoff review to keep implementation tight:

1. **Tokens Applied** – Colors, typography, spacing use shared variables/Tailwind utilities only.
2. **Responsive Proof** – Provide Figma frames or screenshots for mobile, tablet, desktop.
3. **Interaction Notes** – Specify hover, focus, motion behaviors for every interactive element.
4. **Accessibility Proof** – Document color contrast results and keyboard paths.
5. **Content Validation** – Ensure copy mirrors the approved messaging + UK spelling.
6. **Asset Delivery** – Attach optimized SVG/PNG/WebP plus any Lottie/JSON animations.
7. **Dev Checklist** – Link to relevant prompt or story so engineers know acceptance criteria.

Archive completed checklists in `docs/testing/financeflo/` for traceability.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-24 | Initial design system creation | Manus AI |

---

*This design system is a living document and will evolve as the product and brand mature.*
