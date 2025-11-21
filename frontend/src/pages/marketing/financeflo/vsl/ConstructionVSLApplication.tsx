
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { ArrowRight, HardHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/marketing/financeflo/ui/badge";

const ConstructionVSLApplication = () => {
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Construction Implementation Application
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your construction business to get started
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Help us understand your construction operations and challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Smith" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" placeholder="john@construction.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+44 20 1234 5678" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Construction Company" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constructionType">Construction Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential Construction</SelectItem>
                    <SelectItem value="commercial">Commercial Construction</SelectItem>
                    <SelectItem value="industrial">Industrial Construction</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="renovation">Renovation & Refurbishment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500k-2m">£500K - £2M</SelectItem>
                    <SelectItem value="2m-5m">£2M - £5M</SelectItem>
                    <SelectItem value="5m-10m">£5M - £10M</SelectItem>
                    <SelectItem value="10m+">£10M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">Main Business Challenges</Label>
                <Textarea 
                  id="challenges" 
                  placeholder="Describe your main challenges in project management, cost control, resource allocation, or compliance"
                  rows={4}
                />
              </div>
              
              <Link to="/vsl/construction/scheduling">
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

export default ConstructionVSLApplication;
