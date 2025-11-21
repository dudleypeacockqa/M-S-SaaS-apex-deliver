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
  Cloud,
  Layers,
  Globe
} from 'lucide-react';

export default function AcumaticaAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-teal-900/5 to-cyan-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 text-lg font-semibold">
                <Brain className="w-5 h-5 mr-2" />
                AI Enhancement for Acumatica
              </Badge>
              
              <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Turbocharge Your 
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Acumatica</span>
                <br />with Unlimited AI
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Transform your cloud-native Acumatica into an infinitely scalable, AI-powered business platform with our Adaptive Intelligence Framework™ powered by Agentic AI, GenAI, ML, and IntelliFlow automation.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100">
                <div className="text-4xl font-bold text-emerald-600 mb-2">∞</div>
                <div className="text-sm text-gray-600">Scalability</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-100">
                <div className="text-4xl font-bold text-teal-600 mb-2">90%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-cyan-100">
                <div className="text-4xl font-bold text-cyan-600 mb-2">Real-time</div>
                <div className="text-sm text-gray-600">AI Processing</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">Cloud</div>
                <div className="text-sm text-gray-600">Native AI</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-5 text-xl font-semibold"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Schedule AI Assessment
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-10 py-5 text-xl font-semibold"
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
              Unlimited AI Power for Your Acumatica
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Leverage Acumatica's cloud-native architecture to deploy unlimited AI capabilities that scale infinitely with your business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cloud-Native AI */}
            <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Cloud className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Cloud-Native AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Harness the full power of cloud computing with AI models that scale automatically based on your business demands.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Infinite scalability with zero infrastructure limits
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Auto-scaling AI processing power
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Global AI deployment across regions
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Real-time AI model updates
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Intelligent Automation */}
            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Intelligent Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  AI-powered automation that learns from your business patterns and continuously optimizes processes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Self-learning workflow optimization
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Predictive inventory management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent demand forecasting
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Autonomous financial close processes
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Deep learning analytics that provide unprecedented insights into your business performance and opportunities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Real-time business intelligence
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Predictive performance modeling
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Customer behavior analysis
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Market trend prediction
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IntelliFlow Integration */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-6 py-3 text-lg font-semibold mb-6">
              <Network className="w-5 h-5 mr-2" />
              Powered by IntelliFlow
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Unlimited Integration with IntelliFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              IntelliFlow's cloud-native iPaaS platform perfectly complements Acumatica's unlimited scalability, creating an infinitely expandable business ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Acumatica + IntelliFlow = Unlimited Potential
                </h3>
                <p className="text-lg text-gray-600">
                  Combine Acumatica's unlimited user model with IntelliFlow's unlimited integration capabilities to create a business platform that scales without boundaries.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Global Business Orchestration</h4>
                    <p className="text-gray-600">Seamlessly orchestrate business processes across unlimited locations, subsidiaries, and business units.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Infinite System Connectivity</h4>
                    <p className="text-gray-600">Connect unlimited third-party systems, applications, and data sources with intelligent AI-powered mappings.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Exponential Growth Enablement</h4>
                    <p className="text-gray-600">Scale your business exponentially without worrying about system limitations or integration complexity.</p>
                  </div>
                </div>
              </div>

              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore Unlimited Integration
              </EnhancedButton>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Unlimited Scalability Metrics</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">User Capacity</span>
                      <span className="text-emerald-600 font-bold">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Data Processing</span>
                      <span className="text-teal-600 font-bold">Infinite</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Integration Points</span>
                      <span className="text-cyan-600 font-bold">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">AI Model Deployment</span>
                      <span className="text-blue-600 font-bold">Auto-Scale</span>
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
              Your Unlimited AI Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From cloud assessment to unlimited AI deployment - we guide you through every step of your Acumatica AI transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud AI Assessment</h3>
              <p className="text-gray-600">Comprehensive analysis of your Acumatica cloud environment and unlimited AI enhancement opportunities.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scalable AI Architecture</h3>
              <p className="text-gray-600">Design infinitely scalable AI architecture that grows seamlessly with your business expansion.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unlimited Deployment</h3>
              <p className="text-gray-600">Deploy unlimited AI capabilities across your entire Acumatica ecosystem with IntelliFlow integration.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Infinite Optimization</h3>
              <p className="text-gray-600">Continuous AI optimization and expansion to unlock unlimited business potential and growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready for Unlimited AI Power?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Transform your Acumatica into an infinitely scalable, AI-powered business platform that grows without limits and delivers unlimited potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Schedule AI Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-10 py-5 text-xl font-semibold"
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

