export const ComparisonTable: React.FC = () => {
  const features = [
    { name: 'Annual Cost (per user)', apex: '£3,348', traditional: '£10,000+', savings: '70%' },
    { name: 'Setup Time', apex: '5 minutes', traditional: '2-4 weeks', savings: '99%' },
    { name: 'AI-Powered Financial Analysis', apex: true, traditional: false },
    { name: 'Deal Pipeline Management', apex: true, traditional: true },
    { name: 'Multi-Method Valuation Suite', apex: true, traditional: 'Limited' },
    { name: 'Automated Document Generation', apex: true, traditional: false },
    { name: 'AI Deal Matching', apex: true, traditional: false },
    { name: 'Secure Document Room', apex: true, traditional: true },
    { name: 'Real-time Collaboration', apex: true, traditional: 'Limited' },
    { name: 'Mobile App', apex: 'Coming Soon', traditional: false },
    { name: 'API Access', apex: true, traditional: 'Extra Cost' },
    { name: 'Accounting Integration', apex: '4+ platforms', traditional: '1-2 platforms' },
    { name: 'Customer Support', apex: '24/7 Chat & Email', traditional: 'Business Hours' },
    { name: 'Training Required', apex: 'No', traditional: 'Yes (2-4 weeks)' },
    { name: 'Minimum Contract', apex: 'Monthly', traditional: 'Annual' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How We Compare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why leading M&A professionals are switching to ApexDeliver
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Feature</h3>
            </div>
            <div className="p-6 bg-blue-600/30 border-l-2 border-yellow-400">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">ApexDeliver</h3>
                <span className="px-3 py-1 bg-yellow-400 text-indigo-900 text-xs font-bold rounded-full">
                  BEST VALUE
                </span>
              </div>
            </div>
            <div className="p-6 border-l border-white/20">
              <h3 className="text-lg font-semibold">Traditional Platforms</h3>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                {/* Feature Name */}
                <div className="p-6 flex items-center">
                  <span className="font-medium text-gray-900">{feature.name}</span>
                  {feature.savings && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                      Save {feature.savings}
                    </span>
                  )}
                </div>

                {/* ApexDeliver */}
                <div className="p-6 bg-blue-50/50 border-l-2 border-blue-200 flex items-center">
                  {typeof feature.apex === 'boolean' ? (
                    feature.apex ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Included</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>Not Available</span>
                      </div>
                    )
                  ) : (
                    <span className="font-semibold text-blue-600">{feature.apex}</span>
                  )}
                </div>

                {/* Traditional */}
                <div className="p-6 border-l border-gray-200 flex items-center">
                  {typeof feature.traditional === 'boolean' ? (
                    feature.traditional ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Included</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Not Included</span>
                      </div>
                    )
                  ) : (
                    <span className="text-gray-700">{feature.traditional}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer - CTA */}
          <div className="grid grid-cols-3 bg-gray-50 border-t-2 border-gray-200">
            <div className="p-6"></div>
            <div className="p-6 bg-blue-50 border-l-2 border-blue-200">
              <a
                href="/sign-up"
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Free Trial
              </a>
            </div>
            <div className="p-6 border-l border-gray-200">
              <div className="text-center text-gray-500 text-sm">
                <div className="font-semibold text-gray-700 mb-1">Starting at</div>
                <div className="text-2xl font-bold text-gray-900">£10,000+</div>
                <div className="text-xs">per user/year</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Long-Term Contracts</h3>
            <p className="text-gray-600">Cancel anytime, no questions asked. Monthly billing with no hidden fees.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Free Updates Forever</h3>
            <p className="text-gray-600">All new features and improvements included at no extra cost.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Get help whenever you need it with our dedicated support team.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

