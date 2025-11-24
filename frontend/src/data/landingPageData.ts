import { marketingFeatureIcons } from '../assets/marketing';
import React from 'react';

export const heroPillars = [
  { label: 'ERP Implementation Pods', badge: 'Services' },
  { label: 'CapLiquify FP&A Control Tower' },
  { label: 'ApexDeliver Deal & GTM Cloud' },
  { label: 'AI Consulting & Copilots' },
  { label: 'Managed Support & Training' },
];

export const heroStats = [
  { value: '450+', label: 'ERP & AI projects delivered', detail: 'Sage Intacct, Odoo, NetSuite, Microsoft rollouts' },
  { value: '66%', label: 'manual finance hours removed', detail: 'Automation, copilots, and iPaaS orchestration' },
  { value: '500%', label: 'average ROI boost', detail: 'Working-capital unlock + new revenue plays' },
  { value: '20+', label: 'years as operators', detail: 'Led by Dudley Peacock & UK delivery pod' },
];

export const platformHighlights = [
  {
    title: 'ERP Implementation Pods',
    subtitle: 'Certified Sage Intacct, Odoo, Microsoft, and NetSuite teams who migrate data, build automations, and train your finance org.',
    bullets: [
      'ADAPT blueprint that covers people, process, and governance',
      'Data migration, chart-of-accounts redesign, entity consolidations',
      'Hypercare plus admin-on-demand once you go live',
    ],
    cta: { text: 'See ERP programs', link: '/erp/sage-intacct', event: 'erp' },
    badge: 'Services',
  },
  {
    title: 'AI Consulting & Copilot Desk',
    subtitle: 'Process mining, copilots, and AI assurance layered onto finance, deal, and revenue workflows.',
    bullets: [
      'AI-readiness workshops and governance guardrails',
      'Copilots that summarize meetings, build packs, and action workflows',
      'Prompt library + human-in-the-loop review stations',
    ],
    cta: { text: 'Explore AI services', link: '/ai-enhancement/sage-intacct', event: 'ai' },
    badge: 'AI',
  },
  {
    title: 'CapLiquify FP&A Control Tower',
    subtitle: '13-week cash, working-capital automation, and scenario planning tied directly to your ERP actuals.',
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
    subtitle: 'Deal pipeline, valuations, diligence workflows, and PMI handoffs connected back to ERP and CapLiquify.',
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
    title: 'ERP Fast-Start Pod',
    description: '14-day blueprint that lands Sage Intacct/Odoo, migrates data, and preps CapLiquify for live cash views.',
    metric: 'Go-live in 30 days with ADAPT playbooks and fractional admins.',
  },
  {
    title: 'Copilot Control Room',
    description: 'Dedicated AI pod that designs copilots for finance, deal teams, and revenue ops with governance baked in.',
    metric: '4x faster pack creation + redlines reviewed with human-in-loop guardrails.',
  },
  {
    title: 'Revenue & Community Engine',
    description: 'Run pricing experiments, customer portals, events, and podcasts that feed the same CRM + ERP spine.',
    metric: '300% lift in qualified pipeline measured inside CapLiquify.',
  },
];

export const valueSprints = [
  {
    title: 'Sprint 01 - Blueprint',
    timeline: 'Days 0-14',
    focus: 'Audit ERP + GTM stack, migrate critical data, and stand up CapLiquify for cash visibility.',
    deliverables: ['ADAPT plan + integration map', '13-week direct cash + working-capital cockpit', 'Implementation charter + risk log'],
  },
  {
    title: 'Sprint 02 - Deploy',
    timeline: 'Days 15-45',
    focus: 'Configure ERP, activate CapLiquify guardrails, and launch the first ApexDeliver workspace.',
    deliverables: ['Multi-entity ERP configuration + automations', 'Secure document room + valuation suite', 'Pricing guardrails + promo calendar activated'],
  },
  {
    title: 'Sprint 03 - Automate',
    timeline: 'Days 46-70',
    focus: 'Layer AI copilots, iPaaS flows, and pricing studios that sync with ERP actuals.',
    deliverables: ['AI copilots + workflow automation', 'Partner/customer portals branded + launched', 'Revenue analytics wired into CapLiquify'],
  },
  {
    title: 'Sprint 04 - Scale',
    timeline: 'Days 71-100',
    focus: 'Roll up insights for boards, lenders, and GTM teams with repeatable cadences and managed support.',
    deliverables: ['Executive reporting cadence + managed services plan', 'Enterprise governance + compliance guardrails', 'Playbooks for next acquisition, promo, and hiring cycle'],
  },
];

export const personaPlays = [
  {
    title: 'ERP, CIO & Transformation Leads',
    description: 'Bring every ledger, subsidiary, and process into one modern ERP spine.',
    bullets: ['Certified Sage Intacct/Odoo/NetSuite squads', 'Integration factory with iPaaS guardrails', 'Training + admin-on-demand post go-live'],
  },
  {
    title: 'Finance, CFO & Deal Teams',
    description: 'Land CapLiquify, automate board packs, and manage deals inside ApexDeliver.',
    bullets: ['13-week cash + variance narratives baked in', 'Valuation studio with 47+ ratios and scenario exports', 'Secure data rooms, AI digest, and PMI playbooks'],
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
    icon: marketingFeatureIcons.workflowAutomation,
    title: 'ERP Implementation & Support Pods',
    description:
      'Certified consultants migrate data, design automations, and run enablement so Sage Intacct, Odoo, Microsoft, or NetSuite rollouts stick the landing.',
  },
  {
    icon: marketingFeatureIcons.financialIntelligence,
    title: 'CapLiquify FP&A Engine',
    description:
      'Model scenarios, forecast cash with 95%+ accuracy, and sync working-capital actions directly back into your ERP.',
  },
  {
    icon: marketingFeatureIcons.dealPipeline,
    title: 'ApexDeliver Deal & Revenue Cloud',
    description:
      'Run deal rooms, valuations, pricing studios, and post-close GTM workstreams with AI copilots plus enterprise governance.',
  },
];

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'FinanceFlo ERP Services + CapLiquify & ApexDeliver',
  description:
    'FinanceFlo is the ERP implementation & AI consulting partner behind CapLiquify FP&A and the ApexDeliver deal cloud—uniting services, software, and managed support for the first 100 days and beyond.',
  brand: {
    '@type': 'Organization',
    name: 'FinanceFlo.ai',
    url: 'https://financeflo.ai',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'GBP',
    price: '598.00',
    url: 'https://financeflo.ai/pricing',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '230',
  },
};
