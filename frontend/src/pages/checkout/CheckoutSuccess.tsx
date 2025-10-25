import { Link } from 'react-router-dom';

export const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-6">
            <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Success! Your subscription is activated
          </h2>
          <p className="mt-4 text-lg text-gray-600">Thank you for subscribing to our platform!</p>
          <p className="mt-2 text-gray-600">
            A confirmation email has been sent to your email address with all the details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/dashboard/billing" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            View Billing Dashboard
          </Link>
          <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
