import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';

import { DynamicPricingSimulator } from '../../components/marketing/DynamicPricingSimulator';

export const SalesPromotionPricingPage: React.FC = () => {
  const features = [
    {
      title: 'Dynamic Pricing Engine',
      description: 'Set pricing rules based on customer tier, volume, seasonality, and competitive positioning. Automate price calculations and approvals while maintaining margin guardrails.',
      icon: '💰',
      capabilities: [
        'Tiered pricing by customer segment',
        'Volume-based discounting',
        'Time-based promotions (seasonal, flash sales)',
        'Cost-plus and value-based pricing models',
        'Margin protection rules',
      ],
    },
    {
      title: 'Promotion Management',
      description: 'Create, schedule, and track promotional campaigns across your customer base. Monitor promotion effectiveness and ROI in real-time.',
      icon: '🎯',
      capabilities: [
        'Campaign creation and scheduling',
        'Multi-tier discount structures',
        'Bundle and package pricing',
        'Promotion code generation',
        'Real-time ROI tracking',
      ],
    },
    {
      title: 'B2B2C Customer Portals',
      description: 'Give your customers self-service access to pricing, order history, invoices, and payment options. Reduce support burden while improving customer satisfaction.',
      icon: '🌐',
      capabilities: [
        'Personalized pricing by customer',
        'Self-service order placement',
        'Invoice and payment history',
        'Credit limit and terms visibility',
        'Product catalog with availability',
      ],
    },
    {
      title: 'Quote & Proposal Generation',
      description: 'Generate professional quotes and proposals in minutes with dynamic pricing, approval workflows, and e-signature integration.',
      icon: '📄',
      capabilities: [
        'Branded quote templates',
        'Dynamic pricing calculation',
        'Multi-level approval workflows',
        'E-signature integration',
        'Quote-to-order conversion tracking',
      ],
    },
    {
      title: 'Analytics & Reporting',
      description: 'Track pricing performance, promotion effectiveness, and customer behavior. Optimize your pricing strategy with data-driven insights.',
      icon: '📊',
      capabilities: [
        'Price realization analysis',
        'Promotion ROI dashboards',
        'Customer lifetime value tracking',
        'Win/loss analysis by price point',
        'Competitive pricing benchmarks',
      ],
    },
    {
      title: 'ERP Integration',
      description: 'Sync pricing, orders, and customer data with Sage Intacct and Odoo. Eliminate manual data entry and ensure pricing consistency across systems.',
      icon: '🔗',
      capabilities: [
        'Real-time price sync to ERP',
        'Automated order creation',
        'Customer master data sync',
        'Inventory availability checks',
        'Invoice generation and posting',
      ],
    },
  ];

  const useCases = [
    {
      industry: 'Manufacturing',
      challenge: 'Managing complex pricing for 500+ SKUs across 200 B2B customers with varying volume commitments and seasonal promotions',
      solution: 'Dynamic pricing engine with customer-specific portals, automated volume discounting, and seasonal promotion scheduling',
      result: '30% reduction in pricing errors, 45% faster quote generation, 20% increase in customer self-service adoption',
    },
    {
      industry: 'Distribution',
      challenge: 'Sales team spending 10+ hours/week manually creating quotes and managing customer pricing requests',
      solution: 'Self-service customer portals with personalized pricing, automated quote generation, and approval workflows',
      result: '80% reduction in quote generation time, 60% of orders now self-service, sales team refocused on high-value activities',
    },
    {
      industry: 'Professional Services',
      challenge: 'Inconsistent pricing across sales team, missed upsell opportunities, poor promotion tracking',
      solution: 'Centralized pricing rules, package/bundle pricing, promotion ROI tracking, and customer portal for recurring services',
      result: '25% improvement in price realization, 15% increase in bundle attach rate, full promotion ROI visibility',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="Sales and Promotion Pricing Engine + Customer Portals | CapLiquify"
        description="Dynamic pricing engine, promotion management, and B2B2C customer portals for manufacturing, distribution, and professional services businesses."
        keywords="dynamic pricing, promotion management, customer portal, B2B pricing, quote generation"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Prop */}
            <div>
              <div className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Sales and Promotion Pricing
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                Dynamic Pricing Engine + <span className="text-emerald-400">B2B2C Customer Portals</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Automate complex pricing, manage promotions, and empower customers with self-service portals. 
                Built for manufacturing, distribution, and professional services.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">80%</div>
                  <div className="text-sm text-indigo-200">Faster Quotes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">60%</div>
                  <div className="text-sm text-indigo-200">Self-Service Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">25%</div>
                  <div className="text-sm text-indigo-200">Price Realization ↑</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-lg"
                  onClick={() => trackCtaClick('request-demo', 'sales-pricing-hero')}
                >
                  Request Pricing Demo
                </Link>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border-2 border-white/30 text-lg"
                  onClick={() => trackCtaClick('start-trial', 'sales-pricing-hero')}
                >
                  Start Free Trial
                </Link>
              </div>

              <p className="text-sm text-indigo-200 mt-4">
                Included in CapLiquify FP&A (£598/mo) • Up to 100 customer portals
              </p>
            </div>

            {/* Right: Portal Mockup */}
            <div className="relative">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <DynamicPricingSimulator />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
                Interactive Demo
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
              Complete Sales and Pricing Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From pricing strategy to customer self-service, everything you need in one integrated platform.
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
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.capabilities.map((capability, capIndex) => (
                    <li key={capIndex} className="flex items-start text-sm">
                      <span className="text-emerald-700 mr-2 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Your Industry
            </h2>
            <p className="text-xl text-gray-600">
              Real businesses. Real challenges. Real results.
            </p>
          </div>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">

                    <span className="text-white text-2xl">
                      {index === 0 && '🏭'}
                      {index === 1 && '📦'}
                      {index === 2 && '💼'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.industry}</h3>
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

      {/* Integration with CapLiquify FP&A */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 border-2 border-indigo-200">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Integrated with CapLiquify FP&A
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Sales and Promotion Pricing is built into CapLiquify FP&A, giving you a complete view of how pricing 
                decisions impact cash flow and working capital. See the ripple effect of promotions on DSO, forecast 
                the cash impact of volume discounts, and optimize pricing for both revenue and cash.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/capliquify-fpa"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  onClick={() => trackCtaClick('learn-fpa', 'sales-pricing-integration')}
                >
                  Learn About CapLiquify FP&A
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition border-2 border-indigo-600"
                  onClick={() => trackCtaClick('view-pricing', 'sales-pricing-integration')}
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Pricing?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Included in CapLiquify FP&A: £598/month + £2,500 one-time setup. 14-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-lg"
              onClick={() => trackCtaClick('request-demo', 'sales-pricing-bottom-cta')}
            >
              Request Demo
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition text-lg"
              onClick={() => trackCtaClick('start-trial', 'sales-pricing-bottom-cta')}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
