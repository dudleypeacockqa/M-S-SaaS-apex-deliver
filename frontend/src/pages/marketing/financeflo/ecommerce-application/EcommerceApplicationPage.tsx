import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { handleFormSubmission } from '@/services/ghl';
import { useErrorHandler } from '@/hooks/marketing/financeflo/useErrorHandler';
import { toast } from '@/hooks/marketing/financeflo/use-toast';
import { logger } from '@/utils/logger';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const EcommerceApplicationPage = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    revenue: '',
    employees: '',
    currentERP: '',
    mainChallenge: '',
    timeline: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      logger.info('Submitting ecommerce application form', { 
        formType: 'Ecommerce Application',
        hasRequiredFields: !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      });
      
      // Submit to GHL
      const result = await handleFormSubmission(formData, 'Ecommerce Application');
      
      logger.info('Form submission completed', { 
        success: result.success,
        contactId: result.contactId,
        qualificationStatus: result.qualificationStatus
      });
      
      if (result.success) {
        // Store form data in localStorage for the next step
        localStorage.setItem('ecommerceApplicationData', JSON.stringify({
          ...formData,
          contactId: result.contactId,
          leadScore: result.leadScore,
          qualificationStatus: result.qualificationStatus
        }));
        
        toast({
          title: "Application Submitted Successfully!",
          description: "Redirecting you to schedule your strategy consultation.",
          variant: "default",
        });
        
        // Navigate to schedule page
        navigate('/ecommerce-application/schedule');
      } else {
        const errorMessage = result.error || 'Submission failed. Please try again or contact us directly.';
        toast({
          title: "Application Submission Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error, {
        component: 'EcommerceApplicationPage',
        action: 'form_submission',
        formType: 'Ecommerce Application'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "87% Reduction in Manual Work",
      description: "Automate repetitive finance tasks"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "300% ROI Within 8 Months",
      description: "Proven return on investment"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "30-Day Implementation",
      description: "Fast deployment and results"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "Bank-level data protection"
    }
  ];

  const qualificationSteps = [
    "Complete Application Form",
    "Schedule Strategy Call", 
    "Receive Custom Proposal",
    "Begin Transformation"
  ];

  return (
    <>
      <Helmet>
        <title>Apply for AI-Powered ERP Transformation - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Apply for a custom AI-powered ERP transformation consultation. Qualify for our exclusive implementation program and discover how to achieve 300% ROI." 
        />
        <meta name="keywords" content="ERP transformation application, AI automation consultation, finance productivity, ERP implementation" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-blue-500/20 rounded-full px-6 py-2 mb-6">
              <Target className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Exclusive Application Process</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Apply for Your AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                ERP Transformation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join elite companies achieving 300% ROI through our Adaptive Intelligence Framework™. 
              Complete your application to qualify for a custom transformation strategy.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/10 rounded-lg p-4 mb-3 mx-auto w-fit">
                    <div className="text-blue-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-blue-200">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Transformation Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proven 4-step process ensures you receive a customized solution that delivers measurable results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {qualificationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index === 0 ? <CheckCircle className="w-6 h-6" /> : <span className="font-bold">{index + 1}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step}</h3>
                {index < qualificationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
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
              Complete Your Application
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us understand your business needs so we can provide the most relevant transformation strategy
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-gray-50 rounded-2xl p-8 shadow-lg"
          >
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Position *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your position</option>
                    <option value="CEO/Founder">CEO/Founder</option>
                    <option value="CFO">CFO</option>
                    <option value="Finance Director">Finance Director</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Operations Director">Operations Director</option>
                    <option value="IT Director">IT Director</option>
                    <option value="Other C-Level">Other C-Level</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue *
                  </label>
                  <select
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select revenue range</option>
                    <option value="Under £1M">Under £1M</option>
                    <option value="£1M - £5M">£1M - £5M</option>
                    <option value="£5M - £10M">£5M - £10M</option>
                    <option value="£10M - £25M">£10M - £25M</option>
                    <option value="£25M - £50M">£25M - £50M</option>
                    <option value="£50M - £100M">£50M - £100M</option>
                    <option value="Over £100M">Over £100M</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees *
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select employee count</option>
                    <option value="1-10">1-10</option>
                    <option value="11-25">11-25</option>
                    <option value="26-50">26-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-250">101-250</option>
                    <option value="251-500">251-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Situation */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Current Situation
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current ERP/Accounting Software *
                  </label>
                  <select
                    name="currentERP"
                    value={formData.currentERP}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your current system</option>
                    <option value="Sage Intacct">Sage Intacct</option>
                    <option value="Acumatica">Acumatica</option>
                    <option value="Odoo">Odoo</option>
                    <option value="NetSuite">NetSuite</option>
                    <option value="QuickBooks">QuickBooks</option>
                    <option value="Xero">Xero</option>
                    <option value="SAP">SAP</option>
                    <option value="Microsoft Dynamics">Microsoft Dynamics</option>
                    <option value="Oracle">Oracle</option>
                    <option value="Spreadsheets/Manual">Spreadsheets/Manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Challenge *
                  </label>
                  <textarea
                    name="mainChallenge"
                    value={formData.mainChallenge}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your biggest finance/ERP challenge (e.g., manual data entry, slow reporting, integration issues, etc.)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Implementation Timeline *
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      <option value="Immediate (Within 30 days)">Immediate (Within 30 days)</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Budget *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under £10K">Under £10K</option>
                      <option value="£10K - £25K">£10K - £25K</option>
                      <option value="£25K - £50K">£25K - £50K</option>
                      <option value="£50K - £100K">£50K - £100K</option>
                      <option value="£100K - £250K">£100K - £250K</option>
                      <option value="Over £250K">Over £250K</option>
                      <option value="Need guidance">Need guidance</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Application...
                  </>
                ) : (
                  <>
                    Submit Application & Schedule Call
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                Your information is secure and will only be used to provide you with a customized transformation strategy.
              </p>
            </div>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default EcommerceApplicationPage;

