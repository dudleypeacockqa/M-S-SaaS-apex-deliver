import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Play, TrendingUp, Target, Users, CheckCircle, ArrowRight, Clock, Shield } from "lucide-react";

const EcommerceVSLVideo = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Video Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* TrendFlo AI Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6 shadow-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              TrendFlo AI - Predictive Intelligence for E-commerce
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">'Crystal Ball' Technology</span>
              <br />
              That Predicts Your Next $1M Product Launch
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Watch this exclusive training to discover how 500+ e-commerce brands are using AI to identify winning products 
              <strong> 90 days before their competition</strong>
            </p>
          </div>
          
          {/* Video Player */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
                    {/* Audio Player for Testing */}
                    <audio 
                      controls 
                      className="absolute bottom-4 left-4 right-4 z-10"
                      preload="metadata"
                    >
                      <source src="https://storage.googleapis.com/msgsndr/f2hL1WCfLruukYmOIvhu/media/6862bf6315dcde153f3b5e79.mpeg" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    {/* Video Placeholder */}
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 inline-flex">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        The TrendFlo AI Crystal Ball Technology
                      </h3>
                      <p className="text-blue-200">
                        15 minutes • Predictive Intelligence Training
                      </p>
                      <p className="text-blue-300 text-sm mt-2">
                        🎧 Professional British voice preview - Click play below
                      </p>
                    </div>
                  </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span>2,847 views this week</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                <span>15 minutes</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Exclusive Content</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What You'll Discover In This Training
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The exact methodology that's helping e-commerce brands predict winning products with 94% accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "The Fatal Flaw in Traditional Product Research",
                description: "Why 87% of e-commerce brands fail to scale past $1M and the one thing successful brands do differently",
                time: "Minutes 0-3"
              },
              {
                title: "The Trend Prediction Algorithm Revealed",
                description: "How to identify winning products 90 days before they go viral using predictive data intelligence",
                time: "Minutes 3-7"
              },
              {
                title: "Real Case Studies & Results",
                description: "How Sarah went from $50K to $300K/month and Mike scaled from $75K to $500K/month in 4 months",
                time: "Minutes 7-12"
              },
              {
                title: "The 3-Step TrendFlo AI System",
                description: "Internal sales analysis, trend reporting, and influencer/ad channel optimization - all done-for-you",
                time: "Minutes 12-15"
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-2">{item.time}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Join 500+ Brands Already Using TrendFlo AI
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">247%</div>
              <div className="text-gray-600 font-medium">Average Revenue Increase</div>
              <div className="text-sm text-gray-500 mt-1">Within 90 days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">90</div>
              <div className="text-gray-600 font-medium">Days Ahead of Competition</div>
              <div className="text-sm text-gray-500 mt-1">Trend prediction accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2">94%</div>
              <div className="text-gray-600 font-medium">Product Success Rate</div>
              <div className="text-sm text-gray-500 mt-1">Vs. 13% industry average</div>
            </div>
          </div>
          
          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Sarah M.</div>
                    <div className="text-sm text-gray-600">Beauty Brand Owner</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "TrendFlo AI identified that 'clean beauty for sensitive skin' was about to explode. 
                  We launched 60 days before our competition and scaled from $50K to $300K per month."
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  Result: 500% revenue increase in 4 months
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Mike R.</div>
                    <div className="text-sm text-gray-600">Fitness Equipment</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Instead of home gyms, TrendFlo AI showed us 'portable workout equipment for travelers' 
                  was the real opportunity. We pivoted and went from $75K to $500K per month."
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  Result: 567% revenue increase in 4 months
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Get Your Unfair Advantage?
          </h2>
          
          <p className="text-xl text-blue-200 mb-12 leading-relaxed">
            If you want to see exactly how TrendFlo AI would work for your specific brand, 
            click below to apply for a complimentary strategy session.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              What You'll Get On Your Strategy Session:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "The exact trends about to explode in your niche",
                "Which of your current products have highest profit potential",
                "Specific influencers and ad channels for best ROI",
                "How TrendFlo AI integrates with your current systems"
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-blue-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 px-12 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/vsl/ecommerce/application'}
            >
              Apply Now - Get Your Strategy Session
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <div className="text-blue-300 space-y-2">
              <p className="text-sm">
                ⚡ Strategy sessions normally cost $2,500 - yours is complimentary
              </p>
              <p className="text-sm">
                🔒 Only 12 spots available this quarter
              </p>
              <p className="text-sm">
                ⏰ Your competition is already using data to get ahead
              </p>
            </div>
          </div>
        </div>
      </section>

      </div>
  );
};

export default EcommerceVSLVideo;
