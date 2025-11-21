import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { PricingVSLHeroCompact } from "@/components/marketing/financeflo/PricingVSLHeroCompact";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { CheckCircle, Star, Shield, Zap, Crown, Sparkles } from "lucide-react";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>AI Transformation Pricing | FinanceFlo.ai - UK B2B Solutions</title>
        <meta name="description" content="Transparent AI transformation pricing for UK mid-market businesses (£3M-£100M). From £1,500/month. 300% ROI guarantee. B2B SaaS solutions with IntelliFlow, TrendFlo & LeverageFlo." />
        <meta name="keywords" content="AI transformation pricing UK, B2B AI solutions, ERP integration pricing, business automation costs, AI SaaS pricing UK, mid-market AI solutions" />
        <link rel="canonical" href="https://financeflo.ai/pricing" />

        {/* Open Graph */}
        <meta property="og:title" content="AI Transformation Pricing | FinanceFlo.ai" />
        <meta property="og:description" content="Transparent pricing for AI transformation. From £1,500/month (ex-VAT). 300% ROI guarantee for UK businesses." />
        <meta property="og:url" content="https://financeflo.ai/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FinanceFlo.ai" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Transformation Pricing | FinanceFlo.ai" />
        <meta name="twitter:description" content="Transparent pricing for AI transformation. From £1,500/month (ex-VAT). 300% ROI guarantee." />
      </Helmet>

      <Navigation />
      
      {/* VSL Hero Section */}
      <PricingVSLHeroCompact />

      {/* Pricing Tiers */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Tier 1: AI Accelerator */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">AI Accelerator</h3>
              </div>
              <p className="text-gray-600 mb-6">Perfect for midmarket businesses starting their AI journey</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">£1,500 - £3,500</div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Setup: £2,000 - £5,000</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1-2 AI modules</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 ERP integration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">10-25 users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic AI processing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Standard support</span>
                </li>
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/contact'}
              >
                Start Free Assessment
              </Button>
            </div>

            {/* Tier 2: AI Transformer (Most Popular) */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 relative transform scale-105 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">AI Transformer</h3>
              </div>
              <p className="text-gray-600 mb-6">For growing businesses requiring comprehensive AI transformation</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">£3,500 - £7,500</div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-blue-600 font-semibold mt-1">Setup: £5,000 - £10,000</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">3-5 AI modules</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">2 ERP integrations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">25-75 users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Advanced AI & analytics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom reporting</span>
                </li>
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/contact'}
              >
                Start Free Assessment
              </Button>
            </div>

            {/* Tier 3: AI Dominator */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">AI Dominator</h3>
              </div>
              <p className="text-gray-600 mb-6">For complex businesses seeking competitive advantage</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">£7,500 - £15,000+</div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-purple-600 font-semibold mt-1">Setup: £10,000 - £15,000+</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Comprehensive AI suite</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Multiple ERP integrations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">75-200+ users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bespoke development</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">24/7 premium support</span>
                </li>
              </ul>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Sales
              </Button>
            </div>

            {/* Tier 4: Custom AI Development */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Custom AI Development</h3>
              </div>
              <p className="text-gray-300 mb-6">For unique, large-scale AI requirements and strategic projects</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold">Custom Quote</div>
                <div className="text-gray-300">project-based</div>
                <div className="text-sm text-yellow-400 font-semibold mt-1">Bespoke pricing model</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Entirely bespoke AI models</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Strategic AI consulting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited scale</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">White-label solutions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Executive partnership</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Global deployment</span>
                </li>
              </ul>

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                onClick={() => window.location.href = '/contact'}
              >
                Discuss Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value-Based Pricing Principles */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Value-Based Pricing Methodology
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ROI Guarantee</h3>
              <p className="text-gray-600">300%+ ROI within 6 months or we refund your investment</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Costs</h3>
              <p className="text-gray-600">No hidden fees, clear setup costs, predictable monthly investment</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Value Scaling</h3>
              <p className="text-gray-600">Pricing scales with your business size and transformation needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Market Focus */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Designed for UK Mid-Market Excellence
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Our pricing methodology specifically targets UK businesses with £3M-£100M annual turnover, 
            focusing on delivering maximum value for C-suite executives.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">CEO Priority</div>
              <p className="text-gray-600">Revenue growth and competitive advantage through AI transformation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">CFO Priority</div>
              <p className="text-gray-600">Cost reduction, efficiency gains, and measurable ROI</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">COO/CIO Priority</div>
              <p className="text-gray-600">Operational excellence and seamless technology integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with a free assessment to determine the perfect tier for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/contact'}
            >
              Start Free Assessment
            </Button>
            <Button
              size="lg"
              className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Strategy Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;

