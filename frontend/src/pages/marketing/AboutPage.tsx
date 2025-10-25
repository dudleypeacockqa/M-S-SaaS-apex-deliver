import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';

export const AboutPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="About ApexDeliver | Democratizing M&A Tools for Dealmakers"
        description="Learn about ApexDeliver's mission to democratize professional M&A tools. Founded to make enterprise-grade deal intelligence accessible at £279/month vs £10k+ enterprise platforms."
        keywords="about ApexDeliver, M&A platform mission, dealmaker tools, M&A software company"
        ogUrl="https://ma-saas-platform.onrender.com/about"
        canonical="https://ma-saas-platform.onrender.com/about"
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            About ApexDeliver
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Democratizing access to professional M&A tools for dealmakers worldwide
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            ApexDeliver exists to democratize access to professional-grade M&A tools. For too long, solo dealmakers, small advisory firms, and emerging private equity funds have been priced out of the enterprise software market, forced to choose between prohibitively expensive platforms (£10,000+ annually) or cobbling together fragmented solutions that create inefficiency and risk.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We believe every M&A professional deserves access to the same quality of tools used by large investment banks and corporate development teams—regardless of their firm size or budget. By combining cutting-edge AI, intuitive design, and accessible pricing, we're leveling the playing field and empowering dealmakers to compete on merit, not on tool budgets.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center mt-12">Our Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We envision a future where M&A execution is faster, smarter, and more accessible. Where AI-powered intelligence replaces hours of manual analysis. Where deal flow is driven by intelligent matching and network effects, not just who you know. Where secure collaboration happens seamlessly, and professional documents are generated in seconds, not days.
          </p>
          <p className="text-lg text-gray-700 mt-6 leading-relaxed">
            Beyond the platform itself, ApexDeliver is building an ecosystem—a professional community where dealmakers connect, learn, and grow together. Through premium events, exclusive content, and knowledge sharing, we're creating network effects that benefit every user.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Founder Story</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              ApexDeliver was founded by Dudley Peacock, an M&A professional who experienced firsthand the accessibility problem in the industry. After years of working with both enterprise platforms and makeshift solutions, Dudley recognized a massive opportunity: build a platform that delivers enterprise-grade capabilities at accessible pricing, powered by modern AI.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              The vision extends beyond just building great software. ApexDeliver is designed as a revenue-generating engine to fund a systematic LBO acquisition strategy, with a long-term goal of achieving £200M in personal wealth and establishing an institutional private equity fund. This alignment of interests ensures the platform's success is directly tied to creating value for users—when ApexDeliver grows, everyone benefits.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With a background in M&A execution, technology, and entrepreneurship, Dudley brings a unique perspective: building tools that solve real problems for real dealmakers, not just theoretical features that look good in a pitch deck.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-First Design</h3>
              <p className="text-gray-600">
                Every feature is built to solve real problems for M&A professionals. We prioritize usability, performance, and value over unnecessary complexity.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security & Trust</h3>
              <p className="text-gray-600">
                M&A deals involve sensitive data. We implement bank-grade security, GDPR compliance, and transparent data handling practices to earn your trust.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Innovation</h3>
              <p className="text-gray-600">
                The M&A landscape evolves rapidly. We continuously integrate the latest AI advancements and user feedback to stay ahead of the curve.
              </p>
            </div>

            {/* Value 4 */}
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Clear pricing, honest communication, and straightforward terms. No hidden fees, no vendor lock-in, no surprises.
              </p>
            </div>

            {/* Value 5 */}
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community-Driven</h3>
              <p className="text-gray-600">
                We're building more than software—we're building a community. User feedback shapes our roadmap, and network effects benefit everyone.
              </p>
            </div>

            {/* Value 6 */}
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Speed & Efficiency</h3>
              <p className="text-gray-600">
                Time is money in M&A. Our platform is optimized for performance, with AI automating repetitive tasks so you can focus on strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">70%</div>
              <div className="text-gray-600">Cost Savings vs. Enterprise Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">47+</div>
              <div className="text-gray-600">Financial Ratios Calculated Automatically</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">99.95%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-900 mb-2">{`< 2s`}</div>
              <div className="text-gray-600">Average Page Load Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
