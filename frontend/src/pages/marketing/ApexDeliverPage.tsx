import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { trackCtaClick } from '../../lib/analytics';
import { DashboardMockup } from '../../components/marketing/DashboardMockup';

export const ApexDeliverPage: React.FC = () => {
  const features = [
    {
      title: 'AI-Powered Deal Sourcing',
      description: 'Identify relevant acquisition targets instantly with our AI matching engine. Screen thousands of companies against your specific investment criteria in seconds.',
      icon: '🤖',
    },
    {
      title: 'Secure Virtual Data Room',
      description: 'Banker-grade security for your due diligence. 100GB storage, watermarking, granular permissions, and audit logs included in every plan.',
      icon: '🔒',
    },
    {
      title: 'Multi-Method Valuation',
      description: 'Build professional DCF, Comparable Company, and Precedent Transaction models. Run sensitivity analysis and visualize value creation drivers.',
      icon: '📊',
    },
    {
      title: 'Deal Pipeline Management',
      description: 'Kanban-style deal tracking with customizable stages. Collaborate with your deal team, assign tasks, and track progress from sourcing to close.',
      icon: '📋',
    },
    {
      title: 'PMI & 100-Day Plans',
      description: 'Execute post-merger integration with confidence. Pre-built playbooks for finance, HR, and ops integration ensure you capture value from Day 1.',
      icon: '🚀',
    },
    {
      title: 'Document Automation',
      description: 'Generate NDAs, LOIs, and Term Sheets in seconds using our smart templates. Reduce legal costs and speed up execution.',
      icon: '📄',
    },
  ];

  const useCases = [
    {
      role: 'Private Equity Partner',
      challenge: 'Need to accelerate capital deployment but deal sourcing is manual and slow',
      solution: 'AI-driven deal sourcing and automated pipeline management',
      result: '3x increase in qualified deal flow, 40% reduction in screening time',
    },
    {
      role: 'Corporate Dev Lead',
      challenge: 'Managing diligence across multiple potential acquisitions via email and Dropbox',
      solution: 'Integrated Virtual Data Room and task management',
      result: 'Secure, central source of truth; 25% faster diligence cycles',
    },
    {
      role: 'M&A Advisor',
      challenge: 'Creating valuation models and IMs takes weeks of analyst time',
      solution: 'Automated valuation suite and document generation',
      result: 'Client deliverables ready in days; focus shifted to advisory value',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="ApexDeliver M&A - The Complete Deal Operating System"
        description="End-to-end M&A platform for deal sourcing, due diligence, valuations, and post-merger integration. Close deals faster with AI-powered intelligence."
        keywords="M&A software, virtual data room, deal flow management, valuation modeling, PMI software"
      />

      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Prop */}
            <div>
              <div className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ApexDeliver by FinanceFlo
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                Execute Deals <span className="text-emerald-400">30% Faster</span> From Sourcing to Integration
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The complete operating system for modern dealmakers. Source targets, manage diligence, value assets, and execute integrations—all in one secure platform.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">3x</div>
                  <div className="text-sm text-gray-400">Deal Flow</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">25%</div>
                  <div className="text-sm text-gray-400">Faster Close</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">100%</div>
                  <div className="text-sm text-gray-400">Secure VDR</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition text-lg"
                  onClick={() => trackCtaClick('start-trial', 'apexdeliver-hero')}
                >
                  Start 14-Day Free Trial
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border-2 border-white/30 text-lg"
                  onClick={() => trackCtaClick('book-demo', 'apexdeliver-hero')}
                >
                  Book a Demo
                </Link>
              </div>

              <p className="text-sm text-gray-400 mt-4">
                Plans from £1,598/month • Includes CapLiquify FP&A
              </p>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <DashboardMockup />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-teal-400 text-navy-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
                New: AI Sourcing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Complete Deal Lifecycle Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminate point solutions. Get everything you need to run a professional M&A process in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Dealmakers
            </h2>
            <p className="text-xl text-gray-600">
              Scalable solutions for every stage of your investment journey.
            </p>
          </div>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-700">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.role}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-500 mb-1">Challenge</div>
                        <p className="text-gray-700">{useCase.challenge}</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 mb-1">Solution</div>
                        <p className="text-gray-700">{useCase.solution}</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-emerald-700 mb-1">Result</div>
                        <p className="text-gray-900 font-semibold">{useCase.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Professionalize Your Deal Process?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Professional Tier starts at £1,598/mo. Enterprise options available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition text-lg"
              onClick={() => trackCtaClick('start-trial', 'apexdeliver-bottom-cta')}
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-900 font-semibold rounded-lg hover:bg-gray-100 transition text-lg"
              onClick={() => trackCtaClick('view-pricing', 'apexdeliver-bottom-cta')}
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

