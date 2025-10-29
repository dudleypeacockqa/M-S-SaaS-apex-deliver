import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, CalendarCheck } from 'lucide-react';

// Placeholder components for navigation and footer
// In a real project, these would be imported from a shared components directory
const MarketingNav = () => (
  <header className="bg-blue-950 text-white p-4 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <span className="text-xl font-bold text-emerald-400">ApexDeliver</span>
      <nav className="space-x-4">
        <a href="#" className="hover:text-blue-300">Home</a>
        <a href="#" className="hover:text-blue-300">Services</a>
        <a href="#" className="hover:text-blue-300">Contact</a>
      </nav>
    </div>
  </header>
);

const MarketingFooter = () => (
  <footer className="bg-gray-800 text-gray-400 p-8 mt-12">
    <div className="max-w-7xl mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} ApexDeliver + CapLiquify. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <>
      <MarketingNav />
      <main className="container mx-auto py-12 px-4 md:px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-4">
            Connect with Our M&A Advisory Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to discuss your strategic transaction? Reach out to our experts at ApexDeliver and CapLiquify to initiate a confidential conversation.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form Card - Takes 2/3 space on large screens */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-t-4 border-emerald-500">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-950">Send Us a Message</CardTitle>
                <CardDescription className="text-gray-500">
                  Fill out the form below, and a dedicated advisor will respond within one business day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@company.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Firm</Label>
                    <Input id="company" placeholder="Acme Holdings" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Inquiry</Label>
                    <Textarea id="message" placeholder="I am interested in exploring sell-side advisory services for a mid-market technology firm..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-lg transition-colors">
                    Submit Confidential Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & CTA Card - Takes 1/3 space on large screens */}
          <div className="lg:col-span-1 space-y-8">
            {/* Direct Email Card */}
            <Card className="bg-blue-950 text-white shadow-2xl border-t-4 border-blue-400">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-emerald-400">Direct Contact</CardTitle>
                <CardDescription className="text-gray-300">
                  For immediate and direct correspondence.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <a href="mailto:contact@apexdeliver.com" className="text-lg font-medium hover:text-blue-300 transition-colors">
                    contact@apexdeliver.com
                  </a>
                </div>
                <p className="text-sm text-gray-400">
                  We prioritize the security and confidentiality of all communications.
                </p>
              </CardContent>
            </Card>

            {/* Schedule Demo CTA Card */}
            <Card className="bg-white shadow-2xl border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-950">Schedule a Demo</CardTitle>
                <CardDescription className="text-gray-600">
                  Book a dedicated session to see how our combined platform accelerates M&A success.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-lg transition-colors">
                  <a href="https://calendly.com/apexdeliver-demo" target="_blank" rel="noopener noreferrer">
                    <CalendarCheck className="w-5 h-5 mr-2" />
                    Book Your Strategy Session
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
};

export default Contact;