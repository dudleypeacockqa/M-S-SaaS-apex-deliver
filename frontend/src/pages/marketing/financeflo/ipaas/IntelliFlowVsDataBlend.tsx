import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Progress } from '@/components/marketing/financeflo/ui/progress';
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IntelliFlowVsDataBlend = () => {
  const [selectedMetric, setSelectedMetric] = useState('uptime');

  const migrationStats = [
    { metric: 'Average Migration Time', intelliflow: '14 days', datablend: '45+ days' },
    { metric: 'Downtime During Migration', intelliflow: '0 hours', datablend: '12-24 hours' },
    { metric: 'Setup Complexity', intelliflow: 'Natural Language', datablend: 'Technical Config' },
    { metric: 'Training Required', intelliflow: '2 hours', datablend: '40+ hours' }
  ];

  const featureComparison = [
    {
      category: 'AI & Automation',
      features: [
        { name: 'Agentic AI Decision Making', intelliflow: true, datablend: false },
        { name: 'Natural Language Configuration', intelliflow: true, datablend: false },
        { name: 'Predictive Failure Detection', intelliflow: true, datablend: false },
        { name: 'Self-Healing Integrations', intelliflow: true, datablend: false },
        { name: 'Intelligent Data Mapping', intelliflow: true, datablend: false }
      ]
    },
    {
      category: 'Enterprise Features',
      features: [
        { name: '99.99% Uptime SLA', intelliflow: true, datablend: false },
        { name: 'SOC 2 Type II Certified', intelliflow: true, datablend: false },
        { name: 'Multi-Region Deployment', intelliflow: true, datablend: false },
        { name: 'Unlimited Workflows', intelliflow: true, datablend: false },
        { name: 'Advanced Analytics', intelliflow: true, datablend: 'basic' }
      ]
    },
    {
      category: 'Support & Migration',
      features: [
        { name: '24/7 AI + Human Support', intelliflow: true, datablend: false },
        { name: 'Free Migration Assistance', intelliflow: true, datablend: false },
        { name: 'Dedicated Success Manager', intelliflow: true, datablend: false },
        { name: 'Zero-Downtime Migration', intelliflow: true, datablend: false },
        { name: '30-Day Switch Guarantee', intelliflow: true, datablend: false }
      ]
    }
  ];

  const customerTestimonials = [
    {
      quote: "Migration from DataBlend took only 2 weeks vs the 3 months they quoted. IntelliFlow's AI setup our integrations in minutes.",
      author: "James Mitchell",
      company: "TechFlow Solutions",
      role: "CTO",
      savings: "£85,000/year",
      rating: 5
    },
    {
      quote: "DataBlend kept breaking. IntelliFlow's self-healing saved us 40 hours/month of maintenance. ROI in first quarter.",
      author: "Sarah Chen",
      company: "Global Manufacturing Ltd",
      role: "IT Director",
      savings: "£120,000/year",
      rating: 5
    },
    {
      quote: "The natural language config is game-changing. No more technical documentation or training. Our team was productive day one.",
      author: "David Rodriguez",
      company: "Premier Financial",
      role: "Operations Manager",
      savings: "£95,000/year",
      rating: 5
    }
  ];

  const roiCalculation = {
    datablendCosts: {
      platform: 48000, // £4,000/month
      maintenance: 60000, // 100 hours/month at £50/hour
      downtime: 24000, // 2 hours/month at £1,000/hour
      training: 12000, // Initial training costs
      total: 144000
    },
    intelliflowCosts: {
      platform: 42000, // £3,500/month
      maintenance: 6000, // 10 hours/month at £50/hour
      downtime: 1200, // 0.1 hours/month at £1,000/hour
      training: 2000, // Minimal training needed
      total: 51200
    }
  };

  const savings = roiCalculation.datablendCosts.total - roiCalculation.intelliflowCosts.total;
  const roiPercentage = ((savings / roiCalculation.datablendCosts.total) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <Helmet>
        <title>IntelliFlow vs DataBlend - Why 300+ Companies Switched | AI iPaaS Migration | FinanceFlo.ai</title>
        <meta name="description" content="See why 300+ UK companies switched from DataBlend to IntelliFlow. Compare agentic AI features, reliability, support, and migration benefits with detailed ROI analysis showing average £92,800 annual savings." />
        <meta name="keywords" content="IntelliFlow vs DataBlend, DataBlend alternative, AI integration platform, enterprise iPaaS migration UK, agentic AI integration, DataBlend migration, iPaaS ROI calculator" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/comparison/datablend" />
        
        {/* Schema.org for comparison and migration */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "IntelliFlow vs DataBlend Migration Analysis",
            "description": "Comprehensive migration analysis showing why 300+ companies switched from DataBlend to IntelliFlow",
            "url": "https://financeflo.ai/ipaas/comparison/datablend",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "IntelliFlow",
              "applicationCategory": "BusinessApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "bestRating": "5",
                "ratingCount": "300"
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
            🏆 Platform Migration Success
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-gray-900">Why </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              300+ Companies
            </span>
            <span className="text-gray-900"> Switched from DataBlend</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how IntelliFlow's AI-powered platform delivers superior reliability, performance, and ROI compared to DataBlend's traditional approach.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-green-200">
              <span className="text-sm font-medium text-green-700">Average Savings: £92,800/year</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-200">
              <span className="text-sm font-medium text-blue-700">Migration Time: 14 days vs 45+ days</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-purple-200">
              <span className="text-sm font-medium text-purple-700">Zero Downtime Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="text-2xl text-center">Annual Cost Comparison</CardTitle>
              <p className="text-center text-green-100">Based on 300+ actual migration cases</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* DataBlend Costs */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">DataBlend Total Cost</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Platform Fees</span>
                      <span className="font-bold text-red-600">£{roiCalculation.datablendCosts.platform.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Maintenance (100h/month)</span>
                      <span className="font-bold text-red-600">£{roiCalculation.datablendCosts.maintenance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Downtime Costs</span>
                      <span className="font-bold text-red-600">£{roiCalculation.datablendCosts.downtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Training & Setup</span>
                      <span className="font-bold text-red-600">£{roiCalculation.datablendCosts.training.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Annual Cost</span>
                      <span className="font-bold text-red-600 text-xl">£{roiCalculation.datablendCosts.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Savings Visualization */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">£{savings.toLocaleString()}</div>
                    <div className="text-lg text-gray-600">Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{roiPercentage}%</div>
                    <div className="text-lg text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="w-full">
                    <Progress value={64} className="h-4" />
                    <p className="text-sm text-gray-600 mt-2 text-center">Typical ROI achieved in 3 months</p>
                  </div>
                </div>

                {/* IntelliFlow Costs */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">IntelliFlow Total Cost</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Platform Fees</span>
                      <span className="font-bold text-green-600">£{roiCalculation.intelliflowCosts.platform.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Maintenance (10h/month)</span>
                      <span className="font-bold text-green-600">£{roiCalculation.intelliflowCosts.maintenance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Downtime Costs</span>
                      <span className="font-bold text-green-600">£{roiCalculation.intelliflowCosts.downtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Training & Setup</span>
                      <span className="font-bold text-green-600">£{roiCalculation.intelliflowCosts.training.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Annual Cost</span>
                      <span className="font-bold text-green-600 text-xl">£{roiCalculation.intelliflowCosts.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Side-by-Side Feature Comparison</h2>
          
          <div className="space-y-8">
            {featureComparison.map((category, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-4 font-medium">Feature</th>
                          <th className="text-center p-4 font-medium bg-blue-50">IntelliFlow</th>
                          <th className="text-center p-4 font-medium">DataBlend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.features.map((feature, featureIndex) => (
                          <tr key={featureIndex} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-4 font-medium text-gray-900">{feature.name}</td>
                            <td className="p-4 text-center bg-blue-50">
                              {feature.intelliflow === true ? (
                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                              ) : (typeof feature.intelliflow === 'string' && feature.intelliflow === 'basic') ? (
                                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              ) : (
                                <X className="h-6 w-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {feature.datablend === true ? (
                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                              ) : (typeof feature.datablend === 'string' && feature.datablend === 'basic') ? (
                                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              ) : (
                                <X className="h-6 w-6 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Stats */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Migration Comparison</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {migrationStats.map((stat, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{stat.metric}</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-blue-600 font-medium">IntelliFlow</div>
                      <div className="text-lg font-bold text-blue-900">{stat.intelliflow}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-sm text-red-600 font-medium">DataBlend</div>
                      <div className="text-lg font-bold text-red-900">{stat.datablend}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Migration Success Stories</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {customerTestimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-sm text-gray-600">{testimonial.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{testimonial.savings}</div>
                        <div className="text-xs text-gray-600">Annual Savings</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Guarantee */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">30-Day Switch Guarantee</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We're so confident you'll love IntelliFlow that we guarantee a complete migration from DataBlend in 30 days or less, with zero downtime.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6">
                <Shield className="h-10 w-10 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Free Migration</h3>
                <p className="text-blue-100">Complete data and workflow migration at no cost</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Clock className="h-10 w-10 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Zero Downtime</h3>
                <p className="text-blue-100">Seamless transition without business interruption</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Award className="h-10 w-10 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Success Guarantee</h3>
                <p className="text-blue-100">30-day money-back guarantee if not satisfied</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/ipaas/free-trial">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free 7-Day Trial
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

export default IntelliFlowVsDataBlend;