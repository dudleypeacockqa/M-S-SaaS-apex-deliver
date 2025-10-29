import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { PricingCard } from '../../components/marketing/PricingCard';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { billingService, type SubscriptionTier } from '../../services/billingService';

export const PricingPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorTier, setErrorTier] = useState<string | null>(null);

  const handleGetStarted = async (tierName: string) => {
    if (!isSignedIn) {
      window.location.assign('/sign-in');
      return;
    }

    setLoadingTier(tierName);
    setErrorTier(null);

    const tierMap: Record<string, SubscriptionTier> = {
      'CapLiquify FP&A': 'starter',
      'ApexDeliver Professional': 'professional',
      'ApexDeliver Enterprise': 'enterprise',
      'Portfolio / Community Leader': 'community',
    };

    try {
      const tier = tierMap[tierName];
      if (!tier) {
        throw new Error('Unknown tier selection.');
      }
      await billingService.redirectToCheckout(tier);
    } catch (error) {
      setErrorTier('Failed to create checkout session. Please try again.');
      setLoadingTier(null);
    }
  };
  const pricingTiers = [
    {
      name: 'CapLiquify FP&A',
      price: 598,
      currency: '£',
      period: 'month',
      description: 'For finance teams & businesses needing immediate cash flow visibility and pricing control',
      features: [
        '13-Week Cash Forecasting',
        'Working Capital Management',
        'Advanced Pricing & Promotion Engine',
        'B2B2C Customer Portals (up to 100 customers)',
        'Lender & Board Pack Generation',
        'ERP Integration (Sage, Odoo, CSV)',
        'Email & Chat Support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'ApexDeliver Professional',
      price: 1598,
      currency: '£',
      period: 'month',
      description: 'For growth firms and active dealmakers managing multiple M&A projects',
      features: [
        'Everything in CapLiquify FP&A',
        'Unlimited Deals',
        'Advanced Deal Pipeline & Collaboration',
        'Full Financial Intelligence Engine (47+ ratios)',
        'Multi-Method Valuation Suite (DCF, Comps, Precedents)',
        'Secure Data Room with Watermarking (100GB)',
        'AI-Powered Deal Matching',
        'Task & Workflow Automation',
        'Priority Support',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'ApexDeliver Enterprise',
      price: 2997,
      currency: '£',
      period: 'month',
      description: 'For large organizations and private equity firms requiring advanced control and integration',
      features: [
        'Everything in ApexDeliver Professional',
        'Unlimited Team Members',
        'Advanced RBAC & Permissions',
        'Custom Workflow Templates',
        'Automated Document Generation',
        'API Access & DataBlend iPaaS Integrations',
        'Unlimited Storage',
        'SSO & Advanced Security',
        'Dedicated Account Manager',
        'SLA Guarantee (99.95% uptime)',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
    },
    {
      name: 'Portfolio / Community Leader',
      price: 'Contact',
      currency: '',
      period: '',
      description: 'For PE Firms, Family Offices, and Industry Leaders managing a portfolio of businesses',
      features: [
        'Everything in ApexDeliver Enterprise',
        'Centralized Portfolio Management Dashboard',
        'Cross-Company Analytics & Reporting',
        'Content Creation & Podcast Studio',
        'Private Community Hosting & Monetization',
        'Custom Branding',
        'White-Glove Support & Onboarding',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="Pricing | ApexDeliver + CapLiquify"
        description="Find the perfect plan to fuel your growth. Start with what you need today and scale as your ambitions grow. All plans backed by a 14-day money-back guarantee."
        keywords="M&A software pricing, deal management pricing, M&A platform cost, professional M&A tools pricing"
        ogTitle="ApexDeliver Pricing - Professional M&A Tools from £279/month"
        ogDescription="Choose from 4 pricing tiers designed for solo dealmakers to large organizations. All plans include AI-powered intelligence and deal flow management."
        ogUrl="https://ma-saas-platform.onrender.com/pricing"
        ogImage="https://apexdeliver.com/assets/financial-analysis-visual.png"
        twitterTitle="ApexDeliver Pricing"
        twitterDescription="Flexible plans covering deal pipeline management, valuations, data rooms, and AI-powered matching."
        twitterImage="https://apexdeliver.com/assets/financial-analysis-visual.png"
        canonical="https://ma-saas-platform.onrender.com/pricing"
      />
      {/* Header Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Find the Perfect Plan to Fuel Your Growth
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Start with what you need today and scale as your ambitions grow. All plans are backed by our world-class support and a 14-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard
                key={index}
                {...tier}
                onGetStarted={tier.cta === 'Get Started' ? () => handleGetStarted(tier.name) : undefined}
                loading={loadingTier === tier.name}
                disabled={loadingTier !== null && loadingTier !== tier.name}
                ctaTestId={`pricing-cta-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              />
            ))}
          </div>

          {errorTier && (
            <div className="mt-6 text-center text-red-600 font-medium" role="alert">
              {errorTier}
            </div>
          )}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Feature</th>
                  <th className="p-4 text-center font-semibold text-gray-900 border-b-2 border-gray-300">Starter</th>
                  <th className="p-4 text-center font-semibold text-gray-900 border-b-2 border-gray-300 bg-indigo-50">Professional</th>
                  <th className="p-4 text-center font-semibold text-gray-900 border-b-2 border-gray-300">Enterprise</th>
                  <th className="p-4 text-center font-semibold text-gray-900 border-b-2 border-gray-300">Community Leader</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-200">Active Deals</td>
                  <td className="p-4 text-center border-b border-gray-200">Up to 10</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">Unlimited</td>
                  <td className="p-4 text-center border-b border-gray-200">Unlimited</td>
                  <td className="p-4 text-center border-b border-gray-200">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Team Members</td>
                  <td className="p-4 text-center border-b border-gray-200">1</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">Up to 5</td>
                  <td className="p-4 text-center border-b border-gray-200">Unlimited</td>
                  <td className="p-4 text-center border-b border-gray-200">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Financial Intelligence Engine</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Valuation Suite</td>
                  <td className="p-4 text-center border-b border-gray-200">DCF only</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">All methods</td>
                  <td className="p-4 text-center border-b border-gray-200">All methods</td>
                  <td className="p-4 text-center border-b border-gray-200">All methods</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">AI-Powered Deal Matching</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Document Generation</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Event Management Hub</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">API Access</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4">Support</td>
                  <td className="p-4 text-center">Email</td>
                  <td className="p-4 text-center bg-indigo-50">Priority</td>
                  <td className="p-4 text-center">Dedicated</td>
                  <td className="p-4 text-center">White-glove</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I try before I buy?</h3>
              <p className="text-gray-600">
                Yes! All plans include a 14-day free trial with full access to features. No credit card required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, Amex) and bank transfers for annual subscriptions. All payments are processed securely through Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Is there a discount for annual billing?</h3>
              <p className="text-gray-600">
                Yes, annual subscriptions receive a 20% discount compared to monthly billing. Contact sales for annual pricing details.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What happens to my data if I cancel?</h3>
              <p className="text-gray-600">
                You retain full access to your data for 30 days after cancellation. You can export all your data at any time before the 30-day period ends.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable but can be cancelled at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
