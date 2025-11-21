import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { EnhancedButton } from '@/components/marketing/financeflo/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Network, 
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
  Map,
  Compass,
  Route,
  GitBranch,
  Briefcase,
  FileText,
  Search,
  Filter,
  Maximize,
  Minimize,
  Activity
} from 'lucide-react';

export default function IntegrationStrategy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://financeflo.ai/ipaas/integration-strategy/#organization",
        "name": "IntelliFlow by FinanceFlo.ai",
        "url": "https://financeflo.ai/ipaas/integration-strategy/",
        "logo": "https://financeflo.ai/intelliflow-logo.png",
        "description": "AI-first integration strategies with cognitive architecture for autonomous business ecosystems"
      },
      {
        "@type": "Service",
        "@id": "https://financeflo.ai/ipaas/integration-strategy/#service",
        "name": "AI-First Integration Strategy",
        "description": "Leverage AI-first integration strategies with IntelliFlow's cognitive architecture for autonomous, self-optimizing business ecosystems.",
        "provider": {
          "@type": "Organization",
          "@id": "https://financeflo.ai/ipaas/integration-strategy/#organization"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <Helmet>
        <title>AI-First Integration Strategy | IntelliFlow | FinanceFlo.ai</title>
        <meta name="description" content="Leverage AI-first integration strategies with IntelliFlow's cognitive architecture for autonomous, self-optimizing business ecosystems." />
        <meta name="keywords" content="AI-first integration, Agentic AI integration, intelligent integration platform, cognitive architecture, self-optimizing integrations, IntelliFlow strategy" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/integration-strategy/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="AI-First Integration Strategy | IntelliFlow | FinanceFlo.ai" />
        <meta property="og:description" content="Leverage AI-first integration strategies with IntelliFlow's cognitive architecture for autonomous, self-optimizing business ecosystems." />
        <meta property="og:image" content="https://financeflo.ai/intelliflow-strategy-preview.jpg" />
        <meta property="og:url" content="https://financeflo.ai/ipaas/integration-strategy/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IntelliFlow by FinanceFlo.ai" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-First Integration Strategy | IntelliFlow" />
        <meta name="twitter:description" content="Leverage AI-first integration strategies with cognitive architecture for autonomous business ecosystems." />
        <meta name="twitter:image" content="https://financeflo.ai/intelliflow-strategy-preview.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-blue-900/5 to-indigo-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Map className="w-4 h-4 mr-2" />
              Strategic Integration Planning
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Enterprise Integration
              <span className="block">Strategy & Architecture</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business with comprehensive integration planning and architecture services. 
              Our strategic approach ensures seamless connectivity across your entire technology ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Strategy Session
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download Framework Guide
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Framework Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              The FinanceFlo Integration Framework™
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our proven 5-phase methodology ensures successful integration outcomes 
              with measurable ROI and minimal business disruption.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-16">
            {[
              {
                phase: "01",
                title: "Discovery & Assessment",
                description: "Comprehensive analysis of current systems, data flows, and business requirements",
                icon: Search,
                color: "from-cyan-500 to-blue-500"
              },
              {
                phase: "02", 
                title: "Architecture Design",
                description: "Strategic blueprint for optimal integration patterns and technology selection",
                icon: Compass,
                color: "from-blue-500 to-indigo-500"
              },
              {
                phase: "03",
                title: "Implementation Planning",
                description: "Detailed roadmap with timelines, resources, and risk mitigation strategies",
                icon: Route,
                color: "from-indigo-500 to-purple-500"
              },
              {
                phase: "04",
                title: "Execution & Testing",
                description: "Phased deployment with continuous testing and quality assurance",
                icon: Activity,
                color: "from-purple-500 to-pink-500"
              },
              {
                phase: "05",
                title: "Optimization & Scale",
                description: "Performance tuning, monitoring setup, and scalability enhancement",
                icon: TrendingUp,
                color: "from-pink-500 to-red-500"
              }
            ].map((phase, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {phase.phase}
                    </Badge>
                    <phase.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <CardTitle className="text-lg">{phase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Patterns Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Enterprise Integration Patterns
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Leverage proven integration patterns tailored to your business requirements 
              and technical constraints for optimal performance and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Point-to-Point Integration",
                description: "Direct connections for simple, high-performance data exchange between critical systems",
                icon: Link,
                features: [
                  "Low latency data transfer",
                  "Minimal infrastructure overhead", 
                  "Direct system communication",
                  "Ideal for critical workflows"
                ],
                useCase: "Real-time financial data synchronization"
              },
              {
                title: "Hub & Spoke Architecture",
                description: "Centralized integration hub managing all system connections and data transformation",
                icon: Network,
                features: [
                  "Centralized data management",
                  "Simplified system connections",
                  "Enhanced data governance",
                  "Scalable architecture"
                ],
                useCase: "Multi-system ERP integration"
              },
              {
                title: "Event-Driven Architecture",
                description: "Asynchronous, event-based communication for loosely coupled, resilient systems",
                icon: Zap,
                features: [
                  "Real-time event processing",
                  "Loosely coupled systems",
                  "High scalability",
                  "Fault tolerance"
                ],
                useCase: "Business process automation"
              }
            ].map((pattern, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4">
                      <pattern.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <CardTitle className="text-xl">{pattern.title}</CardTitle>
                  </div>
                  <p className="text-slate-600">{pattern.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-800">Key Features:</h4>
                      <ul className="space-y-1">
                        {pattern.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-sm text-slate-500">
                        <strong>Use Case:</strong> {pattern.useCase}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Enterprise Technology Stack
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Best-in-class integration technologies and platforms to power your 
              digital transformation with reliability and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                category: "Integration Platforms",
                technologies: [
                  { name: "IntelliFlow", badge: "🏆 AI-Powered Leader", description: "The world's most intelligent iPaaS with Agentic AI", premium: true },
                  { name: "MuleSoft", description: "Enterprise integration platform" },
                  { name: "Boomi", description: "Cloud-based integration solution" },
                  { name: "Zapier", description: "Simple automation workflows" }
                ],
                icon: Layers,
                color: "from-cyan-500 to-blue-500"
              },
              {
                category: "API Management",
                technologies: [
                  { name: "Kong" },
                  { name: "Apigee" },
                  { name: "AWS API Gateway" },
                  { name: "Azure APIM" }
                ],
                icon: Code,
                color: "from-blue-500 to-indigo-500"
              },
              {
                category: "Data Processing",
                technologies: [
                  { name: "Apache Kafka" },
                  { name: "RabbitMQ" },
                  { name: "Azure Service Bus" },
                  { name: "AWS SQS" }
                ],
                icon: Database,
                color: "from-indigo-500 to-purple-500"
              },
              {
                category: "Cloud Platforms",
                technologies: [
                  { name: "AWS" },
                  { name: "Azure" },
                  { name: "Google Cloud" },
                  { name: "Salesforce" }
                ],
                icon: Cloud,
                color: "from-purple-500 to-pink-500"
              }
            ].map((stack, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stack.color} rounded-lg mr-4`}>
                      <stack.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{stack.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className={`${tech.premium ? 'p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200' : ''}`}>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${tech.premium ? 'font-semibold text-blue-700' : 'text-slate-600'}`}>
                                {tech.name}
                              </span>
                              {tech.badge && (
                                <Badge className="text-xs bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                                  {tech.badge}
                                </Badge>
                              )}
                            </div>
                            {tech.description && (
                              <p className={`text-xs mt-1 ${tech.premium ? 'text-blue-600' : 'text-slate-500'}`}>
                                {tech.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI-First Integration Strategy Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
              <Bot className="w-4 h-4 mr-2" />
              AI-First Integration Strategy
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Cognitive Integration Architecture
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Leverage IntelliFlow's Agentic AI to create self-managing, self-optimizing integration 
              ecosystems that adapt to your business evolution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Autonomous Operations",
                description: "AI agents handle 95% of integration management",
                icon: Bot,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Predictive Scaling",
                description: "AI forecasts capacity needs and auto-scales resources",
                icon: TrendingUp,
                color: "from-cyan-500 to-teal-500"
              },
              {
                title: "Intelligent Routing",
                description: "ML optimizes data paths for maximum performance",
                icon: Route,
                color: "from-teal-500 to-blue-500"
              },
              {
                title: "Cognitive Security",
                description: "AI-powered threat detection and response",
                icon: Shield,
                color: "from-blue-500 to-indigo-500"
              }
            ].map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${advantage.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <advantage.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{advantage.title}</h3>
                    <p className="text-sm text-slate-600">{advantage.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our strategic integration approach delivers quantifiable results 
              that transform your business operations and competitive advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                metric: "95%",
                label: "Reduction in Manual Configuration",
                icon: Bot,
                description: "IntelliFlow's NLP interface automates setup",
                isIntelliFlow: true
              },
              {
                metric: "99.99%",
                label: "System Uptime",
                icon: Shield,
                description: "Predictive maintenance prevents all downtime",
                isIntelliFlow: true
              },
              {
                metric: "10x",
                label: "Faster Implementation",
                icon: Zap,
                description: "Agentic AI automation accelerates deployment",
                isIntelliFlow: true
              },
              {
                metric: "85%",
                label: "Cost Savings",
                icon: DollarSign,
                description: "Autonomous operations reduce overhead",
                isIntelliFlow: true
              }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <stat.icon className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-slate-800 mb-1">{stat.metric}</div>
                    <div className="text-sm font-semibold text-slate-600 mb-2">{stat.label}</div>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Integration Strategy?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Let our integration experts design a comprehensive strategy that aligns 
            with your business objectives and technical requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-cyan-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Strategy Consultation
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-white text-blue-900 hover:bg-white/10"
            >
              <Phone className="w-5 h-5 mr-2" />
              Speak with Integration Expert
            </EnhancedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

