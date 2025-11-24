import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { StructuredData } from '../../components/common/StructuredData';
import { SEO } from '../../components/common/SEO';
import { TrustBadges } from '../../components/marketing/TrustBadges';
import { CTASection } from '../../components/marketing/CTASection';
import { ExitIntentPopup } from '../../components/marketing/ExitIntentPopup';
import { StickyCTABar } from '../../components/marketing/StickyCTABar';
import { DashboardMockup } from '../../components/marketing/DashboardMockup';
import { trackCtaClick } from '../../lib/analytics';
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

const serviceStrands = [
  {
    title: 'ERP Implementation & Resell',
    description: 'Certified Sage Intacct, Odoo, Microsoft, and NetSuite rollouts guided by the ADAPT blueprint.',
    bullets: ['Data migration + entity consolidations', 'Automations, approvals, and reporting packs', 'Admin-on-demand once you go live'],
    cta: { text: 'Explore ERP programs', link: '/erp/sage-intacct' },
  },
  {
    title: 'CapLiquify + ApexDeliver Stack',
    description: 'CapLiquify FP&A, ApexDeliver deal + pricing cloud, portals, events, and community in one operator-led stack.',
    bullets: ['13-week cash + variance guardrails', 'Deal rooms, valuations, pricing studio', 'Portals, podcasts, and community in weeks'],
    cta: { text: 'See the software', link: '/capliquify-fpa' },
  },
  {
    title: 'AI Consulting & Managed Support',
    description: 'Copilot design, iPaaS flows, governance, and fractional teams for finance, deal, and GTM leaders.',
    bullets: ['Process mining + AI assurance frameworks', 'Copilot library with human-in-loop review', 'Enablement pods + 24/7 support retainers'],
    cta: { text: 'Review AI & support pods', link: '/pricing/services' },
  },
];

