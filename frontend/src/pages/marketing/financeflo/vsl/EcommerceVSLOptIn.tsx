
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { TrendingUp, Target, Zap, BarChart3, CheckCircle, Users, Clock, Shield, Play } from "lucide-react";

const EcommerceVSLOptIn = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image instead of Video */}
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=4076&auto=format&fit=crop')`
            }}
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* TrendFlo AI Brand Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 shadow-lg">
            <TrendingUp className="mr-2 h-5 w-5" />
            TrendFlo AI - Powered by FinanceFlo.ai
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            The Secret <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">'Crystal Ball'</span> Technology
            <br />
            <span className="text-3xl lg:text-5xl text-blue-200">
              That's Helping E-commerce Brands Predict Their Next $1M Product Launch
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover how 500+ e-commerce brands are using AI to identify winning products 
            <strong className="text-white"> 90 days before their competition</strong>... 
            and how you can get the same unfair advantage starting today
          </p>
          
          {/* Audio Preview Section */}
          <div className="mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-flex mb-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Preview: The TrendFlo AI Crystal Ball Technology
                  </h3>
                  <p className="text-blue-200 mb-4">
                    15 minutes • Predictive Intelligence Training Preview
                  </p>
                  <p className="text-blue-300 text-sm mb-6">
                    🎧 Professional British voice preview - Listen before watching the full training
                  </p>
                </div>
                
                <audio 
                  controls 
                  className="w-full mb-4"
                  preload="metadata"
                >
                  <source src="https://storage.googleapis.com/msgsndr/f2hL1WCfLruukYmOIvhu/media/6862bf6315dcde153f3b5e79.mpeg" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                
                <p className="text-blue-200 text-sm text-center">
                  ⚡ This is a preview of the full training you'll access below
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main CTA */}
          <div className="mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 px-12 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/vsl/ecommerce/video'}
            >
              <Zap className="mr-3 h-6 w-6" />
              Watch The Free Training Now
            </Button>
            <p className="text-blue-200 mt-4 text-sm">
              ⚡ Free Training • No Credit Card Required • 500+ Brands Already Using This
            </p>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You'll Discover In This <span className="text-blue-600">Free Training</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The exact methodology that's helping e-commerce brands predict winning products with 94% accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Why 87% of E-commerce Brands Fail to Scale Past $1M",
                description: "And the one thing successful brands do differently that gives them an unfair advantage"
              },
              {
                icon: TrendingUp,
                title: "The 'Trend Prediction Algorithm'",
                description: "That identifies winning products before they go viral - giving you a 90-day head start"
              },
              {
                icon: Zap,
                title: "Eliminate Guesswork Forever",
                description: "From your product launches and influencer partnerships using predictive data intelligence"
              },
              {
                icon: BarChart3,
                title: "The 3-Step System",
                description: "That automatically analyzes your competition and finds their blind spots and opportunities"
              },
              {
                icon: Shield,
                title: "Why Traditional Market Research is Dead",
                description: "And what's replacing it to give modern e-commerce brands the competitive edge"
              },
              {
                icon: Users,
                title: "Real Case Studies",
                description: "How brands went from $50K to $500K per month using predictive intelligence technology"
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Join 500+ E-commerce Brands Already Using This Technology
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">247%</div>
                <div className="text-gray-600">Average Revenue Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">90 Days</div>
                <div className="text-gray-600">Trend Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">94%</div>
                <div className="text-gray-600">Product Success Rate</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <span>15-Minute Training</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-500 mr-2" />
                <span>100% Free Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Predict Your Next Winning Product?
          </h2>
          <p className="text-xl text-blue-200 mb-12 leading-relaxed">
            Stop guessing. Start predicting. Get the same crystal ball technology 
            that's helping 500+ brands dominate their markets.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 px-12 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = '/vsl/ecommerce/video'}
          >
            <Zap className="mr-3 h-6 w-6" />
            Watch The Free Training Now
          </Button>
          
          <p className="text-blue-300 mt-6 text-sm">
            ⚡ Your competition is already using data to get ahead. Join them or get left behind.
          </p>
        </div>
      </section>

      </div>
  );
};

export default EcommerceVSLOptIn;
