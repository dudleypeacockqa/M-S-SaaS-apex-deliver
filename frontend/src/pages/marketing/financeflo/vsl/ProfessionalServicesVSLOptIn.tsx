
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { ArrowRight, Users, Clock, TrendingUp, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalServicesVSLOptIn = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Briefcase className="mr-2 h-4 w-4" />
            Professional Services Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Scale Your Professional Services Firm
            </h1>
            <p className="text-xl text-gray-600">
              Learn how top professional services firms are increasing client capacity and profitability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Professional Services Case Study</CardTitle>
                <CardDescription>
                  See how a consulting firm doubled their client capacity while improving service quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Client relationship management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Project time tracking automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Revenue optimization dashboards</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" type="email" placeholder="your@company.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Your professional services firm" />
                  </div>
                </div>
                
                <Link to="/vsl/professional-services/video">
                  <Button className="w-full">
                    Watch Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>How to automate project management and increase billable hours by 30%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Client onboarding automation that reduces admin time by 50%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Real-time profitability tracking for better decision making</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Scalable systems that grow with your business</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProfessionalServicesVSLOptIn;
