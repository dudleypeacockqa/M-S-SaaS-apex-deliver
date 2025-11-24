import React from 'react';
import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';
import { CTASection } from '../../../components/marketing/CTASection';
import { Check } from 'lucide-react';

export const SolutionDealTeam: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="Deal Team Workspace | ApexDeliver + FinanceFlo Operators"
        description="FinanceFlo takes ERP + CapLiquify telemetry and pipes it into ApexDeliver so corp dev, PE, and strategic deal teams run sourcing, diligence, valuations, and PMI from one command center."
        keywords="deal team software, ApexDeliver, virtual data room, valuation suite, PMI tracking, FinanceFlo"
        canonical="https://financeflo.ai/solutions/deal-team"
      />
      
      <div className="bg-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 font-bold tracking-wide uppercase text-sm">FinanceFlo for Corp Dev & PE</span>
            <h1 className="text-4xl font-extrabold sm:text-5xl mt-2 mb-6">
              CapLiquify numbers driving ApexDeliver deal velocity.
            </h1>
            <p className="text-xl text-indigo-100">
              When FinanceFlo runs your ERP + CapLiquify stack, ApexDeliver inherits live cash, KPIs, and promos so sourcing, diligence, valuations, and PMI stay grounded in reality.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="col-span-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Built on FinanceFlo’s data spine</h2>
                <p className="text-gray-600 mb-8">
                    CapLiquify forecasts, ERP telemetry, and pricing programs flow into ApexDeliver. Deal teams stay aligned with finance, GTM, and legal without duplicating work.
                </p>
                <ul className="space-y-4">
                    {[
                        'AI-powered redaction + watermarking',
                        'Kanban + timeline pipeline views',
                        'Integrated DCF, comps, and scenario packs',
                        'Live CapLiquify metrics inside the VDR',
                        'One-click teasers and NDAs tied to contacts'
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
                        FinanceFlo manages permissions, watermarking, and audit logs so corp dev, lenders, and buyers trust every asset.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Valuation Suite</h3>
                    <p className="text-sm text-gray-600">
                        Build DCF, comps, and scenario packs on top of live CapLiquify numbers—no offline Excel risk.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Pipeline Collaboration</h3>
                    <p className="text-sm text-gray-600">
                        Tag legal, finance, GTM, and operations inside ApexDeliver. Every note, task, and approval stays tied to the deal.
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">PMI Handoff</h3>
                    <p className="text-sm text-gray-600">
                        Convert diligence findings into PMI projects with CapLiquify KPIs and ApexDeliver automations for Day 1 execution.
                    </p>
                 </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection 
        headline="Let FinanceFlo run your deal workspace"
        description="Book the implementation blueprint to align ERP, CapLiquify, and ApexDeliver for your corp dev or PE team. Spin up the guided trial to see live metrics in the VDR and valuation suite."
        primaryCtaText="Book Implementation Blueprint"
        primaryCtaLink="/contact"
        secondaryCtaText="Start CapLiquify + ApexDeliver Trial"
        secondaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

