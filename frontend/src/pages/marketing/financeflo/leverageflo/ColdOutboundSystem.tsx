import React, { useState } from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { VideoHeroSection } from "@/components/marketing/financeflo/VideoHeroSection";
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
  Phone,
  Mail,
  Play,
  Calculator,
  FileText,
  ChevronRight,
  Brain,
  Gauge,
  MessageSquare,
  Headphones,
  Globe,
  Smartphone,
  Bot,
  Mic,
  PhoneCall,
  MessageCircle,
  Calendar,
  BarChart,
  Workflow,
  Database,
  Settings,
  Monitor,
  Layers,
  Cpu,
  Activity,
  Timer,
  Volume2,
  Wifi,
  Lock,
  Eye,
  Filter,
  Search,
  UserCheck,
  TrendingDown,
  Repeat,
  RefreshCw
} from "lucide-react";

export default function ColdOutboundSystem() {
  const [activeTab, setActiveTab] = useState("overview");

  const demoVideos = [
    {
      id: "voice-ai-demo",
      title: "Voice AI Cold Outreach in Action",
      description: "Watch our Voice AI system generate qualified prospects automatically",
      duration: "8:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/voice-ai-outreach.mp4",
      category: "voice-ai",
      featured: true,
      viewCount: 3247
    },
    {
      id: "prospect-qualification",
      title: "Intelligent Prospect Qualification",
      description: "See how AI qualifies 800+ prospects monthly with human-like conversations",
      duration: "12:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/prospect-qualification.mp4",
      category: "qualification",
      featured: true,
      viewCount: 2156
    },
    {
      id: "multi-channel-demo",
      title: "Multi-Channel Outreach Coordination",
      description: "Voice AI + iMessage + SMS working together seamlessly",
      duration: "10:15",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/multi-channel-outreach.mp4",
      category: "integration",
      viewCount: 1834
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Enhanced Hero Section with Video */}
        <VideoHeroSection
          title="Generate 800+ Qualified Prospects Monthly While You Sleep"
          subtitle="The UK's most advanced Cold Outbound Nurturing with Voice AI system. Transform your lead generation with enterprise-level automation that never stops working."
          videoUrl="/videos/cold-outbound-hero.mp4"
          posterImage="/api/placeholder/1200/675"
          ctaText="Schedule Your Voice AI Demo"
          ctaLink="/contact"
          autoPlay={true}
          showControls={true}
        />

        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Bot className="w-4 h-4 mr-2" />
                800+ Prospects Monthly
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Multi-Regional Voice AI
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                Premium iMessage Integration
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                24/7 Automated Operation
              </Badge>
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-red-100 text-red-800">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  The Cold Outreach Problem
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Manual Outreach is <span className="text-red-600">Killing Your Growth</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Traditional cold outreach is time-intensive, inconsistent, and scales poorly. Your team spends 
                  hours on manual calls, emails, and follow-ups while qualified prospects slip through the cracks.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Time-Intensive Manual Processes</h3>
                      <p className="text-gray-600">Hours spent on repetitive calling and follow-up tasks</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Inconsistent Human Performance</h3>
                      <p className="text-gray-600">Variable quality, energy levels, and availability</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <BarChart className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Poor Scaling Capabilities</h3>
                      <p className="text-gray-600">Linear growth requires proportional team expansion</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Filter className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Missed Qualification Opportunities</h3>
                      <p className="text-gray-600">Prospects lost due to timing and follow-up gaps</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Manual Outreach Reality</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Daily Calls Possible</span>
                    <span className="text-2xl font-bold text-red-600">50-80</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Qualification Rate</span>
                    <span className="text-2xl font-bold text-red-600">2-5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Follow-up Consistency</span>
                    <span className="text-2xl font-bold text-red-600">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Operating Hours</span>
                    <span className="text-2xl font-bold text-red-600">8 hrs</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Monthly Result</h4>
                  <p className="text-3xl font-bold">50-150</p>
                  <p className="text-red-100">Qualified Prospects</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voice AI Solution Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Voice AI Revolution</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">Daily Calls Capacity</span>
                    <span className="text-2xl font-bold text-blue-600">1,000+</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">Qualification Rate</span>
                    <span className="text-2xl font-bold text-blue-600">15-25%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">Follow-up Consistency</span>
                    <span className="text-2xl font-bold text-blue-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">Operating Hours</span>
                    <span className="text-2xl font-bold text-blue-600">24/7</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Monthly Result</h4>
                  <p className="text-3xl font-bold">800+</p>
                  <p className="text-blue-100">Qualified Prospects</p>
                </div>
              </div>

              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-800">
                  <Rocket className="w-4 h-4 mr-2" />
                  The Voice AI Solution
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  <span className="text-blue-600">Intelligent Automation</span> That Never Sleeps
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Our enterprise-level Voice AI system operates 24/7, conducting human-like conversations, 
                  qualifying prospects intelligently, and nurturing leads through sophisticated multi-channel sequences.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">24/7 Automated Operation</h3>
                      <p className="text-gray-600">Never stops working, never takes breaks, always consistent</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Human-Like Intelligence</h3>
                      <p className="text-gray-600">Natural conversations that build rapport and trust</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Multi-Regional Capability</h3>
                      <p className="text-gray-600">UK, US, and South Africa voice AI deployment</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Intelligent Qualification</h3>
                      <p className="text-gray-600">Advanced AI determines prospect quality and intent</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white">
                  See Voice AI in Action
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Channel Integration */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                <Workflow className="w-4 h-4 mr-2" />
                Multi-Channel Intelligence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Three-Channel <span className="text-purple-600">Orchestrated</span> Approach
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our system coordinates Voice AI, premium iMessage, and intelligent SMS/Email sequences 
                for maximum engagement and conversion rates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center p-8 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneCall className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice AI Outreach</h3>
                  <p className="text-gray-600 mb-6">
                    Synthflow Voice AI conducts natural conversations, qualifies prospects, 
                    and schedules appointments automatically.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Daily Capacity</span>
                      <span className="font-semibold text-purple-600">1,000+ calls</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Qualification Rate</span>
                      <span className="font-semibold text-purple-600">15-25%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Operating Hours</span>
                      <span className="font-semibold text-purple-600">24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium iMessage</h3>
                  <p className="text-gray-600 mb-6">
                    SendBlue integration delivers premium iMessage experiences with 
                    higher engagement rates than traditional SMS.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Open Rate</span>
                      <span className="font-semibold text-purple-600">98%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-semibold text-purple-600">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Delivery Speed</span>
                      <span className="font-semibold text-purple-600">Instant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Sequences</h3>
                  <p className="text-gray-600 mb-6">
                    AI-powered SMS and email sequences adapt based on prospect behavior 
                    and engagement patterns.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sequence Length</span>
                      <span className="font-semibold text-purple-600">12+ touches</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Personalization</span>
                      <span className="font-semibold text-purple-600">AI-driven</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Optimization</span>
                      <span className="font-semibold text-purple-600">Continuous</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Orchestrated Intelligence
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Our system doesn't just use multiple channels – it intelligently coordinates them. 
                    Voice AI identifies the best prospects, iMessage delivers premium follow-up, 
                    and intelligent sequences nurture long-term relationships.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Cross-channel data synchronization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Behavioral trigger automation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Intelligent channel selection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Real-time optimization</span>
                    </div>
                  </div>

                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Multi-Channel Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-purple-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">Multi-Channel Coordination</p>
                      <p className="text-gray-500 text-sm">10:15 minutes</p>
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
          title="Cold Outbound Voice AI System Demos"
          subtitle="See our enterprise-level Voice AI system generate qualified prospects automatically"
          showFilters={true}
        />

        {/* Implementation Process */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800">
                <Rocket className="w-4 h-4 mr-2" />
                Implementation Excellence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                6-Phase Voice AI Deployment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven methodology ensures rapid deployment of your Voice AI system 
                with guaranteed results from day one.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "overview", label: "Implementation Overview" },
                  { id: "technology", label: "Technology Stack" },
                  { id: "results", label: "Expected Results" }
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

              {activeTab === "overview" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      phase: "1",
                      title: "Voice AI Configuration",
                      description: "Set up Synthflow Voice AI with custom conversation flows and regional optimization.",
                      duration: "Week 1"
                    },
                    {
                      phase: "2",
                      title: "Multi-Channel Integration",
                      description: "Connect SendBlue iMessage, SMS, and email systems with intelligent routing.",
                      duration: "Week 2"
                    },
                    {
                      phase: "3",
                      title: "Prospect Database Setup",
                      description: "Configure targeting parameters and import prospect lists with qualification criteria.",
                      duration: "Week 3"
                    },
                    {
                      phase: "4",
                      title: "Testing & Optimization",
                      description: "Comprehensive testing of all channels with performance optimization.",
                      duration: "Week 4"
                    },
                    {
                      phase: "5",
                      title: "Launch & Monitoring",
                      description: "Full system launch with real-time monitoring and performance tracking.",
                      duration: "Week 5"
                    },
                    {
                      phase: "6",
                      title: "Scaling & Enhancement",
                      description: "Scale operations and implement advanced AI features for maximum results.",
                      duration: "Week 6+"
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

              {activeTab === "technology" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Enterprise Technology Stack</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our Voice AI system leverages cutting-edge technologies to deliver 
                        enterprise-grade performance and reliability.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <Bot className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Synthflow Voice AI</h4>
                            <p className="text-gray-600">Advanced conversational AI with multi-regional deployment</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Database className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">GoHighLevel CRM</h4>
                            <p className="text-gray-600">247 custom fields and 154 custom values for complete prospect tracking</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Smartphone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">SendBlue iMessage</h4>
                            <p className="text-gray-600">Premium messaging platform for higher engagement rates</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Workflow className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">n8n Automation</h4>
                            <p className="text-gray-600">Workflow automation for seamless system integration</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">System Capabilities</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Concurrent Calls</span>
                          <span className="text-2xl font-bold text-blue-600">100+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Response Time</span>
                          <span className="text-2xl font-bold text-blue-600">&lt; 1s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Uptime</span>
                          <span className="text-2xl font-bold text-blue-600">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Data Security</span>
                          <span className="text-2xl font-bold text-blue-600">Enterprise</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "results" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Guaranteed Results Timeline</h3>
                    <p className="text-xl text-gray-600">
                      Track your progress from implementation to full-scale operation
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">30</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Days</h4>
                      <p className="text-gray-600 mb-4">Full system deployment</p>
                      <div className="text-2xl font-bold text-green-600">100+</div>
                      <div className="text-gray-500 text-sm">Qualified prospects</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">60</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Days</h4>
                      <p className="text-gray-600 mb-4">Optimization complete</p>
                      <div className="text-2xl font-bold text-blue-600">400+</div>
                      <div className="text-gray-500 text-sm">Qualified prospects</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">90</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Days</h4>
                      <p className="text-gray-600 mb-4">Full-scale operation</p>
                      <div className="text-2xl font-bold text-purple-600">800+</div>
                      <div className="text-gray-500 text-sm">Qualified prospects</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-600">∞</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Ongoing</h4>
                      <p className="text-gray-600 mb-4">Continuous scaling</p>
                      <div className="text-2xl font-bold text-orange-600">1,000+</div>
                      <div className="text-gray-500 text-sm">Monthly prospects</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Generate 800+ Prospects Monthly?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join the elite businesses using our Voice AI system to dominate their markets. 
              Start your transformation with a personalized Voice AI demonstration.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <PhoneCall className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Voice AI Demo</h3>
                <p className="text-blue-100 text-sm mb-4">See the system in action</p>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 w-full">
                  Book Demo
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ROI Calculator</h3>
                <p className="text-blue-100 text-sm mb-4">Calculate your potential return</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 w-full">
                  Calculate ROI
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Implementation Guide</h3>
                <p className="text-blue-100 text-sm mb-4">Complete deployment roadmap</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 w-full">
                  Download Guide
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Schedule Your Voice AI Demo
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-blue-100 text-sm mt-6">
              No setup fees • 30-day guarantee • 800+ prospects monthly • Enterprise support included
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

