import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Download,
  FileText,
  Phone,
  Mail,
  Bot,
  MessageSquare,
  Target,
  ArrowRight,
  Share2
} from 'lucide-react';

interface SchedulingData {
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
  scheduledDate: string;
  scheduledTime: string;
  scheduledDateTime: string;
  status: string;
}

const LeverageFloConfirmationPage = () => {
  const navigate = useNavigate();
  const [schedulingData, setSchedulingData] = useState<SchedulingData | null>(null);
  const [transcriptDownloaded, setTranscriptDownloaded] = useState(false);

  useEffect(() => {
    // Get scheduling data from localStorage
    const storedData = localStorage.getItem('leverageFloSchedulingData');
    if (storedData) {
      setSchedulingData(JSON.parse(storedData));
    } else {
      // Redirect back to application if no data found
      navigate('/leverageflo/application');
    }
  }, [navigate]);

  const handleDownloadTranscript = () => {
    // Create transcript content
    const transcriptContent = generateTranscriptContent();
    
    // Create blob and download
    const blob = new Blob([transcriptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `LeverageFlo-Demo-Transcript-${schedulingData?.firstName}-${schedulingData?.lastName}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setTranscriptDownloaded(true);
  };

  const generateTranscriptContent = () => {
    if (!schedulingData) return '';
    
    const formattedDate = new Date(schedulingData.scheduledDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
LEVERAGEFLO STRATEGY DEMONSTRATION TRANSCRIPT
===========================================

MEETING DETAILS:
Date: ${formattedDate}
Time: ${schedulingData.scheduledTime} GMT
Duration: 45 minutes
Platform: Zoom

ATTENDEE INFORMATION:
Name: ${schedulingData.firstName} ${schedulingData.lastName}
Company: ${schedulingData.company}
Position: ${schedulingData.position}
Email: ${schedulingData.email}
Phone: ${schedulingData.phone}

COMPANY PROFILE:
Industry: ${schedulingData.industry}
Revenue: ${schedulingData.revenue}
Employees: ${schedulingData.employees}
Target Market: ${schedulingData.targetMarket}

CURRENT SITUATION:
Lead Generation Method: ${schedulingData.currentLeadGen}
Monthly Qualified Leads: ${schedulingData.monthlyLeads}
Implementation Timeline: ${schedulingData.timeline}
Investment Budget: ${schedulingData.budget}

MAIN CHALLENGE:
${schedulingData.mainChallenge}

===========================================
DEMONSTRATION AGENDA:
===========================================

1. WELCOME & INTRODUCTIONS (5 minutes)
   - Welcome to LeverageFlo
   - Review of your application and goals
   - Agenda overview

2. LEVERAGEFLO SYSTEM OVERVIEW (10 minutes)
   - Automated cold outreach technology
   - Multi-channel approach (Voice AI, SMS, iMessage, Email, WhatsApp)
   - Adaptive Intelligence Framework
   - Real-time personalisation capabilities

3. LIVE SYSTEM DEMONSTRATION (15 minutes)
   - Voice AI technology showcase
   - Multi-channel campaign setup
   - Prospect targeting and segmentation
   - Response tracking and analytics
   - Lead qualification automation

4. CUSTOM STRATEGY REVIEW (10 minutes)
   - Industry-specific approach for ${schedulingData.industry}
   - Target market analysis: ${schedulingData.targetMarket}
   - Projected lead generation increase
   - ROI calculations and timeline

5. IMPLEMENTATION ROADMAP (5 minutes)
   - 14-day setup process
   - Training and onboarding
   - Support and optimisation
   - Success metrics and KPIs

===========================================
KEY LEVERAGEFLO FEATURES TO DEMONSTRATE:
===========================================

VOICE AI TECHNOLOGY:
- Personalised voice message generation
- Natural conversation flow
- Voice cloning capabilities
- Multi-language support
- Emotional intelligence integration

MULTI-CHANNEL AUTOMATION:
- SMS and iMessage sequences
- Email campaign automation
- WhatsApp business integration
- LinkedIn outreach automation
- Voice call scheduling

INTELLIGENT TARGETING:
- Ideal customer profile analysis
- Behavioural trigger identification
- Engagement scoring
- Response prediction
- Conversion optimisation

ANALYTICS & REPORTING:
- Real-time campaign performance
- Lead quality scoring
- ROI tracking
- A/B testing results
- Predictive analytics

===========================================
EXPECTED OUTCOMES FOR ${schedulingData.company}:
===========================================

LEAD GENERATION GOALS:
Current Monthly Leads: ${schedulingData.monthlyLeads}
Projected Monthly Leads: 500-1,200 qualified prospects
Expected Increase: 10x-100x improvement

COST EFFICIENCY:
- 75% reduction in cost per lead
- 90% reduction in manual outreach time
- 85% improvement in response rates
- 60% increase in conversion rates

IMPLEMENTATION TIMELINE:
- Week 1-2: System setup and configuration
- Week 3: Campaign launch and testing
- Week 4: Optimisation and scaling
- Month 2+: Full automation and growth

===========================================
INVESTMENT & ROI PROJECTIONS:
===========================================

LEVERAGEFLO INVESTMENT:
Budget Range: ${schedulingData.budget}
Implementation Cost: Custom quote based on requirements
Monthly Platform Fee: Scaled pricing model
Setup and Training: Included in implementation

ROI CALCULATIONS:
- Average deal size increase: 40-60%
- Sales cycle reduction: 30-50%
- Lead quality improvement: 200-300%
- Overall ROI: 300-500% within 6 months

===========================================
NEXT STEPS AFTER DEMONSTRATION:
===========================================

IMMEDIATE ACTIONS:
1. Custom proposal preparation (24-48 hours)
2. Technical requirements assessment
3. Integration planning with existing systems
4. Team training schedule coordination

IMPLEMENTATION PHASES:
Phase 1: Foundation Setup (Days 1-7)
- System configuration
- Voice AI training
- Target audience definition
- Message template creation

Phase 2: Campaign Launch (Days 8-14)
- Multi-channel activation
- Initial prospect engagement
- Performance monitoring
- Real-time optimisation

Phase 3: Scale & Optimise (Days 15-30)
- Campaign expansion
- Advanced automation
- Analytics review
- Strategy refinement

===========================================
SUPPORT & RESOURCES:
===========================================

DEDICATED SUPPORT TEAM:
- Implementation specialist
- Technical support engineer
- Strategy consultant
- Account success manager

TRAINING RESOURCES:
- Live onboarding sessions
- Video tutorial library
- Best practices documentation
- Weekly strategy calls

ONGOING OPTIMISATION:
- Monthly performance reviews
- Quarterly strategy updates
- Continuous AI model training
- Industry trend integration

===========================================
CONTACT INFORMATION:
===========================================

Primary Contact: LeverageFlo Implementation Team
Email: hello@financeflo.ai
Phone: +44 7360 539147
Website: https://financeflo.ai/leverageflo

Emergency Support: Available 24/7
Technical Issues: support@financeflo.ai
Billing Queries: billing@financeflo.ai

===========================================
CONFIDENTIALITY NOTICE:
===========================================

This transcript contains confidential and proprietary information 
about LeverageFlo technology and implementation strategies. 
Distribution is restricted to authorised personnel only.

© 2025 FinanceFlo.ai - All Rights Reserved
LeverageFlo is a trademark of FinanceFlo.ai

Generated: ${new Date().toLocaleDateString('en-GB')}
Reference: LF-${schedulingData.firstName.substring(0,2).toUpperCase()}${schedulingData.lastName.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-6)}
`;
  };

  const handleShareCalendar = () => {
    if (!schedulingData) return;
    
    const startDate = new Date(`${schedulingData.scheduledDate}T${schedulingData.scheduledTime}:00`);
    const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 minutes later
    
    const title = 'LeverageFlo Strategy Demonstration';
    const details = `Personalized demonstration of LeverageFlo automated cold outreach system for ${schedulingData.company}`;
    const location = 'Zoom (link will be provided via email)';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  if (!schedulingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(schedulingData.scheduledDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>LeverageFlo Demo Confirmed - {schedulingData.firstName} {schedulingData.lastName} | FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Your LeverageFlo strategy demonstration has been confirmed. Download your meeting transcript and prepare for your personalized demo." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Demo Confirmed!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Excellent, {schedulingData.firstName}! Your LeverageFlo strategy demonstration has been successfully scheduled. 
              We're excited to show you how to 10x your lead generation with automated cold outreach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Meeting Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Meeting Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Date</h3>
                    <p className="text-gray-700">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Time</h3>
                    <p className="text-gray-700">{schedulingData.scheduledTime} GMT (45 minutes)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Bot className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Meeting Type</h3>
                    <p className="text-gray-700">LeverageFlo Strategy Demonstration</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Platform</h4>
                  <p className="text-gray-700 text-sm">
                    Zoom (meeting link will be sent to {schedulingData.email} 24 hours before the call)
                  </p>
                </div>
                
                <button
                  onClick={handleShareCalendar}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Add to Google Calendar
                </button>
              </div>
            </motion.div>

            {/* Preparation Materials */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preparation Materials</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Demo Transcript</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Download your personalized demonstration transcript including agenda, 
                    key features to be covered, and expected outcomes for {schedulingData.company}.
                  </p>
                  <button
                    onClick={handleDownloadTranscript}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                      transcriptDownloaded
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {transcriptDownloaded ? 'Transcript Downloaded' : 'Download Transcript'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">What We'll Cover:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Voice AI Technology</h5>
                        <p className="text-gray-600 text-sm">Live demonstration of personalised voice messages</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Custom Strategy</h5>
                        <p className="text-gray-600 text-sm">Tailored approach for {schedulingData.industry} industry</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Bot className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Multi-Channel Automation</h5>
                        <p className="text-gray-600 text-sm">SMS, Email, WhatsApp, and voice integration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Confirmation Email</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive a detailed confirmation email with Zoom link and preparation materials
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Bot className="w-8 h-8 text-purple-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Demonstration</h3>
                <p className="text-gray-600 text-sm">
                  See LeverageFlo in action with real campaigns and personalised strategy review
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-green-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Proposal</h3>
                <p className="text-gray-600 text-sm">
                  Receive your tailored implementation plan within 24-48 hours after the demo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions or Need to Reschedule?</h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help. Contact us anytime before your scheduled demonstration.
              </p>
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

export default LeverageFloConfirmationPage;

