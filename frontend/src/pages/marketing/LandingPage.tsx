import { MarketingLayout } from '../../components/marketing/MarketingLayout'
import { EnhancedHeroSection } from '../../components/marketing/EnhancedHeroSection'
import { TrustBadges } from '../../components/marketing/TrustBadges'
import { FeatureCard } from '../../components/marketing/FeatureCard'
import { CTASection } from '../../components/marketing/CTASection'
import { SEO } from '../../components/common/SEO'
import { ROICalculator } from '../../components/marketing/ROICalculator'
import { ComparisonTable } from '../../components/marketing/ComparisonTable'

const capliquifyHighlights = [
  {
    title: '13-week rolling cash forecast',
    description: 'Automated actuals ingestion, weekly variance explanations, and proactive alerts when runway dips below guardrails.',
    metric: '95.8% accuracy',
  },
  {
    title: 'Working-capital cockpit',
    description: 'Live AR/AP roll-forwards, DSO/DPO/DIO insights, and scenario modelling that tie directly to lending packages.',
    metric: '£2.8M unlocked',
  },
  {
    title: 'Upsell into deal execution',
    description: 'Seamlessly graduate into ApexDeliver deal rooms, valuations, and master admin controls when the team is ready.',
    metric: '70% faster',
  },
]

const howItWorks = [
  {
    step: '1',
    title: 'Connect your ledgers',
    description: 'Securely sync Sage Intacct, Odoo, or upload CFO-ready CSVs. Normalisation happens in minutes.',
  },
  {
    step: '2',
    title: 'Generate forecast & actions',
    description: 'CapLiquify produces the 13-week cash view, variance analysis, and working-capital playbook automatically.',
  },
  {
    step: '3',
    title: 'Execute inside ApexDeliver',
    description: 'Promote insights into deal rooms, approval workflows, and master admin dashboards for end-to-end coverage.',
  },
]

const featureHighlights = [
  {
    icon: '📈',
    title: 'CapLiquify FP&A',
    description: 'Forecasting, working-capital automation, and reporting that clicks into the M&A workspace.',
  },
  {
    icon: '💡',
    title: 'Sales & Promotion Pricing',
    description: 'Dynamic pricing rules, quote portals, and promotions for revenue teams that need speed.',
  },
  {
    icon: '📂',
    title: 'Secure Data Rooms',
    description: 'Granular permissioning, watermarking, and immutable audit trails for diligence and PMI.',
  },
  {
    icon: '🤖',
    title: 'AI copilots & valuations',
    description: 'Deal narratives, scenario models, and board-ready exports powered by explainable AI.',
  },
]

const pricingTiers = [
  {
    name: 'CapLiquify FP&A',
    price: '£598/mo + £2,500 setup',
    description: 'Foundation layer – forecasting, working capital, lender packs.',
    bullets: ['Unlimited forecast versions', 'Variance explanations + alerts', 'Portfolio & single-entity views'],
    badge: 'Most popular',
  },
  {
    name: 'ApexDeliver Professional',
    price: '£1,598/mo + £7,500 setup',
    description: 'Everything in FP&A plus deal rooms, valuations, and automation.',
    bullets: ['Secure document room', 'Multi-method valuation suite', 'Workflow automation + AI copilots'],
  },
  {
    name: 'Enterprise / Community Leader',
    price: 'Custom + £30k setup',
    description: 'Master admin controls, multi-brand roll-outs, and partner APIs.',
    bullets: ['Multi-tenant master admin portal', 'Advanced entitlement + billing controls', 'Dedicated deployment pod'],
  },
]

const socialProofStats = [
  {
    value: '450+',
    label: 'finance & deal teams onboarded',
    detail: 'Portfolio CFOs, independent sponsors, strategics',
  },
  {
    value: '66%',
    label: 'reduction in manual prep',
    detail: 'Cash + diligence packs delivered in hours, not days',
  },
  {
    value: '500%',
    label: 'average ROI inside 12 months',
    detail: 'Working-capital unlock, faster closes, lower fees',
  },
]

const customerLogos = ['Brookline Partners', 'Northwind Equity', 'Seven Peaks PE', 'Oriant Capital', 'Fjord Holdings']

const marqueeTestimonial = {
  quote:
    'CapLiquify gave us the 13-week runway view and ApexDeliver handled diligence—our partners get one dashboard and our ops team saved 20 hours a week.',
  name: 'Sarah Chen',
  role: 'Portfolio CFO, Apex Capital',
}

const caseStudies = [
  {
    company: 'Northwind Equity',
    headline: 'Unlocked £4.2M in trapped working capital in 90 days',
    quote: 'CapLiquify surfaced the exact AR cohorts holding up cash and ApexDeliver automated the follow-up inside our deal rooms.',
    author: 'Leah Patel — Portfolio CFO',
    metric: '66% faster lender package prep',
  },
  {
    company: 'Seven Peaks PE',
    headline: 'Cut deal diligence time by 30% with one workspace',
    quote: 'Finance, ops, and the deal team finally shared the same numbers. The ROI is obvious every Monday stand-up.',
    author: 'Marcus Thorn — Managing Partner',
    metric: '12 hrs saved per week',
  },
  {
    company: 'Fjord Holdings',
    headline: 'Scaled to 12 acquisitions without adding analysts',
    quote: 'CapLiquify catches cash issues while ApexDeliver handles the secure collaboration and master admin controls.',
    author: 'Amelia Hughes — VP Corporate Development',
    metric: '500% platform ROI',
  },
]

