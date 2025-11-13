import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { trackCtaClick, trackMarketingEvent } from '../../lib/analytics'

/**
 * Sticky call-to-action bar that slides up when the visitor has consumed ~80% of the page.
 * The bar can be dismissed for the duration of the session.
 */
export const StickyCTABar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Respect a dismissed bar for the current session
    if (sessionStorage.getItem('stickyCTADismissed')) {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      const { scrollHeight } = document.documentElement
      const offset = scrollHeight - window.innerHeight
      const progress = offset <= 0 ? 0 : (window.scrollY / offset) * 100
      setIsVisible(progress > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('stickyCTADismissed', 'true')
    setIsDismissed(true)
    trackMarketingEvent('sticky_cta_dismissed', { location: 'sticky-cta-bar' })
  }

  if (isDismissed) {
    return null
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 shadow-2xl border-t border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/10 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg md:text-xl truncate" role="heading" aria-level={2}>
                  Start Your 14-Day Free Trial Today
                </p>
                <p className="text-blue-100 text-sm hidden md:block">Join 500+ M&A professionals · No credit card required</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/sign-up"
                className="inline-flex"
                onClick={() => trackCtaClick('get-started', 'sticky-cta-bar')}
              >
                <button
                  type="button"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg whitespace-nowrap inline-flex items-center justify-center h-12 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started →
                </button>
              </Link>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyCTABar
