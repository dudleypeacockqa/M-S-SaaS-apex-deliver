
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { ArrowRight, HardHat, BarChart3, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const ConstructionVSLOptIn = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <HardHat className="mr-2 h-4 w-4" />
            Construction Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="relative py-16 px-4 min-h-screen overflow-hidden">
        {/* Background Image instead of Video */}
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=5530&auto=format&fit=crop')`
            }}
          />
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-orange-800/70 to-red-900/80"></div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Transform Your Construction Operations
            </h1>
            <p className="text-xl text-orange-100">
              See how leading construction companies are automating finance while reducing costs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Construction Finance Case Study</CardTitle>
                <CardDescription>
                  Watch how a construction firm reduced admin time by 75% while improving project margins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <HardHat className="h-5 w-5 text-orange-600" />
                    <span>Project cost tracking automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Real-time profitability dashboards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>CIS compliance automation</span>
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
                    <Input id="company" placeholder="Your construction company" />
                  </div>
                </div>
                
                <Link to="/vsl/construction/video">
                  <Button className="w-full">
                    Watch Success Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>What You'll Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>How to automate CIS deductions and monthly returns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Project cost tracking that prevents budget overruns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Cash flow management for better project financing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>Subcontractor payment automation and compliance</span>
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

export default ConstructionVSLOptIn;
