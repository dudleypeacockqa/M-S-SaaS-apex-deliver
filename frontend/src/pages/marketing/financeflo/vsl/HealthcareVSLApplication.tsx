
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const HealthcareVSLApplication = () => {
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Healthcare Implementation Application
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your healthcare organization to get started
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Help us understand your healthcare operations and compliance needs
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
                <Input id="email" type="email" placeholder="john@healthcare.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+44 20 1234 5678" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name</Label>
                <Input id="organization" placeholder="Your Healthcare Organization" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Private Clinic</SelectItem>
                    <SelectItem value="gp-practice">GP Practice</SelectItem>
                    <SelectItem value="care-home">Care Home</SelectItem>
                    <SelectItem value="nhs-trust">NHS Trust</SelectItem>
                    <SelectItem value="dental">Dental Practice</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Organization Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50 staff)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 staff)</SelectItem>
                    <SelectItem value="large">Large (201-500 staff)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (500+ staff)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">Main Operational Challenges</Label>
                <Textarea 
                  id="challenges" 
                  placeholder="Describe your main challenges in patient billing, compliance, revenue cycle management, or operational efficiency"
                  rows={4}
                />
              </div>
              
              <Link to="/vsl/healthcare/scheduling">
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

export default HealthcareVSLApplication;
