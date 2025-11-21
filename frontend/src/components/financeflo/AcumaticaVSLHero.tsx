import React from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { EnhancedButton } from "./ui/enhanced-button";
import { Phone, Calendar, ArrowRight, Cloud, Users, Award, TrendingUp } from "lucide-react";

export const AcumaticaVSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-muted via-muted/50 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* VSL Video Player */}
      <EnhancedVSLPlayer
        videoSrc="/enhanced_acumatica_vsl_video.mp4"
        audioSrc="/enhanced_acumatica_vsl_audio.wav"
        posterImage="/acumatica_logo.png"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        controlsPosition="bottom-right"
        showControls={true}
        showProgress={true}
        autoplay={false}
        title="Acumatica - Unlimited Growth"
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Acumatica Logo */}
            <div className="mb-8">
              <img 
                src="/acumatica_logo.png" 
                alt="Acumatica - The Cloud ERP" 
                className="h-16 mb-4"
              />
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Nucleus Research 2025 SMB ERP Leader</span>
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Unlimited Growth
              <span className="block text-primary">Without Penalties</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-600 mt-4">
                The World's Fastest-Growing Cloud ERP for 10 Years Running
              </span>
            </h1>
            
            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
                <div className="flex items-center mb-3">
                  <Users className="w-8 h-8 text-primary mr-3" />
                  <div className="text-2xl font-bold text-primary">∞</div>
                </div>
                <div className="text-gray-700 font-medium">Unlimited Users</div>
                <div className="text-sm text-gray-600">No per-user penalties</div>
              </div>
              <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
                <div className="flex items-center mb-3">
                  <Cloud className="w-8 h-8 text-primary mr-3" />
                  <div className="text-2xl font-bold text-primary">#1</div>
                </div>
                <div className="text-gray-700 font-medium">Customer Satisfaction</div>
                <div className="text-sm text-gray-600">Highest in industry</div>
              </div>
              <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-8 h-8 text-primary mr-3" />
                  <div className="text-2xl font-bold text-primary">10</div>
                </div>
                <div className="text-gray-700 font-medium">Years Growth</div>
                <div className="text-sm text-gray-600">Fastest-growing Cloud ERP</div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-xl border border-border">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Smart Businesses Choose Acumatica Over Restrictive Alternatives
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span><strong>Born in the Cloud:</strong> True cloud-native, not retrofitted legacy systems</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span><strong>Unlimited User Licensing:</strong> Scale your team without per-user penalties</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span><strong>Mobile-First Design:</strong> Full ERP functionality on any device, anywhere</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span><strong>Award-Winning Platform:</strong> Highest customer satisfaction in the industry</span>
                </li>
              </ul>
            </div>
            
            {/* Social Proof Banner */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Nucleus Research 2025 Recognition</h3>
                  <p className="text-white/80">Leader in SMB ERP Technology Value Matrix for 3rd consecutive year</p>
                </div>
                <Award className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton 
                size="lg" 
                variant="cta"
                className="min-w-[280px]"
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
                Schedule Free Cloud Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </EnhancedButton>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Unlimited Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Cloud-Native Platform</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Award-Winning Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Predictable Pricing</span>
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

