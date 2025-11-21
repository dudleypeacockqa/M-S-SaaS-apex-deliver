import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  CheckCircle, 
  Loader2, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Wrench, 
  Shield, 
  Award,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Star,
  Phone,
  Mail,
  CreditCard,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { handleFormSubmission } from '@/services/ghl';
import { ContactFormData } from '@/types/common';
import StripeTrialCheckout from '@/components/marketing/financeflo/StripeTrialCheckout';

const IntelliFlowFreeTrial = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: '',
    integrationChallenges: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
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
      const result = await handleFormSubmission({
        ...formData,
        source: 'IntelliFlow Free Trial'
      }, 'IntelliFlow Free Trial Registration');
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      id: 'included',
      question: "What's included in the trial?",
      answer: "Full access to Cognitive Professional features including 15 AI-enhanced integrations, 50 intelligent workflows, natural language configuration, predictive analytics, self-healing systems, and dedicated support."
    },
    {
      id: 'technical',
      question: "Do I need technical expertise?",
      answer: "No! IntelliFlow's natural language interface lets you configure integrations by simply describing what you want in plain English. Our AI handles all the technical complexity."
    },
    {
      id: 'real-systems',
      question: "Can I connect real systems?",
      answer: "Yes, you can connect your actual business systems during the trial. We provide secure sandbox environments and our team helps ensure safe connections to your production systems."
    },
    {
      id: 'after-trial',
      question: "What happens after 7 days?",
      answer: "You can continue with a paid plan starting at £3,500/month, or your trial account will be paused (not deleted) so you can reactivate anytime. No automatic charges - ever."
    },
    {
      id: 'support',
      question: "How do I get support?",
      answer: "Every trial includes a personal onboarding session, dedicated support team access, live chat, email support, and phone support during business hours."
    }
  ];

  const testimonials = [
    {
      quote: "The AI setup our Salesforce-QuickBooks integration in minutes. Incredible!",
      author: "Sarah M.",
      company: "TechFlow Ltd",
      role: "IT Director",
      rating: 5
    },
    {
      quote: "7 days was enough to see 300% efficiency improvement. We upgraded immediately.",
      author: "Michael C.",
      company: "Premier Financial",
      role: "CFO", 
      rating: 5
    },
    {
      quote: "The predictive analytics caught an issue before it happened. Sold!",
      author: "Emma T.",
      company: "GlobalTrade",
      role: "Operations Manager",
      rating: 5
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <Navigation />
        <div className="pt-20 pb-16 px-4 flex items-center justify-center min-h-screen">
          <Card className="max-w-2xl border-blue-200 bg-white shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to IntelliFlow!</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Your free trial account is being set up with AI-powered demo data.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">What happens next:</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                    <span className="text-blue-800">Check your email for login credentials (arriving in 2-3 minutes)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                    <span className="text-blue-800">Our AI is setting up personalized demo data for your industry</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
                    <span className="text-blue-800">Personal onboarding call will be scheduled within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">7 Days</div>
                  <div className="text-sm text-gray-600">Full Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">£0</div>
                  <div className="text-sm text-gray-600">No Credit Card</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                Questions? Call us at +44 7360 539147 or email ai@financeflo.ai
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <Helmet>
        <title>Free 7-Day IntelliFlow AI Trial | Agentic AI-Powered iPaaS | FinanceFlo.ai</title>
        <meta name="description" content="Start your free 7-day IntelliFlow AI trial. Experience agentic AI-powered integration with natural language configuration, predictive analytics, and self-healing workflows. Secure card verification required." />
        <meta name="keywords" content="IntelliFlow free trial, AI integration trial, agentic AI iPaaS trial, intelligent integration platform, enterprise AI trial UK, natural language integration" />
        <link rel="canonical" href="https://financeflo.ai/ipaas/free-trial" />
        
        {/* Schema.org for free trial offer */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": "IntelliFlow 7-Day Free Trial",
            "description": "Experience the full power of agentic AI-powered iPaaS platform",
            "price": "0",
            "priceCurrency": "GBP",
            "eligibleRegion": "GB",
            "validThrough": "2025-12-31",
            "itemOffered": {
              "@type": "SoftwareApplication",
              "name": "IntelliFlow",
              "applicationCategory": "BusinessApplication"
            }
          })}
        </script>
        
        <meta name="geo.region" content="GB" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
                  🚀 No Credit Card Required
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-gray-900">Start Your </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    7-Day IntelliFlow
                  </span>
                  <span className="text-gray-900"> AI Experience</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Full access to Cognitive Professional features - Experience the future of business integration with zero risk
                </p>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Complete AI agent access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Natural language configuration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Predictive analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Self-healing integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Personal onboarding session</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Dedicated support team</span>
                </div>
              </div>

              {/* Trust Elements */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Instant AI-powered transformation</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Full feature access</span>
                </div>
              </div>
            </div>

            {/* Right Column - Trial Registration Form */}
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl text-center">Start Your Free Trial</CardTitle>
                <p className="text-center text-blue-100">Setup takes less than 2 minutes</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        className="h-12"
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
                        className="h-12"
                      />
                    </div>
                  </div>

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
                      className="h-12"
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
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size *
                    </label>
                    <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Integration Challenge
                    </label>
                    <Textarea
                      value={formData.integrationChallenges}
                      onChange={(e) => handleInputChange('integrationChallenges', e.target.value)}
                      placeholder="What's your biggest integration challenge? (Optional)"
                      rows={3}
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{submitError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold h-14"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Setting up your trial...
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By starting your trial, you agree to our{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a> and{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">terms of service</a>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Happens Next?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Account Creation</h3>
              <p className="text-gray-600 text-sm">Your IntelliFlow account is created immediately with full access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Demo Setup</h3>
              <p className="text-gray-600 text-sm">Our AI creates realistic demo data tailored to your industry</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Onboarding</h3>
              <p className="text-gray-600 text-sm">Expert-led call within 24 hours to maximize your trial</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Building</h3>
              <p className="text-gray-600 text-sm">Begin creating integrations immediately with AI assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join 450+ Companies Already Using IntelliFlow</h2>
            <p className="text-lg text-gray-600">See what trial users are saying about their experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-600">450+</div>
                <div className="text-sm text-gray-600">Trial conversions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Trial satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">72%</div>
                <div className="text-sm text-gray-600">Convert to paid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                  >
                    <h3 className="font-semibold text-gray-900">{item.question}</h3>
                    {expandedFaq === item.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === item.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Integrations?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of businesses already experiencing the power of AI-driven integration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4"
              onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Free Trial Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-blue-900 hover:bg-white hover:text-blue-600 font-semibold px-8 py-4"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: +44 7360 539147
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntelliFlowFreeTrial;