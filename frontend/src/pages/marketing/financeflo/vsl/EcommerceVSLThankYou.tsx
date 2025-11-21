import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { CheckCircle, Calendar, Play, TrendingUp, Clock, Users, Target, Zap, ArrowRight, Shield } from "lucide-react";

const EcommerceVSLThankYou = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* TrendFlo AI Brand */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white mb-8 shadow-lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            TrendFlo AI - Strategy Session Confirmed
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            🎉 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Congratulations!</span>
            <br />
            Your Strategy Session is Confirmed
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            I'm excited to show you how TrendFlo AI can transform your business and help you predict your next winning products.
          </p>
        </div>
      </section>

      {/* Thank You Video */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Important: Please Watch This 2-Minute Message
                </h2>
                <p className="text-gray-600">
                  Critical information about your upcoming strategy session
                </p>
              </div>
              
              {/* Video Player */}
              <div className="relative mb-8">
                <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
                    {/* Audio Player for Testing */}
                    <audio 
                      controls 
                      className="absolute bottom-4 left-4 right-4 z-10"
                      preload="metadata"
                    >
                      <source src="https://storage.googleapis.com/msgsndr/f2hL1WCfLruukYmOIvhu/media/6862bf63ca3996742de9c860.mpeg" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    {/* Video Placeholder */}
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 inline-flex">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        Thank You & Preparation Instructions
                      </h3>
                      <p className="text-blue-200">
                        2 minutes • Important Session Details
                      </p>
                      <p className="text-blue-300 text-sm mt-2">
                        🎧 Professional British voice preview - Click play below
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Instructions */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column - Instructions */}
            <div className="space-y-6">
              
              {/* Calendar Confirmation */}
              <Card className="bg-orange-50 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    1. Confirm Your Calendar
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Because of recent calendar updates, your appointment might not automatically appear in your calendar.
                  </p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 mb-4"
                    onClick={() => {/* Add calendar integration */}}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Add to My Calendar
                  </Button>
                  <p className="text-orange-600 text-sm">
                    Also check your email for a calendar invitation from an unknown sender - click 'I know this sender' and confirm.
                  </p>
                </CardContent>
              </Card>
              
              {/* Technical Requirements */}
              <Card className="bg-blue-50 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <Target className="mr-3 h-6 w-6" />
                    2. Technical Requirements
                  </h3>
                  <div className="space-y-3 text-blue-700">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Join from your computer or laptop (not your phone)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>We'll be sharing detailed analytics and trend data</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Small screens won't show everything clearly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Preparation Checklist */}
              <Card className="bg-green-50 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <Zap className="mr-3 h-6 w-6" />
                    3. Come Prepared With
                  </h3>
                  <div className="space-y-3 text-green-700">
                    <div className="flex items-start">
                      <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">1</div>
                      <span>Your current product catalog</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">2</div>
                      <span>Your monthly revenue and ad spend numbers</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">3</div>
                      <span>Your biggest challenges with product launches</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">4</div>
                      <span>Questions about your specific market</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </div>
            
            {/* Right Column - Blueprint */}
            <div>
              <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <Play className="mr-3 h-6 w-6" />
                    Watch The TrendFlo AI Blueprint
                  </h3>
                  <p className="text-purple-100 mb-6">
                    Before our call, watch this exclusive presentation - the same one I gave at a $30,000 mastermind 
                    for 7 and 8-figure e-commerce brands.
                  </p>
                  
                  {/* Blueprint Video Thumbnail */}
                  <div className="relative mb-6">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 text-center">
                      <div className="bg-white/20 rounded-full p-4 inline-flex mb-4">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-lg font-bold">The TrendFlo AI Blueprint</div>
                      <div className="text-purple-200 text-sm">25 minutes • Exclusive Methodology</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-purple-100 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-3 text-green-300" />
                      <span className="text-sm">The 3-component TrendFlo AI system</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-3 text-green-300" />
                      <span className="text-sm">How to predict trends 90 days early</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-3 text-green-300" />
                      <span className="text-sm">Real case study: $50K to $300K/month</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-3 text-green-300" />
                      <span className="text-sm">Implementation strategies</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3"
                    onClick={() => window.location.href = '/vsl/ecommerce/blueprint'}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch The Blueprint Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <p className="text-purple-200 text-xs text-center mt-3">
                    This will help you get the most from our strategy session
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What to Expect on Your Strategy Session
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I've personally reviewed your application and I'm excited to show you the specific opportunities 
              we've identified in your niche.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Custom Market Analysis",
                description: "Trends specific to your niche and competition analysis"
              },
              {
                icon: TrendingUp,
                title: "Product Opportunities",
                description: "Specific products with highest profit potential in your market"
              },
              {
                icon: Users,
                title: "Influencer Recommendations",
                description: "Creators with predicted ROI for your specific products"
              },
              {
                icon: Zap,
                title: "Integration Strategy",
                description: "How TrendFlo AI works with your current business systems"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help or Have Questions?
              </h3>
              <p className="text-gray-600 mb-6">
                If you need to reschedule or have any questions about your upcoming strategy session, 
                our support team is here to help.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-medium text-gray-900">Email Support</div>
                  <div className="text-blue-600">support@trendflo.ai</div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-medium text-gray-900">Response Time</div>
                  <div className="text-purple-600">Within 2 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      </div>
  );
};

export default EcommerceVSLThankYou;
