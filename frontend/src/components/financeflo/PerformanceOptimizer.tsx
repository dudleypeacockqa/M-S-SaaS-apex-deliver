import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableLazyLoading?: boolean;
  enableImageOptimization?: boolean;
  enableCriticalCSS?: boolean;
  enablePreloading?: boolean;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableLazyLoading = true,
  enableImageOptimization = true,
  enableCriticalCSS = true,
  enablePreloading = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    loadTime: number;
    renderTime: number;
  } | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    // Set loading timeout - maximum 3 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    // Measure performance with faster completion
    const measurePerformance = () => {
      const loadTime = performance.now() - startTime;
      const renderTime = performance.now();
      
      setPerformanceMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime)
      });
      
      clearTimeout(loadingTimeout);
      setIsLoaded(true);
    };

    // Complete loading much faster - 100ms max
    const quickLoad = setTimeout(measurePerformance, 100);

    // Defer non-critical optimizations
    setTimeout(() => {
      // Optimize images with lazy loading (non-blocking)
      if (enableImageOptimization) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach((img) => imageObserver.observe(img));
      }

      // Preload critical resources (non-blocking)
      // Disabled: removed missing resource preloads to prevent 404 errors
      // if (enablePreloading) {
      //   const criticalResources = [
      //     '/fonts/inter-var.woff2',
      //     '/images/hero-bg.webp'
      //   ];
      //
      //   criticalResources.forEach((resource) => {
      //     const link = document.createElement('link');
      //     link.rel = 'preload';
      //     link.href = resource;
      //
      //     if (resource.includes('.woff2')) {
      //       link.as = 'font';
      //       link.type = 'font/woff2';
      //       link.crossOrigin = 'anonymous';
      //     } else if (resource.includes('.webp') || resource.includes('.jpg') || resource.includes('.png')) {
      //       link.as = 'image';
      //     }
      //
      //     document.head.appendChild(link);
      //   });
      // }
    }, 0);

    // Cleanup function
    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(quickLoad);
    };
  }, [enableImageOptimization, enablePreloading, enableCriticalCSS]);

  // Resource hints component
  const ResourceHints = () => (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

      {/* Preconnect to critical external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Preload critical resources - disabled to prevent 404 errors */}
      {/* <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> */}
      {/* <link rel="preload" href="/images/hero-bg.webp" as="image" /> */}
    </>
  );

  // Loading component with performance metrics
  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoaded ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      style={{ pointerEvents: isLoaded ? 'none' : 'auto' }}
    >
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Optimizing experience...</p>
        {performanceMetrics && (
          <p className="text-xs text-gray-400 mt-2">
            Load time: {performanceMetrics.loadTime}ms
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <ResourceHints />
      {!isLoaded && <LoadingIndicator />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

// Lazy loading hook for components
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, threshold]);

  return [setRef, isVisible] as const;
};

// Image optimization component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}> = ({ src, alt, className, width, height, priority = false }) => {
  const [setRef, isVisible] = useLazyLoading();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={setRef} className={`relative overflow-hidden ${className}`}>
      {(isVisible || priority) && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizer;

