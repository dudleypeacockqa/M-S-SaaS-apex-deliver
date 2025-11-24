import React from 'react';
import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';
import { CTASection } from '../../../components/marketing/CTASection';
import { FeatureCard } from '../../../components/marketing/FeatureCard';
import { marketingFeatureIcons } from '../../../assets/marketing';

export const SolutionCFO: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="FinanceFlo CFO Control Tower | ERP + CapLiquify + ApexDeliver"
        description="FinanceFlo helps CFOs migrate Sage Intacct/Odoo/Microsoft, wire CapLiquify 13-week cash guardrails, and plug those numbers straight into ApexDeliver deal & GTM workflows."
        keywords="CFO ERP implementation, CapLiquify FP&A, ApexDeliver deal room, 13-week cash forecast, FinanceFlo"
        canonical="https://financeflo.ai/solutions/cfo"
      />
      
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">FinanceFlo CFO Control Tower</span>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-2 mb-6">
              ERP data + CapLiquify guardrails feeding ApexDeliver deal workflows.
            </h1>
            <p className="text-xl text-gray-600">
              We migrate your ERP, wire CapLiquify 13-week cash, and route that telemetry into ApexDeliver so you run cash, diligence, and GTM programs from one operator-led stack.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    📊
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ERP Blueprint + Migration</h3>
                <p className="text-gray-600">
                    FinanceFlo pods migrate Sage Intacct, Odoo, Microsoft, or NetSuite and hand you a clean ledger plus governance and reporting packs in days.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    🛡️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">CapLiquify Guardrails</h3>
                <p className="text-gray-600">
                    13-week cash, working-capital alerts, and lender-ready packs auto-sync with your ERP actuals so covenants and board decks are always live.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    🏦
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ApexDeliver Hand-off</h3>
                <p className="text-gray-600">
                    The same data fuels ApexDeliver deal rooms, valuations, pricing, and PMI dashboards so diligence and GTM workstreams never re-enter spreadsheets.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Blueprint → CapLiquify → ApexDeliver</h2>
                <p className="text-lg text-gray-600 mb-6">
                    The FinanceFlo engagement model pairs ERP migration with CapLiquify configuration and ApexDeliver activation. Cash telemetry flows into deal rooms, valuations, promos, and community workspaces without manual exports.
                </p>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>ERP actuals + CapLiquify forecasts as the single source of truth</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>Secure sharing with auditors, lenders, and buy-side partners</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>Post-merger integration dashboards tied to cash and GTM plans</span>
                    </li>
                </ul>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center text-slate-400">
                [Dashboard Mockup Placeholder]
            </div>
         </div>
      </div>

      <CTASection 
        headline="Book the FinanceFlo CFO blueprint"
        description="Scope your ERP rollout, CapLiquify guardrails, and ApexDeliver orchestration with the same operators who will run the migration and managed support."
        primaryCtaText="Book Implementation Blueprint"
        primaryCtaLink="/contact"
        secondaryCtaText="Start CapLiquify + ApexDeliver Trial"
        secondaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

