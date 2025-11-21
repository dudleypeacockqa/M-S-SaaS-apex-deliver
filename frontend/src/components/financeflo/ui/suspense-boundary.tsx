import React, { Suspense, ReactNode } from 'react';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Enhanced Suspense boundary with a stylish loading fallback
 */
export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  const defaultFallback = (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-teal-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 opacity-25"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 border-r-transparent border-b-teal-500 border-l-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}

/**
 * Lightweight Suspense boundary for smaller components
 */
export function LightSuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  const defaultFallback = (
    <div className="w-full py-8 flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-200 opacity-25"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-t-blue-600 border-r-transparent border-b-teal-500 border-l-transparent animate-spin"></div>
      </div>
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}

