import React from 'react';
import { MarketingLayout } from '../../components/layouts/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export const BookTrial: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Redirect to sign-in if not authenticated
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/sign-in?redirect_url=/book-trial" replace />;
  }

  return (
    <MarketingLayout>
      <SEO
        title="Book Your Free Trial | ApexDeliver + CapLiquify"
        description="Schedule a requirements planning session to get started with your 14-day free trial of ApexDeliver + CapLiquify"
        keywords="M&A software trial, book demo, schedule consultation"
        ogTitle="Book Your Free Trial - ApexDeliver"
        ogDescription="Schedule your requirements planning session and start your 14-day free trial"
        ogUrl="https://100daysandbeyond.com/book-trial"
        canonical="https://100daysandbeyond.com/book-trial"
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold text-sm">
                ✓ Account Created Successfully
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Welcome to ApexDeliver + CapLiquify!
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              You're one step away from transforming your M&A and financial operations. 
              Schedule a 60-minute requirements planning session to kick off your personalized MVP trial.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Requirements Discovery</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          We'll discuss your M&A workflow, pain points, and specific needs
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Platform Walkthrough</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Live demo of CapLiquify FP&A and ApexDeliver M&A features
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">MVP Trial Setup</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          We'll configure your trial environment with the features you need
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Hands-On Training</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Get started with guided onboarding and support resources
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border-2 border-emerald-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    14-Day Free Trial Included
                  </h3>
                  <p className="text-sm text-gray-700">
                    After our session, you'll get full access to your customized trial environment. 
                    No credit card required during the trial period.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions before booking? We're here to help.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                  >
                    Contact Support →
                  </a>
                </div>
              </div>

              {/* Right Column - Calendar Embed */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                      Schedule Your Requirements Planning Session
                    </h2>
                    <p className="text-indigo-100 mt-1">
                      60-minute meeting with Dudley Peacock
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="relative" style={{ paddingBottom: '87.5%', height: 0 }}>
                      <iframe 
                        src="https://book.vimcal.com/p/dudleypeacock/requirements-planning-60-min-meet" 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '0.5rem'
                        }}
                        title="Book Trial Meeting"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">Can't find a suitable time?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Email us at <a href="mailto:dudley@apexdeliver.com" className="underline font-medium">dudley@apexdeliver.com</a> and we'll arrange a custom time that works for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};

export default BookTrial;
