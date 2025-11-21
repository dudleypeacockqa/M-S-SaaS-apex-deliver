import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import EnhancedContactForm from "@/components/marketing/financeflo/EnhancedContactForm";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { CheckCircle, Clock, Users, Award, Sparkles, Zap, Shield, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/marketing/financeflo/ui/accordion";

const ContactPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Load GHL booking widget script
    const script = document.createElement('script');
    script.src = 'https://brand.financeflo.ai/js/form_embed.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    // Show "recently booked" notification after 5 seconds
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 5000);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      clearTimeout(notificationTimer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Social proof notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="border-green-200 bg-white shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Someone from London</div>
                <div className="text-xs text-gray-600">Just booked a demo 2 mins ago</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Helmet>
        <title>Contact FinanceFlo.ai | Get Your Free AI Finance Assessment</title>
        <meta name="description" content="Contact FinanceFlo.ai for a free AI finance automation consultation. UK, USA & SA offices available. Get expert ERP integration advice and AI transformation guidance within 24 hours." />
        <meta name="keywords" content="contact FinanceFlo, AI finance consultation UK, ERP integration contact, finance automation inquiry, AI transformation support, UK finance consultants" />
        <link rel="canonical" href="https://financeflo.ai/contact" />

        {/* Open Graph */}
        <meta property="og:title" content="Contact FinanceFlo.ai | Free AI Finance Assessment" />
        <meta property="og:description" content="Get expert AI finance automation advice. Free consultation with response within 24 hours. UK, USA & SA offices." />
        <meta property="og:url" content="https://financeflo.ai/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FinanceFlo.ai" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact FinanceFlo.ai | Free AI Finance Assessment" />
        <meta name="twitter:description" content="Get expert AI finance automation advice within 24 hours." />
      </Helmet>

      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 animate-in fade-in duration-700">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Trusted by 450+ Businesses Worldwide</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Ready to Transform Your Business with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IntelliFlow?
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Get your free Business Requirements Review and discover how IntelliFlow
            can integrate your systems and automate workflows with intelligent AI.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 animate-in zoom-in duration-500 delay-500" />
                  <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full animate-pulse" />
                </div>
                <h3 className="font-bold text-green-800 mb-2">Free Consultation</h3>
                <p className="text-green-700">No cost, no obligation business review</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-in zoom-in duration-500 delay-600" />
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full animate-pulse" />
                </div>
                <h3 className="font-bold text-blue-800 mb-2">24-Hour Response</h3>
                <p className="text-blue-700">Quick response from our expert team</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Award className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-in zoom-in duration-500 delay-700" />
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full animate-pulse" />
                </div>
                <h3 className="font-bold text-purple-800 mb-2">Proven Results</h3>
                <p className="text-purple-700">500+ successful implementations</p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Calendar Widget */}
          <div id="booking" className="max-w-4xl mx-auto mt-12 mb-12">
            <iframe
              src="https://brand.financeflo.ai/widget/booking/dojziG1FjH2TGQUYJiEO"
              style={{width: '100%', border: 'none', overflow: 'hidden'}}
              scrolling="no"
              id="dojziG1FjH2TGQUYJiEO_1760042333797"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <EnhancedContactForm />
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Real Results from Real Businesses</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by 450+ Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join companies that have achieved remarkable transformation with IntelliFlow AI
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="relative inline-block">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">300%</div>
                <div className="absolute inset-0 bg-blue-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-gray-600 font-medium">Average Prospect Increase</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="relative inline-block">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">60%</div>
                <div className="absolute inset-0 bg-green-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-gray-600 font-medium">Cost Reduction</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="relative inline-block">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">8 Weeks</div>
                <div className="absolute inset-0 bg-purple-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-gray-600 font-medium">Average Implementation</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="relative inline-block">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-2">98%</div>
                <div className="absolute inset-0 bg-orange-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Common Questions</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to questions you might have
            </p>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    How quickly can I expect a response after submitting the form?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our team typically responds within 24 hours during business days (Monday-Friday).
                    For urgent inquiries, please call us directly at one of our office numbers, and we'll
                    connect you with a specialist immediately.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    Is the consultation really free with no obligation?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, absolutely! Our initial Business Requirements Review is completely free with no
                    strings attached. We'll discuss your needs, show you how IntelliFlow can help, and
                    provide a custom proposal. There's no pressure to commit, and you can cancel at any time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    What information do I need to prepare for the consultation?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Just come with a general understanding of your current challenges and goals. We'll
                    guide you through the discovery process. It's helpful to know which systems you're
                    currently using (ERP, CRM, e-commerce, etc.) and what manual processes you'd like to automate.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    How long does a typical implementation take?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our average implementation timeline is 8 weeks, but this varies based on complexity
                    and the number of systems to integrate. We'll provide a detailed timeline during your
                    consultation based on your specific requirements.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    Do you offer support after implementation?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes! We provide ongoing support and maintenance to ensure your IntelliFlow integration
                    runs smoothly. Our support team is available via phone, email, and live chat during
                    business hours, with 99.99% uptime guaranteed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    Which countries and regions do you serve?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We have offices in the UK (London), USA (New York), and South Africa (Johannesburg),
                    but we serve clients globally. Our cloud-based platform works anywhere, and we have
                    experience integrating with systems in multiple currencies and languages.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Still have questions?</strong> Call us at{' '}
                  <a href="tel:+447360539147" className="text-blue-600 hover:underline font-semibold">
                    +44 7360 539147
                  </a>{' '}
                  or email{' '}
                  <a href="mailto:helpdesk@financeflo.ai" className="text-blue-600 hover:underline font-semibold">
                    helpdesk@financeflo.ai
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;

