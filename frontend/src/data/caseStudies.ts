export interface CaseStudy {
  id: string;
  customerName: string;
  industry: string;
  customerSize: string;
  challenge: string;
  solution: string;
  results: {
    metric1: { value: string; label: string };
    metric2: { value: string; label: string };
    metric3?: { value: string; label: string };
  };
  quote: string;
  quoteName: string;
  quoteTitle: string;
  logoUrl: string;
  screenshotUrl?: string;
  publishedDate: string;
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'pe-firm-deal-velocity',
    customerName: 'Horizon Capital Partners',
    industry: 'Private Equity',
    customerSize: '50+ deals/year',
    challenge: 'Deal pipeline scattered across Excel, email, shared drives',
    solution: 'Centralized pipeline in ApexDeliver with automated tracking',
    results: {
      metric1: { value: '40%', label: 'Faster deal closure' },
      metric2: { value: '27 days', label: 'Average close time' },
      metric3: { value: '100%', label: 'Team visibility' },
    },
    quote: "ApexDeliver transformed how we manage our deal flow. We're closing deals 40% faster and our team has full visibility into the pipeline.",
    quoteName: 'John Davidson',
    quoteTitle: 'Managing Partner',
    logoUrl: '/assets/brand/logos/horizon-capital.svg',
    publishedDate: '2025-10-15',
    featured: true,
  },
  {
    id: 'cfo-cash-forecasting',
    customerName: 'TechGrowth Solutions',
    industry: 'SaaS',
    customerSize: '$50M ARR',
    challenge: 'Manual 13-week cash forecasting took 20 hours/week',
    solution: 'Automated cash forecasting with CapLiquify FP&A',
    results: {
      metric1: { value: '20 hrs', label: 'Saved per week' },
      metric2: { value: '95%', label: 'Forecast accuracy' },
      metric3: { value: '$10M', label: 'Credit secured' },
    },
    quote: "CapLiquify cut our forecasting time from 20 hours to 2 hours. The accuracy improvements helped us secure a $10M credit line.",
    quoteName: 'Sarah Reynolds',
    quoteTitle: 'CFO',
    logoUrl: '/assets/brand/logos/techgrowth.svg',
    publishedDate: '2025-10-20',
    featured: true,
  },
  {
    id: 'ma-advisor-deal-closure',
    customerName: 'Park Advisory',
    industry: 'M&A Advisory',
    customerSize: 'Solo Practitioner',
    challenge: 'Lacked enterprise tools, lost deals to larger firms',
    solution: 'Used ApexDeliver for deal management + valuation suite',
    results: {
      metric1: { value: '300%', label: 'Deal closure rate' },
      metric2: { value: '3 deals', label: 'Closed in 6 months' },
      metric3: { value: '10x', label: 'ROI on platform' },
    },
    quote: "As a solo advisor, I competed against big firms. ApexDeliver gave me enterprise-grade tools at £279/month. I closed 3 deals and paid for 10 years of the platform.",
    quoteName: 'Michael Park',
    quoteTitle: 'M&A Advisor',
    logoUrl: '/assets/brand/logos/park-advisory.svg',
    publishedDate: '2025-10-25',
    featured: false,
  },
  {
    id: 'pmi-success-rate',
    customerName: 'Equilibrium Partners',
    industry: 'Private Equity',
    customerSize: '8 acquisitions/year',
    challenge: 'Post-merger integration chaotic, 40% of deals underperformed',
    solution: 'PMI toolkit with task management, integration checklists',
    results: {
      metric1: { value: '90%', label: 'PMI success rate' },
      metric2: { value: '30%', label: 'Faster integration' },
      metric3: { value: '100%', label: 'Compliance' },
    },
    quote: "Our integration process was ad-hoc. ApexDeliver's PMI tools standardized our approach. Our deal success rate jumped from 60% to 90%.",
    quoteName: 'Emma Thompson',
    quoteTitle: 'VP of Operations',
    logoUrl: '/assets/brand/logos/equilibrium.svg',
    publishedDate: '2025-11-01',
    featured: true,
  },
  {
    id: 'working-capital-optimization',
    customerName: 'NexGen Manufacturing',
    industry: 'Manufacturing',
    customerSize: '$100M Revenue',
    challenge: '$5M cash tied up in working capital inefficiencies',
    solution: 'CapLiquify working capital drivers analysis',
    results: {
      metric1: { value: '$3.2M', label: 'Cash released' },
      metric2: { value: '90 days', label: 'Time to impact' },
      metric3: { value: '15%', label: 'Inventory reduction' },
    },
    quote: "We identified $5M in trapped cash. CapLiquify helped us release $3.2M in 90 days through inventory and receivables optimization.",
    quoteName: 'David Chen',
    quoteTitle: 'CFO',
    logoUrl: '/assets/brand/logos/nexgen.svg',
    publishedDate: '2025-11-05',
    featured: false,
  },
];
