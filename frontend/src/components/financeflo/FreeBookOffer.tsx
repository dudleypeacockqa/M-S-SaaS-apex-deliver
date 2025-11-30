import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Package, Star, Users, Clock, CheckCircle } from 'lucide-react';

const FreeBookOffer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load GHL form embed script
    const script = document.createElement('script');
    script.src = 'https://brand.financeflo.ai/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Redirect to GHL page with email parameter
      const ghlUrl = `https://review.erpsuccesssystems.com/delivery-address-page?email=${encodeURIComponent(email)}`;
      window.open(ghlUrl, '_blank');
      setIsSubmitted(true);
    } catch (error) {
      import('@/utils/logger').then(({ logger }) => {
        logger.error('Error submitting form', error as Error);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Package className="w-5 h-5 text-brand-teal-600" />
              <span className="text-white font-medium">FREE PAPERBACK BOOK</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
              Get Your Free Copy of
              <span className="block text-brand-teal-600 mt-2">
                "Connected Intelligence"
              </span>
            </h2>

            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover how AI unlocks the full potential of ERP systems and transforms
              your business into a revenue-generating machine.
            </p>
          </motion.div>

          {/* Book Cover & What You'll Learn - Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
              {/* Left Side - Book Cover and Stats */}
              <div className="flex flex-col items-center">
                <div className="relative inline-block mb-8">
                  <img
                    src="/assets/images/connected-intelligence-book-cover.png"
                    alt="Connected Intelligence: How AI Unlocks the Full Potential of ERP - Book Cover"
                    className="w-64 h-auto shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -top-4 -right-4 bg-brand-teal-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                    FREE
                  </div>
                </div>

                {/* Book Stats */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-white font-semibold">5.0 Rating</p>
                    <p className="text-white/70 text-sm">500+ Reviews</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-brand-teal-600 mx-auto mb-2" />
                    <p className="text-white font-semibold">10,000+</p>
                    <p className="text-white/70 text-sm">Downloads</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-brand-teal-600 mx-auto mb-2" />
                    <p className="text-white font-semibold">2-Hour</p>
                    <p className="text-white/70 text-sm">Read Time</p>
                  </div>
                </div>
              </div>

              {/* Right Side - What You'll Learn */}
              <div className="text-left flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-heading text-white mb-6">What You'll Discover:</h3>
                <ul className="space-y-3">
                  {[
                    "How AI transforms traditional ERP into intelligent business systems",
                    "Real case studies showing 300-500% ROI improvements",
                    "The Adaptive Intelligence Framework™ methodology",
                    "Step-by-step implementation strategies for UK businesses",
                    "Future-proofing your finance operations with AI integration"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Download Form - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <Package className="w-12 h-12 text-brand-teal-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-heading text-white mb-2">
                  Claim your Free copy while stocks last
                </h3>
                <p className="text-white/70">
                  Enter your details below to get a paperback copy sent to your UK address for free
                </p>
              </div>

              <div className="w-full">
                <iframe
                  src="https://brand.financeflo.ai/widget/form/x9MkeEEW9IoSZC1OIXtb"
                  style={{width: '100%', height: '500px', border: 'none', borderRadius: '3px'}}
                  id="inline-x9MkeEEW9IoSZC1OIXtb"
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="AI_ERP_Book_Request"
                  data-height="964"
                  data-layout-iframe-id="inline-x9MkeEEW9IoSZC1OIXtb"
                  data-form-id="x9MkeEEW9IoSZC1OIXtb"
                  title="AI_ERP_Book_Request"
                />
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-brand-teal-600 font-bold text-lg">230+</p>
                    <p className="text-white/70 text-xs">Implementations</p>
                  </div>
                  <div>
                    <p className="text-brand-teal-600 font-bold text-lg">20+</p>
                    <p className="text-white/70 text-xs">Years Experience</p>
                  </div>
                  <div>
                    <p className="text-brand-teal-600 font-bold text-lg">500%</p>
                    <p className="text-white/70 text-xs">Max ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Author Credibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/70 mb-2">Written by</p>
            <h4 className="text-2xl font-bold font-heading text-white mb-2">Dudley Peacock</h4>
            <p className="text-brand-teal-600 font-medium mb-4">
              Founder & CEO, FinanceFlo.ai | ERP Systems Specialist | Fractional AI Officer
            </p>
            <p className="text-white/70 max-w-2xl mx-auto">
              With 20+ years of ERP experience and 230+ successful implementations,
              Dudley is a recognized expert in AI-powered business transformation and
              the creator of the Adaptive Intelligence Framework™.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeBookOffer;

