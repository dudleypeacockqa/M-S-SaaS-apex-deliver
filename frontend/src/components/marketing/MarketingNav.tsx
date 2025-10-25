import { Link } from 'react-router-dom';

export const MarketingNav: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-900">ApexDeliver</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center space-x-4">
            <Link
              to="/sign-in"
              className="text-gray-700 hover:text-indigo-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="bg-indigo-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
