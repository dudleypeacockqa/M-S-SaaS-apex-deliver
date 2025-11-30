import React from "react";
import { Link } from "react-router-dom";
import { FinanceFloLogo } from "./brand/FinanceFloLogo";
import { NewsletterSignupGDPR } from "./NewsletterSignupGDPR";

import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Youtube,
  Award,
  Shield,
  Zap,
  Users
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const industryLinks = [
    { name: "Private Equity", path: "/industries/private-equity" },
    { name: "Construction", path: "/industries/construction" },
    { name: "Financial Services", path: "/industries/financial-services" },
    { name: "Healthcare", path: "/industries/healthcare" },
    { name: "Professional Services", path: "/industries/professional-services" },
    { name: "Manufacturing", path: "/industries/manufacturing" },
  ];

  const erpLinks = [
    { name: "Sage Intacct", path: "/erp/sage-intacct" },
    { name: "Acumatica", path: "/erp/acumatica" },
    { name: "Odoo", path: "/erp/odoo" },
    { name: "NetSuite", path: "/erp/netsuite" },
    { name: "Microsoft Dynamics", path: "/erp/microsoft-dynamics" },
    { name: "SAP", path: "/erp/sap" },
  ];

  const intelliFlowLinks = [
    { name: "IntelliFlow Platform", path: "/ipaas/intelliflow" },
    { name: "AI Integration Demos", path: "/ipaas/intelliflow#demos" },
    { name: "Pricing & Plans", path: "/ipaas/intelliflow#pricing" },
    { name: "AI Success Stories", path: "/ipaas/intelliflow#success-stories" },
    { name: "Natural Language Config", path: "/ipaas/intelliflow#natural-language" },
    { name: "Predictive Intelligence", path: "/ipaas/intelliflow#predictive" },
  ];

  const resourceLinks = [
    { name: "Blog", path: "/blog", id: "blog" },
    { name: "Case Studies", path: "/blog?category=case-studies", id: "case-studies" },
    { name: "Implementation Guides", path: "/blog?category=implementation-guides", id: "guides" },
    { name: "ROI Calculator", path: "/resources/roi-calculator", id: "roi-calculator" },
    { name: "Free Assessment", path: "/assessment", id: "assessment" },
    { name: "Pricing", path: "/pricing", id: "pricing" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/careers" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ];

  return (
    <footer className="bg-flo-navy text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-flo-navy to-brand-navy-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your Business Today
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join 10,000+ business leaders who receive exclusive insights on AI integration,
              automation strategies, and intelligent business transformation delivered to their inbox.
            </p>
            <div className="max-w-lg mx-auto">
              <NewsletterSignupGDPR variant="default" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators - IntelliFlow Social Proof */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-400 mb-3" />
              <h4 className="font-bold text-lg mb-2">Trusted by 450+</h4>
              <p className="text-gray-400 text-sm">businesses worldwide</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-brand-teal-400 mb-3" />
              <h4 className="font-bold text-lg mb-2">99.99% Uptime</h4>
              <p className="text-gray-400 text-sm">Guaranteed AI-powered reliability</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-purple-400 mb-3" />
              <h4 className="font-bold text-lg mb-2">SOC 2 Type II</h4>
              <p className="text-gray-400 text-sm">Enterprise security certified</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-orange-400 mb-3" />
              <h4 className="font-bold text-lg mb-2">GDPR Compliant</h4>
              <p className="text-gray-400 text-sm">AI data handling certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Info Section - Full Width */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Brand and Description */}
              <div>
                <div className="mb-6">
                  <Link 
                    to="/" 
                    className="flex items-center hover:opacity-80 transition-opacity duration-200"
                    aria-label="FinanceFlo.AI - Home"
                  >
                    <FinanceFloLogo variant="full" size="lg" background="dark" />
                  </Link>
                  <p className="text-brand-teal-400 text-sm font-medium mt-2">
                    AI-Powered Finance Automation Platform
                  </p>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  FinanceFlo.AI transforms finance operations through intelligent automation and ERP integration. 
                  Our platform eliminates manual work, optimizes cash flow, and delivers real-time insights 
                  for UK businesses across industries.
                </p>
              </div>
              
              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-accent mr-3" />
                    <span className="text-gray-300">+44 7360 539147</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-accent mr-3" />
                    <span className="text-gray-300">helpdesk@erpsolutions.co.za</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-accent mr-3" />
                    <span className="text-gray-300">London, United Kingdom</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                    <Youtube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links - 5 Equal Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Industries */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Industries</h4>
              <ul className="space-y-2">
                {industryLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-accent transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ERP Solutions */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">ERP Solutions</h4>
              <ul className="space-y-2">
                {erpLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-accent transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-accent transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* IntelliFlow AI Platform */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">IntelliFlow AI</h4>
              <ul className="space-y-2">
                {intelliFlowLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-accent transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest insights on AI integration and intelligent automation.
              </p>
              <NewsletterSignupGDPR variant="compact" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; {currentYear} FinanceFlo.AI. All rights reserved.</p>
              <p className="mt-1">
                FinanceFlo.AI Platform™ is a trademark of FinanceFlo Ltd.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/about" className="text-gray-400 hover:text-accent transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">
                Contact
              </Link>
              <Link to="/careers" className="text-gray-400 hover:text-accent transition-colors">
                Careers
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-accent transition-colors">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

