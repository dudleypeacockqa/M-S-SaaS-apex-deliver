import React, { useState } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Checkbox } from "@/components/marketing/financeflo/ui/checkbox";
import { CheckCircle, Loader2, Phone, Mail, MapPin, Clock, CheckCircle2, X, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { handleContactFormSubmissionAPI } from '@/services/ghl';
import { ContactFormData } from '../types/common';

const EnhancedContactForm: React.FC = () => {
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
    timeframe: 'ASAP'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'valid' | 'invalid' | null>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);

  const validateField = (field: string, value: string): boolean => {
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    if (field === 'phone') {
      return value.length >= 10;
    }
    if (field === 'firstName' || field === 'lastName' || field === 'companyName') {
      return value.trim().length > 0;
    }
    return true;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (touchedFields[field] && value.length > 0) {
      const isValid = validateField(field, value);
      setFieldStatus(prev => ({
        ...prev,
        [field]: isValid ? 'valid' : 'invalid'
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof ContactFormData];
    if (typeof value === 'string' && value.length > 0) {
      const isValid = validateField(field, value);
      setFieldStatus(prev => ({
        ...prev,
        [field]: isValid ? 'valid' : 'invalid'
      }));
    }
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
      const result = await handleContactFormSubmissionAPI(formData, 'Contact Form');

      if (result.success) {
        setIsSubmitted(true);
        // Stay on page - no redirect needed
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
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You!</h2>
            <p className="text-green-700 mb-4">
              Your information has been successfully submitted to our system.
            </p>
            <p className="text-green-600">
              A member of our team will contact you within 24 hours to discuss your requirements.
            </p>
            <div className="mt-6">
              <Badge className="bg-green-100 text-green-800">
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
        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                Get In Touch - We're Here to Help!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="tel:+447360539147" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">🇬🇧 UK: +44 7360 539147</div>
                  <div className="text-sm text-gray-600">London Office</div>
                </div>
              </a>
              <a href="tel:+19176231470" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">🇺🇸 USA: +1 917 623 1470</div>
                  <div className="text-sm text-gray-600">New York Office</div>
                </div>
              </a>
              <a href="tel:+27600801412" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">🇿🇦 SA: +27 60 080 1412</div>
                  <div className="text-sm text-gray-600">Johannesburg Office</div>
                </div>
              </a>
              <a href="mailto:helpdesk@financeflo.ai" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">📧 helpdesk@financeflo.ai</div>
                  <div className="text-sm text-gray-600">We respond within hours, not days</div>
                </div>
              </a>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">⚡ Response Time: &lt; 24 hours</div>
                  <div className="text-sm text-gray-600">Guaranteed quick turnaround</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                What Happens Next?
              </h3>
              <div className="space-y-4 text-blue-700">
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">1</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">⚡ Immediate Confirmation</div>
                    <div className="text-sm">You'll receive an email confirmation within minutes - check your inbox!</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">2</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">💬 Personal Consultation Call</div>
                    <div className="text-sm">Our experts will reach out within 24 hours to discuss your needs</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 group-hover:scale-110 transition-transform">3</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">🎯 Custom Solution Demo</div>
                    <div className="text-sm">See IntelliFlow in action with a demo tailored to your business</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600 italic">No commitment required. Free consultation. Cancel anytime.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Get Your Free Business Requirements Review</CardTitle>
            <p className="text-gray-600">
              Complete the form below and our team will contact you within 24 hours to discuss 
              how IntelliFlow can transform your business with intelligent automation and seamless integrations.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      required
                      placeholder="John"
                      autoComplete="given-name"
                      className={`pr-10 transition-all ${
                        fieldStatus.firstName === 'valid' ? 'border-green-500 focus:ring-green-500' :
                        fieldStatus.firstName === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {fieldStatus.firstName === 'valid' && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                    )}
                    {fieldStatus.firstName === 'invalid' && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 animate-in zoom-in duration-200" />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      required
                      placeholder="Smith"
                      autoComplete="family-name"
                      className={`pr-10 transition-all ${
                        fieldStatus.lastName === 'valid' ? 'border-green-500 focus:ring-green-500' :
                        fieldStatus.lastName === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {fieldStatus.lastName === 'valid' && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                    )}
                    {fieldStatus.lastName === 'invalid' && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 animate-in zoom-in duration-200" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      required
                      placeholder="john.smith@company.com"
                      autoComplete="email"
                      className={`pr-10 transition-all ${
                        fieldStatus.email === 'valid' ? 'border-green-500 focus:ring-green-500' :
                        fieldStatus.email === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {fieldStatus.email === 'valid' && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                    )}
                    {fieldStatus.email === 'invalid' && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 animate-in zoom-in duration-200" />
                    )}
                  </div>
                  {fieldStatus.email === 'invalid' && (
                    <p className="text-xs text-red-500 mt-1 animate-in fade-in duration-200">Please enter a valid email address</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      required
                      placeholder="+44 7360 539147"
                      autoComplete="tel"
                      className={`pr-10 transition-all ${
                        fieldStatus.phone === 'valid' ? 'border-green-500 focus:ring-green-500' :
                        fieldStatus.phone === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {fieldStatus.phone === 'valid' && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                    )}
                    {fieldStatus.phone === 'invalid' && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 animate-in zoom-in duration-200" />
                    )}
                  </div>
                  {fieldStatus.phone === 'invalid' && (
                    <p className="text-xs text-red-500 mt-1 animate-in fade-in duration-200">Phone number must be at least 10 digits</p>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    onBlur={() => handleBlur('companyName')}
                    required
                    placeholder="Your Company Ltd"
                    autoComplete="organization"
                    className={`pr-10 transition-all ${
                      fieldStatus.companyName === 'valid' ? 'border-green-500 focus:ring-green-500' :
                      fieldStatus.companyName === 'invalid' ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {fieldStatus.companyName === 'valid' && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in duration-200" />
                  )}
                  {fieldStatus.companyName === 'invalid' && (
                    <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 animate-in zoom-in duration-200" />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                      <SelectItem value="5000+">5000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue
                  </label>
                  <Select value={formData.annualRevenue} onValueChange={(value) => handleInputChange('annualRevenue', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under £1M">Under £1M</SelectItem>
                      <SelectItem value="£1M-£5M">£1M - £5M</SelectItem>
                      <SelectItem value="£5M-£10M">£5M - £10M</SelectItem>
                      <SelectItem value="£10M-£25M">£10M - £25M</SelectItem>
                      <SelectItem value="£25M-£50M">£25M - £50M</SelectItem>
                      <SelectItem value="£50-£100M">£50 - £100M</SelectItem>
                      <SelectItem value="£100M+">£100M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of systems to connect
                </label>
                <Select value={formData.currentERP} onValueChange={(value) => handleInputChange('currentERP', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of systems" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2-3 systems</SelectItem>
                    <SelectItem value="4-6">4-6 systems</SelectItem>
                    <SelectItem value="7-10">7-10 systems</SelectItem>
                    <SelectItem value="11-20">11-20 systems</SelectItem>
                    <SelectItem value="20+">20+ systems</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country/Region
                  </label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="painPoints" className="block text-sm font-medium text-gray-700 mb-2">
                  Current integration challenges *
                </label>
                <Textarea
                  id="painPoints"
                  name="painPoints"
                  value={formData.painPoints}
                  onChange={(e) => handleInputChange('painPoints', e.target.value)}
                  required
                  placeholder="Describe your current challenges with system integration, data silos, workflow automation, etc."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest in AI automation level
                  </label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI automation interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic integration only</SelectItem>
                      <SelectItem value="moderate">Moderate AI automation</SelectItem>
                      <SelectItem value="advanced">Advanced AI features</SelectItem>
                      <SelectItem value="full">Full AI transformation</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred demo type
                  </label>
                  <Select value={formData.preferredContactMethod} onValueChange={(value) => handleInputChange('preferredContactMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select demo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live-demo">Live product demo</SelectItem>
                      <SelectItem value="use-case">Industry-specific use case</SelectItem>
                      <SelectItem value="technical">Technical deep dive</SelectItem>
                      <SelectItem value="roi">ROI-focused presentation</SelectItem>
                      <SelectItem value="custom">Custom presentation</SelectItem>
                      <SelectItem value="video-call">Video call discussion</SelectItem>
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
                  I consent to receive communications from FinanceFlo.ai about my inquiry, product updates, and related insights.
                  By submitting this form, I agree to be contacted regarding my business requirements review.{' '}
                  <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Your Request...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get My Free IntelliFlow Demo
                    </>
                  )}
                </Button>

              <p className="text-xs text-center text-gray-500">
                * Required fields. We respect your privacy and will only use your information to contact you about your business requirements.
                We'll respond within 24 hours to schedule your free consultation.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedContactForm;

