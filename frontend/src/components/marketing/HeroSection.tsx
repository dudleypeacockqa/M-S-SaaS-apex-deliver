import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            M&A Intelligence Platform for Every Dealmaker
          </h1>

          {/* Subheadline - Value Proposition */}
          <p className="text-xl sm:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Professional-grade M&A tools starting at <span className="font-bold text-yellow-300">£279/month</span>
            {' '}—70% less than enterprise platforms. AI-powered intelligence, deal flow management, and financial analysis in one integrated ecosystem.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/sign-up"
              className="w-full sm:w-auto bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-indigo-200 text-sm">
            <p>Trusted by M&A professionals worldwide • GDPR Compliant • Bank-grade Security</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
};
