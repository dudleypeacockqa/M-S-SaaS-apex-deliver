// Performance monitoring component for production insights
import React, { useEffect } from 'react';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performance';

interface PerformanceMonitorProps {
  children: React.ReactNode;
  componentName?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  children, 
  componentName = 'Component' 
}) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log performance metrics for components that take longer than 16ms (60fps threshold)
      if (duration > 16) {
        logger.performanceLog(`${componentName} mount/unmount`, duration, {
          componentName,
          timestamp: new Date().toISOString(),
        });
      }
    };
  }, [componentName]);

  // Monitor for memory leaks in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        logger.debug(`${componentName} memory usage`, {
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        });
      }
    }
  }, [componentName]);

  return <>{children}</>;
};

// Higher-order component for easy performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const PerformanceWrappedComponent = (props: P) => {
    return (
      <PerformanceMonitor componentName={componentName || WrappedComponent.name}>
        <WrappedComponent {...props} />
      </PerformanceMonitor>
    );
  };

  PerformanceWrappedComponent.displayName = `withPerformanceMonitoring(${componentName || WrappedComponent.name})`;
  
  return PerformanceWrappedComponent;
};

export default PerformanceMonitor;