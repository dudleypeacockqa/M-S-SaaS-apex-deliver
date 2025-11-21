import React, { useState } from "react";
import { VideoHeroSection } from "../../components/VideoHeroSection";
import { DemoVideoGrid } from "../../components/DemoVideoGrid";

const StandaloneImplementation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const demoVideos = [
    {
      id: "standalone-overview",
      title: "Complete Standalone Solution",
      description: "White-label marketing automation for any industry",
      category: "overview",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "7:30"
    },
    {
      id: "industry-agnostic",
      title: "Industry-Agnostic Implementation",
      description: "Flexible solution for any business vertical",
      category: "implementation",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "11:45"
    },
    {
      id: "white-label-branding",
      title: "White-Label Branding",
      description: "Complete customization with your brand identity",
      category: "branding",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "6:20"
    },
    {
      id: "rapid-deployment",
      title: "Rapid Deployment Process",
      description: "7-day implementation with full training",
      category: "deployment",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "9:15"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <VideoHeroSection
        title="Complete White-Label Marketing Solution"
        subtitle="Deploy LeverageFlo.ai as Your Own Branded Marketing Automation Platform"
        videoUrl="/api/placeholder/1920/1080"
        ctaText="Schedule Implementation Demo"
        ctaLink="/contact"
        posterImage="/api/placeholder/1920/1080"
      />

      {/* Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Complete Marketing Automation Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deploy LeverageFlo.ai as your own branded solution with complete customization, 
              industry-agnostic flexibility, and comprehensive training included.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete White-Label Solution</h3>
              <p className="text-gray-600 mb-4">
                Full customization with your branding, domain, and business identity. 
                Your clients see only your brand throughout the entire experience.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Custom domain and branding</li>
                <li>• Your logo and color scheme</li>
                <li>• Personalized messaging templates</li>
                <li>• Branded client portals</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rapid 7-Day Implementation</h3>
              <p className="text-gray-600 mb-4">
                Complete deployment in just one week with comprehensive training 
                and ongoing support to ensure immediate success.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Day 1-2: Platform setup and branding</li>
                <li>• Day 3-4: Workflow configuration</li>
                <li>• Day 5-6: Team training and testing</li>
                <li>• Day 7: Go-live with full support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry-Agnostic Flexibility</h3>
              <p className="text-gray-600 mb-4">
                Adaptable to any industry with customizable workflows, messaging, 
                and automation sequences tailored to your specific market.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Professional services</li>
                <li>• Healthcare and medical</li>
                <li>• Real estate and construction</li>
                <li>• Technology and SaaS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              7-Day Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial setup to full deployment, we ensure your standalone solution 
              is perfectly configured for your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                day: "Days 1-2",
                title: "Platform Setup",
                description: "Complete platform configuration with your branding, domain setup, and initial customization.",
                icon: "⚙️"
              },
              {
                day: "Days 3-4", 
                title: "Workflow Configuration",
                description: "Custom automation workflows, messaging sequences, and integration setup for your industry.",
                icon: "🔄"
              },
              {
                day: "Days 5-6",
                title: "Training & Testing",
                description: "Comprehensive team training, system testing, and optimization based on your feedback.",
                icon: "🎓"
              },
              {
                day: "Day 7",
                title: "Go-Live Support",
                description: "Full deployment with dedicated support team ensuring smooth launch and immediate success.",
                icon: "🚀"
              }
            ].map((phase, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-4xl mb-4">{phase.icon}</div>
                <div className="text-sm font-semibold text-blue-600 mb-2">{phase.day}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{phase.title}</h3>
                <p className="text-gray-600 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See Standalone Implementation in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how LeverageFlo.ai transforms into your branded marketing automation platform
            </p>
          </div>

          <DemoVideoGrid videos={demoVideos} />
        </div>
      </section>

      {/* Pricing & Investment */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Complete Standalone Solution Investment
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              One-time setup with ongoing support and unlimited customization potential
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">What's Included</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Complete white-label platform setup</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom branding and domain configuration</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Industry-specific workflow templates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Comprehensive team training (8 hours)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>30-day launch support guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Ongoing technical support and updates</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="mb-8">
                    <div className="text-5xl font-bold mb-2">£15,000</div>
                    <div className="text-blue-200">One-time implementation</div>
                    <div className="text-sm text-blue-300 mt-2">+ £500/month platform license</div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-white text-blue-900 font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors">
                      Schedule Implementation Demo
                    </button>
                    <button className="w-full border border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors">
                      Download Standalone Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Deploy Your Branded Marketing Platform?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform your business with a complete white-label marketing automation solution 
            deployed in just 7 days with full training and ongoing support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors">
              Schedule Implementation Demo
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors">
              Download Implementation Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StandaloneImplementation;

