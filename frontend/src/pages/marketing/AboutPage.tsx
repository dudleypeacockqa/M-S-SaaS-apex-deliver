import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { CTASection } from '../../components/marketing/CTASection';
import { SEO } from '../../components/common/SEO';

export const AboutPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="About | 100 Days & Beyond"
        description="Our mission: empower ambitious businesses with financial intelligence. Learn about our journey from ERP specialists to building the end-to-end M&A intelligence platform."
        keywords="about 100 Days & Beyond, M&A platform mission, dealmaker tools, M&A software company"
        ogTitle="About 100 Days & Beyond"
        ogDescription="Meet the team transforming the M&A lifecycle with accessible, AI-first tooling."
        ogUrl="https://100daysandbeyond.com/about"
        ogImage="https://100daysandbeyond.com/assets/brand/apexdeliver-wordmark.svg"
        twitterTitle="About 100 Days & Beyond"
        twitterDescription="Discover why 100 Days & Beyond exists and how we help modern dealmakers win."
        twitterImage="https://100daysandbeyond.com/assets/brand/apexdeliver-wordmark.svg"
        canonical="https://100daysandbeyond.com/about"
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Our Mission: To Empower Ambitious Businesses with Financial Intelligence
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Backed by 20+ years of experience and over 230+ successful business transformations
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We believe that every business, regardless of size, deserves access to the same level of financial and strategic tooling as the world's largest corporations. ApexDeliver was born from decades of hands-on experience in finance, technology, and M&A. We saw firsthand how disconnected systems, manual processes, and a lack of forward-looking data were holding businesses back.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our founders, a team of seasoned ERP specialists, fractional CFOs, and AI engineers, set out to build a different kind of platform. One that doesn't just report on the past, but helps you shape the future. One that unifies the entire M&A and finance lifecycle, from the initial spark of a deal to the long-term value creation that follows.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Today, our platform is the engine behind hundreds of successful business transformations, delivering an average ROI of 300-500% for our clients. We're more than just a software company; we are your partners in growth.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center mt-12">Our Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We envision a future where every business has the financial intelligence and strategic tools needed to thrive. Where cash flow is predictable, pricing is optimized, and M&A deals are executed with confidence and precision. Where technology empowers finance teams to be strategic partners, not just record-keepers.
          </p>
          <p className="text-lg text-gray-700 mt-6 leading-relaxed">
            By combining CapLiquify's forward-looking FP&A capabilities with ApexDeliver's comprehensive M&A suite, we're creating a unified platform that supports businesses at every stage of their growth journey—from stabilizing cash flow to executing transformational deals and beyond.
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
