import React from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Phone, Calendar, ArrowRight } from "lucide-react";
import { useSecureNavigation } from "@/hooks/useSecureNavigation";

export const ProfessionalHeroSection = () => {
  const { navigateTo } = useSecureNavigation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep Navy Background - Brand Guidelines */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent"></div>
      </div>

      {/* Crystal-clear water metaphor pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232BB673' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Water flow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#2BB673] to-[#007BFF] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-[#007BFF] to-[#2BB673] rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#2BB673] to-[#007BFF] rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Subtle glow effects - Brand Colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column - Content */}
          <div className="space-y-8 sm:space-y-10">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
              <span className="text-white text-sm font-medium">Trusted by 450+ UK Businesses</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-heading">
                <span className="text-white">Transform Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green-light">
                  Finance Operations
                </span>
                <br />
                <span className="text-white">with AI+ERP</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl font-body">
                Stop letting manual tasks drain your team's energy.
                Join 450+ businesses achieving <span className="text-brand-green font-semibold">66% cost reduction</span> and
                <span className="text-brand-green font-semibold"> 500% ROI boost</span> with our Adaptive Intelligence Framework™.
              </p>
            </div>

            {/* Stats Cards matching the reference design */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">450+</div>
                <div className="text-white/90 text-xs sm:text-sm font-medium">Businesses<br />Transformed</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-green mb-2 sm:mb-3">66%</div>
                <div className="text-white/90 text-xs sm:text-sm font-medium">Cost Reduction</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-green mb-2 sm:mb-3">500%</div>
                <div className="text-white/90 text-xs sm:text-sm font-medium">ROI Boost</div>
              </div>
            </div>

            {/* CTA Buttons matching the reference design */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => navigateTo('/assessment')}
                className="bg-gradient-to-r from-brand-green to-brand-green-light hover:from-brand-green-dark hover:to-brand-green text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Schedule Your Free Assessment</span>
                <span className="sm:hidden">Free Assessment</span>
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={() => window.open('tel:+447360539147', '_self')}
                className="bg-white text-brand-navy hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Phone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Call Now: +44 7360 539147</span>
                <span className="sm:hidden">Call Now</span>
              </Button>
            </div>

            {/* Trust Indicators matching the reference */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-brand-green" />
                <span className="text-xs sm:text-sm font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-brand-green" />
                <span className="text-xs sm:text-sm font-medium">Award Winning Platform</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue" />
                <span className="text-xs sm:text-sm font-medium">Guaranteed Results</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview matching the reference */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Dashboard Header with browser chrome */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-600 text-sm ml-4">financeflo.ai/dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Live Data</span>
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      500% ROI
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-gradient-to-br from-[#F4F6F8] to-white">
                {/* Live Demo Button */}
                <div className="text-center mb-6">
                  <Button className="bg-brand-green text-white hover:bg-brand-green-dark shadow-md">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Live Demo
                  </Button>
                </div>
                
                {/* Alert Indicators */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-brand-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">AI Processing Active</span>
                  </div>
                  <div className="bg-brand-green/10 text-brand-green text-xs px-2 py-1 rounded-full font-medium">
                    Real-time Alerts
                  </div>
                </div>

                {/* Cash Flow & Working Capital Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-brand-green">
                    <div className="text-sm text-gray-600 mb-1">Working Capital</div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-brand-green">£2.4M</span>
                      <span className="text-brand-green text-sm ml-2 bg-brand-green/10 px-2 py-1 rounded">+23% vs last month</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Cash flow optimization</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-brand-blue">
                    <div className="text-sm text-gray-600 mb-1">AI Efficiency</div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-brand-blue">94%</span>
                      <span className="text-brand-blue text-sm ml-2">+15% improvement</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Automated processing</div>
                  </div>
                </div>

                {/* Cash Flow Chart visualization */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-brand-green rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Cash Flow Analysis</span>
                    </div>
                    <span className="text-sm text-gray-500">Working Capital Trends</span>
                  </div>
                  <div className="flex items-end justify-between space-x-1 h-32 bg-gradient-to-t from-[#F4F6F8] to-transparent rounded-lg p-2">
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-navy to-brand-navy-light w-6 h-16 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.1M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-green to-brand-green-light w-6 h-20 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110 animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.4M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-blue to-brand-blue-light w-6 h-18 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.2M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-green-dark to-brand-green w-6 h-24 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.6M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-navy to-brand-navy-light w-6 h-22 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.5M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-blue to-brand-blue-light w-6 h-28 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110 animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.8M
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="bg-gradient-to-t from-brand-green to-brand-green-light w-6 h-26 rounded-t-md shadow-lg transition-all duration-500 hover:scale-110"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        £2.7M
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="bg-gradient-to-r from-brand-green/10 to-brand-blue/10 text-brand-green text-xs px-3 py-1 rounded-full border border-brand-green/20">💰 Working Capital Optimization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-brand-green text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
              LIVE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalHeroSection;