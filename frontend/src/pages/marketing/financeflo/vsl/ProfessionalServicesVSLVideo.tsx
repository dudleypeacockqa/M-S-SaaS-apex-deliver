import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Play, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalServicesVSLVideo = () => {
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
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Services Success Story
            </h1>
            <p className="text-lg text-gray-600">
              Discover how our client transformed their service delivery
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Professional Services Case Study</p>
                  <p className="text-sm text-gray-500">Duration: 18 minutes</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Scale Your Services?</h3>
                <p className="text-gray-600 mb-6">
                  Apply to see if your firm qualifies for our implementation program
                </p>
                
                <Link to="/vsl/professional-services/application">
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
                <CardTitle className="text-lg">2x Client Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">without hiring additional staff</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">30% More Billable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">hours through automation</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">£300K+ Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">increase in first year</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProfessionalServicesVSLVideo;
