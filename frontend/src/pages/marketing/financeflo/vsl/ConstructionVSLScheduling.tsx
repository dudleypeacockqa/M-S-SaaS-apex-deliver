import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Calendar, CheckCircle, HardHat, Clock, Target } from "lucide-react";
import CalendarBooking from "@/components/marketing/financeflo/CalendarBooking";

const ConstructionVSLScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <HardHat className="mr-2 h-4 w-4" />
            Construction Industry ERP Optimization
          </Badge>
        </div>
      </div>
      
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Application Approved!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Schedule your construction ERP optimization consultation
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Our team will prepare a custom analysis of your construction workflows and provide a tailored implementation roadmap
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Booking - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    Select Your Preferred Time
                  </CardTitle>
                  <CardDescription className="text-orange-100 text-center text-lg">
                    All times are automatically adjusted to your timezone
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CalendarBooking 
                    className="w-full" 
                    minHeight="650px"
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* What We'll Cover */}
              <Card className="bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    What We'll Cover
                  </h3>
                  <div className="space-y-4 text-orange-100">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Project Management Analysis</div>
                        <div className="text-xs">Workflow efficiency and bottleneck identification</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Custom Implementation Roadmap</div>
                        <div className="text-xs">Tailored strategy for your construction business</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">ROI Projections</div>
                        <div className="text-xs">Expected returns and cost savings analysis</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">System Integration Strategy</div>
                        <div className="text-xs">Connect with existing construction software</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Process */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Implementation Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold text-sm">Project Analysis</h4>
                        <p className="text-xs text-gray-600">Assess current workflows and identify optimization opportunities</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold text-sm">System Integration</h4>
                        <p className="text-xs text-gray-600">Connect with existing construction management software</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold text-sm">Training & Go-Live</h4>
                        <p className="text-xs text-gray-600">Team training and system deployment with minimal disruption</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm">Implementation Timeline</h4>
                    <p className="text-xs text-green-700">4-6 weeks to full project optimization</p>
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
                      <span className="text-sm">45 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Platform:</span>
                      <span className="text-sm">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Value:</span>
                      <span className="text-sm">$3,500 (Free for you)</span>
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
                    Only 5 construction optimization sessions remaining this quarter.
                  </p>
                  <div className="bg-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-800 font-medium">This Week</div>
                    <div className="text-lg font-bold text-orange-800">2 spots left</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionVSLScheduling;

