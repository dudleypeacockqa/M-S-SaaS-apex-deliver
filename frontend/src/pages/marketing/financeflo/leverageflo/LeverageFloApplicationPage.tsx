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
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  Bot
} from 'lucide-react';

const LeverageFloApplicationPage = () => {
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
    currentLeadGen: '',
    monthlyLeads: '',
    mainChallenge: '',
    timeline: '',
    budget: '',
    industry: '',
    targetMarket: ''
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
      logger.info('Submitting LeverageFlo application form', { 
        formType: 'LeverageFlo Application',
        hasRequiredFields: !!(formData.firstName && formData.lastName && formData.email && formData.phone),
        industry: formData.industry
      });
      
      // Submit to GHL
      const result = await handleFormSubmission(formData, 'LeverageFlo Application');
      
      logger.info('LeverageFlo form submission completed', { 
        success: result.success,
        contactId: result.contactId,
        qualificationStatus: result.qualificationStatus
      });
      
      if (result.success) {
        // Store form data in localStorage for the next step
        localStorage.setItem('leverageFloApplicationData', JSON.stringify({
          ...formData,
          contactId: result.contactId,
          leadScore: result.leadScore,
          qualificationStatus: result.qualificationStatus
        }));
        
        toast({
          title: "LeverageFlo Application Submitted!",
          description: "Redirecting you to schedule your strategy demo.",
          variant: "default",
        });
        
        // Navigate to schedule page
        navigate('/leverageflo/schedule');
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
        component: 'LeverageFloApplicationPage',
        action: 'form_submission',
        formType: 'LeverageFlo Application'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "10x-100x Lead Generation",
      description: "Automated multi-channel outreach"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Voice AI Technology",
      description: "Personalised voice messages at scale"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "75% Cost Reduction",
      description: "No expensive sales teams needed"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk-Free Scaling",
      description: "Expand without hiring risks"
    }
  ];

  const qualificationSteps = [
    "Complete Application Form",
    "Schedule Strategy Demo", 
    "Receive Custom Implementation Plan",
    "Begin Lead Generation"
  ];

  const channels = [
    { icon: <Phone className="w-5 h-5" />, name: "Voice AI Calls" },
    { icon: <MessageSquare className="w-5 h-5" />, name: "SMS & iMessage" },
    { icon: <Mail className="w-5 h-5" />, name: "Email Sequences" },
    { icon: <Bot className="w-5 h-5" />, name: "WhatsApp Automation" }
  ];

  return (
    <>
      <Helmet>
        <title>Apply for LeverageFlo - Automated Cold Outreach System | FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Apply for LeverageFlo - the world's most advanced automated cold outreach system. Generate 10x-100x more qualified leads with voice AI and multi-channel automation." 
        />
        <meta name="keywords" content="automated cold outreach, voice AI, lead generation, multi-channel automation, B2B sales" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-purple-500/20 rounded-full px-6 py-2 mb-6">
              <Bot className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Exclusive LeverageFlo Application</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Apply for the World's Most Advanced
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                Automated Cold Outreach System
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Generate 10x-100x more qualified leads using personalised voice AI, multi-channel messaging, 
              and intelligent automation - without hiring expensive sales teams.
            </p>

            {/* Multi-Channel Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {channels.map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white/10 rounded-lg p-4 text-center"
                >
                  <div className="text-purple-300 mb-2 flex justify-center">
                    {channel.icon}
                  </div>
                  <p className="text-sm font-medium">{channel.name}</p>
                </motion.div>
              ))}
            </div>

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
                    <div className="text-purple-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-purple-200">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* VSL Video Section */}
            <div className="bg-black/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Watch: How LeverageFlo Transforms Lead Generation</h2>
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/images/leverageflo-video-thumbnail.jpg"
                >
                  <source src="/videos/leverageflo_application_demo_placeholder.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-sm text-purple-200 mt-4">
                See real case studies and discover how businesses are generating 500+ qualified leads monthly
              </p>
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
              Your LeverageFlo Implementation Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proven 4-step process ensures you receive a customized automated outreach system that delivers measurable results
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
                  index === 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
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

          {/* Scarcity Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-12"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-800 mb-2">Limited Availability - Q1 2025</h3>
              <p className="text-red-700 mb-4">
                Due to intensive personalisation requirements, we only onboard 25 new LeverageFlo clients per quarter.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                  18 Implementations Complete
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                  7 Spots Remaining
                </span>
              </div>
            </div>
          </motion.div>
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
              Complete Your LeverageFlo Application
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us understand your lead generation needs so we can provide the most effective automated outreach strategy
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
                <Users className="w-5 h-5 mr-2 text-purple-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-purple-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select your position</option>
                    <option value="CEO/Founder">CEO/Founder</option>
                    <option value="Sales Director">Sales Director</option>
                    <option value="Marketing Director">Marketing Director</option>
                    <option value="Business Development Manager">Business Development Manager</option>
                    <option value="Operations Director">Operations Director</option>
                    <option value="Other C-Level">Other C-Level</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select your industry</option>
                    <option value="Technology/Software">Technology/Software</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Education">Education</option>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select revenue range</option>
                    <option value="Under £500K">Under £500K</option>
                    <option value="£500K - £1M">£500K - £1M</option>
                    <option value="£1M - £5M">£1M - £5M</option>
                    <option value="£5M - £10M">£5M - £10M</option>
                    <option value="£10M - £25M">£10M - £25M</option>
                    <option value="£25M - £50M">£25M - £50M</option>
                    <option value="Over £50M">Over £50M</option>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select employee count</option>
                    <option value="1-5">1-5</option>
                    <option value="6-10">6-10</option>
                    <option value="11-25">11-25</option>
                    <option value="26-50">26-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-250">101-250</option>
                    <option value="250+">250+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market *
                  </label>
                  <input
                    type="text"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., UK SMEs, US Tech Companies, etc."
                  />
                </div>
              </div>
            </div>

            {/* Current Lead Generation */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Current Lead Generation
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Lead Generation Methods *
                  </label>
                  <select
                    name="currentLeadGen"
                    value={formData.currentLeadGen}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select your current methods</option>
                    <option value="Manual Cold Calling">Manual Cold Calling</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Referrals">Referrals</option>
                    <option value="Networking">Networking</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="Multiple Methods">Multiple Methods</option>
                    <option value="No Systematic Approach">No Systematic Approach</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Qualified Leads *
                    </label>
                    <select
                      name="monthlyLeads"
                      value={formData.monthlyLeads}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select current lead volume</option>
                      <option value="0-10">0-10</option>
                      <option value="11-25">11-25</option>
                      <option value="26-50">26-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-250">101-250</option>
                      <option value="250+">250+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Implementation Timeline *
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      <option value="Immediate (Within 2 weeks)">Immediate (Within 2 weeks)</option>
                      <option value="1 month">1 month</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Lead Generation Challenge *
                  </label>
                  <textarea
                    name="mainChallenge"
                    value={formData.mainChallenge}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your biggest lead generation challenge (e.g., inconsistent pipeline, low response rates, manual processes, etc.)"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under £5K">Under £5K</option>
                    <option value="£5K - £10K">£5K - £10K</option>
                    <option value="£10K - £25K">£10K - £25K</option>
                    <option value="£25K - £50K">£25K - £50K</option>
                    <option value="£50K - £100K">£50K - £100K</option>
                    <option value="Over £100K">Over £100K</option>
                    <option value="Need guidance">Need guidance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Application...
                  </>
                ) : (
                  <>
                    Submit Application & Schedule Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                Your information is secure and will only be used to provide you with a customized LeverageFlo implementation strategy.
              </p>
            </div>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default LeverageFloApplicationPage;

