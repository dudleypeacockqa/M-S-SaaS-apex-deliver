import React from 'react';
import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';
import { CTASection } from '../../../components/marketing/CTASection';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MidaxoAlternative: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="Midaxo Alternative | 100 Days & Beyond vs Midaxo"
        description="Compare 100 Days & Beyond against Midaxo. Discover a more agile, finance-first approach to M&A and post-merger integration."
        keywords="Midaxo alternative, M&A software comparison, PMI software, deal management platform"
        canonical="https://financeflo.ai/compare/midaxo-alternative"
      />
      
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              The Agile <span className="text-indigo-600">Midaxo Alternative</span>
            </h1>
            <p className="text-xl text-gray-600">
              Midaxo is great for process, but 100 Days & Beyond drives <strong>value</strong>. 
              See why finance leaders prefer our integrated FP&A and execution platform.
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
                    <div className="font-bold text-gray-600 text-lg">Midaxo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Integrated FP&A (CapLiquify)', us: true, them: false },
                  { feature: 'Real-time Cash Forecasting', us: true, them: false },
                  { feature: 'PMI Project Management', us: true, them: true },
                  { feature: 'Virtual Data Room', us: true, them: true },
                  { feature: 'B2B2C Customer Portals', us: true, them: false },
                  { feature: 'Sales Promotion Engine', us: true, them: false },
                  { feature: 'Community & Event Mgmt', us: true, them: false },
                  { feature: 'Deployment Speed', us: 'Days (Self-serve)', them: 'Weeks/Months' },
                  { feature: 'Entry Price', us: '£598/mo', them: '$$$$ (Enterprise)' },
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actionable Financials</h3>
              <p className="text-gray-600">
                Midaxo tracks tasks; we track cash. Our embedded FP&A module connects directly to your ERP to give you a live view of the financial impact of every integration milestone.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Engines Included</h3>
              <p className="text-gray-600">
                Don't just integrate; grow. Use our Sales & Promotion Pricing Studio and Customer Portals to launch new offers and improve customer retention during the critical transition period.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Built for the Mid-Market</h3>
              <p className="text-gray-600">
                Enterprise power without the enterprise bloat. We offer a self-serve start with enterprise scaling capabilities, making us perfect for agile deal teams and PE portfolios.
              </p>
            </div>
          </div>
          
           <div className="text-center">
            <Link
              to="/features"
              className="text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Explore our full feature set &rarr;
            </Link>
          </div>

        </div>
      </div>

      <CTASection 
        headline="Experience the ApexDeliver difference."
        description="Start your 14-day free trial today and see why agile teams are switching."
        primaryCtaText="Start Free Trial"
        primaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

