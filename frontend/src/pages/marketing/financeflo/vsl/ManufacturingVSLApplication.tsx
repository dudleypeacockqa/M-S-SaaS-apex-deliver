import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/marketing/financeflo/ui/badge";

const ManufacturingVSLApplication = () => {
  return (
    <div className="min-h-screen">
      {/* VSL Branded Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Settings className="mr-2 h-4 w-4" />
            Manufacturing Industry Training
          </Badge>
        </div>
      </div>
      
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Manufacturing Implementation Application
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your manufacturing operations to get started
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing Details</CardTitle>
              <CardDescription>
                Help us understand your production needs and challenges
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
                <Input id="email" type="email" placeholder="john@manufacturer.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+44 20 1234 5678" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Manufacturing Company" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Manufacturing Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-50">10-50 employees</SelectItem>
                    <SelectItem value="50-100">50-100 employees</SelectItem>
                    <SelectItem value="100-500">100-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">Current Production Challenges</Label>
                <Textarea 
                  id="challenges" 
                  placeholder="Describe your main production challenges, bottlenecks, and areas for improvement"
                  rows={4}
                />
              </div>
              
              <Link to="/vsl/manufacturing/scheduling">
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

export default ManufacturingVSLApplication;
