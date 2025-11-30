import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { NewsletterSignupGDPR } from "@/components/marketing/financeflo/NewsletterSignupGDPR";
import { logger } from "@/utils/logger";
import {
  Search,
  Home,
  Calculator,
  FileText,
  BookOpen,
  Phone,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Building2,
  Briefcase
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    logger.error(
      "404 Error: User attempted to access non-existent route",
      new Error(`Route not found: ${location.pathname}`)
    );
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const quickLinks = [
    {
      title: "Free ROI Calculator",
      description: "See how much you could save with AI automation",
      icon: Calculator,
      href: "/roi-calculator",
      color: "from-brand-navy to-brand-blue"
    },
    {
      title: "Success Stories",
      description: "Real results from UK businesses",
      icon: TrendingUp,
      href: "/case-studies",
      color: "from-brand-teal-600 to-green-600"
    },
    {
      title: "Blog & Insights",
      description: "Latest on AI automation & finance",
      icon: BookOpen,
      href: "/blog",
      color: "from-purple-600 to-purple-800"
    },
    {
      title: "Book a Demo",
      description: "Talk to our team today",
      icon: Phone,
      href: "/contact",
      color: "from-orange-600 to-red-600"
    }
  ];

  const popularPages = [
    { title: "Home", href: "/" },
    { title: "Pricing", href: "/pricing" },
    { title: "ROI Calculator", href: "/roi-calculator" },
    { title: "Contact Us", href: "/contact" },
    { title: "Construction Industry", href: "/industries/construction" },
    { title: "Private Equity", href: "/industries/private-equity" },
    { title: "Sage Intacct ERP", href: "/erp/sage-intacct" },
    { title: "Acumatica ERP", href: "/erp/acumatica" },
    { title: "Odoo ERP", href: "/erp/odoo" },
    { title: "Implementation Guides", href: "/implementation-guides" },
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-16 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-brand-navy to-brand-blue rounded-full mb-6 sm:mb-8 shadow-2xl">
            <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
          </div>

          <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 mb-4">404</h1>

          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            Oops! This Page Took an Unscheduled Break
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Even the best systems need a redirect sometimes. Let's get you back on track to optimizing your finance operations.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for what you need..."
                  className="pl-12 h-12 text-base sm:text-lg border-2 border-gray-300 focus:border-brand-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-brand-navy hover:bg-brand-navy-light h-12 px-6 sm:px-8 whitespace-nowrap"
              >
                Search
              </Button>
            </div>
          </form>

          <Link to="/">
            <Button variant="outline" size="lg" className="border-2">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Quick Links Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-heading font-bold text-center text-gray-900 mb-8">
            Popular Resources
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.href} className="group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`bg-gradient-to-br ${link.color} text-white p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <link.icon className="h-8 w-8" />
                    </div>
                    <h4 className="text-lg font-heading font-bold text-gray-900 mb-2">
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {link.description}
                    </p>
                    <div className="flex items-center justify-center text-brand-blue font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Industry Pages CTA */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-brand-navy to-brand-navy-light text-white overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                    <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
                    Looking for Industry-Specific Solutions?
                  </h3>
                  <p className="text-lg text-white/90 mb-4">
                    We've built specialized AI automation for construction, private equity, healthcare, and more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/industries/construction">
                      <Button size="lg" className="bg-white text-brand-navy hover:bg-gray-100 w-full sm:w-auto">
                        <Building2 className="mr-2 h-5 w-5" />
                        Construction
                      </Button>
                    </Link>
                    <Link to="/industries/private-equity">
                      <Button size="lg" className="bg-white/10 border-2 border-white text-white hover:bg-white/30 backdrop-blur-sm w-full sm:w-auto">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Private Equity
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-brand-navy to-brand-navy-light">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-3">
                  Get Free AI Automation Insights
                </h3>
                <p className="text-white/90">
                  Join 500+ finance leaders receiving weekly tips on AI automation, ERP integration, and business transformation.
                </p>
              </div>
              <NewsletterSignupGDPR variant="inline" className="max-w-2xl mx-auto" />
            </CardContent>
          </Card>
        </div>

        {/* Popular Pages */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-heading font-bold text-center text-gray-900 mb-8">
            Browse Popular Pages
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.href}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 text-center group border-2 border-transparent hover:border-brand-blue"
              >
                <p className="text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors">
                  {page.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Help CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <FileText className="h-12 w-12 text-brand-navy mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
              Still Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help. Get in touch and we'll point you in the right direction.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-brand-navy hover:bg-brand-navy-light w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
              <Link to="/assessment">
                <Button size="lg" variant="outline" className="border-2 w-full sm:w-auto">
                  <Calculator className="mr-2 h-5 w-5" />
                  Free Assessment
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              📞 +44 7360 539147  •  📧 helpdesk@financeflo.ai
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
