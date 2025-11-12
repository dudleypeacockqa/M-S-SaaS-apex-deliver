import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';

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
                  <div className="text-sm text-indigo-200">Forecast Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">75%</div>
                  <div className="text-sm text-indigo-200">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">2 Hours</div>
                  <div className="text-sm text-indigo-200">Weekly Updates</div>
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

              <p className="text-sm text-indigo-200 mt-4">
                £598/month + £2,500 one-time setup • No credit card required for trial
              </p>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">13-Week Cash Forecast</h3>
                  <span className="text-sm text-emerald-700 font-semibold">Updated 2 min ago</span>
                </div>

                {/* Mockup Chart */}
                <div className="space-y-4">
                  {/* Cash Balance Line */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Ending Cash Balance</span>
                      <span className="font-bold text-gray-900">£2.4M</span>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg relative overflow-hidden">
                      {/* Simulated line chart */}
                      <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
                        <path
                          d="M 0 80 Q 50 70 100 65 T 200 60 T 300 55 T 400 50"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                        <path
                          d="M 0 80 Q 50 70 100 65 T 200 60 T 300 55 T 400 50 L 400 128 L 0 128 Z"
                          fill="url(#gradient)"
                          opacity="0.3"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Working Capital Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">DSO</div>
                      <div className="text-lg font-bold text-gray-900">42 days</div>
                      <div className="text-xs text-emerald-700">↓ 3 days</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">DPO</div>
                      <div className="text-lg font-bold text-gray-900">35 days</div>
                      <div className="text-xs text-emerald-700">↑ 2 days</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">DIO</div>
                      <div className="text-lg font-bold text-gray-900">28 days</div>
                      <div className="text-xs text-red-600">↑ 1 day</div>
                    </div>
                  </div>

                  {/* Scenario Toggle */}
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-emerald-700 text-white text-xs font-semibold rounded">
                      Base Case
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200">
                      Best Case
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200">
                      Worst Case
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
                Live Demo
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
