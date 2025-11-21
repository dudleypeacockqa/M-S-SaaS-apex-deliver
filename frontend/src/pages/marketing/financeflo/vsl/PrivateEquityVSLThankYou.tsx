import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { CheckCircle, Calendar, Mail, Phone, Building } from "lucide-react";

const PrivateEquityVSLThankYou = () => {
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
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600">
              Your strategy call has been scheduled successfully. We're excited to help transform your PE operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Strategy Session</h3>
                    <p className="text-blue-800 text-sm">Date: Tomorrow at 2:00 PM EST</p>
                    <p className="text-blue-800 text-sm">Duration: 30 minutes</p>
                    <p className="text-blue-800 text-sm">Location: Video Conference</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">What's Next:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Calendar invite will be sent within 5 minutes</li>
                      <li>• Meeting link will be included in the invite</li>
                      <li>• Our PE specialist will call you at the scheduled time</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need to Make Changes?</CardTitle>
                <CardDescription>
                  Contact us if you need to reschedule or have questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    hello@financeflo.ai
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    +1 (555) 123-4567
                  </Button>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Prepare for Your Call</h4>
                    <p className="text-sm text-gray-600">
                      Think about your current operational challenges and growth goals. 
                      We'll discuss how our platform can help transform your PE operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">While You Wait</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline">
                    Download PE Industry Guide
                  </Button>
                  <Button variant="outline">
                    Join Our Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PrivateEquityVSLThankYou;
