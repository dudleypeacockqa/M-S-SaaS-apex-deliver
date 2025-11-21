import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SitemapPage = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap - FinanceFlo.ai | AI-Powered Finance Automation</title>
        <meta name="description" content="FinanceFlo.ai sitemap - Find all pages and resources on our AI-powered finance automation platform." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
            <p className="text-lg text-gray-600">
              Find all pages and resources on our website
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-600 hover:underline">Home</Link></li>
                <li><Link to="/about" className="text-blue-600 hover:underline">About Us</Link></li>
                <li><Link to="/pricing" className="text-blue-600 hover:underline">Pricing</Link></li>
                <li><Link to="/contact" className="text-blue-600 hover:underline">Contact</Link></li>
                <li><Link to="/blog" className="text-blue-600 hover:underline">Blog</Link></li>
                <li><Link to="/careers" className="text-blue-600 hover:underline">Careers</Link></li>
                <li><Link to="/team" className="text-blue-600 hover:underline">Team</Link></li>
              </ul>
            </div>

            {/* Industries */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Industries</h2>
              <ul className="space-y-2">
                <li><Link to="/industries/construction" className="text-blue-600 hover:underline">Construction</Link></li>
                <li><Link to="/industries/financial-services" className="text-blue-600 hover:underline">Financial Services</Link></li>
                <li><Link to="/industries/healthcare" className="text-blue-600 hover:underline">Healthcare</Link></li>
                <li><Link to="/industries/private-equity" className="text-blue-600 hover:underline">Private Equity</Link></li>
                <li><Link to="/industries/investment-banking" className="text-blue-600 hover:underline">Investment Banking</Link></li>
                <li><Link to="/industries/family-office" className="text-blue-600 hover:underline">Family Office</Link></li>
                <li><Link to="/industries/insurance" className="text-blue-600 hover:underline">Insurance</Link></li>
                <li><Link to="/industries/capital-markets" className="text-blue-600 hover:underline">Capital Markets</Link></li>
                <li><Link to="/industries/professional-services" className="text-blue-600 hover:underline">Professional Services</Link></li>
                <li><Link to="/industries/subscription-business" className="text-blue-600 hover:underline">Subscription Business</Link></li>
                <li><Link to="/industries/ecommerce" className="text-blue-600 hover:underline">Ecommerce</Link></li>
                <li><Link to="/industries/manufacturing" className="text-blue-600 hover:underline">Manufacturing</Link></li>
              </ul>
            </div>

            {/* ERP Solutions */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ERP Solutions</h2>
              <ul className="space-y-2">
                <li><Link to="/erp/sage-intacct" className="text-blue-600 hover:underline">Sage Intacct</Link></li>
                <li><Link to="/erp/acumatica" className="text-blue-600 hover:underline">Acumatica</Link></li>
                <li><Link to="/erp/odoo" className="text-blue-600 hover:underline">Odoo</Link></li>
                <li><Link to="/erp/netsuite" className="text-blue-600 hover:underline">NetSuite</Link></li>
                <li><Link to="/erp/microsoft-dynamics" className="text-blue-600 hover:underline">Microsoft Dynamics</Link></li>
                <li><Link to="/erp/sap" className="text-blue-600 hover:underline">SAP</Link></li>
                <li><Link to="/erp/quickbooks" className="text-blue-600 hover:underline">QuickBooks</Link></li>
                <li><Link to="/erp/xero" className="text-blue-600 hover:underline">Xero</Link></li>
                <li><Link to="/erp/oracle" className="text-blue-600 hover:underline">Oracle</Link></li>
              </ul>
            </div>

            {/* Implementation Pages */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Implementation</h2>
              <ul className="space-y-2">
                <li><Link to="/implementation/sage-intacct" className="text-blue-600 hover:underline">Sage Intacct Implementation</Link></li>
                <li><Link to="/implementation/acumatica" className="text-blue-600 hover:underline">Acumatica Implementation</Link></li>
                <li><Link to="/implementation/odoo" className="text-blue-600 hover:underline">Odoo Implementation</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resources</h2>
              <ul className="space-y-2">
                <li><Link to="/case-studies" className="text-blue-600 hover:underline">Case Studies</Link></li>
                <li><Link to="/case-studies/meridian-construction" className="text-blue-600 hover:underline">Meridian Construction Case</Link></li>
                <li><Link to="/case-studies/techflow-financial" className="text-blue-600 hover:underline">TechFlow Financial Case</Link></li>
                <li><Link to="/case-studies/precision-manufacturing" className="text-blue-600 hover:underline">Precision Manufacturing Case</Link></li>
                <li><Link to="/roi-calculator" className="text-blue-600 hover:underline">ROI Calculator</Link></li>
                <li><Link to="/assessment" className="text-blue-600 hover:underline">Free Assessment</Link></li>
                <li><Link to="/demo" className="text-blue-600 hover:underline">Interactive Demo</Link></li>
              </ul>
            </div>

            {/* VSL Funnels */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">VSL Funnels</h2>
              <ul className="space-y-2">
                <li><Link to="/vsl/construction/opt-in" className="text-blue-600 hover:underline">Construction VSL</Link></li>
                <li><Link to="/vsl/healthcare/opt-in" className="text-blue-600 hover:underline">Healthcare VSL</Link></li>
                <li><Link to="/vsl/financial-services/opt-in" className="text-blue-600 hover:underline">Financial Services VSL</Link></li>
                <li><Link to="/vsl/private-equity/opt-in" className="text-blue-600 hover:underline">Private Equity VSL</Link></li>
                <li><Link to="/vsl/ecommerce/opt-in" className="text-blue-600 hover:underline">Ecommerce VSL</Link></li>
                <li><Link to="/vsl/manufacturing/opt-in" className="text-blue-600 hover:underline">Manufacturing VSL</Link></li>
                <li><Link to="/ecommerce-application" className="text-blue-600 hover:underline">Application Funnel</Link></li>
              </ul>
            </div>

            {/* Legal Pages */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Legal</h2>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link></li>
                <li><Link to="/sitemap" className="text-blue-600 hover:underline">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? 
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;

