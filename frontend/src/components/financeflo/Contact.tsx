
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import { enhancedAnalyticsService } from "@/services/analytics/enhancedAnalytics";
import { handleFormSubmission } from "@/services/ghl";

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    challenges: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Track enhanced lead capture
      const sessionData = {
        sessionId: `contact_${Date.now()}`,
        visitorId: localStorage.getItem('visitor_id') || undefined,
        deviceData: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screen: `${screen.width}x${screen.height}`
        },
        referrerData: {
          referrer: document.referrer,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        }
      };

      // Track the lead capture attempt
      await enhancedAnalyticsService.trackEnhancedLeadCapture(formData, sessionData);

      // Use enhanced form submission service
      const result = await handleFormSubmission(formData, 'Contact Form');

      if (result.success) {
        setIsSubmitted(true);
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          window.location.href = '/thank-you';
        }, 2000);
      } else {
        throw new Error(result.message || 'Form submission failed');
      }
    } catch (error) {
      import('@/utils/logger').then(({ logger }) => {
        logger.error('Form submission error', error as Error);
      });
      setSubmitError('Submission failed. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You!</h2>
                <p className="text-green-700 mb-4">
                  Your message has been successfully submitted to our system.
                </p>
                <p className="text-green-600">
                  A member of our team will contact you within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business with IntelliFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book a personalized demo and see how IntelliFlow can connect your systems and automate your workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get a Personalized Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      placeholder="First Name" 
                      className="border-gray-200"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                    <Input 
                      placeholder="Last Name" 
                      className="border-gray-200"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <Input 
                    placeholder="Business Email" 
                    type="email" 
                    className="border-gray-200"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Company Name" 
                    className="border-gray-200"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Phone Number" 
                    className="border-gray-200"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  <Textarea 
                    placeholder="Tell us about your current integration challenges and automation needs..."
                    className="border-gray-200 min-h-[120px]"
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                  />
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">{submitError}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit"
                    variant="brand-cta"
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Book Your Demo'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-brand-navy mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-gray-600">+44 7360 539147</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-brand-navy mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">helpdesk@financeflo.ai</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-brand-navy mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">Office</div>
                    <div className="text-gray-600">25 Old Broad Street, London EC2N 1HN</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-brand-navy mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">Business Hours</div>
                    <div className="text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM GMT</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-navy/5 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Why Choose IntelliFlow?</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-brand-navy rounded-full mr-3"></div>
                  Trusted by 450+ businesses worldwide
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-brand-navy rounded-full mr-3"></div>
                  99.99% uptime guaranteed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-brand-navy rounded-full mr-3"></div>
                  SOC 2 Type II certified
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-brand-navy rounded-full mr-3"></div>
                  GDPR compliant AI data handling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
