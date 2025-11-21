import React from 'react';
import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';
import { CTASection } from '../../../components/marketing/CTASection';
import { Check } from 'lucide-react';

export const SolutionDealTeam: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="M&A Software for Deal Teams | Velocity & Virtual Data Rooms"
        description="Close deals faster with ApexDeliver. AI-powered Virtual Data Rooms, automated diligence checklists, and integrated valuation models."
        keywords="deal team software, VDR, virtual data room, M&A pipeline management, due diligence automation"
        canonical="https://100daysandbeyond.com/solutions/deal-team"
      />
      
      <div className="bg-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 font-bold tracking-wide uppercase text-sm">For Corporate Dev & PE</span>
            <h1 className="text-4xl font-extrabold sm:text-5xl mt-2 mb-6">
              Deal Velocity <span className="text-indigo-300">Unleashed</span>
            </h1>
            <p className="text-xl text-indigo-100">
              Stop chasing documents. Start closing. ApexDeliver unifies your pipeline, data room, and valuation models in one secure command center.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="col-span-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to execute</h2>
                <p className="text-gray-600 mb-8">
                    From the first NDA to the final signature, we handle the chaos so you can focus on the negotiation.
                </p>
                <ul className="space-y-4">
                    {[
                        'AI-Powered Redaction',
                        'Kanban Pipeline View',
                        'Integrated DCF & Comps',
                        'Mobile-Ready VDR',
                        'One-Click Teaser Generation'
                    ].map(item => (
                        <li key={item} className="flex items-center gap-3 font-medium text-gray-800">
                            <div className="bg-emerald-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-span-2 grid sm:grid-cols-2 gap-6">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Secure Data Rooms</h3>
                    <p className="text-sm text-gray-600">
                        Bank-grade security with granular permissions. Track exactly who viewed which document and for how long.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Valuation Suite</h3>
                    <p className="text-sm text-gray-600">
                        Don't use offline Excel sheets. Build your models directly in the platform, linked to live financial data.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Pipeline Collaboration</h3>
                    <p className="text-sm text-gray-600">
                        Tag legal, finance, and ops on specific deal stages. Keep everyone aligned without endless email chains.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">PMI Handoff</h3>
                    <p className="text-sm text-gray-600">
                        Seamlessly convert diligence findings into a Post-Merger Integration project plan.
                    </p>
                 </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection 
        headline="Close your next deal 40% faster."
        description="See why modern deal teams are ditching legacy data rooms."
        primaryCtaText="Start Free Trial"
        primaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

