import React from 'react';
import { EnhancedVSLPlayer } from '../../components/EnhancedVSLPlayer';
import { Button } from '../../components/ui/button';
import { Phone, Calendar, ArrowRight } from 'lucide-react';

const PrivateEquityVSL: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section with VSL */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Private Equity Excellence
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Transform Portfolio
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                    Performance
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Maximize EBITDA and portfolio value through AI-powered financial intelligence. 
                  See how our Adaptive Intelligence Framework™ delivers measurable results for PE firms.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">£2.3B</div>
                  <div className="text-sm text-gray-400">Portfolio Value Optimized</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400">35%</div>
                  <div className="text-sm text-gray-400">EBITDA Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">300%</div>
                  <div className="text-sm text-gray-400">Faster Month-End</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open('https://calendly.com/financeflo-ai/portfolio-assessment', '_blank')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Portfolio Assessment
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                  onClick={() => window.open('tel:+447360539147', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  +44 7360 539147
                </Button>
              </div>
            </div>

            {/* Right Column - VSL Player */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10 rounded-2xl"></div>
                <div className="relative">
                  <EnhancedVSLPlayer
                    videoSrc="/videos/private_equity_vsl_final.mp4"
                    title="Private Equity Portfolio Transformation"
                    description="Discover how PE firms are achieving 35% EBITDA improvements through AI-powered financial intelligence"
                    ctaText="Schedule Portfolio Assessment"
                    ctaAction={() => window.open('https://calendly.com/financeflo-ai/portfolio-assessment', '_blank')}
                    phoneNumber="+44 7360 539147"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            Trusted by Leading Private Equity Firms
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">£2.3B</div>
              <div className="text-gray-300">Portfolio Value Under Management</div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl font-bold text-teal-400 mb-2">35%</div>
              <div className="text-gray-300">Average EBITDA Improvement</div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">15</div>
              <div className="text-gray-300">Portfolio Companies Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Optimize Your Portfolio Performance?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule your complimentary Portfolio Assessment and discover how much value you're leaving on the table.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open('https://calendly.com/financeflo-ai/portfolio-assessment', '_blank')}
          >
            <Calendar className="mr-3 h-6 w-6" />
            Schedule Assessment Now
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PrivateEquityVSL;

