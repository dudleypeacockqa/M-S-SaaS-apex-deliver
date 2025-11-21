
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-flo-navy via-brand-navy-light to-brand-navy-dark">
      {/* Background Effects - Crystal Water Metaphor */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232BB673' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-flo-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-flo-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-flo-green/10 border border-flo-green/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-flo-green rounded-full animate-pulse"></div>
                <span className="text-flo-green font-semibold text-sm tracking-wide">
                  🏆 TRUSTED BY 500+ UK ENTERPRISES
                </span>
              </div>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-white leading-tight">
                <span className="block">Transform Your</span>
                <span className="block bg-gradient-to-r from-flo-green via-brand-green-light to-flo-green bg-clip-text text-transparent">
                  Finance Operations
                </span>
                <span className="block">With AI</span>
              </h1>

              <p className="text-xl lg:text-2xl font-body text-white/80 leading-relaxed max-w-2xl">
                Eliminate 80% of manual work, achieve 99.9% accuracy, and unlock
                <span className="text-flo-green font-semibold"> real-time financial insights</span> that
                drive exponential business growth.
              </p>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-flo-green to-brand-green-light hover:from-brand-green-light hover:to-flo-green text-white font-heading font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-brand-ai transition-all duration-300 hover:scale-105"
              >
                Start Free 30-Day Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-heading text-lg px-12 py-4 rounded-full transition-all duration-300 hover:border-flo-green hover:text-flo-green"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch 2-Min Demo
              </Button>
            </div>
            
            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-heading font-bold text-flo-green">80%</div>
                <div className="text-white/70 text-sm font-body font-medium tracking-wide">WORK ELIMINATED</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-heading font-bold text-flo-green">300%</div>
                <div className="text-white/70 text-sm font-body font-medium tracking-wide">ROI INCREASE</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-heading font-bold text-flo-green">30</div>
                <div className="text-white/70 text-sm font-body font-medium tracking-wide">DAY SETUP</div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-8">
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>24/7 UK Support</span>
              </div>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Dashboard Image */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                  alt="FinanceFlo.ai AI-powered finance dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  Live Processing
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-xs text-gray-600 font-medium">Monthly Savings</div>
                  <div className="text-lg font-bold text-green-600">£127,450</div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4 animate-bounce">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-800">99.9% Accuracy</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-brand-gold to-brand-gold-light text-white rounded-xl shadow-xl p-4 animate-pulse">
                <div className="text-xs font-medium opacity-90">Processing Speed</div>
                <div className="text-lg font-bold">10,000+ docs/hr</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
