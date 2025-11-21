import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { ArrowRight, Heart, BarChart3, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HealthcareVSLOptIn = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Heart className="mr-2 h-4 w-4" />
            Healthcare Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Healthcare Practice
            </h1>
            <p className="text-xl text-gray-600">
              See how healthcare practices are automating NHS billing while improving patient care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Finance Case Study</CardTitle>
                <CardDescription>
                  Watch how a medical practice reduced admin time by 70% while improving compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <span>NHS billing integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Patient revenue tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>CQC compliance automation</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Professional Email</Label>
                    <Input id="email" type="email" placeholder="your@practice.co.uk" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="practice">Practice Name</Label>
                    <Input id="practice" placeholder="Your healthcare practice" />
                  </div>
                </div>
                
                <Link to="/vsl/healthcare/video">
                  <Button className="w-full">
                    Watch Success Story
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
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>How to automate NHS payment reconciliation and tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Private patient billing automation for improved cash flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>CQC compliance reporting that saves hours of admin time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Multi-location practice financial consolidation</span>
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

export default HealthcareVSLOptIn;
