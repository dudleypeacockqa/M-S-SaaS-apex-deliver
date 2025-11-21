import React from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { EnhancedButton } from "./ui/enhanced-button";

export const ERPIntegrationVSLHero: React.FC = () => {
  return (
    <section className="brand-section-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white/90 mb-6 backdrop-blur-sm border border-accent/30">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              ERP Integration Excellence
            </div>
            
            <h1 className="brand-hero-title">
              Seamless ERP Integration
              <span className="brand-gradient-text"> Excellence</span>
            </h1>
            
            <p className="brand-hero-description">
              Transform LeverageFlo.ai Into Your Unified Business Intelligence Platform
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">300%</div>
                <div className="text-white/80 text-sm">ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">80%</div>
                <div className="text-white/80 text-sm">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">30 Days</div>
                <div className="text-white/80 text-sm">Implementation</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton 
                variant="cta" 
                size="lg"
                className="brand-button-cta"
              >
                Schedule Integration Demo
              </EnhancedButton>
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Watch Demo
              </EnhancedButton>
            </div>
          </div>
          
          {/* Right Content - VSL Video */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-sm border border-white/10">
              <EnhancedVSLPlayer
                videoSrc="/erp_integration_vsl_video.mp4"
                audioSrc="/erp_integration_vsl_audio.wav"
                posterImage="/erp_integration_vsl_video.mp4"
                title="ERP Integration Excellence"
                className="w-full aspect-video"
                showControls={true}
                autoplay={false}
                controlsPosition="bottom-right"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

