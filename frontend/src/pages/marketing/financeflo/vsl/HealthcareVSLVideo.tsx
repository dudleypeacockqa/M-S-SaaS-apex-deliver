import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Play, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const HealthcareVSLVideo = () => {
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
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Healthcare Finance Transformation
            </h1>
            <p className="text-lg text-gray-600">
              Watch how our client achieved remarkable results
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Video Player Placeholder</p>
                  <p className="text-sm text-gray-500">Duration: 15 minutes</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Practice?</h3>
                <p className="text-gray-600 mb-6">
                  Apply now to see if you qualify for our implementation program
                </p>
                
                <Link to="/vsl/healthcare/application">
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
                <CardTitle className="text-lg">70% Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">in billing errors and rejected claims</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">40% Increase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">in patient satisfaction scores</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">£200K+ Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">annually in operational costs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HealthcareVSLVideo;
