
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const InvestmentBankingIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            Investment Banking Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Investment Banking Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced automation solutions for deal management, compliance, and financial reporting in investment banking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
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
              Investment Banking Challenges We Solve
            </h2>
            <p className="text-lg text-gray-600">
              Address the unique operational complexities of investment banking
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Deal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complex deal tracking, pipeline management, and transaction coordination</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Regulatory reporting, risk management, and audit trail requirements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Accurate time allocation across multiple deals and client engagements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Team Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Managing large teams across multiple deals and jurisdictions</p>
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
              Tailored Solutions for Investment Banking
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive automation designed for the investment banking industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Deal Pipeline Management</CardTitle>
                <CardDescription>
                  Automated deal tracking and pipeline reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time deal status tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated pipeline reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Revenue forecasting</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Risk Management</CardTitle>
                <CardDescription>
                  Automated regulatory reporting and risk monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Regulatory compliance tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Risk assessment automation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Audit trail management</span>
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
              Results for Investment Banking Firms
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">40%</div>
              <p className="text-gray-600">Faster deal processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
              <p className="text-gray-600">Reduction in compliance overhead</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <p className="text-gray-600">Increase in deal capacity</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Investment Banking Operations?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join leading investment banks using our automation solutions
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
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

export default InvestmentBankingIndustry;
