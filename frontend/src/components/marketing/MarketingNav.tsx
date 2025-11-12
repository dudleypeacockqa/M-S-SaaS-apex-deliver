import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { trackCtaClick } from '../../lib/analytics'

interface DropdownItem {
  label: string
  href: string
  description?: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: DropdownItem[]
}

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
      { label: 'Case Studies', href: '/case-studies', description: 'Customer success stories' },
      { label: 'Blog', href: '/blog', description: 'M&A insights and best practices' },
      { label: 'Podcast', href: '/podcast', description: '100 Days and Beyond' },
      { label: 'FAQ', href: '/faq', description: 'Common questions answered' },
    ],
  },
  {
    label: 'Company',
    dropdown: [
      { label: 'About Us', href: '/about', description: 'Our mission and story' },
      { label: 'Team', href: '/team', description: 'Meet the experts' },
      { label: 'Contact', href: '/contact', description: 'Get in touch' },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
]

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isDesktop
}

export const MarketingNav: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isDesktop = useIsDesktop()

  const handleMouseEnter = (label: string) => {
    if (!isDesktop) return
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    if (!isDesktop) return
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleDropdownLeave = () => setOpenDropdown(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
        setMobileDropdown(null)
        setMobileMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setMobileDropdown(null)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        const focusable = mobileMenuRef.current?.querySelector<HTMLElement>('button, a')
        focusable?.focus()
      })
    } else {
      document.body.style.overflow = ''
      setMobileDropdown(null)
      lastFocusedRef.current?.focus?.()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((current) => (current === label ? null : label))
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" aria-label="Primary" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" aria-label="ApexDeliver home">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                ApexDeliver
              </span>
              <span className="text-sm font-semibold text-emerald-700">+ CapLiquify</span>
            </Link>
          </div>

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
                    className="px-4 py-2 text-gray-700 hover:text-indigo-900 font-medium transition-colors rounded-md hover:bg-gray-50 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
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

                {item.dropdown && openDropdown === item.label && isDesktop && (
                  <div
                    className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={`${dropdownItem.href}-${dropdownItem.label}`}
                        to={dropdownItem.href}
                        className="block px-4 py-3 hover:bg-indigo-50 transition-colors"
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

          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-nav"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/sign-in"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
              onClick={() => trackCtaClick('sign-in', 'marketing-nav')}
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-md font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
              onClick={() => trackCtaClick('get-started', 'marketing-nav')}
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        <div
          id="mobile-primary-nav"
          ref={mobileMenuRef}
          className={`lg:hidden border-t border-gray-200 transition-all duration-300 origin-top ${
            mobileMenuOpen ? 'max-h-[1200px] opacity-100 scale-y-100 py-4' : 'max-h-0 opacity-0 scale-y-95 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            {navItems.map((item) => (
              <div key={item.label} className="px-4 py-2">
                {item.href ? (
                  <Link
                    to={item.href}
                    className="block py-2 text-gray-700 hover:text-indigo-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className="w-full text-left py-2 text-gray-700 hover:text-indigo-900 font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-expanded={mobileDropdown === item.label}
                      aria-controls={`mobile-dropdown-${item.label}`}
                      onClick={() => toggleMobileDropdown(item.label)}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileDropdown === item.label ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {item.dropdown && (
                      <div
                        id={`mobile-dropdown-${item.label}`}
                        className={`pl-4 mt-2 space-y-2 transition-all duration-200 ${
                          mobileDropdown === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={`${dropdownItem.href}-${dropdownItem.label}`}
                            to={dropdownItem.href}
                            className="block py-2 text-sm text-gray-600 hover:text-indigo-900"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileDropdown(null)
                            }}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="px-4 py-4 space-y-2 border-t border-gray-200 mt-4">
              <Link
                to="/sign-in"
                className="block w-full text-center py-2 text-gray-700 hover:text-indigo-900 font-medium"
                onClick={() => {
                  setMobileMenuOpen(false)
                  trackCtaClick('sign-in', 'mobile-nav')
                }}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="block w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-md font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
                onClick={() => {
                  setMobileMenuOpen(false)
                  trackCtaClick('get-started', 'mobile-nav')
                }}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
