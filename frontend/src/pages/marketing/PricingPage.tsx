import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { PricingCard } from '../../components/marketing/PricingCard';
import { CTASection } from '../../components/marketing/CTASection';

export const PricingPage: React.FC = () => {
  const pricingTiers = [
    {
      name: 'Starter',
      price: 279,
      currency: '£',
      period: 'month',
      description: 'For Solo Dealmakers',
      features: [
        'Up to 10 active deals',
        'Basic deal pipeline management',
        'Financial Intelligence Engine (47+ ratios)',
        'DCF valuation tool',
        'Secure document storage (10GB)',
        'Community access',
        'Email support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 598,
      currency: '£',
      period: 'month',
      description: 'For Growth Firms',
      features: [
        'Unlimited deals',
        'Advanced deal pipeline & collaboration',
        'Full Financial Intelligence Engine',
        'Multi-method valuation suite (DCF, Comps, Precedents)',
        'Secure data room with watermarking (100GB)',
        'AI-powered deal matching',
        'Task & workflow automation',
        'Premium community access',
        'Priority support',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 1598,
      currency: '£',
      period: 'month',
      description: 'For Large Organizations',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Advanced RBAC & permissions',
        'Custom workflow templates',
        'Automated document generation',
        'API access & integrations',
        'Unlimited storage',
        'SSO & advanced security',
        'Dedicated account manager',
        'SLA guarantee (99.95% uptime)',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
    },
    {
      name: 'Community Leader',
      price: 2997,
      currency: '£',
      period: 'month',
      description: 'For Event Organizers & Influencers',
      features: [
        'Everything in Enterprise',
        'Event management hub',
        'Content creation studio',
        'Podcast & video production tools',
        'Private community hosting',
        'Member management & monetization',
        'Custom branding',
        'Advanced analytics & reporting',
        'White-glove support',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
    },
  ];

  return (
    <MarketingLayout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Professional M&A tools at accessible pricing. All plans include core features, with advanced capabilities available as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard key={index} {...tier} />
            ))}
          </div>

          {/* Annual Billing Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              💡 <strong>Save 20%</strong> with annual billing. Contact sales for details.
            </p>
          </div>
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
