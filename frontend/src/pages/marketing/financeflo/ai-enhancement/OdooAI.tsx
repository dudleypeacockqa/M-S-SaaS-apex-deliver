import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { EnhancedButton } from '@/components/marketing/financeflo/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Brain, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Award,
  ArrowRight,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  Bot,
  Cpu,
  Database,
  Network,
  Workflow,
  Eye,
  Lightbulb,
  Rocket,
  Puzzle,
  Settings,
  Code
} from 'lucide-react';

export default function OdooAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-blue-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 text-lg font-semibold">
                <Brain className="w-5 h-5 mr-2" />
                AI Enhancement for Odoo
              </Badge>
              
              <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Customize Everything with 
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> AI-Powered</span>
                <br />Odoo Intelligence
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Transform your flexible Odoo system into a completely customized, AI-driven business suite with our Adaptive Intelligence Framework™ powered by Agentic AI, GenAI, ML, and IntelliFlow automation.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Customizable</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100">
                <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">AI-Enhanced Apps</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100">
                <div className="text-4xl font-bold text-violet-600 mb-2">Custom</div>
                <div className="text-sm text-gray-600">AI Models</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-5 text-xl font-semibold"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Schedule AI Assessment
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-10 py-5 text-xl font-semibold"
              >
                <Phone className="w-6 h-6 mr-3" />
                Call: +44 7360 539147
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Custom AI for Every Odoo Module
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Leverage Odoo's open-source flexibility to deploy custom AI solutions tailored to your unique business processes across every module and workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Custom AI Development */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Custom AI Development</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Develop bespoke AI modules that integrate seamlessly with your customized Odoo environment and unique business logic.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Custom AI module development
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Tailored machine learning models
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Business-specific AI algorithms
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Open-source AI integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Intelligent Workflows */}
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Workflow className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Intelligent Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Transform every Odoo workflow with AI-powered automation that learns and adapts to your specific business patterns.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    AI-powered workflow optimization
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent process automation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Adaptive business rule engine
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Self-learning approval systems
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Custom predictive models that analyze your unique data patterns to forecast trends and optimize decision-making.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Custom forecasting models
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent trend analysis
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Predictive maintenance scheduling
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    AI-driven business insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IntelliFlow Integration */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 text-lg font-semibold mb-6">
              <Network className="w-5 h-5 mr-2" />
              Powered by IntelliFlow
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Complete Customization with IntelliFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              IntelliFlow's flexible iPaaS platform perfectly complements Odoo's customization capabilities, enabling completely tailored AI solutions for your unique business needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Odoo + IntelliFlow = Complete Customization
                </h3>
                <p className="text-lg text-gray-600">
                  Combine Odoo's open-source flexibility with IntelliFlow's intelligent automation to create a completely customized, AI-powered business ecosystem.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Puzzle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Modular AI Integration</h4>
                    <p className="text-gray-600">Seamlessly integrate AI capabilities into any Odoo module with custom-built connectors and intelligent data flows.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Tailored Automation</h4>
                    <p className="text-gray-600">Create completely customized automation workflows that match your exact business processes and requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Rapid Custom Development</h4>
                    <p className="text-gray-600">Accelerate custom AI development with pre-built components and intelligent development frameworks.</p>
                  </div>
                </div>
              </div>

              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore Custom Integration
              </EnhancedButton>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Custom AI Capabilities</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Customization Level</span>
                      <span className="text-purple-600 font-bold">100%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">AI Module Integration</span>
                      <span className="text-indigo-600 font-bold">50+ Apps</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Development Speed</span>
                      <span className="text-blue-600 font-bold">5x Faster</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Custom Models</span>
                      <span className="text-cyan-600 font-bold">Unlimited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Journey */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Custom AI Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From customization analysis to full AI deployment - we guide you through every step of your Odoo AI transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customization Analysis</h3>
              <p className="text-gray-600">Deep analysis of your Odoo customizations and identification of AI enhancement opportunities.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom AI Design</h3>
              <p className="text-gray-600">Design bespoke AI solutions tailored to your unique Odoo configuration and business processes.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Module Development</h3>
              <p className="text-gray-600">Develop and integrate custom AI modules that seamlessly work with your existing Odoo setup.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Evolution</h3>
              <p className="text-gray-600">Ongoing AI enhancement and customization to evolve with your changing business needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Customize Everything with AI?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto">
            Transform your Odoo into a completely customized, AI-powered business suite that perfectly matches your unique processes and delivers exceptional results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Schedule AI Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-10 py-5 text-xl font-semibold"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call: +44 7360 539147
            </EnhancedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

