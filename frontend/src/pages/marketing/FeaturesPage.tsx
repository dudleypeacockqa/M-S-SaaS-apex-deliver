import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';
import { marketingIllustrations } from '../../assets/marketing';
import { createOrganizationSchema } from '../../utils/schemas/organizationSchema';
import { StructuredData } from '../../components/common/StructuredData';

export const FeaturesPage: React.FC = () => {
  // Generate SoftwareApplication schema for SEO
  const { ['@context']: _omit, ...provider } = createOrganizationSchema();
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ApexDeliver + CapLiquify',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '598.00',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
    },
    description: 'End-to-end M&A intelligence platform with deal pipeline management, financial analysis, valuation tools, and secure data rooms',
    url: 'https://financeflo.ai/features',
    provider,
    featureList: [
      'Deal Pipeline & Flow Management',
      'Financial Intelligence Engine (47+ ratios)',
      'Multi-Method Valuation Suite',
      'Secure Data Room',
      'AI-Powered Deal Matching',
      'Task & Workflow Automation',
      'Document Generation',
      '13-Week Cash Forecasting',
      'Working Capital Management',
    ],
  };

  return (
    <MarketingLayout>
      <SEO
        title="Features | ApexDeliver + CapLiquify"
        description="From CapLiquify FP&A to full M&A lifecycle management. Explore deal pipeline automation, financial intelligence, valuation tools, secure data rooms, and more."
        keywords="M&A features, deal pipeline, financial intelligence, valuation tools, data room, deal matching, M&A automation"
        ogUrl="https://financeflo.ai/features"
        ogTitle="FinanceFlo Feature Tour"
        ogDescription="Explore deal pipeline automation, AI analytics, valuation workflows, secure data rooms, and professional community features."
        ogImage="https://financeflo.ai/assets/pmi-integration-graphic.png"
        twitterTitle="FinanceFlo Feature Tour"
      twitterDescription="From AI-assisted valuations to secure data rooms, see everything the FinanceFlo platform covers."
      twitterImage="https://financeflo.ai/assets/pmi-integration-graphic.png"
      canonical="https://financeflo.ai/features"
    />
      <StructuredData json={softwareSchema} id="features-software-schema" />
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            A Feature for Every Stage of Your Growth Journey
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            From cash flow forecasting to deal closing and beyond, ApexDeliver + CapLiquify provides everything you need to transform your M&A and finance operations.
          </p>
        </div>
      </section>

      {/* Feature 1: Deal Pipeline Management */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Deal Flow & Pipeline Management</h2>
              <p className="text-lg text-gray-600 mb-6">
                Visualize and manage your entire M&A pipeline with powerful Kanban boards and list views. Track deals from initial sourcing through due diligence, negotiation, and closing.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Customizable pipeline stages tailored to your workflow</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Drag-and-drop deal cards for easy stage transitions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Team collaboration with assignments and comments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Activity timeline tracking all deal interactions</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.dealFlow.src}
                alt={marketingIllustrations.dealFlow.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Financial Intelligence Engine */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.financialIntelligence.src}
                alt={marketingIllustrations.financialIntelligence.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Intelligence Engine</h2>
              <p className="text-lg text-gray-600 mb-6">
                Connect directly to Sage Intacct or Odoo—or import CSVs—and get instant, AI-powered financial analysis with over 47 key ratios calculated automatically.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Native ERP integration for Sage Intacct and Odoo plus fast CSV uploads</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>47+ financial ratios across liquidity, profitability, leverage, and efficiency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>AI-generated narrative summaries highlighting insights and risks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Deal Readiness Score based on financial health and data quality</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Multi-Method Valuation Suite */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Multi-Method Valuation Suite</h2>
              <p className="text-lg text-gray-600 mb-6">
                Build professional-grade valuations using multiple methodologies. AI assists with assumptions, and real-time sensitivity analysis shows you all scenarios.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Discounted Cash Flow (DCF) with AI-assisted projections</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Public Comparables analysis with automatic peer identification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Precedent Transactions database and analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Real-time sensitivity and scenario analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Export to PDF and PowerPoint for presentations</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.valuationSuite.src}
                alt={marketingIllustrations.valuationSuite.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Secure Document Room */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.secureDataRoom.src}
                alt={marketingIllustrations.secureDataRoom.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure Document & Data Room</h2>
              <p className="text-lg text-gray-600 mb-6">
                Enterprise-grade data rooms with granular access controls, watermarking, version control, and comprehensive audit logs for complete security and compliance.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Bank-grade encryption for all documents at rest and in transit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Granular access permissions for internal and external users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Document watermarking and version control</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Detailed audit logs tracking all document access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Q&A workflow management for due diligence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 5: AI-Powered Deal Matching */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Deal Matching</h2>
              <p className="text-lg text-gray-600 mb-6">
                AI analyzes buy-side and sell-side mandates to suggest high-quality matches based on complex criteria beyond simple industry classification.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>AI matching considers industry, financials, geography, and strategic fit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Confidence scores and detailed match rationale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Network effects: more users = better matches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Confidential outreach through the platform</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.aiDealMatching.src}
                alt={marketingIllustrations.aiDealMatching.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 6: Automated Document Generation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.documentAutomation.src}
                alt={marketingIllustrations.documentAutomation.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-4xl mb-4">📄</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Automated Document Generation</h2>
              <p className="text-lg text-gray-600 mb-6">
                Generate professional M&A documents customized to your jurisdiction and deal terms. AI-powered contract review identifies risks instantly.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Library of templates: NDAs, LOIs, Term Sheets, SPAs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Multi-jurisdiction support with region-specific clauses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>AI customization based on deal-specific details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Contract review identifying non-standard terms and risks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Version control and collaborative editing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 7: Task & Workflow Automation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Task Management & Workflow Automation</h2>
              <p className="text-lg text-gray-600 mb-6">
                Never miss a critical step with pre-built checklists and automated task assignments that trigger when deals move between stages.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Pre-built templates for due diligence and integration planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Custom workflow creation for your firm's processes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Automated task assignments on stage transitions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Deadline tracking and automated reminders</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.workflowAutomation.src}
                alt={marketingIllustrations.workflowAutomation.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 8: Professional Community */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gray-100 rounded-2xl p-4 shadow-inner">
              <img
                src={marketingIllustrations.community.src}
                alt={marketingIllustrations.community.alt}
                loading="lazy"
                decoding="async"
                width={720}
                height={480}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Community Platform</h2>
              <p className="text-lg text-gray-600 mb-6">
                Network with M&A professionals, attend premium events, and access exclusive content. Build relationships that drive deal flow.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Professional networking and profile building</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Industry discussion forums and special interest groups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Premium events: forums, summits, masterclasses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Exclusive content and insights from industry leaders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Integration with deal flow for serendipitous opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
