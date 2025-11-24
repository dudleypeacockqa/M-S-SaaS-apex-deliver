import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">FinanceFlo</h3>
            <p className="text-sm leading-relaxed">
              ERP & software reseller, AI consulting studio, and the team behind CapLiquify FP&A and the ApexDeliver deal workspace. One partner for Sage Intacct, Odoo, Microsoft, NetSuite, and AI-powered revenue execution.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <a href="tel:+447360539147" className="hover:text-white transition-colors">
                  +44 7360 539147
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">✉️</span>
                <a href="mailto:hello@financeflo.ai" className="hover:text-white transition-colors">
                  hello@financeflo.ai
                </a>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/erp/sage-intacct" className="hover:text-white transition-colors">
                  ERP Implementation & Resell
                </Link>
              </li>
              <li>
                <Link to="/ai-enhancement/sage-intacct" className="hover:text-white transition-colors">
                  AI Consulting & Copilots
                </Link>
              </li>
              <li>
                <Link to="/implementation/sage-intacct" className="hover:text-white transition-colors">
                  Integration & iPaaS Studio
                </Link>
              </li>
              <li>
                <Link to="/pricing/services" className="hover:text-white transition-colors">
                  Managed Support & Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Software Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Software</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/capliquify-fpa" className="hover:text-white transition-colors">
                  CapLiquify FP&A Control Tower
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  ApexDeliver Deal Cloud
                </Link>
              </li>
              <li>
                <Link to="/sales-promotion-pricing" className="hover:text-white transition-colors">
                  Sales & Promotion Pricing Studio
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition-colors">
                  Security & Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition-colors">
                  Security Overview
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} FinanceFlo Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
