import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Building } from "lucide-react";
import { Link } from "react-router-dom";

const PrivateEquityVSLApplication = () => {
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Private Equity Application
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your firm to see if you qualify for our program
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              
              <div>
                <Label htmlFor="company">Firm Name</Label>
                <Input id="company" placeholder="Enter your PE firm name" />
              </div>
              
              <div>
                <Label htmlFor="aum">Assets Under Management</Label>
                <Input id="aum" placeholder="e.g. $100M - $500M" />
              </div>
              
              <div>
                <Label htmlFor="portfolio">Number of Portfolio Companies</Label>
                <Input id="portfolio" placeholder="e.g. 5-15 companies" />
              </div>
              
              <div>
                <Label htmlFor="challenges">Current Challenges</Label>
                <Textarea 
                  id="challenges" 
                  placeholder="Describe your main operational challenges"
                />
              </div>
              
              <Link to="/vsl/private-equity/scheduling">
                <Button className="w-full">
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivateEquityVSLApplication;
