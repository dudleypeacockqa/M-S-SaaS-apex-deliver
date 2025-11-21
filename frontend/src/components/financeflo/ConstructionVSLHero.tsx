import React from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { EnhancedButton } from "./ui/enhanced-button";
import { Phone, Calendar, ArrowRight, HardHat, TrendingUp, Shield, Clock } from "lucide-react";

export const ConstructionVSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* VSL Video Player */}
      <EnhancedVSLPlayer
        videoSrc="/construction_industry_vsl_video.mp4"
        audioSrc="/construction_industry_vsl_audio.wav"
        posterImage="/construction_hero_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        controlsPosition="bottom-right"
        showControls={true}
        showProgress={true}
        autoplay={false}
        title="Construction Intelligence Framework"
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Industry Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
                <HardHat className="mr-2 h-4 w-4" />
                Construction & Infrastructure
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Stronger
              <span className="block text-orange-600">Financial Foundations</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-600 mt-4">
                Real-time financial control across multiple projects and sites
              </span>
            </h1>
            
            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-200">
                <div className="flex items-center mb-3">
                  <Clock className="w-8 h-8 text-orange-600 mr-3" />
                  <div className="text-2xl font-bold text-orange-600">10-12</div>
                </div>
                <div className="text-gray-700 font-medium">Weeks Implementation</div>
                <div className="text-sm text-gray-600">Full system deployment</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-200">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                </div>
                <div className="text-gray-700 font-medium">Admin Time Reduction</div>
                <div className="text-sm text-gray-600">Automated processes</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-orange-200">
                <div className="flex items-center mb-3">
                  <Shield className="w-8 h-8 text-orange-600 mr-3" />
                  <div className="text-2xl font-bold text-orange-600">£2.4M</div>
                </div>
                <div className="text-gray-700 font-medium">Annual Savings</div>
                <div className="text-sm text-gray-600">Average client results</div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-xl border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Construction Intelligence Framework™ - Built for Your Industry
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span><strong>Multi-Site Project Control:</strong> Real-time visibility across all construction sites</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span><strong>Subcontractor Management:</strong> Automated invoicing and payment tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span><strong>Mobile-First Design:</strong> Site managers update costs from any device</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span><strong>Predictive Analytics:</strong> AI-powered cost forecasting and risk alerts</span>
                </li>
              </ul>
            </div>
            
            {/* Social Proof Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Trusted by 150+ Construction Companies</h3>
                  <p className="text-orange-100">From small contractors to major infrastructure projects</p>
                </div>
                <HardHat className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton 
                size="lg" 
                variant="cta"
                className="min-w-[280px] bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call +44 7360 539147
              </EnhancedButton>
              <EnhancedButton 
                size="lg" 
                variant="watch"
                className="min-w-[320px]"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Get Project Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </EnhancedButton>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Multi-Site Control</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Real-Time Reporting</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Mobile Access</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Predictive Analytics</span>
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

