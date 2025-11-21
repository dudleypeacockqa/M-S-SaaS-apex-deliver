import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';

import { Card } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Phone, MessageCircle, Calendar, Calculator, FileText, Zap, Shield, Globe } from 'lucide-react';

const InteractiveDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              🤖 Experience AI-Powered Finance Transformation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Interact with our AI systems and see how FinanceFlo.ai can transform your finance operations. 
              Try our voice AI, chat with our assistant, and explore our interactive tools.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">AI Systems Online</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">24/7 Available</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Multi-Region Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Voice AI Demo */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎙️ Voice AI Assistant Demo
                </h2>
                <p className="text-gray-600">
                  Experience our Synthflow-powered voice AI that understands your ERP needs and provides instant solutions.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">30s</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
                
                
              </div>
            </Card>

            {/* Chat AI Demo */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  💬 AI Chat Assistant Demo
                </h2>
                <p className="text-gray-600">
                  Chat with our AI assistant trained on 500+ ERP implementations and get instant answers to your questions.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Try asking:</div>
                  <div className="space-y-2">
                    <div className="text-sm bg-gray-100 p-2 rounded">"How can AI improve my finance processes?"</div>
                    <div className="text-sm bg-gray-100 p-2 rounded">"What's the ROI of ERP automation?"</div>
                    <div className="text-sm bg-gray-100 p-2 rounded">"Schedule a demo for my team"</div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                  disabled
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat Demo (Temporarily Unavailable)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>


      {/* Interactive Tools Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🛠️ Interactive Business Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Try our suite of interactive tools designed to help you assess, calculate, and plan your AI+ERP transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ROI Calculator</h3>
              <p className="text-sm text-gray-600 mb-4">Calculate your potential 300% ROI with our interactive tool</p>
              <Button
                onClick={() => window.open('/roi-calculator', '_blank')}
                className="w-full"
              >
                Calculate ROI
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Assessment</h3>
              <p className="text-sm text-gray-600 mb-4">15-minute assessment with personalized roadmap</p>
              <Button
                onClick={() => window.open('/readiness-assessment', '_blank')}
                className="w-full"
              >
                Start Assessment
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Book Demo</h3>
              <p className="text-sm text-gray-600 mb-4">Schedule a personalized demo with our experts</p>
              <Button
                onClick={() => window.open('/contact', '_blank')}
                className="w-full"
              >
                Schedule Demo
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Quote</h3>
              <p className="text-sm text-gray-600 mb-4">Get instant pricing for your business size</p>
              <Button
                onClick={() => window.open('/pricing', '_blank')}
                className="w-full"
              >
                Get Quote
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ⚡ Why Choose Our AI-Powered Approach?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Response</h3>
              <p className="text-gray-600">
                Our AI systems respond within 30 seconds, providing immediate assistance and scheduling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                GDPR compliant with enterprise-grade security for all your business data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Region</h3>
              <p className="text-gray-600">
                Local phone numbers and support for UK, USA, and South Africa markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InteractiveDemoPage;

