import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const EnhancedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dealCount, setDealCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate counters
    const dealInterval = setInterval(() => {
      setDealCount(prev => {
        if (prev < 847) return prev + 17;
        clearInterval(dealInterval);
        return 847;
      });
    }, 30);

    const userInterval = setInterval(() => {
      setUserCount(prev => {
        if (prev < 500) return prev + 10;
        clearInterval(userInterval);
        return 500;
      });
    }, 30);

    return () => {
      clearInterval(dealInterval);
      clearInterval(userInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'drift 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-400/30">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted by 500+ M&A Professionals
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Close Deals
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mt-2">
                70% Faster
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              The only M&A platform that combines <span className="font-bold text-white">AI-powered intelligence</span>, deal flow management, and financial analysis—starting at just <span className="font-bold text-yellow-300">£279/month</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/sign-up"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
              >
                <span className="relative z-10 flex items-center">
                  Start Free 14-Day Trial
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-blue-200 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Stats */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{dealCount}+</div>
                  <div className="text-blue-200 text-sm">Active Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userCount}+</div>
                  <div className="text-blue-200 text-sm">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">£50B+</div>
                  <div className="text-blue-200 text-sm">Deal Value</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">40%</div>
                  <div className="text-blue-200 text-sm">Faster Closing</div>
                </div>
              </div>

              {/* Mini Dashboard Preview */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between text-white mb-4">
                  <h3 className="font-semibold">Deal Pipeline</h3>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['Sourcing', 'Qualifying', 'Due Diligence', 'Closing'].map((stage, index) => (
                    <div key={stage} className="bg-white/20 rounded p-2 text-center">
                      <div className="text-xs text-blue-100 mb-1">{stage}</div>
                      <div className="text-lg font-bold">{[12, 8, 5, 3][index]}</div>
                      <div className="text-xs text-blue-200">£{[45.2, 82.5, 124.3, 95.7][index]}M</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-4 space-y-2">
                {['TechCo Acquisition - £45.2M', 'RetailX Merger - £23.8M', 'FinServ Deal - £67.1M'].map((deal, index) => (
                  <div key={deal} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm">{deal.split(' - ')[0]}</div>
                      <div className="text-blue-200 text-xs">{deal.split(' - ')[1]}</div>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${
                            i < [4, 3, 5][index] ? 'bg-green-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
              70% Less Expensive
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-60px); }
        }
      `}</style>
    </section>
  );
};

