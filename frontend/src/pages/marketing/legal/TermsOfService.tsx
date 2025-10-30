import { MarketingLayout } from '../../../components/marketing/MarketingLayout';
import { SEO } from '../../../components/common/SEO';

export const TermsOfService: React.FC = () => {
  const lastUpdated = '2025-10-25';

  return (
    <MarketingLayout>
      <SEO
        title="Terms of Service | 100 Days & Beyond"
        description="Review the terms governing 100 Days & Beyond's M&A intelligence platform, including subscriptions, user conduct, and compliance obligations."
        keywords="100 Days & Beyond terms of service, M&A software terms, SaaS acceptable use policy"
        ogTitle="100 Days & Beyond Terms of Service"
        ogDescription="Understand the agreements that govern usage of the 100 Days & Beyond M&A lifecycle platform."
        ogUrl="https://100daysandbeyond.com/legal/terms"
        ogImage="https://100daysandbeyond.com/assets/dashboard-preview.png"
        twitterTitle="100 Days & Beyond Terms of Service"
        twitterDescription="Detailed terms covering subscriptions, data handling, and fair use for the 100 Days & Beyond platform."
        twitterImage="https://100daysandbeyond.com/assets/dashboard-preview.png"
        canonical="https://100daysandbeyond.com/legal/terms"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using ApexDeliver ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
            <p className="text-gray-700">
              ApexDeliver is operated by ApexDeliver Ltd ("we," "us," or "our"). These Terms of Service govern your access to and use of the ApexDeliver platform, including any content, functionality, and services offered on or through the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of the Service</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Eligibility</h3>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Account Registration</h3>
            <p className="text-gray-700 mb-4">
              To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-gray-700">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Acceptable Use</h3>
            <p className="text-gray-700 mb-2">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Engage in any activity that interferes with or disrupts the Service</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Subscription and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Subscription Tiers</h3>
            <p className="text-gray-700 mb-4">
              ApexDeliver offers multiple subscription tiers: Starter, Professional, Enterprise, and Community Leader. Pricing and features for each tier are detailed on our Pricing page.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Billing</h3>
            <p className="text-gray-700 mb-4">
              Subscription fees are billed in advance on a monthly or annual basis, depending on your chosen billing cycle. All fees are non-refundable except as required by law or as explicitly stated in these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Automatic Renewal</h3>
            <p className="text-gray-700 mb-4">
              Your subscription will automatically renew at the end of each billing cycle unless you cancel before the renewal date. We will charge your payment method on file for the renewal fee.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Cancellation</h3>
            <p className="text-gray-700 mb-4">
              You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing cycle. You will retain access to the Service until the end of the paid period.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.5 Refund Policy</h3>
            <p className="text-gray-700">
              We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable. To request a refund, contact support@apexdeliver.com within 30 days of your initial payment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by ApexDeliver, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p className="text-gray-700">
              You retain all rights to the data you upload to the Service. By uploading data, you grant ApexDeliver a limited license to use, store, and process your data solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security and Privacy</h2>
            <p className="text-gray-700 mb-4">
              We take data security seriously and implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            <p className="text-gray-700">
              Our Privacy Policy, available at /legal/privacy, explains how we collect, use, and protect your personal information. By using the Service, you consent to our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL APEXDELIVER, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE.
            </p>
            <p className="text-gray-700">
              Our total liability to you for any claims arising from or related to the Service shall not exceed the amount you have paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless ApexDeliver and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.
            </p>
            <p className="text-gray-700">
              Upon termination, your right to use the Service will immediately cease. You will have 30 days to export your data before it is permanently deleted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in London, England.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-gray-700 space-y-1">
              <li>Email: support@apexdeliver.com</li>
              <li>Address: ApexDeliver Ltd, London, United Kingdom</li>
            </ul>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
};
