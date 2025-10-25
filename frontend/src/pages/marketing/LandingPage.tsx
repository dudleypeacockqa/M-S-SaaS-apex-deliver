import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { HeroSection } from '../../components/marketing/HeroSection';
import { FeatureCard } from '../../components/marketing/FeatureCard';
import { CTASection } from '../../components/marketing/CTASection';

export const LandingPage: React.FC = () => {
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
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Problem-Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
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
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">Traditional Enterprise Platforms</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>£10,000+ per user annually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Fragmented solutions requiring multiple subscriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Manual financial analysis and valuation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Limited AI capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Complex implementation and training</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-900 mb-3">ApexDeliver Platform</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Starting at £279/month (70% less expensive)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>All-in-one integrated ecosystem</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>AI-powered financial intelligence & valuations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Advanced AI for deal matching & document analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Setup in under 5 minutes, intuitive interface</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Execute M&A Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial deal sourcing to post-merger integration, ApexDeliver provides a comprehensive suite of tools designed for modern M&A professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by M&A Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of dealmakers who have transformed their M&A workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-900 font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">James Davidson</div>
                  <div className="text-sm text-gray-600">Independent M&A Advisor</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "ApexDeliver has been a game-changer for my practice. The AI-powered financial analysis saves me hours on every deal, and the pricing makes it accessible for solo practitioners like me."
              </p>
              <div className="mt-4 text-yellow-500">★★★★★</div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-900 font-bold">
                  SR
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Sarah Reynolds</div>
                  <div className="text-sm text-gray-600">VP, Growth Equity Fund</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Our team closed 30% more deals this quarter using ApexDeliver. The collaboration features and secure data rooms are best-in-class, and the ROI is undeniable."
              </p>
              <div className="mt-4 text-yellow-500">★★★★★</div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-900 font-bold">
                  MP
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Michael Park</div>
                  <div className="text-sm text-gray-600">Corporate Development Director</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The valuation suite and deal matching features are incredible. We discovered two acquisition targets through the platform that we wouldn't have found otherwise."
              </p>
              <div className="mt-4 text-yellow-500">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
