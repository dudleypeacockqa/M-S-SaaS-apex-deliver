import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Calendar, 
  CheckCircle, 
  Star, 
  Clock, 
  Shield,
  Award,
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAnalytics } from './AnalyticsTracker';

interface AdvancedLeadCaptureProps {
  title?: string;
  subtitle?: string;
  formType?: 'assessment' | 'demo' | 'consultation' | 'download';
  erpSystem?: string;
  industry?: string;
  showVoiceMessage?: boolean;
  voiceMessageSrc?: string;
  urgencyMessage?: string;
  socialProof?: {
    clientCount: string;
    successRate: string;
    avgROI: string;
  };
  onSubmit?: (formData: Record<string, unknown>) => void;
}

export const AdvancedLeadCapture: React.FC<AdvancedLeadCaptureProps> = ({
  title = "Get Your Free AI+ERP Transformation Assessment",
  subtitle = "Join 500+ businesses that have revolutionized their operations",
  formType = 'assessment',
  erpSystem,
  industry,
  showVoiceMessage = true,
  voiceMessageSrc = "/audio/british_voice_lead_capture.wav",
  urgencyMessage = "Limited slots available this quarter",
  socialProof = {
    clientCount: "500+",
    successRate: "98%",
    avgROI: "300%"
  },
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    currentSystem: '',
    challenges: '',
    timeline: '',
    budget: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showUrgency, setShowUrgency] = useState(false);
  
  const { trackFormSubmission, trackEvent } = useAnalytics();

  useEffect(() => {
    // Show urgency message after 30 seconds
    const timer = setTimeout(() => setShowUrgency(true), 30000);
    
    // Initialize audio element
    if (showVoiceMessage && voiceMessageSrc) {
      const audio = new Audio(voiceMessageSrc);
      audio.preload = 'metadata';
      setAudioElement(audio);
    }
    
    return () => {
      clearTimeout(timer);
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement, showVoiceMessage, voiceMessageSrc]); // Added missing dependencies

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track form interaction
    trackEvent('form_field_interaction', {
      category: 'form',
      label: field,
      form_type: formType,
      field_name: field
    });
  };

  const handleVoiceToggle = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
      trackEvent('voice_message_pause', {
        category: 'engagement',
        label: 'lead_capture_voice'
      });
    } else {
      audioElement.play();
      setIsPlaying(true);
      trackEvent('voice_message_play', {
        category: 'engagement',
        label: 'lead_capture_voice'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Track form submission
      trackFormSubmission(`${formType}_form`, {
        ...formData,
        erp_system: erpSystem,
        industry: industry,
        form_type: formType
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setIsSubmitted(true);
      
      // Track successful submission
      trackEvent('lead_capture_success', {
        category: 'conversion',
        label: formType,
        form_type: formType,
        erp_system: erpSystem,
        industry: industry
      });
      
    } catch (error) {
      import('@/utils/logger').then(({ logger }) => {
        logger.error('Form submission error', error as Error);
      });
      trackEvent('lead_capture_error', {
        category: 'error',
        label: formType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You! Your Assessment is Confirmed
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Our AI+ERP specialist will contact you within 24 hours to schedule your personalized assessment.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">24 Hour Response</div>
              <div className="text-sm text-gray-600">Guaranteed contact time</div>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">90-Minute Session</div>
              <div className="text-sm text-gray-600">Comprehensive analysis</div>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">£2,500 Value</div>
              <div className="text-sm text-gray-600">Complimentary assessment</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = 'tel:+447360539147'}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: +44 7360 539147
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            {socialProof.successRate} Success Rate
          </Badge>
        </div>
        
        <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </CardTitle>
        
        <p className="text-xl text-gray-600 mb-6">
          {subtitle}
        </p>

        {/* Voice Message */}
        {showVoiceMessage && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceToggle}
                className="bg-white"
              >
                {isPlaying ? (
                  <VolumeX className="w-4 h-4 mr-2" />
                ) : (
                  <Volume2 className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'} Personal Message
              </Button>
              <span className="text-sm text-gray-600">
                From Sarah, AI+ERP Specialist
              </span>
            </div>
          </div>
        )}

        {/* Social Proof */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{socialProof.clientCount}</div>
            <div className="text-sm text-gray-600">Businesses Transformed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{socialProof.avgROI}</div>
            <div className="text-sm text-gray-600">Average ROI</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{socialProof.successRate}</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Urgency Message */}
        {showUrgency && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-center text-orange-800">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-semibold">{urgencyMessage}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-form-name={`${formType}_form`}>
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              className="border-gray-200"
            />
            <Input
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              className="border-gray-200"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder="Business Email *"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="border-gray-200"
            />
            <Input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="border-gray-200"
            />
          </div>

          {/* Business Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Company Name *"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              required
              className="border-gray-200"
            />
            <Input
              placeholder="Your Role/Title *"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              required
              className="border-gray-200"
            />
          </div>

          {/* ERP Specific */}
          <Input
            placeholder={`Current ${erpSystem || 'ERP'} System`}
            value={formData.currentSystem}
            onChange={(e) => handleInputChange('currentSystem', e.target.value)}
            className="border-gray-200"
          />

          {/* Challenges */}
          <Textarea
            placeholder="What are your biggest finance/ERP challenges? *"
            value={formData.challenges}
            onChange={(e) => handleInputChange('challenges', e.target.value)}
            required
            className="border-gray-200 min-h-[100px]"
          />

          {/* Timeline and Budget */}
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-md"
              required
            >
              <option value="">Implementation Timeline *</option>
              <option value="immediate">Immediate (0-3 months)</option>
              <option value="short">Short-term (3-6 months)</option>
              <option value="medium">Medium-term (6-12 months)</option>
              <option value="long">Long-term (12+ months)</option>
            </select>
            
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-md"
            >
              <option value="">Budget Range (Optional)</option>
              <option value="under-50k">Under £50,000</option>
              <option value="50k-100k">£50,000 - £100,000</option>
              <option value="100k-250k">£100,000 - £250,000</option>
              <option value="250k-plus">£250,000+</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-xl py-4"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-5 w-5" />
                Get My Free {formType === 'assessment' ? 'Assessment' : 'Consultation'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-600" />
                100% Secure
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-600" />
                Takes 2 Minutes
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-purple-600" />
                No Spam Ever
              </div>
            </div>
            <p>
              🔒 Your information is 100% secure and will never be shared
            </p>
            <p>
              ⚡ Assessment normally costs £2,500 - yours is complimentary
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedLeadCapture;

