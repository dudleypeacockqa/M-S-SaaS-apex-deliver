import React, { useState } from "react";
import { VideoHeroSection } from "../../components/VideoHeroSection";
import { DemoVideoGrid } from "../../components/DemoVideoGrid";

const SystemDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState("overview");

  const demoVideos = [
    {
      id: "complete-system",
      title: "Complete LeverageFlo.ai System",
      description: "Full platform demonstration with all features",
      category: "overview",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "15:30"
    },
    {
      id: "voice-ai-demo",
      title: "Voice AI in Action",
      description: "Live demonstration of Synthflow Voice AI conversations",
      category: "voice-ai",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "8:45"
    },
    {
      id: "lead-generation",
      title: "Lead Generation Automation",
      description: "Multi-channel lead generation and nurturing workflows",
      category: "automation",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "12:20"
    },
    {
      id: "reviews-referrals",
      title: "Reviews & Referral System",
      description: "Automated reputation management and referral generation",
      category: "reputation",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "9:15"
    },
    {
      id: "erp-integration",
      title: "ERP Integration Showcase",
      description: "Seamless integration with Sage Intacct, Acumatica, and Odoo",
      category: "integration",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "14:10"
    },
    {
      id: "analytics-reporting",
      title: "Analytics & Reporting",
      description: "Real-time dashboards and performance analytics",
      category: "analytics",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "7:30"
    }
  ];

  const interactiveFeatures = [
    {
      title: "Voice AI Conversation Simulator",
      description: "Experience how our Voice AI handles real prospect conversations",
      icon: "🎤",
      action: "Try Voice AI Demo"
    },
    {
      title: "Lead Scoring Calculator",
      description: "See how our AI scores and prioritizes your prospects",
      icon: "📊",
      action: "Calculate Lead Score"
    },
    {
      title: "ROI Projection Tool",
      description: "Calculate your potential return on investment",
      icon: "💰",
      action: "Calculate ROI"
    },
    {
      title: "Workflow Builder",
      description: "Build custom automation workflows for your business",
      icon: "⚙️",
      action: "Build Workflow"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <VideoHeroSection
        title="Experience LeverageFlo.ai in Action"
        subtitle="Interactive Demonstrations of Complete Marketing Automation Platform"
        videoUrl="/api/placeholder/1920/1080"
        ctaText="Start Interactive Demo"
        ctaLink="/contact"
        posterImage="/api/placeholder/1920/1080"
      />

      {/* Interactive Demo Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Interactive Demo Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just watch - experience LeverageFlo.ai with hands-on interactive demonstrations 
              that show exactly how our platform works for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {interactiveFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  {feature.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Library */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Complete Demo Video Library
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive video demonstrations covering every aspect of the LeverageFlo.ai platform
            </p>
          </div>

          <DemoVideoGrid videos={demoVideos} />
        </div>
      </section>

      {/* Live Demo Simulator */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Live Platform Simulator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the actual LeverageFlo.ai interface with live data and real functionality
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Try the Real Platform</h3>
                <p className="text-blue-100 mb-8">
                  Access a live sandbox environment with real data, active workflows, 
                  and full platform functionality. No registration required.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Live Voice AI conversations</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time analytics dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Active automation workflows</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>ERP integration examples</span>
                  </div>
                </div>

                <button className="bg-white text-blue-900 font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors">
                  Launch Live Demo Platform
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-400 text-sm ml-2">LeverageFlo.ai Dashboard</span>
                  </div>
                  <div className="bg-blue-600 h-32 rounded flex items-center justify-center">
                    <span className="text-white font-semibold">Live Platform Preview</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">847</div>
                  <div className="text-blue-200 text-sm">Active Prospects This Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Categories */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Choose Your Demo Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the demonstration that best matches your interests and business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview Demo</h3>
              <p className="text-gray-600 mb-6">
                15-minute comprehensive overview of all LeverageFlo.ai features and capabilities.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Platform overview</li>
                <li>• Key features highlight</li>
                <li>• ROI demonstration</li>
                <li>• Implementation timeline</li>
              </ul>
              <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Start Quick Demo
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-600">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-center mb-4">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">RECOMMENDED</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deep Dive Demo</h3>
              <p className="text-gray-600 mb-6">
                45-minute detailed demonstration with live data, real conversations, and Q&A session.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Live Voice AI conversations</li>
                <li>• Real automation workflows</li>
                <li>• Custom configuration options</li>
                <li>• Personalized Q&A session</li>
              </ul>
              <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                Schedule Deep Dive
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Demo Session</h3>
              <p className="text-gray-600 mb-6">
                60-minute team demonstration with multiple stakeholders and decision makers.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Multi-stakeholder presentation</li>
                <li>• Role-specific demonstrations</li>
                <li>• Implementation planning</li>
                <li>• Team training overview</li>
              </ul>
              <button className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                Book Team Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience LeverageFlo.ai?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose your preferred demonstration format and see exactly how LeverageFlo.ai 
            can transform your marketing operations with measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors">
              Start Interactive Demo Now
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors">
              Schedule Live Demo Session
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemDemo;

