
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { RefreshCw, CreditCard, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionBusinessIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
            Subscription Business Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Optimize Your Subscription Business
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automate billing, reduce churn, and accelerate growth with specialized solutions for subscription-based businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/vsl/ecommerce/opt-in">
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
              Subscription Business Challenges We Address
            </h2>
            <p className="text-lg text-gray-600">
              Specialized solutions for the unique challenges of recurring revenue models
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <RefreshCw className="h-8 w-8 text-cyan-600 mb-2" />
                <CardTitle>Billing Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Managing recurring billing, proration, and complex pricing models</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Handling failed payments, dunning management, and payment recovery</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tracking MRR, churn, LTV, and other critical subscription metrics</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reducing churn and improving customer lifetime value</p>
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
              Complete Subscription Business Automation
            </h2>
            <p className="text-lg text-gray-600">
              Purpose-built solutions for subscription business success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Operations</CardTitle>
                <CardDescription>
                  Automated billing and revenue recognition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated recurring billing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Revenue recognition automation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Intelligent dunning management</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Success</CardTitle>
                <CardDescription>
                  Churn reduction and growth optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Churn prediction and prevention</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated upsell campaigns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Customer health scoring</span>
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
              Results for Subscription Businesses
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">40%</div>
              <p className="text-gray-600">Reduction in churn rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">65%</div>
              <p className="text-gray-600">Faster billing processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
              <p className="text-gray-600">Increase in MRR growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Subscription Growth?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Join successful subscription businesses leveraging our automation
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
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

export default SubscriptionBusinessIndustry;
