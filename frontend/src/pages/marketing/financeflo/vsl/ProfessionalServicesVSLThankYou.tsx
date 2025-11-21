import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react";

const ProfessionalServicesVSLThankYou = () => {
  return (
    <div className="min-h-screen">
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              We're Ready to Scale Your Firm!
            </h1>
            <p className="text-xl text-gray-600">
              Your consultation is confirmed. Get ready to transform your professional services delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Consultation Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Service Optimization Session</h3>
                    <p className="text-purple-800 text-sm">Date: Tomorrow at 10:00 AM GMT</p>
                    <p className="text-purple-800 text-sm">Duration: 45 minutes</p>
                    <p className="text-purple-800 text-sm">Location: Video Conference</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Next Steps:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Meeting invite sent to your inbox</li>
                      <li>• Pre-consultation assessment attached</li>
                      <li>• Service optimization checklist included</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Questions Before We Meet?</CardTitle>
                <CardDescription>
                  Our professional services team is here to help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    services@financeflo.ai
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    +44 20 1234 5680
                  </Button>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Get the Most from Your Session</h4>
                    <p className="text-sm text-gray-600">
                      Come prepared with your current client capacity, service delivery challenges, 
                      and growth targets. We'll show you exactly how to scale efficiently.
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

export default ProfessionalServicesVSLThankYou;
