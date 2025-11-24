import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';
import { CashFlowCalculator } from '../../components/marketing/CashFlowCalculator';
import { VideoShowcase } from '../../components/marketing/VideoShowcase';
import { StructuredData } from '../../components/common/StructuredData';
import { createBreadcrumbSchema } from '../../utils/schemas/breadcrumbSchema';

export const CapLiquifyFPAPage: React.FC = () => {
  const features = [
    {
      title: '13-Week Direct Cash Forecasting',
      description: 'Transform cash flow visibility from a 2-day Excel nightmare to a 2-hour automated forecast. Our direct method tracks every cash in and cash out with weekly granularity, giving you the precision lenders demand and the speed your business needs.',
      icon: '📊',
    },
    {
      title: 'Working Capital Drivers',
      description: 'Master your DSO, DPO, and DIO metrics with real-time tracking and scenario modeling. See exactly how changes in payment terms or inventory levels impact your cash position before you commit.',
      icon: '💰',
    },
    {
      title: 'AR/AP Roll-Forwards & Ageing',
      description: 'Automated receivables and payables roll-forwards with detailed ageing analysis. Identify collection risks and payment opportunities instantly, with drill-down to invoice level detail.',
      icon: '📈',
    },
    {
      title: 'Multi-Scenario Modeling',
      description: 'Build and compare base case, best case, and worst case scenarios in minutes. Model the impact of new deals, cost reductions, or market changes on your cash runway.',
      icon: '🎯',
    },
    {
      title: 'Lender-Ready PDF Packs',
      description: 'Generate professional board packs and lender reports in minutes, not days. Includes executive summary, cash forecast, working capital analysis, covenant tracking, and variance commentary.',
      icon: '📄',
    },
    {
      title: 'ERP Integration',
      description: 'Direct integration with Sage Intacct and Odoo for automated data sync. No more manual CSV exports or data entry errors. Your forecast updates as your business moves.',
      icon: '🔗',
    },
  ];

  const useCases = [
    {
      role: 'Portfolio CFO',
      challenge: 'Managing cash across 8 portfolio companies with different ERPs and reporting cycles',
      solution: 'Consolidated 13-week view across all entities, automated lender pack generation, covenant tracking by lender',
      result: '75% reduction in reporting time, zero missed covenant deadlines',
    },
    {
      role: 'Controller',
      challenge: 'Board demanding weekly cash updates but finance team buried in month-end close',
      solution: 'Automated cash forecast with ERP integration, scenario modeling for board questions',
      result: 'Weekly board updates in 30 minutes vs. 4 hours, improved forecast accuracy to 95%+',
    },
    {
      role: 'PMI Finance Lead',
      challenge: 'Acquired business has no cash forecasting process, lender demanding 13-week forecast within 2 weeks of close',
      solution: 'PMI Finance Ops Stabilisation (Option B) - clean chart of accounts, establish forecast, train team',
      result: 'Lender-ready forecast delivered in 10 days, acquired CFO trained and self-sufficient',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="CapLiquify FP&A - Transform Cash Flow Visibility in Hours, Not Days"
        description="13-week direct cash forecasting, working capital management, and lender-ready reporting for PE-backed businesses. Automate what takes 2 days in Excel in just 2 hours."
        keywords="13-week cash forecast, working capital management, DSO DPO DIO, lender reporting, FP&A software"
        ogUrl="https://financeflo.ai/capliquify-fpa"
        canonical="https://financeflo.ai/capliquify-fpa"
      />
      <StructuredData
        json={createBreadcrumbSchema([
          { name: 'Home', url: 'https://financeflo.ai/' },
          { name: 'CapLiquify FP&A', url: 'https://financeflo.ai/capliquify-fpa' },
        ])}
        id="capliquify-fpa-breadcrumbs"
      />

      {/* Hero Section with Dashboard Mockup */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Prop */}
            <div>
              <div className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                CapLiquify FP&A
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                Transform Cash Flow Visibility in <span className="text-emerald-400">2 Hours</span>, Not 2 Days
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                The only FP&A platform purpose-built for PE-backed businesses. 13-week direct cash forecasting, 
                working capital optimization, and lender-ready reporting—automated from your ERP.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">95%+</div>
                  <div className="text-sm text-indigo-100">Forecast Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">75%</div>
                  <div className="text-sm text-indigo-100">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">2 Hours</div>
                  <div className="text-sm text-indigo-100">Weekly Updates</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-lg"
                  onClick={() => trackCtaClick('start-trial', 'capliquify-hero')}
                >
                  Start 14-Day Free Trial
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border-2 border-white/30 text-lg"
                  onClick={() => trackCtaClick('book-demo', 'capliquify-hero')}
                >
                  Book a Demo
                </Link>
              </div>

              <button 
                onClick={() => {
                  document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' });
                  trackCtaClick('watch-demo', 'capliquify-hero');
                }}
                className="mt-6 flex items-center gap-3 text-emerald-300 hover:text-emerald-200 transition-colors group text-left"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/30">
                   <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div>
                  <span className="block font-semibold text-white">See it in action</span>
                  <span className="text-sm text-emerald-300/80">Watch the 60-second demo video</span>
                </div>
              </button>

              <p className="text-sm text-indigo-100 mt-8">
                £598/month + £2,500 one-time setup • No credit card required for trial
              </p>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <CashFlowCalculator />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
                Interactive Demo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <div id="demo-video">
        <VideoShowcase 
          title="From Excel Hell to Cash Clarity"
          description="See how CapLiquify automates your 13-week forecast, connects to your ERP in seconds, and generates board-ready reports without a single broken formula."
          thumbnailUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80"
        />
      </div>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for World-Class FP&A
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop wrestling with Excel. Start making data-driven decisions with confidence.
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
              Built for Your Role
            </h2>
            <p className="text-xl text-gray-600">
              Real challenges. Real solutions. Real results.
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
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Transforming Your Cash Flow Today
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            £598/month + £2,500 one-time setup. 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-lg"
              onClick={() => trackCtaClick('start-trial', 'capliquify-bottom-cta')}
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition text-lg"
              onClick={() => trackCtaClick('view-pricing', 'capliquify-bottom-cta')}
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
