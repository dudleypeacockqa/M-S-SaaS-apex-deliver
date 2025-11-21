import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { IndustryAssessmentForm } from "@/components/marketing/financeflo/IndustryAssessmentForm";
import { CheckCircle, TrendingUp, Shield, Target, Clock, ArrowRight, BarChart, Users, DollarSign } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PrivateEquityIndustry = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Private Equity AI Finance Automation | FinanceFlo.ai UK</title>
        <meta name="description" content="AI-powered finance automation for Private Equity firms and Fund Managers. Transform portfolio finance operations across multiple companies. 8-12 weeks to full ROI. UK specialists." />
        <meta name="keywords" content="private equity finance automation, PE fund management software, portfolio company automation, investment management ERP, fund finance automation UK, PE AI automation" />
        <link rel="canonical" href="https://financeflo.ai/industries/private-equity" />

        {/* Open Graph */}
        <meta property="og:title" content="Private Equity AI Finance Automation | FinanceFlo.ai" />
        <meta property="og:description" content="Transform portfolio finance operations for PE firms. 8-12 weeks to full ROI. UK specialists." />
        <meta property="og:url" content="https://financeflo.ai/industries/private-equity" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Private Equity AI Finance Automation" />
        <meta name="twitter:description" content="Transform portfolio finance operations for PE firms. 8-12 weeks to full ROI." />
      </Helmet>

      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            <Target className="mr-2 h-4 w-4" />
            Private Equity & Investment Management
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="text-blue-600"> Portfolio Finance Operations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Designed for Private Equity Partners, Fund Managers, and Investment Directors who need enterprise-grade financial automation across multiple portfolio companies.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">8-12</div>
              <div className="text-gray-600">Weeks to Full ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">300%</div>
              <div className="text-gray-600">Average ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-gray-600">Faster Due Diligence</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-12 py-4">
            Get Portfolio Assessment
          </Button>
        </div>
      </section>

      {/* Unique Mechanism */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            The Adaptive Intelligence Framework™
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Our system adapts to each portfolio company's unique financial workflows, creating a unified intelligence layer that scales across your entire investment portfolio.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-blue-100 text-blue-600 mb-4">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Intelligence</h3>
                <p className="text-gray-600">Real-time financial insights across all portfolio companies with automated consolidation and reporting.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-purple-100 text-purple-600 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Mitigation</h3>
                <p className="text-gray-600">AI-powered early warning systems that identify financial risks before they impact portfolio performance.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-lg bg-green-100 text-green-600 mb-4">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Value Creation</h3>
                <p className="text-gray-600">Automated identification of operational improvements and value creation opportunities across the portfolio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Three Points */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How The Framework Transforms Your Portfolio
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Intelligent Integration</h3>
                <p className="text-gray-600 mb-6">
                  Our AI analyzes each portfolio company's existing financial systems and creates custom integration pathways that preserve data integrity while enabling cross-portfolio insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Multi-ERP system compatibility</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Automated data mapping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Real-time synchronization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Adaptive Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Machine learning algorithms continuously adapt to each company's financial patterns, providing increasingly accurate forecasting and anomaly detection tailored to your investment thesis.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Predictive cash flow modeling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Performance benchmarking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Risk scoring algorithms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Strategic Optimization</h3>
                <p className="text-gray-600 mb-6">
                  The framework identifies optimization opportunities across the portfolio, from operational efficiencies to strategic initiatives, providing actionable insights for value creation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Value creation identification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Exit strategy optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">Portfolio-wide insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Proven Results Across Private Equity Portfolios
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Meridian Capital Partners</div>
                    <div className="text-sm text-gray-600">£2.5B AUM, 12 Portfolio Companies</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The Adaptive Intelligence Framework transformed our portfolio oversight. We now have real-time visibility into all 12 companies' financial performance, enabling us to identify value creation opportunities 6 months earlier than before."
                </blockquote>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">£45M</div>
                    <div className="text-sm text-gray-600">Additional Value Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8 Weeks</div>
                    <div className="text-sm text-gray-600">Implementation Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Blackstone Growth Equity</div>
                    <div className="text-sm text-gray-600">£1.8B AUM, 8 Portfolio Companies</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Due diligence processes that used to take 12 weeks now complete in 3 weeks. The framework's predictive analytics have helped us avoid two potential problem investments, saving an estimated £25M."
                </blockquote>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">75%</div>
                    <div className="text-sm text-gray-600">Faster Due Diligence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">£25M</div>
                    <div className="text-sm text-gray-600">Risk Mitigation Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Card className="inline-block border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">£127M</div>
                <div className="text-xl text-gray-600">Average Portfolio Value Increase</div>
                <div className="text-sm text-gray-500 mt-2">Across 25+ PE firms in first 12 months</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Get Your Portfolio Intelligence Assessment
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Discover how the Adaptive Intelligence Framework can transform your portfolio's financial operations and unlock hidden value.
              </p>
              <IndustryAssessmentForm
                industry="Private Equity"
                assessmentType="Portfolio Intelligence"
                buttonText="Get My Portfolio Assessment"
                buttonColor="blue"
                companyLabel="PE Firm Name"
                field1Label="Assets Under Management"
                field1Placeholder="e.g., £100M-£1B"
                field2Label="Number of Portfolio Companies"
                field2Placeholder="e.g., 5-50 companies"
              />
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PrivateEquityIndustry;

