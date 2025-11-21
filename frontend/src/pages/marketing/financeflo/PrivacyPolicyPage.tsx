import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - FinanceFlo.ai | UK GDPR Compliant</title>
        <meta name="description" content="FinanceFlo.ai Privacy Policy - Learn how we collect, use, and protect your personal information in compliance with UK GDPR and Data Protection Act 2018." />
        <link rel="canonical" href="https://financeflo.ai/privacy" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> 11 October 2025
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Data Controller Information</h3>
              <p className="text-blue-800 leading-relaxed">
                <strong>Company Name:</strong> DIGITAL GROWTH EQUITY LTD (trading as FinanceFlo.ai)<br />
                <strong>Company Number:</strong> 13816862<br />
                <strong>Registered Office:</strong> 10 Harlow Gardens, Kingston Upon Thames, England, KT1 3FF<br />
                <strong>Email:</strong> <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a><br />
                <strong>ICO Registration:</strong> [To be confirmed if applicable]
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DIGITAL GROWTH EQUITY LTD, trading as FinanceFlo.ai ("we," "us," or "our") is committed to protecting and respecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website
                  at <a href="https://financeflo.ai" className="text-blue-600 hover:text-blue-800">https://financeflo.ai</a> or use our services.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This policy is designed to comply with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>UK General Data Protection Regulation (UK GDPR)</li>
                  <li>Data Protection Act 2018</li>
                  <li>Privacy and Electronic Communications Regulations 2003 (PECR)</li>
                  <li>Information Commissioner's Office (ICO) guidance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this policy, please do not access the site or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Register for an account:</strong> Name, business email address, company name, job title, phone number</li>
                  <li><strong>Request a demo or consultation:</strong> Name, email, phone, company details, industry, specific requirements</li>
                  <li><strong>Subscribe to our newsletter:</strong> Email address and marketing consent</li>
                  <li><strong>Complete assessments or calculators:</strong> Business information, financial data, operational metrics</li>
                  <li><strong>Contact us for support:</strong> Name, email, phone, issue description, correspondence history</li>
                  <li><strong>Use our services:</strong> Business data, financial information, integration credentials (encrypted)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Information Collected Automatically</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you visit our website, we automatically collect certain information about your device and browsing activity:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referring/exit pages</li>
                  <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
                  <li><strong>Cookies and Tracking:</strong> See our <a href="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</a> for details</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may receive information about you from third-party sources, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Business partners:</strong> Referral information, joint marketing activities</li>
                  <li><strong>Public databases:</strong> Company information, business registration details</li>
                  <li><strong>Analytics providers:</strong> Website usage and behavior analytics (Google Analytics)</li>
                  <li><strong>GoHighLevel CRM:</strong> Lead scoring, conversation data, form submissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Under UK GDPR, we process your personal data on the following legal bases:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Consent</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We rely on your explicit consent when:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>You subscribe to our newsletter or marketing communications</li>
                  <li>You opt-in to non-essential cookies</li>
                  <li>You provide optional information in forms</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can withdraw your consent at any time by emailing helpdesk@financeflo.ai or clicking unsubscribe in our emails.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Contract Performance</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Processing is necessary for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Providing our SaaS services to you</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Delivering customer support</li>
                  <li>Fulfilling our contractual obligations</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Legitimate Interests</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We process data for our legitimate business interests, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Improving and developing our services</li>
                  <li>Security and fraud prevention</li>
                  <li>Network and information security</li>
                  <li>Business analytics and performance monitoring</li>
                  <li>Direct marketing to existing customers (soft opt-in)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We always balance our interests against your rights and freedoms. You can object to processing based on legitimate interests at any time.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.4 Legal Obligations</h3>
                <p className="text-gray-700 leading-relaxed">
                  We process data to comply with legal requirements, such as tax laws, accounting regulations, and legal proceedings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Service Provision</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Creating and managing your account</li>
                  <li>Providing access to our IntelliFlow, TrendFlo, and LeverageFlo platforms</li>
                  <li>Processing transactions and managing subscriptions</li>
                  <li>Delivering customer support and technical assistance</li>
                  <li>Sending service-related notifications (password resets, system updates, security alerts)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Communication and Marketing</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Sending you our newsletter with AI insights, finance tips, and product updates (with consent)</li>
                  <li>Sharing industry news, best practices, and educational content</li>
                  <li>Inviting you to webinars, events, and product launches</li>
                  <li>Conducting customer surveys and feedback requests</li>
                  <li>Following up on demo requests and consultation inquiries</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Your Right to Opt-Out:</strong> You can unsubscribe from marketing emails at any time using the unsubscribe link or by contacting helpdesk@financeflo.ai.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Analytics and Improvement</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Analyzing website usage patterns and user behavior</li>
                  <li>Improving our website, services, and user experience</li>
                  <li>Developing new features and functionality</li>
                  <li>A/B testing and optimization</li>
                  <li>Performance monitoring and troubleshooting</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Security and Legal Compliance</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Protecting against fraud, abuse, and security threats</li>
                  <li>Enforcing our Terms of Service</li>
                  <li>Complying with legal obligations and court orders</li>
                  <li>Responding to law enforcement requests</li>
                  <li>Protecting our rights, property, and safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>We do not sell or rent your personal data to third parties.</strong> We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We engage trusted third-party service providers to perform functions on our behalf, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>GoHighLevel:</strong> CRM, marketing automation, form submissions, lead management, chat widget</li>
                  <li><strong>Cloud hosting providers:</strong> Infrastructure and data storage</li>
                  <li><strong>Payment processors:</strong> Secure payment processing and billing</li>
                  <li><strong>Analytics services:</strong> Google Analytics for website usage analysis</li>
                  <li><strong>Email service providers:</strong> Newsletter delivery and marketing emails</li>
                  <li><strong>Communication tools:</strong> Customer support and live chat</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  All service providers are bound by data processing agreements and are required to protect your data in accordance with UK GDPR.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If we are involved in a merger, acquisition, asset sale, or bankruptcy, your personal data may be transferred to the acquiring entity.
                  We will notify you of any such change and provide you with choices regarding your data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may disclose your information if required to do so by law or in response to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Valid legal processes (court orders, subpoenas)</li>
                  <li>Law enforcement requests</li>
                  <li>National security or public safety requirements</li>
                  <li>Protection of our legal rights and property</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.4 With Your Consent</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share your information for other purposes with your explicit consent or at your direction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our services are primarily hosted in the UK/EU. However, some of our service providers (e.g., cloud infrastructure)
                  may store or process data in countries outside the UK and European Economic Area (EEA).
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When we transfer personal data outside the UK/EEA, we ensure appropriate safeguards are in place, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Standard Contractual Clauses (SCCs) approved by the UK ICO</li>
                  <li>Adequacy decisions by the UK Government</li>
                  <li>Binding Corporate Rules where applicable</li>
                  <li>Additional security measures as required</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  For more information about international transfers, please contact us at helpdesk@financeflo.ai.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                  unless a longer retention period is required by law.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Retention Periods:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Active accounts:</strong> While your account remains active and for 30 days after closure (to allow reactivation)</li>
                  <li><strong>Marketing data:</strong> Until you unsubscribe, then 30 days for processing (permanent suppression list retained indefinitely)</li>
                  <li><strong>Transaction records:</strong> 7 years (UK tax and accounting requirements)</li>
                  <li><strong>Website analytics:</strong> 26 months (Google Analytics default)</li>
                  <li><strong>Support tickets:</strong> 3 years from closure</li>
                  <li><strong>Legal claims:</strong> For the duration of any legal proceedings plus 6 years (UK limitation period)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  After the retention period expires, we will securely delete or anonymize your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access,
                  alteration, disclosure, or destruction. These measures include:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Measures:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>SSL/TLS encryption for data in transit (HTTPS)</li>
                  <li>AES-256 encryption for sensitive data at rest</li>
                  <li>Regular security updates and patching</li>
                  <li>Firewall and intrusion detection systems</li>
                  <li>Secure backup and disaster recovery procedures</li>
                  <li>Multi-factor authentication for account access</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Organizational Measures:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Access controls limiting data access to authorized personnel only</li>
                  <li>Staff training on data protection and security</li>
                  <li>Data processing agreements with all third-party processors</li>
                  <li>Regular security audits and assessments</li>
                  <li>Incident response and data breach procedures</li>
                </ul>

                <p className="text-gray-700 leading-relaxed">
                  While we strive to protect your personal data, no method of transmission over the internet or electronic storage is 100% secure.
                  If you have reason to believe that your interaction with us is no longer secure, please contact us immediately at helpdesk@financeflo.ai.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Rights Under UK GDPR</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Under UK GDPR, you have the following rights regarding your personal data:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Right of Access</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to request a copy of the personal data we hold about you. We will provide this free of charge within one month.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Right to Rectification</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can request that we correct any inaccurate or incomplete personal data we hold about you.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Right to Erasure ("Right to be Forgotten")</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can request that we delete your personal data in certain circumstances, such as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>The data is no longer necessary for the purposes for which it was collected</li>
                  <li>You withdraw consent (where consent was the legal basis)</li>
                  <li>You object to processing based on legitimate interests</li>
                  <li>The data has been unlawfully processed</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Note: We may need to retain certain data for legal or contractual obligations (e.g., accounting records).
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.4 Right to Restriction of Processing</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can ask us to restrict processing of your data in certain situations, such as when you contest the accuracy of the data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.5 Right to Data Portability</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit
                  it to another controller.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.6 Right to Object</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can object to processing based on legitimate interests or for direct marketing purposes at any time.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.7 Right to Withdraw Consent</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Where we rely on consent, you can withdraw it at any time without affecting the lawfulness of processing before withdrawal.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.8 Right to Lodge a Complaint</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data protection
                  rights have been violated:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Information Commissioner's Office (ICO)</strong><br />
                    Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://ico.org.uk</a><br />
                    Helpline: 0303 123 1113<br />
                    Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  To exercise any of these rights, please contact us at <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a>.
                  We will respond to your request within one month. We may need to verify your identity before processing your request.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are intended for businesses and professional use only. We do not knowingly collect personal data from children
                  under 18 years of age. If you become aware that a child has provided us with personal data, please contact us immediately
                  at helpdesk@financeflo.ai, and we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to collect and use information about you. For detailed information about
                  the cookies we use and how to manage them, please see our <a href="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Links</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party websites that are not operated by us. If you click on a third-party link,
                  you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                  We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Data Breach Notification</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify you
                  and the ICO without undue delay and, where feasible, within 72 hours of becoming aware of the breach.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We will provide information about the nature of the breach, the likely consequences, and the measures we have taken or
                  propose to take to address the breach.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal,
                  or regulatory reasons. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Posting the updated policy on our website with a new "Last updated" date</li>
                  <li>Sending an email notification to registered users</li>
                  <li>Displaying a prominent notice on our website</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
                  We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Data Controller:</strong> DIGITAL GROWTH EQUITY LTD<br />
                    <strong>Trading as:</strong> FinanceFlo.ai<br />
                    <strong>Registered Address:</strong> 10 Harlow Gardens, Kingston Upon Thames, England, KT1 3FF<br />
                    <strong>Company Number:</strong> 13816862<br />
                    <strong>Email:</strong> <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a><br />
                    <strong>Website:</strong> <a href="https://financeflo.ai" className="text-blue-600 hover:text-blue-800">https://financeflo.ai</a>
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 5 business days and to fulfill data subject
                  rights requests within one month (as required by UK GDPR).
                </p>
              </section>

              <section className="bg-green-50 border-l-4 border-green-500 p-6 mt-8">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Your Privacy Matters</h3>
                <p className="text-green-800 leading-relaxed">
                  We are committed to protecting your privacy and handling your personal data transparently and fairly. If you have any
                  concerns about how we process your data, please don't hesitate to contact us at helpdesk@financeflo.ai.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
