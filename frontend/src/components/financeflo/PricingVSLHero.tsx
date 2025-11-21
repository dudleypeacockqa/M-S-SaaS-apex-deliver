import React from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { Button } from "./ui/button";
import { Phone, Calendar, ArrowRight, Shield, TrendingUp, DollarSign } from "lucide-react";

export const PricingVSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* VSL Video Player */}
      <EnhancedVSLPlayer
        videoSrc="/pricing_roi_vsl_video.mp4"
        audioSrc="/pricing_roi_vsl_audio.wav"
        posterImage="/odoo_dashboard_1.png"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        controlsPosition="bottom-right"
        showControls={true}
        showProgress={true}
        autoplay={false}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Guaranteed
              <span className="block text-blue-600">300% ROI</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-600 mt-4">
                or Your Money Back - Legally Binding Promise
              </span>
            </h1>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <div className="text-2xl font-bold text-blue-600">300%</div>
                </div>
                <div className="text-gray-700 font-medium">ROI Guarantee</div>
                <div className="text-sm text-gray-600">Legally binding promise</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <div className="text-2xl font-bold text-green-600">400%</div>
                </div>
                <div className="text-gray-700 font-medium">Typical Returns</div>
                <div className="text-sm text-gray-600">First year results</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
                  <div className="text-2xl font-bold text-purple-600">£0</div>
                </div>
                <div className="text-gray-700 font-medium">Hidden Costs</div>
                <div className="text-sm text-gray-600">Transparent pricing</div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Smart Businesses Choose Value-Based Pricing Over Hidden Costs
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span><strong>300% ROI Guarantee:</strong> Legally binding commitment to your success</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span><strong>Transparent Pricing:</strong> No hidden fees, no surprise costs, no budget overruns</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span><strong>Everything Included:</strong> Implementation, training, support, optimization</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span><strong>Unlimited Growth:</strong> No per-user penalties or upgrade costs</span>
                </li>
              </ul>
            </div>
            
            {/* ROI Example */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Typical Client Example:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">Monthly Investment:</div>
                  <div className="text-3xl font-bold text-blue-600">£3,500</div>
                  <div className="text-sm text-gray-600">All-inclusive pricing</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">Monthly Savings:</div>
                  <div className="text-3xl font-bold text-green-600">£15,000</div>
                  <div className="text-sm text-gray-600">Operational cost reduction</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-gray-700">Net Monthly Benefit: <span className="text-2xl font-bold text-green-600">£11,500</span></div>
                <div className="text-sm text-gray-600">That's 400% ROI in year one</div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call +44 7360 539147
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free ROI Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>300% ROI Guarantee</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>No Hidden Costs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Money-Back Promise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </section>
  );
};

