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
  RefreshCw,
  Share2,
  MousePointer,
  Megaphone,
  LineChart,
  PieChart,
  Network,
  Crosshair,
  Radar,
  Magnet,
  Sparkles,
  Infinity as InfinityIcon,
  Shuffle,
  GitBranch,
  Layers3,
  Orbit,
  Compass,
  Telescope,
  Atom,
  Waves,
  Fingerprint,
  Scan,
  Focus,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Rewind,
  SkipForward,
  SkipBack,
  Pause,
  Square,
  Triangle,
  Circle,
  Hexagon,
  Pentagon,
  Octagon
} from "lucide-react";

export default function LeadGenerationAutomation() {
  const [activeTab, setActiveTab] = useState("ecosystem");

  const demoVideos = [
    {
      id: "marketing-ecosystem",
      title: "Complete Marketing Ecosystem in Action",
      description: "Watch our unified marketing automation coordinate all channels intelligently",
      duration: "12:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/marketing-ecosystem.mp4",
      category: "ecosystem",
      featured: true,
      viewCount: 4521
    },
    {
      id: "social-automation",
      title: "AI-Powered Social Media Automation",
      description: "See how AI creates, schedules, and optimizes social content automatically",
      duration: "8:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/social-automation.mp4",
      category: "social",
      featured: true,
      viewCount: 3247
    },
    {
      id: "ad-optimization",
      title: "Intelligent Ad Campaign Management",
      description: "AI-driven ad optimization that reduces costs while increasing conversions",
      duration: "10:15",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/ad-optimization.mp4",
      category: "advertising",
      viewCount: 2834
    },
    {
      id: "lead-scoring",
      title: "Advanced Lead Scoring & Routing",
      description: "Watch AI intelligently score and route leads for maximum conversion",
      duration: "9:20",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/lead-scoring.mp4",
      category: "automation",
      viewCount: 2156
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Enhanced Hero Section with Video */}
        <VideoHeroSection
          title="Turn Every Digital Touchpoint Into a Revenue Generator"
          subtitle="The UK's most intelligent marketing ecosystem automation. Transform disconnected marketing channels into a unified, AI-driven revenue machine that works 24/7."
          videoUrl="/videos/marketing-ecosystem-hero.mp4"
          posterImage="/api/placeholder/1200/675"
          ctaText="See Your Marketing Ecosystem Demo"
          ctaLink="/contact"
          autoPlay={true}
          showControls={true}
        />

        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <Network className="w-4 h-4 mr-2" />
                Unified Marketing Intelligence
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Optimization
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                300% ROI Improvement
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                <InfinityIcon className="w-4 h-4 mr-2" />
                Unlimited Scalability
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
                  The Disconnected Marketing Problem
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Fragmented Marketing is <span className="text-red-600">Bleeding Revenue</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Your marketing channels operate in silos, creating gaps where prospects fall through. 
                  Manual coordination wastes budget, misses opportunities, and delivers inconsistent messaging.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <GitBranch className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Siloed Marketing Channels</h3>
                      <p className="text-gray-600">Social media, ads, email, and content working independently</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Manual Coordination Overhead</h3>
                      <p className="text-gray-600">Hours spent on repetitive tasks and channel management</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Inconsistent Messaging</h3>
                      <p className="text-gray-600">Different messages across channels confuse prospects</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <BarChart className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Poor Attribution & Optimization</h3>
                      <p className="text-gray-600">Can't identify what's working or optimize effectively</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Fragmented Marketing Reality</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Channel Coordination</span>
                    <span className="text-2xl font-bold text-red-600">Manual</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Lead Attribution</span>
                    <span className="text-2xl font-bold text-red-600">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Budget Efficiency</span>
                    <span className="text-2xl font-bold text-red-600">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Message Consistency</span>
                    <span className="text-2xl font-bold text-red-600">Low</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Marketing ROI</h4>
                  <p className="text-3xl font-bold">2:1</p>
                  <p className="text-red-100">Return on Investment</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unified Marketing Intelligence Solution */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Network className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Unified Marketing Intelligence</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-900">Channel Coordination</span>
                    <span className="text-2xl font-bold text-purple-600">AI-Driven</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-900">Lead Attribution</span>
                    <span className="text-2xl font-bold text-purple-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-900">Budget Efficiency</span>
                    <span className="text-2xl font-bold text-purple-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-900">Message Consistency</span>
                    <span className="text-2xl font-bold text-purple-600">Perfect</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Marketing ROI</h4>
                  <p className="text-3xl font-bold">8:1</p>
                  <p className="text-purple-100">Return on Investment</p>
                </div>
              </div>

              <div>
                <Badge className="mb-4 bg-purple-100 text-purple-800">
                  <Rocket className="w-4 h-4 mr-2" />
                  The Unified Intelligence Solution
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  <span className="text-purple-600">AI-Orchestrated</span> Marketing Ecosystem
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Our intelligent marketing automation unifies all channels into a single, coordinated system. 
                  AI optimizes every touchpoint, maximizes attribution, and delivers consistent messaging across your entire ecosystem.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Unified Channel Orchestration</h3>
                      <p className="text-gray-600">All marketing channels work together intelligently</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Optimization</h3>
                      <p className="text-gray-600">Continuous learning and improvement across all touchpoints</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Complete Attribution Tracking</h3>
                      <p className="text-gray-600">Know exactly which touchpoints drive conversions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Intelligent Budget Allocation</h3>
                      <p className="text-gray-600">AI automatically optimizes spend for maximum ROI</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-purple-600 hover:bg-purple-700 text-white">
                  See Marketing Intelligence in Action
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Ecosystem Components */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <Layers3 className="w-4 h-4 mr-2" />
                Complete Marketing Ecosystem
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Six <span className="text-blue-600">Intelligent</span> Marketing Layers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our unified system coordinates social media, paid advertising, content marketing, 
                email automation, lead scoring, and analytics into one intelligent ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Share2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Intelligence</h3>
                  <p className="text-gray-600 mb-6">
                    AI creates, schedules, and optimizes social content across all platforms 
                    with intelligent engagement tracking.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Content Creation</span>
                      <span className="font-semibold text-blue-600">AI-Generated</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Posting Schedule</span>
                      <span className="font-semibold text-blue-600">Optimized</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Engagement Rate</span>
                      <span className="font-semibold text-blue-600">+150%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Megaphone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Ad Management</h3>
                  <p className="text-gray-600 mb-6">
                    AI-powered ad campaigns that automatically optimize targeting, 
                    bidding, and creative for maximum ROI.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cost Reduction</span>
                      <span className="font-semibold text-blue-600">40%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-blue-600">+200%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Optimization</span>
                      <span className="font-semibold text-blue-600">Real-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Automation Intelligence</h3>
                  <p className="text-gray-600 mb-6">
                    Behavioral trigger-based email sequences that adapt to prospect 
                    actions and engagement patterns.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Open Rate</span>
                      <span className="font-semibold text-blue-600">65%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Click Rate</span>
                      <span className="font-semibold text-blue-600">25%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Personalization</span>
                      <span className="font-semibold text-blue-600">AI-Driven</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Marketing AI</h3>
                  <p className="text-gray-600 mb-6">
                    Intelligent content creation, distribution, and optimization 
                    across all channels with performance tracking.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Content Creation</span>
                      <span className="font-semibold text-blue-600">Automated</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">SEO Optimization</span>
                      <span className="font-semibold text-blue-600">AI-Enhanced</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-semibold text-blue-600">+180%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Lead Scoring</h3>
                  <p className="text-gray-600 mb-6">
                    AI analyzes behavior across all touchpoints to score and route 
                    leads for maximum conversion probability.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Scoring Accuracy</span>
                      <span className="font-semibold text-blue-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-blue-600">+250%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-blue-600">Instant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Unified Analytics Intelligence</h3>
                  <p className="text-gray-600 mb-6">
                    Complete attribution tracking and predictive analytics across 
                    all marketing channels and touchpoints.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attribution</span>
                      <span className="font-semibold text-blue-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Predictive Accuracy</span>
                      <span className="font-semibold text-blue-600">88%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Reporting</span>
                      <span className="font-semibold text-blue-600">Real-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Ecosystem Intelligence
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Our system doesn't just automate individual channels – it creates intelligent 
                    connections between them. Social engagement triggers email sequences, ad performance 
                    influences content creation, and lead behavior optimizes all touchpoints.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Cross-channel behavioral triggers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Predictive content optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Intelligent budget reallocation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Unified customer journey mapping</span>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Ecosystem Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-blue-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">Marketing Ecosystem Intelligence</p>
                      <p className="text-gray-500 text-sm">12:30 minutes</p>
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
          title="Marketing Automation System Demos"
          subtitle="See our unified marketing intelligence coordinate all channels automatically"
          showFilters={true}
        />

        {/* Implementation Process */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-800">
                <Rocket className="w-4 h-4 mr-2" />
                Implementation Excellence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                5-Phase Marketing Ecosystem Deployment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven methodology ensures rapid deployment of your unified marketing ecosystem 
                with measurable results from week one.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "ecosystem", label: "Ecosystem Overview" },
                  { id: "integration", label: "Channel Integration" },
                  { id: "optimization", label: "AI Optimization" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "ecosystem" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      phase: "1",
                      title: "Channel Audit & Strategy",
                      description: "Comprehensive analysis of existing channels and development of unified strategy.",
                      duration: "Week 1"
                    },
                    {
                      phase: "2",
                      title: "Platform Integration",
                      description: "Connect all marketing platforms into unified ecosystem with data synchronization.",
                      duration: "Week 2"
                    },
                    {
                      phase: "3",
                      title: "AI Configuration",
                      description: "Set up intelligent automation, lead scoring, and optimization algorithms.",
                      duration: "Week 3"
                    },
                    {
                      phase: "4",
                      title: "Testing & Calibration",
                      description: "Comprehensive testing of all integrations with performance calibration.",
                      duration: "Week 4"
                    },
                    {
                      phase: "5",
                      title: "Launch & Optimization",
                      description: "Full ecosystem launch with continuous AI optimization and monitoring.",
                      duration: "Week 5+"
                    }
                  ].map((item) => (
                    <Card key={item.phase} className="p-6 border-purple-200 hover:border-purple-400 transition-colors">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-purple-600 font-bold">{item.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Badge variant="outline" className="text-purple-600 border-purple-600">
                          {item.duration}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "integration" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Seamless Channel Integration</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our ecosystem connects with 200+ marketing platforms and tools, 
                        creating unified data flow and intelligent coordination.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <Share2 className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Social Media Platforms</h4>
                            <p className="text-gray-600">Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Megaphone className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Advertising Platforms</h4>
                            <p className="text-gray-600">Google Ads, Facebook Ads, LinkedIn Ads, Microsoft Ads</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Mail className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Email & SMS Platforms</h4>
                            <p className="text-gray-600">Mailchimp, Klaviyo, SendGrid, Twilio, SendBlue</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <BarChart3 className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Analytics & CRM</h4>
                            <p className="text-gray-600">Google Analytics, HubSpot, Salesforce, Pipedrive</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Integration Capabilities</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Platform Connections</span>
                          <span className="text-2xl font-bold text-purple-600">200+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Data Sync Speed</span>
                          <span className="text-2xl font-bold text-purple-600">Real-time</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">API Reliability</span>
                          <span className="text-2xl font-bold text-purple-600">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Setup Time</span>
                          <span className="text-2xl font-bold text-purple-600">5 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "optimization" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">AI Optimization Timeline</h3>
                    <p className="text-xl text-gray-600">
                      Watch your marketing performance improve week by week with intelligent optimization
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">1</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Week</h4>
                      <p className="text-gray-600 mb-4">Initial optimization</p>
                      <div className="text-2xl font-bold text-green-600">+25%</div>
                      <div className="text-gray-500 text-sm">Performance improvement</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">4</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Weeks</h4>
                      <p className="text-gray-600 mb-4">AI learning complete</p>
                      <div className="text-2xl font-bold text-blue-600">+100%</div>
                      <div className="text-gray-500 text-sm">Performance improvement</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">8</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Weeks</h4>
                      <p className="text-gray-600 mb-4">Full optimization</p>
                      <div className="text-2xl font-bold text-purple-600">+200%</div>
                      <div className="text-gray-500 text-sm">Performance improvement</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-600">∞</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Ongoing</h4>
                      <p className="text-gray-600 mb-4">Continuous improvement</p>
                      <div className="text-2xl font-bold text-orange-600">+300%</div>
                      <div className="text-gray-500 text-sm">Performance improvement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Unify Your Marketing Ecosystem?
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
              Transform disconnected marketing channels into an intelligent, unified system that 
              generates 300% better ROI. Start with a personalized ecosystem demonstration.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Network className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ecosystem Demo</h3>
                <p className="text-purple-100 text-sm mb-4">See unified intelligence in action</p>
                <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                  Book Demo
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ROI Calculator</h3>
                <p className="text-purple-100 text-sm mb-4">Calculate ecosystem potential</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 w-full">
                  Calculate ROI
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ecosystem Guide</h3>
                <p className="text-purple-100 text-sm mb-4">Complete integration roadmap</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 w-full">
                  Download Guide
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                See Your Marketing Ecosystem Demo
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-purple-100 text-sm mt-6">
              No setup fees • 5-week deployment • 300% ROI improvement • Enterprise support included
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

