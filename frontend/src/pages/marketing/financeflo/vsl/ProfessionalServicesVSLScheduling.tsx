import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Calendar, Clock, CheckCircle, Users, Target, Shield, Briefcase } from "lucide-react";
import CalendarBooking from "@/components/marketing/financeflo/CalendarBooking";

const ProfessionalServicesVSLScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Briefcase className="mr-2 h-4 w-4" />
            Professional Services ERP Optimization
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
              Schedule your professional services optimization consultation
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Our team will prepare a custom analysis of your service delivery workflows and client management processes
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Booking - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                    <Calendar className="mr-3 h-6 w-6" />
                    Select Your Preferred Time
                  </CardTitle>
                  <CardDescription className="text-emerald-100 text-center text-lg">
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
              <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    What We'll Cover
                  </h3>
                  <div className="space-y-4 text-emerald-100">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Client Relationship Management</div>
                        <div className="text-xs">Enhanced client experience and retention</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Project Management Integration</div>
                        <div className="text-xs">Streamlined project delivery and tracking</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Time & Billing Optimization</div>
                        <div className="text-xs">Accurate time tracking and automated billing</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">Resource Utilization</div>
                        <div className="text-xs">Maximize team productivity and profitability</div>
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
                      <span className="text-sm">$3,500 (Free for you)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Preparation:</span>
                      <span className="text-sm">Custom analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Services Benefits */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-emerald-600" />
                    Service Benefits
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Automated time tracking</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Integrated project management</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Client portal access</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600 font-bold text-xs mr-3 mt-0.5 flex-shrink-0">✓</div>
                      <span>Performance analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-emerald-600" />
                    Service Success
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-emerald-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Law Firm</div>
                      <div className="text-xs text-gray-600">45% increase in billable hour capture</div>
                    </div>
                    <div className="border-l-4 border-l-teal-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Consulting Firm</div>
                      <div className="text-xs text-gray-600">60% faster project delivery</div>
                    </div>
                    <div className="border-l-4 border-l-cyan-500 pl-4">
                      <div className="text-sm font-medium text-gray-900">Accounting Practice</div>
                      <div className="text-xs text-gray-600">90% client satisfaction rate</div>
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

export default ProfessionalServicesVSLScheduling;

