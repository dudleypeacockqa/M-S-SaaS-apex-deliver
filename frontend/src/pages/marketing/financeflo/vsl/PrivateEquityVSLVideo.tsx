import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Play, Building } from "lucide-react";
import { Link } from "react-router-dom";

const PrivateEquityVSLVideo = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Building className="mr-2 h-4 w-4" />
            Private Equity Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Private Equity Success Transformation
            </h1>
            <p className="text-lg text-gray-600">
              Learn how our client achieved remarkable portfolio growth
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Private Equity Case Study</p>
                  <p className="text-sm text-gray-500">Duration: 16 minutes</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Portfolio?</h3>
                <p className="text-gray-600 mb-6">
                  Apply now to see if your PE firm qualifies for our program
                </p>
                
                <Link to="/vsl/private-equity/application">
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
                <CardTitle className="text-lg">300% Portfolio Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">across 12 portfolio companies in 18 months</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">50% Faster Due Diligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">through automated data analysis</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">85% Cost Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">in portfolio reporting and management</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PrivateEquityVSLVideo;
