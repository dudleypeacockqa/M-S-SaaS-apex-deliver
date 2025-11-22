import React, { useState, useEffect } from 'react';
import { trackCtaClick } from '../../lib/analytics';
import { subscribeToNewsletter } from '../../services/newsletterService';

interface OptInPopupProps {
  delayMs?: number;
}

export const OptInPopup: React.FC<OptInPopupProps> = ({ delayMs = 90_000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldForceInstant =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('optin') === 'instant';
  const effectiveDelay = shouldForceInstant ? 0 : delayMs;

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const hasSeenPopup = localStorage.getItem('100days_optin_seen');
    if (hasSeenPopup) return;

    if (effectiveDelay <= 0) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, effectiveDelay);

    return () => clearTimeout(timer);
  }, [effectiveDelay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await subscribeToNewsletter({ email, source: 'popup' });

      trackCtaClick('email-optin', 'popup');
      setSubmitted(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error('Failed to subscribe:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('100days_optin_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" data-testid="optin-popup">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h3>
            <p className="text-gray-600">
              Check your inbox for exclusive M&A insights and strategies.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Expert M&A Insights
              </h3>
              <p className="text-gray-600">
                Join 1,000+ dealmakers receiving exclusive strategies, case studies, and industry trends delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing…' : 'Get Free Insights'}
              </button>
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
