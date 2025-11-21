import React from 'react';
import { Helmet } from 'react-helmet-async';
import { EnhancedVSLPlayer } from '@/components/marketing/financeflo/EnhancedVSLPlayer';

const EcommerceVSL = () => {
  return (
    <>
      <Helmet>
        <title>Ecommerce ERP Transformation | FinanceFlo.ai VSL</title>
        <meta name="description" content="Transform your ecommerce operations with AI-powered ERP automation. 300% growth, 66% cost reduction, 80% faster order processing." />
        <meta name="keywords" content="ecommerce ERP, Shopify integration, WooCommerce automation, inventory management, order processing" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full mb-4">
                <span className="text-green-400 text-sm font-medium">🛒 Ecommerce Transformation</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Stop Losing <span className="text-green-400">£2,000 Daily</span> to Manual Processes
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your ecommerce operations with AI-powered automation. Join 500+ UK businesses achieving 300% growth.
              </p>
            </div>

            {/* VSL Player */}
            <div className="mb-12">
              <EnhancedVSLPlayer
                videoSrc="/videos/ecommerce_vsl_final.mp4"
                title="Ecommerce ERP Transformation VSL"
                description="Discover how AI+ERP automation transforms ecommerce operations"
                ctaText="Schedule Your Free Ecommerce Assessment"
                ctaPhone="+44 7360 539147"
                duration="2:00"
              />
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">300%</div>
                <div className="text-white font-semibold mb-2">Growth Metrics</div>
                <div className="text-gray-300 text-sm">Average revenue increase with AI automation</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">66%</div>
                <div className="text-white font-semibold mb-2">Cost Reduction</div>
                <div className="text-gray-300 text-sm">Operational cost savings through automation</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
                <div className="text-white font-semibold mb-2">Faster Processing</div>
                <div className="text-gray-300 text-sm">Order processing time improvement</div>
              </div>
            </div>

            {/* Integration Platforms */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Seamless Integration with Your Existing Platforms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">Shopify</div>
                  <div className="text-sm">Full automation</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">WooCommerce</div>
                  <div className="text-sm">Real-time sync</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">Magento</div>
                  <div className="text-sm">Advanced features</div>
                </div>
                <div className="text-gray-300">
                  <div className="text-lg font-semibold mb-1">BigCommerce</div>
                  <div className="text-sm">Complete integration</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform Your Ecommerce Operations?
                </h3>
                <p className="text-white/90 mb-6">
                  Join 500+ businesses that have revolutionized their ecommerce processes with our AI+ERP platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="tel:+447360539147"
                    className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Call Now: +44 7360 539147
                  </a>
                  <a 
                    href="/contact"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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

export default EcommerceVSL;

