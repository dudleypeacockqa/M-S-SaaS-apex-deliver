import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Play, Phone, Calendar, Award, Users, TrendingUp, Clock } from "lucide-react";

export const SageX3VSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="text-white space-y-8">
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Award className="w-4 h-4 mr-2" />
                Certified Sage Partner
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Users className="w-4 h-4 mr-2" />
                450+ Implementations
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                40% Productivity Boost
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Manufacturing Excellence
                </span>
                with Sage X3
              </h1>
              
              <p className="text-xl lg:text-2xl text-purple-100 leading-relaxed max-w-2xl">
                The UK's most trusted Sage X3 implementation specialists. From production chaos to manufacturing mastery in 60 days with our proven methodology.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 my-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-purple-100">End-to-end production control</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-purple-100">Real-time supply chain visibility</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-purple-100">Advanced quality management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-purple-100">Multi-site collaboration</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Manufacturing Assessment
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call: +44 7360 539147
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-purple-100">
                <div className="font-semibold">Join 450+ Manufacturers</div>
                <div className="text-sm opacity-80">Transforming Operations with Sage X3</div>
              </div>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative">
            <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              {/* Video Container */}
              <div className="aspect-video relative">
                <video 
                  className="w-full h-full object-cover"
                  poster="/api/placeholder/800/450"
                  controls
                  preload="metadata"
                >
                  <source src="/videos/sage_x3_vsl_final.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors duration-300 cursor-pointer group">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6 bg-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg">Sage X3 Manufacturing Transformation</h3>
                    <p className="text-purple-200 text-sm">See how we revolutionize production operations</p>
                  </div>
                  <div className="flex items-center text-purple-200">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">3:45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">60</div>
                <div className="text-sm text-gray-600">Days to Go-Live</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">40%</div>
                <div className="text-sm text-gray-600">Productivity Increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

