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
    challenge: 'Deal pipeline scattered across Excel, email, and shared drives leading to missed opportunities and slow execution.',
    solution: 'Implemented ApexDeliver centralized pipeline with automated tracking and deal flow management.',
    results: {
      metric1: { value: '40%', label: 'Faster deal closure' },
      metric2: { value: '27 days', label: 'Average close time' },
      metric3: { value: '100%', label: 'Team visibility' },
    },
    quote: "ApexDeliver transformed how we manage our deal flow. We're closing deals 40% faster and our team has full visibility into the pipeline.",
    quoteName: 'John Davidson',
    quoteTitle: 'Managing Partner',
    logoUrl: '/assets/brand/placeholder-logo-1.svg', // Using placeholder for now
    publishedDate: '2025-10-15',
    featured: true,
  },
  {
    id: 'cfo-cash-forecasting',
    customerName: 'TechGrowth SaaS',
    industry: 'SaaS',
    customerSize: '$50M ARR',
    challenge: 'Manual 13-week cash forecasting took 20 hours/week with prone-to-error spreadsheets.',
    solution: 'Automated cash forecasting with CapLiquify FP&A module.',
    results: {
      metric1: { value: '20 hrs', label: 'Saved per week' },
      metric2: { value: '95%', label: 'Forecast accuracy' },
      metric3: { value: '$10M', label: 'Credit line secured' },
    },
    quote: "CapLiquify cut our forecasting time from 20 hours to 2 hours. The accuracy improvements helped us secure a $10M credit line.",
    quoteName: 'Sarah Reynolds',
    quoteTitle: 'CFO',
    logoUrl: '/assets/brand/placeholder-logo-2.svg',
    publishedDate: '2025-10-20',
    featured: true,
  },
  {
    id: 'ma-advisor-deal-closure',
    customerName: 'Park Advisory',
    industry: 'M&A Advisory',
    customerSize: 'Solo Practitioner',
    challenge: 'Lacked enterprise-grade tools to compete with larger firms for premium mandates.',
    solution: 'Leveraged ApexDeliver for professional deal management and valuation suite.',
    results: {
      metric1: { value: '3 deals', label: 'Closed in 6 months' },
      metric2: { value: '300%', label: 'ROI on platform' },
    },
    quote: "As a solo advisor, I competed against big firms. ApexDeliver gave me enterprise-grade tools at a fraction of the cost.",
    quoteName: 'Michael Park',
    quoteTitle: 'M&A Advisor',
    logoUrl: '/assets/brand/placeholder-logo-3.svg',
    publishedDate: '2025-10-25',
    featured: false,
  },
  {
    id: 'pmi-success-rate',
    customerName: 'Equinox Holdings',
    industry: 'Private Equity',
    customerSize: '8 acquisitions/year',
    challenge: 'Post-merger integration was chaotic with 40% of deals underperforming targets.',
    solution: 'Standardized PMI process using ApexDeliver PMI toolkit and checklists.',
    results: {
      metric1: { value: '90%', label: 'Success rate' },
      metric2: { value: '30%', label: 'Faster integration' },
    },
    quote: "Our integration process was ad-hoc. ApexDeliver's PMI tools standardized our approach. Our deal success rate jumped from 60% to 90%.",
    quoteName: 'Emma Thompson',
    quoteTitle: 'VP of Operations',
    logoUrl: '/assets/brand/placeholder-logo-4.svg',
    publishedDate: '2025-10-28',
    featured: true,
  },
  {
    id: 'working-capital-optimization',
    customerName: 'NextGen Manufacturing',
    industry: 'Manufacturing',
    customerSize: '$200M Revenue',
    challenge: '$5M cash tied up in working capital inefficiencies post-acquisition.',
    solution: 'CapLiquify working capital drivers analysis to identify release opportunities.',
    results: {
      metric1: { value: '$3.2M', label: 'Cash released' },
      metric2: { value: '90 days', label: 'Time to value' },
    },
    quote: "We identified $5M in trapped cash. CapLiquify helped us release $3.2M in 90 days through inventory and receivables optimization.",
    quoteName: 'David Chen',
    quoteTitle: 'CFO',
    logoUrl: '/assets/brand/placeholder-logo-5.svg',
    publishedDate: '2025-11-01',
    featured: false,
  }
];

