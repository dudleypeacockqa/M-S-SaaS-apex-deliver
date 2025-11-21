import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Phone, Play, Pause, Volume2, VolumeX, RotateCcw, Clock } from "lucide-react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";

interface EnterpriseVSLHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  videoSrc: string;
  audioSrc: string;
  ctaText: string;
  ctaLink: string;
  phoneNumber: string;
}

export const EnterpriseVSLHeroSection: React.FC<EnterpriseVSLHeroSectionProps> = ({
  title,
  subtitle,
  description,
  videoSrc,
  audioSrc,
  ctaText,
  ctaLink,
  phoneNumber,
}) => {
  return (
    <section className="brand-section-hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-brand-gradient-hero"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,87,25,0.1)_0%,transparent_50%)]"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-accent/20 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Subtitle Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent-foreground text-sm font-medium backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
              {subtitle}
            </div>

            {/* Main Headline */}
            <h1 className="brand-hero-title animate-fade-in-up">
              <span className="brand-gradient-text">
                {title}
              </span>
            </h1>

            {/* Description */}
            <p className="brand-hero-description animate-fade-in-up-delay max-w-2xl">
              {description}
            </p>

            {/* Call-to-Action Buttons */}
            <div className="brand-cta-buttons animate-fade-in-up-delay-2">
              <Button
                size="lg"
                variant="brand-cta"
                className="min-w-[280px]"
                onClick={() => window.location.href = ctaLink}
              >
                <Calendar className="mr-3 h-5 w-5" />
                <span className="font-semibold">{ctaText}</span>
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>

              <Button
                variant="brand-outline"
                size="lg"
                className="min-w-[280px] border-white/80 text-white hover:bg-white hover:text-primary"
                onClick={() => window.location.href = `tel:${phoneNumber}`}
              >
                <Phone className="mr-3 h-5 w-5" />
                <span className="font-semibold">Call Now: {phoneNumber}</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in-up-delay-3 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">450+</div>
                <div className="text-sm text-gray-300">Businesses Transformed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">66%</div>
                <div className="text-sm text-gray-300">Cost Reduction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">500%</div>
                <div className="text-sm text-gray-300">ROI Increase</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">40+</div>
                <div className="text-sm text-gray-300">Hours Saved Monthly</div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced VSL Video Player */}
          <div className="relative animate-fade-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <EnhancedVSLPlayer
                videoSrc={videoSrc}
                audioSrc={audioSrc}
                title="Transform Your Finance Operations"
                className="w-full aspect-video"
                showControls={true}
                autoplay={false}
                controlsPosition="bottom-right"
              />
            </div>
            
            {/* Video Enhancement Overlay */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-right {
          from { 
            opacity: 0; 
            transform: translateX(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.8s ease-out 0.8s both;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out 0.4s both;
        }
      `}</style>
    </section>
  );
};

