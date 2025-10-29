import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { StructuredData } from '../../components/common/StructuredData';
import { marketingFeatureIcons } from '../../assets/marketing';
import { SEO } from '../../components/common/SEO';
import { TrustBadges } from '../../components/marketing/TrustBadges';
import { CTASection } from '../../components/marketing/CTASection';
import { ExitIntentPopup } from '../../components/marketing/ExitIntentPopup';
import { StickyCTABar } from '../../components/marketing/StickyCTABar';
import { trackCtaClick } from '../../lib/analytics';
import { DashboardMockup } from '../../components/marketing/DashboardMockup';

export const EnhancedLandingPage: React.FC = () => {
  const features = useMemo(
    () => [
      {
        icon: marketingFeatureIcons.financialIntelligence,
        title: 'CapLiquify FP&A Engine',
        description:
          'Go beyond traditional accounting with a forward-looking financial planning and analysis engine. Model scenarios, forecast cash with 95%+ accuracy, and generate lender-ready reports in minutes.',
      },
      {
        icon: marketingFeatureIcons.dealPipeline,
        title: 'ApexDeliver M&A Suite',
        description:
          'From AI-powered deal sourcing and automated due diligence to a valuation suite with 47+ financial ratios, ApexDeliver gives you an unfair advantage in a competitive market. Close deals faster, with more confidence.',
      },
      {
        icon: marketingFeatureIcons.secureDocumentRoom,
        title: 'B2B2C Customer Portals',
        description:
          'Empower your customers with self-service portals integrated directly with your ERP. Reduce administrative overhead, improve customer satisfaction, and get paid faster.',
      },
    ],
    [],
  );

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'ApexDeliver + CapLiquify',
      description:
        'The end-to-end M&A intelligence platform. From deal flow to cash flow, we unify your entire M&A lifecycle into a single, intelligent, and automated platform.',
      brand: {
        '@type': 'Organization',
        name: 'ApexDeliver',
        url: 'https://apexdeliver.com',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'GBP',
        price: '598.00',
        url: 'https://apexdeliver.com/pricing',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '230',
      },
    }),
    [],
  );

  return (
    <MarketingLayout>
      <SEO
        title="ApexDeliver + CapLiquify | End-to-End M&A Intelligence Platform"
        description="Stop juggling spreadsheets and disconnected tools. ApexDeliver integrates every stage of your M&A lifecycle—from valuation to post-merger integration—into a single platform."
        keywords="M&A platform, deal flow management, financial planning, FP&A, valuation software, due diligence, post-merger integration"
      />
      <StructuredData json={structuredData} id="product-schema" />
      <ExitIntentPopup />
      <StickyCTABar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              From Deal Flow to Cash Flow: The End-to-End M&A Intelligence Platform
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              Stop juggling spreadsheets and disconnected tools. ApexDeliver, powered by CapLiquify, integrates every stage of your M&A lifecycle—from valuation and due diligence to post-merger integration and ongoing financial performance—into a single, intelligent, and automated platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/sign-up"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => trackCtaClick('start-trial', 'hero')}
              >
                Start Your Free 14-Day Trial
              </Link>
              <Link
                to="/contact"
                className="bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => trackCtaClick('schedule-demo', 'hero')}
              >
                Schedule a Demo
              </Link>
            </div>
            <p className="text-indigo-200 text-sm italic">
              Trusted by dealmakers, finance leaders, and private equity firms worldwide. Backed by 20+ years of experience and over 230+ successful business transformations.
            </p>
          </div>
          
          {/* Dashboard Mockup */}
          <DashboardMockup />
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Your Entire M&A Workflow, Unified and Automated
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Land with CapLiquify (FP&A and Pricing)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Gain immediate control over your cash flow and pricing strategy. Use our 13-week cash forecasting, working capital optimization, and advanced pricing engine to stabilize financials and drive profitability from day one. Perfect for post-merger integration or as a standalone FP&A powerhouse.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Expand to ApexDeliver (Full M&A Lifecycle)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                When you're ready for your next deal, activate the full ApexDeliver suite. Manage your deal pipeline, conduct AI-powered due diligence in a secure document room, build complex valuation models, and execute your M&A strategy with unparalleled precision and efficiency.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Grow Your Portfolio (Enterprise & B2B2C)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                For private equity firms and strategic acquirers, manage your entire portfolio from a single dashboard. For your operating companies, deploy customer-facing portals for orders, invoices, and self-service, turning your finance function into a growth engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              A Feature for Every Stage of Your Growth Journey
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/features"
              className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('view-all-features', 'features-section')}
            >
              Explore All Features →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Powerful, Transparent Pricing That Scales With You
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Whether you're a solo dealmaker, a growing firm, or a large enterprise, we have a plan that fits your needs. Start with our powerful CapLiquify FP&A tools and expand to the full ApexDeliver M&A platform as you grow. All plans start with a risk-free 14-day trial.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/pricing"
              className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('view-pricing', 'pricing-teaser')}
            >
              View Full Pricing & Features →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection
        headline="Ready to Transform Your M&A and Finance Operations?"
        description="Take the first step towards a more intelligent, automated, and profitable future. Start your free trial today and experience the power of a truly unified platform."
        primaryCtaText="Start Your Free 14-Day Trial"
        primaryCtaLink="/sign-up"
        secondaryCtaText="Talk to an Expert"
        secondaryCtaLink="/contact"
      />
    </MarketingLayout>
  );
};
