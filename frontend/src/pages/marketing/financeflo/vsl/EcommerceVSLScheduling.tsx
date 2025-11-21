import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { TrendingUp, Calendar, CheckCircle, Clock, Users, Target, Zap, Shield } from "lucide-react";
import CalendarBooking from "@/components/marketing/financeflo/CalendarBooking";

const EcommerceVSLScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* TrendFlo AI Brand */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 shadow-lg">
            <TrendingUp className="mr-2 h-5 w-5" />
            TrendFlo AI - Strategy Session Booking
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Choose Your Preferred Time For Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Complimentary TrendFlo AI Strategy Session
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our team will prepare a custom analysis of your market and competition before the call
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>Normally $2,500 - Yours Free</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>30 Minutes</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
              <span>Custom Analysis Prepared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling Section */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Calendar - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    Select Your Preferred Time
                  </CardTitle>
                  <p className="text-blue-100 text-center">
                    All times are automatically adjusted to your timezone
                  </p>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CalendarBooking 
                    className="w-full" 
                    minHeight="650px"
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* What to Expect */}
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    What to Expect
                  </h3>
                  <div className="space-y-4 text-blue-100">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Custom Market Analysis</div>
                        <div className="text-xs">Trends specific to your niche and competition</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Product Opportunities</div>
                        <div className="text-xs">Specific products with highest profit potential</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Influencer Recommendations</div>
                        <div className="text-xs">Creators with predicted ROI for your products</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Integration Strategy</div>
                        <div className="text-xs">How TrendFlo AI works with your systems</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Preparation */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-orange-500" />
                    How to Prepare
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">1</div>
                      <span>Have your current product catalog ready</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">2</div>
                      <span>Know your monthly revenue and ad spend</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">3</div>
                      <span>Prepare questions about your specific challenges</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">4</div>
                      <span>Join from computer (not mobile) for screen sharing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Session Details */}
              <Card className="bg-green-50 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Session Details
                  </h3>
                  <div className="space-y-3 text-green-700">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Platform:</span>
                      <span className="text-sm">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Value:</span>
                      <span className="text-sm">$2,500 (Free for you)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Preparation:</span>
                      <span className="text-sm">Custom analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Urgency */}
              <Card className="bg-orange-50 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">
                    ⏰ Limited Spots Available
                  </h3>
                  <p className="text-orange-700 text-sm mb-3">
                    Only 7 strategy sessions remaining this quarter.
                  </p>
                  <div className="bg-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-800 font-medium">This Week</div>
                    <div className="text-lg font-bold text-orange-800">3 spots left</div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Proof */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Recent Results
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Sarah M. - Beauty Brand</div>
                      <div className="text-xs text-gray-600">$50K → $300K/month in 4 months</div>
                    </div>
                    <div className="border-l-4 border-l-purple-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Mike R. - Fitness Equipment</div>
                      <div className="text-xs text-gray-600">$75K → $500K/month in 4 months</div>
                    </div>
                    <div className="border-l-4 border-l-indigo-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Jennifer L. - Fashion</div>
                      <div className="text-xs text-gray-600">ROAS: 2.1x → 7.8x</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </section>

      </div>
  );
};

export default EcommerceVSLScheduling;

