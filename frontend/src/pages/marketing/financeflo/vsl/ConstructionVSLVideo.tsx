import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Play, HardHat } from "lucide-react";
import { Link } from "react-router-dom";

const ConstructionVSLVideo = () => {
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
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Construction Finance Transformation
            </h1>
            <p className="text-lg text-gray-600">
              See how our client automated their financial processes
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-600">Construction Case Study Video</p>
                  <p className="text-sm text-gray-500">Duration: 10 minutes</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Finances?</h3>
                <p className="text-gray-600 mb-6">
                  Apply now to see if your construction business qualifies for our program
                </p>
                
                <Link to="/vsl/construction/application">
                  <Button size="lg" className="px-8">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">75% Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">in manual data entry</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">40% Faster Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">with automated dashboards</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">20% Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">through better budget control</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionVSLVideo;
