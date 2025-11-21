import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

export const BrandedLoader: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
          <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 9L14 14L10 10L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        100 Days & Beyond
      </h1>
      <p className="text-slate-400 text-sm font-medium mb-8">
        Preparing your workspace...
      </p>

      <LoadingSpinner size="lg" className="text-emerald-500" />
    </div>
  )
}

