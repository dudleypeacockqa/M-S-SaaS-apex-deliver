import { marketingFeatureIcons } from '../assets/marketing';
import React from 'react';

export const heroPillars = [
  { label: 'CapLiquify FP&A Control Tower' },
  { label: 'ApexDeliver Deal Cloud' },
  { label: 'Sales & Promotion Pricing Studio', badge: 'New' },
  { label: 'Customer & Partner Command Center' },
  { label: 'Events + Community Engine', badge: 'New' },
];

export const heroStats = [
  { value: '14 days', label: 'to full FP&A control tower', detail: 'CapLiquify onboarding sprint' },
  { value: '40%', label: 'faster deal velocity', detail: 'Deal rooms + valuations in ApexDeliver' },
  { value: '3x', label: 'promo conversion lift', detail: 'Sales & Promotion Pricing Studio' },
  { value: 'GBP 2.8M', label: 'working capital unlocked', detail: 'Average per portfolio in year one' },
];

export const platformHighlights = [
  {
    title: 'CapLiquify FP&A Control Tower',
    subtitle: '13-week cash, working-capital automation, and scenario planning with lender-grade exports.',
    bullets: [
      'Automated actuals ingestion from Sage, NetSuite, Xero, and CSV uploads',
      'Variance explanations + guardrail alerts across DSO/DPO/DIO',
      'Drag-and-drop scenario builder with presentation-ready decks',
    ],
    cta: { text: 'See FP&A playbook', link: '/capliquify-fpa', event: 'fpna' },
    badge: 'Foundation',
  },
  {
    title: 'ApexDeliver Deal Cloud',
    subtitle: 'Deal pipeline, valuations, diligence workflows, and PMI handoffs in one command center.',
    bullets: [
      'Unified Kanban, list, and calendar views mapped to your IC stages',
      '47+ ratio valuation suite with AI commentary for IC and boards',
      'Secure data rooms with watermarking, redaction, and approvals',
    ],
    cta: { text: 'Explore deal workflow', link: '/features', event: 'deal-cloud' },
    badge: 'Deal velocity',
  },
  {
    title: 'Sales & Promotion Pricing Studio',
    subtitle: 'Launch targeted promos, quote portals, and pricing guardrails tied directly to cash forecasts.',
    bullets: [
      'Promo templates with floor/ceiling guardrails and approval routing',
      'Self-service quote + contract workflows for distributed teams and partners',
      'Campaign analytics tied to CapLiquify so you see working-capital impact',
    ],
    cta: { text: 'View pricing studio', link: '/sales-promotion-pricing', event: 'pricing' },
    badge: 'New',
  },
  {
    title: 'Customer & Partner Command Center',
    subtitle: 'B2B2C portals for orders, invoices, project updates, and secure document exchange.',
    bullets: [
      'Real-time order tracking, billing status, and collaboration threads',
      'Embedded document signing + watermarking with granular permissions',
      'White-label themes so every portfolio brand looks on-message day one',
    ],
    cta: { text: 'Launch portals', link: '/features', event: 'portal' },
  },
  {
    title: 'Events + Community Engine',
    subtitle: 'Plan summits, masterclasses, and podcast drops tied to deals and GTM plays.',
    bullets: [
      'Multi-track agendas, ticketing, sponsors, and speaker workflows',
      'Member feeds, moderation, reactions, and analytics baked in',
      'Auto-publish podcasts, recaps, and nurture cadences from one place',
    ],
    cta: { text: 'Grow your community', link: '/podcast', event: 'community' },
    badge: 'New',
  },
  {
    title: 'Enterprise Governance & Intelligence',
    subtitle: 'Master admin controls, entitlements, and explainable AI copilots for every workflow.',
    bullets: [
      'Role-based entitlements with region-specific data residency',
      'Immutable audit trails, watermarking, and SOC 2 / ISO 27001 alignment',
      'Embedded copilots with citation links and opt-out controls',
    ],
    cta: { text: 'Review security stack', link: '/security', event: 'security' },
  },
];

export const launchHighlights = [
  {
    title: 'Sales & Promotion Pricing Studio',
    description: 'Bundle-level rules, partner promos, and revenue experiments that roll straight into CapLiquify forecasts.',
    metric: '+32% promo ROI lift across beta customers in eight weeks.',
  },
  {
    title: 'Event Management Hub',
    description: 'Plan summits, manage sponsors, track tickets, and sync actuals back into ApexDeliver and CapLiquify.',
    metric: 'Launch multi-track events in under 48 hours with reusable templates.',
  },
  {
    title: 'Community + Podcast Network',
    description: 'Host gated feeds, audio drops, and leadership content that convert into pipeline and renewals.',
    metric: '5,000+ member invites processed this quarter with built-in moderation.',
  },
];

