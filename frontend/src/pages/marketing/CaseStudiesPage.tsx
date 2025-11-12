import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { trackCtaClick } from '../../lib/analytics';
import { StructuredData } from '../../components/common/StructuredData';

interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  quote: string;
  author: string;
  authorTitle: string;
}

export const CaseStudiesPage: React.FC = () => {
  const caseStudies: CaseStudy[] = [
    {
      company: 'TechVentures PE',
      industry: 'Private Equity',
      challenge:
        'Managing a portfolio of 12 manufacturing companies with inconsistent financial reporting, poor cash visibility, and lengthy post-merger integration cycles averaging 18+ months.',
      solution:
        'Deployed CapLiquify FP&A across all portfolio companies for standardized 13-week cash forecasting, working capital optimization, and lender-ready reporting. Used ApexDeliver Enterprise for centralized portfolio management and PMI tracking.',
      results: [
        {
          metric: '75%',
          value: 'Faster PMI',
          description: 'Reduced post-merger integration from 18 months to 4.5 months',
        },
        {
          metric: '£8.2M',
          value: 'Cash Unlocked',
          description: 'Released working capital through DSO/DPO optimization',
        },
        {
          metric: '95%',
          value: 'Forecast Accuracy',
          description: 'Achieved 95%+ accuracy on 13-week cash forecasts across portfolio',
        },
      ],
      quote:
        'CapLiquify transformed how we manage our portfolio. We went from flying blind on cash to having real-time visibility across 12 companies. The PMI acceleration alone paid for the platform 10x over.',
      author: 'James Richardson',
      authorTitle: 'Managing Partner, TechVentures PE',
    },
    {
      company: 'Precision Manufacturing Group',
      industry: 'Manufacturing & Distribution',
      challenge:
        'Post-acquisition chaos with 3 recent bolt-on acquisitions, each using different ERPs (Sage, Odoo, Excel). Cash flow was unpredictable, pricing was inconsistent, and customers were frustrated with manual quote processes.',
      solution:
        'Implemented CapLiquify FP&A for unified cash forecasting and working capital management. Deployed Sales & Promotion Pricing module with customer portals for self-service ordering and real-time quotes.',
      results: [
        {
          metric: '60%',
          value: 'Self-Service',
          description: '60% of customers now use portals for orders and invoices',
        },
        {
          metric: '42 → 28',
          value: 'DSO Reduction',
          description: 'Reduced Days Sales Outstanding from 42 to 28 days',
        },
        {
          metric: '25%',
          value: 'Price Realization',
          description: 'Improved price realization through dynamic pricing engine',
        },
      ],
      quote:
        'We acquired 3 companies in 18 months and were drowning in spreadsheets. CapLiquify gave us a single source of truth for cash and pricing. Our customers love the portals, and we\'ve unlocked millions in working capital.',
      author: 'Sarah Chen',
      authorTitle: 'CFO, Precision Manufacturing Group',
    },
    {
      company: 'Horizon Capital Partners',
      industry: 'Buy & Build Strategy',
      challenge:
        'Executing a buy-and-build strategy in the professional services sector with 6 acquisitions planned over 24 months. Needed to accelerate due diligence, improve valuation accuracy, and standardize PMI processes.',
      solution:
        'Used ApexDeliver Professional for AI-powered due diligence, valuation modeling with 47+ financial ratios, and secure document rooms. Deployed CapLiquify FP&A for each acquisition to stabilize cash flow during PMI.',
      results: [
        {
          metric: '50%',
          value: 'Faster DD',
          description: 'Reduced due diligence cycle from 8 weeks to 4 weeks',
        },
        {
          metric: '6/6',
          value: 'Successful Deals',
          description: 'Completed all 6 acquisitions on time and under budget',
        },
        {
          metric: '100 Days',
          value: 'PMI Standard',
          description: 'Standardized PMI process across all acquisitions',
        },
      ],
      quote:
        'ApexDeliver is our competitive advantage. We move faster than our competitors on due diligence, and CapLiquify ensures every acquisition is cash-positive within 100 days. It\'s the ultimate buy-and-build platform.',
      author: 'Michael Torres',
      authorTitle: 'Investment Director, Horizon Capital Partners',
    },
    {
      company: 'Regional Distribution Co.',
      industry: 'Wholesale Distribution',
      challenge:
        'Family-owned business preparing for sale with messy financials, no cash forecasting, and manual pricing processes. Potential buyers were concerned about working capital and pricing discipline.',
      solution:
        'Implemented CapLiquify FP&A to create lender-ready financial packs, optimize working capital, and demonstrate cash flow predictability. Added Sales & Promotion Pricing to show pricing sophistication.',
      results: [
        {
          metric: '£12M',
          value: 'Exit Value',
          description: 'Increased valuation by £2.4M through improved financials',
        },
        {
          metric: '3 Months',
          value: 'Prep Time',
          description: 'Prepared for sale in 3 months vs. 12+ months typical',
        },
        {
          metric: '5 Offers',
          value: 'Competitive Bids',
          description: 'Attracted 5 qualified buyers with clean data room',
        },
      ],
      quote:
        'We thought it would take a year to get our financials ready for sale. CapLiquify had us ready in 3 months with lender-ready packs that impressed every buyer. We got multiple offers and a 20% premium.',
      author: 'David Palmer',
      authorTitle: 'Owner, Regional Distribution Co.',
    },
    {
      company: 'Growth Equity Fund',
      industry: 'Growth Equity',
      challenge:
        'Investing in high-growth SaaS and tech companies that needed operational support post-investment. Portfolio companies lacked financial discipline, cash runway visibility, and pricing strategies.',
      solution:
        'Deployed CapLiquify FP&A as part of the value-add package for all portfolio companies. Provided 13-week cash forecasting, scenario planning, and working capital optimization to extend runway and improve unit economics.',
      results: [
        {
          metric: '18 Months',
          value: 'Extended Runway',
          description: 'Average cash runway extended from 12 to 18 months',
        },
        {
          metric: '8/10',
          value: 'Exits',
          description: '8 out of 10 portfolio companies achieved successful exits',
        },
        {
          metric: '3.2x',
          value: 'MOIC',
          description: 'Achieved 3.2x multiple on invested capital',
        },
      ],
      quote:
        'CapLiquify is now part of our standard playbook. We deploy it in every portfolio company within 30 days of investment. It gives founders the financial discipline they need to scale without burning cash.',
      author: 'Lisa Anderson',
      authorTitle: 'Partner, Growth Equity Fund',
    },
  ];

  const caseStudiesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: caseStudies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: `${study.company} Case Study`,
        description: `${study.industry}: ${study.challenge}`,
        url: `https://100daysandbeyond.com/case-studies#case-study-${index + 1}`,
      },
    })),
  };

  return (
    <MarketingLayout>
      <SEO
        title="Case Studies | ApexDeliver + CapLiquify Success Stories"
        description="See how private equity firms, dealmakers, and finance leaders use ApexDeliver and CapLiquify to accelerate M&A, optimize cash flow, and drive portfolio value."
        keywords="M&A case studies, private equity success stories, cash flow optimization, PMI case studies, buy and build"
      />
      <StructuredData json={caseStudiesSchema} id="case-studies-schema" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Real Results from Real Dealmakers
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              See how private equity firms, strategic acquirers, and finance leaders use ApexDeliver + CapLiquify to accelerate M&A, optimize cash flow, and drive portfolio value.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-5xl font-bold text-emerald-400">75%</div>
                <div className="text-indigo-200 mt-2">Faster PMI Cycles</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-emerald-400">£8.2M</div>
                <div className="text-indigo-200 mt-2">Avg. Cash Unlocked</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-emerald-400">95%+</div>
                <div className="text-indigo-200 mt-2">Forecast Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                id={`case-study-${index + 1}`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{study.company}</h2>
                      <div className="text-indigo-100 font-semibold">{study.industry}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-semibold">
                      Case Study #{index + 1}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Challenge */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                        !
                      </span>
                      The Challenge
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        →
                      </span>
                      The Solution
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                        ✓
                      </span>
                      The Results
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {study.results.map((result, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg border border-emerald-200"
                        >
                          <div className="text-3xl font-bold text-emerald-900 mb-2">
                            {result.metric}
                          </div>
                          <div className="text-emerald-700 font-semibold mb-2">{result.value}</div>
                    <div className="text-sm text-emerald-700">{result.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
                    <p className="text-gray-800 italic text-lg leading-relaxed mb-4">
                      "{study.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {study.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{study.author}</div>
                        <div className="text-gray-600 text-sm">{study.authorTitle}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of dealmakers, finance leaders, and private equity firms who trust ApexDeliver + CapLiquify to accelerate their M&A and optimize their cash flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('start-trial', 'case-studies-cta')}
            >
              Start Your Free 14-Day Trial
            </Link>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('schedule-demo', 'case-studies-cta')}
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
