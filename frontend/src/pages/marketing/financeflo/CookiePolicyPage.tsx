import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const CookiePolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - FinanceFlo.ai | UK PECR Compliant</title>
        <meta name="description" content="FinanceFlo.ai Cookie Policy - Learn how we use cookies and tracking technologies in compliance with UK PECR and ICO guidelines." />
        <link rel="canonical" href="https://financeflo.ai/cookies" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> 11 October 2025
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Company Information</h3>
              <p className="text-blue-800 leading-relaxed">
                <strong>Company Name:</strong> DIGITAL GROWTH EQUITY LTD (trading as FinanceFlo.ai)<br />
                <strong>Company Number:</strong> 13816862<br />
                <strong>Registered Office:</strong> 10 Harlow Gardens, Kingston Upon Thames, England, KT1 3FF<br />
                <strong>Email:</strong> <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:text-blue-800">helpdesk@financeflo.ai</a>
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This Cookie Policy explains how DIGITAL GROWTH EQUITY LTD, trading as FinanceFlo.ai ("we," "us," or "our") uses cookies
                  and similar tracking technologies on our website at <a href="https://financeflo.ai" className="text-blue-600 hover:text-blue-800">https://financeflo.ai</a>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This policy complies with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Privacy and Electronic Communications Regulations 2003 (PECR)</li>
                  <li>UK General Data Protection Regulation (UK GDPR)</li>
                  <li>Data Protection Act 2018</li>
                  <li>Information Commissioner's Office (ICO) guidance on cookies and similar technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What Are Cookies?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website.
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookies can be:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>First-party cookies:</strong> Set by the website you're visiting</li>
                  <li><strong>Third-party cookies:</strong> Set by a different website or service (e.g., analytics providers)</li>
                  <li><strong>Session cookies:</strong> Temporary cookies deleted when you close your browser</li>
                  <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Ensure our website functions properly and securely</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website and improve your experience</li>
                  <li>Analyze website traffic and performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Deliver relevant marketing and advertising</li>
                  <li>Enable communication features like live chat</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Types of Cookies We Use</h2>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">4.1 Strictly Necessary Cookies</h3>
                  <p className="text-green-800 leading-relaxed mb-4">
                    <strong>Consent Required:</strong> No (these cookies are essential for the website to function)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies are essential for you to browse our website and use its features. Without these cookies, services you
                    have requested (such as accessing secure areas) cannot be provided.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>Examples:</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Authentication cookies:</strong> Keep you logged in to your account</li>
                    <li><strong>Security cookies:</strong> Detect authentication abuse, prevent fraud</li>
                    <li><strong>Session cookies:</strong> Remember your journey through our website</li>
                    <li><strong>Cookie consent cookies:</strong> Remember your cookie preferences</li>
                    <li><strong>Load balancing cookies:</strong> Distribute traffic across servers</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">4.2 Performance and Analytics Cookies</h3>
                  <p className="text-blue-800 leading-relaxed mb-4">
                    <strong>Consent Required:</strong> Yes (you can opt-out via cookie settings)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies collect information about how you use our website, such as which pages you visit and if you experience
                    any errors. This helps us improve our website's performance and user experience.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>We use:</strong></p>
                  <table className="min-w-full border-collapse border border-gray-300 mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Google Analytics (_ga, _gid, _gat)</td>
                        <td className="border border-gray-300 px-4 py-2">Website usage statistics, user behavior analysis</td>
                        <td className="border border-gray-300 px-4 py-2">2 years (main), 24 hours (_gid)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Performance monitoring</td>
                        <td className="border border-gray-300 px-4 py-2">Page load times, error tracking</td>
                        <td className="border border-gray-300 px-4 py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Data collected:</strong> IP address (anonymized), pages visited, time on site, browser type, device type,
                    referring website, click paths
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">4.3 Functionality Cookies</h3>
                  <p className="text-purple-800 leading-relaxed mb-4">
                    <strong>Consent Required:</strong> Yes (some may be considered necessary depending on use)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies allow our website to remember choices you make (such as your language or region) and provide enhanced,
                    more personalized features.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>Examples:</strong></p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Preference cookies:</strong> Remember your settings and choices</li>
                    <li><strong>Chat widget cookies:</strong> Enable live chat functionality (GoHighLevel)</li>
                    <li><strong>Video player cookies:</strong> Remember playback settings</li>
                    <li><strong>Form autofill:</strong> Remember information you've previously entered</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-orange-900 mb-3">4.4 Targeting and Advertising Cookies</h3>
                  <p className="text-orange-800 leading-relaxed mb-4">
                    <strong>Consent Required:</strong> Yes (explicit opt-in required under PECR)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These cookies are used to deliver advertisements that are more relevant to you and your interests. They are also
                    used to limit the number of times you see an advertisement and to measure the effectiveness of advertising campaigns.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>We may use:</strong></p>
                  <table className="min-w-full border-collapse border border-gray-300 mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Google Ads</td>
                        <td className="border border-gray-300 px-4 py-2">Remarketing, conversion tracking, ad delivery</td>
                        <td className="border border-gray-300 px-4 py-2">90 days</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">LinkedIn Insight Tag</td>
                        <td className="border border-gray-300 px-4 py-2">B2B advertising, conversion tracking</td>
                        <td className="border border-gray-300 px-4 py-2">180 days</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">GoHighLevel tracking</td>
                        <td className="border border-gray-300 px-4 py-2">Lead tracking, attribution, campaign measurement</td>
                        <td className="border border-gray-300 px-4 py-2">90 days</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Note:</strong> Advertising cookies are only set if you explicitly consent to them via our cookie banner.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Some cookies are set by third-party services that appear on our pages. We do not control these cookies and you should
                  check the third party's website for more information.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services We Use:</h3>

                <div className="space-y-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Purpose:</strong> Website analytics and user behavior tracking<br />
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Privacy Policy</a><br />
                      <strong>Opt-Out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Analytics Opt-out Browser Add-on</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">GoHighLevel</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Purpose:</strong> CRM, chat widget, form submissions, lead tracking<br />
                      <strong>Privacy Policy:</strong> <a href="https://www.gohighlevel.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">GoHighLevel Privacy Policy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Google Ads & Remarketing</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Purpose:</strong> Advertising, remarketing, conversion tracking<br />
                      <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Privacy Policy</a><br />
                      <strong>Opt-Out:</strong> <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Ad Settings</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">LinkedIn Insight Tag</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Purpose:</strong> B2B advertising, conversion tracking, audience insights<br />
                      <strong>Privacy Policy:</strong> <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn Privacy Policy</a><br />
                      <strong>Opt-Out:</strong> <a href="https://www.linkedin.com/psettings/guest-controls" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn Ad Preferences</a>
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Cookie Choices and Consent</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Cookie Banner</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you first visit our website, you will see a cookie banner asking for your consent to use non-essential cookies.
                  You can choose to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Accept All:</strong> Consent to all cookies including analytics and marketing</li>
                  <li><strong>Reject All:</strong> Only essential cookies will be used</li>
                  <li><strong>Customize:</strong> Choose which categories of cookies to allow</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Strictly necessary cookies</strong> are always enabled as they are essential for the website to function.
                  You cannot opt-out of these cookies.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Managing Cookies via Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>Delete cookies manually</li>
                  <li>Accept cookies from specific websites only</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser-Specific Instructions:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Google Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Chrome cookie settings</a></li>
                  <li><strong>Mozilla Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Firefox cookie settings</a></li>
                  <li><strong>Safari:</strong> <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Safari cookie settings</a></li>
                  <li><strong>Microsoft Edge:</strong> <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Edge cookie settings</a></li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Note</h4>
                  <p className="text-yellow-800 leading-relaxed">
                    Blocking or deleting cookies may impact your experience on our website. Some features and services may not function properly
                    without cookies. Strictly necessary cookies cannot be disabled as they are essential for the website to work.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 Mobile Device Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  On mobile devices, you can manage cookies through your device settings:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>iOS:</strong> Settings → Safari → Block All Cookies</li>
                  <li><strong>Android:</strong> Settings → Privacy → Clear Browsing Data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Withdrawing Consent</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can withdraw your consent to cookies at any time by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Clicking the "Cookie Settings" link in our website footer</li>
                  <li>Deleting cookies through your browser settings</li>
                  <li>Contacting us at helpdesk@financeflo.ai</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Withdrawing consent will not affect the lawfulness of processing before withdrawal. After withdrawal, we will stop
                  setting non-essential cookies, but cookies already set will remain until you delete them or they expire.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Do Not Track (DNT) Signals</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some browsers have a "Do Not Track" feature that sends a signal to websites requesting not to track users. Currently,
                  there is no universally accepted standard for how to respond to DNT signals. We do not currently respond to DNT signals,
                  but we respect your cookie preferences as set through our cookie banner or browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Updates to This Cookie Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational,
                  legal, or regulatory reasons. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Posting the updated policy on our website with a new "Last updated" date</li>
                  <li>Displaying a notice on our website</li>
                  <li>Updating our cookie banner</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Please review this Cookie Policy periodically to stay informed about our cookie practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. More Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For more information about cookies and how to manage them, visit:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>ICO Cookie Guidance:</strong> <a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://ico.org.uk/for-the-public/online/cookies/</a></li>
                  <li><strong>About Cookies:</strong> <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://www.aboutcookies.org</a></li>
                  <li><strong>All About Cookies:</strong> <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://www.allaboutcookies.org</a></li>
                  <li><strong>Your Online Choices:</strong> <a href="https://www.youronlinechoices.com/uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://www.youronlinechoices.com/uk/</a></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Cookie Policy or our use of cookies, please contact us:
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

              <section className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Choices</h3>
                <p className="text-blue-800 leading-relaxed">
                  We respect your right to control how cookies are used on your device. You can manage your cookie preferences at any time
                  through our cookie banner or browser settings. For questions or concerns, please contact helpdesk@financeflo.ai.
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

export default CookiePolicyPage;
