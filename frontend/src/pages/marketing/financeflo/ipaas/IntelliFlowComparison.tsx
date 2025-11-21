import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Brain, 
  MessageSquare, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Star,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IntelliFlowComparison = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const comparisonCriteria = [
    {
      id: 'ai-capabilities',
      category: 'AI Capabilities',
      features: [
        {
          name: 'Agentic AI Automation',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: false,
          workato: 'partial',
          tooltip: 'AI agents that make decisions and take actions autonomously'
        },
        {
          name: 'Natural Language Processing',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: false,
          workato: false,
          tooltip: 'Configure integrations using plain English'
        },
        {
          name: 'Predictive Analytics',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: 'basic',
          workato: 'basic',
          tooltip: 'AI predicts and prevents integration issues'
        }
      ]
    },
    {
      id: 'ease-of-use',
      category: 'Ease of Use',
      features: [
        {
          name: 'Visual Workflow Builder',
          intelliflow: true,
          datablend: true,
          zapier: true,
          mulesoft: true,
          workato: true,
          tooltip: 'Drag-and-drop interface for building integrations'
        },
        {
          name: 'No-Code Configuration',
          intelliflow: true,
          datablend: 'partial',
          zapier: true,
          mulesoft: false,
          workato: 'partial',
          tooltip: 'Build integrations without writing code'
        },
        {
          name: 'Natural Language Config',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: false,
          workato: false,
          tooltip: 'Describe what you want in plain English'
        }
      ]
    },
    {
      id: 'reliability',
      category: 'Reliability',
      features: [
        {
          name: 'Self-Healing Integrations',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: false,
          workato: false,
          tooltip: 'AI automatically fixes broken integrations'
        },
        {
          name: 'Proactive Monitoring',
          intelliflow: true,
          datablend: 'basic',
          zapier: 'basic',
          mulesoft: true,
          workato: true,
          tooltip: 'Advanced AI-powered monitoring and alerts'
        },
        {
          name: '99.99% Uptime SLA',
          intelliflow: true,
          datablend: '99.5%',
          zapier: '99.9%',
          mulesoft: '99.9%',
          workato: '99.9%',
          tooltip: 'Enterprise-grade uptime guarantee'
        }
      ]
    },
    {
      id: 'scalability',
      category: 'Scalability',
      features: [
        {
          name: 'Enterprise-Ready',
          intelliflow: true,
          datablend: 'partial',
          zapier: false,
          mulesoft: true,
          workato: true,
          tooltip: 'Built for large enterprise deployments'
        },
        {
          name: 'Unlimited Workflows',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: true,
          workato: false,
          tooltip: 'No limits on the number of integrations'
        },
        {
          name: 'Multi-Region Deployment',
          intelliflow: true,
          datablend: false,
          zapier: 'partial',
          mulesoft: true,
          workato: 'partial',
          tooltip: 'Deploy across multiple geographic regions'
        }
      ]
    },
    {
      id: 'support',
      category: 'Support',
      features: [
        {
          name: '24/7 AI + Human Support',
          intelliflow: true,
          datablend: false,
          zapier: false,
          mulesoft: 'business',
          workato: 'enterprise',
          tooltip: 'Round-the-clock support with AI assistance'
        },
        {
          name: 'Dedicated Success Manager',
          intelliflow: true,
          datablend: 'enterprise',
          zapier: false,
          mulesoft: 'enterprise',
          workato: 'enterprise',
          tooltip: 'Personal account manager for your success'
        },
        {
          name: 'Migration Assistance',
          intelliflow: true,
          datablend: 'paid',
          zapier: false,
          mulesoft: 'paid',
          workato: 'paid',
          tooltip: 'Free help migrating from other platforms'
        }
      ]
    },
    {
      id: 'security',
      category: 'Security',
      features: [
        {
          name: 'SOC 2 Type II Certified',
          intelliflow: true,
          datablend: false,
          zapier: true,
          mulesoft: true,
          workato: true,
          tooltip: 'Highest level of security certification'
        },
        {
          name: 'GDPR Compliant',
          intelliflow: true,
          datablend: true,
          zapier: true,
          mulesoft: true,
          workato: true,
          tooltip: 'Full GDPR compliance for EU data protection'
        },
        {
          name: 'End-to-End Encryption',
          intelliflow: true,
          datablend: 'basic',
          zapier: true,
          mulesoft: true,
          workato: true,
          tooltip: 'All data encrypted in transit and at rest'
        }
      ]
    }
  ];

  const renderComparisonIcon = (value: boolean | string) => {
    if (value === true) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (value === false) {
      return <X className="h-5 w-5 text-red-500" />;
    } else if (value === 'partial' || value === 'basic') {
      return <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>;
    } else {
      return <span className="text-xs text-gray-600 font-medium">{value}</span>;
    }
  };

  const filteredCriteria = activeFilter === 'all' 
    ? comparisonCriteria 
    : comparisonCriteria.filter(criteria => criteria.id === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <Helmet>
        <title>IntelliFlow vs Competitors | AI-Powered iPaaS Platform Comparison | FinanceFlo.ai</title>
        <meta name="description" content="Compare IntelliFlow's agentic AI-powered iPaaS platform with DataBlend, Zapier, MuleSoft, and Workato. See why 450+ UK businesses choose IntelliFlow for intelligent enterprise integration with superior reliability and AI capabilities." />
        <meta name="keywords" content="IntelliFlow vs DataBlend, IntelliFlow vs Zapier, IntelliFlow vs MuleSoft, IntelliFlow vs Workato, AI iPaaS comparison, intelligent integration platform comparison, agentic AI integration" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/comparison" />
        
        {/* Schema.org for comparison page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "IntelliFlow Platform Comparison",
            "description": "Comprehensive comparison of AI-powered iPaaS platforms",
            "url": "https://financeflo.ai/ipaas/comparison",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "IntelliFlow",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "description": "AI-powered enterprise integration platform"
              }
            }
          })}
        </script>
        
        <meta name="geo.region" content="GB" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
            🏆 Platform Comparison
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-gray-900">Why Choose </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              IntelliFlow
            </span>
            <span className="text-gray-900"> Over Traditional iPaaS Platforms?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how IntelliFlow's revolutionary agentic AI-powered platform compares to DataBlend, Zapier, MuleSoft, and Workato 
            in delivering superior enterprise integration capabilities with intelligent automation and predictive analytics.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span className="text-sm font-medium text-gray-700">450+ Businesses Trust IntelliFlow</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span className="text-sm font-medium text-gray-700">99.99% Uptime Guaranteed</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span className="text-sm font-medium text-gray-700">SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className="text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              All Features
            </Button>
            {comparisonCriteria.map((criteria) => (
              <Button
                key={criteria.id}
                variant={activeFilter === criteria.id ? 'default' : 'outline'}
                onClick={() => setActiveFilter(criteria.id)}
                className="text-sm"
              >
                {criteria.category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="text-left p-6 font-bold">Features</th>
                    <th className="text-center p-6 font-bold bg-blue-700">
                      <div className="flex flex-col items-center">
                        <span>IntelliFlow</span>
                        <Badge className="bg-yellow-500 text-yellow-900 mt-1">AI-Powered</Badge>
                      </div>
                    </th>
                    <th className="text-center p-6 font-bold">DataBlend</th>
                    <th className="text-center p-6 font-bold">Zapier</th>
                    <th className="text-center p-6 font-bold">MuleSoft</th>
                    <th className="text-center p-6 font-bold">Workato</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCriteria.map((criteria, categoryIndex) => (
                    <React.Fragment key={criteria.id}>
                      <tr className="bg-gray-100">
                        <td colSpan={6} className="p-4 font-bold text-gray-900 border-t">
                          {criteria.category}
                        </td>
                      </tr>
                      {criteria.features.map((feature, featureIndex) => (
                        <tr key={feature.name} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4 font-medium text-gray-900 border-r">
                            <div className="flex items-center justify-between">
                              <span>{feature.name}</span>
                              <button
                                onClick={() => setExpandedFeature(expandedFeature === feature.name ? null : feature.name)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedFeature === feature.name ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                            {expandedFeature === feature.name && (
                              <p className="text-sm text-gray-600 mt-2">{feature.tooltip}</p>
                            )}
                          </td>
                          <td className="p-4 text-center bg-blue-50 border-r">
                            {renderComparisonIcon(feature.intelliflow)}
                          </td>
                          <td className="p-4 text-center border-r">
                            {renderComparisonIcon(feature.datablend)}
                          </td>
                          <td className="p-4 text-center border-r">
                            {renderComparisonIcon(feature.zapier)}
                          </td>
                          <td className="p-4 text-center border-r">
                            {renderComparisonIcon(feature.mulesoft)}
                          </td>
                          <td className="p-4 text-center">
                            {renderComparisonIcon(feature.workato)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Detailed Competitor Comparisons */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Detailed Platform Comparisons</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* IntelliFlow vs DataBlend */}
            <Card className="shadow-lg border-blue-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-xl">IntelliFlow vs DataBlend</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>300+ companies</strong> have switched from DataBlend to IntelliFlow for AI-powered automation and enterprise reliability.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Agentic AI vs manual workflows</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">99.99% vs 99.5% uptime SLA</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Self-healing integrations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Free migration assistance</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium text-sm">
                      💡 Migration Guarantee: Switch in 30 days or less with zero downtime
                    </p>
                  </div>
                  
                  <Link to="/ipaas/comparison/datablend">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Compare in Detail <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* IntelliFlow vs Zapier */}
            <Card className="shadow-lg border-purple-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-xl">IntelliFlow vs Zapier</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>Enterprise-grade AI</strong> vs basic automation. Built for scale, security, and enterprise compliance.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">SOC 2 Type II certified security</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Unlimited workflows vs usage limits</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">AI-powered predictive analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">24/7 enterprise support</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <p className="text-blue-800 font-medium text-sm">
                      📊 ROI Calculator: See potential savings vs Zapier Enterprise
                    </p>
                  </div>
                  
                  <Link to="/ipaas/comparison/zapier">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Compare in Detail <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Migration Support */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Hassle-Free Migration Support</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Switch from any platform with our dedicated migration team and zero-downtime guarantee.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">Free Migration</h3>
                <p className="text-sm text-blue-100">From any platform</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">30-Day Guarantee</h3>
                <p className="text-sm text-blue-100">Switch in 30 days or less</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">Migration Specialist</h3>
                <p className="text-sm text-blue-100">Dedicated expert support</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Zap className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold mb-2">Zero Downtime</h3>
                <p className="text-sm text-blue-100">Seamless transition</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/ipaas/free-trial">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Get Migration Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntelliFlowComparison;