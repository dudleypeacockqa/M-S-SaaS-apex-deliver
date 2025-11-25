import React, { useState } from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { SageIntacctVSLHero } from "@/components/marketing/financeflo/SageIntacctVSLHero";
import { DemoVideoGrid } from "@/components/marketing/financeflo/DemoVideoGrid";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Shield, 
  Users, 
  Zap,
  Award,
  Star,
  ArrowRight,
  BarChart3,
  Target,
  Lightbulb,
  Rocket,
  Building,
  Phone,
  Play,
  Calculator,
  FileText,
  ChevronRight,
  Brain,
  Gauge,
  Lock,
  Workflow
} from "lucide-react";

export default function SageIntacctImplementation() {
  const [activeTab, setActiveTab] = useState("methodology");

  const demoVideos = [
    {
      id: "sage-overview",
      title: "Sage Intacct Complete Overview",
      description: "Comprehensive walkthrough of Sage Intacct capabilities and benefits",
      duration: "8:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/sage-intacct-overview.mp4",
      category: "overview",
      featured: true,
      viewCount: 2847
    },
    {
      id: "construction-demo",
      title: "Construction Industry Implementation",
      description: "Sage CRE integration and project accounting optimization",
      duration: "12:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/sage-construction-demo.mp4",
      category: "industry",
      featured: true,
      viewCount: 1923
    },
    {
      id: "ai-integration",
      title: "AI-Enhanced Sage Intacct",
      description: "Adaptive Intelligence Framework integration with Sage Intacct",
      duration: "6:15",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/sage-ai-integration.mp4",
      category: "ai",
      viewCount: 1456
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Sage Intacct VSL Hero Section */}
        <SageIntacctVSLHero />

        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Certified Sage Intacct Partner
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                500+ Implementations
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                98% Success Rate
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                30-Day Go-Live Guarantee
              </Badge>
            </div>
          </div>
        </section>

        {/* Best-Fit Selection Process */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <Target className="w-4 h-4 mr-2" />
                The FinanceFlo.ai Advantage
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                World-Class <span className="text-blue-600">Best-Fit Selection</span> Process
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our proprietary assessment methodology ensures Sage Intacct is the perfect fit for your business before implementation begins. 
                No guesswork, no surprises – just guaranteed success.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Intelligence Analysis</h3>
                    <p className="text-gray-600">Comprehensive evaluation of your current processes, pain points, and strategic objectives to ensure perfect alignment.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Architecture Assessment</h3>
                    <p className="text-gray-600">Deep-dive analysis of your existing systems, integration requirements, and technical infrastructure capabilities.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry-Specific Requirements</h3>
                    <p className="text-gray-600">Specialized evaluation for construction, healthcare, and professional services with industry-specific compliance needs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">ROI Projection & Business Case</h3>
                    <p className="text-gray-600">Detailed financial analysis with projected ROI, cost savings, and efficiency improvements specific to your business.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Implementation Roadmap Design</h3>
                    <p className="text-gray-600">Custom implementation plan with timelines, milestones, and success metrics tailored to your organization.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Business Analysis</span>
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Technical Evaluation</span>
                    <Workflow className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">ROI Projection</span>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Implementation Plan</span>
                    <Rocket className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                  Schedule Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  90-minute consultation • No obligation • Immediate insights
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Construction Industry Specialization */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-800">
                  <Building className="w-4 h-4 mr-2" />
                  Industry Specialization
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Construction Industry <span className="text-orange-600">Excellence</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  As specialists in construction ERP implementations, we understand the unique challenges of project accounting, 
                  job costing, and compliance requirements. Our Sage CRE + Sage Intacct integration expertise delivers 
                  unparalleled visibility and control for construction businesses.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Project Accounting Mastery</h3>
                      <p className="text-gray-600">Advanced job costing, change order management, and project profitability analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Sage CRE Integration</h3>
                      <p className="text-gray-600">Seamless integration between Sage CRE and Sage Intacct for unified operations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Compliance & Reporting</h3>
                      <p className="text-gray-600">WIP reporting, revenue recognition, and industry-specific compliance requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Real-Time Project Insights</h3>
                      <p className="text-gray-600">Live dashboards for project performance, cash flow, and profitability tracking</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-orange-600 hover:bg-orange-700 text-white">
                  View Construction Case Studies
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Construction Success Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                    <div className="text-gray-600 text-sm">Faster Project Close</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
                    <div className="text-gray-600 text-sm">Improved Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">67%</div>
                    <div className="text-gray-600 text-sm">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">400%</div>
                    <div className="text-gray-600 text-sm">ROI Achievement</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <Building className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Premier Construction Group</div>
                      <div className="text-gray-600 text-sm">£50M Annual Revenue</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "FinanceFlo.ai transformed our project accounting. We now have real-time visibility into every job's profitability."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Integration Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                <Brain className="w-4 h-4 mr-2" />
                AI-Enhanced Implementation
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Adaptive Intelligence Framework™ <span className="text-purple-600">Integration</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Transform Sage Intacct from a financial system into an intelligent business partner. 
                Our AI integration learns your workflows and optimizes performance continuously.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Intelligent Automation</h3>
                  <p className="text-gray-600 text-sm">AI-powered workflow optimization and process automation</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
                  <p className="text-gray-600 text-sm">Advanced forecasting and trend analysis capabilities</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Gauge className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Optimization</h3>
                  <p className="text-gray-600 text-sm">Continuous learning and system performance enhancement</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Intelligent Security</h3>
                  <p className="text-gray-600 text-sm">AI-powered security monitoring and threat detection</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    See AI Integration in Action
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Watch how our Adaptive Intelligence Framework™ transforms Sage Intacct into an intelligent, 
                    self-optimizing financial management system that grows smarter with your business.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Automated workflow optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Predictive cash flow analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Intelligent anomaly detection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Adaptive reporting and insights</span>
                    </div>
                  </div>

                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch AI Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-purple-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">AI Integration Demo</p>
                      <p className="text-gray-500 text-sm">6:15 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Videos Section */}
        <DemoVideoGrid 
          videos={demoVideos}
          title="Sage Intacct Implementation Demos"
          subtitle="See our world-class implementation process and results in action"
          showFilters={true}
        />

        {/* Implementation Excellence */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <Rocket className="w-4 h-4 mr-2" />
                Implementation Excellence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                World-Class Implementation Methodology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven 6-phase methodology ensures successful Sage Intacct implementations 
                with guaranteed results and minimal business disruption.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "methodology", label: "Implementation Process" },
                  { id: "guarantee", label: "Success Guarantee" },
                  { id: "support", label: "Ongoing Support" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "methodology" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      phase: "1",
                      title: "Discovery & Analysis",
                      description: "Comprehensive business analysis, requirements gathering, and stakeholder alignment.",
                      duration: "Week 1-2"
                    },
                    {
                      phase: "2",
                      title: "Design & Configuration",
                      description: "System architecture design, chart of accounts setup, and workflow configuration.",
                      duration: "Week 3-4"
                    },
                    {
                      phase: "3",
                      title: "Development & Integration",
                      description: "Custom development, third-party integrations, and data migration preparation.",
                      duration: "Week 5-6"
                    },
                    {
                      phase: "4",
                      title: "Testing & Validation",
                      description: "Comprehensive testing, user acceptance testing, and performance validation.",
                      duration: "Week 7-8"
                    },
                    {
                      phase: "5",
                      title: "Training & Deployment",
                      description: "User training, change management, and production deployment.",
                      duration: "Week 9-10"
                    },
                    {
                      phase: "6",
                      title: "Optimization & Support",
                      description: "Post-implementation optimization, ongoing support, and continuous improvement.",
                      duration: "Ongoing"
                    }
                  ].map((item) => (
                    <Card key={item.phase} className="p-6 border-green-200 hover:border-green-400 transition-colors">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-green-600 font-bold">{item.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {item.duration}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "guarantee" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="text-center mb-8">
                    <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">30-Day Go-Live Guarantee</h3>
                    <p className="text-xl text-gray-600">
                      We guarantee your Sage Intacct system will be live and operational within 30 days, or we'll refund your implementation fee.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">On-Time Delivery</h4>
                      <p className="text-gray-600 text-sm">Guaranteed project completion within agreed timeline</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Budget Adherence</h4>
                      <p className="text-gray-600 text-sm">No hidden costs or surprise charges during implementation</p>
                    </div>
                    <div className="text-center">
                      <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                      <p className="text-gray-600 text-sm">Comprehensive testing and validation before go-live</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Post-Implementation Support</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our relationship doesn't end at go-live. We provide ongoing support, optimization, and enhancement services 
                        to ensure your Sage Intacct investment continues to deliver value.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <Users className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support Team</h4>
                            <p className="text-gray-600">Direct access to your implementation team for ongoing support</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Clock className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">24/7 System Monitoring</h4>
                            <p className="text-gray-600">Proactive monitoring and maintenance of your Sage Intacct system</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Lightbulb className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Continuous Optimization</h4>
                            <p className="text-gray-600">Regular system reviews and optimization recommendations</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Zap className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Feature Updates & Training</h4>
                            <p className="text-gray-600">Regular training on new features and system capabilities</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Support Metrics</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Response Time</span>
                          <span className="text-2xl font-bold text-green-600">&lt; 2 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Issue Resolution Rate</span>
                          <span className="text-2xl font-bold text-green-600">99.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Client Satisfaction</span>
                          <span className="text-2xl font-bold text-green-600">4.9/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">System Uptime</span>
                          <span className="text-2xl font-bold text-green-600">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Finance Operations?
            </h2>
            <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto">
              Join 500+ businesses that have revolutionized their finance processes with our expert Sage Intacct implementations. 
              Start with our free best-fit assessment and discover your transformation potential.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Schedule Assessment</h3>
                <p className="text-green-100 text-sm mb-4">90-minute consultation with our experts</p>
                <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 w-full">
                  Book Now
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Implementation Guide</h3>
                <p className="text-green-100 text-sm mb-4">Comprehensive guide to Sage Intacct success</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 w-full">
                  Download
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ROI Calculator</h3>
                <p className="text-green-100 text-sm mb-4">Calculate your potential return on investment</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 w-full">
                  Calculate
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Best-Fit Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-green-100 text-sm mt-6">
              No obligation • Free consultation • Immediate insights • 30-day implementation guarantee
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

