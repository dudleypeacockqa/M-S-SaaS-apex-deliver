import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { EnhancedHeroSection } from '../../components/marketing/EnhancedHeroSection';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { ROICalculator } from '../../components/marketing/ROICalculator';
import { ComparisonTable } from '../../components/marketing/ComparisonTable';
import { EnhancedTestimonials } from '../../components/marketing/EnhancedTestimonials';
import { FAQSection } from '../../components/marketing/FAQSection';
import { TrustBadges } from '../../components/marketing/TrustBadges';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';

export const EnhancedLandingPage: React.FC = () => {
  const features = [
    {
      icon: '📊',
      title: 'Deal Pipeline Management',
      description: 'Visualize and manage your M&A deals from sourcing to closing with customizable Kanban boards and list views. Track progress, assign tasks, and collaborate seamlessly with your team.',
    },
    {
      icon: '🧠',
      title: 'Financial Intelligence Engine',
      description: 'Connect to major accounting platforms (Xero, QuickBooks, Sage, NetSuite) and get instant analysis with 47+ financial ratios, AI-generated narratives, and Deal Readiness Scores.',
    },
    {
      icon: '💰',
      title: 'Multi-Method Valuation Suite',
      description: 'Build professional valuations using DCF, Public Comparables, and Precedent Transactions. AI assists with assumptions, and real-time sensitivity analysis shows all scenarios.',
    },
    {
      icon: '🔒',
      title: 'Secure Document Room',
      description: 'Enterprise-grade data rooms with granular access controls, watermarking, version control, and detailed audit logs. Manage Q&A workflows and document sharing with confidence.',
    },
    {
      icon: '🤝',
      title: 'AI-Powered Deal Matching',
      description: 'Intelligent matching between buy-side and sell-side mandates based on industry, financials, geography, and strategic fit. Network effects create more opportunities as the platform grows.',
    },
    {
      icon: '📄',
      title: 'Automated Document Generation',
      description: 'Generate NDAs, LOIs, Term Sheets, and SPAs customized to your jurisdiction and deal terms. AI-powered contract review identifies risks and negotiation points instantly.',
    },
    {
      icon: '✅',
      title: 'Task & Workflow Automation',
      description: 'Pre-built checklists for due diligence and integration planning. Automate task assignments when deals move between stages, ensuring nothing falls through the cracks.',
    },
    {
      icon: '👥',
      title: 'Professional Community',
      description: 'Network with M&A professionals, join industry discussions, attend premium events, and access exclusive content. Build relationships that drive deal flow and knowledge sharing.',
    },
    {
      icon: '🔄',
      title: 'Post-Merger Integration',
      description: 'Seamlessly transition from deal closing to Day 1 success with our integrated PMI services powered by FinanceFlo.ai. ERP consolidation, financial systems integration, and synergy tracking.',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="ApexDeliver - Complete M&A Lifecycle Platform | From Deal Sourcing to Day 100 Success"
        description="The only M&A platform combining AI-powered deal intelligence with post-merger integration. Close deals 70% faster and ensure integration success. Starting at £279/month."
        keywords="M&A platform, deal flow management, financial intelligence, valuation software, M&A software, private equity tools, dealmaker platform, post-merger integration, PMI, ERP integration"
        ogTitle="ApexDeliver - Complete M&A Lifecycle Platform"
        ogDescription="From deal sourcing to Day 100 success. AI-powered M&A intelligence + seamless post-merger integration. 70% less than enterprise platforms."
        ogUrl="https://apexdeliver.com"
        canonical="https://apexdeliver.com"
      />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Problem-Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The M&A Industry Has an Accessibility Problem
            </h2>
            <p className="text-xl text-gray-600">
              Professional M&A platforms cost £10,000+ annually and are designed exclusively for enterprise clients.
              Solo dealmakers, small firms, and emerging funds are priced out of professional-grade tools—until now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problem */}
            <div className="relative bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-8 rounded-2xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                ✗
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-6">Traditional Enterprise Platforms</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">£10,000+ per user annually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">Fragmented solutions requiring multiple subscriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">Manual financial analysis and valuation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">Limited AI capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">Complex implementation and training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">✗</span>
                  <span className="text-lg">No post-merger integration support</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 p-8 rounded-2xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-6">ApexDeliver Platform</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">Starting at £279/month (70% less expensive)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">All-in-one integrated ecosystem</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">AI-powered financial intelligence & valuations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">Advanced AI for deal matching & document analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">Setup in under 5 minutes, intuitive interface</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span className="text-lg">Complete PMI support via FinanceFlo.ai</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Execute M&A Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial deal sourcing to post-merger integration, ApexDeliver provides a comprehensive suite of tools designed for modern M&A professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* PMI Integration Section - NEW */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full text-green-200 text-sm font-medium mb-6 backdrop-blur-sm border border-green-400/30">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Powered by FinanceFlo.ai
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Don't Stop at the Deal.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">
                Ensure Integration Success.
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              70% of M&A deals fail to achieve expected synergies due to poor integration. ApexDeliver is the only platform that takes you from deal sourcing through Day 100 success with seamless post-merger integration services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Pre-Deal */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Pre-Deal</h3>
              <p className="text-blue-200 mb-4">ApexDeliver Platform</p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Deal sourcing & matching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Pipeline management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Financial due diligence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Valuation & modeling</span>
                </li>
              </ul>
            </div>

            {/* Deal Execution */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Deal Execution</h3>
              <p className="text-blue-200 mb-4">ApexDeliver Platform</p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Secure document room</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Document automation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Negotiation tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Deal closing workflow</span>
                </li>
              </ul>
            </div>

            {/* Post-Merger Integration */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-400/50 relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full">
                NEW
              </div>
              <div className="w-16 h-16 bg-green-500/30 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Post-Merger Integration</h3>
              <p className="text-green-200 mb-4 font-semibold">FinanceFlo.ai PMI Services</p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>ERP consolidation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Financial systems integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Synergy tracking & realization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Day 1-100 success planning</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://financeflo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-2xl"
            >
              Learn More About PMI Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-blue-200 text-sm mt-4">
              Part of the FinanceFlo Group - Complete M&A Lifecycle Solutions
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Comparison Table */}
      <ComparisonTable />

      {/* Enhanced Testimonials */}
      <EnhancedTestimonials />

      {/* Trust Badges & Security */}
      <TrustBadges />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};

