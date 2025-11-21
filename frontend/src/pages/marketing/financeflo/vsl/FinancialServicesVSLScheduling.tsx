import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Calendar, Clock, CheckCircle, Briefcase, Target, Shield, Users } from "lucide-react";
import CalendarBooking from "@/components/marketing/financeflo/CalendarBooking";

const FinancialServicesVSLScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Briefcase className="mr-2 h-4 w-4" />
            Financial Services ERP Optimization
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
              Schedule your financial services ERP strategy session
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Our team will prepare a custom analysis of your financial workflows and regulatory compliance requirements
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Booking - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    Select Your Preferred Time
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-center text-lg">
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
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    What We'll Cover
                  </h3>
                  <div className="space-y-4 text-blue-100">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Regulatory Compliance Analysis</div>
                        <div className="text-xs">Ensure adherence to financial regulations</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Risk Management Strategy</div>
                        <div className="text-xs">Comprehensive risk assessment and mitigation</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Client Portal Integration</div>
                        <div className="text-xs">Seamless client experience and reporting</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">ROI & Efficiency Gains</div>
                        <div className="text-xs">Projected returns and operational improvements</div>
                      </div>
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
                      <span className="text-sm">45 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Platform:</span>
                      <span className="text-sm">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Value:</span>
                      <span className="text-sm">$4,500 (Free for you)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Preparation:</span>
                      <span className="text-sm">Custom analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Benefits */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-600" />
                    Compliance Benefits
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Automated regulatory reporting</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Real-time compliance monitoring</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Audit trail management</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Risk assessment automation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Client Success
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Regional Bank</div>
                      <div className="text-xs text-gray-600">40% reduction in compliance costs</div>
                    </div>
                    <div className="border-l-4 border-l-indigo-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Investment Firm</div>
                      <div className="text-xs text-gray-600">60% faster regulatory reporting</div>
                    </div>
                    <div className="border-l-4 border-l-purple-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Credit Union</div>
                      <div className="text-xs text-gray-600">99.9% audit compliance rate</div>
                    </div>
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

export default FinancialServicesVSLScheduling;

