import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { StructuredData } from '../../components/common/StructuredData';
import { SEO } from '../../components/common/SEO';
import { TrustBadges } from '../../components/marketing/TrustBadges';
import { CTASection } from '../../components/marketing/CTASection';
import { ExitIntentPopup } from '../../components/marketing/ExitIntentPopup';
import { StickyCTABar } from '../../components/marketing/StickyCTABar';
import { trackCtaClick } from '../../lib/analytics';
import { DashboardMockup } from '../../components/marketing/DashboardMockup';
import { basePricingTiers, calculateAnnualPrice, formatCurrency, type BillingCycle, ANNUAL_DISCOUNT_RATE } from '../../data/pricing';
import {
  heroPillars,
  heroStats,
  platformHighlights,
  launchHighlights,
  valueSprints,
  personaPlays,
  getFeatures,
  structuredData
} from '../../data/landingPageData';

export const EnhancedLandingPage: React.FC = () => {
  const features = useMemo(() => getFeatures(), []);

  const [marketingBillingCycle, setMarketingBillingCycle] = useState<BillingCycle>('monthly');

  const marketingPricingTiers = useMemo(
    () =>
      basePricingTiers.map((tier) => {
        if (!tier.monthlyPrice) {
          return {
            name: tier.name,
            price: 'Contact sales',
            setup: tier.setupFee ? `£${formatCurrency(tier.setupFee)} setup` : 'Custom onboarding',
            description: tier.description,
            features: tier.features.slice(0, 4),
            subtext: 'Tailored multi-entity deployment',
            badge: undefined,
          };
        }

        const monthly = tier.monthlyPrice;
        const annual = calculateAnnualPrice(monthly);
        const isAnnual = marketingBillingCycle === 'annual';
        const displayPrice = isAnnual ? `£${formatCurrency(annual)}/yr` : `£${formatCurrency(monthly)}/mo`;
        const secondary = isAnnual
          ? `Equivalent to £${formatCurrency(Math.round(annual / 12))}/mo`
          : 'Billed monthly';

        return {
          name: tier.name,
          price: displayPrice,
          setup: tier.setupFee ? `£${formatCurrency(tier.setupFee)} setup` : undefined,
          description: tier.description,
          features: tier.features.slice(0, 4),
          subtext: secondary,
          badge: isAnnual ? 'Save 17%' : undefined,
        };
      }),
    [marketingBillingCycle],
  );

  return (
    <MarketingLayout>
      <SEO
        title="100 Days & Beyond | ApexDeliver + CapLiquify Revenue & M&A OS"
        description="Unify CapLiquify FP&A, ApexDeliver deal rooms, Sales & Promotion Pricing, portals, events, and community in one platform. Start your 14-day free trial and own the first 100 days."
        keywords="M&A platform, FP&A, sales promotion pricing, customer portal, deal room, valuation software, community platform, event management"
        ogTitle="100 Days & Beyond | ApexDeliver + CapLiquify Revenue & M&A OS"
        ogDescription="Run deals, FP&A, pricing, customer portals, events, and community from one operating system. Built for the first 100 days and the next 1,000."
        ogImage="https://100daysandbeyond.com/assets/dashboard-preview.png"
        ogUrl="https://100daysandbeyond.com/"
        twitterTitle="100 Days & Beyond | ApexDeliver + CapLiquify"
        twitterDescription="Deal cloud, FP&A, pricing studio, portals, events, and community-with a 14-day free trial and operator-led onboarding."
        twitterImage="https://100daysandbeyond.com/assets/dashboard-preview.png"
        canonical="https://100daysandbeyond.com/"
      />
      <StructuredData json={structuredData} id="product-schema" />
      <ExitIntentPopup />
      <StickyCTABar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide">
                <span>100 Days &amp; Beyond Platform</span>
                <span className="text-emerald-300">New GTM + Finance OS</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                From Deal Flow to Cash Flow: The End-to-End M&A Intelligence Platform
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 leading-relaxed">
                Stop juggling spreadsheets and disconnected tools. ApexDeliver, powered by CapLiquify, now ships one connected operating system that covers valuations, diligence rooms, FP&amp;A, sales &amp; promotion pricing, portals, events, and community.
              </p>
              <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed">
                Close deals faster, spin up revenue experiences in hours, and walk into every board or lender meeting with banker-grade numbers. Every plan includes the 14-day free trial plus a guided go-live inside your first 100 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  to="/sign-up"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              <p className="text-sm text-indigo-200">14-day trial - Guided onboarding - No credit card required</p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {heroPillars.map((pillar) => (
                  <div key={pillar.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-wide">
                    <span>{pillar.label}</span>
                    {pillar.badge && <span className="text-emerald-300 text-[10px] uppercase">{pillar.badge}</span>}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-left">
                    <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                    <div className="text-sm text-indigo-100 font-semibold">{stat.label}</div>
                    <div className="text-xs text-indigo-200/80 mt-1">{stat.detail}</div>
                  </div>
                ))}
              </div>

              <p className="text-indigo-200 text-sm italic">
                Trusted by dealmakers, finance leaders, and private equity firms worldwide. Backed by 20+ years of experience and over 230+ successful business transformations-now with GTM, customer, and community teams in the same command center.
              </p>
            </div>

            <div className="relative">
              <DashboardMockup />
              <div className="absolute -bottom-8 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 grid sm:grid-cols-2 gap-4 shadow-2xl">
                <div>
                  <p className="text-xs uppercase text-emerald-200 tracking-wide">14-Day Go-Live</p>
                  <p className="text-sm text-white font-semibold">CapLiquify + Pricing Studio staffed with operator playbooks.</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-indigo-200 tracking-wide">New Launches</p>
                  <p className="text-sm text-white font-semibold">Events, community, and customer command center deploy in weeks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Platform map section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Platform blueprint</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Every module you need to win the first 100 days and beyond</h2>
            <p className="text-lg text-gray-600">
              Land with CapLiquify FP&A, expand into ApexDeliver for deals, and now layer in Sales &amp; Promotion Pricing, customer portals, events, and community without bolting on point tools.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {platformHighlights.map((highlight) => (
              <div key={highlight.title} className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{highlight.title}</h3>
                  {highlight.badge && <span className="text-xs font-semibold uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{highlight.badge}</span>}
                </div>
                <p className="text-gray-600 mb-6 flex-1">{highlight.subtitle}</p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  {highlight.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="text-emerald-600 mt-1">-</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={highlight.cta.link}
                  className="inline-flex items-center gap-2 text-indigo-900 font-semibold"
                  onClick={() => trackCtaClick(`platform-${highlight.cta.event}`, 'platform-map')}
                >
                  {highlight.cta.text}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch highlights */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-2">New this quarter</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The newest revenue, event, and community launches</h2>
            <p className="text-lg text-slate-200">
              We keep shipping go-to-market power-ups so your teams can monetize faster while finance keeps the guardrails tight.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {launchHighlights.map((launch) => (
              <div key={launch.title} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-3">Launch</p>
                <h3 className="text-xl font-semibold mb-3">{launch.title}</h3>
                <p className="text-sm text-slate-200 mb-4">{launch.description}</p>
                <p className="text-sm font-semibold text-emerald-200">{launch.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value sprints */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">First 100 days playbook</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Four value sprints to land, expand, and scale</h2>
            <p className="text-lg text-gray-600">Every engagement includes a sprint-by-sprint rollout so your finance, deal, revenue, and CX teams see value inside two weeks.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {valueSprints.map((sprint) => (
              <div key={sprint.title} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase">{sprint.timeline}</p>
                  <span className="text-xs text-gray-500">{sprint.title}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{sprint.focus}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {sprint.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">{'>'}</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona plays */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Who we serve</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">One operating system for every operator</h2>
            <p className="text-lg text-gray-600">Private equity portfolio teams, strategics, and fast-moving operators finally share the same data, workflows, and guardrails.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {personaPlays.map((persona) => (
              <div key={persona.title} className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">{persona.title}</p>
                <p className="text-xl font-semibold text-gray-900 mb-4">{persona.description}</p>
                <ul className="space-y-3 text-gray-700">
                  {persona.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="text-purple-600 mt-1">+</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full text-2xl font-bold mb-6 mx-auto">
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
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-700 rounded-full text-2xl font-bold mb-6 mx-auto">
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
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-700 rounded-full text-2xl font-bold mb-6 mx-auto">
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
              Explore All Features -&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Powerful, Transparent Pricing That Scales With You
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Whether you're a solo dealmaker, a growing firm, or a large enterprise, we have a plan that fits your needs.
              Start with CapLiquify FP&A and expand to the full ApexDeliver stack as you grow.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-1">
              {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => {
                const active = marketingBillingCycle === cycle;
                const label = cycle === 'monthly' ? 'Monthly billing' : 'Annual (save 17%)';
                return (
                  <button
                    key={cycle}
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                      active ? 'bg-indigo-900 text-white shadow' : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => setMarketingBillingCycle(cycle)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {marketingPricingTiers.map((tier) => (
              <div key={tier.name} className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  {tier.badge && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{tier.badge}</span>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-indigo-900">{tier.price}</p>
                {tier.subtext && <p className="text-sm text-gray-500">{tier.subtext}</p>}
                {tier.setup && <p className="text-xs uppercase tracking-wide text-gray-500 mt-2">{tier.setup}</p>}
                <p className="text-sm text-gray-600 my-4 flex-1">{tier.description}</p>
                <ul className="space-y-2 text-sm text-gray-700 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500">
                  Setup fees are invoiced separately with your deployment plan.
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/pricing"
              className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('view-pricing', 'pricing-teaser')}
            >
              View Full Pricing & Features -&gt;
            </Link>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            Annual billing reflects a {Math.round(ANNUAL_DISCOUNT_RATE * 100)}% discount compared to monthly pricing.
          </p>
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
