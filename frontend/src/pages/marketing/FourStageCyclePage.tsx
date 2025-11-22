import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';
import { InteractiveTimeline } from '../../components/marketing/InteractiveTimeline';
import { StructuredData } from '../../components/common/StructuredData';
import { createBreadcrumbSchema } from '../../utils/schemas/breadcrumbSchema';

export const FourStageCyclePage: React.FC = () => {
  const stages = [
    {
      number: 1,
      title: 'Evaluation',
      subtitle: 'Pre-LOI Due Diligence',
      timeline: 'Weeks 1-4',
      description: 'Assess deal viability before committing. Quickly evaluate financial health, identify red flags, and build your investment thesis with confidence.',
      capabilities: [
        'AI-powered deal sourcing and matching',
        'Financial intelligence engine (47+ ratios)',
        'Quick QoE (Quality of Earnings) analysis',
        'Preliminary valuation (DCF, Comps, Precedents)',
        'Red flag detection and risk scoring',
      ],
      outcomes: [
        'Go/No-Go decision in days, not weeks',
        'Confident LOI submission with data backing',
        'Identified value creation opportunities',
      ],
      cta: 'See Deal Sourcing in Action',
      ctaLink: '/features',
    },
    {
      number: 2,
      title: 'Pre-Deal',
      subtitle: 'LOI to Close',
      timeline: 'Weeks 5-12',
      description: 'Execute due diligence with precision. Collaborate with advisors, manage the data room, finalize valuation, and negotiate terms—all in one secure platform.',
      capabilities: [
        'Secure data room with watermarking (100GB)',
        'Collaborative due diligence workflows',
        'Multi-method valuation suite',
        'Deal pipeline and milestone tracking',
        'Automated document generation (IOI, LOI, SPA)',
        'Financial model building and stress testing',
      ],
      outcomes: [
        '40% faster deal close',
        'Reduced advisor fees through self-service tools',
        'Watertight due diligence documentation',
      ],
      cta: 'Explore Data Room Features',
      ctaLink: '/features',
    },
    {
      number: 3,
      title: 'Post-Deal',
      subtitle: 'PMI Finance Ops Stabilisation',
      timeline: 'Weeks 13-16 (First 100 Days)',
      description: 'Hit the ground running post-close. Stabilize finance operations, establish cash forecasting, and deliver lender-ready reporting within 2-4 weeks.',
      capabilities: [
        'PMI Finance Ops Stabilisation (Option B)',
        'Chart of accounts mapping and cleanup',
        'Opening balance reconciliation',
        '13-week direct cash forecast setup',
        'Working capital tracking (DSO/DPO/DIO)',
        'Lender pack generation and covenant tracking',
        'Finance team training and handover',
      ],
      outcomes: [
        'Lender-ready forecast in 10 days',
        'Clean financials from day one',
        'Finance team trained and self-sufficient',
      ],
      cta: 'Learn About PMI Services',
      ctaLink: '/capliquify-fpa',
    },
    {
      number: 4,
      title: 'Ongoing Operations',
      subtitle: 'BAU Finance & Value Creation',
      timeline: 'Month 4+',
      description: 'Drive continuous improvement. Monitor performance, optimize working capital, track value creation initiatives, and prepare for the next deal or exit.',
      capabilities: [
        'Weekly 13-week cash forecast updates',
        'Working capital optimization (DSO/DPO/DIO)',
        'KPI dashboards and board reporting',
        'Covenant tracking and lender communication',
        'Scenario modeling for strategic decisions',
        'Value creation initiative tracking',
        'Exit readiness and buyer pack preparation',
      ],
      outcomes: [
        '75% reduction in reporting time',
        '95%+ forecast accuracy',
        'Proactive cash management vs. reactive firefighting',
      ],
      cta: 'See FP&A Platform',
      ctaLink: '/capliquify-fpa',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="4-Stage M&A Cycle - Evaluation to Exit | CapLiquify + ApexDeliver"
        description="Master every stage of the M&A lifecycle: Evaluation, Pre-Deal, Post-Deal PMI, and Ongoing Operations. Purpose-built for PE firms and active dealmakers."
        keywords="M&A lifecycle, deal evaluation, PMI finance ops, post-merger integration, ongoing operations"
      />
      <StructuredData
        json={createBreadcrumbSchema([
          { name: 'Home', url: 'https://financeflo.ai/' },
          { name: 'Solutions', url: 'https://financeflo.ai/solutions' },
          { name: 'PMI', url: 'https://financeflo.ai/solutions/pmi' },
        ])}
        id="four-stage-cycle-breadcrumbs"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            The 4-Stage M&A Cycle
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            From First Look to <span className="text-emerald-400">Value Creation</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-12">
            CapLiquify + ApexDeliver is the only platform purpose-built for the entire M&A lifecycle—from 
            deal sourcing to post-merger integration to ongoing finance operations.
          </p>

          {/* Visual Cycle Diagram */}
          <div className="max-w-5xl mx-auto">
            <InteractiveTimeline />
          </div>
        </div>
      </section>

      {/* Detailed Stages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Left: Stage Info */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {stage.number}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{stage.title}</h2>
                      <p className="text-lg text-gray-600">{stage.subtitle}</p>
                    </div>
                  </div>

                  <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {stage.timeline}
                  </div>

                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Key Capabilities</h3>
                    <ul className="space-y-2">
                      {stage.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-start">
                          <span className="text-emerald-700 mr-3 flex-shrink-0 mt-1">✓</span>
                          <span className="text-gray-700">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Outcomes</h3>
                    <ul className="space-y-2">
                      {stage.outcomes.map((outcome, outIndex) => (
                        <li key={outIndex} className="flex items-start">
                          <span className="text-purple-600 mr-3 flex-shrink-0 mt-1">→</span>
                          <span className="text-gray-700 font-semibold">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={stage.ctaLink}
                    className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
                    onClick={() => trackCtaClick(`stage-${stage.number}-cta`, '4-stage-cycle')}
                  >
                    {stage.cta}
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Right: Visual/Mockup */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                    {/* Stage-specific visual mockup */}
                    <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="text-6xl mb-4">
                          {index === 0 && '🔍'}
                          {index === 1 && '📊'}
                          {index === 2 && '🚀'}
                          {index === 3 && '📈'}
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{stage.title}</h4>
                        <p className="text-gray-600">{stage.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Master the Full M&A Cycle?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start with CapLiquify FP&A (£598/mo) or go all-in with ApexDeliver Professional (£1,598/mo). 
            14-day free trial on all plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-lg"
              onClick={() => trackCtaClick('start-trial', '4-stage-bottom-cta')}
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition text-lg"
              onClick={() => trackCtaClick('view-pricing', '4-stage-bottom-cta')}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
