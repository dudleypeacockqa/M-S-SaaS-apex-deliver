import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';

export const CookiePolicy: React.FC = () => {
  const lastUpdated = '2025-10-25';

  return (
    <MarketingLayout>
      <SEO
        title="Cookie Policy | 100 Days & Beyond"
        description="Understand how 100 Days & Beyond uses cookies and similar technologies to deliver secure, high-performance M&A workflows."
        keywords="100 Days & Beyond cookie policy, M&A platform cookies, tracking preferences"
        ogTitle="100 Days & Beyond Cookie Policy"
        ogDescription="Details on cookie usage for personalization, analytics, and security across the 100 Days & Beyond platform."
        ogUrl="https://100daysandbeyond.com/legal/cookies"
        ogImage="https://100daysandbeyond.com/assets/security-trust-visual.webp"
        twitterTitle="100 Days & Beyond Cookie Policy"
        twitterDescription="Manage cookie preferences for the 100 Days & Beyond AI-enabled M&A platform."
        twitterImage="https://100daysandbeyond.com/assets/security-trust-visual.webp"
        canonical="https://100daysandbeyond.com/legal/cookies"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p className="text-gray-700">
              ApexDeliver uses cookies to enhance your experience, analyze usage patterns, and provide personalized features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Essential Cookies</h3>
            <p className="text-gray-700 mb-2">
              <strong>Purpose:</strong> These cookies are necessary for the Service to function properly. They enable core functionality such as authentication, session management, and security.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Legal Basis:</strong> These cookies are strictly necessary and do not require consent.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Authentication cookies (Clerk session)</li>
              <li>Security cookies (CSRF protection)</li>
              <li>Load balancing cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Functional Cookies</h3>
            <p className="text-gray-700 mb-2">
              <strong>Purpose:</strong> These cookies allow us to remember your preferences and provide enhanced features.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Language preferences</li>
              <li>Theme settings (light/dark mode)</li>
              <li>Dashboard layout preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Analytics Cookies</h3>
            <p className="text-gray-700 mb-2">
              <strong>Purpose:</strong> These cookies help us understand how visitors interact with the Service, allowing us to improve performance and user experience.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Google Analytics (usage patterns, page views)</li>
              <li>Performance monitoring (page load times, errors)</li>
              <li>Feature usage tracking</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Note:</strong> We anonymize IP addresses and do not collect personally identifiable information through analytics cookies.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Marketing Cookies</h3>
            <p className="text-gray-700 mb-2">
              <strong>Purpose:</strong> These cookies track your activity across websites to deliver relevant advertising and measure campaign effectiveness.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Retargeting pixels</li>
              <li>Social media tracking (LinkedIn, Twitter)</li>
              <li>Conversion tracking</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Control:</strong> You can opt out of marketing cookies through our cookie banner or browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use third-party services that may set cookies on your device:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Clerk (Authentication):</strong> Session management, security</li>
              <li><strong>Stripe (Payments):</strong> Payment processing, fraud detection</li>
              <li><strong>Google Analytics:</strong> Usage analytics</li>
              <li><strong>Sentry (Monitoring):</strong> Error tracking, performance</li>
            </ul>
            <p className="text-gray-700">
              These third parties have their own privacy policies governing their use of cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How to Control Cookies</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Cookie Banner</h3>
            <p className="text-gray-700 mb-4">
              When you first visit ApexDeliver, we display a cookie banner allowing you to accept or reject non-essential cookies. You can change your preferences at any time in your account settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              Most browsers allow you to control cookies through their settings:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Note:</strong> Blocking essential cookies may prevent the Service from functioning properly.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Opt-Out Links</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-indigo-900 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out</a></li>
              <li><a href="https://www.youronlinechoices.com/" className="text-indigo-900 hover:underline" target="_blank" rel="noopener noreferrer">Your Online Choices (EU)</a></li>
              <li><a href="https://optout.networkadvertising.org/" className="text-indigo-900 hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative Opt-Out</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie Duration</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain until expiration date or manual deletion</li>
              <li><strong>Authentication Cookies:</strong> 7 days (Clerk session)</li>
              <li><strong>Preference Cookies:</strong> 1 year</li>
              <li><strong>Analytics Cookies:</strong> 2 years (Google Analytics)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Updates to This Cookie Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page with a new "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              If you have questions about our use of cookies, please contact:
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li>Email: privacy@apexdeliver.com</li>
              <li>Address: ApexDeliver Ltd, London, United Kingdom</li>
            </ul>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
};
