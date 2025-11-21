import React, { useState } from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { VideoHeroSection } from "@/components/marketing/financeflo/VideoHeroSection";
import { AcumaticaVSLHero } from "@/components/marketing/financeflo/AcumaticaVSLHero";
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
  Cloud,
  Smartphone,
  Globe,
  Phone,
  Mail,
  Play,
  Calculator,
  FileText,
  ChevronRight,
  Brain,
  Gauge,
  Lock,
  Workflow,
  Factory,
  Truck,
  Infinity as InfinityIcon,
  Wifi,
  RefreshCw,
  Database,
  Settings,
  Monitor,
  Layers
} from "lucide-react";

export default function AcumaticaImplementation() {
  const [activeTab, setActiveTab] = useState("methodology");

  const demoVideos = [
    {
      id: "acumatica-overview",
      title: "Acumatica Cloud ERP Complete Overview",
      description: "Comprehensive walkthrough of Acumatica's cloud-native capabilities",
      duration: "9:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/acumatica-overview.mp4",
      category: "overview",
      featured: true,
      viewCount: 3241
    },
    {
      id: "manufacturing-demo",
      title: "Manufacturing Excellence with Acumatica",
      description: "Production planning, shop floor connectivity, and quality management",
      duration: "11:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/acumatica-manufacturing.mp4",
      category: "industry",
      featured: true,
      viewCount: 2156
    },
    {
      id: "mobile-demo",
      title: "Mobile-First ERP Experience",
      description: "Full ERP functionality on any device, anywhere, anytime",
      duration: "7:20",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/acumatica-mobile.mp4",
      category: "mobile",
      viewCount: 1834
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Enhanced Hero Section with Video */}
        {/* Acumatica VSL Hero Section */}
        <AcumaticaVSLHero />

        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Certified Acumatica Partner
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <Cloud className="w-4 h-4 mr-2" />
                300+ Cloud Implementations
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <InfinityIcon className="w-4 h-4 mr-2" />
                Unlimited User Licensing
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile-First Design
              </Badge>
            </div>
          </div>
        </section>

        {/* Best-Fit Cloud Assessment Process */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <Target className="w-4 h-4 mr-2" />
                The FinanceFlo.ai Cloud Advantage
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                World-Class <span className="text-blue-600">Cloud Readiness</span> Assessment
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our proprietary cloud assessment methodology ensures Acumatica is the perfect fit for your business 
                transformation. No guesswork, no limitations – just unlimited cloud-powered growth.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Readiness Analysis</h3>
                    <p className="text-gray-600">Comprehensive evaluation of your current infrastructure, processes, and cloud migration requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalability Planning</h3>
                    <p className="text-gray-600">Strategic assessment of growth projections and unlimited user licensing benefits for your organization.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Strategy Design</h3>
                    <p className="text-gray-600">Evaluation of mobile workforce needs and design of mobile-first implementation strategy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Integration Architecture</h3>
                    <p className="text-gray-600">Cloud-native integration planning with existing systems and third-party applications.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud ROI Projection</h3>
                    <p className="text-gray-600">Detailed financial analysis of cloud benefits, cost savings, and unlimited growth potential.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Cloud Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Cloud Readiness</span>
                    <Cloud className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Scalability Planning</span>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mobile Strategy</span>
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">ROI Analysis</span>
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                  Schedule Free Cloud Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  90-minute consultation • No obligation • Immediate cloud insights
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing & Distribution Excellence */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-800">
                  <Factory className="w-4 h-4 mr-2" />
                  Industry Specialization
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Manufacturing & Distribution <span className="text-orange-600">Excellence</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  As specialists in manufacturing and distribution ERP implementations, we understand the unique challenges 
                  of production planning, inventory management, and supply chain optimization. Our Acumatica expertise 
                  delivers real-time visibility and unlimited scalability for growing manufacturers and distributors.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Production Planning & Control</h3>
                      <p className="text-gray-600">Advanced MRP, shop floor connectivity, and real-time production tracking</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Advanced Inventory Management</h3>
                      <p className="text-gray-600">Multi-location inventory, lot tracking, and automated replenishment</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Supply Chain Optimization</h3>
                      <p className="text-gray-600">End-to-end visibility, vendor management, and procurement automation</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Quality Management Systems</h3>
                      <p className="text-gray-600">Integrated QMS, compliance tracking, and regulatory reporting</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-orange-600 hover:bg-orange-700 text-white">
                  View Manufacturing Case Studies
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Manufacturing Success Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">78%</div>
                    <div className="text-gray-600 text-sm">Faster Production Cycles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">65%</div>
                    <div className="text-gray-600 text-sm">Inventory Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
                    <div className="text-gray-600 text-sm">Quality Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">450%</div>
                    <div className="text-gray-600 text-sm">ROI Achievement</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <Factory className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Advanced Manufacturing Solutions</div>
                      <div className="text-gray-600 text-sm">£75M Annual Revenue</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "Acumatica's cloud platform transformed our production planning. Real-time visibility across all locations increased efficiency by 78%."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unlimited Scalability Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                <InfinityIcon className="w-4 h-4 mr-2" />
                Unlimited Growth Potential
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Grow Without <span className="text-purple-600">Limits</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Acumatica's revolutionary unlimited user licensing means your ERP investment grows with your business. 
                No per-user fees, no artificial constraints – just unlimited potential for growth and expansion.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <InfinityIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Unlimited Users</h3>
                  <p className="text-gray-600 text-sm">No per-user licensing fees - add users as you grow</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Cost-Effective Growth</h3>
                  <p className="text-gray-600 text-sm">Predictable costs that don't increase with headcount</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Global Expansion</h3>
                  <p className="text-gray-600 text-sm">Multi-company, multi-currency, multi-location support</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Enterprise Features</h3>
                  <p className="text-gray-600 text-sm">Full enterprise capabilities at mid-market pricing</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    See Unlimited Growth in Action
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Watch how businesses leverage Acumatica's unlimited user licensing to scale operations, 
                    expand globally, and achieve unprecedented growth without ERP constraints.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Add unlimited users without additional fees</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Scale across multiple locations globally</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Enterprise features at predictable costs</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Future-proof investment protection</span>
                    </div>
                  </div>

                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Scalability Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-purple-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">Unlimited Growth Demo</p>
                      <p className="text-gray-500 text-sm">7:20 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-First Experience */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Mobile Excellence Metrics</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mobile Productivity Increase</span>
                    <span className="text-2xl font-bold text-blue-600">+40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Field Team Efficiency</span>
                    <span className="text-2xl font-bold text-blue-600">+65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Real-Time Data Access</span>
                    <span className="text-2xl font-bold text-blue-600">24/7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Offline Capability</span>
                    <span className="text-2xl font-bold text-blue-600">100%</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Mobile Distribution Solutions</div>
                      <div className="text-gray-600 text-sm">National Distribution Network</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "Our field teams now have full ERP access on mobile. Productivity increased 40% with real-time inventory and customer data."
                  </p>
                </div>
              </div>

              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-800">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile-First Design
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Full ERP Power <span className="text-blue-600">Anywhere</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Acumatica's mobile-first architecture delivers complete ERP functionality on any device. 
                  Your team can access real-time data, approve transactions, and manage operations from anywhere, 
                  with full offline capabilities and automatic synchronization.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Native Mobile Applications</h3>
                      <p className="text-gray-600">Purpose-built mobile apps with touch-optimized interface and native device integration</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Offline Synchronization</h3>
                      <p className="text-gray-600">Work offline and automatically sync when connectivity returns</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Real-Time Collaboration</h3>
                      <p className="text-gray-600">Instant notifications, approvals, and team communication</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Device Integration</h3>
                      <p className="text-gray-600">Camera, GPS, barcode scanning, and signature capture</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white">
                  Experience Mobile Demo
                  <Smartphone className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Videos Section */}
        <DemoVideoGrid 
          videos={demoVideos}
          title="Acumatica Cloud Implementation Demos"
          subtitle="See our world-class cloud implementation process and unlimited scalability in action"
          showFilters={true}
        />

        {/* Cloud Implementation Excellence */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <Rocket className="w-4 h-4 mr-2" />
                Cloud Implementation Excellence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Accelerated Cloud Deployment Methodology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven cloud-native methodology leverages Acumatica's architecture for rapid, 
                low-risk implementations with guaranteed results.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "methodology", label: "Cloud Implementation Process" },
                  { id: "guarantee", label: "Success Guarantee" },
                  { id: "support", label: "Cloud Support" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
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
                      title: "Cloud Readiness Assessment",
                      description: "Comprehensive evaluation of cloud migration requirements and infrastructure readiness.",
                      duration: "Week 1-2"
                    },
                    {
                      phase: "2",
                      title: "Cloud Architecture Design",
                      description: "Design optimal cloud configuration, integrations, and scalability planning.",
                      duration: "Week 3-4"
                    },
                    {
                      phase: "3",
                      title: "Rapid Cloud Configuration",
                      description: "Leverage cloud-native templates and automated configuration tools.",
                      duration: "Week 5-6"
                    },
                    {
                      phase: "4",
                      title: "Cloud Testing & Validation",
                      description: "Comprehensive cloud testing, performance validation, and security verification.",
                      duration: "Week 7-8"
                    },
                    {
                      phase: "5",
                      title: "Mobile Training & Adoption",
                      description: "Mobile-first training, change management, and user adoption strategies.",
                      duration: "Week 9-10"
                    },
                    {
                      phase: "6",
                      title: "Cloud Optimization",
                      description: "Post-deployment optimization, performance tuning, and continuous improvement.",
                      duration: "Ongoing"
                    }
                  ].map((item) => (
                    <Card key={item.phase} className="p-6 border-blue-200 hover:border-blue-400 transition-colors">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-blue-600 font-bold">{item.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
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
                    <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">30-Day Cloud Go-Live Guarantee</h3>
                    <p className="text-xl text-gray-600">
                      We guarantee your Acumatica cloud system will be live and operational within 30 days, 
                      or we'll refund your implementation fee.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Cloud-Speed Delivery</h4>
                      <p className="text-gray-600 text-sm">Guaranteed cloud deployment within agreed timeline</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Predictable Investment</h4>
                      <p className="text-gray-600 text-sm">Fixed costs with unlimited user licensing benefits</p>
                    </div>
                    <div className="text-center">
                      <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Cloud Excellence</h4>
                      <p className="text-gray-600 text-sm">Comprehensive cloud testing and performance validation</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Cloud Support</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our cloud support goes beyond traditional ERP support. We provide proactive cloud monitoring, 
                        optimization, and enhancement services to ensure your Acumatica investment delivers maximum value.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <Cloud className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">24/7 Cloud Monitoring</h4>
                            <p className="text-gray-600">Proactive monitoring of cloud performance and availability</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <RefreshCw className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Automatic Updates</h4>
                            <p className="text-gray-600">Seamless cloud updates with zero downtime deployment</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Gauge className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Performance Optimization</h4>
                            <p className="text-gray-600">Continuous cloud performance tuning and optimization</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Cloud Security</h4>
                            <p className="text-gray-600">Advanced security monitoring and compliance management</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Cloud Support Metrics</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cloud Uptime</span>
                          <span className="text-2xl font-bold text-blue-600">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Response Time</span>
                          <span className="text-2xl font-bold text-blue-600">&lt; 1 hour</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Issue Resolution</span>
                          <span className="text-2xl font-bold text-blue-600">99.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Client Satisfaction</span>
                          <span className="text-2xl font-bold text-blue-600">4.9/5</span>
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
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Unleash Unlimited Cloud Power?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join 300+ businesses that have transformed their operations with our expert Acumatica cloud implementations. 
              Start with our free cloud readiness assessment and discover your unlimited growth potential.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Cloud Assessment</h3>
                <p className="text-blue-100 text-sm mb-4">90-minute cloud readiness consultation</p>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 w-full">
                  Book Now
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Cloud Guide</h3>
                <p className="text-blue-100 text-sm mb-4">Complete guide to Acumatica cloud success</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 w-full">
                  Download
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Cloud ROI Calculator</h3>
                <p className="text-blue-100 text-sm mb-4">Calculate your unlimited growth potential</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 w-full">
                  Calculate
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Cloud Readiness Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Cloud Success Stories
              </Button>
            </div>

            <p className="text-blue-100 text-sm mt-6">
              No obligation • Free consultation • Immediate insights • 30-day cloud deployment guarantee
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

