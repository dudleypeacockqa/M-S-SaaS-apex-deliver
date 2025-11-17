/**
 * Feature Not Available Page
 * Displayed when users try to access feature-flagged routes that are disabled
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from '@/lib/icons'

interface FeatureNotAvailableProps {
  featureName?: string
  message?: string
}

export const FeatureNotAvailable: React.FC<FeatureNotAvailableProps> = ({
  featureName = 'This feature',
  message = 'This feature is currently not available in this environment.',
}) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-yellow-100 p-3">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {featureName} Not Available
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            If you believe this feature should be available, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeatureNotAvailable
