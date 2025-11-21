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
  Rocket
} from 'lucide-react';

export default function SageIntacctAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-purple-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 text-lg font-semibold">
                <Brain className="w-5 h-5 mr-2" />
                AI Enhancement for Sage Intacct
              </Badge>
              
              <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Supercharge Your 
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Sage Intacct</span>
                <br />with AI Intelligence
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Transform your existing Sage Intacct into an intelligent, self-learning financial powerhouse with our Adaptive Intelligence Framework™ powered by Agentic AI, GenAI, ML, and IntelliFlow automation.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">500%</div>
                <div className="text-sm text-gray-600">ROI Increase</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100">
                <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">AI Processing</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-cyan-100">
                <div className="text-4xl font-bold text-cyan-600 mb-2">Real-time</div>
                <div className="text-sm text-gray-600">Insights</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 text-xl font-semibold"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Schedule AI Assessment
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-5 text-xl font-semibold"
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
              Unlock the Power of AI in Your Sage Intacct
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our Adaptive Intelligence Framework™ transforms your Sage Intacct into a self-learning, predictive, and autonomous financial system using cutting-edge AI technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agentic AI */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Agentic AI Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Autonomous AI agents that understand your business context and execute complex financial workflows without human intervention.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent invoice processing & approval routing
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Autonomous expense categorization & validation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Self-optimizing financial workflows
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Context-aware decision making
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* GenAI */}
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Generative AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Advanced GenAI models that generate intelligent financial insights, reports, and recommendations tailored to your business.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    AI-generated financial narratives & explanations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Intelligent variance analysis & commentary
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Automated board report generation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Natural language query interface
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Machine Learning */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Machine Learning Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-lg">
                  Custom ML models trained on your financial data to predict trends, detect anomalies, and optimize performance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Predictive cash flow forecasting
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Fraud detection & risk assessment
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Customer payment behavior analysis
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    Budget variance prediction
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IntelliFlow Integration */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 text-lg font-semibold mb-6">
              <Network className="w-5 h-5 mr-2" />
              Powered by IntelliFlow
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Brilliant Automation with IntelliFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We leverage IntelliFlow's cutting-edge iPaaS platform to create seamless, intelligent integrations that connect your Sage Intacct with any system, anywhere.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Why IntelliFlow + Sage Intacct = Unstoppable
                </h3>
                <p className="text-lg text-gray-600">
                  IntelliFlow's intelligent automation platform transforms your Sage Intacct into the central nervous system of your business, connecting every data point and process with AI-powered precision.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Intelligent Data Orchestration</h4>
                    <p className="text-gray-600">Real-time data synchronization across all your business systems with AI-powered data quality and validation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">360° Business Visibility</h4>
                    <p className="text-gray-600">Complete visibility across your entire business ecosystem with unified dashboards and real-time insights.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Accelerated Digital Transformation</h4>
                    <p className="text-gray-600">Rapid deployment of AI-powered automations that scale with your business growth and evolving needs.</p>
                  </div>
                </div>
              </div>

              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore IntelliFlow Integration
              </EnhancedButton>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">IntelliFlow Integration Benefits</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Integration Speed</span>
                      <span className="text-cyan-600 font-bold">10x Faster</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Data Accuracy</span>
                      <span className="text-blue-600 font-bold">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">Automation Rate</span>
                      <span className="text-indigo-600 font-bold">95%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">ROI Timeline</span>
                      <span className="text-purple-600 font-bold">3 Months</span>
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
              Your AI Transformation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From assessment to full AI implementation - we guide you through every step of your Sage Intacct AI transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Readiness Assessment</h3>
              <p className="text-gray-600">Comprehensive analysis of your current Sage Intacct setup and AI enhancement opportunities.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom AI Strategy</h3>
              <p className="text-gray-600">Tailored AI implementation roadmap designed specifically for your business processes and goals.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Implementation</h3>
              <p className="text-gray-600">Seamless integration of AI capabilities with your existing Sage Intacct system using IntelliFlow.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Optimization</h3>
              <p className="text-gray-600">Ongoing AI model training and optimization to ensure maximum performance and ROI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Unleash AI in Your Sage Intacct?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join the AI revolution and transform your Sage Intacct into an intelligent, self-learning financial powerhouse that drives unprecedented business growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Schedule AI Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 text-xl font-semibold"
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

