import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'financeflo_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'financeflo_cookie_preferences';

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true - cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!hasConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({ ...preferences, ...parsed });
          applyConsent(parsed);
        } catch (e) {
          console.error('Failed to parse cookie preferences', e);
        }
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Enable/disable Google Analytics based on consent
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }

    // Enable/disable marketing cookies based on consent
    if (prefs.marketing && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    applyConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectOptional = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" />

      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
        <div className="bg-white border-t-4 border-blue-600 shadow-2xl">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {!showSettings ? (
              // Main Banner View
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Your Privacy Matters
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        DIGITAL GROWTH EQUITY LTD (trading as FinanceFlo.ai) | Company No. 13816862
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    We use cookies to provide essential website functionality and, with your consent,
                    to analyze site performance and deliver personalized content. You can customize
                    your preferences or accept all cookies.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Strictly necessary cookies</strong> are always enabled to ensure the website functions properly.
                    <strong> Optional cookies</strong> (analytics and marketing) require your consent under UK PECR and GDPR regulations.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Accept All Cookies</span>
                  </button>

                  <button
                    onClick={handleRejectOptional}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Reject Optional Cookies
                  </button>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Customize</span>
                  </button>
                </div>

                <div className="text-xs text-gray-600 pt-2 border-t">
                  <p>
                    By clicking "Accept All Cookies", you agree to the storing of cookies on your device.
                    Learn more in our{' '}
                    <Link to="/cookies" className="text-blue-600 hover:underline font-medium">
                      Cookie Policy
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>
            ) : (
              // Settings View
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-7 w-7 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close settings"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Necessary Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-gray-900">Strictly Necessary Cookies</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          Always Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        These cookies are essential for the website to function. They enable core functionality
                        such as security, network management, and accessibility. You cannot opt-out of these cookies.
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Examples:</strong> Session management, security tokens, load balancing
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="h-5 w-5 text-blue-600 rounded cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">Performance & Analytics Cookies</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        These cookies help us understand how visitors interact with our website by collecting
                        and reporting information anonymously. This helps us improve our website performance.
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Examples:</strong> Google Analytics (GA4), page views, bounce rate, traffic sources
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">Marketing & Advertising Cookies</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        These cookies track your activity across websites to deliver more relevant advertising.
                        They may be set by our advertising partners to build a profile of your interests.
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Examples:</strong> Google Ads, LinkedIn Insight Tag, remarketing pixels
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Save My Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Accept All
                  </button>
                </div>

                <div className="text-xs text-gray-600 text-center">
                  <p>
                    Questions? See our{' '}
                    <Link to="/cookies" className="text-blue-600 hover:underline font-medium">
                      Cookie Policy
                    </Link>{' '}
                    for more information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to check if user has consented to specific cookie type
export const hasConsentFor = (type: 'analytics' | 'marketing'): boolean => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!consent) return false;

  const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (!preferences) return false;

  try {
    const parsed = JSON.parse(preferences);
    return parsed[type] === true;
  } catch {
    return false;
  }
};

// Helper function to revoke consent (for cookie settings page)
export const revokeConsent = () => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
  window.location.reload();
};

export default CookieConsentBanner;
