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
  Server,
  Lock,
  Key,
  Monitor,
  Activity,
  FileText,
  Search,
  Filter,
  BarChart,
  PieChart,
  LineChart,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  Timer,
  Fingerprint,
  UserCheck,
  GitBranch,
  Package
} from 'lucide-react';

export default function APIManagement() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://financeflo.ai/ipaas/api-management/#organization",
        "name": "IntelliFlow by FinanceFlo.ai",
        "url": "https://financeflo.ai/ipaas/api-management/",
        "logo": "https://financeflo.ai/intelliflow-logo.png",
        "description": "Cognitive API management platform with natural language configuration and predictive optimization"
      },
      {
        "@type": "Service",
        "@id": "https://financeflo.ai/ipaas/api-management/#service",
        "name": "Cognitive API Management Platform",
        "description": "Manage APIs with cognitive intelligence. Natural language configuration, predictive optimization, and autonomous scaling.",
        "provider": {
          "@type": "Organization",
          "@id": "https://financeflo.ai/ipaas/api-management/#organization"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <Helmet>
        <title>Cognitive API Management Platform | IntelliFlow | FinanceFlo.ai</title>
        <meta name="description" content="Manage APIs with cognitive intelligence. Natural language configuration, predictive optimization, and autonomous scaling." />
        <meta name="keywords" content="cognitive API management, AI-powered API, intelligent API platform, predictive optimization, autonomous scaling, IntelliFlow API" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/api-management/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Cognitive API Management Platform | IntelliFlow | FinanceFlo.ai" />
        <meta property="og:description" content="Manage APIs with cognitive intelligence. Natural language configuration, predictive optimization, and autonomous scaling." />
        <meta property="og:image" content="https://financeflo.ai/intelliflow-api-preview.jpg" />
        <meta property="og:url" content="https://financeflo.ai/ipaas/api-management/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IntelliFlow by FinanceFlo.ai" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cognitive API Management Platform | IntelliFlow" />
        <meta name="twitter:description" content="Manage APIs with cognitive intelligence. Natural language configuration and predictive optimization." />
        <meta name="twitter:image" content="https://financeflo.ai/intelliflow-api-preview.jpg" />
        
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
              <Bot className="w-4 h-4 mr-2" />
              AI-Powered API Intelligence
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Intelligent API Management &
              <span className="block">Cognitive Governance Platform</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your API strategy with the world's first AI-powered API management platform that thinks, learns, and optimizes automatically.
              Experience autonomous API lifecycle management with IntelliFlow's cognitive intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule AI Consultation
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <Bot className="w-5 h-5 mr-2" />
                Experience AI Demo
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive API Lifecycle */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Bot className="w-4 h-4 mr-2" />
              Cognitive AI Lifecycle
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              AI-Powered API Lifecycle Management
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the world's first cognitive API management platform where AI handles design, 
              development, and optimization automatically. Let intelligence transform your API strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                phase: "AI Design",
                title: "AI-Powered Design & Documentation",
                description: "Natural Language API Design: Describe APIs in plain English, AI creates specifications",
                icon: Lightbulb,
                features: [
                  "Natural Language API Design",
                  "Intelligent Documentation",
                  "Predictive API Evolution",
                  "Auto-generated specifications"
                ],
                aiFeatures: [
                  "Conversational API Design",
                  "Intelligent Documentation", 
                  "Predictive API Evolution"
                ],
                color: "from-cyan-500 to-blue-500"
              },
              {
                phase: "AI Development", 
                title: "Autonomous Development & Testing",
                description: "AI Code Generation: Automatic SDK generation for 20+ languages with intelligent testing",
                icon: Cpu,
                features: [
                  "AI Code Generation",
                  "Intelligent Test Creation",
                  "Predictive Quality Assurance",
                  "Autonomous SDK generation"
                ],
                aiFeatures: [
                  "AI Code Generation",
                  "Intelligent Test Creation",
                  "Predictive Quality Assurance"
                ],
                color: "from-blue-500 to-indigo-500"
              },
              {
                phase: "AI Monitor",
                title: "Cognitive Monitoring & Analytics",
                description: "Intelligent Anomaly Detection: AI identifies unusual patterns and optimizes performance",
                icon: Eye,
                features: [
                  "Intelligent Anomaly Detection",
                  "Predictive Performance Optimization",
                  "Autonomous Scaling",
                  "AI-powered insights"
                ],
                aiFeatures: [
                  "Intelligent Anomaly Detection",
                  "Predictive Performance Optimization",
                  "Autonomous Scaling"
                ],
                color: "from-indigo-500 to-purple-500"
              }
            ].map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs font-mono bg-cyan-50 text-cyan-600">
                      {phase.phase}
                    </Badge>
                    <div className={`p-2 bg-gradient-to-br ${phase.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <phase.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2">{phase.title}</CardTitle>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-800 flex items-center">
                        <Sparkles className="w-4 h-4 text-cyan-500 mr-2" />
                        AI Capabilities:
                      </h4>
                      <ul className="space-y-2">
                        {phase.aiFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-600">
                            <Bot className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="font-semibold mb-3 text-slate-800">Core Features:</h4>
                      <ul className="space-y-2">
                        {phase.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-slate-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Cognitive Intelligence
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Revolutionary AI Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of API management with IntelliFlow's breakthrough AI capabilities 
              that transform how you design, develop, and manage APIs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Conversational API Design",
                description: "Design APIs using natural language conversations with our AI assistant",
                icon: Bot,
                features: [
                  "Natural language specifications",
                  "AI-powered schema generation",
                  "Intelligent endpoint suggestions",
                  "Automated API documentation"
                ],
                highlight: "10x Faster Design"
              },
              {
                title: "Predictive Performance Optimization",
                description: "AI continuously monitors and optimizes API performance before issues occur",
                icon: TrendingUp,
                features: [
                  "Predictive load balancing",
                  "Automatic performance tuning",
                  "Resource optimization",
                  "Proactive scaling"
                ],
                highlight: "99.99% Uptime"
              },
              {
                title: "Autonomous Security Management",
                description: "AI-powered security that adapts and responds to threats in real-time",
                icon: Shield,
                features: [
                  "Threat pattern recognition",
                  "Adaptive rate limiting",
                  "Automated incident response",
                  "Security policy optimization"
                ],
                highlight: "Zero-Day Protection"
              },
              {
                title: "Intelligent Cost Optimization",
                description: "AI analyzes usage patterns to optimize costs and resource allocation",
                icon: DollarSign,
                features: [
                  "Usage pattern analysis",
                  "Cost forecasting",
                  "Resource right-sizing",
                  "Automated cost alerts"
                ],
                highlight: "60% Cost Reduction"
              },
              {
                title: "Natural Language Analytics",
                description: "Ask questions about your APIs in plain English and get instant insights",
                icon: Search,
                features: [
                  "Conversational analytics",
                  "Natural language queries",
                  "Automated report generation",
                  "Intelligent data visualization"
                ],
                highlight: "Instant Insights"
              },
              {
                title: "AI-Powered Developer Experience",
                description: "Intelligent developer portal that learns and adapts to user behavior",
                icon: Users,
                features: [
                  "Personalized documentation",
                  "Intelligent code examples",
                  "Adaptive tutorials",
                  "Smart error resolution"
                ],
                highlight: "300% Dev Productivity"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
                      <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-600 border-cyan-200">
                        {feature.highlight}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Governance Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Enterprise Security & Governance
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Protect your APIs with enterprise-grade security, compliance frameworks, 
              and comprehensive governance policies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentication & Authorization",
                description: "Multi-layered security with advanced authentication and fine-grained access control",
                icon: Lock,
                features: [
                  "OAuth 2.0 / OpenID Connect",
                  "JWT token management",
                  "API key authentication",
                  "Role-based access control (RBAC)",
                  "Multi-factor authentication",
                  "Single sign-on (SSO) integration"
                ],
                highlight: "99.9% Security Uptime"
              },
              {
                title: "Rate Limiting & Throttling",
                description: "Protect your APIs from abuse and ensure fair usage with intelligent rate limiting",
                icon: Gauge,
                features: [
                  "Dynamic rate limiting",
                  "Quota management",
                  "Spike arrest policies",
                  "Consumer-based limits",
                  "Geographic restrictions",
                  "Burst capacity handling"
                ],
                highlight: "Handles 10M+ Requests/Day"
              },
              {
                title: "Compliance & Auditing",
                description: "Meet regulatory requirements with comprehensive audit trails and compliance reporting",
                icon: ShieldCheck,
                features: [
                  "SOC 2 Type II compliance",
                  "GDPR data protection",
                  "HIPAA healthcare standards",
                  "PCI DSS for payments",
                  "Detailed audit logs",
                  "Compliance reporting"
                ],
                highlight: "Enterprise Compliance Ready"
              }
            ].map((security, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mr-4">
                      <security.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{security.title}</CardTitle>
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600">
                        {security.highlight}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">{security.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {security.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Monitoring Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Advanced Analytics & Monitoring
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Gain deep insights into API performance, usage patterns, and business impact 
              with our comprehensive analytics and monitoring platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Performance Monitoring",
                description: "Real-time performance metrics and SLA monitoring",
                icon: Activity,
                metrics: [
                  "Response time tracking",
                  "Throughput analysis", 
                  "Error rate monitoring",
                  "Availability metrics"
                ]
              },
              {
                title: "Usage Analytics",
                description: "Comprehensive usage patterns and consumer behavior",
                icon: BarChart,
                metrics: [
                  "API call volumes",
                  "Consumer analytics",
                  "Geographic usage",
                  "Trend analysis"
                ]
              },
              {
                title: "Business Intelligence",
                description: "Transform API data into actionable business insights",
                icon: PieChart,
                metrics: [
                  "Revenue attribution",
                  "ROI calculations",
                  "Market penetration",
                  "Growth forecasting"
                ]
              },
              {
                title: "Alerting & Notifications",
                description: "Proactive monitoring with intelligent alerting",
                icon: AlertTriangle,
                metrics: [
                  "Custom alert rules",
                  "Escalation policies",
                  "Multi-channel notifications",
                  "Incident management"
                ]
              }
            ].map((analytics, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mr-4">
                      <analytics.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">{analytics.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{analytics.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analytics.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Enterprise Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to manage, secure, and scale your API ecosystem 
              with enterprise-grade reliability and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Developer Portal",
                description: "Self-service portal for API consumers with documentation, testing tools, and support",
                icon: Users,
                features: [
                  "Interactive API documentation",
                  "Try-it-now functionality",
                  "SDK downloads",
                  "Community forums",
                  "Support ticketing"
                ]
              },
              {
                title: "API Gateway",
                description: "High-performance gateway with load balancing, caching, and transformation",
                icon: Network,
                features: [
                  "Load balancing",
                  "Response caching",
                  "Data transformation",
                  "Protocol translation",
                  "Circuit breaker patterns"
                ]
              },
              {
                title: "Version Management",
                description: "Comprehensive versioning strategy with backward compatibility and migration tools",
                icon: GitBranch,
                features: [
                  "Semantic versioning",
                  "Backward compatibility",
                  "Migration assistance",
                  "Deprecation policies",
                  "Version analytics"
                ]
              },
              {
                title: "Testing & Quality",
                description: "Automated testing suites with performance, security, and functional testing",
                icon: CheckCircle,
                features: [
                  "Automated test suites",
                  "Performance testing",
                  "Security scanning",
                  "Contract testing",
                  "Quality gates"
                ]
              },
              {
                title: "Monetization",
                description: "Flexible pricing models and billing integration for API monetization",
                icon: DollarSign,
                features: [
                  "Flexible pricing tiers",
                  "Usage-based billing",
                  "Revenue sharing",
                  "Payment processing",
                  "Financial reporting"
                ]
              },
              {
                title: "Integration Hub",
                description: "Pre-built connectors and integration templates for popular enterprise systems",
                icon: Puzzle,
                features: [
                  "Pre-built connectors",
                  "Integration templates",
                  "Workflow automation",
                  "Event-driven architecture",
                  "Custom integrations"
                ]
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mr-4">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our API management platform delivers quantifiable results that transform 
              your digital strategy and accelerate business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                metric: "75%",
                label: "Faster API Development",
                icon: Timer,
                description: "Accelerated development with reusable components"
              },
              {
                metric: "90%",
                label: "Reduced Integration Time",
                icon: Zap,
                description: "Pre-built connectors and templates"
              },
              {
                metric: "99.9%",
                label: "API Uptime",
                icon: Shield,
                description: "Enterprise-grade reliability and monitoring"
              },
              {
                metric: "300%",
                label: "Developer Productivity",
                icon: TrendingUp,
                description: "Self-service tools and documentation"
              }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
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

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Bot className="w-4 h-4 mr-2" />
              AI-Enhanced Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Intelligent API Management Plans
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of API management with AI-powered plans that deliver 
              unprecedented value and autonomous optimization capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                plan: "Intelligent Starter",
                price: "£3,500/month",
                originalPrice: "£2,500/month",
                description: "AI-powered API management for small teams and startups",
                features: [
                  "Up to 1M API calls/month",
                  "5 APIs with AI optimization",
                  "Intelligent analytics",
                  "AI-powered support",
                  "Smart developer portal",
                  "Autonomous security monitoring"
                ],
                aiFeatures: ["Basic AI optimization", "Smart analytics"],
                cta: "Start AI Trial"
              },
              {
                plan: "Cognitive Professional",
                price: "£9,500/month",
                originalPrice: "£7,500/month",
                description: "Advanced AI capabilities for growing API ecosystems",
                features: [
                  "Up to 10M API calls/month",
                  "25 APIs with cognitive management",
                  "Predictive analytics",
                  "AI-assisted development",
                  "Intelligent cost optimization",
                  "Autonomous scaling"
                ],
                aiFeatures: ["Predictive optimization", "AI development tools", "Cognitive insights"],
                popular: true,
                cta: "Get AI-Powered"
              },
              {
                plan: "Agentic Enterprise",
                price: "Custom Pricing",
                originalPrice: "Custom",
                description: "Full autonomous API management with Agentic AI",
                features: [
                  "Unlimited AI-optimized calls",
                  "Unlimited cognitive APIs",
                  "Agentic AI management",
                  "Dedicated AI consultant",
                  "Custom AI model training",
                  "Enterprise AI governance"
                ],
                aiFeatures: ["Full autonomy", "Agentic AI", "Custom AI training"],
                cta: "Contact AI Experts"
              }
            ].map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-cyan-500' : ''}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular AI Plan
                  </div>
                )}
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{plan.plan}</CardTitle>
                    <div className="text-3xl font-bold text-cyan-600 mb-1">{plan.price}</div>
                    <div className="text-sm text-slate-400 line-through mb-2">
                      Previously: {plan.originalPrice}
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-slate-800 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-cyan-500 mr-2" />
                        AI Capabilities:
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {plan.aiFeatures.map((feature, idx) => (
                          <Badge key={idx} className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <EnhancedButton 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white' : 'border-cyan-200 text-cyan-700 hover:bg-cyan-50'}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </EnhancedButton>
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
            Experience the Future of Intelligent API Management
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join the AI revolution in API management. Let IntelliFlow's cognitive intelligence 
            transform your API strategy with autonomous optimization and predictive capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-cyan-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Bot className="w-5 h-5 mr-2" />
              Schedule AI Demo
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Experience Cognitive APIs
            </EnhancedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

