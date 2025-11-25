import React, { useState } from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/marketing/financeflo/ui/tabs";
import { Progress } from "@/components/marketing/financeflo/ui/progress";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  Settings,
  Calendar,
  DollarSign,
  Factory,
  Phone,
  PlayCircle
} from "lucide-react";
import { SageX3VSLHero } from "@/components/marketing/financeflo/SageX3VSLHero";

const SageX3Implementation = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="min-h-screen bg-white">
        {/* Sage X3 VSL Hero Section */}
        <SageX3VSLHero />

        {/* Trust Indicators */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">450+</div>
                <div className="text-gray-600">Implementations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">30 Days</div>
                <div className="text-gray-600">Go-Live</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Sage X3 Implementation Excellence
              </h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sage X3 Manufacturing Excellence</CardTitle>
                      <CardDescription>
                        Transform your manufacturing operations with Sage X3's comprehensive ERP solution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Core Capabilities</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Manufacturing Resource Planning
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Supply Chain Management
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Financial Management
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Business Intelligence
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Implementation Benefits</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              40% Efficiency Improvement
                            </li>
                            <li className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              25% Cost Reduction
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-600" />
                              50% Faster Reporting
                            </li>
                            <li className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-orange-600" />
                              Enhanced Compliance
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="process" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Our Proven Implementation Process</CardTitle>
                      <CardDescription>
                        5-phase methodology ensuring successful Sage X3 deployment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { phase: "Discovery & Planning", duration: "2-3 weeks", description: "Comprehensive business analysis and solution design" },
                          { phase: "System Configuration", duration: "3-4 weeks", description: "Sage X3 setup and customization to your requirements" },
                          { phase: "Data Migration", duration: "1-2 weeks", description: "Secure transfer of existing data to Sage X3" },
                          { phase: "Testing & Training", duration: "2-3 weeks", description: "User acceptance testing and comprehensive training" },
                          { phase: "Go-Live & Support", duration: "1 week", description: "Production deployment with ongoing support" }
                        ].map((step, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{step.phase}</h4>
                              <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                              <Badge variant="outline">{step.duration}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="benefits" className="mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Factory className="w-5 h-5" />
                          Manufacturing Excellence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Production Planning & Scheduling
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Quality Management
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Shop Floor Control
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Inventory Optimization
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Business Intelligence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Real-time Dashboards
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Advanced Analytics
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Custom Reporting
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            KPI Monitoring
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="support" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comprehensive Support Services</CardTitle>
                      <CardDescription>
                        Ongoing support to ensure your Sage X3 success
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Phone className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-semibold mb-2">24/7 Support</h4>
                          <p className="text-sm text-gray-600">Round-the-clock technical support</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Training</h4>
                          <p className="text-sm text-gray-600">Comprehensive user training programs</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Settings className="w-6 h-6 text-purple-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Maintenance</h4>
                          <p className="text-sm text-gray-600">Regular system updates and optimization</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Manufacturing Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 450+ businesses that have revolutionized their operations with Sage X3
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Implementation Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Sage X3 Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default SageX3Implementation;

