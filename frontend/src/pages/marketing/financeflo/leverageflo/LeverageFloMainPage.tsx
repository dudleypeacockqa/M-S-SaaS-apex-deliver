import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { 
  Bot, 
  MessageSquare, 
  Phone, 
  Mail, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Shield
} from 'lucide-react';

const LeverageFloMainPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Voice AI Technology",
      description: "Personalised voice messages that sound authentically human, creating genuine connections at scale",
      benefit: "87% higher response rates"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Multi-Channel Automation",
      description: "Simultaneous outreach across SMS, iMessage, email, WhatsApp, and voice calls",
      benefit: "10x-100x lead increase"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Intelligent Targeting",
      description: "AI-powered prospect analysis and hyper-personalised messaging for each contact",
      benefit: "75% cost reduction"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Adaptive Learning",
      description: "System continuously optimises messaging, timing, and channels based on engagement",
      benefit: "300% conversion improvement"
    }
  ];

  const caseStudies = [
    {
      company: "TechFlow Solutions",
      industry: "Mid-Market Consultancy",
      before: "12 leads/month",
      after: "500+ qualified prospects",
      timeframe: "8 weeks",
      improvement: "4,000% increase"
    },
    {
      company: "Manufacturing Solutions UK",
      industry: "Industrial Manufacturing",
      before: "£2M annual revenue",
      after: "£8M annual revenue",
      timeframe: "18 months",
      improvement: "300% growth"
    },
    {
      company: "Digital Marketing Agency Leeds",
      industry: "Professional Services",
      before: "Inconsistent pipeline",
      after: "1,200 qualified leads",
      timeframe: "3 months",
      improvement: "£450K new business"
    }
  ];

  const benefits = [
    "No expensive sales teams required",
    "Risk-free market expansion",
    "Automated lead qualification",
    "Predictable revenue streams",
    "Scalable without hiring",
    "Real-time performance analytics"
  ];

  return (
    <>
      <Helmet>
        <title>LeverageFlo - Automated Cold Outreach System | FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Transform your lead generation with LeverageFlo - the world's most advanced automated cold outreach system. Generate 10x-100x more qualified leads with voice AI and multi-channel automation." 
        />
        <meta name="keywords" content="automated cold outreach, voice AI, lead generation, multi-channel automation, B2B sales, LeverageFlo" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center bg-purple-500/20 rounded-full px-6 py-2 mb-6">
                <Bot className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Revolutionary Lead Generation Technology</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Generate 10x-100x More
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                  Qualified Leads
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-2xl">
                LeverageFlo combines voice AI technology with multi-channel automation to create 
                the world's most advanced automated cold outreach system.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/leverageflo/application')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Apply for LeverageFlo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/leverageflo/demo')}
                  className="border-2 border-white/80 text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 bg-white/10 backdrop-blur-sm"
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">500+</div>
                  <div className="text-sm text-purple-200">Leads/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">75%</div>
                  <div className="text-sm text-purple-200">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">87%</div>
                  <div className="text-sm text-purple-200">Response Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">14</div>
                  <div className="text-sm text-purple-200">Days Setup</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-6">Multi-Channel Outreach</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <Phone className="w-5 h-5 text-purple-300" />
                    <span>Voice AI Calls</span>
                    <div className="ml-auto bg-green-500 text-xs px-2 py-1 rounded">Active</div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <MessageSquare className="w-5 h-5 text-blue-300" />
                    <span>SMS & iMessage</span>
                    <div className="ml-auto bg-green-500 text-xs px-2 py-1 rounded">Active</div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <Mail className="w-5 h-5 text-green-300" />
                    <span>Email Sequences</span>
                    <div className="ml-auto bg-green-500 text-xs px-2 py-1 rounded">Active</div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <Bot className="w-5 h-5 text-yellow-300" />
                    <span>WhatsApp Automation</span>
                    <div className="ml-auto bg-green-500 text-xs px-2 py-1 rounded">Active</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Most Advanced Lead Generation Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LeverageFlo's Adaptive Intelligence Framework revolutionises how businesses generate and qualify leads
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <div className="text-purple-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {feature.benefit}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Proven Results Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses are transforming their lead generation with LeverageFlo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{study.company}</h3>
                  <p className="text-purple-600 font-medium">{study.industry}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Before:</span>
                    <span className="font-semibold text-red-600">{study.before}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">After:</span>
                    <span className="font-semibold text-green-600">{study.after}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Timeframe:</span>
                    <span className="font-semibold">{study.timeframe}</span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-center font-bold">
                    {study.improvement}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Scale Without the Traditional Risks
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                LeverageFlo eliminates the need for expensive sales teams, lengthy training periods, 
                and the uncertainty of market expansion.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Implementation Timeline</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 rounded-full p-2">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Week 1-2: Setup & Configuration</h4>
                    <p className="text-gray-300 text-sm">System setup, voice AI training, target audience definition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Week 3: Campaign Launch</h4>
                    <p className="text-gray-300 text-sm">Multi-channel activation and initial prospect engagement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 rounded-full p-2">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Week 4+: Scale & Optimise</h4>
                    <p className="text-gray-300 text-sm">Campaign expansion and continuous optimisation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to 10x Your Lead Generation?
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join the exclusive group of businesses using LeverageFlo to dominate their markets 
              with automated cold outreach that actually works.
            </p>

            {/* Scarcity Notice */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-4 text-white">
                <Shield className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Limited Availability - Q1 2025</h3>
                  <p className="text-purple-100">Only 7 implementation slots remaining</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/leverageflo/application')}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Apply for LeverageFlo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => navigate('/leverageflo/demo')}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Watch System Demo
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-purple-200 text-sm mt-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>14-day implementation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Guaranteed results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LeverageFloMainPage;

