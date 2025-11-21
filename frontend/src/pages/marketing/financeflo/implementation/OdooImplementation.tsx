import React, { useState } from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { VideoHeroSection } from "@/components/marketing/financeflo/VideoHeroSection";
import { OdooVSLHero } from "@/components/marketing/financeflo/OdooVSLHero";
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
  Code,
  Puzzle,
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
  Wifi,
  RefreshCw,
  Database,
  Settings,
  Monitor,
  Layers,
  Unlock,
  DollarSign,
  Wrench,
  GitBranch,
  Package,
  Cpu,
  Heart,
  Building,
  ShoppingCart,
  Stethoscope,
  GraduationCap
} from "lucide-react";

export default function OdooImplementation() {
  const [activeTab, setActiveTab] = useState("methodology");

  const demoVideos = [
    {
      id: "odoo-overview",
      title: "Odoo Open-Source ERP Complete Overview",
      description: "Comprehensive walkthrough of Odoo's unlimited customization capabilities",
      duration: "10:15",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/odoo-overview.mp4",
      category: "overview",
      featured: true,
      viewCount: 2847
    },
    {
      id: "customization-demo",
      title: "Unlimited Customization in Action",
      description: "See how Odoo adapts to any business requirement with complete flexibility",
      duration: "12:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/odoo-customization.mp4",
      category: "customization",
      featured: true,
      viewCount: 1923
    },
    {
      id: "cost-savings-demo",
      title: "80% Cost Savings Demonstration",
      description: "Real-world comparison showing dramatic cost reductions vs proprietary ERP",
      duration: "8:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/odoo-cost-savings.mp4",
      category: "roi",
      viewCount: 1654
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Odoo VSL Hero Section */}
        <OdooVSLHero />
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-teal-100 text-teal-800 text-sm px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Certified Odoo Partner
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <Code className="w-4 h-4 mr-2" />
                200+ Open-Source Implementations
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Unlock className="w-4 h-4 mr-2" />
                100% Source Code Ownership
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <DollarSign className="w-4 h-4 mr-2" />
                80% Cost Reduction
              </Badge>
            </div>
          </div>
        </section>

        {/* Best-Fit Open-Source Assessment Process */}
        <section className="py-20 bg-gradient-to-br from-teal-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-teal-100 text-teal-800">
                <Target className="w-4 h-4 mr-2" />
                The FinanceFlo.ai Open-Source Advantage
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                World-Class <span className="text-teal-600">Open-Source Freedom</span> Assessment
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our proprietary open-source assessment methodology ensures Odoo is the perfect fit for your business 
                transformation. No vendor lock-in, no licensing constraints – just unlimited customization freedom.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Open-Source Readiness Analysis</h3>
                    <p className="text-gray-600">Comprehensive evaluation of your customization requirements and open-source migration strategy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customization Architecture Design</h3>
                    <p className="text-gray-600">Strategic planning of unlimited customization potential and modular development approach.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cost-Benefit Optimization</h3>
                    <p className="text-gray-600">Detailed analysis of cost savings potential and ROI maximization through open-source advantages.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Integration Freedom Planning</h3>
                    <p className="text-gray-600">Open-source integration strategy with unlimited API access and custom development capabilities.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Future-Proof Investment Strategy</h3>
                    <p className="text-gray-600">Long-term roadmap ensuring vendor independence and continuous evolution capabilities.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Open-Source Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Open-Source Readiness</span>
                    <Unlock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Customization Planning</span>
                    <Wrench className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Cost Optimization</span>
                    <DollarSign className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">ROI Analysis</span>
                    <Calculator className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
                <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white text-lg py-3">
                  Schedule Free Open-Source Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  90-minute consultation • No obligation • Immediate customization insights
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open-Source Freedom & Cost Savings */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-800">
                  <Unlock className="w-4 h-4 mr-2" />
                  Open-Source Freedom
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Complete <span className="text-green-600">Source Code Ownership</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Break free from vendor lock-in forever. With Odoo's open-source architecture, you own 100% of your 
                  source code, enjoy unlimited customization freedom, and achieve dramatic cost savings compared to 
                  proprietary ERP solutions. Your business, your rules, your code.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">100% Source Code Access</h3>
                      <p className="text-gray-600">Complete ownership and control with full source code transparency</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Zero Vendor Lock-In</h3>
                      <p className="text-gray-600">Freedom to modify, enhance, and evolve without vendor constraints</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Unlimited Customization</h3>
                      <p className="text-gray-600">Infinite modification possibilities to match exact business requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Community Innovation</h3>
                      <p className="text-gray-600">Access to 7 million+ users and 1,500+ community applications</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white">
                  View Open-Source Success Stories
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Open-Source ROI Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
                    <div className="text-gray-600 text-sm">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                    <div className="text-gray-600 text-sm">User License Fees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
                    <div className="text-gray-600 text-sm">Customization Potential</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                    <div className="text-gray-600 text-sm">Code Ownership</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Code className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Open-Source Manufacturing Solutions</div>
                      <div className="text-gray-600 text-sm">£50M Annual Revenue</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">
                    "Odoo's open-source freedom saved us £200k annually. Complete customization control transformed our operations beyond recognition."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unlimited Customization Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <Wrench className="w-4 h-4 mr-2" />
                Unlimited Customization
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Infinite <span className="text-blue-600">Customization</span> Possibilities
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Odoo's modular architecture and open-source foundation provide unlimited customization potential. 
                Build exactly what your business needs with 50+ integrated applications and thousands of community modules.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center p-6 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">50+ Core Apps</h3>
                  <p className="text-gray-600 text-sm">Integrated applications covering every business function</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Puzzle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">1,500+ Modules</h3>
                  <p className="text-gray-600 text-sm">Community-developed modules for specialized needs</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Development</h3>
                  <p className="text-gray-600 text-sm">Unlimited custom module creation and modification</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <GitBranch className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">API Integration</h3>
                  <p className="text-gray-600 text-sm">Open API architecture for seamless integrations</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    See Unlimited Customization in Action
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Watch how businesses leverage Odoo's open-source flexibility to create completely customized 
                    solutions that evolve with their unique requirements and industry demands.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Modify any feature to match exact requirements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Create industry-specific custom modules</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Integrate with any third-party system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Scale customizations without limitations</span>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Customization Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-blue-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">Unlimited Customization Demo</p>
                      <p className="text-gray-500 text-sm">12:30 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry-Agnostic Flexibility */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                <Globe className="w-4 h-4 mr-2" />
                Industry-Agnostic Flexibility
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Adaptable to <span className="text-purple-600">Any Industry</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Odoo's modular architecture adapts to any industry requirement. From manufacturing to healthcare, 
                e-commerce to professional services – unlimited customization makes anything possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Factory className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Manufacturing</h3>
                  <p className="text-gray-600 text-sm">Production planning, quality control, inventory management</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <ShoppingCart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">E-commerce</h3>
                  <p className="text-gray-600 text-sm">Multi-channel sales, inventory sync, customer management</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Building className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Services</h3>
                  <p className="text-gray-600 text-sm">Project management, time tracking, client billing</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <Stethoscope className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Healthcare</h3>
                  <p className="text-gray-600 text-sm">Patient management, compliance, regulatory reporting</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Non-Profit Organizations</h3>
                  <p className="text-gray-600">Donor management, grant tracking, volunteer coordination, impact reporting</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Institutions</h3>
                  <p className="text-gray-600">Student management, course planning, resource allocation, academic reporting</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Distribution & Logistics</h3>
                  <p className="text-gray-600">Supply chain optimization, warehouse management, delivery tracking</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Videos Section */}
        <DemoVideoGrid 
          videos={demoVideos}
          title="Odoo Open-Source Implementation Demos"
          subtitle="See our world-class open-source implementation process and unlimited customization in action"
          showFilters={true}
        />

        {/* Open-Source Implementation Excellence */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800">
                <Rocket className="w-4 h-4 mr-2" />
                Open-Source Implementation Excellence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Agile Open-Source Deployment Methodology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven open-source methodology leverages Odoo's flexibility for rapid, 
                highly customized implementations with guaranteed results.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "methodology", label: "Open-Source Implementation Process" },
                  { id: "guarantee", label: "Freedom Guarantee" },
                  { id: "support", label: "Open-Source Support" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200"
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
                      title: "Open-Source Requirements Analysis",
                      description: "Comprehensive evaluation of customization needs and open-source migration strategy.",
                      duration: "Week 1-2"
                    },
                    {
                      phase: "2",
                      title: "Custom Architecture Design",
                      description: "Design optimal open-source configuration and unlimited customization roadmap.",
                      duration: "Week 3-4"
                    },
                    {
                      phase: "3",
                      title: "Agile Custom Development",
                      description: "Rapid custom module development and community module integration.",
                      duration: "Week 5-8"
                    },
                    {
                      phase: "4",
                      title: "Open-Source Testing & Validation",
                      description: "Comprehensive testing of custom features and integration validation.",
                      duration: "Week 9-10"
                    },
                    {
                      phase: "5",
                      title: "User Empowerment Training",
                      description: "Open-source training, customization education, and user adoption strategies.",
                      duration: "Week 11-12"
                    },
                    {
                      phase: "6",
                      title: "Continuous Evolution",
                      description: "Post-deployment customization, community updates, and continuous improvement.",
                      duration: "Ongoing"
                    }
                  ].map((item) => (
                    <Card key={item.phase} className="p-6 border-teal-200 hover:border-teal-400 transition-colors">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-teal-600 font-bold">{item.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Badge variant="outline" className="text-teal-600 border-teal-600">
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
                    <Unlock className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Open-Source Freedom Guarantee</h3>
                    <p className="text-xl text-gray-600">
                      We guarantee 100% source code ownership, unlimited customization rights, and zero vendor lock-in, 
                      or we'll refund your implementation fee.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <Code className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Source Code Ownership</h4>
                      <p className="text-gray-600 text-sm">Guaranteed 100% source code access and ownership rights</p>
                    </div>
                    <div className="text-center">
                      <Unlock className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Zero Vendor Lock-In</h4>
                      <p className="text-gray-600 text-sm">Complete freedom to modify, enhance, and evolve</p>
                    </div>
                    <div className="text-center">
                      <Wrench className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Unlimited Customization</h4>
                      <p className="text-gray-600 text-sm">Infinite modification rights without restrictions</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Open-Source Support</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our open-source support goes beyond traditional ERP support. We provide community engagement, 
                        custom development, and continuous evolution services to maximize your open-source investment.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <GitBranch className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Community Integration</h4>
                            <p className="text-gray-600">Active participation in Odoo community and contribution management</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Code className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Custom Development</h4>
                            <p className="text-gray-600">Ongoing custom module development and enhancement services</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <RefreshCw className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Continuous Evolution</h4>
                            <p className="text-gray-600">Regular updates, improvements, and feature enhancements</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Shield className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Open-Source Security</h4>
                            <p className="text-gray-600">Security monitoring, updates, and vulnerability management</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Open-Source Support Metrics</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Code Ownership</span>
                          <span className="text-2xl font-bold text-teal-600">100%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Customization Freedom</span>
                          <span className="text-2xl font-bold text-teal-600">Unlimited</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Response Time</span>
                          <span className="text-2xl font-bold text-teal-600">&lt; 2 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Client Satisfaction</span>
                          <span className="text-2xl font-bold text-teal-600">4.8/5</span>
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
        <section className="py-20 bg-gradient-to-r from-teal-600 via-green-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Unleash Unlimited Open-Source Power?
            </h2>
            <p className="text-xl text-teal-100 mb-12 max-w-3xl mx-auto">
              Join 200+ businesses that have achieved complete vendor independence with our expert Odoo open-source implementations. 
              Start with our free open-source assessment and discover your unlimited customization potential.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Open-Source Assessment</h3>
                <p className="text-teal-100 text-sm mb-4">90-minute customization consultation</p>
                <Button variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 w-full">
                  Book Now
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Freedom Guide</h3>
                <p className="text-teal-100 text-sm mb-4">Complete guide to open-source success</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 w-full">
                  Download
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Cost Savings Calculator</h3>
                <p className="text-teal-100 text-sm mb-4">Calculate your 80% cost reduction</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 w-full">
                  Calculate
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Open-Source Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Freedom Success Stories
              </Button>
            </div>

            <p className="text-teal-100 text-sm mt-6">
              No obligation • Free consultation • Immediate insights • 100% source code ownership guarantee
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

