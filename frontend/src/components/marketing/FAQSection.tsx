import { useState } from 'react';
import { StructuredData } from '../common/StructuredData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How is ApexDeliver different from traditional M&A platforms?',
      answer: 'ApexDeliver is purpose-built for accessibility and modern M&A workflows. Unlike traditional platforms that cost £10,000+ annually and require weeks of training, we offer professional-grade tools starting at £279/month with setup in under 5 minutes. Our AI-powered features (financial analysis, deal matching, document generation) go beyond what most enterprise platforms offer, and we integrate with 4+ accounting platforms vs. their typical 1-2.'
    },
    {
      question: 'What\'s included in the free 14-day trial?',
      answer: 'Your free trial includes full access to all features: deal pipeline management, AI-powered financial intelligence, multi-method valuation suite, secure document room, automated document generation, AI deal matching, and task automation. No credit card required to start, and you can invite your team to try it with you. All your data is preserved if you decide to subscribe after the trial.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We take security extremely seriously. ApexDeliver uses bank-grade encryption (AES-256) for data at rest and in transit, is GDPR compliant, undergoes regular third-party security audits, and maintains SOC 2 Type II certification. Our secure document rooms feature granular access controls, watermarking, detailed audit logs, and version control. We host on enterprise-grade infrastructure with 99.9% uptime SLA and daily encrypted backups.'
    },
    {
      question: 'Can I integrate ApexDeliver with my existing tools?',
      answer: 'Yes! ApexDeliver integrates with major accounting platforms (Xero, QuickBooks, Sage, NetSuite) for automatic financial data sync. We also offer API access for custom integrations, webhook support for real-time notifications, and export capabilities (Excel, PDF, CSV). Our team can help with custom integration requirements for enterprise clients.'
    },
    {
      question: 'What if I need help or training?',
      answer: 'We provide comprehensive support: 24/7 chat and email support, live onboarding sessions for new users, extensive video tutorials and documentation, weekly webinars on best practices, and a dedicated customer success manager for enterprise plans. Most users are up and running within 5 minutes, and our intuitive interface requires minimal training.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. We offer monthly billing with no long-term contracts. You can cancel anytime from your account settings, and cancellation takes effect at the end of your current billing period. You\'ll retain access to your data for 30 days after cancellation, and we can provide a complete data export in multiple formats. No cancellation fees, no questions asked.'
    },
    {
      question: 'How does the AI-powered financial analysis work?',
      answer: 'Our AI engine connects to your accounting platforms and automatically extracts financial data. It then calculates 47+ financial ratios, generates natural language narratives explaining the findings, creates Deal Readiness Scores, identifies trends and anomalies, and provides industry benchmarking. The AI learns from thousands of deals to provide insights that would take analysts days to compile manually.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. During this period, you can export everything (deals, documents, financial data, notes) in multiple formats (Excel, PDF, CSV, JSON). After 30 days, data is securely deleted from our servers. We never sell or share your data with third parties, and you maintain full ownership of all your information.'
    },
    {
      question: 'Do you offer discounts for annual subscriptions?',
      answer: 'Yes! Annual subscriptions receive 20% off (equivalent to 2 months free). For example, the Solo Dealmaker plan is £279/month (£3,348/year) or £2,678 when paid annually. We also offer volume discounts for teams of 10+ users and special pricing for educational institutions and non-profits. Contact our sales team for custom enterprise pricing.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan anytime from your account settings. Upgrades take effect immediately, and you\'ll be charged a prorated amount for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period. All your data and settings are preserved when changing plans, and you can upgrade/downgrade as many times as needed.'
    }
  ];

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-white">
      <StructuredData json={faqStructuredData} id="faq-schema" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about ApexDeliver
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Sales
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

