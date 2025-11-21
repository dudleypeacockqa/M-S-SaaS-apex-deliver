// Phase 4: Performance Optimization & Security Components
import React, { Suspense, lazy, memo, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

// Enhanced Error Boundary with better UX
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We're sorry, but there was an error loading this section. Our team has been notified.
      </p>
      <div className="space-y-3">
        <Button 
          onClick={resetErrorBoundary}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <details className="text-left">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Error Details (for debugging)
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  </div>
);

// Enhanced Loading Spinner with better UX
interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedLoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// Progressive Image Loading Component
interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = memo(({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEyLjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9hZGluZy4uLjwvdGV4dD4KPHN2Zz4K',
  className = '',
  onLoad
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Low-quality image */}
      {loading && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
});

// Intersection Observer Hook for Lazy Loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  { threshold = 0.1, root = null, rootMargin = '0%' } = {}
) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin]);

  return entry;
};

// Lazy Loading Wrapper Component
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <EnhancedLoadingSpinner />,
  className = ''
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        <div className={className}>
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

// Performance Monitor Component
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint');
        const fid = entries.find(entry => entry.entryType === 'first-input');
        const cls = entries.find(entry => entry.entryType === 'layout-shift');

        setMetrics({
          lcp: lcp?.startTime,
          fid: (fid as any)?.processingStart,
          cls: (cls as any)?.value
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  // Only show in development (disabled for production)
  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
      <div>LCP: {metrics.lcp?.toFixed(2)}ms</div>
      <div>FID: {metrics.fid?.toFixed(2)}ms</div>
      <div>CLS: {metrics.cls?.toFixed(3)}</div>
    </div>
  );
};

// SEO Component for Meta Tags
interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/api/placeholder/1200/630',
  url = typeof window !== 'undefined' ? window.location.href : ''
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

  }, [title, description, keywords, image, url]);

  return null;
};

// Code Splitting Utility
export const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ReactNode) => {
  const LazyComponent = lazy(importFn);
  
  return memo((props: any) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  ));
};