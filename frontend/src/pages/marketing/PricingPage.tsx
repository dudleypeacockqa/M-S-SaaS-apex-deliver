import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { PricingCard } from '../../components/marketing/PricingCard';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';
import { useAuth } from '../../lib/clerk';
import { useCallback, useMemo, useState } from 'react';
import { billingService, type SubscriptionTier, type BillingCycle } from '../../services/billingService';
import { createProductWithOffersSchema } from '../../utils/schemas/offerSchema';
import { StructuredData } from '../../components/common/StructuredData';
import { ANNUAL_DISCOUNT_RATE, basePricingTiers, calculateAnnualPrice, formatCurrency } from '../../data/pricing';

export const PricingPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorTier, setErrorTier] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleGetStarted = useCallback(async (tierName: string) => {
    if (!isSignedIn) {
      window.open('/sign-in', '_self');
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
      await billingService.redirectToCheckout(tier, billingCycle);
    } catch (error) {
      setErrorTier('Failed to create checkout session. Please try again.');
      setLoadingTier(null);
    }
  }, [billingCycle, isSignedIn]);

  const pricingTiers = useMemo(() => {
    return basePricingTiers.map((tier) => {
      if (!tier.monthlyPrice) {
        return {
          testId: tier.id,
          name: tier.name,
      price: 'Contact',
      currency: '',
      period: '',
          setupFee: tier.setupFee,
          description: tier.description,
          features: tier.features,
          cta: tier.ctaLabel ?? 'Contact Sales',
          ctaLink: tier.ctaLink ?? '/contact',
          highlighted: tier.highlighted,
          priceDisplay: {
            primary: 'Contact us for pricing',
            secondary: 'Tailored programs for multi-brand portfolios',
          },
        };
      }

      const monthlyPrice = tier.monthlyPrice;
      const annualPrice = calculateAnnualPrice(monthlyPrice);
      const isAnnual = billingCycle === 'annual';
      const displayValue = isAnnual ? annualPrice : monthlyPrice;
      const periodLabel = isAnnual ? '/year' : '/month';
      const badge = isAnnual ? 'Save 17% vs monthly' : undefined;
      const secondary = isAnnual
        ? `Equivalent to £${formatCurrency(Math.round(annualPrice / 12))}/month`
        : 'Billed monthly';

      return {
        testId: tier.id,
        name: tier.name,
        price: displayValue,
        currency: '£',
        period: isAnnual ? 'year' : 'month',
        setupFee: tier.setupFee,
        description: tier.description,
        features: tier.features,
        cta: tier.ctaLabel ?? 'Get Started',
        ctaLink: tier.ctaLink,
        highlighted: tier.highlighted,
        onGetStarted: tier.cta === 'get-started' ? () => handleGetStarted(tier.name) : undefined,
        priceDisplay: {
          primary: `£${formatCurrency(displayValue)} ${periodLabel}`,
          secondary,
          badge,
    },
      };
    });
  }, [billingCycle, handleGetStarted]);

  // Generate Product + Offer structured data for SEO
  const pricingSchema = useMemo(
    () =>
      createProductWithOffersSchema(
    {
      name: 'ApexDeliver + CapLiquify',
          description:
            'End-to-end M&A intelligence platform for deal flow management, financial analysis, and secure collaboration',
      brand: 'ApexDeliver',
      url: 'https://financeflo.ai/pricing',
    },
        basePricingTiers
          .filter((tier) => typeof tier.monthlyPrice === 'number')
          .flatMap((tier) => {
            const monthly = tier.monthlyPrice as number;
            const annual = calculateAnnualPrice(monthly);
            return [
              {
                name: `${tier.name} Monthly`,
                price: monthly,
        currency: 'GBP',
        billingPeriod: 'MONTH' as const,
        description: tier.description,
        url: 'https://financeflo.ai/pricing',
              },
              {
                name: `${tier.name} Annual`,
                price: annual,
                currency: 'GBP',
                billingPeriod: 'YEAR' as const,
                description: tier.description,
                url: 'https://financeflo.ai/pricing',
              },
            ];
          })
      ),
    []
  );

  return (
    <MarketingLayout>
      <SEO
        title="Pricing | 100 Days & Beyond"
        description="Find the perfect plan to fuel your growth. Start with what you need today and scale as your ambitions grow. All plans backed by a 14-day money-back guarantee."
        keywords="M&A software pricing, deal management pricing, M&A platform cost, professional M&A tools pricing"
        ogTitle="100 Days & Beyond Pricing - Professional M&A Tools from £598/month"
        ogDescription="Choose from 4 pricing tiers designed for solo dealmakers to large organizations. All plans include AI-powered intelligence and deal flow management."
        ogUrl="https://financeflo.ai/pricing"
        ogImage="https://financeflo.ai/assets/financial-analysis-visual.png"
        twitterTitle="100 Days & Beyond Pricing"
        twitterDescription="Flexible plans covering deal pipeline management, valuations, data rooms, and AI-powered matching."
        twitterImage="https://financeflo.ai/assets/financial-analysis-visual.png"
        canonical="https://financeflo.ai/pricing"
      />
      <StructuredData json={pricingSchema} id="pricing-product-schema" />
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

      {/* Billing Toggle */}
      <section className="bg-white py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 bg-indigo-50 rounded-full p-2 w-full sm:w-auto mx-auto">
            {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => {
              const isActive = billingCycle === cycle;
              const label = cycle === 'monthly' ? 'Monthly billing' : 'Annual billing (save 17%)';
              return (
                <button
                  key={cycle}
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive ? 'bg-white text-indigo-900 shadow' : 'text-indigo-600 hover:text-indigo-900'
                  }`}
                  onClick={() => setBillingCycle(cycle)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => {
              const { testId, onGetStarted, ...tierProps } = tier;

              return (
                <PricingCard
                  key={index}
                  {...tierProps}
                  onGetStarted={onGetStarted}
                  loading={loadingTier === tier.name}
                  disabled={loadingTier !== null && loadingTier !== tier.name}
                  ctaTestId={`pricing-cta-${testId ?? tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  setupFeeNote="Setup fee invoiced separately after contract selection."
                />
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Annual billing reflects a {Math.round(ANNUAL_DISCOUNT_RATE * 100)}% discount vs monthly. Setup fees are billed via
            separate invoice following contract signature.
          </p>

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
                <tr data-testid="pricing-feature-api-access-row">
                  <td className="p-4 border-b border-gray-200">API Access & iPaaS Integrations</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">13-Week Cash Forecasting</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Working Capital Management</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Due Diligence Data Room</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">✓ (100GB)</td>
                  <td className="p-4 text-center border-b border-gray-200">✓ (Unlimited)</td>
                  <td className="p-4 text-center border-b border-gray-200">✓ (Unlimited)</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Post-Merger Integration Tools</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                  <td className="p-4 text-center border-b border-gray-200">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200">Portfolio Management Dashboard</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
                  <td className="p-4 text-center border-b border-gray-200 bg-indigo-50">—</td>
                  <td className="p-4 text-center border-b border-gray-200">—</td>
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

      {/* Bolt-On Modules Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bolt-On Modules</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extend any plan with these powerful add-on modules designed for specific business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Customer Portal Module */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-emerald-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Customer Portal Module</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">B2B2C</span>
              </div>
              <p className="text-gray-600 mb-6">
                Empower your customers with self-service portals integrated directly with your ERP. Reduce administrative overhead and improve customer satisfaction.
              </p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-gray-900 mb-2">
                  <span className="text-2xl font-semibold align-top mr-1">£</span>499
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-500">+ £1,500 one-time setup</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-emerald-700 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Customer order placement & tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-emerald-700 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Invoice viewing & payment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-emerald-700 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Real-time account statements</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-emerald-700 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Custom branding & white-label</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-emerald-700 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Direct ERP integration</span>
                </li>
              </ul>
              <button className="w-full bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-800 transition-colors">
                Add to Plan
              </button>
            </div>

            {/* Sales & Promotion Pricing Module */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Sales & Promotion Pricing</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Dynamic</span>
              </div>
              <p className="text-gray-600 mb-6">
                Advanced pricing engine with dynamic promotional pricing, customer-specific pricing, and real-time margin analysis.
              </p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-gray-900 mb-2">
                  <span className="text-2xl font-semibold align-top mr-1">£</span>399
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-500">+ £1,200 one-time setup</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Dynamic promotional pricing rules</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Customer-specific pricing tiers</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Real-time margin analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Volume-based discounting</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Approval workflows for special pricing</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Plan
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <strong>Note:</strong> Bolt-on modules can be added to any plan tier. Contact sales for custom bundles and enterprise pricing.
            </p>
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
                Yes, annual subscriptions receive a 17% discount compared to paying monthly. Choose the annual toggle to see the adjusted price.
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
