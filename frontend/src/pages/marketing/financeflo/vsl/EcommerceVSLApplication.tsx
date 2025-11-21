import React, { useState } from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { TrendingUp, Shield, Clock, CheckCircle, Target, Users, Zap } from "lucide-react";

const EcommerceVSLApplication = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    monthlyRevenue: "",
    productCategory: "",
    biggestChallenge: "",
    productCount: "",
    monthlyAdSpend: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    window.location.href = '/vsl/ecommerce/scheduling';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* TrendFlo AI Brand */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 shadow-lg">
            <TrendingUp className="mr-2 h-5 w-5" />
            TrendFlo AI - Predictive Intelligence Application
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">60 Seconds Away</span>
            <br />
            From Discovering Your Next $1M Product Opportunity
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete this quick application so we can prepare your custom TrendFlo AI analysis 
            and identify the specific opportunities in your market
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>100% Secure & Private</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>Takes 60 Seconds</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
              <span>No Spam, Ever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center">
                    Strategy Session Application
                  </CardTitle>
                  <p className="text-blue-100 text-center">
                    Help us prepare your custom market analysis
                  </p>
                </CardHeader>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-2 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-2 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-2 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-2 border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="companyName" className="text-gray-700 font-medium">Company/Brand Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="mt-2 border-gray-300 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    {/* Business Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-700 font-medium">Current Monthly Revenue *</Label>
                          <Select onValueChange={(value) => handleInputChange('monthlyRevenue', value)}>
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Select revenue range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-10k">Under $10K</SelectItem>
                              <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                              <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                              <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                              <SelectItem value="500k-plus">$500K+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-gray-700 font-medium">Primary Product Category *</Label>
                          <Select onValueChange={(value) => handleInputChange('productCategory', value)}>
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beauty">Beauty & Skincare</SelectItem>
                              <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                              <SelectItem value="fitness">Fitness & Health</SelectItem>
                              <SelectItem value="home">Home & Garden</SelectItem>
                              <SelectItem value="electronics">Electronics & Tech</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <Label className="text-gray-700 font-medium">Biggest Challenge Right Now *</Label>
                          <Select onValueChange={(value) => handleInputChange('biggestChallenge', value)}>
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Select challenge" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="finding-products">Finding winning products</SelectItem>
                              <SelectItem value="scaling-products">Scaling current products</SelectItem>
                              <SelectItem value="influencer-roi">Influencer ROI</SelectItem>
                              <SelectItem value="ad-performance">Ad performance</SelectItem>
                              <SelectItem value="competition">Competition</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-gray-700 font-medium">How Many Products Do You Sell? *</Label>
                          <Select onValueChange={(value) => handleInputChange('productCount', value)}>
                            <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-5">1-5 products</SelectItem>
                              <SelectItem value="6-20">6-20 products</SelectItem>
                              <SelectItem value="21-50">21-50 products</SelectItem>
                              <SelectItem value="50-plus">50+ products</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Label className="text-gray-700 font-medium">Monthly Ad Spend *</Label>
                        <Select onValueChange={(value) => handleInputChange('monthlyAdSpend', value)}>
                          <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select ad spend range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">Under $5K</SelectItem>
                            <SelectItem value="5k-25k">$5K - $25K</SelectItem>
                            <SelectItem value="25k-100k">$25K - $100K</SelectItem>
                            <SelectItem value="100k-plus">$100K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button 
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <Zap className="mr-3 h-5 w-5" />
                        Book My Strategy Session Now
                      </Button>
                      
                      <div className="text-center mt-4 space-y-2 text-sm text-gray-600">
                        <p>🔒 Your information is 100% secure and will never be shared</p>
                        <p>⚡ Strategy session normally costs $2,500 - yours is complimentary</p>
                        <p>🎯 We'll prepare a custom analysis before your call</p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* What You'll Get */}
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    What You'll Get
                  </h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                      <span className="text-sm">Custom trend analysis for your specific niche</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                      <span className="text-sm">Product opportunities with profit potential</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                      <span className="text-sm">Influencer recommendations with predicted ROI</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                      <span className="text-sm">Ad channel optimization strategies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Social Proof */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Join 500+ Brands
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247%</div>
                      <div className="text-sm text-gray-600">Avg Revenue Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-gray-600">Product Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">90 Days</div>
                      <div className="text-sm text-gray-600">Ahead of Competition</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Urgency */}
              <Card className="bg-orange-50 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">
                    ⏰ Limited Availability
                  </h3>
                  <p className="text-orange-700 text-sm mb-3">
                    We're only accepting 12 new brands this quarter to ensure quality service.
                  </p>
                  <div className="bg-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-800 font-medium">Spots Remaining</div>
                    <div className="text-2xl font-bold text-orange-800">7 of 12</div>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </section>

      </div>
  );
};

export default EcommerceVSLApplication;

