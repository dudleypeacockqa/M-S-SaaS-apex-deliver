/**
 * Exit-Intent Popup Component
 * Conversion optimization: Capture leaving visitors with compelling offer
 */

import React, { useState, useEffect } from 'react'
import { Button, Badge } from '../ui'

export const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('exitIntentShown')
    if (hasSeenPopup) return

    // Delay detection by 2 seconds to avoid false positives on page load
    const startDelay = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        // Detect mouse leaving toward top of viewport (browser chrome)
        if (e.clientY <= 0 && !isVisible) {
          setIsVisible(true)
          sessionStorage.setItem('exitIntentShown', 'true')
        }
      }

      document.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
        clearTimeout(startDelay)
      }
    }, 2000)

    return () => clearTimeout(startDelay)
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Integrate with email service (Mailchimp, SendGrid, etc.)
    console.log('Email captured:', email)

    setIsSubmitted(true)

    // Auto-redirect to sign-up after 2 seconds
    setTimeout(() => {
      window.location.href = '/sign-up'
    }, 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <Badge variant="warning" className="text-base px-4 py-2">
                ⚡ Limited Time Offer
              </Badge>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
              Wait! Don't Miss Out on
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-2">
                70% Faster Deal Closures
              </span>
            </h2>

            {/* Value Proposition */}
            <p className="text-lg text-gray-600 text-center mb-8 max-w-xl mx-auto">
              Join 500+ M&A professionals using ApexDeliver to close deals faster,
              automate workflows, and maximize ROI. <span className="font-bold text-gray-900">Starting at just £279/month.</span>
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: '🚀', text: '70% faster closures' },
                { icon: '🤖', text: 'AI-powered insights' },
                { icon: '💰', text: 'Save £9,721/year' },
                { icon: '✅', text: 'No credit card required' },
              ].map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
                  <span className="text-2xl">{benefit.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  btnSize="lg"
                  fullWidth
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg"
                >
                  Start Free 14-Day Trial →
                </Button>

                <Button
                  type="button"
                  onClick={handleClose}
                  variant="ghost"
                  btnSize="lg"
                  className="sm:w-auto"
                >
                  Just Browsing
                </Button>
              </div>
            </form>

            {/* Trust Indicators */}
            <p className="text-sm text-gray-500 text-center mt-6">
              ✓ No credit card required  •  ✓ 5-minute setup  •  ✓ Cancel anytime
            </p>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect! You're All Set 🎉</h3>
            <p className="text-lg text-gray-600 mb-6">
              Redirecting you to start your 14-day free trial...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExitIntentPopup
