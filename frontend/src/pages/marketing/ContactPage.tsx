import { useState } from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { submitContactForm } from '../../services/contactService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.subject === 'general' ? undefined : formData.subject,
        message: formData.message,
      });

      if (!response.success) {
        throw new Error('Contact submission failed');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Failed to send message. Please try again or email us directly at support@100daysandbeyond.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <SEO
        title="Contact | 100 Days & Beyond"
        description="Get in touch with our team for demos, sales inquiries, or support. We respond within 24 hours and are here to help you transform your M&A and finance operations."
        keywords="contact 100 Days & Beyond, M&A platform support, demo request, sales inquiry"
        ogTitle="Contact 100 Days & Beyond"
        ogDescription="Speak with the 100 Days & Beyond team about demos, onboarding, or partnership opportunities."
        ogUrl="https://100daysandbeyond.com/contact"
        ogImage="https://100daysandbeyond.com/assets/security-trust-visual.png"
        twitterTitle="Contact 100 Days & Beyond"
        twitterDescription="Reach the 100 Days & Beyond team for demos, sales questions, and platform support."
        twitterImage="https://100daysandbeyond.com/assets/security-trust-visual.png"
        canonical="https://100daysandbeyond.com/contact"
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Let's Talk About Your Growth Journey
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Whether you need a demo, have questions about pricing, or want to discuss how ApexDeliver + CapLiquify can transform your operations, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request a Demo</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border-2 border-red-500 p-4 rounded-lg text-center">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-700">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'general', message: '' });
                    }}
                    className="mt-4 text-indigo-900 font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@apexdeliver.com</p>
                    <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start">
                  <div className="text-2xl mr-4">🕐</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM GMT</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>

                {/* Enterprise Sales */}
                <div className="flex items-start">
                  <div className="text-2xl mr-4">💼</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Enterprise Sales</h3>
                    <p className="text-gray-600">sales@apexdeliver.com</p>
                    <p className="text-sm text-gray-500 mt-1">For Enterprise and Community Leader tiers</p>
                  </div>
                </div>

                {/* Data Protection */}
                <div className="flex items-start">
                  <div className="text-2xl mr-4">🔒</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Data Protection Officer</h3>
                    <p className="text-gray-600">privacy@apexdeliver.com</p>
                    <p className="text-sm text-gray-500 mt-1">For GDPR and privacy inquiries</p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">Looking for Answers?</h3>
                <p className="text-gray-700 mb-4">
                  Check out our pricing page FAQ for common questions about subscriptions, billing, and features.
                </p>
                <a
                  href="/pricing"
                  className="text-indigo-900 font-semibold hover:underline"
                >
                  View Pricing FAQ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Prefer to Schedule a Call?</h2>
          <p className="text-lg text-gray-600 mb-6">
            For Enterprise and Community Leader inquiries, schedule a personalized demo with our team.
          </p>
          <a
            href="mailto:sales@apexdeliver.com?subject=Demo%20Request"
            className="inline-block bg-indigo-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-800 transition-colors"
          >
            Request a Demo
          </a>
        </div>
      </section>
    </MarketingLayout>
  );
};
