import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Button as EnhancedButton } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import BreadcrumbNavigation from '@/components/marketing/financeflo/BreadcrumbNavigation';
import CalendarBooking from '@/components/marketing/financeflo/CalendarBooking';
import AIFeaturesShowcase from '@/components/marketing/financeflo/AIFeaturesShowcase';
import CustomerSuccessStories from '@/components/marketing/financeflo/CustomerSuccessStories';
import AIDemoSection from '@/components/marketing/financeflo/AIDemoSection';
import {
  CheckCircle,
  X,
  ArrowRight,
  Play,
  Calendar,
  Brain,
  Eye,
  TrendingUp,
  Bot,
  Zap,
  Shield,
  Target
} from 'lucide-react';

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "IntelliFlow",
      "url": "https://financeflo.ai/ipaas/",
      "logo": "https://financeflo.ai/images/intelliflow-logo.png",
      "description": "AI-powered iPaaS platform with Agentic AI technology"
    },
    {
      "@type": "Product",
      "name": "IntelliFlow - AI-Powered iPaaS Platform",
      "description": "The world's first Agentic AI-powered integration platform",
      "brand": {
        "@type": "Brand",
        "name": "IntelliFlow by FinanceFlo.ai"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "GBP",
        "lowPrice": "3500",
        "offerCount": "3",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "450"
      }
    }
  ]
};

