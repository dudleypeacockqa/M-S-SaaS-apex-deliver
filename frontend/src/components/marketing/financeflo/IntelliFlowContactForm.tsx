import React, { useState } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Checkbox } from "@/components/marketing/financeflo/ui/checkbox";
import { CheckCircle, Loader2, Brain, MessageSquare, BarChart3, Wrench, Phone, Mail, MapPin, Clock, Shield, Award } from "lucide-react";
import { Link } from 'react-router-dom';
import { handleFormSubmission } from '@/services/ghl';
import { ContactFormData } from '../types/common';

const IntelliFlowContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: '',
    currentERP: '',
    annualRevenue: '',
    painPoints: '',
    country: 'UK',
    interestLevel: 'High',
    preferredContactMethod: 'any',
    timeframe: 'ASAP',
    // IntelliFlow-specific fields
    integrationChallenges: '',
    systemsToConnect: '',
    aiAutomationInterest: 'high',
    preferredDemoType: 'full-platform',
    currentIntegrationMethod: 'manual'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setSubmitError('Please consent to receive communications from FinanceFlo.ai');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await handleFormSubmission(formData, 'IntelliFlow Contact Form');
      
      if (result.success) {
        setIsSubmitted(true);
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          window.location.href = '/thank-you';
        }, 2000);
      } else {
        setSubmitError(result.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Thank You!</h2>
            <p className="text-blue-700 mb-4">
              Your IntelliFlow inquiry has been successfully submitted to our AI integration specialists.
            </p>
            <p className="text-blue-600">
              An IntelliFlow expert will contact you within 24 hours to discuss your AI integration needs.
            </p>
            <div className="mt-6">
              <Badge className="bg-blue-100 text-blue-800">
                Redirecting to confirmation page...
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* IntelliFlow Information */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                IntelliFlow AI Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">450+</div>
                  <div className="text-sm text-gray-600">Businesses using AI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.99%</div>
                  <div className="text-sm text-gray-600">Uptime guaranteed</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-700">GDPR Compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">UK: +44 7360 539147</div>
                  <div className="text-sm text-gray-600">IntelliFlow Specialists</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">ai@financeflo.ai</div>
                  <div className="text-sm text-gray-600">IntelliFlow Inquiries</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">AI Demo: &lt; 30 minutes</div>
                  <div className="text-sm text-gray-600">Live platform demonstration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-800 mb-3">What Happens Next?</h3>
              <div className="space-y-3 text-blue-700">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</div>
                  <div>
                    <div className="font-medium">AI Integration Assessment</div>
                    <div className="text-sm">Our AI specialists analyze your requirements</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</div>
                  <div>
                    <div className="font-medium">Personalized Demo</div>
                    <div className="text-sm">Live demonstration with your actual data</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</div>
                  <div>
                    <div className="font-medium">AI Implementation Plan</div>
                    <div className="text-sm">Custom roadmap for your AI transformation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IntelliFlow Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Get Your Free IntelliFlow AI Assessment</CardTitle>
            <p className="text-gray-600">
              Discover how IntelliFlow's AI can transform your business integrations. 
              Complete the form below for a personalized demonstration.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="john.smith@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="+44 7360 539147"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                  placeholder="Your Company Ltd"
                />
              </div>

              {/* IntelliFlow-specific Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Integration Challenges *
                </label>
                <Textarea
                  value={formData.integrationChallenges}
                  onChange={(e) => handleInputChange('integrationChallenges', e.target.value)}
                  required
                  placeholder="Describe your current challenges with system integrations, data silos, manual processes..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Systems to Connect *
                </label>
                <Select value={formData.systemsToConnect} onValueChange={(value) => handleInputChange('systemsToConnect', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of systems" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-5">2-5 systems</SelectItem>
                    <SelectItem value="6-10">6-10 systems</SelectItem>
                    <SelectItem value="11-20">11-20 systems</SelectItem>
                    <SelectItem value="20+">20+ systems</SelectItem>
                    <SelectItem value="unsure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest in AI Automation Level
                  </label>
                  <Select value={formData.aiAutomationInterest} onValueChange={(value) => handleInputChange('aiAutomationInterest', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High - Ready to implement</SelectItem>
                      <SelectItem value="medium">Medium - Actively exploring</SelectItem>
                      <SelectItem value="low">Low - Early research</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Demo Type
                  </label>
                  <Select value={formData.preferredDemoType} onValueChange={(value) => handleInputChange('preferredDemoType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select demo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural-language">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Natural Language Config
                        </div>
                      </SelectItem>
                      <SelectItem value="predictive-analytics">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Predictive Analytics
                        </div>
                      </SelectItem>
                      <SelectItem value="self-healing">
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 mr-2" />
                          Self-Healing Systems
                        </div>
                      </SelectItem>
                      <SelectItem value="full-platform">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Full Platform Demo
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">Custom Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Integration Method
                  </label>
                  <Select value={formData.currentIntegrationMethod} onValueChange={(value) => handleInputChange('currentIntegrationMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual data entry</SelectItem>
                      <SelectItem value="basic-automation">Basic automation tools</SelectItem>
                      <SelectItem value="custom-scripts">Custom scripts/APIs</SelectItem>
                      <SelectItem value="existing-platform">Existing integration platform</SelectItem>
                      <SelectItem value="none">No current integrations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Implementation Timeframe
                  </label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASAP">ASAP (Within 30 days)</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6+ months">6+ months</SelectItem>
                      <SelectItem value="just researching">Just researching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{submitError}</p>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 leading-tight cursor-pointer">
                  I consent to receive communications from FinanceFlo.ai about IntelliFlow AI platform, product updates, and related insights.
                  By submitting this form, I agree to be contacted regarding my IntelliFlow AI assessment.{' '}
                  <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !consent}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get My Free IntelliFlow AI Assessment'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                * Required fields. We respect your privacy and will only use your information for your IntelliFlow assessment.
                We'll contact you within 24 hours to schedule your personalized IntelliFlow demonstration.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelliFlowContactForm;
