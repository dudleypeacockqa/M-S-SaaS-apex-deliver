import React from 'react';
import { Helmet } from 'react-helmet-async';
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
  Workflow,
  Eye,
  Lightbulb,
  Rocket,
  Globe,
  Layers,
  Link,
  Cloud,
  Settings,
  Code,
  Puzzle,
  Play,
  X,
  MessageSquare,
  GitBranch,
  Activity,
  Gauge,
  Lock
} from 'lucide-react';
import { AIConfigurationDemo } from '@/components/marketing/financeflo/demo/AIConfigurationDemo';
import { PredictiveAnalyticsDashboard } from '@/components/marketing/financeflo/demo/PredictiveAnalyticsDashboard';
import AIFeaturesShowcase from '@/components/marketing/financeflo/AIFeaturesShowcase';
import BreadcrumbNavigation from '@/components/marketing/financeflo/BreadcrumbNavigation';
import CustomerSuccessStories from '@/components/marketing/financeflo/CustomerSuccessStories';
import AIDemoSection from '@/components/marketing/financeflo/AIDemoSection';

export default function IntelliFlowPartnership() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://financeflo.ai/ipaas/#organization",
        "name": "IntelliFlow by FinanceFlo.ai",
        "url": "https://financeflo.ai/ipaas/",
        "logo": "https://financeflo.ai/intelliflow-logo.png",
        "description": "AI-powered iPaaS platform with Agentic AI technology for intelligent business integrations",
        "foundingDate": "2024",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-20-7946-0958",
          "contactType": "sales"
        }
      },
      {
        "@type": "Product",
        "@id": "https://financeflo.ai/ipaas/#product",
        "name": "IntelliFlow AI iPaaS Platform",
        "description": "Transform your business with IntelliFlow's Agentic AI platform. 10x faster implementation, 99.99% reliability, and zero-maintenance integrations.",
        "brand": {
          "@type": "Brand",
          "name": "IntelliFlow"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Starter Plan",
            "price": "2499",
            "priceCurrency": "GBP",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "2499",
              "priceCurrency": "GBP",
              "billingPeriod": "P1M"
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <Helmet>
        <title>IntelliFlow - AI-Powered iPaaS Platform | FinanceFlo.ai</title>
        <meta name="description" content="Transform your business with IntelliFlow's Agentic AI platform. 10x faster implementation, 99.99% reliability, and zero-maintenance integrations." />
        <meta name="keywords" content="AI-powered iPaaS, Agentic AI integration, intelligent integration platform, cognitive API management, self-healing integrations, IntelliFlow" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="IntelliFlow - AI-Powered iPaaS Platform | FinanceFlo.ai" />
        <meta property="og:description" content="Transform your business with IntelliFlow's Agentic AI platform. 10x faster implementation, 99.99% reliability, and zero-maintenance integrations." />
        <meta property="og:image" content="https://financeflo.ai/intelliflow-social-preview.jpg" />
        <meta property="og:url" content="https://financeflo.ai/ipaas/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IntelliFlow by FinanceFlo.ai" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IntelliFlow - AI-Powered iPaaS Platform" />
        <meta name="twitter:description" content="Transform your business with IntelliFlow's Agentic AI platform. 10x faster implementation, 99.99% reliability." />
        <meta name="twitter:image" content="https://financeflo.ai/intelliflow-social-preview.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Navigation />
      
      {/* Breadcrumb Navigation */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbNavigation 
            items={[
              { label: 'iPaaS Solutions', href: '/ipaas' },
              { label: 'IntelliFlow AI Platform' }
            ]}
          />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background with AI Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#0891b2] to-[#2563eb]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
        </div>
        
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-white text-sm font-medium">Trusted by 450+ UK Businesses</span>
              </div>

              {/* Main Headlines */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-white">Transform Your</span>
                  <br />
                  <span className="text-white">Business with</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                    IntelliFlow™
                  </span>
                </h1>
                
                <h2 className="text-2xl lg:text-3xl text-cyan-100 font-semibold">
                  The World's First Agentic AI-Powered Integration Platform
                </h2>
                
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                  Revolutionary AI technology that thinks, learns, and adapts to your business needs. 
                  Experience autonomous integrations that heal themselves, predict issues, and optimize performance automatically.
                </p>
              </div>

              {/* 4 Key Differentiators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🧠</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Agentic AI Engine™</h3>
                      <p className="text-white/70 text-sm">Autonomous decision-making</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🗣️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Natural Language Config</h3>
                      <p className="text-white/70 text-sm">Configure in plain English</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🔮</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Predictive Intelligence</h3>
                      <p className="text-white/70 text-sm">Prevent issues before they occur</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Self-Healing Systems</h3>
                      <p className="text-white/70 text-sm">Zero-maintenance integrations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-3 h-5 w-5" />
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/40 text-blue-900 hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Watch AI Demo
                </EnhancedButton>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-6 pt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-orange-300 font-bold text-lg">500% ROI</span>
                  <span className="text-white/80 text-sm ml-2">in 6 months</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-green-300 font-bold text-lg">99.99%</span>
                  <span className="text-white/80 text-sm ml-2">uptime guaranteed</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <span className="text-cyan-300 font-bold text-lg">AI-powered</span>
                  <span className="text-white/80 text-sm ml-2">since 2024</span>
                </div>
              </div>
            </div>

            {/* Right Column - AI Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm ml-4">intelliflow.ai/dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        AI ACTIVE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* AI Agents Working */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-800 font-semibold">Agentic AI Agents</h3>
                      <span className="text-green-600 text-sm font-medium">3 Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs">🤖</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">Integration Agent</div>
                          <div className="text-xs text-gray-600">Optimizing Salesforce → QuickBooks flow</div>
                        </div>
                        <div className="text-green-500 text-xs">Active</div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs">🧠</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">Predictive Agent</div>
                          <div className="text-xs text-gray-600">Analyzing performance patterns</div>
                        </div>
                        <div className="text-green-500 text-xs">Active</div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-xs text-gray-600 mb-1">Success Rate</div>
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-green-500">↗ Self-optimizing</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-xs text-gray-600 mb-1">AI Efficiency</div>
                      <div className="text-2xl font-bold text-blue-600">847%</div>
                      <div className="text-xs text-blue-500">↗ Learning</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Icons */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <span className="text-xl">🚀</span>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-3 rounded-full shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-full shadow-lg transform rotate-12">
                <span className="text-sm">🧠</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Bridge */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Integration Nightmare Ends Here
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Integration Problems</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800">Manually configure every connection</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800">Constantly monitor for failures</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800">Hire expensive specialists for maintenance</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800">Accept downtime as "normal"</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">IntelliFlow AI Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800">Autonomous setup and optimization</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800">Self-healing integrations that never break</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800">Natural language configuration - no coding required</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800">Predictive maintenance prevents all downtime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Mechanism Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Agentic AI Engine™
            </h2>
            <h3 className="text-2xl text-primary font-semibold mb-4">
              The Only iPaaS with True Artificial Intelligence
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Unlike basic automation tools, IntelliFlow's Agentic AI Engine™ operates like a team of expert integration specialists working 24/7:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🧠 Cognitive Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Understands your business context and requirements
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🔮 Predictive Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Forecasts and prevents issues before they occur
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🔄 Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Continuously improves performance based on your usage patterns
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🤖 Autonomous Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Makes decisions and implements optimizations independently
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Three-Point Explanation */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How IntelliFlow Transforms Your Business
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Intelligent Setup (Minutes, Not Months)</h3>
              <p className="text-lg text-gray-600">
                NLP engine understands requirements and auto-configures integrations in natural language. Simply describe what you need, and IntelliFlow builds it.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Autonomous Operation (Zero Maintenance)</h3>
              <p className="text-lg text-gray-600">
                AI agents monitor, optimize, and heal integrations 24/7. Self-healing technology fixes issues before they impact your business.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Adaptive Evolution (Gets Smarter Over Time)</h3>
              <p className="text-lg text-gray-600">
                AI learns from your specific business patterns and continuously optimizes performance, becoming more intelligent with every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Proven Results That Speak for Themselves
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-gray-600">Enterprise Customers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">99.99%</div>
              <div className="text-sm text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">10x</div>
              <div className="text-sm text-gray-600">Faster Implementation</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-teal-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-primary/10">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <blockquote className="text-xl text-gray-800 italic mb-4">
                  "IntelliFlow's AI reduced our integration setup time from 6 months to 2 weeks. The autonomous healing capabilities have eliminated downtime completely."
                </blockquote>
                <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                <div className="text-gray-600">CTO, TechCorp Financial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Revolutionary AI Capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GitBranch className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI-Powered Data Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Intelligent field mapping that understands context and automatically handles complex transformations
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Predictive Integration Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Advanced monitoring that predicts failures before they happen and automatically prevents issues
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Natural Language Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Configure complex integrations using plain English - no technical expertise required
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Autonomous Error Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Self-healing technology that automatically diagnoses and fixes integration issues in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gauge className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Intelligent Load Balancing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  AI-driven performance optimization that automatically scales resources based on demand patterns
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Cognitive Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Advanced threat detection and response that learns from security patterns and adapts defenses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive AI Demos */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AIConfigurationDemo />
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <PredictiveAnalyticsDashboard />
        </div>
      </section>

      {/* ERP Integration Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              IntelliFlow + ERP = Intelligent Business Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              See how IntelliFlow's Agentic AI seamlessly integrates with leading ERP systems to create unified, intelligent business ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sage Intacct */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Sage Intacct + IntelliFlow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  AI-enhanced financial intelligence with autonomous data flows and predictive analytics for complete financial visibility.
                </p>
                <EnhancedButton variant="outline" size="sm" className="w-full">
                  Learn More
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Acumatica */}
            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Acumatica + IntelliFlow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Unlimited scalability meets unlimited intelligence. AI-powered automation that grows with your cloud-native business.
                </p>
                <EnhancedButton variant="outline" size="sm" className="w-full">
                  Learn More
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Odoo */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Puzzle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Odoo + IntelliFlow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Complete customization powered by cognitive AI. Intelligent automation that adapts to your unique business processes.
                </p>
                <EnhancedButton variant="outline" size="sm" className="w-full">
                  Learn More
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Sage X3 */}
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Sage X3 + IntelliFlow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Enterprise-grade manufacturing intelligence with AI-powered supply chain optimization and predictive maintenance.
                </p>
                <EnhancedButton variant="outline" size="sm" className="w-full">
                  Learn More
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Intelligent Pricing for Every Business
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Intelligent Starter</CardTitle>
                <div className="text-4xl font-bold text-primary mt-4">£3,500</div>
                <div className="text-gray-600">/month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Up to 50 AI-powered integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Basic cognitive automation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Self-healing capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">24/7 AI monitoring</span>
                  </li>
                </ul>
                <EnhancedButton className="w-full mt-6">
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Professional Plan - Most Popular */}
            <Card className="border-2 border-primary hover:border-primary/80 transition-all duration-300 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-6 py-2 text-sm font-semibold">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Cognitive Professional</CardTitle>
                <div className="text-4xl font-bold text-primary mt-4">£8,500</div>
                <div className="text-gray-600">/month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Unlimited AI-powered integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Advanced predictive intelligence</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Natural language configuration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Dedicated AI optimization specialist</span>
                  </li>
                </ul>
                <EnhancedButton className="w-full mt-6">
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Agentic Enterprise</CardTitle>
                <div className="text-4xl font-bold text-primary mt-4">Custom</div>
                <div className="text-gray-600">pricing</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Unlimited everything</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Custom AI agent development</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">White-label deployment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600">Dedicated AI engineering team</span>
                  </li>
                </ul>
                <EnhancedButton variant="outline" className="w-full mt-6">
                  Contact Sales
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Intelligent Integration?
          </h2>
          
          <p className="text-xl text-blue-100 mb-12">
            Join 500+ enterprises that have transformed their operations with IntelliFlow's Agentic AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </EnhancedButton>
            <EnhancedButton 
              size="lg" 
              variant="outline" 
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Calendar className="mr-2 h-6 w-6" />
              Schedule AI Demo
            </EnhancedButton>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Setup in under 24 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why IntelliFlow's AI is Revolutionary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of business integration
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <AIFeaturesShowcase />

          {/* Comparison Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Traditional iPaaS vs. IntelliFlow AI
              </h3>
              <p className="text-lg text-gray-600">
                See why businesses are switching to AI-powered integration
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 overflow-x-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-[800px]">
                {/* Traditional iPaaS Column */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Traditional iPaaS</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 mt-1" />
                      <span className="text-gray-700">Manual configuration required</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 mt-1" />
                      <span className="text-gray-700">Reactive maintenance only</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 mt-1" />
                      <span className="text-gray-700">Technical expertise needed</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 mt-1" />
                      <span className="text-gray-700">Limited failure prediction</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 mt-1" />
                      <span className="text-gray-700">Hours/days to resolve issues</span>
                    </div>
                  </div>
                </div>

                {/* VS Column */}
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                    VS
                  </div>
                </div>

                {/* IntelliFlow AI Column */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-300">
                  <h4 className="text-xl font-bold text-blue-900 mb-6 text-center">IntelliFlow AI</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-gray-700">Natural language configuration</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-gray-700">Proactive AI monitoring & healing</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-gray-700">Zero-code setup for business users</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-gray-700">Predicts failures 72h in advance</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-gray-700">Automatic resolution in 30 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <CustomerSuccessStories />

      {/* AI Demo Section */}
      <AIDemoSection />

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your AI-Powered Integration Plan
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From intelligent automation to enterprise-grade AI agents
            </p>
            
            {/* Monthly/Annual Toggle */}
            <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border">
              <button className="px-6 py-2 rounded-full text-sm font-medium transition-all bg-blue-600 text-white">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-all">
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Save 33%</span>
              </button>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            
            {/* Intelligent Starter */}
            <Card className="relative bg-white border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Intelligent Starter
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  £3,500
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for growing businesses ready for AI-powered integration</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">5 AI-Enhanced Integrations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">15 Intelligent Workflows</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">100,000 AI-Processed Tasks/month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Natural Language Configuration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Self-Healing Integrations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Predictive Health Monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">5 Sub-Tenant Accounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">2FA Security & Audit Logging</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Standard Support (Email + Chat)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Advanced Agentic AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Voice Control Interface</span>
                  </div>
                </div>
                <EnhancedButton 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Cognitive Professional - Most Popular */}
            <Card className="relative bg-white border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 hover:shadow-xl transform scale-105">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                  ⭐ MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🧠</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Cognitive Professional
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  £8,500
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Advanced AI capabilities for serious business transformation</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">15 AI-Enhanced Integrations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">50 Intelligent Workflows</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">500,000 AI-Processed Tasks/month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Advanced Agentic AI Agents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Voice Control Interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Conversational Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Cognitive Load Balancing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">15 Sub-Tenant Accounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Advanced 2FA + SSO</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Business Intelligence Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Priority Support (Phone + Email + Chat)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Custom Branding Options</span>
                  </div>
                </div>
                <EnhancedButton 
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Agentic Enterprise */}
            <Card className="relative bg-white border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Agentic Enterprise
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  Custom
                  <span className="text-lg font-normal text-gray-600"> Pricing</span>
                </div>
                <p className="text-gray-600">Ultimate AI-powered integration platform for large organizations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Unlimited AI-Enhanced Integrations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Custom AI Model Training</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">White-Label Platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Enterprise Security Suite</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">24/7 Dedicated Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">On-Premise Deployment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">99.99% Uptime SLA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Dedicated Success Manager</span>
                  </div>
                </div>
                <EnhancedButton className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Contact Sales
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>

          {/* Trust Elements */}
          <div className="text-center space-y-6">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-blue-600 font-semibold text-lg mb-2">7-Day Free Trial</div>
                <p className="text-gray-600 text-sm">No Credit Card Required</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-green-600 font-semibold text-lg mb-2">Cancel Anytime</div>
                <p className="text-gray-600 text-sm">No Long-term Contracts</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-purple-600 font-semibold text-lg mb-2">SOC 2 Compliant</div>
                <p className="text-gray-600 text-sm">& GDPR Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}