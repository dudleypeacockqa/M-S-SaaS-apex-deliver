import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { CheckCircle, Calendar, Mail, Phone, Heart } from "lucide-react";

const HealthcareVSLThankYou = () => {
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
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Strategy Session Scheduled!
            </h1>
            <p className="text-xl text-gray-600">
              We're excited to help optimize your healthcare operations while maintaining full compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Session Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Healthcare Optimization Strategy Session</h3>
                    <p className="text-blue-800 text-sm">Date: Tomorrow at 9:00 AM GMT</p>
                    <p className="text-blue-800 text-sm">Duration: 75 minutes</p>
                    <p className="text-blue-800 text-sm">Location: Secure Video Conference</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">What's Next:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Secure calendar invite sent to your email</li>
                      <li>• HIPAA-compliant meeting link included</li>
                      <li>• Healthcare optimization guide attached</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Support?</CardTitle>
                <CardDescription>
                  Contact our healthcare specialists anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    healthcare@financeflo.ai
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    +44 20 1234 5680
                  </Button>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Prepare for Success</h4>
                    <p className="text-sm text-gray-600">
                      Review your current patient billing processes, compliance challenges, and operational bottlenecks. 
                      Our team will help you create a roadmap to healthcare finance excellence while ensuring full regulatory compliance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HealthcareVSLThankYou;
