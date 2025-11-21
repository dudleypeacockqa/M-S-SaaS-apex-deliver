import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { ArrowRight, Cog, TrendingUp, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const ManufacturingVSLOptIn = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Settings className="mr-2 h-4 w-4" />
            Manufacturing Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="py-16 px-4 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionize Your Manufacturing Operations
            </h1>
            <p className="text-xl text-gray-600">
              See how smart manufacturers are increasing efficiency and reducing costs with AI-powered ERP
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Manufacturing Success Story</CardTitle>
                <CardDescription>
                  Watch how a UK manufacturer increased production efficiency by 40% while cutting operational costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Cog className="h-5 w-5 text-orange-600" />
                    <span>Production planning automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Real-time inventory tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Quality control dashboards</span>
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
                    <Input id="company" placeholder="Your manufacturing company" />
                  </div>
                </div>
                
                <Link to="/vsl/manufacturing/video">
                  <Button className="w-full">
                    Watch Success Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What You'll Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>How to reduce production downtime by 60% with predictive maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Real-time inventory optimization that cuts holding costs by 35%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Quality control automation that reduces defects by 80%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Supply chain integration for just-in-time production</span>
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

export default ManufacturingVSLOptIn;
