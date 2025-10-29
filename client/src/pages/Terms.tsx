import React from 'react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Terms of Service Page for ApexDeliver + CapLiquify.
 * Standard SaaS terms covering usage rights, limitations, warranties, liability, and dispute resolution.
 */
const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              Last Updated: October 29, 2025
            </p>

            <Card className="shadow-lg border-t-4 border-emerald-500">
              <CardContent className="pt-6">
                <div className="space-y-8 text-gray-700">
                  {/* 1. Agreement to Terms */}
                  <div id="agreement">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">1. Agreement to Terms</h2>
                    <p>Welcome to ApexDeliver + CapLiquify ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our software platform and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and all policies referenced herein. If you do not agree to these Terms, you must not use the Service.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 2. Usage Rights and License */}
                  <div id="usage-rights">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">2. Usage Rights and License</h2>
                    <p>Subject to your compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service solely for your internal business purposes related to mergers and acquisitions (M&A) and capital liquidation.</p>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Restrictions:</h3>
                    <p>You shall not (a) license, sublicense, sell, resell, rent, lease, transfer, assign, distribute, or otherwise commercially exploit or make the Service available to any third party; (b) modify, copy, or create derivative works based on the Service; (c) reverse engineer or access the Service in order to build a competitive product or service; or (d) use the Service for any unlawful purpose.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 3. User Obligations */}
                  <div id="user-obligations">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">3. User Obligations</h2>
                    <p>You agree to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                      <li>Provide accurate and complete registration information.</li>
                      <li>Maintain the confidentiality of your account credentials.</li>
                      <li>Use the Service in compliance with all applicable laws and regulations.</li>
                      <li>Be solely responsible for the data and information you input into the Service ("User Data").</li>
                    </ul>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 4. Fees and Payment */}
                  <div id="fees">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">4. Fees and Payment</h2>
                    <p>Access to the Service may require you to pay fees. You agree to pay all applicable fees as described on the Service's pricing page or in a separate agreement. All fees are non-refundable unless expressly stated otherwise.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 5. Term and Termination */}
                  <div id="termination">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">5. Term and Termination</h2>
                    <p>These Terms commence on the date you first use the Service and continue until terminated. We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 6. Warranties and Disclaimer */}
                  <div id="warranties">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">6. Warranties and Disclaimer</h2>
                    <p className="font-bold text-red-600">THE SERVICE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                    <p>We do not warrant that the Service will be uninterrupted, secure, or error-free. The Company is not responsible for the accuracy or completeness of any M&A or financial data provided by you or third parties through the Service.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 7. Limitation of Liability */}
                  <div id="liability">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">7. Limitation of Liability</h2>
                    <p className="font-bold text-red-600">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.</p>
                    <p>In no event shall the Company's aggregate liability for all claims relating to the Service exceed the amount you paid to the Company for the Service in the twelve (12) months preceding the event giving rise to the claim.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 8. Indemnification */}
                  <div id="indemnification">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">8. Indemnification</h2>
                    <p>You agree to defend, indemnify, and hold harmless the Company and its affiliates, officers, agents, and employees from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms; or (iii) your violation of any third-party right, including without limitation any intellectual property or privacy right.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 9. Governing Law and Dispute Resolution */}
                  <div id="dispute-resolution">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">9. Governing Law and Dispute Resolution</h2>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Governing Law:</h3>
                    <p>These Terms shall be governed and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Dispute Resolution:</h3>
                    <p>Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration in [City, State of Arbitration], in accordance with the commercial arbitration rules of the American Arbitration Association (AAA). The arbitration shall be conducted by a single arbitrator. You and the Company waive any right to a jury trial in any action or proceeding.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* 10. Miscellaneous */}
                  <div id="miscellaneous">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">10. Miscellaneous</h2>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Entire Agreement:</h3>
                    <p>These Terms constitute the entire agreement between you and the Company regarding the Service.</p>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Assignment:</h3>
                    <p>You may not assign or transfer these Terms, by operation of law or otherwise, without the Company's prior written consent.</p>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Waiver:</h3>
                    <p>The failure of the Company to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                    <h3 className="text-xl font-semibold text-navy-700 mt-4 mb-2">Severability:</h3>
                    <p>If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions of these Terms will remain in effect.</p>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Contact Information */}
                  <div id="contact">
                    <h2 className="text-2xl font-bold text-navy-800 mb-3">Contact Information</h2>
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <p className="font-mono text-bright-blue-600">[Email Address]</p>
                    <p className="text-sm text-gray-500">[Physical Address]</p>
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