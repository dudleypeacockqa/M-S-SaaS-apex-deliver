import type { SubscriptionTier } from '../services/billingService'

export type BillingCycle = 'monthly' | 'annual'

export interface PricingTierDefinition {
  id: 'starter' | 'professional' | 'enterprise' | 'community'
  tierKey?: SubscriptionTier
  name: string
  monthlyPrice?: number
  setupFee?: number
  description: string
  features: string[]
  highlighted?: boolean
  cta?: 'get-started' | 'contact'
  ctaLabel?: string
  ctaLink?: string
}

export const ANNUAL_DISCOUNT_RATE = 0.17

export const basePricingTiers: PricingTierDefinition[] = [
  {
    id: 'starter',
    tierKey: 'starter',
    name: 'CapLiquify FP&A',
    monthlyPrice: 598,
    setupFee: 2500,
    description: 'For finance teams needing immediate cash flow visibility and working capital control',
    features: [
      '13-Week Direct Cash Forecasting',
      'Working Capital Drivers (DSO/DPO/DIO)',
      'AR/AP Roll-Forwards & Ageing',
      'Multi-Scenario Modeling',
      'Lender-Ready PDF Pack Generation',
      'ERP Integration (Sage Intacct, Odoo, CSV)',
      'Single Entity/Currency',
      'Email & Chat Support',
    ],
    cta: 'get-started',
  },
  {
    id: 'professional',
    tierKey: 'professional',
    name: 'ApexDeliver Professional',
    monthlyPrice: 1598,
    setupFee: 7500,
    description: 'For active dealmakers managing multiple M&A projects',
    features: [
      'Everything in CapLiquify FP&A',
      'Unlimited M&A Deals',
      'AI-Powered Deal Sourcing & Matching',
      'Secure Data Room (100GB, watermarking)',
      'Multi-Method Valuation Suite (DCF, Comps, Precedents)',
      'Financial Intelligence Engine (47+ ratios)',
      'Deal Pipeline & Collaboration',
      'Task & Workflow Automation',
      'Up to 3 Entities',
      'Priority Support',
    ],
    highlighted: true,
    cta: 'get-started',
  },
  {
    id: 'enterprise',
    tierKey: 'enterprise',
    name: 'ApexDeliver Enterprise',
    monthlyPrice: 2997,
    setupFee: 15000,
    description: 'For large organizations and PE firms',
    features: [
      'Everything in Professional',
      'Unlimited Team Members & Entities',
      'PMI Finance Ops Stabilisation (Option B)',
      'Advanced RBAC & Permissions',
      'Custom Workflow Templates',
      'Automated Document Generation',
      'API Access & iPaaS Integrations',
      'Unlimited Storage',
      'SSO (SAML/OAuth) & Advanced Security',
      'Dedicated Account Manager',
      '99.95% Uptime SLA',
    ],
    cta: 'contact',
    ctaLabel: 'Contact Sales',
    ctaLink: '/contact',
  },
  {
    id: 'community',
    tierKey: 'community',
    name: 'Portfolio / Community Leader',
    setupFee: 30000,
    description: 'For PE/FO managing portfolios of businesses',
    features: [
      'Everything in Enterprise',
      'Centralized Portfolio Dashboard',
      'Cross-Company Analytics & Consolidation',
      'Multi-Currency Support',
      'Covenant Libraries by Lender',
      'Content Creation & Podcast Studio',
      'Private Community Hosting',
      'Custom Branding & White-Label',
      'White-Glove Onboarding',
      'Quarterly Business Reviews',
    ],
    cta: 'contact',
    ctaLabel: 'Contact Sales',
    ctaLink: '/contact',
  },
]

export const calculateAnnualPrice = (monthly: number): number => {
  const discounted = monthly * 12 * (1 - ANNUAL_DISCOUNT_RATE)
  return Math.round(discounted)
}

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-GB', { minimumFractionDigits: 0 })
}

