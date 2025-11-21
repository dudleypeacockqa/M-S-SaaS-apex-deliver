
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { TrendingUp, BarChart3, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CapitalMarketsIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            Capital Markets Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Accelerate Capital Markets Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced automation for trading operations, settlement processes, and regulatory compliance in capital markets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/vsl/financial-services/opt-in">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Challenges */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Capital Markets Challenges We Address
            </h2>
            <p className="text-lg text-gray-600">
              Specialized solutions for high-frequency, high-stakes trading environments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Trade Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">High-volume trade execution, confirmation, and settlement processes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time risk monitoring and position management across portfolios</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Settlement Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Accelerating settlement cycles and reducing operational delays</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Regulatory Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complex regulatory requirements and transaction reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Capital Markets Automation
            </h2>
            <p className="text-lg text-gray-600">
              High-performance solutions built for capital markets speed and scale
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Trade Operations</CardTitle>
                <CardDescription>
                  End-to-end trade lifecycle automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated trade matching and confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time settlement processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Exception handling and resolution</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk & Compliance</CardTitle>
                <CardDescription>
                  Comprehensive risk monitoring and regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time position monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated regulatory reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Risk limit management</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Results for Capital Markets Firms
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">75%</div>
              <p className="text-gray-600">Faster settlement processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <p className="text-gray-600">Reduction in trade breaks</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50%</div>
              <p className="text-gray-600">Lower operational risk</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Accelerate Your Capital Markets Operations
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join leading capital markets firms leveraging our automation
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CapitalMarketsIndustry;
