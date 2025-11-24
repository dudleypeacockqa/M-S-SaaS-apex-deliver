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
        title="M&A for CFOs | 13-Week Cash Forecasting & Financial Control"
        description="The only M&A platform built for finance leaders. Automate 13-week cash forecasts, manage working capital, and present board-ready financials."
        keywords="CFO software, 13-week cash forecast, working capital management, M&A finance tools"
        canonical="https://financeflo.ai/solutions/cfo"
      />
      
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Built for Finance Leaders</span>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-2 mb-6">
              Control Cash, <span className="text-indigo-600">Then Close Deals</span>
            </h1>
            <p className="text-xl text-gray-600">
              Stop relying on disconnected spreadsheets. CapLiquify gives you a live 13-week cash view so you can drive strategy, not just report history.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    📊
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automated 13-Week Cash</h3>
                <p className="text-gray-600">
                    Direct sync with Sage, Xero, and NetSuite. No more manual roll-forwards or broken formulas on Sunday nights.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    🛡️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Working Capital Guardrails</h3>
                <p className="text-gray-600">
                    Set alerts for DSO/DPO drift. If cash dips below your threshold, you'll know weeks in advance.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-2xl">
                    🏦
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lender-Ready Packs</h3>
                <p className="text-gray-600">
                    Export covenant compliance reports and board decks with one click. impress your debt providers.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">From FP&A to M&A Execution</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Once your house is in order, graduate into ApexDeliver. Your financial data feeds directly into the Virtual Data Room and Valuation Suite, ensuring due diligence is always based on live, accurate numbers.
                </p>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>Single source of truth for deal teams</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>Secure sharing with external auditors</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span>Post-merger integration tracking</span>
                    </li>
                </ul>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center text-slate-400">
                [Dashboard Mockup Placeholder]
            </div>
         </div>
      </div>

      <CTASection 
        headline="Take control of your cash runway."
        description="Start your 14-day free trial of CapLiquify FP&A today."
        primaryCtaText="Start Free Trial"
        primaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

