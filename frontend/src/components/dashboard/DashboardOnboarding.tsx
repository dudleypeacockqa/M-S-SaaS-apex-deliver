import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

export const DashboardOnboarding: React.FC = () => {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to 100 Days & Beyond</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You're all set to start your first deal. Use the platform to manage valuations, documents, and tasks in one place.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 transition hover:shadow-md">
          <div className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
            <span className="p-1 bg-blue-100 rounded">VS</span> Valuation Suite
          </div>
          <p className="text-sm text-gray-600">
            Run DCF, Comparables, and Precedent Transactions analysis with AI insights.
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 transition hover:shadow-md">
          <div className="text-purple-600 font-semibold mb-2 flex items-center gap-2">
            <span className="p-1 bg-purple-100 rounded">FI</span> Financial Intel
          </div>
          <p className="text-sm text-gray-600">
            Track 47+ financial ratios and generate lender-ready reports automatically.
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 transition hover:shadow-md">
          <div className="text-emerald-600 font-semibold mb-2 flex items-center gap-2">
            <span className="p-1 bg-emerald-100 rounded">DR</span> Data Room
          </div>
          <p className="text-sm text-gray-600">
            Securely store and share sensitive deal documents with granular permissions.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-8">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs">1</span>
          Quick Start Guide
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-3 items-start">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Create Deal:</strong> Click the button below to initialize your workspace.</p>
            </div>
            <div className="flex gap-3 items-start">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Upload Data:</strong> Add financials and CIMs to the data room.</p>
            </div>
            <div className="flex gap-3 items-start">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Analyze:</strong> View automated valuation and ratio outputs.</p>
            </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/deals/new">
          <Button variant="primary" btnSize="lg" className="px-12 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">
            Create Your First Deal
          </Button>
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Need help? <a href="/docs" className="text-indigo-600 hover:underline">Read the documentation</a>
        </p>
      </div>
    </div>
  )
}