export const EnhancedLandingPage: React.FC = () => {
  const features = useMemo(() => getFeatures(), []);

  const [marketingBillingCycle, setMarketingBillingCycle] = useState<BillingCycle>('monthly');
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setIsClientReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

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
        title="FinanceFlo ERP Implementation + CapLiquify & ApexDeliver"
        description="FinanceFlo is the ERP reseller and AI consulting partner behind CapLiquify FP&A and the ApexDeliver deal cloud—delivering Sage Intacct, Odoo, Microsoft, and NetSuite rollouts with AI copilots, pricing studios, portals, and community."
        keywords="ERP implementation partner, Sage Intacct reseller, Odoo consultant, CapLiquify FP&A, ApexDeliver deal cloud, AI consulting, pricing studio"
        ogTitle="FinanceFlo ERP Implementation + CapLiquify & ApexDeliver"
        ogDescription="Book the FinanceFlo blueprint to unify ERP services, CapLiquify FP&A, ApexDeliver deal rooms, pricing studios, portals, and AI copilots under one partner."
        ogImage="https://financeflo.ai/assets/dashboard-preview.png"
        ogUrl="https://financeflo.ai/"
        twitterTitle="FinanceFlo | ERP Partner + CapLiquify & ApexDeliver"
        twitterDescription="Sage Intacct, Odoo, Microsoft, and NetSuite rollouts plus CapLiquify FP&A and ApexDeliver deal cloud with AI-managed services."
        twitterImage="https://financeflo.ai/assets/dashboard-preview.png"
        canonical="https://financeflo.ai/"
      />
      <StructuredData json={structuredData} id="product-schema" />
      {isClientReady && <ExitIntentPopup />}
      {isClientReady && <StickyCTABar />}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide">
                <span>FinanceFlo ERP + AI Partner</span>
                <span className="text-emerald-300">Services + Software Stack</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                ERP Implementation + CapLiquify & ApexDeliver in One Program
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 leading-relaxed">
                FinanceFlo is the ERP reseller and AI consulting partner powering CapLiquify FP&A and the ApexDeliver deal cloud. We blueprint, implement, and manage Sage Intacct, Odoo, Microsoft, or NetSuite environments while shipping the same software stack used for cash, deals, pricing, portals, events, and community.
              </p>
              <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed">
                Book the implementation blueprint to align your ERP, data, and governance, then launch the guided CapLiquify + ApexDeliver trial so boards, lenders, and GTM teams share the same real-time playbook.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  to="/contact"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => trackCtaClick('book-blueprint', 'hero')}
                >
                  Book ERP Blueprint Call
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => trackCtaClick('start-trial', 'hero')}
                >
                  Start Guided Software Trial
                </Link>
              </div>
          <p className="text-sm text-indigo-100">ERP blueprint + CapLiquify trial + operator-led go-live</p>

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
                    <div className="text-xs text-indigo-100/80 mt-1">{stat.detail}</div>
                  </div>
                ))}
              </div>

              <p className="text-indigo-100 text-sm italic">
                Trusted by CFOs, CIOs, and deal teams across the UK. 20+ years of ERP rollouts, software resale, and AI consulting experience brought into one FinanceFlo + CapLiquify + ApexDeliver operating system.
              </p>
            </div>

            <div className="relative">
              <Suspense
                fallback={
                  <div
                    className="h-[420px] w-full animate-pulse rounded-3xl bg-white/10 border border-white/10"
                    aria-hidden="true"
                  />
                }
              >
                <DashboardMockup />
              </Suspense>
              <div className="absolute -bottom-8 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/20 rounded-2xl p-4 grid sm:grid-cols-2 gap-4 shadow-2xl">
                <div>
                  <p className="text-xs uppercase text-white tracking-wide">14-Day Go-Live</p>
                  <p className="text-sm text-white/90 font-semibold">CapLiquify + Pricing Studio staffed with operator playbooks.</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-white tracking-wide">New Launches</p>
                  <p className="text-sm text-white/90 font-semibold">Events, community, and customer command center deploy in weeks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services + Software merge */}
      <section className="py-16 bg-slate-950/90 text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-white uppercase tracking-wide mb-2">One partner</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Services, software, and AI copilots now travel together</h2>
            <p className="text-lg text-indigo-100/80 max-w-3xl mx-auto">
              FinanceFlo is still the ERP & software reseller delivering Sage Intacct, Odoo, Microsoft, and NetSuite. Now that same pod deploys CapLiquify FP&A, ApexDeliver deal cloud, and AI-managed services inside the first 100 days.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {serviceStrands.map((strand) => (
              <div key={strand.title} className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col">
                <div className="text-sm uppercase tracking-[0.3em] text-white mb-3">Focus</div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{strand.title}</h3>
                <p className="text-indigo-100/80 mb-5 flex-1">{strand.description}</p>
                <ul className="space-y-3 text-indigo-100/90 mb-6">
                  {strand.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-50 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={strand.cta.link}
                  className="inline-flex items-center gap-2 text-white font-semibold"
                  onClick={() => trackCtaClick('service-strand', strand.title)}
                >
                  {strand.cta.text}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Platform map section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Platform blueprint</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Every sprint layers services, software, and AI copilots</h2>
            <p className="text-lg text-gray-600">
              Start with the FinanceFlo implementation pod, light up CapLiquify FP&A for cash visibility, expand into ApexDeliver for deals and pricing, and keep the AI consulting + managed support desk on retainer.
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
            <p className="text-sm font-semibold text-white uppercase tracking-wide mb-2">New this quarter</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">ERP, AI, and GTM launches shipping this quarter</h2>
            <p className="text-lg text-slate-200">
              Every sprint we publish new ERP accelerators, AI copilots, and GTM experiences so finance, deal, and commercial teams move faster with the same data spine.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {launchHighlights.map((launch) => (
              <div key={launch.title} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white mb-3">Launch</p>
                <h3 className="text-xl font-semibold mb-3">{launch.title}</h3>
                <p className="text-sm text-slate-200 mb-4">{launch.description}</p>
                <p className="text-sm font-semibold text-emerald-100">{launch.metric}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Four value sprints to blueprint, deploy, automate, and scale</h2>
            <p className="text-lg text-gray-600">Each FinanceFlo engagement follows the ADAPT plan so ERP, CapLiquify, ApexDeliver, and AI copilots show value within days instead of months.</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">One partner for ERP, finance, deal, revenue, and CX leaders</h2>
            <p className="text-lg text-gray-600">Private equity portfolios, strategics, and fast-moving operators finally share the same data, workflows, and guardrails across services and software.</p>
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
              How the FinanceFlo blueprint runs end to end
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Blueprint & Implement ERP
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Run the ADAPT workshop, migrate ledgers, clean master data, and configure Sage Intacct, Odoo, Microsoft, or NetSuite. We publish the governance plan, training cadence, and board-ready reporting pack inside the first two weeks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-700 rounded-full text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Activate CapLiquify + ApexDeliver
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Wire CapLiquify to your ERP actuals for 13-week cash, working-capital guardrails, promo analytics, and board packs. Turn on ApexDeliver for deal rooms, valuations, pricing studios, portals, and community so every team shares the same control tower.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-700 rounded-full text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Scale AI Copilots & Revenue Plays
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Deploy copilots, iPaaS flows, promotional guardrails, partner portals, events, and communities. Managed support pods keep shipping improvements, and analytics roll up to lenders, boards, and portfolio ops.
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
              Service pods and product modules for every stage
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
              Services + software pricing that scales with every entity
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Whether you're a single-entity operator or a multi-brand portfolio, start with the FinanceFlo implementation pod + CapLiquify FP&A, then expand into ApexDeliver, pricing studios, and managed services as you grow.
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
        headline="Ready to modernise ERP, FP&A, and deal execution with one partner?"
        description="Book your FinanceFlo blueprint, connect CapLiquify FP&A, and see the ApexDeliver stack in action with the same pod that implements Sage Intacct, Odoo, Microsoft, or NetSuite."
        primaryCtaText="Book Implementation Blueprint"
        primaryCtaLink="/contact"
        secondaryCtaText="Explore CapLiquify + ApexDeliver"
        secondaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};
