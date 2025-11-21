import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { EnhancedVSLPlayer } from "@/components/marketing/financeflo/EnhancedVSLPlayer";
import { Play, Pause, Volume2, VolumeX, Award, ArrowRight } from "lucide-react";

export const SageIntacctVSLHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Video Background with Enhanced VSL Player */}
      <div className="absolute inset-0 z-0">
        <EnhancedVSLPlayer
          videoSrc="/videos/sage_intacct_vsl.mp4"
          audioSrc="/sage_intacct_vsl_audio.wav"
          title="Sage Intacct Transformation"
          className="w-full h-full opacity-20"
          autoplay={false}
          showControls={true}
          controlsPosition="bottom-right"
          showTitle={false}
          showProgress={true}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
            <Award className="w-4 h-4 mr-2" />
            Sage Intacct AI Integration
          </Badge>
          
          {/* Sage Intacct Logo */}
          <div className="mb-6">
            <img 
              src="/SageIntacctlogo.png" 
              alt="Sage Intacct" 
              className="h-16 mx-auto"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Future of <span className="text-green-600">Finance</span> Starts Right Now
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto font-medium">
            Transform your financial operations with Sage Intacct's AI-powered platform. 
            Cut your monthly close by 66% and boost productivity by 65% with proven automation.
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-green-600 mb-2">66%</div>
            <div className="text-gray-700 font-medium">Faster Monthly Close</div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-green-600 mb-2">65%</div>
            <div className="text-gray-700 font-medium">Productivity Boost</div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-green-600 mb-2">450+</div>
            <div className="text-gray-700 font-medium">Businesses Trust Sage Intacct</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Your Free Sage Intacct Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Call now:</span> +44 7360 539147 • Free consultation with former CFOs
            </div>
            
            <div className="inline-flex items-center space-x-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">Limited implementation slots available this quarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
};

