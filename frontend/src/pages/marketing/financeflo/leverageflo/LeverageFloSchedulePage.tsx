import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  User,
  Building2,
  Target,
  Bot,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { logger } from "@/utils/logger";

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  revenue: string;
  employees: string;
  currentLeadGen: string;
  monthlyLeads: string;
  mainChallenge: string;
  timeline: string;
  budget: string;
  industry: string;
  targetMarket: string;
  contactId?: string;
  leadScore?: number;
  qualificationStatus?: string;
}

const LeverageFloSchedulePage = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    // Get application data from localStorage
    const storedData = localStorage.getItem('leverageFloApplicationData');
    if (storedData) {
      setApplicationData(JSON.parse(storedData));
    } else {
      // Redirect back to application if no data found
      navigate('/leverageflo/application');
    }
  }, [navigate]);

  const handleScheduleCall = async () => {
    if (!selectedDate || !selectedTime || !applicationData) return;
    
    setIsScheduling(true);
    
    try {
      // Simulate API call to schedule the meeting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store scheduling data
      const schedulingData = {
        ...applicationData,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        scheduledDateTime: `${selectedDate} ${selectedTime}`,
        status: 'scheduled'
      };
      
      localStorage.setItem('leverageFloSchedulingData', JSON.stringify(schedulingData));
      
      setIsScheduled(true);
      
      // Navigate to confirmation page after a short delay
      setTimeout(() => {
        navigate('/leverageflo/confirmation');
      }, 3000);
      
    } catch (error) {
      logger.error('Scheduling error', error as Error);
      alert('Failed to schedule call. Please try again or contact us directly.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Generate available dates (next 14 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 10) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        dates.push({
          value: currentDate.toISOString().split('T')[0],
          label: currentDate.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Generate available times
  const getAvailableTimes = () => {
    return [
      { value: '09:00', label: '9:00 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '14:00', label: '2:00 PM' },
      { value: '15:00', label: '3:00 PM' },
      { value: '16:00', label: '4:00 PM' },
      { value: '17:00', label: '5:00 PM' }
    ];
  };

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (isScheduled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Call Scheduled Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your LeverageFlo strategy demo has been scheduled for {selectedDate} at {selectedTime}.
            You'll receive a confirmation email shortly.
          </p>
          <div className="animate-pulse text-purple-600">
            Redirecting to confirmation page...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Schedule Your LeverageFlo Strategy Demo | FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Schedule your personalized LeverageFlo strategy demonstration. See how automated cold outreach can transform your lead generation." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-2 mb-6">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-sm font-medium text-green-800">Application Approved</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Congratulations, {applicationData.firstName}!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your LeverageFlo application has been approved. Schedule your personalized strategy demonstration 
              to see how we can 10x your lead generation with automated cold outreach.
            </p>

            {/* What to Expect */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect in Your Demo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Bot className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Live System Demonstration</h3>
                    <p className="text-gray-600 text-sm">See LeverageFlo in action with real campaigns and results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Strategy Review</h3>
                    <p className="text-gray-600 text-sm">Tailored approach for your specific industry and target market</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Voice AI Preview</h3>
                    <p className="text-gray-600 text-sm">Hear how personalised voice messages will sound for your prospects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Implementation Roadmap</h3>
                    <p className="text-gray-600 text-sm">Clear timeline and next steps for your LeverageFlo setup</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Application Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Application Summary</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-gray-600">{applicationData.firstName} {applicationData.lastName}</p>
                    <p className="text-gray-600">{applicationData.email}</p>
                    <p className="text-gray-600">{applicationData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Details</h3>
                    <p className="text-gray-600">{applicationData.company}</p>
                    <p className="text-gray-600">{applicationData.position}</p>
                    <p className="text-gray-600">{applicationData.industry} • {applicationData.revenue} revenue</p>
                    <p className="text-gray-600">{applicationData.employees} employees</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Lead Generation Goals</h3>
                    <p className="text-gray-600">Current: {applicationData.monthlyLeads} leads/month</p>
                    <p className="text-gray-600">Target Market: {applicationData.targetMarket}</p>
                    <p className="text-gray-600">Timeline: {applicationData.timeline}</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Main Challenge</h4>
                  <p className="text-purple-800 text-sm">{applicationData.mainChallenge}</p>
                </div>
              </div>
            </motion.div>

            {/* Scheduling */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Strategy Demo</h2>
              
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Date
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                          selectedDate === date.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Select Time (GMT)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time.value}
                          onClick={() => setSelectedTime(time.value)}
                          className={`p-3 text-center rounded-lg border transition-all duration-200 ${
                            selectedTime === time.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          }`}
                        >
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Schedule Button */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-6"
                  >
                    <button
                      onClick={handleScheduleCall}
                      disabled={isScheduling}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isScheduling ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Scheduling Your Demo...
                        </>
                      ) : (
                        <>
                          Schedule LeverageFlo Demo
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Selected Time:</h4>
                      <p className="text-gray-700">
                        {availableDates.find(d => d.value === selectedDate)?.label} at{' '}
                        {availableTimes.find(t => t.value === selectedTime)?.label} GMT
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Duration: 45 minutes • Platform: Zoom (link will be sent via email)
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need to Reschedule or Have Questions?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+447360539147"
                  className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +44 7360 539147
                </a>
                <a
                  href="mailto:hello@financeflo.ai"
                  className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  hello@financeflo.ai
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeverageFloSchedulePage;

