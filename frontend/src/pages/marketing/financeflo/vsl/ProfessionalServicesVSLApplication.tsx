import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalServicesVSLApplication = () => {
  return (
    <div className="min-h-screen">
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Services Application
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your firm to see if you qualify for our program
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Help us understand your service delivery model and growth goals
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
                <Input id="email" type="email" placeholder="john@services.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+44 20 1234 5678" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Professional Services Firm" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceType">Type of Services</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulting">Management Consulting</SelectItem>
                    <SelectItem value="accounting">Accounting Services</SelectItem>
                    <SelectItem value="legal">Legal Services</SelectItem>
                    <SelectItem value="marketing">Marketing Agency</SelectItem>
                    <SelectItem value="it">IT Services</SelectItem>
                    <SelectItem value="hr">HR Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10">5-10 people</SelectItem>
                    <SelectItem value="10-25">10-25 people</SelectItem>
                    <SelectItem value="25-50">25-50 people</SelectItem>
                    <SelectItem value="50+">50+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">Service Delivery Challenges</Label>
                <Textarea 
                  id="challenges" 
                  placeholder="Describe your main challenges in client management, project delivery, or scaling operations"
                  rows={4}
                />
              </div>
              
              <Link to="/vsl/professional-services/scheduling">
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

export default ProfessionalServicesVSLApplication;
