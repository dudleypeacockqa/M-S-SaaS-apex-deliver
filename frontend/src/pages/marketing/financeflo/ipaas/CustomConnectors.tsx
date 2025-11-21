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
  Wrench,
  FileCode,
  Terminal,
  Package,
  Plug,
  Boxes,
  Hammer,
  Briefcase,
  Lock,
  Key,
  Fingerprint
} from 'lucide-react';

export default function CustomConnectors() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://financeflo.ai/ipaas/custom-connectors/#organization",
        "name": "IntelliFlow by FinanceFlo.ai",
        "url": "https://financeflo.ai/ipaas/custom-connectors/",
        "logo": "https://financeflo.ai/intelliflow-logo.png",
        "description": "AI-enhanced custom connectors with self-healing capabilities and autonomous optimization"
      },
      {
        "@type": "Service",
        "@id": "https://financeflo.ai/ipaas/custom-connectors/#service",
        "name": "AI-Enhanced Custom Connectors",
        "description": "Build intelligent custom connectors with AI assistance. 10x faster development, self-healing capabilities, and autonomous optimization.",
        "provider": {
          "@type": "Organization",
          "@id": "https://financeflo.ai/ipaas/custom-connectors/#organization"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <Helmet>
        <title>AI-Enhanced Custom Connectors | IntelliFlow | FinanceFlo.ai</title>
        <meta name="description" content="Build intelligent custom connectors with AI assistance. 10x faster development, self-healing capabilities, and autonomous optimization." />
        <meta name="keywords" content="AI-enhanced connectors, custom connectors, self-healing integrations, Agentic AI integration, intelligent connectors, IntelliFlow connectors" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/custom-connectors/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="AI-Enhanced Custom Connectors | IntelliFlow | FinanceFlo.ai" />
        <meta property="og:description" content="Build intelligent custom connectors with AI assistance. 10x faster development, self-healing capabilities, and autonomous optimization." />
        <meta property="og:image" content="https://financeflo.ai/intelliflow-connectors-preview.jpg" />
        <meta property="og:url" content="https://financeflo.ai/ipaas/custom-connectors/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IntelliFlow by FinanceFlo.ai" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-Enhanced Custom Connectors | IntelliFlow" />
        <meta name="twitter:description" content="Build intelligent custom connectors with AI assistance. 10x faster development and autonomous optimization." />
        <meta name="twitter:image" content="https://financeflo.ai/intelliflow-connectors-preview.jpg" />
        
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
              AI-Powered Integration Solutions
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              AI-Powered Custom Connectors &
              <span className="block">Intelligent Integration Solutions</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bridge any system with IntelliFlow's AI-enhanced custom connectors that learn, adapt, and optimize automatically. 
              Our intelligent development process delivers enterprise-grade integrations in record time.
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
                View AI Demo
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Enhanced Development Process */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Bot className="w-4 h-4 mr-2" />
              AI-Enhanced Process
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Intelligent Connector Development Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered methodology reduces development time by 10x while ensuring enterprise-grade 
              quality, security, and performance through autonomous intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                step: "01",
                title: "Intelligent Requirements Analysis",
                description: "Our NLP engine analyzes your system documentation and automatically identifies optimal integration patterns",
                icon: Bot,
                tasks: [
                  "Automated documentation analysis",
                  "AI-powered pattern recognition", 
                  "Intelligent requirement extraction",
                  "Smart compatibility assessment"
                ],
                color: "from-cyan-500 to-blue-500"
              },
              {
                step: "02", 
                title: "AI-Assisted Design & Architecture",
                description: "Machine learning suggests the most efficient connector architecture based on similar successful implementations",
                icon: Cpu,
                tasks: [
                  "ML-powered architecture design",
                  "Predictive performance modeling",
                  "Automated optimization strategies",
                  "Smart error handling patterns"
                ],
                color: "from-blue-500 to-indigo-500"
              },
              {
                step: "03",
                title: "Autonomous Development & Testing",
                description: "Agentic AI agents write, test, and optimize connector code with minimal human intervention",
                icon: Code,
                tasks: [
                  "AI-generated connector code",
                  "Automated testing suites",
                  "Performance optimization",
                  "Continuous quality assurance"
                ],
                color: "from-indigo-500 to-purple-500"
              },
              {
                step: "04",
                title: "Self-Monitoring Deployment",
                description: "AI continuously monitors connector performance and automatically implements optimizations",
                icon: Eye,
                tasks: [
                  "Intelligent deployment automation",
                  "Predictive monitoring setup",
                  "Self-healing capabilities",
                  "Autonomous optimization"
                ],
                color: "from-purple-500 to-pink-500"
              }
            ].map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs font-mono bg-cyan-50 text-cyan-600">
                      {phase.step}
                    </Badge>
                    <div className={`p-2 bg-gradient-to-br ${phase.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <phase.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2">{phase.title}</CardTitle>
                  <p className="text-sm text-slate-600">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Connector Types Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Custom Connector Specializations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We develop custom connectors for any system, protocol, or data format. 
              Our expertise spans legacy systems to cutting-edge cloud platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Cognitive Legacy Integration",
                description: "Connect decades-old systems with modern cloud platforms through AI-enhanced protocols and intelligent data transformation",
                icon: Database,
                specialties: [
                  "Mainframe connectivity (COBOL, JCL)",
                  "AS/400 & IBM i integration",
                  "Custom database protocols",
                  "File-based data exchange",
                  "Terminal emulation bridges"
                ],
                aiEnhancements: [
                  "Automatic protocol detection",
                  "Intelligent data mapping", 
                  "Predictive compatibility",
                  "Self-updating logic"
                ],
                complexity: "High",
                timeline: "2-4 weeks (10x faster with AI)",
                originalTimeline: "8-16 weeks"
              },
              {
                title: "Adaptive API Connectors", 
                description: "Build intelligent connectors for REST, SOAP, GraphQL, and proprietary web services with AI-powered adaptability",
                icon: Globe,
                specialties: [
                  "RESTful API integration",
                  "SOAP web services",
                  "GraphQL endpoints",
                  "Webhook implementations",
                  "Real-time data streaming"
                ],
                aiEnhancements: [
                  "Automatic versioning detection",
                  "Intelligent rate limiting",
                  "Predictive error handling", 
                  "Self-healing connections"
                ],
                complexity: "Medium",
                timeline: "1-2 weeks (5x faster with AI)",
                originalTimeline: "4-8 weeks"
              }
            ].map((connector, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4">
                      <connector.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{connector.title}</CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {connector.complexity} Complexity
                        </Badge>
                        <Badge className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                          {connector.timeline}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 line-through">
                        Previously: {connector.originalTimeline}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">{connector.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-800 flex items-center">
                        <Sparkles className="w-4 h-4 text-cyan-500 mr-2" />
                        AI Enhancements:
                      </h4>
                      <ul className="space-y-2">
                        {connector.aiEnhancements.map((enhancement, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-600">
                            <Bot className="w-4 h-4 text-cyan-500 mr-2 flex-shrink-0" />
                            {enhancement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="font-semibold mb-3 text-slate-800">Core Specializations:</h4>
                      <ul className="space-y-2">
                        {connector.specialties.map((specialty, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {specialty}
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

      {/* Security & Compliance Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Enterprise Security & Compliance
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All custom connectors are built with enterprise-grade security and compliance 
              requirements, ensuring your data remains protected and auditable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Data Encryption",
                description: "End-to-end encryption for data in transit and at rest",
                icon: Lock,
                features: [
                  "AES-256 encryption",
                  "TLS 1.3 protocols",
                  "Key rotation policies",
                  "Certificate management"
                ]
              },
              {
                title: "Authentication & Authorization",
                description: "Multi-layered security with advanced authentication methods",
                icon: Key,
                features: [
                  "OAuth 2.0 / OpenID Connect",
                  "API key management",
                  "Role-based access control",
                  "Multi-factor authentication"
                ]
              },
              {
                title: "Compliance Standards",
                description: "Built to meet industry-specific compliance requirements",
                icon: Shield,
                features: [
                  "SOC 2 Type II compliance",
                  "GDPR data protection",
                  "HIPAA healthcare standards",
                  "PCI DSS for payments"
                ]
              },
              {
                title: "Audit & Monitoring",
                description: "Comprehensive logging and monitoring for security oversight",
                icon: Eye,
                features: [
                  "Detailed audit trails",
                  "Real-time monitoring",
                  "Anomaly detection",
                  "Compliance reporting"
                ]
              }
            ].map((security, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4">
                      <security.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <CardTitle className="text-lg">{security.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{security.description}</p>
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

      {/* Technology Stack Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Development Technology Stack
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We leverage the latest technologies and frameworks to build high-performance, 
              scalable custom connectors that integrate seamlessly with your infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Programming Languages",
                technologies: [
                  { name: "Python", use: "Data processing & APIs" },
                  { name: "Java", use: "Enterprise integrations" },
                  { name: "Node.js", use: "Real-time connectors" },
                  { name: "C#/.NET", use: "Microsoft ecosystem" },
                  { name: "Go", use: "High-performance services" }
                ],
                icon: Code
              },
              {
                category: "Integration Frameworks",
                technologies: [
                  { name: "Apache Camel", use: "Enterprise integration patterns" },
                  { name: "Spring Integration", use: "Java-based connectors" },
                  { name: "MuleSoft Anypoint", use: "Platform connectors" },
                  { name: "Microsoft BizTalk", use: "Windows integrations" },
                  { name: "Custom SDKs", use: "Proprietary systems" }
                ],
                icon: Layers
              },
              {
                category: "Data & Messaging",
                technologies: [
                  { name: "Apache Kafka", use: "Event streaming" },
                  { name: "RabbitMQ", use: "Message queuing" },
                  { name: "Redis", use: "Caching & sessions" },
                  { name: "PostgreSQL", use: "Relational data" },
                  { name: "MongoDB", use: "Document storage" }
                ],
                icon: Database
              }
            ].map((stack, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mr-4">
                      <stack.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <CardTitle className="text-xl">{stack.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className="border-l-2 border-cyan-200 pl-3">
                        <div className="font-medium text-sm text-slate-800">{tech.name}</div>
                        <div className="text-xs text-slate-600">{tech.use}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Investment & Timeline
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transparent pricing based on complexity and scope. Every project includes 
              comprehensive documentation, testing, and ongoing support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                tier: "AI-Enhanced Simple Connector",
                price: "£25,000 - £35,000",
                originalPrice: "£15,000 - £25,000",
                timeline: "1-2 weeks",
                description: "AI-powered basic integration with intelligent data transformation and self-healing capabilities",
                features: [
                  "Single system integration",
                  "AI-optimized protocols",
                  "Intelligent data mapping",
                  "Predictive error handling",
                  "Self-monitoring capabilities",
                  "6 months AI support"
                ],
                complexity: "Low",
                aiFeatures: ["Auto-configuration", "Smart monitoring"]
              },
              {
                tier: "Cognitive Advanced Connector",
                price: "£35,000 - £65,000", 
                originalPrice: "£25,000 - £50,000",
                timeline: "2-4 weeks",
                description: "Intelligent multi-system integration with adaptive AI and autonomous optimization",
                features: [
                  "Multi-system integration",
                  "Adaptive AI protocols",
                  "Advanced ML transformation",
                  "Autonomous optimization",
                  "Predictive analytics",
                  "12 months AI support"
                ],
                complexity: "Medium",
                popular: true,
                aiFeatures: ["Adaptive learning", "Autonomous healing", "Predictive scaling"]
              },
              {
                tier: "Agentic Enterprise Connector",
                price: "£65,000+",
                originalPrice: "£50,000+",
                timeline: "3-6 weeks",
                description: "Mission-critical AI-native integration with full autonomous management and cognitive security",
                features: [
                  "Legacy system AI integration",
                  "Cognitive processing",
                  "AI security implementation",
                  "Autonomous optimization",
                  "Predictive load balancing",
                  "24/7 AI monitoring"
                ],
                complexity: "High",
                aiFeatures: ["Full autonomy", "Cognitive security", "Agentic AI"]
              }
            ].map((tier, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${tier.popular ? 'ring-2 ring-cyan-500' : ''}`}>
                {tier.popular && (
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{tier.tier}</CardTitle>
                    <div className="text-3xl font-bold text-cyan-600 mb-1">{tier.price}</div>
                    <div className="text-sm text-slate-400 line-through mb-2">
                      Previously: {tier.originalPrice}
                    </div>
                    <Badge variant="outline" className="mb-4 bg-cyan-50 text-cyan-600 border-cyan-200">{tier.timeline}</Badge>
                    <p className="text-sm text-slate-600">{tier.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-slate-800 flex items-center">
                        <Bot className="w-4 h-4 text-cyan-500 mr-2" />
                        AI Capabilities:
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tier.aiFeatures.map((feature, idx) => (
                          <Badge key={idx} className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <EnhancedButton 
                      className={`w-full ${tier.popular ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white' : 'border-cyan-200 text-cyan-700 hover:bg-cyan-50'}`}
                      variant={tier.popular ? "default" : "outline"}
                    >
                      Get Started with AI
                    </EnhancedButton>
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
            Ready to Experience AI-Powered Integration?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Let IntelliFlow's AI agents create the perfect connector solution for your unique requirements. 
            Experience the future of integration with autonomous development and self-healing technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-cyan-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Bot className="w-5 h-5 mr-2" />
              Schedule AI Consultation
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-white text-foreground hover:bg-white/10"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Watch AI Demo
            </EnhancedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

