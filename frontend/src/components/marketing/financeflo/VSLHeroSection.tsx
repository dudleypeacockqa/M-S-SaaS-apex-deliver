import React from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { ArrowRight, Calendar, Phone } from 'lucide-react';
import { EnhancedVSLPlayer } from './EnhancedVSLPlayer';

interface VSLHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  videoSrc: string;
  audioSrc: string;
  ctaText?: string;
  ctaLink?: string;
  phoneNumber?: string;
}

export const VSLHeroSection: React.FC<VSLHeroSectionProps> = ({
  title,
  subtitle,
  description,
  videoSrc,
  audioSrc,
  ctaText = "Schedule Your Free Assessment",
  ctaLink = "/contact",
  phoneNumber = "+44 7360 539147"
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <EnhancedVSLPlayer
          videoSrc={videoSrc}
          audioSrc={audioSrc}
          title="FinanceFlo.ai - AI+ERP Transformation"
          className="w-full h-full"
          autoplay={false}
          showControls={true}
          controlsPosition="bottom-right"
          showTitle={true}
          showProgress={true}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-blue-300 font-medium mb-4 animate-fade-in">
            {subtitle}
          </p>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay">
            {description}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-2">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              onClick={() => window.location.href = ctaLink}
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span className="text-white font-semibold">{ctaText}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent min-w-[280px]"
              onClick={() => window.location.href = `tel:${phoneNumber}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              <span className="font-semibold">Call Now: {phoneNumber}</span>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in-up-delay-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-300">450+</div>
              <div className="text-sm text-gray-300">Businesses Transformed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-300">66%</div>
              <div className="text-sm text-gray-300">Cost Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300">500%</div>
              <div className="text-sm text-gray-300">ROI Increase</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-300">40+</div>
              <div className="text-sm text-gray-300">Hours Saved Monthly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
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
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 1s ease-out 0.9s both;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 1s ease-out 1.2s both;
        }
      `}</style>
    </section>
  );
};

export default VSLHeroSection;

