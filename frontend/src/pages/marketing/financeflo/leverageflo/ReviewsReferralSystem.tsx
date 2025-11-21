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
  Octagon,
  Heart,
  ThumbsUp,
  Gift,
  Crown,
  Gem,
  Trophy,
  Medal,
  Bookmark,
  Flag,
  MapPin,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  Route,
  Map,
  Signpost,
  Milestone,
  Waypoints,
  UserPlus,
  UserMinus,
  UserX,
  Users2,
  UsersRound,
  UserCog,
  UserSearch,
  Handshake,
  HandHeart,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AlertTriangle,
  AlertCircle,
  Info,
  HelpCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  PlusCircle,
  DollarSign,
  PoundSterling,
  Euro,
  Banknote,
  CreditCard,
  Wallet,
  Coins,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Package,
  PartyPopper,
  Sparkle,
  Stars,
  Flame,
  Zap as ZapIcon,
  Bolt,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Tornado,
  Rainbow,
  Sunrise,
  Sunset
} from "lucide-react";

export default function ReviewsReferralSystem() {
  const [activeTab, setActiveTab] = useState("reputation");

  const demoVideos = [
    {
      id: "reputation-management",
      title: "Automated Reputation Management in Action",
      description: "Watch our AI system automatically manage and enhance your online reputation",
      duration: "11:20",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/reputation-management.mp4",
      category: "reputation",
      featured: true,
      viewCount: 3847
    },
    {
      id: "referral-automation",
      title: "Intelligent Referral Generation System",
      description: "See how AI turns satisfied customers into active revenue-generating ambassadors",
      duration: "9:45",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/referral-automation.mp4",
      category: "referrals",
      featured: true,
      viewCount: 2956
    },
    {
      id: "review-optimization",
      title: "Smart Review Collection & Optimization",
      description: "AI-powered review collection that maximizes positive feedback and minimizes negative impact",
      duration: "8:30",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/review-optimization.mp4",
      category: "reviews",
      viewCount: 2134
    },
    {
      id: "customer-journey",
      title: "Complete Customer Advocacy Journey",
      description: "From first purchase to brand ambassador - the complete automated transformation",
      duration: "13:15",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/videos/customer-journey.mp4",
      category: "journey",
      viewCount: 1876
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Enhanced Hero Section with Video */}
        <VideoHeroSection
          title="Transform Every Customer Into a Revenue-Generating Ambassador"
          subtitle="The UK's most intelligent reputation and referral automation system. Turn satisfied customers into your most powerful marketing channel with AI-driven advocacy that works 24/7."
          videoUrl="/videos/reviews-referral-hero.mp4"
          posterImage="/api/placeholder/1200/675"
          ctaText="See Customer Advocacy in Action"
          ctaLink="/contact"
          autoPlay={true}
          showControls={true}
        />

        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                4.9★ Average Rating
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                <UserPlus className="w-4 h-4 mr-2" />
                500% Referral Increase
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Automated Reputation Protection
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                <Handshake className="w-4 h-4 mr-2" />
                Customer Advocacy AI
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
                  The Reputation & Referral Problem
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Passive Reputation Management is <span className="text-red-600">Costing You Millions</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Your satisfied customers aren't becoming advocates, negative reviews damage your reputation, 
                  and referral opportunities slip away daily. Manual reputation management is reactive, 
                  inconsistent, and misses the majority of advocacy opportunities.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Frown className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Reactive Reputation Management</h3>
                      <p className="text-gray-600">Only responding to problems after they damage your brand</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <UserMinus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Missed Referral Opportunities</h3>
                      <p className="text-gray-600">Satisfied customers never asked to refer, leaving money on the table</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Manual Review Collection</h3>
                      <p className="text-gray-600">Time-intensive processes with low response rates</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Inconsistent Brand Advocacy</h3>
                      <p className="text-gray-600">No systematic approach to turning customers into advocates</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Frown className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Manual Reputation Reality</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Review Collection Rate</span>
                    <span className="text-2xl font-bold text-red-600">5%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Referral Conversion</span>
                    <span className="text-2xl font-bold text-red-600">2%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Response Time</span>
                    <span className="text-2xl font-bold text-red-600">3+ days</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">Advocacy Rate</span>
                    <span className="text-2xl font-bold text-red-600">1%</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Customer Lifetime Value</h4>
                  <p className="text-3xl font-bold">1x</p>
                  <p className="text-red-100">Single Purchase Value</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Advocacy AI Solution */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Advocacy AI</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Review Collection Rate</span>
                    <span className="text-2xl font-bold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Referral Conversion</span>
                    <span className="text-2xl font-bold text-green-600">35%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Response Time</span>
                    <span className="text-2xl font-bold text-green-600">Instant</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Advocacy Rate</span>
                    <span className="text-2xl font-bold text-green-600">45%</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white text-center">
                  <h4 className="text-xl font-bold mb-2">Customer Lifetime Value</h4>
                  <p className="text-3xl font-bold">8x</p>
                  <p className="text-green-100">Multiplied Value</p>
                </div>
              </div>

              <div>
                <Badge className="mb-4 bg-green-100 text-green-800">
                  <Rocket className="w-4 h-4 mr-2" />
                  The Customer Advocacy Solution
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  <span className="text-green-600">AI-Powered</span> Reputation & Referral Engine
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Our intelligent system automatically identifies satisfied customers, collects positive reviews, 
                  generates referrals, and protects your reputation. Every customer interaction becomes an 
                  opportunity for advocacy and revenue growth.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Proactive Reputation Management</h3>
                      <p className="text-gray-600">AI identifies and amplifies positive experiences automatically</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Intelligent Referral Generation</h3>
                      <p className="text-gray-600">Systematic conversion of customers into active advocates</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Automated Review Collection</h3>
                      <p className="text-gray-600">AI-optimized timing and messaging for maximum response</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Brand Protection Intelligence</h3>
                      <p className="text-gray-600">Real-time monitoring and response to reputation threats</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white">
                  See Customer Advocacy in Action
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Advocacy System Components */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-yellow-100 text-yellow-800">
                <Crown className="w-4 h-4 mr-2" />
                Complete Customer Advocacy System
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Four <span className="text-yellow-600">Intelligent</span> Advocacy Engines
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our unified system transforms every customer touchpoint into an advocacy opportunity 
                through intelligent review collection, referral generation, reputation management, and loyalty amplification.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="text-center p-8 border-yellow-200 hover:border-yellow-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Review Engine</h3>
                  <p className="text-gray-600 mb-6">
                    AI identifies the perfect moment to request reviews, personalizes messaging, 
                    and optimizes timing for maximum positive response rates.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Collection Rate</span>
                      <span className="font-semibold text-yellow-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Positive Rate</span>
                      <span className="font-semibold text-yellow-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-yellow-600">2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-yellow-200 hover:border-yellow-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Referral Generation AI</h3>
                  <p className="text-gray-600 mb-6">
                    Systematic identification and conversion of satisfied customers into 
                    active referral sources with intelligent incentive optimization.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Referral Rate</span>
                      <span className="font-semibold text-yellow-600">35%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-yellow-600">28%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revenue Increase</span>
                      <span className="font-semibold text-yellow-600">500%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 border-yellow-200 hover:border-yellow-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Reputation Protection AI</h3>
                  <p className="text-gray-600 mb-6">
                    Real-time monitoring across all platforms with intelligent response 
                    strategies and proactive reputation enhancement.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Monitoring Coverage</span>
                      <span className="font-semibold text-yellow-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-yellow-600">15 min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Issue Resolution</span>
                      <span className="font-semibold text-yellow-600">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-yellow-200 hover:border-yellow-400 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Loyalty Amplification Engine</h3>
                  <p className="text-gray-600 mb-6">
                    AI-driven loyalty programs that increase customer lifetime value 
                    and transform buyers into brand evangelists.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Retention Rate</span>
                      <span className="font-semibold text-yellow-600">94%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lifetime Value</span>
                      <span className="font-semibold text-yellow-600">8x</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Advocacy Rate</span>
                      <span className="font-semibold text-yellow-600">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Customer Journey Intelligence
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Our system doesn't just collect reviews and referrals – it creates intelligent 
                    customer journeys that maximize advocacy at every touchpoint. From first purchase 
                    to brand evangelism, every interaction is optimized for long-term value.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Behavioral trigger optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Personalized advocacy pathways</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Intelligent incentive matching</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Lifetime value maximization</span>
                    </div>
                  </div>

                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Customer Journey Demo
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-10 w-10 text-yellow-600 ml-1" />
                      </div>
                      <p className="text-gray-600 font-medium">Customer Advocacy Journey</p>
                      <p className="text-gray-500 text-sm">13:15 minutes</p>
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
          title="Reviews & Referral System Demos"
          subtitle="See our customer advocacy AI transform satisfied customers into revenue-generating ambassadors"
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
                4-Phase Customer Advocacy Deployment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven methodology ensures rapid deployment of your customer advocacy system 
                with measurable reputation and referral improvements from week one.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { id: "reputation", label: "Reputation Management" },
                  { id: "referrals", label: "Referral Generation" },
                  { id: "advocacy", label: "Customer Advocacy" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-yellow-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "reputation" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      phase: "1",
                      title: "Reputation Audit & Setup",
                      description: "Comprehensive analysis of current reputation and setup of monitoring systems.",
                      duration: "Week 1"
                    },
                    {
                      phase: "2",
                      title: "Review Collection Optimization",
                      description: "Deploy AI-powered review collection with personalized timing and messaging.",
                      duration: "Week 2"
                    },
                    {
                      phase: "3",
                      title: "Response Automation",
                      description: "Implement intelligent response systems for all review platforms.",
                      duration: "Week 3"
                    },
                    {
                      phase: "4",
                      title: "Reputation Enhancement",
                      description: "Launch proactive reputation building and protection strategies.",
                      duration: "Week 4+"
                    }
                  ].map((item) => (
                    <Card key={item.phase} className="p-6 border-yellow-200 hover:border-yellow-400 transition-colors">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-yellow-600 font-bold">{item.phase}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {item.duration}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "referrals" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Intelligent Referral System</h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Our AI identifies the perfect customers to become referral sources, 
                        optimizes incentive structures, and automates the entire referral process.
                      </p>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <UserCheck className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Customer Identification</h4>
                            <p className="text-gray-600">AI analyzes satisfaction scores and behavior patterns</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Gift className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Incentive Optimization</h4>
                            <p className="text-gray-600">Personalized rewards that maximize referral motivation</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Workflow className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Automated Tracking</h4>
                            <p className="text-gray-600">Complete referral journey tracking and attribution</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Trophy className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Success Amplification</h4>
                            <p className="text-gray-600">Recognition and rewards for top referral sources</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Referral Performance</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Referral Rate</span>
                          <span className="text-2xl font-bold text-yellow-600">35%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Conversion Rate</span>
                          <span className="text-2xl font-bold text-yellow-600">28%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Revenue Increase</span>
                          <span className="text-2xl font-bold text-yellow-600">500%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Customer LTV</span>
                          <span className="text-2xl font-bold text-yellow-600">8x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advocacy" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Customer Advocacy Timeline</h3>
                    <p className="text-xl text-gray-600">
                      Transform customers into brand ambassadors with our proven advocacy journey
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">1</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Week</h4>
                      <p className="text-gray-600 mb-4">Initial satisfaction tracking</p>
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-gray-500 text-sm">Review collection rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">2</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Weeks</h4>
                      <p className="text-gray-600 mb-4">Referral program launch</p>
                      <div className="text-2xl font-bold text-blue-600">35%</div>
                      <div className="text-gray-500 text-sm">Referral participation</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">4</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Weeks</h4>
                      <p className="text-gray-600 mb-4">Advocacy optimization</p>
                      <div className="text-2xl font-bold text-purple-600">45%</div>
                      <div className="text-gray-500 text-sm">Active advocacy rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-600">∞</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Ongoing</h4>
                      <p className="text-gray-600 mb-4">Brand evangelism</p>
                      <div className="text-2xl font-bold text-orange-600">8x</div>
                      <div className="text-gray-500 text-sm">Customer lifetime value</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Customers Into Ambassadors?
            </h2>
            <p className="text-xl text-yellow-100 mb-12 max-w-3xl mx-auto">
              Turn every satisfied customer into a revenue-generating advocate with our intelligent 
              reputation and referral system. Start building your customer advocacy empire today.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Star className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advocacy Demo</h3>
                <p className="text-yellow-100 text-sm mb-4">See customer transformation in action</p>
                <Button variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100 w-full">
                  Book Demo
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <Calculator className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ROI Calculator</h3>
                <p className="text-yellow-100 text-sm mb-4">Calculate advocacy potential</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600 w-full">
                  Calculate ROI
                </Button>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Advocacy Guide</h3>
                <p className="text-yellow-100 text-sm mb-4">Complete implementation roadmap</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600 w-full">
                  Download Guide
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100 text-lg px-8 py-4">
                See Customer Advocacy in Action
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-yellow-100 text-sm mt-6">
              No setup fees • 4-week deployment • 500% referral increase • Enterprise support included
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

