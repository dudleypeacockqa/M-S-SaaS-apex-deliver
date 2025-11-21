import React from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { ArrowRight, Database, Zap, Shield, BarChart3, Workflow, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIFeaturesShowcase from '@/components/marketing/financeflo/AIFeaturesShowcase';

const ERPIntegration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ERP Integration
              <span className="block text-3xl text-emerald-600 mt-2">Seamless Data Unification</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect LeverageFlo.ai with your ERP system for unified prospect data, 
              automated workflows, and complete visibility across all business operations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Database className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Real-Time Data Sync</h3>
                  <p className="text-gray-600">Bidirectional sync between marketing and ERP systems</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Workflow className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Automated Workflows</h3>
                  <p className="text-gray-600">Trigger ERP actions based on marketing events</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Unified Analytics</h3>
                  <p className="text-gray-600">Complete customer journey from lead to revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Integration Benefits</h3>
                <p className="text-gray-600">Performance improvements after integration</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data Accuracy</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">99%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Process Efficiency</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-teal-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">85%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Manual Tasks Reduced</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">78%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue Visibility</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported ERP Systems */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported ERP Systems</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Native integrations with leading ERP platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-emerald-600">Sage Intacct</CardTitle>
                <CardDescription>
                  Complete financial data integration with real-time customer profitability tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-600">Acumatica</CardTitle>
                <CardDescription>
                  Full business suite integration including CRM, financials, and inventory
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-purple-600">NetSuite</CardTitle>
                <CardDescription>
                  Enterprise-level integration with advanced workflow automation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-600">Odoo</CardTitle>
                <CardDescription>
                  Open-source flexibility with custom integration capabilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-green-600">QuickBooks</CardTitle>
                <CardDescription>
                  Small to medium business integration with financial tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-600">Custom Systems</CardTitle>
                <CardDescription>
                  API-based integration for proprietary and legacy systems
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why LeverageFlo's AI is Revolutionary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of ERP integration powered by artificial intelligence
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <AIFeaturesShowcase />

          {/* Comparison Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Traditional ERP Integration vs. LeverageFlo AI
              </h3>
              <p className="text-lg text-gray-600">
                See why businesses are switching to AI-powered ERP integration
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl p-8 overflow-x-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-[800px]">
                {/* Traditional Integration Column */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Traditional Integration</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">✗</span>
                      <span className="text-gray-700">Manual data mapping required</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">✗</span>
                      <span className="text-gray-700">Complex technical setup</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">✗</span>
                      <span className="text-gray-700">Reactive error handling</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">✗</span>
                      <span className="text-gray-700">Limited automation capabilities</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-xl">✗</span>
                      <span className="text-gray-700">Hours to resolve sync issues</span>
                    </div>
                  </div>
                </div>

                {/* VS Column */}
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                    VS
                  </div>
                </div>

                {/* LeverageFlo AI Column */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-300">
                  <h4 className="text-xl font-bold text-emerald-900 mb-6 text-center">LeverageFlo AI</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">AI-powered automatic mapping</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Natural language configuration</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Predictive error prevention</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Intelligent workflow automation</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Self-healing integrations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Integration Capabilities</h2>
            <p className="text-lg text-gray-600">Comprehensive data synchronization and automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <RefreshCw className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Bi-Directional Sync</CardTitle>
                <CardDescription>
                  Real-time data flow between marketing automation and ERP systems
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Automated Triggers</CardTitle>
                <CardDescription>
                  Create ERP records automatically based on marketing events
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Secure Connections</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted data transmission
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Implementation Process</h2>
            <p className="text-lg text-gray-600">Simple 5-step integration process</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600 text-sm">Analyze current ERP setup and requirements</p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapping</h3>
              <p className="text-gray-600 text-sm">Define data mapping and workflow rules</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration</h3>
              <p className="text-gray-600 text-sm">Set up secure API connections</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing</h3>
              <p className="text-gray-600 text-sm">Validate data integrity and workflows</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Go-Live</h3>
              <p className="text-gray-600 text-sm">Launch with ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Integrate Your ERP System?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Unify your marketing and business operations for complete visibility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/leverageflo/demo">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                View Integration Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 min-w-[200px]">
                Schedule Integration Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ERPIntegration;