import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - FinanceFlo.ai | AI-Powered Finance Automation</title>
        <meta name="description" content="FinanceFlo.ai Terms of Service - Legal terms and conditions for using our AI-powered finance automation platform." />
        <link rel="canonical" href="https://financeflo.ai/terms" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> 11 October 2025
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Company Information</h3>
              <p className="text-blue-800 leading-relaxed">
                <strong>Company Name:</strong> DIGITAL GROWTH EQUITY LTD (trading as FinanceFlo.ai)<br />
                <strong>Company Number:</strong> 13816862<br />
                <strong>Registered Office:</strong> 10 Harlow Gardens, Kingston Upon Thames, England, KT1 3FF<br />
                <strong>Email:</strong> <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a><br />
                <strong>Jurisdiction:</strong> England and Wales
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms of Service ("Terms", "Terms of Service") govern your relationship with FinanceFlo.ai website and services
                  (the "Service") operated by DIGITAL GROWTH EQUITY LTD ("us", "we", or "our").
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms,
                  then you may not access the Service. These Terms are governed by English law.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Acceptance:</strong> Your continued use of the Service will constitute acceptance of these Terms. We recommend
                  that you print a copy of these Terms for future reference.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  FinanceFlo.ai provides Software as a Service (SaaS) solutions including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>IntelliFlow:</strong> AI-powered iPaaS (Integration Platform as a Service) for business system integration</li>
                  <li><strong>TrendFlo:</strong> AI-driven business intelligence and forecasting platform</li>
                  <li><strong>LeverageFlo:</strong> Automated business lending and financing solutions</li>
                  <li><strong>ERP AI Enhancement:</strong> AI augmentation services for existing ERP systems</li>
                  <li><strong>Professional Services:</strong> Implementation, consulting, and support services</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Our Services help UK businesses streamline financial operations, automate workflows, and enhance decision-making
                  through artificial intelligence and intelligent automation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility and User Accounts</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Business Use Only</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Services are intended for business-to-business (B2B) use only. By using our Service, you represent that you are
                  acting on behalf of a business entity and have the authority to bind that entity to these Terms.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features of our Service, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information to keep it accurate and complete</li>
                  <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                  <li>Notify us immediately at helpdesk@financeflo.ai if you suspect any unauthorized use of your account</li>
                  <li>Accept full responsibility for all activities that occur under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or
                  actions under your password. We cannot and will not be liable for any loss or damage arising from your failure
                  to comply with this security obligation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to use our Services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>In any way that violates any applicable UK, EU, or international law or regulation</li>
                  <li>To transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material</li>
                  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                  <li>To introduce viruses, trojan horses, worms, logic bombs or other material that is malicious or technologically harmful</li>
                  <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service</li>
                  <li>To use the Service for competitive intelligence, benchmarking, or to build a competitive product or service</li>
                  <li>To reverse engineer, decompile, or disassemble any part of the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Payment Terms</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Pricing and Plans</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance
                  on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis,
                  depending on the type of subscription plan you select when purchasing a Subscription.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Free Trials</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  FinanceFlo.ai may, at its sole discretion, offer a Subscription with a free trial for a limited period of time
                  ("Free Trial"). You may be required to enter your billing information in order to sign up for the Free Trial.
                  If you do enter your billing information when signing up for the Free Trial, you will not be charged until the
                  Free Trial has expired.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Payment</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All fees are exclusive of applicable taxes (including VAT), levies, or duties imposed by taxing authorities.
                  You are responsible for payment of all such taxes, levies, or duties. UK VAT will be added to invoices where applicable.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Automatic Renewal</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless
                  you cancel it or FinanceFlo.ai cancels it. You may cancel your Subscription renewal by providing written notice to
                  helpdesk@financeflo.ai at least 30 days before the end of the current Billing Cycle.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.5 Refunds</h3>
                <p className="text-gray-700 leading-relaxed">
                  Except when required by law, paid Subscription fees are non-refundable. If you believe you are entitled to a refund,
                  please contact us at helpdesk@financeflo.ai with details of your claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Our IP Rights</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Service and its original content (excluding Content provided by users), features, and functionality are and
                  will remain the exclusive property of DIGITAL GROWTH EQUITY LTD and its licensors. The Service is protected by
                  copyright, trademark, and other laws of England and foreign countries.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Our Trademarks</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  "FinanceFlo.ai", "IntelliFlow", "TrendFlo", "LeverageFlo" and related graphics, logos, and service names are
                  trademarks of DIGITAL GROWTH EQUITY LTD. You are not granted any right or license to use these marks.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Your Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain all rights to the data, content, and materials you upload to or process through the Service ("Your Content").
                  By using the Service, you grant us a limited license to use Your Content solely for the purpose of providing the Service
                  to you. We will not use Your Content for any other purpose without your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Protection and Privacy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your use of our Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  Please review our <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> to understand
                  our practices regarding the collection, use, and disclosure of your personal information.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. As a data
                  processor, we will only process your personal data in accordance with your written instructions and our Data
                  Processing Agreement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  For B2B customers, a separate Data Processing Agreement (DPA) will be provided upon request. Please contact
                  helpdesk@financeflo.ai for a copy of our DPA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability and Support</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Availability</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We strive to maintain high service availability and aim for 99.9% uptime for our core Services. However, we cannot
                  guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the Service
                  temporarily or permanently, with or without notice.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 Planned Maintenance</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We will provide reasonable advance notice (typically 48 hours) of planned maintenance that may affect Service availability.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.3 Support</h3>
                <p className="text-gray-700 leading-relaxed">
                  Support is provided according to your subscription plan. Standard support includes email support at helpdesk@financeflo.ai
                  during UK business hours (9am-5pm GMT, Monday-Friday excluding UK bank holidays). Premium support plans include phone
                  support and priority response times.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Important:</strong> Nothing in these Terms shall limit or exclude our liability for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Death or personal injury caused by our negligence</li>
                  <li>Fraud or fraudulent misrepresentation</li>
                  <li>Any liability which cannot be limited or excluded by applicable law</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Subject to the above, in no event shall DIGITAL GROWTH EQUITY LTD, nor its directors, employees, partners, agents,
                  suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
                  without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Your access to or use of or inability to access or use the Service</li>
                  <li>Any conduct or content of any third party on the Service</li>
                  <li>Any content obtained from the Service</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you
                  paid to us for the Service in the 12 months immediately preceding the event giving rise to the liability, or £1,000
                  (whichever is greater).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify and hold harmless DIGITAL GROWTH EQUITY LTD and its licensees and licensors, and their
                  employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses,
                  liabilities, costs or debt, and expenses (including but not limited to legal fees), resulting from or arising out of:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                  <li>Your use and access of the Service</li>
                  <li>Your violation of any term of these Terms</li>
                  <li>Your violation of any third party right, including without limitation any copyright, property, or privacy right</li>
                  <li>Any claim that Your Content caused damage to a third party</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 Termination by You</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may terminate your account at any time by providing written notice to helpdesk@financeflo.ai. Termination will be
                  effective at the end of your current Billing Cycle. You will not receive a refund for any unused portion of your Subscription.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 Termination by Us</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability,
                  under our sole discretion, for any reason whatsoever, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Breach of these Terms</li>
                  <li>Non-payment of fees</li>
                  <li>Fraudulent, abusive, or illegal activity</li>
                  <li>Extended period of inactivity</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.3 Effect of Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the Service will immediately cease. We will provide you with a reasonable opportunity
                  (typically 30 days) to export Your Content before permanently deleting it from our systems. All provisions of these Terms
                  which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers,
                  indemnity, and limitations of liability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Jurisdiction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its
                  conflict of law provisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or
                  in connection with these Terms or their subject matter or formation (including non-contractual disputes or claims).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material,
                  we will provide at least 30 days' notice prior to any new terms taking effect by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Posting a notice on our website</li>
                  <li>Sending an email to the address associated with your account</li>
                  <li>Displaying a prominent notice within the Service</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                  If you do not agree to the new terms, you must stop using the Service and may terminate your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Entire Agreement and Severability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, shall constitute
                  the entire agreement between you and DIGITAL GROWTH EQUITY LTD concerning the Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the invalidity of such provision
                  shall not affect the validity of the remaining provisions of these Terms, which shall remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Waiver and Amendment</h2>
                <p className="text-gray-700 leading-relaxed">
                  No waiver by DIGITAL GROWTH EQUITY LTD of any term or condition set forth in these Terms shall be deemed a further or
                  continuing waiver of such term or condition or a waiver of any other term or condition, and any failure to assert a right
                  or provision under these Terms shall not constitute a waiver of such right or provision.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>DIGITAL GROWTH EQUITY LTD</strong><br />
                    Trading as: FinanceFlo.ai<br />
                    Registered Address: 10 Harlow Gardens, Kingston Upon Thames, England, KT1 3FF<br />
                    Company Number: 13816862<br />
                    Email: <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a><br />
                    Website: <a href="https://financeflo.ai" className="text-blue-600 hover:text-blue-800">https://financeflo.ai</a>
                  </p>
                </div>
              </section>

              <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notice</h3>
                <p className="text-yellow-800 leading-relaxed">
                  These Terms constitute a legally binding agreement. Please read them carefully. By using our Service, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the Service.
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

export default TermsOfServicePage;
