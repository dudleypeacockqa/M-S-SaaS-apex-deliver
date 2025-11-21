import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { ArrowRight, Database, Zap, Shield, Clock, TrendingUp, Users } from 'lucide-react';

const ERPDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ERP Implementation Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our AI-powered ERP implementations for Sage Intacct, Acumatica, and Odoo.
              See how we transform your finance operations with intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  Sage Intacct AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cloud-native financial management with AI-powered automation and intelligent insights.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 mr-2 text-green-500" />
                    300% faster financial closes
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Real-time financial insights
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-purple-500" />
                    Enterprise-grade security
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/implementation/sage-intacct">
                    View Implementation <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-green-600" />
                  Acumatica AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Unlimited scalability with AI-driven business intelligence and process automation.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    Unlimited users included
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    AI-powered workflows
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-purple-500" />
                    30-day implementation
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/implementation/acumatica">
                    View Implementation <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-purple-600" />
                  Odoo AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Open-source flexibility with AI enhancements for unlimited customization potential.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 mr-2 text-green-500" />
                    Custom AI modules
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Database className="h-4 w-4 mr-2 text-blue-500" />
                    All-in-one business suite
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                    Scalable architecture
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/implementation/odoo">
                    View Implementation <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
              <a href="/contact">
                Schedule ERP Consultation <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ERPDemoPage;