export const LandingPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="CapLiquify FP&A + ApexDeliver | 13-Week Cash Forecasting + M&A Platform"
        description="Start with CapLiquify FP&A (£598/mo + £2,500 setup) for 13-week cash forecasting, then upgrade into ApexDeliver for deal rooms, valuations, and master-admin controls."
        keywords="CapLiquify FP&A, cash forecasting software, working capital automation, ApexDeliver platform, M&A intelligence"
        ogTitle="CapLiquify FP&A + ApexDeliver"
        ogDescription="13-week cash forecasting, working-capital automation, and ApexDeliver’s full M&A workspace in one stack."
        ogUrl="https://100daysandbeyond.com/"
        ogImage="https://100daysandbeyond.com/assets/dashboard-preview.png"
        canonical="https://100daysandbeyond.com/"
      />
      <main>
        <EnhancedHeroSection />
        <TrustBadges />
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">Proof in the portfolio</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Finance leaders trust CapLiquify before scaling into ApexDeliver</h2>
                <p className="text-lg text-gray-600 mb-8">Land with cash forecasting and working-capital wins, then invite deal, legal, and master admin teams once the foundation is in place.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {socialProofStats.map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                      <div className="text-3xl font-extrabold text-indigo-900">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">{stat.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <p className="text-indigo-900 text-lg font-semibold mb-4">“{marqueeTestimonial.quote}”</p>
                <div className="text-sm text-gray-700">
                  <div className="font-bold">{marqueeTestimonial.name}</div>
                  <div>{marqueeTestimonial.role}</div>
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase text-gray-500 tracking-widest mb-3">Customer logos</p>
                  <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                    {customerLogos.map((logo) => (
                      <span key={logo} className="px-3 py-1 bg-white rounded-full border border-gray-200">
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CapLiquify value prop */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-3">CapLiquify FP&A in action</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Financial intelligence that feeds the entire ApexDeliver platform</h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect Sage Intacct, Odoo, or clean CSVs in minutes. CapLiquify automates the 13-week cash view, highlights working-capital opportunities, and hands structured actions to deal teams and the master admin portal.
              </p>

              <div className="space-y-4">
                {capliquifyHighlights.map((item) => (
                  <div key={item.title} className="border-l-4 border-emerald-600 pl-4">
                    <p className="text-xs tracking-wide text-emerald-700 font-semibold mb-1">{item.metric}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <img
                src="/assets/dashboard-preview.png"
                alt="CapLiquify FP&A dashboard"
                className="w-full rounded-xl shadow-lg"
                loading="lazy"
              />
              <p className="text-sm text-gray-500 mt-4 text-center">Live dashboard mockup — 13-week cash runway, DS/DSO/DPO, and recommended actions.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Implementation</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How CapLiquify + ApexDeliver roll out</h2>
              <p className="text-lg text-gray-600">A predictable playbook so finance, deal, and operations teams see value within the first week.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Unified platform</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need to run modern M&A and FP&A</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Lead with CapLiquify, then unlock document security, valuations, campaigns, and the master admin portal when you are ready.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureHighlights.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <ROICalculator />
        <ComparisonTable />

        {/* Pricing teaser */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">Pricing & setup</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start with CapLiquify, scale into ApexDeliver</h2>
              <p className="text-lg text-slate-200">Transparent pricing that matches the maturity of your finance and deal teams.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div key={tier.name} className="bg-slate-800/70 border border-white/10 rounded-2xl p-6 flex flex-col">
                  {tier.badge && <span className="inline-flex mb-4 text-xs font-semibold text-emerald-100 bg-emerald-700/30 px-3 py-1 rounded-full w-fit">{tier.badge}</span>}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-lg text-emerald-300 font-semibold">{tier.price}</p>
                  <p className="text-sm text-slate-300 mt-2 mb-4">{tier.description}</p>
                  <ul className="space-y-2 text-sm text-slate-200 mb-6">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <p className="text-xs text-slate-400">Includes onboarding, dedicated Slack channel, and deployment checklist.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Case studies</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Proof from active portfolios</h2>
              <p className="text-lg text-gray-600">Private equity, independent sponsors, and strategics use CapLiquify FP&A to fuel ApexDeliver execution.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((study) => (
                <div key={study.company} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">{study.company}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{study.headline}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">“{study.quote}”</p>
                  <div className="text-sm font-semibold text-indigo-900">{study.author}</div>
                  <div className="text-xs text-gray-500">{study.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </MarketingLayout>
  )
}
