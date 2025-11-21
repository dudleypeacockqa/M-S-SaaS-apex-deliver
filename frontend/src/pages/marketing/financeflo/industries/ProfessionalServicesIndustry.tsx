
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Briefcase, Clock, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalServicesIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
            Professional Services Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Scale Your Professional Services Firm
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline client management, project delivery, and billing processes for consulting and professional services firms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/vsl/professional-services/opt-in">
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
              Professional Services Challenges We Solve
            </h2>
            <p className="text-lg text-gray-600">
              Address the unique operational needs of professional services firms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Briefcase className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complex client relationships, project coordination, and service delivery</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Accurate billable hour tracking across multiple projects and clients</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Optimizing team utilization and project staffing decisions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Project profitability analysis and revenue optimization</p>
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
              Comprehensive Professional Services Automation
            </h2>
            <p className="text-lg text-gray-600">
              End-to-end solutions designed for professional services excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Streamlined project delivery and client communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated project workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time project status tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Client portal and collaboration</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence</CardTitle>
                <CardDescription>
                  Data-driven insights for better decision making
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time profitability analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Resource utilization reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Predictive revenue forecasting</span>
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
              Results for Professional Services Firms
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">35%</div>
              <p className="text-gray-600">Increase in billable hours</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
              <p className="text-gray-600">Reduction in admin time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <p className="text-gray-600">Improvement in profit margins</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Professional Services Firm?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join successful firms leveraging our automation solutions
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
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

export default ProfessionalServicesIndustry;
