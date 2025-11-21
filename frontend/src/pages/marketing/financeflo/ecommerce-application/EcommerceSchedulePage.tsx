import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Phone,
  Mail,
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  revenue: string;
  employees: string;
  currentERP: string;
  mainChallenge: string;
  timeline: string;
  budget: string;
}

const EcommerceSchedulePage = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);

  useEffect(() => {
    // Get application data from localStorage
    const storedData = localStorage.getItem('ecommerceApplicationData');
    if (storedData) {
      setApplicationData(JSON.parse(storedData));
    } else {
      // Redirect back to application if no data found
      navigate('/ecommerce-application');
    }
  }, [navigate]);

  const benefits = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Custom Strategy",
      description: "Tailored to your specific business needs"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "ROI Projection",
      description: "See your potential return on investment"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Implementation Plan",
      description: "Step-by-step roadmap to success"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Risk Assessment",
      description: "Identify and mitigate potential challenges"
    }
  ];

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Schedule Your Strategy Call - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Schedule your personalized AI-powered ERP transformation strategy call. Get a custom implementation plan and ROI projection." 
        />
        <meta name="keywords" content="ERP strategy call, AI transformation consultation, finance automation planning" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={() => navigate('/ecommerce-application')}
              className="inline-flex items-center text-green-200 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Application
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-green-500/20 rounded-full px-6 py-2 mb-6">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Application Approved</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Congratulations,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                    {applicationData.firstName}!
                  </span>
                </h1>
                
                <p className="text-xl text-green-100 mb-8">
                  Your application has been approved. Schedule your personalized strategy call to receive 
                  a custom AI-powered ERP transformation plan worth £5,000 - completely free.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="bg-white/10 rounded-lg p-2 mt-1">
                        <div className="text-green-300">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                        <p className="text-xs text-green-200">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Application Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Application Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-green-300" />
                    <div>
                      <p className="text-sm text-green-200">Company</p>
                      <p className="font-medium">{applicationData.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-green-300" />
                    <div>
                      <p className="text-sm text-green-200">Position</p>
                      <p className="font-medium">{applicationData.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <div>
                      <p className="text-sm text-green-200">Revenue</p>
                      <p className="font-medium">{applicationData.revenue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-green-300" />
                    <div>
                      <p className="text-sm text-green-200">Email</p>
                      <p className="font-medium">{applicationData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-green-300" />
                    <div>
                      <p className="text-sm text-green-200">Phone</p>
                      <p className="font-medium">{applicationData.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What to Expect on Your Call
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your 45-minute strategy session will be tailored specifically to {applicationData.company}'s needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Current State Analysis",
                description: `We'll review your ${applicationData.currentERP} setup and identify automation opportunities specific to your ${applicationData.mainChallenge.toLowerCase()}.`
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Custom ROI Projection",
                description: `Based on your ${applicationData.revenue} revenue and ${applicationData.employees} employees, we'll calculate your potential savings and ROI.`
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Implementation Roadmap",
                description: `We'll create a step-by-step plan aligned with your ${applicationData.timeline} timeline and ${applicationData.budget} budget.`
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="bg-blue-100 rounded-lg p-3 w-fit mx-auto mb-4">
                  <div className="text-blue-600">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Schedule Your Strategy Call
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a time that works best for you. All calls are conducted via Zoom and include a follow-up summary.
            </p>
          </motion.div>

          {/* Calendar Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Select Your Preferred Time</span>
              </div>
            </div>

            {/* GHL Calendar Embed */}
            <div className="calendar-container">
              <iframe 
                src="https://demo.erpsuccesssystems.com/widget/booking/OoDgv1r9U6994V0VjeX2" 
                style={{
                  width: '100%',
                  border: 'none',
                  overflow: 'hidden',
                  minHeight: '600px',
                  borderRadius: '12px'
                }} 
                scrolling="no" 
                id="aisGvMZQXL1b32VhTzqn_1751522279820"
                title="Schedule Your Strategy Call"
              />
            </div>

            {/* Call Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">45 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Via Zoom</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Free consultation</span>
              </div>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Before Your Call
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What to Prepare:</h4>
                <ul className="space-y-1">
                  <li>• Current ERP/accounting system access</li>
                  <li>• Recent financial reports</li>
                  <li>• List of manual processes</li>
                  <li>• Integration requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What You'll Receive:</h4>
                <ul className="space-y-1">
                  <li>• Custom transformation roadmap</li>
                  <li>• ROI projection report</li>
                  <li>• Implementation timeline</li>
                  <li>• Next steps recommendation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Load GHL Form Script */}
      <script 
        src="https://demo.erpsuccesssystems.com/js/form_embed.js" 
        type="text/javascript"
      />
    </>
  );
};

export default EcommerceSchedulePage;

