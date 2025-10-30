/**
 * Sticky CTA Bar Component
 * Conversion optimization: Persistent call-to-action that appears on scroll
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { trackCtaClick, trackMarketingEvent } from '../../lib/analytics'

export const StickyCTABar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the bar in this session
    const dismissed = sessionStorage.getItem('stickyCTADismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      // Show bar after scrolling down 80% of the page (less aggressive)
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercentage > 80) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('stickyCTADismissed', 'true')
    trackMarketingEvent('sticky_cta_dismissed', { location: 'sticky-cta-bar' })
  }

  // Don't render if dismissed
  if (isDismissed) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 shadow-2xl border-t border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Message */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/10 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg md:text-xl truncate">
                  Start Your 14-Day Free Trial Today
                </h3>
                <p className="text-blue-100 text-sm hidden md:block">
                  Join 500+ M&A professionals • No credit card required
                </p>
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/sign-up">
                <Button
                  variant="secondary"
                  btnSize="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg whitespace-nowrap"
                  onClick={() => trackCtaClick('get-started', 'sticky-cta-bar')}
                >
                  Get Started →
                </Button>
              </Link>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
