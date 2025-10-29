import React from 'react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SEO from '@/components/SEO';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Terms of Service"
        description="Terms of Service and Service Level Agreement for ApexDeliver + CapLiquify enterprise M&A platform."
        keywords="terms of service, SLA, service level agreement, support, enterprise software"
      />
      <MarketingNav />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#001F3F] mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              Last Updated: October 29, 2025
            </p>

            <Card className="shadow-lg border-t-4 border-[#3D9970]">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-8 text-gray-700 leading-relaxed">
                  
                  {/* 1. Agreement to Terms */}
                  <div id="agreement">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">1. Agreement to Terms</h2>
                    <p>Welcome to ApexDeliver + CapLiquify ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our software platform and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and all policies referenced herein. If you do not agree to these Terms, you must not use the Service.</p>
                    <p className="mt-3 font-semibold text-[#001F3F]">We reserve the right to modify these Terms at any time, at our sole discretion, with or without notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 2. Service Level Agreement (SLA) */}
                  <div id="sla">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">2. Service Level Agreement (SLA)</h2>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">2.1 Uptime Guarantee</h3>
                    <p>We commit to maintaining a <strong>99.95% uptime</strong> for the Service, measured monthly. Uptime is calculated as the percentage of time the Service is available and accessible to users during a calendar month, excluding Scheduled Maintenance.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">2.2 Scheduled Maintenance</h3>
                    <p>We reserve the right to perform scheduled maintenance during off-peak hours (defined as 12:00 AM to 6:00 AM UTC on weekends). We will provide at least 48 hours advance notice for scheduled maintenance via email and in-app notifications. Scheduled maintenance windows do not count against uptime calculations.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">2.3 Emergency Maintenance</h3>
                    <p>In the event of critical security vulnerabilities or system failures, we may perform emergency maintenance without advance notice. We will notify users as soon as reasonably possible and work to restore service within the shortest time frame.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">2.4 Service Credits for SLA Breaches</h3>
                    <p>If we fail to meet the 99.95% uptime SLA in any calendar month, you may be eligible for service credits as follows:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li><strong>99.9% - 99.94% uptime:</strong> 10% service credit</li>
                      <li><strong>99.0% - 99.89% uptime:</strong> 25% service credit</li>
                      <li><strong>Below 99.0% uptime:</strong> 50% service credit</li>
                    </ul>
                    <p className="mt-3">Service credits are calculated as a percentage of your monthly subscription fee and will be applied to your next billing cycle. To request a service credit, you must submit a claim within 30 days of the end of the month in which the SLA breach occurred.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 3. Support Services */}
                  <div id="support">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">3. Support Services</h2>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">3.1 Support Tiers</h3>
                    <p>Support is provided based on your subscription tier:</p>
                    
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-[#001F3F] mb-2">CapLiquify FP&A (Starter)</h4>
                        <ul className="list-disc ml-6 space-y-1 text-sm">
                          <li>Email support: Monday-Friday, 9 AM - 5 PM EST</li>
                          <li>Response time: Within 24 business hours</li>
                          <li>Knowledge base and documentation access</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-[#001F3F] mb-2">Professional</h4>
                        <ul className="list-disc ml-6 space-y-1 text-sm">
                          <li>Email and chat support: Monday-Friday, 8 AM - 8 PM EST</li>
                          <li>Response time: Within 8 business hours</li>
                          <li>Priority ticket routing</li>
                          <li>Quarterly business reviews</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-[#001F3F] mb-2">Enterprise</h4>
                        <ul className="list-disc ml-6 space-y-1 text-sm">
                          <li>24/7 email, chat, and phone support</li>
                          <li>Response time: Within 4 hours (P1), 8 hours (P2), 24 hours (P3)</li>
                          <li>Dedicated account manager</li>
                          <li>Monthly business reviews and strategic planning sessions</li>
                          <li>Custom onboarding and training</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-[#001F3F] mb-2">Portfolio (B2B2C)</h4>
                        <ul className="list-disc ml-6 space-y-1 text-sm">
                          <li>24/7 priority support with dedicated hotline</li>
                          <li>Response time: Within 1 hour (P1), 4 hours (P2), 8 hours (P3)</li>
                          <li>Dedicated technical account manager and customer success manager</li>
                          <li>Weekly check-ins and on-demand strategy sessions</li>
                          <li>White-glove onboarding with custom integrations</li>
                          <li>Annual executive business reviews</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-6 mb-2">3.2 Priority Levels</h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li><strong>P1 (Critical):</strong> Service is completely unavailable or critical functionality is broken, affecting all users</li>
                      <li><strong>P2 (High):</strong> Major feature is impaired or unavailable, affecting multiple users</li>
                      <li><strong>P3 (Medium):</strong> Minor feature issue or question, affecting limited users</li>
                      <li><strong>P4 (Low):</strong> General inquiry, feature request, or cosmetic issue</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-6 mb-2">3.3 Support Channels</h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li><strong>Email:</strong> support@apex-cap.com</li>
                      <li><strong>In-App Chat:</strong> Available via the help icon in the application</li>
                      <li><strong>Phone:</strong> Enterprise and Portfolio customers receive a dedicated support number</li>
                      <li><strong>Knowledge Base:</strong> Available 24/7 at help.apex-cap.com</li>
                    </ul>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 4. Usage Rights and License */}
                  <div id="usage-rights">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">4. Usage Rights and License</h2>
                    <p>Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service solely for your internal business purposes related to mergers and acquisitions (M&A), financial planning and analysis (FP&A), and capital management.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">4.1 Restrictions</h3>
                    <p>You shall not:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>License, sublicense, sell, resell, rent, lease, transfer, assign, distribute, or otherwise commercially exploit the Service</li>
                      <li>Modify, copy, or create derivative works based on the Service</li>
                      <li>Reverse engineer, decompile, or disassemble the Service</li>
                      <li>Access the Service to build a competitive product or service</li>
                      <li>Use the Service for any unlawful purpose or in violation of applicable laws</li>
                      <li>Attempt to gain unauthorized access to any portion of the Service or its related systems</li>
                    </ul>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 5. User Obligations */}
                  <div id="user-obligations">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">5. User Obligations</h2>
                    <p>You are responsible for:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Ensuring that your use of the Service complies with all applicable laws and regulations</li>
                      <li>The accuracy, quality, and legality of data you upload to the Service</li>
                      <li>Notifying us immediately of any unauthorized use of your account</li>
                      <li>Maintaining adequate backups of your data</li>
                    </ul>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 6. Data Security and Privacy */}
                  <div id="data-security">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">6. Data Security and Privacy</h2>
                    <p>We implement industry-standard security measures to protect your data, including end-to-end encryption, segregated multi-tenant architecture, and regular security audits. For full details on our security practices, please visit our <a href="/security" className="text-[#0074D9] underline hover:text-[#001F3F]">Security page</a>.</p>
                    <p className="mt-3">Your use of the Service is also governed by our <a href="/privacy" className="text-[#0074D9] underline hover:text-[#001F3F]">Privacy Policy</a>, which describes how we collect, use, and protect your personal information.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 7. Payment Terms */}
                  <div id="payment">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">7. Payment Terms</h2>
                    <p>Subscription fees are billed in advance on a monthly or annual basis, depending on your selected plan. All fees are non-refundable except as required by law or as expressly stated in these Terms.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">7.1 Price Changes</h3>
                    <p>We reserve the right to change our pricing at any time. For existing customers, price changes will take effect at the start of your next billing cycle. We will provide at least 30 days advance notice of any price increases.</p>
                    
                    <h3 className="text-xl font-semibold text-[#001F3F] mt-4 mb-2">7.2 Late Payment</h3>
                    <p>If payment is not received within 10 days of the due date, we reserve the right to suspend or terminate your access to the Service until payment is received. Late payments may be subject to interest charges of 1.5% per month or the maximum rate permitted by law, whichever is lower.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 8. Termination */}
                  <div id="termination">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">8. Termination</h2>
                    <p>You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. We may terminate or suspend your access to the Service immediately, without prior notice, if you breach these Terms or engage in fraudulent or illegal activity.</p>
                    <p className="mt-3">Upon termination, you will have 30 days to export your data from the Service. After 30 days, we may permanently delete your data in accordance with our data retention policies.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 9. Warranties and Disclaimers */}
                  <div id="warranties">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">9. Warranties and Disclaimers</h2>
                    <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                    <p className="mt-3">We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We do not warrant the accuracy, completeness, or reliability of any content or data provided through the Service.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 10. Limitation of Liability */}
                  <div id="liability">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">10. Limitation of Liability</h2>
                    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Your access to or use of (or inability to access or use) the Service</li>
                      <li>Any conduct or content of any third party on the Service</li>
                      <li>Unauthorized access, use, or alteration of your data</li>
                      <li>Any other matter relating to the Service</li>
                    </ul>
                    <p className="mt-3">OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 11. Indemnification */}
                  <div id="indemnification">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">11. Indemnification</h2>
                    <p>You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Your access to or use of the Service</li>
                      <li>Your violation of these Terms</li>
                      <li>Your violation of any third-party right, including intellectual property or privacy rights</li>
                      <li>Any data you upload or transmit through the Service</li>
                    </ul>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 12. Governing Law and Dispute Resolution */}
                  <div id="governing-law">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">12. Governing Law and Dispute Resolution</h2>
                    <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
                    <p className="mt-3">Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall take place in Wilmington, Delaware, and judgment on the award may be entered in any court having jurisdiction.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 13. Modifications to Terms */}
                  <div id="modifications">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">13. Modifications to Terms</h2>
                    <p className="font-semibold">We reserve the right to modify, amend, or update these Terms of Service at any time, at our sole discretion, with or without prior notice to you. Changes may be made to reflect changes in our business practices, legal requirements, or for any other reason we deem necessary.</p>
                    <p className="mt-3">When we make changes to these Terms, we will update the "Last Updated" date at the top of this page. For material changes, we may also provide notice through the Service or via email. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
                    <p className="mt-3">If you do not agree to the modified Terms, you must stop using the Service and cancel your subscription. We recommend that you review these Terms periodically to stay informed of any updates.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 14. Contact Information */}
                  <div id="contact">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-3">14. Contact Information</h2>
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <ul className="mt-3 space-y-1">
                      <li><strong>Email:</strong> legal@apex-cap.com</li>
                      <li><strong>Support:</strong> support@apex-cap.com</li>
                      <li><strong>Address:</strong> ApexDeliver + CapLiquify, 1209 Orange Street, Wilmington, DE 19801, United States</li>
                    </ul>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default TermsOfService;
