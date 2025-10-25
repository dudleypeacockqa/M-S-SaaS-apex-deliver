import { Link } from 'react-router-dom';

export const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6">
            <svg className="h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">Checkout Canceled</h2>
          <p className="mt-4 text-lg text-gray-600">You didn't complete the checkout process.</p>
          <p className="mt-2 text-gray-600">
            No charges have been made to your account. You can return to the pricing page whenever you're ready to subscribe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/pricing" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            View Pricing Again
          </Link>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
