import React from 'react';
import MarketingNav from '@/components/MarketingNav'; // Placeholder
import MarketingFooter from '@/components/MarketingFooter'; // Placeholder
import { Button } from '@/components/ui/button'; // shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // shadcn/ui
import { ArrowRight } from 'lucide-react';

// Define the color palette based on the branding requirements:
// Navy Blue: primary-navy (e.g., #001F3F)
// Emerald Green: accent-emerald (e.g., #00A86B)
// Bright Blue: secondary-bright (e.g., #007FFF)

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Placeholder for Marketing Navigation */}
      <MarketingNav />

      <main className="flex-grow">
        {/* Hero Section: Mission Statement */}
        <section className="py-20 md:py-32 bg-[#001F3F] text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Our Mission: Transformative Growth, Engineered for Success
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl text-gray-200">
              We empower mid-market companies to achieve **unprecedented operational excellence** and **financial clarity** by unifying the power of ERP systems with sophisticated capital allocation strategies.
            </p>
            <Button className="mt-8 bg-[#00A86B] hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-lg transition duration-300 shadow-lg">
              See Our Platform <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Founding Story Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#001F3F] mb-6 border-l-4 border-[#007FFF] pl-4">
                  Built by Practitioners, For Practitioners
                </h2>
                <p className="mb-6 text-lg text-gray-600">
                  ApexDeliver + CapLiquify was born from a shared frustration: the gap between powerful ERP data and effective financial strategy. Our founders, a team of **seasoned ERP implementation specialists** and **fractional CFOs**, recognized that traditional software solutions failed to bridge this divide.
                </p>
                <p className="mb-6 text-lg text-gray-600">
                  The ERP experts brought deep knowledge of operational data flow and system integration, while the fractional CFOs contributed real-world expertise in capital management, M&A due diligence, and driving shareholder value. This unique synergy created a platform that doesn't just report data—it **prescribes action** and **quantifies financial impact**.
                </p>
                <p className="text-lg text-gray-600">
                  We are dedicated to providing the tools we always wished we had: a single source of truth for operational and financial performance, enabling mid-market leaders to make **data-driven decisions with confidence**.
                </p>
              </div>
              <div className="hidden md:block">
                {/* Image Placeholder - A professional, abstract image representing synergy or data flow */}
                <div className="bg-gray-200 h-96 rounded-xl shadow-2xl flex items-center justify-center text-gray-500">
                  <svg className="w-16 h-16 text-[#007FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Statistics Section */}
        <section className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#001F3F] mb-12">
              The Results Speak for Themselves
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-xl border-t-4 border-[#00A86B]">
                <CardHeader>
                  <CardTitle className="text-6xl font-extrabold text-[#00A86B]">
                    300-500%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-700">
                    Average Return on Investment
                  </p>
                  <p className="text-gray-500 mt-2">
                    Our clients consistently report a 3x to 5x return on their platform investment within the first year.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-xl border-t-4 border-[#007FFF]">
                <CardHeader>
                  <CardTitle className="text-6xl font-extrabold text-[#007FFF]">
                    230+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-700">
                    Successful Business Transformations
                  </p>
                  <p className="text-gray-500 mt-2">
                    We have guided over 230 mid-market enterprises through complex financial and operational overhauls.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-xl border-t-4 border-[#001F3F]">
                <CardHeader>
                  <CardTitle className="text-6xl font-extrabold text-[#001F3F]">
                    &lt; 6 Months
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-700">
                    Time to Value Realization
                  </p>
                  <p className="text-gray-500 mt-2">
                    Our accelerated implementation and prescriptive analytics ensure rapid realization of key financial benefits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#001F3F] mb-4">
              Ready to Engineer Your Next Phase of Growth?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with our team of ERP and fractional CFO experts today.
            </p>
            <Button className="bg-[#007FFF] hover:bg-blue-600 text-white text-lg px-10 py-6 rounded-lg transition duration-300 shadow-lg">
              Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Placeholder for Marketing Footer */}
      <MarketingFooter />
    </div>
  );
};

export default About;