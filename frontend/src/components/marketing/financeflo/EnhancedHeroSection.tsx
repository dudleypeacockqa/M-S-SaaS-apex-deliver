
import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroTrustBadge } from "./hero/HeroTrustBadge";
import { HeroContent } from "./hero/HeroContent";
import { HeroStats } from "./hero/HeroStats";
import { HeroCTAButtons } from "./hero/HeroCTAButtons";
import { HeroTrustIndicators } from "./hero/HeroTrustIndicators";
import { HeroDashboardMockup } from "./hero/HeroDashboardMockup";

export const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Image instead of Video */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=6000&auto=format&fit=crop')`
          }}
        />
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-navy-dark/70 to-brand-gold/20"></div>
      </div>

      {/* Animated Background Elements (on top of background) */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-navy/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-gold/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Trust Badge */}
        <div className="mb-8">
          <HeroTrustBadge />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Main Headline - Closers.io Style */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Transform Your Business Into a </span>
                <span className="bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                  Revenue-Generating Machine
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/80 leading-relaxed">
                Our <span className="text-white font-semibold">Adaptive Intelligence Framework™</span> combines 
                AI automation with intelligent ERP integration to deliver measurable results for finance teams across the UK.
              </p>
            </div>

            {/* Key Benefits Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">80%</div>
                <div className="text-white/70 text-sm">Time Saved</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-1">300%</div>
                <div className="text-white/70 text-sm">ROI Increase</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl lg:text-4xl font-bold text-brand-gold mb-1">30 Days</div>
                <div className="text-white/70 text-sm">Implementation</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/assessment')}
                className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Start Free Assessment
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:bg-white/20 transition-all duration-300"
              >
                ▶ Watch Demo Video
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-white/70">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-gold rounded-full"></div>
                <span className="text-sm">Award Winning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-navy rounded-full"></div>
                <span className="text-sm">Guaranteed Results</span>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Dashboard Mockup */}
          <div className="relative">
            {/* Dashboard Container */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-800 font-semibold">financeflo.ai/dashboard</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Data</span>
                </div>
              </div>

              {/* Revenue Metric */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Revenue</div>
                <div className="text-3xl font-bold text-gray-900">£2.4M</div>
                <div className="text-green-600 text-sm font-semibold">+23% vs last month</div>
              </div>

              {/* Efficiency Metric */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                <div className="text-3xl font-bold text-gray-900">94%</div>
                <div className="text-green-600 text-sm font-semibold">+15% improvement</div>
              </div>

              {/* Chart Visualization */}
              <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4 flex items-end justify-between p-4">
                <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                <div className="w-8 bg-blue-600 rounded-t" style={{height: '80%'}}></div>
                <div className="w-8 bg-purple-500 rounded-t" style={{height: '70%'}}></div>
                <div className="w-8 bg-purple-600 rounded-t" style={{height: '90%'}}></div>
                <div className="w-8 bg-blue-500 rounded-t" style={{height: '85%'}}></div>
              </div>

              {/* AI Processing Indicators */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">AI Processing</span>
                </div>
                <div className="text-sm text-gray-600">Real-time Updates</div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
              Live Data
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              AI Processing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