export const valueSprints = [
  {
    title: 'Sprint 01 - Visibility',
    timeline: 'Days 0-14',
    focus: 'Stand up CapLiquify, stabilize cash, and publish the 13-week view.',
    deliverables: ['System connections + ledger normalization', '13-week direct cash + working-capital cockpit', 'Board-ready "First 100 Days" dashboard'],
  },
  {
    title: 'Sprint 02 - Systemise',
    timeline: 'Days 15-45',
    focus: 'Digitize diligence, valuations, and promos while automation takes over the busywork.',
    deliverables: ['Deal pipeline + valuation suite live in ApexDeliver', 'Secure document room + approvals running', 'Pricing guardrails + promo calendar activated'],
  },
  {
    title: 'Sprint 03 - Scale',
    timeline: 'Days 46-70',
    focus: 'Deploy portals, revenue workspaces, and customer communities.',
    deliverables: ['Customer & partner portals branded + launched', 'Revenue campaign analytics tied to cash impact', 'Community + event programming scheduled'],
  },
  {
    title: 'Sprint 04 - Signal',
    timeline: 'Days 71-100',
    focus: 'Roll up insights for the portfolio, lenders, and GTM teams with repeatable cadences.',
    deliverables: ['Executive reporting cadence + AI copilots', 'Enterprise governance, audit, and compliance guardrails', 'Playbooks for the next acquisition and promotion cycle'],
  },
];

export const personaPlays = [
  {
    title: 'Portfolio CFOs & Finance Leads',
    description: 'Replace fragile spreadsheets with living models and lender-ready packs.',
    bullets: ['13-week cash with variance narratives baked in', 'Working-capital cockpit tied to promo + pricing actions', 'Automated board + lender packs with watermarking'],
  },
  {
    title: 'Deal & Corporate Development Teams',
    description: 'Source, diligence, and close acquisitions with airtight governance.',
    bullets: ['Deal pipeline + scorecards across every stage', 'Valuation studio with 47+ ratios and scenario exports', 'Secure data rooms, AI digest, and PMI task orchestration'],
  },
  {
    title: 'Revenue & Commercial Ops',
    description: 'Spin up promotions, partner pricing, and field quotes without breaking margins.',
    bullets: ['Promotion templates with approval routing + guardrails', 'Quote-to-cash portal with embedded sign + payment options', 'Real-time lift tracking back to CapLiquify forecasts'],
  },
  {
    title: 'Customer, Partner & Community Leaders',
    description: 'Deliver modern experiences that retain customers and create pipeline.',
    bullets: ['Customer & partner command center with live project status', 'Event + community programming tied to CRM + deal data', 'Podcast + content hub to keep audiences engaged'],
  },
];

export const getFeatures = () => [
  {
    icon: marketingFeatureIcons.financialIntelligence,
    title: 'CapLiquify FP&A Engine',
    description:
      'Go beyond traditional accounting with a forward-looking financial planning and analysis engine. Model scenarios, forecast cash with 95%+ accuracy, and generate lender-ready reports in minutes.',
  },
  {
    icon: marketingFeatureIcons.dealPipeline,
    title: 'ApexDeliver M&A Suite',
    description:
      'From AI-powered deal sourcing and automated due diligence to a valuation suite with 47+ financial ratios, ApexDeliver gives you an unfair advantage in a competitive market. Close deals faster, with more confidence.',
  },
  {
    icon: marketingFeatureIcons.secureDocumentRoom,
    title: 'B2B2C Customer Portals',
    description:
      'Empower your customers with self-service portals integrated directly with your ERP. Reduce administrative overhead, improve customer satisfaction, and get paid faster.',
  },
];

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ApexDeliver + CapLiquify',
  description:
    'The 100 Days & Beyond operating system unites CapLiquify FP&A, ApexDeliver deal rooms, Sales & Promotion Pricing, customer portals, events, and community inside one automated platform.',
  brand: {
    '@type': 'Organization',
    name: '100 Days & Beyond',
    url: 'https://100daysandbeyond.com',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: '598.00',
    url: 'https://100daysandbeyond.com/pricing',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '230',
  },
};

