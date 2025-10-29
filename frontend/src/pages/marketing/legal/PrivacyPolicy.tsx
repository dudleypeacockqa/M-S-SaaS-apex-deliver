import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = '2025-10-25';

  return (
    <MarketingLayout>
      <SEO
        title="Privacy Policy | ApexDeliver M&A Platform"
        description="Learn how ApexDeliver collects, processes, and protects personal and deal data across the AI-powered M&A lifecycle platform."
        keywords="ApexDeliver privacy policy, M&A software GDPR, data protection"
        ogTitle="ApexDeliver Privacy Policy"
        ogDescription="Transparency into data collection, storage, and usage within the ApexDeliver ecosystem."
        ogUrl="https://apexdeliver.com/legal/privacy"
        ogImage="https://apexdeliver.com/assets/security-trust-visual.webp"
        twitterTitle="ApexDeliver Privacy Policy"
        twitterDescription="Review data privacy commitments for ApexDeliver's M&A intelligence platform."
        twitterImage="https://apexdeliver.com/assets/security-trust-visual.webp"
        canonical="https://apexdeliver.com/legal/privacy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-blue-900 font-semibold">GDPR Compliant</p>
          <p className="text-blue-800 text-sm">This Privacy Policy complies with the General Data Protection Regulation (GDPR) and explains your rights under UK and EU data protection law.</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              ApexDeliver Ltd ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our M&A Intelligence Platform ("the Service").
            </p>
            <p className="text-gray-700">
              Please read this Privacy Policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Controller</h2>
            <p className="text-gray-700 mb-2">
              The data controller responsible for your personal data is:
            </p>
            <ul className="list-none text-gray-700 mb-4 space-y-1">
              <li><strong>Company:</strong> ApexDeliver Ltd</li>
              <li><strong>Address:</strong> London, United Kingdom</li>
              <li><strong>Email:</strong> privacy@apexdeliver.com</li>
              <li><strong>Data Protection Officer:</strong> privacy@apexdeliver.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, company name, job title</li>
              <li><strong>Profile Information:</strong> Professional details, bio, avatar image</li>
              <li><strong>Payment Information:</strong> Billing address, payment method (processed securely by Stripe)</li>
              <li><strong>Deal Data:</strong> Deal information, financial data, documents, notes, tasks</li>
              <li><strong>Communications:</strong> Messages, support requests, feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, clicks</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Cookies:</strong> See our Cookie Policy for details</li>
              <li><strong>Log Data:</strong> Server logs, error reports, performance metrics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Third-Party Integrations</h3>
            <p className="text-gray-700">
              When you connect third-party services (e.g., Xero, QuickBooks), we collect data from those services in accordance with your permissions and their terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
            <p className="text-gray-700 mb-2">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Provide the Service:</strong> Account management, deal processing, AI analysis</li>
              <li><strong>Improve the Service:</strong> Analytics, bug fixes, new features</li>
              <li><strong>Communicate:</strong> Support, updates, marketing (with consent)</li>
              <li><strong>Security:</strong> Fraud prevention, security monitoring</li>
              <li><strong>Compliance:</strong> Legal obligations, terms enforcement</li>
              <li><strong>Billing:</strong> Process payments, invoicing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Basis for Processing (GDPR)</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Contract Performance:</strong> Providing the Service you subscribed to</li>
              <li><strong>Consent:</strong> Marketing communications, optional features</li>
              <li><strong>Legitimate Interests:</strong> Improving the Service, security</li>
              <li><strong>Legal Obligation:</strong> Compliance with laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal data. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Hosting (Render), authentication (Clerk), payments (Stripe), AI services (OpenAI, Anthropic)</li>
              <li><strong>Within Your Organization:</strong> Team members with appropriate permissions</li>
              <li><strong>Legal Requirements:</strong> Court orders, legal processes, law enforcement</li>
              <li><strong>Business Transfers:</strong> Mergers, acquisitions, asset sales</li>
              <li><strong>With Your Consent:</strong> Other purposes with your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-2">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and role-based permissions</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal data for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Cancelled Accounts:</strong> Data retained for 30 days after cancellation, then permanently deleted</li>
              <li><strong>Backups:</strong> Deleted data removed from backups within 90 days</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer for compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights (GDPR)</h2>
            <p className="text-gray-700 mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing at any time</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact privacy@apexdeliver.com. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your data may be transferred to and processed in countries outside the UK and EU. We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Binding Corporate Rules for our service providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal data from children. If we become aware that we have collected data from a child without parental consent, we will take steps to delete that information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Complaints</h2>
            <p className="text-gray-700 mb-4">
              If you have concerns about how we handle your personal data, please contact our Data Protection Officer at privacy@apexdeliver.com.
            </p>
            <p className="text-gray-700">
              You also have the right to lodge a complaint with a supervisory authority:
            </p>
            <ul className="list-none text-gray-700 mt-2 space-y-1">
              <li><strong>UK:</strong> Information Commissioner's Office (ICO) - ico.org.uk</li>
              <li><strong>EU:</strong> Your local data protection authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              For privacy-related questions or to exercise your rights, contact:
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