const IntelliFlowPartnershipCompact = () => {
  const [showCalendar, setShowCalendar] = useState(false);

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

      {/* COMPACT Hero Section - Reduced from min-h-screen to fixed height */}
      <section className="relative py-16 overflow-hidden">
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
          <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/6 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column - Content */}
            <div className="space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-white text-sm font-medium">Trusted by 450+ UK Businesses</span>
              </div>

              {/* Main Headlines */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-white">Transform Your Business with</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                    IntelliFlow™
                  </span>
                </h1>

                <h2 className="text-xl lg:text-2xl text-cyan-100 font-semibold">
                  The World's First Agentic AI-Powered Integration Platform
                </h2>

                <p className="text-base lg:text-lg text-white/90 leading-relaxed">
                  Revolutionary AI technology that thinks, learns, and adapts to your business needs.
                  Experience autonomous integrations that heal themselves and optimize performance automatically.
                </p>
              </div>

              {/* 4 Key Differentiators - Compact Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🧠</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Agentic AI Engine™</h3>
                      <p className="text-white/70 text-xs">Autonomous decisions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🗣️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Natural Language</h3>
                      <p className="text-white/70 text-xs">Configure in English</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🔮</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Predictive Intel</h3>
                      <p className="text-white/70 text-xs">Prevent issues early</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🛠️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Self-Healing</h3>
                      <p className="text-white/70 text-xs">Zero maintenance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <EnhancedButton
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EnhancedButton>

                <EnhancedButton
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  onClick={() => setShowCalendar(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch AI Demo
                </EnhancedButton>
              </div>

              {/* Social Proof - Compact */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <span className="text-orange-300 font-bold">500% ROI</span>
                  <span className="text-white/80 text-sm ml-2">in 6 months</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <span className="text-green-300 font-bold">99.99%</span>
                  <span className="text-white/80 text-sm ml-2">uptime</span>
                </div>
              </div>
            </div>

            {/* Right Column - Compact AI Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-xs ml-2">intelliflow.ai/dashboard</span>
                    </div>
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                      AI ACTIVE
                    </div>
                  </div>
                </div>

                {/* Dashboard Content - Compact */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* AI Agents Working */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-800 font-semibold text-sm">Active AI Agents</h3>
                      <span className="text-green-600 text-xs font-medium">3 Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs">🤖</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-800">Integration Agent</div>
                          <div className="text-xs text-gray-600">Optimizing Salesforce → QuickBooks</div>
                        </div>
                        <div className="text-green-500 text-xs">Active</div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics - Compact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-600 mb-1">Success Rate</div>
                      <div className="text-xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-green-500">↗ Self-optimizing</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-600 mb-1">AI Efficiency</div>
                      <div className="text-xl font-bold text-blue-600">847%</div>
                      <div className="text-xs text-blue-500">↗ Learning</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Icons - Smaller */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                <span className="text-lg">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSOLIDATED Problem-Solution + Unique Mechanism Section - Reduced padding */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Problem-Solution Bridge */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Integration Nightmare Ends Here
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike basic automation tools, IntelliFlow's Agentic AI Engine™ operates like a team of expert integration specialists working 24/7
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Problems */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Traditional Integration Problems</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Manually configure every connection</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Constantly monitor for failures</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Hire expensive specialists for maintenance</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Accept downtime as "normal"</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">IntelliFlow AI Solutions</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Autonomous setup and optimization</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Self-healing integrations that never break</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Natural language configuration - no coding required</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 text-sm">Predictive maintenance prevents all downtime</span>
                </div>
              </div>
            </div>
          </div>

          {/* The Agentic AI Engine™ - Compact 4-card grid */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              The Agentic AI Engine™
            </h3>
            <p className="text-gray-600">
              Four core capabilities that set IntelliFlow apart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-base font-bold text-gray-900">🧠 Cognitive Processing</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-center text-sm">
                  Understands your business context and requirements
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-base font-bold text-gray-900">🔮 Predictive Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-center text-sm">
                  Forecasts and prevents issues before they occur
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-base font-bold text-gray-900">🔄 Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-center text-sm">
                  Continuously improves performance based on your usage
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-base font-bold text-gray-900">🤖 Autonomous Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-center text-sm">
                  Makes decisions and implements optimizations independently
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Success Stories - Unchanged but reusing existing component */}
      <CustomerSuccessStories />

      {/* AI Demo Section - Unchanged but reusing existing component */}
      <AIDemoSection />

      {/* Pricing Section - COMPACT with 3 tiers side-by-side, reduced padding */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your AI-Powered Integration Plan
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              From intelligent automation to enterprise-grade AI agents
            </p>
          </div>

          {/* Pricing Tiers - Compact Cards */}
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {/* Intelligent Starter */}
            <Card className="relative bg-white border-2 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  Intelligent Starter
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  £3,500
                  <span className="text-base font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-sm">Perfect for growing SMBs</p>
                <p className="text-gray-500 text-xs italic">ex-VAT (B2B only)</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">25 AI-Enhanced Integrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Self-Healing Technology</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Natural Language Configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Email Support</span>
                  </div>
                </div>
                <EnhancedButton
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Adaptive Pro */}
            <Card className="relative bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-4 pt-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  Adaptive Pro
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  £7,500
                  <span className="text-base font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-sm">For mid-market enterprises</p>
                <p className="text-gray-500 text-xs italic">ex-VAT (B2B only)</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">100 AI-Enhanced Integrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Advanced Predictive Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Multi-Agent AI Orchestration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Priority Support (Phone + Email)</span>
                  </div>
                </div>
                <EnhancedButton
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => window.location.href = '/ipaas/free-trial'}
                >
                  Start Free Trial
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Agentic Enterprise */}
            <Card className="relative bg-white border-2 hover:border-purple-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🏆</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  Agentic Enterprise
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  Custom
                  <span className="text-base font-normal text-gray-600"> Pricing</span>
                </div>
                <p className="text-gray-600 text-sm">For large organizations</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Unlimited AI Integrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Custom AI Model Training</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">White-Label Platform</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 text-sm">24/7 Dedicated Support</span>
                  </div>
                </div>
                <EnhancedButton className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Contact Sales
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>

          {/* Trust Elements - Compact */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <div className="text-blue-600 font-semibold mb-1">7-Day Free Trial</div>
              <p className="text-gray-600 text-xs">No Credit Card Required</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <div className="text-green-600 font-semibold mb-1">Cancel Anytime</div>
              <p className="text-gray-600 text-xs">No Long-term Contracts</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
              <div className="text-purple-600 font-semibold mb-1">SOC 2 Compliant</div>
              <p className="text-gray-600 text-xs">& GDPR Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALENDAR BOOKING SECTION - With proper height constraints and lazy loading */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Experience IntelliFlow?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Schedule a personalized demo with your actual systems. See exactly how IntelliFlow AI will transform your integrations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <EnhancedButton
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {showCalendar ? 'Hide Calendar' : 'Schedule Live Demo'}
              </EnhancedButton>
              <EnhancedButton
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/ipaas/free-trial'}
              >
                <Target className="h-5 w-5 mr-2" />
                Start Free Trial
              </EnhancedButton>
            </div>
          </div>

          {/* Calendar Widget - Lazy loaded with proper height constraints */}
          {showCalendar && (
            <div className="animate-in fade-in duration-500">
              <CalendarBooking
                className="max-w-3xl mx-auto"
                minHeight="650px"
              />
              <p className="text-center text-gray-500 text-sm mt-4">
                💡 Tip: Select a time that works best for your schedule. Our team will send a confirmation email with meeting details.
              </p>
            </div>
          )}

          {/* Show placeholder when calendar is hidden */}
          {!showCalendar && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center border-2 border-dashed border-blue-300">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar Ready</h3>
              <p className="text-gray-600 mb-4">Click "Schedule Live Demo" above to view available time slots</p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  <span>30-minute sessions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  <span>Available 9am-5pm GMT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section - Compact */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 450+ Businesses Powered by IntelliFlow AI
          </h2>

          <p className="text-lg text-blue-100 mb-8">
            Transform your operations with intelligent integration today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <EnhancedButton
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </EnhancedButton>
            <EnhancedButton
              size="lg"
              variant="outline"
              className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              onClick={() => setShowCalendar(true)}
            >
              <Calendar className="mr-2 h-6 w-6" />
              Schedule AI Demo
            </EnhancedButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm">
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

      <Footer />
    </div>
  );
};

export default IntelliFlowPartnershipCompact;
