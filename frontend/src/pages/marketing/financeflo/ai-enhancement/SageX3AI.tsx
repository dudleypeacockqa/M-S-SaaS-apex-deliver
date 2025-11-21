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
  Factory,
  Globe,
  Layers,
  Cog
} from 'lucide-react';

export default function SageX3AI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-red-900/5 to-amber-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 text-lg font-semibold">
                <Brain className="w-5 h-5 mr-2" />
                AI Enhancement for Sage X3
              </Badge>
              
              <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Supercharge Manufacturing with 
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Sage X3</span>
                <br />AI Intelligence
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Transform your enterprise Sage X3 into an intelligent, predictive manufacturing powerhouse with our Adaptive Intelligence Framework™ powered by Agentic AI, GenAI, ML, and IntelliFlow automation.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">600%</div>
                <div className="text-sm text-gray-600">Efficiency Gain</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-red-100">
                <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-100">
                <div className="text-4xl font-bold text-amber-600 mb-2">Global</div>
                <div className="text-sm text-gray-600">AI Deployment</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-yellow-100">
                <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">AI Monitoring</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-5 text-xl font-semibold"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Schedule AI Assessment
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-5 text-xl font-semibold"
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
              Enterprise AI for Manufacturing Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Leverage Sage X3's enterprise capabilities with advanced AI to create the most intelligent manufacturing and distribution system in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Predictive Manufacturing */}
            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Factory className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Predictive Manufacturing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  AI-powered manufacturing intelligence that predicts equipment failures, optimizes production schedules, and maximizes efficiency.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Predictive maintenance scheduling
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent production optimization
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Quality control automation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Real-time performance monitoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Global Supply Chain AI */}
            <Card className="border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Global Supply Chain AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Intelligent supply chain orchestration across multiple countries, currencies, and regulatory environments.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Multi-country demand forecasting
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent inventory optimization
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Automated compliance monitoring
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Risk assessment & mitigation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Intelligence */}
            <Card className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Enterprise Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Advanced AI analytics that provide deep insights into enterprise performance and strategic opportunities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Executive AI dashboards
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Strategic planning automation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Market intelligence analysis
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Competitive advantage insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IntelliFlow Integration */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-600 to-orange-600 text-white px-6 py-3 text-lg font-semibold mb-6">
              <Network className="w-5 h-5 mr-2" />
              Powered by IntelliFlow
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade AI with IntelliFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              IntelliFlow's enterprise iPaaS platform seamlessly integrates with Sage X3's robust architecture to deliver unparalleled AI-powered manufacturing intelligence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Sage X3 + IntelliFlow = Manufacturing Excellence
                </h3>
                <p className="text-lg text-gray-600">
                  Combine Sage X3's enterprise manufacturing capabilities with IntelliFlow's intelligent automation to create the most advanced manufacturing AI system available.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Multi-Site Intelligence</h4>
                    <p className="text-gray-600">Orchestrate AI-powered operations across multiple manufacturing sites, countries, and business units.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cog className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced Manufacturing AI</h4>
                    <p className="text-gray-600">Deploy sophisticated AI models for production planning, quality control, and operational optimization.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Enterprise Scalability</h4>
                    <p className="text-gray-600">Scale AI capabilities across your entire enterprise with robust, secure, and compliant deployment.</p>
                  </div>
                </div>
              </div>

              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore Enterprise Integration
              </EnhancedButton>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Enterprise AI Metrics</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Manufacturing Sites</span>
                      <span className="text-orange-600 font-bold">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">AI Processing Power</span>
                      <span className="text-red-600 font-bold">Enterprise</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Global Deployment</span>
                      <span className="text-amber-600 font-bold">50+ Countries</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Security Level</span>
                      <span className="text-yellow-600 font-bold">Enterprise</span>
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
              Your Enterprise AI Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From enterprise assessment to global AI deployment - we guide you through every step of your Sage X3 AI transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise AI Assessment</h3>
              <p className="text-gray-600">Comprehensive analysis of your Sage X3 enterprise environment and global AI enhancement opportunities.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global AI Strategy</h3>
              <p className="text-gray-600">Design enterprise-grade AI strategy that scales across all manufacturing sites and business units.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Deployment</h3>
              <p className="text-gray-600">Deploy enterprise-grade AI capabilities across your global Sage X3 infrastructure with IntelliFlow.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Optimization</h3>
              <p className="text-gray-600">Continuous AI optimization and expansion across your global manufacturing and distribution network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Manufacturing with AI?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto">
            Transform your Sage X3 into the most intelligent manufacturing and distribution system in the world with enterprise-grade AI that delivers unprecedented operational excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Schedule AI Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-5 text-xl font-semibold"
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

