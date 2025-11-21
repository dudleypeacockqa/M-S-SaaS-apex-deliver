import React from 'react';
import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';
import { CTASection } from '../../../components/marketing/CTASection';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DealRoomAlternative: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="DealRoom Alternative | 100 Days & Beyond vs DealRoom"
        description="Compare 100 Days & Beyond against DealRoom. See why 100 Days & Beyond is the best alternative for integrated M&A and FP&A."
        keywords="DealRoom alternative, M&A software comparison, FP&A integration, data room pricing"
        canonical="https://100daysandbeyond.com/compare/dealroom-alternative"
      />
      
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              The Better <span className="text-indigo-600">DealRoom Alternative</span>
            </h1>
            <p className="text-xl text-gray-600">
              Why pay for just a data room when you can get a complete M&A operating system? 
              See how 100 Days & Beyond compares to DealRoom.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-20">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-gray-50 border-b-2 border-gray-200 w-1/3">Feature</th>
                  <th className="p-4 text-center bg-indigo-50 border-b-2 border-indigo-500 w-1/3">
                    <div className="font-bold text-indigo-900 text-lg">100 Days & Beyond</div>
                  </th>
                  <th className="p-4 text-center bg-gray-50 border-b-2 border-gray-200 w-1/3">
                    <div className="font-bold text-gray-600 text-lg">DealRoom</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Integrated FP&A (CapLiquify)', us: true, them: false },
                  { feature: '13-Week Cash Forecasting', us: true, them: false },
                  { feature: 'Virtual Data Room (VDR)', us: true, them: true },
                  { feature: 'Deal Pipeline Management', us: true, them: true },
                  { feature: 'Sales & Promotion Pricing', us: true, them: false },
                  { feature: 'Post-Merger Integration (PMI)', us: true, them: true },
                  { feature: 'Customer Portals', us: true, them: false },
                  { feature: 'Events & Community Engine', us: true, them: false },
                  { feature: 'Pricing Transparency', us: 'Starting at £598/mo', them: 'Contact Sales' },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b border-gray-100 font-medium text-gray-900">{row.feature}</td>
                    <td className="p-4 border-b border-gray-100 text-center bg-indigo-50/30">
                      {row.us === true ? (
                        <Check className="w-6 h-6 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="font-bold text-indigo-900">{row.us}</span>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100 text-center">
                      {row.them === true ? (
                        <Check className="w-6 h-6 text-gray-400 mx-auto" />
                      ) : row.them === false ? (
                        <X className="w-6 h-6 text-red-300 mx-auto" />
                      ) : (
                        <span className="text-gray-500">{row.them}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Differentiators */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Intelligence First</h3>
              <p className="text-gray-600">
                We don't just store documents; we analyze your financials. Our built-in FP&A engine (CapLiquify) gives you a live 13-week cash forecast and working capital insights that DealRoom lacks.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue & Pricing Control</h3>
              <p className="text-gray-600">
                Fix the top line while you manage the deal. Our Sales & Promotion Pricing Studio lets you deploy pricing guardrails and promotions to boost value immediately post-close.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparent, Scalable Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or mandatory enterprise contracts. Start with our FP&A tier and scale into the full M&A suite when you're ready. Pricing is public and straightforward.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/pricing"
              className="text-indigo-600 font-semibold hover:text-indigo-800"
            >
              View detailed pricing comparisons &rarr;
            </Link>
          </div>
        </div>
      </div>

      <CTASection 
        headline="Ready to switch to a complete OS?"
        description="Join the dealmakers who have upgraded from static data rooms to active financial intelligence."
        primaryCtaText="Start Free Trial"
        primaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

