import React, { useState } from "react";
import { EnhancedVSLPlayer } from "./EnhancedVSLPlayer";
import { Button } from "./ui/button";
import { Phone, Calendar, ArrowRight, Shield, TrendingUp, DollarSign, Play, X } from "lucide-react";

export const PricingVSLHeroCompact = () => {
  const [showFullVideo, setShowFullVideo] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Guaranteed
                <span className="block text-blue-600">300% ROI</span>
                <span className="block text-xl md:text-2xl font-normal text-gray-600 mt-4">
                  or Your Money Back - Legally Binding Promise
                </span>
              </h1>

              {/* Key Benefits */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <Shield className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">300%</div>
                  <div className="text-xs text-gray-600">ROI Guarantee</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">400%</div>
                  <div className="text-xs text-gray-600">Typical Returns</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">£0</div>
                  <div className="text-xs text-gray-600">Hidden Costs</div>
                </div>
              </div>

              {/* ROI Example */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Typical Client Example:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Monthly Investment:</div>
                    <div className="text-2xl font-bold text-blue-600">£3,500</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Monthly Savings:</div>
                    <div className="text-2xl font-bold text-green-600">£15,000</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gray-700">
                    Net Monthly Benefit: <span className="text-xl font-bold text-green-600">£11,500</span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.location.href = 'tel:+447360539147'}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call +44 7360 539147
                </Button>
                <Button
                  size="lg"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right: Compact Video Preview */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                <div className="aspect-video">
                  <EnhancedVSLPlayer
                    videoSrc="/pricing_roi_vsl_video.mp4"
                    audioSrc="/pricing_roi_vsl_audio.wav"
                    posterImage="/odoo_dashboard_1.png"
                    className="w-full h-full object-cover"
                    controlsPosition="bottom-center"
                    showControls={true}
                    showProgress={true}
                    autoplay={false}
                  />
                </div>

                {/* Expand Button Overlay */}
                <button
                  onClick={() => setShowFullVideo(true)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all"
                  title="Watch full video"
                >
                  <Play className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600 justify-center">
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>300% ROI Guarantee</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>No Hidden Costs</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Free Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Video Modal */}
      {showFullVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowFullVideo(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-6xl">
            <EnhancedVSLPlayer
              videoSrc="/pricing_roi_vsl_video.mp4"
              audioSrc="/pricing_roi_vsl_audio.wav"
              posterImage="/odoo_dashboard_1.png"
              className="w-full h-full"
              controlsPosition="bottom-center"
              showControls={true}
              showProgress={true}
              autoplay={true}
            />
          </div>
        </div>
      )}
    </>
  );
};
