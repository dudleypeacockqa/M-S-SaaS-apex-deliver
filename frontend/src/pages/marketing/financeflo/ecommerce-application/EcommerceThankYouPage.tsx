import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Mail, 
  Phone,
  Download,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  FileText,
  Video
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

const EcommerceThankYouPage = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  const nextSteps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Confirmation Email",
      description: "You'll receive a calendar invite and preparation materials within 5 minutes",
      status: "immediate"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Pre-Call Preparation",
      description: "Review the preparation guide to maximize your call value",
      status: "24-hours"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Strategy Call",
      description: "45-minute personalized consultation with our ERP transformation expert",
      status: "scheduled"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Custom Proposal",
      description: "Receive your tailored transformation roadmap and ROI projection",
      status: "post-call"
    }
  ];

  const bonusResources = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "ERP Transformation Checklist",
      description: "Complete guide to preparing for your ERP upgrade",
      action: "Download PDF"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "ROI Calculator Spreadsheet",
      description: "Calculate your potential savings before the call",
      action: "Download Excel"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Security & Compliance Guide",
      description: "Ensure your transformation meets all requirements",
      action: "Download PDF"
    }
  ];

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Thank You - Your Call is Scheduled! - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Thank you for scheduling your AI-powered ERP transformation strategy call. Get ready for your personalized consultation." 
        />
        <meta name="keywords" content="ERP consultation scheduled, AI transformation call, finance automation strategy" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-8"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Thank You,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                {applicationData.firstName}!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Your strategy call has been successfully scheduled. We're excited to help {applicationData.company} 
              achieve breakthrough results with AI-powered ERP automation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Calendar className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Scheduled</h3>
                <p className="text-sm text-green-200">Check your email for calendar invite</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Clock className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">45 Minutes</h3>
                <p className="text-sm text-green-200">Dedicated strategy session</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <TrendingUp className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Custom ROI</h3>
                <p className="text-sm text-green-200">Personalized projection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Thank You Video Section */}
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
              A Personal Message for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch this exclusive message about what to expect on your call and how we'll help 
              {applicationData.company} achieve transformation success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
          >
            {!isVideoPlaying ? (
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="bg-white/20 rounded-full p-6 mb-6 mx-auto w-fit">
                      <Video className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Welcome to Your Transformation Journey
                    </h3>
                    <p className="text-lg text-blue-100 mb-8 max-w-md mx-auto">
                      A personal message from our CEO about your upcoming strategy call
                    </p>
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Watch Personal Message
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            ) : (
              <div className="aspect-video">
                {/* Video Placeholder - Replace with actual video embed */}
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-pulse">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Video Loading...</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Replace this with your actual video embed code
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Happens Next
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here's your step-by-step journey to ERP transformation success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-lg p-4 w-fit mx-auto mb-4">
                  <div className="text-blue-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  step.status === 'immediate' ? 'bg-green-100 text-green-800' :
                  step.status === '24-hours' ? 'bg-yellow-100 text-yellow-800' :
                  step.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {step.status === 'immediate' ? 'Within 5 minutes' :
                   step.status === '24-hours' ? 'Within 24 hours' :
                   step.status === 'scheduled' ? 'As scheduled' :
                   'After your call'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Resources */}
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
              Exclusive Bonus Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download these valuable resources to prepare for your call and maximize your transformation success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bonusResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                  <div className="text-blue-600">
                    {resource.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  {resource.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Questions Before Your Call?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our team is here to help. Reach out if you need to reschedule or have any questions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 w-fit mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-blue-200">support@financeflo.ai</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 w-fit mx-auto mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-blue-200">+44 20 xxxx xxxx</p>
              </div>
            </div>

            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                Need to Reschedule?
              </h3>
              <p className="text-blue-100 mb-6">
                No problem! Use the link in your confirmation email or contact our support team.
              </p>
              <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default EcommerceThankYouPage;

