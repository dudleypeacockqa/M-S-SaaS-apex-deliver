import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackCtaClick } from '../../lib/analytics';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

export const MarketingNav: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      label: 'Products',
      dropdown: [
        {
          label: 'CapLiquify FP&A',
          href: '/capliquify-fpa',
          description: '13-week cash forecasting & working capital management',
        },
        {
          label: 'Sales & Promotion Pricing',
          href: '/sales-promotion-pricing',
          description: 'Dynamic pricing engine + customer portals',
        },
        {
          label: 'ApexDeliver Professional',
          href: '/pricing',
          description: 'Full M&A deal management platform',
        },
        {
          label: 'ApexDeliver Enterprise',
          href: '/pricing',
          description: 'Multi-entity portfolio management',
        },
      ],
    },
    {
      label: 'Solutions',
      dropdown: [
        {
          label: '4-Stage M&A Cycle',
          href: '/4-stage-cycle',
          description: 'Evaluation → Pre-Deal → Post-Deal → Ongoing Ops',
        },
        {
          label: 'Features',
          href: '/features',
          description: 'Complete platform capabilities',
        },
        {
          label: 'Security',
          href: '/security',
          description: 'Enterprise-grade security & compliance',
        },
      ],
    },
    {
      label: 'Resources',
      dropdown: [
        {
          label: 'Blog',
          href: '/blog',
          description: 'M&A insights and best practices',
        },
        {
          label: 'Podcast',
          href: '/podcast',
          description: '100 Days and Beyond',
        },
        {
          label: 'FAQ',
          href: '/faq',
          description: 'Common questions answered',
        },
      ],
    },
    {
      label: 'Company',
      dropdown: [
        {
          label: 'About Us',
          href: '/about',
          description: 'Our mission and story',
        },
        {
          label: 'Team',
          href: '/team',
          description: 'Meet the experts',
        },
        {
          label: 'Contact',
          href: '/contact',
          description: 'Get in touch',
        },
      ],
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
  ];

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" aria-label="ApexDeliver home">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                ApexDeliver
              </span>
              <span className="text-sm font-semibold text-emerald-600">+ CapLiquify</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-gray-700 hover:text-indigo-900 font-medium transition-colors rounded-md hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-indigo-900 font-medium transition-colors rounded-md hover:bg-gray-50 flex items-center gap-1"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        to={dropdownItem.href}
                        className="block px-4 py-3 hover:bg-indigo-50 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{dropdownItem.label}</div>
                        {dropdownItem.description && (
                          <div className="text-sm text-gray-600">{dropdownItem.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center space-x-4">
            <Link
              to="/sign-in"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
              onClick={() => trackCtaClick('sign-in', 'marketing-nav')}
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              onClick={() => trackCtaClick('get-started', 'marketing-nav')}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
