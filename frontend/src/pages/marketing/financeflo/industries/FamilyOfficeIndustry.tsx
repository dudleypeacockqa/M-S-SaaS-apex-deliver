
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Crown, Shield, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FamilyOfficeIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-200">
            Family Office Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Elite Wealth Management Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sophisticated automation for family office operations, wealth preservation, and multi-generational planning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
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
              Family Office Challenges We Address
            </h2>
            <p className="text-lg text-gray-600">
              Specialized solutions for ultra-high-net-worth family management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Crown className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Wealth Oversight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complex portfolio management across multiple asset classes and jurisdictions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Maintaining confidentiality and security of sensitive family information</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Investment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time monitoring of diverse investment portfolios and performance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Family Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Managing multiple family members, trustees, and advisory relationships</p>
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
              Comprehensive Family Office Automation
            </h2>
            <p className="text-lg text-gray-600">
              Tailored solutions for sophisticated wealth management needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Consolidation</CardTitle>
                <CardDescription>
                  Unified view of all family assets and investments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multi-entity portfolio aggregation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time performance monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Risk assessment and allocation</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Family Reporting</CardTitle>
                <CardDescription>
                  Customized reporting for family members and trustees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Personalized family member dashboards</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated compliance reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Tax planning and optimization</span>
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
              Results for Family Offices
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-2">50%</div>
              <p className="text-gray-600">Reduction in reporting time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <p className="text-gray-600">Data accuracy improvement</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
              <p className="text-gray-600">Cost savings on operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Elevate Your Family Office Operations
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join elite family offices leveraging our sophisticated automation
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              Schedule Private Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FamilyOfficeIndustry;
