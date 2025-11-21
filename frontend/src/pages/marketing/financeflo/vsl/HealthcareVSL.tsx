import React from 'react';
import { Helmet } from 'react-helmet-async';
import { EnhancedVSLPlayer } from '@/components/marketing/financeflo/EnhancedVSLPlayer';

const HealthcareVSL = () => {
  return (
    <>
      <Helmet>
        <title>Healthcare ERP Transformation | FinanceFlo.ai VSL</title>
        <meta name="description" content="Transform your healthcare practice with AI-powered ERP automation. 70% billing accuracy improvement, 60% cost reduction, GDPR compliant." />
        <meta name="keywords" content="healthcare ERP, medical billing automation, NHS integration, patient management, GDPR compliance" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-full mb-4">
                <span className="text-red-400 text-sm font-medium">🏥 Healthcare Transformation</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Stop Losing <span className="text-red-400">£5,000 Monthly</span> to Billing Errors
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your healthcare practice with AI-powered automation. Join 200+ UK practices achieving 70% billing accuracy improvement.
              </p>
            </div>

            {/* VSL Player */}
            <div className="mb-12">
              <EnhancedVSLPlayer
                videoSrc="/videos/healthcare_vsl_final.mp4"
                title="Healthcare ERP Transformation VSL"
                description="Discover how AI+ERP automation transforms healthcare operations"
                ctaText="Schedule Your Free Healthcare Assessment"
                ctaPhone="+44 7360 539147"
                duration="2:00"
              />
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">70%</div>
                <div className="text-white font-semibold mb-2">Billing Accuracy</div>
                <div className="text-gray-300 text-sm">Improvement in billing accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">60%</div>
                <div className="text-white font-semibold mb-2">Cost Reduction</div>
                <div className="text-gray-300 text-sm">Administrative cost savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <div className="text-white font-semibold mb-2">Error Reduction</div>
                <div className="text-gray-300 text-sm">Reduction in billing errors</div>
              </div>
            </div>

            {/* Compliance & Integration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                GDPR Compliant & NHS Integration Ready
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">GDPR</div>
                  <div className="text-sm">Fully compliant</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">NHS Systems</div>
                  <div className="text-sm">Direct integration</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">Patient Records</div>
                  <div className="text-sm">Secure management</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">Insurance</div>
                  <div className="text-sm">Automated processing</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform Your Healthcare Practice?
                </h3>
                <p className="text-white/90 mb-6">
                  Join 200+ practices that have revolutionized their operations with our AI+ERP platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="tel:+447360539147"
                    className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Call Now: +44 7360 539147
                  </a>
                  <a 
                    href="/contact"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
                  >
                    Schedule Assessment
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HealthcareVSL;

