import React, { useState } from "react";
import { ERPIntegrationVSLHero } from "../../components/ERPIntegrationVSLHero";
import { DemoVideoGrid } from "../../components/DemoVideoGrid";
import { EnhancedButton } from "../../components/ui/enhanced-button";

const ERPIntegrationShowcase: React.FC = () => {
  const [activeIntegration, setActiveIntegration] = useState("sage-intacct");

  const demoVideos = [
    {
      id: "erp-overview",
      title: "Complete ERP Integration Overview",
      description: "How LeverageFlo.ai seamlessly connects with your ERP system",
      category: "overview",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "8:45"
    },
    {
      id: "sage-intacct-integration",
      title: "Sage Intacct Integration",
      description: "Real-time data sync with Sage Intacct financial management",
      category: "sage-intacct",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "12:30"
    },
    {
      id: "acumatica-integration",
      title: "Acumatica Cloud Integration",
      description: "Seamless connection with Acumatica cloud ERP platform",
      category: "acumatica",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "10:15"
    },
    {
      id: "odoo-integration",
      title: "Odoo Open-Source Integration",
      description: "Flexible integration with Odoo's modular ERP system",
      category: "odoo",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "#",
      duration: "9:20"
    }
  ];

  const integrationFeatures = [
    {
      title: "Real-Time Data Synchronization",
      description: "Instant bidirectional sync between LeverageFlo.ai and your ERP system",
      icon: "🔄",
      benefits: ["Live prospect data updates", "Automatic lead scoring", "Real-time pipeline visibility"]
    },
    {
      title: "Unified Customer Intelligence",
      description: "Complete customer view combining marketing and financial data",
      icon: "🧠",
      benefits: ["360-degree customer profiles", "Predictive analytics", "Behavioral insights"]
    },
    {
      title: "Automated Workflow Triggers",
      description: "ERP events automatically trigger marketing automation sequences",
      icon: "⚡",
      benefits: ["Invoice-based follow-ups", "Payment reminder automation", "Renewal campaigns"]
    },
    {
      title: "Advanced Reporting & Analytics",
      description: "Comprehensive reporting across marketing and financial metrics",
      icon: "📊",
      benefits: ["ROI attribution", "Customer lifetime value", "Revenue forecasting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with VSL */}
      <ERPIntegrationVSLHero />

      {/* Integration Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why ERP Integration Transforms Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bridge the gap between marketing automation and financial management 
              for complete business intelligence and automated workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP System Showcase */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Native Integrations with Leading ERP Systems
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deep, native integrations with the most popular ERP systems used by UK mid-market businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">SI</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sage Intacct</h3>
              <p className="text-gray-600 mb-6">
                Cloud financial management with construction industry specialization and AI-powered insights.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Real-time financial data sync</li>
                <li>• Construction project integration</li>
                <li>• Advanced reporting capabilities</li>
                <li>• Multi-entity consolidation</li>
              </ul>
              <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                View Sage Intacct Integration
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-600">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <div className="text-center mb-4">
                <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Acumatica</h3>
              <p className="text-gray-600 mb-6">
                Unlimited cloud ERP with manufacturing excellence and unlimited user licensing model.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Unlimited user licensing</li>
                <li>• Manufacturing & distribution</li>
                <li>• Mobile-first experience</li>
                <li>• Advanced workflow automation</li>
              </ul>
              <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                View Acumatica Integration
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">OD</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Odoo</h3>
              <p className="text-gray-600 mb-6">
                Open-source ERP with unlimited customization freedom and 80% cost reduction potential.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Complete source code ownership</li>
                <li>• 1,500+ available modules</li>
                <li>• Industry-agnostic flexibility</li>
                <li>• Community-driven innovation</li>
              </ul>
              <button className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                View Odoo Integration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See ERP Integration in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch real demonstrations of LeverageFlo.ai working seamlessly with each ERP system
            </p>
          </div>

          <DemoVideoGrid videos={demoVideos} />
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Seamless Integration Process
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our proven 4-step integration process ensures smooth deployment with minimal disruption
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Assessment & Planning",
                description: "Comprehensive analysis of your current ERP setup and integration requirements.",
                duration: "1-2 days"
              },
              {
                step: "2",
                title: "Configuration & Setup",
                description: "Custom configuration of LeverageFlo.ai to match your ERP data structure.",
                duration: "3-5 days"
              },
              {
                step: "3",
                title: "Testing & Validation",
                description: "Thorough testing of data sync, workflows, and automation sequences.",
                duration: "2-3 days"
              },
              {
                step: "4",
                title: "Go-Live & Support",
                description: "Full deployment with dedicated support and optimization monitoring.",
                duration: "1 day + ongoing"
              }
            ].map((phase, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold mb-3">{phase.title}</h3>
                <p className="text-blue-100 text-sm mb-3">{phase.description}</p>
                <div className="text-xs text-blue-300">{phase.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Integrate LeverageFlo.ai with Your ERP?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform your business with seamless ERP integration that bridges marketing automation 
            and financial management for complete business intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors">
              Schedule Integration Demo
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors">
              Download Integration Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ERPIntegrationShowcase;

