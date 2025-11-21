
import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { ShoppingCart, Package, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EcommerceIndustry = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            Ecommerce Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Scale Your Ecommerce Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automate inventory management, order processing, and customer experiences for growing ecommerce businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
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
              Ecommerce Challenges We Solve
            </h2>
            <p className="text-lg text-gray-600">
              Address the operational complexities of modern ecommerce
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complex order processing, fulfillment, and customer communication</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Inventory Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Multi-channel inventory synchronization and demand forecasting</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Growth Scaling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Managing rapid growth while maintaining operational efficiency</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Customer Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Delivering personalized experiences across all touchpoints</p>
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
              Comprehensive Ecommerce Automation
            </h2>
            <p className="text-lg text-gray-600">
              End-to-end solutions designed for ecommerce success
            </p>
          </div>
          
          {/* Industry Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative">
              <img 
                src="/assets/images/industries/ecommerce_warehouse.png" 
                alt="Modern ecommerce fulfillment warehouse with automated systems"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Automated Fulfillment</h3>
                <p className="text-sm opacity-90">Streamlined warehouse operations</p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/images/industries/ecommerce_office.png" 
                alt="Ecommerce team working with analytics dashboards and customer service"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Data-Driven Operations</h3>
                <p className="text-sm opacity-90">Real-time analytics and insights</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Operations Automation</CardTitle>
                <CardDescription>
                  Streamlined order and inventory management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated order processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time inventory synchronization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Intelligent demand forecasting</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Intelligence</CardTitle>
                <CardDescription>
                  Data-driven customer experience optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Personalized marketing automation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Customer behavior analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated customer support</span>
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
              Results for Ecommerce Businesses
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">55%</div>
              <p className="text-gray-600">Faster order processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <p className="text-gray-600">Reduction in stockouts</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
              <p className="text-gray-600">Increase in customer retention</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Ecommerce Business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join successful ecommerce brands leveraging our automation
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
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

export default EcommerceIndustry;
