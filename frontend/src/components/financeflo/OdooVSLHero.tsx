import React from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { Button } from "./ui/button";
import { Phone, Calendar, ArrowRight } from "lucide-react";

export const OdooVSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* VSL Video Player */}
      <EnhancedVSLPlayer
        videoSrc="/odoo_vsl_video.mp4"
        audioSrc="/odoo_vsl_audio.wav"
        posterImage="/odoo_dashboard_1.png"
        className="absolute inset-0 w-full h-full object-cover"
        controlsPosition="bottom-right"
        showProgress={true}
        autoplay={false}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Odoo Logo */}
            <div className="mb-8">
              <img 
                src="/odoo_logo.png" 
                alt="Odoo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Unleash Unlimited
              <span className="block text-teal-600">Business Potential</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-600 mt-4">
                with Odoo's Open-Source Freedom
              </span>
            </h1>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">Integrated Apps</div>
                <div className="text-sm text-gray-600">All-in-one platform</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">66%</div>
                <div className="text-gray-700 font-medium">Cost Reduction</div>
                <div className="text-sm text-gray-600">vs traditional ERP</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">∞</div>
                <div className="text-gray-700 font-medium">Customization</div>
                <div className="text-sm text-gray-600">Open source freedom</div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why 12 Million Users Choose Odoo Over Expensive Alternatives
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span><strong>No Vendor Lock-in:</strong> Complete freedom with full source code access</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span><strong>Fair Pricing:</strong> £20/user/month for ALL applications</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span><strong>Unlimited Scalability:</strong> From startup to enterprise</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span><strong>40,000+ Apps:</strong> Largest business app ecosystem</span>
                </li>
              </ul>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call +44 7360 539147
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>10-Week Implementation</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Zero Risk Guarantee</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>UK Support Team</span>
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

